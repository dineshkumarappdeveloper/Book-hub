
import { z } from 'zod';

export const deliveryInfoSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  addressLine1: z.string().min(5, { message: "Address is too short." }),
  addressLine2: z.string().optional(),
  city: z.string().min(2, { message: "City is required." }),
  state: z.string().min(2, { message: "State is required." }),
  zipCode: z.string().min(5, { message: "Zip code must be at least 5 digits." }).regex(/^\d{5}(?:[-\s]\d{4})?$/, { message: "Invalid zip code format." }),
  country: z.string().min(2, { message: "Country is required." }),
});

export type DeliveryInfo = z.infer<typeof deliveryInfoSchema>;
