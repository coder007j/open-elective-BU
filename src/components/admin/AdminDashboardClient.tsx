
"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AllocationManager } from './AllocationManager';
import { StudentManager } from './StudentManager';
import { DepartmentManager } from './DepartmentManager';
import { PasswordResetManager } from './PasswordResetManager';
import { CheckSquare, Users, Building, Bot, KeyRound } from 'lucide-react';
import type { AuthenticatedUser } from '@/types';

interface AdminDashboardClientProps {
  currentUser: AuthenticatedUser;
}

export function AdminDashboardClient({ currentUser }: AdminDashboardClientProps) {
  return (
    <Tabs defaultValue="allocation" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="allocation">
          <Bot className="mr-2 h-4 w-4" />
          Allocation
        </TabsTrigger>
        <TabsTrigger value="students">
          <Users className="mr-2 h-4 w-4" />
          Manage Students
        </TabsTrigger>
        <TabsTrigger value="departments">
          <Building className="mr-2 h-4 w-4" />
          Manage Departments
        </TabsTrigger>
        <TabsTrigger value="resets">
          <KeyRound className="mr-2 h-4 w-4" />
          Password Resets
        </TabsTrigger>
      </TabsList>
      <TabsContent value="allocation" className="pt-6">
        <AllocationManager />
      </TabsContent>
      <TabsContent value="students" className="pt-6">
        <StudentManager />
      </TabsContent>
      <TabsContent value="departments" className="pt-6">
        <DepartmentManager />
      </TabsContent>
      <TabsContent value="resets" className="pt-6">
        <PasswordResetManager />
      </TabsContent>
    </Tabs>
  );
}
