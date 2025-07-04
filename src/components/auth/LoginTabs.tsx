
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./LoginForm";
import { RegistrationForm } from "./RegistrationForm";
import { User, Shield, UserPlus } from "lucide-react";

export function LoginTabs() {
  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-center text-primary">
          Open Elective
        </CardTitle>
        <CardDescription className="text-center">
          Sign in or register to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="student" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="student">
              <User className="mr-2 h-4 w-4" />
              Student Login
            </TabsTrigger>
            <TabsTrigger value="admin">
              <Shield className="mr-2 h-4 w-4" />
              Admin Login
            </TabsTrigger>
            <TabsTrigger value="register">
              <UserPlus className="mr-2 h-4 w-4" />
              Register
            </TabsTrigger>
          </TabsList>
          <TabsContent value="student" className="pt-4">
            <p className="text-sm text-center text-muted-foreground mb-4">
              Enter your student credentials to select your electives.
            </p>
            <LoginForm />
          </TabsContent>
          <TabsContent value="admin" className="pt-4">
            <p className="text-sm text-center text-muted-foreground mb-4">
              Enter admin credentials to manage the application.
            </p>
            <LoginForm />
          </TabsContent>
          <TabsContent value="register" className="pt-4">
             <p className="text-sm text-center text-muted-foreground mb-4">
              New students must register here. Your account will require admin approval before you can log in.
            </p>
            <RegistrationForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
