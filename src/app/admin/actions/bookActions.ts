'use server';

import { 
    getMockBooks, 
    addMockBook, 
    updateMockBook, 
    deleteMockBook,
    getMockBookById,
    getAllMockBookTitles as getAllMockBookTitlesFromStore
} from '@/lib/mockDataStore';
import type { Book } from '@/lib/types';

export async function getBooks(): Promise<Book[]> {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 50)); 
  return getMockBooks();
}

export async function getBookById(id: string): Promise<Book | undefined> {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 50));
    return getMockBookById(id);
}

export async function getAllBookTitles(): Promise<string[]> {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 50));
    return getAllMockBookTitlesFromStore();
}

export async function addBook(bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book> {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 50));
  try {
    const newBook = addMockBook(bookData);
    return newBook;
  } catch (error) {
    console.error("Error adding book to mock store:", error);
    throw new Error("Failed to add book.");
  }
}

export async function updateBook(bookId: string, bookData: Partial<Omit<Book, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Book> {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 50));
  try {
    const updatedBook = updateMockBook(bookId, bookData);
    if (!updatedBook) {
      throw new Error("Book not found for update.");
    }
    return updatedBook;
  } catch (error) {
    console.error("Error updating book in mock store:", error);
    throw new Error("Failed to update book.");
  }
}

export async function deleteBook(bookId: string): Promise<void> {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 50));
  try {
    const success = deleteMockBook(bookId);
    if (!success) {
      throw new Error("Book not found for deletion or delete failed.");
    }
  } catch (error) {
    console.error("Error deleting book from mock store:", error);
    throw new Error("Failed to delete book.");
  }
}
