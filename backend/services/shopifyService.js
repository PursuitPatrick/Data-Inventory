const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

const SHOPIFY_STORE = process.env.SHOPIFY_STORE_DOMAIN;
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const API_VERSION = process.env.SHOPIFY_API_VERSION;

async function shopifyGet(endpoint) {
  try {
    const url = `https://${SHOPIFY_STORE}/admin/api/${API_VERSION}/${endpoint}`;
    const response = await axios.get(url, {
      headers: {
        'X-Shopify-Access-Token': ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    const details = error.response?.data || error.message;
    console.error(`Error fetching ${endpoint}:`, details);
    throw new Error(typeof details === 'string' ? details : JSON.stringify(details));
  }
}

module.exports = {
  getProducts: () => shopifyGet('products.json'),
  getInventoryLevels: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const ep = `inventory_levels.json${qs ? `?${qs}` : ''}`;
    return shopifyGet(ep);
  },
  getLocations: () => shopifyGet('locations.json'),
  getOrderFulfillments: (orderId) => shopifyGet(`orders/${orderId}/fulfillments.json`),
};


