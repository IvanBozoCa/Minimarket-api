// src/data/sales.ts
import { Sale, SaleItem, CreateSaleItemPayload } from "../types/sale";
import { findProductByCode, decreaseProductStock } from "./products";

const sales: Sale[] = [];
let nextSaleId = 1;

/**
 * Crea una venta a partir de los items enviados por el cliente.
 * - Lee productos desde Supabase (findProductByCode).
 * - Disminuye stock (decreaseProductStock).
 * - Guarda la venta en memoria.
 */
export async function createSale(
  itemsPayload: CreateSaleItemPayload[]
): Promise<Sale> {
  // 1) Validar que itemsPayload sea un array no vacío.
  //    - Si no, lanza un Error con error.code = "INVALID_ITEMS"

  // 2) Recorrer itemsPayload y por cada item:
  //    - Desestructurar { productCode, quantity }
  //    - Validar que productCode exista y quantity sea > 0
  //      (si no, lanza error con algún code tipo "INVALID_ITEM_PRODUCT_CODE" o "INVALID_QUANTITY")
  //    - Buscar el producto con findProductByCode(productCode)
  //      - Si no existe, lanza error "PRODUCT_NOT_FOUND"
  //    - Construir un SaleItem:
  //      {
  //        productCode,
  //        name: product.name,
  //        unitPrice: product.price,
  //        quantity,
  //        subtotal: product.price * quantity
  //      }
  //    - Ir acumulando todos los SaleItem en un array saleItems: SaleItem[]

  // 3) Disminuir stock.
  //    - Recorrer itemsPayload (o saleItems) y para cada uno:
  //      await decreaseProductStock(productCode, quantity)
  //    - Recuerda que decreaseProductStock puede lanzar:
  //      - "PRODUCT_NOT_FOUND"
  //      - "INSUFFICIENT_STOCK"

  // 4) Calcular el total de la venta:
  //    - total = saleItems.reduce((acc, item) => acc + item.subtotal, 0);

  // 5) Construir el objeto sale: Sale
  //    {
  //      id: nextSaleId,
  //      createdAt: new Date().toISOString(),
  //      items: saleItems,
  //      total
  //    }
  //    - Incrementar nextSaleId
  //    - Hacer sales.push(sale)

  // 6) Retornar sale

  // TODO: Implementar todo lo anterior paso a paso
}

/**
 * Devuelve todas las ventas almacenadas en memoria.
 */
export function getAllSales(): Sale[] {
  return sales;
}
