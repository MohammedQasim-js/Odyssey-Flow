import React from 'react';
import { 
  AlertTriangle, Repeat, GitMerge, FileText, HelpCircle, 
  Activity, ShieldAlert, CheckCircle2, ArrowRight, Stethoscope,
  PlusCircle, Share2, Sparkles, FileEdit, CheckCircle
} from 'lucide-react';

interface JourneySignalsSidebarProps {
  onAddClinicalNote: () => void;
  onUpdateAssessment: () => void;
  onReviewInvestigations: () => void;
  onCreateReferral: () => void;
  onPrepareSnapshot: () => void;
  onEscalateMDT: () => void;
  onSelectReferral?: (specialty: string) => void;
}

export const JourneySignalsSidebar: React.FC<JourneySignalsSidebarProps> = ({
  onAddClinicalNote,
  onUpdateAssessment,
  onReviewInvestigations,
  onCreateReferral,
  onPrepareSnapshot,
  onEscalateMDT,
  onSelectReferral,
}) => {
  return (
    <div className="space-y-6">
      
      {/* 1. AI BOUNDARY (Restrained, crisp banner) */}
      <div className="p-3 rounded-2xl bg-stone-100/90 border border-stone-200/80 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-3.5 h-3.5 text-stone-600" />
          <span className="font-bold text-stone-800">
            Process insight — not a diagnosis.
          </span>
        </div>
        <span className="text-[10px] text-stone-500 font-medium">
          Workflow Audit Engine
        </span>
      </div>

      {/* 2. WHY THIS WAS FLAGGED (Prominent but restrained explanation box) */}
      <div className="bg-amber-50/70 border border-amber-300 rounded-3xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-800" />
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-950">
            Why review is recommended
          </h4>
        </div>
        
        <p className="text-xs text-amber-900 font-medium leading-relaxed">
          The longitudinal journey analyzer identified patterns consistent with diagnostic circularity:
        </p>

        <ul className="space-y-2 text-xs text-amber-900 font-medium">
          <li className="flex items-start space-x-2">
            <span className="text-amber-700 font-bold">•</span>
            <span>Same complaint appears across multiple encounters</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-amber-700 font-bold">•</span>
            <span>Patient transitioned between 3 specialties</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-amber-700 font-bold">•</span>
            <span>Similar investigation was repeated</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-amber-700 font-bold">•</span>
            <span>Clinical note uncertainty remained elevated</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-amber-700 font-bold">•</span>
            <span>DPS remained nearly flat recently</span>
          </li>
        </ul>
      </div>

      {/* 3. CURRENT CLINICAL STATE */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
          <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">
            Current Clinical State
          </span>
          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
            Potential Stagnation
          </span>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-start justify-between">
            <span className="text-stone-500 font-medium">Current concern:</span>
            <strong className="text-stone-900 text-right">Persistent headache</strong>
          </div>
          <div className="flex items-start justify-between">
            <span className="text-stone-500 font-medium">Current specialist:</span>
            <strong className="text-stone-900 text-right">General Medicine</strong>
          </div>
          <div className="flex items-start justify-between">
            <span className="text-stone-500 font-medium">Last investigation:</span>
            <strong className="text-stone-900 text-right">Brain MRI (Non-contrast)</strong>
          </div>
          <div className="flex items-start justify-between">
            <span className="text-stone-500 font-medium">Last documented outcome:</span>
            <strong className="text-stone-900 text-right">Follow-up required</strong>
          </div>
          <div className="flex items-start justify-between pt-1 border-t border-stone-100">
            <span className="text-stone-500 font-medium">Current journey state:</span>
            <span className="font-extrabold text-amber-800">Potential stagnation</span>
          </div>
        </div>
      </div>

      {/* 4. JOURNEY SIGNALS CARD */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
              Journey Signals
            </h4>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Automated pattern detection across clinical trajectory
            </p>
          </div>
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
        </div>

        <div className="space-y-3">
          
          {/* Signal 1: Repeated Complaint */}
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
              <Repeat className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">Repeated complaint</span>
                <span className="text-[11px] font-mono font-extrabold text-amber-900 bg-amber-200/60 px-1.5 py-0.2 rounded">
                  5 encounters
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                Unresolved headache reported in 5 sequential visits across 3 facilities.
              </p>
            </div>
          </div>

          {/* Signal 2: Specialist Transitions */}
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-800 shrink-0 mt-0.5">
              <GitMerge className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">Specialist transitions</span>
                <span className="text-[11px] font-mono font-extrabold text-indigo-900 bg-indigo-200/60 px-1.5 py-0.2 rounded">
                  3
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                General Medicine → Neurology → ENT without closed-loop diagnostic convergence.
              </p>
            </div>
          </div>

          {/* Signal 3: Repeated Investigations */}
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-800 shrink-0 mt-0.5">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">Repeated investigations</span>
                <span className="text-[11px] font-mono font-extrabold text-rose-900 bg-rose-200/60 px-1.5 py-0.2 rounded">
                  2
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                Duplicate Brain MRI performed with zero additive radiological yield.
              </p>
            </div>
          </div>

          {/* Signal 4: Note Uncertainty */}
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">Note uncertainty</span>
                <span className="text-[11px] font-mono font-extrabold text-amber-900 bg-amber-200/60 px-1.5 py-0.2 rounded">
                  Elevated
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                Clinical documentation contains persistent markers like "ambiguous" and "atypical".
              </p>
            </div>
          </div>

          {/* Signal 5: Hypothesis Instability */}
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-stone-200 text-stone-800 shrink-0 mt-0.5">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">Hypothesis instability</span>
                <span className="text-[11px] font-mono font-extrabold text-stone-900 bg-stone-200 px-1.5 py-0.2 rounded">
                  Moderate
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                Working diagnosis shifted between tension, migraine, and sinus etiology.
              </p>
            </div>
          </div>

          {/* Signal 6: Treatment Non-resolution */}
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-800 shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">Treatment non-resolution</span>
                <span className="text-[11px] font-mono font-extrabold text-rose-900 bg-rose-200/60 px-1.5 py-0.2 rounded">
                  Detected
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                Zero sustained therapeutic response across three discrete drug regimens.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 5. REFERRAL HISTORY */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
          <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">
            Referral History
          </span>
          <span className="text-[11px] text-stone-400 font-mono">
            3 Tracked
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div 
            onClick={() => onSelectReferral && onSelectReferral('Neurology')}
            className="p-2.5 rounded-xl border border-stone-200 flex items-center justify-between hover:bg-stone-50 cursor-pointer transition-colors"
          >
            <div>
              <span className="font-bold text-stone-900 block">Neurology</span>
              <span className="text-[10px] text-stone-500">Dr. Priya Desai • 14 Feb 2026</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-semibold">
              Completed
            </span>
          </div>

          <div 
            onClick={() => onSelectReferral && onSelectReferral('ENT')}
            className="p-2.5 rounded-xl border border-stone-200 flex items-center justify-between hover:bg-stone-50 cursor-pointer transition-colors"
          >
            <div>
              <span className="font-bold text-stone-900 block">ENT</span>
              <span className="text-[10px] text-stone-500">Dr. R. K. Gupta • 12 Mar 2026</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-semibold">
              Completed
            </span>
          </div>

          <div 
            onClick={() => onSelectReferral && onSelectReferral('Multidisciplinary Review')}
            className="p-2.5 rounded-xl border border-amber-300 bg-amber-50/60 flex items-center justify-between hover:bg-amber-100/60 cursor-pointer transition-colors"
          >
            <div>
              <span className="font-bold text-amber-950 block">Multidisciplinary Review</span>
              <span className="text-[10px] text-amber-800">Closed-loop escalation • Stagnation flag</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-extrabold">
              Recommended
            </span>
          </div>
        </div>
      </div>

      {/* 6. DOCTOR ACTION AREA */}
      <div className="bg-stone-900 text-white rounded-3xl p-5 border border-stone-800 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 border-b border-stone-800 pb-2">
          <Stethoscope className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-200">
            Doctor Action Area
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-2 text-xs">
          <button
            type="button"
            onClick={onAddClinicalNote}
            className="w-full py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold transition-all flex items-center justify-between"
          >
            <span>Add Clinical Note</span>
            <FileEdit className="w-3.5 h-3.5 text-stone-400" />
          </button>

          <button
            type="button"
            onClick={onUpdateAssessment}
            className="w-full py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold transition-all flex items-center justify-between"
          >
            <span>Update Assessment</span>
            <Activity className="w-3.5 h-3.5 text-stone-400" />
          </button>

          <button
            type="button"
            onClick={onReviewInvestigations}
            className="w-full py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold transition-all flex items-center justify-between"
          >
            <span>Review Investigations</span>
            <FileText className="w-3.5 h-3.5 text-stone-400" />
          </button>

          <button
            type="button"
            onClick={onCreateReferral}
            className="w-full py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold transition-all flex items-center justify-between"
          >
            <span>Create Referral</span>
            <Share2 className="w-3.5 h-3.5 text-stone-400" />
          </button>

          <button
            type="button"
            onClick={onPrepareSnapshot}
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all flex items-center justify-between shadow-xs"
          >
            <span>Prepare Clinical Snapshot</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
          </button>

          <button
            type="button"
            onClick={onEscalateMDT}
            className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-all flex items-center justify-between shadow-xs"
          >
            <span>Escalate for Multidisciplinary Review</span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-900" />
          </button>
        </div>
      </div>

    </div>
  );
};
