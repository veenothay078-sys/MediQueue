import React from 'react';
import { AdminAppointmentTable } from '../../components/admin/AdminAppointmentTable';
import { Calendar, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminAppointmentsPage = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Calendar className="w-3.5 h-3.5" />
            Registry
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Master Appointment Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Comprehensive audit log and management for all patient bookings across clinical departments.
          </p>
        </div>

        <Link
          to="/book-appointment"
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> Register Walk-in Appointment
        </Link>
      </div>

      <AdminAppointmentTable />
    </div>
  );
};
