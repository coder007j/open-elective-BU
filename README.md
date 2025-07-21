# Automated Open Elective Allocation System

## Project Synopsis

The "Automated Open Elective Allocation System" is a modern web platform designed to streamline and digitize the process of open elective course registration and allocation for educational institutions. It replaces inefficient, time-consuming manual procedures with a fully automated, transparent, and accurate digital solution.

This project introduces a dedicated platform that allows students to view available electives and submit their preferences online, while empowering administrators to configure allocation rules and monitor the process. The core of the system is an AI-powered engine that automatically assigns courses based on student merit and seat availability, significantly reducing administrative workload and eliminating manual errors.

This application is built using **Next.js**, **React**, **Tailwind CSS**, and **ShadCN UI** for a modern user experience, with **Genkit (Google AI)** for the intelligent allocation engine.

## Key Features in Detail

### 1. Role-Based Access Control (RBAC)

The platform implements a robust three-tier user system, ensuring that each user has access only to the functionalities relevant to their role.

*   **Admin (Supervisor)**:
    *   Has complete oversight and control of the entire system.
    *   Manages the list of elective departments, including setting student **capacity** and updating the **syllabus** for each elective.
    *   Views all student registrations and their approval statuses.
    *   Triggers the automated, AI-driven student allocation process from their dashboard.

*   **Department User (Head of Department)**:
    *   Manages their specific department's responsibilities from a dedicated dashboard.
    *   **Approves** new student registrations for students belonging to their home department.
    *   Views a complete roster of their home department's students, including their final elective assignment.
    *   Views a list of "incoming" students from other departments who were allocated to their department's elective.

*   **Student**:
    *   Registers for an account, which remains "pending" until approved by their home department head.
    *   Once approved, they can log in to select their elective preferences (up to a set maximum).
    *   Can view the detailed syllabus for each elective to make informed choices.
    *   After the allocation is run by the Admin, they can view their final assigned elective.

### 2. AI-Powered Automated Allocation

The core of the application is a sophisticated allocation system that automates the complex task of assigning students to electives fairly and efficiently.

*   **Merit-Based Prioritization**: The system uses the student's "last semester percentage" as the primary factor for priority. Higher percentages get higher priority.
*   **Round-Robin Fairness Algorithm**: To ensure fairness and prevent students from a single high-performing department from dominating popular electives, the algorithm iterates in rounds, picking the top-ranked unassigned student from *each* home department.
*   **Preference-Based Assignment**: For each student, the system attempts to assign them to their first preference. If that elective is full, it moves to their second, third, and subsequent choices.
*   **Admin-Triggered**: The allocation process is initiated by the Admin, giving them full control over the timing.
*   **Transparent Results**: After allocation, the results are displayed to the Admin, and the system updates the status for all students and department dashboards.

### 3. Intuitive User Dashboards & Workflow

Each user role has a dedicated dashboard tailored to their specific needs, ensuring a smooth and logical workflow.

*   **Student Registration & Approval**: New students register and await approval from their home department head to log in.
*   **Elective Selection**: Approved students can select and rank their preferred electives.
*   **Allocation & Finalization**: The Admin runs the allocation process. Once a student is assigned an elective, their choices are locked, and they can view their final result.
*   **Department & Admin Views**: Departments can track their own students and see who has been assigned to their elective. The Admin has a complete overview of the entire process.
