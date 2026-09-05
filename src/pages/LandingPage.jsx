import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  CalendarCheck,
  Clock,
  Radio,
  CheckCircle2,
  Stethoscope,
  Building2,
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ChevronRight,
  HeartHandshake,
  Activity,
} from 'lucide-react';

export const LandingPage = () => {
  const { departments, doctors } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If launched as installed mobile PWA, jump straight to the Patient App Dashboard
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      location.search.includes('source=pwa');

    if (isStandalone) {
      navigate('/patient/dashboard', { replace: true });
    }
  }, [navigate, location]);

  return (
    <div className="space-y-16 sm:space-y-24 py-6 max-w-7xl mx-auto">
      {/* ── 1. HERO SECTION ── */}
      <section className="text-center space-y-6 pt-6 pb-2 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          Next-Generation Clinical Flow & Smart Navigation
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.1]">
          Never wait in the dark. <br />
          <span className="text-teal-700 dark:text-teal-400">
            Arrive exactly when it's your turn.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Real-time queue transparency, instant doctor availability, and live wait forecasts designed for a calm, stress-free hospital experience.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Link
            to="/book-appointment"
            className="w-full sm:w-auto mq-btn-primary py-3.5 px-6 text-sm"
          >
            Book an Appointment
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/queue"
            className="w-full sm:w-auto mq-btn-secondary py-3.5 px-6 text-sm"
          >
            <Radio className="w-4 h-4 text-teal-600" />
            Explore Live Queue
          </Link>
        </div>

        {/* ── 2. HERO PREVIEW CARD (Clean Product Demonstration) ── */}
        <div className="mt-12 mq-card p-6 sm:p-8 text-left bg-white dark:bg-slate-900 border border-slate-200 shadow-md">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 text-xs">
            <span className="font-semibold text-slate-500 uppercase tracking-wider">
              Sample Patient Flow
            </span>
            <span className="text-teal-700 dark:text-teal-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Live Simulation
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <span className="text-xs text-slate-400 font-semibold block uppercase">
                01. Book Slot
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 block">
                General Medicine
              </span>
              <span className="text-xs text-slate-500">Dr. Priya Sharma • 10:30 AM</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <span className="text-xs text-slate-400 font-semibold block uppercase">
                02. Digital Token
              </span>
              <span className="text-2xl font-bold font-mono text-teal-700 dark:text-teal-400 mt-0.5 block">
                A-027
              </span>
              <span className="text-xs text-slate-500">Verified at check-in</span>
            </div>

            <div className="p-4 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900">
              <span className="text-xs text-teal-700 dark:text-teal-400 font-semibold block uppercase">
                03. Live Queue
              </span>
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5 block">
                4 Ahead
              </span>
              <span className="text-xs text-teal-800 dark:text-teal-300">~18 min estimated wait</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <span className="text-xs text-slate-400 font-semibold block uppercase">
                04. Consultation
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 block">
                Room 02
              </span>
              <span className="text-xs text-emerald-600 font-semibold">Ready to proceed</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. FOUR PILLARS: CLARITY, TRUST, EFFICIENCY, CARE ── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="mq-card p-6 space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Total Clarity
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Eliminate lobby guessing games with precise queue order, token tracking, and doctor room assignments.
          </p>
        </div>

        <div className="mq-card p-6 space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Dynamic Wait Calculation
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Live estimates computed continuously from patient volume and actual consultation duration rates.
          </p>
        </div>

        <div className="mq-card p-6 space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Hospital Flow Efficiency
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Streamlined calling stations for doctors and nursing staff to call next tokens with audio PA alerts.
          </p>
        </div>

        <div className="mq-card p-6 space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Patient-Centered Care
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Respect patient time and improve satisfaction scores across private hospitals and outpatient clinics.
          </p>
        </div>
      </section>

      {/* ── 4. FEATURED CLINICAL DEPARTMENTS ── */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Clinical Departments
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Available specialties and outpatient consultation divisions.
            </p>
          </div>
          <Link
            to="/departments"
            className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1"
          >
            All Departments <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {departments.slice(0, 4).map((dept) => (
            <Link
              key={dept.id}
              to={`/book-appointment?deptId=${dept.id}`}
              className="mq-card mq-card-hover p-5 space-y-2 block"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {dept.code}
                </span>
                <span className="text-xs font-semibold text-emerald-600">● Open</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                {dept.name}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2">{dept.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
