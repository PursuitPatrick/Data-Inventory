const { getAllItems } = require('../db');
const { updateShopifyInventory } = require('../utils/shopifyHelpers');

function coerceAvailable(value) {
  if (value === null || value === undefined) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function pickInventoryItemId(item) {
  return (
    item?.inventory_item_id ??
    item?.inventoryItemId ??
    item?.shopify_inventory_item_id ??
    item?.shopifyInventoryItemId ??
    null
  );
}

function pickAvailable(item) {
  return (
    coerceAvailable(item?.available) ??
    coerceAvailable(item?.stock) ??
    coerceAvailable(item?.quantity) ??
    coerceAvailable(item?.on_hand) ??
    null
  );
}

async function pushAllLocalInventoryToShopify() {
  const localItems = await getAllItems();
  let attempted = 0;
  let updated = 0;
  let skipped = 0;

  for (const item of Array.isArray(localItems) ? localItems : []) {
    const inventoryItemId = pickInventoryItemId(item);
    const available = pickAvailable(item);

    if (!inventoryItemId || available === null) {
      skipped += 1;
      // eslint-disable-next-line no-continue
      continue;
    }

    attempted += 1;
    try {
      // location_id optional; helper will resolve if exactly one location exists
      await updateShopifyInventory(inventoryItemId, available);
      updated += 1;
    } catch (err) {
      // Log and continue to next item
      // eslint-disable-next-line no-console
      console.error('Push inventory failed', { inventoryItemId, available, error: err?.message || err });
    }
  }

  return { attempted, updated, skipped };
}

module.exports = {
  pushAllLocalInventoryToShopify,
};


