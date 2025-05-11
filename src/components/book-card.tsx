import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AddToCartButton } from '@/components/add-to-cart-button';
import type { Book } from '@/lib/types';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 bg-card">
      <Link href={`/book/${book.id}`} className="flex flex-col h-full">
        <CardHeader className="p-4">
          <div className="aspect-[2/3] w-full relative overflow-hidden rounded-md mb-4">
            <Image
              src={book.coverImage}
              alt={`Cover of ${book.title}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="book cover"
            />
          </div>
          <CardTitle className="text-lg font-semibold leading-tight truncate" title={book.title}>
            {book.title}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            By {book.author}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-grow">
          <p className="text-xs text-foreground/80 line-clamp-3 mb-2">
            {book.description}
          </p>
          <p className="text-lg font-bold text-primary">
            ${book.price.toFixed(2)}
          </p>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0 mt-auto">
        <AddToCartButton book={book} />
      </CardFooter>
    </Card>
  );
}
