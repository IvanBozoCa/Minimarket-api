// src/routes/sales.routes.js
const express = require("express");
const { createSale, getAllSales } = require("../data/sales");

const router = express.Router();

/**
 * GET /sales
 * Devuelve la lista de ventas (en memoria).
 */
router.get("/", (req, res) => {
  const sales = getAllSales();
  return res.json(sales);
});

/**
 * POST /sales
 * Crea una nueva venta y devuelve la "boleta".
 */
router.post("/", async (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({
      message: "items must be an array",
    });
  }

  try {
    const sale = await createSale(items);
    return res.status(201).json(sale);
  } catch (error) {
    const validationCodes = new Set([
      "INVALID_ITEMS",
      "INVALID_ITEM_PRODUCT_CODE",
      "INVALID_ITEM_QUANTITY",
      "INVALID_QUANTITY",
      "PRODUCT_NOT_FOUND",
      "INSUFFICIENT_STOCK",
    ]);

    if (validationCodes.has(error.code)) {
      return res.status(400).json({ message: error.message });
    }

    console.error("Error creating sale:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
