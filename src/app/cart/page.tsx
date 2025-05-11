'use client';

import { Navbar } from '@/components/navbar';
import { SearchBar } from '@/components/search-bar';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart-context';
import { CartItemCard } from '@/components/cart/cart-item-card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


export default function CartPage() {
  const { cartItems, getCartTotal, clearCart, getCartItemCount } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(''); // For navbar search
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleCheckout = () => {
    if (!mounted) return;

    // Simulate order placement
    toast({
      title: 'Order Placed Successfully!',
      description: 'Your order with Cash on Delivery has been placed. You will receive a confirmation shortly.',
      duration: 5000,
    });
    clearCart();
    router.push('/'); // Redirect to homepage after checkout
  };

  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar searchBarComponent={<SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
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
            <div className="mt-8 pt-4 border-t">
              <div className="h-8 bg-muted rounded w-1/4 ml-auto mb-4"></div>
              <div className="h-12 bg-primary rounded w-full"></div>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItemCard key={item.id} item={item} />
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-24 p-6 bg-card rounded-lg shadow-lg">
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
                  onClick={handleCheckout} 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  size="lg"
                >
                  <CreditCard className="mr-2 h-5 w-5" /> Checkout with Cash
                </Button>
                 <p className="text-xs text-muted-foreground mt-2 text-center">You will pay upon delivery.</p>
              </div>
            </div>
          </div>
        )}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t mt-auto">
        © {new Date().getFullYear()} BookBuy Hub. All rights reserved.
      </footer>
    </div>
  );
}
