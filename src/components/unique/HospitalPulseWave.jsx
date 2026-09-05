import React from 'react';
import { Activity, Radio, Sparkles } from 'lucide-react';

export const HospitalPulseWave = ({ todayTotal = 84, waitingCount = 21, inConsultCount = 4 }) => {
  const timeBuckets = [
    { time: '07:00', load: 30 },
    { time: '09:00', load: 75 },
    { time: '11:00', load: 95 },
    { time: '13:00', load: 60 },
    { time: '15:00', load: 85 },
    { time: '17:00', load: 70 },
    { time: '19:00', load: 40 },
  ];

  return (
    <div className="command-surface rounded-2xl p-4 sm:p-5 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-mono text-xs font-black tracking-widest uppercase text-cyan-400">
            LIVE HOSPITAL PULSE
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            • Real-time throughput rhythm
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-slate-300">
            Consult Velocity: <strong className="text-cyan-400">~12m / visit</strong>
          </span>
          <span className="text-slate-300">
            Active Rooms: <strong className="text-emerald-400">{inConsultCount} Rooms</strong>
          </span>
        </div>
      </div>

      {/* Hospital Activity Pulse Flow Line SVG */}
      <div className="relative w-full h-16 sm:h-20">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 700 70" preserveAspectRatio="none">
          <defs>
            <linearGradient id="pulseGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Fill under wave */}
          <path
            d="M 0,55 Q 50,45 100,50 T 200,20 T 300,12 T 400,38 T 500,18 T 600,28 T 700,50 L 700,70 L 0,70 Z"
            fill="url(#pulseGlow)"
          />

          {/* Flow pulse wave line */}
          <path
            d="M 0,55 Q 50,45 100,50 T 200,20 T 300,12 T 400,38 T 500,18 T 600,28 T 700,50"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Peak activity indicator node */}
          <circle cx="300" cy="12" r="4" fill="#22d3ee" className="animate-ping" />
          <circle cx="300" cy="12" r="3" fill="#ffffff" />
          <circle cx="500" cy="18" r="3" fill="#22d3ee" />
        </svg>

        {/* Time markers */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-white/5 mt-1">
          {timeBuckets.map((bucket) => (
            <span key={bucket.time}>{bucket.time}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
