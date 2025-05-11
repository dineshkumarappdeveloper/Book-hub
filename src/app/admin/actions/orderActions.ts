'use server';

import { database } from '@/lib/firebase/admin';
import type { Order } from '@/lib/types';
import admin from 'firebase-admin';

const ORDERS_REF = 'orders';

export async function getOrders(): Promise<Order[]> {
  try {
    const snapshot = await database.ref(ORDERS_REF).orderByChild('orderDate').once('value');
    if (!snapshot.exists()) {
      return [];
    }
    const ordersData = snapshot.val();
    const ordersArray: Order[] = [];
    snapshot.forEach(childSnapshot => {
        const order = childSnapshot.val();
        ordersArray.push({
            ...order,
            id: childSnapshot.key,
            orderDate: new Date(order.orderDate),
            updatedAt: order.updatedAt ? new Date(order.updatedAt) : undefined,
        } as Order);
    });
    return ordersArray.reverse(); // For descending order
  } catch (error) {
    console.error("Error fetching orders from RTDB:", error);
    throw new Error("Failed to fetch orders.");
  }
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  try {
    const orderRef = database.ref(`${ORDERS_REF}/${orderId}`);
    await orderRef.update({
      status: status,
      updatedAt: admin.database.ServerValue.TIMESTAMP,
    });
  } catch (error) {
    console.error("Error updating order status in RTDB:", error);
    throw new Error("Failed to update order status.");
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const snapshot = await database.ref(`${ORDERS_REF}/${orderId}`).once('value');
    if (!snapshot.exists()) {
      return null;
    }
    const orderData = snapshot.val();
    return {
      id: snapshot.key,
      ...orderData,
      orderDate: new Date(orderData.orderDate),
      updatedAt: orderData.updatedAt ? new Date(orderData.updatedAt) : undefined,
    } as Order;
  } catch (error)
 {
    console.error("Error fetching order by ID from RTDB:", error);
    throw new Error("Failed to fetch order details.");
  }
}
