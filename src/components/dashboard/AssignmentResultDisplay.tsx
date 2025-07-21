
"use client";

import type { AuthenticatedUser, Department } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { CustomAcademicCapIcon } from '@/components/icons/CustomAcademicCapIcon';
import { useStudentData } from '@/hooks/useStudentData'; // Use the hook to get dynamic data

interface AssignmentResultDisplayProps {
  student: AuthenticatedUser;
}

const IconComponent = ({ name, ...props }: {name: Department['iconName']} & LucideIcons.LucideProps) => {
  if (name === 'CustomAcademicCap') {
    return <CustomAcademicCapIcon {...props} />;
  }
  const LucideIcon = LucideIcons[name as keyof typeof LucideIcons.icons] as LucideIcons.LucideIcon;
  if (!LucideIcon) return <LucideIcons.BookOpen {...props} />;
  return <LucideIcon {...props} />;
};


export function AssignmentResultDisplay({ student }: AssignmentResultDisplayProps) {
  const { departments } = useStudentData(); // Fetch dynamic department data

  if (!student.assignedElective) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-lg bg-card">
        <CardHeader className="items-center text-center">
          <XCircle className="h-16 w-16 text-destructive mb-4" />
          <CardTitle className="text-2xl font-headline text-destructive">Assignment Pending or Unsuccessful</CardTitle>
          <CardDescription>
            {student.assignmentReason || "You have not been assigned an elective yet, or an assignment could not be made based on your preferences and availability."}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p>Please check back later or contact administration if you believe this is an error.</p>
        </CardContent>
      </Card>
    );
  }

  const assignedDept = departments.find(d => d.id === student.assignedElective);

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-2 border-accent bg-background">
      <CardHeader className="items-center text-center">
        {assignedDept && <IconComponent name={assignedDept.iconName} className="h-16 w-16 text-accent-foreground mb-4" />}
        {!assignedDept && <CheckCircle className="h-16 w-16 text-accent-foreground mb-4" />}
        <CardTitle className="text-3xl font-headline text-accent-foreground">
          Elective Assigned!
        </CardTitle>
        <CardDescription className="text-lg">
          Congratulations, {student.name}! You have been assigned to:
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-2xl font-semibold text-primary">
          {assignedDept ? assignedDept.name : student.assignedElective}
        </p>
        {student.assignmentReason && (
          <div className="bg-accent/20 p-3 rounded-md">
            <p className="text-sm font-medium text-accent-foreground">Assignment Details:</p>
            <p className="text-sm text-muted-foreground">{student.assignmentReason}</p>
          </div>
        )}
         {!assignedDept && student.assignedElective && (
           <p className="text-sm text-muted-foreground">Details for department ID '{student.assignedElective}' not found. Please verify with administration.</p>
        )}
      </CardContent>
    </Card>
  );
}
