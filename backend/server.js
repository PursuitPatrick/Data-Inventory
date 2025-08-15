const express = require('express');
const cors = require('cors');
const path = require('path');
// Load environment variables from project root .env before loading config
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const { serverConfig, dbConfig } = require('./config');
const { getAllInventory, getInventoryItem, updateInventoryItem, deleteInventoryItem, createInventoryItem } = require('./controllers/inventoryController');
const { loginUser } = require('./controllers/authController');
const { authenticateToken } = require('./middleware/authMiddleware');
const { testConnection, initDatabase, getAllItems, addItem, updateItem, deleteItem, getCategories } = require('./db');
const { syncAll, syncRecentOrders } = require('./services/shopifySyncService');

const app = express();
const PORT = serverConfig.port;

// Middleware
app.use(cors());
// Mount raw-body webhook route BEFORE json parser
app.use('/webhooks', require('./routes/shopifyWebhookRoutes'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Shopify routes (protected)
app.use('/shopify', require('./routes/shopifyRoutes'));

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

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📝 Test endpoint: http://localhost:${PORT}/test`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  console.log(`🗄️ Database test: http://localhost:${PORT}/db-test`);
  // Log non-sensitive env-driven config to confirm .env is loaded
  console.log(
    `Env loaded: PORT=${PORT}, NODE_ENV=${serverConfig.nodeEnv}, DB host=${dbConfig.host}, port=${dbConfig.port}, db=${dbConfig.database}, user=${dbConfig.user}`
  );
  
  // Test database connection and initialize tables
  try {
    console.log('🔌 Testing database connection...');
    const isConnected = await testConnection();
    
    if (isConnected) {
      console.log('📊 Initializing database tables...');
      await initDatabase();
      console.log('✅ Database setup complete!');
    } else {
      console.log('❌ Database connection failed. Please check your PostgreSQL setup.');
    }
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
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
});

module.exports = app; 