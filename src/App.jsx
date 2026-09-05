import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { RootLayout } from './layouts/RootLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { PatientDashboard } from './pages/patient/PatientDashboard';
import { DepartmentsPage } from './pages/patient/DepartmentsPage';
import { DoctorsPage } from './pages/patient/DoctorsPage';
import { DoctorDetailPage } from './pages/patient/DoctorDetailPage';
import { BookAppointmentPage } from './pages/patient/BookAppointmentPage';
import { AppointmentsPage } from './pages/patient/AppointmentsPage';
import { AppointmentDetailPage } from './pages/patient/AppointmentDetailPage';
import { QueueTrackerPage } from './pages/patient/QueueTrackerPage';
import { HistoryPage } from './pages/patient/HistoryPage';
import { NotificationsPage } from './pages/patient/NotificationsPage';
import { ProfilePage } from './pages/patient/ProfilePage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminQueuePage } from './pages/admin/AdminQueuePage';
import { AdminAppointmentsPage } from './pages/admin/AdminAppointmentsPage';
import { AdminDoctorsPage } from './pages/admin/AdminDoctorsPage';
import { AdminDepartmentsPage } from './pages/admin/AdminDepartmentsPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            {/* Public / Landing */}
            <Route index element={<LandingPage />} />
            <Route path="login" element={<LoginPage />} />

            {/* Patient Routes */}
            <Route path="patient/dashboard" element={<PatientDashboard />} />
            <Route path="departments" element={<DepartmentsPage />} />
            <Route path="doctors" element={<DoctorsPage />} />
            <Route path="doctors/:id" element={<DoctorDetailPage />} />
            <Route path="book-appointment" element={<BookAppointmentPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="appointments/:id" element={<AppointmentDetailPage />} />
            <Route path="queue" element={<QueueTrackerPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />

            {/* Admin Routes */}
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/queue" element={<AdminQueuePage />} />
            <Route path="admin/appointments" element={<AdminAppointmentsPage />} />
            <Route path="admin/doctors" element={<AdminDoctorsPage />} />
            <Route path="admin/departments" element={<AdminDepartmentsPage />} />
            <Route path="admin/analytics" element={<AdminAnalyticsPage />} />

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
