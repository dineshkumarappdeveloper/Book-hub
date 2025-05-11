
import type { Book, Order, OrderItem } from './types';
import { mockBooks as initialBooks } from './mockData'; // Seed data

// In-memory store
let books: Book[] = JSON.parse(JSON.stringify(initialBooks)); // Deep copy to allow mutation
let orders: Order[] = [];
let nextBookId = books.length + 1;
let nextOrderId = 1;

// Book CRUD
export const getMockBooks = (): Book[] => {
  return [...books].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)); // Return sorted copy
};

export const getMockBookById = (id: string): Book | undefined => {
  return books.find(book => book.id === id);
};

export const addMockBook = (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Book => {
  const newBook: Book = {
    ...bookData,
    id: String(nextBookId++),
    price: Number(bookData.price),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  books.push(newBook);
  return newBook;
};

export const updateMockBook = (bookId: string, bookData: Partial<Omit<Book, 'id' | 'createdAt' | 'updatedAt'>>): Book | null => {
  const bookIndex = books.findIndex(b => b.id === bookId);
  if (bookIndex === -1) {
    return null;
  }
  const updatedBook = {
    ...books[bookIndex],
    ...bookData,
    ...(bookData.price && { price: Number(bookData.price) }),
    updatedAt: Date.now(),
  };
  books[bookIndex] = updatedBook;
  return updatedBook;
};

export const deleteMockBook = (bookId: string): boolean => {
  const initialLength = books.length;
  books = books.filter(b => b.id !== bookId);
  return books.length < initialLength;
};

export const getAllMockBookTitles = (): string[] => {
  return books.map(book => book.title);
};

// Order CRUD
export const getMockOrders = (): Order[] => {
  return [...orders].sort((a,b) => b.orderDate - a.orderDate); // Return sorted copy
};

export const getMockOrderById = (id: string): Order | undefined => {
  return orders.find(order => order.id === id);
};

export const createMockOrder = (orderInput: Omit<Order, 'id' | 'orderDate' | 'updatedAt' | 'status'> & { status?: Order['status'] }): Order => {
  const newOrder: Order = {
    ...orderInput,
    id: `mock-${String(nextOrderId++)}`,
    status: orderInput.status || 'Pending',
    orderDate: Date.now(),
    updatedAt: Date.now(),
  };
  orders.push(newOrder);
  return newOrder;
};

export const updateMockOrderStatus = (orderId: string, status: Order['status']): Order | null => {
  const orderIndex = orders.findIndex(o => o.id === orderId);
  if (orderIndex === -1) {
    return null;
  }
  orders[orderIndex].status = status;
  orders[orderIndex].updatedAt = Date.now();
  return orders[orderIndex];
};

// Customer Profiles (derived from orders)
export const getMockCustomerProfiles = (): import('./types').CustomerProfile[] => {
  const customerMap = new Map<string, import('./types').CustomerProfile>();
  
  orders.forEach(order => {
    if (!order.deliveryInfo || !order.deliveryInfo.email) return;

    const email = order.deliveryInfo.email.toLowerCase();
    const orderDate = order.orderDate; // Already a number

    if (!customerMap.has(email)) {
      customerMap.set(email, {
        id: email,
        name: order.deliveryInfo.name,
        email: order.deliveryInfo.email,
        firstOrderDate: orderDate,
        lastOrderDate: orderDate,
        totalOrders: 0,
        totalSpent: 0,
      });
    }

    const customer = customerMap.get(email)!;
    customer.totalOrders! += 1;
    customer.totalSpent! += order.totalAmount;

    if (orderDate < (customer.firstOrderDate as number)) {
      customer.firstOrderDate = orderDate;
    }
    if (orderDate > (customer.lastOrderDate as number)) {
      customer.lastOrderDate = orderDate;
      customer.name = order.deliveryInfo.name;
    }
  });
  
  return Array.from(customerMap.values()).sort((a,b) => (b.lastOrderDate as number) - (a.lastOrderDate as number));
};

// Function to reset mock data (useful for testing or specific scenarios)
export const resetMockData = () => {
  books = JSON.parse(JSON.stringify(initialBooks));
  orders = [];
  nextBookId = books.length + 1;
  nextOrderId = 1;
};
