const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const axios = require('axios');
// Load environment variables from project root .env before loading config
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const { serverConfig, dbConfig } = require('./config');
const { getAllInventory, getInventoryItem, updateInventoryItem, deleteInventoryItem, createInventoryItem } = require('./controllers/inventoryController');
const { loginUser } = require('./controllers/authController');
const { authenticateToken } = require('./middleware/authMiddleware');
const { pool, testConnection, initDatabase, getAllItems, addItem, updateItem, deleteItem, getCategories } = require('./db');
const { syncAll, syncRecentOrders } = require('./services/shopifySyncService');
const { pushAllLocalInventoryToShopify } = require('./services/inventoryPushService');
const cron = require('node-cron');

const app = express();
const PORT = serverConfig.port;

// Middleware
const allowedOrigins = [
  'https://magminventory.netlify.app',
  /^https:\/\/deploy-preview-\d+--magminventory\.netlify\.app$/
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    const ok = allowedOrigins.some((o) =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );
    return cb(ok ? null : new Error('CORS: origin not allowed'), ok);
  },
  credentials: true,
}));
app.use(cookieParser());
// Mount raw-body webhook route BEFORE json parser
app.use('/webhooks', require('./routes/shopifyWebhookRoutes'));
// Mount additional Shopify webhook endpoints at /api/* BEFORE json parser
app.use('/api', require('./routes/shopifyWebhookApiRoutes'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global no-cache headers
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Back Is Running' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Database connection test endpoint
app.get('/db-test', async (req, res) => {
  try {
    const isConnected = await testConnection();
    res.json({ 
      status: isConnected ? 'Connected' : 'Failed',
      message: isConnected ? 'Database connection successful' : 'Database connection failed'
    });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: error.message });
  }
});

