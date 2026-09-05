import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { computeAnalytics, formatDateDisplay } from '../../utils/queueCalculations';
import { getTodayDateStr } from '../../data/initialData';
import { announceTokenVoice } from '../../utils/audioAnnouncer';
import {
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Radio,
  BarChart3,
  Calendar,
  Building2,
  ArrowRight,
  UserCheck,
  Stethoscope,
  Volume2,
  X,
  SkipForward,
  Flame,
  Plus,
} from 'lucide-react';

export const AdminDashboard = () => {
  const {
    appointments,
    doctors,
    departments,
    callNextPatient,
    completeAppointment,
    skipPatient,
    setEmergencyPriority,
  } = useApp();

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTimerSeconds, setActiveTimerSeconds] = useState(443);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const todayStr = getTodayDateStr();
  const { kpis } = computeAnalytics(appointments, doctors, departments);

  // Active serving patient
  const currentlyServing = appointments.find(
    (a) => a.date === todayStr && (a.status === 'In Consultation' || a.status === 'Called')
  );

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto animate-fade-in">
      {/* ── 1. HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Executive Operations • {formatDateDisplay(todayStr)}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
            Hospital Operations
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Monitor today's appointments, queues, and patient flow.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/queue"
            className="mq-btn-primary text-xs"
          >
            <Radio className="w-4 h-4" /> Live Calling Console
          </Link>
          <Link
            to="/admin/analytics"
            className="mq-btn-secondary text-xs"
          >
            <BarChart3 className="w-4 h-4" /> Analytics
          </Link>
        </div>
      </div>

      {/* ── 2. CLEAN STAT BLOCKS (5 KEY METRICS) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="mq-card p-4 text-center">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Today's Visits
          </span>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1 block">
            {kpis.todayCount}
          </span>
        </div>

        <div className="mq-card p-4 text-center border-l-2 border-l-amber-500">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Waiting in Queue
          </span>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1 block">
            {kpis.waitingCount}
          </span>
        </div>

        <div className="mq-card p-4 text-center border-l-2 border-l-teal-600">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            In Consultation
          </span>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-teal-700 dark:text-teal-400 mt-1 block">
            {kpis.inConsultationCount}
          </span>
        </div>

        <div className="mq-card p-4 text-center border-l-2 border-l-emerald-500">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Completed
          </span>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 block">
            {kpis.completedCount}
          </span>
        </div>

        <div className="mq-card p-4 text-center border-l-2 border-l-rose-500 col-span-2 sm:col-span-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Priority Cases
          </span>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1 block">
            {kpis.emergencyCount}
          </span>
        </div>
      </div>

      {/* ── 3. NOW SERVING CALL STATION ── */}
      <div className="mq-card p-6 sm:p-7 border-l-4 border-l-teal-700 bg-white dark:bg-slate-900 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              Active Calling Station
            </span>
            {currentlyServing?.priority === 'Emergency' && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 text-rose-700 border border-rose-200">
                Priority Case
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-4 mt-2">
            <div className="text-3xl sm:text-4xl font-bold font-mono text-slate-900 dark:text-slate-100">
              {currentlyServing ? `Token ${currentlyServing.tokenNumber}` : 'Room 02 Ready'}
            </div>
            <div className="text-sm font-mono font-semibold text-slate-500">
              Elapsed: {formatTimer(activeTimerSeconds)}
            </div>
          </div>

          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {currentlyServing ? (
              <>
                {currentlyServing.patientName} • {currentlyServing.departmentName} (
                {currentlyServing.doctorName} - {currentlyServing.roomNumber || 'Room 02'})
              </>
            ) : (
              'All examination suites are currently available to call the next patient.'
            )}
          </p>
        </div>

        {/* Action Triggers */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {currentlyServing && (
            <>
              <button
                onClick={() =>
                  announceTokenVoice(
                    currentlyServing.tokenNumber,
                    currentlyServing.patientName,
                    currentlyServing.roomNumber || 'Room 02'
                  )
                }
                className="mq-btn-secondary text-xs"
                title="Voice PA Announcement"
              >
                <Volume2 className="w-4 h-4 text-teal-600" />
                Audio PA
              </button>
              <button
                onClick={() => completeAppointment(currentlyServing.id)}
                className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Complete Consultation
              </button>
            </>
          )}
          <button
            onClick={() => callNextPatient('doc-1')}
            className="mq-btn-primary text-xs"
          >
            <UserCheck className="w-4 h-4" />
            Call Next Patient
          </button>
        </div>
      </div>

      {/* ── 4. DEPARTMENT QUEUE LOAD & SIDE INSPECTOR DRAWER ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Department Queue Lanes */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Department Queue Overview ({departments.length})
            </h3>
            <span className="text-xs text-slate-500">
              Select any patient token to manage status
            </span>
          </div>

          <div className="space-y-3">
            {departments.map((dept) => {
              const deptApts = appointments.filter((a) => a.departmentId === dept.id);
              const waiting = deptApts.filter((a) => a.status === 'Waiting');
              const inConsult = deptApts.filter(
                (a) => a.status === 'In Consultation' || a.status === 'Called'
              );

              return (
                <div key={dept.id} className="mq-card p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {dept.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600">
                        {dept.code}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 font-medium">
                      <strong>{waiting.length}</strong> waiting • <strong>{inConsult.length}</strong> in room
                    </div>
                  </div>

                  {/* Token Row */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {deptApts.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">No appointments today</span>
                    ) : (
                      deptApts.map((apt) => (
                        <button
                          key={apt.id}
                          onClick={() => setSelectedPatient(apt)}
                          className={`px-2 py-1 rounded text-xs font-mono font-semibold transition-all ${
                            selectedPatient?.id === apt.id
                              ? 'bg-teal-700 text-white shadow-sm'
                              : apt.status === 'In Consultation'
                              ? 'bg-teal-100 text-teal-800 font-bold border border-teal-300'
                              : apt.status === 'Waiting'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:border-amber-400'
                              : apt.status === 'Completed'
                              ? 'bg-slate-100 text-slate-400'
                              : 'bg-slate-50 text-slate-600 border border-slate-200'
                          }`}
                          title={`${apt.tokenNumber} - ${apt.patientName} (${apt.status})`}
                        >
                          {apt.tokenNumber}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Patient Inspector Side Panel & Waiting Time Insights */}
        <div className="lg:col-span-4 space-y-6">
          {/* Patient Side Panel */}
          {selectedPatient ? (
            <div className="mq-card p-5 space-y-4 border-2 border-teal-600 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Queue Control Panel
                  </span>
                  <h4 className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
                    Token {selectedPatient.tokenNumber}
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="p-1 rounded text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Patient Name:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedPatient.patientName}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Doctor:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedPatient.doctorName}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedPatient.departmentName}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Slot Time:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedPatient.timeSlot}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-teal-700 dark:text-teal-400">
                    {selectedPatient.status}
                  </span>
                </div>
              </div>

              {/* Working Actions */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    callNextPatient(selectedPatient.doctorId);
                    setSelectedPatient(null);
                  }}
                  className="w-full mq-btn-primary text-xs py-2"
                >
                  <UserCheck className="w-4 h-4" /> Call to Room
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      completeAppointment(selectedPatient.id);
                      setSelectedPatient(null);
                    }}
                    className="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                  </button>
                  <button
                    onClick={() => {
                      skipPatient(selectedPatient.id);
                      setSelectedPatient(null);
                    }}
                    className="py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <SkipForward className="w-3.5 h-3.5" /> Skip
                  </button>
                </div>

                <button
                  onClick={() => {
                    setEmergencyPriority(selectedPatient.id);
                    setSelectedPatient(null);
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <Flame className="w-3.5 h-3.5" /> Mark Priority Case
                </button>
              </div>
            </div>
          ) : (
            <div className="mq-card p-6 text-center text-slate-400 text-xs space-y-1.5">
              <Stethoscope className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                Queue Control Selection
              </p>
              <p>Click any token in the department lanes to view patient details and perform calling actions.</p>
            </div>
          )}

          {/* Waiting Time Insights (Bottleneck Analysis) */}
          <div className="mq-card p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Waiting Time Insights
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">Live load</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {departments.slice(0, 4).map((dept) => {
                const count = appointments.filter(
                  (a) => a.departmentId === dept.id && a.status === 'Waiting'
                ).length;
                const avgWait = count * 12;

                return (
                  <div key={dept.id} className="flex items-center justify-between py-1">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {dept.name}
                    </span>
                    <span className="font-mono text-slate-500">
                      <strong>{count} waiting</strong> • ~{avgWait || 12} min
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
