import React, { useState } from 'react';
import { 
  ChevronLeft, Star, Users, Clock, MapPin, 
  Phone, Stethoscope, Calendar, Award, CheckCircle2, 
  ArrowRight, Globe, ShieldCheck, HeartPulse, Sparkles
} from 'lucide-react';
import { Clinic, Doctor } from '../../types';
import { DataStore } from '../../services/dataStore';

interface ClinicDetailViewProps {
  clinic?: Clinic;
  onBack: () => void;
  onJoinQueue: (clinic: Clinic, doctor?: Doctor) => void;
  onBookAppointment?: (clinic: Clinic, doctor?: Doctor) => void;
}

export const ClinicDetailView: React.FC<ClinicDetailViewProps> = ({
  clinic: propClinic,
  onBack,
  onJoinQueue,
  onBookAppointment,
}) => {
  const clinic = propClinic || DataStore.getClinics()[0];
  const doctors = DataStore.getDoctors().filter(d => d.clinicId === clinic.id);
  const primaryDoctor: Doctor = doctors[0] || {
    id: 'doc_sharma_1',
    clinicId: clinic.id,
    name: 'Dr. A. Sharma',
    specialty: 'General Medicine',
    room: 'Room 101',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    status: 'consulting',
    experienceYears: 12,
    qualification: 'MBBS, MD (General Medicine)',
    patientsSeenToday: 18,
  };

  const [activeTab, setActiveTab] = useState<'Overview' | 'Schedule' | 'Reviews'>('Overview');

  const handleBook = () => {
    if (onBookAppointment) {
      onBookAppointment(clinic, primaryDoctor);
    } else {
      onJoinQueue(clinic, primaryDoctor);
    }
  };

  return (
    <div className="space-y-4 pb-28 font-sans text-stone-900 animate-in fade-in duration-200">
      
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white border border-stone-200/80 shadow-2xs flex items-center justify-center text-stone-700 hover:text-stone-900 active:scale-95 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h2 className="text-base font-extrabold text-stone-900">Doctor &amp; Clinic</h2>

        <div className="w-10 h-10"></div>
      </div>

      {/* 2. Doctor Hero Card */}
      <div 
        id="doctor-hero-card"
        className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs text-center"
      >
        <div className="w-24 h-24 mx-auto rounded-3xl overflow-hidden bg-stone-100 p-1 border-2 border-white shadow-sm mb-3">
          <img
            src={primaryDoctor.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300'}
            alt={primaryDoctor.name}
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">
          {primaryDoctor.name}
        </h1>
        <p className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-0.5 rounded-full inline-block mt-1">
          {primaryDoctor.specialty}
        </p>

        {/* Rating & Experience Stats */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100 text-left">
            <div className="flex items-center space-x-1 text-stone-400 text-[11px] font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Rating</span>
            </div>
            <div className="text-2xl font-extrabold text-stone-900 mt-0.5 font-mono">
              4.8
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100 text-left">
            <div className="flex items-center space-x-1 text-stone-400 text-[11px] font-semibold">
              <Award className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Experience</span>
            </div>
            <div className="text-2xl font-extrabold text-stone-900 mt-0.5 font-mono">
              12 yrs
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sanctuary Pulse & Clinic Details Card */}
      <div 
        id="clinic-sanctuary-pulse-card"
        className="bg-white rounded-3xl p-5 border border-emerald-200/80 shadow-xs space-y-3"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-stone-900">{clinic.name}</h3>
            <p className="text-[11px] text-stone-500 flex items-center space-x-1 mt-0.5">
              <MapPin className="w-3 h-3 text-stone-400" />
              <span>{clinic.address}</span>
            </p>
          </div>

          <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-1 rounded-lg">
            Mon-Sat 8AM–8PM
          </span>
        </div>

        {/* Sanctuary Pulse Live Status Banner */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/70 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-ping" />
              <span className="text-xs font-bold text-emerald-950">
                Clinic moving steadily
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#16A34A] bg-white px-2 py-0.5 rounded-md border border-emerald-200">
              Live Sanctuary Pulse
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2 rounded-xl bg-white/90 border border-emerald-100">
              <span className="text-[10px] text-stone-400 uppercase font-semibold block">Patients Waiting</span>
              <strong className="text-sm font-mono text-stone-900 block mt-0.5">12</strong>
            </div>

            <div className="p-2 rounded-xl bg-white/90 border border-emerald-100">
              <span className="text-[10px] text-stone-400 uppercase font-semibold block">Approximate Wait</span>
              <strong className="text-sm font-mono text-[#16A34A] block mt-0.5">~18 min</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Segmented Tabs: Overview, Schedule, Reviews */}
      <div className="flex items-center space-x-1 bg-stone-100 p-1 rounded-2xl text-xs font-semibold">
        {(['Overview', 'Schedule', 'Reviews'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-3 rounded-xl transition-all text-center ${
              activeTab === tab
                ? 'bg-white text-stone-900 font-bold shadow-2xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 5. Tab Content */}
      {activeTab === 'Overview' && (
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-4 text-xs">
          <div>
            <h4 className="font-extrabold text-stone-900 text-xs uppercase tracking-wider mb-1.5">
              About
            </h4>
            <p className="text-stone-600 leading-relaxed text-[11px]">
              Senior consultant physician with over 12 years of experience focusing on primary medical consultations, longitudinal diagnostic clarity, and continuous patient care. Coordinates directly with specialized departments.
            </p>
          </div>

          <div className="pt-2 border-t border-stone-100 grid grid-cols-2 gap-3">
            <div>
              <span className="text-stone-400 font-medium block text-[10px] uppercase">Specialties</span>
              <span className="font-bold text-stone-800 text-[11px] mt-0.5 block">
                General Medicine, Diagnostic Triage
              </span>
            </div>
            <div>
              <span className="text-stone-400 font-medium block text-[10px] uppercase">Languages</span>
              <span className="font-bold text-stone-800 text-[11px] mt-0.5 block">
                English, Hindi, Kannada
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-100">
            <span className="text-stone-400 font-medium block text-[10px] uppercase">Qualifications</span>
            <span className="font-semibold text-stone-800 text-[11px] mt-0.5 block">
              {primaryDoctor.qualification || 'MBBS, MD (General Medicine)'}
            </span>
          </div>
        </div>
      )}

      {activeTab === 'Schedule' && (
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3 text-xs">
          <h4 className="font-extrabold text-stone-900 text-xs uppercase tracking-wider">
            Consultation Hours
          </h4>
          <div className="divide-y divide-stone-100 text-[11px]">
            <div className="py-2 flex justify-between">
              <span className="text-stone-600 font-medium">Monday – Friday</span>
              <span className="font-mono font-bold text-stone-900">08:00 AM – 08:00 PM</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-stone-600 font-medium">Saturday</span>
              <span className="font-mono font-bold text-stone-900">09:00 AM – 04:00 PM</span>
            </div>
            <div className="py-2 flex justify-between text-stone-400">
              <span className="font-medium">Sunday</span>
              <span>Emergency triage only</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Reviews' && (
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-stone-900 text-xs uppercase tracking-wider">
              Patient Experiences
            </h4>
            <span className="text-[10px] text-stone-400">459 verified visits</span>
          </div>
          <div className="space-y-2.5">
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <strong className="text-stone-900">Verified Patient</strong>
                <div className="flex items-center text-amber-500">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span className="text-[10px] font-bold ml-1">5.0</span>
                </div>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                "Very attentive and reviewed all my earlier scan reports thoroughly before prescribing."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 6. Dual Action Buttons: Primary "Book Appointment", Secondary "Join Queue" */}
      <div className="space-y-2 pt-2">
        <button
          type="button"
          onClick={handleBook}
          className="w-full py-4 px-6 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.98] text-white font-extrabold text-sm shadow-xs transition-all flex items-center justify-center space-x-2"
        >
          <span>Book Appointment</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onJoinQueue(clinic, primaryDoctor)}
          className="w-full py-3 px-6 rounded-2xl bg-stone-100 hover:bg-stone-200 active:scale-[0.98] text-stone-800 font-bold text-xs transition-all flex items-center justify-center space-x-1.5"
        >
          <HeartPulse className="w-4 h-4 text-[#16A34A]" />
          <span>Join Walk-in Queue (~18 min wait)</span>
        </button>
      </div>

    </div>
  );
};
