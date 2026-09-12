import React from 'react';
import { 
  X, User, Stethoscope, Clock, AlertTriangle, ArrowRight, 
  CheckCircle2, Sparkles, FileText, ChevronRight, Activity, 
  RotateCcw, Play, Check, ChevronDown, ShieldCheck, Zap
} from 'lucide-react';
import { Token, Doctor } from '../../types';
import { SanctuaryPulseEngine } from '../../services/sanctuaryPulseEngine';
import { DataStore } from '../../services/dataStore';

interface PatientQuickViewDrawerProps {
  token: Token | null;
  doctor?: Doctor;
  onClose: () => void;
  onOpenSnapshot: (token: Token) => void;
  onNavigateToRecords: (patientId: string) => void;
  onNavigateToDiagnosticJourney?: (patientId?: string) => void;
  onStateChange?: () => void;
}

export const PatientQuickViewDrawer: React.FC<PatientQuickViewDrawerProps> = ({
  token,
  doctor,
  onClose,
  onOpenSnapshot,
  onNavigateToRecords,
  onNavigateToDiagnosticJourney,
  onStateChange,
}) => {
  if (!token) return null;

  // Compute Sanctuary Pulse state
  const pulseState = SanctuaryPulseEngine.computePulseState(
    token,
    doctor,
    token.queuePosition,
    token.sanctuary_state as any
  );

  const isStagnant = token.stagnationFlag || token.dpsScore <= 65;
  const isCriticalStagnant = token.stagnationFlag && token.dpsScore < 50;
  const isSeniorReview = token.priority === 'senior_mdis';
  const isWaiting = token.status === 'waiting';
  const isCalled = token.status === 'called';
  const isInConsult = token.status === 'in_consultation' || token.status === 'in_treatment';
  const isCompleted = token.status === 'completed';
  const isSkipped = token.status === 'skipped';

  const patientsAhead = Math.max(0, (token.queuePosition || 1) - 1);
  const estimatedWait = token.estimatedWaitMin || (patientsAhead + 1) * 4;

  const handleCall = () => {
    DataStore.callToken(token.id);
    if (onStateChange) onStateChange();
  };

  const handleStartConsult = () => {
    DataStore.startConsultation(token.id);
    if (onStateChange) onStateChange();
  };

  const handleComplete = () => {
    DataStore.completeVisit(token.id);
    if (onStateChange) onStateChange();
  };

  const handleSkip = () => {
    DataStore.skipToken(token.id);
    if (onStateChange) onStateChange();
  };

  const handleRecall = () => {
    DataStore.recallToken(token.id);
    if (onStateChange) onStateChange();
  };

  // Operational status pill
  const getStatusPill = () => {
    switch (token.status) {
      case 'in_consultation':
      case 'in_treatment':
        return {
          label: 'IN TREATMENT',
          classes: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500 animate-pulse',
        };
      case 'called':
        return {
          label: 'CALLED',
          classes: 'bg-sky-50 text-sky-800 border-sky-200',
          dot: 'bg-sky-500',
        };
      case 'completed':
        return {
          label: 'COMPLETED',
          classes: 'bg-stone-100 text-stone-600 border-stone-200',
          dot: 'bg-stone-400',
        };
      case 'skipped':
        return {
          label: 'SKIPPED',
          classes: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
        };
      case 'cancelled':
        return {
          label: 'CANCELLED',
          classes: 'bg-stone-100 text-stone-500 border-stone-200',
          dot: 'bg-stone-400',
        };
      default:
        return {
          label: 'WAITING',
          classes: 'bg-stone-100 text-stone-700 border-stone-200',
          dot: 'bg-stone-400',
        };
    }
  };

  const statusPill = getStatusPill();

  // Pulse stages progression sequence
  const getPulseHistory = () => {
    if (token.status === 'completed') {
      return [
        { label: 'Checked in', state: 'done' },
        { label: 'Queue progressing', state: 'done' },
        { label: 'Called to Suite', state: 'done' },
        { label: 'Consultation completed', state: 'active' },
      ];
    }
    if (isInConsult) {
      return [
        { label: 'Checked in', state: 'done' },
        { label: 'Queue progressing', state: 'done' },
        { label: 'Called to Suite', state: 'done' },
        { label: 'In treatment with clinician', state: 'active' },
      ];
    }
    if (isCalled) {
      return [
        { label: 'Checked in', state: 'done' },
        { label: 'Queue progressing', state: 'done' },
        { label: 'Called — proceed to Room', state: 'active' },
        { label: 'In treatment', state: 'pending' },
      ];
    }
    if (token.queuePosition === 1 || token.queuePosition === 2) {
      return [
        { label: 'Checked in', state: 'done' },
        { label: 'Queue progressing', state: 'done' },
        { label: 'Almost your turn', state: 'active' },
        { label: 'Proceed to consultation bay', state: 'pending' },
      ];
    }
    return [
      { label: 'Checked in', state: 'done' },
      { label: 'Queue progressing', state: 'done' },
      { label: 'Queue stable', state: 'active' },
      { label: 'Almost your turn', state: 'pending' },
    ];
  };

  const pulseSteps = getPulseHistory();

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-stone-950/25 backdrop-blur-2xs transition-all animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-[420px] bg-white h-full shadow-2xl border-l border-stone-200 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* ======================================================== */}
        {/* DRAWER HEADER (Exact Specs) */}
        {/* ======================================================== */}
        <div className="p-6 border-b border-stone-100 sticky top-0 bg-white/95 backdrop-blur-md z-10 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3.5">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-800 font-extrabold text-sm shrink-0 font-mono">
                {token.patientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>

              {/* Patient Name & Age / Gender */}
              <div>
                <h2 className="text-lg font-extrabold text-stone-900 leading-tight">
                  {token.patientName}
                </h2>
                <p className="text-xs text-stone-500 font-mono mt-0.5">
                  {token.patientAge} {token.patientGender.charAt(0)}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              title="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Token & Status Row */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Token:</span>
              <span className="px-2.5 py-1 rounded-lg bg-stone-900 text-white font-mono font-bold text-xs shadow-2xs">
                {token.tokenNumber}
              </span>
            </div>

            {/* Current Operational Status */}
            <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusPill.classes}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusPill.dot}`}></span>
              <span>{statusPill.label}</span>
            </span>
          </div>

          {/* Sanctuary Pulse Header Strip */}
          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 space-y-1">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-bold text-emerald-950">
                {pulseState.title}
              </span>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed pl-3.5">
              "{pulseState.message}"
            </p>
          </div>
        </div>

        {/* ======================================================== */}
        {/* DRAWER BODY */}
        {/* ======================================================== */}
        <div className="p-6 space-y-5 flex-1 divide-y divide-stone-100">
          
          {/* 1. VISIT DETAILS (Exact Specs: Concern, Doctor, Specialty, Pos, Ahead, Wait) */}
          <div className="space-y-3 pt-0">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Visit Overview
            </h3>

            <div className="bg-stone-50/80 rounded-2xl p-4 border border-stone-200/70 space-y-3 text-xs">
              {/* Current Concern */}
              <div>
                <span className="text-[10px] text-stone-400 font-semibold block uppercase">Current Concern</span>
                <p className="font-bold text-stone-900 mt-0.5 text-xs leading-snug">
                  {token.symptomsSummary || 'General follow-up consultation'}
                </p>
              </div>

              {/* Doctor & Specialty */}
              <div className="pt-2 border-t border-stone-200/60 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-stone-400 font-semibold block uppercase">Assigned Doctor</span>
                  <span className="font-bold text-stone-900 block mt-0.5 truncate">
                    {token.doctorName}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 font-semibold block uppercase">Specialty</span>
                  <span className="font-medium text-stone-600 block mt-0.5 truncate">
                    {token.specialty || 'General Medicine'}
                  </span>
                </div>
              </div>

              {/* Queue Position, Ahead, Estimated Wait */}
              <div className="pt-2 border-t border-stone-200/60 grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[10px] text-stone-400 font-semibold block uppercase">Queue Pos</span>
                  <span className="font-mono font-bold text-stone-900 block mt-0.5">
                    {token.status === 'in_consultation' ? 'Active' : `#${token.queuePosition || 1}`}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 font-semibold block uppercase">Patients Ahead</span>
                  <span className="font-mono font-semibold text-stone-700 block mt-0.5">
                    {token.status === 'in_consultation' ? '0' : `${patientsAhead}`}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 font-semibold block uppercase">Estimated Wait</span>
                  <span className="font-mono font-semibold text-emerald-800 block mt-0.5">
                    ~{estimatedWait} min
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. CLINICAL CONTEXT (Exact Specs: Diagnostic Journey, DPS, Trend, Attention, Explanation, Button) */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Clinical Context
              </h3>
              <span className="text-[10px] font-mono text-stone-400">Longitudinal Signal</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 font-semibold uppercase block">
                    Diagnostic Progress Score
                  </span>
                  <div className="flex items-baseline space-x-1.5 mt-0.5">
                    <span className="text-2xl font-black font-mono text-stone-900">
                      {token.dpsScore}
                    </span>
                    <span className="text-xs font-mono text-stone-400">/ 100</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-stone-400 font-semibold uppercase block">
                    Trajectory Trend
                  </span>
                  <span className={`text-xs font-extrabold block mt-0.5 ${
                    isCriticalStagnant 
                      ? 'text-rose-700' 
                      : isStagnant 
                      ? 'text-amber-700' 
                      : 'text-emerald-700'
                  }`}>
                    {isCriticalStagnant ? 'Stagnating' : isStagnant ? 'Stagnating' : 'Improving'}
                  </span>
                </div>
              </div>

              {/* Attention line */}
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 flex items-center justify-between">
                <span className="text-stone-500 font-medium text-[11px]">Attention:</span>
                <span className={`font-bold text-[11px] ${
                  isCriticalStagnant
                    ? 'text-rose-700'
                    : isStagnant
                    ? 'text-amber-800'
                    : 'text-stone-700'
                }`}>
                  {isCriticalStagnant 
                    ? 'Journey stagnating' 
                    : isStagnant 
                    ? 'Review recommended' 
                    : isSeniorReview 
                    ? 'Senior review' 
                    : 'Normal trajectory'}
                </span>
              </div>

              {/* Explanation */}
              <p className="text-[11px] text-stone-600 leading-relaxed">
                {token.stagnationReason || 
                  (isStagnant 
                    ? "Recent journey signals indicate limited convergence across previous clinical encounters."
                    : "Patient journey indicators reflect consistent diagnostic progression and timely specialist review.")
                }
              </p>

              {/* View Diagnostic Journey Button */}
              {onNavigateToDiagnosticJourney && (
                <button
                  type="button"
                  onClick={() => onNavigateToDiagnosticJourney(token.patientId)}
                  className="w-full py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 active:scale-95 text-white text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-2xs"
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>View Diagnostic Journey</span>
                </button>
              )}
            </div>
          </div>

          {/* 3. SANCTUARY PULSE RECENT STATES (Exact Specs: Progression Sequence) */}
          <div className="space-y-3 pt-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Sanctuary Pulse Experience
            </h3>

            <div className="bg-stone-50/70 rounded-2xl p-4 border border-stone-200/70 space-y-2.5 text-xs">
              <span className="text-[11px] text-stone-500 font-medium block mb-1">
                Recent Patient-Facing States:
              </span>

              <div className="space-y-2">
                {pulseSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center space-x-2.5">
                    {step.state === 'done' && (
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                    {step.state === 'active' && (
                      <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                      </span>
                    )}
                    {step.state === 'pending' && (
                      <span className="w-4 h-4 rounded-full border border-stone-300 text-stone-300 flex items-center justify-center shrink-0 text-[9px]">
                        ○
                      </span>
                    )}
                    <span className={`text-xs ${
                      step.state === 'active' 
                        ? 'font-bold text-stone-900' 
                        : step.state === 'done' 
                        ? 'text-stone-500 line-through' 
                        : 'text-stone-400'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* DRAWER ACTIONS (Exact Specs: Call Patient primary, Snapshot, Records, Skip) */}
        {/* ======================================================== */}
        <div className="p-6 border-t border-stone-200/80 bg-stone-50/90 space-y-2 sticky bottom-0 z-10">
          
          {/* Primary Action: "Call Patient" (or Start / Complete if already in flow) */}
          {isWaiting && (
            <button
              type="button"
              onClick={handleCall}
              className="w-full py-3.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 active:scale-[0.98] text-white text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-xs"
            >
              <Stethoscope className="w-4 h-4 text-emerald-400" />
              <span>Call Patient ({token.tokenNumber})</span>
            </button>
          )}

          {isCalled && (
            <button
              type="button"
              onClick={handleStartConsult}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-xs"
            >
              <Play className="w-4 h-4" />
              <span>Start Consultation in Bay</span>
            </button>
          )}

          {isInConsult && (
            <button
              type="button"
              onClick={handleComplete}
              className="w-full py-3.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 active:scale-[0.98] text-white text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-xs"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Complete Consultation</span>
            </button>
          )}

          {/* Secondary Action: "Prepare Snapshot" */}
          <button
            type="button"
            onClick={() => onOpenSnapshot(token)}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold transition-all flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Prepare Snapshot</span>
          </button>

          {/* Tertiary Action: "Open Patient Record" */}
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => onNavigateToRecords(token.patientId)}
              className="py-2.5 px-3 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 text-xs font-semibold transition-all flex items-center justify-center space-x-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-stone-500" />
              <span>Open Record</span>
            </button>

            {/* Skip Token / Recall */}
            {isSkipped ? (
              <button
                type="button"
                onClick={handleRecall}
                className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Recall Token</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSkip}
                className="py-2.5 px-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 text-stone-600 text-xs font-medium transition-all"
              >
                <span>Skip Token</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
