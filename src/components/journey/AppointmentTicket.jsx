import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Stethoscope,
  Radio,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Compass,
} from 'lucide-react';

export const AppointmentTicket = ({
  appointment,
  waitStats = null,
  showActions = true,
  className = '',
}) => {
  if (!appointment) return null;

  return (
    <div
      className={`journey-card rounded-3xl p-6 sm:p-8 relative overflow-hidden bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 ${className}`}
    >
      {/* Ticket Top Notch & Branding */}
      <div className="flex items-center justify-between pb-4 border-b border-dashed border-stone-300 dark:border-stone-700">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#0B2545] dark:text-[#38BDF8]">
            MEDIQUEUE • DIGITAL TRANSIT PASS
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase bg-[#0B2545] text-white">
          CONFIRMED PASS
        </span>
      </div>

      {/* Main Ticket Body */}
      <div className="py-6 space-y-6">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 block">
            YOUR VISIT
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
            {appointment.departmentName}
          </h3>
          <p className="text-sm font-semibold text-[#0B2545] dark:text-[#38BDF8] mt-0.5">
            {appointment.doctorName} • {appointment.roomNumber || 'Room 101'}
          </p>
        </div>

        {/* Big Monospace Numbers Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
              TOKEN NUMBER
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-black text-slate-900 dark:text-slate-100 mt-0.5">
              {appointment.tokenNumber}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
              DATE & TIME
            </span>
            <div className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 mt-1">
              {appointment.timeSlot}
            </div>
            <span className="text-[10px] text-slate-400 block">{appointment.date}</span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
              QUEUE POSITION
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-black text-amber-600 dark:text-amber-400 mt-0.5">
              #{waitStats?.patientsAhead ? waitStats.patientsAhead + 1 : '01'}
            </div>
            <span className="text-[10px] text-slate-400 block">
              {waitStats?.patientsAhead ? `${waitStats.patientsAhead} ahead` : 'Next up'}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
              ESTIMATED WAIT
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-black text-amber-700 dark:text-amber-400 mt-0.5">
              ~{waitStats?.estimatedWaitMinutes || 18}m
            </div>
            <span className="text-[10px] text-slate-400 block">To Consultation</span>
          </div>
        </div>
      </div>

      {/* Ticket Perforation & Actions */}
      {showActions && (
        <div className="pt-4 border-t border-dashed border-stone-300 dark:border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Present this token upon arrival at the nursing desk.</span>
          </div>

          <Link
            to="/queue"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0B2545] hover:bg-[#13315C] dark:bg-[#1E3A8A] dark:hover:bg-[#2563EB] text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all inline-flex items-center justify-center gap-2"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            View Live Queue Road
          </Link>
        </div>
      )}
    </div>
  );
};
