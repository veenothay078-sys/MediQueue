// Calculation utilities for queue management, wait times, token generation, and analytics

import { getTodayDateStr } from '../data/initialData';

/**
 * Generate next token for a department on a given date
 * format: [DEPT_CODE]-[3_DIGIT_SEQ] e.g. GEN-028
 */
export const generateToken = (deptCode, appointments, targetDate = getTodayDateStr()) => {
  const code = (deptCode || 'GEN').toUpperCase();
  const sameDeptAppointments = appointments.filter(
    (a) => a.date === targetDate && (a.departmentCode === code || (a.tokenNumber && a.tokenNumber.startsWith(code)))
  );

  let highestSeq = 0;
  sameDeptAppointments.forEach((apt) => {
    if (apt.queueSequence && typeof apt.queueSequence === 'number') {
      if (apt.queueSequence > highestSeq) highestSeq = apt.queueSequence;
    } else if (apt.tokenNumber) {
      const parts = apt.tokenNumber.split('-');
      if (parts.length === 2) {
        const num = parseInt(parts[1], 10);
        if (!isNaN(num) && num > highestSeq) {
          highestSeq = num;
        }
      }
    }
  });

  const nextSeq = highestSeq + 1;
  const seqPadded = String(nextSeq).padStart(3, '0');
  return {
    tokenNumber: `${code}-${seqPadded}`,
    queueSequence: nextSeq,
  };
};

/**
 * Get sorted waiting queue for a specific doctor or all doctors today
 * Priority 'Emergency' comes first, then by queueSequence / creation
 */
export const getSortedQueueForDoctor = (doctorId, appointments, targetDate = getTodayDateStr()) => {
  const doctorTodayApts = appointments.filter(
    (a) => a.date === targetDate && (!doctorId || a.doctorId === doctorId)
  );

  const currentlyServing = doctorTodayApts.find(
    (a) => a.status === 'In Consultation' || a.status === 'Called'
  );

  const waitingList = doctorTodayApts
    .filter((a) => a.status === 'Waiting' || a.status === 'Booked')
    .sort((a, b) => {
      // Emergency priority always comes first
      if (a.priority === 'Emergency' && b.priority !== 'Emergency') return -1;
      if (b.priority === 'Emergency' && a.priority !== 'Emergency') return 1;
      return (a.queueSequence || 0) - (b.queueSequence || 0);
    });

  const completedList = doctorTodayApts.filter((a) => a.status === 'Completed');
  const skippedList = doctorTodayApts.filter((a) => a.status === 'Skipped');
  const cancelledList = doctorTodayApts.filter((a) => a.status === 'Cancelled');

  return {
    currentlyServing: currentlyServing || null,
    waitingList,
    completedList,
    skippedList,
    cancelledList,
    totalToday: doctorTodayApts.length,
  };
};

/**
 * Calculate dynamic estimated waiting time for a patient appointment
 */
export const calculateEstimatedWaitTime = (appointmentId, appointments, doctors) => {
  const appointment = appointments.find((a) => a.id === appointmentId);
  if (!appointment) return { waitMinutes: 0, patientsAhead: 0, position: 0 };

  if (appointment.status === 'Completed') {
    return { waitMinutes: 0, patientsAhead: 0, position: 0, statusText: 'Completed' };
  }
  if (appointment.status === 'In Consultation') {
    return { waitMinutes: 0, patientsAhead: 0, position: 0, statusText: 'Currently In Consultation' };
  }
  if (appointment.status === 'Called') {
    return { waitMinutes: 0, patientsAhead: 0, position: 0, statusText: 'Now Serving — Please Enter' };
  }
  if (appointment.status === 'Cancelled' || appointment.status === 'Skipped') {
    return { waitMinutes: 0, patientsAhead: 0, position: 0, statusText: appointment.status };
  }

  const doctor = doctors.find((d) => d.id === appointment.doctorId);
  const avgDuration = doctor?.consultationDuration || appointment.consultationDuration || 12;

  const { currentlyServing, waitingList } = getSortedQueueForDoctor(
    appointment.doctorId,
    appointments,
    appointment.date
  );

  const patientIndex = waitingList.findIndex((a) => a.id === appointmentId);
  if (patientIndex === -1) {
    return { waitMinutes: 0, patientsAhead: 0, position: 1, statusText: 'Upcoming' };
  }

  // Position is 1-based index in the waiting line
  const position = patientIndex + 1;
  // Patients ahead = items in front of them in waiting list + 1 if someone is currently in consultation
  const patientsAhead = patientIndex + (currentlyServing ? 1 : 0);
  const waitMinutes = Math.max(1, patientsAhead * avgDuration);

  return {
    waitMinutes,
    patientsAhead,
    position,
    currentlyServingToken: currentlyServing?.tokenNumber || 'None',
    currentlyServingPatient: currentlyServing?.patientName || 'None',
    doctorName: doctor?.name || appointment.doctorName,
    roomNumber: doctor?.roomNumber || appointment.roomNumber || 'Room 101',
  };
};

