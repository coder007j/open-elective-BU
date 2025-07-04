
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import type { Department, Student, AuthenticatedUser } from '@/types';
import { DEPARTMENTS_DATA, MOCK_STUDENTS } from '@/lib/constants';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, ThumbsUp, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function useStudentData() {
    const [students, setStudents] = useState<Student[]>(() => {
        try {
            const storedData = localStorage.getItem('allStudentsData');
            return storedData ? JSON.parse(storedData) : MOCK_STUDENTS;
        } catch {
            return MOCK_STUDENTS;
        }
    });

    useEffect(() => {
        localStorage.setItem('allStudentsData', JSON.stringify(students));
    }, [students]);

    return { students, setStudents };
}

interface ApprovalManagerProps {
    currentUser: AuthenticatedUser;
}

export function ApprovalManager({ currentUser }: ApprovalManagerProps) {
  const { toast } = useToast();
  const { students, setStudents } = useStudentData();
  const [departments] = useState<Department[]>(DEPARTMENTS_DATA);
  
  const departmentMap = useMemo(() => 
    new Map(departments.map(dept => [dept.id, dept.name])),
  [departments]);

  const studentsWithPreferences = useMemo(() => {
    const allStudentsWithPrefs = students.filter(s => s.preferences.length > 0);
    if (currentUser.role === 'department') {
        return allStudentsWithPrefs.filter(s => 
            s.homeDepartmentId === currentUser.departmentId || s.preferences[0] === currentUser.departmentId
        );
    }
    return allStudentsWithPrefs;
  }, [students, currentUser]);

  const handleApproval = (rollNumber: string, approvalType: 'home' | 'elective') => {
    setStudents(prevStudents => {
      const newStudents = prevStudents.map(student => {
        if (student.rollNumber === rollNumber) {
          const updatedStudent = { ...student };
          
          if (approvalType === 'home') {
            updatedStudent.homeDeptApproval = true;
          } else if (approvalType === 'elective') {
            updatedStudent.electiveDeptApproval = true;
          }

          if (updatedStudent.homeDeptApproval && updatedStudent.electiveDeptApproval) {
            const chosenElectiveId = updatedStudent.preferences[0];
            const chosenElective = departments.find(d => d.id === chosenElectiveId);
            
            if (chosenElective && chosenElective.assignedStudents.length < chosenElective.capacity) {
                updatedStudent.assignedElective = chosenElectiveId;
                updatedStudent.assignmentReason = `Approved and assigned to ${chosenElective.name}.`;
                 toast({
                    title: "Student Assigned",
                    description: `${student.name} has been assigned to ${chosenElective.name}.`,
                });
            } else {
                 updatedStudent.assignmentReason = `Approval complete, but ${chosenElective?.name || 'choice'} is now full.`;
                 toast({
                    title: "Capacity Full",
                    description: `Could not assign ${student.name}. ${chosenElective?.name || 'Their choice'} is full.`,
                    variant: "destructive",
                });
            }
          }
          return updatedStudent;
        }
        return student;
      });
      return newStudents;
    });
  };

  const canApprove = (student: Student, type: 'home' | 'elective'): boolean => {
      if (currentUser.role === 'admin') return true;
      if (currentUser.role === 'department') {
          if (type === 'home') return student.homeDepartmentId === currentUser.departmentId;
          if (type === 'elective') return student.preferences[0] === currentUser.departmentId;
      }
      return false;
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>
                {studentsWithPreferences.length > 0
                    ? `Showing ${studentsWithPreferences.length} student(s) with submitted preferences.`
                    : "No students have submitted preferences yet."
                }
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Alert className="mb-6 bg-primary/10 border-primary/30">
                <Info className="h-5 w-5 text-primary" />
                <AlertTitle className="font-semibold text-primary">Approval Process</AlertTitle>
                <AlertDescription>
                    For each student, approval is required from both their home department and the department of their chosen elective. Once both are approved, the student is assigned.
                </AlertDescription>
            </Alert>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Home Department</TableHead>
                        <TableHead>Chosen Elective</TableHead>
                        <TableHead>Home Dept. Approval</TableHead>
                        <TableHead>Elective Dept. Approval</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {studentsWithPreferences.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                                No pending approvals.
                            </TableCell>
                        </TableRow>
                    ) : (
                        studentsWithPreferences.map(student => (
                            <TableRow key={student.rollNumber} className={student.assignedElective ? 'bg-green-100 dark:bg-green-900/30' : ''}>
                                <TableCell className="font-medium">{student.name} <span className="text-muted-foreground text-xs">({student.rollNumber})</span></TableCell>
                                <TableCell>{departmentMap.get(student.homeDepartmentId) || 'N/A'}</TableCell>
                                <TableCell>{departmentMap.get(student.preferences[0]) || 'N/A'}</TableCell>
                                <TableCell>
                                    <Badge variant={student.homeDeptApproval ? "default" : "secondary"}>
                                        {student.homeDeptApproval ? <CheckCircle className="h-4 w-4 mr-2" /> : <Clock className="h-4 w-4 mr-2" />}
                                        {student.homeDeptApproval ? 'Approved' : 'Pending'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={student.electiveDeptApproval ? "default" : "secondary"}>
                                        {student.electiveDeptApproval ? <CheckCircle className="h-4 w-4 mr-2" /> : <Clock className="h-4 w-4 mr-2" />}
                                        {student.electiveDeptApproval ? 'Approved' : 'Pending'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="space-x-2 text-center">
                                   {!student.homeDeptApproval && (
                                        <Button size="sm" onClick={() => handleApproval(student.rollNumber, 'home')} disabled={!!student.assignedElective || !canApprove(student, 'home')}>
                                            <ThumbsUp className="h-4 w-4 mr-2" />
                                            Approve (Home)
                                        </Button>
                                   )}
                                   {!student.electiveDeptApproval && (
                                        <Button size="sm" onClick={() => handleApproval(student.rollNumber, 'elective')} disabled={!!student.assignedElective || !canApprove(student, 'elective')}>
                                            <ThumbsUp className="h-4 w-4 mr-2" />
                                            Approve (Elective)
                                        </Button>
                                   )}
                                   {student.assignedElective && (
                                       <Badge variant="default" className="bg-green-600">Assigned</Badge>
                                   )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
