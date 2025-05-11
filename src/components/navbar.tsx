'use client';

import Link from 'next/link';
import { BookOpenText, ShoppingCart } from 'lucide-react';
import type { SearchBarProps } from '@/components/search-bar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/cart-context';
import { useEffect, useState } from 'react';

interface NavbarProps {
  searchBarComponent: React.ReactElement<SearchBarProps>;
}

export function Navbar({ searchBarComponent }: NavbarProps) {
  const { getCartItemCount } = useCart();
  const [itemCount, setItemCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setItemCount(getCartItemCount());
    }
  }, [getCartItemCount, mounted, // Listen to cartItems indirectly through getCartItemCount
    useCart().cartItems // Directly listen to cartItems for updates
  ]);


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <BookOpenText className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block text-lg">
            BookBuy Hub
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {searchBarComponent}
          </div>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart" aria-label="View shopping cart">
              <ShoppingCart className="h-5 w-5" />
              {mounted && itemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {itemCount}
                </Badge>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
