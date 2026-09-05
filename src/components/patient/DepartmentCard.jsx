import React from 'react';
import { Link } from 'react-router-dom';
import {
  Stethoscope,
  HeartPulse,
  Baby,
  Sparkles,
  Activity,
  Ear,
  Brain,
  Users,
  Eye,
  Smile,
  ChevronRight,
  Clock,
  UserCheck,
} from 'lucide-react';

const iconMap = {
  Stethoscope,
  HeartPulse,
  Baby,
  Sparkles,
  Activity,
  Ear,
  Brain,
  Users,
  Eye,
  Smile,
};

export const DepartmentCard = ({ department, doctorCount = 1 }) => {
  const IconComponent = iconMap[department.icon] || Stethoscope;

  return (
    <div className="group relative flex flex-col justify-between bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
      <div>
        {/* Header Icon + Code Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center ring-4 ring-teal-50/50 dark:ring-teal-950/30 group-hover:scale-110 transition-transform">
            <IconComponent className="w-6 h-6" />
          </div>
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {department.code}
          </span>
        </div>

        {/* Name & Description */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
          {department.name}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-4">
          {department.description}
        </p>

        {/* Stats strip */}
        <div className="space-y-2 py-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-teal-500" />
              Specialists Available:
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{doctorCount} Doctors</span>
          </div>
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-500" />
              Avg Consult:
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              ~{department.avgConsultationTime || 15} mins
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <Link
          to={`/doctors?department=${department.id}`}
          className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
        >
          View Doctors
        </Link>
        <Link
          to={`/book-appointment?deptId=${department.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
        >
          Book in {department.code} <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
