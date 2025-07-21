
"use client";

import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserPlus } from "lucide-react";
import { useStudentData } from '@/hooks/useStudentData';
import { DEPARTMENTS_DATA } from '@/lib/constants';
import type { RegistrationData } from '@/types';

const registrationFormSchema = z.object({
  rollNumber: z.string().min(1, { message: "Roll number is required." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  homeDepartmentId: z.string({ required_error: "Please select your home department." }),
  semester: z.coerce.number().min(1).max(8),
  lastSemesterPercentage: z.coerce.number().min(0, "Percentage must be at least 0.").max(100, "Percentage cannot be more than 100."),
});

type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

export function RegistrationForm() {
  const { toast } = useToast();
  const { registerStudent } = useStudentData();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      rollNumber: "",
      name: "",
      password: "",
      semester: 1,
      lastSemesterPercentage: 0,
    }
  });
  
  const getDepartmentName = (description: string) => {
    return description.replace('Offered by ', '');
  };

  async function onSubmit(values: RegistrationFormValues) {
    setIsLoading(true);
    const result = await registerStudent(values as RegistrationData);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: "Registration Successful",
        description: "Your registration is submitted and is pending approval from the department.",
      });
      form.reset({
        rollNumber: "",
        name: "",
        password: "",
        homeDepartmentId: undefined,
        semester: 1,
        lastSemesterPercentage: 0,
      });
    } else {
      toast({
        title: "Registration Failed",
        description: result.message,
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="rollNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Roll Number</FormLabel>
              <FormControl>
                <Input placeholder="Your unique roll number" {...field} />
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
                <Input placeholder="Your full name" {...field} />
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
                <Input type="password" placeholder="Choose a secure password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="homeDepartmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Home Department</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {DEPARTMENTS_DATA.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>{getDepartmentName(dept.description)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="semester"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Semester</FormLabel>
              <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={String(field.value)}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your semester" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Array.from({ length: 8 }, (_, i) => i + 1).map(sem => (
                    <SelectItem key={sem} value={String(sem)}>{sem}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastSemesterPercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Semester Percentage</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 85.5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registering...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Register
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