/**
 * Calculate comprehensive KPI & Analytics dataset dynamically
 */
export const computeAnalytics = (appointments, doctors, departments) => {
  const todayStr = getTodayDateStr();
  const todayApts = appointments.filter((a) => a.date === todayStr);

  const totalAppointments = appointments.length;
  const todayCount = todayApts.length;
  const waitingCount = todayApts.filter((a) => a.status === 'Waiting' || a.status === 'Booked').length;
  const inConsultationCount = todayApts.filter(
    (a) => a.status === 'In Consultation' || a.status === 'Called'
  ).length;
  const completedCount = todayApts.filter((a) => a.status === 'Completed').length;
  const cancelledCount = todayApts.filter((a) => a.status === 'Cancelled').length;
  const emergencyCount = todayApts.filter((a) => a.priority === 'Emergency').length;
  const skippedCount = todayApts.filter((a) => a.status === 'Skipped').length;

  // Rate calculations
  const totalFinishedOrCancelled = completedCount + cancelledCount + skippedCount;
  const completionRate = todayCount > 0 ? Math.round((completedCount / todayCount) * 100) : 0;
  const cancellationRate = todayCount > 0 ? Math.round((cancelledCount / todayCount) * 100) : 0;

  // Average wait time calculation
  const totalWaitTimes = todayApts
    .filter((a) => a.status === 'Waiting')
    .map((a) => {
      const doc = doctors.find((d) => d.id === a.doctorId);
      return doc?.consultationDuration || 12;
    });
  const avgWaitTimeMins =
    totalWaitTimes.length > 0
      ? Math.round((totalWaitTimes.reduce((acc, v) => acc + v, 0) / totalWaitTimes.length) * 1.5)
      : 14;

  // Average consultation duration
  const avgConsultDuration =
    doctors.length > 0
      ? Math.round(doctors.reduce((acc, d) => acc + (d.consultationDuration || 12), 0) / doctors.length)
      : 15;

  // 1. Appointments per day (last 7 days trend)
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
    const count = appointments.filter((a) => a.date === dateKey).length;
    const completedDay = appointments.filter((a) => a.date === dateKey && a.status === 'Completed').length;
    last7Days.push({
      date: dayName,
      dateKey,
      total: count,
      completed: completedDay,
    });
  }

  // 2. Appointments by Department
  const deptDistribution = departments.map((dept) => {
    const count = appointments.filter((a) => a.departmentId === dept.id).length;
    const todayDeptCount = todayApts.filter((a) => a.departmentId === dept.id).length;
    return {
      name: dept.name.split(' ')[0], // Short name for chart label
      fullName: dept.name,
      appointments: count,
      today: todayDeptCount,
      avgWait: dept.avgConsultationTime || 15,
    };
  }).filter(d => d.appointments > 0 || d.today > 0);

  // 3. Queue Status Breakdown (Donut Chart)
  const statusBreakdown = [
    { name: 'Waiting', value: waitingCount, color: '#f59e0b' },
    { name: 'In Consultation', value: inConsultationCount, color: '#0d9488' },
    { name: 'Completed', value: completedCount, color: '#10b981' },
    { name: 'Cancelled', value: cancelledCount, color: '#f43f5e' },
    { name: 'Skipped', value: skippedCount, color: '#94a3b8' },
  ].filter((item) => item.value > 0);

  // 4. Doctor Workload
  const doctorWorkload = doctors.slice(0, 8).map((doc) => {
    const docApts = appointments.filter((a) => a.doctorId === doc.id);
    const todayDocApts = todayApts.filter((a) => a.doctorId === doc.id);
    return {
      name: doc.name.replace('Dr. ', ''),
      fullName: doc.name,
      department: doc.departmentName,
      totalPatients: docApts.length,
      todayPatients: todayDocApts.length,
      rating: doc.rating,
    };
  });

  return {
    kpis: {
      todayCount,
      waitingCount,
      inConsultationCount,
      completedCount,
      cancelledCount,
      emergencyCount,
      skippedCount,
      totalAppointments,
      completionRate,
      cancellationRate,
      avgWaitTimeMins,
      avgConsultDuration,
    },
    charts: {
      appointmentsPerDay: last7Days,
      appointmentsByDepartment: deptDistribution,
      queueStatusDistribution: statusBreakdown,
      doctorWorkload,
    },
  };
};

export const formatTimeDisplay = (timeStr) => {
  if (!timeStr) return '--:--';
  return timeStr;
};

export const formatDateDisplay = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (e) {
    return dateStr;
  }
};
