
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthenticatedUser, Student } from '@/types';
// MOCK_STUDENTS is no longer used for login, but might be used elsewhere or for future features.
// import { MOCK_STUDENTS } from '@/lib/constants'; 

const AUTH_STORAGE_KEY = 'electiveNavigatorUser';

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
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user from localStorage", error);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (rollNumber: string, passwordAttempt: string): Promise<boolean> => {
    setIsLoading(true);

    // Define admin credentials
    const ADMIN_ROLL_NUMBER = 'admin';
    const ADMIN_PASSWORD = 'adminpass'; // In a real app, use a more secure password
    const ADMIN_NAME = 'Administrator';

    if (rollNumber === ADMIN_ROLL_NUMBER && passwordAttempt === ADMIN_PASSWORD) {
      const adminUser: AuthenticatedUser = {
        rollNumber: ADMIN_ROLL_NUMBER,
        name: ADMIN_NAME,
        preferences: [], // Admin likely doesn't have elective preferences
        assignedElective: null, // Admin likely isn't assigned an elective
        assignmentReason: null,
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminUser));
      setCurrentUser(adminUser);
      setIsLoading(false);
      return true;
    }
    
    // If credentials do not match admin, login fails
    setIsLoading(false);
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setCurrentUser(null);
    router.push('/'); // Redirect to login page
  }, [router]);

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


  return { currentUser, isLoading, login, logout, updateUserAssignment };
}
