
"use client";

import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { useStudentData } from '@/hooks/useStudentData';

export function PasswordResetManager() {
  const { students, saveStudents, departmentUsers, saveDepartmentUsers, departments } = useStudentData();
  const { toast } = useToast();
  
  const departmentMap = useMemo(() => new Map(departments.map(dept => [dept.id, dept.description.replace(/Offered by\s*/, '')])), [departments]);

  const studentResetRequests = useMemo(() => {
    return students.filter(s => s.passwordResetRequested);
  }, [students]);

  const departmentResetRequests = useMemo(() => {
    return departmentUsers.filter(u => u.passwordResetRequested);
  }, [departmentUsers]);

  const handleApproveStudentReset = (rollNumber: string) => {
    const updatedStudents = students.map(student => {
      if (student.rollNumber === rollNumber) {
        return { ...student, password: 'password123', passwordResetRequested: false };
      }
      return student;
    });
    saveStudents(updatedStudents);
    toast({
      title: "Student Password Reset",
      description: `Password for ${rollNumber} has been reset to 'password123'.`,
    });
  };

  const handleApproveDepartmentReset = (userId: string) => {
    const updatedUsers = departmentUsers.map(user => {
      if (user.id === userId) {
        return { ...user, password: 'password123', passwordResetRequested: false };
      }
      return user;
    });
    saveDepartmentUsers(updatedUsers);
    toast({
      title: "Department Password Reset",
      description: `Password for department ID ${userId} has been reset to 'password123'.`,
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-primary">Password Reset Requests</CardTitle>
        <CardDescription>Approve password reset requests for students and department heads.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">Student Requests</h3>
          {studentResetRequests.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No pending student password reset requests.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Home Department</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentResetRequests.map(student => (
                  <TableRow key={student.rollNumber}>
                    <TableCell className="font-medium">{student.rollNumber}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{departmentMap.get(student.homeDepartmentId) || student.homeDepartmentId}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => handleApproveStudentReset(student.rollNumber)}>
                        <Check className="mr-2 h-4 w-4" /> Approve Reset
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        
        <Separator />
        
        <div>
           <h3 className="text-lg font-semibold mb-2">Department Head Requests</h3>
            {departmentResetRequests.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No pending department password reset requests.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department ID</TableHead>
                    <TableHead>Department Name</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentResetRequests.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>{departmentMap.get(user.departmentId) || user.name}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" onClick={() => handleApproveDepartmentReset(user.id)}>
                          <Check className="mr-2 h-4 w-4" /> Approve Reset
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
