import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Building2, ChevronRight, Users, Clock, Radio, ArrowUpRight } from 'lucide-react';

export const DepartmentNetworkMap = () => {
  const { departments, doctors, appointments } = useApp();
  const navigate = useNavigate();

  const [activeDeptId, setActiveDeptId] = useState(departments[0]?.id || 'dept-gen');

  const selectedDept = departments.find((d) => d.id === activeDeptId) || departments[0];
  const deptDoctors = doctors.filter((doc) => doc.departmentId === selectedDept?.id);
  const deptAppointments = appointments.filter((a) => a.departmentId === selectedDept?.id);

  return (
    <div className="command-surface rounded-3xl p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 block">
            Clinical Information Network
          </span>
          <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
            Interconnected Department Flow
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {departments.length} Active Clinical Divisions
        </span>
      </div>

      {/* Connected Department Nodes Canvas */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
        {departments.map((dept, index) => {
          const isSelected = dept.id === activeDeptId;
          const docCount = doctors.filter((d) => d.departmentId === dept.id).length;

          return (
            <div
              key={dept.id}
              onClick={() => setActiveDeptId(dept.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-950/70 shadow-command-glow scale-102'
                  : 'border-white/10 bg-slate-900/50 hover:border-cyan-500/40 hover:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-black text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                    {dept.code}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">0{index + 1}</span>
                </div>

                <h4 className="text-xs font-bold text-white leading-snug truncate">
                  {dept.name}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  {docCount} Specialists
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                <span>~{dept.avgConsultationTime || 15}m</span>
                <span className="text-cyan-400 font-bold">{isSelected ? 'Active' : 'Inspect'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Department Inspector Card */}
      {selectedDept && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-4 animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base sm:text-lg font-black text-white">
                  {selectedDept.name} ({selectedDept.code})
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {selectedDept.roomNumber}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                {selectedDept.description}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => navigate(`/book-appointment?deptId=${selectedDept.id}`)}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-md transition-all inline-flex items-center gap-1.5"
              >
                Book in {selectedDept.code} <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Department Specialists Quick Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10">
            {deptDoctors.map((doc) => (
              <div
                key={doc.id}
                onClick={() => navigate(`/doctors/${doc.id}`)}
                className="p-3 rounded-xl bg-slate-950/60 border border-white/5 hover:border-cyan-500/40 cursor-pointer transition-all flex items-center gap-3"
              >
                <img
                  src={doc.avatar}
                  alt={doc.name}
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate">{doc.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{doc.specialty}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
