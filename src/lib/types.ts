
// Note: Firebase Client SDK's Timestamp is different from Admin SDK's.
// For Realtime Database, timestamps are typically stored as numbers (milliseconds since epoch)
// or using ServerValue.TIMESTAMP. When fetched, they are numbers.
// We will use `number | Date` where Date is the representation after conversion in server actions.

import type { DeliveryInfo } from './schemas';

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string; // URL to the image
  price: number;
  createdAt?: number | Date; // RTDB: number (ms since epoch) or ServerValue.TIMESTAMP placeholder
  updatedAt?: number | Date;
}

export interface CartItem extends Book {
  quantity: number;
}

export interface OrderItem {
  bookId: string;
  title: string;
  quantity: number;
  price: number; // Price at the time of order
  coverImage: string;
}

export interface Order {
  id: string;
  deliveryInfo: DeliveryInfo;
  items: OrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderDate: number | Date; // RTDB: number (ms since epoch) or ServerValue.TIMESTAMP placeholder
  updatedAt?: number | Date; // Optional: for tracking order updates
  userId?: string; // Optional: if you have user accounts
}

export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string; // In a real app, this MUST be a securely hashed password.
  role: 'admin';
  createdAt: number | Date;
}

// For "Users" tab in admin, representing customers
export interface CustomerProfile {
  id: string; // could be email or a generated ID
  name: string;
  email: string;
  firstOrderDate?: number | Date;
  lastOrderDate?: number | Date;
  totalOrders?: number;
  totalSpent?: number;
}
