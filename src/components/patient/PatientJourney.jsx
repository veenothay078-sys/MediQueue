import React from 'react';
import {
  CalendarCheck,
  UserCheck,
  Clock,
  Radio,
  Stethoscope,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const PatientJourney = ({ appointment, waitStats = null, className = '' }) => {
  if (!appointment) return null;

  const status = appointment.status || 'Booked';

  const stages = [
    {
      id: 'booked',
      name: 'Booked',
      label: appointment.timeSlot,
      icon: CalendarCheck,
      isDone: true,
      isCurrent: status === 'Booked',
    },
    {
      id: 'checked_in',
      name: 'Checked In',
      label: 'Arrival Verified',
      icon: UserCheck,
      isDone: status !== 'Booked',
      isCurrent: status === 'Waiting' && !appointment.calledAt,
    },
    {
      id: 'waiting',
      name: 'Waiting',
      label: waitStats?.patientsAhead ? `${waitStats.patientsAhead} ahead` : 'In Queue',
      icon: Clock,
      isDone: status === 'Called' || status === 'In Consultation' || status === 'Completed',
      isCurrent: status === 'Waiting',
    },
    {
      id: 'your_turn',
      name: 'Your Turn',
      label: appointment.roomNumber || 'Room 02',
      icon: Radio,
      isDone: status === 'In Consultation' || status === 'Completed',
      isCurrent: status === 'Called',
    },
    {
      id: 'consultation',
      name: 'Consultation',
      label: appointment.doctorName?.split(' ')[1] || 'Doctor',
      icon: Stethoscope,
      isDone: status === 'Completed',
      isCurrent: status === 'In Consultation',
    },
    {
      id: 'completed',
      name: 'Completed',
      label: 'Care Finished',
      icon: CheckCircle2,
      isDone: status === 'Completed',
      isCurrent: status === 'Completed',
    },
  ];

  return (
    <div className={`mq-card p-5 sm:p-6 space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Care Progress
          </span>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Patient Journey
          </h3>
        </div>
        <span className="text-xs font-medium text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-md border border-teal-100 dark:border-teal-900">
          {appointment.departmentName}
        </span>
      </div>

      {/* Desktop Horizontal Stepper */}
      <div className="hidden md:block relative pt-4 pb-2">
        {/* Track Line */}
        <div className="absolute left-8 right-8 top-8 h-0.5 bg-slate-200 dark:bg-slate-700 -z-0">
          <div
            className="h-full bg-teal-700 dark:bg-teal-500 transition-all duration-500"
            style={{
              width:
                status === 'Completed'
                  ? '100%'
                  : status === 'In Consultation'
                  ? '80%'
                  : status === 'Called'
                  ? '60%'
                  : status === 'Waiting'
                  ? '40%'
                  : '10%',
            }}
          />
        </div>

        <div className="grid grid-cols-6 gap-2 relative z-10">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;

            return (
              <div key={stage.id} className="flex flex-col items-center text-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    stage.isCurrent
                      ? 'bg-teal-700 text-white shadow-sm ring-4 ring-teal-100 dark:ring-teal-950/70'
                      : stage.isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {stage.isDone && !stage.isCurrent ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                <span
                  className={`text-xs font-semibold mt-2.5 ${
                    stage.isCurrent
                      ? 'text-teal-800 dark:text-teal-300 font-bold'
                      : stage.isDone
                      ? 'text-slate-800 dark:text-slate-200'
                      : 'text-slate-400'
                  }`}
                >
                  {stage.name}
                </span>

                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[90px]">
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Vertical Stepper */}
      <div className="md:hidden space-y-3 pt-1">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;

          return (
            <div key={stage.id} className="flex items-start gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  stage.isCurrent
                    ? 'bg-teal-700 text-white ring-2 ring-teal-200 dark:ring-teal-900'
                    : stage.isDone
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {stage.isDone && !stage.isCurrent ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>

              <div className="flex-1 min-w-0 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span
                    className={`text-xs font-semibold block ${
                      stage.isCurrent
                        ? 'text-teal-800 dark:text-teal-300 font-bold'
                        : stage.isDone
                        ? 'text-slate-800 dark:text-slate-200'
                        : 'text-slate-400'
                    }`}
                  >
                    {stage.name}
                  </span>
                  <span className="text-[11px] text-slate-500">{stage.label}</span>
                </div>

                {stage.isCurrent && (
                  <span className="text-[10px] font-bold uppercase bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded">
                    Current
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Message Footer */}
      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse flex-shrink-0" />
        <span>
          {status === 'Waiting' && (
            <>
              You are currently waiting. Estimated time to consultation:{' '}
              <strong>~{waitStats?.estimatedWaitMinutes || 18} minutes</strong>.
            </>
          )}
          {status === 'Called' && (
            <strong className="text-teal-700 dark:text-teal-300">
              It is your turn. Please proceed to {appointment.roomNumber || 'Room 02'}.
            </strong>
          )}
          {status === 'In Consultation' && (
            <>Currently consulting with {appointment.doctorName}.</>
          )}
          {status === 'Completed' && (
            <>Your consultation is complete. Prescription and records are updated.</>
          )}
          {status === 'Booked' && (
            <>Your slot is confirmed for {appointment.date} at {appointment.timeSlot}.</>
          )}
        </span>
      </div>
    </div>
  );
};
