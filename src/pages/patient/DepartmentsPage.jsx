import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DepartmentCard } from '../../components/patient/DepartmentCard';
import { Search, Building2 } from 'lucide-react';

export const DepartmentsPage = () => {
  const { departments, doctors } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDepartments = departments.filter((d) => {
    if (!d.active) return false;
    if (!searchTerm) return true;
    const query = searchTerm.toLowerCase();
    return (
      d.name.toLowerCase().includes(query) ||
      d.code.toLowerCase().includes(query) ||
      d.description.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Clinical Services Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
            Hospital Departments
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Explore outpatient medical specialties, doctor availability, and average wait times.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mq-input pl-9 text-xs"
          />
        </div>
      </div>

      {/* Directory Grid */}
      {filteredDepartments.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-sm border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          No departments found matching "{searchTerm}".
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((dept) => {
            const docCount = doctors.filter((d) => d.departmentId === dept.id).length;
            return <DepartmentCard key={dept.id} department={dept} doctorCount={docCount} />;
          })}
        </div>
      )}
    </div>
  );
};
