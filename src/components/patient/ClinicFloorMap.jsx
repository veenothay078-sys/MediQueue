import React from 'react';
import { MapPin, Navigation, CheckCircle2, User, Clock, Stethoscope } from 'lucide-react';

export const ClinicFloorMap = ({ activeDoctorRoom = 'Room 101', activeDoctorName = 'Dr. Priya Sharma' }) => {
  const rooms = [
    { room: 'Room 101', wing: 'Wing A', doctor: 'Dr. Priya Sharma', dept: 'General Med', status: 'Active' },
    { room: 'Room 102', wing: 'Wing A', doctor: 'Dr. Marcus Vance', dept: 'General Med', status: 'Available' },
    { room: 'Room 108', wing: 'Wing A', doctor: 'Dr. Sunita Rao', dept: 'Dermatology', status: 'Available' },
    { room: 'Room 201', wing: 'Wing B', doctor: 'Dr. Rajesh Menon', dept: 'Cardiology', status: 'In Consult' },
    { room: 'Room 208', wing: 'Wing B', doctor: 'Dr. Vikram Malhotra', dept: 'Orthopedics', status: 'Available' },
    { room: 'Room 301', wing: 'Wing C', doctor: 'Dr. Aisha Patel', dept: 'Pediatrics', status: 'Available' },
    { room: 'Room 306', wing: 'Wing C', doctor: 'Dr. David Chen', dept: 'ENT', status: 'Available' },
    { room: 'Room 401', wing: 'Wing D', doctor: 'Dr. Elena Rostova', dept: 'Neurology', status: 'In Consult' },
  ];

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Interactive Hospital Wing & Room Locator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your appointment destination is highlighted below.
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-3 py-1 rounded-xl border border-teal-200 dark:border-teal-800">
          Target: {activeDoctorRoom}
        </span>
      </div>

      {/* Room Cubicles Visual Map */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {rooms.map((item) => {
          const isTarget =
            item.room.toLowerCase() === (activeDoctorRoom || '').toLowerCase() ||
            (activeDoctorName && item.doctor.includes(activeDoctorName.replace('Dr. ', '')));

          return (
            <div
              key={item.room}
              className={`p-3.5 rounded-2xl border transition-all relative overflow-hidden ${
                isTarget
                  ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/50 dark:to-emerald-950/40 shadow-md ring-2 ring-teal-500/30'
                  : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-slate-300'
              }`}
            >
              {isTarget && (
                <div className="absolute top-0 right-0 px-2 py-0.5 rounded-bl-xl bg-teal-600 text-white text-[9px] font-black uppercase tracking-wider">
                  YOUR ROOM
                </div>
              )}

              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-black text-slate-900 dark:text-slate-100">
                  {item.room}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">{item.wing}</span>
              </div>

              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {item.doctor}
              </div>
              <div className="text-[11px] text-slate-500 truncate">{item.dept}</div>

              <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className="flex items-center gap-1">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      item.status === 'In Consult'
                        ? 'bg-amber-500 animate-pulse'
                        : 'bg-emerald-500'
                    }`}
                  />
                  {item.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
