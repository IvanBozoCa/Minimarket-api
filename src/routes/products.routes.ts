// src/routes/products.routes.ts
import { Router, Request, Response } from "express";
import {
  getAllProducts,
  findProductByBarcode,
  addProduct,
} from "../data/products";
import { Product } from "../types/product";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const products = await getAllProducts();
    return res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

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

router.post("/", async (req: Request, res: Response) => {
  const { code, barcode, name, price, stock } = req.body as Product;

  if (!code || !barcode || !name || price === undefined || stock === undefined) {
    return res.status(400).json({
      message: "code, barcode, name, price and stock are required",
    });
  }

  try {
    const product = await addProduct({ code, barcode, name, price, stock });
    return res.status(201).json(product);
  } catch (error: any) {
    console.error("Error creating product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
