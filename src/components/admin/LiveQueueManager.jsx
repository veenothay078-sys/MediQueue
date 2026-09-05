import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getSortedQueueForDoctor, formatDateDisplay } from '../../utils/queueCalculations';
import { StatusBadge, PriorityBadge, TokenDisplay } from '../common/StatusBadge';
import { getTodayDateStr } from '../../data/initialData';
import { announceTokenVoice } from '../../utils/audioAnnouncer';
import {
  UserCheck,
  CheckCircle2,
  SkipForward,
  AlertTriangle,
  Stethoscope,
  Clock,
  Radio,
  RotateCcw,
  Sparkles,
  MapPin,
  Flame,
  Volume2,
} from 'lucide-react';

export const LiveQueueManager = () => {
  const {
    appointments,
    doctors,
    departments,
    callNextPatient,
    completeAppointment,
    skipPatient,
    setEmergencyPriority,
    updateAppointmentStatus,
  } = useApp();

  const [selectedDocId, setSelectedDocId] = useState(doctors[0]?.id || 'doc-1');
  const todayStr = getTodayDateStr();

  const activeDoc = doctors.find((d) => d.id === selectedDocId) || doctors[0];
  const { currentlyServing, waitingList, completedList, skippedList, totalToday } =
    getSortedQueueForDoctor(selectedDocId, appointments, todayStr);

  return (
    <div className="space-y-6">
      {/* Header with Doctor Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Radio className="w-5 h-5 text-teal-600 animate-pulse" />
            Live Queue Station & Calling Console
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage patient flow, call next tokens, trigger emergency priority, and track room consults.
          </p>
        </div>

        {/* Doctor selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Active Roster:
          </label>
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name} ({doc.departmentName}) - {doc.roomNumber}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hero: Current Patient in Room */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-elevated flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs">
              <span className="font-bold text-teal-400 uppercase tracking-wider">
                Current Room Status
              </span>
              <span className="font-mono text-slate-400">{activeDoc?.roomNumber}</span>
            </div>

            {currentlyServing ? (
              <div className="text-center my-4 space-y-3">
                <TokenDisplay tokenNumber={currentlyServing.tokenNumber} size="lg" isLive={true} />
                <h3 className="text-xl font-black">{currentlyServing.patientName}</h3>
                <p className="text-xs text-slate-300">
                  {currentlyServing.reason || 'General Consultation'}
                </p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <PriorityBadge priority={currentlyServing.priority} />
                  <StatusBadge status={currentlyServing.status} />
                </div>
                <p className="text-[11px] text-teal-300">
                  Called at {currentlyServing.calledAt || '10:00 AM'}
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <TokenDisplay tokenNumber="---" size="lg" />
                <p className="text-sm font-bold text-slate-300 mt-4">Room is currently empty</p>
                <p className="text-xs text-slate-500 mt-1">Ready to call next patient.</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <button
              onClick={() => {
                callNextPatient(selectedDocId);
              }}
              className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-600/30 transition-all flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              Call Next Patient
            </button>
            {currentlyServing && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    announceTokenVoice(
                      currentlyServing.tokenNumber,
                      currentlyServing.patientName,
                      activeDoc?.roomNumber || 'Room 101'
                    )
                  }
                  className="py-2.5 px-3 rounded-xl bg-teal-900/60 hover:bg-teal-900 text-teal-200 text-xs font-bold border border-teal-700 transition-colors flex items-center justify-center gap-1.5"
                  title="Broadcast Voice Call Announcement"
                >
                  <Volume2 className="w-3.5 h-3.5 text-teal-300" />
                  Voice PA
                </button>
                <button
                  onClick={() => completeAppointment(currentlyServing.id)}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Complete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Strip */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Total Today</span>
            <div className="text-3xl font-black text-slate-900 dark:text-slate-100 my-2">
              {totalToday}
            </div>
            <span className="text-[11px] text-slate-500">Scheduled patients</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col justify-between">
            <span className="text-xs font-bold uppercase text-amber-600 dark:text-amber-400">
              Waiting Queue
            </span>
            <div className="text-3xl font-black text-amber-600 dark:text-amber-400 my-2">
              {waitingList.length}
            </div>
            <span className="text-[11px] text-slate-500">In waiting room</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col justify-between">
            <span className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400">
              Completed
            </span>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 my-2">
              {completedList.length}
            </div>
            <span className="text-[11px] text-slate-500">Served today</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Skipped</span>
            <div className="text-3xl font-black text-slate-700 dark:text-slate-300 my-2">
              {skippedList.length}
            </div>
            <span className="text-[11px] text-slate-500">Temporarily skipped</span>
          </div>
        </div>
      </div>

      {/* Waiting Queue Interactive Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Waiting Queue ({waitingList.length} Patients)
          </h3>
          <span className="text-xs text-slate-400">
            Ordered by: Emergency Priority first, then Queue Token Sequence
          </span>
        </div>

        {waitingList.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            No patients currently in the waiting list for {activeDoc?.name}.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Token</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Slot</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {waitingList.map((apt, index) => {
                  const isEmergency = apt.priority === 'Emergency';
                  return (
                    <tr
                      key={apt.id}
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                        isEmergency ? 'bg-rose-50/40 dark:bg-rose-950/20 font-semibold' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-bold text-slate-400">#{index + 1}</td>
                      <td className="py-3 px-4">
                        <TokenDisplay tokenNumber={apt.tokenNumber} size="sm" />
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-slate-100">
                          {apt.patientName}
                        </div>
                        <div className="text-[11px] text-slate-400">{apt.reason}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">
                        {apt.timeSlot}
                      </td>
                      <td className="py-3 px-4">
                        <PriorityBadge priority={apt.priority} />
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={apt.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Emergency Toggle */}
                          <button
                            onClick={() => setEmergencyPriority(apt.id, !isEmergency)}
                            title={isEmergency ? 'Remove emergency flag' : 'Mark as Emergency'}
                            className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                              isEmergency
                                ? 'bg-rose-600 text-white border-rose-600'
                                : 'hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 border-rose-200 dark:border-rose-900'
                            }`}
                          >
                            <Flame className="w-3.5 h-3.5" />
                          </button>

                          {/* Skip */}
                          <button
                            onClick={() => skipPatient(apt.id)}
                            title="Skip patient"
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-colors"
                          >
                            Skip
                          </button>

                          {/* Call this specific patient directly */}
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'In Consultation')}
                            className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm"
                          >
                            Call Direct
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SKIPPED PATIENTS SECTION */}
      {skippedList.length > 0 && (
        <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
            <SkipForward className="w-4 h-4 text-amber-500" />
            Skipped Patients ({skippedList.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {skippedList.map((apt) => (
              <div
                key={apt.id}
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300 block">
                    {apt.tokenNumber} — {apt.patientName}
                  </span>
                  <span className="text-[11px] text-slate-400">Slot: {apt.timeSlot}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateAppointmentStatus(apt.id, 'Waiting')}
                    className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800 hover:bg-teal-100"
                  >
                    Re-queue
                  </button>
                  <button
                    onClick={() => completeAppointment(apt.id)}
                    className="px-2.5 py-1 rounded-lg hover:bg-emerald-50 text-emerald-600 font-semibold"
                  >
                    Done
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
