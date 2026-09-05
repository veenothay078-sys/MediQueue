import React, { useState } from 'react';
import { Activity, Volume2, VolumeX, Radio, Sparkles, ShieldCheck } from 'lucide-react';

export const HospitalPulseRadar = ({ waitingCount = 0, inConsultCount = 0, avgWait = 14 }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Play pleasant medical chime using standard browser Web Audio API
  const playChime = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5

      osc2.frequency.setValueAtTime(440, ctx.currentTime); // A4
      osc2.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.3); // E5

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.75);
      osc2.stop(ctx.currentTime + 0.75);
    } catch (e) {
      // safe fallback
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950 text-white border border-teal-500/20 shadow-lg">
      <div className="flex items-center gap-3.5">
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400">
            <Activity className="w-5 h-5 animate-pulse text-teal-300" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500" />
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
              Live Hospital Telemetry
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-200 border border-teal-500/30 font-semibold">
              Live Pulse
            </span>
          </div>
          <p className="text-[11px] text-slate-300 mt-0.5">
            <strong>{inConsultCount}</strong> Rooms Active • <strong>{waitingCount}</strong> In Lounge • Avg Wait: <strong>~{avgWait}m</strong>
          </p>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={playChime}
          className="px-3 py-1.5 rounded-xl bg-teal-600/30 hover:bg-teal-600/50 text-teal-200 border border-teal-500/30 text-xs font-semibold inline-flex items-center gap-1.5 transition-all"
          title="Test Room Calling Chime"
        >
          <Volume2 className="w-3.5 h-3.5 text-teal-400" />
          <span className="hidden sm:inline">Test Calling Chime</span>
        </button>
      </div>
    </div>
  );
};
