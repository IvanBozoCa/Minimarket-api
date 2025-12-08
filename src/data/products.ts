// src/data/products.ts
import { query } from "../db";
import { Product } from "../types/product";

/**
 * Devuelve todos los productos.
 */
export async function getAllProducts(): Promise<Product[]> {
  const sql = `
    SELECT code, barcode, name, price, stock
    FROM products.products  -- O public.products según tu schema
    ORDER BY code;
  `;

  const result = await query<Product>(sql);
  return result.rows;
}

/**
 * Busca un producto por code interno (SKU).
 */
export async function findProductByCode(code: string): Promise<Product | null> {
  const sql = `
    SELECT code, barcode, name, price, stock
    FROM products.products
    WHERE code = $1;
  `;
  const result = await query<Product>(sql, [code]);

  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0];
}

/**
 * Busca un producto por barcode.
 */
export async function findProductByBarcode(
  barcode: string
): Promise<Product | null> {
  const sql = `
    SELECT code, barcode, name, price, stock
    FROM products.products
    WHERE barcode = $1;
  `;
  const result = await query<Product>(sql, [barcode]);

  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0];
}

/**
 * Crea un producto nuevo.
 */
export async function addProduct(input: Product): Promise<Product> {
  const { code, barcode, name, price, stock } = input;

  const sql = `
    INSERT INTO products.products (code, barcode, name, price, stock)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING code, barcode, name, price, stock;
  `;

  try {
    const result = await query<Product>(sql, [
      code,
      barcode,
      name,
      price,
      stock,
    ]);
    return result.rows[0];
  } catch (error: any) {
    if (error.code === "23505") {
      const detail: string = error.detail || "";
      if (detail.includes("(code)")) {
        const err = new Error("Product code already exists");
        // @ts-expect-error agregamos un code custom
        err.code = "PRODUCT_CODE_EXISTS";
        throw err;
      }
      if (detail.includes("(barcode)")) {
        const err = new Error("Product barcode already exists");
        // @ts-expect-error agregamos un code custom
        err.code = "PRODUCT_BARCODE_EXISTS";
        throw err;
      }
    }
    throw error;
  }
}
