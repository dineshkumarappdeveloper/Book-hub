'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { UserPlus } from 'lucide-react';

interface AdminSignupFormProps {
  onSignupSuccess: () => void;
}

const ADMIN_USERS_KEY = 'adminUsers';

export function AdminSignupForm({ onSignupSuccess }: AdminSignupFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
        const existingUsers = localStorage.getItem(ADMIN_USERS_KEY);
        if (!existingUsers) {
            localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify([{ username: 'admin', password: 'password' }]));
        }
    }
  }, []);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mounted) return;

    if (password !== confirmPassword) {
      toast({
        title: 'Signup Failed',
        description: 'Passwords do not match.',
        variant: 'destructive',
        duration: 3000,
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Signup Failed',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
        duration: 3000,
      });
      return;
    }
    
    const storedUsers = localStorage.getItem(ADMIN_USERS_KEY);
    const adminUsers = storedUsers ? JSON.parse(storedUsers) : [];

    if (adminUsers.find((user: any) => user.username === username)) {
      toast({
        title: 'Signup Failed',
        description: 'Username already exists.',
        variant: 'destructive',
        duration: 3000,
      });
      return;
    }

    adminUsers.push({ username, password });
    localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(adminUsers));

    toast({ title: 'Signup Successful', description: 'Admin account created. Please login.', duration: 3000 });
    onSignupSuccess();
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
          <UserPlus className="mr-2 h-6 w-6" /> Admin Signup
        </CardTitle>
        <CardDescription>Create a new administrator account.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="focus-visible:ring-accent"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password (min. 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="focus-visible:ring-accent"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="focus-visible:ring-accent"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            Create Account
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
