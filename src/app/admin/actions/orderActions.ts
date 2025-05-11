'use server';

import { 
    getMockOrders, 
    updateMockOrderStatus, 
    getMockOrderById,
    createMockOrder as createMockOrderInStore
} from '@/lib/mockDataStore';
import type { Order, OrderItem } from '@/lib/types';
import type { DeliveryInfo } from '@/lib/schemas';

export async function getOrders(): Promise<Order[]> {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 50));
  return getMockOrders();
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 50));
  try {
    const updatedOrder = updateMockOrderStatus(orderId, status);
    if (!updatedOrder) {
      throw new Error("Order not found or update failed.");
    }
  } catch (error) {
    console.error("Error updating order status in mock store:", error);
    throw new Error("Failed to update order status.");
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 50));
  const order = getMockOrderById(orderId);
  return order || null;
}

interface CreateOrderInput {
  deliveryInfo: DeliveryInfo;
  items: OrderItem[];
  totalAmount: number;
  userId?: string; // Optional
}

// This function is used by the cart page, ensure it's exported and works with mock store
export async function createOrder(orderInput: CreateOrderInput): Promise<{ orderId: string }> {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 50));
  try {
    const newOrder = createMockOrderInStore({
        deliveryInfo: orderInput.deliveryInfo,
        items: orderInput.items,
        totalAmount: orderInput.totalAmount,
        ...(orderInput.userId && { userId: orderInput.userId }),
        // status will be 'Pending' by default in createMockOrderInStore
    });
    return { orderId: newOrder.id };
  } catch (error) {
    console.error("Error creating order in mock store:", error);
    throw new Error("Failed to create order. Please try again.");
  }
}
