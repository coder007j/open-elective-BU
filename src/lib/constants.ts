import type { Department, Student } from '@/types';

export const DEPARTMENTS_DATA: Department[] = [
  { 
    id: 'cs', 
    name: 'Computer Science', 
    capacity: 2, 
    description: 'Explore algorithms, AI, and software development.', 
    iconName: 'Cpu',
    assignedStudents: ['EXISTING_STUDENT_1'] // Simulate some existing assignments
  },
  { 
    id: 'mech', 
    name: 'Mechanical Engineering', 
    capacity: 3, 
    description: 'Design and build mechanical systems.', 
    iconName: 'Wrench',
    assignedStudents: [] 
  },
  { 
    id: 'ee', 
    name: 'Electrical Engineering', 
    capacity: 1, 
    description: 'Delve into circuits, power systems, and electronics.', 
    iconName: 'Zap',
    assignedStudents: ['EXISTING_STUDENT_2'] 
  },
  { 
    id: 'civil', 
    name: 'Civil Engineering', 
    capacity: 2, 
    description: 'Shape the infrastructure of tomorrow.', 
    iconName: 'Building',
    assignedStudents: []
  },
  { 
    id: 'biotech', 
    name: 'Biotechnology', 
    capacity: 2, 
    description: 'Innovate at the intersection of biology and technology.', 
    iconName: 'FlaskConical',
    assignedStudents: []
  },
  { 
    id: 'hum', 
    name: 'Humanities & Social Sciences', 
    capacity: 4, 
    description: 'Understand human culture, society, and behavior.', 
    iconName: 'CustomAcademicCap', // Using custom icon
    assignedStudents: ['EXISTING_STUDENT_3'] 
  },
];

export const MOCK_STUDENTS: Omit<Student, 'preferences' | 'assignedElective' | 'assignmentReason'>[] = [
  { rollNumber: 'user123', password: 'password123', name: 'Alice Smith' },
  { rollNumber: 'user456', password: 'password456', name: 'Bob Johnson' },
  { rollNumber: 'user789', password: 'password789', name: 'Carol Williams' },
];

export const MAX_PREFERENCES = 4;
