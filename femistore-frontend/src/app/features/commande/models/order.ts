import { OrderItem } from 'src/app/features/commande/models/order-item';

export interface Order {
  id?: number;
  userId: number;
  email: string;
  statut?: 'PENDING' | 'EXPIRED' | 'DELIVERED' | 'CANCELLED';
  totalPrice?: number;
  orderItems: OrderItem[];
}
