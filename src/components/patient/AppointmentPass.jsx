import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Stethoscope,
  Radio,
  CheckCircle2,
  ShieldCheck,
  User,
} from 'lucide-react';

export const AppointmentPass = ({
  appointment,
  waitStats = null,
  showActions = true,
  className = '',
}) => {
  if (!appointment) return null;

  return (
    <div
      className={`mq-card p-6 sm:p-7 space-y-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Digital Appointment Pass
          </span>
          <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">
            MediQueue Healthcare
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          Confirmed
        </span>
      </div>

      {/* Main Details */}
      <div className="space-y-4">
        <div>
          <span className="text-xs text-slate-500 block font-medium">Department</span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {appointment.departmentName}
          </h3>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5 flex items-center gap-1.5">
            <Stethoscope className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            {appointment.doctorName} • {appointment.roomNumber || 'Room 02'}
          </p>
        </div>

        {/* 4-Box Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">
              Token
            </span>
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5 block">
              {appointment.tokenNumber}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">
              Date & Slot
            </span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 block">
              {appointment.timeSlot}
            </span>
            <span className="text-[10px] text-slate-400 block">{appointment.date}</span>
          </div>

          <div>
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">
              Position
            </span>
            <span className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-0.5 block">
              #{waitStats?.patientsAhead ? waitStats.patientsAhead + 1 : '01'}
            </span>
            <span className="text-[10px] text-slate-400 block">
              {waitStats?.patientsAhead ? `${waitStats.patientsAhead} ahead` : 'Next up'}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">
              Est. Wait
            </span>
            <span className="text-2xl font-bold font-mono text-teal-700 dark:text-teal-400 mt-0.5 block">
              ~{waitStats?.estimatedWaitMinutes || 18}m
            </span>
            <span className="text-[10px] text-slate-400 block">To Consultation</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      {showActions && (
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Show this pass upon arrival at the hospital reception.</span>
          </div>

          <Link
            to="/queue"
            className="w-full sm:w-auto mq-btn-primary text-xs"
          >
            <Radio className="w-3.5 h-3.5" />
            View Live Queue
          </Link>
        </div>
      )}
    </div>
  );
};
