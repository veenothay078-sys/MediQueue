import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AppointmentCard } from '../../components/patient/AppointmentCard';
import { RescheduleModal } from '../../components/patient/RescheduleModal';
import { CancelModal } from '../../components/patient/CancelModal';
import { getTodayDateStr } from '../../data/initialData';
import { Calendar, PlusCircle, Search, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AppointmentsPage = () => {
  const { appointments, patientProfile } = useApp();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [rescheduleApt, setRescheduleApt] = useState(null);
  const [cancelApt, setCancelApt] = useState(null);

  const todayStr = getTodayDateStr();

  // Patient appointments
  const myAppointments = useMemo(() => {
    return appointments.filter(
      (a) => a.patientEmail === patientProfile.email || a.patientName === patientProfile.name
    );
  }, [appointments, patientProfile]);

  const filteredAppointments = useMemo(() => {
    return myAppointments.filter((apt) => {
      // Tab filter
      if (activeTab === 'today') {
        if (apt.date !== todayStr || apt.status === 'Cancelled') return false;
      } else if (activeTab === 'upcoming') {
        if (
          (apt.date < todayStr && apt.status === 'Completed') ||
          apt.status === 'Completed' ||
          apt.status === 'Cancelled'
        )
          return false;
      } else if (activeTab === 'completed') {
        if (apt.status !== 'Completed') return false;
      } else if (activeTab === 'cancelled') {
        if (apt.status !== 'Cancelled') return false;
      }

      // Search
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesToken = apt.tokenNumber?.toLowerCase().includes(q);
        const matchesDoc = apt.doctorName?.toLowerCase().includes(q);
        const matchesDept = apt.departmentName?.toLowerCase().includes(q);
        if (!matchesToken && !matchesDoc && !matchesDept) return false;
      }

      return true;
    });
  }, [myAppointments, activeTab, searchTerm, todayStr]);

  const tabCounts = {
    upcoming: myAppointments.filter(
      (a) => (a.date >= todayStr || a.status === 'Booked' || a.status === 'Waiting') && a.status !== 'Completed' && a.status !== 'Cancelled'
    ).length,
    today: myAppointments.filter((a) => a.date === todayStr && a.status !== 'Cancelled').length,
    completed: myAppointments.filter((a) => a.status === 'Completed').length,
    cancelled: myAppointments.filter((a) => a.status === 'Cancelled').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Calendar className="w-3.5 h-3.5" />
            Patient Schedule
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            My Appointments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your booked consultation slots, live queue status, rescheduling, and cancellation.
          </p>
        </div>

        <Link
          to="/book-appointment"
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> Book New Appointment
        </Link>
      </div>

      {/* Tabs & Search Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'upcoming', label: 'Upcoming', count: tabCounts.upcoming },
            { id: 'today', label: 'Today', count: tabCounts.today },
            { id: 'completed', label: 'Completed', count: tabCounts.completed },
            { id: 'cancelled', label: 'Cancelled', count: tabCounts.cancelled },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-xs sm:text-sm space-y-3">
          <Calendar className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            No appointments found in "{activeTab}" tab.
          </p>
          <Link
            to="/book-appointment"
            className="inline-block px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold"
          >
            Book an appointment now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAppointments.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              onCancelClick={(a) => setCancelApt(a)}
              onRescheduleClick={(a) => setRescheduleApt(a)}
            />
          ))}
        </div>
      )}

      {/* Reschedule & Cancel Modals */}
      <RescheduleModal
        isOpen={Boolean(rescheduleApt)}
        onClose={() => setRescheduleApt(null)}
        appointment={rescheduleApt}
      />
      <CancelModal
        isOpen={Boolean(cancelApt)}
        onClose={() => setCancelApt(null)}
        appointment={cancelApt}
      />
    </div>
  );
};
