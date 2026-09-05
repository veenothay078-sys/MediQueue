import React from 'react';
import { AnalyticsCharts } from '../../components/admin/AnalyticsCharts';
import { BarChart3, TrendingUp, Clock, Users } from 'lucide-react';

export const AdminAnalyticsPage = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
          <BarChart3 className="w-3.5 h-3.5" />
          Executive Intelligence
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Hospital Analytics & Throughput Metrics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Real-time metrics, appointment completion velocity, queue distribution, and doctor workload efficiency.
        </p>
      </div>

      <AnalyticsCharts />
    </div>
  );
};
