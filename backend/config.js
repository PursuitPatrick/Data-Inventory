const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

// Database Configuration (read from environment variables with sane defaults)
// Supports both DB_* and PG* environment variable names
// Optionally allow a single connection string (Render, Heroku, etc.)
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.PGURL;

// Enable SSL in production or when explicitly requested
const shouldUseSsl = (
  process.env.DB_SSL === '1' ||
  process.env.DB_SSL === 'true' ||
  process.env.PGSSLMODE === 'require' ||
  (process.env.NODE_ENV || '').toLowerCase() === 'production'
);

const dbConfig = connectionString
  ? {
      connectionString,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      ssl: shouldUseSsl ? { rejectUnauthorized: false } : false,
    }
  : {
      host: process.env.DB_HOST || process.env.PGHOST || 'localhost',
      port: Number.parseInt(process.env.DB_PORT || process.env.PGPORT || '5432', 10),
      database: process.env.DB_NAME || process.env.PGDATABASE || 'inventory_db',
      user: process.env.DB_USER || process.env.PGUSER || 'postgres',
      password: (() => {
        const pwd = process.env.DB_PASSWORD ?? process.env.PGPASSWORD ?? '';
        return typeof pwd === 'string' ? pwd : String(pwd);
      })(),
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      ssl: shouldUseSsl ? { rejectUnauthorized: false } : false,
    };

// Server Configuration
const serverConfig = {
  port: Number.parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
};

module.exports = {
  dbConfig,
  serverConfig
}; 