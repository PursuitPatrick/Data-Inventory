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

// Map topics to dedicated endpoints
const TOPIC_TO_ADDRESS = new Map([
	['orders/create', `${PUBLIC_URL}/api/orders`],
	['orders/updated', `${PUBLIC_URL}/api/orders/updated`],
	['orders/cancelled', `${PUBLIC_URL}/api/orders/cancelled`],
	['fulfillments/create', `${PUBLIC_URL}/api/fulfillments/create`],
	['fulfillments/update', `${PUBLIC_URL}/api/fulfillments/update`],
	['app/uninstalled', `${PUBLIC_URL}/api/app/uninstalled`],
	['inventory_levels/update', `${PUBLIC_URL}/api/inventory`],
	['products/update', `${PUBLIC_URL}/api/products`],
	// Other topics keep generic endpoint
	['orders/fulfilled', `${PUBLIC_URL}/webhooks/shopify/webhooks`],
	['products/create', `${PUBLIC_URL}/webhooks/shopify/webhooks`],
	['products/delete', `${PUBLIC_URL}/webhooks/shopify/webhooks`],
]);

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
	console.log('Registering webhooks for topics:', Array.from(TOPIC_TO_ADDRESS.keys()));

	const list = await listWebhooks();
	if (list.status !== 200) {
		console.error('Failed to list webhooks:', list);
		process.exit(2);
	}
	const existing = (list.data && list.data.webhooks) || [];
	for (const [topic, address] of TOPIC_TO_ADDRESS.entries()) {
		// eslint-disable-next-line no-await-in-loop
		await ensureWebhook(topic, address, existing);
	}
	console.log('Done.');
})();



