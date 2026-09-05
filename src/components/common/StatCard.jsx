import React from 'react';

export const StatCard = ({ title, value, icon: Icon, subtitle, color = 'teal', trend = null, onClick = null }) => {
  const colorMap = {
    teal: {
      bg: 'bg-teal-50 dark:bg-teal-950/40',
      border: 'border-teal-100 dark:border-teal-900/50',
      iconBg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
      accent: 'text-teal-600 dark:text-teal-400',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-100 dark:border-amber-900/50',
      iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      accent: 'text-amber-600 dark:text-amber-400',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-100 dark:border-emerald-900/50',
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      accent: 'text-emerald-600 dark:text-emerald-400',
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      border: 'border-rose-100 dark:border-rose-900/50',
      iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
      accent: 'text-rose-600 dark:text-rose-400',
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      border: 'border-blue-100 dark:border-blue-900/50',
      iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      accent: 'text-blue-600 dark:text-blue-400',
    },
  };

  const scheme = colorMap[color] || colorMap.teal;

  return (
    <div
      onClick={onClick}
      className={`relative p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border ${
        scheme.border
      } shadow-card hover:shadow-elevated transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {value}
            </h3>
            {trend && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {trend}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 sm:p-3.5 rounded-2xl ${scheme.iconBg}`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export const EmptyState = ({ icon: Icon, title, description, actionText, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 my-6">
      {Icon && (
        <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 mb-4 ring-8 ring-teal-50/50 dark:ring-teal-950/20">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm shadow-md shadow-teal-600/20 hover:shadow-lg transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
