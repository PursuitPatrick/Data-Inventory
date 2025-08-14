const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const { dbConfig } = require('./config');

// Create a connection pool
const pool = new Pool(dbConfig);

// Test the database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Successfully connected to PostgreSQL database');
    
    // Test query
    const result = await client.query('SELECT NOW()');
    console.log('📅 Database time:', result.rows[0].now);
    
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Initialize database tables
const initDatabase = async () => {
  try {
    const client = await pool.connect();
    
    // Create inventory table (named 'inventory' per user request)
    await client.query(`
      CREATE TABLE IF NOT EXISTS inventory (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        quantity INTEGER DEFAULT 0,
        category VARCHAR(100),
        location VARCHAR(100),
        price NUMERIC(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ensure price column exists for legacy tables
    await client.query(`
      ALTER TABLE inventory
      ADD COLUMN IF NOT EXISTS price NUMERIC(10,2) DEFAULT 0
    `);
    
    // Create categories table
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Insert some default categories
    await client.query(`
      INSERT INTO categories (name, description) 
      VALUES 
        ('Electronics', 'Electronic devices and components'),
        ('Office Supplies', 'Office and stationery items'),
        ('Tools', 'Hand tools and equipment'),
        ('Furniture', 'Office furniture and fixtures')
      ON CONFLICT (name) DO NOTHING
    `);

    // Create users table for authentication
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Shopify products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id BIGINT PRIMARY KEY,
        title TEXT,
        handle TEXT,
        created_at TIMESTAMP,
        updated_at TIMESTAMP
      )
    `);

    // Create Shopify inventory levels table
    await client.query(`
      CREATE TABLE IF NOT EXISTS inventory_levels (
        inventory_item_id BIGINT PRIMARY KEY,
        location_id BIGINT,
        available INT,
        updated_at TIMESTAMP,
        available_changed BOOLEAN DEFAULT FALSE
      )
    `);

    // Create Shopify locations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS locations (
        id BIGINT PRIMARY KEY,
        name TEXT,
        address1 TEXT,
        city TEXT,
        province TEXT,
        country TEXT,
        zip TEXT
      )
    `);

    // Seed a default user if not exists (admin / admin123)
    const defaultUsername = 'admin';
    const existingUser = await client.query('SELECT 1 FROM users WHERE username = $1', [defaultUsername]);
    if (existingUser.rowCount === 0) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      await client.query('INSERT INTO users (username, password) VALUES ($1, $2)', [defaultUsername, passwordHash]);
    }
    
    client.release();
    console.log('✅ Database tables initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    return false;
  }
};

// Get all inventory items
const getAllItems = async () => {
  try {
    const result = await pool.query(`
      SELECT i.*, c.name as category_name 
      FROM inventory i 
      LEFT JOIN categories c ON i.category = c.name 
      ORDER BY i.created_at DESC
    `);
    return result.rows;
  } catch (error) {
    console.error('Error fetching inventory items:', error.message);
    throw error;
  }
};

// Add new inventory item
const addItem = async (item) => {
  try {
    const { name, description, quantity, category, location } = item;
    const result = await pool.query(`
      INSERT INTO inventory (name, description, quantity, category, location)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [name, description, quantity, category, location]);
    return result.rows[0];
  } catch (error) {
    console.error('Error adding inventory item:', error.message);
    throw error;
  }
};

// Update inventory item
const updateItem = async (id, updates) => {
  try {
    const { name, description, quantity, category, location } = updates;
    const result = await pool.query(`
      UPDATE inventory 
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          quantity = COALESCE($3, quantity),
          category = COALESCE($4, category),
          location = COALESCE($5, location),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `, [name, description, quantity, category, location, id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating inventory item:', error.message);
    throw error;
  }
};

// Delete inventory item
const deleteItem = async (id) => {
  try {
    const result = await pool.query('DELETE FROM inventory WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting inventory item:', error.message);
    throw error;
  }
};

// Get all categories
const getCategories = async () => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
    return result.rows;
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    throw error;
  }
};

module.exports = {
  pool,
  testConnection,
  initDatabase,
  getAllItems,
  addItem,
  updateItem,
  deleteItem,
  getCategories
}; 