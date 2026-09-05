import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, AlertTriangle, RotateCw } from 'lucide-react';
import { getTodayDateStr, getOffsetDateStr } from '../../data/initialData';

const AVAILABLE_TIME_SLOTS = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '01:00 PM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
];

export const RescheduleModal = ({ isOpen, onClose, appointment }) => {
  const { rescheduleAppointment } = useApp();
  const [selectedDate, setSelectedDate] = useState(getTodayDateStr());
  const [selectedSlot, setSelectedSlot] = useState(appointment?.timeSlot || '10:00 AM');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!appointment) return null;

  const handleConfirm = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    rescheduleAppointment(appointment.id, selectedDate, selectedSlot);
    setIsSubmitting(false);
    onClose();
  };

  const minDate = getTodayDateStr();
  const maxDate = getOffsetDateStr(30);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reschedule Appointment">
      <form onSubmit={handleConfirm} className="space-y-5">
        <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/50 text-xs text-slate-700 dark:text-slate-300">
          <p className="font-semibold text-teal-800 dark:text-teal-200 mb-1">
            Current Appointment: Token {appointment.tokenNumber}
          </p>
          <p>
            {appointment.doctorName} • {appointment.departmentName}
          </p>
          <p className="text-slate-500">
            Originally scheduled for {appointment.date} at {appointment.timeSlot}
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Select New Date
          </label>
          <div className="relative">
            <input
              type="date"
              min={minDate}
              max={maxDate}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Select New Time Slot
          </label>
          <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
            {AVAILABLE_TIME_SLOTS.map((slot) => {
              const isSelected = selectedSlot === slot;
              return (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2 px-2 text-xs rounded-xl font-semibold border transition-all text-center ${
                    isSelected
                      ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-400'
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition-all inline-flex items-center gap-1.5"
          >
            <RotateCw className="w-3.5 h-3.5" />
            Confirm Reschedule
          </button>
        </div>
      </form>
    </Modal>
  );
};
