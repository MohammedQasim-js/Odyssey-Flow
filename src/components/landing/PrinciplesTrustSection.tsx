import React from 'react';
import { 
  ShieldCheck, Lock, UserCheck, Activity, 
  CheckCircle2, Compass, Heart, Sliders 
} from 'lucide-react';

export const PrinciplesTrustSection: React.FC = () => {
  const PRINCIPLES = [
    {
      label: 'LOW FRICTION',
      quote: '"No unnecessary patient account creation."',
      detail: 'Patients authenticate frictionlessly via phone number and simulated Aadhaar tokens without forgotten passwords or portal hurdles.',
      icon: Compass,
    },
    {
      label: 'PATIENT-CENTRIC',
      quote: '"Explain the waiting experience, not just the waiting time."',
      detail: 'Sanctuary Pulse replaces cold ticking clocks with empathetic operational updates, explaining clinician focus and pacing.',
      icon: Heart,
    },
    {
      label: 'PROCESS INTELLIGENCE',
      quote: '"Measure diagnostic journey progress, not disease prediction."',
      detail: 'The Diagnostic Progress Score measures procedural convergence and stagnation—never attempting automated disease diagnosis.',
      icon: Activity,
    },
    {
      label: 'CLINICIAN IN THE LOOP',
      quote: '"AI surfaces process signals. Clinicians make decisions."',
      detail: 'Every operational policy and referral recommendation is presented as a clinical prompt. Final judgment always rests with the physician.',
      icon: UserCheck,
    },
  ];

  const TRUST_PILLARS = [
    { title: 'Clinical review required', desc: 'No autonomous medication changes or diagnosis.' },
    { title: 'Human-in-the-loop', desc: 'Physicians confirm or dismiss every trajectory alert.' },
    { title: 'Process insight, not diagnosis', desc: 'Mathematical evaluation of journey efficiency.' },
    { title: 'Role-based access', desc: 'Strict separation of admin, clinician, and patient views.' },
    { title: 'Consent-aware data handling', desc: 'Explicit patient permission for longitudinal sharing.' },
    { title: 'Auditable clinical actions', desc: 'Full timestamped audit trail on every referral and note.' },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#FAF9F6] border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* SECTION 10: PRODUCT PRINCIPLES */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#15803D] bg-white px-3.5 py-1 rounded-full border border-stone-200 shadow-2xs">
              CORE PHILOSOPHY
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-stone-900 leading-tight">
              Product Principles
            </h2>
            <p className="text-sm text-stone-500">
              Four fundamental commitments that govern how Odyssey Flow treats patients and doctors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {PRINCIPLES.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs flex flex-col justify-between space-y-4 hover:border-stone-400 transition-all"
                >
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#15803D] block">
                      {p.label}
                    </span>
                    <h4 className="text-base font-bold text-stone-900 leading-snug">
                      {p.quote}
                    </h4>
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed pt-2 border-t border-stone-100">
                    {p.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 11: TRUST / SAFETY */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/90 shadow-sm max-w-5xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center space-x-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#15803D]">
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
              <span>SAFETY &amp; ETHICS</span>
            </div>
            <h3 className="text-3xl font-extrabold tracking-tight text-stone-900">
              Intelligence with boundaries.
            </h3>
            <p className="text-xs sm:text-sm text-stone-500">
              Odyssey Flow is an operational companion built with strict medical guardrails. We never make speculative algorithmic claims.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TRUST_PILLARS.map((pillar, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl bg-[#FAF9F6] border border-stone-200/80 space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <h5 className="text-xs font-bold text-stone-900">{pillar.title}</h5>
                </div>
                <p className="text-[11px] text-stone-500 pl-6 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
