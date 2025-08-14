const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const shopify = require('../services/shopifyService');
const sync = require('../services/shopifySyncService');

const router = express.Router();

router.get('/products', authenticateToken, async (req, res) => {
  try {
    const data = await shopify.getProducts();
    res.json(data);
  } catch (err) {
    res.status(502).json({ message: 'Shopify error', detail: err.message });
  }
});

router.get('/inventory-levels', authenticateToken, async (req, res) => {
  try {
    const data = await shopify.getInventoryLevels(req.query);
    res.json(data);
  } catch (err) {
    res.status(502).json({ message: 'Shopify error', detail: err.message });
  }
});

router.get('/locations', authenticateToken, async (req, res) => {
  try {
    const data = await shopify.getLocations();
    res.json(data);
  } catch (err) {
    res.status(502).json({ message: 'Shopify error', detail: err.message });
  }
});

router.get('/orders/:orderId/fulfillments', authenticateToken, async (req, res) => {
  try {
    const data = await shopify.getOrderFulfillments(req.params.orderId);
    res.json(data);
  } catch (err) {
    res.status(502).json({ message: 'Shopify error', detail: err.message });
  }
});

// Sync endpoints
router.post('/sync/products', authenticateToken, async (req, res) => {
  try {
    const result = await sync.syncProducts();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Sync error', detail: err.message });
  }
});

router.post('/sync/locations', authenticateToken, async (req, res) => {
  try {
    const result = await sync.syncLocations();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Sync error', detail: err.message });
  }
});

router.post('/sync/inventory-levels', authenticateToken, async (req, res) => {
  try {
    const result = await sync.syncInventoryLevels(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Sync error', detail: err.message });
  }
});

router.post('/sync/all', authenticateToken, async (req, res) => {
  try {
    const result = await sync.syncAll();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Sync error', detail: err.message });
  }
});

// Two-way sync write routes
router.post('/inventory-levels/adjust', authenticateToken, async (req, res) => {
  try {
    const { inventory_item_id, location_id, available_adjustment } = req.body || {};
    if (!inventory_item_id || !location_id || typeof available_adjustment !== 'number') {
      return res.status(400).json({ message: 'inventory_item_id, location_id, and numeric available_adjustment are required' });
    }
    const data = await shopify.adjustInventoryLevel({ inventory_item_id, location_id, available_adjustment });
    res.json(data);
  } catch (err) {
    res.status(502).json({ message: 'Shopify error', detail: err.message });
  }
});

router.put('/products/:id', authenticateToken, async (req, res) => {
  try {
    const productId = req.params.id;
    const productPayload = req.body?.product || req.body;
    if (!productPayload) {
      return res.status(400).json({ message: 'Product payload is required' });
    }
    const data = await shopify.updateProduct(productId, productPayload);
    res.json(data);
  } catch (err) {
    res.status(502).json({ message: 'Shopify error', detail: err.message });
  }
});

module.exports = router;


