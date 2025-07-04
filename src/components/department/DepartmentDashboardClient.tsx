
"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ApprovalManager } from '@/components/admin/AllocationManager';
import { DepartmentStudentView } from './DepartmentStudentView';
import { CheckSquare, Users } from 'lucide-react';
import type { AuthenticatedUser } from '@/types';

interface DepartmentDashboardClientProps {
  currentUser: AuthenticatedUser;
}

export function DepartmentDashboardClient({ currentUser }: DepartmentDashboardClientProps) {
  if (currentUser.role !== 'department') {
    return <p>Invalid user role for this dashboard.</p>;
  }

  return (
    <Tabs defaultValue="approvals" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="approvals">
          <CheckSquare className="mr-2 h-4 w-4" />
          Elective Approvals
        </TabsTrigger>
        <TabsTrigger value="roster">
          <Users className="mr-2 h-4 w-4" />
          Department Roster
        </TabsTrigger>
      </TabsList>
      <TabsContent value="approvals" className="pt-6">
        <ApprovalManager currentUser={currentUser} />
      </TabsContent>
      <TabsContent value="roster" className="pt-6">
        <DepartmentStudentView currentUser={currentUser} />
      </TabsContent>
    </Tabs>
  );
}
