
"use client";

import React from 'react';
import { DepartmentManager } from './DepartmentManager';
import { StudentManager } from './StudentManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Users } from 'lucide-react';

export function AdminDashboardClient() {
  return (
    <Tabs defaultValue="departments" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:w-[400px] mb-6">
        <TabsTrigger value="departments">
          <Building className="mr-2 h-5 w-5" />
          Manage Departments
        </TabsTrigger>
        <TabsTrigger value="students">
          <Users className="mr-2 h-5 w-5" />
          Manage Students
        </TabsTrigger>
      </TabsList>
      <TabsContent value="departments">
        <DepartmentManager />
      </TabsContent>
      <TabsContent value="students">
        <StudentManager />
      </TabsContent>
    </Tabs>
  );
}
