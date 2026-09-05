import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Shield, HeartHandshake, Info } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors mt-auto pb-16 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Medi<span className="text-teal-600 dark:text-teal-400">Queue</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              Less Waiting. More Care. MediQueue is an intelligent appointment and live hospital queue management system designed for transparent patient experiences and streamlined healthcare operations.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/50 max-w-md">
              <Info className="w-4 h-4 flex-shrink-0 text-amber-600" />
              <span>
                <strong>Disclaimer:</strong> MediQueue is a demonstration appointment and queue-management platform and is not a medical emergency or diagnostic service.
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Patient Services
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/book-appointment" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link to="/queue" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Live Queue Tracker
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link to="/departments" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Hospital Departments
                </Link>
              </li>
              <li>
                <Link to="/appointments" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  My Appointments
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin & Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Hospital Operations
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/admin" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/queue" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Queue Call Station
                </Link>
              </li>
              <li>
                <Link to="/admin/doctors" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Doctor Roster
                </Link>
              </li>
              <li>
                <Link to="/admin/departments" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Department Management
                </Link>
              </li>
              <li>
                <Link to="/admin/analytics" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Operational Analytics
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
          <p>© {new Date().getFullYear()} MediQueue Healthcare Systems. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-teal-600" />
              Secure Client Persistence
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5 text-rose-500" />
              Patient First
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
