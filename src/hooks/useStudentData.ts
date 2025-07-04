
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Student } from '@/types';
import { MOCK_STUDENTS } from '@/lib/constants';

const ALL_STUDENTS_STORAGE_KEY = 'allStudentsData';

// Centralized hook to manage student data from localStorage
export function useStudentData() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(ALL_STUDENTS_STORAGE_KEY);
      setStudents(storedData ? JSON.parse(storedData) : MOCK_STUDENTS);
    } catch {
      setStudents(MOCK_STUDENTS);
    }
  }, []);

  const saveStudents = useCallback((updatedStudents: Student[]) => {
    setStudents(updatedStudents);
    localStorage.setItem(ALL_STUDENTS_STORAGE_KEY, JSON.stringify(updatedStudents));
  }, []);

  return { students, saveStudents };
}
