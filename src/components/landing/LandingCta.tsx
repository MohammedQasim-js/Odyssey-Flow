import React from 'react';
import { 
  ArrowRight, Sparkles, HeartPulse, Stethoscope, 
  ShieldCheck, CheckCircle2, Building2, Activity, Play 
} from 'lucide-react';

interface LandingCtaProps {
  onOpenPatientApp: () => void;
  onOpenClinicApp: () => void;
  onTriggerDpsRebalance?: () => void;
  onSeeHowItWorks?: () => void;
}

export const LandingCta: React.FC<LandingCtaProps> = ({
  onOpenPatientApp,
  onOpenClinicApp,
  onSeeHowItWorks,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      
      {/* SECTION 12 — FINAL CTA (VIVID GREEN ACCENT BLOCK) */}
      <section className="py-16 sm:py-24 bg-[#FAF9F6] border-t border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Signature Vivid Green Box (inspired by reference video) */}
          <div className="bg-[#16A34A] rounded-3xl p-8 sm:p-12 lg:p-16 text-white shadow-xl relative overflow-hidden">
            
            {/* Subtle light geometric glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              
              {/* Left Column: Headlines & Action Buttons */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-black/20 text-white text-[11px] font-bold tracking-[0.18em] uppercase backdrop-blur-xs">
                  <span>GET STARTED</span>
                </div>

                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.04em] text-white leading-tight">
                  Make healthcare flow.
                </h2>

                <p className="text-lg sm:text-xl text-emerald-100 font-normal leading-relaxed max-w-xl">
                  Connect the queue, the clinic, and the patient journey in one intelligent flow.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={onOpenClinicApp}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs tracking-tight shadow-md flex items-center justify-center space-x-2.5 transition-all cursor-pointer"
                  >
                    <span>Explore Prototype</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#22C55E]" />
                  </button>

                  <button
                    onClick={() => {
                      if (onSeeHowItWorks) onSeeHowItWorks();
                      else scrollToSection('two-journeys');
                    }}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white hover:bg-emerald-50 text-stone-900 font-bold text-xs tracking-tight shadow-sm transition-all text-center cursor-pointer"
                  >
                    See How It Works
                  </button>
                </div>
              </div>

              {/* Right Column: Clean Product Visual Card */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-sm bg-white/95 backdrop-blur-md rounded-3xl p-6 text-stone-900 shadow-2xl border border-white/40 space-y-4">
                  
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100 text-xs">
                    <span className="font-bold uppercase tracking-wider text-emerald-800 text-[10px]">
                      Odyssey Flow Engine
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">Live Active</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center font-mono font-black text-sm">
                      A-27
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">Aarav Mehta</h4>
                      <p className="text-xs text-stone-500">Sanctuary Pulse • Queue Stable</p>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs flex items-center justify-between">
                    <span className="font-bold text-emerald-900">DPS Process Score</span>
                    <span className="font-mono font-black text-emerald-800">63 / 100</span>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500">
                    <span>Longitudinal Care Pacing</span>
                    <span className="font-bold text-stone-800">Room 101 Ready</span>
                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* FOOTER (DEEP FOREST GREEN ACCENT) */}
      <footer className="bg-[#062417] text-stone-300 pt-16 pb-12 border-t border-emerald-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-emerald-900/60">
            
            {/* Left Brand Column (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-white text-stone-900 flex items-center justify-center font-black tracking-tighter text-sm">
                  <span className="text-[#16A34A]">O</span>
                  <span className="text-stone-900 text-xs -ml-0.5">F</span>
                </div>
                <span className="text-2xl font-extrabold tracking-tight text-white block">
                  Odyssey<span className="text-[#22C55E]">Flow</span>
                </span>
              </div>

              <p className="text-sm text-emerald-200/80 font-medium">
                "Healthcare should flow."
              </p>

              <p className="text-xs text-emerald-300/60 max-w-sm leading-relaxed">
                Connecting outpatient queues with longitudinal diagnostic journey analysis to eliminate waiting room anxiety and diagnostic stagnation.
              </p>

              <div className="pt-2">
                <span className="inline-block text-[11px] font-mono text-emerald-400/80 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
                  Enigma 5.0 — Genesis • HealthTech Track
                </span>
              </div>
            </div>

            {/* Column 1: Product */}
            <div className="space-y-3 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white block">
                Product
              </span>
              <ul className="space-y-2 text-emerald-200/70 font-medium">
                <li>
                  <button onClick={() => scrollToSection('product-overview')} className="hover:text-white transition-colors cursor-pointer">
                    Patient Flow
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('sanctuary-pulse')} className="hover:text-white transition-colors cursor-pointer">
                    Sanctuary Pulse
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('diagnostic-journey')} className="hover:text-white transition-colors cursor-pointer">
                    Diagnostic Journey
                  </button>
                </li>
                <li>
                  <button onClick={onOpenClinicApp} className="hover:text-white transition-colors cursor-pointer">
                    Clinical Snapshot
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: Company */}
            <div className="space-y-3 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white block">
                Company
              </span>
              <ul className="space-y-2 text-emerald-200/70 font-medium">
                <li>
                  <span className="text-emerald-200/70">About</span>
                </li>
                <li>
                  <span className="text-white font-semibold">Pioneer Developers</span>
                </li>
                <li>
                  <span className="text-emerald-300/80">Enigma 5.0 Genesis</span>
                </li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div className="space-y-3 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white block">
                Resources
              </span>
              <ul className="space-y-2 text-emerald-200/70 font-medium">
                <li>
                  <span className="text-emerald-200/70">Documentation</span>
                </li>
                <li>
                  <span className="text-emerald-200/70">Architecture</span>
                </li>
                <li>
                  <button onClick={onOpenClinicApp} className="hover:text-white transition-colors cursor-pointer">
                    Demo Mode
                  </button>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar: Legal / Prototype disclaimer */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-300/60 gap-4">
            <p>
              Prototype for Enigma 5.0 — Genesis
            </p>
            <p className="text-[11px] text-emerald-400/50">
              Built by Pioneer Developers • HealthTech
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
};
