// src/data/products.js
const db = require("../db")
const products = [];

let nextId = 1;

/**
 * Crea y registra un nuevo producto en memoria.
 *
 */
async function addProduct({ code, barcode, name, price, stock }) {
  const insertQuery = 
  `
    INSERT INTO products (code, barcode, name, price, stock)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING code, barcode, name, price, stock;
  `;

  try {
    const result = await db.query(insertQuery, [
      code,
      barcode,
      name,
      price,
      stock,
    ]);
    return result.rows[0];
  } catch (error) {
    // 23505 = unique_violation en PostgreSQL
    if (error.code === "23505") {
      const message = error.detail || "";

      if (message.includes("(code)")) {
        const err = new Error("Product code already exists");
        err.code = "PRODUCT_CODE_EXISTS";
        throw err;
      }

      if (message.includes("(barcode)")) {
        const err = new Error("Product barcode already exists");
        err.code = "PRODUCT_BARCODE_EXISTS";
        throw err;
      }
    }

    // Otros errores
    throw error;
  }
}

/**
 * Devuelve todos los productos registrados.
 * Más adelante podríamos filtrar/ordenar, pero por ahora simplemente retorna el array.
 */
async function getAllProducts() {
  const query = 
  `SELECT code, barcode, name, price, stock
  FROM products
  ORDER BY id`
  const result = await db.query(query)

  return result.rows;
  //   return products;
}

/**
 * Busca un producto por su code interno (SKU).
 * Devuelve el producto o null si no existe.
 */
async function findProductByCode(code) {
  const query = 
  `SELECT code, barcode, name, price, stock
  FROM products
  WHERE code = $1`

  const result = await db.query(query,[code]);
  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0];
}

/**
 * Busca un producto por su código de barras.
 * Devuelve el producto o null si no existe.
 */
async function findProductByBarcode(barcode) {
  const query = 
  `SELECT code, barcode, name, price, stock
  FROM products
  WHERE barcode = $1`

  const result = await db.query(query,[barcode]);
  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0];
}

async function decreaseProductStock(code, quantity) {
  if (typeof quantity !== "number" || quantity <= 0) {
    const error = new Error("quantity must be a number greater than 0");
    error.code = "INVALID_QUANTITY";
    throw error;
  }

  const updateQuery = `
    UPDATE products
    SET stock = stock - $1
    WHERE code = $2
      AND stock - $1 >= 0
    RETURNING id, code, barcode, name, price, stock;
  `;

  const result = await db.query(updateQuery, [quantity, code]);

  if (result.rowCount === 0) {
    const checkQuery = `
      SELECT id, code, barcode, name, price, stock
      FROM products
      WHERE code = $1;
    `;
    const checkResult = await db.query(checkQuery, [code]);

    if (checkResult.rowCount === 0) {
      const error = new Error(`Product with code ${code} not found`);
      error.code = "PRODUCT_NOT_FOUND";
      throw error;
    }

    const error = new Error(`Not enough stock for product ${code}`);
    error.code = "INSUFFICIENT_STOCK";
    throw error;
  }

  const updatedProduct = result.rows[0];
  return updatedProduct;
}


// Exportamos las funciones para usarlas en los routers.
// Esto es como cuando importabas tus funciones de repositorio en FastAPI.
module.exports = {
  addProduct,
  getAllProducts,
  findProductByCode,
  findProductByBarcode,
  decreaseProductStock,
};
