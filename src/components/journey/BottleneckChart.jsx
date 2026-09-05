import React from 'react';
import { AlertTriangle, Clock, Users, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const BottleneckChart = ({ departments, doctors, appointments }) => {
  // Compute bottleneck stats dynamically
  const bottleneckStats = departments
    .map((dept) => {
      const deptWaiting = appointments.filter(
        (a) => a.departmentId === dept.id && (a.status === 'Waiting' || a.status === 'Booked')
      );
      const waitingCount = deptWaiting.length;
      const avgWaitMins = waitingCount * 12;
      const isHighLoad = waitingCount >= 4;

      return {
        id: dept.id,
        name: dept.name,
        code: dept.code,
        waitingCount,
        avgWaitMins,
        isHighLoad,
      };
    })
    .sort((a, b) => b.waitingCount - a.waitingCount);

  const maxWaiting = Math.max(...bottleneckStats.map((b) => b.waitingCount), 1);

  return (
    <div className="journey-card rounded-3xl p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Flow Intelligence
            </span>
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
            Hospital Bottlenecks & Queue Pressure
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Calculated dynamically from real-time wait lines
        </span>
      </div>

      {/* Bottleneck Bar Visualizer */}
      <div className="space-y-4">
        {bottleneckStats.map((dept) => {
          const percentage = Math.round((dept.waitingCount / maxWaiting) * 100);

          return (
            <div key={dept.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {dept.name}
                  </span>
                  {dept.isHighLoad && (
                    <span className="px-1.5 py-0.2 text-[10px] font-bold font-mono rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300">
                      High Load
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {dept.waitingCount} waiting
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    (~{dept.avgWaitMins} min)
                  </span>
                </div>
              </div>

              {/* Transit-style Bar Gauge */}
              <div className="w-full h-3 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    dept.isHighLoad
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                      : 'bg-gradient-to-r from-teal-600 to-emerald-500'
                  }`}
                  style={{ width: `${Math.max(percentage, 6)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
        <Clock className="w-4 h-4 text-teal-600 flex-shrink-0" />
        <span>
          Bottlenecks update in real-time as patients are called into consultation rooms.
        </span>
      </div>
    </div>
  );
};
