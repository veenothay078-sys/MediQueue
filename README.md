# MediQueue — Smart Hospital Queue & Appointment System

> **Tagline:** Book. Queue. Care.  
> **Hero Message:** Less Waiting. More Care.  
> **Mission:** MediQueue is an intelligent hospital and clinic appointment + live queue management SaaS platform designed to eliminate unnecessary hospital waiting hall congestion by providing transparent token progression for patients and a streamlined calling console for medical staff.

---

## 🌟 Key Product Features

### 👤 Patient Experience
- **Interactive Landing Page**: Modern healthcare visual system with live queue widget simulation, 5-step journey walkthrough, departments, and doctor roster.
- **Patient Dashboard**: Personalized greeting with quick status pods, upcoming consultation pass, and live waiting triage snapshot.
- **5-Step Appointment Booking Wizard**:
  - *Step 1:* Choose Clinical Department
  - *Step 2:* Select Specialist Physician
  - *Step 3:* Select Consultation Date (Today or up to 30 days ahead)
  - *Step 4:* Choose Time Slot & Symptom Details
  - *Step 5:* Review Summary & Generate Digital Token (with celebration confetti)
- **Live Queue Stream & Telemetry (`/queue`)**:
  - *Now Serving:* Displays currently active token, room number, and physician.
  - *Your Token Status:* Shows your position (# patients ahead) and estimated waiting time calculated dynamically (`Patients Ahead × Doctor Consultation Duration`).
  - *Queue Sequence:* Live timeline with emergency priority highlighting.
  - *Interactive Demo Simulation:* 1-click trigger to simulate queue advancement.
- **Appointment Management (`/appointments` & `/appointments/:id`)**:
  - Filter by Upcoming, Today, Completed, and Cancelled tabs.
  - Interactive Reschedule Modal (date & time slot update with token sequencing).
  - Cancellation Confirmation dialog with reason capture and token release.
  - Digital Pass Detail page with printable ticket format and hospital wing directions.
- **Departments & Doctors Directory**:
  - 10 realistic departments (*General Medicine, Cardiology, Pediatrics, Dermatology, Orthopedics, ENT, Neurology, Gynecology, Ophthalmology, Dental*).
  - 12 verified specialist doctors with ratings, credentials, experience, consultation fees, and availability schedules.
- **Notification Center (`/notifications`)**:
  - Real-time updates on appointment confirmations, token advancements, and room calls.
- **Patient Profile Management (`/profile`)**:
  - Edit patient demographics, emergency contact, and allergies with persistent client storage.

### 🏥 Hospital Administration & Operations
- **Hospital Command Dashboard (`/admin`)**:
  - Real-time KPI indicators: *Today's Appointments, Waiting Patients, In Consultation, Completed Today, Emergency Cases, and Cancellation Rate*.
- **Queue Calling Station (`/admin/queue`)**:
  - Multi-room calling console: **Call Next Patient** (automatically completes current consult and advances next in line).
  - **Emergency Priority Toggle**: Instantly elevates critical cases to the front of the queue with pulsing red alerts.
  - **Skip Patient**: Temporarily moves patient to skipped list with 1-click re-queueing.
  - Direct call and status completion shortcuts.
- **Master Appointment Registry (`/admin/appointments`)**:
  - Multi-criteria search and filter table (by Department, Doctor, Status, Priority, Date).
  - In-table status and emergency priority updates.
- **Doctor Roster & Availability (`/admin/doctors`)**:
  - Add and Edit doctor modal forms with department assignments, room numbers, and fees.
  - 1-click availability toggling (Available vs On Break).
- **Department Management (`/admin/departments`)**:
  - Add and Edit clinical divisions with custom prefix codes (e.g. `GEN`, `CAR`, `PED`) and active toggling.
- **Executive Analytics Suite (`/admin/analytics`)**:
  - Interactive charts powered by **Recharts**:
    1. *Appointments Trend (7-Day Line Chart)*
    2. *Queue Status Breakdown (Donut Chart)*
    3. *Appointments by Department (Bar Chart)*
    4. *Doctor Workload Distribution (Bar Chart)*
    5. *Throughput & Wait Time Metrics*

---

## 🛠️ Technology Stack

- **Framework:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing:** [React Router DOM v6](https://reactrouter.com/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with Healthcare Teal / Navy Palette & Dark Mode Support
- **Icons:** [Lucide React](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/)
- **Animations & Effects:** [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **State Management & Persistence:** Central React Context + `LocalStorage` with resilient fallback seeding

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🧭 Routes Map

| Route | Description |
| :--- | :--- |
| `/` | Modern Healthcare Landing Page |
| `/login` | Demo Role Selector (Patient vs Admin) |
| `/patient/dashboard` | Patient Dashboard with Today's Queue & Upcoming Visits |
| `/departments` | Clinical Departments Directory |
| `/doctors` | Specialist Physician Directory & Search |
| `/doctors/:id` | Doctor Profile, Consultation Schedule & Queue Preview |
| `/book-appointment` | 5-Step Appointment & Token Booking Wizard |
| `/appointments` | Patient Appointments (Tabs: Upcoming, Today, Completed, Cancelled) |
| `/appointments/:id` | Digital Pass / Printable Appointment Ticket |
| `/queue` | Live Queue Tracker & Waiting Time Calculation Stream |
| `/history` | Completed Consultation Records |
| `/notifications` | Notification Center & Queue Alert History |
| `/profile` | Patient Profile & Health Preferences |
| `/admin` | Hospital Operations Command Dashboard |
| `/admin/queue` | Live Calling Console & Emergency Priority Triaging |
| `/admin/appointments` | Master Appointment Registry & Multi-Filter Table |
| `/admin/doctors` | Doctor Roster & Availability Management |
| `/admin/departments` | Clinical Department Configuration |
| `/admin/analytics` | Recharts Hospital Throughput & Operational Analytics |

---

## 🔒 Healthcare Safety Disclaimer
*MediQueue is a demonstration appointment and queue-management SaaS platform and does not offer medical triage, diagnostic, or emergency dispatch services.*
