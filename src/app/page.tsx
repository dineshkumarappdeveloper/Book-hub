'use client';

import { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/navbar';
import { SearchBar } from '@/components/search-bar';
import { BookCard } from '@/components/book-card';
import { getBooks } from '@/app/admin/actions/bookActions'; // Use new actions
import type { Book } from '@/lib/types';
import { Frown, Loader2 } from 'lucide-react';

export default function StorefrontPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchBooks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedBooks = await getBooks();
        setBooks(fetchedBooks);
      } catch (e) {
        setError('Failed to load books. Please try again later.');
        console.error("Failed to fetch books for storefront:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    if (!searchQuery) return books;
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, books]);

  if (!mounted || isLoading && books.length === 0) { // Show full page skeleton if loading and no books yet
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar searchBarComponent={<SearchBar searchQuery="" setSearchQuery={() => {}} />} />
        <main className="flex-grow container mx-auto px-4 py-8">
           <div className="h-8 bg-muted rounded w-1/3 mb-8 mx-auto animate-pulse"></div>
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
  
  if (error) {
     return (
      <div className="flex flex-col min-h-screen">
        <Navbar searchBarComponent={<SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <Frown className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h1 className="text-2xl font-semibold">Error Loading Books</h1>
          <p className="text-muted-foreground">{error}</p>
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
        <h1 className="text-3xl font-bold mb-8 text-center text-primary">Discover Your Next Read</h1>
        {isLoading && books.length === 0 && (
             <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2 text-muted-foreground">Loading books...</p>
            </div>
        )}
        {!isLoading && !error && filteredBooks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
        {!isLoading && !error && filteredBooks.length === 0 && books.length > 0 && (
          <div className="text-center py-10">
            <Frown className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">No books found matching your search.</p>
            <p className="text-sm text-muted-foreground">Try a different title or author.</p>
          </div>
        )}
         {!isLoading && !error && books.length === 0 && (
          <div className="text-center py-10">
            <Frown className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">No books available at the moment.</p>
            <p className="text-sm text-muted-foreground">Please check back later.</p>
          </div>
        )}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t mt-auto">
        © {new Date().getFullYear()} BookBuy Hub. All rights reserved.
      </footer>
    </div>
  );
}
