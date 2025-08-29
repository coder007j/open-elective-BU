
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Student, Department, RegistrationData, DepartmentUser } from '@/types';
import { MOCK_STUDENTS, DEPARTMENTS_DATA, MOCK_DEPARTMENT_USERS } from '@/lib/constants';

const ALL_STUDENTS_STORAGE_KEY = 'allStudentsData';
const ALL_DEPARTMENTS_STORAGE_KEY = 'allDepartmentsData';
const ALL_DEPT_USERS_STORAGE_KEY = 'allDeptUsersData';

// Centralized hook to manage all student and department data from localStorage
export function useStudentData() {
  const [students, setStudents] = useState<Student[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentUsers, setDepartmentUsers] = useState<DepartmentUser[]>([]);

  useEffect(() => {
    // For students
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
    
    // For departments
    try {
        const storedDeptsString = localStorage.getItem(ALL_DEPARTMENTS_STORAGE_KEY);
        if (storedDeptsString) {
            const storedDepts: Department[] = JSON.parse(storedDeptsString);
            const storedDeptsMap = new Map(storedDepts.map(d => [d.id, d]));

            const mergedDepts = DEPARTMENTS_DATA.map(constDept => {
                const storedDept = storedDeptsMap.get(constDept.id);
                if (storedDept) {
                    return { ...constDept, ...storedDept, assignedStudents: storedDept.assignedStudents || [] };
                }
                return constDept;
            });
            setDepartments(mergedDepts);
        } else {
            localStorage.setItem(ALL_DEPARTMENTS_STORAGE_KEY, JSON.stringify(DEPARTMENTS_DATA));
            setDepartments(DEPARTMENTS_DATA);
        }
    } catch(e) {
      console.error("Failed to initialize department data from localStorage", e);
      setDepartments(DEPARTMENTS_DATA);
    }

    // For Department Users
     try {
      const storedDeptUsers = localStorage.getItem(ALL_DEPT_USERS_STORAGE_KEY);
      if (storedDeptUsers) {
        setDepartmentUsers(JSON.parse(storedDeptUsers));
      } else {
        localStorage.setItem(ALL_DEPT_USERS_STORAGE_KEY, JSON.stringify(MOCK_DEPARTMENT_USERS));
        setDepartmentUsers(MOCK_DEPARTMENT_USERS);
      }
    } catch(e) {
      console.error("Failed to initialize department user data from localStorage", e);
      setDepartmentUsers(MOCK_DEPARTMENT_USERS);
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

  const saveDepartmentUsers = useCallback((updatedUsers: DepartmentUser[]) => {
    setDepartmentUsers(updatedUsers);
    localStorage.setItem(ALL_DEPT_USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
  }, []);


  const registerStudent = useCallback(async (data: RegistrationData): Promise<{ success: boolean; message: string; }> => {
    try {
        const currentStudents: Student[] = JSON.parse(localStorage.getItem(ALL_STUDENTS_STORAGE_KEY) || '[]');
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
            passwordResetRequested: false,
        };
        
        const updatedStudents = [...currentStudents, newStudent];
        saveStudents(updatedStudents);
        
        return { success: true, message: 'Registration successful. Awaiting approval.' };
    } catch (e) {
        const message = e instanceof Error ? e.message : "An unknown error occurred.";
        return { success: false, message };
    }
  }, [saveStudents]);

  const requestPasswordReset = useCallback(async (id: string): Promise<{ success: boolean; message: string; }> => {
    const currentStudents: Student[] = JSON.parse(localStorage.getItem(ALL_STUDENTS_STORAGE_KEY) || '[]');
    const studentIndex = currentStudents.findIndex(s => s.rollNumber === id);

    if (studentIndex !== -1) {
        currentStudents[studentIndex].passwordResetRequested = true;
        saveStudents(currentStudents);
        return { success: true, message: 'Request submitted.' };
    }

    const currentDeptUsers: DepartmentUser[] = JSON.parse(localStorage.getItem(ALL_DEPT_USERS_STORAGE_KEY) || '[]');
    const deptUserIndex = currentDeptUsers.findIndex(u => u.id === id);

    if (deptUserIndex !== -1) {
        currentDeptUsers[deptUserIndex].passwordResetRequested = true;
        saveDepartmentUsers(currentDeptUsers);
        return { success: true, message: 'Request submitted.' };
    }

    return { success: false, message: 'No user found with that ID.' };
  }, [saveStudents, saveDepartmentUsers]);


  return { students, saveStudents, departments, saveDepartments, registerStudent, departmentUsers, saveDepartmentUsers, requestPasswordReset };
}
