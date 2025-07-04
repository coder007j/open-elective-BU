
import type { LucideIcon } from 'lucide-react';

export interface Department {
  id: string;
  name: string;
  capacity: number;
  description: string;
  iconName: keyof typeof import('lucide-react')['icons'] | 'CustomAcademicCap' | (string & {}); // Allow any string for iconName initially
  assignedStudents: string[]; // Roll numbers of students already assigned
}

export interface Student {
  rollNumber: string;
  password?: string; // For mock login, not stored long-term securely this way
  name: string;
  homeDepartmentId: string;
  semester: number;
  status: 'pending' | 'approved';
  preferences: string[]; // Array of department IDs
  assignedElective: string | null; // Department ID or null
  assignmentReason: string | null;
  homeDeptApproval: boolean;
  electiveDeptApproval: boolean;
}

export interface DepartmentUser {
  id: string;
  password?: string;
  name: string;
  departmentId: string;
}


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
