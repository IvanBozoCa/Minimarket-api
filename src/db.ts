// src/db.ts
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // opcional: si estás en local puedes usar host, port, user, etc.
  // host: "localhost",
  // port: 5432,
  // user: "postgres",
  // password: "tu_password",
  // database: "minimarket",
});

// Puedes seguir usando esta función en tu capa de datos
export async function query<T = unknown>(text: string, params?: unknown[]) {
  const result = await pool.query<T>(text, params);
  return result;
}
