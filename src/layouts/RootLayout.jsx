import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { MobileNav } from '../components/common/MobileNav';
import { Footer } from '../components/common/Footer';
import { ToastContainer } from '../components/common/ToastContainer';
import { useApp } from '../context/AppContext';
import { ShieldCheck, User } from 'lucide-react';

export const RootLayout = () => {
  const { role, setRole } = useApp();
  const location = useLocation();

  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      {/* Role Banner / Quick Switcher Strip */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">Demo Environment:</span>
            <span className="font-bold text-teal-400 capitalize">{role} Experience</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400 hidden md:inline">
              Switch role instantly:
            </span>
            <button
              onClick={() => setRole(role === 'admin' ? 'patient' : 'admin')}
              className="text-[11px] font-bold text-white bg-teal-600 hover:bg-teal-500 px-2.5 py-0.5 rounded-md transition-colors inline-flex items-center gap-1"
            >
              {role === 'admin' ? (
                <>
                  <User className="w-3 h-3" /> Switch to Patient View
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3 h-3" /> Switch to Hospital Admin
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Navigation */}
      <Navbar />

      {/* Main App Content Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Navigation Touch Bar */}
      <MobileNav />

      {/* Global Toast Stack */}
      <ToastContainer />
    </div>
  );
};
