import React from 'react';
import { 
  ArrowRight, HeartPulse, Clock, Sparkles, AlertTriangle, 
  Activity, CheckCircle2, User, ChevronRight, Stethoscope
} from 'lucide-react';

interface LandingHeroProps {
  onEnterApp: () => void;
  onSeeHowItWorks: () => void;
  onOpenPatient: () => void;
  onOpenClinic: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onEnterApp,
  onSeeHowItWorks,
  onOpenPatient,
  onOpenClinic,
}) => {
  return (
    <section id="product-overview" className="relative pt-10 pb-20 lg:pt-16 lg:pb-28 overflow-hidden bg-[#FAF9F6]">
      
      {/* Subtle organic light wash */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] pointer-events-none overflow-hidden opacity-50">
        <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] rounded-full bg-emerald-100/30 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Eyebrow Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white border border-stone-200/90 shadow-2xs text-[11px] font-bold tracking-[0.18em] text-[#15803D] uppercase">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
            <span>HEALTHCARE OPERATIONS × CLINICAL INTELLIGENCE</span>
          </div>
        </div>

        {/* Hero Headlines */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.04em] text-stone-900 leading-[1.05]">
            Healthcare should flow.
          </h1>

          <p className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-stone-700 leading-snug">
            One connected journey from check-in to clinical clarity.
          </p>

          <p className="text-base sm:text-lg text-stone-500 max-w-2xl mx-auto font-normal leading-relaxed pt-2">
            Odyssey Flow connects intelligent clinic queues with longitudinal diagnostic insights, helping patients wait with less uncertainty and clinicians work with more context.
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <button
              onClick={onEnterApp}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center space-x-2.5 group cursor-pointer"
            >
              <span>Explore Odyssey Flow</span>
              <ArrowRight className="w-4 h-4 text-[#22C55E] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onSeeHowItWorks}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-stone-100 text-stone-700 font-bold text-sm border border-stone-200/90 shadow-2xs transition-all cursor-pointer"
            >
              See how it works
            </button>
          </div>
        </div>

        {/* HERO PRODUCT VISUAL: Layered Product Preview */}
        <div className="mt-14 sm:mt-18 max-w-5xl mx-auto relative">
          
          {/* Main Desktop Container Frame (Clinic Side) */}
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden relative">
            
            {/* Window Top Bar */}
            <div className="bg-[#FAF9F6] border-b border-stone-200/80 px-4 sm:px-6 py-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-300"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-stone-300"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-stone-300"></span>
                <span className="text-[11px] font-mono text-stone-400 ml-2">odyssey-flow://clinic/live-flow</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>LIVE CLINIC STREAM</span>
                </span>
                <span className="text-[11px] font-medium text-stone-400 hidden sm:inline">Odyssey Care Clinic</span>
              </div>
            </div>

            {/* Clinic Dashboard Header Preview */}
            <div className="p-6 sm:p-8 bg-stone-50/50 border-b border-stone-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-stone-900 tracking-tight">
                    Live Patient Flow
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Synchronized queue orchestration with longitudinal diagnostic risk scoring.
                  </p>
                </div>

                <div className="flex items-center space-x-2.5">
                  <div className="bg-white px-3.5 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 shadow-2xs">
                    Serving: <strong className="text-stone-900 font-bold">A-20</strong>
                  </div>
                  <div className="bg-white px-3.5 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 shadow-2xs">
                    In Queue: <strong className="text-emerald-700 font-bold">7 Active</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Queue Table Preview (Clinic Side) */}
            <div className="p-6 sm:p-8">
              <div className="divide-y divide-stone-100">
                
                {/* Active Serving Row */}
                <div className="py-3 flex items-center justify-between text-xs text-stone-400 opacity-60">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-stone-500">A-20</span>
                    <span className="font-medium text-stone-600">Priya Nair</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[11px]">In Consultation</span>
                </div>

                {/* Focus Row: Aarav Mehta (A-27) */}
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/40 -mx-4 px-4 sm:-mx-6 sm:px-6 rounded-2xl border border-emerald-100 my-1">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-stone-900 text-white font-mono font-black text-sm flex items-center justify-center shadow-xs">
                      A-27
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-stone-900">Aarav Mehta</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">32M</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Waiting</span>
                      </div>
                      <span className="text-xs text-stone-500 block mt-0.5">
                        Chief complaint: Persistent daily headache (7 months)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 sm:space-x-4 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">Sanctuary State</span>
                      <span className="text-xs font-bold text-emerald-800 flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>Queue stable</span>
                      </span>
                    </div>

                    <div className="text-right pl-3 border-l border-emerald-200">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">Wait ETA</span>
                      <span className="text-xs font-mono font-bold text-stone-900">24 min</span>
                    </div>

                    <button
                      onClick={onOpenClinic}
                      className="px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors shadow-2xs"
                    >
                      Open Snapshot
                    </button>
                  </div>
                </div>

                {/* Downstream Row */}
                <div className="py-3 flex items-center justify-between text-xs text-stone-400">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-stone-400">A-28</span>
                    <span className="font-medium text-stone-600">Sunita Patel</span>
                  </div>
                  <span className="text-stone-400 text-[11px]">Position 8 • Est. 38 min</span>
                </div>

              </div>
            </div>

          </div>

          {/* FLOATING OVERLAY 1: Patient Side Card (A-27 + Sanctuary Pulse) */}
          <div className="sm:absolute -bottom-8 -left-4 sm:-left-6 w-full sm:w-80 bg-white rounded-3xl p-5 border border-stone-200/90 shadow-2xl mt-4 sm:mt-0 transition-transform hover:-translate-y-1">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                PATIENT SANCTUARY PULSE
              </span>
              <span className="text-xs font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded-md">
                Token A-27
              </span>
            </div>

            {/* Organic concentric pulse visualization */}
            <div className="my-4 flex items-center space-x-4">
              <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping"></div>
                <div className="absolute inset-1 rounded-full bg-emerald-500/20 animate-pulse"></div>
                <div className="relative w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <HeartPulse className="w-5 h-5" />
                </div>
              </div>
              <div>
                <span className="text-sm font-extrabold text-stone-900 block leading-tight">
                  Queue stable
                </span>
                <span className="text-xs text-stone-500 block mt-0.5">
                  A few patients ahead of you
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-center">
              <div className="bg-stone-50 p-2 rounded-xl">
                <span className="text-[10px] text-stone-400 uppercase font-semibold block">Ahead</span>
                <span className="text-xs font-bold text-stone-800">6 Patients</span>
              </div>
              <div className="bg-stone-50 p-2 rounded-xl">
                <span className="text-[10px] text-stone-400 uppercase font-semibold block">Est. Wait</span>
                <span className="text-xs font-bold text-emerald-700 font-mono">~24 min</span>
              </div>
            </div>

            <button
              onClick={onOpenPatient}
              className="mt-3 w-full py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <span>View Mobile Experience</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#22C55E]" />
            </button>
          </div>

          {/* FLOATING OVERLAY 2: Diagnostic Intelligence Card (DPS 63 / 100) */}
          <div className="sm:absolute -top-6 -right-4 sm:-right-6 w-full sm:w-72 bg-stone-900 text-white rounded-3xl p-5 border border-stone-800 shadow-2xl mt-4 sm:mt-0 transition-transform hover:-translate-y-1">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800/80 flex items-center space-x-1">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span>DPS STAGNATION SIGNAL</span>
              </span>
              <span className="text-[11px] font-mono text-stone-400">Token A-27</span>
            </div>

            <div className="py-3 flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black text-white font-mono tracking-tight">
                  63 <span className="text-xs font-medium text-stone-400">/ 100</span>
                </span>
                <span className="text-xs text-stone-400 block mt-0.5">
                  Diagnostic Progress Score
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                Stagnating
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-stone-300 pt-2 border-t border-stone-800">
              <div className="flex items-center space-x-2 text-amber-300 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Potential stagnation detected</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                6 encounters across 3 specialties with repeated low-novelty imaging.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
