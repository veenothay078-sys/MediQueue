import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Bot,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  ArrowRight,
  Flame,
  Search,
  Zap,
} from 'lucide-react';

const SYMPTOM_PRESETS = [
  { text: 'Chest pain or rapid heartbeat', deptId: 'dept-cardio', docId: 'doc-2', deptName: 'Cardiology', urgency: 'High' },
  { text: 'Persistent fever & cough in child', deptId: 'dept-ped', docId: 'doc-3', deptName: 'Pediatrics', urgency: 'Moderate' },
  { text: 'Skin rash, eczema, or flare-up', deptId: 'dept-derma', docId: 'doc-4', deptName: 'Dermatology', urgency: 'Low' },
  { text: 'Knee joint pain / sports sprain', deptId: 'dept-ortho', docId: 'doc-5', deptName: 'Orthopedics', urgency: 'Moderate' },
  { text: 'Severe migraine & dizziness', deptId: 'dept-neuro', docId: 'doc-7', deptName: 'Neurology', urgency: 'Moderate' },
  { text: 'Sinus blockage & ear pain', deptId: 'dept-ent', docId: 'doc-6', deptName: 'ENT', urgency: 'Low' },
];

export const SmartSymptomTriage = () => {
  const navigate = useNavigate();
  const [symptomInput, setSymptomInput] = useState('');
  const [triageResult, setTriageResult] = useState(null);

  const analyzeSymptom = (text) => {
    const q = text.toLowerCase();
    let matched = null;

    if (q.includes('heart') || q.includes('chest') || q.includes('palpitation') || q.includes('blood pressure')) {
      matched = { deptId: 'dept-cardio', docId: 'doc-2', deptName: 'Cardiology', docName: 'Dr. Rajesh Menon', urgency: 'High', reason: text };
    } else if (q.includes('child') || q.includes('kid') || q.includes('baby') || q.includes('infant')) {
      matched = { deptId: 'dept-ped', docId: 'doc-3', deptName: 'Pediatrics', docName: 'Dr. Aisha Patel', urgency: 'Moderate', reason: text };
    } else if (q.includes('skin') || q.includes('rash') || q.includes('acne') || q.includes('allergy')) {
      matched = { deptId: 'dept-derma', docId: 'doc-4', deptName: 'Dermatology', docName: 'Dr. Sunita Rao', urgency: 'Low', reason: text };
    } else if (q.includes('bone') || q.includes('joint') || q.includes('knee') || q.includes('fracture') || q.includes('back pain')) {
      matched = { deptId: 'dept-ortho', docId: 'doc-5', deptName: 'Orthopedics', docName: 'Dr. Vikram Malhotra', urgency: 'Moderate', reason: text };
    } else if (q.includes('headache') || q.includes('migraine') || q.includes('nerve') || q.includes('numbness')) {
      matched = { deptId: 'dept-neuro', docId: 'doc-7', deptName: 'Neurology', docName: 'Dr. Elena Rostova', urgency: 'Moderate', reason: text };
    } else if (q.includes('ear') || q.includes('nose') || q.includes('throat') || q.includes('sinus')) {
      matched = { deptId: 'dept-ent', docId: 'doc-6', deptName: 'ENT', docName: 'Dr. David Chen', urgency: 'Low', reason: text };
    } else {
      matched = { deptId: 'dept-gen', docId: 'doc-1', deptName: 'General Medicine', docName: 'Dr. Priya Sharma', urgency: 'Low', reason: text || 'General health consultation' };
    }

    setTriageResult(matched);
  };

  const handlePresetClick = (preset) => {
    setSymptomInput(preset.text);
    analyzeSymptom(preset.text);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-5">
      <div className="flex items-center gap-2.5">
        <div className="p-2.5 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Smart AI Symptom-to-Department Triage Guide
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Describe symptoms to automatically resolve the right clinical division & priority level.
          </p>
        </div>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Type symptoms (e.g. chest tightness, knee pain, child fever, skin rash)..."
            value={symptomInput}
            onChange={(e) => {
              setSymptomInput(e.target.value);
              if (e.target.value.length > 2) analyzeSymptom(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>
        <button
          onClick={() => analyzeSymptom(symptomInput)}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all"
        >
          Analyze
        </button>
      </div>

      {/* Symptom Preset Tags */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Or Select Common Symptom Pattern:
        </span>
        <div className="flex flex-wrap gap-2">
          {SYMPTOM_PRESETS.map((preset) => (
            <button
              key={preset.text}
              onClick={() => handlePresetClick(preset)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-50 dark:hover:bg-teal-950/40 hover:border-teal-300 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
            >
              {preset.text}
            </button>
          ))}
        </div>
      </div>

      {/* Triage Decision Card */}
      {triageResult && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/50 dark:to-emerald-950/30 border-2 border-teal-500/40 space-y-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span className="text-xs font-black uppercase text-teal-800 dark:text-teal-200">
                AI Triage Recommendation
              </span>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                triageResult.urgency === 'High'
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                  : 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
              }`}
            >
              Urgency: {triageResult.urgency}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-500 block">Recommended Department:</span>
              <strong className="text-slate-900 dark:text-slate-100 text-sm">
                {triageResult.deptName}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">Assigned Specialist:</span>
              <strong className="text-slate-900 dark:text-slate-100 text-sm">
                {triageResult.docName}
              </strong>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() =>
                navigate(
                  `/book-appointment?doctorId=${triageResult.docId}&deptId=${triageResult.deptId}`
                )
              }
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md inline-flex items-center gap-2 transition-all"
            >
              Direct Book with this Specialist <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
