import React from 'react';
import { BookingWizard } from '../../components/patient/BookingWizard';
import { Calendar, Sparkles } from 'lucide-react';

export const BookAppointmentPage = () => {
  return (
    <div className="space-y-6 animate-fade-in py-2">
      <div className="text-center max-w-xl mx-auto space-y-2 mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          Seamless Registration
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Book Hospital Appointment
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Select your specialty, choose a qualified doctor, pick your slot, and receive your digital queue token.
        </p>
      </div>

      <BookingWizard />
    </div>
  );
};
