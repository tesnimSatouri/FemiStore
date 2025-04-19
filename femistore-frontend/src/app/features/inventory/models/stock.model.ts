export interface Stock {
  id_stock?: number; // Matches backend's id_stock
  productId: number; // Matches backend's productId
  stockDisponible: number; // Matches backend's stockDisponible
  stock_minimum: number; // Matches backend's stock_minimum
  fournisseur_id: number; // Matches backend's fournisseur_id
  productName?: string; // For UI display
  supplierName?: string; // For UI display
}

export interface StockHistory {
  id?: number; // Matches backend's id (Long in backend, but number is fine for JS)
  productId: number; // Matches backend's productId
  quantityChange: number; // Matches backend's quantityChange
  timestamp: string | Date; // Backend uses LocalDateTime; string or Date works for deserialization
  reason: string; // Matches backend's reason
}

export interface StockTrend {
  productId: number; // Not explicitly in backend response, but can be inferred
  trend: string; // Matches backend's trend (e.g., "décroissant", "stable")
  suggestedStock: number; // Matches backend's suggestedStock
  predictedDemand: number; // Matches backend's predictedDemand
  stockDisponible: number; // Matches backend's stockDisponible
  stockMinimum: number; // Matches backend's stockMinimum
}

export interface Supplier {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price?: number;
  categoryId?: number;
  imageUrl?: string;
}