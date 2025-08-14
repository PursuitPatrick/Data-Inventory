const { getProducts, getInventoryLevels, getLocations } = require('./services/shopifyService');

async function testShopify() {
  console.log('Fetching products...');
  const products = await getProducts();
  console.log('Products:', products);

  console.log('\nFetching locations...');
  const locations = await getLocations();
  console.log('Locations:', locations);

  const firstLocationId = locations?.locations?.[0]?.id;
  if (firstLocationId) {
    console.log(`\nFetching inventory levels for location ${firstLocationId}...`);
    const levels = await getInventoryLevels({ location_ids: firstLocationId });
    console.log('Inventory Levels:', levels);
  } else {
    console.log('\nNo locations found; skipping inventory levels test.');
  }
}

testShopify();


