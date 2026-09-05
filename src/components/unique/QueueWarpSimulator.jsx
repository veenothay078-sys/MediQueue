import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { announceTokenVoice } from '../../utils/audioAnnouncer';
import { Play, Pause, FastForward, RotateCcw, Radio, Sparkles, Volume2 } from 'lucide-react';

export const QueueWarpSimulator = ({ doctorId = 'doc-1' }) => {
  const { appointments, callNextPatient, doctors } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3000); // ms per step

  const doc = doctors.find((d) => d.id === doctorId) || doctors[0];

  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        callNextPatient(doctorId);
      }, speed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, speed, doctorId, callNextPatient]);

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white border border-teal-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400">
          <FastForward className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-teal-300">
              Live Queue Warp Simulator
            </h4>
            <span className="text-[10px] px-2 py-0.5 rounded bg-teal-600/30 text-teal-200 border border-teal-400/30 font-bold">
              Auto-Pilot
            </span>
          </div>
          <p className="text-[11px] text-slate-300">
            Simulate live hospital queue flow for <strong>{doc?.name}</strong> with audio chime.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Speed Toggles */}
        <div className="flex items-center p-1 rounded-xl bg-slate-800 border border-slate-700 text-xs">
          <button
            onClick={() => setSpeed(4000)}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              speed === 4000 ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            1x
          </button>
          <button
            onClick={() => setSpeed(2500)}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              speed === 2500 ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            2x
          </button>
          <button
            onClick={() => setSpeed(1500)}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              speed === 1500 ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            3x
          </button>
        </div>

        {/* Play / Pause */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-md ${
            isPlaying
              ? 'bg-amber-600 hover:bg-amber-500 text-white animate-pulse'
              : 'bg-teal-600 hover:bg-teal-500 text-white'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5" /> Pause Auto-Warp
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" /> Start Auto-Warp
            </>
          )}
        </button>
      </div>
    </div>
  );
};
