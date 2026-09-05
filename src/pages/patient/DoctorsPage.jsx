import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { DoctorCard } from '../../components/patient/DoctorCard';
import { Search, Stethoscope, Filter } from 'lucide-react';

export const DoctorsPage = () => {
  const { doctors, departments } = useApp();
  const [searchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState(searchParams.get('department') || '');
  const [minRating, setMinRating] = useState(0);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      if (!doc.active) return false;
      if (selectedDept && doc.departmentId !== selectedDept) return false;
      if (minRating > 0 && doc.rating < minRating) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesName = doc.name.toLowerCase().includes(q);
        const matchesSpecialty = doc.specialty.toLowerCase().includes(q);
        const matchesDept = doc.departmentName?.toLowerCase().includes(q);
        if (!matchesName && !matchesSpecialty && !matchesDept) return false;
      }
      return true;
    });
  }, [doctors, selectedDept, minRating, searchTerm]);

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Specialist Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
            Find & Book Specialist Physicians
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Verified physician credentials, consultation durations, and appointment availability.
          </p>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="mq-card p-4 flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by doctor name, specialty, or condition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mq-input pl-9 text-xs"
          />
        </div>

        {/* Department Filter */}
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="mq-input text-xs font-medium w-full md:w-56"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>

        {/* Rating Filter */}
        <select
          value={minRating}
          onChange={(e) => setMinRating(parseFloat(e.target.value))}
          className="mq-input text-xs font-medium w-full md:w-40"
        >
          <option value="0">All Ratings</option>
          <option value="4.8">4.8+ Stars ⭐</option>
          <option value="4.9">4.9+ Stars ⭐</option>
        </select>

        {(searchTerm || selectedDept || minRating > 0) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedDept('');
              setMinRating(0);
            }}
            className="text-xs font-semibold text-rose-600 hover:underline px-2 flex-shrink-0"
          >
            Reset
          </button>
        )}
      </div>

      {/* Doctor Cards Grid */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-1">
          <span>Showing {filteredDoctors.length} available medical specialists</span>
        </div>

        {filteredDoctors.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            No doctors found matching your filter criteria. Try adjusting your search query.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
