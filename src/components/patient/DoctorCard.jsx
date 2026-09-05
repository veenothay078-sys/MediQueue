import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Calendar, MapPin, CheckCircle2, ChevronRight, User } from 'lucide-react';

export const DoctorCard = ({ doctor, onBookNow }) => {
  const navigate = useNavigate();

  const isAvailable = doctor.status === 'Available';

  return (
    <div className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
      {/* Top row: Avatar + Basic Info */}
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <img
            src={doctor.avatar}
            alt={doctor.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 shadow-sm group-hover:scale-105 transition-transform"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300';
            }}
          />
          <span
            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${
              isAvailable ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
            title={doctor.status}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800">
              {doctor.departmentName}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            {doctor.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
            {doctor.specialty}
          </p>

          <div className="flex items-center gap-3 mt-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1 font-bold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{doctor.rating}</span>
              <span className="text-[10px] text-slate-400 font-normal">({doctor.reviewsCount})</span>
            </div>
            <span>•</span>
            <span className="text-slate-500 dark:text-slate-400">{doctor.experience} exp</span>
          </div>
        </div>
      </div>

      {/* Meta Specs */}
      <div className="grid grid-cols-2 gap-2 my-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
          <Clock className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
          <span className="truncate">{doctor.availability}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
          <span className="truncate">{doctor.roomNumber}</span>
        </div>
      </div>

      {/* Footer / CTA buttons */}
      <div className="mt-auto pt-2 flex items-center gap-2">
        <Link
          to={`/doctors/${doctor.id}`}
          className="flex-1 py-2 px-3 text-center rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
        >
          View Profile
        </Link>
        <button
          onClick={() => {
            if (onBookNow) {
              onBookNow(doctor);
            } else {
              navigate(`/book-appointment?doctorId=${doctor.id}`);
            }
          }}
          className="flex-1 py-2 px-3 text-center rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm shadow-teal-600/20 transition-all flex items-center justify-center gap-1"
        >
          Book Now
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
