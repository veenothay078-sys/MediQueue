import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />,
          info: <Info className="w-5 h-5 text-teal-500 flex-shrink-0" />,
        };

        const borderStyles = {
          success: 'border-emerald-200 dark:border-emerald-900/60 bg-white/95 dark:bg-slate-900/95',
          error: 'border-rose-200 dark:border-rose-900/60 bg-white/95 dark:bg-slate-900/95',
          warning: 'border-amber-200 dark:border-amber-900/60 bg-white/95 dark:bg-slate-900/95',
          info: 'border-teal-200 dark:border-teal-900/60 bg-white/95 dark:bg-slate-900/95',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-elevated border backdrop-blur-md transition-all animate-slide-up ${
              borderStyles[toast.type] || borderStyles.info
            }`}
          >
            <div className="mt-0.5">{icons[toast.type] || icons.info}</div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {toast.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
