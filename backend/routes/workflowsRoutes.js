const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { pool } = require('../db');

const router = express.Router();

function getDateRange(dateStr) {
  if (!dateStr) return [null, null];
  const start = new Date(dateStr);
  if (Number.isNaN(start.getTime())) return [null, null];
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return [start.toISOString(), end.toISOString()];
}

// Inbound summary
router.get('/inbound/summary', authenticateToken, async (req, res) => {
  try {
    const { date } = req.query;
    let where = '';
    let params = [];
    if (date) {
      const [start, end] = getDateRange(date);
      if (start && end) {
        where = 'WHERE created_at >= $1 AND created_at < $2';
        params = [start, end];
      }
    }
    const sql = `SELECT COALESCE(status,'unknown') AS status, COUNT(*)::int AS count
                 FROM inbound_shipments ${where} GROUP BY 1 ORDER BY 2 DESC`;
    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Outbound summary
router.get('/outbound/summary', authenticateToken, async (req, res) => {
  try {
    const sql = `SELECT COALESCE(status,'unknown') AS status, COUNT(*)::int AS count
                 FROM outbound_jobs GROUP BY 1 ORDER BY 2 DESC`;
    const { rows } = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rework summary
router.get('/rework/summary', authenticateToken, async (req, res) => {
  try {
    const sql = `SELECT COALESCE(status,'unknown') AS status, COUNT(*)::int AS count
                 FROM rework_tasks GROUP BY 1 ORDER BY 2 DESC`;
    const { rows } = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Support summary
router.get('/support/summary', authenticateToken, async (req, res) => {
  try {
    const sql = `SELECT COALESCE(status,'unknown') AS status, COUNT(*)::int AS count
                 FROM support_tickets GROUP BY 1 ORDER BY 2 DESC`;
    const { rows } = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

// Outbound list with pagination and filters
router.get('/outbound', authenticateToken, async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(req.query.pageSize, 10) || 20, 1), 100);
    const offset = (page - 1) * pageSize;
    const status = (req.query.status || '').trim();
    const showArchived = req.query.archived === '1' || req.query.archived === 'true';
    const where = [];
    const params = [];
    if (status) { params.push(status); where.push(`status = $${params.length}`); }
    if (!showArchived) { where.push(`archived = FALSE`); }
    const whereSQL = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const total = await pool.query(`SELECT COUNT(*)::int AS count FROM outbound_jobs ${whereSQL}`, params);
    const rows = await pool.query(
      `SELECT * FROM outbound_jobs ${whereSQL} ORDER BY created_at DESC LIMIT $${params.length+1} OFFSET $${params.length+2}`,
      params.concat([pageSize, offset])
    );
    res.json({ data: rows.rows, pagination: { page, pageSize, total: total.rows[0].count } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rework list
router.get('/rework', authenticateToken, async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(req.query.pageSize, 10) || 20, 1), 100);
    const offset = (page - 1) * pageSize;
    const status = (req.query.status || '').trim();
    const showArchived = req.query.archived === '1' || req.query.archived === 'true';
    const where = [];
    const params = [];
    if (status) { params.push(status); where.push(`status = $${params.length}`); }
    if (!showArchived) { where.push(`archived = FALSE`); }
    const whereSQL = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const total = await pool.query(`SELECT COUNT(*)::int AS count FROM rework_tasks ${whereSQL}`, params);
    const rows = await pool.query(
      `SELECT * FROM rework_tasks ${whereSQL} ORDER BY created_at DESC LIMIT $${params.length+1} OFFSET $${params.length+2}`,
      params.concat([pageSize, offset])
    );
    res.json({ data: rows.rows, pagination: { page, pageSize, total: total.rows[0].count } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Support list
router.get('/support', authenticateToken, async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(req.query.pageSize, 10) || 20, 1), 100);
    const offset = (page - 1) * pageSize;
    const status = (req.query.status || '').trim();
    const showArchived = req.query.archived === '1' || req.query.archived === 'true';
    const where = [];
    const params = [];
    if (status) { params.push(status); where.push(`status = $${params.length}`); }
    if (!showArchived) { where.push(`archived = FALSE`); }
    const whereSQL = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const total = await pool.query(`SELECT COUNT(*)::int AS count FROM support_tickets ${whereSQL}`, params);
    const rows = await pool.query(
      `SELECT * FROM support_tickets ${whereSQL} ORDER BY created_at DESC LIMIT $${params.length+1} OFFSET $${params.length+2}`,
      params.concat([pageSize, offset])
    );
    res.json({ data: rows.rows, pagination: { page, pageSize, total: total.rows[0].count } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


