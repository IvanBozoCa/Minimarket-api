// src/routes/sales.routes.ts
import { Router, Request, Response } from "express";
import { createSale, getAllSales } from "../data/sales";
import { CreateSaleItemPayload } from "../types/sale";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const sales = await getAllSales();
    return res.json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const { items } = req.body as { items: CreateSaleItemPayload[] };

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({
      message: "items must be an array",
    });
  }

  try {
    const sale = await createSale(items);
    return res.status(201).json(sale);
  } catch (error: any) {
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
    console.error("Error creating sale:");
    console.error(" message:", error?.message);
    console.error(" code:", error?.code);
    console.error(" full error:", error);
    console.error("Error creating sale:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
