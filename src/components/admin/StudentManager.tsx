
"use client";

import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Clock, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useStudentData } from '@/hooks/useStudentData';
import type { Student } from '@/types';

export function StudentManager() {
  const { students, saveStudents, departments } = useStudentData();
  const { toast } = useToast();

  const departmentMap = useMemo(() => 
    new Map(departments.map(dept => [dept.id, { name: dept.name, description: dept.description.replace(/Offered by\s*/, '') }]))
  , [departments]);

  const groupedStudents = useMemo(() => {
    return students.reduce((acc, student) => {
      const deptId = student.homeDepartmentId;
      if (!acc[deptId]) {
        acc[deptId] = [];
      }
      acc[deptId].push(student);
      return acc;
    }, {} as Record<string, Student[]>);
  }, [students]);
  
  const getDepartmentDetails = (id: string) => {
    return departmentMap.get(id) || { name: id.toUpperCase(), description: 'Unknown Department' };
  };

  const handleDeleteStudent = (rollNumber: string) => {
    const updatedStudents = students.filter(student => student.rollNumber !== rollNumber);
    saveStudents(updatedStudents);
    toast({
        title: "Registration Removed",
        description: `The registration for student ${rollNumber} has been removed.`,
        variant: "destructive"
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-primary">Student Registrations</CardTitle>
        <CardDescription>View all student registrations, grouped by their home department.</CardDescription>
      </CardHeader>
      <CardContent>
        {students.length === 0 ? (
           <p className="text-center text-muted-foreground py-8">No students have registered yet.</p>
        ) : (
          <Accordion type="multiple" className="w-full">
            {Object.entries(groupedStudents).map(([deptId, studentList]) => {
              const deptDetails = getDepartmentDetails(deptId);
              return (
              <AccordionItem value={deptId} key={deptId}>
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <div className="flex flex-col text-left">
                     <span>{deptDetails.description}</span>
                     <span className="text-sm font-normal text-muted-foreground">{deptDetails.name} ({studentList.length} students)</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Roll Number</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Semester</TableHead>
                        <TableHead>Last %</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentList.map(student => {
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
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteStudent(student.rollNumber)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )})}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            )})}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
