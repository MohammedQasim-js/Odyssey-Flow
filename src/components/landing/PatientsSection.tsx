import React, { useState } from 'react';
import { 
  Smartphone, HeartPulse, PlusCircle, Clock, Receipt, 
  MapPin, CheckCircle2, ArrowRight, ShieldCheck, Activity 
} from 'lucide-react';

export const PatientsSection: React.FC<{ onOpenPatientApp: () => void }> = ({ onOpenPatientApp }) => {
  const [selectedMobileTab, setSelectedMobileTab] = useState<'token' | 'pulse' | 'status' | 'symptoms' | 'history' | 'referral'>('pulse');

  const mobileHighlights = [
    {
      id: 'token',
      title: 'Digital Token',
      icon: PlusCircle,
      tag: 'Zero-Friction Intake',
      desc: 'Simulated Aadhaar-linked intake issues instant encrypted digital tokens (e.g. #A-102) with zero paper receipts.',
    },
    {
      id: 'pulse',
      title: 'Sanctuary Pulse',
      icon: HeartPulse,
      tag: 'Empathetic Companion',
      desc: 'Replaces anxiety-inducing countdown timers with humanized, empathetic status messages and 4-4-4 diaphragmatic breathing.',
    },
    {
      id: 'status',
      title: 'Clinic Status',
      icon: MapPin,
      tag: 'Live Facility Radar',
      desc: 'View active queue load, estimated physician pacing, and room assignments before arriving at the clinic.',
    },
    {
      id: 'symptoms',
      title: 'Symptom Trajectory',
      icon: Activity,
      tag: 'Guided Intake',
      desc: 'Structured symptom tracking with severity rating (1–10) and duration logging directly linked to diagnostic records.',
    },
    {
      id: 'history',
      title: 'Visit History',
      icon: Clock,
      tag: 'Longitudinal Timeline',
      desc: 'Unified timeline recording all past lab tests, ultrasound scans, and conclusiveness yields across different hospitals.',
    },
    {
      id: 'referral',
      title: 'Referral Routing',
      icon: ShieldCheck,
      tag: 'Subspecialty Fast-Track',
      desc: 'Stagnant cases receive automated direct referrals to senior multidisciplinary panels, bypassing redundant loops.',
    },
  ];

  const current = mobileHighlights.find(m => m.id === selectedMobileTab) || mobileHighlights[1];

  return (
    <section className="py-20 lg:py-28 bg-[#FBFBFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/70">
            Patient Mobile Sanctuary
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900 leading-tight">
            Designed for human comfort. <br className="hidden sm:inline" />
            <span className="text-stone-900">Right in the palm of your hand.</span>
          </h2>

          <p className="text-base text-stone-600 leading-relaxed max-w-2xl mx-auto">
            A calming mobile experience optimized for 390px touch devices that transforms waiting time into an empathetic, transparent journey.
          </p>
        </div>

        {/* Interactive Feature Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-12">
          {mobileHighlights.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedMobileTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setSelectedMobileTab(item.id as any)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-emerald-500 ring-2 ring-emerald-200/60 shadow-xs'
                    : 'bg-white/80 border-stone-200 hover:bg-white hover:border-stone-300'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${
                  isSelected ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-700'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-stone-900">{item.title}</h4>
                <p className="text-[10px] text-stone-400 mt-0.5 line-clamp-1">{item.tag}</p>
              </button>
            );
          })}
        </div>

        {/* Mobile Device Mockup Display */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Mobile Device Frame (6 cols) */}
            <div className="md:col-span-6 flex justify-center">
              <div className="w-full max-w-[320px] bg-[#FBFBFC] rounded-[2.5rem] border-[8px] border-stone-800 shadow-xl overflow-hidden p-4 space-y-4">
                
                {/* Phone Speaker Notch */}
                <div className="h-4 w-28 bg-stone-800 rounded-b-xl mx-auto mb-2"></div>

                {/* Simulated Screen Header */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Sanctuary Patient</span>
                    <strong className="text-sm font-bold text-stone-900">Priya Sharma</strong>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                    XXXX 2741
                  </span>
                </div>

                {/* Dynamic Screen Content Based on Selection */}
                <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase">
                      {current.tag}
                    </span>
                    <span className="font-mono text-xs font-bold text-stone-800">
                      Token A-102
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-stone-900 leading-snug">
                    {current.title === 'Sanctuary Pulse' ? '"Doctor is reviewing previous history"' : current.title}
                  </h4>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {current.desc}
                  </p>
                </div>

                {/* Additional micro-status widget */}
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 text-xs flex items-center justify-between">
                  <span className="text-stone-500">Assigned Clinician:</span>
                  <span className="font-bold text-stone-800">Dr. Meera Nambiar</span>
                </div>

                {/* Mock bottom nav bar */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-around text-stone-400">
                  <span className="text-[10px] font-bold text-emerald-700">● Pulse</span>
                  <span className="text-[10px]">Queue</span>
                  <span className="text-[10px]">History</span>
                  <span className="text-[10px]">Bill</span>
                </div>

              </div>
            </div>

            {/* Feature Description & Direct Launch (6 cols) */}
            <div className="md:col-span-6 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                {current.tag}
              </span>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
                {current.title}
              </h3>

              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                {current.desc}
              </p>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 space-y-1">
                <strong className="text-stone-900 block font-bold">Why it matters:</strong>
                Eliminates the psychological friction of healthcare waiting rooms, empowering patients with dignified context.
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenPatientApp}
                  className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Open Mobile Patient Sanctuary</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
