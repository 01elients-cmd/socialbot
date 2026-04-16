const { Pool } = require('pg');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  console.warn('⚠️ DATABASE_URL no está definida. Verifica tu archivo .env o configuración en Render.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en el pool de PostgreSQL:', err.message);
});

module.exports = pool;
