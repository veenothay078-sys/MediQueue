import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QueueProgress } from '../../components/patient/QueueProgress';
import { QueueWarpSimulator } from '../../components/unique/QueueWarpSimulator';
import { getTodayDateStr } from '../../data/initialData';
import {
  calculateEstimatedWaitTime,
  getSortedQueueForDoctor,
  formatDateDisplay,
} from '../../utils/queueCalculations';
import {
  Radio,
  Clock,
  Users,
  Stethoscope,
  Volume2,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

export const QueueTrackerPage = () => {
  const { appointments, doctors, departments, patientProfile } = useApp();
  const todayStr = getTodayDateStr();

  // Find user's active today appointment
  const userApt = appointments.find(
    (a) =>
      a.date === todayStr &&
      (a.patientEmail === patientProfile.email || a.patientName === patientProfile.name) &&
      a.status !== 'Cancelled'
  );

  const [selectedDocId, setSelectedDocId] = useState(
    userApt?.doctorId || doctors[0]?.id || 'doc-1'
  );

  const activeDoc = doctors.find((d) => d.id === selectedDocId) || doctors[0];
  const { currentlyServing, waitingList, completedList } =
    getSortedQueueForDoctor(selectedDocId, appointments, todayStr);

  const waitStats = userApt
    ? calculateEstimatedWaitTime(userApt.id, appointments, doctors)
    : null;

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto animate-fade-in">
      {/* ── 1. HEADER & DOCTOR SELECTOR ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Live Hospital Queue • {formatDateDisplay(todayStr)}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
            Queue Tracker & Waiting Status
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time queue monitoring, estimated wait times, and calling status.
          </p>
        </div>

        {/* Doctor selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <label className="text-xs font-semibold text-slate-500 uppercase">
            Physician:
          </label>
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="mq-input text-xs font-semibold py-2 px-3 w-auto"
          >
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name} ({doc.departmentName}) - {doc.roomNumber}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── 2. PROMINENT USER TOKEN SUMMARY CARD (If user has appointment today) ── */}
      {userApt && (
        <div className="mq-card p-6 sm:p-7 bg-teal-800 text-white shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-200 block">
                Your Queue Token
              </span>
              <div className="text-4xl sm:text-5xl font-bold font-mono text-white tracking-tight">
                {userApt.tokenNumber}
              </div>
              <p className="text-sm text-teal-100 font-medium">
                {userApt.departmentName} • {userApt.doctorName} • {userApt.roomNumber || 'Room 02'}
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 bg-black/20 p-4 rounded-xl border border-white/10 self-start md:self-auto">
              <div>
                <span className="text-xs text-teal-300 font-semibold uppercase block">
                  People Ahead
                </span>
                <span className="text-2xl sm:text-3xl font-bold font-mono text-white mt-0.5 block">
                  {waitStats?.patientsAhead || 0}
                </span>
              </div>

              <div>
                <span className="text-xs text-teal-300 font-semibold uppercase block">
                  Estimated Wait
                </span>
                <span className="text-2xl sm:text-3xl font-bold font-mono text-teal-300 mt-0.5 block">
                  ~{waitStats?.estimatedWaitMinutes || 18}m
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. STRUCTURED QUEUE PROGRESS COMPONENT ── */}
      <QueueProgress
        doctor={activeDoc}
        currentlyServing={currentlyServing}
        waitingList={waitingList}
        completedList={completedList}
        userAppointment={userApt}
      />

      {/* ── 4. TIME-LAPSE SIMULATOR ── */}
      <QueueWarpSimulator />
    </div>
  );
};
