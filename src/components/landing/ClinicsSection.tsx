import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, Clock, Activity, BarChart3, 
  UserCheck, ShieldCheck, ArrowRight, CheckCircle2, ChevronRight, Zap 
} from 'lucide-react';

export const ClinicsSection: React.FC<{ onOpenClinicApp: () => void }> = ({ onOpenClinicApp }) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'pulse' | 'insights' | 'flow' | 'staff' | 'reports'>('queue');

  const features = [
    {
      id: 'queue',
      title: 'Live Queue',
      icon: Clock,
      subtitle: 'Dynamic Clinical Prioritization',
      desc: 'Smart queue rebalanced by Longitudinal DPS rather than blind FIFO intake. Stagnant diagnostic cases are promoted to senior physicians automatically.',
      highlight: '3 Waiting • 1 Stagnant Priority Flagged',
    },
    {
      id: 'pulse',
      title: 'Clinic Pulse',
      icon: Activity,
      subtitle: 'Doctor Micro-Status Broadcasting',
      desc: 'Doctors toggle micro-statuses ("Reviewing History", "In Consultation", "Finishing Consult") which feeds directly into the patient Sanctuary Pulse experience.',
      highlight: 'Synchronized with Patient App in <50ms',
    },
    {
      id: 'insights',
      title: 'Diagnostic Insights',
      icon: ShieldCheck,
      subtitle: 'Pre-Consultation Brief & Duplicate Test Alerts',
      desc: 'Automated clinical snapshot warning doctors against repeat unyielding scans (e.g. 3 serial normal ultrasounds) and suggesting high-yield contrast MRCP.',
      highlight: 'Prevents redundant tests & saves ₹1,800/pt',
    },
    {
      id: 'flow',
      title: 'Patient Flow',
      icon: Users,
      subtitle: 'End-to-End Clinic Orchestration',
      desc: 'Zero-friction simulated Aadhaar digital token check-ins, room routing, call next patient, and automated exit notes.',
      highlight: 'Eliminates paper tokens & front-desk bottlenecks',
    },
    {
      id: 'staff',
      title: 'Staff Utilization',
      icon: UserCheck,
      subtitle: 'Roster & Room Pacing',
      desc: 'Tracks clinician consultation duration, breaks, and room allocations (Rooms 101–106) to prevent schedule drift and clinician burnout.',
      highlight: 'Real-time room occupancy & case load balance',
    },
    {
      id: 'reports',
      title: 'Reports & Audits',
      icon: BarChart3,
      subtitle: 'Diagnostic Velocity & Cost Savings',
      desc: 'Audits diagnostic yield per investigation type, measure time-to-closure, and verify zero-friction operational compliance.',
      highlight: '+42% Diagnostic Velocity • 92% Patient NPS',
    },
  ];

  const current = features.find(f => f.id === activeTab) || features[0];

  return (
    <section className="py-20 lg:py-28 bg-white border-t border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-800 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
            Enterprise Clinic Operations
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900 leading-tight">
            Built for modern clinic teams. <br className="hidden sm:inline" />
            <span className="text-emerald-600">Zero chaos. Maximum clinical context.</span>
          </h2>

          <p className="text-base text-stone-600 leading-relaxed max-w-2xl mx-auto">
            A desktop-first clinical command center providing total visibility across queue velocity, doctor statuses, and patient diagnostic trajectories.
          </p>
        </div>

        {/* Feature Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
          {features.map((feat) => {
            const Icon = feat.icon;
            const isActive = activeTab === feat.id;

            return (
              <button
                key={feat.id}
                onClick={() => setActiveTab(feat.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs font-bold'
                    : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-stone-500'}`} />
                <span>{feat.title}</span>
              </button>
            );
          })}
        </div>

        {/* Desktop Dashboard Preview Container */}
        <div className="bg-[#FAFAFA] rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-md">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Feature Details Narrative (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/60 px-2.5 py-1 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{current.subtitle}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
                {current.title} Management
              </h3>

              <p className="text-sm text-stone-600 leading-relaxed">
                {current.desc}
              </p>

              <div className="p-3.5 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-800">
                Performance Metric: <span className="text-emerald-700 font-semibold">{current.highlight}</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenClinicApp}
                  className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs flex items-center space-x-2 shadow-xs cursor-pointer"
                >
                  <span>Launch Live Clinic Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </button>
              </div>
            </div>

            {/* Visual UI Preview Box (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
              
              {/* Header inside mockup */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="font-bold text-stone-900">Odyssey Clinic Console</span>
                  <span className="text-stone-400">• Room 101-106</span>
                </div>
                <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  DPS ACTIVE
                </span>
              </div>

              {/* Mock table preview */}
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold px-2 py-0.5 rounded bg-emerald-600 text-white text-[11px]">
                      A-102
                    </span>
                    <div>
                      <strong className="text-stone-900 block">Priya Sharma</strong>
                      <span className="text-[11px] text-stone-500">RUQ Pain (180d) • Stagnant</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                      DPS 38/100
                    </span>
                    <span className="text-[10px] text-stone-400 block mt-0.5">Priority Escorted</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold px-2 py-0.5 rounded bg-stone-200 text-stone-800 text-[11px]">
                      A-103
                    </span>
                    <div>
                      <strong className="text-stone-900 block">Vikram Mehta</strong>
                      <span className="text-[11px] text-stone-500">Cardiology Check • Standard</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      DPS 85/100
                    </span>
                    <span className="text-[10px] text-stone-400 block mt-0.5">Wait: ~8 mins</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold px-2 py-0.5 rounded bg-stone-200 text-stone-800 text-[11px]">
                      A-104
                    </span>
                    <div>
                      <strong className="text-stone-900 block">Ananya Iyer</strong>
                      <span className="text-[11px] text-stone-500">General Medicine • Follow-up</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      DPS 79/100
                    </span>
                    <span className="text-[10px] text-stone-400 block mt-0.5">Wait: ~16 mins</span>
                  </div>
                </div>
              </div>

              {/* Mini action footer */}
              <div className="pt-2 flex items-center justify-between text-xs text-stone-500">
                <span>Autonomous Rebalancing Engine Active</span>
                <span className="text-emerald-700 font-bold">3 Physicians Consulting</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
