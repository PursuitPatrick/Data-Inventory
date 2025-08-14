const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const axios = require('axios');
const { pool } = require('./db');

const SHOPIFY_STORE = process.env.SHOPIFY_STORE_DOMAIN;
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const API_VERSION = process.env.SHOPIFY_API_VERSION;

// Fetch Shopify data (read-only)
async function fetchData(endpoint) {
  try {
    const res = await axios.get(
      `https://${SHOPIFY_STORE}/admin/api/${API_VERSION}/${endpoint}`,
      { headers: { 'X-Shopify-Access-Token': ACCESS_TOKEN } }
    );
    return res.data;
  } catch (err) {
    console.error(`Error fetching ${endpoint}:`, err.response?.data || err.message);
    return null;
  }
}

// Push backend inventory changes to Shopify (adjustment is delta)
async function updateInventoryLevel(inventory_item_id, location_id, available) {
  try {
    const res = await axios.post(
      `https://${SHOPIFY_STORE}/admin/api/${API_VERSION}/inventory_levels/adjust.json`,
      {
        location_id,
        inventory_item_id,
        available_adjustment: available,
      },
      {
        headers: {
          'X-Shopify-Access-Token': ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Inventory updated for item:', inventory_item_id);
    return res.data;
  } catch (err) {
    console.error('Error updating inventory:', err.response?.data || err.message);
  }
}

// Example: push all local changes
async function pushLocalInventoryChanges() {
  const result = await pool.query(
    'SELECT inventory_item_id, location_id, available FROM inventory_levels WHERE available_changed = TRUE'
  );
  for (const row of result.rows) {
    await updateInventoryLevel(row.inventory_item_id, row.location_id, row.available);
    // mark as synced
    await pool.query(
      'UPDATE inventory_levels SET available_changed = FALSE WHERE inventory_item_id = $1',
      [row.inventory_item_id]
    );
  }
}

module.exports = {
  fetchData,
  updateInventoryLevel,
  pushLocalInventoryChanges,
};


