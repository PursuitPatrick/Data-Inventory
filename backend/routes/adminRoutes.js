const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { pool } = require('../db');

const router = express.Router();

// GET /api/admin/activity?limit=20&type=&actor=&dateFrom=&dateTo=&q=&cursor=
router.get('/admin/activity', authenticateToken, async (req, res) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const { type, actor, dateFrom, dateTo, q } = req.query;
    const cursor = (req.query.cursor || '').trim();

    const where = [];
    const params = [];
    if (type) { params.push(type); where.push(`type = $${params.length}`); }
    if (actor) { params.push(actor); where.push(`actor = $${params.length}`); }
    if (dateFrom) { params.push(dateFrom); where.push(`occurred_at >= $${params.length}`); }
    if (dateTo) { params.push(dateTo); where.push(`occurred_at <= $${params.length}`); }
    if (q) {
      params.push(`%${q}%`);
      where.push(`(title ILIKE $${params.length} OR details ILIKE $${params.length})`);
    }

    if (cursor) {
      const [cOcc, cIdRaw] = cursor.split('|');
      const cId = parseInt(cIdRaw, 10);
      if (cOcc && Number.isFinite(cId)) {
        params.push(cOcc, cId);
        where.push(`(occurred_at, id) < ($${params.length-1}::timestamptz, $${params.length}::int)`);
      }
    }

    const whereSQL = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const sql = `
      SELECT id, type, title, details, actor, occurred_at
      FROM activity_log
      ${whereSQL}
      ORDER BY occurred_at DESC, id DESC
      LIMIT $${params.length + 1}
    `;
    const rowsRes = await pool.query(sql, params.concat([limit + 1]));
    const items = rowsRes.rows.slice(0, limit);
    let nextCursor = null;
    if (rowsRes.rows.length > limit) {
      const last = items[items.length - 1];
      nextCursor = `${new Date(last.occurred_at).toISOString()}|${last.id}`;
    }
    res.json({ items, nextCursor, hasMore: Boolean(nextCursor) });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// POST /api/admin/quick-action — log a quick action click to activity_log
router.post('/admin/quick-action', authenticateToken, async (req, res) => {
  try {
    const {
      type, // 'receive' | 'ship' | 'update_inventory' | 'custom'
      title,
      details,
      qty,
      reference,
      order_id,
      inventory_item_id,
      location_id,
      delta,
      available,
      note,
    } = req.body || {};

    const allowed = new Set(['receive', 'ship', 'update_inventory', 'custom']);
    const t = allowed.has(type) ? type : 'custom';

    let computedTitle = (title || '').trim();
    let computedDetails = (details || '').trim();

    if (!computedTitle) {
      if (t === 'receive') computedTitle = 'Quick: Receive Items';
      else if (t === 'ship') computedTitle = 'Quick: Ship Items';
      else if (t === 'update_inventory') computedTitle = 'Quick: Update Inventory';
      else computedTitle = 'Quick: Action';
    }

    const parts = [];
    if (typeof qty !== 'undefined') parts.push(`Qty: ${qty}`);
    if (reference) parts.push(`Ref: ${reference}`);
    if (order_id) parts.push(`Order: ${order_id}`);
    if (inventory_item_id) parts.push(`Item: ${inventory_item_id}`);
    if (location_id) parts.push(`Loc: ${location_id}`);
    if (typeof delta !== 'undefined') parts.push(`Δ: ${delta}`);
    if (typeof available !== 'undefined') parts.push(`Available: ${available}`);
    if (note) parts.push(`Note: ${note}`);

    if (!computedDetails) computedDetails = parts.join(', ') || null;

    const storeType = t === 'update_inventory' ? 'inventory' : t;
    const { rows } = await pool.query(
      `INSERT INTO activity_log (type, title, details, actor)
       VALUES ($1, $2, $3, $4)
       RETURNING id, type, title, details, actor, occurred_at`,
      [storeType, computedTitle, computedDetails, req.user?.username || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

module.exports = router;


