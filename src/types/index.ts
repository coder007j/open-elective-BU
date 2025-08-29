

import type { LucideIcon } from 'lucide-react';

export interface Department {
  id: string;
  name: string;
  capacity: number;
  description: string;
  iconName: keyof typeof import('lucide-react')['icons'] | 'CustomAcademicCap' | (string & {});
  assignedStudents: string[]; // Roll numbers of students already assigned
  syllabus: string;
}

export interface Student {
  rollNumber: string;
  password?: string;
  name: string;
  homeDepartmentId: string;
  semester: number;
  lastSemesterPercentage: number;
  status: 'pending' | 'approved';
  preferences: string[]; // Array of department IDs
  assignedElective: string | null; // Department ID or null
  assignmentReason: string | null;
  homeDeptApproval: boolean;
  electiveDeptApproval: boolean;
  passwordResetRequested: boolean;
}

export interface DepartmentUser {
  id: string;
  password?: string;
  name: string;
  departmentId: string;
  passwordResetRequested: boolean;
}

export type RegistrationData = Omit<Student, 'preferences' | 'assignedElective' | 'assignmentReason' | 'status' | 'homeDeptApproval' | 'electiveDeptApproval' | 'passwordResetRequested'>;


export interface AssignmentResult {
  rollNumber: string;
  assignedDepartment: string | null; // Department name
  reason: string | null;
}

// The user object stored in the auth session
export type AuthenticatedUser = 
  | (Omit<Student, 'password'> & { role: 'student' })
  | {
      rollNumber: 'admin';
      role: 'admin';
      name: 'Admin';
    }
  | {
      rollNumber: string; // The department ID, e.g., 'cs'
      role: 'department';
      name: string;
      departmentId: string; // The department this user manages
    };


// Types for the AI allocation flow
export interface AssignElectivesStudentInput {
  rollNumber: string;
  preferences: string[];
  homeDepartment: string;
  lastSemesterPercentage: number;
}

export interface AssignElectivesDepartmentInput {
  name: string;
  capacity: number;
  assignedStudents: string[];
}

export interface AssignElectivesInput {
  students: AssignElectivesStudentInput[];
  departments: AssignElectivesDepartmentInput[];
}

export interface AssignElectivesOutput {
  assignments: {
    rollNumber: string;
    assignedDepartment?: string;
    reason?: string;
  }[];
}

export interface ChangePasswordData {
    userId: string;
    newPassword: string;
}
