
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Student, Department, RegistrationData } from '@/types';
import { MOCK_STUDENTS, DEPARTMENTS_DATA } from '@/lib/constants';

const ALL_STUDENTS_STORAGE_KEY = 'allStudentsData';
const ALL_DEPARTMENTS_STORAGE_KEY = 'allDepartmentsData';

// Centralized hook to manage all student and department data from localStorage
export function useStudentData() {
  const [students, setStudents] = useState<Student[]>([]);
  const [departments, setDepartments] = useState<Department[]>(DEPARTMENTS_DATA);

  useEffect(() => {
    // For students, we still want to persist them across sessions
    try {
      const storedStudents = localStorage.getItem(ALL_STUDENTS_STORAGE_KEY);
      if (storedStudents) {
        setStudents(JSON.parse(storedStudents));
      } else {
        localStorage.setItem(ALL_STUDENTS_STORAGE_KEY, JSON.stringify(MOCK_STUDENTS));
        setStudents(MOCK_STUDENTS);
      }
    } catch(e) {
      console.error("Failed to initialize student data from localStorage", e);
      setStudents(MOCK_STUDENTS);
    }
    
    // For departments, we treat constants.ts as the source of truth, but merge with stored dynamic data.
    try {
        const storedDeptsString = localStorage.getItem(ALL_DEPARTMENTS_STORAGE_KEY);
        if (storedDeptsString) {
            const storedDepts: Department[] = JSON.parse(storedDeptsString);
            const storedDeptsMap = new Map(storedDepts.map(d => [d.id, d]));

            // Merge the constant data with stored dynamic data (like assignedStudents, capacity changes)
            const mergedDepts = DEPARTMENTS_DATA.map(constDept => {
                const storedDept = storedDeptsMap.get(constDept.id);
                if (storedDept) {
                    return { ...constDept, ...storedDept, assignedStudents: storedDept.assignedStudents || [] };
                }
                return constDept;
            });
            setDepartments(mergedDepts);
            localStorage.setItem(ALL_DEPARTMENTS_STORAGE_KEY, JSON.stringify(mergedDepts));
        } else {
            // If nothing is in storage, use the constant data directly.
            localStorage.setItem(ALL_DEPARTMENTS_STORAGE_KEY, JSON.stringify(DEPARTMENTS_DATA));
            setDepartments(DEPARTMENTS_DATA);
        }
    } catch(e) {
      console.error("Failed to initialize department data from localStorage", e);
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
        // Use a functional update to get the latest students state
        let registered = false;
        setStudents(currentStudents => {
            if (currentStudents.some(s => s.rollNumber === data.rollNumber)) {
                registered = true;
                return currentStudents;
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
            localStorage.setItem(ALL_STUDENTS_STORAGE_KEY, JSON.stringify(updatedStudents));
            return updatedStudents;
        });

        if (registered) {
            return { success: false, message: 'A student with this roll number is already registered.' };
        }
        
        return { success: true, message: 'Registration successful. Awaiting approval.' };
    } catch (e) {
        const message = e instanceof Error ? e.message : "An unknown error occurred.";
        return { success: false, message };
    }
  }, []);


  return { students, saveStudents, departments, saveDepartments, registerStudent };
}
