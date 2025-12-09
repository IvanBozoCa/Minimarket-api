// src/data/products.ts
import { supabase } from "../supabaseClient";
import { Product } from "../types/product";

/**
 * Devuelve todos los productos.
 */
export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("code, barcode, name, price, stock")
    .order("code", { ascending: true });

  if (error) {
    throw error;
  }

  // Supabase ya devuelve un array tipado dinámicamente
  return (data ?? []) as Product[];
}

/**
 * Busca un producto por código interno (SKU).
 */
export async function findProductByCode(
  code: string
): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("code, barcode, name, price, stock")
    .eq("code", code)
    .maybeSingle(); // devuelve null si no hay fila

  if (error) {
    throw error;
  }

  return (data as Product | null) ?? null;
}

/**
 * Busca un producto por código de barras.
 */
export async function findProductByBarcode(
  barcode: string
): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("code, barcode, name, price, stock")
    .eq("barcode", barcode)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as Product | null) ?? null;
}

/**
 * Crea un producto nuevo.
 */
export async function addProduct(input: Product): Promise<Product> {
  const { code, barcode, name, price, stock } = input;

  const { data, error } = await supabase
    .from("products")
    .insert([{ code, barcode, name, price, stock }])
    .select("code, barcode, name, price, stock")
    .single();

  if (error) {
    // Aquí podrías mirar error.code o error.message
    // para mapear errores de unique a códigos custom.
    throw error;
  }

  return data as Product;
}

/**
 * Disminuye el stock del producto.
 */
export async function decreaseProductStock(
  code: string,
  quantity: number
): Promise<Product> {
  if (typeof quantity !== "number" || quantity <= 0) {
    const error = new Error("quantity must be a number greater than 0");
    // @ts-expect-error código custom
    error.code = "INVALID_QUANTITY";
    throw error;
  }

  // 1) Leer producto actual
  const product = await findProductByCode(code);

  if (!product) {
    const error = new Error(`Product with code ${code} not found`);
    // @ts-expect-error código custom
    error.code = "PRODUCT_NOT_FOUND";
    throw error;
  }

  if (product.stock - quantity < 0) {
    const error = new Error(`Not enough stock for product ${code}`);
    // @ts-expect-error código custom
    error.code = "INSUFFICIENT_STOCK";
    throw error;
  }

  const newStock = product.stock - quantity;

  // 2) Actualizar stock en BD
  const { data, error } = await supabase
    .from("products")
    .update({ stock: newStock })
    .eq("code", code)
    .select("code, barcode, name, price, stock")
    .single();

  if (error) {
    throw error;
  }

  return data as Product;
}
