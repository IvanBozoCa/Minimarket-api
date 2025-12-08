// src/data/sales.js

const {
  findProductByCode,
  decreaseProductStock,
} = require("./products");

const sales = [];
let nextSaleId = 1;

/**
 * Crea una venta a partir de los items enviados por el cliente.
 * Usa productos desde la BD y guarda la venta en memoria.
 *
 * @param {Array<{ productCode: string, quantity: number }>} itemsPayload
 * @returns {Promise<object>} sale
 */
async function createSale(itemsPayload) {
  if (!Array.isArray(itemsPayload) || itemsPayload.length === 0) {
    const error = new Error("items must be a non-empty array");
    error.code = "INVALID_ITEMS";
    throw error;
  }

  const saleItems = [];

  // 1) Validar items y construir saleItems
  for (const item of itemsPayload) {
    const { productCode, quantity } = item;

    if (!productCode) {
      const error = new Error("productCode is required for each item");
      error.code = "INVALID_ITEM_PRODUCT_CODE";
      throw error;
    }

    if (quantity === undefined) {
      const error = new Error("quantity is required for each item");
      error.code = "INVALID_ITEM_QUANTITY";
      throw error;
    }

    if (typeof quantity !== "number" || quantity <= 0) {
      const error = new Error(
        `quantity for productCode ${productCode} must be a number greater than 0`
      );
      error.code = "INVALID_QUANTITY";
      throw error;
    }

    const product = await findProductByCode(productCode);

    if (!product) {
      const error = new Error(`Product with code ${productCode} not found`);
      error.code = "PRODUCT_NOT_FOUND";
      throw error;
    }

    const unitPrice = product.price;
    const subtotal = unitPrice * quantity;

    saleItems.push({
      productCode,
      name: product.name,
      unitPrice,
      quantity,
      subtotal,
    });
  }

  // 2) Verificar y actualizar stock
  for (const item of itemsPayload) {
    const { productCode, quantity } = item;
    await decreaseProductStock(productCode, quantity);
  }

  // 3) Calcular total
  const total = saleItems.reduce((acc, item) => acc + item.subtotal, 0);

  // 4) Crear la venta y guardarla en memoria
  const sale = {
    id: nextSaleId,
    createdAt: new Date().toISOString(),
    items: saleItems,
    total,
  };

  nextSaleId += 1;
  sales.push(sale);

  return sale;
}

/**
 * Devuelve todas las ventas (en memoria).
 */
function getAllSales() {
  return sales;
}

module.exports = {
  createSale,
  getAllSales,
};
