
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Department, AuthenticatedUser } from '@/types';
import { useStudentData } from '@/hooks/useStudentData';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, FileUp, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf"];

const electiveSchema = z.object({
  capacity: z.coerce.number().int().positive({ message: "Capacity must be a positive number." }),
  syllabusFile: z
    .any()
    .refine((files) => files?.length <= 1, "Only one file can be uploaded.")
    .refine((files) => !files || files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => !files || ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      ".pdf files are accepted."
    ).optional(),
});

type ElectiveFormValues = z.infer<typeof electiveSchema>;

interface ElectiveManagerProps {
  currentUser: AuthenticatedUser;
}

// Helper to convert file to Base64 Data URI
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

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
        capacity: myElective.capacity || 0,
      });
    }
  }, [myElective, form]);

  const handleFormSubmit = async (values: ElectiveFormValues) => {
    if (!myElective) {
      toast({ title: "Error", description: "Could not find your department's elective.", variant: "destructive" });
      return;
    }
    setIsLoading(true);

    let syllabusData = myElective.syllabus; // Keep old syllabus if no new file
    if (values.syllabusFile && values.syllabusFile.length > 0) {
        const file = values.syllabusFile[0];
        syllabusData = await toBase64(file);
    }
    
    const updatedDepartments = departments.map(d =>
      d.id === myElective.id ? { ...d, capacity: values.capacity, syllabus: syllabusData } : d
    );
    saveDepartments(updatedDepartments);
    
    setTimeout(() => {
        toast({ title: "Elective Updated", description: `Your elective details have been saved successfully.` });
        setIsLoading(false);
        form.reset({
            capacity: values.capacity,
            syllabusFile: undefined
        });
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

  const hasPdfSyllabus = myElective.syllabus.startsWith('data:application/pdf');

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
              name="syllabusFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Syllabus (PDF Only)</FormLabel>
                  <FormControl>
                    <Input type="file" accept="application/pdf" {...form.register('syllabusFile')} />
                  </FormControl>
                   <FormMessage />
                   <div className={cn("text-sm text-muted-foreground mt-2 p-3 rounded-md", hasPdfSyllabus ? 'bg-green-100 dark:bg-green-900/20' : 'bg-muted/50')}>
                     {hasPdfSyllabus ? (
                       <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-green-700 dark:text-green-400" />
                          <span>A syllabus PDF is currently uploaded. Uploading a new file will replace it.</span>
                       </div>
                     ) : (
                       <div className="flex items-center gap-2">
                          <FileUp className="h-5 w-5" />
                          <span>No PDF syllabus uploaded. Please upload a file.</span>
                       </div>
                     )}
                   </div>
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
