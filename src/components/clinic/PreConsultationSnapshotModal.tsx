import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, CheckCircle2, Clock, FileText, Share2, 
  Stethoscope, X, ChevronRight, Sparkles, ShieldAlert, 
  ArrowRight, User, Plus, TrendingDown, Layers, Eye, 
  Check, ExternalLink, Calendar, RefreshCw
} from 'lucide-react';
import { Token, Patient, Referral } from '../../types';
import { DataStore } from '../../services/dataStore';
import { DpsEngine } from '../../services/dpsEngine';

interface PreConsultationSnapshotModalProps {
  token: Token;
  onClose: () => void;
  onStartConsultation: (tokenId: string) => void;
  onReviewFullJourney?: (patientId: string) => void;
  onOpenReferralModal?: (patientId: string) => void;
}

export const PreConsultationSnapshotModal: React.FC<PreConsultationSnapshotModalProps> = ({
  token,
  onClose,
  onStartConsultation,
  onReviewFullJourney,
  onOpenReferralModal,
}) => {
  // Modal workspace modes: 'snapshot' | 'consultation'
  const [isConsulting, setIsConsulting] = useState(token.status === 'in_consultation');
  
  // Operational queue extension toggle
  const [extendedWindowApplied, setExtendedWindowApplied] = useState(token.expectedDuration === 15);
  
  // Referral Modal State
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [referralSpecialty, setReferralSpecialty] = useState('Neurology');
  const [referralPriority, setReferralPriority] = useState('Recommended');
  const [referralReason, setReferralReason] = useState(
    'Persistent diagnostic trajectory with limited recent convergence.'
  );
  const [referralNote, setReferralNote] = useState(
    'Escalated for Multidisciplinary Review. Suspect refractory cephalalgia requiring contrast neurovascular imaging.'
  );
  const [createdReferral, setCreatedReferral] = useState<Referral | null>(null);

  // Secondary sub-views: 'overview' | 'investigations' | 'full_journey' | 'notes'
  const [activeSubView, setActiveSubView] = useState<'overview' | 'investigations' | 'full_journey' | 'notes'>('overview');
  
  // In-consultation note input
  const [clinicalNoteText, setClinicalNoteText] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  // Active consultation duration timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let timer: any;
    if (isConsulting) {
      timer = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isConsulting]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Retrieve patient and their journey data
  const patient: Patient = DataStore.getPatient(token.patientId) || ({
    id: token.patientId || 'pat_aarav_0',
    fullName: token.patientName || 'Aarav Mehta',
    age: token.patientAge || 42,
    gender: token.patientGender || 'Male',
    phone: '+91 98765 43210',
    maskedPhone: '+91 98XXXXXX10',
    hypotheticalAadhaar: 'XXXX XXXX 2741',
    emergencyContact: '+91 98765 00000',
    bloodGroup: 'B+',
    registeredDate: '2024-01-15',
    hasStagnation: true,
    uhid: 'OF-000284',
    currentDps: token.dpsScore || 63,
    trajectory: 'stagnating' as const,
  } as Patient);

  const visits = DataStore.getVisits(patient.id);
  const events = DataStore.getDiagnosticEvents(patient.id);
  const symptoms = DataStore.getSymptoms(patient.id);

  // Standard patient header details
  const patientName = patient.fullName || 'Aarav Mehta';
  const patientAge = patient.age || 42;
  const tokenNumber = token.tokenNumber || 'A-27';
  const currentConcern = token.symptomsSummary || 'Persistent headache';
  const doctorName = token.doctorName || 'Dr. Sharma';
  
  // Sanctuary Pulse state context
  const currentPulseContext = isConsulting 
    ? 'Your consultation is in progress' 
    : 'Doctor reviewing history';

  // Apply extended review window (5-min extension)
  const handleToggleExtendedWindow = () => {
    DataStore.applyQueuePolicyRebalance(token.id);
    setExtendedWindowApplied(true);
  };

  // Start Consultation Handler
  const handleStartConsultationClick = () => {
    setIsConsulting(true);
    onStartConsultation(token.id);
    DataStore.startConsultation(token.id);
  };

  // Complete Consultation Handler
  const handleCompleteConsultation = () => {
    DataStore.completeVisit(token.id);
    onClose();
  };

  // Submit Referral Handler
  const handleCreateReferralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRef = DataStore.createDemoNeurologyReferral({
      patientId: patient.id,
      patientName: patientName,
      fromDoctorName: doctorName,
      toSpecialty: referralSpecialty,
      priority: referralPriority,
      reason: referralReason,
      clinicalNotes: referralNote,
      referralToken: 'NEU-04',
      status: 'Pending',
    });
    setCreatedReferral(newRef);
  };

  // Save Note Handler
  const handleSaveNote = () => {
    if (!clinicalNoteText.trim()) return;
    DataStore.logAudit(
      'CLINICAL_NOTE_ADDED',
      'patient',
      patient.id,
      `Consultation note added: "${clinicalNoteText.substring(0, 50)}..."`,
      doctorName,
      '192.168.1.42 (Exam Room 101)',
      patientName
    );
    setNoteSaved(true);
    setTimeout(() => {
      setNoteSaved(false);
      setClinicalNoteText('');
    }, 2000);
  };

  // Simplified Journey Mini-Timeline Nodes
  const miniTimeline = [
    { month: 'Jan', specialty: 'General Medicine', note: 'Initial intake for tension cephalalgia', status: 'done' },
    { month: 'Feb', specialty: 'Neurology', note: 'First baseline neuro screening', status: 'done' },
    { month: 'Mar', specialty: 'MRI', note: 'Non-contrast brain scan (unremarkable)', status: 'done' },
    { month: 'Apr', specialty: 'ENT', note: 'Nasal endoscopy (sinuses clear)', status: 'done' },
    { month: 'May', specialty: 'Repeat MRI', note: 'Duplicate brain scan (no new yield)', status: 'done' },
    { month: 'Jun', specialty: 'Current Review', note: 'Stagnation review with Dr. Sharma', status: 'current' },
  ];

  // DPS Trajectory Nodes: 71 -> 69 -> 65 -> 64 -> 63 -> 63
  const dpsTrajectory = [
    { encounter: 'Enc 1', score: 71, label: 'Jan' },
    { encounter: 'Enc 2', score: 69, label: 'Feb' },
    { encounter: 'Enc 3', score: 65, label: 'Mar' },
    { encounter: 'Enc 4', score: 64, label: 'Apr' },
    { encounter: 'Enc 5', score: 63, label: 'May' },
    { encounter: 'Enc 6', score: 63, label: 'Jun (Current)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-[#FAFAFA] rounded-3xl border border-stone-200 shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden text-stone-900"
        role="dialog"
        aria-modal="true"
      >
        
        {/* ========================================================
            PATIENT HEADER
        ======================================================== */}
        <div className="bg-white px-6 py-5 border-b border-stone-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          
          <div className="flex items-start sm:items-center space-x-4">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700 font-extrabold text-base shrink-0 shadow-2xs">
              {patientName.split(' ').map(n => n[0]).join('')}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-black text-stone-900 tracking-tight">
                  {patientName}
                </h2>
                <span className="text-xs font-semibold text-stone-500">
                  {patientAge} years
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-mono text-xs font-bold border border-stone-200">
                  Token: {tokenNumber}
                </span>
                {isConsulting && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold inline-flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>IN CONSULTATION</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600">
                <div>
                  <span className="text-stone-400 font-medium">Current concern: </span>
                  <strong className="text-stone-900 font-semibold">{currentConcern}</strong>
                </div>
                <span>•</span>
                <div>
                  <span className="text-stone-400 font-medium">Doctor: </span>
                  <strong className="text-stone-900 font-semibold">{doctorName}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right Header Controls: Sanctuary Pulse Context & Close */}
          <div className="flex items-center space-x-3 self-end md:self-center shrink-0">
            {/* Sanctuary Pulse contextual pill */}
            <div className="px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <div className="text-[11px] leading-tight">
                <span className="text-stone-400 block font-medium">Sanctuary Pulse</span>
                <span className="font-semibold text-stone-800 truncate">
                  "{currentPulseContext}"
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-800 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body Scroll Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ========================================================
              ACTIVE CONSULTATION WORKSPACE (If consultation is in progress)
          ======================================================== */}
          {isConsulting ? (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Consultation Live Status Banner */}
              <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shrink-0">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-900">
                        Active Consultation Suite
                      </span>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white text-emerald-800 border border-emerald-300">
                        {formatTimer(elapsedSeconds)} / 15:00 min
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Sanctuary Pulse synchronized to mobile app: <strong className="font-semibold">"Your consultation is in progress"</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowReferralModal(true)}
                    className="px-3 py-2 rounded-xl bg-white hover:bg-emerald-50 text-stone-800 border border-emerald-300 text-xs font-bold transition-all flex items-center space-x-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5 text-stone-600" />
                    <span>Create Referral</span>
                  </button>
                  <button
                    onClick={handleCompleteConsultation}
                    className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    Complete Consultation
                  </button>
                </div>
              </div>

              {/* 5 Clean Doctor Workspace Modules */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* 1. Current Symptoms (4 cols) */}
                <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs space-y-3">
                  <div className="flex items-center space-x-2 border-b border-stone-100 pb-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
                      1. Current Symptoms
                    </h3>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-stone-400 block text-[11px]">Primary Chief Complaint</span>
                      <strong className="text-stone-900 font-bold block mt-0.5">
                        {currentConcern} (7 months persistent)
                      </strong>
                    </div>
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 leading-relaxed text-[11px] space-y-1">
                      <p>• <strong>Character:</strong> Daily bilateral occipital &amp; temporal dull-throbbing tension.</p>
                      <p>• <strong>Intensity:</strong> 6–7 / 10, exacerbated by prolonged screen exposure.</p>
                      <p>• <strong>Prior Response:</strong> Refractory to standard NSAIDs and paracetamol.</p>
                      <p>• <strong>Red Flags:</strong> No visual aura, no papilledema, no focal motor deficits.</p>
                    </div>
                  </div>
                </div>

                {/* 2. Previous Relevant Events (4 cols) */}
                <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs space-y-3">
                  <div className="flex items-center space-x-2 border-b border-stone-100 pb-2.5">
                    <Clock className="w-4 h-4 text-stone-600 shrink-0" />
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
                      2. Previous Relevant Events
                    </h3>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-[11px] space-y-1.5">
                      <div className="flex justify-between font-semibold text-stone-900">
                        <span>General Medicine Consult</span>
                        <span className="font-mono text-stone-400">Jan 2024</span>
                      </div>
                      <p className="text-stone-600">Prescribed analgesics; tension headache presumptive diagnosis.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-[11px] space-y-1.5">
                      <div className="flex justify-between font-semibold text-stone-900">
                        <span>Neurology Review</span>
                        <span className="font-mono text-stone-400">Feb 2024</span>
                      </div>
                      <p className="text-stone-600">Normal cranial exam; advised imaging if symptoms persist.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-[11px] space-y-1.5">
                      <div className="flex justify-between font-semibold text-stone-900">
                        <span>ENT &amp; Sinus Clinic</span>
                        <span className="font-mono text-stone-400">Apr 2024</span>
                      </div>
                      <p className="text-stone-600">Endoscopy normal; sinus involvement definitively ruled out.</p>
                    </div>
                  </div>
                </div>

                {/* 3. Recent Investigations (4 cols) */}
                <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs space-y-3">
                  <div className="flex items-center space-x-2 border-b border-stone-100 pb-2.5">
                    <Layers className="w-4 h-4 text-stone-600 shrink-0" />
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
                      3. Recent Investigations
                    </h3>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] space-y-1">
                      <div className="flex justify-between font-bold text-amber-950">
                        <span>Repeat MRI Brain (Plain)</span>
                        <span className="font-mono text-amber-800">May 2024</span>
                      </div>
                      <p className="text-amber-900">
                        <strong className="text-amber-950">Duplicate Scan:</strong> No structural intracranial abnormality detected. No contrast utilized.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-[11px] space-y-1">
                      <div className="flex justify-between font-bold text-stone-900">
                        <span>MRI Brain (Initial)</span>
                        <span className="font-mono text-stone-400">Mar 2024</span>
                      </div>
                      <p className="text-stone-600">Normal parenchyma; non-contributory for cephalalgia etiology.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-[11px] space-y-1">
                      <div className="flex justify-between font-bold text-stone-900">
                        <span>Complete Blood &amp; Metabolic Panel</span>
                        <span className="font-mono text-stone-400">Jan 2024</span>
                      </div>
                      <p className="text-stone-600">ESR 14 mm/hr; standard biochemical indices within physiological norms.</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Row: 4. Previous Notes & 5. Journey Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* 4. Previous Notes & Live Note Taker (6 cols) */}
                <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-stone-600 shrink-0" />
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
                        4. Clinical Notes
                      </h3>
                    </div>
                    <span className="text-[11px] text-stone-400">Longitudinal Record</span>
                  </div>

                  {/* Previous Clinician Note */}
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-700 space-y-1">
                    <div className="flex justify-between text-stone-500 font-medium">
                      <span>Prior Note (Dr. Gupta, Medicine)</span>
                      <span>Encounter 5</span>
                    </div>
                    <p className="italic">
                      "Patient continues to experience recalcitrant tension-type headache. Has consulted ENT and Ophthalmology without resolution. Suggest multidisciplinary panel or specialized neurovascular assessment."
                    </p>
                  </div>

                  {/* Live Active Note Form */}
                  <div className="space-y-2 pt-1">
                    <label className="text-xs font-bold text-stone-800 block">
                      Add New Note for Current Visit
                    </label>
                    <textarea
                      value={clinicalNoteText}
                      onChange={(e) => setClinicalNoteText(e.target.value)}
                      placeholder="Document consultation impressions, differential hypotheses, or management plan..."
                      className="w-full h-24 p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white transition-all resize-none"
                    />
                    <div className="flex items-center justify-between">
                      <button
                        onClick={handleSaveNote}
                        className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-2xs"
                      >
                        Save Clinical Note
                      </button>
                      {noteSaved && (
                        <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Note recorded in journey history</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 5. Journey Summary (6 cols) */}
                <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
                        5. Journey Summary
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      DPS: 63 / 100 • ↓ Stagnating
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <p className="text-stone-700 leading-relaxed text-xs">
                      The patient has undergone <strong>6 clinical encounters</strong> across <strong>3 medical specialties</strong> over <strong>7 months</strong> without diagnostic resolution. Two repeated non-contrast MRI scans yielded no explanatory findings.
                    </p>

                    <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                        Recommended Next Step
                      </span>
                      <p className="text-xs text-stone-900 font-medium">
                        Escalate for Multidisciplinary Review in Neurology to initiate high-resolution neurovascular contrast imaging and break diagnostic stagnation.
                      </p>
                      <button
                        onClick={() => setShowReferralModal(true)}
                        className="mt-2 w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs transition-all shadow-2xs flex items-center justify-center space-x-1.5"
                      >
                        <Share2 className="w-3.5 h-3.5 text-stone-950" />
                        <span>Escalate for Multidisciplinary Review</span>
                      </button>
                    </div>

                    <div className="text-right">
                      <button
                        onClick={() => setIsConsulting(false)}
                        className="text-xs font-semibold text-stone-500 hover:text-stone-800 underline"
                      >
                        Return to Pre-Consultation Snapshot
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            /* ========================================================
                PRE-CONSULTATION SNAPSHOT OVERVIEW
            ======================================================== */
            <div className="space-y-6">

              {/* ========================================================
                  TOP SUMMARY: 4 COMPACT METRICS
              ======================================================== */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                
                {/* 1. Journey Duration */}
                <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs">
                  <span className="text-[11px] font-semibold text-stone-400 block uppercase tracking-wider">
                    Journey Duration
                  </span>
                  <div className="mt-1.5 flex items-baseline space-x-1">
                    <span className="text-2xl font-black text-stone-900">7</span>
                    <span className="text-xs font-semibold text-stone-500">months</span>
                  </div>
                  <span className="text-[10px] text-stone-400 block mt-1">
                    Since Jan 2024 initial intake
                  </span>
                </div>

                {/* 2. Encounters */}
                <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs">
                  <span className="text-[11px] font-semibold text-stone-400 block uppercase tracking-wider">
                    Encounters
                  </span>
                  <div className="mt-1.5 flex items-baseline space-x-1">
                    <span className="text-2xl font-black text-stone-900">6</span>
                    <span className="text-xs font-semibold text-stone-500">visits</span>
                  </div>
                  <span className="text-[10px] text-stone-400 block mt-1">
                    Across clinic &amp; diagnostics
                  </span>
                </div>

                {/* 3. Specialties */}
                <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs">
                  <span className="text-[11px] font-semibold text-stone-400 block uppercase tracking-wider">
                    Specialties
                  </span>
                  <div className="mt-1.5 flex items-baseline space-x-1">
                    <span className="text-2xl font-black text-stone-900">3</span>
                    <span className="text-xs font-semibold text-stone-500">domains</span>
                  </div>
                  <span className="text-[10px] text-stone-400 block mt-1">
                    Medicine, Neuro, ENT
                  </span>
                </div>

                {/* 4. DPS (Diagnostic Progress Score) */}
                <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs relative">
                  <span className="text-[11px] font-semibold text-stone-400 block uppercase tracking-wider">
                    DPS
                  </span>
                  <div className="mt-1.5 flex items-baseline space-x-1.5">
                    <span className="text-2xl font-black text-stone-900">63</span>
                    <span className="text-xs font-semibold text-stone-400">/ 100</span>
                  </div>
                  {/* Under DPS: ↓ Stagnating (subtle amber indicator) */}
                  <div className="mt-1 flex items-center space-x-1 text-amber-800">
                    <span className="text-xs font-bold">↓</span>
                    <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800">
                      Stagnating
                    </span>
                  </div>
                </div>

              </div>

              {/* ========================================================
                  BALANCED TWO-COLUMN CLINICAL LAYOUT
              ======================================================== */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left / Primary Column (7 cols) */}
                <div className="lg:col-span-7 space-y-5">
                  
                  {/* 1. PRIMARY INSIGHT CARD */}
                  <div className="bg-white rounded-2xl p-5 border border-amber-300/80 shadow-2xs relative overflow-hidden">
                    <div className="flex items-start space-x-3.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 shrink-0 mt-0.5">
                        <AlertTriangle className="w-5 h-5 text-amber-700" />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-base font-extrabold text-stone-900 tracking-tight">
                          Potential diagnostic journey stagnation
                        </h3>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          The recent diagnostic trajectory shows limited measurable convergence.
                        </p>
                        <div className="pt-1">
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
                            <span>Clinical review recommended.</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. WHY THIS IS FLAGGED (Primary Explainability Panel) */}
                  <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                      <div className="flex items-center space-x-2">
                        <ShieldAlert className="w-4 h-4 text-stone-700 shrink-0" />
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
                          Why This Is Flagged
                        </h4>
                      </div>
                      <span className="text-[11px] text-stone-400 font-medium">
                        Explainability Signals
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      
                      <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                        <span className="text-stone-600 font-medium">Repeated complaint</span>
                        <strong className="text-stone-900 font-bold bg-white px-2 py-0.5 rounded border border-stone-200">
                          5 encounters
                        </strong>
                      </div>

                      <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                        <span className="text-stone-600 font-medium">Specialist transitions</span>
                        <strong className="text-stone-900 font-bold bg-white px-2 py-0.5 rounded border border-stone-200">
                          3
                        </strong>
                      </div>

                      <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                        <span className="text-stone-600 font-medium">Repeated investigations</span>
                        <strong className="text-amber-900 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          2 (Repeat MRI)
                        </strong>
                      </div>

                      <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                        <span className="text-stone-600 font-medium">Clinical uncertainty</span>
                        <strong className="text-amber-900 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Elevated
                        </strong>
                      </div>

                      <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between sm:col-span-2">
                        <span className="text-stone-600 font-medium">DPS trend</span>
                        <strong className="text-stone-900 font-bold bg-white px-2 py-0.5 rounded border border-stone-200">
                          Flat (64 → 63 → 63)
                        </strong>
                      </div>

                    </div>
                  </div>

                  {/* 3. JOURNEY MINI-TIMELINE */}
                  <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-stone-700 shrink-0" />
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
                          Journey Mini-Timeline
                        </h4>
                      </div>
                      
                      <button
                        onClick={() => {
                          if (onReviewFullJourney) {
                            onReviewFullJourney(patient.id);
                            onClose();
                          } else {
                            setActiveSubView('full_journey');
                          }
                        }}
                        className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center space-x-1 group"
                      >
                        <span>View Full Journey</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>

                    {/* Step-by-Step Flow */}
                    <div className="space-y-2 text-xs">
                      {miniTimeline.map((item, idx) => (
                        <React.Fragment key={idx}>
                          <div className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                            item.status === 'current'
                              ? 'bg-amber-50/70 border-amber-200'
                              : 'bg-stone-50 border-stone-200'
                          }`}>
                            <div className="flex items-center space-x-3">
                              <span className="font-mono text-xs font-extrabold text-stone-500 w-8">
                                {item.month}:
                              </span>
                              <span className="font-bold text-stone-900">
                                {item.specialty}
                              </span>
                            </div>
                            <span className="text-[11px] text-stone-500 hidden sm:inline">
                              {item.note}
                            </span>
                            {item.status === 'current' ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                                Active Turn
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-stone-400">
                                Done
                              </span>
                            )}
                          </div>
                          {idx < miniTimeline.length - 1 && (
                            <div className="pl-6 text-stone-300 font-bold text-xs leading-none">
                              ↓
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* 4. DPS TRAJECTORY CHART */}
                  <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                      <div>
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
                          DPS Trajectory
                        </h4>
                        <span className="text-xs font-bold text-amber-800">
                          Recent progress is flat
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-400 font-mono">
                        Threshold: 70
                      </span>
                    </div>

                    {/* Clean SVG Trajectory Line & Nodes */}
                    <div className="py-2">
                      <div className="relative h-28 w-full bg-stone-50 rounded-xl p-3 border border-stone-200/70 flex flex-col justify-between">
                        
                        {/* Reference threshold line (70) */}
                        <div className="absolute left-3 right-3 top-[32%] border-b border-dashed border-stone-300 flex items-center justify-end">
                          <span className="text-[9px] font-mono text-stone-400 bg-stone-50 px-1 -mt-2">
                            Convergence Target (70)
                          </span>
                        </div>

                        {/* Connected Data Nodes */}
                        <div className="relative flex items-center justify-between h-full pt-4 z-10 px-2">
                          {dpsTrajectory.map((node, i) => (
                            <div key={i} className="flex flex-col items-center">
                              <span className="font-mono text-[11px] font-black text-stone-900">
                                {node.score}
                              </span>
                              <div className={`w-3 h-3 rounded-full border-2 my-1.5 ${
                                i >= 4
                                  ? 'bg-amber-500 border-amber-600'
                                  : 'bg-stone-800 border-white'
                              }`}></div>
                              <span className="text-[10px] text-stone-400 font-medium">
                                {node.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2 px-1">
                        <span>71 → 69 → 65 → 64 → 63 → 63</span>
                        <span className="text-amber-800 font-semibold">• Flagged for stagnation review</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right / Operations & Actions Column (5 cols) */}
                <div className="lg:col-span-5 space-y-5">
                  
                  {/* 1. QUEUE CONTEXT CARD */}
                  <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs space-y-3.5">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-stone-700 shrink-0" />
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
                          Queue Context
                        </h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                        Token {tokenNumber}
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      
                      <div className="flex justify-between items-center p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                        <span className="text-stone-600 font-medium">Current token</span>
                        <strong className="font-mono font-bold text-stone-900">{tokenNumber}</strong>
                      </div>

                      <div className="flex justify-between items-center p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                        <span className="text-stone-600 font-medium">Patients ahead</span>
                        <strong className="font-mono font-bold text-stone-900">2</strong>
                      </div>

                      <div className="flex justify-between items-center p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                        <span className="text-stone-600 font-medium">Normal consultation allocation</span>
                        <span className="font-mono font-bold text-stone-700">10 min</span>
                      </div>

                      <div className="flex justify-between items-center p-2.5 rounded-xl bg-amber-50/80 border border-amber-200">
                        <span className="text-amber-950 font-medium">Current recommended allocation</span>
                        <span className="font-mono font-extrabold text-amber-950">15 min</span>
                      </div>

                      {/* Operational Queue Action */}
                      <div className="pt-1">
                        <button
                          onClick={handleToggleExtendedWindow}
                          className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                            extendedWindowApplied
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                              : 'bg-stone-900 hover:bg-stone-800 text-white shadow-xs'
                          }`}
                        >
                          {extendedWindowApplied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Extended review window active (+5 min)</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                              <span>Apply Extended Review Window</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Important Clarifying Policy Note */}
                      <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600 leading-relaxed">
                        <span className="font-bold text-stone-800 block mb-0.5">Policy Notice:</span>
                        Queue policy recommends a bounded 5-minute extension based on the detected journey complexity. The clinician and clinic policy remain in control.
                      </div>

                    </div>
                  </div>

                  {/* 2. CLINICAL ACTIONS */}
                  <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs space-y-3.5">
                    <div className="border-b border-stone-100 pb-2.5">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
                        Clinical Actions
                      </h4>
                    </div>

                    {/* Primary Action: Start Consultation */}
                    <button
                      onClick={handleStartConsultationClick}
                      className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center space-x-2"
                    >
                      <Stethoscope className="w-4 h-4" />
                      <span>Start Consultation</span>
                    </button>

                    {/* Secondary Actions */}
                    <div className="space-y-2 pt-1">
                      
                      <button
                        onClick={() => {
                          if (onReviewFullJourney) {
                            onReviewFullJourney(patient.id);
                            onClose();
                          } else {
                            setActiveSubView('full_journey');
                          }
                        }}
                        className="w-full py-2.5 px-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold transition-all text-left flex items-center justify-between"
                      >
                        <span className="flex items-center space-x-2">
                          <Clock className="w-3.5 h-3.5 text-stone-500" />
                          <span>Review Journey</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                      </button>

                      <button
                        onClick={() => setActiveSubView('investigations')}
                        className="w-full py-2.5 px-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold transition-all text-left flex items-center justify-between"
                      >
                        <span className="flex items-center space-x-2">
                          <Layers className="w-3.5 h-3.5 text-stone-500" />
                          <span>Review Investigations</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                      </button>

                      <button
                        onClick={() => setActiveSubView('notes')}
                        className="w-full py-2.5 px-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold transition-all text-left flex items-center justify-between"
                      >
                        <span className="flex items-center space-x-2">
                          <FileText className="w-3.5 h-3.5 text-stone-500" />
                          <span>Add Clinical Note</span>
                        </span>
                        <Plus className="w-3.5 h-3.5 text-stone-400" />
                      </button>

                      <button
                        onClick={() => setShowReferralModal(true)}
                        className="w-full py-2.5 px-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold transition-all text-left flex items-center justify-between"
                      >
                        <span className="flex items-center space-x-2">
                          <Share2 className="w-3.5 h-3.5 text-stone-500" />
                          <span>Create Referral</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                      </button>

                      <button
                        onClick={() => setShowReferralModal(true)}
                        className="w-full py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 text-xs font-bold transition-all text-left flex items-center justify-between"
                      >
                        <span className="flex items-center space-x-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                          <span>Escalate for Multidisciplinary Review</span>
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
                      </button>

                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* Sub-view: Review Investigations Drawer */}
          {activeSubView === 'investigations' && (
            <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-emerald-700" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                    Comprehensive Diagnostic Investigations Record
                  </h3>
                </div>
                <button
                  onClick={() => setActiveSubView('overview')}
                  className="text-xs font-bold text-stone-500 hover:text-stone-900"
                >
                  ✕ Close View
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
                  <div className="flex justify-between font-bold text-amber-950">
                    <span>Repeat MRI Brain (Plain)</span>
                    <span className="font-mono text-amber-800">2024-05-18</span>
                  </div>
                  <p className="text-stone-700">Repeated Tier-1 non-contrast scan. Conclusiveness: 15% (Duplicate findings without new clinical yield).</p>
                  <span className="text-[10px] font-bold text-amber-800 block mt-1">• Repeated investigation detected</span>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <div className="flex justify-between font-bold text-stone-900">
                    <span>Initial MRI Brain (Plain)</span>
                    <span className="font-mono text-stone-500">2024-03-12</span>
                  </div>
                  <p className="text-stone-700">Normal brain parenchyma, ventricles normal, no space-occupying lesion.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <div className="flex justify-between font-bold text-stone-900">
                    <span>Diagnostic Nasal Endoscopy</span>
                    <span className="font-mono text-stone-500">2024-04-05</span>
                  </div>
                  <p className="text-stone-700">Sinus mucosa clear, no purulent discharge or polyps. Ruled out rhinogenic headache.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <div className="flex justify-between font-bold text-stone-900">
                    <span>Complete Metabolic &amp; Inflammatory Markers</span>
                    <span className="font-mono text-stone-500">2024-01-20</span>
                  </div>
                  <p className="text-stone-700">Liver/kidney indices normal; ESR 14 mm/hr (borderline non-specific).</p>
                </div>
              </div>
            </div>
          )}

          {/* Sub-view: Clinical Note Taker */}
          {activeSubView === 'notes' && (
            <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Add Clinical Pre-Consultation Note
                </h3>
                <button
                  onClick={() => setActiveSubView('overview')}
                  className="text-xs font-bold text-stone-500 hover:text-stone-900"
                >
                  ✕ Close
                </button>
              </div>
              <textarea
                value={clinicalNoteText}
                onChange={(e) => setClinicalNoteText(e.target.value)}
                placeholder="Record clinical impressions, differential observations, or rationale for extended workup..."
                className="w-full h-28 p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white resize-none"
              />
              <div className="flex items-center justify-between">
                <button
                  onClick={handleSaveNote}
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold"
                >
                  Save Note to Record
                </button>
                {noteSaved && (
                  <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Note saved!</span>
                  </span>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Bar */}
        <div className="bg-white px-6 py-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-2 text-xs text-stone-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Odyssey Clinical Intelligence • Longitudinal Journey Analyzer</span>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold transition-all"
            >
              Close
            </button>
            {!isConsulting && (
              <button
                onClick={handleStartConsultationClick}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5"
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Start Consultation</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* ========================================================
          REFERRAL ACTION MODAL (Escalate for Multidisciplinary Review)
      ======================================================== */}
      {showReferralModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xl max-w-lg w-full space-y-4">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-stone-900">
                    Escalate for Multidisciplinary Review
                  </h3>
                  <span className="text-[11px] text-stone-400">Patient: {patientName} • Token: {tokenNumber}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowReferralModal(false);
                  setCreatedReferral(null);
                }}
                className="text-stone-400 hover:text-stone-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* If Referral was created, show Success State */}
            {createdReferral ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in zoom-in-95">
                <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-black text-emerald-950">
                    Referral created
                  </h4>
                  <div className="mt-2 inline-flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 font-mono text-xs">
                    <span className="text-stone-500">Referral token:</span>
                    <strong className="text-emerald-900 font-bold">{createdReferral.referralToken || 'NEU-04'}</strong>
                    <span className="text-stone-300">|</span>
                    <span className="text-stone-500">Status:</span>
                    <span className="text-emerald-700 font-bold">{createdReferral.status || 'Pending'}</span>
                  </div>
                  <p className="text-xs text-emerald-800 font-medium mt-2">
                    Added to specialty queue
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setShowReferralModal(false);
                      setCreatedReferral(null);
                    }}
                    className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Referral Input Form */
              <form onSubmit={handleCreateReferralSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-stone-700 font-bold block mb-1">
                    Recommended specialty
                  </label>
                  <select
                    value={referralSpecialty}
                    onChange={(e) => setReferralSpecialty(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-stone-900"
                  >
                    <option value="Neurology">Neurology</option>
                    <option value="Neurovascular Clinic">Neurovascular Clinic</option>
                    <option value="Multidisciplinary Pain Board">Multidisciplinary Pain Board</option>
                    <option value="ENT & Sinus">ENT &amp; Sinus</option>
                    <option value="Ophthalmology">Ophthalmology</option>
                  </select>
                </div>

                <div>
                  <label className="text-stone-700 font-bold block mb-1">
                    Priority
                  </label>
                  <select
                    value={referralPriority}
                    onChange={(e) => setReferralPriority(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-stone-900"
                  >
                    <option value="Recommended">Recommended</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Routine">Routine</option>
                  </select>
                </div>

                <div>
                  <label className="text-stone-700 font-bold block mb-1">
                    Reason
                  </label>
                  <input
                    type="text"
                    value={referralReason}
                    onChange={(e) => setReferralReason(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-stone-900"
                  />
                </div>

                <div>
                  <label className="text-stone-700 font-bold block mb-1">
                    Additional note
                  </label>
                  <textarea
                    value={referralNote}
                    onChange={(e) => setReferralNote(e.target.value)}
                    rows={3}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-stone-900 resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowReferralModal(false)}
                    className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-bold hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs flex items-center space-x-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Create Referral</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
