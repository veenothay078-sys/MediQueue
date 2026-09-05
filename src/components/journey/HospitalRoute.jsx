import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  HeartPulse,
  UserCheck,
  ChevronRight,
  ArrowRight,
  Sparkles,
  MapPin,
  Compass,
} from 'lucide-react';

export const HospitalRoute = ({
  appointment,
  waitStats = null,
  compact = false,
  className = '',
}) => {
  if (!appointment) {
    return (
      <div className={`journey-card rounded-3xl p-6 sm:p-8 text-center space-y-3 ${className}`}>
        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 flex items-center justify-center mx-auto">
          <Compass className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
          No Active Hospital Journey
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Your hospital journey timeline will activate once an appointment is scheduled.
        </p>
      </div>
    );
  }

  const status = appointment.status || 'Booked';

  // 6 Journey Waypoints
  const waypoints = [
    {
      id: 'booked',
      name: 'Booked',
      label: 'Visit Scheduled',
      time: appointment.timeSlot,
      isComplete: true,
      isActive: status === 'Booked',
    },
    {
      id: 'checkin',
      name: 'Check-In',
      label: 'Arrived at Wing',
      time: 'Verified',
      isComplete: status !== 'Booked',
      isActive: false,
    },
    {
      id: 'waiting',
      name: 'Waiting',
      label: 'Lounge Queue',
      time: waitStats?.patientsAhead ? `${waitStats.patientsAhead} ahead` : 'In Line',
      isComplete: status === 'Called' || status === 'In Consultation' || status === 'Completed',
      isActive: status === 'Waiting' || status === 'Booked',
    },
    {
      id: 'called',
      name: 'Called',
      label: 'Proceed to Room',
      time: appointment.roomNumber || 'Room 101',
      isComplete: status === 'In Consultation' || status === 'Completed',
      isActive: status === 'Called',
    },
    {
      id: 'doctor',
      name: 'Doctor',
      label: 'Consultation',
      time: appointment.doctorName?.split(' ')[1] || 'Physician',
      isComplete: status === 'Completed',
      isActive: status === 'In Consultation',
    },
    {
      id: 'completed',
      name: 'Completed',
      label: 'Visit Finished',
      time: 'Pharmacy / Exit',
      isComplete: status === 'Completed',
      isActive: status === 'Completed',
    },
  ];

  return (
    <div className={`journey-card rounded-3xl p-6 sm:p-8 space-y-6 ${className}`}>
      {/* Route Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0B2545] dark:text-[#38BDF8] block">
            Digital Wayfinding • Route #{appointment.tokenNumber}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
            Your Journey Map
          </h2>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
            {appointment.departmentName}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#0B2545] text-white">
            {appointment.roomNumber}
          </span>
        </div>
      </div>

      {/* Transit Route Visualization */}
      <div className="relative py-4">
        {/* Continuous Journey Track */}
        <div className="hidden md:block absolute left-8 right-8 top-10 h-2 bg-stone-200 dark:bg-stone-800 rounded-full -z-0">
          <div
            className="h-full bg-gradient-to-r from-[#0B2545] via-[#046A38] to-[#D97706] rounded-full transition-all duration-700"
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
                  : '20%',
            }}
          />
        </div>

        {/* Waypoint Stops */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 relative z-10">
          {waypoints.map((wp, idx) => {
            return (
              <div
                key={wp.id}
                className={`flex flex-col items-center text-center p-3 rounded-2xl transition-all ${
                  wp.isActive
                    ? 'bg-amber-50/90 dark:bg-amber-950/40 border-2 border-amber-600 dark:border-amber-400 shadow-sm'
                    : 'bg-transparent'
                }`}
              >
                {/* Station Node Badge */}
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition-all mb-2.5 ${
                    wp.isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md route-node-active font-black'
                      : wp.isComplete
                      ? 'bg-[#046A38] text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-200 dark:border-stone-700'
                  }`}
                >
                  {wp.isComplete && !wp.isActive ? (
                    '✓'
                  ) : wp.isActive ? (
                    <span className="w-3 h-3 rounded-full bg-slate-950 animate-ping" />
                  ) : (
                    `0${idx + 1}`
                  )}
                </div>

                <div className="space-y-0.5">
                  <span
                    className={`text-xs font-black block tracking-tight ${
                      wp.isActive
                        ? 'text-amber-900 dark:text-amber-200'
                        : wp.isComplete
                        ? 'text-slate-800 dark:text-slate-200'
                        : 'text-slate-400'
                    }`}
                  >
                    {wp.name}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate max-w-[100px]">
                    {wp.label}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-semibold block pt-0.5 ${
                      wp.isActive
                        ? 'text-amber-700 dark:text-amber-300 font-bold'
                        : 'text-slate-400'
                    }`}
                  >
                    {wp.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Immediate Waypoint Guidance Strip */}
      <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {status === 'Waiting' && (
              <>
                You are currently in the waiting lounge. Estimated time to consultation:{' '}
                <strong>~{waitStats?.estimatedWaitMinutes || 18} minutes</strong>.
              </>
            )}
            {status === 'Called' && (
              <strong className="text-amber-700 dark:text-amber-300">
                It's your turn! Please make your way directly to {appointment.roomNumber}.
              </strong>
            )}
            {status === 'In Consultation' && (
              <>Consultation in progress with {appointment.doctorName}.</>
            )}
            {status === 'Completed' && (
              <>Your visit is complete. Summary and prescriptions are ready.</>
            )}
            {status === 'Booked' && (
              <>Your slot is confirmed for {appointment.date} at {appointment.timeSlot}.</>
            )}
          </span>
        </div>

        <div className="font-mono text-slate-500 font-bold flex-shrink-0">
          Dr. {appointment.doctorName?.split(' ')[1] || 'Physician'} • {appointment.roomNumber}
        </div>
      </div>
    </div>
  );
};
