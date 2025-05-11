import type { Metadata } from 'next';
// import { GeistSans } from 'geist/font/sans'; // Removed as 'geist' package is not in dependencies
// import { GeistMono } from 'geist/font/mono'; // Removed as 'geist' package is not in dependencies
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/contexts/cart-context';

// const geistSans = GeistSans; // Removed
// const geistMono = GeistMono; // Removed

export const metadata: Metadata = {
  title: 'BookBuy Hub',
  description: 'Your online destination for books.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"> {/* Removed className attribute */}
      <body className="antialiased min-h-screen flex flex-col">
        <CartProvider>
          {children}
        </CartProvider>
        <Toaster />
      </body>
    </html>
  );
}
