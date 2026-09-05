import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getTodayDateStr, getOffsetDateStr } from '../../data/initialData';
import { TokenDisplay } from '../common/StatusBadge';
import confetti from 'canvas-confetti';
import {
  Stethoscope,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  User,
  Star,
  ShieldCheck,
  Radio,
  FileText,
  MapPin,
} from 'lucide-react';

const TIME_SLOTS = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '01:00 PM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
];

export const BookingWizard = ({ initialDeptId = '', initialDoctorId = '' }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { departments, doctors, bookAppointment, patientProfile } = useApp();

  const [step, setStep] = useState(1);
  const [selectedDeptId, setSelectedDeptId] = useState(
    searchParams.get('deptId') || initialDeptId || (departments[0]?.id || '')
  );
  const [selectedDocId, setSelectedDocId] = useState(
    searchParams.get('doctorId') || initialDoctorId || ''
  );
  const [selectedDate, setSelectedDate] = useState(getTodayDateStr());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:30 AM');
  const [consultReason, setConsultReason] = useState('General Consultation & Checkup');
  const [patientName, setPatientName] = useState(patientProfile.name || 'Alex Morgan');
  const [patientPhone, setPatientPhone] = useState(patientProfile.phone || '+1 (555) 234-5678');
  const [patientEmail, setPatientEmail] = useState(patientProfile.email || 'alex.morgan@mediqueue.demo');

  const [createdAppointment, setCreatedAppointment] = useState(null);

  // If initial doctor is supplied, sync department
  useEffect(() => {
    const docParam = searchParams.get('doctorId') || initialDoctorId;
    if (docParam) {
      const doc = doctors.find((d) => d.id === docParam);
      if (doc) {
        setSelectedDocId(doc.id);
        setSelectedDeptId(doc.departmentId);
        setStep(3); // Skip straight to date selection
      }
    }
  }, [searchParams, initialDoctorId, doctors]);

  // Filtered doctors for the active department
  const filteredDoctors = doctors.filter((d) => !selectedDeptId || d.departmentId === selectedDeptId);

  const selectedDepartment = departments.find((d) => d.id === selectedDeptId);
  const selectedDoctor = doctors.find((d) => d.id === selectedDocId);

  const handleNext = () => {
    if (step === 1 && !selectedDeptId) return;
    if (step === 2 && !selectedDocId) return;
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleConfirmBooking = () => {
    const apt = bookAppointment({
      departmentId: selectedDeptId,
      doctorId: selectedDocId,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      reason: consultReason,
      patientName,
      patientPhone,
      patientEmail,
      priority: 'Normal',
    });

    setCreatedAppointment(apt);
    setStep(6); // Success screen

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0f766e', '#10b981', '#0284c7', '#f59e0b'],
      });
    } catch (e) {
      // safe fallback
    }
  };

  // SUCCESS STEP (Step 6)
  if (step === 6 && createdAppointment) {
    return (
      <div className="max-w-2xl mx-auto mq-card p-6 sm:p-10 text-center animate-fade-in space-y-6">
        <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">
            Booking Confirmed
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Appointment Confirmed
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Your consultation pass has been generated. A digital token is assigned to your record.
          </p>
        </div>

        {/* Token Showcase Box */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-center space-y-4">
          <div>
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block">
              Assigned Token Number
            </span>
            <div className="text-4xl sm:text-5xl font-bold font-mono text-teal-800 dark:text-teal-300 mt-1">
              {createdAppointment.tokenNumber}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200 dark:border-slate-700 text-left text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Physician</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 block truncate">
                {createdAppointment.doctorName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Department</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 block truncate">
                {createdAppointment.departmentName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Time Slot</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 block">
                {createdAppointment.timeSlot}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Room</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 block">
                {createdAppointment.roomNumber || 'Room 02'}
              </span>
            </div>
          </div>
        </div>

        {/* Your Next Steps Checklist */}
        <div className="p-4 rounded-xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900 text-left space-y-2 text-xs">
          <span className="font-bold text-teal-900 dark:text-teal-200 uppercase tracking-wider block">
            Your Next Steps:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-teal-700 text-white text-[10px] font-bold flex items-center justify-center">1</span>
              <span>Arrive at hospital 10 min early</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-teal-700 text-white text-[10px] font-bold flex items-center justify-center">2</span>
              <span>Check in at reception / wing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-teal-700 text-white text-[10px] font-bold flex items-center justify-center">3</span>
              <span>Track your live queue on mobile</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-teal-700 text-white text-[10px] font-bold flex items-center justify-center">4</span>
              <span>Meet doctor when token is called</span>
            </div>
          </div>
        </div>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate('/queue')}
            className="w-full sm:w-auto mq-btn-primary"
          >
            <Radio className="w-4 h-4" />
            View My Queue
          </button>
          <button
            onClick={() => navigate('/appointments')}
            className="w-full sm:w-auto mq-btn-secondary"
          >
            View All Appointments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mq-card p-6 sm:p-8 space-y-6">
      {/* 5-Step Indicator */}
      <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="hidden sm:grid grid-cols-5 gap-2">
          {[
            { num: '01', title: 'Department' },
            { num: '02', title: 'Doctor' },
            { num: '03', title: 'Date' },
            { num: '04', title: 'Time' },
            { num: '05', title: 'Confirm' },
          ].map((item, idx) => {
            const stepNum = idx + 1;
            const isDone = step > stepNum;
            const isCurrent = step === stepNum;

            return (
              <div
                key={item.num}
                className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all ${
                  isCurrent
                    ? 'border-teal-700 bg-teal-50 dark:bg-teal-950 text-teal-900 dark:text-teal-200'
                    : isDone
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 text-slate-400'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded text-[11px] font-bold flex items-center justify-center ${
                    isCurrent
                      ? 'bg-teal-700 text-white'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isDone ? '✓' : item.num}
                </span>
                <span className="truncate">{item.title}</span>
              </div>
            );
          })}
        </div>

        {/* Mobile Stepper */}
        <div className="flex sm:hidden items-center justify-between text-xs font-semibold text-slate-500">
          <span>Step {step} of 5</span>
          <span className="text-teal-700 font-bold">
            {step === 1 && 'Select Department'}
            {step === 2 && 'Choose Specialist Doctor'}
            {step === 3 && 'Choose Date'}
            {step === 4 && 'Choose Time Slot'}
            {step === 5 && 'Review & Confirm'}
          </span>
        </div>

        <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-teal-700 rounded-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: SELECT DEPARTMENT */}
      {step === 1 && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              01. Select a Department
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose the specialty that matches your medical care requirement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
            {departments
              .filter((d) => d.active)
              .map((dept) => {
                const isSelected = selectedDeptId === dept.id;

                return (
                  <div
                    key={dept.id}
                    onClick={() => {
                      setSelectedDeptId(dept.id);
                      const docInDept = doctors.find((d) => d.departmentId === dept.id);
                      if (docInDept) setSelectedDocId(docInDept.id);
                    }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-teal-700 bg-teal-50/70 dark:bg-teal-950/40'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-lg ${
                        isSelected
                          ? 'bg-teal-700 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-400'
                      }`}
                    >
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                          {dept.name}
                        </h4>
                        <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600">
                          {dept.code}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {dept.description}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* STEP 2: SELECT DOCTOR */}
      {step === 2 && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              02. Choose Specialist Doctor
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing on-duty physicians for {selectedDepartment?.name || 'selected department'}.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
            {filteredDoctors.map((doc) => {
              const isSelected = selectedDocId === doc.id;

              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? 'border-teal-700 bg-teal-50/70 dark:bg-teal-950/40'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                        {doc.name}
                      </h4>
                      <span className="text-xs font-bold text-amber-500">
                        ⭐ {doc.rating}
                      </span>
                    </div>
                    <p className="text-xs text-teal-700 dark:text-teal-400 font-medium truncate">
                      {doc.specialty}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span>{doc.experience} exp</span>
                      <span>•</span>
                      <span>{doc.roomNumber}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 3: SELECT DATE */}
      {step === 3 && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              03. Select Consultation Date
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose an available date for your visit with {selectedDoctor?.name}.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
              const dStr = getOffsetDateStr(offset);
              const isSelected = selectedDate === dStr;
              const dateObj = new Date(dStr + 'T00:00:00');
              const dayName = offset === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
              const monthDay = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

              return (
                <div
                  key={dStr}
                  onClick={() => setSelectedDate(dStr)}
                  className={`p-4 rounded-xl border-2 cursor-pointer text-center transition-all ${
                    isSelected
                      ? 'border-teal-700 bg-teal-50 dark:bg-teal-950/50'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase block">
                    {dayName}
                  </span>
                  <span className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1 block">
                    {monthDay}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 4: TIME SLOT & PATIENT DETAILS */}
      {step === 4 && (
        <div className="space-y-5 animate-fade-in">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              04. Time Slot & Patient Details
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pick your preferred consultation slot and confirm contact details.
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase block mb-2">
              Available Slots:
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {TIME_SLOTS.map((slot) => {
                const isSelected = selectedTimeSlot === slot;

                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTimeSlot(slot)}
                    className={`py-2 px-2 text-center rounded-lg text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'border-teal-700 bg-teal-700 text-white font-bold'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Patient Full Name
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="mq-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="mq-input text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Reason for Visit (Optional)
              </label>
              <input
                type="text"
                value={consultReason}
                onChange={(e) => setConsultReason(e.target.value)}
                placeholder="e.g. Routine follow-up, mild cough, annual checkup..."
                className="mq-input text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: REVIEW & CONFIRM */}
      {step === 5 && (
        <div className="space-y-5 animate-fade-in">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              05. Review & Confirm Booking
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verify your appointment details before generating your digital queue token.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 block">Department:</span>
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {selectedDepartment?.name}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block">Physician:</span>
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {selectedDoctor?.name} ({selectedDoctor?.roomNumber})
                </span>
              </div>

              <div>
                <span className="text-slate-500 block">Date & Time Slot:</span>
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {selectedDate} at {selectedTimeSlot}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block">Patient Name:</span>
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {patientName}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 block">Chief Complaint / Reason:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {consultReason || 'General checkup'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
        {step > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="mq-btn-secondary text-xs"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        ) : (
          <div />
        )}

        {step < 5 ? (
          <button
            type="button"
            onClick={handleNext}
            className="mq-btn-primary text-xs"
          >
            Next Step <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleConfirmBooking}
            className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            Confirm & Issue Token
          </button>
        )}
      </div>
    </div>
  );
};
