const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',          // tu usuario de PostgreSQL
  host: 'localhost',
  database: 'socialbot',
  password: '51295142019**', // reemplaza con tu clave real
  port: 5432
});

module.exports = pool;
