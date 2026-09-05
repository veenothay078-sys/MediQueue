import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Radio,
  Stethoscope,
  HeartHandshake,
  Check,
  Sparkles,
} from 'lucide-react';

export const PatientTokenJourney = ({ status, tokenNumber, roomNumber }) => {
  const stages = [
    { id: 'booked', label: 'Booked', desc: 'Slot confirmed', icon: Calendar },
    { id: 'waiting', label: 'In Waiting Lounge', desc: 'Token queued', icon: Clock },
    { id: 'called', label: 'Called to Room', desc: `Proceed to ${roomNumber || 'Room 101'}`, icon: Radio },
    { id: 'in_consultation', label: 'In Consultation', desc: 'Meeting Specialist', icon: Stethoscope },
    { id: 'completed', label: 'Completed', desc: 'Visit summary ready', icon: CheckCircle2 },
  ];

  const getStageIndex = (currentStatus) => {
    switch (currentStatus) {
      case 'Booked':
        return 0;
      case 'Waiting':
        return 1;
      case 'Called':
        return 2;
      case 'In Consultation':
        return 3;
      case 'Completed':
        return 4;
      case 'Cancelled':
      case 'Skipped':
        return 1;
      default:
        return 1;
    }
  };

  const activeIndex = getStageIndex(status);

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 block">
            Live Token Journey
          </span>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Consultation Flow Stage: <span className="text-teal-600 dark:text-teal-400 font-mono font-black">{tokenNumber}</span>
          </h3>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
          Stage {activeIndex + 1} of 5
        </span>
      </div>

      {/* Stepper Timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
        {stages.map((stage, idx) => {
          const isPassed = idx < activeIndex;
          const isCurrent = idx === activeIndex;
          const isPending = idx > activeIndex;
          const Icon = stage.icon;

          return (
            <div
              key={stage.id}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                isCurrent
                  ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 shadow-md ring-2 ring-teal-500/20'
                  : isPassed
                  ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20'
                  : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                    isCurrent
                      ? 'bg-teal-600 text-white animate-pulse'
                      : isPassed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {isPassed ? <Check className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                <span className="text-[10px] font-mono text-slate-400 font-bold">0{idx + 1}</span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                  {stage.label}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  {stage.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
