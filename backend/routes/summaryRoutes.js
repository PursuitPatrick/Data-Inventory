const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { pool } = require('../db');

const router = express.Router();

// GET /api/summary/dashboard?dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD
router.get('/summary/dashboard', authenticateToken, async (req, res) => {
  try {
    const dateFrom = (req.query.dateFrom || '').trim();
    const dateTo = (req.query.dateTo || '').trim();

    // Total inventory now
    const totalInvRes = await pool.query('SELECT COALESCE(SUM(available),0)::bigint AS total FROM inventory_levels');
    const totalInventory = Number(totalInvRes.rows[0]?.total || 0);

    // Inventory snapshot one month ago
    let monthAgo = 0;
    try {
      const monthAgoRes = await pool.query(`
        SELECT total_available FROM inventory_snapshots
        WHERE snapshot_date = (CURRENT_DATE - INTERVAL '30 days')::date
      `);
      monthAgo = Number(monthAgoRes.rows[0]?.total_available || 0);
    } catch (_) {}
    const totalInventoryPct = monthAgo > 0 ? ((totalInventory - monthAgo) / monthAgo) * 100 : null;

    // Outgoing items in range (orders line items if present)
    let outgoing = 0;
    try {
      const clauses = [];
      const params = [];
      if (dateFrom) { params.push(dateFrom); clauses.push(`o.created_at::date >= $${params.length}::date`); }
      if (dateTo) { params.push(dateTo); clauses.push(`o.created_at::date <= $${params.length}::date`); }
      const whereSQL = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
      const outgoingRes = await pool.query(`
        SELECT COALESCE(SUM(li.quantity),0)::bigint AS qty
        FROM order_line_items li
        JOIN orders o ON o.id = li.order_id
        ${whereSQL}
      `, params);
      outgoing = Number(outgoingRes.rows[0]?.qty || 0);
    } catch (_) {}

    // Incoming items and items in transit (from inbound if present)
    let incoming = 0;
    let inTransit = 0;
    try {
      const params = [];
      let where = '';
      if (dateFrom) { params.push(dateFrom); where += (where ? ' AND ' : 'WHERE ') + 'created_at::date >= $1::date'; }
      if (dateTo) { params.push(dateTo); where += (where ? ' AND ' : 'WHERE ') + `created_at::date <= $${params.length}::date`; }
      const incomingRes = await pool.query(`
        SELECT COALESCE(SUM(COALESCE(qty,0)),0)::bigint AS qty
        FROM inbound_shipments
        ${where}
      `, params);
      incoming = Number(incomingRes.rows[0]?.qty || 0);

      const transitRes = await pool.query(`
        SELECT COALESCE(SUM(COALESCE(qty,0)),0)::bigint AS qty
        FROM inbound_shipments
        WHERE (status ILIKE 'Expected' OR status ILIKE 'In Process')
      `);
      inTransit = Number(transitRes.rows[0]?.qty || 0);
    } catch (_) {}

    res.json({
      totalInventory: { value: totalInventory, pctFromLastMonth: totalInventoryPct },
      incomingItems: { value: incoming },
      outgoingItems: { value: outgoing },
      itemsInTransit: { value: inTransit },
    });
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// GET /api/summary/products-by-status?dateFrom&dateTo
router.get('/summary/products-by-status', authenticateToken, async (req, res) => {
  try {
    const dateFrom = (req.query.dateFrom || '').trim();
    const dateTo = (req.query.dateTo || '').trim();
    const whereClauses = [];
    const params = [];
    if (dateFrom) { params.push(dateFrom); whereClauses.push(`created_at >= $${params.length}`); }
    if (dateTo) { params.push(dateTo); whereClauses.push(`created_at <= $${params.length}`); }
    const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const sql = `
      SELECT COALESCE(status,'unknown') AS status, COUNT(*)::int AS count
      FROM products
      ${whereSQL}
      GROUP BY 1
    `;
    const { rows } = await pool.query(sql, params);
    const holdSql = `SELECT COUNT(*)::int AS count FROM products WHERE on_hold = TRUE`;
    const holdRes = await pool.query(holdSql);
    const onHoldCount = holdRes.rows[0]?.count || 0;

    const mapped = { active: 0, inactive: 0, on_hold: onHoldCount, unknown: 0 };
    for (const r of rows) {
      const s = String(r.status || '').toLowerCase();
      if (s === 'active') mapped.active += r.count;
      else if (s === 'draft' || s === 'archived') mapped.inactive += r.count;
      else mapped.unknown += r.count;
    }
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// GET /api/summary/warehouse?lowThreshold=5
router.get('/summary/warehouse', authenticateToken, async (req, res) => {
  try {
    const low = Math.max(parseInt(req.query.lowThreshold, 10) || 5, 1);
    const totalRes = await pool.query('SELECT COUNT(*)::int AS total FROM inventory_levels');
    const inStockRes = await pool.query('SELECT COUNT(*)::int AS cnt FROM inventory_levels WHERE COALESCE(available,0) > 0');
    const lowStockRes = await pool.query('SELECT COUNT(*)::int AS cnt FROM inventory_levels WHERE COALESCE(available,0) > 0 AND COALESCE(available,0) <= $1', [low]);
    const outOfStockRes = await pool.query('SELECT COUNT(*)::int AS cnt FROM inventory_levels WHERE COALESCE(available,0) = 0');
    res.json({
      allBoxes: totalRes.rows[0]?.total || 0,
      inStock: inStockRes.rows[0]?.cnt || 0,
      lowStock: lowStockRes.rows[0]?.cnt || 0,
      outOfStock: outOfStockRes.rows[0]?.cnt || 0,
      lowThreshold: low
    });
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

module.exports = router;

// GET /api/summary/out-of-stock?limit=50
router.get('/summary/out-of-stock', authenticateToken, async (req, res) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 50, 1), 500);
    const sql = `
      SELECT il.inventory_item_id,
             COALESCE(il.available,0) AS available,
             pv.sku,
             pv.title AS variant_title,
             pv.product_id
      FROM inventory_levels il
      LEFT JOIN product_variants pv ON pv.inventory_item_id = il.inventory_item_id
      WHERE COALESCE(il.available,0) = 0
      ORDER BY pv.sku NULLS LAST, il.inventory_item_id
      LIMIT $1
    `;
    const { rows } = await pool.query(sql, [limit]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});


