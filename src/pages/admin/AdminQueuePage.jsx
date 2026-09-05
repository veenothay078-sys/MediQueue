import React from 'react';
import { LiveQueueManager } from '../../components/admin/LiveQueueManager';
import { ShieldAlert, Radio } from 'lucide-react';

export const AdminQueuePage = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          Real-Time Operations
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Queue Management & Calling Console
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Control physician calling stations, advance queue sequences, handle skipped cases, and triage emergency tokens.
        </p>
      </div>

      <LiveQueueManager />
    </div>
  );
};
