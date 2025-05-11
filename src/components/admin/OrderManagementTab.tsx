'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getOrders, updateOrderStatus, getOrderById } from '@/app/admin/actions/orderActions';
import type { Order } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, RefreshCw, PackageSearch, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import Image from 'next/image';

export function OrderManagementTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedOrders = await getOrders();
      // Server actions for RTDB should convert numeric timestamps to Date objects
      setOrders(fetchedOrders);
    } catch (e) {
      setError((e as Error).message || 'Failed to fetch orders.');
      toast({ title: 'Error', description: (e as Error).message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast({ title: 'Success', description: `Order ${orderId.substring(0,8)}... status updated to ${newStatus}.` });
      fetchOrders(); // Refresh orders list
    } catch (e) {
      toast({ title: 'Error', description: (e as Error).message || 'Failed to update order status.', variant: 'destructive' });
    }
  };
  
  const formatDate = (dateInput?: Date | number | string): string => {
    if (!dateInput) return 'N/A';
    let date: Date;
     if (dateInput instanceof Date) {
        date = dateInput;
    } else if (typeof dateInput === 'number' || typeof dateInput === 'string') {
      date = new Date(dateInput);
    } else {
      const anyDateInput = dateInput as any;
      if (anyDateInput.toDate && typeof anyDateInput.toDate === 'function') {
          date = anyDateInput.toDate();
      } else {
        return 'Invalid Date Input';
      }
    }
    if (isNaN(date.getTime())) return 'Invalid Date';
    return format(date, 'PPpp');
  };

  const openOrderDetailModal = async (orderId: string) => {
    const orderDetails = await getOrderById(orderId);
    if (orderDetails) {
        setSelectedOrder(orderDetails);
        setIsDetailModalOpen(true);
    } else {
        toast({ title: 'Error', description: 'Could not fetch order details.', variant: 'destructive'});
    }
  };


  if (isLoading) {
    return <div className="flex items-center justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="ml-2">Loading orders...</p></div>;
  }

  if (error) {
    return (
      <div className="text-destructive bg-destructive/10 p-4 rounded-md flex flex-col items-center">
        <AlertTriangle className="h-6 w-6 mb-2" />
        <p>{error}</p>
        <Button onClick={fetchOrders} variant="outline" size="sm" className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-primary">Manage Orders</h2>
         <Button onClick={fetchOrders} variant="outline" size="sm" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />} 
            Refresh Orders
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                <PackageSearch className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                No orders found yet.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium truncate max-w-[100px]" title={order.id}>{order.id.substring(0,8)}...</TableCell>
                <TableCell>{order.deliveryInfo.name} ({order.deliveryInfo.email})</TableCell>
                <TableCell>{formatDate(order.orderDate)}</TableCell>
                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onValueChange={(newStatus) => handleStatusChange(order.id, newStatus as Order['status'])}
                  >
                    <SelectTrigger className="w-[150px] text-xs h-8">
                      <SelectValue placeholder="Set status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => openOrderDetailModal(order.id)}>
                    <Eye className="h-4 w-4 mr-1 sm:mr-2" /> <span className="hidden sm:inline">Details</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {selectedOrder && (
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Order Details: #{selectedOrder.id.substring(0,8)}...</DialogTitle>
              <DialogDescription>
                Placed on {formatDate(selectedOrder.orderDate)} by {selectedOrder.deliveryInfo.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div><strong>Customer:</strong> {selectedOrder.deliveryInfo.name}</div>
                <div><strong>Email:</strong> {selectedOrder.deliveryInfo.email}</div>
                <div className="col-span-2">
                  <strong>Address:</strong> {selectedOrder.deliveryInfo.addressLine1}
                  {selectedOrder.deliveryInfo.addressLine2 && `, ${selectedOrder.deliveryInfo.addressLine2}`}
                  , {selectedOrder.deliveryInfo.city}, {selectedOrder.deliveryInfo.state} {selectedOrder.deliveryInfo.zipCode}, {selectedOrder.deliveryInfo.country}
                </div>
                <div><strong>Total Amount:</strong> ${selectedOrder.totalAmount.toFixed(2)}</div>
                <div><strong>Status:</strong> <span className="font-semibold">{selectedOrder.status}</span></div>
              </div>
              <h4 className="font-semibold mt-2">Items:</h4>
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                <ul className="space-y-2">
                  {selectedOrder.items.map(item => (
                    <li key={item.bookId || item.title} className="flex items-center space-x-3 border-b pb-2">
                      <Image src={item.coverImage || "https://picsum.photos/seed/defaultbook/40/60"} alt={item.title} width={40} height={60} className="rounded object-cover" data-ai-hint="book cover small" />
                      <div className="flex-grow">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity} @ ${item.price.toFixed(2)}</p>
                      </div>
                      <p className="font-semibold">${(item.quantity * item.price).toFixed(2)}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No items found in this order.</p>
              )}
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
