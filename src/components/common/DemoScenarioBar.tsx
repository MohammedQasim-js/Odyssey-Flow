import React, { useState } from 'react';
import { 
  Play, RotateCcw, ChevronRight, ChevronLeft, CheckCircle2, 
  Sparkles, Stethoscope, ArrowRight, Eye, Smartphone, LayoutDashboard,
  ShieldCheck, AlertTriangle, Activity, Share2, Layers, Check, X
} from 'lucide-react';
import { DataStore } from '../../services/dataStore';
import { Token, Patient } from '../../types';

export interface DemoStep {
  stepNumber: number;
  title: string;
  tagline: string;
  viewTarget: 'patient' | 'clinic' | 'split';
  patientTab?: 'home' | 'pulse' | 'checkin' | 'clinics' | 'history' | 'billing';
  clinicTab?: 'queue' | 'analytics' | 'referrals';
  openTokenSnapshot?: string;
  actionSummary: string;
  patientSees: string;
  clinicSees: string;
}

export const DEMO_STEPS: DemoStep[] = [
  {
    stepNumber: 1,
    title: 'Identity Verification',
    tagline: 'Simulated Zero-Friction Aadhaar Lookup',
    viewTarget: 'patient',
    patientTab: 'home',
    actionSummary: 'Patient enters +91 98XXXXXX42, OTP simulated (4242), returns verified identity.',
    patientSees: 'Identity found: Aarav Mehta (XXXX XXXX 2741) with prototype badge.',
    clinicSees: 'System verifies longitudinal UHID link with zero registration friction.',
  },
  {
    stepNumber: 2,
    title: 'Check-In & Token Generation',
    tagline: 'Odyssey Care Clinic Intake',
    viewTarget: 'patient',
    patientTab: 'checkin',
    actionSummary: 'Patient checks in for Consultation with Persistent headache and Fatigue.',
    patientSees: 'Generated Token A-27 for Dr. A. Sharma. Enters live queue.',
    clinicSees: 'Token A-27 registered in clinic queue. Wait time initialized (~24m).',
  },
  {
    stepNumber: 3,
    title: 'Sanctuary Pulse Initial State',
    tagline: 'Empathy Engine Queue Stable',
    viewTarget: 'split',
    patientTab: 'pulse',
    clinicTab: 'queue',
    actionSummary: 'Sanctuary Pulse converts queue telemetry into calm reassurance.',
    patientSees: '"Queue stable" • Position: 7 • Estimated wait: ~24 min.',
    clinicSees: 'Admin live queue shows Token A-27 with "Waiting / Queue stable".',
  },
  {
    stepNumber: 4,
    title: 'Queue Moves',
    tagline: 'Clinic Operating Normally',
    viewTarget: 'split',
    patientTab: 'pulse',
    clinicTab: 'queue',
    actionSummary: 'Admin advances queue. Current serving progresses A-20 → A-21 → A-22 → A-23.',
    patientSees: '"Clinic is moving" • "A few patients ahead of you" • Position 4 • ETA ~16 min.',
    clinicSees: 'Queue serving counter increments; patient dwell times updated.',
  },
  {
    stepNumber: 5,
    title: 'Approaching Turn',
    tagline: 'Call Window Proximity Notice',
    viewTarget: 'split',
    patientTab: 'pulse',
    clinicTab: 'queue',
    actionSummary: 'Queue position reaches 2 ahead. Proactive preparation prompt triggered.',
    patientSees: '"Your turn is getting close" • Position 2 • ETA ~8 min.',
    clinicSees: 'Token A-27 flagged: "Almost your turn" • Ready for intake snapshot.',
  },
  {
    stepNumber: 6,
    title: 'Diagnostic Journey & Snapshot',
    tagline: 'Longitudinal Stagnation Flagged',
    viewTarget: 'clinic',
    clinicTab: 'queue',
    openTokenSnapshot: 'A-27',
    actionSummary: 'Doctor opens Token A-27. Pre-Consultation Snapshot opens automatically.',
    patientSees: 'Sanctuary Pulse: "Doctor reviewing records" • Empathetic delay buffer.',
    clinicSees: 'Banner: "Potential diagnostic journey stagnation" • 6 encounters, 3 specialties, repeated complaint, 2 repeated tests, DPS=63.',
  },
  {
    stepNumber: 7,
    title: 'Queue Rebalancing',
    tagline: 'Stagnation-Aware Policy Engine',
    viewTarget: 'clinic',
    clinicTab: 'queue',
    openTokenSnapshot: 'A-27',
    actionSummary: 'Queue Policy Engine applies 15m window and buffers downstream tokens.',
    patientSees: 'Sanctuary Pulse maintains calm guidance without anxiety-inducing alerts.',
    clinicSees: 'Expected duration: 10 min → 15 min (+5 min buffer). Routing: Senior review eligible. Downstream tokens (A-28, A-29) updated.',
  },
  {
    stepNumber: 8,
    title: 'Doctor Consultation',
    tagline: 'Clinical Evaluation & Escalation',
    viewTarget: 'split',
    patientTab: 'pulse',
    clinicTab: 'queue',
    openTokenSnapshot: 'A-27',
    actionSummary: 'Doctor clicks "Start Consultation" and escalates to multidisciplinary panel.',
    patientSees: '"Your consultation is in progress" • Room 101 with Dr. A. Sharma.',
    clinicSees: 'Consultation active. Clinical note logged: Refractory chronic cephalalgia; escalated to panel.',
  },
  {
    stepNumber: 9,
    title: 'Specialist Referral',
    tagline: 'Targeted Neurology Panel Referral',
    viewTarget: 'clinic',
    clinicTab: 'referrals',
    actionSummary: 'Physician generates targeted referral to specialized neurology team.',
    patientSees: 'Instant digital notification of pending specialist consult.',
    clinicSees: 'Referral created: Neurology • Priority: Recommended • Status: Pending • Token: REF-NEURO-27.',
  },
  {
    stepNumber: 10,
    title: 'Journey Update & DPS Elevation',
    tagline: 'Stagnation Broken: DPS 63 → 68',
    viewTarget: 'clinic',
    clinicTab: 'analytics',
    actionSummary: 'Diagnostic event logged. DPS engine recalculates longitudinal progress.',
    patientSees: 'Trajectory updated to "Journey showing improvement".',
    clinicSees: 'DPS recalculates: 63 → 68 (+5 pts). Patient stagnation flag cleared.',
  },
  {
    stepNumber: 11,
    title: 'Patient Experience',
    tagline: 'Empowered & Informed Patient View',
    viewTarget: 'patient',
    patientTab: 'history',
    actionSummary: 'Aarav opens "Journey" tab in patient mobile app.',
    patientSees: 'Previous visits in plain language, active Neurology referral (REF-NEURO-27), and DPS 68/100.',
    clinicSees: 'Patient reads synchronized care plan with zero administrative friction.',
  },
  {
    stepNumber: 12,
    title: 'Admin Insights & System Metrics',
    tagline: 'Population Health & Clinic Impact',
    viewTarget: 'clinic',
    clinicTab: 'analytics',
    actionSummary: 'Clinic operations dashboard updates all aggregate intelligence.',
    patientSees: 'Completed visit summary and scheduled follow-up reminder.',
    clinicSees: 'Stagnating journeys: 3 → 2 (-33%). Active referrals: +1. Average wait recalculated.',
  },
];

