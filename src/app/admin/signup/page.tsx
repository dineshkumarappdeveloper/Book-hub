'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminSignupForm } from '@/components/admin/admin-signup-form';
import { Button } from '@/components/ui/button';
import { UserPlus, ArrowLeft, BookOpenText } from 'lucide-react';

export default function AdminSignupPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignupSuccess = () => {
    // Redirect to admin login page after successful signup
    router.push('/admin');
  };
  
  if (!mounted) {
     return <div className="flex items-center justify-center min-h-screen bg-background"><p>Loading signup...</p></div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <div className="absolute top-4 left-4">
        <Button variant="outline" asChild>
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin Login
          </Link>
        </Button>
      </div>
      <div className="flex items-center mb-8 text-primary">
        <BookOpenText className="h-10 w-10 mr-3" />
        <h1 className="text-4xl font-bold">BookBuy Hub Admin</h1>
      </div>
       <AdminSignupForm onSignupSuccess={handleSignupSuccess} />
       <footer className="absolute bottom-4 text-center text-sm text-muted-foreground">
         © {new Date().getFullYear()} BookBuy Hub.
      </footer>
    </div>
  );
}
