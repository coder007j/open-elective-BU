
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Department } from '@/types';
import { useStudentData } from '@/hooks/useStudentData'; // To get department data source
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const departmentSchema = z.object({
  id: z.string().min(1, "ID is required").optional(),
  name: z.string().min(3, { message: "Department name must be at least 3 characters." }),
  capacity: z.coerce.number().int().positive({ message: "Capacity must be a positive number." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  iconName: z.string().min(1, { message: "Icon name is required (e.g., Cpu, Wrench)." }),
  syllabus: z.string().optional(),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

export function DepartmentManager() {
  // We'll manage department data in its own state within this component for now
  const { departments: initialDepts, saveDepartments } = useStudentData();
  const [departments, setDepartments] = useState<Department[]>(initialDepts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const { toast } = useToast();

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
  });

  useEffect(() => {
    if (editingDepartment) {
      form.reset(editingDepartment);
    } else {
      form.reset({
        name: "",
        capacity: 10,
        description: "",
        iconName: "BookOpen",
        syllabus: "",
      });
    }
  }, [editingDepartment, form]);


  const handleOpenDialog = (dept: Department | null = null) => {
    setEditingDepartment(dept);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (values: DepartmentFormValues) => {
    let updatedDepartments;
    if (editingDepartment) {
      // Update existing department
      updatedDepartments = departments.map(d =>
        d.id === editingDepartment.id ? { ...d, ...values, id: d.id } : d
      );
       toast({ title: "Department Updated", description: `Updated details for ${values.name}.` });
    } else {
      // Add new department
      const newDepartment: Department = {
        id: values.name.toLowerCase().replace(/\s+/g, '-'), // Simple ID generation
        name: values.name,
        capacity: values.capacity,
        description: values.description,
        iconName: values.iconName as Department['iconName'],
        syllabus: values.syllabus || '',
        assignedStudents: [],
      };
      updatedDepartments = [...departments, newDepartment];
       toast({ title: "Department Added", description: `${values.name} has been added.` });
    }

    setDepartments(updatedDepartments);
    saveDepartments(updatedDepartments);
    setIsFormOpen(false);
    setEditingDepartment(null);
  };
  
  const handleDeleteDepartment = (departmentId: string) => {
    const updatedDepartments = departments.filter(d => d.id !== departmentId);
    setDepartments(updatedDepartments);
    saveDepartments(updatedDepartments);
     toast({ title: "Department Deleted", description: "The department has been removed.", variant: "destructive" });
  };


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-headline text-primary">Department Management</CardTitle>
            <CardDescription>View, add, or edit elective departments and their syllabi.</CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Department
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingDepartment ? 'Edit Department' : 'Add New Department'}</DialogTitle>
                <DialogDescription>
                  Enter the details for the department. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Computer Science" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacity</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Brief description of the department" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="syllabus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Syllabus</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter the full syllabus for the elective..." {...field} rows={6} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="iconName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon Name (from Lucide Icons)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Cpu, Wrench, BookOpen" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save Department</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

        {departments.length === 0 ? (
          <p>No departments configured yet. Click "Add Department" to get started.</p>
        ) : (
          <div className="space-y-4">
            {departments.map(dept => (
              <Card key={dept.id} className="bg-muted/30">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{dept.name}</CardTitle>
                      <CardDescription className="text-xs">{dept.id}</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleOpenDialog(dept)}>
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteDepartment(dept.id)}>
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">{dept.description}</p>
                   <p className="text-sm text-muted-foreground truncate mb-2">
                      <span className="font-medium text-foreground">Syllabus: </span>
                      {dept.syllabus ? dept.syllabus : 'Not set'}
                   </p>
                  <p className="text-sm font-medium">Capacity: {dept.capacity}</p>
                  <p className="text-sm font-medium">Currently Enrolled: {dept.assignedStudents.length}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
