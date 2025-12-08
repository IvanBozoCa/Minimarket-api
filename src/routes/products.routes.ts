// src/routes/products.routes.ts
import { Router, Request, Response } from "express";
import {
  addProduct,
  getAllProducts,
  findProductByBarcode,
} from "../data/products";
import { Product } from "../types/product";

const router = Router();

/**
 * GET /products
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const products = await getAllProducts();
    return res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * GET /products/barcode/:barcode
 */
router.get("/barcode/:barcode", async (req: Request, res: Response) => {
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
 */
router.post("/", async (req: Request, res: Response) => {
  const { code, barcode, name, price, stock } = req.body as Product;

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
  } catch (error: any) {
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

export default router;
