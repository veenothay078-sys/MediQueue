import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="py-20 text-center space-y-6 max-w-md mx-auto animate-fade-in">
      <div className="w-16 h-16 rounded-3xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto shadow-md">
        <Activity className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
          404 Error
        </span>
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          The healthcare queue route you requested could not be located in the MediQueue system.
        </p>
      </div>

      <div className="pt-4 flex items-center justify-center gap-3">
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md inline-flex items-center gap-2"
        >
          <Home className="w-4 h-4" /> Return to Home
        </Link>
      </div>
    </div>
  );
};
