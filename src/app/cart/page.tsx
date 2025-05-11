
'use client';

import { Navbar } from '@/components/navbar';
import { SearchBar } from '@/components/search-bar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/cart-context';
import { CartItemCard } from '@/components/cart/cart-item-card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, CreditCard, Home, Mail, User, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { deliveryInfoSchema, type DeliveryInfo } from '@/lib/schemas';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';


export default function CartPage() {
  const { cartItems, getCartTotal, clearCart, getCartItemCount } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(''); 
  const [mounted, setMounted] = useState(false);

  const formMethods = useForm<DeliveryInfo>({
    resolver: zodResolver(deliveryInfoSchema),
    defaultValues: {
      name: '',
      email: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleCheckout = (data: DeliveryInfo) => {
    if (!mounted) return;

    console.log('Delivery Information:', data);
    
    toast({
      title: 'Order Placed Successfully!',
      description: `Your order with Cash on Delivery has been placed. It will be delivered to ${data.addressLine1}, ${data.city}. You will receive a confirmation email at ${data.email}.`,
      duration: 7000,
    });
    clearCart();
    router.push('/'); 
  };

  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar searchBarComponent={<SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="flex items-center p-4 border rounded-lg bg-card">
                    <div className="w-24 h-32 bg-muted rounded-md mr-4"></div>
                    <div className="flex-grow space-y-2">
                      <div className="h-6 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                    </div>
                    <div className="w-20 h-8 bg-muted rounded ml-4"></div>
                  </div>
                ))}
              </div>
              <div className="lg:col-span-1">
                <div className="sticky top-24 p-6 bg-card rounded-lg shadow-lg">
                    <div className="h-6 bg-muted rounded w-1/2 mb-4"></div>
                    {/* Delivery form skeleton */}
                    <div className="space-y-3 mb-4">
                        <div className="h-4 bg-muted rounded w-1/4"></div>
                        <div className="h-10 bg-muted rounded w-full"></div>
                        <div className="h-4 bg-muted rounded w-1/4"></div>
                        <div className="h-10 bg-muted rounded w-full"></div>
                        <div className="h-4 bg-muted rounded w-1/4"></div>
                        <div className="h-10 bg-muted rounded w-full"></div>
                    </div>
                    <div className="h-8 bg-muted rounded w-1/4 ml-auto mb-4"></div>
                    <div className="h-12 bg-primary rounded w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <footer className="py-6 text-center text-sm text-muted-foreground border-t mt-auto">
          © {new Date().getFullYear()} BookBuy Hub. All rights reserved.
        </footer>
      </div>
    );
  }


  return (
    <div className="flex flex-col min-h-screen">
      <Navbar searchBarComponent={<SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Button asChild variant="outline" className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Storefront
          </Link>
        </Button>
        
        <div className="flex items-center mb-8">
          <ShoppingBag className="h-8 w-8 mr-3 text-primary" />
          <h1 className="text-3xl font-bold text-primary">Your Shopping Cart</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-muted-foreground mb-4">Your cart is empty.</p>
            <Button asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(handleCheckout)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <CartItemCard key={item.id} item={item} />
                ))}
              </div>
              <div className="lg:col-span-1">
                <div className="sticky top-24 p-6 bg-card rounded-lg shadow-lg space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-primary flex items-center">
                      <Home className="mr-2 h-5 w-5" /> Delivery Information
                    </h2>
                    <div className="space-y-4">
                      <FormField
                        control={formMethods.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center"><User className="mr-2 h-4 w-4 text-muted-foreground" />Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} className="focus-visible:ring-accent" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={formMethods.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground" />Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="you@example.com" {...field} className="focus-visible:ring-accent" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={formMethods.control}
                        name="addressLine1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-muted-foreground" />Address Line 1</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main St" {...field} className="focus-visible:ring-accent" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={formMethods.control}
                        name="addressLine2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-muted-foreground" />Address Line 2 (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Apt, suite, etc." {...field} className="focus-visible:ring-accent" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={formMethods.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="Anytown" {...field} className="focus-visible:ring-accent" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={formMethods.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State / Province</FormLabel>
                              <FormControl>
                                <Input placeholder="CA" {...field} className="focus-visible:ring-accent" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                       <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={formMethods.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Zip / Postal Code</FormLabel>
                              <FormControl>
                                <Input placeholder="90210" {...field} className="focus-visible:ring-accent" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={formMethods.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input placeholder="United States" {...field} className="focus-visible:ring-accent" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-primary">Order Summary</h2>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal ({getCartItemCount()} items)</span>
                        <span className="font-medium">${getCartTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-medium">Free</span>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-between font-bold text-lg mb-6">
                      <span>Total</span>
                      <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                    <Button 
                      type="submit"
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                      size="lg"
                      disabled={formMethods.formState.isSubmitting || !mounted || cartItems.length === 0}
                    >
                      <CreditCard className="mr-2 h-5 w-5" /> {formMethods.formState.isSubmitting ? 'Processing...' : 'Checkout with Cash'}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2 text-center">You will pay upon delivery.</p>
                  </div>
                </div>
              </div>
            </form>
          </FormProvider>
        )}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t mt-auto">
        © {new Date().getFullYear()} BookBuy Hub. All rights reserved.
      </footer>
    </div>
  );
}

