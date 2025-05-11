'use server';

// No longer importing from '@/lib/firebase/admin'
// Import the new mock order action
import { createOrder as createMockOrder } from '@/app/admin/actions/orderActions'; 
import type { OrderItem } from '@/lib/types';
import type { DeliveryInfo } from '@/lib/schemas';

interface CreateOrderInput {
  deliveryInfo: DeliveryInfo;
  items: OrderItem[];
  totalAmount: number;
  userId?: string; // Optional
}

export async function createOrder(orderInput: CreateOrderInput): Promise<{ orderId: string }> {
  try {
    // Ensure items are plain objects
    const plainItems = orderInput.items.map(item => ({ ...item }));

    // Call the mock order creation function
    const { orderId } = await createMockOrder({
      deliveryInfo: orderInput.deliveryInfo,
      items: plainItems,
      totalAmount: orderInput.totalAmount,
      ...(orderInput.userId && { userId: orderInput.userId }),
    });

    return { orderId };
  } catch (error) {
    console.error("Error creating mock order:", error);
    throw new Error("Failed to create order. Please try again.");
  }
}
