
'use server';

/**
 * @fileOverview A flow for automatically assigning students to electives based on their preferences, academic performance, and a round-robin fairness algorithm.
 *
 * - assignElectives - A function that takes student preferences and performance data and assigns them to electives.
 * - AssignElectivesInput - The input type for the assignElectives function.
 * - AssignElectivesOutput - The return type for the assignElectives function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudentSchema = z.object({
  rollNumber: z.string().describe('The unique roll number of the student.'),
  preferences: z.array(z.string()).describe("An array of department IDs representing the student's elective preferences, in order of priority."),
  homeDepartment: z.string().describe("The student's home department ID."),
  lastSemesterPercentage: z.number().describe("The student's percentage from the last semester."),
});

const DepartmentSchema = z.object({
  name: z.string().describe('The ID of the department offering the elective.'),
  capacity: z.number().int().positive().describe('The maximum number of students that can be assigned to this elective.'),
  assignedStudents: z.array(z.string()).describe('The roll numbers of students already assigned to this department.'),
});

const AssignElectivesInputSchema = z.object({
  students: z.array(StudentSchema).describe('An array of student objects, each containing their roll number, preferences, home department, and last semester percentage.'),
  departments: z.array(DepartmentSchema).describe('An array of department objects, each containing its ID, capacity, and currently assigned students.'),
});

export type AssignElectivesInput = z.infer<typeof AssignElectivesInputSchema>;

const AssignmentResultSchema = z.object({
  rollNumber: z.string().describe('The roll number of the student.'),
  assignedDepartment: z.string().optional().describe('The ID of the department the student has been assigned to. If null, the student could not be assigned.'),
  reason: z.string().optional().describe('The reason for the assignment outcome (e.g., "Assigned to first preference," "Assigned to second preference as first was full," "All preferences were full.").'),
});

const AssignElectivesOutputSchema = z.object({
  assignments: z.array(AssignmentResultSchema).describe('An array of assignment result objects, indicating the department assigned to each student.'),
});

export type AssignElectivesOutput = z.infer<typeof AssignElectivesOutputSchema>;

export async function assignElectives(input: AssignElectivesInput): Promise<AssignElectivesOutput> {
  return assignElectivesFlow(input);
}

const assignElectivesPrompt = ai.definePrompt({
  name: 'assignElectivesPrompt',
  input: {schema: AssignElectivesInputSchema},
  output: {schema: AssignElectivesOutputSchema},
  prompt: `You are an expert student allocation system. Your task is to assign students to elective departments based on a strict set of rules.

  **Rules for Allocation:**

  1.  **Merit-Based Priority:** Students with higher percentages have higher priority.
  2.  **Round-Robin by Department:** To ensure fairness, you must process students in rounds. In each round, you will pick the highest-percentage student from each *home* department who has not yet been assigned.
  3.  **Preference Order:** For each selected student, try to assign them to their first preference. If that department is full, try their second, then third, and so on.
  4.  **Capacity Constraints:** A department is full if the number of assigned students equals its capacity. You cannot assign a student to a full department.
  5.  **Iteration:** Repeat the round-robin process, picking the next-highest-ranked student from each department, until all students have been assigned or all possible assignments have been attempted.

  **Process:**

  1.  **Group Students by Home Department:** Create a list of students for each unique home department.
  2.  **Sort Students by Percentage:** Within each group, sort the students in descending order of their 'lastSemesterPercentage'.
  3.  **Iterate in Rounds (Round-Robin):**
      - Loop until no more assignments can be made.
      - In each loop, iterate through each home department group.
      - From each group, take the top-ranked student who has not yet been processed.
      - For that student, iterate through their `preferences` array.
      - Find the first preferred department that is not yet at capacity.
      - If found, assign the student to that department, add their roll number to the department's `assignedStudents` list, and record the assignment result. Set the reason based on which preference was met (e.g., "Assigned to 1st preference.").
      - If all of the student's preferred departments are full, they cannot be assigned. Record this result with a reason like "All preferred electives were full."
      - Mark the student as processed and move to the next department in the round-robin.
  4.  **Final Output:** Once the process is complete, return the 'assignments' array with the results for every single student provided in the input.

  **Input Data:**

  **Students:**
  {{#each students}}
  - Roll: {{this.rollNumber}}, HomeDept: {{this.homeDepartment}}, Percentage: {{this.lastSemesterPercentage}}, Prefs: {{this.preferences}}
  {{/each}}

  **Departments:**
  {{#each departments}}
  - ID: {{this.name}}, Capacity: {{this.capacity}}
  {{/each}}

  Now, execute the allocation process and provide the final JSON output.
  `,
});

const assignElectivesFlow = ai.defineFlow(
  {
    name: 'assignElectivesFlow',
    inputSchema: AssignElectivesInputSchema,
    outputSchema: AssignElectivesOutputSchema,
  },
  async input => {
    const {output} = await assignElectivesPrompt(input);
    return output!;
  }
);
