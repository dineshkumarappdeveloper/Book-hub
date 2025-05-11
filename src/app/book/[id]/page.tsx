'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { SearchBar } from '@/components/search-bar'; // Placeholder for Navbar prop
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AddToCartButton } from '@/components/add-to-cart-button';
import { getBookById, getAllBookTitles, mockBooks } from '@/lib/mockData';
import type { Book } from '@/lib/types';
import { suggestBooks, type BookSuggestionsInput, type BookSuggestionsOutput } from '@/ai/flows/book-suggestions';
import { ArrowLeft, ThumbsUp, AlertTriangle, Loader2, Frown } from 'lucide-react';

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<Book | null>(null);
  const [suggestedBooks, setSuggestedBooks] = useState<Book[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [errorSuggestions, setErrorSuggestions] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // For navbar search

  useEffect(() => {
    const foundBook = getBookById(params.id);
    if (foundBook) {
      setBook(foundBook);
    }
    setMounted(true);
  }, [params.id]);

  useEffect(() => {
    if (book && mounted) {
      const fetchSuggestions = async () => {
        setIsLoadingSuggestions(true);
        setErrorSuggestions(null);
        try {
          const input: BookSuggestionsInput = {
            bookTitle: book.title,
            bookDescription: book.description,
            existingBooks: getAllBookTitles(),
          };
          const result: BookSuggestionsOutput = await suggestBooks(input);
          const suggestions = mockBooks.filter(b => result.suggestedBooks.includes(b.title) && b.id !== book.id);
          setSuggestedBooks(suggestions);
        } catch (error) {
          console.error('Error fetching book suggestions:', error);
          setErrorSuggestions('Failed to load book suggestions. Please try again later.');
        } finally {
          setIsLoadingSuggestions(false);
        }
      };
      fetchSuggestions();
    }
  }, [book, mounted]);

  if (!mounted) {
    // Basic loading state to prevent hydration issues
    return (
        <div className="flex flex-col min-h-screen">
        <Navbar searchBarComponent={<SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
        <main className="flex-grow container mx-auto px-4 py-8">
            <div className="animate-pulse">
                <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <div className="aspect-[2/3] bg-muted rounded-lg"></div>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        <div className="h-10 bg-muted rounded w-3/4"></div>
                        <div className="h-6 bg-muted rounded w-1/2"></div>
                        <div className="h-20 bg-muted rounded"></div>
                        <div className="h-8 bg-muted rounded w-1/4"></div>
                        <div className="h-12 bg-muted rounded w-full"></div>
                    </div>
                </div>
                <div className="mt-12">
                    <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1,2,3].map(i => (
                             <div key={i} className="bg-card p-4 rounded-lg shadow-md">
                                <div className="aspect-[2/3] w-full bg-muted rounded-md mb-4"></div>
                                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-muted rounded w-1/2"></div>
                             </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar searchBarComponent={<SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <Frown className="mx-auto h-16 w-16 text-destructive mb-4" />
          <h1 className="text-2xl font-semibold">Book Not Found</h1>
          <p className="text-muted-foreground mb-6">The book you are looking for does not exist or may have been removed.</p>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Storefront
            </Link>
          </Button>
        </main>
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

        <Card className="overflow-hidden shadow-xl">
          <div className="grid md:grid-cols-3 gap-0 md:gap-0"> {/* No gap for seamless image edge */}
            <div className="md:col-span-1">
              <div className="aspect-[2/3] w-full relative">
                <Image
                  src={book.coverImage}
                  alt={`Cover of ${book.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                  data-ai-hint="book cover detail"
                  priority
                />
              </div>
            </div>
            <div className="md:col-span-2 p-6 md:p-8 flex flex-col">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-3xl lg:text-4xl font-bold text-primary">{book.title}</CardTitle>
                <CardDescription className="text-lg text-muted-foreground">By {book.author}</CardDescription>
              </CardHeader>
              <CardContent className="p-0 flex-grow">
                <p className="text-foreground/90 leading-relaxed mb-6">{book.description}</p>
                <p className="text-3xl font-bold text-accent mb-6">${book.price.toFixed(2)}</p>
              </CardContent>
              <div className="mt-auto">
                 <AddToCartButton book={book} />
              </div>
            </div>
          </div>
        </Card>

        <Separator className="my-12" />

        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center text-primary">
            <ThumbsUp className="mr-3 h-6 w-6" /> You Might Also Like
          </h2>
          {isLoadingSuggestions && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Loading suggestions...</p>
            </div>
          )}
          {errorSuggestions && (
            <div className="text-destructive bg-destructive/10 p-4 rounded-md flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {errorSuggestions}
            </div>
          )}
          {!isLoadingSuggestions && !errorSuggestions && suggestedBooks.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedBooks.map((sBook) => (
                <Card key={sBook.id} className="overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                  <Link href={`/book/${sBook.id}`} className="flex flex-col h-full">
                    <div className="aspect-[2/3] w-full relative">
                      <Image
                        src={sBook.coverImage}
                        alt={`Cover of ${sBook.title}`}
                        fill
                        className="object-cover"
                        data-ai-hint="book cover suggestion"
                      />
                    </div>
                    <CardHeader className="p-4">
                      <CardTitle className="text-md font-semibold truncate" title={sBook.title}>{sBook.title}</CardTitle>
                      <CardDescription className="text-xs text-muted-foreground">By {sBook.author}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 mt-auto">
                       <p className="text-md font-bold text-primary">${sBook.price.toFixed(2)}</p>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}
          {!isLoadingSuggestions && !errorSuggestions && suggestedBooks.length === 0 && (
            <p className="text-muted-foreground">No specific suggestions at the moment. Explore our collection!</p>
          )}
        </section>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t mt-auto">
        © {new Date().getFullYear()} BookBuy Hub. All rights reserved.
      </footer>
    </div>
  );
}
