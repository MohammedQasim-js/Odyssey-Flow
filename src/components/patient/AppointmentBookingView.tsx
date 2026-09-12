import React, { useState } from 'react';
import { 
  ChevronLeft, HelpCircle, MapPin, ChevronDown, Check, 
  Calendar, Clock, ShieldCheck, UserCheck, Stethoscope,
  Video, User, ArrowRight, Sparkles
} from 'lucide-react';
import { Clinic, Doctor, Patient } from '../../types';
import { DataStore } from '../../services/dataStore';

interface AppointmentBookingViewProps {
  clinic?: Clinic;
  doctor?: Doctor;
  patient?: Patient;
  onBack: () => void;
  onContinue: (bookingData: BookingData) => void;
}

export interface BookingData {
  clinic: Clinic;
  doctor: Doctor;
  patient: Patient;
  mode: 'in_person' | 'video_call';
  date: string;
  time: string;
  symptoms: string[];
  notes: string;
  shareConsent: boolean;
}

const COMMON_SYMPTOM_CHIPS = [
  'Headache',
  'Fever',
  'Cough',
  'Fatigue',
  'Stomach pain',
  'Body pain',
  'Other'
];

const SCHEDULE_DAYS = [
  { day: 'Mon', date: '23' },
  { day: 'Tue', date: '24' },
  { day: 'Wed', date: '25' },
  { day: 'Thu', date: '26' },
  { day: 'Fri', date: '27' },
  { day: 'Sat', date: '21' },
  { day: 'Sun', date: '22' },
];

const TIME_SLOTS = [
  '11:00am',
  '11:30am',
  '12:00pm',
  '12:30pm',
  '01:00pm',
  '04:30pm',
  '05:00pm',
  '05:30pm'
];

