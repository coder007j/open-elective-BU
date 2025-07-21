
"use client";

import React, { useMemo } from 'react';
import type { AuthenticatedUser } from '@/types';
import { useStudentData } from '@/hooks/useStudentData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface IncomingStudentsViewProps {
  currentUser: AuthenticatedUser;
}

export function IncomingStudentsView({ currentUser }: IncomingStudentsViewProps) {
  const { students: allStudents, departments } = useStudentData();
  const departmentMap = useMemo(() => new Map(departments.map(dept => [dept.id, dept.name])), [departments]);

  const incomingStudents = useMemo(() => {
    if (currentUser.role !== 'department') return [];
    // Filter for students who have been assigned to this department's elective
    return allStudents.filter(student => student.assignedElective === currentUser.departmentId);
  }, [allStudents, currentUser]);

  if (currentUser.role !== 'department') return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incoming Elective Students</CardTitle>
        <CardDescription>
          The following students have been allocated to your department's elective.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {incomingStudents.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No students have been allocated to your department's elective yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Home Department</TableHead>
                <TableHead>Last %</TableHead>
                <TableHead>Allocation Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incomingStudents.map(student => (
                <TableRow key={student.rollNumber}>
                  <TableCell className="font-medium">{student.rollNumber}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                        {departmentMap.get(student.homeDepartmentId) || student.homeDepartmentId.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{student.lastSemesterPercentage?.toFixed(1)}%</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{student.assignmentReason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
