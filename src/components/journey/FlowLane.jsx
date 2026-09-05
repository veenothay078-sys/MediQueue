import React from 'react';
import {
  UserCheck,
  CheckCircle2,
  SkipForward,
  AlertTriangle,
  Clock,
  Radio,
  X,
  Volume2,
  Stethoscope,
} from 'lucide-react';
import { announceTokenVoice } from '../../utils/audioAnnouncer';

export const FlowLane = ({
  department,
  appointments = [],
  onSelectPatient = null,
  selectedPatientId = null,
}) => {
  // Group appointments by status
  const checkedInList = appointments.filter((a) => a.status === 'Booked');
  const waitingList = appointments.filter((a) => a.status === 'Waiting');
  const consultingList = appointments.filter(
    (a) => a.status === 'In Consultation' || a.status === 'Called'
  );
  const completedList = appointments.filter((a) => a.status === 'Completed');

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
      {/* Department Lane Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-[#0B2545] dark:bg-[#38BDF8]" />
          <h3 className="text-base font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {department.name}
          </h3>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-bold">
            {department.code}
          </span>
        </div>

        <div className="text-xs font-mono text-slate-500">
          Total: <strong>{appointments.length}</strong> visits today
        </div>
      </div>

      {/* 4 Waypoint Stages as Horizontal Transit Lanes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
        {/* Stage 1: Check-In */}
        <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/70 dark:border-stone-700/70 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-500 uppercase">
            <span>Check-In</span>
            <span className="text-slate-700 dark:text-slate-300">({checkedInList.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center">
            {checkedInList.length === 0 ? (
              <span className="text-[10px] text-slate-400 italic">None</span>
            ) : (
              checkedInList.map((apt) => (
                <button
                  key={apt.id}
                  onClick={() => onSelectPatient && onSelectPatient(apt)}
                  className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    selectedPatientId === apt.id
                      ? 'bg-[#0B2545] text-white shadow-sm'
                      : 'bg-white dark:bg-stone-700 text-slate-700 dark:text-slate-200 border border-stone-200 hover:border-[#0B2545]'
                  }`}
                  title={`${apt.tokenNumber}: ${apt.patientName}`}
                >
                  ● {apt.tokenNumber}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Stage 2: Waiting Lounge */}
        <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/50 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-amber-700 dark:text-amber-400 uppercase">
            <span>Waiting</span>
            <span>({waitingList.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center">
            {waitingList.length === 0 ? (
              <span className="text-[10px] text-slate-400 italic">Clear</span>
            ) : (
              waitingList.map((apt) => (
                <button
                  key={apt.id}
                  onClick={() => onSelectPatient && onSelectPatient(apt)}
                  className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    selectedPatientId === apt.id
                      ? 'bg-amber-600 text-white shadow-sm'
                      : apt.priority === 'Emergency'
                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300'
                      : 'bg-white dark:bg-stone-700 text-amber-900 dark:text-amber-200 border border-amber-200 hover:border-amber-500'
                  }`}
                  title={`${apt.tokenNumber}: ${apt.patientName}`}
                >
                  ● {apt.tokenNumber}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Stage 3: In Consultation */}
        <div className="p-3 rounded-xl bg-sky-50/60 dark:bg-sky-950/20 border border-sky-200/70 dark:border-sky-900/50 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-sky-700 dark:text-sky-400 uppercase">
            <span>Consulting</span>
            <span>({consultingList.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center">
            {consultingList.length === 0 ? (
              <span className="text-[10px] text-slate-400 italic">No room active</span>
            ) : (
              consultingList.map((apt) => (
                <button
                  key={apt.id}
                  onClick={() => onSelectPatient && onSelectPatient(apt)}
                  className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    selectedPatientId === apt.id
                      ? 'bg-[#0B2545] text-white shadow-sm'
                      : 'bg-[#0B2545] text-white animate-pulse shadow-sm'
                  }`}
                  title={`${apt.tokenNumber}: ${apt.patientName} with ${apt.doctorName}`}
                >
                  ◉ {apt.tokenNumber}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Stage 4: Completed */}
        <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/50 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase">
            <span>Completed</span>
            <span>({completedList.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center">
            {completedList.length === 0 ? (
              <span className="text-[10px] text-slate-400 italic">0 Finished</span>
            ) : (
              completedList.slice(0, 5).map((apt) => (
                <button
                  key={apt.id}
                  onClick={() => onSelectPatient && onSelectPatient(apt)}
                  className="px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-stone-100 dark:bg-stone-800 text-slate-500 opacity-80"
                  title={`${apt.tokenNumber}: ${apt.patientName}`}
                >
                  ✓ {apt.tokenNumber}
                </button>
              ))
            )}
            {completedList.length > 5 && (
              <span className="text-[10px] text-slate-400 font-mono">
                +{completedList.length - 5}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
