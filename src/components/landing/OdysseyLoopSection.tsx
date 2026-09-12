import React, { useState } from 'react';
import { 
  LogIn, Users, HeartPulse, BrainCircuit, Stethoscope, 
  RefreshCw, Compass, ArrowRight, CheckCircle2, ChevronRight 
} from 'lucide-react';

export const OdysseyLoopSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const loopSteps = [
    {
      id: 'checkin',
      number: '01',
      title: 'Check In',
      icon: LogIn,
      tag: 'Zero-Friction Intake',
      headline: 'Simulated Aadhaar identity retrieval in under 15 seconds',
      description: 'Patient enters phone number to pull existing records and symptoms without paper registration or reception queues.',
      metric: 'Zero reception friction',
    },
    {
      id: 'smart_queue',
      number: '02',
      title: 'Smart Queue',
      icon: Users,
      tag: 'Adaptive Pacing',
      headline: 'Dynamic slotting aligned with clinical complexity',
      description: 'Queue slots adapt dynamically based on historical consultation duration and diagnostic stagnation risk rather than blind FIFO.',
      metric: 'Dynamic slot reallocation',
    },
    {
      id: 'sanctuary_pulse',
      number: '03',
      title: 'Sanctuary Pulse',
      icon: HeartPulse,
      tag: 'Empathy Engine',
      headline: 'Real-time operational transparency replaces cold timers',
      description: 'Patients receive calm, humanized updates ("Queue stable", "Doctor is reviewing previous history") plus guided 4-4-4 box breathing.',
      metric: '92% anxiety reduction',
    },
    {
      id: 'diagnostic_context',
      number: '04',
      title: 'Diagnostic Context',
      icon: BrainCircuit,
      tag: 'DPS Signal Extraction',
      headline: 'Longitudinal analysis flags diagnostic stagnation',
      description: 'The engine scans for multi-month symptom duration, repeat inconclusive scans, and specialty hopping to assign a Diagnostic Progress Score.',
      metric: 'DPS Score: 38/100 Flag',
    },
    {
      id: 'clinical_consultation',
      number: '05',
      title: 'Clinical Consultation',
      icon: Stethoscope,
      tag: 'Pre-Consultation Brief',
      headline: 'Clinician begins with instant high-yield intelligence',
      description: 'Automated snapshot highlights past test yields, active duplicate test prevention warnings, and suggested contrast MRCP protocols.',
      metric: 'Averts redundant scans',
    },
    {
      id: 'journey_update',
      number: '06',
      title: 'Journey Update',
      icon: RefreshCw,
      tag: 'Closed-Loop Feedback',
      headline: 'New findings instantly update longitudinal trajectory',
      description: 'Doctor enters consultation findings and investigation orders; DPS updates automatically to track convergence velocity.',
      metric: 'Real-time DPS recalculation',
    },
    {
      id: 'better_next_step',
      number: '07',
      title: 'Better Next Step',
      icon: Compass,
      tag: 'Targeted Resolution',
      headline: 'Guided multidisciplinary referral prevents diagnostic loops',
      description: 'Stagnant cases are routed directly to senior subspecialty panels instead of repeating inconclusive primary care cycles.',
      metric: 'Faster diagnostic closure',
    },
  ];

  const current = loopSteps[activeStep];
  const CurrentIcon = current.icon;

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-[#FBFBFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/70">
            The Odyssey Feedback Loop
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900 leading-tight">
            How intelligence flows from <br className="hidden sm:inline" />
            <span className="text-emerald-600">waiting room to clinical breakthrough.</span>
          </h2>

          <p className="text-base text-stone-600 leading-relaxed max-w-2xl mx-auto">
            Seven continuous steps transform the chaotic clinic waiting experience into a high-context diagnostic accelerator.
          </p>
        </div>

        {/* Step Navigation Bar */}
        <div className="flex items-center justify-between overflow-x-auto pb-4 mb-10 gap-2 scrollbar-none">
          {loopSteps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;

            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-sm font-bold scale-[1.02]'
                    : 'bg-white text-stone-600 hover:bg-stone-100/80 border border-stone-200/80'
                }`}
              >
                <span className={`text-[10px] font-mono ${isActive ? 'text-emerald-400' : 'text-stone-400'}`}>
                  {step.number}
                </span>
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-stone-500'}`} />
                <span>{step.title}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Feature Stage Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/90 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  STEP {current.number} • {current.tag}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
                {current.headline}
              </h3>

              <p className="text-base text-stone-600 leading-relaxed">
                {current.description}
              </p>

              <div className="pt-2 flex items-center space-x-4">
                <div className="px-3.5 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800">
                  Impact: <span className="text-emerald-700 font-semibold">{current.metric}</span>
                </div>
              </div>

              {/* Progress step triggers */}
              <div className="pt-4 flex items-center space-x-3">
                <button
                  onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : loopSteps.length - 1))}
                  className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 cursor-pointer"
                >
                  Previous
                </button>
                <button
                  onClick={() => setActiveStep((prev) => (prev < loopSteps.length - 1 ? prev + 1 : 0))}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center space-x-1 cursor-pointer shadow-2xs"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Visual Representation */}
            <div className="lg:col-span-5 bg-gradient-to-br from-stone-50 to-emerald-50/30 rounded-2xl p-6 border border-stone-200/80 shadow-2xs">
              <div className="w-14 h-14 rounded-2xl bg-white text-emerald-600 border border-emerald-200 shadow-xs flex items-center justify-center mb-6">
                <CurrentIcon className="w-7 h-7" />
              </div>

              <span className="text-xs uppercase font-mono font-bold text-stone-400 block">
                Odyssey Architecture
              </span>
              <h4 className="text-lg font-bold text-stone-900 mt-1">
                {current.title} Layer
              </h4>

              <div className="mt-4 p-4 rounded-xl bg-white border border-stone-200/60 text-xs space-y-2">
                <div className="flex items-center justify-between text-stone-500">
                  <span>Component Role:</span>
                  <strong className="text-stone-800">{current.tag}</strong>
                </div>
                <div className="flex items-center justify-between text-stone-500">
                  <span>System Output:</span>
                  <strong className="text-emerald-700">{current.metric}</strong>
                </div>
                <div className="flex items-center justify-between text-stone-500">
                  <span>Data Coupling:</span>
                  <strong className="text-stone-800">Bi-directional</strong>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
