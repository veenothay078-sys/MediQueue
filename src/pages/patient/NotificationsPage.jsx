import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCircle2, AlertCircle, Info, AlertTriangle, Trash2, Check, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotificationsPage = () => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
  } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Bell className="w-3.5 h-3.5" />
            Alerts & Activity
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Notification Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            System updates, live queue reminders, and consultation confirmations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-3.5 h-3.5" /> Mark All Read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearNotifications}
              className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-xs sm:text-sm space-y-2">
          <Bell className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            No notifications in your inbox.
          </p>
          <p className="text-xs text-slate-400">
            You will receive updates when appointments are booked or queue tokens advance.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const icons = {
              success: <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
              error: <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />,
              warning: <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />,
              info: <Info className="w-5 h-5 text-teal-500 flex-shrink-0" />,
            };

            return (
              <div
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                  !notif.read
                    ? 'bg-teal-50/50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="mt-0.5">{icons[notif.type] || icons.info}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {notif.title}
                    </h3>
                    {notif.tokenNumber && (
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {notif.tokenNumber}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="flex items-center justify-between mt-3 text-[11px] text-slate-400">
                    <span>{new Date(notif.timestamp).toLocaleString()}</span>
                    {notif.link && (
                      <Link
                        to={notif.link}
                        className="text-teal-600 dark:text-teal-400 font-bold hover:underline"
                      >
                        Open Action →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