// Simple diagnostics: recent products and orders + totals
app.get('/products-test', async (req, res) => {
  try {
    const [rowsResult, countResult] = await Promise.all([
      pool.query(`
        SELECT id, title, handle, updated_at
        FROM products
        ORDER BY updated_at DESC NULLS LAST
        LIMIT 5
      `),
      pool.query('SELECT COUNT(*)::int AS count FROM products'),
    ]);
    res.json({ total: countResult.rows[0].count, recent: rowsResult.rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/orders-test', async (req, res) => {
  try {
    const [rowsResult, countResult] = await Promise.all([
      pool.query(`
        SELECT id AS shopify_order_id, name, total_price, financial_status, created_at
        FROM orders
        ORDER BY created_at DESC NULLS LAST
        LIMIT 5
      `),
      pool.query('SELECT COUNT(*)::int AS count FROM orders'),
    ]);
    res.json({ total: countResult.rows[0].count, recent: rowsResult.rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'AI Inventory Tracker Backend API',
    version: '1.0.0',
    endpoints: {
      test: '/test',
      health: '/health',
      dbTest: '/db-test',
      inventory: '/api/inventory',
      categories: '/api/categories'
    }
  });
});

// Inventory routes are handled via the router

// Categories API endpoints
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Root-level login alias (POST /login)
app.post('/login', loginUser);

// Auth routes
app.use('/auth', require('./routes/authRoutes'));

// Inventory Routes (CRUD)
app.use('/api/inventory', require('./routes/inventoryRoutes'));

// Shopify routes
app.use('/api/shopify', require('./routes/shopifyRoutes'));

// Shopify inventory fetch (raw from Shopify)
app.use('/api', require('./routes/inventoryShopifyRoutes'));

// Shopify routes (protected)
app.use('/shopify', require('./routes/shopifyRoutes'));

// Minimal landing endpoints for eBay accepted/declined redirects (no UI)
app.get('/landing/ebay/success', (req, res) => {
  // Some eBay branded flows append ?code=... here. Forward to the OAuth callback.
  if (req.query && req.query.code) {
    const qs = new URLSearchParams(req.query).toString();
    return res.redirect(302, `/auth/ebay/callback?${qs}`);
  }
  res.status(204).end();
});
app.get('/landing/ebay/cancel', (req, res) => {
  res.status(204).end();
});

// eBay Notifications - GET: simple challenge echo (Option A)
app.get('/ebay/notifications', (req, res) => {
  try {
    const challengeCode = req.query.challenge_code || req.query.challengeCode || '';
    if (!challengeCode) {
      return res.status(400).json({ message: 'Missing challenge_code' });
    }
    try {
      console.log('🤝 eBay challenge received', { time: new Date().toISOString() });
    } catch (_) {}
    // Option A: return the challenge code in JSON
    return res.status(200).json({ challengeResponse: challengeCode });
  } catch (err) {
    console.error('❌ /ebay/notifications (GET) error:', err?.message || err);
    return res.status(500).json({ message: 'Internal error' });
  }
});

// eBay Notifications endpoint - responds to challenge and logs incoming messages
app.post('/ebay/notifications', async (req, res) => {
  try {
    const body = req.body || {};
    // eBay may send challengeCode (preferred) or challenge
    const challenge = body.challengeCode || body.challenge || body.challenge_code || '';

    // Log minimal info for monitoring (avoid logging sensitive payloads in production)
    try {
      console.log('📨 eBay notification received', {
        time: new Date().toISOString(),
        hasChallenge: Boolean(challenge),
        topic: body?.topic || body?.metadata?.topic || undefined,
      });
    } catch (_) {}

    if (challenge && typeof challenge === 'string') {
      // Persist challenge for diagnostics
      try {
        await pool.query(
          'INSERT INTO ebay_webhook_verifications (challenge_code, topic) VALUES ($1, $2)',
          [challenge, body?.topic || body?.metadata?.topic || null]
        );
      } catch (e) {
        console.warn('⚠️ Failed to save ebay verification challenge:', e?.message || e);
      }
      return res.status(200).type('text/plain').send(challenge);
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('❌ /ebay/notifications error:', err?.message || err);
    return res.status(500).json({ message: 'Internal error' });
  }
});

// eBay OAuth callback – exchanges code for tokens
app.get('/auth/ebay/callback', async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) {
      return res.status(400).send('Missing code');
    }
    const isSandbox = String(process.env.EBAY_ENV || 'sandbox').toLowerCase() !== 'production';
    const tokenUrl = isSandbox
      ? 'https://api.sandbox.ebay.com/identity/v1/oauth2/token'
      : 'https://api.ebay.com/identity/v1/oauth2/token';

    const clientId = process.env.EBAY_CLIENT_ID;
    const clientSecret = process.env.EBAY_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return res.status(500).send('EBAY client credentials not configured');
    }
    // For eBay branded flow, redirect_uri must be the RuName value used in authorize step
    const redirectParam = process.env.EBAY_RUNAME || process.env.EBAY_REDIRECT_URI;
    if (!redirectParam) {
      return res.status(500).send('EBAY_RUNAME or EBAY_REDIRECT_URI not configured');
    }

    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const params = new URLSearchParams();
    params.set('grant_type', 'authorization_code');
    params.set('code', code);
    params.set('redirect_uri', redirectParam);

    const { data } = await axios.post(tokenUrl, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${basic}`,
      },
    });

    // TODO: persist data.refresh_token and data.access_token per tenant (encrypted)
    // For now, show a simple success message without exposing full tokens
    res.status(200).send(
      'eBay connected successfully. You may close this window. (Tokens received)'
    );
  } catch (err) {
    console.error('eBay callback error:', err?.response?.data || err.message);
    const msg = err?.response?.data || { message: err?.message || 'Callback error' };
    res.status(500).json(msg);
  }
});

// Protected test route
app.get('/secure/ping', authenticateToken, (req, res) => {
  res.json({ ok: true, user: req.user });
});

// Optional root-level alias per request
app.get('/inventory', authenticateToken, getAllInventory);
app.post('/inventory', authenticateToken, createInventoryItem);
app.get('/inventory/:id', getInventoryItem);
app.put('/inventory/:id', updateInventoryItem);
app.delete('/inventory/:id', deleteInventoryItem);

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Centralized error handler
// - Returns 400 for malformed JSON or explicit validation errors (err.status = 400)
// - Returns provided err.status/message when available
// - Falls back to 500 for unexpected errors
app.use((err, req, res, next) => {
  // Malformed JSON from body parser
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON payload' });
  }

  const statusCode = Number.isInteger(err?.status) ? err.status : 500;
  const message = err?.message || 'Something went wrong!';

  // Log full error on server only
  console.error(err);
  res.status(statusCode).json({ message });
});

// Start server only after a successful DB connection
(async () => {
  // Log non-sensitive env-driven config to confirm .env is loaded
  console.log(`Env loaded: PORT=${PORT}, NODE_ENV=${serverConfig.nodeEnv}, DB host=${dbConfig.host}, port=${dbConfig.port}, db=${dbConfig.database}, user=${dbConfig.user}`);

  console.log('🔌 Testing database connection...');
  const isConnected = await testConnection();
  if (!isConnected) {
    console.error('❌ Database connection failed. Please check your PostgreSQL setup. Exiting.');
    process.exit(1);
  }

  try {
    console.log('📊 Initializing database tables...');
    await initDatabase();
    console.log('✅ Database setup complete!');
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    process.exit(1);
  }

  // Optional Shopify background sync loops (enable by setting SHOPIFY_SYNC_ENABLE=1)
  try {
    if (process.env.SHOPIFY_SYNC_ENABLE === '1') {
      const invMinutes = Number.parseInt(process.env.SHOPIFY_SYNC_INVENTORY_MINUTES || '10', 10);
      const prodMinutes = Number.parseInt(process.env.SHOPIFY_SYNC_PRODUCTS_MINUTES || '45', 10); // between 30-60
      const ordMinutes = Number.parseInt(process.env.SHOPIFY_SYNC_ORDERS_MINUTES || '3', 10); // between 1-5

      const startLoop = (label, fn, minutes) => {
        if (!Number.isFinite(minutes) || minutes <= 0) {
          console.warn(`⚠️ Invalid minutes for ${label} loop; not started`);
          return;
        }
        const run = async () => {
          try {
            console.log(`🔁 ${label} sync running...`);
            const result = await fn();
            console.log(`✅ ${label} sync done:`, JSON.stringify(result));
          } catch (e) {
            console.error(`❌ ${label} sync failed:`, e?.message || e);
          }
        };
        run();
        setInterval(run, minutes * 60 * 1000);
        console.log(`⏱️ ${label} sync every ${minutes} minute(s)`);
      };

      // Inventory every 10 minutes
      startLoop('Inventory', () => syncAll().then(r => ({ inventoryLevelsUpserted: r.inventoryLevelsUpserted })), invMinutes);
      // Products/catalog every 30-60 minutes (default 45)
      startLoop('Products', () => syncAll().then(r => ({ productsUpserted: r.productsUpserted })), prodMinutes);
      // Orders/fulfillment every 1-5 minutes (default 3)
      startLoop('Orders', () => syncRecentOrders(), ordMinutes);
    }
  } catch (err) {
    console.error('❌ Failed to start Shopify sync loop:', err?.message || err);
  }

  // Optional inventory push to Shopify every 5 minutes (enable with INVENTORY_PUSH_ENABLE=1)
  try {
    if (process.env.INVENTORY_PUSH_ENABLE === '1') {
      const cronExpr = process.env.INVENTORY_PUSH_CRON || '*/5 * * * *';
      cron.schedule(cronExpr, async () => {
        try {
          console.log('🔁 Inventory push running...');
          const result = await pushAllLocalInventoryToShopify();
          console.log('✅ Inventory push done:', JSON.stringify(result));
        } catch (e) {
          console.error('❌ Inventory push failed:', e?.message || e);
        }
      });
      console.log(`⏱️ Inventory push scheduled with cron: ${cronExpr}`);
    }
  } catch (err) {
    console.error('❌ Failed to schedule inventory push:', err?.message || err);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📝 Test endpoint: http://localhost:${PORT}/test`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
    console.log(`🗄️ Database test: http://localhost:${PORT}/db-test`);
  });
})();

module.exports = app; 