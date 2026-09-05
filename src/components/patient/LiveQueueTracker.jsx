import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  getSortedQueueForDoctor,
  calculateEstimatedWaitTime,
  formatDateDisplay,
} from '../../utils/queueCalculations';
import { StatusBadge, PriorityBadge, TokenDisplay } from '../common/StatusBadge';
import { getTodayDateStr } from '../../data/initialData';
import {
  Clock,
  Users,
  Radio,
  UserCheck,
  AlertTriangle,
  Play,
  CheckCircle2,
  Stethoscope,
  ChevronRight,
  RotateCw,
  Sparkles,
  MapPin,
} from 'lucide-react';

export const LiveQueueTracker = () => {
  const { appointments, doctors, departments, callNextPatient, bookAppointment, patientProfile } =
    useApp();

  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || 'doc-1');
  const todayStr = getTodayDateStr();

  const activeDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];
  const activeDept = departments.find((dept) => dept.id === activeDoctor?.departmentId);

  // Get current sorted queue for this doctor today
  const { currentlyServing, waitingList, completedList, skippedList, totalToday } =
    getSortedQueueForDoctor(selectedDoctorId, appointments, todayStr);

  // Check if current user has an active appointment with this doctor today
  const userTodayApt = appointments.find(
    (a) =>
      a.date === todayStr &&
      a.doctorId === selectedDoctorId &&
      (a.patientEmail === patientProfile.email || a.patientName === patientProfile.name) &&
      a.status !== 'Cancelled'
  );

  // User wait stats
  const userWaitStats = userTodayApt
    ? calculateEstimatedWaitTime(userTodayApt.id, appointments, doctors)
    : null;

  // Simulation helpers
  const handleSimulateCallNext = () => {
    callNextPatient(selectedDoctorId);
  };

  const handleSimulateQuickBooking = () => {
    bookAppointment({
      doctorId: selectedDoctorId,
      departmentId: activeDoctor?.departmentId,
      date: todayStr,
      timeSlot: '11:00 AM',
      reason: 'Live queue walk-in simulation',
      patientName: patientProfile.name || 'Alex Morgan',
      patientEmail: patientProfile.email || 'alex.morgan@mediqueue.demo',
      patientPhone: patientProfile.phone || '+1 (555) 234-5678',
    });
  };

  return (
    <div className="space-y-6">
      {/* Doctor & Department Selector Strip */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
              <Radio className="w-5 h-5 animate-pulse text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                Live Clinic Queue Stream
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time queue tracking for today ({formatDateDisplay(todayStr)})
              </p>
            </div>
          </div>

          {/* Doctor Dropdown Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
              Doctor:
            </label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} ({doc.departmentName})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Queue Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: NOW SERVING */}
        <div className="lg:col-span-1 bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-elevated relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                Now Serving
              </span>
              <span className="text-xs font-mono text-teal-200/70">
                {activeDoctor?.roomNumber || 'Room 101'}
              </span>
            </div>

            <div className="my-6 text-center">
              {currentlyServing ? (
                <div>
                  <TokenDisplay tokenNumber={currentlyServing.tokenNumber} size="lg" isLive={true} />
                  <h4 className="text-lg font-bold mt-4 tracking-tight">
                    {currentlyServing.patientName}
                  </h4>
                  <p className="text-xs text-teal-200/80 mt-1">
                    {activeDoctor?.name} • {activeDept?.name}
                  </p>
                  <p className="text-[11px] text-teal-300/60 mt-0.5">
                    Called at {currentlyServing.calledAt || 'Just now'}
                  </p>
                </div>
              ) : (
                <div className="py-6">
                  <TokenDisplay tokenNumber="---" size="lg" />
                  <p className="text-sm font-semibold text-slate-300 mt-4">
                    Doctor is currently preparing
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Next patient will be called shortly.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-teal-800/60 flex items-center justify-between text-xs text-teal-200/80">
            <span>Avg consultation: ~{activeDoctor?.consultationDuration || 12} mins</span>
            <span>Total today: {totalToday}</span>
          </div>
        </div>

        {/* Card 2: YOUR TOKEN STATUS & ESTIMATED WAIT */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Your Status with {activeDoctor?.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Active patient token and dynamic queue calculations
                </p>
              </div>

              {userTodayApt && (
                <div className="flex items-center gap-2">
                  <StatusBadge status={userTodayApt.status} />
                  <PriorityBadge priority={userTodayApt.priority} />
                </div>
              )}
            </div>

            {userTodayApt ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
                {/* Your Token */}
                <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/50 text-center">
                  <span className="text-[11px] font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider block mb-1">
                    Your Token
                  </span>
                  <TokenDisplay tokenNumber={userTodayApt.tokenNumber} size="md" />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                    Slot: {userTodayApt.timeSlot}
                  </p>
                </div>

                {/* Queue Position */}
                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50 text-center">
                  <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider block mb-1">
                    Queue Position
                  </span>
                  <div className="text-3xl font-black text-amber-600 dark:text-amber-400">
                    {userWaitStats?.statusText || `#${userWaitStats?.position}`}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                    {userWaitStats?.patientsAhead > 0
                      ? `${userWaitStats.patientsAhead} patient(s) ahead`
                      : 'You are next!'}
                  </p>
                </div>

                {/* Estimated Wait */}
                <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-center">
                  <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider block mb-1">
                    Estimated Wait
                  </span>
                  <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
                    ~{userWaitStats?.waitMinutes || 0}m
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                    Calculated dynamically
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-center my-4">
                <Users className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  No Active Token for this Doctor Today
                </h5>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                  You do not have a booked appointment with {activeDoctor?.name} for today.
                </p>
                <button
                  onClick={handleSimulateQuickBooking}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Book Walk-in Token Now
                </button>
              </div>
            )}
          </div>

          {/* Interactive Live Simulation Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Play className="w-3.5 h-3.5 text-teal-600" />
                Live Demo Simulation:
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSimulateCallNext}
                className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-all inline-flex items-center gap-1"
                title="Simulates Admin calling the next patient in queue"
              >
                <UserCheck className="w-3.5 h-3.5" /> Call Next Patient
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QUEUE TIMELINE / SEQUENCE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Current Waiting Line ({waitingList.length} waiting)
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live sequential order for {activeDoctor?.name}
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Completed ({completedList.length})
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Waiting ({waitingList.length})
            </span>
          </div>
        </div>

        {waitingList.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Queue is clear for this doctor!
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              All waiting patients have been served or no appointments are currently in line.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {waitingList.map((apt, index) => {
              const isCurrentUser =
                userTodayApt && apt.id === userTodayApt.id;
              const estWait = (index + (currentlyServing ? 1 : 0)) * (activeDoctor?.consultationDuration || 12);

              return (
                <div
                  key={apt.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isCurrentUser
                      ? 'border-teal-500 bg-teal-50/60 dark:bg-teal-950/40 shadow-md ring-2 ring-teal-500/20'
                      : apt.priority === 'Emergency'
                      ? 'border-rose-300 bg-rose-50/50 dark:bg-rose-950/30'
                      : 'border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center flex-shrink-0">
                      #{index + 1}
                    </div>
                    <TokenDisplay tokenNumber={apt.tokenNumber} size="sm" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {apt.patientName}
                        </h5>
                        {isCurrentUser && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-600 text-white">
                            YOU
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Slot: {apt.timeSlot} • {apt.reason || 'General Consult'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <PriorityBadge priority={apt.priority} />
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                        ~{estWait} min wait
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {index === 0 ? 'Next in line' : `${index} patient(s) ahead`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
