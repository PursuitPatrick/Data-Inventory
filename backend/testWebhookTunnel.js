/*
 Probes public tunnel /health and sends a signed webhook POST to /webhooks/shopify/webhooks.
 Usage: node backend/testWebhookTunnel.js <PUBLIC_URL>
 PUBLIC_URL must be provided explicitly or via BACKEND_PUBLIC_URL env var.
*/

const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

// No longer reads from .tunnel-url to avoid accidentally persisting tunnels

async function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', (err) => reject(err));
  });
}

async function httpPost(url, headers, payload) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method: 'POST', headers }, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', (err) => reject(err));
    req.write(payload);
    req.end();
  });
}

async function main() {
  const provided = (process.argv[2] || '').trim().replace(/\/$/, '');
  const base = (provided || process.env.BACKEND_PUBLIC_URL || '').replace(/\/$/, '');
  if (!base) {
    console.error('No PUBLIC_URL provided or found (BACKEND_PUBLIC_URL)');
    process.exit(2);
  }
  console.log('PUBLIC_URL=', base);

  // 1) Probe /health
  try {
    const health = await httpGet(base + '/health');
    console.log('HEALTH_STATUS=', health.status);
    console.log('HEALTH_BODY=', health.body);
  } catch (e) {
    console.error('HEALTH_ERROR=', e.message);
  }

  // 2) Send signed webhook POST
  const secret = (process.env.SHOPIFY_WEBHOOK_SECRET || '').trim();
  const shop = (process.env.SHOPIFY_STORE_DOMAIN || '').trim();
  if (!secret || !shop) {
    console.error('Missing SHOPIFY_WEBHOOK_SECRET or SHOPIFY_STORE_DOMAIN in .env');
    process.exit(3);
  }

  const payload = JSON.stringify({ test: true, timestamp: Date.now() });
  const sig = crypto.createHmac('sha256', secret).update(payload, 'utf8').digest('base64');
  const headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
    'X-Shopify-Topic': 'products/create',
    'X-Shopify-Shop-Domain': shop,
    'X-Shopify-Webhook-Id': 'test-' + Date.now(),
    'X-Shopify-Hmac-Sha256': sig,
  };

  try {
    const post = await httpPost(base + '/webhooks/shopify/webhooks', headers, payload);
    console.log('WEBHOOK_STATUS=', post.status);
    console.log('WEBHOOK_BODY=', post.body);
  } catch (e) {
    console.error('WEBHOOK_ERROR=', e.message);
  }
}

main();


