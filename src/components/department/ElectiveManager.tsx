
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Department, AuthenticatedUser } from '@/types';
import { useStudentData } from '@/hooks/useStudentData';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';

const electiveSchema = z.object({
  capacity: z.coerce.number().int().positive({ message: "Capacity must be a positive number." }),
  syllabus: z.string().min(10, { message: "Syllabus must be at least 10 characters." }),
});

type ElectiveFormValues = z.infer<typeof electiveSchema>;

interface ElectiveManagerProps {
  currentUser: AuthenticatedUser;
}

export function ElectiveManager({ currentUser }: ElectiveManagerProps) {
  const { departments, saveDepartments } = useStudentData();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const myElective = useMemo(() => {
    if (currentUser.role !== 'department') return null;
    return departments.find(d => d.id === currentUser.departmentId);
  }, [departments, currentUser]);

  const form = useForm<ElectiveFormValues>({
    resolver: zodResolver(electiveSchema),
  });
  
  useEffect(() => {
    if (myElective) {
      form.reset({
        capacity: myElective.capacity,
        syllabus: myElective.syllabus,
      });
    }
  }, [myElective, form]);

  const handleFormSubmit = (values: ElectiveFormValues) => {
    if (!myElective) {
      toast({ title: "Error", description: "Could not find your department's elective.", variant: "destructive" });
      return;
    }
    setIsLoading(true);

    const updatedDepartments = departments.map(d =>
      d.id === myElective.id ? { ...d, ...values } : d
    );
    saveDepartments(updatedDepartments);
    
    setTimeout(() => {
        toast({ title: "Elective Updated", description: `Your elective details have been saved successfully.` });
        setIsLoading(false);
    }, 500); // Simulate network delay
  };

  if (!myElective) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Your department's elective details could not be loaded. Please contact an administrator.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-primary">Manage Your Elective</CardTitle>
        <CardDescription>Update the student capacity and syllabus for the "{myElective.name}" elective.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Capacity</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 50" {...field} />
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
                    <Textarea placeholder="Enter the full syllabus for your elective..." {...field} rows={8} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
