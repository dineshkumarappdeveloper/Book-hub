'use server';

import { getMockCustomerProfiles } from '@/lib/mockDataStore';
import type { CustomerProfile } from '@/lib/types';

export async function getCustomerProfiles(): Promise<CustomerProfile[]> {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 50));
  try {
    return getMockCustomerProfiles();
  } catch (error) {
    console.error("Error fetching mock customer profiles:", error);
    throw new Error("Failed to fetch customer profiles.");
  }
}
