import React from 'react';
import { 
  Building2, User, ArrowRight, CheckCircle2, 
  Clock, HeartPulse, Stethoscope, Sliders, 
  FileText, Activity, CreditCard, BellRing, Sparkles 
} from 'lucide-react';

interface ClinicsPatientsSectionProps {
  onOpenClinicApp: () => void;
  onOpenPatientApp: () => void;
}

export const ClinicsPatientsSection: React.FC<ClinicsPatientsSectionProps> = ({
  onOpenClinicApp,
  onOpenPatientApp,
}) => {
  return (
    <section id="split-experience" className="py-20 lg:py-32 bg-[#FAF9F6] border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white border border-stone-200 text-[11px] font-bold tracking-[0.18em] text-[#15803D] uppercase shadow-2xs">
            <span>UNIFIED SYSTEM ARCHITECTURE</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-[-0.035em] text-stone-900 leading-tight">
            Designed for both sides of the care equation.
          </h2>

          <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto pt-1">
            Clinics gain operational clarity and longitudinal diagnostic context. Patients gain transparency and calm pacing throughout their hospital visit.
          </p>
        </div>

        {/* Split Section: LEFT (Clinics) vs RIGHT (Patients) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* LEFT: FOR CLINICS */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-stone-400 transition-all">
            <div className="space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-stone-900 text-white flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-[#22C55E]" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    FOR CLINICS
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
                  Operations &amp; Physicians
                </span>
              </div>

              <div>
                <h3 className="text-3xl font-extrabold tracking-tight text-stone-900">
                  "Operate with context."
                </h3>
                <p className="text-sm text-stone-500 mt-2 leading-relaxed">
                  Equip front-desk administrators and consulting physicians with real-time queue pacing and automatic longitudinal diagnostic briefings.
                </p>
              </div>

              {/* Realistic UI Preview Card for Clinics */}
              <div className="bg-[#FAF9F6] rounded-2xl p-4 border border-stone-200 text-xs space-y-2.5">
                <div className="flex items-center justify-between font-bold text-stone-900 pb-2 border-b border-stone-200/80">
                  <span>Suite 101 • Dr. A. Sharma</span>
                  <span className="text-emerald-700 font-mono">3 In Queue</span>
                </div>
                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-stone-200 shadow-2xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-stone-900 bg-stone-100 px-1.5 py-0.5 rounded">A-27</span>
                    <span className="font-medium text-stone-800">Aarav Mehta</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    DPS 63 Stagnating
                  </span>
                </div>
              </div>

              {/* 7 Clinic Capabilities Checklist */}
              <div className="space-y-2.5 pt-2">
                {[
                  'Live Queue',
                  'Sanctuary Pulse',
                  'Patient Flow',
                  'Diagnostic Insights',
                  'Clinical Snapshot',
                  'Queue Balancing',
                  'Reports',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2.5 text-xs text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>

            </div>

            <div className="pt-8 mt-6 border-t border-stone-100">
              <button
                onClick={onOpenClinicApp}
                className="w-full py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm cursor-pointer"
              >
                <span>Open Clinic Dashboard</span>
                <ArrowRight className="w-4 h-4 text-[#22C55E]" />
              </button>
            </div>
          </div>

          {/* RIGHT: FOR PATIENTS */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-stone-400 transition-all">
            <div className="space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    FOR PATIENTS
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Mobile Companion
                </span>
              </div>

              <div>
                <h3 className="text-3xl font-extrabold tracking-tight text-stone-900">
                  "Wait with confidence."
                </h3>
                <p className="text-sm text-stone-500 mt-2 leading-relaxed">
                  Turn the waiting room into a guided journey with zero passwords, empathetic status updates, and transparent medical records.
                </p>
              </div>

              {/* Realistic UI Preview Card for Patients */}
              <div className="bg-[#FAF9F6] rounded-2xl p-4 border border-stone-200 text-xs space-y-2.5">
                <div className="flex items-center justify-between font-bold text-stone-900 pb-2 border-b border-stone-200/80">
                  <span className="flex items-center space-x-1.5 text-emerald-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Sanctuary Pulse Active</span>
                  </span>
                  <span className="font-mono text-stone-900">A-27</span>
                </div>
                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-stone-200 shadow-2xs">
                  <span className="font-medium text-stone-700">"Queue stable • A few patients ahead"</span>
                  <span className="font-mono font-bold text-emerald-700">24m ETA</span>
                </div>
              </div>

              {/* 6 Patient Features Checklist */}
              <div className="space-y-2.5 pt-2">
                {[
                  'Digital Token',
                  'Sanctuary Pulse',
                  'Visit Journey',
                  'Notifications',
                  'Referral Status',
                  'Billing',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2.5 text-xs text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>

            </div>

            <div className="pt-8 mt-6 border-t border-stone-100">
              <button
                onClick={onOpenPatientApp}
                className="w-full py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm cursor-pointer"
              >
                <span>Enter as Patient</span>
                <ArrowRight className="w-4 h-4 text-[#22C55E]" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
