const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

const { Worker, QueueEvents } = require('bullmq');
const { getQueues } = require('../queue/queues');
const { pool } = require('../db');

function getConnection() {
  const url = process.env.REDIS_URL || '';
  return url ? { connection: { url } } : null;
}

async function main() {
  if (process.env.OUTBOX_ENABLE !== '1') {
    console.log('Webhook worker disabled (OUTBOX_ENABLE!=1)');
    return;
  }
  const conn = getConnection();
  if (!conn) {
    console.log('Webhook worker disabled (no REDIS_URL)');
    return;
  }

  const queueName = 'shopify:webhooks';
  const worker = new Worker(
    queueName,
    async (job) => {
      const { topic, payload } = job.data || {};
      // Minimal handler: upsert products/inventory based on topic as needed later
      // For now just mark the event as processed
      return { ok: true, topic };
    },
    {
      ...conn,
      concurrency: Number.parseInt(process.env.WEBHOOK_CONCURRENCY || '4', 10),
    }
  );

  const events = new QueueEvents(queueName, conn);
  events.on('failed', ({ jobId, failedReason }) => {
    console.error('Webhook job failed', jobId, failedReason);
  });
  events.on('completed', ({ jobId }) => {
    console.log('Webhook job completed', jobId);
  });

  console.log('Webhook worker started');
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = { main };


