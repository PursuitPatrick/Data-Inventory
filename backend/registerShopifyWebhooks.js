// Register Shopify webhooks using values from the root .env
// Usage: node backend/registerShopifyWebhooks.js

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const SHOP = (process.env.SHOPIFY_STORE_DOMAIN || '').trim();
const TOKEN = (process.env.SHOPIFY_ACCESS_TOKEN || '').trim();
const API_VERSION = (process.env.SHOPIFY_API_VERSION || '2024-10').trim();
const PUBLIC_URL_RAW = (process.env.BACKEND_PUBLIC_URL || '').trim();
const PUBLIC_URL = PUBLIC_URL_RAW.replace(/\/$/, '');

if (!SHOP || !TOKEN || !PUBLIC_URL) {
	console.error('Missing required env. Need SHOPIFY_STORE_DOMAIN, SHOPIFY_ACCESS_TOKEN, BACKEND_PUBLIC_URL');
	process.exit(1);
}

const ADDRESS = `${PUBLIC_URL}/webhooks/shopify/webhooks`;
const EVENTS = [
	'inventory_levels/update',
	'orders/create',
	'orders/fulfilled',
	'products/create',
	'products/update',
	'products/delete',
];

async function shopifyFetch(method, endpoint, body) {
	const url = `https://${SHOP}/admin/api/${API_VERSION}/${endpoint}`;
	const headers = {
		'Content-Type': 'application/json',
		'X-Shopify-Access-Token': TOKEN,
		'User-Agent': 'ai-inventory-webhook-register',
	};
	const res = await fetch(url, {
		method,
		headers,
		body: body ? JSON.stringify(body) : undefined,
	});
	let data;
	try {
		data = await res.json();
	} catch (_) {
		data = null;
	}
	return { status: res.status, data };
}

async function listWebhooks() {
	return shopifyFetch('GET', 'webhooks.json?limit=250');
}

async function createWebhook(topic, address) {
	return shopifyFetch('POST', 'webhooks.json', {
		webhook: { topic, address, format: 'json' },
	});
}

async function ensureWebhook(topic, address, existing) {
	const already = (existing || []).find(
		(w) => String(w.topic) === topic && String(w.address) === address
	);
	if (already) {
		console.log(`✅ Exists: ${topic} → ${address}`);
		return { created: false, webhook: already };
	}
	const { status, data } = await createWebhook(topic, address);
	if (status === 201 && data && data.webhook) {
		console.log(`✅ Created: ${topic}`);
		return { created: true, webhook: data.webhook };
	}
	console.error(`❌ Failed to create ${topic}:`, { status, data });
	return { created: false };
}

(async () => {
	console.log('SHOP=', SHOP);
	console.log('API_VERSION=', API_VERSION);
	console.log('ADDRESS=', ADDRESS);

	const list = await listWebhooks();
	if (list.status !== 200) {
		console.error('Failed to list webhooks:', list);
		process.exit(2);
	}
	const existing = (list.data && list.data.webhooks) || [];
	for (const topic of EVENTS) {
		// eslint-disable-next-line no-await-in-loop
		await ensureWebhook(topic, ADDRESS, existing);
	}
	console.log('Done.');
})();



