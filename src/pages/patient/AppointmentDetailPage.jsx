import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatusBadge, PriorityBadge, TokenDisplay } from '../../components/common/StatusBadge';
import { RescheduleModal } from '../../components/patient/RescheduleModal';
import { CancelModal } from '../../components/patient/CancelModal';
import { calculateEstimatedWaitTime, formatDateDisplay } from '../../utils/queueCalculations';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Stethoscope,
  ChevronLeft,
  RotateCw,
  XCircle,
  Radio,
  Printer,
  ShieldCheck,
  Building2,
} from 'lucide-react';

export const AppointmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { appointments, doctors, departments } = useApp();

  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const appointment = appointments.find((a) => a.id === id);

  if (!appointment) {
    return (
      <div className="py-12 text-center space-y-3">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          Appointment Record Not Found
        </h2>
        <p className="text-xs text-slate-400">
          The requested appointment ID does not exist or may have been removed.
        </p>
        <Link to="/appointments" className="text-teal-600 font-bold text-xs underline">
          Return to appointments list
        </Link>
      </div>
    );
  }

  const doctor = doctors.find((d) => d.id === appointment.doctorId);
  const department = departments.find((d) => d.id === appointment.departmentId);
  const waitStats = calculateEstimatedWaitTime(appointment.id, appointments, doctors);

  const isActive =
    appointment.status === 'Waiting' ||
    appointment.status === 'Called' ||
    appointment.status === 'In Consultation' ||
    appointment.status === 'Booked';

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back
      </button>

      {/* Main Digital Pass / Ticket Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-elevated space-y-6">
        {/* Header Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <TokenDisplay tokenNumber={appointment.tokenNumber} size="lg" isLive={isActive} />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Official Digital Pass
              </span>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
                {appointment.departmentName}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <PriorityBadge priority={appointment.priority} />
            <StatusBadge status={appointment.status} size="lg" />
          </div>
        </div>

        {/* Live Wait Pod if active */}
        {isActive && (
          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Radio className="w-5 h-5 text-teal-600 animate-pulse" />
              <div>
                <span className="text-xs font-bold text-teal-900 dark:text-teal-200 block">
                  Live Queue Position: {waitStats.statusText || `#${waitStats.position}`}
                </span>
                <span className="text-[11px] text-teal-700 dark:text-teal-300">
                  Estimated wait: ~{waitStats.waitMinutes} minutes ({waitStats.patientsAhead} ahead)
                </span>
              </div>
            </div>

            <Link
              to="/queue"
              className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-sm hover:bg-teal-700 transition-all"
            >
              Track Live Stream
            </Link>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase text-slate-400 block">
                Assigned Specialist
              </span>
              <span className="text-base font-bold text-slate-900 dark:text-slate-100 block">
                {appointment.doctorName}
              </span>
              <span className="text-xs text-slate-500">{doctor?.specialty}</span>
            </div>

            <div>
              <span className="text-xs font-bold uppercase text-slate-400 block">
                Room Location
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
                {appointment.roomNumber || 'Room 101'}
              </span>
              <span className="text-xs text-slate-500">{department?.roomNumber}</span>
            </div>

            <div>
              <span className="text-xs font-bold uppercase text-slate-400 block">
                Consultation Reason
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300 italic">
                "{appointment.reason || 'General Consultation'}"
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase text-slate-400 block">
                Consultation Date & Slot
              </span>
              <span className="text-base font-bold text-slate-900 dark:text-slate-100 block">
                {formatDateDisplay(appointment.date)}
              </span>
              <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                {appointment.timeSlot}
              </span>
            </div>

            <div>
              <span className="text-xs font-bold uppercase text-slate-400 block">
                Patient Details
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
                {appointment.patientName}
              </span>
              <span className="text-xs text-slate-500 block">{appointment.patientPhone}</span>
              <span className="text-xs text-slate-500 block">{appointment.patientEmail}</span>
            </div>

            <div>
              <span className="text-xs font-bold uppercase text-slate-400 block">
                Token Creation Time
              </span>
              <span className="text-xs text-slate-500">
                {new Date(appointment.createdAt || Date.now()).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Print Pass
          </button>

          {isActive && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRescheduleOpen(true)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" /> Reschedule
              </button>
              <button
                onClick={() => setIsCancelOpen(true)}
                className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" /> Cancel Pass
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <RescheduleModal
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        appointment={appointment}
      />
      <CancelModal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        appointment={appointment}
      />
    </div>
  );
};
