
'use server';

import { firestore } from '@/lib/firebase/admin';
import type { Order, CustomerProfile } from '@/lib/types';
import type { Timestamp as AdminTimestamp } from 'firebase-admin/firestore';

const ORDERS_COLLECTION = 'orders';

export async function getCustomerProfiles(): Promise<CustomerProfile[]> {
  try {
    const ordersSnapshot = await firestore.collection(ORDERS_COLLECTION).orderBy('orderDate', 'desc').get();
    if (ordersSnapshot.empty) {
      return [];
    }

    const customerMap = new Map<string, CustomerProfile>();

    ordersSnapshot.docs.forEach(doc => {
      const order = doc.data() as Omit<Order, 'id'>; // ID is not needed here
      const email = order.deliveryInfo.email.toLowerCase();
      const orderDate = (order.orderDate as AdminTimestamp)?.toDate ? (order.orderDate as AdminTimestamp).toDate() : new Date();

      if (!customerMap.has(email)) {
        customerMap.set(email, {
          id: email,
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
        // Update name if a more recent order has a different one (though less likely for same email)
        customer.name = order.deliveryInfo.name; 
      }
    });
    
    return Array.from(customerMap.values()).sort((a,b) => (b.lastOrderDate as Date).getTime() - (a.lastOrderDate as Date).getTime());

  } catch (error) {
    console.error("Error fetching customer profiles:", error);
    throw new Error("Failed to fetch customer profiles.");
  }
}
