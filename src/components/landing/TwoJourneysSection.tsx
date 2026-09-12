import React from 'react';
import { 
  Clock, Stethoscope, AlertCircle, ArrowRight, 
  GitMerge, CheckCircle2, ShieldAlert, Sparkles 
} from 'lucide-react';

export const TwoJourneysSection: React.FC = () => {
  return (
    <section id="two-journeys" className="py-20 lg:py-28 bg-[#FAF9F6] border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white border border-stone-200 text-[11px] font-bold tracking-[0.18em] text-[#15803D] uppercase shadow-2xs">
            <span>THE DISCONNECTED JOURNEY</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-[-0.035em] text-stone-900 leading-tight">
            Two journeys.<br />
            <span className="text-stone-500 font-normal">One healthcare experience.</span>
          </h2>

          <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto pt-1">
            Outpatient healthcare is plagued by a fundamental systemic split: the operational queue operates completely blind to the patient’s longitudinal clinical trajectory.
          </p>
        </div>

        {/* Two Large Blocks: OPERATIONS vs CLINICAL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* BLOCK 1: OPERATIONS */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-stone-300 transition-all">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  OPERATIONS
                </span>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-stone-100 text-stone-700">
                  Waiting Room Reality
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 leading-snug">
                  "Patients wait without knowing what is happening."
                </h3>
                <p className="text-sm text-stone-500 mt-2 leading-relaxed">
                  Traditional hospital and clinic queues treat human beings like ticket numbers, producing pervasive anxiety, blind waiting, and operational bottlenecks.
                </p>
              </div>

              {/* 5 Structural Friction Points */}
              <div className="space-y-3 pt-2">
                {[
                  { title: 'Unmanaged queues', desc: 'Static paper or screen tokens with no situational awareness.' },
                  { title: 'Uncertain wait times', desc: 'Patients left stranded without knowing if delays are 5 or 50 minutes.' },
                  { title: 'Schedule drift', desc: 'Physicians fall behind while the reception desk absorbs patient frustration.' },
                  { title: 'Crowded waiting areas', desc: 'Physical congestion and contagion risk in packed hospital corridors.' },
                  { title: 'Inefficient patient flow', desc: 'Rooms sit idle between calls while delayed patients step away.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3 rounded-2xl bg-stone-50/70 border border-stone-100">
                    <div className="w-5 h-5 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      —
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">{item.title}</h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
              <span>Impact: High anxiety &amp; operational friction</span>
              <span className="font-mono text-stone-500">Queue Isolation</span>
            </div>
          </div>

          {/* BLOCK 2: CLINICAL */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-stone-300 transition-all">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  CLINICAL
                </span>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-stone-100 text-stone-700">
                  Consultation Reality
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 leading-snug">
                  "Doctors see the encounter. They rarely see the entire journey."
                </h3>
                <p className="text-sm text-stone-500 mt-2 leading-relaxed">
                  Clinicians get 8 to 12 minutes to parse through fragmented EHR notes, missing subtle patterns of stagnation across previous specialty visits.
                </p>
              </div>

              {/* 5 Clinical Failure Points */}
              <div className="space-y-3 pt-2">
                {[
                  { title: 'Repeated complaints', desc: 'Patients voicing the exact same unresolved symptoms visit after visit.' },
                  { title: 'Specialist transitions', desc: 'Bouncing between doctors with no unified longitudinal thread.' },
                  { title: 'Redundant investigations', desc: 'Duplicative blood tests and imaging ordered without diagnostic novelty.' },
                  { title: 'Persistent uncertainty', desc: 'Notes recurring with "symptomatic treatment" without closure.' },
                  { title: 'Diagnostic stagnation', desc: 'Months pass while the underlying pathology remains uncharacterized.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3 rounded-2xl bg-stone-50/70 border border-stone-100">
                    <div className="w-5 h-5 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      —
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">{item.title}</h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
              <span>Impact: Diagnostic delays &amp; duplicated costs</span>
              <span className="font-mono text-stone-500">Clinical Blindspot</span>
            </div>
          </div>

        </div>

        {/* VISUAL CONNECTION BRIDGE */}
        <div className="mt-12 bg-stone-900 text-white rounded-3xl p-8 sm:p-10 border border-stone-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          
          {/* Subtle green ambient accent */}
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-[#16A34A]/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-2 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center space-x-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#22C55E]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE ARCHITECTURAL LINK</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Odyssey Flow connects them.
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
              By translating longitudinal diagnostic complexity directly into live queue prioritization, clinicians get the context they need before the patient enters the room, and patients receive the care pacing they deserve.
            </p>
          </div>

          <div className="flex items-center space-x-4 shrink-0 bg-stone-800/80 p-4 rounded-2xl border border-stone-700/80">
            <div className="text-center px-2">
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Front Desk</span>
              <span className="text-sm font-black text-white">Smart Queue</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#16A34A] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <GitMerge className="w-4 h-4" />
            </div>
            <div className="text-center px-2">
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Consultation</span>
              <span className="text-sm font-black text-[#22C55E]">Diagnostic DPS</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
