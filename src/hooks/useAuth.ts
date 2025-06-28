
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthenticatedUser, Student } from '@/types';
import { MOCK_STUDENTS } from '@/lib/constants';

const AUTH_STORAGE_KEY = 'openElectiveUser';

interface UseAuthReturn {
  currentUser: AuthenticatedUser | null;
  isLoading: boolean;
  login: (rollNumber: string, passwordAttempt: string) => Promise<string | null>; // Changed return type
  logout: () => void;
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
    } catch (error) {
      console.error("Failed to load user from localStorage", error);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (rollNumber: string, passwordAttempt: string): Promise<string | null> => {
    const allStudentsData = localStorage.getItem('allStudentsData');
    const students: Student[] = allStudentsData ? JSON.parse(allStudentsData) : MOCK_STUDENTS;

    let userToAuth: Student | null = null;
    let isAdmin = false;

    if (rollNumber === 'department' && passwordAttempt === 'adminpass') {
      isAdmin = true;
      userToAuth = {
        rollNumber: 'department',
        name: 'Department',
        password: 'adminpass',
        homeDepartmentId: 'admin',
        preferences: [],
        assignedElective: null,
        assignmentReason: null,
        homeDeptApproval: false,
        electiveDeptApproval: false,
      };
    } else {
      userToAuth = students.find(s => s.rollNumber === rollNumber && s.password === passwordAttempt) || null;
    }
    
    if (userToAuth) {
      const { password, ...userData } = userToAuth;
      setCurrentUser(userData);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      
      if (isAdmin) {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/dashboard');
      }
      return null; // Success
    }
    
    return "Invalid credentials. Please check and try again."; // Failure
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setCurrentUser(null);
    router.push('/'); 
  }, [router]);
  
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
        const allStudentsData = localStorage.getItem('allStudentsData');
        const students: Student[] = allStudentsData ? JSON.parse(allStudentsData) : MOCK_STUDENTS;
        const studentIndex = students.findIndex(s => s.rollNumber === updatedUser.rollNumber);
        if (studentIndex > -1) {
          students[studentIndex] = { ...students[studentIndex], ...updatedUser };
          localStorage.setItem('allStudentsData', JSON.stringify(students));
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

  return { currentUser, isLoading, login, logout, savePreferences, updateUserAssignment };
}
