import React from 'react';
import { 
  AlertTriangle, ShieldCheck, TrendingDown, 
  Sparkles, CheckCircle2, ArrowRight, Activity, 
  Repeat, ArrowRightLeft, FileSearch, HelpCircle, 
  Shuffle, RefreshCw
} from 'lucide-react';

interface DpsSectionProps {
  onTriggerRebalance?: () => void;
}

export const DpsSection: React.FC<DpsSectionProps> = ({ onTriggerRebalance }) => {
  const scores = [
    { encounter: 'Encounter 1', score: 72, date: 'Month 1', status: 'Active investigation' },
    { encounter: 'Encounter 2', score: 69, date: 'Month 2', status: 'Symptomatic therapy' },
    { encounter: 'Encounter 3', score: 65, date: 'Month 4', status: 'Specialty referral' },
    { encounter: 'Encounter 4', score: 64, date: 'Month 5', status: 'Repeated imaging' },
    { encounter: 'Encounter 5', score: 63, date: 'Month 6', status: 'Plateaued progress' },
    { encounter: 'Encounter 6', score: 63, date: 'Month 7', status: 'Stagnation verified' },
  ];

  const OBSERVED_PATTERNS = [
    {
      title: 'REPEATED COMPLAINTS',
      description: 'Detect recurring unresolved complaints across encounters.',
      detail: 'Flagging patient journeys where chief complaint remains unchanged across multiple months.',
      icon: Repeat,
    },
    {
      title: 'SPECIALIST TRANSITIONS',
      description: 'Track repeated movement between specialties.',
      detail: 'Monitoring horizontal transitions across disconnected outpatient clinical departments.',
      icon: ArrowRightLeft,
    },
    {
      title: 'TEST REDUNDANCY',
      description: 'Identify repeated or low-novelty investigations.',
      detail: 'Surfacing duplicative non-contrast scans or standard panels ordered with diminishing returns.',
      icon: FileSearch,
    },
    {
      title: 'CLINICAL UNCERTAINTY',
      description: 'Surface persistent uncertainty signals in longitudinal notes.',
      detail: 'Detecting linguistic uncertainty markers ("etiology unclear", "trial medication") across EHR records.',
      icon: HelpCircle,
    },
    {
      title: 'HYPOTHESIS INSTABILITY',
      description: 'Observe how diagnostic hypotheses evolve across encounters.',
      detail: 'Measuring whether differential hypotheses are narrowing or shifting erratically.',
      icon: Shuffle,
    },
    {
      title: 'TREATMENT NON-RESOLUTION',
      description: 'Identify patterns where treatment changes without clear journey convergence.',
      detail: 'Highlighting symptom management adjustments made in the absence of root-cause diagnosis.',
      icon: RefreshCw,
    },
  ];

  return (
    <section id="diagnostic-journey" className="py-20 lg:py-28 bg-[#FAF9F6] border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION 4: THE INTELLIGENCE LAYER */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white border border-stone-200 text-[11px] font-bold tracking-[0.18em] text-[#15803D] uppercase shadow-2xs">
            <Activity className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>DIAGNOSTIC JOURNEY INTELLIGENCE</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-[-0.035em] text-stone-900 leading-tight">
            Measure whether the journey is actually moving forward.
          </h2>

          <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto pt-1">
            Odyssey Flow does not attempt to predict a disease. It analyzes the trajectory of the diagnostic process itself.
          </p>
        </div>

        {/* Premium Chart Visual Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-stone-200/90 shadow-sm max-w-5xl mx-auto mb-24 relative overflow-hidden">
          
          {/* Header of Chart Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <span className="text-[11px] uppercase font-bold text-stone-400 block tracking-wider">
                Case Analysis • Aarav Mehta (7-Month Longitudinal Window)
              </span>
              <h3 className="text-2xl font-bold text-stone-900 tracking-tight mt-0.5">
                Diagnostic Progress Score (DPS): 72 → 69 → 65 → 64 → 63 → 63
              </h3>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Potential stagnation</span>
              </span>
            </div>
          </div>

          {/* SVG Trajectory Chart Representation */}
          <div className="pt-8 pb-4">
            <div className="relative h-56 w-full">
              
              {/* Background Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between opacity-15 pointer-events-none">
                <div className="border-b border-dashed border-stone-900 w-full text-right text-[10px] text-stone-500 pr-2">80</div>
                <div className="border-b border-dashed border-stone-900 w-full text-right text-[10px] text-stone-500 pr-2">70</div>
                <div className="border-b border-dashed border-stone-900 w-full text-right text-[10px] text-stone-500 pr-2">60 (Threshold)</div>
                <div className="border-b border-dashed border-stone-900 w-full text-right text-[10px] text-stone-500 pr-2">50</div>
              </div>

              {/* Trajectory Polyline SVG */}
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 200">
                <defs>
                  <linearGradient id="dpsGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#16A34A" />
                    <stop offset="60%" stopColor="#EAB308" />
                    <stop offset="100%" stopColor="#DC2626" />
                  </linearGradient>
                </defs>

                {/* Stagnation Zone Shading */}
                <rect x="360" y="20" width="140" height="170" fill="#FEF3C7" opacity="0.35" rx="8" />

                {/* Curve line */}
                <path
                  d="M 20 50 L 110 75 L 210 110 L 310 120 L 400 130 L 480 130"
                  fill="none"
                  stroke="url(#dpsGradient)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Node Circles */}
                <circle cx="20" cy="50" r="5" fill="#16A34A" className="ring-4 ring-white" />
                <circle cx="110" cy="75" r="5" fill="#16A34A" />
                <circle cx="210" cy="110" r="5" fill="#EAB308" />
                <circle cx="310" cy="120" r="5" fill="#EAB308" />
                <circle cx="400" cy="130" r="6" fill="#DC2626" />
                <circle cx="480" cy="130" r="6" fill="#DC2626" />
              </svg>

              {/* Highlight callout on the plateau */}
              <div className="absolute right-4 top-4 bg-amber-50 border border-amber-300 rounded-xl p-2.5 shadow-sm text-xs max-w-[200px]">
                <div className="flex items-center space-x-1.5 font-bold text-amber-900 text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Potential stagnation</span>
                </div>
                <span className="text-[10px] text-amber-800 block mt-0.5">
                  Score flatlined at 63 across 2 consecutive visits without resolution.
                </span>
              </div>
            </div>

            {/* Encounter Marker Timeline Nodes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-4 border-t border-stone-100">
              {scores.map((pt, i) => (
                <div 
                  key={i} 
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    pt.score === 63 
                      ? 'bg-amber-50/60 border-amber-200' 
                      : 'bg-stone-50/60 border-stone-100'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase text-stone-400 block">{pt.encounter}</span>
                  <span className="text-xl font-black text-stone-900 font-mono block my-0.5">
                    {pt.score}
                  </span>
                  <span className="text-[10px] text-stone-500 font-medium block">{pt.date}</span>
                </div>
              ))}
            </div>

            {/* Clinical Action Bar & Regulatory Disclaimer */}
            <div className="mt-8 pt-5 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3 text-stone-800 font-bold text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                <span>System Recommendation: Clinical review recommended</span>
              </div>

              {/* Crucial Required Disclaimer */}
              <span className="text-[11px] font-semibold text-stone-400 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
                Process insight — not a diagnosis.
              </span>
            </div>

          </div>

        </div>

        {/* SECTION 5: WHAT THE SYSTEM OBSERVES */}
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h3 className="text-3xl font-extrabold tracking-tight text-stone-900">
              Built to see the patterns between visits.
            </h3>
            <p className="text-sm text-stone-500">
              Six structural longitudinal signals detected without making speculative disease predictions.
            </p>
          </div>

          {/* Clean 6-Card Minimalist Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {OBSERVED_PATTERNS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-2xs hover:border-stone-300 hover:shadow-xs transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold tracking-wider text-[#15803D] uppercase">
                        {item.title}
                      </span>
                      <Icon className="w-4 h-4 text-stone-400" />
                    </div>
                    <p className="text-sm font-bold text-stone-900 leading-snug">
                      "{item.description}"
                    </p>
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed pt-2 border-t border-stone-100">
                    {item.detail}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
