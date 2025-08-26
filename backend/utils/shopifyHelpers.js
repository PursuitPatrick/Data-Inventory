const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

const shopify = require('../services/shopifyService');

function readDefaultLocationIdFromEnv() {
  const raw = process.env.SHOPIFY_DEFAULT_LOCATION_ID;
  if (!raw) return null;
  const num = Number(raw);
  return Number.isFinite(num) ? num : String(raw);
}

async function getAllProducts() {
  const data = await shopify.getProducts();
  return Array.isArray(data?.products) ? data.products : [];
}

async function getInventoryLevels(params = {}) {
  const data = await shopify.getInventoryLevels(params);
  return Array.isArray(data?.inventory_levels) ? data.inventory_levels : [];
}

async function updateShopifyInventory(inventory_item_id, available, location_id) {
  if (!inventory_item_id || typeof available !== 'number') {
    throw new Error('inventory_item_id and numeric available are required');
  }

  let resolvedLocationId = location_id;
  if (!resolvedLocationId) {
    const fromEnv = readDefaultLocationIdFromEnv();
    if (fromEnv) {
      resolvedLocationId = fromEnv;
    } else {
      const loc = await shopify.getLocations();
      const locations = Array.isArray(loc?.locations) ? loc.locations : [];
      if (locations.length === 1) {
        resolvedLocationId = locations[0].id;
      } else {
        throw new Error('location_id is required when multiple locations exist (or set SHOPIFY_DEFAULT_LOCATION_ID)');
      }
    }
  }

  return shopify.setInventoryLevel({
    inventory_item_id,
    location_id: resolvedLocationId,
    available,
  });
}

module.exports = {
  getAllProducts,
  getInventoryLevels,
  updateShopifyInventory,
  readDefaultLocationIdFromEnv,
};


