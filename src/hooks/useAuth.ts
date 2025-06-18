
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthenticatedUser } from '@/types';

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

    const ADMIN_ROLL_NUMBER = 'admin';
    const ADMIN_PASSWORD = 'adminpass';
    const ADMIN_NAME = 'Administrator';

    if (rollNumber === ADMIN_ROLL_NUMBER && passwordAttempt === ADMIN_PASSWORD) {
      const adminUser: AuthenticatedUser = {
        rollNumber: ADMIN_ROLL_NUMBER,
        name: ADMIN_NAME,
        preferences: [],
        assignedElective: null,
        assignmentReason: null,
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminUser));
      setCurrentUser(adminUser);
      setIsLoading(false);
      router.push("/admin/dashboard"); // Redirect admin to admin dashboard
      return true;
    }
    
    setIsLoading(false);
    return false;
  }, [router, setCurrentUser, setIsLoading]);

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
