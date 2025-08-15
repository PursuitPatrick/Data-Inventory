function getRedisConnection() {
  const url = process.env.REDIS_URL || '';
  if (!url) return null;
  try {
    const { URL } = require('url');
    // Validate URL
    // eslint-disable-next-line no-new
    new URL(url);
    return { connection: { url } };
  } catch (_) {
    return null;
  }
}

function getQueues() {
  const enabled = process.env.OUTBOX_ENABLE === '1';
  if (!enabled) return { outboxQueue: null, webhookQueue: null };
  const conn = getRedisConnection();
  if (!conn) return { outboxQueue: null, webhookQueue: null };
  try {
    // Lazy require to avoid crashing when deps not installed
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    const { Queue } = require('bullmq');
    const outboxQueue = new Queue('shopify:outbox', conn);
    const webhookQueue = new Queue('shopify:webhooks', conn);
    return { outboxQueue, webhookQueue };
  } catch (_) {
    return { outboxQueue: null, webhookQueue: null };
  }
}

module.exports = {
  getQueues,
};


