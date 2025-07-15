
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthenticatedUser, Student, DepartmentUser } from '@/types';
import { MOCK_STUDENTS, MOCK_DEPARTMENT_USERS } from '@/lib/constants';

const AUTH_STORAGE_KEY = 'openElectiveUser';
const ALL_STUDENTS_STORAGE_KEY = 'allStudentsData';

type RegistrationData = Omit<Student, 'preferences' | 'assignedElective' | 'assignmentReason' | 'status' | 'homeDeptApproval' | 'electiveDeptApproval'>;


interface UseAuthReturn {
  currentUser: AuthenticatedUser | null;
  isLoading: boolean;
  login: (rollNumber: string, passwordAttempt: string) => void;
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
    
    // Admin Login
    if (rollNumber === 'admin' && passwordAttempt === 'adminpass') {
        const adminUser: AuthenticatedUser = { rollNumber: 'admin', name: 'Admin', role: 'admin' };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminUser));
        setCurrentUser(adminUser);
        router.replace('/admin/dashboard');
        return;
    }

    // Department Login
    const deptUserToAuth = MOCK_DEPARTMENT_USERS.find(d => d.id === rollNumber);
    if (deptUserToAuth && deptUserToAuth.password === passwordAttempt) {
        const { password, ...deptData } = deptUserToAuth;
        const departmentUser: AuthenticatedUser = {
            rollNumber: deptData.id,
            name: deptData.name,
            departmentId: deptData.departmentId,
            role: 'department',
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(departmentUser));
        setCurrentUser(departmentUser);
        router.replace('/department/dashboard');
        return;
    }

    // Student Login
    const allStudentsData = localStorage.getItem(ALL_STUDENTS_STORAGE_KEY);
    const students: Student[] = allStudentsData ? JSON.parse(allStudentsData) : [];
    const userToAuth = students.find(s => s.rollNumber === rollNumber);

    if (userToAuth && userToAuth.password === passwordAttempt) {
      if (userToAuth.status !== 'approved') {
        throw new Error("Your registration is still pending approval.");
      }
      
      const { password, ...userData } = userToAuth;
      const studentUser: AuthenticatedUser = {
        ...userData,
        role: 'student',
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(studentUser));
      setCurrentUser(studentUser);
      router.replace('/dashboard');
      return;
    }

    throw new Error("Invalid credentials. Please check and try again.");
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setCurrentUser(null);
    router.push('/'); 
  }, [router]);
  
  const register = async (data: RegistrationData): Promise<{ success: boolean; message: string; }> => {
    try {
        const allStudentsData = localStorage.getItem(ALL_STUDENTS_STORAGE_KEY);
        const students: Student[] = allStudentsData ? JSON.parse(allStudentsData) : [];

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
      if (!prevUser || prevUser.role !== 'student') return prevUser;
      
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
        const students: Student[] = allStudentsData ? JSON.parse(allStudentsData) : [];
        const studentIndex = students.findIndex(s => s.rollNumber === updatedUser.rollNumber);
        if (studentIndex > -1) {
          // Can't spread AuthenticatedUser into Student, so map fields manually
          const studentToSave: Student = {
            ...students[studentIndex],
            preferences: updatedUser.preferences,
            assignedElective: updatedUser.assignedElective,
            assignmentReason: updatedUser.assignmentReason,
            homeDeptApproval: updatedUser.homeDeptApproval,
            electiveDeptApproval: updatedUser.electiveDeptApproval,
          };
          students[studentIndex] = studentToSave;
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
      if (!prevUser || prevUser.role !== 'student') return prevUser;
      const updatedUser: AuthenticatedUser = {
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