export const AppointmentBookingView: React.FC<AppointmentBookingViewProps> = ({
  clinic: propClinic,
  doctor: propDoctor,
  patient: propPatient,
  onBack,
  onContinue,
}) => {
  const patient = propPatient || DataStore.getCurrentPatient() || DataStore.getPatients()[0];
  const clinic = propClinic || DataStore.getClinics()[0];
  const doctor = propDoctor || DataStore.getDoctors().find(d => d.clinicId === clinic.id) || DataStore.getDoctors()[0];

  const [mode, setMode] = useState<'in_person' | 'video_call'>('in_person');
  const [selectedDayIndex, setSelectedDayIndex] = useState(5); // Saturday 21 default matching reference
  const [selectedTime, setSelectedTime] = useState('12:00pm');
  const [selectedChips, setSelectedChips] = useState<string[]>(['Headache', 'Fatigue']);
  const [freeTextNotes, setFreeTextNotes] = useState('Persistent headache daily for past 8 months with occasional fatigue');
  const [shareConsent, setShareConsent] = useState(true);

  const toggleChip = (chip: string) => {
    if (selectedChips.includes(chip)) {
      setSelectedChips(selectedChips.filter(c => c !== chip));
    } else {
      setSelectedChips([...selectedChips, chip]);
    }
  };

  const handleProceed = () => {
    const activeDay = SCHEDULE_DAYS[selectedDayIndex];
    const fullDate = `${activeDay.day}, ${activeDay.date} Sep`;
    onContinue({
      clinic,
      doctor,
      patient,
      mode,
      date: fullDate,
      time: selectedTime,
      symptoms: selectedChips,
      notes: freeTextNotes,
      shareConsent,
    });
  };

  return (
    <div className="space-y-4 pb-24 font-sans text-stone-900 animate-in fade-in duration-200">
      
      {/* 1. Header Navigation Bar (Matching Reference Screen 3) */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white border border-stone-200/80 shadow-2xs flex items-center justify-center text-stone-700 hover:text-stone-900 active:scale-95 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Select Time</span>

        <button
          className="w-10 h-10 rounded-full bg-white border border-stone-200/80 shadow-2xs flex items-center justify-center text-stone-400 hover:text-stone-700 active:scale-95 transition-all"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Choose Time Headline */}
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
          Choose Time
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Each session is about 15–30 minutes.
        </p>
      </div>

      {/* 3. Doctor Compact Card */}
      <div className="bg-white rounded-3xl p-3.5 border border-stone-200/70 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center space-x-3">
        <img
          src={doctor.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300'}
          alt={doctor.name}
          className="w-12 h-12 rounded-2xl object-cover border border-stone-100 shadow-2xs"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-extrabold text-stone-900 leading-tight">
            {doctor.name}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5 truncate">
            {doctor.specialty} • {clinic.name}
          </p>
        </div>
      </div>

      {/* 4. Mode Toggle (In-Person / Video Call pills from reference) */}
      <div className="bg-stone-900 p-1.5 rounded-2xl flex items-center shadow-xs">
        <button
          onClick={() => setMode('in_person')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
            mode === 'in_person'
              ? 'bg-stone-800 text-white shadow-2xs'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>In-Person</span>
        </button>

        <button
          onClick={() => setMode('video_call')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
            mode === 'video_call'
              ? 'bg-stone-800 text-white shadow-2xs'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Video Call</span>
        </button>
      </div>

      {/* 5. Location Selector Pill */}
      <div>
        <span className="text-[11px] font-semibold text-stone-500 block mb-1.5">
          Select an office location and available time
        </span>
        <div className="p-3.5 rounded-2xl bg-white border border-stone-200/70 shadow-2xs flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700 shrink-0">
              <MapPin className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-stone-900 block truncate">
                {clinic.address}
              </span>
              <span className="text-[11px] text-stone-400">3 more locations</span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-stone-400 shrink-0 ml-2" />
        </div>
      </div>

      {/* 6. Date Carousel (Mon, Tue, Wed, Thu, Fri, Sat, Sun with active green pill) */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-stone-900 block">Select schedule</span>
        
        <div className="grid grid-cols-7 gap-1.5">
          {SCHEDULE_DAYS.map((d, idx) => {
            const isSelected = selectedDayIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedDayIndex(idx)}
                className={`py-3 px-1 rounded-2xl flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-[#34C759] text-white shadow-md scale-105'
                    : 'bg-white border border-stone-200/70 text-stone-800 hover:border-stone-300'
                }`}
              >
                <span className={`text-base font-extrabold font-mono leading-none ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                  {d.date}
                </span>
                <span className={`text-[10px] mt-1 font-medium ${isSelected ? 'text-emerald-100' : 'text-stone-400'}`}>
                  {d.day}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. Time Slots Grid */}
      <div className="space-y-2 pt-1">
        <span className="text-xs font-bold text-stone-900 block">
          {SCHEDULE_DAYS[selectedDayIndex].day}, {SCHEDULE_DAYS[selectedDayIndex].date} Sep 2026
        </span>

        <div className="grid grid-cols-3 gap-2">
          {TIME_SLOTS.map((t) => {
            const isSelected = selectedTime === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedTime(t)}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-[#34C759] text-white shadow-xs'
                    : 'bg-white border border-stone-200/70 text-stone-700 hover:border-stone-300'
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* 8. Friendly Symptom Intake (Exact User Requirement) */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/70 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-3.5">
        <div>
          <h3 className="text-sm font-extrabold text-stone-900">
            What brings you in today?
          </h3>
          <p className="text-[11px] text-stone-500 mt-0.5">
            Quick symptom overview for your doctor before consultation.
          </p>
        </div>

        {/* Suggested Chips */}
        <div className="flex flex-wrap gap-1.5">
          {COMMON_SYMPTOM_CHIPS.map((chip) => {
            const isSelected = selectedChips.includes(chip);
            return (
              <button
                key={chip}
                type="button"
                onClick={() => toggleChip(chip)}
                className={`py-1.5 px-3 rounded-full text-xs font-semibold transition-all flex items-center space-x-1 ${
                  isSelected
                    ? 'bg-[#34C759] text-white shadow-2xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {isSelected && <Check className="w-3 h-3" />}
                <span>{chip}</span>
              </button>
            );
          })}
        </div>

        {/* "Tell us a little more" free-text field */}
        <div className="pt-1">
          <label className="text-xs font-bold text-stone-800 block mb-1">
            Tell us a little more
          </label>
          <textarea
            rows={2}
            value={freeTextNotes}
            onChange={(e) => setFreeTextNotes(e.target.value)}
            placeholder="Describe anything helpful for the clinical team..."
            className="w-full p-3 text-xs border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#34C759] bg-stone-50/50 text-stone-900 placeholder:text-stone-400"
          />
        </div>

        {/* Consent Checkbox */}
        <label className="flex items-start space-x-2.5 pt-1 cursor-pointer">
          <input
            type="checkbox"
            checked={shareConsent}
            onChange={(e) => setShareConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded text-[#34C759] focus:ring-[#34C759] border-stone-300"
          />
          <div className="text-[11px] text-stone-600 leading-tight">
            <span className="font-semibold text-stone-900 block">
              Share previous visit summaries with consulting doctor
            </span>
            <span>Permits continuous diagnostic journey mapping</span>
          </div>
        </label>
      </div>

      {/* 9. Continue Button (Matching Reference Screen 3 big green button) */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleProceed}
          className="w-full py-4 px-6 rounded-2xl bg-[#34C759] hover:bg-[#2EB84F] active:bg-[#28A745] text-white font-extrabold text-sm shadow-md active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
