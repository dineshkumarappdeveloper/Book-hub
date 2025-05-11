'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Book } from '@/lib/types';
import { ShoppingCart } from 'lucide-react';

interface AddToCartButtonProps {
  book: Book;
}

export function AddToCartButton({ book }: AddToCartButtonProps) {
  const { toast } = useToast();

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart (Mock)",
      description: `${book.title} has been added to your cart.`,
      duration: 3000,
    });
  };

  return (
    <Button onClick={handleAddToCart} variant="default" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
      <ShoppingCart className="mr-2 h-4 w-4" />
      Add to Cart
    </Button>
  );
}
