import React, { useState } from 'react';
import { 
  Calendar, Clock, MapPin, Plus, CheckCircle2, 
  ChevronRight, Stethoscope, ArrowRight, ShieldCheck, 
  X, Check, AlertCircle, HeartPulse, User, Sparkles
} from 'lucide-react';
import { Appointment, Clinic, Doctor, Visit } from '../../types';
import { DataStore } from '../../services/dataStore';

interface AppointmentsViewProps {
  onBookNew: () => void;
  onSelectClinic: (clinic: Clinic) => void;
}

const DATE_CHIPS = [
  { day: 'Mon', date: '20' },
  { day: 'Tue', date: '21' },
  { day: 'Wed', date: '22' },
  { day: 'Thu', date: '23' },
  { day: 'Fri', date: '24' },
  { day: 'Sat', date: '21', isSpecial: true },
];

const TIME_SLOTS = [
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '04:00 PM',
  '04:30 PM'
];

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  onBookNew,
  onSelectClinic,
}) => {
  const patient = DataStore.getCurrentPatient();
  const activeToken = DataStore.getActiveToken();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const list = DataStore.getAppointments(patient?.id);
    if (list.length > 0) return list;
    return [
      {
        id: 'apt_canonical_01',
        patientId: patient?.id || 'pat_aarav_0',
        doctorId: 'doc_sharma_1',
        doctorName: 'Dr. A. Sharma',
        doctorSpecialty: 'General Medicine',
        doctorAvatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
        clinicId: 'clinic_odyssey_care',
        clinicName: 'Odyssey Care Clinic',
        clinicAddress: 'Indiranagar 100ft Road, Bengaluru',
        date: 'Saturday',
        time: '10:30 AM',
        type: 'in_person',
        status: 'upcoming',
        symptoms: 'Headache & Diagnostic Follow-up',
        roomNumber: 'Room 101',
        fee: 800,
      }
    ];
  });

  const [visits] = useState<Visit[]>(() => DataStore.getVisits(patient?.id));

  // Reschedule state
  const [reschedulingApt, setReschedulingApt] = useState<Appointment | null>(null);
  const [selectedDateIdx, setSelectedDateIdx] = useState(5); // Saturday 21
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:30 AM');
  const [rescheduleSuccess, setRescheduleSuccess] = useState(false);

  // View modal state
  const [viewingApt, setViewingApt] = useState<Appointment | null>(null);

  const handleConfirmReschedule = () => {
    if (!reschedulingApt) return;
    const chosen = DATE_CHIPS[selectedDateIdx];
    const newDateStr = chosen.isSpecial ? 'Saturday' : `${chosen.day}, ${chosen.date} Sep`;
    const updated = DataStore.rescheduleAppointment(reschedulingApt.id, newDateStr, selectedTimeSlot);
    if (updated) {
      setAppointments(prev => prev.map(a => a.id === updated.id ? updated : a));
      setRescheduleSuccess(true);
      setTimeout(() => {
        setRescheduleSuccess(false);
        setReschedulingApt(null);
      }, 1000);
    }
  };

  const upcomingApts = appointments.filter(a => a.status === 'upcoming');

  return (
    <div className="space-y-4 pb-28 font-sans text-stone-900 animate-in fade-in duration-200">
      
      {/* 1. Header (Exact Specs: "Appointments" + New Button) */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            Appointments
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Your scheduled consultations with clinical specialists
          </p>
        </div>

        <button
          onClick={onBookNew}
          className="w-10 h-10 rounded-full bg-[#16A34A] hover:bg-[#15803D] active:scale-95 text-white flex items-center justify-center shadow-xs transition-all"
          title="Book an appointment"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Critical Distiction Banner: Scheduled Appointment vs Live Walk-in Queue */}
      <div className="p-3.5 rounded-2xl bg-stone-100/90 border border-stone-200/80 flex items-start space-x-2.5 text-xs text-stone-600">
        <Clock className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-stone-900 block">
            Scheduled Appointments vs. Live Walk-in Queue
          </span>
          <p className="text-[11px] leading-relaxed text-stone-500">
            Appointments guarantee your reserved time slot. Walk-ins join the real-time Sanctuary Pulse queue with an instant digital token.
          </p>
          {activeToken && (
            <div className="pt-1 flex items-center space-x-1.5 text-emerald-800 font-semibold text-[11px]">
              <HeartPulse className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Active Walk-in Token: <strong className="font-mono">{activeToken.tokenNumber}</strong> at {activeToken.clinicName}</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Segmented Tabs: Upcoming vs Past */}
      <div className="flex items-center space-x-1 bg-stone-100 p-1 rounded-2xl text-xs font-semibold">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all text-center ${
            activeTab === 'upcoming'
              ? 'bg-white text-stone-900 font-bold shadow-2xs'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Upcoming ({upcomingApts.length})
        </button>

        <button
          onClick={() => setActiveTab('past')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all text-center ${
            activeTab === 'past'
              ? 'bg-white text-stone-900 font-bold shadow-2xs'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Past Visits ({visits.length})
        </button>
      </div>

      {/* 4. Tab: Upcoming Appointments */}
      {activeTab === 'upcoming' && (
        <div className="space-y-3">
          
          {upcomingApts.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-stone-200/80 shadow-2xs space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-stone-900">No upcoming appointments</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Schedule a consultation or check into the walk-in queue.
              </p>
              <button
                onClick={onBookNew}
                className="mt-2 inline-flex items-center space-x-1.5 py-2.5 px-4 rounded-xl bg-[#16A34A] text-white text-xs font-bold shadow-2xs hover:bg-[#15803D]"
              >
                <span>Book Appointment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            upcomingApts.map((apt) => (
              <div 
                key={apt.id}
                className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-4 hover:border-emerald-200 transition-colors"
              >
                {/* Specialty Pill + Scheduled Time Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                    {apt.doctorSpecialty || 'General Medicine'}
                  </span>
                  
                  <div className="flex items-center space-x-1 text-xs font-bold text-stone-900 bg-stone-100 px-2.5 py-1 rounded-xl">
                    <Clock className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>{apt.date}, {apt.time}</span>
                  </div>
                </div>

                {/* Doctor & Clinic Details */}
                <div className="flex items-start space-x-3.5">
                  <img
                    src={apt.doctorAvatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300'}
                    alt={apt.doctorName}
                    className="w-14 h-14 rounded-2xl object-cover border border-stone-200 shadow-2xs shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-extrabold text-stone-900 truncate">
                      {apt.doctorName}
                    </h3>
                    <p className="text-xs text-stone-600 font-medium">
                      {apt.doctorSpecialty}
                    </p>
                    <p className="text-xs text-stone-500 flex items-center space-x-1 mt-1">
                      <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                      <span className="truncate">{apt.clinicName}</span>
                    </p>
                  </div>
                </div>

                {/* Action Buttons: View & Reschedule (Exact Specs) */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={() => setViewingApt(apt)}
                    className="py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 text-xs font-bold transition-all text-center"
                  >
                    View
                  </button>

                  <button
                    onClick={() => setReschedulingApt(apt)}
                    className="py-2.5 px-4 rounded-xl bg-[#16A34A]/10 hover:bg-[#16A34A]/20 active:scale-95 text-[#16A34A] text-xs font-bold transition-all text-center"
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            ))
          )}

          {/* New Booking Action Card */}
          <div 
            onClick={onBookNew}
            className="p-4 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 hover:bg-emerald-50 cursor-pointer transition-all flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-white text-[#16A34A] flex items-center justify-center shadow-2xs border border-emerald-100 group-hover:scale-105 transition-transform">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-900 block">
                  Book another appointment
                </span>
                <span className="text-[11px] text-stone-500">
                  Select specialty, doctor, date &amp; time
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#16A34A] group-hover:translate-x-0.5 transition-transform" />
          </div>

        </div>
      )}

      {/* 5. Tab: Past Encounters */}
      {activeTab === 'past' && (
        <div className="space-y-3">
          {visits.length === 0 ? (
            <p className="text-center py-8 text-xs text-stone-400">
              No previous visit records found.
            </p>
          ) : (
            visits.map((vis) => (
              <div
                key={vis.id}
                className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/80 shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900">{vis.doctorName}</span>
                  <span className="text-[11px] text-stone-400 font-mono">{vis.date}</span>
                </div>
                <p className="text-xs text-stone-600 font-medium">
                  {vis.specialty} • {vis.clinicName}
                </p>
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 text-[11px] text-stone-600">
                  <span className="font-semibold text-stone-800">Outcome:</span> {vis.outcome}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 6. Reschedule Modal (Visual Date Chips & Time Slots matching reference) */}
      {reschedulingApt && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-stone-900 text-base">Reschedule Appointment</h3>
                <p className="text-[11px] text-stone-500 mt-0.5">with {reschedulingApt.doctorName}</p>
              </div>
              <button
                onClick={() => setReschedulingApt(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Date Chips Carousel (20 Mon, 21 Tue, 22 Wed, 23 Thu, 24 Fri, 21 Sat) */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-900 block">Select Date</span>
              <div className="grid grid-cols-6 gap-1.5">
                {DATE_CHIPS.map((chip, idx) => {
                  const isSelected = selectedDateIdx === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedDateIdx(idx)}
                      className={`py-3 px-1 rounded-2xl flex flex-col items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-[#16A34A] text-white shadow-xs scale-105'
                          : 'bg-stone-50 border border-stone-200 text-stone-800 hover:border-stone-300'
                      }`}
                    >
                      <span className={`text-base font-extrabold font-mono leading-none ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                        {chip.date}
                      </span>
                      <span className={`text-[10px] mt-1 font-semibold ${isSelected ? 'text-emerald-100' : 'text-stone-400'}`}>
                        {chip.day}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots (10:00 AM, 10:30 AM, 11:00 AM, 11:30 AM) with Green Accent */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-900 block">Select Time</span>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = selectedTimeSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all text-center ${
                        isSelected
                          ? 'bg-[#16A34A] text-white shadow-xs'
                          : 'bg-stone-50 border border-stone-200 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Confirm CTA */}
            {rescheduleSuccess ? (
              <div className="p-3 bg-emerald-100 text-emerald-900 rounded-2xl text-xs font-bold text-center flex items-center justify-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span>Appointment Rescheduled!</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleConfirmReschedule}
                className="w-full py-3.5 px-4 bg-[#16A34A] hover:bg-[#15803D] active:scale-95 text-white rounded-2xl font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-1.5"
              >
                <span>Confirm New Time</span>
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 7. Appointment Detail Modal */}
      {viewingApt && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-stone-900 text-base">Appointment Details</h3>
              <button
                onClick={() => setViewingApt(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs divide-y divide-stone-100">
              <div className="pt-1 flex justify-between items-baseline">
                <span className="text-stone-500 font-medium">Specialty</span>
                <span className="font-extrabold text-stone-900">{viewingApt.doctorSpecialty}</span>
              </div>

              <div className="pt-2 flex justify-between items-baseline">
                <span className="text-stone-500 font-medium">Clinician</span>
                <span className="font-semibold text-stone-900">{viewingApt.doctorName}</span>
              </div>

              <div className="pt-2 flex justify-between items-baseline">
                <span className="text-stone-500 font-medium">Facility</span>
                <span className="font-semibold text-stone-900">{viewingApt.clinicName}</span>
              </div>

              <div className="pt-2 flex justify-between items-baseline">
                <span className="text-stone-500 font-medium">Scheduled Slot</span>
                <span className="font-bold text-[#16A34A]">{viewingApt.date}, {viewingApt.time}</span>
              </div>

              <div className="pt-2 flex justify-between items-baseline">
                <span className="text-stone-500 font-medium">Consultation Type</span>
                <span className="font-medium text-stone-800">In-Person Consultation</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  const c = DataStore.getClinic(viewingApt.clinicId);
                  if (c) onSelectClinic(c);
                  setViewingApt(null);
                }}
                className="w-full py-3 bg-stone-900 hover:bg-black text-white rounded-2xl font-bold text-xs shadow-2xs transition-all text-center"
              >
                View Clinic Information
              </button>
              <button
                onClick={() => setViewingApt(null)}
                className="w-full py-2 bg-stone-100 text-stone-600 rounded-2xl text-xs font-semibold hover:bg-stone-200 transition-all text-center"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
