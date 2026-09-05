import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PatientJourney } from '../../components/patient/PatientJourney';
import { QueueProgress } from '../../components/patient/QueueProgress';
import { AppointmentPass } from '../../components/patient/AppointmentPass';
import { PreVisitChecklist } from '../../components/patient/PreVisitChecklist';
import { RescheduleModal } from '../../components/patient/RescheduleModal';
import { CancelModal } from '../../components/patient/CancelModal';
import { getTodayDateStr } from '../../data/initialData';
import {
  calculateEstimatedWaitTime,
  getSortedQueueForDoctor,
  formatDateDisplay,
} from '../../utils/queueCalculations';
import {
  Calendar,
  Clock,
  Radio,
  CheckCircle2,
  Bell,
  Stethoscope,
  Building2,
  ArrowRight,
  PlusCircle,
  Users,
  MapPin,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const PatientDashboard = () => {
  const { appointments, doctors, departments, notifications, patientProfile } = useApp();
  const navigate = useNavigate();

  const [rescheduleApt, setRescheduleApt] = useState(null);
  const [cancelApt, setCancelApt] = useState(null);

  const todayStr = getTodayDateStr();

  // Filter patient appointments
  const myAppointments = appointments.filter(
    (a) =>
      a.patientEmail === patientProfile.email || a.patientName === patientProfile.name
  );

  const todayActiveApt = myAppointments.find(
    (a) => a.date === todayStr && a.status !== 'Cancelled'
  );

  const upcomingApts = myAppointments.filter(
    (a) =>
      (a.date >= todayStr || a.status === 'Booked' || a.status === 'Waiting') &&
      a.status !== 'Completed' &&
      a.status !== 'Cancelled'
  );

  // Queue stats for patient's doctor today
  const activeDoctor =
    doctors.find((d) => d.id === todayActiveApt?.doctorId) || doctors[0];
  const { currentlyServing, waitingList, completedList } = getSortedQueueForDoctor(
    activeDoctor?.id,
    appointments,
    todayStr
  );

  const waitStats = todayActiveApt
    ? calculateEstimatedWaitTime(todayActiveApt.id, appointments, doctors)
    : null;

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto animate-fade-in">
      {/* ── 1. PATIENT GREETING ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Good morning, {patientProfile.name ? patientProfile.name.split(' ')[0] : 'Arjun'}.
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here's what's happening with your care today.
          </p>
        </div>

        <Link
          to="/book-appointment"
          className="mq-btn-primary self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> Book Appointment
        </Link>
      </div>

      {/* ── 2. TODAY'S APPOINTMENT PRIORITY SECTION ── */}
      {todayActiveApt ? (
        <div className="mq-card p-6 sm:p-8 space-y-6 border-l-4 border-l-teal-700 bg-white dark:bg-slate-900">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block">
                Today's Appointment
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {todayActiveApt.doctorName}
              </h2>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {todayActiveApt.departmentName} • {todayActiveApt.roomNumber || 'Consultation Room 02'}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="px-3 py-1 rounded-md text-xs font-bold uppercase bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                {todayActiveApt.status}
              </span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md">
                {todayActiveApt.timeSlot}
              </span>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs text-slate-500 uppercase font-semibold block">
                Token
              </span>
              <span className="text-3xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1 block">
                {todayActiveApt.tokenNumber}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-500 uppercase font-semibold block">
                Status
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-2 block">
                {todayActiveApt.status}
              </span>
              <span className="text-[11px] text-slate-400 block">{todayActiveApt.timeSlot}</span>
            </div>

            <div>
              <span className="text-xs text-slate-500 uppercase font-semibold block">
                People Ahead
              </span>
              <span className="text-3xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1 block">
                {waitStats?.patientsAhead || 0}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-500 uppercase font-semibold block">
                Estimated Wait
              </span>
              <span className="text-3xl font-bold font-mono text-teal-700 dark:text-teal-400 mt-1 block">
                ~{waitStats?.estimatedWaitMinutes || 18}m
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Please arrive 10 minutes prior to your scheduled slot.
            </span>
            <Link
              to="/queue"
              className="mq-btn-primary text-xs"
            >
              <Radio className="w-4 h-4" /> View Live Queue
            </Link>
          </div>
        </div>
      ) : (
        <div className="mq-card p-8 sm:p-10 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-teal-700 dark:text-teal-400 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            No Active Appointments Today
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            You don't have an appointment scheduled for today. Book a consultation with our qualified specialists anytime.
          </p>
          <div className="pt-2">
            <Link to="/book-appointment" className="mq-btn-primary text-xs">
              <PlusCircle className="w-4 h-4" /> Book Appointment
            </Link>
          </div>
        </div>
      )}

      {/* ── 3. SIGNATURE PATIENT JOURNEY COMPONENT ── */}
      {todayActiveApt && (
        <PatientJourney appointment={todayActiveApt} waitStats={waitStats} />
      )}

      {/* ── 4. QUICK SHORTCUTS & UPCOMING VISITS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PreVisitChecklist />

        {/* Quick Navigation Directory */}
        <div className="mq-card p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Quick Shortcuts
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Browse specialist doctors, hospital departments, or review past consultation history.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Link
              to="/doctors"
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-600 transition-all flex flex-col justify-between"
            >
              <Stethoscope className="w-5 h-5 text-teal-700 dark:text-teal-400" />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block mt-2">
                  Specialist Doctors
                </span>
                <span className="text-[11px] text-slate-400">View roster & slots</span>
              </div>
            </Link>

            <Link
              to="/departments"
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-600 transition-all flex flex-col justify-between"
            >
              <Building2 className="w-5 h-5 text-teal-700 dark:text-teal-400" />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block mt-2">
                  Departments
                </span>
                <span className="text-[11px] text-slate-400">Clinical divisions</span>
              </div>
            </Link>

            <Link
              to="/appointments"
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-600 transition-all flex flex-col justify-between"
            >
              <Calendar className="w-5 h-5 text-teal-700 dark:text-teal-400" />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block mt-2">
                  All Appointments
                </span>
                <span className="text-[11px] text-slate-400">Reschedule & manage</span>
              </div>
            </Link>

            <Link
              to="/history"
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-600 transition-all flex flex-col justify-between"
            >
              <CheckCircle2 className="w-5 h-5 text-teal-700 dark:text-teal-400" />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block mt-2">
                  Visit History
                </span>
                <span className="text-[11px] text-slate-400">Completed records</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
