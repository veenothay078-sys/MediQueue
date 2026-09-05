import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Clock,
  Calendar,
  History,
  User,
  ShieldAlert,
  Users,
  Building2,
  BarChart3,
} from 'lucide-react';

export const MobileNav = () => {
  const { role } = useApp();

  const patientTabs = [
    { name: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
    { name: 'Queue', path: '/queue', icon: Clock },
    { name: 'Appointments', path: '/appointments', icon: Calendar },
    { name: 'History', path: '/history', icon: History },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const adminTabs = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Queue', path: '/admin/queue', icon: ShieldAlert },
    { name: 'Appointments', path: '/admin/appointments', icon: Calendar },
    { name: 'Doctors', path: '/admin/doctors', icon: Users },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  ];

  const currentTabs = role === 'admin' ? adminTabs : patientTabs;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-1.5 transition-colors">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {currentTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-teal-600 dark:text-teal-400 font-bold scale-105'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{tab.name}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
