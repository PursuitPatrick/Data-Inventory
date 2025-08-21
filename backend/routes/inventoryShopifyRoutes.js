const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const shopify = require('../services/shopifyService');

const router = express.Router();

// GET /api/inventory/shopify - fetch products (with variants) from Shopify
router.get('/inventory/shopify', authenticateToken, async (req, res) => {
  try {
    const data = await shopify.getProducts();
    // Return the raw Shopify payload to preserve shape (includes variants[])
    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching inventory from Shopify:', err.message);
    res.status(500).send({ success: false });
  }
});

// POST /api/inventory/update - set inventory level in Shopify
router.post('/inventory/update', authenticateToken, async (req, res) => {
  try {
    const { inventory_item_id, available, location_id } = req.body || {};
    if (!inventory_item_id || typeof available !== 'number') {
      return res.status(400).json({ message: 'inventory_item_id and numeric available are required' });
    }

    let resolvedLocationId = location_id;
    if (!resolvedLocationId) {
      // Try to infer a single location if not provided
      const locs = await shopify.getLocations();
      const locations = Array.isArray(locs?.locations) ? locs.locations : [];
      if (locations.length === 1) {
        resolvedLocationId = locations[0].id;
      } else {
        return res.status(400).json({ message: 'location_id is required when multiple locations exist' });
      }
    }

    const data = await shopify.setInventoryLevel({
      inventory_item_id,
      location_id: resolvedLocationId,
      available,
    });
    res.status(200).json(data);
  } catch (err) {
    console.error('Error updating inventory:', err?.message || err);
    res.status(502).send({ success: false, message: 'Shopify error', detail: err?.message || String(err) });
  }
});

module.exports = router;


