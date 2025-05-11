'use client';

import Image from 'next/image';
import type { CartItem } from '@/lib/types';
import { useCart } from '@/contexts/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.id, newQuantity);
  };

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-4 flex items-center space-x-4">
        <Link href={`/book/${item.id}`} className="flex-shrink-0">
          <div className="w-24 h-36 relative rounded-md overflow-hidden">
            <Image
              src={item.coverImage}
              alt={item.title}
              fill
              sizes="100px"
              className="object-cover"
              data-ai-hint="book cover cart"
            />
          </div>
        </Link>
        <div className="flex-grow">
          <Link href={`/book/${item.id}`}>
            <h3 className="text-lg font-semibold text-primary hover:underline">{item.title}</h3>
          </Link>
          <p className="text-sm text-muted-foreground">By {item.author}</p>
          <p className="text-md font-bold text-accent mt-1">${item.price.toFixed(2)}</p>
          
          <div className="flex items-center mt-3 space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              className="h-8 w-14 text-center focus-visible:ring-accent"
              value={item.quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val >= 1) handleQuantityChange(val);
                else if (e.target.value === "") handleQuantityChange(1); // Or handle empty string as 1
              }}
              min="1"
              aria-label="Item quantity"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <p className="text-lg font-bold text-primary">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => removeFromCart(item.id)}
            aria-label="Remove item from cart"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
