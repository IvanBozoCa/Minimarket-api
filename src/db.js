// src/db.js
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "Simon",
  database: process.env.DB_NAME || "minimarket_sanFelipe",
});

// Función de ayuda para hacer consultas
async function query(text, params) {
  return pool.query(text, params);
}

module.exports = {
  query,
};
