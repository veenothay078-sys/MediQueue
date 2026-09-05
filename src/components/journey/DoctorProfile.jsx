import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Stethoscope,
  Clock,
  Users,
  Star,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MapPin,
  Building2,
} from 'lucide-react';

export const DoctorProfile = ({ defaultDeptId = '' }) => {
  const { doctors, departments, appointments } = useApp();
  const navigate = useNavigate();

  const filteredDoctors = defaultDeptId
    ? doctors.filter((d) => d.departmentId === defaultDeptId)
    : doctors;

  const [selectedDocId, setSelectedDocId] = useState(filteredDoctors[0]?.id || doctors[0]?.id || 'doc-1');

  const selectedDoctor =
    doctors.find((d) => d.id === selectedDocId) || doctors[0];

  // Calculate live queue for selected doctor
  const docQueue = appointments.filter(
    (a) => a.doctorId === selectedDoctor?.id && (a.status === 'Waiting' || a.status === 'Booked')
  );
  const queueCount = docQueue.length;
  const avgWait = Math.max(1, queueCount * (selectedDoctor?.consultationDuration || 12));

  // Today's Flow Time-Slots Simulation
  const flowSlots = [
    { time: '09:00', status: 'completed' },
    { time: '09:30', status: 'completed' },
    { time: '10:00', status: 'serving' },
    { time: '10:30', status: 'next' },
    { time: '11:00', status: 'available' },
    { time: '11:30', status: 'available' },
    { time: '02:00', status: 'available' },
    { time: '02:30', status: 'available' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Roster: Doctor Directory */}
      <div className="lg:col-span-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Specialist Directory ({filteredDoctors.length})
          </span>
          <span className="text-xs text-[#0B2545] dark:text-[#38BDF8] font-bold">
            Select to View Flow
          </span>
        </div>

        <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
          {filteredDoctors.map((doc) => {
            const isSelected = doc.id === selectedDoctor?.id;
            const docDept = departments.find((d) => d.id === doc.departmentId);

            return (
              <div
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-white dark:bg-stone-800 border-[#0B2545] dark:border-[#38BDF8] shadow-md transform -translate-y-0.5'
                    : 'bg-white/60 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 hover:border-stone-300'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                    isSelected
                      ? 'bg-[#0B2545] text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-[#0B2545] dark:text-[#38BDF8]'
                  }`}
                >
                  <Stethoscope className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 truncate">
                      {doc.name}
                    </h4>
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5">
                      ⭐ {doc.rating || '4.9'}
                    </span>
                  </div>
                  <p className="text-xs text-[#0B2545] dark:text-[#38BDF8] font-semibold truncate mt-0.5">
                    {doc.specialty}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 font-mono">
                    <span>{doc.roomNumber}</span>
                    <span>•</span>
                    <span>{doc.experience || '10+ yrs exp'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Selected Doctor Journey Flow & Profile */}
      <div className="lg:col-span-7">
        {selectedDoctor && (
          <div className="journey-card rounded-3xl p-6 sm:p-8 space-y-6">
            {/* Header & Specialty */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    ● ON DUTY TODAY
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  {selectedDoctor.name}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-[#0B2545] dark:text-[#38BDF8] mt-0.5">
                  {selectedDoctor.specialty} • {selectedDoctor.departmentName}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase block">
                  Consultation Suite
                </span>
                <span className="text-lg font-mono font-black text-slate-900 dark:text-slate-100">
                  {selectedDoctor.roomNumber}
                </span>
              </div>
            </div>

            {/* Today's Flow Timeline */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500 block">
                TODAY'S FLOW & SLOT ROUTE
              </span>

              {/* Transit Slot Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {flowSlots.map((slot) => (
                  <div
                    key={slot.time}
                    className={`p-2 rounded-xl text-center border transition-all ${
                      slot.status === 'serving'
                        ? 'bg-[#0B2545] text-white border-[#0B2545] shadow-sm'
                        : slot.status === 'completed'
                        ? 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-slate-400'
                        : slot.status === 'next'
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                        : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold block">{slot.time}</span>
                    <span className="text-[9px] uppercase font-semibold mt-0.5 block truncate">
                      {slot.status === 'serving'
                        ? 'Active'
                        : slot.status === 'completed'
                        ? 'Done'
                        : slot.status === 'next'
                        ? 'Next'
                        : 'Open'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Metric Strips */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-center">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                  Current Queue
                </span>
                <span className="text-xl sm:text-2xl font-mono font-black text-slate-900 dark:text-slate-100 mt-0.5 block">
                  {String(queueCount).padStart(2, '0')}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                  Next Available
                </span>
                <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mt-1 block">
                  10:30 AM
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-amber-700 dark:text-amber-400 block font-bold">
                  Average Wait
                </span>
                <span className="text-xl sm:text-2xl font-mono font-black text-amber-700 dark:text-amber-400 mt-0.5 block">
                  ~{avgWait}m
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Link
                to={`/book-appointment?doctorId=${selectedDoctor.id}`}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#0B2545] hover:bg-[#13315C] dark:bg-[#1E3A8A] dark:hover:bg-[#2563EB] text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2"
              >
                Book Appointment with {selectedDoctor.name}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
