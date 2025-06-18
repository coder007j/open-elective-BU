"use client";

import type { Department } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import * as LucideIcons from 'lucide-react';
import { CustomAcademicCapIcon } from '@/components/icons/CustomAcademicCapIcon';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle } from 'lucide-react';

interface DepartmentCardProps {
  department: Department;
  isSelected: boolean;
  onSelect: (departmentId: string) => void;
  isDisabled: boolean; // True if max selections reached and this card is not selected
}

// A type guard or a more robust way to handle icon names might be needed for production
const IconComponent = ({ name, ...props }: {name: Department['iconName']} & LucideIcons.LucideProps) => {
  if (name === 'CustomAcademicCap') {
    return <CustomAcademicCapIcon {...props} />;
  }
  const LucideIcon = LucideIcons[name as keyof typeof LucideIcons.icons] as LucideIcons.LucideIcon;
  if (!LucideIcon) return <LucideIcons.BookOpen {...props} />; // Default icon
  return <LucideIcon {...props} />;
};


export function DepartmentCard({ department, isSelected, onSelect, isDisabled }: DepartmentCardProps) {
  const availableSlots = department.capacity - department.assignedStudents.length;

  return (
    <Card 
      className={cn(
        "flex flex-col cursor-pointer transition-all duration-200 ease-in-out hover:shadow-lg",
        isSelected ? "border-primary ring-2 ring-primary shadow-xl" : "border-border",
        isDisabled && !isSelected ? "opacity-60 cursor-not-allowed" : "hover:scale-105",
         "bg-card"
      )}
      onClick={() => (!isDisabled || isSelected) && onSelect(department.id)}
      role="checkbox"
      aria-checked={isSelected}
      aria-disabled={isDisabled && !isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!isDisabled || isSelected) onSelect(department.id);
        }
      }}
    >
      <CardHeader className="flex-row items-center gap-4 pb-3">
        <IconComponent name={department.iconName} className="h-10 w-10 text-primary" />
        <div className="flex-1">
          <CardTitle className="text-lg font-headline">{department.name}</CardTitle>
          <CardDescription className="text-xs">{department.description}</CardDescription>
        </div>
        {isSelected ? <CheckCircle2 className="h-6 w-6 text-primary" /> : <Circle className="h-6 w-6 text-muted-foreground" />}
      </CardHeader>
      <CardContent className="flex-grow pt-0 pb-3">
        {/* Further details can be added here if needed */}
      </CardContent>
      <CardFooter className="pt-0">
        <Badge variant={availableSlots > 0 ? "secondary" : "destructive"} className="text-xs">
          Capacity: {department.capacity} | Available: {Math.max(0, availableSlots)}
        </Badge>
      </CardFooter>
    </Card>
  );
}
