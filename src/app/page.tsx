'use client';

import { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/navbar';
import { SearchBar } from '@/components/search-bar';
import { BookCard } from '@/components/book-card';
import { mockBooks } from '@/lib/mockData';
import type { Book } from '@/lib/types';
import { Frown } from 'lucide-react';

export default function StorefrontPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setBooks(mockBooks);
    setMounted(true); // Ensures client-side specific logic runs after mount
  }, []);

  const filteredBooks = useMemo(() => {
    if (!searchQuery) return books;
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, books]);

  if (!mounted) {
    // Optional: Render a loading state or null to avoid hydration mismatch issues with search
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar searchBarComponent={<SearchBar searchQuery="" setSearchQuery={() => {}} />} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-card p-4 rounded-lg shadow-md animate-pulse">
                <div className="aspect-[2/3] w-full bg-muted rounded-md mb-4"></div>
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-muted rounded w-full"></div>
              </div>
            ))}
          </div>
        </main>
        <footer className="py-6 text-center text-sm text-muted-foreground border-t">
          © {new Date().getFullYear()} BookBuy Hub. All rights reserved.
        </footer>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar searchBarComponent={<SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-primary">Discover Your Next Read</h1>
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <Frown className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">No books found matching your search.</p>
            <p className="text-sm text-muted-foreground">Try a different title or author.</p>
          </div>
        )}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t mt-auto">
        © {new Date().getFullYear()} BookBuy Hub. All rights reserved.
      </footer>
    </div>
  );
}
