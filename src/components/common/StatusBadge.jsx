import React from 'react';

export const StatusBadge = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs sm:text-sm px-2.5 py-1',
    lg: 'text-sm sm:text-base px-3.5 py-1.5 font-semibold',
  };

  const statusStyles = {
    'Booked': 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
    'Waiting': 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
    'Called': 'bg-teal-50 text-teal-700 border border-teal-300 animate-pulse dark:bg-teal-950/50 dark:text-teal-200 dark:border-teal-700',
    'In Consultation': 'bg-primary-100 text-primary-800 border border-primary-300 dark:bg-primary-950 dark:text-primary-200 dark:border-primary-700',
    'Completed': 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
    'Cancelled': 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800',
    'Skipped': 'bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  };

  const style = statusStyles[status] || statusStyles['Waiting'];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium tracking-wide shadow-sm transition-all ${sizeClasses[size]} ${style}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === 'In Consultation' || status === 'Called'
            ? 'bg-primary-500 animate-ping'
            : status === 'Completed'
            ? 'bg-emerald-500'
            : status === 'Cancelled'
            ? 'bg-rose-500'
            : status === 'Waiting'
            ? 'bg-amber-500'
            : 'bg-blue-500'
        }`}
      />
      {status}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  if (priority === 'Emergency') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-700 animate-pulse">
        <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
        Emergency
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
      Normal
    </span>
  );
};

export const TokenDisplay = ({ tokenNumber, size = 'md', isLive = false }) => {
  const sizeClasses = {
    sm: 'text-sm font-bold px-2 py-1',
    md: 'text-lg sm:text-xl font-extrabold px-3.5 py-1.5',
    lg: 'text-3xl sm:text-4xl font-black px-6 py-3 tracking-wider',
  };

  return (
    <div
      className={`inline-flex items-center justify-center font-mono rounded-xl transition-all ${sizeClasses[size]} ${
        isLive
          ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/25 ring-4 ring-teal-500/20'
          : 'bg-teal-50 text-teal-800 border-2 border-teal-200 dark:bg-teal-950/80 dark:text-teal-200 dark:border-teal-700'
      }`}
    >
      {tokenNumber || '---'}
    </div>
  );
};
