
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthenticatedUser } from '@/types';
import { MOCK_STUDENTS } from '@/lib/constants';

const AUTH_STORAGE_KEY = 'openElectiveUser';

interface UseAuthReturn {
  currentUser: AuthenticatedUser | null;
  isLoading: boolean;
  login: (rollNumber: string, passwordAttempt: string) => Promise<boolean>;
  logout: () => void;
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
        // On load, check if there's a more complete user object in storage
        // This preserves state across refreshes
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
    
    const ADMIN_ROLL_NUMBER = 'admin';
    const ADMIN_PASSWORD = 'adminpass';
    const ADMIN_NAME = 'Administrator';

    let userToAuth: AuthenticatedUser | null = null;

    // Check for admin
    if (rollNumber === ADMIN_ROLL_NUMBER && passwordAttempt === ADMIN_PASSWORD) {
      userToAuth = {
        rollNumber: ADMIN_ROLL_NUMBER,
        name: ADMIN_NAME,
        preferences: [],
        assignedElective: null,
        assignmentReason: null,
      };
    } else { // Check for student
      const studentData = MOCK_STUDENTS.find(
        (s) => s.rollNumber === rollNumber && s.password === passwordAttempt
      );
      if (studentData) {
        // On successful student login, create a full user object.
        // In a real app, you'd fetch their saved preferences from a DB here.
        userToAuth = {
          rollNumber: studentData.rollNumber,
          name: studentData.name,
          preferences: [],
          assignedElective: null,
          assignmentReason: null,
        };
      }
    }
    
    setIsLoading(false);

    if (userToAuth) {
      // Upon new login, store the fresh user state.
      // This overwrites any previous state for that user, which is typical for login.
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userToAuth));
      setCurrentUser(userToAuth);
      return true;
    }

    return false;
  }, [setCurrentUser, setIsLoading]);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setCurrentUser(null);
    router.push('/'); 
  }, [router, setCurrentUser]);

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
  }, [setCurrentUser]);


  return { currentUser, isLoading, login, logout, updateUserAssignment };
}
