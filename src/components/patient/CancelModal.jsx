import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { AlertCircle, XCircle } from 'lucide-react';

export const CancelModal = ({ isOpen, onClose, appointment }) => {
  const { cancelAppointment } = useApp();
  const [reason, setReason] = useState('Change of plans / Personal conflict');

  if (!appointment) return null;

  const handleConfirmCancel = (e) => {
    e.preventDefault();
    cancelAppointment(appointment.id, reason);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cancel Appointment">
      <form onSubmit={handleConfirmCancel} className="space-y-4">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-800 dark:text-rose-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
          <div>
            <p className="font-bold text-sm">Cancel this appointment?</p>
            <p className="mt-1 leading-relaxed">
              Your booked token <strong className="font-mono">{appointment.tokenNumber}</strong> for{' '}
              {appointment.doctorName} on {appointment.date} will be released. You will need to book a new appointment if you wish to consult later.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Reason for cancellation
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
          >
            <option value="Change of plans / Personal conflict">Change of plans / Personal conflict</option>
            <option value="Feeling better / No longer needed">Feeling better / No longer needed</option>
            <option value="Doctor unavailable / Rescheduling required">Doctor unavailable</option>
            <option value="Consulting elsewhere">Consulting elsewhere</option>
            <option value="Other">Other reason</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Keep Appointment
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all inline-flex items-center gap-1.5"
          >
            <XCircle className="w-3.5 h-3.5" />
            Yes, Cancel Appointment
          </button>
        </div>
      </form>
    </Modal>
  );
};
