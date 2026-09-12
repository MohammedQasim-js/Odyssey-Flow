import React from 'react';
import { 
  ArrowRight, RefreshCw, Sparkles, CheckCircle2, 
  RotateCw, Layers, ShieldCheck 
} from 'lucide-react';

export const ClosedLoopSection: React.FC = () => {
  const WORKFLOW_STEPS = [
    { title: 'Check-in', note: 'Token generated & historical link made' },
    { title: 'Queue', note: 'Sanctuary Pulse empathetic wait pacing' },
    { title: 'Consultation', note: 'Pre-consultation snapshot armed' },
    { title: 'Clinical Event', note: 'Findings & investigations logged' },
    { title: 'Journey Update', note: 'Longitudinal record updated' },
    { title: 'DPS Recalculation', note: 'Progress trajectory scored (63 → 68)' },
    { title: 'Referral / Review', note: 'Multidisciplinary escalation' },
    { title: 'Next Consultation', note: 'Incoming doctor receives full context' },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#FAF9F6] border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white border border-stone-200 text-[11px] font-bold tracking-[0.18em] text-[#15803D] uppercase shadow-2xs">
            <RotateCw className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>CONTINUOUS CARE CONTINUUM</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-[-0.035em] text-stone-900 leading-tight">
            Every consultation becomes part of the next decision.
          </h2>

          <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto pt-1">
            Odyssey Flow does not stop at a token being served. The patient's journey continues to evolve.
          </p>
        </div>

        {/* Product Workflow Board */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-sm">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WORKFLOW_STEPS.map((step, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-[#FAF9F6] border border-stone-200/80 hover:border-stone-400 transition-all flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold text-stone-400 bg-white px-2 py-0.5 rounded-md border border-stone-200">
                      Step 0{idx + 1}
                    </span>
                    {idx < WORKFLOW_STEPS.length - 1 ? (
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#16A34A] transition-colors" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5 text-[#16A34A]" />
                    )}
                  </div>
                  
                  <h4 className="text-sm font-bold text-stone-900 leading-snug">
                    {step.title}
                  </h4>
                </div>

                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  {step.note}
                </p>
              </div>
            ))}
          </div>

          {/* Workflow Bottom Summary */}
          <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
            <span className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              <span>Full auditability across all 14 clinical and operational entities</span>
            </span>
            <span className="font-semibold text-stone-900 bg-stone-100 px-3 py-1 rounded-full">
              Closed-Loop Care Feedback
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};
