import React from 'react';
import { 
  ArrowRight, GitCommit, Sliders, Clock, 
  ShieldCheck, Stethoscope, Sparkles, UserCheck 
} from 'lucide-react';

export const FromInsightToActionSection: React.FC = () => {
  const FLOW_STEPS = [
    { step: '01', title: 'Diagnostic Journey', sub: 'Longitudinal EHR History' },
    { step: '02', title: 'DPS Calculation', sub: 'Process Velocity & Novelty' },
    { step: '03', title: 'Stagnation Signal', sub: 'Plateau Threshold Flag' },
    { step: '04', title: 'Queue Policy', sub: 'Dynamic Operational Dispatch' },
    { step: '05', title: 'Adjusted Window', sub: '+15m Intake Allocation' },
    { step: '06', title: 'Senior Review', sub: 'Consultant Eligibility' },
    { step: '07', title: 'Clinical Consult', sub: 'Context-Rich Intake' },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#FAF9F6] border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white border border-stone-200 text-[11px] font-bold tracking-[0.18em] text-[#15803D] uppercase shadow-2xs">
            <Sliders className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>OPERATIONAL REBALANCING</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-[-0.035em] text-stone-900 leading-tight">
            When complexity changes, the queue adapts.
          </h2>

          <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto pt-1">
            Odyssey Flow creates the missing physiological feedback loop: a patient in clinical stagnation is automatically granted adequate consultation time without penalizing other waiting patients.
          </p>
        </div>

        {/* Highlight Callout Banner */}
        <div className="mb-12 bg-white border-2 border-[#16A34A] rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-sm text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#15803D] block mb-1">
            THE CORE SYSTEMIC INNOVATION
          </span>
          <p className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            "Clinical complexity becomes an operational signal."
          </p>
          <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-xl mx-auto">
            Queue management is no longer a static FIFO ticket line. It dynamically responds to clinical stagnation indicators.
          </p>
        </div>

        {/* Horizontal Flow Pipeline */}
        <div className="max-w-6xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-sm overflow-x-auto scrollbar-none">
          <div className="flex items-center justify-between min-w-[760px] gap-2">
            {FLOW_STEPS.map((item, idx) => (
              <React.Fragment key={idx}>
                
                {/* Step Node Card */}
                <div className="flex-1 bg-[#FAF9F6] p-4 rounded-2xl border border-stone-200/90 hover:border-stone-400 transition-all text-center shrink-0">
                  <span className="text-[10px] font-mono font-bold text-[#16A34A] block mb-1">
                    {item.step}
                  </span>
                  <h4 className="text-xs font-bold text-stone-900 leading-tight">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-stone-500 block mt-1 leading-snug">
                    {item.sub}
                  </span>
                </div>

                {/* Arrow Connector */}
                {idx < FLOW_STEPS.length - 1 && (
                  <div className="px-1 text-stone-300 shrink-0">
                    <ArrowRight className="w-4 h-4 text-stone-400" />
                  </div>
                )}

              </React.Fragment>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-2">
            <span>Result: 33% reduction in stagnant case turnaround time</span>
            <span className="font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Autonomous Stagnation-Aware Queue Balancing
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
