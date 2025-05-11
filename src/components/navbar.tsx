import Link from 'next/link';
import { BookOpenText, Search } from 'lucide-react';
import type { SearchBarProps } from '@/components/search-bar'; // Assuming SearchBarProps is exported

interface NavbarProps {
  searchBarComponent: React.ReactElement<SearchBarProps>;
}

export function Navbar({ searchBarComponent }: NavbarProps) {
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
          {/* Mock Cart Icon - can be expanded later */}
          {/* 
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Cart</span>
          </Button>
          */}
        </div>
      </div>
    </header>
  );
}
