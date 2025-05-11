
'use server';

import { firestore } from '@/lib/firebase/admin';
import type { Order } from '@/lib/types';
import { FieldValue } from 'firebase-admin/firestore';

const ORDERS_COLLECTION = 'orders';

export async function getOrders(): Promise<Order[]> {
  try {
    const snapshot = await firestore.collection(ORDERS_COLLECTION).orderBy('orderDate', 'desc').get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        // Ensure Timestamps are converted if client needs serializable dates
        // orderDate: data.orderDate.toDate(), 
        ...data,
      } as Order;
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders.");
  }
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  try {
    const orderRef = firestore.collection(ORDERS_COLLECTION).doc(orderId);
    await orderRef.update({
      status: status,
      updatedAt: FieldValue.serverTimestamp(), // Optional: track status updates
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status.");
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const doc = await firestore.collection(ORDERS_COLLECTION).doc(orderId).get();
    if (!doc.exists) {
      return null;
    }
    const data = doc.data();
    return {
      id: doc.id,
      // orderDate: data.orderDate.toDate(),
      ...data
    } as Order;
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    throw new Error("Failed to fetch order details.");
  }
}
