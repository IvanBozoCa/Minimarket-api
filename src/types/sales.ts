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
  createdAt: string;
  items: SaleItem[];
  total: number;
}
