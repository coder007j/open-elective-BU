
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Clock } from 'lucide-react';
import type { Student } from '@/types';
import { MOCK_STUDENTS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ALL_STUDENTS_STORAGE_KEY = 'allStudentsData';

export function StudentManager() {
  const [students, setStudents] = useState<Student[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(ALL_STUDENTS_STORAGE_KEY);
      setStudents(storedData ? JSON.parse(storedData) : MOCK_STUDENTS);
    } catch {
      setStudents(MOCK_STUDENTS);
    }
  }, []);

  const handleApproveStudent = (rollNumber: string) => {
    const updatedStudents = students.map(student => {
      if (student.rollNumber === rollNumber) {
        return { ...student, status: 'approved' as const };
      }
      return student;
    });

    setStudents(updatedStudents);
    localStorage.setItem(ALL_STUDENTS_STORAGE_KEY, JSON.stringify(updatedStudents));

    toast({
      title: "Student Approved",
      description: `Student with roll number ${rollNumber} has been approved and can now log in.`,
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-primary">Student Registrations</CardTitle>
        <CardDescription>View and approve student registrations.</CardDescription>
      </CardHeader>
      <CardContent>
        {students.length === 0 ? (
           <p className="text-center text-muted-foreground py-8">No students have registered yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map(student => (
                <TableRow key={student.rollNumber}>
                  <TableCell className="font-medium">{student.rollNumber}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.homeDepartmentId.toUpperCase()}</TableCell>
                  <TableCell>{student.semester}</TableCell>
                  <TableCell>
                    <Badge variant={student.status === 'approved' ? 'default' : 'secondary'}>
                      {student.status === 'approved' ? 
                        <Check className="mr-2 h-4 w-4" /> :
                        <Clock className="mr-2 h-4 w-4" />
                      }
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {student.status === 'pending' && (
                      <Button size="sm" onClick={() => handleApproveStudent(student.rollNumber)}>
                        Approve
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
