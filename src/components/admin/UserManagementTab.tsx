'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getCustomerProfiles } from '@/app/admin/actions/userActions';
import type { CustomerProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, RefreshCw, Users2 } from 'lucide-react';
import { format } from 'date-fns';

export function UserManagementTab() {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedCustomers = await getCustomerProfiles();
      setCustomers(fetchedCustomers);
    } catch (e) {
      setError((e as Error).message || 'Failed to fetch customer profiles.');
      toast({ title: 'Error', description: (e as Error).message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const formatDateTimestamp = (timestamp?: number): string => {
    if (timestamp === undefined || timestamp === null) return 'N/A';
    try {
      return format(new Date(timestamp), 'PP'); // Format as 'Month day, year'
    } catch (e) {
      return 'Invalid Date';
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="ml-2">Loading customers...</p></div>;
  }

  if (error) {
    return (
      <div className="text-destructive bg-destructive/10 p-4 rounded-md flex flex-col items-center">
        <AlertTriangle className="h-6 w-6 mb-2" />
        <p>{error}</p>
        <Button onClick={fetchCustomers} variant="outline" size="sm" className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-primary">Customer Profiles</h2>
         <Button onClick={fetchCustomers} variant="outline" size="sm" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />} 
            Refresh Customers
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Total Orders</TableHead>
            <TableHead>Total Spent</TableHead>
            <TableHead>Last Order Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                <Users2 className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                No customers found. Profiles are generated from completed orders.
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.totalOrders || 0}</TableCell>
                <TableCell>${(customer.totalSpent || 0).toFixed(2)}</TableCell>
                <TableCell>{formatDateTimestamp(customer.lastOrderDate)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
