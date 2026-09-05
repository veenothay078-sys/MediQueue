import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getTodayDateStr } from '../../data/initialData';
import {
  Stethoscope,
  Star,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  Search,
} from 'lucide-react';

export const DoctorSplitSelector = () => {
  const { doctors, departments, appointments } = useApp();
  const navigate = useNavigate();

  const [selectedDocId, setSelectedDocId] = useState(doctors[0]?.id || 'doc-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  const todayStr = getTodayDateStr();

  const filteredDoctors = doctors.filter((d) => {
    if (deptFilter && d.departmentId !== deptFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = d.name.toLowerCase().includes(q);
      const matchSpec = d.specialty.toLowerCase().includes(q);
      const matchDept = d.departmentName?.toLowerCase().includes(q);
      if (!matchName && !matchSpec && !matchDept) return false;
    }
    return true;
  });

  const selectedDoctor =
    doctors.find((d) => d.id === selectedDocId) || filteredDoctors[0] || doctors[0];
  const selectedDept = departments.find((d) => d.id === selectedDoctor?.departmentId);

  // Queue calculation for selected doctor today
  const doctorTodayApts = appointments.filter(
    (a) => a.doctorId === selectedDoctor?.id && a.date === todayStr
  );
  const waitingCount = doctorTodayApts.filter(
    (a) => a.status === 'Waiting' || a.status === 'In Consultation'
  ).length;

  return (
    <div className="command-surface rounded-3xl p-6 sm:p-8 space-y-6">
      {/* Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 block">
            Specialist Physician Directory
          </span>
          <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
            Consultant Roster & Schedule Explorer
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search physician..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Dept Dropdown */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-300 font-semibold focus:outline-none"
          >
            <option value="">All Divisions</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── THE SPLIT LAYOUT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: DOCTORS LIST (5 Cols) */}
        <div className="lg:col-span-5 space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {filteredDoctors.map((doc) => {
            const isSelected = doc.id === selectedDoctor?.id;
            const isAvailable = doc.status === 'Available';

            return (
              <div
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/60 shadow-command-glow'
                    : 'border-white/5 bg-slate-900/40 hover:border-white/15 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative flex-shrink-0">
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-11 h-11 rounded-xl object-cover ring-1 ring-white/10"
                    />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-950 ${
                        isAvailable ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                    />
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{doc.name}</h4>
                    <p className="text-[11px] text-slate-400 truncate">{doc.departmentName}</p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 pl-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                      isAvailable
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    ● {doc.status}
                  </span>
                  <span className="block text-[10px] font-mono text-slate-500 mt-1">
                    {doc.roomNumber}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: SELECTED DOCTOR'S PROFILE & SCHEDULE (7 Cols) */}
        {selectedDoctor && (
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-6">
            {/* Top Row: Doctor Info + Rating */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedDoctor.avatar}
                  alt={selectedDoctor.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-cyan-500/40 shadow-lg flex-shrink-0"
                />
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {selectedDoctor.departmentName}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                    {selectedDoctor.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {selectedDoctor.specialty} • {selectedDoctor.qualification}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 self-start sm:self-auto">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{selectedDoctor.rating}</span>
                <span className="text-slate-500">({selectedDoctor.reviewsCount})</span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-black/40 border border-white/5 text-xs">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Experience</span>
                <span className="font-bold text-white text-sm">{selectedDoctor.experience}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Consult Time</span>
                <span className="font-bold text-cyan-400 text-sm">~{selectedDoctor.consultationDuration} min</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Room</span>
                <span className="font-bold text-white text-sm">{selectedDoctor.roomNumber}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Queue Today</span>
                <span className="font-bold text-amber-400 text-sm">{waitingCount} Waiting</span>
              </div>
            </div>

            {/* Bio */}
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedDoctor.bio}
            </p>

            {/* Daily Availability */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between text-xs">
              <span className="text-slate-400">Hours Today:</span>
              <span className="font-mono font-bold text-cyan-300">{selectedDoctor.availability}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => navigate(`/doctors/${selectedDoctor.id}`)}
                className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 text-xs font-semibold"
              >
                Full Profile
              </button>
              <button
                onClick={() => navigate(`/book-appointment?doctorId=${selectedDoctor.id}`)}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 transition-all inline-flex items-center gap-1.5"
              >
                Book Appointment <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
