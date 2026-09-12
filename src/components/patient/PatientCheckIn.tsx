import React, { useState } from 'react';
import { 
  ShieldCheck, Phone, CheckCircle2, AlertCircle, Sparkles, 
  ArrowRight, UserCheck, Stethoscope, Clock, Activity, Building2,
  Check, HeartPulse
} from 'lucide-react';
import { DataStore, INITIAL_PATIENTS } from '../../services/dataStore';
import { Token, Patient, Clinic } from '../../types';

interface PatientCheckInProps {
  onTokenCreated: (token: Token) => void;
  initialClinicId?: string;
}

const COMMON_SYMPTOMS = [
  'Persistent headache',
  'Fatigue',
  'Fever',
  'Cough',
  'Abdominal pain',
  'Body ache'
];

export const PatientCheckIn: React.FC<PatientCheckInProps> = ({
  onTokenCreated,
  initialClinicId = 'clinic_odyssey_care',
}) => {
  const currentPatient = DataStore.getCurrentPatient() || INITIAL_PATIENTS[0];
  const clinics = DataStore.getClinics();

  const [selectedClinicId, setSelectedClinicId] = useState(initialClinicId);
  const [visitReason, setVisitReason] = useState('Consultation');
  const [symptomText, setSymptomText] = useState('Persistent headache daily for past 8 months with fatigue');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Persistent headache', 'Fatigue']);
  const [shareConsent, setShareConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<Token | null>(null);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleConfirmCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      // Generate token in DataStore
      const token = DataStore.generateToken({
        patientId: currentPatient.id,
        clinicId: selectedClinicId,
        symptomsSummary: `${visitReason}. Tags: ${selectedTags.join(', ')}. Details: ${symptomText}`,
        severity: 7,
        durationDays: 21,
      });

      // Override for the exact required demo values if it is Aarav Mehta
      if (currentPatient.id === 'pat_aarav_0' || (currentPatient.fullName || (currentPatient as any).name || '').includes('Aarav')) {
        token.tokenNumber = 'A-27';
        token.doctorName = 'Dr. A. Sharma';
        token.clinicName = 'Odyssey Care Clinic';
        token.roomNumber = 'Room 101';
        token.queuePosition = 7;
        token.estimatedWaitMin = 24;
        token.sanctuary_state = 'QUEUE_STABLE';
        DataStore.setActiveToken(token);
      }

      setGeneratedToken(token);
      setIsSubmitting(false);
    }, 600);
  };

  // -------------------------------------------------------------
  // VIEW: TOKEN GENERATION RESULT (After submission)
  // -------------------------------------------------------------
  if (generatedToken) {
    return (
      <div className="space-y-4 pb-24 font-sans text-stone-900 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Large Confirmation Badge Card */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-200/90 shadow-sm text-center relative overflow-hidden">
          
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3.5 shadow-2xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Check-In Confirmed • Zero-Friction Flow
          </span>

          <h2 className="text-xl font-extrabold text-stone-900 mt-2">
            You're In The Smart Queue
          </h2>
          <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
            Your clinical history has been synchronized with your consulting physician.
          </p>

          {/* Token Big Display */}
          <div className="mt-5 p-4 rounded-2xl bg-stone-900 text-white shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
              Your Queue Token
            </span>
            <div className="text-4xl font-extrabold font-mono tracking-tight text-white">
              {generatedToken.tokenNumber || 'A-27'}
            </div>
          </div>

          {/* Consultation Breakdown Grid */}
          <div className="grid grid-cols-2 gap-2.5 mt-4 text-left text-xs">
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/60">
              <span className="text-[10px] uppercase font-semibold text-stone-400 block">Assigned Doctor</span>
              <strong className="text-stone-900 block mt-0.5">{generatedToken.doctorName || 'Dr. A. Sharma'}</strong>
              <span className="text-[11px] text-emerald-700 font-medium">{generatedToken.specialty || 'General Medicine'}</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/60">
              <span className="text-[10px] uppercase font-semibold text-stone-400 block">Assigned Room</span>
              <strong className="text-stone-900 block mt-0.5">{generatedToken.roomNumber || 'Room 101'}</strong>
              <span className="text-[11px] text-stone-500">First Floor East</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/60">
              <span className="text-[10px] uppercase font-semibold text-stone-400 block">Queue Position</span>
              <strong className="text-stone-900 block mt-0.5">{generatedToken.queuePosition || 7} in line</strong>
              <span className="text-[11px] text-stone-500">Moving steadily</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/60">
              <span className="text-[10px] uppercase font-semibold text-stone-400 block">Estimated Time</span>
              <strong className="text-stone-900 block mt-0.5">~{generatedToken.estimatedWaitMin || 24} mins</strong>
              <span className="text-[11px] text-stone-500">Real-time dynamic</span>
            </div>
          </div>

          {/* Primary Action Button: Enter Sanctuary Pulse */}
          <div className="mt-5">
            <button
              onClick={() => onTokenCreated(generatedToken)}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center space-x-2"
            >
              <HeartPulse className="w-4 h-4" />
              <span>Enter Sanctuary Pulse</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: CHECK-IN FORM
  // -------------------------------------------------------------
  return (
    <div className="space-y-4 pb-24 font-sans text-stone-900">
      
      {/* Title & Introduction */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs">
        <h2 className="text-xl font-extrabold tracking-tight text-stone-900">
          Zero-Friction Clinic Check-in
        </h2>
        <p className="text-xs text-stone-500 mt-1 leading-relaxed">
          Check in seamlessly without waiting at physical reception desks. Your diagnostic history is automatically linked.
        </p>

        {/* Prototype Aadhaar disclaimer badge */}
        <div className="mt-3.5 p-3 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start space-x-2.5 text-xs text-amber-900">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Prototype Identity Verification</span>
            <p className="text-[11px] text-amber-800 mt-0.5">
              Simulated identity linked to your patient profile. No actual Aadhaar or government records are stored or accessed.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleConfirmCheckIn} className="space-y-4">
        
        {/* 1. Identity Confirmation Card */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3">
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
            1. Identity Confirmation
          </span>

          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-200/70 text-emerald-900 flex items-center justify-center font-bold">
                <UserCheck className="w-5 h-5 text-emerald-800" />
              </div>
              <div>
                <strong className="text-stone-900 block text-sm font-bold">{currentPatient.fullName}</strong>
                <span className="text-stone-500 block text-[11px] font-mono">{currentPatient.maskedPhone}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">Aadhaar-Linked ID</span>
              <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded">
                {currentPatient.hypotheticalAadhaar}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Clinic Selection */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3">
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
            2. Select Clinic
          </span>

          <div className="space-y-2">
            {clinics.map((c) => (
              <label
                key={c.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedClinicId === c.id
                    ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="clinic"
                    checked={selectedClinicId === c.id}
                    onChange={() => setSelectedClinicId(c.id)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-stone-900 block">{c.name}</span>
                    <span className="text-[11px] text-stone-500 block">{c.address}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-stone-900 block">~{c.averageWaitMin}m wait</span>
                  <span className="text-[11px] text-stone-500">{c.queueCount} ahead</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 3. Visit Reason & Symptom Input */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3.5">
          <div>
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
              3. Visit Reason &amp; Symptoms
            </span>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Quick description for your doctor. (Not a medical diagnosis form).
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Primary Reason for Visit
            </label>
            <input
              type="text"
              value={visitReason}
              onChange={(e) => setVisitReason(e.target.value)}
              placeholder="e.g. Persistent fatigue, routine checkup, stomach pain"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-stone-50/50"
              required
            />
          </div>

          {/* Quick Common Symptom Tags */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1.5">
              Common Symptom Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMON_SYMPTOMS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1 ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Simple optional notes */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Additional Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={symptomText}
              onChange={(e) => setSymptomText(e.target.value)}
              placeholder="Any details you'd like your doctor to know in advance..."
              className="w-full p-3 text-xs sm:text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-stone-50/50"
            />
          </div>
        </div>

        {/* 4. Consent Checkbox */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={shareConsent}
              onChange={(e) => setShareConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300"
            />
            <div className="text-xs">
              <span className="font-bold text-stone-900 block">
                Share previous visit summaries with consulting doctor
              </span>
              <p className="text-stone-500 text-[11px] mt-0.5 leading-relaxed">
                Permits Odyssey Flow to compile an instant pre-consultation diagnostic snapshot from your previous health records.
              </p>
            </div>
          </label>
        </div>

        {/* 5. Submit CTA: "Confirm Check-in & Get Token" */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSubmitting ? 'Generating Smart Token...' : 'Confirm Check-in & Get Token'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>

    </div>
  );
};
