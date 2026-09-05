import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from './BrandLogo';
import {
  Bell,
  Sun,
  Moon,
  User,
  ShieldCheck,
  Menu,
  X,
  Radio,
  Calendar,
  Stethoscope,
  Building2,
  Clock,
  History,
  LayoutDashboard,
  Home,
  CheckCircle2,
} from 'lucide-react';

export const Navbar = () => {
  const {
    theme,
    toggleTheme,
    role,
    setRole,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    patientProfile,
  } = useApp();

  const location = useLocation();
  const navigate = useNavigate();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsNotifOpen(false);
  }, [location.pathname]);

  const patientNavLinks = [
    { name: 'Home', path: '/patient/dashboard', icon: Home },
    { name: 'Doctors', path: '/doctors', icon: Stethoscope },
    { name: 'Departments', path: '/departments', icon: Building2 },
    { name: 'Appointments', path: '/appointments', icon: Calendar },
    { name: 'Queue', path: '/queue', icon: Radio },
    { name: 'History', path: '/history', icon: History },
  ];

  const adminNavLinks = [
    { name: 'Overview', path: '/admin' },
    { name: 'Queue', path: '/admin/queue' },
    { name: 'Appointments', path: '/admin/appointments' },
    { name: 'Doctors', path: '/admin/doctors' },
    { name: 'Departments', path: '/admin/departments' },
    { name: 'Analytics', path: '/admin/analytics' },
  ];

  const currentNavLinks = role === 'admin' ? adminNavLinks : patientNavLinks;

  const handleRoleToggle = (targetRole) => {
    setRole(targetRole);
    if (targetRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/patient/dashboard');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Desktop Nav */}
            <div className="flex items-center gap-8">
              <Link to="/" className="group">
                <BrandLogo size="md" showTagline={false} />
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-1">
                {currentNavLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 font-bold'
                          : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Role Toggle */}
              <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                <button
                  onClick={() => handleRoleToggle('patient')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    role === 'patient'
                      ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                  }`}
                >
                  Patient
                </button>
                <button
                  onClick={() => handleRoleToggle('admin')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    role === 'admin'
                      ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                  }`}
                >
                  Staff
                </button>
              </div>

              {/* Book Action for patient */}
              {role === 'patient' && (
                <Link
                  to="/book-appointment"
                  className="hidden sm:inline-flex mq-btn-primary text-xs py-2 px-3.5"
                >
                  Book Appointment
                </Link>
              )}

              {/* Notifications Dropdown */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Popover */}
                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg p-4 z-50 animate-fade-in space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Notifications ({unreadCount} unread)
                      </span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-4">No notifications</p>
                      ) : (
                        notifications.slice(0, 5).map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => markNotificationAsRead(notif.id)}
                            className={`p-2.5 rounded-lg text-xs cursor-pointer transition-all ${
                              notif.read
                                ? 'bg-slate-50/50 dark:bg-slate-800/40 text-slate-500'
                                : 'bg-teal-50/80 dark:bg-teal-950/40 text-slate-900 dark:text-slate-100 border border-teal-100 dark:border-teal-900'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold">{notif.title}</span>
                              <span className="text-[10px] text-slate-400">{notif.timestamp || 'Just now'}</span>
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">{notif.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-3 border-t border-slate-100 dark:border-slate-800 space-y-1 animate-fade-in">
              {currentNavLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* Mobile Bottom Navigation for Patient View */}
      {role === 'patient' && (
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg">
          <Link
            to="/patient/dashboard"
            className={`flex flex-col items-center gap-1 p-1.5 text-[10px] font-medium transition-colors ${
              location.pathname === '/patient/dashboard'
                ? 'text-teal-700 dark:text-teal-400 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Home className="w-4 h-4" />
            Home
          </Link>

          <Link
            to="/appointments"
            className={`flex flex-col items-center gap-1 p-1.5 text-[10px] font-medium transition-colors ${
              location.pathname === '/appointments'
                ? 'text-teal-700 dark:text-teal-400 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Appointments
          </Link>

          <Link
            to="/queue"
            className={`flex flex-col items-center gap-1 p-1.5 text-[10px] font-medium transition-colors ${
              location.pathname === '/queue'
                ? 'text-teal-700 dark:text-teal-400 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Radio className="w-4 h-4" />
            Queue
          </Link>

          <Link
            to="/history"
            className={`flex flex-col items-center gap-1 p-1.5 text-[10px] font-medium transition-colors ${
              location.pathname === '/history'
                ? 'text-teal-700 dark:text-teal-400 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            History
          </Link>

          <Link
            to="/profile"
            className={`flex flex-col items-center gap-1 p-1.5 text-[10px] font-medium transition-colors ${
              location.pathname === '/profile'
                ? 'text-teal-700 dark:text-teal-400 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            Profile
          </Link>
        </nav>
      )}
    </>
  );
};
