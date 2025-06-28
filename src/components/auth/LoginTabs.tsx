
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
import { User, Shield } from "lucide-react";

export function LoginTabs() {
  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-center text-primary">
          Open Elective
        </CardTitle>
        <CardDescription className="text-center">
          Sign in to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="student" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student">
              <User className="mr-2 h-4 w-4" />
              Student
            </TabsTrigger>
            <TabsTrigger value="admin">
              <Shield className="mr-2 h-4 w-4" />
              Department
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
              Enter department credentials to manage departments and students.
            </p>
            <LoginForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
