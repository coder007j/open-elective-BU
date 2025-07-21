
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthenticatedUser, Student, DepartmentUser, RegistrationData, Department } from '@/types';
import { MOCK_STUDENTS, MOCK_DEPARTMENT_USERS, DEPARTMENTS_DATA } from '@/lib/constants';
import { useStudentData } from './useStudentData';

const AUTH_STORAGE_KEY = 'openElectiveUser';
const ALL_STUDENTS_STORAGE_KEY = 'allStudentsData';


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
  const { students: allStudents, registerStudent, departments } = useStudentData();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
      
      const studentsData = localStorage.getItem(ALL_STUDENTS_STORAGE_KEY);
      if (!studentsData) {
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
        const departmentDetails = departments.find(d => d.id === deptUserToAuth.departmentId);
        
        // This is the definitive fix. We construct the correct name here.
        const departmentDisplayName = departmentDetails 
            ? `${departmentDetails.description.replace(/Offered by\s*/, '')} Head`
            : `${deptUserToAuth.name} Head`;

        const departmentUser: AuthenticatedUser = {
            rollNumber: deptUserToAuth.id,
            name: departmentDisplayName, // Set the correctly formatted name.
            departmentId: deptUserToAuth.departmentId,
            role: 'department',
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(departmentUser));
        setCurrentUser(departmentUser);
        router.replace('/department/dashboard');
        return;
    }

    // Student Login
    const userToAuth = allStudents.find(s => s.rollNumber === rollNumber);

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
  }, [router, allStudents, departments]);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setCurrentUser(null);
    router.push('/'); 
  }, [router]);
  
  const register = useCallback(async (data: RegistrationData): Promise<{ success: boolean; message: string; }> => {
    return registerStudent(data);
  }, [registerStudent]);

  const savePreferences = useCallback((preferences: string[]) => {
    setCurrentUser(prevUser => {
      if (!prevUser || prevUser.role !== 'student') return prevUser;
      
      const updatedUser: AuthenticatedUser = {
        ...prevUser,
        preferences: preferences,
        assignedElective: null,
        assignmentReason: 'Your preferences have been saved and are now awaiting final allocation.',
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));

      try {
        const allStudentsData = localStorage.getItem(ALL_STUDENTS_STORAGE_KEY);
        const students: Student[] = allStudentsData ? JSON.parse(allStudentsData) : [];
        const studentIndex = students.findIndex(s => s.rollNumber === updatedUser.rollNumber);
        if (studentIndex > -1) {
          const studentToSave: Student = {
            ...students[studentIndex],
            preferences: updatedUser.preferences,
            assignedElective: updatedUser.assignedElective,
            assignmentReason: updatedUser.assignmentReason,
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
