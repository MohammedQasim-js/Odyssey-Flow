import React, { useState } from 'react';
import { 
  Calendar, CheckCircle2, Clock, ChevronRight, ChevronDown, 
  MapPin, Stethoscope, ArrowRight, ShieldCheck, User, 
  Building2, Activity, Sparkles, FileText, Check, X
} from 'lucide-react';
import { DataStore } from '../../services/dataStore';
import { Patient, Referral } from '../../types';

interface PatientHistoryViewProps {
  patient?: Patient;
}

interface JourneyEvent {
  id: string;
  month: string;
  year?: string;
  specialty: string;
  eventType: 'visit' | 'investigation' | 'current';
  title: string;
  subtitle: string;
  statusBadge: string;
  doctorName: string;
  clinicName: string;
  date: string;
  notes: string;
  isCurrent?: boolean;
}

const CANONICAL_JOURNEY_EVENTS: JourneyEvent[] = [
  {
    id: 'evt_jun',
    month: 'JUN',
    year: '2024',
    specialty: 'General Medicine',
    eventType: 'current',
    title: 'General Medicine',
    subtitle: 'Current consultation & review',
    statusBadge: 'Current visit',
    doctorName: 'Dr. A. Sharma',
    clinicName: 'Odyssey Care Clinic',
    date: '12 Jun 2024',
    notes: 'Follow-up on recurring tension-like discomfort. Care team is reviewing next diagnostic step with neurology specialist.',
    isCurrent: true,
  },
  {
    id: 'evt_apr',
    month: 'APR',
    year: '2024',
    specialty: 'ENT',
    eventType: 'visit',
    title: 'ENT Specialist',
    subtitle: 'Follow-up consultation',
    statusBadge: 'Visit completed',
    doctorName: 'Dr. S. Nair',
    clinicName: 'Apex Health Center',
    date: '18 Apr 2024',
    notes: 'Sinonasal causes assessed. No focal sinus infection or structural obstruction identified.',
  },
  {
    id: 'evt_mar',
    month: 'MAR',
    year: '2024',
    specialty: 'Investigation',
    eventType: 'investigation',
    title: 'Investigation: MRI Brain',
    subtitle: 'Neuroimaging diagnostic scan',
    statusBadge: 'Recorded',
    doctorName: 'Dr. P. Rao (Radiologist)',
    clinicName: 'Odyssey Diagnostic Center',
    date: '10 Mar 2024',
    notes: 'Standard brain MRI protocol. No acute intracranial pathology, hemorrhage, or mass effect detected.',
  },
  {
    id: 'evt_feb',
    month: 'FEB',
    year: '2024',
    specialty: 'Neurology',
    eventType: 'visit',
    title: 'Neurology',
    subtitle: 'Follow-up consultation',
    statusBadge: 'Visit completed',
    doctorName: 'Dr. Vikramaditya Sen',
    clinicName: 'Odyssey Apex Health Center',
    date: '14 Feb 2024',
    notes: 'Longitudinal evaluation of headache patterns and visual symptoms. Recommended conservative symptom journal.',
  },
  {
    id: 'evt_jan',
    month: 'JAN',
    year: '2024',
    specialty: 'General Medicine',
    eventType: 'visit',
    title: 'General Medicine',
    subtitle: 'Persistent headache',
    statusBadge: 'Visit completed',
    doctorName: 'Dr. A. Sharma',
    clinicName: 'Odyssey Care Clinic',
    date: '08 Jan 2024',
    notes: 'Initial clinical presentation. Blood pressure within normal limits. Prescribed first-line analgesics and lifestyle modifications.',
  },
];

