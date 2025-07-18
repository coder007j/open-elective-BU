
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Student, Department, RegistrationData } from '@/types';
import { MOCK_STUDENTS, DEPARTMENTS_DATA } from '@/lib/constants';

const ALL_STUDENTS_STORAGE_KEY = 'allStudentsData';
const ALL_DEPARTMENTS_STORAGE_KEY = 'allDepartmentsData';

// Centralized hook to manage all student and department data from localStorage
export function useStudentData() {
  const [students, setStudents] = useState<Student[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    try {
      const storedStudents = localStorage.getItem(ALL_STUDENTS_STORAGE_KEY);
      if (storedStudents) {
        setStudents(JSON.parse(storedStudents));
      } else {
        localStorage.setItem(ALL_STUDENTS_STORAGE_KEY, JSON.stringify(MOCK_STUDENTS));
        setStudents(MOCK_STUDENTS);
      }

      const storedDepts = localStorage.getItem(ALL_DEPARTMENTS_STORAGE_KEY);
       if (storedDepts) {
        setDepartments(JSON.parse(storedDepts));
      } else {
        localStorage.setItem(ALL_DEPARTMENTS_STORAGE_KEY, JSON.stringify(DEPARTMENTS_DATA));
        setDepartments(DEPARTMENTS_DATA);
      }

    } catch(e) {
      console.error("Failed to initialize data from localStorage", e);
      setStudents(MOCK_STUDENTS);
      setDepartments(DEPARTMENTS_DATA);
    }
  }, []);

  const saveStudents = useCallback((updatedStudents: Student[]) => {
    setStudents(updatedStudents);
    localStorage.setItem(ALL_STUDENTS_STORAGE_KEY, JSON.stringify(updatedStudents));
  }, []);

  const saveDepartments = useCallback((updatedDepartments: Department[]) => {
    setDepartments(updatedDepartments);
    localStorage.setItem(ALL_DEPARTMENTS_STORAGE_KEY, JSON.stringify(updatedDepartments));
  }, []);

  const registerStudent = useCallback(async (data: RegistrationData): Promise<{ success: boolean; message: string; }> => {
    try {
        const currentStudents = [...students];

        if (currentStudents.some(s => s.rollNumber === data.rollNumber)) {
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
        
        const updatedStudents = [...currentStudents, newStudent];
        saveStudents(updatedStudents);
        
        return { success: true, message: 'Registration successful. Awaiting approval.' };
    } catch (e) {
        const message = e instanceof Error ? e.message : "An unknown error occurred.";
        return { success: false, message };
    }
  }, [students, saveStudents]);


  return { students, saveStudents, departments, saveDepartments, registerStudent };
}
