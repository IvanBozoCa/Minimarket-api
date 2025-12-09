// src/data/sales.ts
import { supabase } from "../supabaseClient";
import { Sale, SaleItem, CreateSaleItemPayload } from "../types/sale";
import { findProductByCode, decreaseProductStock } from "./products";

type AppError = Error & { code?: string };

function createError(message: string, code: string): AppError {
  const err = new Error(message) as AppError;
  err.code = code;
  return err;
}

/**
 * Crea una venta:
 * - Valida items.
 * - Busca productos en Supabase.
 * - Calcula subtotales y total.
 * - Inserta la venta en la tabla sales.
 * - Inserta los ítems en sale_items.
 * - Disminuye stock de productos.
 */
export async function createSale(
  itemsPayload: CreateSaleItemPayload[]
): Promise<Sale> {
  // 1) Validar payload
  if (!Array.isArray(itemsPayload) || itemsPayload.length === 0) {
    throw createError("items must be a non-empty array", "INVALID_ITEMS");
  }

  const saleItems: SaleItem[] = [];

  // 2) Construir SaleItem y validar cada item
  for (const itemPayload of itemsPayload) {
    const { productCode, quantity } = itemPayload;

    if (!productCode || typeof productCode !== "string") {
      throw createError(
        "productCode is required and must be a string",
        "INVALID_ITEM_PRODUCT_CODE"
      );
    }

    if (quantity === undefined) {
      throw createError(
        `quantity is required for productCode ${productCode}`,
        "INVALID_ITEM_QUANTITY"
      );
    }

    if (typeof quantity !== "number" || quantity <= 0) {
      throw createError(
        `quantity for productCode ${productCode} must be a number greater than 0`,
        "INVALID_QUANTITY"
      );
    }

    const product = await findProductByCode(productCode);

    if (!product) {
      throw createError(
        `Product with code ${productCode} not found`,
        "PRODUCT_NOT_FOUND"
      );
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

  // 3) Calcular total de la venta
  const total = saleItems.reduce((acc, item) => acc + item.subtotal, 0);

  // 4) Insertar la venta en Supabase (tabla sales)
  const { data: saleRow, error: saleError } = await supabase
    .from("sales")
    .insert([{ total }])
    .select("id, created_at, total")
    .single();

  if (saleError || !saleRow) {
    throw saleError || createError("Error inserting sale", "SALE_INSERT_ERROR");
  }

  const saleId = saleRow.id as number;
  const createdAt = saleRow.created_at as string;

  // 5) Insertar los ítems de la venta en sale_items
  const itemsToInsert = saleItems.map((item) => ({
    sale_id: saleId,
    product_code: item.productCode,
    name: item.name,
    unit_price: item.unitPrice,
    quantity: item.quantity,
    subtotal: item.subtotal,
  }));

  const { error: itemsError } = await supabase
    .from("sale_items")
    .insert(itemsToInsert);

  if (itemsError) {
    throw itemsError;
  }

  // 6) Disminuir stock de cada producto
  //    (para un proyecto real haríamos todo en una transacción del lado de Postgres)
  for (const itemPayload of itemsPayload) {
    const { productCode, quantity } = itemPayload;
    await decreaseProductStock(productCode, quantity);
  }

  // 7) Construir el objeto Sale que devolverá la API
  const sale: Sale = {
    id: saleId,
    createdAt,
    items: saleItems,
    total,
  };

  return sale;
}

/**
 * Devuelve todas las ventas con sus ítems desde Supabase.
 */
export async function getAllSales(): Promise<Sale[]> {
  // Usamos la relación sales -> sale_items
  const { data, error } = await supabase
    .from("sales")
    .select(
      `
      id,
      created_at,
      total,
      sale_items (
        product_code,
        name,
        unit_price,
        quantity,
        subtotal
      )
    `
    )
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }

  if (!data) {
    return [];
  }

  // Mapear a nuestro tipo Sale
  const sales: Sale[] = data.map((row: any) => {
    const items: SaleItem[] = (row.sale_items || []).map((item: any) => ({
      productCode: item.product_code,
      name: item.name,
      unitPrice: item.unit_price,
      quantity: item.quantity,
      subtotal: item.subtotal,
    }));

    return {
      id: row.id,
      createdAt: row.created_at,
      total: row.total,
      items,
    };
  });

  return sales;
}