export const PatientHistoryView: React.FC<PatientHistoryViewProps> = ({ patient: propPatient }) => {
  const patient = propPatient || DataStore.getCurrentPatient() || DataStore.getPatients()[0];
  const referrals = DataStore.getReferrals(patient.id);
  const activeReferral: Referral | undefined = referrals[0];

  const [expandedEventId, setExpandedEventId] = useState<string | null>('evt_jun');
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [referralAccepted, setReferralAccepted] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedEventId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4 pb-28 font-sans text-stone-900 animate-in fade-in duration-200">
      
      {/* 1. Header (Exact Specs: "Your Healthcare Journey", subtitle, patient name, 7 months duration, 6 visits) */}
      <div className="pt-1">
        <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
          Your Healthcare Journey
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          A simple view of your visits and care progress.
        </p>
      </div>

      {/* 2. Journey Header Summary Card */}
      <div 
        id="journey-header-card"
        className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-emerald-800 font-extrabold text-lg flex items-center justify-center border border-emerald-200/60 font-mono">
              {patient.fullName.charAt(0)}
            </div>
            <div>
              <h2 className="text-base font-extrabold text-stone-900">
                {patient.fullName}
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                {patient.age} yrs • {patient.gender}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
              Care Status
            </span>
            <span className="text-[11px] font-bold text-[#16A34A] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-block mt-0.5">
              Active Care
            </span>
          </div>
        </div>

        {/* 2 Key Journey Metrics: 7 Months Duration, 6 Visits */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
              Journey Duration
            </span>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className="text-xl font-extrabold text-stone-900 font-mono">7</span>
              <span className="text-xs font-semibold text-stone-600">months</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
              Recorded Visits
            </span>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className="text-xl font-extrabold text-stone-900 font-mono">6</span>
              <span className="text-xs font-semibold text-stone-600">visits &amp; scans</span>
            </div>
          </div>
        </div>

        {/* 3. Patient-Friendly Current Journey Status Reassurance */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200/80 flex items-start space-x-2.5">
          <Sparkles className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <strong className="font-bold text-emerald-950 block">
              Your care journey is progressing
            </strong>
            <p className="text-emerald-900/80 text-[11px] mt-0.5 leading-relaxed">
              Your care team is actively reviewing your longitudinal records and coordinating the recommended next clinical step.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Referral Status Card (When referral is created) */}
      <div 
        id="referral-status-card"
        className="bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white rounded-3xl p-5 border border-amber-200/90 shadow-xs space-y-3 relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-200/70 px-2.5 py-0.5 rounded-full">
            Care Journey Update
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300/70">
            Recommended
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-stone-900 leading-tight">
            Your care journey has been updated
          </h3>
          <p className="text-xs text-stone-600 font-medium">
            Referral: <strong className="text-stone-900">Neurology Review</strong>
          </p>
        </div>

        {/* Referral stats pill row */}
        <div className="grid grid-cols-3 gap-2 py-1 text-center text-xs">
          <div className="p-2 bg-white/90 rounded-xl border border-amber-200/70">
            <span className="text-[10px] text-stone-400 uppercase font-semibold block">Status</span>
            <span className="font-bold text-amber-800 text-xs">Pending</span>
          </div>
          <div className="p-2 bg-white/90 rounded-xl border border-amber-200/70">
            <span className="text-[10px] text-stone-400 uppercase font-semibold block">Priority</span>
            <span className="font-bold text-amber-900 text-xs">Recommended</span>
          </div>
          <div className="p-2 bg-white/90 rounded-xl border border-amber-200/70">
            <span className="text-[10px] text-stone-400 uppercase font-semibold block">Queue</span>
            <span className="font-mono font-bold text-stone-900 text-xs">#3</span>
          </div>
        </div>

        <button
          onClick={() => setShowReferralModal(true)}
          className="w-full py-3 px-4 rounded-2xl bg-stone-900 hover:bg-black active:scale-[0.99] text-white font-bold text-xs shadow-2xs transition-all flex items-center justify-center space-x-1.5"
        >
          <span>View Referral</span>
          <ArrowRight className="w-3.5 h-3.5 text-stone-300" />
        </button>
      </div>

      {/* 5. Journey Timeline (Expandable monthly events) */}
      <div 
        id="journey-timeline-section"
        className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-[#16A34A]" />
            <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">
              Care Timeline
            </h3>
          </div>
          <span className="text-[10px] text-stone-400 font-medium">
            Tap event to expand
          </span>
        </div>

        <div className="space-y-3 relative before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-stone-200">
          {CANONICAL_JOURNEY_EVENTS.map((evt) => {
            const isExpanded = expandedEventId === evt.id;
            const isCurrent = evt.isCurrent;

            return (
              <div key={evt.id} className="relative pl-10">
                {/* Timeline Month Circle Indicator */}
                <div 
                  className={`absolute left-5 top-3 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] transition-all font-mono shadow-2xs ${
                    isCurrent
                      ? 'bg-[#16A34A] text-white ring-4 ring-emerald-50'
                      : 'bg-stone-100 text-stone-700 border border-stone-300'
                  }`}
                >
                  {evt.month}
                </div>

                {/* Event Card (Expandable) */}
                <div 
                  onClick={() => toggleExpand(evt.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-emerald-50/50 border-emerald-300/80 hover:bg-emerald-50'
                      : isExpanded
                      ? 'bg-stone-50 border-stone-300'
                      : 'bg-stone-50/60 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-extrabold text-stone-900">
                          {evt.title}
                        </span>
                        {isCurrent && (
                          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-600 font-medium mt-0.5">
                        {evt.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center space-x-1 text-right shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                        isCurrent
                          ? 'bg-emerald-200/80 text-emerald-900'
                          : 'bg-stone-200/70 text-stone-700'
                      }`}>
                        {evt.statusBadge.includes('completed') || evt.statusBadge.includes('Recorded') ? (
                          <Check className="w-3 h-3 text-emerald-700 inline mr-0.5" />
                        ) : null}
                        <span>{evt.statusBadge}</span>
                      </span>
                      <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`} />
                    </div>
                  </div>

                  {/* Expandable Content */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-stone-200/60 space-y-2 text-xs animate-in fade-in duration-200">
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-stone-400 block font-medium">Clinician / Facility</span>
                          <strong className="text-stone-800 font-semibold">{evt.doctorName}</strong>
                        </div>
                        <div>
                          <span className="text-stone-400 block font-medium">Date &amp; Center</span>
                          <span className="text-stone-700 font-medium">{evt.date} • {evt.clinicName}</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-stone-200/70 text-stone-700 leading-relaxed text-[11px]">
                        <strong className="text-stone-900 block mb-0.5 font-bold">Clinical Record:</strong>
                        {evt.notes}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Referral Detail Modal */}
      {showReferralModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[#16A34A]" />
                <h3 className="font-extrabold text-stone-900 text-base">Referral Details</h3>
              </div>
              <button
                onClick={() => setShowReferralModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs divide-y divide-stone-100">
              <div className="pt-1 flex justify-between items-baseline">
                <span className="text-stone-500 font-medium">Specialty</span>
                <span className="font-extrabold text-stone-900 text-sm">Neurology Review</span>
              </div>

              <div className="pt-2 flex justify-between items-baseline">
                <span className="text-stone-500 font-medium">Target Clinic</span>
                <span className="font-semibold text-stone-900">Odyssey Apex Health Center</span>
              </div>

              <div className="pt-2 flex justify-between items-baseline">
                <span className="text-stone-500 font-medium">Referral Status</span>
                <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">Pending Scheduling</span>
              </div>

              <div className="pt-2 flex justify-between items-baseline">
                <span className="text-stone-500 font-medium">Referral Date</span>
                <span className="font-mono text-stone-800">12 Jun 2024</span>
              </div>

              <div className="pt-2 space-y-1">
                <span className="text-stone-500 font-medium block">Clinical Reason</span>
                <p className="text-[11px] text-stone-700 bg-stone-50 p-2.5 rounded-xl border border-stone-200/70 leading-relaxed">
                  Persistent tension-type headache refractory to primary medical therapy across previous visits. Comprehensive neurological evaluation recommended.
                </p>
              </div>

              <div className="pt-2 space-y-1">
                <span className="text-stone-500 font-medium block">Expected Next Step</span>
                <p className="text-[11px] text-stone-700 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/70 leading-relaxed text-emerald-950">
                  A specialist physician will review your clinical history, repeat physical diagnostics, and discuss targeted care options.
                </p>
              </div>
            </div>

            {referralAccepted ? (
              <div className="p-3 bg-emerald-100 text-emerald-900 rounded-2xl text-xs font-bold text-center flex items-center justify-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span>Appointment requested with Neurology specialist</span>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => setReferralAccepted(true)}
                  className="w-full py-3 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-2xl font-bold text-xs shadow-2xs transition-all text-center"
                >
                  Confirm &amp; Request Slot
                </button>
                <button
                  onClick={() => setShowReferralModal(false)}
                  className="w-full py-2 bg-stone-100 text-stone-600 rounded-2xl text-xs font-semibold hover:bg-stone-200 transition-all text-center"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
