import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { User, ShieldCheck, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LoginPage = () => {
  const { setRole, patientProfile } = useApp();
  const navigate = useNavigate();

  const handleSelectRole = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/patient/dashboard');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 animate-slide-up">
      <div className="text-center mb-10 space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-teal-600/25">
          <Activity className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Welcome to MediQueue
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Choose a demo user role below to explore the patient self-service experience or hospital operational management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PATIENT ROLE CARD */}
        <div
          onClick={() => handleSelectRole('patient')}
          className="group cursor-pointer p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-400 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <User className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Continue as Patient
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Book doctor appointments, receive digital queue tokens, track wait times live, and manage profile history.
            </p>

            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
                Active profile: <strong>{patientProfile.name}</strong>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
                Interactive 5-step booking wizard
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
                Real-time queue estimated wait tracker
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-teal-600 dark:text-teal-400">
            <span>Launch Patient Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* ADMIN ROLE CARD */}
        <div
          onClick={() => handleSelectRole('admin')}
          className="group cursor-pointer p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-400 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Continue as Hospital Admin
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Operate live calling stations, call next patient, manage doctor roster, trigger emergency priority, and analyze hospital throughput.
            </p>

            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                Live queue calling console & room management
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                Doctor roster & department manager
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                Operational KPIs & Recharts analytics
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
            <span>Launch Hospital Operations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
