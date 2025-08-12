const { testConnection, initDatabase } = require('./db');

async function testDatabase() {
  console.log('🧪 Testing PostgreSQL Connection...\n');
  
  try {
    // Test connection
    console.log('1️⃣ Testing database connection...');
    const isConnected = await testConnection();
    
    if (isConnected) {
      console.log('\n2️⃣ Initializing database tables...');
      await initDatabase();
      console.log('\n✅ All tests passed! Database is ready.');
    } else {
      console.log('\n❌ Connection test failed.');
    }
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
  }
  
  // Exit after testing
  process.exit(0);
}

testDatabase(); 