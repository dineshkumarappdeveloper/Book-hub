'use server';

import { database } from '@/lib/firebase/admin';
import type { Order, OrderItem } from '@/lib/types';
import type { DeliveryInfo } from '@/lib/schemas';
import admin from 'firebase-admin';

const ORDERS_REF = 'orders';

interface CreateOrderInput {
  deliveryInfo: DeliveryInfo;
  items: OrderItem[];
  totalAmount: number;
  userId?: string; // Optional
}

export async function createOrder(orderInput: CreateOrderInput): Promise<{ orderId: string }> {
  try {
    const newOrderRef = database.ref(ORDERS_REF).push();
    const timestamp = admin.database.ServerValue.TIMESTAMP;

    // Ensure items are plain objects, not Firestore-specific or other complex types if they were
    const plainItems = orderInput.items.map(item => ({ ...item }));


    const orderData: Omit<Order, 'id' | 'orderDate'> & { orderDate: object } = {
      deliveryInfo: orderInput.deliveryInfo,
      items: plainItems,
      totalAmount: orderInput.totalAmount,
      status: 'Pending',
      orderDate: timestamp, // ServerValue.TIMESTAMP placeholder
      ...(orderInput.userId && { userId: orderInput.userId }),
    };

    await newOrderRef.set(orderData);

    return { orderId: newOrderRef.key! };
  } catch (error) {
    console.error("Error creating order in RTDB:", error);
    throw new Error("Failed to create order. Please try again.");
  }
}
