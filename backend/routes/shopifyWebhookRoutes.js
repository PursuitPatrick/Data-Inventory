const express = require('express');
const crypto = require('crypto');
const { pool } = require('../db');
const { getQueues } = require('../queue/queues');

const router = express.Router();

function verifyShopifyHmac(rawBody, hmacHeader, secret) {
  if (!hmacHeader || !secret) return false;
  const digest = crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('base64');
  try {
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmacHeader));
  } catch {
    return false;
  }
}

router.post('/shopify/webhooks', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
    const topic = req.get('X-Shopify-Topic');
    const shopDomain = req.get('X-Shopify-Shop-Domain');
    const webhookId = req.get('X-Shopify-Webhook-Id');
    const hmac = req.get('X-Shopify-Hmac-Sha256');
    const rawBody = req.body;

    if (!verifyShopifyHmac(rawBody, hmac, secret)) {
      return res.status(401).send('Unauthorized');
    }

    const payloadStr = rawBody.toString('utf8');
    const payload = JSON.parse(payloadStr);

    // Persist event for audit/dedupe
    await pool.query(
      `INSERT INTO shopify_webhook_events (topic, shop_domain, webhook_id, payload)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (webhook_id) DO NOTHING`,
      [topic, shopDomain, webhookId || null, payload]
    );

    // Enqueue for async processing if queue is enabled
    const { webhookQueue } = getQueues();
    if (webhookQueue) {
      try {
        await webhookQueue.add('event', { topic, shopDomain, webhookId, payload }, { removeOnComplete: true, removeOnFail: 100 });
      } catch (_) {
        // swallow queue errors; audit row is stored
      }
    }

    // Minimal immediate ack to Shopify
    res.status(200).send('OK');
  } catch (err) {
    res.status(200).send('OK'); // Avoid retries storm; log server-side
  }
});

module.exports = router;


