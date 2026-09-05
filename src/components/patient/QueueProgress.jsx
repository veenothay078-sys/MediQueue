import React from 'react';
import {
  Stethoscope,
  Clock,
  Users,
  CheckCircle2,
  Volume2,
  Radio,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import { announceTokenVoice } from '../../utils/audioAnnouncer';

export const QueueProgress = ({
  doctor,
  currentlyServing,
  waitingList = [],
  completedList = [],
  userAppointment = null,
}) => {
  const avgConsultTime = doctor?.consultationDuration || 12;
  const roomNumber = doctor?.roomNumber || 'Room 02';

  // Calculate user's index in the waiting list
  const userQueueIndex = userAppointment
    ? waitingList.findIndex((a) => a.id === userAppointment.id)
    : -1;

  const userIsInQueue = userQueueIndex !== -1;
  const userIsServing =
    userAppointment && currentlyServing && userAppointment.id === currentlyServing.id;

  const patientsAhead = userIsInQueue
    ? userQueueIndex + (currentlyServing ? 1 : 0)
    : 0;

  const estimatedWait = userIsInQueue
    ? Math.max(1, patientsAhead * avgConsultTime)
    : 0;

  return (
    <div className="mq-card p-6 sm:p-8 space-y-6">
      {/* Top Header Metrics Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Live Consultation Queue
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {doctor?.name || 'Specialist Physician'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {doctor?.departmentName || 'General Medicine'} • {roomNumber} • Avg {avgConsultTime} min / patient
          </p>
        </div>

        {/* Dynamic Metric Blocks */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-center">
            <span className="text-[11px] font-semibold text-slate-500 block">
              People Ahead
            </span>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {userIsInQueue ? patientsAhead : waitingList.length}
            </span>
          </div>

          <div className="px-4 py-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-100 dark:border-teal-900 text-center">
            <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 block">
              Estimated Wait
            </span>
            <span className="text-xl font-bold text-teal-800 dark:text-teal-300">
              ~{estimatedWait || waitingList.length * avgConsultTime || 12} min
            </span>
          </div>
        </div>
      </div>

      {/* Now Serving Highlight Section */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-white/10 text-teal-300 flex items-center justify-center flex-shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
                Now in Consultation
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-lg font-bold text-white mt-0.5">
              {currentlyServing ? (
                <>
                  Token {currentlyServing.tokenNumber}{' '}
                  <span className="text-xs font-normal text-slate-300">
                    ({currentlyServing.patientName})
                  </span>
                </>
              ) : (
                'Room is currently available'
              )}
            </div>
            <p className="text-xs text-slate-400">
              {doctor?.name} • {roomNumber}
            </p>
          </div>
        </div>

        {currentlyServing && (
          <button
            onClick={() =>
              announceTokenVoice(
                currentlyServing.tokenNumber,
                currentlyServing.patientName,
                roomNumber
              )
            }
            className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors self-start sm:self-auto"
            title="Listen to hospital voice announcement"
          >
            <Volume2 className="w-4 h-4 text-teal-300" />
            Voice Call
          </button>
        )}
      </div>

      {/* Structured Queue List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pb-1">
          <span>Queue Order</span>
          <span>Status / Wait</span>
        </div>

        {/* 1. Currently Serving Item */}
        {currentlyServing && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                ●
              </span>
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {currentlyServing.tokenNumber}
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400 ml-2">
                  {currentlyServing.patientName}
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
              Now Serving
            </span>
          </div>
        )}

        {/* 2. Waiting List Items */}
        {waitingList.length === 0 && !currentlyServing ? (
          <div className="p-8 text-center text-slate-400 text-sm border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            The queue is clear. No patients waiting.
          </div>
        ) : (
          waitingList.map((apt, idx) => {
            const isUser = userAppointment && userAppointment.id === apt.id;
            const isNext = idx === 0;

            return (
              <div
                key={apt.id}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                  isUser
                    ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-600 dark:border-teal-500 shadow-sm'
                    : isNext
                    ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center ${
                      isUser
                        ? 'bg-teal-700 text-white'
                        : isNext
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    #{idx + 1}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {apt.tokenNumber}
                    </span>
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      {apt.patientName}
                    </span>

                    {isUser && (
                      <span className="text-[10px] font-bold uppercase bg-teal-700 text-white px-2 py-0.5 rounded">
                        You
                      </span>
                    )}

                    {apt.priority === 'Emergency' && (
                      <span className="text-[10px] font-bold uppercase bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded border border-rose-200">
                        Priority
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">
                    ~{(idx + 1) * avgConsultTime} min
                  </span>
                  {isNext && (
                    <span className="text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded">
                      Next Up
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Calculation Basis */}
      <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
        <span>
          Wait times calculate dynamically based on average consultation length ({avgConsultTime} min).
        </span>
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          Total Today: {waitingList.length + completedList.length + (currentlyServing ? 1 : 0)} patients
        </span>
      </div>
    </div>
  );
};
