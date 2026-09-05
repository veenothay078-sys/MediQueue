import React, { useState } from 'react';
import { TokenDisplay, StatusBadge, PriorityBadge } from '../common/StatusBadge';
import {
  Stethoscope,
  Clock,
  Users,
  Radio,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Info,
  MapPin,
  Flame,
} from 'lucide-react';

export const QueueOrbit = ({
  doctor,
  currentlyServing,
  waitingList = [],
  completedList = [],
  userAppointment = null,
  onNodeClick = null,
}) => {
  const [hoveredNode, setHoveredNode] = useState(null);

  const avgConsultTime = doctor?.consultationDuration || 12;
  const roomNumber = doctor?.roomNumber || 'Room 101';

  // Find user's index in the waiting line
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

  // Build sequential orbital node array
  // Nodes: [Completed (if any), Currently Serving, Waiting 1, Waiting 2, Waiting 3, Waiting 4 / User, Waiting 5...]
  const displayNodes = [];

  if (currentlyServing) {
    displayNodes.push({
      ...currentlyServing,
      nodeType: 'serving',
      label: 'Now Serving',
      isUser: userAppointment?.id === currentlyServing.id,
    });
  }

  waitingList.slice(0, 6).forEach((apt, idx) => {
    displayNodes.push({
      ...apt,
      nodeType: 'waiting',
      queuePos: idx + 1,
      isUser: userAppointment?.id === apt.id,
    });
  });

  return (
    <div className="command-surface rounded-3xl p-6 sm:p-8 space-y-8 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-cyan-400">
              Live Queue Orbit
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-100 dark:text-white tracking-tight mt-0.5">
            {doctor?.name || 'Assigned Specialist'}
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            {doctor?.departmentName || 'Clinical Division'} • {roomNumber}
          </p>
        </div>

        {/* Dynamic Wait Ring Metric */}
        <div className="flex items-center gap-4 bg-slate-900/60 p-3.5 rounded-2xl border border-white/10 self-start sm:self-auto">
          {/* Circular Progress Gauge */}
          <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-cyan-400 transition-all duration-700 stroke-cyan-400"
                strokeDasharray={`${Math.min(100, Math.max(15, (patientsAhead / 8) * 100))}, 100`}
                strokeLinecap="round"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <Clock className="w-4 h-4 text-cyan-400 absolute" />
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
              Estimated Wait
            </span>
            <div className="text-lg sm:text-xl font-mono font-black text-white">
              {userIsCurrentlyServing ? 'YOUR TURN' : userIsInQueue ? `~${estimatedWait} min` : `~${waitingList.length * avgConsultTime} min`}
            </div>
            <span className="text-[10px] text-cyan-300/80 block">
              {userIsInQueue ? `${patientsAhead} patient(s) ahead` : `${waitingList.length} in queue`}
            </span>
          </div>
        </div>
      </div>

      {/* ── THE SIGNATURE QUEUE ORBIT CANVAS ── */}
      <div className="relative w-full py-8 px-4 flex flex-col items-center justify-center">
        {/* SVG Orbital Connection Vectors */}
        <div className="relative w-full max-w-lg mx-auto flex flex-col items-center space-y-6">
          
          {/* APEX: DOCTOR NODE */}
          <div className="relative z-20 flex flex-col items-center group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-indigo-600 p-0.5 shadow-command-glow animate-orbit-glow">
              <div className="w-full h-full rounded-2xl bg-slate-950 flex flex-col items-center justify-center text-cyan-300">
                <Stethoscope className="w-7 h-7 stroke-[2.2]" />
              </div>
            </div>

            <div className="mt-2 text-center">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black tracking-widest uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                DOCTOR CONSULTATION
              </span>
              <span className="block text-xs font-bold text-white mt-1">
                {doctor?.name || 'Physician'}
              </span>
            </div>
          </div>

          {/* Vertical Connecting Laser Line */}
          <div className="w-0.5 h-8 bg-gradient-to-b from-cyan-400 to-transparent relative">
            <div className="w-2 h-2 rounded-full bg-cyan-400 absolute -bottom-1 -left-[3px] animate-ping" />
          </div>

          {/* ORBITAL QUEUE NODES CONSTELLATION */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-20">
            {displayNodes.map((node, index) => {
              const isServing = node.nodeType === 'serving';
              const isUser = node.isUser;
              const isEmergency = node.priority === 'Emergency';

              return (
                <div
                  key={node.id}
                  onClick={() => onNodeClick && onNodeClick(node)}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center relative ${
                    isServing
                      ? 'border-cyan-400 bg-cyan-950/60 shadow-orbit-node scale-105'
                      : isUser
                      ? 'border-cyan-300 bg-cyan-900/50 ring-2 ring-cyan-400/50 shadow-command-glow scale-105'
                      : isEmergency
                      ? 'border-rose-500/60 bg-rose-950/40'
                      : 'border-white/10 bg-slate-900/60 hover:border-white/20'
                  }`}
                >
                  {/* YOU Indicator Badge */}
                  {isUser && (
                    <span className="absolute -top-2.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-cyan-400 text-slate-950 shadow-sm animate-pulse">
                      YOU
                    </span>
                  )}

                  {/* Node Icon / Position */}
                  <div className="flex items-center gap-1 mb-1">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isServing
                          ? 'bg-cyan-400 animate-ping'
                          : isEmergency
                          ? 'bg-rose-500 animate-pulse'
                          : isUser
                          ? 'bg-cyan-300'
                          : 'bg-slate-500'
                      }`}
                    />
                    <span className="text-[10px] font-mono text-slate-400">
                      {isServing ? 'NOW' : `#${node.queuePos || index}`}
                    </span>
                  </div>

                  <span className="font-mono text-base sm:text-lg font-black text-white tracking-tight">
                    {node.tokenNumber}
                  </span>

                  <span className="text-[11px] font-medium text-slate-300 truncate max-w-[100px] mt-0.5">
                    {node.patientName}
                  </span>

                  {isEmergency && (
                    <span className="mt-1 text-[9px] font-bold text-rose-400 flex items-center gap-0.5">
                      <Flame className="w-2.5 h-2.5" /> Urgent
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {displayNodes.length === 0 && (
            <div className="py-6 text-center text-xs text-slate-400">
              No patients currently in this doctor's queue.
            </div>
          )}
        </div>
      </div>

      {/* ── ACCESSIBLE QUEUE TIMELINE (Underneath Orbit) ── */}
      <div className="pt-4 border-t border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Queue Timeline Sequence
          </span>
          <span className="text-xs text-slate-500">
            Ordered by: Priority & Sequence
          </span>
        </div>

        <div className="space-y-2">
          {currentlyServing && (
            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping flex-shrink-0" />
                <span className="font-mono font-black text-cyan-300 text-sm">
                  {currentlyServing.tokenNumber}
                </span>
                <span className="font-bold text-white">{currentlyServing.patientName}</span>
                {userAppointment?.id === currentlyServing.id && (
                  <span className="px-1.5 py-0.2 rounded bg-cyan-400 text-slate-950 text-[10px] font-black">
                    YOU
                  </span>
                )}
              </div>
              <span className="font-mono text-cyan-300 text-[11px] font-bold">
                In Consultation (Now)
              </span>
            </div>
          )}

          {waitingList.slice(0, 5).map((apt, idx) => {
            const isUser = userAppointment?.id === apt.id;
            return (
              <div
                key={apt.id}
                className={`p-3 rounded-xl border transition-colors flex items-center justify-between text-xs ${
                  isUser
                    ? 'bg-cyan-900/30 border-cyan-400/60 ring-1 ring-cyan-400/40 font-bold'
                    : 'bg-slate-900/40 border-white/5 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-500 text-[11px] w-5">#{idx + 1}</span>
                  <span className="font-mono font-bold text-white">{apt.tokenNumber}</span>
                  <span className="truncate max-w-[140px] sm:max-w-xs">{apt.patientName}</span>
                  {isUser && (
                    <span className="px-1.5 py-0.2 rounded bg-cyan-400 text-slate-950 text-[10px] font-black">
                      YOU
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <span>Slot: {apt.timeSlot}</span>
                  <span>•</span>
                  <span className="text-cyan-400 font-semibold">
                    ~{(idx + (currentlyServing ? 1 : 0)) * avgConsultTime}m wait
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
