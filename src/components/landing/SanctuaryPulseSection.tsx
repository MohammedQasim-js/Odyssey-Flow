import React, { useState } from 'react';
import { 
  HeartPulse, CheckCircle2, Clock, ArrowRight, 
  Sparkles, Stethoscope, ChevronRight, ShieldCheck, 
  Activity, UserCheck, BellRing, Info
} from 'lucide-react';

interface SanctuaryPulseSectionProps {
  onOpenPatientApp: () => void;
}

export const SanctuaryPulseSection: React.FC<SanctuaryPulseSectionProps> = ({
  onOpenPatientApp,
}) => {
  // Interactive state switcher for the showcase
  const [activeStateExample, setActiveStateExample] = useState<number>(0);

  const STATE_EXAMPLES = [
    {
      title: 'Doctor reviewing history',
      subtitle: 'Longitudinal record review in progress',
      badge: 'Clinician Focused',
      note: 'Dr. A. Sharma is examining previous investigation trajectory.',
      stateLabel: 'Doctor reviewing history',
      progressStep: 3,
    },
    {
      title: "You're comfortably on track",
      subtitle: 'Clinic pace is optimal and relaxed',
      badge: 'Queue Stable',
      note: 'Feel free to visit the cafe or garden; we will chime 10m before.',
      stateLabel: 'Comfortably on track',
      progressStep: 2,
    },
    {
      title: 'Your turn is getting close',
      subtitle: 'Now 2 patients ahead',
      badge: 'Preparation',
      note: 'Please transition towards Consultation Suite corridor 1.',
      stateLabel: 'Getting Close',
      progressStep: 4,
    },
    {
      title: 'Please report to reception',
      subtitle: 'Directing to Exam Room 101',
      badge: 'Called Now',
      note: 'Dr. A. Sharma is ready to begin your comprehensive intake.',
      stateLabel: 'Room 101 Ready',
      progressStep: 5,
    },
  ];

  return (
    <section id="sanctuary-pulse" className="py-20 lg:py-32 bg-[#EFF7F2] border-t border-b border-emerald-200/60 relative overflow-hidden">
      
      {/* Soft Ambient Radiance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-200/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white border border-emerald-200 text-[11px] font-bold tracking-[0.18em] text-[#15803D] uppercase shadow-2xs">
            <HeartPulse className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>MEET SANCTUARY PULSE</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.035em] text-stone-900 leading-tight">
            Waiting shouldn't feel like waiting.
          </h2>

          <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto pt-1">
            Instead of leaving patients alone with a countdown, Odyssey Flow explains what is happening in the clinic — calmly, clearly, and in real time.
          </p>
        </div>

        {/* Major Sanctuary Pulse Visual Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center max-w-5xl mx-auto">
          
          {/* LEFT: Large Mobile UI Mockup */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-[340px] bg-white rounded-[40px] p-6 shadow-2xl border-4 border-stone-900 relative overflow-hidden">
              
              {/* Phone Speaker & Camera Notch */}
              <div className="w-32 h-4 bg-stone-900 rounded-full mx-auto mb-4"></div>

              {/* Mobile App Header */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    SANCTUARY PULSE
                  </span>
                </div>
                <span className="text-xs font-mono font-black text-stone-900 bg-stone-100 px-2 py-0.5 rounded-md">
                  Token A-27
                </span>
              </div>

              {/* Status Header */}
              <div className="text-center pt-5 pb-3">
                <span className="inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 mb-2">
                  Queue stable
                </span>
                <h4 className="text-lg font-black text-stone-900 tracking-tight leading-tight">
                  "Everything is moving normally."
                </h4>
                <p className="text-[11px] text-stone-500 mt-1">
                  Dr. A. Sharma • General Medicine • Room 101
                </p>
              </div>

              {/* Concentric Organic Wave Ring Graphic */}
              <div className="relative w-36 h-36 mx-auto my-3 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-emerald-200/40 animate-ping duration-1000"></div>
                <div className="absolute inset-3 rounded-full bg-emerald-300/30 animate-pulse"></div>
                <div className="absolute inset-6 rounded-full bg-emerald-400/20"></div>
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#16A34A] to-emerald-700 text-white flex flex-col items-center justify-center shadow-md">
                  <HeartPulse className="w-7 h-7" />
                </div>
              </div>

              {/* Live Numbers Grid */}
              <div className="grid grid-cols-3 gap-2 bg-stone-50/80 p-3 rounded-2xl border border-stone-100 text-center">
                <div>
                  <span className="text-[9px] uppercase font-bold text-stone-400 block">Serving</span>
                  <span className="text-xs font-black text-stone-800 font-mono">A-20</span>
                </div>
                <div className="border-x border-stone-200">
                  <span className="text-[9px] uppercase font-bold text-stone-400 block">Ahead</span>
                  <span className="text-xs font-black text-stone-800">6 patients</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-stone-400 block">ETA</span>
                  <span className="text-xs font-black text-emerald-700 font-mono">~24 min</span>
                </div>
              </div>

              {/* Vertical State Progression */}
              <div className="mt-5 space-y-3 px-2">
                <div className="flex items-center space-x-3 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span className="text-stone-700 font-medium line-through opacity-75">Checked in</span>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span className="text-stone-700 font-medium">You're in the queue</span>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="w-4 h-4 rounded-full bg-[#16A34A] flex items-center justify-center text-[10px] text-white font-bold shrink-0">
                    ●
                  </span>
                  <span className="text-stone-900 font-bold">Clinic is progressing</span>
                </div>
                <div className="flex items-center space-x-3 text-xs opacity-50">
                  <span className="w-4 h-4 rounded-full border-2 border-stone-300 flex items-center justify-center shrink-0">
                    ○
                  </span>
                  <span className="text-stone-500 font-medium">Your turn is getting close</span>
                </div>
              </div>

              {/* Bottom Touch Bar */}
              <div className="mt-6 pt-3 border-t border-stone-100 flex justify-center">
                <div className="w-28 h-1 bg-stone-300 rounded-full"></div>
              </div>

            </div>
          </div>

          {/* RIGHT: State Showcase & Explanations */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                EMPATHY THROUGH TRANSPARENCY
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 leading-tight">
                Odyssey Flow doesn't just calculate waiting time. It communicates the waiting experience.
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                When physicians take extra time for complex diagnoses, traditional systems silently add minutes, triggering patient panic. Sanctuary Pulse translates clinic telemetry into calm, respectful micro-updates.
              </p>
            </div>

            {/* Interactive Live State Examples */}
            <div className="space-y-2.5 pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                Click to preview adaptive status transitions:
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {STATE_EXAMPLES.map((ex, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStateExample(idx)}
                    className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                      activeStateExample === idx
                        ? 'bg-white border-[#16A34A] shadow-sm ring-1 ring-[#16A34A]'
                        : 'bg-white/70 hover:bg-white border-emerald-200/70 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-[#15803D]">
                        {ex.badge}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
                    </div>
                    <h5 className="text-xs font-bold text-stone-900">{ex.title}</h5>
                    <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">{ex.note}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA to live experience */}
            <div className="pt-2">
              <button
                onClick={onOpenPatientApp}
                className="px-6 py-3 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-sm cursor-pointer"
              >
                <span>Experience Sanctuary Pulse in Prototype</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#22C55E]" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
