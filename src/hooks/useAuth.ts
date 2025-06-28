
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthenticatedUser, Student } from '@/types';
import { MOCK_STUDENTS } from '@/lib/constants';

const AUTH_STORAGE_KEY = 'openElectiveUser';

interface UseAuthReturn {
  currentUser: AuthenticatedUser | null;
  isLoading: boolean;
  login: (rollNumber: string, passwordAttempt: string) => Promise<boolean>;
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
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
      }
    } catch (error) {
      console.error("Failed to load user from localStorage", error);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (rollNumber: string, passwordAttempt: string): Promise<boolean> => {
    setIsLoading(true);
    
    const ADMIN_ROLL_NUMBER = 'department';
    const ADMIN_PASSWORD = 'adminpass';
    const ADMIN_NAME = 'Department';

    let userToAuth: AuthenticatedUser | null = null;

    if (rollNumber === ADMIN_ROLL_NUMBER && passwordAttempt === ADMIN_PASSWORD) {
      userToAuth = {
        rollNumber: ADMIN_ROLL_NUMBER,
        name: ADMIN_NAME,
        homeDepartmentId: 'department',
        preferences: [],
        assignedElective: null,
        assignmentReason: null,
        homeDeptApproval: false,
        electiveDeptApproval: false,
      };
    } else {
      const studentData = MOCK_STUDENTS.find(
        (s) => s.rollNumber === rollNumber && s.password === passwordAttempt
      );
      if (studentData) {
        // Find if there's a stored version of the user to persist their preferences across logins
        const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
        if(storedUser && JSON.parse(storedUser).rollNumber === rollNumber) {
          userToAuth = JSON.parse(storedUser);
        } else {
          const { password, ...rest } = studentData;
          userToAuth = rest;
        }
      }
    }
    
    setIsLoading(false);

    if (userToAuth) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userToAuth));
      setCurrentUser(userToAuth);
      return true;
    }

    return false;
  }, []);

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
