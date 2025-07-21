
"use client";

import React, { useState, useMemo } from 'react';
import type { Department, Student, AssignElectivesInput, AssignElectivesOutput } from '@/types';
import { useStudentData } from '@/hooks/useStudentData';
import { assignElectives } from '@/ai/flows/assign-electives';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bot, CheckCircle, Info, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AllocationManager() {
  const { toast } = useToast();
  const { students, departments, saveStudents } = useStudentData();
  const [isLoading, setIsLoading] = useState(false);
  const [allocationResult, setAllocationResult] = useState<AssignElectivesOutput | null>(null);

  const studentsWithPreferences = useMemo(() => {
    return students.filter(s => s.status === 'approved' && s.preferences.length > 0);
  }, [students]);

  const departmentMap = useMemo(() => new Map(departments.map(dept => [dept.id, dept.name])), [departments]);

  const handleRunAllocation = async () => {
    setIsLoading(true);
    setAllocationResult(null);

    const allocationInput: AssignElectivesInput = {
      students: studentsWithPreferences.map(s => ({
        rollNumber: s.rollNumber,
        preferences: s.preferences,
        homeDepartment: s.homeDepartmentId,
        lastSemesterPercentage: s.lastSemesterPercentage,
      })),
      departments: departments.map(d => ({
        name: d.id,
        capacity: d.capacity,
        // Reset assigned students before running allocation
        assignedStudents: [], 
      })),
    };

    try {
      const result = await assignElectives(allocationInput);
      setAllocationResult(result);
      
      // Update the main students data with the new assignments
      const updatedStudents = students.map(student => {
        const assignment = result.assignments.find(a => a.rollNumber === student.rollNumber);
        if (assignment) {
          return { 
            ...student, 
            assignedElective: assignment.assignedDepartment,
            assignmentReason: assignment.reason 
          };
        }
        return student;
      });
      saveStudents(updatedStudents);

      toast({
        title: "Allocation Complete",
        description: `${result.assignments.filter(a => a.assignedDepartment).length} students were successfully assigned.`,
      });
    } catch (error) {
      console.error("Allocation failed:", error);
      const message = error instanceof Error ? error.message : "An unknown error occurred during allocation.";
      toast({
        title: "Allocation Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Automated Elective Allocation</CardTitle>
        <CardDescription>
          Use the AI-powered allocation system to assign students to electives based on merit and fairness.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6 bg-primary/10 border-primary/30">
          <Info className="h-5 w-5 text-primary" />
          <AlertTitle className="font-semibold text-primary">Allocation Process</AlertTitle>
          <AlertDescription>
            The system allocates students based on last semester's percentage (higher is better) and uses a round-robin algorithm across home departments to ensure fairness. It respects all department capacity constraints.
          </AlertDescription>
        </Alert>

        <div className="flex justify-center mb-6">
          <Button onClick={handleRunAllocation} disabled={isLoading || studentsWithPreferences.length === 0} size="lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Allocating Students...
              </>
            ) : (
              <>
                <Bot className="mr-2 h-5 w-5" />
                Run Allocation
              </>
            )}
          </Button>
        </div>
        
        {studentsWithPreferences.length === 0 && !allocationResult && (
             <p className="text-center text-muted-foreground py-8">No students with submitted preferences to allocate.</p>
        )}

        {allocationResult && (
          <div>
            <h3 className="text-xl font-bold mb-4 text-center">Allocation Results</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Assigned Elective</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allocationResult.assignments.map(result => (
                  <TableRow key={result.rollNumber} className={result.assignedDepartment ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}>
                    <TableCell className="font-medium">{result.rollNumber}</TableCell>
                    <TableCell>
                      {result.assignedDepartment ? (
                        <Badge variant="default">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {departmentMap.get(result.assignedDepartment) || result.assignedDepartment}
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Not Assigned</Badge>
                      )}
                    </TableCell>
                    <TableCell>{result.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
