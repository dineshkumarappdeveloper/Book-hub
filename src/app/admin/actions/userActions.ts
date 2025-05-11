'use server';

import { database } from '@/lib/firebase/admin';
import type { Order, CustomerProfile } from '@/lib/types';

const ORDERS_REF = 'orders';

export async function getCustomerProfiles(): Promise<CustomerProfile[]> {
  try {
    // Fetch all orders to derive customer profiles
    // Note: For very large datasets, this might be inefficient.
    // Consider denormalizing customer data or using Firebase Functions for aggregation.
    const ordersSnapshot = await database.ref(ORDERS_REF).orderByChild('orderDate').once('value');
    if (!ordersSnapshot.exists()) {
      return [];
    }

    const customerMap = new Map<string, CustomerProfile>();
    
    ordersSnapshot.forEach(docSnapshot => {
      const orderId = docSnapshot.key!;
      const order = docSnapshot.val() as Omit<Order, 'id'>; // RTDB data

      if (!order.deliveryInfo || !order.deliveryInfo.email) return; // Skip if essential info is missing

      const email = order.deliveryInfo.email.toLowerCase();
      // Order date from RTDB will be a number (timestamp)
      const orderDateMs = order.orderDate as number; 
      const orderDate = new Date(orderDateMs);


      if (!customerMap.has(email)) {
        customerMap.set(email, {
          id: email, // Using email as ID for simplicity
          name: order.deliveryInfo.name,
          email: order.deliveryInfo.email,
          firstOrderDate: orderDate,
          lastOrderDate: orderDate,
          totalOrders: 0,
          totalSpent: 0,
        });
      }

      const customer = customerMap.get(email)!;
      customer.totalOrders! += 1;
      customer.totalSpent! += order.totalAmount;

      if (orderDate < (customer.firstOrderDate as Date)) {
        customer.firstOrderDate = orderDate;
      }
      if (orderDate > (customer.lastOrderDate as Date)) {
        customer.lastOrderDate = orderDate;
        customer.name = order.deliveryInfo.name; // Update name if different in a more recent order
      }
    });
    
    return Array.from(customerMap.values()).sort((a,b) => (b.lastOrderDate as Date).getTime() - (a.lastOrderDate as Date).getTime());

  } catch (error) {
    console.error("Error fetching customer profiles from RTDB orders:", error);
    throw new Error("Failed to fetch customer profiles.");
  }
}
