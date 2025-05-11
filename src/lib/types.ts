
import type { Timestamp } from 'firebase/firestore'; // For client-side, admin SDK uses its own
import type { DeliveryInfo } from './schemas';

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string; // URL to the image
  price: number;
  createdAt?: Timestamp | Date; // Allow Date for server actions, Timestamp for Firestore
  updatedAt?: Timestamp | Date;
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
  orderDate: Timestamp | Date; // Firestore Timestamp
  userId?: string; // Optional: if you have user accounts
}

// For clarity, if we were to manage admin users in Firestore
export interface AdminUserInfo {
  uid: string;
  username: string;
  // passwordHash: string; // Store hash, not plain password
  role: 'admin';
  createdAt: Timestamp | Date;
}

// For "Users" tab in admin, representing customers
export interface CustomerProfile {
  id: string; // could be email or a generated ID
  name: string;
  email: string;
  firstOrderDate?: Timestamp | Date;
  lastOrderDate?: Timestamp | Date;
  totalOrders?: number;
  totalSpent?: number;
}
