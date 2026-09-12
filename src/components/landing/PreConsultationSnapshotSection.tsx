import React from 'react';
import { 
  Stethoscope, AlertTriangle, ArrowRight, CheckCircle2, 
  Clock, ShieldAlert, Sparkles, User, FileText, Share2 
} from 'lucide-react';

interface PreConsultationSnapshotSectionProps {
  onOpenClinicApp: () => void;
}

export const PreConsultationSnapshotSection: React.FC<PreConsultationSnapshotSectionProps> = ({
  onOpenClinicApp,
}) => {
  return (
    <section className="py-20 lg:py-28 bg-[#FAF9F6] border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">
          
          {/* LEFT: Large Browser-Style Doctor Dashboard Preview (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden">
              
              {/* Browser Window Header */}
              <div className="bg-[#FAF9F6] border-b border-stone-200/80 px-4 py-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-300"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-300"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-300"></span>
                  <span className="text-[11px] font-mono text-stone-400 ml-2">clinic-station://pre-consult/A-27</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Pre-Consultation Snapshot
                </span>
              </div>

              {/* Snapshot Content Container */}
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Patient Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center font-bold text-base shadow-xs">
                      A-27
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-bold text-stone-900">Aarav Mehta</h4>
                        <span className="text-xs font-semibold text-stone-500">32y • Male</span>
                      </div>
                      <span className="text-xs text-stone-500 block mt-0.5">
                        Current concern: <strong className="text-stone-800">Persistent headache</strong>
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Exam Room</span>
                    <span className="text-xs font-bold text-stone-800">Suite 101 • Dr. A. Sharma</span>
                  </div>
                </div>

                {/* Longitudinal Metrics 4-Box Bar */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2.5 bg-stone-50 rounded-2xl border border-stone-100">
                    <span className="text-[9px] uppercase font-bold text-stone-400 block">Journey</span>
                    <span className="text-sm font-black text-stone-900">7 months</span>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-2xl border border-stone-100">
                    <span className="text-[9px] uppercase font-bold text-stone-400 block">Encounters</span>
                    <span className="text-sm font-black text-stone-900">6</span>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-2xl border border-stone-100">
                    <span className="text-[9px] uppercase font-bold text-stone-400 block">Specialties</span>
                    <span className="text-sm font-black text-stone-900">3</span>
                  </div>
                  <div className="p-2.5 bg-amber-50 rounded-2xl border border-amber-200">
                    <span className="text-[9px] uppercase font-bold text-amber-700 block">DPS Score</span>
                    <span className="text-sm font-black text-amber-900 font-mono">63 / 100</span>
                  </div>
                </div>

                {/* Stagnation Banner */}
                <div className="p-3.5 bg-amber-50/90 rounded-2xl border border-amber-200 flex items-start space-x-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900">
                    <span className="font-bold block">Trend: Stagnating</span>
                    <span>Diagnostic trajectory flatlined across primary care and ophthalmology visits.</span>
                  </div>
                </div>

                {/* 4 Detected Signals */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Detected Signals:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-stone-50 rounded-xl border border-stone-100 flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      <span className="font-semibold text-stone-800">Repeated complaint</span>
                    </div>
                    <div className="p-2 bg-stone-50 rounded-xl border border-stone-100 flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      <span className="font-semibold text-stone-800">Investigation redundancy</span>
                    </div>
                    <div className="p-2 bg-stone-50 rounded-xl border border-stone-100 flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      <span className="font-semibold text-stone-800">Specialist transitions</span>
                    </div>
                    <div className="p-2 bg-stone-50 rounded-xl border border-stone-100 flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      <span className="font-semibold text-stone-800">Persistent uncertainty</span>
                    </div>
                  </div>
                </div>

                {/* Doctor Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={onOpenClinicApp}
                    className="w-full sm:w-auto flex-1 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors text-center"
                  >
                    Review Journey
                  </button>
                  <button
                    onClick={onOpenClinicApp}
                    className="w-full sm:w-auto flex-1 py-2.5 rounded-xl bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-bold transition-colors text-center"
                  >
                    Escalate for Multidisciplinary Review
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT: Editorial Copy & Narrative (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white border border-stone-200 text-[11px] font-bold tracking-[0.18em] text-[#15803D] uppercase shadow-2xs">
              <Stethoscope className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>CLINICAL COGNITION ACCELERATOR</span>
            </div>

            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900 leading-tight">
              Give clinicians the journey, not just the visit.
            </h3>

            <p className="text-base text-stone-600 leading-relaxed">
              When a patient is called, the clinician gets a concise pre-consultation view of the diagnostic journey before the consultation begins.
            </p>

            <ul className="space-y-3 text-sm text-stone-600 pt-2">
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
                <span>Zero EHR spelunking — instant synthesis of all prior investigations.</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
                <span>Prevents the third duplicative non-contrast scan from being ordered.</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
                <span>Prepares referral channels before the consultation concludes.</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={onOpenClinicApp}
                className="px-6 py-3 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center space-x-2 transition-all shadow-sm cursor-pointer"
              >
                <span>Launch Clinical Snapshot in Demo</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#22C55E]" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
