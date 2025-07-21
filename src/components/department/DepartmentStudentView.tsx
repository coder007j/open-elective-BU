
"use client";

import React, { useMemo } from 'react';
import type { AuthenticatedUser } from '@/types';
import { useStudentData } from '@/hooks/useStudentData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Clock, ArrowRight, Trash2, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DepartmentStudentViewProps {
  currentUser: AuthenticatedUser;
}

export function DepartmentStudentView({ currentUser }: DepartmentStudentViewProps) {
  const { students: allStudents, departments, saveStudents } = useStudentData();
  const { toast } = useToast();

  const departmentMap = useMemo(() => new Map(departments.map(dept => [dept.id, dept.name])), [departments]);

  const currentDepartmentDetails = useMemo(() => {
     if (currentUser.role !== 'department') return null;
     return departments.find(d => d.id === currentUser.departmentId);
  }, [currentUser, departments]);

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
      description: `Student ${rollNumber} can now log in and select electives.`,
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
  const welcomeName = currentDepartmentDetails ? currentDepartmentDetails.name : currentUser.name;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Student Roster</CardTitle>
        <CardDescription>
          Approve new registrations for students in the {welcomeName}.
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
                <TableHead>Registration Status</TableHead>
                <TableHead>Assigned Elective</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departmentStudents.map(student => {
                const studentStatus = student.status || 'pending';
                return (
                <TableRow key={student.rollNumber}>
                  <TableCell className="font-medium">{student.rollNumber}</TableCell>
                  <TableCell>{student.name}</TableCell>
                   <TableCell>
                    <Badge variant={studentStatus === 'approved' ? 'default' : 'secondary'}>
                      {studentStatus === 'approved' ? 
                        <Check className="mr-2 h-4 w-4" /> :
                        <Clock className="mr-2 h-4 w-4" />
                      }
                      {studentStatus.charAt(0).toUpperCase() + studentStatus.slice(1)}
                    </Badge>
                  </TableCell>
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
                  <TableCell className="text-right">
                    {studentStatus === 'pending' ? (
                      <div className="space-x-2">
                        <Button size="sm" onClick={() => handleApproveStudent(student.rollNumber)}>
                           <Check className="mr-2 h-4 w-4" /> Approve
                        </Button>
                         <Button variant="destructive" size="sm" onClick={() => handleDeleteStudent(student.rollNumber)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      student.assignedElective ? (
                        <div className="flex justify-end items-center text-muted-foreground text-xs">
                          <ShieldCheck className="mr-2 h-4 w-4 text-green-600"/>
                           Allocation Complete
                       </div>
                      ) : (
                        <div className="flex justify-end items-center text-muted-foreground text-xs">
                          <Check className="mr-2 h-4 w-4 text-green-600"/>
                          Approved
                       </div>
                      )
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
