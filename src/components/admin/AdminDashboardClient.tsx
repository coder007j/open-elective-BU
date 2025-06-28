
"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ApprovalManager } from './AllocationManager';
import { StudentManager } from './StudentManager';
import { DepartmentManager } from './DepartmentManager';
import { CheckSquare, Users, Building } from 'lucide-react';

export function AdminDashboardClient() {
  return (
    <Tabs defaultValue="approvals" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="approvals">
          <CheckSquare className="mr-2 h-4 w-4" />
          Approvals
        </TabsTrigger>
        <TabsTrigger value="students">
          <Users className="mr-2 h-4 w-4" />
          Manage Students
        </TabsTrigger>
        <TabsTrigger value="departments">
          <Building className="mr-2 h-4 w-4" />
          Manage Departments
        </TabsTrigger>
      </TabsList>
      <TabsContent value="approvals" className="pt-6">
        <ApprovalManager />
      </TabsContent>
      <TabsContent value="students" className="pt-6">
        <StudentManager />
      </TabsContent>
      <TabsContent value="departments" className="pt-6">
        <DepartmentManager />
      </TabsContent>
    </Tabs>
  );
}
