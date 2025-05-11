import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export function AdminDashboard() {
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center">
          <ShieldCheck className="mr-2 h-6 w-6" /> Admin Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg">Welcome, Admin!</p>
        <p className="text-muted-foreground mt-2">This is a placeholder for the admin dashboard content. You can manage books, orders, and users from here (once implemented).</p>
      </CardContent>
    </Card>
  );
}
