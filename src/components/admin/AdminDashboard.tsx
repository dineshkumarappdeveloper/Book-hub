
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, BookMarked, Package, Users } from "lucide-react";
import { BookManagementTab } from './BookManagementTab';
import { OrderManagementTab } from './OrderManagementTab';
import { UserManagementTab } from './UserManagementTab';


export function AdminDashboard() {
  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center">
          <ShieldCheck className="mr-2 h-6 w-6" /> Admin Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="books" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="books" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              <BookMarked className="mr-2 h-4 w-4" /> Books
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              <Package className="mr-2 h-4 w-4" /> Orders
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              <Users className="mr-2 h-4 w-4" /> Users
            </TabsList>
          <TabsContent value="books">
            <BookManagementTab />
          </TabsContent>
          <TabsContent value="orders">
            <OrderManagementTab />
          </TabsContent>
          <TabsContent value="users">
            <UserManagementTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
