
'use server';

import { firestore } from '@/lib/firebase/admin';
import type { Book } from '@/lib/types';
import {FieldValue} from 'firebase-admin/firestore';

const BOOKS_COLLECTION = 'books';

export async function getBooks(): Promise<Book[]> {
  try {
    const snapshot = await firestore.collection(BOOKS_COLLECTION).orderBy('createdAt', 'desc').get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        // Convert Firestore Timestamps to serializable format (e.g., ISO string or Date object)
        // For simplicity, assuming client can handle Firestore Timestamp objects if not serialized.
        // If not, convert:
        // createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : undefined,
        // updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : undefined,
      } as Book;
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    throw new Error("Failed to fetch books.");
  }
}

export async function addBook(bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book> {
  try {
    const newBookRef = firestore.collection(BOOKS_COLLECTION).doc();
    const timestamp = FieldValue.serverTimestamp();
    const newBook: Omit<Book, 'id'> & { createdAt: FieldValue, updatedAt: FieldValue } = {
      ...bookData,
      price: Number(bookData.price), // Ensure price is a number
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    await newBookRef.set(newBook);
    return { ...bookData, id: newBookRef.id, createdAt: new Date(), updatedAt: new Date() }; // return with approximate date
  } catch (error) {
    console.error("Error adding book:", error);
    throw new Error("Failed to add book.");
  }
}

export async function updateBook(bookId: string, bookData: Partial<Omit<Book, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Book> {
  try {
    const bookRef = firestore.collection(BOOKS_COLLECTION).doc(bookId);
    const updates = {
      ...bookData,
      ...(bookData.price && { price: Number(bookData.price) }), // Ensure price is a number if updated
      updatedAt: FieldValue.serverTimestamp(),
    };
    await bookRef.update(updates);
    
    // For returning updated book, fetch it or merge updates
    // This is a simplified return, actual timestamps would be set by server
    const updatedDoc = await bookRef.get();
    const data = updatedDoc.data();

    return { 
        id: bookId, 
        title: data?.title,
        author: data?.author,
        description: data?.description,
        coverImage: data?.coverImage,
        price: data?.price,
        // createdAt: data?.createdAt.toDate(), // Convert if needed
        // updatedAt: new Date() // Approximate
     } as Book;

  } catch (error) {
    console.error("Error updating book:", error);
    throw new Error("Failed to update book.");
  }
}

export async function deleteBook(bookId: string): Promise<void> {
  try {
    await firestore.collection(BOOKS_COLLECTION).doc(bookId).delete();
  } catch (error) {
    console.error("Error deleting book:", error);
    throw new Error("Failed to delete book.");
  }
}
