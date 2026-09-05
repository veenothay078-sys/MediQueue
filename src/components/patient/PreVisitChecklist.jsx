import React, { useState } from 'react';
import { CheckSquare, Square, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export const PreVisitChecklist = () => {
  const [items, setItems] = useState([
    { id: 1, text: 'Bring Photo ID and Health Insurance Card', done: true },
    { id: 2, text: 'List current medications, dosages & vitamins', done: true },
    { id: 3, text: 'Prepare questions for the doctor', done: false },
    { id: 4, text: 'Arrive at hospital waiting lounge 10 mins prior', done: false },
  ]);

  const toggleItem = (id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const completedCount = items.filter((i) => i.done).length;
  const progress = Math.round((completedCount / items.length) * 100);

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Pre-Consultation Checklist
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {completedCount} of {items.length} items ready ({progress}%)
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-teal-600 dark:text-teal-400 font-mono">
          {progress}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-teal-600 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Checklist items */}
      <div className="space-y-2 pt-1">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 text-xs font-medium ${
              item.done
                ? 'border-teal-200 dark:border-teal-900/50 bg-teal-50/40 dark:bg-teal-950/20 text-slate-900 dark:text-slate-100'
                : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            {item.done ? (
              <CheckSquare className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
            ) : (
              <Square className="w-4 h-4 text-slate-400 flex-shrink-0" />
            )}
            <span className={item.done ? 'line-through text-slate-400 dark:text-slate-500' : ''}>
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
