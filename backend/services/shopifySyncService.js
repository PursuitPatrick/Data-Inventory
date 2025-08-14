const { pool } = require('../db');
const shopify = require('./shopifyService');

async function syncProducts() {
  const data = await shopify.getProducts();
  const products = Array.isArray(data?.products) ? data.products : [];

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const p of products) {
      await client.query(
        `INSERT INTO products (id, title, handle, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           handle = EXCLUDED.handle,
           created_at = EXCLUDED.created_at,
           updated_at = EXCLUDED.updated_at`,
        [p.id, p.title || null, p.handle || null, p.created_at ? new Date(p.created_at) : null, p.updated_at ? new Date(p.updated_at) : null]
      );
    }
    await client.query('COMMIT');
    return { productsUpserted: products.length };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function syncInventoryLevels() {
  // Shopify requires at least one filter (e.g., location_ids). Fetch locations first.
  const locData = await shopify.getLocations();
  const locations = Array.isArray(locData?.locations) ? locData.locations : [];
  if (locations.length === 0) {
    return { inventoryLevelsUpserted: 0, note: 'No locations returned from Shopify' };
  }

  const levelsAll = [];
  for (const loc of locations) {
    try {
      const data = await shopify.getInventoryLevels({ location_ids: String(loc.id), limit: 250 });
      const levels = Array.isArray(data?.inventory_levels) ? data.inventory_levels : [];
      levelsAll.push(...levels);
    } catch (err) {
      // Continue with other locations if one fails
      // eslint-disable-next-line no-continue
      continue;
    }
  }

  // Schema has primary key on inventory_item_id only. Collapse multiple locations per item
  const latestByItem = new Map();
  for (const lvl of levelsAll) {
    const current = latestByItem.get(lvl.inventory_item_id);
    const incomingUpdatedAt = lvl.updated_at ? new Date(lvl.updated_at) : null;
    const currentUpdatedAt = current?.updated_at ? new Date(current.updated_at) : null;
    if (!current || (incomingUpdatedAt && (!currentUpdatedAt || incomingUpdatedAt > currentUpdatedAt))) {
      latestByItem.set(lvl.inventory_item_id, lvl);
    }
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const lvl of latestByItem.values()) {
      await client.query(
        `INSERT INTO inventory_levels (inventory_item_id, location_id, available, updated_at)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (inventory_item_id) DO UPDATE SET
           location_id = EXCLUDED.location_id,
           available = EXCLUDED.available,
           updated_at = EXCLUDED.updated_at`,
        [lvl.inventory_item_id, lvl.location_id || null, lvl.available ?? null, lvl.updated_at ? new Date(lvl.updated_at) : null]
      );
    }
    await client.query('COMMIT');
    return { inventoryLevelsUpserted: latestByItem.size };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function syncLocations() {
  const data = await shopify.getLocations();
  const locations = Array.isArray(data?.locations) ? data.locations : [];

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const loc of locations) {
      await client.query(
        `INSERT INTO locations (id, name, address1, city, province, country, zip)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           address1 = EXCLUDED.address1,
           city = EXCLUDED.city,
           province = EXCLUDED.province,
           country = EXCLUDED.country,
           zip = EXCLUDED.zip`,
        [loc.id, loc.name || null, loc.address1 || null, loc.city || null, loc.province || null, loc.country || null, loc.zip || null]
      );
    }
    await client.query('COMMIT');
    return { locationsUpserted: locations.length };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function syncAll() {
  const [prod, loc, inv] = await Promise.all([
    syncProducts(),
    syncLocations(),
    syncInventoryLevels(),
  ]);
  return { ...prod, ...loc, ...inv };
}

module.exports = {
  syncProducts,
  syncInventoryLevels,
  syncLocations,
  syncAll,
};


