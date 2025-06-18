
"use client";

import React, { useState } from 'react';
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
import { DEPARTMENTS_DATA } from '@/lib/constants'; // Assuming initial data might come from here
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from '@/components/ui/textarea';

const departmentSchema = z.object({
  id: z.string().min(1, "ID is required").optional(), // ID will be auto-generated or based on name
  name: z.string().min(3, { message: "Department name must be at least 3 characters." }),
  capacity: z.coerce.number().int().positive({ message: "Capacity must be a positive number." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  iconName: z.string().min(1, { message: "Icon name is required (e.g., Cpu, Wrench)." }),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

export function DepartmentManager() {
  const [departments, setDepartments] = useState<Department[]>(DEPARTMENTS_DATA);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      capacity: 10,
      description: "",
      iconName: "BookOpen",
    },
  });

  const handleAddDepartment = (values: DepartmentFormValues) => {
    const newDepartment: Department = {
      id: values.name.toLowerCase().replace(/\s+/g, '-'), // Simple ID generation
      name: values.name,
      capacity: values.capacity,
      description: values.description,
      iconName: values.iconName as Department['iconName'],
      assignedStudents: [], // New departments start with no students
    };
    setDepartments(prev => [...prev, newDepartment]);
    setIsAddDialogOpen(false);
    form.reset();
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-headline text-primary">Department Management</CardTitle>
            <CardDescription>View, add, or edit elective departments.</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => form.reset()}>
                <PlusCircle className="mr-2 h-5 w-5" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Department</DialogTitle>
                <DialogDescription>
                  Enter the details for the new department. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddDepartment)} className="space-y-4 py-4">
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
                      <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save Department</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
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
                      <CardDescription className="text-xs">{dept.iconName}</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" disabled> {/* Placeholder */}
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" disabled> {/* Placeholder */}
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-1">{dept.description}</p>
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
