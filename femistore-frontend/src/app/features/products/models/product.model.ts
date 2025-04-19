export interface Product {
    id?: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    imageUrl?: string;
    discountPercentage?: number; // Add this to match the backend
  }