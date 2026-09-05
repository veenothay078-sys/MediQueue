import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, PriorityBadge, TokenDisplay } from '../common/StatusBadge';
import { formatDateDisplay } from '../../utils/queueCalculations';
import {
  Search,
  Filter,
  Calendar,
  Stethoscope,
  Building2,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Flame,
  MoreVertical,
} from 'lucide-react';

export const AdminAppointmentTable = () => {
  const {
    appointments,
    doctors,
    departments,
    updateAppointmentStatus,
    setEmergencyPriority,
    cancelAppointment,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesToken = apt.tokenNumber?.toLowerCase().includes(query);
        const matchesPatient = apt.patientName?.toLowerCase().includes(query);
        const matchesDoctor = apt.doctorName?.toLowerCase().includes(query);
        const matchesDept = apt.departmentName?.toLowerCase().includes(query);
        if (!matchesToken && !matchesPatient && !matchesDoctor && !matchesDept) return false;
      }
      if (selectedDept && apt.departmentId !== selectedDept) return false;
      if (selectedDoctor && apt.doctorId !== selectedDoctor) return false;
      if (selectedStatus && apt.status !== selectedStatus) return false;
      if (selectedPriority && apt.priority !== selectedPriority) return false;
      if (selectedDate && apt.date !== selectedDate) return false;
      return true;
    });
  }, [
    appointments,
    searchTerm,
    selectedDept,
    selectedDoctor,
    selectedStatus,
    selectedPriority,
    selectedDate,
  ]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedDept('');
    setSelectedDoctor('');
    setSelectedStatus('');
    setSelectedPriority('');
    setSelectedDate('');
  };

  const hasActiveFilters =
    searchTerm ||
    selectedDept ||
    selectedDoctor ||
    selectedStatus ||
    selectedPriority ||
    selectedDate;

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search token, patient name, doctor, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          {/* Doctor Filter */}
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            <option value="">All Doctors</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Waiting">Waiting</option>
            <option value="In Consultation">In Consultation</option>
            <option value="Booked">Booked</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Skipped">Skipped</option>
          </select>

          {/* Priority */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            <option value="">All Priorities</option>
            <option value="Normal">Normal</option>
            <option value="Emergency">Emergency</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-semibold whitespace-nowrap px-2"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Appointments Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong>{filteredAppointments.length}</strong> of{' '}
            <strong>{appointments.length}</strong> total appointments
          </span>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No matching appointment records found. Try adjusting your search query or filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Token</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Doctor & Department</th>
                  <th className="py-3 px-4">Date & Slot</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredAppointments.map((apt) => (
                  <tr
                    key={apt.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold">
                      <TokenDisplay tokenNumber={apt.tokenNumber} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {apt.patientName}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">
                        {apt.patientEmail || apt.patientPhone}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {apt.doctorName}
                      </div>
                      <div className="text-[11px] text-slate-400">{apt.departmentName}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      <div>{formatDateDisplay(apt.date)}</div>
                      <div className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">
                        {apt.timeSlot}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={apt.priority} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={apt.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Status dropdown quick picker */}
                        <select
                          value={apt.status}
                          onChange={(e) => updateAppointmentStatus(apt.id, e.target.value)}
                          className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold focus:outline-none"
                        >
                          <option value="Waiting">Waiting</option>
                          <option value="In Consultation">In Consultation</option>
                          <option value="Completed">Completed</option>
                          <option value="Skipped">Skipped</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>

                        {/* Emergency Toggle */}
                        <button
                          onClick={() =>
                            setEmergencyPriority(apt.id, apt.priority !== 'Emergency')
                          }
                          title="Toggle Emergency Priority"
                          className={`p-1.5 rounded-lg border transition-colors ${
                            apt.priority === 'Emergency'
                              ? 'bg-rose-600 text-white border-rose-600'
                              : 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <Flame className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
