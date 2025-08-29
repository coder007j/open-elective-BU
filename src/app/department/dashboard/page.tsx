
"use client";

import { DepartmentDashboardClient } from '@/components/department/DepartmentDashboardClient';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useStudentData } from '@/hooks/useStudentData';
import { useMemo } from 'react';

export default function DepartmentDashboardPage() {
  const { currentUser, isLoading } = useAuth();
  const { departments } = useStudentData();

  const getDepartmentNameFromDescription = (description: string) => {
    // Extracts the name from "Offered by Dept. of X"
    return description.replace(/Offered by\s*/, '');
  };

  const departmentDetails = useMemo(() => {
    if (!currentUser || currentUser.role !== 'department') return null;
    return departments.find(d => d.id === currentUser.departmentId);
  }, [currentUser, departments]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser || currentUser.role !== 'department') {
    return (
       <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>You do not have permission to view this page.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Redirecting to login...</p>
        </CardContent>
      </Card>
    );
  }
  
  // Use the full description from the found department details for the welcome name
  const welcomeName = departmentDetails ? getDepartmentNameFromDescription(departmentDetails.description) : currentUser.name;

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 p-6 bg-card rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold font-headline text-primary mb-2">
          Department Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Welcome, {welcomeName} Head. View your student roster and incoming elective students.
        </p>
      </div>
      <DepartmentDashboardClient currentUser={currentUser} />
    </div>
  );
}
