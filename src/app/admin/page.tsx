'use client';

import { useState, useEffect } from 'react';
import { AdminLoginForm } from '@/components/admin/admin-login-form';
import { AdminDashboard } from '@/components/admin/admin-dashboard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpenText, ArrowLeft } from 'lucide-react';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check local storage for login state persistence (simple mock)
    const loggedInStatus = localStorage.getItem('isAdminLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    }
    setMounted(true);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isAdminLoggedIn', 'true'); // Persist login state
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isAdminLoggedIn');
  };

  if (!mounted) {
    return <div className="flex items-center justify-center min-h-screen bg-background"><p>Loading admin...</p></div>; // Or a proper skeleton loader
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <div className="absolute top-4 left-4">
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Store
          </Link>
        </Button>
      </div>
      <div className="flex items-center mb-8 text-primary">
        <BookOpenText className="h-10 w-10 mr-3" />
        <h1 className="text-4xl font-bold">BookBuy Hub Admin</h1>
      </div>
      
      {isLoggedIn ? (
        <div className="w-full max-w-2xl">
          <AdminDashboard />
          <Button onClick={handleLogout} variant="destructive" className="mt-6 w-full max-w-xs mx-auto flex">
            Logout
          </Button>
        </div>
      ) : (
        <AdminLoginForm onLoginSuccess={handleLoginSuccess} />
      )}
      <footer className="absolute bottom-4 text-center text-sm text-muted-foreground">
         © {new Date().getFullYear()} BookBuy Hub.
      </footer>
    </div>
  );
}
