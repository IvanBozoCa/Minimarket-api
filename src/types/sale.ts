// src/types/sale.ts

export interface SaleItem {
  productCode: string;
  name: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Sale {
  id: number;
  createdAt: string; // ISO string
  items: SaleItem[];
  total: number;
}

// Payload que te enviará el cliente al crear una venta
export interface CreateSaleItemPayload {
  productCode: string;
  quantity: number;
}
