
"use client";

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
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, Loader2, UserCircle, Eye, EyeOff } from "lucide-react";
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { useStudentData } from "@/hooks/useStudentData";

const loginFormSchema = z.object({
  rollNumber: z.string().min(1, { message: "Roll number/ID is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const resetRequestSchema = z.object({
  id: z.string().min(1, { message: "Roll number or Department ID is required." }),
});
type ResetRequestValues = z.infer<typeof resetRequestSchema>;

interface LoginFormProps {
  showForgotPassword?: boolean;
}

export function LoginForm({ showForgotPassword = false }: LoginFormProps) {
  const { login } = useAuth();
  const { requestPasswordReset } = useStudentData();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [isResetFormOpen, setResetFormOpen] = React.useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      rollNumber: "",
      password: "",
    },
  });

  const resetForm = useForm<ResetRequestValues>({
    resolver: zodResolver(resetRequestSchema),
    defaultValues: { id: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    try {
      await login(values.rollNumber, values.password);
    } catch (error) {
       setIsLoading(false);
       const message = error instanceof Error ? error.message : "An unknown error occurred.";
       toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      });
    }
  }

  async function onResetRequestSubmit(values: ResetRequestValues) {
    const result = await requestPasswordReset(values.id);
     if (result.success) {
      toast({
        title: "Request Submitted",
        description: "Your password reset request has been sent to the administrator for approval.",
      });
    } else {
      toast({
        title: "Request Failed",
        description: result.message,
        variant: "destructive",
      });
    }
    setResetFormOpen(false);
    resetForm.reset();
  }


  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="rollNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Roll Number / ID</FormLabel>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <FormControl>
                  <Input placeholder="Enter your ID" {...field} className="pl-10" />
                </FormControl>
              </div>
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
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <FormControl>
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password" 
                    {...field} 
                    className="pl-10 pr-10" 
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
        <div className="flex items-center justify-end h-6">
            {showForgotPassword && (
                 <Dialog open={isResetFormOpen} onOpenChange={setResetFormOpen}>
                    <DialogTrigger asChild>
                        <Button type="button" variant="link" className="p-0 h-auto text-sm">Forgot Password?</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Request Password Reset</DialogTitle>
                            <DialogDescription>
                                Enter your ID below. A request will be sent to the administrator to reset your password.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...resetForm}>
                            <form onSubmit={resetForm.handleSubmit(onResetRequestSubmit)} className="space-y-4 py-4">
                                <FormField
                                    control={resetForm.control}
                                    name="id"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Your Student Roll Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your Roll Number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                <DialogFooter>
                                    <DialogClose asChild>
                                    <Button type="button" variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit">Submit Request</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            )}
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </Form>
    </>
  );
}
