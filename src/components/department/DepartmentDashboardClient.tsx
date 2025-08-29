
"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DepartmentStudentView } from './DepartmentStudentView';
import { IncomingStudentsView } from './IncomingStudentsView';
import { ElectiveManager } from './ElectiveManager';
import { PasswordManager } from './PasswordManager';
import { Users, LogIn, Settings, KeyRound } from 'lucide-react';
import type { AuthenticatedUser } from '@/types';

interface DepartmentDashboardClientProps {
  currentUser: AuthenticatedUser;
}

export function DepartmentDashboardClient({ currentUser }: DepartmentDashboardClientProps) {
  if (currentUser.role !== 'department') {
    return <p>Invalid user role for this dashboard.</p>;
  }

  return (
    <Tabs defaultValue="roster" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="roster">
          <Users className="mr-2 h-4 w-4" />
          Department Roster
        </TabsTrigger>
        <TabsTrigger value="incoming">
          <LogIn className="mr-2 h-4 w-4" />
          Incoming Elective Students
        </TabsTrigger>
        <TabsTrigger value="manage">
          <Settings className="mr-2 h-4 w-4" />
          Manage Elective
        </TabsTrigger>
         <TabsTrigger value="password">
          <KeyRound className="mr-2 h-4 w-4" />
          Change Password
        </TabsTrigger>
      </TabsList>
      <TabsContent value="roster" className="pt-6">
        <DepartmentStudentView currentUser={currentUser} />
      </TabsContent>
      <TabsContent value="incoming" className="pt-6">
        <IncomingStudentsView currentUser={currentUser} />
      </TabsContent>
      <TabsContent value="manage" className="pt-6">
        <ElectiveManager currentUser={currentUser} />
      </TabsContent>
       <TabsContent value="password" className="pt-6">
        <PasswordManager currentUser={currentUser} />
      </TabsContent>
    </Tabs>
  );
}
