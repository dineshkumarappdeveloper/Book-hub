'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AddBookDialog } from './AddBookDialog';
import { EditBookDialog } from './EditBookDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getBooks, deleteBook as deleteBookAction } from '@/app/admin/actions/bookActions';
import type { Book } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

export function BookManagementTab() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { toast } = useToast();

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedBooks = await getBooks();
      // Server actions for RTDB should already convert timestamps to Date objects
      setBooks(fetchedBooks);
    } catch (e) {
      setError((e as Error).message || 'Failed to fetch books.');
      toast({ title: 'Error', description: (e as Error).message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleAddSuccess = () => {
    fetchBooks();
    setIsAddDialogOpen(false);
  };

  const handleEditSuccess = () => {
    fetchBooks();
    setIsEditDialogOpen(false);
    setSelectedBook(null);
  };

  const openEditDialog = (book: Book) => {
    setSelectedBook(book);
    setIsEditDialogOpen(true);
  };

  const handleDeleteBook = async (bookId: string) => {
    try {
      await deleteBookAction(bookId);
      toast({ title: 'Success', description: 'Book deleted successfully.' });
      fetchBooks();
    } catch (e) {
      toast({ title: 'Error', description: (e as Error).message || 'Failed to delete book.', variant: 'destructive' });
    }
  };
  
  const formatDate = (dateInput?: Date | number | string): string => {
    if (!dateInput) return 'N/A';
    let date: Date;
    if (dateInput instanceof Date) {
        date = dateInput;
    } else if (typeof dateInput === 'number' || typeof dateInput === 'string') {
      date = new Date(dateInput);
    } else {
      // Attempt to handle Firestore-like toDate if it was accidentally passed, though RTDB won't have this.
      const anyDateInput = dateInput as any;
      if (anyDateInput.toDate && typeof anyDateInput.toDate === 'function') {
          date = anyDateInput.toDate();
      } else {
          return 'Invalid Date Input';
      }
    }

    if (isNaN(date.getTime())) return 'Invalid Date';
    return format(date, 'PPpp');
  };


  if (isLoading) {
    return <div className="flex items-center justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="ml-2">Loading books...</p></div>;
  }

  if (error) {
    return (
      <div className="text-destructive bg-destructive/10 p-4 rounded-md flex flex-col items-center">
        <AlertTriangle className="h-6 w-6 mb-2" />
        <p>{error}</p>
        <Button onClick={fetchBooks} variant="outline" size="sm" className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-primary">Manage Books</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Book
        </Button>
      </div>

      <AddBookDialog isOpen={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSuccess={handleAddSuccess} />
      {selectedBook && (
        <EditBookDialog isOpen={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} book={selectedBook} onSuccess={handleEditSuccess} />
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">No books found. Add some!</TableCell>
            </TableRow>
          ) : (
            books.map((book) => (
              <TableRow key={book.id}>
                <TableCell className="font-medium">{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>${book.price ? book.price.toFixed(2) : '0.00'}</TableCell>
                <TableCell>{formatDate(book.createdAt)}</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(book)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the book &quot;{book.title}&quot;.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteBook(book.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
