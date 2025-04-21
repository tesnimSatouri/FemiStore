import { StockDetails } from './stock.model';
export interface Product {
    id?: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    discountPercentage?: number;
    imageUrl?: string;
    stockDetails?: StockDetails; // Add stock details
}
