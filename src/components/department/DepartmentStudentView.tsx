
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { Student, AuthenticatedUser } from '@/types';
import { MOCK_STUDENTS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Check, Clock } from 'lucide-react';

const ALL_STUDENTS_STORAGE_KEY = 'allStudentsData';

interface DepartmentStudentViewProps {
  currentUser: AuthenticatedUser;
}

export function DepartmentStudentView({ currentUser }: DepartmentStudentViewProps) {
  const [allStudents, setAllStudents] = useState<Student[]>([]);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(ALL_STUDENTS_STORAGE_KEY);
      setAllStudents(storedData ? JSON.parse(storedData) : MOCK_STUDENTS);
    } catch {
      setAllStudents(MOCK_STUDENTS);
    }
  }, []);

  const departmentStudents = useMemo(() => {
    if (currentUser.role !== 'department') return [];
    return allStudents.filter(student => student.homeDepartmentId === currentUser.departmentId);
  }, [allStudents, currentUser]);

  if (currentUser.role !== 'department') return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Student Roster</CardTitle>
        <CardDescription>
          Showing all students registered under the {currentUser.name}.
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
                <TableHead>Registration Status</TableHead>
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
                  <TableCell>
                    <Badge variant={studentStatus === 'approved' ? 'default' : 'secondary'}>
                      {studentStatus === 'approved' ? 
                        <Check className="mr-2 h-4 w-4" /> :
                        <Clock className="mr-2 h-4 w-4" />
                      }
                      {studentStatus.charAt(0).toUpperCase() + studentStatus.slice(1)}
                    </Badge>
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
