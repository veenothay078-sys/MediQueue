import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Radio, ChevronRight, CheckCircle2, Stethoscope, Sparkles } from 'lucide-react';

export const PatientJourneyWidget = ({ appointment, waitStats }) => {
  if (!appointment) {
    return (
      <div className="command-surface rounded-3xl p-6 sm:p-8 text-center space-y-3">
        <Sparkles className="w-8 h-8 text-cyan-400 mx-auto" />
        <h3 className="text-base font-bold text-white">No Active Journey Today</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          You don't have a booked consultation token for today. Schedule an appointment to activate your live queue journey.
        </p>
        <Link
          to="/book-appointment"
          className="inline-block px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-md mt-2"
        >
          Book Consultation Slot
        </Link>
      </div>
    );
  }

  const isCompleted = appointment.status === 'Completed';
  const isServing = appointment.status === 'Called' || appointment.status === 'In Consultation';
  const isWaiting = appointment.status === 'Waiting' || appointment.status === 'Booked';

  const stages = [
    { id: 'checked_in', label: 'Checked In', done: true, active: false },
    { id: 'waiting', label: 'Waiting', done: isServing || isCompleted, active: isWaiting },
    { id: 'your_turn', label: 'Your Turn', done: isCompleted, active: appointment.status === 'Called' },
    { id: 'doctor', label: 'Doctor', done: isCompleted, active: appointment.status === 'In Consultation' },
    { id: 'completed', label: 'Completed', done: isCompleted, active: isCompleted },
  ];

  return (
    <div className="command-surface rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden border border-cyan-500/30">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 block">
            PATIENT FLIGHT DECK
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            YOUR JOURNEY
          </h2>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
          {appointment.departmentName}
        </span>
      </div>

      {/* Horizontal Connected Stage Nodes */}
      <div className="flex items-center justify-between relative py-2">
        {stages.map((stage, idx) => (
          <div key={stage.id} className="flex flex-col items-center text-center relative z-10 flex-1">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                stage.active
                  ? 'bg-cyan-400 text-slate-950 ring-4 ring-cyan-400/30 animate-pulse shadow-command-glow'
                  : stage.done
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-800 text-slate-500 border border-white/10'
              }`}
            >
              {stage.done && !stage.active ? '✓' : idx + 1}
            </div>
            <span className={`text-[11px] font-bold mt-2 truncate max-w-[80px] sm:max-w-none ${stage.active ? 'text-cyan-300' : 'text-slate-400'}`}>
              {stage.label}
            </span>
          </div>
        ))}
        {/* Connecting vector */}
        <div className="absolute left-6 right-6 top-6 h-0.5 bg-slate-800 -z-0" />
      </div>

      {/* Prominent Large Token Metric Display */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center">
          <span className="text-[10px] uppercase font-mono text-cyan-400 block font-bold">
            TOKEN NUMBER
          </span>
          <div className="text-3xl sm:text-4xl font-mono font-black text-white mt-1">
            {appointment.tokenNumber}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {appointment.doctorName}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center">
          <span className="text-[10px] uppercase font-mono text-amber-400 block font-bold">
            QUEUE POSITION
          </span>
          <div className="text-3xl sm:text-4xl font-mono font-black text-amber-400 mt-1">
            {waitStats?.patientsAhead ? `${waitStats.patientsAhead} ahead` : 'Next in Line'}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Position in queue
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center">
          <span className="text-[10px] uppercase font-mono text-cyan-400 block font-bold">
            ESTIMATED WAIT
          </span>
          <div className="text-3xl sm:text-4xl font-mono font-black text-cyan-300 mt-1">
            ~{waitStats?.waitMinutes ?? 12} min
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Dynamic estimation
          </span>
        </div>
      </div>

      {/* CTA Button */}
      <Link
        to="/queue"
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
      >
        <Radio className="w-4 h-4 animate-pulse" />
        VIEW LIVE QUEUE ORBIT
      </Link>
    </div>
  );
};
