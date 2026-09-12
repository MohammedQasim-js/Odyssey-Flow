import React, { useState } from 'react';
import { 
  Calendar, Stethoscope, FileText, ChevronDown, ChevronUp, 
  ArrowDown, AlertTriangle, Sparkles, CheckCircle2, ShieldAlert,
  Clock, Check, ExternalLink, Activity
} from 'lucide-react';
import { DiagnosticEvent } from '../../types';

export interface TimelineEncounter {
  id: string;
  monthYear: string;
  isCurrent?: boolean;
  specialty: string;
  doctor: string;
  facility: string;
  chiefComplaint: string;
  investigations: Array<{
    name: string;
    isRepeated?: boolean;
    conclusive: boolean;
    findingsSummary: string;
  }>;
  recordedHypothesis: string;
  treatmentOutcome: string;
  noteSummary: string;
  convergenceState: 'initial' | 'transition' | 'divergent' | 'repeated' | 'uncertain' | 'stagnant';
  convergenceLabel: string;
  dpsScore: number;
}

interface JourneyTimelineProps {
  encounters?: TimelineEncounter[];
  onSelectInvestigation?: (inv: { name: string; findingsSummary: string; isRepeated?: boolean }) => void;
  onSelectReferral?: (specialty: string) => void;
}

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({
  encounters: customEncounters,
  onSelectInvestigation,
  onSelectReferral,
}) => {
  // Default encounters matching prompt specifications exactly
  const encounters: TimelineEncounter[] = customEncounters || [
    {
      id: 'enc_1',
      monthYear: 'JAN 2026',
      specialty: 'General Medicine',
      doctor: 'Dr. Arjun Shenoy',
      facility: 'Apex Primary Health Suite',
      chiefComplaint: 'Persistent headache',
      investigations: [
        { name: 'CBC & Metabolic Panel', isRepeated: false, conclusive: false, findingsSummary: 'Normal hematocrit, mild ESR elevation. No localized etiology.' }
      ],
      recordedHypothesis: 'Non-specific tension-type cephalalgia secondary to screen fatigue',
      treatmentOutcome: 'Prescribed NSAIDs & lifestyle pacing; zero symptomatic improvement at 3-week follow-up.',
      noteSummary: 'Patient reports 4-week daily holocranial throbbing pain worse in the morning. Neurological screening grossly intact.',
      convergenceState: 'initial',
      convergenceLabel: 'Initial Investigation (CBC)',
      dpsScore: 71,
    },
    {
      id: 'enc_2',
      monthYear: 'FEB 2026',
      specialty: 'Neurology',
      doctor: 'Dr. Priya Desai',
      facility: 'Metro Neuroscience Center',
      chiefComplaint: 'Persistent headache (Refractory)',
      investigations: [
        { name: 'Non-contrast Brain MRI', isRepeated: false, conclusive: false, findingsSummary: 'Unremarkable brain parenchyma, no space-occupying lesions or hydrocephalus.' }
      ],
      recordedHypothesis: 'Chronic refractory migraine vs atypical cervicogenic cephalalgia',
      treatmentOutcome: 'Initiated topiramate titration. Patient experienced adverse cognitive fog without pain reduction.',
      noteSummary: 'Transferred care to Neurology following lack of response to analgesics. High clinical concern for central etiology; MRI negative.',
      convergenceState: 'transition',
      convergenceLabel: 'Specialist Transition → MRI',
      dpsScore: 69,
    },
    {
      id: 'enc_3',
      monthYear: 'MAR 2026',
      specialty: 'ENT',
      doctor: 'Dr. R. K. Gupta',
      facility: 'Apex Sinus & Head Institute',
      chiefComplaint: 'Persistent symptoms with retro-orbital pressure',
      investigations: [
        { name: 'Diagnostic Nasal Endoscopy', isRepeated: false, conclusive: false, findingsSummary: 'Nasal mucosa normal. No purulence or polypoid tissue in meatuses.' }
      ],
      recordedHypothesis: 'Sinugenic referred cephalalgia (Ruled out upon exam)',
      treatmentOutcome: 'Steroid nasal spray discontinued. Referred back for broader clinical evaluation.',
      noteSummary: 'Patient referred by neurologist to rule out sphenoid sinusitis. Endoscopic exam negative. No clear diagnostic convergence.',
      convergenceState: 'divergent',
      convergenceLabel: 'No clear convergence',
      dpsScore: 65,
    },
    {
      id: 'enc_4',
      monthYear: 'APR 2026',
      specialty: 'Neurology',
      doctor: 'Dr. Priya Desai',
      facility: 'Metro Neuroscience Center',
      chiefComplaint: 'Repeated concern: Daily occipital ache radiating to neck',
      investigations: [
        { name: 'Brain MRI (Repeated)', isRepeated: true, conclusive: false, findingsSummary: 'Repeat scan identical to Feb baseline. Zero novel anatomical findings.' }
      ],
      recordedHypothesis: 'Persistent idiopathic headache disorder with potential central sensitization',
      treatmentOutcome: 'Amitriptyline trial initiated with minimal response.',
      noteSummary: 'Duplicate scan ordered due to worsening patient distress. Redundant first-tier investigation yielding zero closure.',
      convergenceState: 'repeated',
      convergenceLabel: 'Repeated concern → MRI repeated',
      dpsScore: 64,
    },
    {
      id: 'enc_5',
      monthYear: 'MAY 2026',
      specialty: 'Internal Medicine',
      doctor: 'Dr. Vivek Menon',
      facility: 'City Referral Hospital',
      chiefComplaint: 'Assessment remains uncertain with generalized fatigue',
      investigations: [
        { name: 'Autoimmune & Thyroid Screen (ANA, TSH)', isRepeated: false, conclusive: false, findingsSummary: 'TSH within normal range; ANA negative. No systemic inflammatory marker.' }
      ],
      recordedHypothesis: 'Systemic inflammatory vs autonomic cephalea vs somatization',
      treatmentOutcome: 'Conservative physical therapy titration. No definitive treatment trajectory.',
      noteSummary: 'Assessment remains uncertain after multi-disciplinary consults. Trajectory velocity has flatlined.',
      convergenceState: 'uncertain',
      convergenceLabel: 'Assessment remains uncertain',
      dpsScore: 63,
    },
    {
      id: 'enc_6',
      monthYear: 'JUN 2026 (Current)',
      isCurrent: true,
      specialty: 'General Medicine',
      doctor: 'Dr. A. Sharma',
      facility: 'Odyssey Care Clinic (Suite 101)',
      chiefComplaint: 'Potential diagnostic stagnation: 6 encounters, 3 specialties, 2 repeated scans',
      investigations: [
        { name: 'Pending Multidisciplinary Review', isRepeated: false, conclusive: false, findingsSummary: 'Awaiting closed-loop cross-specialty clinical review and targeted evaluation.' }
      ],
      recordedHypothesis: 'Longitudinal diagnostic stagnation. High ambiguity with repeated identical workups.',
      treatmentOutcome: 'Prioritized in queue for Senior Clinical Review and Pre-Consultation Snapshot.',
      noteSummary: 'Odyssey Flow flags trajectory stagnation. Patient has experienced 5 months of repetitive consultations without closure.',
      convergenceState: 'stagnant',
      convergenceLabel: 'Current • Potential diagnostic stagnation',
      dpsScore: 63,
    },
  ];

  // Keep track of which event cards are expanded (expand current by default)
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    enc_6: true,
    enc_4: true,
  });

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    encounters.forEach(e => { all[e.id] = true; });
    setExpandedIds(all);
  };

  const collapseAll = () => {
    setExpandedIds({});
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-6">
      
      {/* Timeline Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <h3 className="text-base font-extrabold text-stone-900 tracking-tight flex items-center space-x-2">
            <span>Longitudinal Journey Timeline</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
              {encounters.length} Encounters
            </span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Chronological reconstruction of consultations, hypotheses, investigations, and convergence gaps.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button
            type="button"
            onClick={expandAll}
            className="px-2.5 py-1 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 font-medium transition-colors"
          >
            Expand All
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={collapseAll}
            className="px-2.5 py-1 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 font-medium transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Vertical Timeline Structure */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-stone-200">
        
        {encounters.map((enc, idx) => {
          const isExpanded = !!expandedIds[enc.id];
          const isCurrent = enc.isCurrent;
          const isStagnant = enc.convergenceState === 'stagnant' || enc.convergenceState === 'repeated';

          return (
            <div key={enc.id} className="relative group">
              
              {/* Timeline Node Marker */}
              <div 
                className={`absolute -left-6 sm:-left-8 top-3.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-110 ${
                  isCurrent
                    ? 'bg-amber-500 border-white ring-4 ring-amber-100 text-white shadow-xs'
                    : isStagnant
                    ? 'bg-amber-100 border-amber-500 text-amber-900'
                    : 'bg-white border-emerald-600 text-emerald-700'
                }`}
              >
                {isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                ) : (
                  <span className="text-[10px] font-mono font-black">{idx + 1}</span>
                )}
              </div>

              {/* Event Card */}
              <div 
                className={`rounded-2xl border transition-all ${
                  isCurrent
                    ? 'border-amber-300 bg-amber-50/25 shadow-xs'
                    : isExpanded
                    ? 'border-stone-300 bg-stone-50/40 shadow-2xs'
                    : 'border-stone-200/80 bg-white hover:border-stone-300'
                }`}
              >
                {/* Collapsed Header Summary */}
                <div 
                  onClick={() => toggleExpand(enc.id)}
                  className="p-4 cursor-pointer flex items-start justify-between gap-3 select-none"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                        {enc.monthYear}
                      </span>
                      <span className="text-xs font-bold text-stone-800">
                        {enc.specialty}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        • {enc.doctor}
                      </span>
                      {isCurrent && (
                        <span className="px-2 py-0.2 rounded-full bg-amber-200 text-amber-950 font-extrabold text-[10px] uppercase tracking-wider">
                          Current Stagnation
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 text-xs">
                      <span className="font-semibold text-stone-900">
                        Chief complaint:
                      </span>
                      <span className="text-stone-700 font-medium">
                        "{enc.chiefComplaint}"
                      </span>
                    </div>

                    {/* Convergence Arrow / Summary */}
                    <div className="flex items-center space-x-1.5 text-[11px] text-stone-500 pt-0.5 font-mono">
                      <span className="text-emerald-700 font-bold">↓</span>
                      <span className={enc.convergenceState === 'repeated' ? 'text-amber-800 font-bold' : 'text-stone-600'}>
                        {enc.convergenceLabel}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                      DPS {enc.dpsScore}
                    </span>
                    <button 
                      type="button"
                      className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50"
                      aria-label="Toggle details"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Detailed View */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-stone-100 space-y-3 text-xs animate-in fade-in duration-150">
                    
                    {/* Facility & Doctor Context */}
                    <div className="text-[11px] text-stone-500 flex items-center justify-between">
                      <span>Facility: <strong className="text-stone-700">{enc.facility}</strong></span>
                      <span>Attending: <strong className="text-stone-700">{enc.doctor}</strong></span>
                    </div>

                    {/* Investigations */}
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                        Investigations & Scans
                      </span>
                      <div className="space-y-1.5">
                        {enc.investigations.map((inv, i) => (
                          <div
                            key={i}
                            onClick={() => onSelectInvestigation && onSelectInvestigation(inv)}
                            className={`p-2 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-colors ${
                              inv.isRepeated 
                                ? 'bg-amber-50 border-amber-300 hover:bg-amber-100/70' 
                                : 'bg-white border-stone-200 hover:bg-stone-50'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <FileText className={`w-3.5 h-3.5 ${inv.isRepeated ? 'text-amber-700' : 'text-stone-500'}`} />
                              <span className="font-semibold text-stone-900">{inv.name}</span>
                              {inv.isRepeated && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-200 text-amber-900">
                                  Repeated Workup
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-stone-500 truncate max-w-[220px]">
                              {inv.findingsSummary}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recorded Hypothesis & Treatment Outcome */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                          Recorded Working Hypothesis
                        </span>
                        <p className="text-stone-800 font-medium mt-0.5 text-xs">
                          {enc.recordedHypothesis}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                          Treatment / Clinical Outcome
                        </span>
                        <p className="text-stone-800 font-medium mt-0.5 text-xs">
                          {enc.treatmentOutcome}
                        </p>
                      </div>
                    </div>

                    {/* Note Summary */}
                    <div className="p-2.5 rounded-xl bg-white border border-stone-200/80">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                        Clinical Encounter Note Summary
                      </span>
                      <p className="text-stone-600 mt-0.5 leading-relaxed text-xs italic">
                        "{enc.noteSummary}"
                      </p>
                    </div>

                  </div>
                )}

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
};
