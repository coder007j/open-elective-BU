
"use client";

import React, { useState, useMemo } from 'react';
import type { Department, Student } from '@/types';
import type { AssignElectivesInput, AssignElectivesOutput } from '@/ai/flows/assign-electives';
import { assignElectives } from '@/ai/flows/assign-electives';
import { DEPARTMENTS_DATA, MOCK_STUDENTS } from '@/lib/constants';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, Loader2, Shuffle, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type EnrichedStudent = Student & { assignedDepartmentName?: string | null };

export function AllocationManager() {
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>(() => JSON.parse(JSON.stringify(DEPARTMENTS_DATA)));
  const [students, setStudents] = useState<EnrichedStudent[]>(() => 
    MOCK_STUDENTS.map(s => ({
      ...s,
      preferences: [], 
      assignedElective: null,
      assignmentReason: null,
    }))
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isAllocationRun, setIsAllocationRun] = useState(false);

  const handleRunAllocation = async () => {
    setIsLoading(true);
    setIsAllocationRun(false);

    // In a real app, preferences would be fetched from a database.
    // For this demo, we'll assign mock preferences to students to ensure the AI has data to work with.
    const studentsWithMockPreferences = students.map((student) => {
        const shuffledDepartments = [...departments].sort(() => 0.5 - Math.random());
        const numPreferences = Math.floor(Math.random() * (MAX_PREFERENCES - 1)) + 2; // 2 to MAX_PREFERENCES
        return {
            rollNumber: student.rollNumber,
            preferences: shuffledDepartments.slice(0, numPreferences).map(d => d.name),
        };
    });

    const assignmentInput: AssignElectivesInput = {
      students: studentsWithMockPreferences,
      departments: departments.map(dept => ({
        name: dept.name,
        capacity: dept.capacity,
        assignedStudents: dept.assignedStudents,
      })),
    };

    try {
        const result: AssignElectivesOutput = await assignElectives(assignmentInput);
        
        const newStudentsState: EnrichedStudent[] = [...students];
        const newDepartmentsState: Department[] = JSON.parse(JSON.stringify(DEPARTMENTS_DATA)); 

        result.assignments.forEach(assignment => {
            const studentIndex = newStudentsState.findIndex(s => s.rollNumber === assignment.rollNumber);
            if (studentIndex !== -1) {
                const assignedDept = newDepartmentsState.find(d => d.name === assignment.assignedDepartment);
                
                newStudentsState[studentIndex].assignedElective = assignedDept?.id || null;
                newStudentsState[studentIndex].assignedDepartmentName = assignment.assignedDepartment;
                newStudentsState[studentIndex].assignmentReason = assignment.reason;

                if (assignedDept && !assignedDept.assignedStudents.includes(assignment.rollNumber)) {
                    assignedDept.assignedStudents.push(assignment.rollNumber);
                }
            }
        });

        setStudents(newStudentsState);
        setDepartments(newDepartmentsState);
        setIsAllocationRun(true);

        toast({
            title: "Allocation Complete",
            description: "Students have been assigned to electives.",
        });

    } catch (error) {
      console.error("Error running allocation:", error);
      toast({
        title: "Allocation Failed",
        description: "An unexpected error occurred during the AI allocation.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const allocationStats = useMemo(() => {
    if (!isAllocationRun) return { assigned: 0, unassigned: students.length };
    const assigned = students.filter(s => !!s.assignedElective).length;
    return {
        assigned,
        unassigned: students.length - assigned,
    }
  }, [students, isAllocationRun]);

  return (
    <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-headline text-primary">Run Elective Allocation</CardTitle>
                <CardDescription>Use the AI assistant to assign all students to their preferred electives based on department capacity.</CardDescription>
            </CardHeader>
            <CardContent>
                <Alert className="mb-6 bg-primary/10 border-primary/30">
                    <Info className="h-5 w-5 text-primary" />
                    <AlertTitle className="font-semibold text-primary">How it Works</AlertTitle>
                    <AlertDescription>
                        Clicking 'Run Allocation' will send all student data and department capacities to the AI, which will then determine the optimal assignment for everyone.
                    </AlertDescription>
                </Alert>
                <Button onClick={handleRunAllocation} disabled={isLoading} size="lg">
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Allocating...
                        </>
                    ) : (
                        <>
                            <Shuffle className="mr-2 h-5 w-5" />
                            Run AI Allocation
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
                 <Card>
                    <CardHeader>
                        <CardTitle>Department Status</CardTitle>
                        <CardDescription>Live view of department enrollment.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {departments.map(dept => (
                            <div key={dept.id} className="text-sm p-2 bg-muted/40 rounded-md">
                                <div className="font-semibold">{dept.name}</div>
                                <div className="text-muted-foreground">
                                    Enrolled: {dept.assignedStudents.length} / {dept.capacity}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Allocation Results</CardTitle>
                        <CardDescription>
                            {isAllocationRun 
                                ? `Assigned: ${allocationStats.assigned}, Unassigned: ${allocationStats.unassigned}`
                                : "Results will be shown here after running the allocation."
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Assigned Department</TableHead>
                                    <TableHead>Reason</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {!isAllocationRun ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                                            Run the allocation to see results.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    students.map(student => (
                                        <TableRow key={student.rollNumber}>
                                            <TableCell className="font-medium">{student.name} <span className="text-muted-foreground text-xs">({student.rollNumber})</span></TableCell>
                                            <TableCell>
                                                {student.assignedDepartmentName ? (
                                                    <Badge variant="default" className="flex items-center gap-2 w-fit">
                                                        <CheckCircle className="h-4 w-4"/>
                                                        {student.assignedDepartmentName}
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="destructive" className="flex items-center gap-2 w-fit">
                                                        <XCircle className="h-4 w-4"/>
                                                        Not Assigned
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {student.assignmentReason || 'N/A'}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
