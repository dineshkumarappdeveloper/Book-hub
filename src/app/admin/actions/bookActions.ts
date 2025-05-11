'use server';

import { database } from '@/lib/firebase/admin';
import type { Book } from '@/lib/types';
import admin from 'firebase-admin'; // For ServerValue

const BOOKS_REF = 'books';

export async function getBooks(): Promise<Book[]> {
  try {
    const snapshot = await database.ref(BOOKS_REF).orderByChild('createdAt').once('value');
    if (!snapshot.exists()) {
      return [];
    }
    const booksData = snapshot.val();
    const booksArray: Book[] = [];
    // Firebase RTDB with orderByChild returns an object, iterate values or use snapshot.forEach
    snapshot.forEach(childSnapshot => {
        const book = childSnapshot.val();
        booksArray.push({
            ...book,
            id: childSnapshot.key,
            createdAt: book.createdAt ? new Date(book.createdAt) : undefined,
            updatedAt: book.updatedAt ? new Date(book.updatedAt) : undefined,
        } as Book);
    });
    return booksArray.reverse(); // RTDB orderByChild is ascending, reverse for descending by date
  } catch (error) {
    console.error("Error fetching books from RTDB:", error);
    throw new Error("Failed to fetch books.");
  }
}

export async function addBook(bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book> {
  try {
    const newBookRef = database.ref(BOOKS_REF).push();
    const timestamp = admin.database.ServerValue.TIMESTAMP;
    const newBookData = {
      ...bookData,
      price: Number(bookData.price),
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    await newBookRef.set(newBookData);
    // For returning, simulate server-set timestamp for immediate use, or re-fetch
    return { 
        ...bookData, 
        id: newBookRef.key!, 
        createdAt: Date.now(), // Approximate client-side, real value is server-set
        updatedAt: Date.now() 
    } as Book;
  } catch (error) {
    console.error("Error adding book to RTDB:", error);
    throw new Error("Failed to add book.");
  }
}

export async function updateBook(bookId: string, bookData: Partial<Omit<Book, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Book> {
  try {
    const bookRef = database.ref(`${BOOKS_REF}/${bookId}`);
    const updates = {
      ...bookData,
      ...(bookData.price && { price: Number(bookData.price) }),
      updatedAt: admin.database.ServerValue.TIMESTAMP,
    };
    await bookRef.update(updates);
    
    const snapshot = await bookRef.once('value');
    const updatedData = snapshot.val();
    return { 
        ...updatedData, 
        id: bookId,
        createdAt: updatedData.createdAt ? new Date(updatedData.createdAt) : undefined,
        updatedAt: updatedData.updatedAt ? new Date(updatedData.updatedAt) : Date.now(), // Approx if not set by server yet
    } as Book;
  } catch (error) {
    console.error("Error updating book in RTDB:", error);
    throw new Error("Failed to update book.");
  }
}

export async function deleteBook(bookId: string): Promise<void> {
  try {
    await database.ref(`${BOOKS_REF}/${bookId}`).remove();
  } catch (error) {
    console.error("Error deleting book from RTDB:", error);
    throw new Error("Failed to delete book.");
  }
}
