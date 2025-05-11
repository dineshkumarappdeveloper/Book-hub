
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateBook as updateBookAction } from '@/app/admin/actions/bookActions';
import { useToast } from '@/hooks/use-toast';
import type { Book } from '@/lib/types';

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  coverImage: z.string().url('Must be a valid URL'),
  price: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive('Price must be positive')
  ),
});

type BookFormData = z.infer<typeof bookSchema>;

interface EditBookDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  book: Book;
  onSuccess: () => void;
}

export function EditBookDialog({ isOpen, onOpenChange, book, onSuccess }: EditBookDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: { // Initialized from prop, will be updated by useEffect
      title: '',
      author: '',
      description: '',
      coverImage: '',
      price: 0,
    },
  });

  useEffect(() => {
    if (book) {
      setValue('title', book.title);
      setValue('author', book.author);
      setValue('description', book.description);
      setValue('coverImage', book.coverImage);
      setValue('price', book.price);
    }
  }, [book, setValue, isOpen]); // Rerun when isOpen changes to reset form if dialog reopens with same book

  const onSubmit: SubmitHandler<BookFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      // The action handles updatedAt
      await updateBookAction(book.id, data);
      toast({ title: 'Success', description: 'Book updated successfully.' });
      // reset(); // Reset form after successful submission
      onSuccess(); // This will trigger fetchBooks in BookManagementTab
      onOpenChange(false); // Close dialog
    } catch (e) {
      toast({ title: 'Error', description: (e as Error).message || 'Failed to update book.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { onOpenChange(open); if(!open && book) reset(book); else if (!open) reset(); }}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Book: {book?.title}</DialogTitle>
          <DialogDescription>Update the details for this book.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input id="title" {...register('title')} className="col-span-3" />
            {errors.title && <p className="col-span-4 text-destructive text-xs text-right">{errors.title.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="author" className="text-right">Author</Label>
            <Input id="author" {...register('author')} className="col-span-3" />
            {errors.author && <p className="col-span-4 text-destructive text-xs text-right">{errors.author.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea id="description" {...register('description')} className="col-span-3" />
            {errors.description && <p className="col-span-4 text-destructive text-xs text-right">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="coverImage" className="text-right">Cover Image URL</Label>
            <Input id="coverImage" {...register('coverImage')} className="col-span-3" />
            {errors.coverImage && <p className="col-span-4 text-destructive text-xs text-right">{errors.coverImage.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">Price ($)</Label>
            <Input id="price" type="number" step="0.01" {...register('price')} className="col-span-3" />
            {errors.price && <p className="col-span-4 text-destructive text-xs text-right">{errors.price.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { onOpenChange(false); if(book) reset(book); else reset(); }}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
