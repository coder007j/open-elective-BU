
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

export const MOCK_STUDENTS: Student[] = [
  { rollNumber: 'user123', name: 'Alice Smith', password: 'password123', homeDepartmentId: 'cs', semester: 5, status: 'approved', preferences: [], assignedElective: null, assignmentReason: null, homeDeptApproval: false, electiveDeptApproval: false },
  { rollNumber: 'user456', name: 'Bob Johnson', password: 'password456', homeDepartmentId: 'mech', semester: 3, status: 'approved', preferences: [], assignedElective: null, assignmentReason: null, homeDeptApproval: false, electiveDeptApproval: false },
  { rollNumber: 'user789', name: 'Carol Williams', password: 'password789', homeDepartmentId: 'ee', semester: 7, status: 'pending', preferences: [], assignedElective: null, assignmentReason: null, homeDeptApproval: false, electiveDeptApproval: false },
];

export const MAX_PREFERENCES = 4;
