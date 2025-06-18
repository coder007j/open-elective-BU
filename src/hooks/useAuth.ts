"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthenticatedUser, Student } from '@/types';
import { MOCK_STUDENTS } from '@/lib/constants';

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
    const studentData = MOCK_STUDENTS.find(s => s.rollNumber === rollNumber && s.password === passwordAttempt);
    if (studentData) {
      // For a real app, fetch full student profile here, including preferences and assignments
      // For this mock, we assume a new user or fetch from a broader student list if needed
      const userToStore: AuthenticatedUser = {
        rollNumber: studentData.rollNumber,
        name: studentData.name,
        preferences: [], // Default to empty, student will select
        assignedElective: null, // Default to null
        assignmentReason: null,
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userToStore));
      setCurrentUser(userToStore);
      setIsLoading(false);
      return true;
    }
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
