// src/routes/products.routes.js
const express = require("express");
const {
  addProduct,
  getAllProducts,
  findProductByBarcode,
} = require("../data/products");

const router = express.Router();

/**
 * GET /products
 * Devuelve la lista completa de productos.
 */
router.get("/", async (req, res) => {
  try {
    const db = await getAllProducts();
    return res.json(db);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * GET /products/barcode/:barcode
 * Busca un producto por código de barras.
 */
router.get("/barcode/:barcode", async (req, res) => {
  const { barcode } = req.params;

  try {
    const product = await findProductByBarcode(barcode);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  } catch (error) {
    console.error("Error fetching product by barcode:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * POST /products
 * Crea un nuevo producto.
 */
router.post("/", async (req, res) => {
  const { code, barcode, name, price, stock } = req.body;

  if (!code || !barcode || !name || price === undefined || stock === undefined) {
    return res.status(400).json({
      message: "code, barcode, name, price and stock are required",
    });
  }

  if (typeof price !== "number" || price <= 0) {
    return res.status(400).json({
      message: "price must be a number greater than 0",
    });
  }

  if (!Number.isInteger(stock) || stock < 0) {
    return res.status(400).json({
      message: "stock must be an integer greater or equal to 0",
    });
  }

  try {
    const product = await addProduct({ code, barcode, name, price, stock });
    return res.status(201).json(product);
  } catch (error) {
    if (
      error.code === "PRODUCT_CODE_EXISTS" ||
      error.code === "PRODUCT_BARCODE_EXISTS"
    ) {
      return res.status(409).json({ message: error.message });
    }

    console.error("Error creating product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
