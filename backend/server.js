const express = require('express');
const cors = require('cors');
const path = require('path');
// Load environment variables from project root .env before loading config
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const { serverConfig, dbConfig } = require('./config');
const { testConnection, initDatabase, getAllItems, addItem, updateItem, deleteItem, getCategories } = require('./db');

const app = express();
const PORT = serverConfig.port;

// Middleware
app.use(cors());
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

// Inventory Routes (CRUD)
app.use('/api/inventory', require('./routes/inventoryRoutes'));

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
});

module.exports = app; 