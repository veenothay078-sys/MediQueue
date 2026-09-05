import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StatusBadge, PriorityBadge, TokenDisplay } from '../common/StatusBadge';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Stethoscope,
  ChevronRight,
  RotateCw,
  XCircle,
  Eye,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import { formatDateDisplay } from '../../utils/queueCalculations';

export const AppointmentCard = ({
  appointment,
  onCancelClick,
  onRescheduleClick,
  isDetail = false,
}) => {
  const navigate = useNavigate();

  const isCompleted = appointment.status === 'Completed';
  const isCancelled = appointment.status === 'Cancelled';
  const isActiveOrWaiting =
    appointment.status === 'Waiting' ||
    appointment.status === 'Called' ||
    appointment.status === 'In Consultation' ||
    appointment.status === 'Booked';

  return (
    <div className="journey-card rounded-2xl p-5 sm:p-6 transition-all hover:border-stone-300 dark:hover:border-stone-700">
      {/* Top Header: Token + Statuses */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-3">
          <TokenDisplay
            tokenNumber={appointment.tokenNumber}
            size="md"
            isLive={appointment.status === 'In Consultation' || appointment.status === 'Called'}
          />
          <div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono font-bold block">
              Department Waypoint
            </span>
            <span className="text-sm font-black text-slate-900 dark:text-slate-100">
              {appointment.departmentName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <PriorityBadge priority={appointment.priority} />
          <StatusBadge status={appointment.status} size="md" />
        </div>
      </div>

      {/* Main Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-200 font-bold">
            <Stethoscope className="w-4 h-4 text-teal-700 dark:text-teal-400 flex-shrink-0" />
            <span className="truncate">{appointment.doctorName}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span>Consultation: {appointment.roomNumber || 'Room 101'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span>Patient: {appointment.patientName}</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
            <Calendar className="w-4 h-4 text-teal-700 dark:text-teal-400 flex-shrink-0" />
            <span>{formatDateDisplay(appointment.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <Clock className="w-4 h-4 text-teal-700 dark:text-teal-400 flex-shrink-0" />
            <span>Slot: {appointment.timeSlot}</span>
          </div>
          {appointment.reason && (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic line-clamp-1">
              "{appointment.reason}"
            </p>
          )}
        </div>
      </div>

      {/* If Completed: Completed Journey Waypoints */}
      {isCompleted && (
        <div className="mt-3 p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block mb-1.5">
            Completed Journey Route
          </span>
          <div className="flex items-center gap-2 text-xs text-emerald-900 dark:text-emerald-200 flex-wrap">
            <span className="flex items-center gap-1 font-semibold">● Booked</span>
            <span className="text-emerald-400">➔</span>
            <span className="flex items-center gap-1 font-semibold">● Checked In</span>
            <span className="text-emerald-400">➔</span>
            <span className="flex items-center gap-1 font-semibold">● Consulted</span>
            <span className="text-emerald-400">➔</span>
            <span className="flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-300">
              ✓ Completed
            </span>
          </div>
        </div>
      )}

      {/* Action Strip */}
      <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {!isDetail && (
            <Link
              to={`/appointments/${appointment.id}`}
              className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-slate-700 dark:text-slate-300 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" /> Details
            </Link>
          )}

          {isActiveOrWaiting && (
            <Link
              to="/queue"
              className="px-3.5 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" /> Track Queue
            </Link>
          )}
        </div>

        {/* Reschedule / Cancel for active */}
        {isActiveOrWaiting && !isCompleted && !isCancelled && (
          <div className="flex items-center gap-2">
            {onRescheduleClick && (
              <button
                onClick={() => onRescheduleClick(appointment)}
                className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline inline-flex items-center gap-1"
              >
                <RotateCw className="w-3 h-3" /> Reschedule
              </button>
            )}
            {onCancelClick && (
              <button
                onClick={() => onCancelClick(appointment)}
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline inline-flex items-center gap-1"
              >
                <XCircle className="w-3 h-3" /> Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
