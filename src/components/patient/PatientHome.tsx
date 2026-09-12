import React, { useState } from 'react';
import { 
  HeartPulse, Sparkles, MapPin, Clock, Stethoscope, 
  ArrowRight, ShieldCheck, ChevronRight, User, Plus, 
  Activity, Search, FileText, Calendar, Pill, CheckCircle2,
  Building2, AlertCircle, ArrowUpRight, Check
} from 'lucide-react';
import { Token, Patient, Clinic, Appointment } from '../../types';
import { SanctuaryPulseEngine } from '../../services/sanctuaryPulseEngine';
import { DataStore } from '../../services/dataStore';

interface PatientHomeProps {
  token?: Token;
  patient?: Patient;
  onNavigateToPulse: () => void;
  onNavigateToCheckIn: () => void;
  onNavigateToClinics: () => void;
  onNavigateToHistory: () => void;
  onNavigateToAppointments?: () => void;
  onSelectClinic?: (clinic: Clinic) => void;
  onOpenEntryModal?: () => void;
}

export const PatientHome: React.FC<PatientHomeProps> = ({
  token: propToken,
  patient: propPatient,
  onNavigateToPulse,
  onNavigateToCheckIn,
  onNavigateToClinics,
  onNavigateToHistory,
  onNavigateToAppointments = onNavigateToCheckIn,
  onSelectClinic = onNavigateToClinics,
  onOpenEntryModal,
}) => {
  const patient = propPatient || DataStore.getCurrentPatient() || DataStore.getPatients()[0];
  const token = propToken || DataStore.getActiveToken();
  const [searchQuery, setSearchQuery] = useState('');

  const doctor = token ? DataStore.getDoctors().find(d => d.id === token.doctorId) : undefined;
  const pulse = token ? SanctuaryPulseEngine.computePulseState(token, doctor, token.queuePosition) : null;
  const clinics = DataStore.getClinics();
  const appointments = DataStore.getAppointments(patient.id).filter(a => a.status === 'upcoming');

  // Derive firstName cleanly
  const firstName = patient.fullName.split(' ')[0] || 'Aarav';

  return (
    <div className="space-y-4 pb-24 font-sans text-stone-900 animate-in fade-in duration-200">
      
      {/* 1. Top Header: "Good morning, Aarav" + Avatar + Clinic Context (Matching Reference Screen 1) */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight leading-none">
            Good morning, {firstName}
          </h1>
          <div className="flex items-center space-x-1.5 mt-1.5 text-xs text-stone-500 font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-semibold text-stone-800">Odyssey Care Clinic</span>
            <span className="text-stone-300">•</span>
            <span className="text-stone-500">1.4 km away</span>
          </div>
        </div>

        {/* Profile Avatar with subtle green dot and prototype identity indicator */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenEntryModal}
            className="relative group p-0.5 rounded-full hover:ring-2 hover:ring-emerald-400 transition-all"
            title="Click to view simulated Aadhaar identity or switch demo profile"
          >
            <div className="w-11 h-11 rounded-full overflow-hidden bg-stone-100 border-2 border-white shadow-xs">
              <img
                src={patient.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                alt={patient.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#34C759] rounded-full border-2 border-white shadow-2xs"></span>
          </button>
        </div>
      </div>

      {/* 2. Compact Search Bar with Green Circular Search Button (Matching Reference Screen 1) */}
      <div className="relative flex items-center">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search clinics, doctors or specialties"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onNavigateToClinics();
            }}
            className="w-full pl-11 pr-14 py-3 text-xs sm:text-sm border border-stone-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#34C759] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] placeholder:text-stone-400 text-stone-900"
          />
          <button
            onClick={onNavigateToClinics}
            className="absolute right-1.5 top-1.5 w-9 h-9 rounded-xl bg-[#34C759] hover:bg-[#2EB84F] active:scale-95 text-white flex items-center justify-center shadow-xs transition-all"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Circular Quick Actions (Matching Reference Screen 1 with soft pastel circles) */}
      <div className="grid grid-cols-4 gap-2 pt-1 text-center">
        <button
          onClick={onNavigateToClinics}
          className="flex flex-col items-center group active:scale-95 transition-transform"
        >
          <div className="w-13 h-13 rounded-2xl bg-emerald-50/90 group-hover:bg-emerald-100 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-2xs transition-colors">
            <Building2 className="w-6 h-6 text-emerald-600" />
          </div>
          <span className="text-[11px] font-bold text-stone-700 mt-1.5 group-hover:text-stone-900">
            Find Clinic
          </span>
        </button>

        <button
          onClick={onNavigateToPulse}
          className="flex flex-col items-center group active:scale-95 transition-transform"
        >
          <div className="w-13 h-13 rounded-2xl bg-teal-50/90 group-hover:bg-teal-100 border border-teal-100 flex items-center justify-center text-teal-600 shadow-2xs transition-colors">
            <HeartPulse className="w-6 h-6 text-teal-600" />
          </div>
          <span className="text-[11px] font-bold text-stone-700 mt-1.5 group-hover:text-stone-900">
            My Queue
          </span>
        </button>

        <button
          onClick={onNavigateToHistory}
          className="flex flex-col items-center group active:scale-95 transition-transform"
        >
          <div className="w-13 h-13 rounded-2xl bg-amber-50/90 group-hover:bg-amber-100 border border-amber-100 flex items-center justify-center text-amber-600 shadow-2xs transition-colors">
            <Activity className="w-6 h-6 text-amber-600" />
          </div>
          <span className="text-[11px] font-bold text-stone-700 mt-1.5 group-hover:text-stone-900">
            Journey
          </span>
        </button>

        <button
          onClick={onNavigateToAppointments}
          className="flex flex-col items-center group active:scale-95 transition-transform"
        >
          <div className="w-13 h-13 rounded-2xl bg-indigo-50/90 group-hover:bg-indigo-100 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs transition-colors">
            <Calendar className="w-6 h-6 text-indigo-600" />
          </div>
          <span className="text-[11px] font-bold text-stone-700 mt-1.5 group-hover:text-stone-900">
            Appointments
          </span>
        </button>
      </div>

      {/* 4. Current Visit (Dominant Active Token Card) */}
      {token ? (
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] relative overflow-hidden space-y-3.5">
          {/* Subtle top indicator bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#34C759]"></div>

          {/* Header: ODYSSEY CARE CLINIC & Specialty badge */}
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 inline-block mb-1">
                {token.specialty || 'General Medicine'}
              </span>
              <h2 className="text-base font-extrabold text-stone-900 leading-tight">
                {token.clinicName || 'ODYSSEY CARE CLINIC'}
              </h2>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Token</span>
              <span className="font-mono text-base font-extrabold px-2.5 py-0.5 rounded-lg bg-stone-900 text-white shadow-2xs inline-block">
                {token.tokenNumber || 'A-27'}
              </span>
            </div>
          </div>

          {/* Doctor Info & Position */}
          <div className="p-3 rounded-2xl bg-stone-50/80 border border-stone-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-stone-200/70 text-emerald-700 flex items-center justify-center shadow-2xs">
                <Stethoscope className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-900 block">
                  {token.doctorName || 'Dr. A. Sharma'}
                </span>
                <span className="text-[11px] text-stone-500">
                  {token.roomNumber || 'Room 101'} • Senior Review Eligible
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-stone-400 uppercase font-semibold block">Position</span>
              <span className="text-sm font-extrabold text-stone-900 font-mono">
                {token.queuePosition === 0 ? 'Your Turn' : `${token.queuePosition} in line`}
              </span>
            </div>
          </div>

          {/* Sanctuary Pulse: Primary Emotional Status & Secondary Wait Time */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#34C759] animate-pulse"></span>
                <span className="text-xs font-bold text-emerald-900">
                  {pulse?.title || 'Queue stable'}
                </span>
              </div>
              <span className="text-xs font-bold font-mono text-stone-700">
                ~{token.estimatedWaitMin || 24} min
              </span>
            </div>
            <p className="text-[11px] text-emerald-800/80 pl-4.5">
              Everything is moving normally. Your turn is anticipated soon.
            </p>
          </div>

          {/* Actions: Primary "View Sanctuary Pulse" & Secondary "View Queue" */}
          <div className="flex items-center space-x-2 pt-1">
            <button
              onClick={onNavigateToPulse}
              className="flex-1 py-3 px-4 rounded-2xl bg-[#34C759] hover:bg-[#2EB84F] text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center space-x-1.5"
            >
              <HeartPulse className="w-4 h-4 text-white" />
              <span>View Sanctuary Pulse</span>
            </button>

            <button
              onClick={onNavigateToPulse}
              className="py-3 px-4 rounded-2xl bg-white border border-stone-200 text-stone-800 font-bold text-xs shadow-2xs hover:bg-stone-50 transition-all"
            >
              View Queue
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-5 border border-stone-200/70 shadow-2xs text-center space-y-2">
          <div className="w-10 h-10 mx-auto rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400">
            <HeartPulse className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-stone-900">
            Nothing in the queue right now.
          </h3>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            Ready to visit? Check in to any clinic to receive your live digital token.
          </p>
          <button
            onClick={onNavigateToClinics}
            className="mt-1 inline-flex items-center space-x-1.5 py-2.5 px-4 rounded-xl bg-[#34C759] hover:bg-[#2EB84F] text-white text-xs font-bold shadow-2xs"
          >
            <span>Find a clinic</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 5. Upcoming Appointments (Matching Reference Screen 1) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-stone-900">
            Upcoming
          </h3>
          <button
            onClick={onNavigateToAppointments}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            See all
          </button>
        </div>

        {appointments.length === 0 ? (
          <div className="bg-white rounded-3xl p-4 border border-stone-200/70 text-center text-xs text-stone-500">
            No upcoming appointments
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/70 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-3">
            {appointments.slice(0, 1).map((apt) => (
              <div key={apt.id} className="space-y-3">
                <div className="flex items-start space-x-3">
                  <img
                    src={apt.doctorAvatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300'}
                    alt={apt.doctorName}
                    className="w-12 h-12 rounded-2xl object-cover border border-stone-100 shadow-2xs shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                        {apt.doctorSpecialty}
                      </span>
                      <span className="text-[11px] font-bold text-stone-900 font-mono">
                        {apt.time}
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-stone-900 mt-1 truncate">
                      {apt.doctorName}
                    </h4>
                    <p className="text-xs text-stone-500 truncate">
                      {apt.clinicName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={onNavigateToAppointments}
                    className="flex-1 py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all text-center"
                  >
                    View
                  </button>

                  <button
                    onClick={onNavigateToAppointments}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#34C759]/10 hover:bg-[#34C759]/20 text-[#16A34A] text-xs font-bold transition-all text-center"
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Clinic Discovery ("Find a clinic" section matching prompt requirements) */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-stone-900">
            Find a clinic
          </h3>
          <button
            onClick={onNavigateToClinics}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Explore all
          </button>
        </div>

        <div className="space-y-3">
          {clinics.slice(0, 2).map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectClinic(c)}
              className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/70 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:border-emerald-300 transition-all cursor-pointer space-y-3 group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h4 className="text-sm font-extrabold text-stone-900 group-hover:text-emerald-700 transition-colors">
                      {c.name}
                    </h4>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      Open
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5 flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    <span>{c.address} • 1.4 km</span>
                  </p>
                </div>

                <div className="w-8 h-8 rounded-xl bg-stone-50 group-hover:bg-emerald-50 text-stone-400 group-hover:text-emerald-600 flex items-center justify-center transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Status pills: Queue count & Sanctuary Pulse */}
              <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-600 font-medium">
                  {c.queueCount || 12} patients in queue
                </span>
                <span className="flex items-center space-x-1 text-emerald-700 font-bold text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]"></span>
                  <span>Clinic stable</span>
                </span>
              </div>

              {/* Button: Join Queue */}
              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectClinic(c);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
                >
                  <span>Join Queue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
