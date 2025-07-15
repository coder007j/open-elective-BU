
import type { Department, Student, DepartmentUser } from '@/types';

export const DEPARTMENTS_DATA: Department[] = [
  { 
    id: 'cs', 
    name: 'Computer Science', 
    capacity: 2, 
    description: 'Explore algorithms, AI, and software development.', 
    iconName: 'Cpu',
    syllabus: 'Module 1: Intro to AI. Module 2: Machine Learning basics. Module 3: Neural Networks.',
    assignedStudents: ['EXISTING_STUDENT_1']
  },
  { 
    id: 'mech', 
    name: 'Mechanical Engineering', 
    capacity: 3, 
    description: 'Design and build mechanical systems.', 
    iconName: 'Wrench',
    syllabus: 'Module 1: Thermodynamics. Module 2: Fluid Mechanics. Module 3: Kinematics.',
    assignedStudents: [] 
  },
  { 
    id: 'ee', 
    name: 'Electrical Engineering', 
    capacity: 1, 
    description: 'Delve into circuits, power systems, and electronics.', 
    iconName: 'Zap',
    syllabus: 'Module 1: Circuit Theory. Module 2: Electromagnetism. Module 3: Power Systems.',
    assignedStudents: ['EXISTING_STUDENT_2'] 
  },
  { 
    id: 'civil', 
    name: 'Civil Engineering', 
    capacity: 2, 
    description: 'Shape the infrastructure of tomorrow.', 
    iconName: 'Building',
    syllabus: 'Module 1: Structural Analysis. Module 2: Geotechnical Engineering. Module 3: Transportation Engineering.',
    assignedStudents: []
  },
  { 
    id: 'biotech', 
    name: 'Biotechnology', 
    capacity: 2, 
    description: 'Innovate at the intersection of biology and technology.', 
    iconName: 'FlaskConical',
    syllabus: 'Module 1: Molecular Biology. Module 2: Genetic Engineering. Module 3: Bioprocess Technology.',
    assignedStudents: []
  },
  { 
    id: 'hum', 
    name: 'Humanities & Social Sciences', 
    capacity: 4, 
    description: 'Understand human culture, society, and behavior.', 
    iconName: 'CustomAcademicCap',
    syllabus: 'Module 1: Sociology. Module 2: Psychology. Module 3: World History.',
    assignedStudents: ['EXISTING_STUDENT_3'] 
  },
];

export const MOCK_STUDENTS: Student[] = [
  { rollNumber: 'user123', name: 'Alice Smith', password: 'password123', homeDepartmentId: 'cs', semester: 5, lastSemesterPercentage: 88.5, status: 'approved', preferences: [], assignedElective: null, assignmentReason: null, homeDeptApproval: false, electiveDeptApproval: false },
  { rollNumber: 'user456', name: 'Bob Johnson', password: 'password456', homeDepartmentId: 'mech', semester: 3, lastSemesterPercentage: 76.0, status: 'approved', preferences: [], assignedElective: null, assignmentReason: null, homeDeptApproval: false, electiveDeptApproval: false },
  { rollNumber: 'user789', name: 'Carol Williams', password: 'password789', homeDepartmentId: 'ee', semester: 7, lastSemesterPercentage: 91.2, status: 'pending', preferences: [], assignedElective: null, assignmentReason: null, homeDeptApproval: false, electiveDeptApproval: false },
];

export const MOCK_DEPARTMENT_USERS: DepartmentUser[] = [
  { id: 'cs', password: 'password', name: 'CS Department Head', departmentId: 'cs' },
  { id: 'mech', password: 'password', name: 'Mech Department Head', departmentId: 'mech' },
  { id: 'ee', password: 'password', name: 'EE Department Head', departmentId: 'ee' },
  { id: 'civil', password: 'password', name: 'Civil Department Head', departmentId: 'civil' },
  { id: 'biotech', password: 'password', name: 'Biotech Department Head', departmentId: 'biotech' },
  { id: 'hum', password: 'password', name: 'Humanities Dept Head', departmentId: 'hum' },
];


export const MAX_PREFERENCES = 4;
