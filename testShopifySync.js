const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const { pool } = require('./backend/db');
const shopify = require('./backend/services/shopifyService');
const { syncAll } = require('./backend/services/shopifySyncService');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchAllInventoryByLatestPerItem() {
  const locData = await shopify.getLocations();
  const locations = Array.isArray(locData?.locations) ? locData.locations : [];
  const all = [];
  for (const loc of locations) {
    try {
      const data = await shopify.getInventoryLevels({ location_ids: String(loc.id), limit: 250 });
      const levels = Array.isArray(data?.inventory_levels) ? data.inventory_levels : [];
      all.push(...levels);
    } catch (_) {
      // ignore to continue
    }
  }
  // collapse by inventory_item_id keeping latest
  const latestByItem = new Map();
  for (const lvl of all) {
    const current = latestByItem.get(lvl.inventory_item_id);
    const incomingUpdatedAt = lvl.updated_at ? new Date(lvl.updated_at) : null;
    const currentUpdatedAt = current?.updated_at ? new Date(current.updated_at) : null;
    if (!current || (incomingUpdatedAt && (!currentUpdatedAt || incomingUpdatedAt > currentUpdatedAt))) {
      latestByItem.set(lvl.inventory_item_id, lvl);
    }
  }
  return { latestByItem, rawLevels: all };
}

async function main() {
  console.log('=== Shopify Sync Test ===');
  try {
    // 1) Fetch products
    const productsData = await shopify.getProducts();
    const products = Array.isArray(productsData?.products) ? productsData.products : [];
    console.log(`Products fetched: ${products.length}`);

    // 2) Fetch inventory (by location, aggregate to latest per item)
    const { latestByItem, rawLevels } = await fetchAllInventoryByLatestPerItem();
    console.log(`Inventory fetched: ${rawLevels.length} level records across locations`);
    console.log(`Inventory unique items (latest per item): ${latestByItem.size}`);

    // 3) Update a test item's quantity (+1 then -1)
    const anyLevel = rawLevels.find((l) => typeof l?.available === 'number' && l?.inventory_item_id && l?.location_id);
    if (!anyLevel) {
      console.log('No inventory level found to test adjustment; skipping update step.');
    } else {
      const { inventory_item_id, location_id } = anyLevel;
      console.log(`Adjusting inventory for item ${inventory_item_id} at location ${location_id} by +1 then -1`);
      try {
        await shopify.adjustInventoryLevel({ inventory_item_id, location_id, available_adjustment: 1 });
        await sleep(1500);
        await shopify.adjustInventoryLevel({ inventory_item_id, location_id, available_adjustment: -1 });
        console.log('Inventory adjustment test: SUCCESS (reverted)');
      } catch (e) {
        console.log('Inventory adjustment test: FAILED', e?.message || e);
      }
    }

    // 4) Sync all into PostgreSQL
    const syncResult = await syncAll();
    console.log('PostgreSQL updated via syncAll:', JSON.stringify(syncResult));

    // 5) Verify DB matches Shopify for a sample of items
    const sample = Array.from(latestByItem.values()).slice(0, 5);
    let matches = 0;
    let diffs = 0;
    for (const lvl of sample) {
      const res = await pool.query(
        'SELECT inventory_item_id, location_id, available FROM inventory_levels WHERE inventory_item_id = $1',
        [lvl.inventory_item_id]
      );
      const row = res.rows[0];
      const dbAvail = row?.available;
      const sfyAvail = lvl.available;
      const ok = Number(dbAvail) === Number(sfyAvail);
      console.log(
        `Check item ${lvl.inventory_item_id}: Shopify=${sfyAvail} DB=${dbAvail} -> ${ok ? 'OK' : 'DIFF'}`
      );
      ok ? matches++ : diffs++;
    }
    console.log(`Verification complete: OK=${matches}, DIFF=${diffs}`);

    // Optional: products table count vs Shopify count
    const dbProdCount = (await pool.query('SELECT COUNT(*)::int AS c FROM products')).rows[0]?.c || 0;
    console.log(`Products in DB: ${dbProdCount}, Products from Shopify: ${products.length}`);

    console.log('=== Done ===');
    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err?.message || err);
    process.exit(1);
  }
}

main();


