const { pool } = require('../db');

// Create Inventory Item
async function createInventoryItem(req, res) {
  try {
    const { name, description, quantity, price, category, location } = req.body;
    const result = await pool.query(
      'INSERT INTO inventory (name, description, quantity, price, category, location) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, quantity, price, category, location]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get All Inventory Items
async function getAllInventory(req, res) {
  try {
    // Match existing list behavior that includes category_name
    const result = await pool.query(`
      SELECT * FROM inventory ORDER BY created_at DESC
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get Single Inventory Item
async function getInventoryItem(req, res) {
  try {
    const { id } = req.params;
    const numericId = Number.parseInt(id, 10);
    if (Number.isNaN(numericId)) {
      return res.status(400).json({ message: 'Invalid id' });
    }
    const result = await pool.query('SELECT * FROM inventory WHERE id = $1', [numericId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Update Inventory Item
async function updateInventoryItem(req, res) {
  try {
    const { id } = req.params;
    const numericId = Number.parseInt(id, 10);
    if (Number.isNaN(numericId)) {
      return res.status(400).json({ message: 'Invalid id' });
    }
    const { name, description, quantity, price, category, location } = req.body;
    const result = await pool.query(
      'UPDATE inventory SET name = $1, description = $2, quantity = $3, price = $4, category = $5, location = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [name, description, quantity, price, category, location, numericId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Delete Inventory Item
async function deleteInventoryItem(req, res) {
  try {
    const { id } = req.params;
    const numericId = Number.parseInt(id, 10);
    if (Number.isNaN(numericId)) {
      return res.status(400).json({ message: 'Invalid id' });
    }
    const result = await pool.query('DELETE FROM inventory WHERE id = $1 RETURNING *', [numericId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createInventoryItem,
  getAllInventory,
  getInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
};


