
'use server';

import { firestore } from '@/lib/firebase/admin';
import type { Order, OrderItem } from '@/lib/types';
import type { DeliveryInfo } from '@/lib/schemas';
import { FieldValue } from 'firebase-admin/firestore';

const ORDERS_COLLECTION = 'orders';

interface CreateOrderInput {
  deliveryInfo: DeliveryInfo;
  items: OrderItem[];
  totalAmount: number;
  userId?: string; // Optional
}

export async function createOrder(orderInput: CreateOrderInput): Promise<{ orderId: string }> {
  try {
    const newOrderRef = firestore.collection(ORDERS_COLLECTION).doc();
    const timestamp = FieldValue.serverTimestamp();

    const orderData: Omit<Order, 'id'> & { orderDate: FieldValue } = {
      deliveryInfo: orderInput.deliveryInfo,
      items: orderInput.items,
      totalAmount: orderInput.totalAmount,
      status: 'Pending',
      orderDate: timestamp,
      ...(orderInput.userId && { userId: orderInput.userId }),
    };

    await newOrderRef.set(orderData);

    return { orderId: newOrderRef.id };
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Failed to create order. Please try again.");
  }
}
