
"use client";

import React, { useMemo } from 'react';
import type { Student, AuthenticatedUser } from '@/types';
import { useStudentData } from '@/hooks/useStudentData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Check, Clock, Trash2 } from 'lucide-react';

interface DepartmentStudentViewProps {
  currentUser: AuthenticatedUser;
}

export function DepartmentStudentView({ currentUser }: DepartmentStudentViewProps) {
  const { students: allStudents, saveStudents } = useStudentData();
  const { toast } = useToast();

  const departmentStudents = useMemo(() => {
    if (currentUser.role !== 'department') return [];
    return allStudents.filter(student => student.homeDepartmentId === currentUser.departmentId);
  }, [allStudents, currentUser]);

  const handleApproveStudent = (rollNumber: string) => {
    const updatedStudents = allStudents.map(student => {
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

  const handleDeleteStudent = (rollNumber: string) => {
    const updatedStudents = allStudents.filter(student => student.rollNumber !== rollNumber);
    saveStudents(updatedStudents);
    toast({
        title: "Registration Removed",
        description: `The registration for student ${rollNumber} has been removed.`,
        variant: "destructive"
    });
  };

  if (currentUser.role !== 'department') return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Student Roster</CardTitle>
        <CardDescription>
          Approve new student registrations and view all students in the {currentUser.name}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {departmentStudents.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No students are registered in your department yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Last %</TableHead>
                <TableHead>Registration Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departmentStudents.map(student => {
                const studentStatus = student.status || 'pending';
                return (
                <TableRow key={student.rollNumber}>
                  <TableCell className="font-medium">{student.rollNumber}</TableCell>
                  <TableCell>{student.name}</TableCell>
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
                  <TableCell className="text-right space-x-2">
                    {studentStatus === 'pending' && (
                      <>
                        <Button size="sm" onClick={() => handleApproveStudent(student.rollNumber)}>
                          Approve
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteStudent(student.rollNumber)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
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
