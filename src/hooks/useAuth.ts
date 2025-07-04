
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthenticatedUser, Student } from '@/types';
import { MOCK_STUDENTS } from '@/lib/constants';

const AUTH_STORAGE_KEY = 'openElectiveUser';
const ALL_STUDENTS_STORAGE_KEY = 'allStudentsData';

type RegistrationData = Omit<Student, 'preferences' | 'assignedElective' | 'assignmentReason' | 'status' | 'homeDeptApproval' | 'electiveDeptApproval'>;


interface UseAuthReturn {
  currentUser: AuthenticatedUser | null;
  isLoading: boolean;
  login: (rollNumber: string, passwordAttempt: string) => Promise<void>;
  logout: () => void;
  register: (data: RegistrationData) => Promise<{ success: boolean; message: string; }>;
  savePreferences: (preferences: string[]) => void;
  updateUserAssignment: (assignedElectiveId: string | null, reason: string | null) => void;
}

export function useAuth(): UseAuthReturn {
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
      
      const allStudents = localStorage.getItem(ALL_STUDENTS_STORAGE_KEY);
      if (!allStudents) {
         localStorage.setItem(ALL_STUDENTS_STORAGE_KEY, JSON.stringify(MOCK_STUDENTS));
      }

    } catch (error) {
      console.error("Failed to load user from localStorage", error);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (rollNumber: string, passwordAttempt: string) => {
    
    // Department Login
    if (rollNumber === 'department' && passwordAttempt === 'adminpass') {
      const adminUser: AuthenticatedUser = {
        rollNumber: 'department',
        name: 'Department',
        homeDepartmentId: 'admin',
        semester: 0,
        status: 'approved',
        preferences: [],
        assignedElective: null,
        assignmentReason: null,
        homeDeptApproval: false,
        electiveDeptApproval: false,
      };
      setCurrentUser(adminUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminUser));
      router.replace('/admin/dashboard');
      return;
    }

    // Student Login
    const allStudentsData = localStorage.getItem(ALL_STUDENTS_STORAGE_KEY);
    const students: Student[] = allStudentsData ? JSON.parse(allStudentsData) : MOCK_STUDENTS;
    const userToAuth = students.find(s => s.rollNumber === rollNumber);

    if (!userToAuth) {
      throw new Error("Invalid credentials. Please check and try again.");
    }
    if (userToAuth.password !== passwordAttempt) {
      throw new Error("Invalid credentials. Please check and try again.");
    }
    if (userToAuth.status !== 'approved') {
      throw new Error("Your registration is still pending approval. Please check back later.");
    }
    
    const { password, ...userData } = userToAuth;
    setCurrentUser(userData);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    router.replace('/dashboard');

  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setCurrentUser(null);
    router.push('/'); 
  }, [router]);
  
  const register = async (data: RegistrationData): Promise<{ success: boolean; message: string; }> => {
    try {
        const allStudentsData = localStorage.getItem(ALL_STUDENTS_STORAGE_KEY);
        const students: Student[] = allStudentsData ? JSON.parse(allStudentsData) : MOCK_STUDENTS;

        if (students.some(s => s.rollNumber === data.rollNumber)) {
            return { success: false, message: 'A student with this roll number is already registered.' };
        }

        const newStudent: Student = {
            ...data,
            status: 'pending',
            preferences: [],
            assignedElective: null,
            assignmentReason: null,
            homeDeptApproval: false,
            electiveDeptApproval: false,
        };
        
        students.push(newStudent);
        localStorage.setItem(ALL_STUDENTS_STORAGE_KEY, JSON.stringify(students));
        
        return { success: true, message: 'Registration successful. Awaiting approval.' };
    } catch (e) {
        const message = e instanceof Error ? e.message : "An unknown error occurred.";
        return { success: false, message };
    }
  };

  const savePreferences = useCallback((preferences: string[]) => {
    setCurrentUser(prevUser => {
      if (!prevUser) return null;
      const updatedUser: AuthenticatedUser = {
        ...prevUser,
        preferences: preferences,
        assignedElective: null,
        assignmentReason: 'Your preferences have been saved and are now awaiting approval.',
        homeDeptApproval: false,
        electiveDeptApproval: false,
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));

      try {
        const allStudentsData = localStorage.getItem(ALL_STUDENTS_STORAGE_KEY);
        const students: Student[] = allStudentsData ? JSON.parse(allStudentsData) : MOCK_STUDENTS;
        const studentIndex = students.findIndex(s => s.rollNumber === updatedUser.rollNumber);
        if (studentIndex > -1) {
          students[studentIndex] = { ...students[studentIndex], ...updatedUser };
          localStorage.setItem(ALL_STUDENTS_STORAGE_KEY, JSON.stringify(students));
        }
      } catch (e) {
        console.error("Could not update master student list", e);
      }

      return updatedUser;
    });
  }, []);

  const updateUserAssignment = useCallback((assignedElectiveId: string | null, reason: string | null) => {
    setCurrentUser(prevUser => {
      if (!prevUser) return null;
      const updatedUser = {
        ...prevUser,
        assignedElective: assignedElectiveId,
        assignmentReason: reason,
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  return { currentUser, isLoading, login, logout, register, savePreferences, updateUserAssignment };
}
