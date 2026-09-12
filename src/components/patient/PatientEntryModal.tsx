import React, { useState } from 'react';
import { 
  ShieldCheck, Phone, CheckCircle2, ArrowRight, 
  Sparkles, Lock, KeyRound, AlertCircle, RefreshCw, X 
} from 'lucide-react';
import { Patient } from '../../types';
import { DataStore } from '../../services/dataStore';

interface PatientEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: (patient: Patient) => void;
}

export const PatientEntryModal: React.FC<PatientEntryModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated,
}) => {
  const [step, setStep] = useState<'mobile' | 'otp' | 'identity_found'>('mobile');
  const [phoneNumber, setPhoneNumber] = useState('+91 98765 43242');
  const [otp, setOtp] = useState(['4', '2', '4', '2']);
  const [isProcessing, setIsProcessing] = useState(false);
  const [foundPatient, setFoundPatient] = useState<Patient | null>(null);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('otp');
    }, 450);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      const res = DataStore.lookupPatientByPhone(phoneNumber);
      const matched = res.patient || DataStore.getPatients().find(p => p.id === 'pat_aarav_0') || DataStore.getPatients()[0];
      setFoundPatient(matched);
      setIsProcessing(false);
      setStep('identity_found');
    }, 550);
  };

  const handleCompleteEntry = () => {
    if (foundPatient) {
      DataStore.setCurrentPatient(foundPatient);
      onAuthenticated(foundPatient);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Prototype Aadhaar Disclaimer Badge */}
        <div className="mb-4 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-[11px] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>Prototype identity verification</span>
        </div>

        {/* STEP 1: MOBILE NUMBER ENTRY */}
        {step === 'mobile' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-stone-900">
                Continue as Patient
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Zero passwords or account setups. Enter your registered mobile number for instant identity lookup.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98XXXXXX42"
                  className="w-full pl-10 pr-4 py-2.5 text-sm font-medium border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-stone-50/50"
                  required
                />
              </div>
            </div>

            {/* Quick Demo Switcher */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 text-xs">
              <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1.5">
                Demo Presets
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPhoneNumber('+91 98765 43242')}
                  className="flex-1 py-1.5 px-2 bg-white border border-stone-200 rounded-lg text-left text-xs hover:border-emerald-500 transition-colors"
                >
                  <strong className="block text-stone-800">Aarav Mehta</strong>
                  <span className="text-[10px] text-stone-500">+91 98XXXXXX42</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPhoneNumber('+91 98765 43241')}
                  className="flex-1 py-1.5 px-2 bg-white border border-stone-200 rounded-lg text-left text-xs hover:border-emerald-500 transition-colors"
                >
                  <strong className="block text-stone-800">Priya Sharma</strong>
                  <span className="text-[10px] text-stone-500">+91 98XXXXXX41</span>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2"
              >
                <span>{isProcessing ? 'Sending Secure OTP...' : 'Send OTP'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[10px] text-stone-400 text-center leading-relaxed">
              This is simulated for demonstration. Never calls external Aadhaar APIs or stores actual UIDAI credentials.
            </p>
          </form>
        )}

        {/* STEP 2: DEMO OTP VERIFICATION */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-stone-900">
                Demo OTP Verification
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Enter the 4-digit demo verification code sent to <span className="font-semibold text-stone-800">{phoneNumber}</span>.
              </p>
            </div>

            <div className="flex justify-center gap-3 py-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const newOtp = [...otp];
                    newOtp[idx] = e.target.value;
                    setOtp(newOtp);
                  }}
                  className="w-12 h-12 text-center text-lg font-bold font-mono border-2 border-emerald-500 rounded-xl bg-emerald-50/30 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500 px-1">
              <span>Demo code auto-filled: <strong>4242</strong></span>
              <button
                type="button"
                onClick={() => setOtp(['4', '2', '4', '2'])}
                className="text-emerald-700 font-semibold hover:underline"
              >
                Reset OTP
              </button>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>{isProcessing ? 'Verifying Simulated Credentials...' : 'Verify OTP & Lookup Identity'}</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: IDENTITY LOOKUP RESULT */}
        {step === 'identity_found' && foundPatient && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-emerald-950">
                  Patient identity found
                </h3>
                <p className="text-xs text-emerald-800">
                  Simulated Aadhaar-linked record matched successfully.
                </p>
              </div>
            </div>

            {/* Masked Aadhaar Card Details */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-3">
              <div className="flex items-center justify-between border-b border-stone-200/70 pb-2.5">
                <span className="text-xs text-stone-500">Identity:</span>
                <span className="text-sm font-bold text-stone-900">{foundPatient.fullName}</span>
              </div>

              <div className="flex items-center justify-between border-b border-stone-200/70 pb-2.5">
                <span className="text-xs text-stone-500">Mobile:</span>
                <span className="font-mono text-xs font-semibold text-stone-800">{foundPatient.maskedPhone}</span>
              </div>

              <div className="flex items-center justify-between border-b border-stone-200/70 pb-2.5">
                <span className="text-xs text-stone-500">Aadhaar-linked ID:</span>
                <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                  {foundPatient.hypotheticalAadhaar}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>Demographics:</span>
                <span className="text-stone-700 font-medium">
                  {foundPatient.age} yrs • {foundPatient.gender} • Blood Group {foundPatient.bloodGroup}
                </span>
              </div>
            </div>

            {/* Diagnostic Odyssey / Pre-Loaded Context Note */}
            <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
              <div className="flex items-center space-x-1.5 font-bold mb-0.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Diagnostic Context Synchronized</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                {foundPatient.activeJourneySummary}
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={handleCompleteEntry}
                className="w-full py-3.5 px-4 bg-stone-900 hover:bg-stone-800 active:bg-black text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2"
              >
                <span>Enter Patient Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
