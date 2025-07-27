# Automated Open Elective Allocation System - Project Report

## 1. Project Synopsis

The "Automated Open Elective Allocation System" is a modern web platform designed to streamline and digitize the process of open elective course registration and allocation for educational institutions. It replaces inefficient, time-consuming manual procedures with a fully automated, transparent, and accurate digital solution.

This project introduces a dedicated platform that allows students to view available electives and submit their preferences online, while empowering administrators and department heads to configure allocation rules, manage course details, and monitor the entire process. The core of the system is an AI-powered engine that automatically assigns courses based on student merit, preferences, and seat availability, significantly reducing administrative workload and eliminating manual errors.

---

## 2. Technology Stack & Versions

This application is built using a modern, robust, and type-safe technology stack. The key technologies and their versions (as per `package.json`) are:

*   **Framework**: Next.js (v15.3.3) - A React framework for building full-stack web applications.
*   **Language**: TypeScript (v5) - A statically typed superset of JavaScript that adds type safety.
*   **UI Library**: React (v18.3.1) - A JavaScript library for building user interfaces.
*   **UI Components**: ShadCN UI - A collection of re-usable UI components built with Radix UI and Tailwind CSS.
*   **Styling**: Tailwind CSS (v3.4.1) - A utility-first CSS framework for rapid UI development.
*   **AI/Generative Backend**: Genkit (v1.8.0) - A Google AI framework for building production-ready AI-powered features.
*   **Icons**: Lucide React (v0.475.0) - A library of simply beautiful and consistent icons.
*   **Schema Validation**: Zod (v3.24.2) - A TypeScript-first schema declaration and validation library.
*   **Form Management**: React Hook Form (v7.54.2) - A performant, flexible, and extensible forms library for React.

---

## 3. Key Features in Detail

The platform implements a robust three-tier user system, ensuring that each user has access only to the functionalities relevant to their role.

### 3.1. Role-Based Access Control (RBAC)

#### **Admin (Supervisor)**
*   **Login**: ID: `admin`, Password: `adminpass`
*   **Dashboard**: Has complete oversight and control of the entire system from a central dashboard with three main tabs:
    *   **Allocation**: Triggers the AI-driven student allocation process. Views the final results in a clear, color-coded table.
    *   **Manage Students**: Views all student registrations, grouped by their home department in a user-friendly accordion layout. Can remove student registrations if necessary.
    *   **Manage Departments**: Manages the master list of all elective departments, including adding new ones, editing existing ones (name, capacity, description, icon), and deleting them.

#### **Department User (Head of Department)**
*   **Login**: ID: (department ID, e.g., `physics`), Password: `password`
*   **Dashboard**: Manages their specific department's responsibilities from a dedicated dashboard:
    *   **Department Roster**: Approves or denies new student registrations for students belonging to their home department. Views a complete roster of their home department's students, including their final elective assignment.
    *   **Incoming Elective Students**: Views a list of "incoming" students from other departments who were successfully allocated to their department's elective.
    *   **Manage Elective**: Updates the **student capacity** for their own elective and can upload a **syllabus in PDF format**, which becomes available for students to view.

#### **Student**
*   **Login**: Credentials created during registration (must be approved by their department head first).
*   **Registration**: Can register for an account by providing their roll number, name, home department, semester, and last semester's percentage. The registration remains "pending" until approved.
*   **Elective Selection**:
    *   Once approved, they can log in to select and rank their elective preferences (up to a set maximum).
    *   The elective offered by their own home department is automatically hidden from the selection list.
    *   They can view the detailed syllabus (including uploaded PDFs) for each elective to make informed choices.
*   **View Allocation**: After the allocation is run by the Admin, they can view their final assigned elective on their dashboard.

### 3.2. AI-Powered Automated Allocation

The core of the application is a sophisticated allocation system built with **Genkit** that automates the complex task of assigning students to electives fairly and efficiently.

*   **Merit-Based Prioritization**: The system uses the student's "last semester percentage" as the primary factor for priority. Higher percentages get higher priority.
*   **Round-Robin Fairness Algorithm**: To ensure fairness and prevent students from a single high-performing department from dominating popular electives, the algorithm iterates in rounds, picking the top-ranked unassigned student from *each* home department.
*   **Preference-Based Assignment**: For each student, the system attempts to assign them to their first preference. If that elective is full, it moves to their second, third, and subsequent choices.
*   **Admin-Triggered**: The allocation process is initiated by the Admin, giving them full control over the timing.
*   **Transparent Results**: After allocation, the results are displayed to the Admin, and the system updates the status for all students and department dashboards.

### 3.3. Intuitive User Dashboards & Workflow

Each user role has a dedicated dashboard tailored to their specific needs, ensuring a smooth and logical workflow.

*   **Student Registration & Approval**: New students register and await approval from their home department head to log in.
*   **Elective Selection**: Approved students can select and rank their preferred electives. Their choices are saved and can be edited until the final allocation is run.
*   **Allocation & Finalization**: The Admin runs the allocation process. Once a student is assigned an elective, their choices are locked, and they can view their final result.
*   **Department & Admin Views**: Departments can track their own students and incoming elective students. The Admin has a complete overview of the entire process from a centralized dashboard.
