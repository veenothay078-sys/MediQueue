import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_DEPARTMENTS,
  INITIAL_DOCTORS,
  INITIAL_APPOINTMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PATIENT_PROFILE,
  getTodayDateStr,
} from '../data/initialData';
import { generateToken } from '../utils/queueCalculations';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 1. Theme State (Dark / Light)
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('mediqueue_theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('mediqueue_theme', theme);
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // 2. Active Role (patient / admin)
  const [role, setRoleState] = useState(() => {
    try {
      return localStorage.getItem('mediqueue_role') || 'patient';
    } catch {
      return 'patient';
    }
  });

  const setRole = (newRole) => {
    setRoleState(newRole);
    try {
      localStorage.setItem('mediqueue_role', newRole);
    } catch (e) {
      console.error(e);
    }
  };

  // 3. Toasts
  const [toasts, setToasts] = useState([]);
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((title, message, type = 'info', duration = 4000) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  // 4. Patient Profile
  const [patientProfile, setPatientProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('mediqueue_profile');
      return saved ? JSON.parse(saved) : INITIAL_PATIENT_PROFILE;
    } catch {
      return INITIAL_PATIENT_PROFILE;
    }
  });

  const updateProfile = (updatedData) => {
    setPatientProfile((prev) => {
      const next = { ...prev, ...updatedData };
      try {
        localStorage.setItem('mediqueue_profile', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
    addToast('Profile Updated', 'Your profile details have been saved successfully.', 'success');
  };

  // 5. Departments
  const [departments, setDepartments] = useState(() => {
    try {
      const saved = localStorage.getItem('mediqueue_departments');
      return saved ? JSON.parse(saved) : INITIAL_DEPARTMENTS;
    } catch {
      return INITIAL_DEPARTMENTS;
    }
  });

  const saveDepartments = (newDepts) => {
    setDepartments(newDepts);
    try {
      localStorage.setItem('mediqueue_departments', JSON.stringify(newDepts));
    } catch (e) {
      console.error(e);
    }
  };

  const addDepartment = (deptData) => {
    const newDept = {
      ...deptData,
      id: 'dept-' + Date.now(),
      active: true,
    };
    const updated = [newDept, ...departments];
    saveDepartments(updated);
    addToast('Department Added', `${newDept.name} has been added.`, 'success');
    return newDept;
  };

  const updateDepartment = (id, updatedFields) => {
    const updated = departments.map((d) => (d.id === id ? { ...d, ...updatedFields } : d));
    saveDepartments(updated);
    addToast('Department Updated', 'Department details have been updated.', 'success');
  };

  const toggleDepartmentStatus = (id) => {
    const dept = departments.find((d) => d.id === id);
    const updated = departments.map((d) => (d.id === id ? { ...d, active: !d.active } : d));
    saveDepartments(updated);
    addToast('Status Changed', `${dept?.name} is now ${!dept?.active ? 'Active' : 'Disabled'}.`, 'info');
  };

  // 6. Doctors
  const [doctors, setDoctors] = useState(() => {
    try {
      const saved = localStorage.getItem('mediqueue_doctors');
      return saved ? JSON.parse(saved) : INITIAL_DOCTORS;
    } catch {
      return INITIAL_DOCTORS;
    }
  });

  const saveDoctors = (newDocs) => {
    setDoctors(newDocs);
    try {
      localStorage.setItem('mediqueue_doctors', JSON.stringify(newDocs));
    } catch (e) {
      console.error(e);
    }
  };

  const addDoctor = (doctorData) => {
    const dept = departments.find((d) => d.id === doctorData.departmentId);
    const newDoc = {
      ...doctorData,
      id: 'doc-' + Date.now(),
      departmentName: dept ? dept.name : 'General Medicine',
      rating: 5.0,
      reviewsCount: 1,
      active: true,
      status: doctorData.status || 'Available',
    };
    const updated = [newDoc, ...doctors];
    saveDoctors(updated);
    addToast('Doctor Registered', `${newDoc.name} has been added to ${newDoc.departmentName}.`, 'success');
    return newDoc;
  };

  const updateDoctor = (id, updatedFields) => {
    let deptName = updatedFields.departmentName;
    if (updatedFields.departmentId && !deptName) {
      const dept = departments.find((d) => d.id === updatedFields.departmentId);
      if (dept) deptName = dept.name;
    }
    const updated = doctors.map((doc) =>
      doc.id === id ? { ...doc, ...updatedFields, ...(deptName ? { departmentName: deptName } : {}) } : doc
    );
    saveDoctors(updated);
    addToast('Doctor Updated', 'Doctor profile updated successfully.', 'success');
  };

  const toggleDoctorAvailability = (id) => {
    const doc = doctors.find((d) => d.id === id);
    const nextStatus = doc?.status === 'Available' ? 'On Break' : 'Available';
    const updated = doctors.map((d) => (d.id === id ? { ...d, status: nextStatus } : d));
    saveDoctors(updated);
    addToast('Availability Updated', `${doc?.name} status set to ${nextStatus}.`, 'info');
  };

  // 7. Notifications
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('mediqueue_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const saveNotifications = (newNotifs) => {
    setNotifications(newNotifs);
    try {
      localStorage.setItem('mediqueue_notifications', JSON.stringify(newNotifs));
    } catch (e) {
      console.error(e);
    }
  };

  const addNotification = useCallback((title, message, tokenNumber = null, type = 'info', link = '/queue') => {
    const newNotif = {
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      title,
      message,
      tokenNumber,
      type,
      timestamp: new Date().toISOString(),
      read: false,
      link,
    };
    setNotifications((prev) => {
      const next = [newNotif, ...prev];
      try {
        localStorage.setItem('mediqueue_notifications', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  }, []);

  const markNotificationAsRead = (id) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveNotifications(updated);
  };

  const markAllNotificationsAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
    addToast('All Read', 'Marked all notifications as read.', 'info');
  };

  const clearNotifications = () => {
    saveNotifications([]);
    addToast('Cleared', 'Notification history cleared.', 'info');
  };

  // 8. Appointments State
  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = localStorage.getItem('mediqueue_appointments');
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  const saveAppointments = (newApts) => {
    setAppointments(newApts);
    try {
      localStorage.setItem('mediqueue_appointments', JSON.stringify(newApts));
    } catch (e) {
      console.error(e);
    }
  };

  // Action: Book Appointment
  const bookAppointment = (bookingData) => {
    const doctor = doctors.find((d) => d.id === bookingData.doctorId);
    const department = departments.find((dept) => dept.id === (bookingData.departmentId || doctor?.departmentId));
    const targetDate = bookingData.date || getTodayDateStr();

    const { tokenNumber, queueSequence } = generateToken(
      department?.code || 'GEN',
      appointments,
      targetDate
    );

    const isForToday = targetDate === getTodayDateStr();
    const initialStatus = isForToday ? 'Waiting' : 'Booked';

    const newAppointment = {
      id: 'apt-' + Date.now(),
      tokenNumber,
      queueSequence,
      patientName: bookingData.patientName || patientProfile.name,
      patientEmail: bookingData.patientEmail || patientProfile.email,
      patientPhone: bookingData.patientPhone || patientProfile.phone,
      doctorId: doctor?.id,
      doctorName: doctor?.name || 'Assigned Specialist',
      departmentId: department?.id,
      departmentName: department?.name || 'General Medicine',
      departmentCode: department?.code || 'GEN',
      date: targetDate,
      timeSlot: bookingData.timeSlot || '10:00 AM',
      status: initialStatus,
      priority: bookingData.priority || 'Normal',
      reason: bookingData.reason || 'General Consultation',
      consultationDuration: doctor?.consultationDuration || department?.avgConsultationTime || 12,
      roomNumber: doctor?.roomNumber || department?.roomNumber || 'Room 101',
      calledAt: null,
      completedAt: null,
      createdAt: new Date().toISOString(),
    };

    const updated = [newAppointment, ...appointments];
    saveAppointments(updated);

    // Push notification
    addNotification(
      'Appointment Confirmed',
      `Your appointment with ${newAppointment.doctorName} is confirmed for ${newAppointment.date} at ${newAppointment.timeSlot}. Token: ${tokenNumber}`,
      tokenNumber,
      'success',
      '/queue'
    );

    addToast(
      'Appointment Booked!',
      `Token ${tokenNumber} generated for ${newAppointment.doctorName}.`,
      'success'
    );

    return newAppointment;
  };

  // Action: Cancel Appointment
  const cancelAppointment = (appointmentId, reason = 'Cancelled by patient') => {
    const target = appointments.find((a) => a.id === appointmentId);
    if (!target) return;

    const updated = appointments.map((a) =>
      a.id === appointmentId ? { ...a, status: 'Cancelled', cancellationReason: reason } : a
    );
    saveAppointments(updated);

    addNotification(
      'Appointment Cancelled',
      `Your appointment for token ${target.tokenNumber} has been cancelled.`,
      target.tokenNumber,
      'error',
      '/history'
    );

    addToast('Appointment Cancelled', `Token ${target.tokenNumber} has been cancelled.`, 'info');
  };

  // Action: Reschedule Appointment
  const rescheduleAppointment = (appointmentId, newDate, newTimeSlot) => {
    const target = appointments.find((a) => a.id === appointmentId);
    if (!target) return;

    const isToday = newDate === getTodayDateStr();
    const nextStatus = isToday ? 'Waiting' : 'Booked';

    const { tokenNumber, queueSequence } = generateToken(
      target.departmentCode || 'GEN',
      appointments.filter((a) => a.id !== appointmentId),
      newDate
    );

    const updated = appointments.map((a) =>
      a.id === appointmentId
        ? {
            ...a,
            date: newDate,
            timeSlot: newTimeSlot,
            tokenNumber,
            queueSequence,
            status: nextStatus,
            calledAt: null,
            completedAt: null,
          }
        : a
    );
    saveAppointments(updated);

    addNotification(
      'Appointment Rescheduled',
      `Appointment rescheduled to ${newDate} at ${newTimeSlot}. New Token: ${tokenNumber}.`,
      tokenNumber,
      'success',
      '/queue'
    );

    addToast('Rescheduled Successfully', `New Token ${tokenNumber} issued for ${newDate}.`, 'success');
  };

  // Action: Call Next Patient (Admin Queue Operation)
  const callNextPatient = (doctorId) => {
    const todayStr = getTodayDateStr();
    const docTodayApts = appointments.filter(
      (a) => a.date === todayStr && (!doctorId || a.doctorId === doctorId)
    );

    // Current active patient
    const currentActive = docTodayApts.find(
      (a) => a.status === 'In Consultation' || a.status === 'Called'
    );

    // Next patient in line (Emergency first, then sequence)
    const nextInLine = docTodayApts
      .filter((a) => a.status === 'Waiting' || a.status === 'Booked')
      .sort((a, b) => {
        if (a.priority === 'Emergency' && b.priority !== 'Emergency') return -1;
        if (b.priority === 'Emergency' && a.priority !== 'Emergency') return 1;
        return (a.queueSequence || 0) - (b.queueSequence || 0);
      })[0];

    if (!nextInLine && !currentActive) {
      addToast('Queue Empty', 'No more waiting patients for this doctor today.', 'info');
      return;
    }

    const nowTimeStr = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const updated = appointments.map((a) => {
      // Complete currently active
      if (currentActive && a.id === currentActive.id) {
        return {
          ...a,
          status: 'Completed',
          completedAt: nowTimeStr,
        };
      }
      // Advance next patient to In Consultation
      if (nextInLine && a.id === nextInLine.id) {
        return {
          ...a,
          status: 'In Consultation',
          calledAt: nowTimeStr,
        };
      }
      return a;
    });

    saveAppointments(updated);

    if (currentActive) {
      addNotification(
        'Consultation Completed',
        `Consultation for ${currentActive.patientName} (${currentActive.tokenNumber}) completed.`,
        currentActive.tokenNumber,
        'info',
        '/history'
      );
    }

    if (nextInLine) {
      addNotification(
        'Now Serving — Please Proceed',
        `Token ${nextInLine.tokenNumber} is now being served in ${nextInLine.roomNumber}.`,
        nextInLine.tokenNumber,
        'success',
        '/queue'
      );
      addToast(
        'Called Next Patient',
        `Now serving Token ${nextInLine.tokenNumber} (${nextInLine.patientName}) in ${nextInLine.roomNumber}.`,
        'success'
      );
    } else if (currentActive) {
      addToast(
        'Consultation Completed',
        `Token ${currentActive.tokenNumber} marked as completed. No more waiting patients.`,
        'success'
      );
    }
  };

  // Action: Complete an Appointment explicitly
  const completeAppointment = (appointmentId) => {
    const nowTimeStr = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const target = appointments.find((a) => a.id === appointmentId);
    const updated = appointments.map((a) =>
      a.id === appointmentId
        ? {
            ...a,
            status: 'Completed',
            completedAt: a.completedAt || nowTimeStr,
          }
        : a
    );
    saveAppointments(updated);

    if (target) {
      addNotification(
        'Visit Completed',
        `Consultation with ${target.doctorName} completed.`,
        target.tokenNumber,
        'success',
        '/history'
      );
      addToast('Completed', `Token ${target.tokenNumber} marked as completed.`, 'success');
    }
  };

  // Action: Skip a Patient
  const skipPatient = (appointmentId) => {
    const target = appointments.find((a) => a.id === appointmentId);
    const updated = appointments.map((a) =>
      a.id === appointmentId ? { ...a, status: 'Skipped' } : a
    );
    saveAppointments(updated);

    if (target) {
      addNotification(
        'Patient Skipped',
        `Token ${target.tokenNumber} was temporarily skipped by the queue manager. Please approach the desk.`,
        target.tokenNumber,
        'warning',
        '/queue'
      );
      addToast('Patient Skipped', `Token ${target.tokenNumber} marked as skipped.`, 'info');
    }
  };

  // Action: Set Emergency Priority
  const setEmergencyPriority = (appointmentId, isEmergency = true) => {
    const target = appointments.find((a) => a.id === appointmentId);
    const priority = isEmergency ? 'Emergency' : 'Normal';
    const updated = appointments.map((a) =>
      a.id === appointmentId ? { ...a, priority } : a
    );
    saveAppointments(updated);

    if (target) {
      addNotification(
        isEmergency ? 'Emergency Priority Activated' : 'Priority Reset to Normal',
        `Token ${target.tokenNumber} priority has been set to ${priority}.`,
        target.tokenNumber,
        isEmergency ? 'error' : 'info',
        '/queue'
      );
      addToast(
        isEmergency ? 'Emergency Priority!' : 'Priority Updated',
        `Token ${target.tokenNumber} marked as ${priority}.`,
        isEmergency ? 'error' : 'info'
      );
    }
  };

  // Action: Update Status general
  const updateAppointmentStatus = (appointmentId, newStatus) => {
    const target = appointments.find((a) => a.id === appointmentId);
    const updated = appointments.map((a) =>
      a.id === appointmentId ? { ...a, status: newStatus } : a
    );
    saveAppointments(updated);
    addToast('Status Updated', `Token ${target?.tokenNumber} status is now ${newStatus}.`, 'info');
  };

  // Reset to Demo Data
  const resetAllData = () => {
    localStorage.removeItem('mediqueue_appointments');
    localStorage.removeItem('mediqueue_doctors');
    localStorage.removeItem('mediqueue_departments');
    localStorage.removeItem('mediqueue_notifications');
    localStorage.removeItem('mediqueue_profile');
    setAppointments(INITIAL_APPOINTMENTS);
    setDoctors(INITIAL_DOCTORS);
    setDepartments(INITIAL_DEPARTMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setPatientProfile(INITIAL_PATIENT_PROFILE);
    addToast('Data Reset', 'Restored pristine initial demo data.', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        role,
        setRole,
        toasts,
        addToast,
        removeToast,
        patientProfile,
        updateProfile,
        departments,
        addDepartment,
        updateDepartment,
        toggleDepartmentStatus,
        doctors,
        addDoctor,
        updateDoctor,
        toggleDoctorAvailability,
        notifications,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        appointments,
        bookAppointment,
        cancelAppointment,
        rescheduleAppointment,
        callNextPatient,
        completeAppointment,
        skipPatient,
        setEmergencyPriority,
        updateAppointmentStatus,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