interface DemoScenarioBarProps {
  currentStep: number;
  onSelectStep: (stepNumber: number) => void;
  onReset: () => void;
  isSplitView: boolean;
  onToggleSplitView: () => void;
}

export const DemoScenarioBar: React.FC<DemoScenarioBarProps> = ({
  currentStep,
  onSelectStep,
  onReset,
  isSplitView,
  onToggleSplitView,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const step = DEMO_STEPS.find(s => s.stepNumber === currentStep) || DEMO_STEPS[0];

  const handleNext = () => {
    if (currentStep < 12) {
      onSelectStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      onSelectStep(currentStep - 1);
    }
  };

  return (
    <aside 
      aria-label="Interactive Demo Simulation Controller"
      className="sticky top-16 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-700/80 text-white transition-all shadow-xl"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-3">
          
          {/* Left: Current Step Tag & Title */}
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="flex items-center space-x-1.5 shrink-0">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-black uppercase tracking-wider">
                DEMO SCENARIO
              </span>
              <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-200 text-xs font-mono font-bold">
                Step {step.stepNumber}/12
              </span>
            </div>

            <div className="truncate">
              <span className="text-xs sm:text-sm font-extrabold text-white">
                {step.title}:
              </span>
              <span className="text-xs text-stone-300 ml-1.5 font-medium hidden sm:inline">
                {step.tagline}
              </span>
            </div>
          </div>

          {/* Right: Controls & Navigation */}
          <div className="flex items-center space-x-2 shrink-0">
            
            {/* Split View Toggle */}
            <button
              onClick={onToggleSplitView}
              title={isSplitView ? "Switch to single view" : "Switch to side-by-side split screen"}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                isSplitView 
                  ? 'bg-emerald-500 text-stone-950 font-black' 
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{isSplitView ? 'Dual Split View Active' : 'Dual Split View'}</span>
            </button>

            {/* Prev Button */}
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Previous Step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Next Step Button */}
            <button
              onClick={handleNext}
              disabled={currentStep === 12}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center space-x-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>{currentStep === 12 ? 'Completed' : 'Next Step'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Reset Demo Button */}
            <button
              id="demo-bar-reset-btn"
              onClick={onReset}
              className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-all text-xs font-semibold flex items-center space-x-1.5"
              title="Reset Demo Scenario to Step 1"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            {/* Expand / Collapse Details */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-2 py-1 text-[11px] font-semibold text-stone-400 hover:text-white"
            >
              {isExpanded ? 'Less' : 'Details'}
            </button>

          </div>

        </div>

        {/* Expandable Step Description & Progress Indicators */}
        {isExpanded && (
          <div className="mt-2.5 pt-2.5 border-t border-stone-800/80 grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
            
            {/* Step Timeline Indicator Dots */}
            <div className="md:col-span-12 flex items-center justify-between gap-1 overflow-x-auto pb-1 scrollbar-none">
              {DEMO_STEPS.map((s) => {
                const isActive = s.stepNumber === currentStep;
                const isPast = s.stepNumber < currentStep;

                return (
                  <button
                    key={s.stepNumber}
                    onClick={() => onSelectStep(s.stepNumber)}
                    className={`flex items-center space-x-1 px-2 py-1 rounded-md text-[10px] font-semibold transition-all whitespace-nowrap shrink-0 ${
                      isActive 
                        ? 'bg-emerald-500 text-stone-950 font-black shadow-xs ring-1 ring-emerald-400' 
                        : isPast 
                        ? 'bg-emerald-950/70 text-emerald-400 hover:bg-emerald-900/50' 
                        : 'bg-stone-800/80 text-stone-400 hover:bg-stone-800'
                    }`}
                  >
                    <span>{isPast ? '✓' : s.stepNumber}.</span>
                    <span className="truncate max-w-[85px] sm:max-w-[110px]">{s.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Comparison Details: Patient sees vs Clinic sees */}
            <div className="md:col-span-6 bg-stone-800/50 rounded-xl p-2.5 border border-stone-800 flex items-start space-x-2">
              <Smartphone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-300 text-[11px] uppercase tracking-wider block">Patient App Perspective</strong>
                <p className="text-stone-200 text-xs mt-0.5 leading-snug font-medium">
                  {step.patientSees}
                </p>
              </div>
            </div>

            <div className="md:col-span-6 bg-stone-800/50 rounded-xl p-2.5 border border-stone-800 flex items-start space-x-2">
              <LayoutDashboard className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-300 text-[11px] uppercase tracking-wider block">Clinic &amp; Doctor Perspective</strong>
                <p className="text-stone-200 text-xs mt-0.5 leading-snug font-medium">
                  {step.clinicSees}
                </p>
              </div>
            </div>

          </div>
        )}

      </div>
    </aside>
  );
};
