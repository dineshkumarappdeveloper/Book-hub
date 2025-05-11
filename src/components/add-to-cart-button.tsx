'use client';

import { Button } from '@/components/ui/button';
import type { Book } from '@/lib/types';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';

interface AddToCartButtonProps {
  book: Book;
}

export function AddToCartButton({ book }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(book);
  };

  return (
    <Button onClick={handleAddToCart} variant="default" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
      <ShoppingCart className="mr-2 h-4 w-4" />
      Add to Cart
    </Button>
  );
}
