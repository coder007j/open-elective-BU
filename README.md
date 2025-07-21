# Open Elective Platform

This project is a comprehensive, web-based platform designed to streamline the process of open elective course registration and allocation for educational institutions. It provides a clear, role-based system for administrators, department heads, and students, ensuring a smooth and fair workflow from registration to final assignment.

The application is built using Next.js, React, Tailwind CSS, and ShadCN UI components, with an AI-powered core for intelligent student allocation.

## Key Features in Detail

### 1. Role-Based Access Control (RBAC)

The platform implements a robust three-tier user system, ensuring that each user has access only to the functionalities relevant to their role.

*   **Admin (Supervisor)**:
    *   Has complete oversight and control of the entire system.
    *   Manages the list of elective departments, including adding, editing, or deleting them.
    *   Sets the student **capacity** and uploads the **syllabus** for each elective.
    *   Views and approves all student registrations.
    *   Triggers the automated, AI-driven student allocation process.

*   **Department User**:
    *   Has a focused dashboard for managing their specific department's responsibilities.
    *   Approves new student registrations for students belonging to their home department.
    *   Can remove incorrect registrations for pending students.
    *   Views a complete roster of their home department's students, including which elective they were assigned to.
    *   Views a list of "incoming" students from other departments who were allocated to their elective.

*   **Student**:
    *   Registers for an account, which remains "pending" until approved by their home department.
    *   Once approved, they can log in to select their elective preferences (up to a set maximum).
    *   Can view the detailed syllabus for each elective before making a selection.
    *   After the allocation is run by the Admin, they can view their final assigned elective.

### 2. Student Registration & Approval Workflow

The platform manages the full lifecycle of a student's participation in the elective process.

*   **Registration**: New students fill out a form with their roll number, name, password, home department, semester, and last semester's percentage.
*   **Pending Status**: Upon registration, a student's account is created with a `pending` status.
*   **Department Approval**: The student's home department sees the pending registration in their dashboard and can either **Approve** or **Delete** it.
*   **Login Access**: Only students with an `approved` status are able to log in and access the elective selection dashboard.

### 3. AI-Powered Automated Allocation

The core of the application is a sophisticated allocation system that automates the complex task of assigning students to electives fairly and efficiently.

*   **Merit-Based Prioritization**: The system uses the student's "last semester percentage" as the primary factor for priority. Higher percentages get higher priority.
*   **Round-Robin Fairness Algorithm**: To prevent students from a single high-performing department from filling all the popular electives, the algorithm iterates in rounds. In each round, it picks the top-ranked unassigned student from *each* home department, ensuring fairness.
*   **Preference-Based Assignment**: For each student, the system attempts to assign them to their first preference. If that elective is full, it moves to their second, third, and subsequent choices.
*   **Admin-Triggered**: The allocation process is initiated by the Admin from their dashboard, giving them full control over the timing.
*   **Transparent Results**: After the allocation, the results are displayed to the Admin, and the system updates the status for all students and department dashboards.

### 4. Department & Syllabus Management

The Admin has the tools to keep all course information up-to-date.

*   **Department CRUD**: Admins can Create, Read, Update, and Delete departments from their dashboard.
*   **Dynamic Capacity**: Admins can set the maximum number of students that can be enrolled in any given elective, which is a critical input for the allocation algorithm.
*   **Syllabus Uploader**: For each elective, the Admin can paste or type the full syllabus. This information is then made available to students on the selection screen, helping them make informed choices.

### 5. Intuitive User Dashboards

Each user role has a dedicated dashboard tailored to their specific needs.

*   **Admin Dashboard**: A tabbed interface providing access to the **Allocation Manager**, **Student Manager**, and **Department Manager**.
*   **Department Dashboard**: A tabbed interface showing the **Department Roster** (for approvals) and the list of **Incoming Elective Students**.
*   **Student Dashboard**: A dynamic view that guides the student through the process:
    *   If no preferences are submitted, it shows the elective selection interface.
    *   If preferences have been submitted but not finalized, it shows their choices and a pending status.
    *   Once allocation is complete, it displays their final assigned elective.
