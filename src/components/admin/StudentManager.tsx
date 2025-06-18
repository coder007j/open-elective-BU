
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

export function StudentManager() {
  // Placeholder data
  const students = [
    { id: '101', name: 'Alice Smith', rollNumber: 'S101', assignedElective: 'Computer Science' },
    { id: '102', name: 'Bob Johnson', rollNumber: 'S102', assignedElective: 'Mechanical Engineering' },
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-headline text-primary">Student Management</CardTitle>
            <CardDescription>View, add, or edit student details and assignments.</CardDescription>
          </div>
          <Button>
            <UserPlus className="mr-2 h-5 w-5" />
            Add Student
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {students.map(student => (
            <Card key={student.id} className="bg-background">
              <CardHeader>
                <CardTitle className="text-lg">{student.name} ({student.rollNumber})</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Assigned Elective: {student.assignedElective || 'Not Assigned'}</p>
              </CardContent>
              {/* Add Edit/View Details buttons here */}
            </Card>
          ))}
          {students.length === 0 && <p>No students registered yet.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
