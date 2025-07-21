
"use client";

import React, { useMemo } from 'react';
import type { Student, AuthenticatedUser } from '@/types';
import { useStudentData } from '@/hooks/useStudentData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, ArrowRight } from 'lucide-react';

interface DepartmentStudentViewProps {
  currentUser: AuthenticatedUser;
}

export function DepartmentStudentView({ currentUser }: DepartmentStudentViewProps) {
  const { students: allStudents, departments } = useStudentData();

  const departmentMap = useMemo(() => new Map(departments.map(dept => [dept.id, dept.name])), [departments]);
  
  const getDepartmentName = (description: string) => {
    return description.replace(/Offered by\s*/, '');
  };

  const currentDepartmentDetails = useMemo(() => {
     if (currentUser.role !== 'department') return null;
     return departments.find(d => d.id === currentUser.departmentId);
  }, [currentUser, departments]);

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
          View all students registered in the {currentDepartmentDetails ? getDepartmentName(currentDepartmentDetails.description) : currentUser.name}. Student approvals are handled by the Admin.
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
                <TableHead>Last %</TableHead>
                <TableHead>Assigned Elective</TableHead>
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
                  <TableCell>{student.lastSemesterPercentage?.toFixed(1)}%</TableCell>
                   <TableCell>
                    {student.assignedElective ? (
                      <Badge variant="outline" className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3" />
                        {departmentMap.get(student.assignedElective) || 'N/A'}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </TableCell>
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
