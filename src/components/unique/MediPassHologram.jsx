import React, { useState, useRef } from 'react';
import { TokenDisplay, StatusBadge, PriorityBadge } from '../common/StatusBadge';
import { announceTokenVoice } from '../../utils/audioAnnouncer';
import {
  Sparkles,
  QrCode,
  Radio,
  Volume2,
  Navigation,
  ShieldCheck,
  Download,
  Flame,
  CheckCircle2,
  CreditCard,
  MapPin,
} from 'lucide-react';

export const MediPassHologram = ({ appointment, onEscalateEmergency }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  if (!appointment) return null;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  const handlePlayVoice = () => {
    announceTokenVoice(
      appointment.tokenNumber,
      appointment.patientName,
      appointment.roomNumber || 'Room 101'
    );
  };

  return (
    <div className="relative group perspective-1000">
      {/* 3D Tilted Card Container */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(${
            isHovered ? '1.02, 1.02, 1.02' : '1, 1, 1'
          })`,
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
        }}
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-950 text-white border-2 border-teal-500/40 shadow-2xl transition-all select-none"
      >
        {/* Holographic Shimmer Sheen Layer */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-color-dodge transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${50 + rotate.y * 3}% ${
              50 + rotate.x * -3
            }%, rgba(45, 212, 191, 0.4), rgba(244, 63, 94, 0.2), rgba(59, 130, 246, 0.3), transparent 70%)`,
          }}
        />

        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0d948815_1px,transparent_1px),linear-gradient(to_bottom,#0d948815_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Card Top: MediPass Brand & Chip */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-400 to-emerald-400 text-slate-950 flex items-center justify-center font-black text-sm shadow-md">
                MQ
              </div>
              <div>
                <span className="font-mono text-xs font-black tracking-widest text-teal-300 block uppercase">
                  MediPass™ Hologram
                </span>
                <span className="text-[10px] text-teal-200/60 tracking-wider">
                  ENCRYPTED CLINICAL PASS
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <PriorityBadge priority={appointment.priority} />
              <StatusBadge status={appointment.status} size="sm" />
            </div>
          </div>

          {/* Token & Patient Name Centerpiece */}
          <div className="my-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 block mb-1">
                Active Hospital Token
              </span>
              <div className="text-4xl sm:text-5xl font-mono font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-teal-100 to-white">
                {appointment.tokenNumber}
              </div>
              <p className="text-sm font-bold text-slate-200 mt-1">
                {appointment.patientName}
              </p>
            </div>

            {/* Simulated Live Encrypted QR Code */}
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center text-center self-start sm:self-auto">
              <div className="w-14 h-14 bg-white rounded-xl p-1.5 flex items-center justify-center shadow-inner">
                <QrCode className="w-full h-full text-slate-900" />
              </div>
              <span className="text-[9px] font-mono text-teal-300 mt-1 font-semibold">
                SCAN AT DOOR
              </span>
            </div>
          </div>

          {/* Specs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 text-xs">
            <div>
              <span className="text-[10px] text-teal-300/70 block uppercase font-mono">Specialist</span>
              <span className="font-bold text-white truncate block">{appointment.doctorName}</span>
            </div>
            <div>
              <span className="text-[10px] text-teal-300/70 block uppercase font-mono">Department</span>
              <span className="font-bold text-white truncate block">{appointment.departmentName}</span>
            </div>
            <div>
              <span className="text-[10px] text-teal-300/70 block uppercase font-mono">Room Code</span>
              <span className="font-bold text-teal-300 block">{appointment.roomNumber || 'Room 101'}</span>
            </div>
            <div>
              <span className="text-[10px] text-teal-300/70 block uppercase font-mono">Time Slot</span>
              <span className="font-bold text-white block">{appointment.timeSlot}</span>
            </div>
          </div>

          {/* Live Proximity & Audio Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-teal-200">
              <Navigation className="w-4 h-4 text-teal-400 animate-pulse" />
              <span>
                Indoor Proximity: <strong>24 meters</strong> from {appointment.roomNumber || 'Room 101'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePlayVoice}
                className="px-3.5 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/40 text-teal-200 border border-teal-400/40 text-xs font-bold transition-all inline-flex items-center gap-1.5"
                title="Play Room PA Call Announcement"
              >
                <Volume2 className="w-3.5 h-3.5 text-teal-300" />
                Listen to PA Call
              </button>

              {onEscalateEmergency && appointment.priority !== 'Emergency' && (
                <button
                  type="button"
                  onClick={() => onEscalateEmergency(appointment.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-400/40 text-xs font-bold transition-all inline-flex items-center gap-1.5"
                  title="Request Emergency Triage Priority"
                >
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  SOS Emergency
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
