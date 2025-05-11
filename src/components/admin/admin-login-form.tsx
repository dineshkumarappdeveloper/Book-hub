'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LogIn, Loader2 } from 'lucide-react';
// import { verifyAdminUser } from '@/app/admin/actions/adminAuthActions'; // Firebase action removed

interface AdminLoginFormProps {
  onLoginSuccess: () => void;
}

export function AdminLoginForm({ onLoginSuccess }: AdminLoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
      setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mounted) return;
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    if (username === 'admin' && password === 'admin') {
      toast({ title: 'Login Successful', description: 'Welcome, Admin!', duration: 3000 });
      if (typeof window !== 'undefined') {
          localStorage.setItem('isAdminLoggedIn', 'true');
      }
      onLoginSuccess();
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid username or password.',
        variant: 'destructive',
        duration: 3000,
      });
    }
    setIsLoading(false);
  };
  
  if (!mounted) {
      return (
        <Card className="w-full max-w-sm mx-auto shadow-xl animate-pulse">
            <CardHeader>
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2 mt-1"></div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-10 bg-muted rounded w-full"></div>
                </div>
                <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-10 bg-muted rounded w-full"></div>
                </div>
            </CardContent>
            <CardFooter>
                <div className="h-10 bg-primary rounded w-full"></div>
            </CardFooter>
        </Card>
      );
  }

  return (
    <Card className="w-full max-w-sm mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center">
          <LogIn className="mr-2 h-6 w-6" /> Admin Login
        </CardTitle>
        <CardDescription>Enter your credentials to access the admin panel. (admin/admin)</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="focus-visible:ring-accent"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="focus-visible:ring-accent"
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
