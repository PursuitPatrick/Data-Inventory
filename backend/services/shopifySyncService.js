const { pool } = require('../db');
const shopify = require('./shopifyService');

async function syncProducts() {
  const data = await shopify.getProducts();
  const products = Array.isArray(data?.products) ? data.products : [];

  // Skip early if store has no products
  if (products.length === 0) {
    return { productsUpserted: 0, note: 'No products found in Shopify. Skipping sync.' };
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const p of products) {
      const createdAt = p.created_at ? new Date(p.created_at) : null;
      const updatedAt = p.updated_at ? new Date(p.updated_at) : null;
      await client.query(
        `INSERT INTO products (id, title, handle, created_at, updated_at, shopify_updated_at, last_synced_at, sync_status)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), 'synced')
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           handle = EXCLUDED.handle,
           created_at = EXCLUDED.created_at,
           updated_at = EXCLUDED.updated_at,
           shopify_updated_at = EXCLUDED.shopify_updated_at,
           last_synced_at = NOW(),
           sync_status = 'synced'
         WHERE EXCLUDED.shopify_updated_at IS NOT NULL
           AND (products.shopify_updated_at IS NULL OR EXCLUDED.shopify_updated_at > products.shopify_updated_at)`,
        [p.id, p.title || null, p.handle || null, createdAt, updatedAt, updatedAt]
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

  // Skip early if there are no levels across all locations
  if (levelsAll.length === 0) {
    return { inventoryLevelsUpserted: 0, note: 'No inventory levels found in Shopify. Skipping sync.' };
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
      const updatedAt = lvl.updated_at ? new Date(lvl.updated_at) : null;
      await client.query(
        `INSERT INTO inventory_levels (inventory_item_id, location_id, available, updated_at, shopify_updated_at, last_synced_at, sync_status)
         VALUES ($1, $2, $3, $4, $5, NOW(), 'synced')
         ON CONFLICT (inventory_item_id) DO UPDATE SET
           location_id = EXCLUDED.location_id,
           available = EXCLUDED.available,
           updated_at = EXCLUDED.updated_at,
           shopify_updated_at = EXCLUDED.shopify_updated_at,
           last_synced_at = NOW(),
           sync_status = 'synced'
         WHERE EXCLUDED.shopify_updated_at IS NOT NULL
           AND (inventory_levels.shopify_updated_at IS NULL OR EXCLUDED.shopify_updated_at > inventory_levels.shopify_updated_at)`,
        [lvl.inventory_item_id, lvl.location_id || null, lvl.available ?? null, updatedAt, updatedAt]
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

// Sync recent orders and persist them to database
async function syncRecentOrders() {
  const since = new Date(Date.now() - 1000 * 60 * 60).toISOString(); // last 60 minutes
  const ordersData = await shopify.getOrders({ updated_at_min: since });
  const orders = Array.isArray(ordersData?.orders) ? ordersData.orders : [];

  if (orders.length === 0) {
    return { ordersFetched: 0, ordersUpserted: 0, note: 'No recent orders found in Shopify' };
  }

  const client = await pool.connect();
  let ordersUpserted = 0;
  
  try {
    await client.query('BEGIN');
    
    for (const order of orders) {
      const createdAt = order.created_at ? new Date(order.created_at) : null;
      const updatedAt = order.updated_at ? new Date(order.updated_at) : null;
      const processedAt = order.processed_at ? new Date(order.processed_at) : null;
      const cancelledAt = order.cancelled_at ? new Date(order.cancelled_at) : null;
      
      await client.query(
        `INSERT INTO orders (
          id, name, email, total_price, subtotal_price, total_tax, currency,
          financial_status, fulfillment_status, order_number, created_at, updated_at,
          processed_at, shopify_order_id, customer_id, note, tags, source_name,
          gateway, test, cancelled_at, cancel_reason, shopify_updated_at,
          last_synced_at, sync_status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, NOW(), 'synced')
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          total_price = EXCLUDED.total_price,
          subtotal_price = EXCLUDED.subtotal_price,
          total_tax = EXCLUDED.total_tax,
          currency = EXCLUDED.currency,
          financial_status = EXCLUDED.financial_status,
          fulfillment_status = EXCLUDED.fulfillment_status,
          order_number = EXCLUDED.order_number,
          created_at = EXCLUDED.created_at,
          updated_at = EXCLUDED.updated_at,
          processed_at = EXCLUDED.processed_at,
          customer_id = EXCLUDED.customer_id,
          note = EXCLUDED.note,
          tags = EXCLUDED.tags,
          source_name = EXCLUDED.source_name,
          gateway = EXCLUDED.gateway,
          test = EXCLUDED.test,
          cancelled_at = EXCLUDED.cancelled_at,
          cancel_reason = EXCLUDED.cancel_reason,
          shopify_updated_at = EXCLUDED.shopify_updated_at,
          last_synced_at = NOW(),
          sync_status = 'synced'
        WHERE EXCLUDED.shopify_updated_at IS NOT NULL
          AND (orders.shopify_updated_at IS NULL OR EXCLUDED.shopify_updated_at > orders.shopify_updated_at)`,
        [
          order.id,
          order.name || null,
          order.email || null,
          order.total_price ? parseFloat(order.total_price) : null,
          order.subtotal_price ? parseFloat(order.subtotal_price) : null,
          order.total_tax ? parseFloat(order.total_tax) : null,
          order.currency || null,
          order.financial_status || null,
          order.fulfillment_status || null,
          order.order_number || null,
          createdAt,
          updatedAt,
          processedAt,
          order.id, // shopify_order_id same as id
          order.customer?.id || null,
          order.note || null,
          order.tags || null,
          order.source_name || null,
          order.gateway || null,
          order.test || false,
          cancelledAt,
          order.cancel_reason || null,
          updatedAt // shopify_updated_at
        ]
      );
      ordersUpserted++;
    }
    
    await client.query('COMMIT');
    return { ordersFetched: orders.length, ordersUpserted };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  syncProducts,
  syncInventoryLevels,
  syncLocations,
  syncAll,
  syncRecentOrders,
};


