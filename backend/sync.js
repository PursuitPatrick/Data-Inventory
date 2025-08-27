const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const { testConnection, initDatabase } = require('./db');
const { syncAll, syncProducts, syncInventoryLevels, syncLocations, syncRecentOrders } = require('./services/shopifySyncService');

async function main() {
  const cmd = (process.argv[2] || 'all').toLowerCase();

  console.log('Starting Shopify → Postgres sync');
  console.log(`Mode: ${cmd}`);

  const requiredEnv = ['SHOPIFY_STORE_DOMAIN', 'SHOPIFY_ACCESS_TOKEN', 'SHOPIFY_API_VERSION'];
  const missing = requiredEnv.filter((k) => !process.env[k]);
  if (missing.length) {
    console.warn(`Warning: missing env vars: ${missing.join(', ')}. Requests may fail.`);
  }

  try {
    console.log('Testing DB connection...');
    const ok = await testConnection();
    if (!ok) {
      throw new Error('Database connection failed');
    }

    console.log('Ensuring tables exist...');
    await initDatabase();

    let result;
    switch (cmd) {
      case 'products':
        result = await syncProducts();
        break;
      case 'locations':
        result = await syncLocations();
        break;
      case 'inventory-levels':
      case 'inventory_levels':
        result = await syncInventoryLevels();
        break;
      case 'orders':
        result = await syncRecentOrders();
        break;
      case 'all':
      default:
        result = await syncAll();
        break;
    }

    console.log('Sync complete:', JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Sync failed:', err.message || err);
    process.exit(1);
  }
}

main();


