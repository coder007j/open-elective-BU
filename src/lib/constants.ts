
import type { Department, Student, DepartmentUser } from '@/types';

export const DEPARTMENTS_DATA: Department[] = [
  // Science Faculty
  { id: 'physics', name: 'Physics and Our World', capacity: 15, description: 'Offered by Dept. of Physics', iconName: 'Atom', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'chemistry', name: 'Chemistry in Daily Life', capacity: 15, description: 'Offered by Dept. of Chemistry', iconName: 'FlaskConical', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'biochemistry', name: 'Biochemistry in Daily Life', capacity: 15, description: 'Offered by Dept. of Biochemistry', iconName: 'Dna', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'mathematics', name: 'Mathematics for Every one', capacity: 15, description: 'Offered by Dept. of Mathematics', iconName: 'Sigma', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'botany', name: 'Ethnobotany', capacity: 15, description: 'Offered by Dept. of Botany', iconName: 'Sprout', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'zoology', name: 'Economics Zoology', capacity: 15, description: 'Offered by Dept. of Zoology', iconName: 'Bird', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'psychology', name: 'Psychology and Life', capacity: 15, description: 'Offered by Dept. of Psychology', iconName: 'Brain', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'psychological-counselling', name: 'Psychology and Life', capacity: 15, description: 'Offered by Dept. of Psychological Counselling', iconName: 'BrainCircuit', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'life-science', name: 'Human Health and Hygiene', capacity: 15, description: 'Offered by Dept. of Life Science', iconName: 'HeartPulse', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'geography', name: 'Geography for All', capacity: 15, description: 'Offered by Dept. of Geography', iconName: 'Globe', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'gis', name: 'Geography for All', capacity: 15, description: 'Offered by Dept. of Geographic Information Science', iconName: 'Globe2', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'disaster-management', name: 'Geography for All', capacity: 15, description: 'Offered by Dept. of Natural Disaster Management', iconName: 'CloudHail', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'electronic-media', name: 'Skills for Broad cast Media', capacity: 15, description: 'Offered by Dept. of Electronic Media', iconName: 'Radio', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'film-making', name: 'Cinema and Society', capacity: 15, description: 'Offered by Dept. of Film Making', iconName: 'Film', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'microbiology', name: 'Microbial World', capacity: 15, description: 'Offered by Dept. of Microbiology', iconName: 'Bug', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'biotechnology', name: 'Biotechnology for Human Welfare', capacity: 15, description: 'Offered by Dept. of Biotechnology', iconName: 'Helix', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'food-technology', name: 'Nutrition and Health Care', capacity: 15, description: 'Offered by Dept. of Food Technology', iconName: 'Apple', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'apparel-technology', name: 'Fashion Design', capacity: 15, description: 'Offered by Dept. of Apparel Technology & Mgmt', iconName: 'Scissors', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'applied-geology', name: 'Minerals and Rocks', capacity: 15, description: 'Offered by Dept. of Applied Geology', iconName: 'Gem', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'statistics', name: 'Statistical Methods', capacity: 15, description: 'Offered by Dept. of Statistics', iconName: 'BarChart', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'environment-science', name: 'Climate Change and Current Issues / Natural Resources Management', capacity: 15, description: 'Offered by Dept. of Environment Science', iconName: 'Wind', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'library-science', name: 'Information Literacy', capacity: 15, description: 'Offered by Dept. of Library Science', iconName: 'Library', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'electronic-science', name: 'Basics of Digital Electronics & Commn', capacity: 15, description: 'Offered by Dept. of Electronic Science', iconName: 'CircuitBoard', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'yoga', name: 'Yoga & Life', capacity: 15, description: 'Offered by Dept. of Human Consciousness & Yoga', iconName: 'PersonStanding', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'mca-cs', name: 'Cyber Space', capacity: 15, description: 'Offered by Dept. of MCA/Computer Science', iconName: 'KeyRound', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'molecular-biology', name: 'Applied Molecular Biology', capacity: 15, description: 'Offered by Dept. of Molecular Biology', iconName: 'Dna', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  
  // Arts Faculty
  { id: 'kannada', name: 'did Föbd', capacity: 15, description: 'Offered by Dept. of Kannada', iconName: 'BookMarked', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'english', name: 'Write it Right', capacity: 15, description: 'Offered by Dept. of English', iconName: 'BookMarked', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'sanskrit', name: 'Sanskrit Made Easy', capacity: 15, description: 'Offered by Dept. of Sanskrit', iconName: 'BookMarked', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'hindi', name: 'Samanya Hindi', capacity: 15, description: 'Offered by Dept. of Hindi', iconName: 'BookMarked', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'telugu', name: 'Introductory Telugu', capacity: 15, description: 'Offered by Dept. of Telugu', iconName: 'BookMarked', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'urdu', name: 'Introductory Urdu', capacity: 15, description: 'Offered by Dept. of Urdu', iconName: 'BookMarked', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'history', name: 'Social Movement in India', capacity: 15, description: 'Offered by Dept. of History', iconName: 'Landmark', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'economics', name: 'Economic & Globalization', capacity: 15, description: 'Offered by Dept. of Economics', iconName: 'Banknote', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'political-science', name: 'Indian Politics Today', capacity: 15, description: 'Offered by Dept. of Political Science', iconName: 'Scale', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'sociology', name: 'Themes & Perspective in Sociology', capacity: 15, description: 'Offered by Dept. of Sociology', iconName: 'Users', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'rural-development', name: 'Co-operative Management', capacity: 15, description: 'Offered by Dept. of Rural Development', iconName: 'Tractor', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'msw', name: 'Social Movement and Action', capacity: 15, description: 'Offered by Dept. of MSW', iconName: 'Handshake', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'women-studies', name: 'Gender & Society', capacity: 15, description: 'Offered by Dept. of Women Studies', iconName: 'Venus', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'communication', name: 'Media and Society', capacity: 15, description: 'Offered by Dept. of Communication', iconName: 'Megaphone', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'gandhian-studies', name: 'Mahatma Gandhi & the Contemporary', capacity: 15, description: 'Offered by Dept. of Gandhian Studies', iconName: 'Peace', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'visual-arts', name: 'Arts Appreciation', capacity: 15, description: 'Offered by Dept. of Visual Arts', iconName: 'Palette', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'philosophy', name: 'Essentials of Indian Philosophy', capacity: 15, description: 'Offered by Dept. of Philosophy', iconName: 'Scroll', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'performing-arts', name: 'Performing Arts and Society', capacity: 15, description: 'Offered by Dept. of Performing Arts', iconName: 'Theater', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },

  // Education and Law Faculty
  { id: 'education', name: 'Pedagogy of Teaching', capacity: 15, description: 'Offered by Dept. of Education', iconName: 'GraduationCap', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'physical-education', name: 'Yoga and Wellness', capacity: 15, description: 'Offered by Dept. of Physical Education', iconName: 'HeartPulse', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
  { id: 'law', name: 'Human Rights', capacity: 15, description: 'Offered by Dept. of law', iconName: 'Gavel', syllabus: 'Syllabus to be updated by admin.', assignedStudents: [] },
];


export const MOCK_STUDENTS: Student[] = [
  { rollNumber: 'user123', name: 'Alice Smith', password: 'password123', homeDepartmentId: 'physics', semester: 5, lastSemesterPercentage: 88.5, status: 'approved', preferences: [], assignedElective: null, assignmentReason: null, homeDeptApproval: false, electiveDeptApproval: false },
  { rollNumber: 'user456', name: 'Bob Johnson', password: 'password456', homeDepartmentId: 'chemistry', semester: 3, lastSemesterPercentage: 76.0, status: 'approved', preferences: [], assignedElective: null, assignmentReason: null, homeDeptApproval: false, electiveDeptApproval: false },
  { rollNumber: 'user789', name: 'Carol Williams', password: 'password789', homeDepartmentId: 'mathematics', semester: 7, lastSemesterPercentage: 91.2, status: 'pending', preferences: [], assignedElective: null, assignmentReason: null, homeDeptApproval: false, electiveDeptApproval: false },
];

export const MOCK_DEPARTMENT_USERS: DepartmentUser[] = DEPARTMENTS_DATA.map(dept => ({
  id: dept.id,
  password: 'password',
  name: `${dept.name} Head`,
  departmentId: dept.id
}));


export const MAX_PREFERENCES = 5;
