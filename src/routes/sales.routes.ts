// src/routes/sales.routes.ts
import { Router, Request, Response } from "express";
import { createSale, getAllSales } from "../data/sales";
import { CreateSaleItemPayload } from "../types/sale";

const router = Router();

/**
 * GET /sales
 * Devuelve todas las ventas.
 */
router.get("/", (req: Request, res: Response) => {
  // TODO:
  // - Obtener las ventas con getAllSales()
  // - Devolverlas con res.json(...)
});

/**
 * POST /sales
 * Crea una nueva venta y devuelve la "boleta".
 */
router.post("/", async (req: Request, res: Response) => {
  // TODO:
  // 1) Leer items desde req.body.items
  //    const { items } = req.body as { items: CreateSaleItemPayload[] };
  //
  // 2) Validar que items exista y sea un array
  //    - Si no, res.status(400).json({ message: "items must be an array" })
  //
  // 3) Usar try/catch:
  //    try {
  //      const sale = await createSale(items);
  //      return res.status(201).json(sale);
  //    } catch (error: any) {
  //      - Si error.code es uno de:
  //          "INVALID_ITEMS",
  //          "INVALID_ITEM_PRODUCT_CODE",
  //          "INVALID_ITEM_QUANTITY",
  //          "INVALID_QUANTITY",
  //          "PRODUCT_NOT_FOUND",
  //          "INSUFFICIENT_STOCK"
  //        => responder con 400 y el mensaje del error.
  //
  //      - Para cualquier otro error:
  //        console.error("Error creating sale:", error);
  //        res.status(500).json({ message: "Internal server error" });
  //    }
});

export default router;
