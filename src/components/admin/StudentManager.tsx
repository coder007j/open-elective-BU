
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Edit, Trash2, Eye } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Student } from '@/types';
import { MOCK_STUDENTS } from '@/lib/constants'; // Assuming initial data might come from here
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const studentSchema = z.object({
  rollNumber: z.string().min(1, { message: "Roll number is required." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }), // For mock purposes
});

type StudentFormValues = z.infer<typeof studentSchema>;
type AdminManagedStudent = Omit<Student, 'preferences' | 'assignedElective' | 'assignmentReason'>;


export function StudentManager() {
  const [students, setStudents] = useState<AdminManagedStudent[]>(MOCK_STUDENTS);
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      rollNumber: "",
      name: "",
      password: "",
    },
  });

  const handleAddStudent = (values: StudentFormValues) => {
    const newStudent: AdminManagedStudent = {
      rollNumber: values.rollNumber,
      name: values.name,
      password: values.password, // Store password for mock login; in real app, hash it
    };
    setStudents(prev => [...prev, newStudent]);
    setIsAddStudentDialogOpen(false);
    form.reset();
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-headline text-primary">Student Management</CardTitle>
            <CardDescription>View, add, or edit student details and assignments.</CardDescription>
          </div>
          <Dialog open={isAddStudentDialogOpen} onOpenChange={setIsAddStudentDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => form.reset()}>
                <UserPlus className="mr-2 h-5 w-5" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>
                  Enter the student's details. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddStudent)} className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="rollNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Roll Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., S101, user001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Alice Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Min. 6 characters" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                     <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                      </DialogClose>
                    <Button type="submit">Save Student</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {students.length === 0 ? (
           <p>No students registered yet. Click "Add Student" to get started.</p>
        ) : (
          <div className="space-y-4">
            {students.map(student => (
              <Card key={student.rollNumber} className="bg-muted/30">
                <CardHeader>
                   <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{student.name} ({student.rollNumber})</CardTitle>
                        {/* In a real app, you wouldn't display assigned elective here as admin manages base details */}
                        {/* <CardDescription>Assigned: {student.assignedElective || 'N/A'}</CardDescription> */}
                      </div>
                       <div className="flex space-x-2">
                        <Button variant="outline" size="sm" disabled> {/* Placeholder */}
                          <Eye className="h-4 w-4 mr-1" /> View/Assign
                        </Button>
                        <Button variant="outline" size="sm" disabled> {/* Placeholder */}
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button variant="destructive" size="sm" disabled> {/* Placeholder */}
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div>
                   </div>
                </CardHeader>
                 {/* 
                <CardContent>
                   Placeholder for more details if needed, e.g., view preferences
                </CardContent>
                */}
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
