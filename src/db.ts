// src/db.ts
import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Ejecuta una consulta en la base de datos.
 * Por ahora no nos complicamos con generics.
 */
export async function query(text: string, params?: unknown[]) {
  const result = await pool.query(text, params);
  return result;
}
