const { Client } = require('pg');
const cfg = { host: 'YOUR_DB_HOST', port: 5432, database: 'YOUR_DB_NAME', user: 'YOUR_DB_USER', password: 'CURRENT_DB_PASSWORD', ssl: { rejectUnauthorized: false } };
const NEW_PASSWORD = 'YOUR_NEW_HEX_PASSWORD';
(async () => { const c = new Client(cfg); await c.connect(); await c.query('ALTER ROLE CURRENT_USER WITH PASSWORD ', [NEW_PASSWORD]); console.log('Password updated.'); await c.end(); })();
