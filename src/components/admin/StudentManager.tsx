
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Clock } from 'lucide-react';
import type { Student } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useStudentData } from '@/hooks/useStudentData';

export function StudentManager() {
  const { students, saveStudents } = useStudentData();
  const { toast } = useToast();

  const handleApproveStudent = (rollNumber: string) => {
    const updatedStudents = students.map(student => {
      if (student.rollNumber === rollNumber) {
        return { ...student, status: 'approved' as const };
      }
      return student;
    });

    saveStudents(updatedStudents);

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
                <TableHead>Last %</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map(student => {
                const studentStatus = student.status || 'pending';
                return (
                <TableRow key={student.rollNumber}>
                  <TableCell className="font-medium">{student.rollNumber}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.homeDepartmentId.toUpperCase()}</TableCell>
                  <TableCell>{student.semester}</TableCell>
                   <TableCell>{student.lastSemesterPercentage?.toFixed(1)}%</TableCell>
                  <TableCell>
                    <Badge variant={studentStatus === 'approved' ? 'default' : 'secondary'}>
                      {studentStatus === 'approved' ? 
                        <Check className="mr-2 h-4 w-4" /> :
                        <Clock className="mr-2 h-4 w-4" />
                      }
                      {studentStatus.charAt(0).toUpperCase() + studentStatus.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {studentStatus === 'pending' && (
                      <Button size="sm" onClick={() => handleApproveStudent(student.rollNumber)}>
                        Approve
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
