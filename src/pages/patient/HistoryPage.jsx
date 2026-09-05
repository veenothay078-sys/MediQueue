import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, PriorityBadge, TokenDisplay } from '../../components/common/StatusBadge';
import { formatDateDisplay } from '../../utils/queueCalculations';
import {
  History,
  Search,
  Calendar,
  Stethoscope,
  Building2,
  CheckCircle2,
  ArrowRight,
  Clock,
  Compass,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const HistoryPage = () => {
  const { appointments, patientProfile } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  const historyAppointments = useMemo(() => {
    return appointments
      .filter(
        (a) =>
          (a.patientEmail === patientProfile.email || a.patientName === patientProfile.name) &&
          (a.status === 'Completed' || a.status === 'Cancelled' || a.status === 'Skipped')
      )
      .filter((apt) => {
        if (selectedDept && apt.departmentId !== selectedDept) return false;
        if (searchTerm) {
          const q = searchTerm.toLowerCase();
          const matchesDoc = apt.doctorName?.toLowerCase().includes(q);
          const matchesToken = apt.tokenNumber?.toLowerCase().includes(q);
          const matchesDept = apt.departmentName?.toLowerCase().includes(q);
          if (!matchesDoc && !matchesToken && !matchesDept) return false;
        }
        return true;
      });
  }, [appointments, patientProfile, selectedDept, searchTerm]);

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Compass className="w-3.5 h-3.5" />
            Digital Wayfinding • Completed Records
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Completed Hospital Journeys
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Explore your historical visits visualized as full journey waypoint routes.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="journey-card rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search past journeys by doctor or token..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-teal-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Visual Journey History Grid */}
      {historyAppointments.length === 0 ? (
        <div className="journey-card rounded-3xl p-12 text-center text-slate-400 text-xs sm:text-sm space-y-2">
          <CheckCircle2 className="w-8 h-8 mx-auto text-teal-600" />
          <p className="font-bold text-slate-800 dark:text-slate-200">
            No completed journeys recorded yet.
          </p>
          <p className="text-xs text-slate-400">
            Once a consultation is marked complete, its full waypoint timeline will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {historyAppointments.map((apt) => (
            <div
              key={apt.id}
              className="journey-card rounded-3xl p-6 space-y-5 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                      {apt.date} • {apt.timeSlot}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mt-0.5">
                      {apt.departmentName}
                    </h3>
                  </div>
                  <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-slate-800 dark:text-slate-200">
                    {apt.tokenNumber}
                  </span>
                </div>

                <div className="py-2 text-xs text-slate-600 dark:text-slate-400">
                  Consultation with <strong>{apt.doctorName}</strong> ({apt.roomNumber || 'Room 101'})
                </div>

                {/* The Completed Waypoint Route */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-700/80 space-y-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-teal-700 dark:text-teal-400 block">
                    JOURNEY ROUTE RECORD
                  </span>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        ● Booked Online
                      </span>
                    </div>
                    <div className="h-2 w-0.5 bg-stone-300 dark:bg-stone-700 ml-1" />
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        ● Checked In at Wing
                      </span>
                    </div>
                    <div className="h-2 w-0.5 bg-stone-300 dark:bg-stone-700 ml-1" />
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        ● Consulted Physician
                      </span>
                    </div>
                    <div className="h-2 w-0.5 bg-stone-300 dark:bg-stone-700 ml-1" />
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">
                        Completed & Prescribed
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <StatusBadge status={apt.status} size="sm" />
                <Link
                  to={`/appointments/${apt.id}`}
                  className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline inline-flex items-center gap-1"
                >
                  View Pass Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
