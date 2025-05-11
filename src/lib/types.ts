
import type { DeliveryInfo } from './schemas';

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string; // URL to the image
  price: number;
  createdAt?: number; // Timestamp as number (e.g., Date.now())
  updatedAt?: number; // Timestamp as number
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
  orderDate: number; // Timestamp as number
  updatedAt?: number; // Optional: for tracking order updates
  userId?: string; // Optional: if you have user accounts
}

// Simplified for mock auth, password stored directly (NOT FOR PRODUCTION)
export interface AdminUser {
  id: string;
  username: string;
  password?: string; // For mock purposes, store plaintext
  role: 'admin';
  createdAt: number;
}

// For "Users" tab in admin, representing customers
export interface CustomerProfile {
  id: string; // could be email or a generated ID
  name: string;
  email: string;
  firstOrderDate?: number;
  lastOrderDate?: number;
  totalOrders?: number;
  totalSpent?: number;
}
