import React, { useState, useMemo } from 'react';
import { 
  Users, Activity, Clock, ShieldAlert, Sparkles, AlertTriangle, 
  FileText, CheckCircle2, ChevronRight, Share2, Printer, PlusCircle, 
  ArrowRight, Stethoscope, Search, X, Check, Eye, DollarSign, Calendar,
  TrendingDown
} from 'lucide-react';
import { DataStore } from '../../services/dataStore';
import { DpsEngine } from '../../services/dpsEngine';
import { Patient, Token, Visit, DiagnosticEvent } from '../../types';
import { DiagnosticJourneyHeader } from './DiagnosticJourneyHeader';
import { DpsTrendChart } from './DpsTrendChart';
import { JourneyTimeline } from './JourneyTimeline';
import { JourneySignalsSidebar } from './JourneySignalsSidebar';

export interface PatientRecordsViewProps {
  selectedPatientId?: string;
  onSelectPatientId?: (id: string) => void;
  onOpenSnapshot?: (token: Token) => void;
  onCallPatient?: (tokenId: string) => void;
  onNavigateToDiagnosticJourney?: () => void;
  queue?: Token[];
}

export const PatientRecordsView: React.FC<PatientRecordsViewProps> = ({
  selectedPatientId: propSelectedId,
  onSelectPatientId,
  onOpenSnapshot,
  onCallPatient,
  onNavigateToDiagnosticJourney,
  queue,
}) => {
  const allPatients = DataStore.getPatients();
  
  // Default to Aarav Mehta ('pat_aarav_0') as the flagship case unless explicitly selected
  const [activePatientId, setActivePatientId] = useState<string>(
    propSelectedId || 'pat_aarav_0'
  );

  // Active Profile Tab: Default MUST be 'Journey' per specification!
  const [activeTab, setActiveTab] = useState<'journey' | 'overview' | 'visits' | 'investigations' | 'referrals' | 'billing'>('journey');

  // Interactive Modals State
  const [activeInvestigationModal, setActiveInvestigationModal] = useState<{
    name: string;
    findingsSummary: string;
    isRepeated?: boolean;
    date?: string;
    doctor?: string;
    facility?: string;
  } | null>(null);

  const [activeReferralModal, setActiveReferralModal] = useState<{
    specialty: string;
    status: string;
    date: string;
    doctor: string;
    notes: string;
  } | null>(null);

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [clinicalNoteText, setClinicalNoteText] = useState('');
  const [noteSuccessToast, setNoteSuccessToast] = useState(false);

  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [assessmentText, setAssessmentText] = useState('');
  const [assessmentSuccessToast, setAssessmentSuccessToast] = useState(false);

  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [referralSuccessToast, setReferralSuccessToast] = useState(false);

  // Retrieve active patient
  const patient = useMemo(() => {
    return allPatients.find(p => p.id === activePatientId) || allPatients[0];
  }, [allPatients, activePatientId]);

  // Retrieve current active queue token
  const currentToken = useMemo(() => {
    const liveQueue = queue || DataStore.getQueue();
    return liveQueue.find(t => t.patientId === patient.id) || {
      id: 'tok_aarav_27',
      tokenNumber: 'A-27',
      patientId: patient.id,
      patientName: patient.fullName,
      patientAge: patient.age || 42,
      patientGender: patient.gender,
      doctorId: 'doc_1',
      doctorName: 'Dr. Sharma',
      status: 'waiting',
      priority: 'normal',
      sanctuary_state: 'QUEUE_STABLE',
      queuePosition: 2,
      estimatedWaitTime: 12,
      dpsScore: 63,
      stagnationFlag: true,
      roomNumber: '101',
      symptomsSummary: 'Persistent headache',
    } as unknown as Token;
  }, [patient, queue]);

  const handleSelectPatient = (id: string) => {
    setActivePatientId(id);
    if (onSelectPatientId) onSelectPatientId(id);
  };

  const handleCall = () => {
    if (onCallPatient && currentToken) {
      onCallPatient(currentToken.id);
    } else if (currentToken) {
      DataStore.callToken(currentToken.id);
    }
  };

  const handleSnapshot = () => {
    if (onOpenSnapshot && currentToken) {
      onOpenSnapshot(currentToken);
    }
  };

  const handleSaveNote = () => {
    if (!clinicalNoteText.trim()) return;
    setIsNoteModalOpen(false);
    setNoteSuccessToast(true);
    setClinicalNoteText('');
    setTimeout(() => setNoteSuccessToast(false), 3000);
  };

  const handleSaveAssessment = () => {
    if (!assessmentText.trim()) return;
    setIsAssessmentModalOpen(false);
    setAssessmentSuccessToast(true);
    setAssessmentText('');
    setTimeout(() => setAssessmentSuccessToast(false), 3000);
  };

  const handleEscalateMDT = () => {
    setIsReferralModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. PATIENT HEADER */}
      <DiagnosticJourneyHeader
        patient={patient}
        token={currentToken}
        onCallPatient={handleCall}
        onOpenSnapshot={handleSnapshot}
        allPatients={allPatients}
        onSelectPatient={handleSelectPatient}
      />

      {/* Success Notification Toasts */}
      {noteSuccessToast && (
        <div className="p-3.5 bg-stone-900 text-white rounded-2xl flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Clinical encounter note successfully saved to Aarav Mehta's longitudinal record.</span>
          </div>
          <button onClick={() => setNoteSuccessToast(false)} className="text-stone-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {assessmentSuccessToast && (
        <div className="p-3.5 bg-emerald-950 text-white rounded-2xl flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Working clinical assessment updated and synchronized with Diagnostic Progress Score engine.</span>
          </div>
          <button onClick={() => setAssessmentSuccessToast(false)} className="text-emerald-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {referralSuccessToast && (
        <div className="p-3.5 bg-amber-950 text-white rounded-2xl flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Closed-loop Multidisciplinary Review escalation logged for Senior Diagnostic Board.</span>
          </div>
          <button onClick={() => setReferralSuccessToast(false)} className="text-amber-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. PROFILE TABS */}
      <div className="bg-white rounded-2xl p-1.5 border border-stone-200/80 shadow-2xs flex items-center justify-between overflow-x-auto">
        <div className="flex items-center space-x-1 min-w-max">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            Overview
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('journey')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'journey'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <span>Journey</span>
            <span className={`w-2 h-2 rounded-full ${activeTab === 'journey' ? 'bg-emerald-400' : 'bg-emerald-500'}`}></span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('visits')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'visits'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            Visits (6)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('investigations')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'investigations'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            Investigations (5)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('referrals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'referrals'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            Referrals (3)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('billing')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'billing'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            Billing
          </button>
        </div>

        {/* Central Product Axiom Pill */}
        <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-500">
          <span className="text-stone-400 font-medium">Core Axiom:</span>
          <strong className="text-stone-800">Is this patient's diagnostic journey actually moving forward?</strong>
        </div>
      </div>

      {/* 3. TAB CONTENT */}
      {activeTab === 'journey' && (
        <div className="space-y-6">
          
          {/* JOURNEY HERO SECTION */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              
              {/* Title and Subtitle */}
              <div className="max-w-xl">
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
                    Diagnostic Journey
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                    Longitudinal Analyzer
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Longitudinal view of how the diagnostic process has evolved across encounters.
                </p>
              </div>

              {/* Core Journey Metrics & DPS Hero Score */}
              <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
                
                {/* 3 Metrics: Journey Duration, Encounters, Specialties */}
                <div className="flex items-center space-x-4 bg-stone-50 p-3 rounded-2xl border border-stone-200/80">
                  <div className="text-center px-2">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      Journey Duration
                    </span>
                    <span className="font-mono font-extrabold text-stone-900 text-sm">
                      7 months
                    </span>
                  </div>

                  <div className="w-px h-8 bg-stone-200"></div>

                  <div className="text-center px-2">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      Encounters
                    </span>
                    <span className="font-mono font-extrabold text-stone-900 text-sm">
                      6
                    </span>
                  </div>

                  <div className="w-px h-8 bg-stone-200"></div>

                  <div className="text-center px-2">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      Specialties
                    </span>
                    <span className="font-mono font-extrabold text-stone-900 text-sm">
                      3
                    </span>
                  </div>
                </div>

                {/* Primary Visual Anchor: Diagnostic Progress Score (DPS) + Trend */}
                <div className="bg-amber-50/70 border border-amber-300 p-3.5 rounded-2xl flex items-center space-x-4 shadow-2xs">
                  <div>
                    <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider block">
                      Diagnostic Progress Score
                    </span>
                    <div className="flex items-baseline space-x-1.5 mt-0.5">
                      <span className="text-2xl font-mono font-black text-amber-950">
                        63
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-800">
                        / 100
                      </span>
                    </div>
                  </div>

                  <div className="pl-3 border-l border-amber-200">
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                      Trend
                    </span>
                    <span className="inline-flex items-center space-x-1 text-xs font-extrabold text-amber-900 mt-0.5 bg-amber-100 px-2 py-0.5 rounded-md">
                      <TrendingDown className="w-3.5 h-3.5 text-amber-700" />
                      <span>Stagnating</span>
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* TWO-COLUMN RESPONSIVE LAYOUT */}
          {/* Visual Hierarchy: Primary (DPS+Chart) -> Secondary (Timeline) -> Tertiary (Signals) -> Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: Large Clean Line Chart + Vertical Timeline (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* DPS Chart */}
              <DpsTrendChart
                currentDps={63}
                trendLabel="Stagnating"
                onPointClick={(idx) => {
                  console.log('Encounter point clicked', idx);
                }}
              />

              {/* Journey Timeline */}
              <JourneyTimeline
                onSelectInvestigation={(inv) => {
                  setActiveInvestigationModal({
                    name: inv.name,
                    findingsSummary: inv.findingsSummary,
                    isRepeated: inv.isRepeated,
                    date: 'March 2026',
                    doctor: 'Dr. Priya Desai',
                    facility: 'Metro Imaging Labs',
                  });
                }}
                onSelectReferral={(specialty) => {
                  setActiveReferralModal({
                    specialty,
                    status: specialty === 'Multidisciplinary Review' ? 'Recommended' : 'Completed',
                    date: 'Feb / Mar 2026',
                    doctor: specialty === 'Neurology' ? 'Dr. Priya Desai' : 'Dr. R. K. Gupta',
                    notes: 'Referral triggered due to persistent occipital headaches unresponsive to first-line pharmacotherapy.',
                  });
                }}
              />

            </div>

            {/* RIGHT COLUMN: Journey Signals, Why Flagged, Current State, Referrals, Doctor Actions (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <JourneySignalsSidebar
                onAddClinicalNote={() => setIsNoteModalOpen(true)}
                onUpdateAssessment={() => setIsAssessmentModalOpen(true)}
                onReviewInvestigations={() => setActiveTab('investigations')}
                onCreateReferral={() => setIsReferralModalOpen(true)}
                onPrepareSnapshot={handleSnapshot}
                onEscalateMDT={handleEscalateMDT}
                onSelectReferral={(specialty) => {
                  setActiveReferralModal({
                    specialty,
                    status: specialty === 'Multidisciplinary Review' ? 'Recommended' : 'Completed',
                    date: 'Spring 2026',
                    doctor: 'Specialist Panel',
                    notes: 'Cross-specialty escalation to break circular workups.',
                  });
                }}
              />
            </div>

          </div>

        </div>
      )}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="text-base font-extrabold text-stone-900">Patient Longitudinal Overview</h3>
            <p className="text-xs text-stone-500 mt-0.5">Demographics, chronic health summary, insurance coverage, and baseline history.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Chronic Condition</span>
              <p className="text-xs font-bold text-stone-900 mt-1">Refractory Occipital Cephalalgia (7 months)</p>
              <p className="text-[11px] text-stone-500 mt-1">No prior hypertension, diabetes, or migraine history.</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Insurance & Billing</span>
              <p className="text-xs font-bold text-stone-900 mt-1">Star Health Gold Comprehensive</p>
              <p className="text-[11px] text-stone-500 mt-1">Policy: SH-99214 • Co-pay: 0% • Cashless Approved</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Current Medication</span>
              <p className="text-xs font-bold text-stone-900 mt-1">Amitriptyline 10mg HS, Paracetamol SOS</p>
              <p className="text-[11px] text-stone-500 mt-1">Topiramate discontinued due to cognitive fog.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-amber-900">Diagnostic Stagnation Flag Active</h4>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Odyssey Flow recommends reviewing the Journey Tab to examine the repeated MRI scans and lack of diagnostic convergence.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('journey')}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0"
            >
              View Journey
            </button>
          </div>
        </div>
      )}

      {/* VISITS TAB */}
      {activeTab === 'visits' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="text-base font-extrabold text-stone-900">Recorded Outpatient Encounters (6)</h3>
            <p className="text-xs text-stone-500 mt-0.5">Full chronological visit history across all departments.</p>
          </div>

          <div className="divide-y divide-stone-100">
            {[
              { date: '12 Jan 2026', dept: 'General Medicine', doctor: 'Dr. Arjun Shenoy', reason: 'Persistent headache', outcome: 'Analgesics prescribed' },
              { date: '14 Feb 2026', dept: 'Neurology', doctor: 'Dr. Priya Desai', reason: 'Refractory headache', outcome: 'Brain MRI ordered; Topiramate initiated' },
              { date: '12 Mar 2026', dept: 'ENT', doctor: 'Dr. R. K. Gupta', reason: 'Sinus/retro-orbital pressure', outcome: 'Diagnostic Nasal Endoscopy (Normal)' },
              { date: '18 Apr 2026', dept: 'Neurology', doctor: 'Dr. Priya Desai', reason: 'Recurring headache', outcome: 'Brain MRI repeated (Unremarkable)' },
              { date: '20 May 2026', dept: 'Internal Medicine', doctor: 'Dr. Vivek Menon', reason: 'Fatigue & head pain', outcome: 'Blood screen; assessment uncertain' },
              { date: '12 Jun 2026 (Today)', dept: 'General Medicine', doctor: 'Dr. A. Sharma', reason: 'Check-in (Token A-27)', outcome: 'Waiting in lounge • Flagged for review' },
            ].map((v, i) => (
              <div key={i} className="py-3.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-stone-900 block">{v.date}</span>
                  <span className="text-stone-500">{v.dept} • {v.doctor}</span>
                </div>
                <div className="text-right">
                  <span className="font-medium text-stone-800 block">"{v.reason}"</span>
                  <span className="text-[11px] text-stone-400">{v.outcome}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INVESTIGATIONS TAB */}
      {activeTab === 'investigations' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-stone-900">Diagnostic Investigations & Laboratory Reports</h3>
              <p className="text-xs text-stone-500 mt-0.5">Click any investigation to inspect radiological and laboratory findings.</p>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-stone-100 rounded text-stone-700">
              5 Total • 2 Repeated
            </span>
          </div>

          <div className="space-y-2">
            {[
              { name: 'Complete Blood Count & Metabolic Panel', date: '18 Jan 2026', lab: 'Apex Central Diagnostics', conclusive: false, repeated: false, findings: 'All hematological parameters normal. Normal ESR & CRP.' },
              { name: 'Brain MRI (Non-contrast) - Initial Scan', date: '20 Feb 2026', lab: 'Metro Diagnostic Imaging Center', conclusive: false, repeated: false, findings: 'Unremarkable brain parenchyma. No space-occupying lesion or acute infarction.' },
              { name: 'Diagnostic Nasal Endoscopy', date: '12 Mar 2026', lab: 'Apex Sinus & Head Center', conclusive: false, repeated: false, findings: 'Nasal mucosa and meatal pathways normal. Sinugenic headache ruled out.' },
              { name: 'Brain MRI (Non-contrast) - Repeated Scan', date: '20 Apr 2026', lab: 'Metro Diagnostic Imaging Center', conclusive: false, repeated: true, findings: 'Identical to Feb baseline. No novel findings. Redundant repeat test.' },
              { name: 'Autoimmune & Thyroid Screen (ANA, TSH)', date: '22 May 2026', lab: 'Regional Reference Lab', conclusive: false, repeated: false, findings: 'TSH within normal range; ANA negative. No systemic marker.' },
            ].map((test, i) => (
              <div 
                key={i}
                onClick={() => setActiveInvestigationModal({
                  name: test.name,
                  findingsSummary: test.findings,
                  isRepeated: test.repeated,
                  date: test.date,
                  doctor: 'Attending Clinician',
                  facility: test.lab,
                })}
                className={`p-4 rounded-2xl border flex items-center justify-between text-xs cursor-pointer transition-colors ${
                  test.repeated ? 'bg-amber-50/70 border-amber-300 hover:bg-amber-100/60' : 'bg-white border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <FileText className={`w-4 h-4 ${test.repeated ? 'text-amber-800' : 'text-stone-500'}`} />
                    <span className="font-bold text-stone-900">{test.name}</span>
                    {test.repeated && (
                      <span className="px-2 py-0.2 rounded-full bg-amber-200 text-amber-950 font-bold text-[10px]">
                        Repeated Scan
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-stone-500 block">
                    {test.date} • {test.lab}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold text-stone-700 block max-w-xs truncate">
                    {test.findings}
                  </span>
                  <span className="text-[10px] text-stone-400">Click to view report</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REFERRALS TAB */}
      {activeTab === 'referrals' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-stone-900">Inter-Specialty Referrals</h3>
              <p className="text-xs text-stone-500 mt-0.5">Tracking closed-loop transitions between clinical departments.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsReferralModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 shadow-xs"
            >
              + New Referral
            </button>
          </div>

          <div className="space-y-3">
            {[
              { specialty: 'Neurology', doctor: 'Dr. Priya Desai', date: 'Feb 2026', status: 'Completed', note: 'Neuro consult completed with Brain MRI. No localized intracranial etiology.' },
              { specialty: 'ENT (Otolaryngology)', doctor: 'Dr. R. K. Gupta', date: 'Mar 2026', status: 'Completed', note: 'Nasal endoscopy negative. Sinusitis ruled out.' },
              { specialty: 'Multidisciplinary Diagnostic Board', doctor: 'Senior Review Panel', date: 'Jun 2026 (Pending)', status: 'Recommended', note: 'Comprehensive case review recommended to resolve 7-month diagnostic stagnation.' },
            ].map((ref, i) => (
              <div 
                key={i}
                onClick={() => setActiveReferralModal({
                  specialty: ref.specialty,
                  status: ref.status,
                  date: ref.date,
                  doctor: ref.doctor,
                  notes: ref.note,
                })}
                className={`p-4 rounded-2xl border flex items-center justify-between text-xs cursor-pointer transition-colors ${
                  ref.status === 'Recommended' ? 'bg-amber-50/70 border-amber-300 hover:bg-amber-100/60' : 'bg-white border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <Share2 className={`w-4 h-4 ${ref.status === 'Recommended' ? 'text-amber-800' : 'text-stone-600'}`} />
                    <span className="font-bold text-stone-900 text-sm">{ref.specialty}</span>
                  </div>
                  <span className="text-[11px] text-stone-500 block mt-0.5">
                    {ref.doctor} • {ref.date}
                  </span>
                  <p className="text-xs text-stone-600 mt-1 italic max-w-lg">
                    "{ref.note}"
                  </p>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                  ref.status === 'Recommended' ? 'bg-amber-200 text-amber-950' : 'bg-stone-100 text-stone-700'
                }`}>
                  {ref.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BILLING TAB */}
      {activeTab === 'billing' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-stone-900">Billing & Insurance Ledger</h3>
              <p className="text-xs text-stone-500 mt-0.5">Token A-27 active visit invoice and historic diagnostic workup claims.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              Cashless Pre-Auth Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Today's Token Consultation</span>
              <p className="text-lg font-mono font-bold text-stone-900 mt-1">₹800.00</p>
              <span className="text-[11px] text-emerald-700 font-semibold">Billed to Star Health Insurance</span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Cumulative Diagnostic Spend</span>
              <p className="text-lg font-mono font-bold text-stone-900 mt-1">₹24,500.00</p>
              <span className="text-[11px] text-stone-500">Across 2 Brain MRIs & 3 Lab Panels</span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Patient Out-of-Pocket</span>
              <p className="text-lg font-mono font-bold text-emerald-800 mt-1">₹0.00 (100% Covered)</p>
              <span className="text-[11px] text-stone-500">Zero co-pay balance</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          INTERACTIVE MODALS
         ========================================================================= */}

      {/* 1. Investigation Summary Modal */}
      {activeInvestigationModal && (
        <div className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  Diagnostic Investigation Summary
                </span>
                <h3 className="text-base font-extrabold text-stone-900 mt-0.5">
                  {activeInvestigationModal.name}
                </h3>
              </div>
              <button 
                onClick={() => setActiveInvestigationModal(null)}
                className="p-1 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Facility:</span>
                <strong className="text-stone-800">{activeInvestigationModal.facility || 'Metro Diagnostic Center'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Ordering Physician:</span>
                <strong className="text-stone-800">{activeInvestigationModal.doctor || 'Dr. Priya Desai'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Date Completed:</span>
                <strong className="text-stone-800">{activeInvestigationModal.date || 'March 2026'}</strong>
              </div>
              <div className="flex justify-between border-t border-stone-200/60 pt-2">
                <span className="text-stone-500">Conclusiveness Yield:</span>
                <span className="font-bold text-amber-800">Inconclusive (No structural correlate)</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                Radiological / Laboratory Findings
              </span>
              <p className="text-xs text-stone-700 bg-stone-50 p-3 rounded-2xl border border-stone-200/60 leading-relaxed">
                {activeInvestigationModal.findingsSummary}
              </p>
            </div>

            {activeInvestigationModal.isRepeated && (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Stagnation Marker:</strong> This test was repeated within a 2-month window with zero change in outcome. Redundant scan alert logged.
                </span>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveInvestigationModal(null)}
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Referral Details Modal */}
      {activeReferralModal && (
        <div className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  Referral Details
                </span>
                <h3 className="text-base font-extrabold text-stone-900 mt-0.5">
                  {activeReferralModal.specialty}
                </h3>
              </div>
              <button 
                onClick={() => setActiveReferralModal(null)}
                className="p-1 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Status:</span>
                <span className={`font-bold px-2 py-0.2 rounded-full ${
                  activeReferralModal.status === 'Recommended' ? 'bg-amber-200 text-amber-950' : 'bg-stone-200 text-stone-800'
                }`}>
                  {activeReferralModal.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Referred Specialist:</span>
                <strong className="text-stone-800">{activeReferralModal.doctor}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Date Logged:</span>
                <strong className="text-stone-800">{activeReferralModal.date}</strong>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                Clinical Referral Notes
              </span>
              <p className="text-xs text-stone-700 bg-stone-50 p-3 rounded-2xl border border-stone-200/60 leading-relaxed">
                {activeReferralModal.notes}
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveReferralModal(null)}
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Add Clinical Note Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  Encounter Documentation
                </span>
                <h3 className="text-base font-extrabold text-stone-900 mt-0.5">
                  Add Clinical Note for Aarav Mehta (A-27)
                </h3>
              </div>
              <button 
                onClick={() => setIsNoteModalOpen(false)}
                className="p-1 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-stone-500">
              Document current clinical assessment, review of 7-month cephalalgia trajectory, and discussion with patient:
            </div>

            <textarea
              rows={4}
              value={clinicalNoteText}
              onChange={(e) => setClinicalNoteText(e.target.value)}
              placeholder="e.g., Reviewed previous Brain MRI scans with patient. High degree of diagnostic anxiety observed. Recommending closed-loop multidisciplinary headache panel rather than repeat imaging..."
              className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900"
            />

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsNoteModalOpen(false)}
                className="px-3.5 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs font-bold hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNote}
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold"
              >
                Save to Journey
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Update Assessment Modal */}
      {isAssessmentModalOpen && (
        <div className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  Trajectory Alignment
                </span>
                <h3 className="text-base font-extrabold text-stone-900 mt-0.5">
                  Update Working Diagnostic Assessment
                </h3>
              </div>
              <button 
                onClick={() => setIsAssessmentModalOpen(false)}
                className="p-1 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900">
                Current Working Hypothesis: <strong>Refractory tension-type cephalalgia with central sensitization</strong>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                  Updated Assessment or Differential
                </label>
                <input
                  type="text"
                  value={assessmentText}
                  onChange={(e) => setAssessmentText(e.target.value)}
                  placeholder="e.g., Atypical Hemicrania Continua vs Cervicogenic Headache"
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAssessmentModalOpen(false)}
                className="px-3.5 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs font-bold hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAssessment}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
              >
                Update DPS Model
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Create Referral / Escalate MDT Modal */}
      {isReferralModalOpen && (
        <div className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  Closed-Loop Escalation
                </span>
                <h3 className="text-base font-extrabold text-stone-900 mt-0.5">
                  Escalate for Multidisciplinary Review
                </h3>
              </div>
              <button 
                onClick={() => setIsReferralModalOpen(false)}
                className="p-1 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <strong>Stagnation Resolver:</strong> Instead of sending the patient on another isolated specialty referral, this initiates a combined case conference (Neurology + Pain Management + General Medicine) with complete longitudinal pre-consultation telemetry.
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                  Target Clinical Panel
                </label>
                <select className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-800">
                  <option>Senior Multidisciplinary Headache & Pain Board</option>
                  <option>Comprehensive Neuro-Radiology Case Review</option>
                  <option>Complex Chronic Care Clinical Panel</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                  Clinical Escalation Rationale
                </label>
                <textarea
                  rows={3}
                  defaultValue="7-month diagnostic stagnation. Patient has had 2 unremarkable MRIs and circular transitions between General Medicine, Neurology, and ENT. Recommending collaborative multidisciplinary review."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsReferralModalOpen(false)}
                className="px-3.5 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs font-bold hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsReferralModalOpen(false);
                  setReferralSuccessToast(true);
                  setTimeout(() => setReferralSuccessToast(false), 4000);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold shadow-xs"
              >
                Confirm Escalation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
