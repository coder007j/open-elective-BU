"use client";

import { ElectiveSelectionClient } from '@/components/dashboard/ElectiveSelectionClient';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser) {
    // This case should ideally be handled by the layout's auth check,
    // but as a fallback:
    return (
       <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>Please log in to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Redirecting to login...</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 p-6 bg-card rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold font-headline text-primary mb-2">
          Welcome, {currentUser.name}!
        </h1>
        <p className="text-lg text-muted-foreground">
          Manage your elective selections here.
        </p>
      </div>
      <ElectiveSelectionClient />
    </div>
  );
}
