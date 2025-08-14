const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const shopify = require('../services/shopifyService');

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

module.exports = router;


