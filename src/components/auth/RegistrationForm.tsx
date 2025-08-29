
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
import { Loader2, UserPlus, Eye, EyeOff } from "lucide-react";
import { useStudentData } from '@/hooks/useStudentData';
import type { RegistrationData } from '@/types';

const registrationFormSchema = z.object({
  rollNumber: z.string().min(1, { message: "Roll number is required." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  homeDepartmentId: z.string({ required_error: "Please select your home department." }),
  semester: z.coerce.number().min(1).max(4, "Please select a valid semester."),
  lastSemesterPercentage: z.coerce.number().min(40, "Percentage must be at least 40.").max(100, "Percentage cannot be more than 100."),
});

type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

export function RegistrationForm() {
  const { toast } = useToast();
  const { registerStudent, departments } = useStudentData();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      rollNumber: "",
      name: "",
      password: "",
      semester: 1,
      lastSemesterPercentage: 40,
    }
  });
  
  const getDepartmentName = (description: string) => {
    return description.replace(/Offered by\s*/, '');
  };

  async function onSubmit(values: RegistrationFormValues) {
    setIsLoading(true);
    const result = await registerStudent(values as RegistrationData);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: "Registration Successful",
        description: "Your registration is submitted and is pending approval from your home department.",
      });
      form.reset({
        rollNumber: "",
        name: "",
        password: "",
        homeDepartmentId: undefined,
        semester: 1,
        lastSemesterPercentage: 40,
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
              <div className="relative">
                <FormControl>
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Choose a secure password" 
                    {...field}
                    className="pr-10"
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
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
                  {departments.map(dept => (
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
                  {Array.from({ length: 4 }, (_, i) => i + 1).map(sem => (
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
