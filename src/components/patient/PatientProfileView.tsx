import React, { useState } from 'react';
import { 
  User, ShieldCheck, FileText, Calendar, Bell, 
  HelpCircle, ChevronRight, Lock, ChevronDown, Check,
  Phone, LogOut, HeartHandshake, Sparkles
} from 'lucide-react';
import { Patient } from '../../types';
import { DataStore } from '../../services/dataStore';

interface PatientProfileViewProps {
  patient?: Patient;
  onOpenBilling: () => void;
  onOpenJourney: () => void;
  onOpenAppointments?: () => void;
  onSwitchPatient: () => void;
}

export const PatientProfileView: React.FC<PatientProfileViewProps> = ({
  patient: propPatient,
  onOpenBilling,
  onOpenJourney,
  onOpenAppointments,
  onSwitchPatient,
}) => {
  const patient = propPatient || DataStore.getCurrentPatient() || DataStore.getPatients()[0];

  // Consent Toggles (Simple Controls with Plain Language)
  const [consentQueue, setConsentQueue] = useState(true);
  const [consentJourney, setConsentJourney] = useState(true);
  const [consentNotifications, setConsentNotifications] = useState(true);

  // Expandable sections
  const [expandedSection, setExpandedSection] = useState<'personal' | 'consent' | 'help' | null>('consent');

  return (
    <div className="space-y-4 pb-28 font-sans text-stone-900 animate-in fade-in duration-200">
      
      {/* 1. Header */}
      <div className="pt-1">
        <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
          Profile
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Your patient information &amp; sanctuary visit preferences
        </p>
      </div>

      {/* 2. Patient Identity Card (Exact Specs) */}
      <div 
        id="patient-identity-card"
        className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4 text-center"
      >
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 text-emerald-800 font-extrabold text-2xl flex items-center justify-center border-2 border-emerald-200 shadow-2xs font-mono">
          {patient.fullName.charAt(0)}
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-stone-900">
            {patient.fullName}
          </h2>
          <p className="text-xs text-stone-500 font-mono mt-0.5">
            Phone: {patient.maskedPhone || '+91 98XXXXXX42'}
          </p>
          <p className="text-xs text-stone-500 font-mono mt-0.5">
            Patient ID: <strong className="text-stone-800">OF-000284</strong>
          </p>
        </div>

        {/* Prototype Identity Reference (Strict User Requirement) */}
        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-left space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Prototype identity reference
            </span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
              Verified
            </span>
          </div>
          <span className="font-mono text-xs font-bold text-stone-900 block">
            {patient.hypotheticalAadhaar || 'XXXX XXXX 2741'}
          </span>
          <p className="text-[10px] text-stone-400 leading-tight">
            Simulated demonstration reference only. No government identity data is stored.
          </p>
        </div>
      </div>

      {/* 3. Sections List */}
      <div className="bg-white rounded-3xl p-2 border border-stone-200/80 shadow-xs divide-y divide-stone-100">
        
        {/* Section 1: Personal Information */}
        <div className="p-1">
          <div 
            onClick={() => setExpandedSection(prev => prev === 'personal' ? null : 'personal')}
            className="p-3.5 flex items-center justify-between hover:bg-stone-50 rounded-2xl cursor-pointer transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
                <User className="w-4 h-4 text-[#16A34A]" />
              </div>
              <span className="text-xs font-bold text-stone-900">Personal Information</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${expandedSection === 'personal' ? 'rotate-180' : ''}`} />
          </div>

          {expandedSection === 'personal' && (
            <div className="p-4 pt-1 text-xs space-y-2 text-stone-600 bg-stone-50/70 rounded-2xl m-2 border border-stone-200/60 animate-in fade-in duration-200">
              <div className="flex justify-between py-1 border-b border-stone-200/50">
                <span className="text-stone-400">Age &amp; Gender</span>
                <span className="font-semibold text-stone-800">{patient.age} years • {patient.gender}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200/50">
                <span className="text-stone-400">Blood Group</span>
                <span className="font-semibold text-stone-800">{patient.bloodGroup || 'O+'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-400">Emergency Contact</span>
                <span className="font-mono text-stone-800">+91 98123 00002</span>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Appointments */}
        <div 
          onClick={onOpenAppointments}
          className="p-3.5 flex items-center justify-between hover:bg-stone-50 rounded-2xl cursor-pointer transition-colors m-1"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-[#16A34A]" />
            </div>
            <span className="text-xs font-bold text-stone-900">Appointments</span>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </div>

        {/* Section 3: Visit History */}
        <div 
          onClick={onOpenJourney}
          className="p-3.5 flex items-center justify-between hover:bg-stone-50 rounded-2xl cursor-pointer transition-colors m-1"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
              <FileText className="w-4 h-4 text-[#16A34A]" />
            </div>
            <span className="text-xs font-bold text-stone-900">Visit History &amp; Journey</span>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </div>

        {/* Section 4: Notifications */}
        <div className="p-3.5 flex items-center justify-between hover:bg-stone-50 rounded-2xl m-1">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
              <Bell className="w-4 h-4 text-[#16A34A]" />
            </div>
            <div>
              <span className="text-xs font-bold text-stone-900 block">Notifications</span>
              <span className="text-[11px] text-stone-400">Queue chimes &amp; turn alerts</span>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setConsentNotifications(!consentNotifications)}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              consentNotifications ? 'bg-[#16A34A]' : 'bg-stone-300'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
              consentNotifications ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Section 5: Privacy & Consent (Exact User Requirements) */}
        <div className="p-1">
          <div 
            onClick={() => setExpandedSection(prev => prev === 'consent' ? null : 'consent')}
            className="p-3.5 flex items-center justify-between hover:bg-stone-50 rounded-2xl cursor-pointer transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center border border-emerald-100">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-stone-900">Privacy &amp; Consent</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${expandedSection === 'consent' ? 'rotate-180' : ''}`} />
          </div>

          {expandedSection === 'consent' && (
            <div className="p-4 pt-2 space-y-3 bg-stone-50/80 rounded-2xl m-2 border border-stone-200/60 animate-in fade-in duration-200">
              <p className="text-[11px] text-stone-600 leading-relaxed font-medium">
                Your information helps us coordinate your clinic visit and show relevant visit history.
              </p>

              <div className="space-y-2.5 pt-1">
                {/* Option 1: Queue & visit information */}
                <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-stone-200/60">
                  <div className="text-[11px]">
                    <span className="font-bold text-stone-900 block">Queue &amp; visit information</span>
                    <span className="text-stone-400 text-[10px]">Real-time token &amp; Sanctuary Pulse updates</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setConsentQueue(!consentQueue)}
                    className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                      consentQueue ? 'bg-[#16A34A]' : 'bg-stone-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      consentQueue ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Option 2: Clinical journey access */}
                <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-stone-200/60">
                  <div className="text-[11px]">
                    <span className="font-bold text-stone-900 block">Clinical journey access</span>
                    <span className="text-stone-400 text-[10px]">Sync longitudinal encounter history</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setConsentJourney(!consentJourney)}
                    className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                      consentJourney ? 'bg-[#16A34A]' : 'bg-stone-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      consentJourney ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Option 3: Notifications */}
                <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-stone-200/60">
                  <div className="text-[11px]">
                    <span className="font-bold text-stone-900 block">Notifications</span>
                    <span className="text-stone-400 text-[10px]">SMS and in-app sanctuary alerts</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setConsentNotifications(!consentNotifications)}
                    className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                      consentNotifications ? 'bg-[#16A34A]' : 'bg-stone-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      consentNotifications ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 6: Help */}
        <div className="p-1">
          <div 
            onClick={() => setExpandedSection(prev => prev === 'help' ? null : 'help')}
            className="p-3.5 flex items-center justify-between hover:bg-stone-50 rounded-2xl cursor-pointer transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-stone-600" />
              </div>
              <span className="text-xs font-bold text-stone-900">Help &amp; Support</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${expandedSection === 'help' ? 'rotate-180' : ''}`} />
          </div>

          {expandedSection === 'help' && (
            <div className="p-4 pt-2 text-xs space-y-2 bg-stone-50/80 rounded-2xl m-2 border border-stone-200/60 text-stone-600 animate-in fade-in duration-200">
              <p className="text-[11px] leading-relaxed">
                For clinic assistance, speak with the front desk coordinator or call our clinic helpline at <strong className="text-stone-900">+91 80 4910 2200</strong>.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 4. Switch Demo Patient Action */}
      <div className="pt-1">
        <button
          type="button"
          onClick={onSwitchPatient}
          className="w-full py-3.5 px-4 rounded-2xl bg-white border border-stone-200/80 hover:bg-stone-50 active:scale-[0.98] text-stone-700 text-xs font-bold flex items-center justify-center space-x-2 shadow-2xs transition-all"
        >
          <LogOut className="w-4 h-4 text-stone-500" />
          <span>Switch Demo Patient Identity</span>
        </button>
      </div>

    </div>
  );
};
