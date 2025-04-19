export interface Stock {
    id_stock?: number
    productId: number
    stockDisponible: number
    stock_minimum: number
    fournisseur_id: number
    productName?: string // For UI display only
    supplierName?: string // For UI display only
  }
  
  export interface StockHistory {
    id?: number
    productId: number
    quantityChange: number // Positive for additions, negative for removals
    timestamp: Date
    reason: string
  }
  
  export interface StockTrend {
    productId: number
    trend: string
    suggestedStock: number
    predictedDemand?: number
    stockDisponible?: number
    stockMinimum?: number
  }
  
  export interface Supplier {
    id: number
    name: string
    email?: string
    phone?: string
    address?: string
  }
  
  export interface Product {
    id: number
    name: string
    description?: string
    price?: number
    categoryId?: number
    imageUrl?: string
  }
  