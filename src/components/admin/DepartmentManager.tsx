
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export function DepartmentManager() {
  // Placeholder data - in a real app, this would come from a data source or state
  const departments = [
    { id: 'cs', name: 'Computer Science', capacity: 50, current: 45 },
    { id: 'mech', name: 'Mechanical Engineering', capacity: 40, current: 38 },
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-headline text-primary">Department Management</CardTitle>
            <CardDescription>View, add, or edit elective departments.</CardDescription>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Department
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {departments.map(dept => (
            <Card key={dept.id} className="bg-background">
              <CardHeader>
                <CardTitle className="text-lg">{dept.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Capacity: {dept.capacity}</p>
                <p>Currently Enrolled: {dept.current}</p>
              </CardContent>
              {/* Add Edit/Delete buttons here */}
            </Card>
          ))}
          {departments.length === 0 && <p>No departments configured yet.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
