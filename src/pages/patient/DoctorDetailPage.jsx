import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { TokenDisplay, StatusBadge } from '../../components/common/StatusBadge';
import { getTodayDateStr } from '../../data/initialData';
import { getSortedQueueForDoctor } from '../../utils/queueCalculations';
import {
  Star,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  Award,
  DollarSign,
  Radio,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';

export const DoctorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { doctors, departments, appointments } = useApp();

  const doctor = doctors.find((d) => d.id === id) || doctors[0];
  const department = departments.find((dept) => dept.id === doctor?.departmentId);

  const todayStr = getTodayDateStr();
  const { currentlyServing, waitingList, totalToday } = getSortedQueueForDoctor(
    doctor?.id,
    appointments,
    todayStr
  );

  const estWait = waitingList.length * (doctor?.consultationDuration || 12);

  if (!doctor) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-xl font-bold">Doctor not found</h2>
        <Link to="/doctors" className="text-teal-600 underline text-sm mt-2 inline-block">
          Return to doctor roster
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Doctors
      </button>

      {/* Main Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <img
            src={doctor.avatar}
            alt={doctor.name}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-slate-100 dark:ring-slate-800 shadow-md flex-shrink-0"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300';
            }}
          />

          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                {doctor.departmentName}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  doctor.status === 'Available'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                }`}
              >
                ● {doctor.status}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {doctor.name}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
              {doctor.specialty} • {doctor.qualification}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 pt-1">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{doctor.rating}</span>
                <span className="text-slate-400 font-normal">({doctor.reviewsCount} reviews)</span>
              </div>
              <span>•</span>
              <span>{doctor.experience} Clinical Experience</span>
              <span>•</span>
              <span>{doctor.roomNumber}</span>
            </div>
          </div>

          <div className="w-full sm:w-auto pt-4 sm:pt-0">
            <Link
              to={`/book-appointment?doctorId=${doctor.id}&deptId=${doctor.departmentId}`}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-lg shadow-teal-600/25 transition-all inline-flex items-center justify-center gap-2"
            >
              Book Consultation Slot
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">About Physician</h3>
          <p>{doctor.bio}</p>
        </div>
      </div>

      {/* Grid: Availability & Live Queue Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Availability Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Consultation Schedule & Fee
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-500 font-medium">Daily Availability:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {doctor.availability}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-500 font-medium">Avg Consultation Time:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                ~{doctor.consultationDuration} minutes / patient
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-500 font-medium">Assigned Room:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {doctor.roomNumber} ({department?.roomNumber})
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-500 font-medium">Standard Consultation Fee:</span>
              <span className="font-bold text-teal-600 dark:text-teal-400 text-sm">
                ${doctor.fee || 50}
              </span>
            </div>
          </div>
        </div>

        {/* Live Queue Status for Doctor Today */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-teal-600 animate-pulse" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Today's Live Queue
              </h3>
            </div>
            <Link to="/queue" className="text-xs font-bold text-teal-600 hover:underline">
              Open Live Stream
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center text-xs">
            <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/50">
              <span className="text-slate-400 block font-semibold mb-1">Now Serving</span>
              <span className="text-lg font-mono font-black text-teal-600 dark:text-teal-400">
                {currentlyServing?.tokenNumber || 'None'}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50">
              <span className="text-slate-400 block font-semibold mb-1">In Waiting Queue</span>
              <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {waitingList.length} patients
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
            <span>Estimated wait for new walk-in:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              ~{estWait} minutes
            </span>
          </div>

          <Link
            to={`/book-appointment?doctorId=${doctor.id}`}
            className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
          >
            Get Token for {doctor.name}
          </Link>
        </div>
      </div>
    </div>
  );
};
