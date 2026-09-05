import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Users,
  Clock,
  ArrowRight,
  ChevronRight,
  HeartPulse,
  Activity,
  Sparkles,
  Stethoscope,
} from 'lucide-react';

export const DepartmentNetwork = ({ onSelectDepartment = null, className = '' }) => {
  const { departments, doctors, appointments } = useApp();
  const navigate = useNavigate();
  const [selectedDeptId, setSelectedDeptId] = useState(departments[0]?.id || 'dept-1');

  // Compute live queue load for each department
  const departmentStats = departments.map((dept) => {
    const deptDoctors = doctors.filter((d) => d.departmentId === dept.id && d.active);
    const deptApts = appointments.filter(
      (a) => a.departmentId === dept.id && (a.status === 'Waiting' || a.status === 'Booked')
    );
    const waitingCount = deptApts.length;
    const avgWaitMins = waitingCount * 12;

    return {
      ...dept,
      doctorsCount: deptDoctors.length,
      waitingCount,
      avgWaitMins,
      isOpen: dept.active,
    };
  });

  const activeDept =
    departmentStats.find((d) => d.id === selectedDeptId) || departmentStats[0];

  const handleDeptClick = (deptId) => {
    setSelectedDeptId(deptId);
    if (onSelectDepartment) {
      onSelectDepartment(deptId);
    }
  };

  return (
    <div className={`journey-card rounded-3xl p-6 sm:p-8 space-y-8 ${className}`}>
      {/* Network Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0B2545] dark:text-[#38BDF8] block">
            Digital Wayfinding • Hospital Map
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
            Clinical Transit Network
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Conceptual route network of hospital wings, active specialist rosters, and live queue loads.
          </p>
        </div>

        <Link
          to="/departments"
          className="text-xs font-bold text-[#0B2545] dark:text-[#38BDF8] hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
        >
          View Full Directory <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Conceptual Transit Map Visualization */}
      <div className="relative p-6 rounded-3xl bg-stone-50/80 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          {departmentStats.map((dept) => {
            const isSelected = selectedDeptId === dept.id;

            return (
              <div
                key={dept.id}
                onClick={() => handleDeptClick(dept.id)}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'bg-white dark:bg-stone-800 border-[#0B2545] dark:border-[#38BDF8] shadow-md transform -translate-y-1'
                    : 'bg-white/60 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="w-3 h-3 rounded-full bg-emerald-600 flex-shrink-0" />
                    <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      ● OPEN
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100 mt-2">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {dept.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Live Queue:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                      {dept.waitingCount} waiting
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Avg Wait:</span>
                    <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                      ~{dept.avgWaitMins || 15} min
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Department Route Inspector */}
      {activeDept && (
        <div className="p-6 rounded-3xl bg-[#0B2545] dark:bg-[#1E3A8A] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Selected Department Waypoint
            </div>
            <h3 className="text-2xl font-black text-white">{activeDept.name}</h3>
            <p className="text-xs text-slate-200 max-w-xl">
              {activeDept.description} • {activeDept.doctorsCount} specialist physician
              {activeDept.doctorsCount === 1 ? '' : 's'} on duty today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <Link
              to={`/book-appointment?deptId=${activeDept.id}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black uppercase tracking-wider shadow-sm transition-all text-center inline-flex items-center justify-center gap-2"
            >
              Book in {activeDept.name}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={`/doctors?department=${activeDept.id}`}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors text-center"
            >
              View Specialists
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
