import type { LucideIcon } from 'lucide-react';

export interface Department {
  id: string;
  name: string;
  capacity: number;
  description: string;
  iconName: keyof typeof import('lucide-react')['icons'] | 'CustomAcademicCap'; 
  assignedStudents: string[]; // Roll numbers of students already assigned
}

export interface Student {
  rollNumber: string;
  password?: string; // For mock login, not stored long-term securely this way
  name: string;
  preferences: string[]; // Array of department IDs
  assignedElective: string | null; // Department ID or null
  assignmentReason: string | null;
}

export interface AssignmentResult {
  rollNumber: string;
  assignedDepartment: string | null; // Department name
  reason: string | null;
}

// Helper type for useAuth hook
export type AuthenticatedUser = Omit<Student, 'password'>;
