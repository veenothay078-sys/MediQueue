import React from 'react';
import {
  Stethoscope,
  Clock,
  Users,
  ChevronRight,
  ArrowRight,
  Sparkles,
  MapPin,
  Volume2,
  Flame,
} from 'lucide-react';
import { announceTokenVoice } from '../../utils/audioAnnouncer';

export const QueueRoad = ({
  doctor,
  currentlyServing,
  waitingList = [],
  completedList = [],
  userAppointment = null,
  onCallAudio = true,
}) => {
  const avgConsultTime = doctor?.consultationDuration || 12;
  const roomNumber = doctor?.roomNumber || 'Room 101';

  // Find user's index in the queue
  const userQueueIndex = userAppointment
    ? waitingList.findIndex((a) => a.id === userAppointment.id)
    : -1;

  const userIsInQueue = userQueueIndex !== -1;
  const userIsCurrentlyServing =
    userAppointment && currentlyServing && userAppointment.id === currentlyServing.id;

  const patientsAhead = userIsInQueue
    ? userQueueIndex + (currentlyServing ? 1 : 0)
    : 0;

  const estimatedWait = userIsInQueue
    ? Math.max(1, patientsAhead * avgConsultTime)
    : 0;

  return (
    <div className="journey-card rounded-3xl p-6 sm:p-8 space-y-8">
      {/* Station Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0B2545] dark:text-[#38BDF8] block">
            Digital Wayfinding • Queue Line Station
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
            Queue Road to {doctor?.name || 'Doctor'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {doctor?.departmentName || 'General Medicine'} • {roomNumber} • Avg consult ~{avgConsultTime} min
          </p>
        </div>

        {/* Dynamic Metric Display */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-center">
            <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
              People Ahead
            </span>
            <span className="text-lg font-mono font-black text-slate-900 dark:text-slate-100">
              {userIsInQueue ? `${patientsAhead}` : `${waitingList.length} waiting`}
            </span>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-center">
            <span className="text-[10px] font-mono uppercase text-amber-700 dark:text-amber-400 block font-bold">
              Est. Wait Time
            </span>
            <span className="text-lg font-mono font-black text-amber-800 dark:text-amber-300">
              ~{estimatedWait || waitingList.length * avgConsultTime || 12} min
            </span>
          </div>
        </div>
      </div>

      {/* Destination: Doctor Consultation Room Waypoint */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0B2545] dark:bg-[#1E3A8A] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300 flex-shrink-0">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-300">
                Destination Waypoint
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h3 className="text-base font-black text-white">{doctor?.name}</h3>
            <p className="text-xs text-slate-200 font-medium">
              Consultation Room: <strong>{roomNumber}</strong>
            </p>
          </div>
        </div>

        {currentlyServing && (
          <div className="flex items-center gap-3 bg-black/20 px-4 py-2.5 rounded-xl border border-white/10 self-stretch sm:self-auto justify-between sm:justify-start">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 block">
                Now Inside Room
              </span>
              <span className="text-base font-mono font-black text-white">
                {currentlyServing.tokenNumber} ({currentlyServing.patientName})
              </span>
            </div>
            {onCallAudio && (
              <button
                onClick={() =>
                  announceTokenVoice(
                    currentlyServing.tokenNumber,
                    currentlyServing.patientName,
                    roomNumber
                  )
                }
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Hear Hospital Audio PA Announcement"
              >
                <Volume2 className="w-4 h-4 text-amber-300" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* The Visual Queue Road */}
      <div className="space-y-3 relative py-2">
        <div className="space-y-3">
          {/* 1. Currently Serving Road Node */}
          {currentlyServing && (
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 transition-all">
              <span className="w-7 h-7 rounded-xl bg-[#046A38] text-white font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                ●
              </span>
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-black text-emerald-900 dark:text-emerald-200">
                    {currentlyServing.tokenNumber}
                  </span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {currentlyServing.patientName}
                  </span>
                  {userIsCurrentlyServing && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#046A38] text-white">
                      YOU ARE HERE
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                  NOW SERVING IN {roomNumber}
                </span>
              </div>
              <div className="h-0.5 flex-1 max-w-[120px] bg-emerald-300 dark:bg-emerald-700 hidden md:block" />
              <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 hidden sm:inline">
                In Progress ➔
              </span>
            </div>
          )}

          {/* 2. Waiting List Tokens (Queue Road Segments) */}
          {waitingList.length === 0 && !currentlyServing ? (
            <div className="p-8 text-center rounded-2xl border-2 border-dashed border-stone-200 dark:border-stone-800 text-slate-400 text-xs">
              The queue road is currently clear. No patients waiting.
            </div>
          ) : (
            waitingList.map((apt, idx) => {
              const isUser = userAppointment && userAppointment.id === apt.id;
              const isNext = idx === 0;

              return (
                <div
                  key={apt.id}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                    isUser
                      ? 'bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-600 dark:border-amber-400 shadow-md route-node-active'
                      : isNext
                      ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
                      : 'bg-stone-50/80 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-xl font-mono text-xs font-black flex items-center justify-center flex-shrink-0 ${
                      isUser
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : isNext
                        ? 'bg-[#0B2545] text-white'
                        : 'bg-stone-200 dark:bg-stone-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    #{idx + 1}
                  </span>

                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm font-black text-slate-900 dark:text-slate-100">
                        {apt.tokenNumber}
                      </span>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate">
                        {apt.patientName}
                      </span>
                      {isUser && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-600 text-white">
                          YOU
                        </span>
                      )}
                      {apt.priority === 'Emergency' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300">
                          Priority
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-400">
                        ~{(idx + 1) * avgConsultTime} min wait
                      </span>
                      {isNext && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                          Next in Line
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Visual Route Road Extension */}
                  <div className="h-0.5 w-12 bg-stone-200 dark:bg-stone-700 hidden lg:block" />
                  <span className="text-stone-400 text-xs hidden sm:inline">●</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Road Summary Footer */}
      <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {userIsInQueue ? (
              <>
                You are position <strong>#{patientsAhead + 1}</strong> in line ({patientsAhead} patient{patientsAhead === 1 ? '' : 's'} ahead of you).
              </>
            ) : (
              <>Total {waitingList.length} patient{waitingList.length === 1 ? '' : 's'} in line for {doctor?.name}.</>
            )}
          </span>
        </div>

        <span className="font-mono text-slate-500">
          Average consultation duration: {avgConsultTime} min / patient
        </span>
      </div>
    </div>
  );
};
