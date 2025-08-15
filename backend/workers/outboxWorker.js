const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

const { Worker, QueueEvents, Queue } = require('bullmq');
const { getQueues } = require('../queue/queues');
const shopify = require('../services/shopifyService');

function getConnection() {
  const url = process.env.REDIS_URL || '';
  return url ? { connection: { url } } : null;
}

async function main() {
  if (process.env.OUTBOX_ENABLE !== '1') {
    console.log('Outbox worker disabled (OUTBOX_ENABLE!=1)');
    return;
  }
  const conn = getConnection();
  if (!conn) {
    console.log('Outbox worker disabled (no REDIS_URL)');
    return;
  }

  const queueName = 'shopify:outbox';
  const worker = new Worker(
    queueName,
    async (job) => {
      const { type, payload } = job.data || {};
      if (type === 'adjustInventory') {
        const { inventory_item_id, location_id, available_adjustment } = payload || {};
        await shopify.adjustInventoryLevel({ inventory_item_id, location_id, available_adjustment });
        return { ok: true };
      }
      if (type === 'updateProduct') {
        const { productId, productPayload } = payload || {};
        const res = await shopify.updateProduct(productId, productPayload);
        return { ok: true, result: res };
      }
      return { ok: false, reason: 'Unknown job type' };
    },
    {
      ...conn,
      concurrency: Number.parseInt(process.env.OUTBOX_CONCURRENCY || '4', 10),
      // Basic backoff via retries controlled per-add; global rate limiter can be configured here if needed
    }
  );

  const events = new QueueEvents(queueName, conn);
  events.on('failed', ({ jobId, failedReason }) => {
    console.error('Outbox job failed', jobId, failedReason);
  });
  events.on('completed', ({ jobId }) => {
    console.log('Outbox job completed', jobId);
  });

  // Keep process alive
  console.log('Outbox worker started');
}

// Allow running standalone: `node backend/workers/outboxWorker.js`
if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = { main };


