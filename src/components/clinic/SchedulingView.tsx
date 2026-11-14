import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, Clock, User, ChevronLeft, ChevronRight, Plus, DoorOpen, 
  CheckCircle2, X, AlertCircle, ArrowRight, UserCheck, Stethoscope, Video
} from 'lucide-react';
import { Doctor, Appointment } from '../../types';
import { DataStore } from '../../services/dataStore';

interface SchedulingViewProps {
  doctors: Doctor[];
  onNavigateToQueue?: () => void;
}

export const SchedulingView: React.FC<SchedulingViewProps> = ({ doctors, onNavigateToQueue }) => {
  const dates = [
    { label: 'Today — Sep 8, 2026', key: 'Today' },
    { label: 'Tomorrow — Sep 9, 2026', key: 'Tomorrow' },
    { label: 'Thursday — Sep 10, 2026', key: 'Sep 10' },
    { label: 'Friday — Sep 11, 2026', key: 'Sep 11' },
  ];

  const [dateIndex, setDateIndex] = useState(0);
  const selectedDate = dates[dateIndex];

  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [appointments, setAppointments] = useState<Appointment[]>(() => DataStore.getAppointments());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);
  const [rescheduleTime, setRescheduleTime] = useState('11:00 AM');

  // Book Form State
  const [formPatientName, setFormPatientName] = useState('');
  const [formDoctorId, setFormDoctorId] = useState(doctors[0]?.id || 'doc_sharma_1');
  const [formDate, setFormDate] = useState('Today');
  const [formTime, setFormTime] = useState('10:00 AM');
  const [formSymptoms, setFormSymptoms] = useState('');
  const [formType, setFormType] = useState<'in_person' | 'video_call'>('in_person');
  const [formError, setFormError] = useState<string | null>(null);

  const refreshAppointments = () => {
    setAppointments([...DataStore.getAppointments()]);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Pre-seed some realistic appointments if only 1 exists
  useEffect(() => {
    const current = DataStore.getAppointments();
    if (current.length <= 1) {
      const extra: Appointment[] = [
        {
          id: 'apt_shenoy_02',
          patientId: 'pat_priya_1',
          patientName: 'Priya Sharma (B-14)',
          doctorId: 'doc_arjun_2',
          doctorName: 'Dr. Arjun Shenoy',
          doctorSpecialty: 'Internal Medicine',
          clinicId: 'clinic_odyssey_care',
          clinicName: 'Odyssey Apex Health Center',
          clinicAddress: '104 Indiranagar Double Road, Bengaluru',
          date: 'Today',
          time: '09:15 AM',
          type: 'in_person',
          status: 'upcoming',
          symptoms: 'Follow-up Metabolic & Fatigue Panel',
          roomNumber: 'Room 102',
          fee: 900,
        },
        {
          id: 'apt_meera_03',
          patientId: 'pat_rajesh_3',
          patientName: 'Rajesh Nair',
          doctorId: 'doc_meera_1',
          doctorName: 'Dr. Meera Nambiar',
          doctorSpecialty: 'Gastroenterology',
          clinicId: 'clinic_odyssey_care',
          clinicName: 'Odyssey Apex Health Center',
          clinicAddress: '104 Indiranagar Double Road, Bengaluru',
          date: 'Today',
          time: '09:30 AM',
          type: 'in_person',
          status: 'upcoming',
          symptoms: 'Abdominal pain & Chronic GI Stagnation Review',
          roomNumber: 'Room 104',
          fee: 1200,
        },
        {
          id: 'apt_sharma_04',
          patientId: 'pat_sunil_4',
          patientName: 'Sunil Verma',
          doctorId: 'doc_sharma_1',
          doctorName: 'Dr. A. Sharma',
          doctorSpecialty: 'General Medicine',
          clinicId: 'clinic_odyssey_care',
          clinicName: 'Odyssey Apex Health Center',
          clinicAddress: '104 Indiranagar Double Road, Bengaluru',
          date: 'Today',
          time: '10:00 AM',
          type: 'in_person',
          status: 'upcoming',
          symptoms: 'Routine seasonal checkup and blood pressure',
          roomNumber: 'Room 101',
          fee: 600,
        },
        {
          id: 'apt_meera_05',
          patientId: 'pat_ananya_5',
          patientName: 'Ananya Deshmukh',
          doctorId: 'doc_meera_1',
          doctorName: 'Dr. Meera Nambiar',
          doctorSpecialty: 'Gastroenterology',
          clinicId: 'clinic_odyssey_care',
          clinicName: 'Odyssey Apex Health Center',
          clinicAddress: '104 Indiranagar Double Road, Bengaluru',
          date: 'Tomorrow',
          time: '10:15 AM',
          type: 'in_person',
          status: 'upcoming',
          symptoms: 'Subspecialty Endoscopy Consultation',
          roomNumber: 'Room 104',
          fee: 1500,
        },
      ];
      extra.forEach(a => DataStore.saveAppointment(a));
      refreshAppointments();
    }
  }, []);

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter(a => {
      // Date filter
      const matchDate = (a.date || '').toLowerCase().includes(selectedDate.key.toLowerCase());
      if (!matchDate && !(selectedDate.key === 'Today' && a.date === 'Today — Sep 8, 2026')) {
        return false;
      }
      // Department filter
      if (departmentFilter !== 'all') {
        const spec = (a.doctorSpecialty || '').toLowerCase();
        if (!spec.includes(departmentFilter.toLowerCase())) return false;
      }
      return true;
    });
  }, [appointments, selectedDate, departmentFilter]);

  // Handle Book New Slot
  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPatientName.trim()) {
      setFormError('Please enter a patient name or select an existing patient.');
      return;
    }
    const doc = doctors.find(d => d.id === formDoctorId) || doctors[0];
    const newApt: Appointment = {
      id: `apt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      patientId: `pat_${Date.now()}`,
      patientName: formPatientName.trim(),
      doctorId: doc?.id || 'doc_sharma_1',
      doctorName: doc?.name || 'Dr. A. Sharma',
      doctorSpecialty: doc?.specialty || 'General Medicine',
      clinicId: 'clinic_odyssey_care',
      clinicName: 'Odyssey Apex Health Center',
      clinicAddress: '104 Indiranagar Double Road, Bengaluru',
      date: formDate,
      time: formTime,
      type: formType,
      status: 'upcoming',
      symptoms: formSymptoms.trim() || 'General OPD consultation request',
      roomNumber: `Room ${doc?.room || '101'}`,
      fee: 800,
    };

    DataStore.saveAppointment(newApt);
    DataStore.logAudit(
      'APPOINTMENT_BOOKED',
      'patient',
      newApt.id,
      `Scheduled appointment for ${newApt.patientName} with ${newApt.doctorName} at ${newApt.time} (${newApt.date})`,
      'Reception Booking Desk',
      '192.168.1.10 (Reception)'
    );

    refreshAppointments();
    setIsBookModalOpen(false);
    setFormPatientName('');
    setFormSymptoms('');
    setFormError(null);
    showToast(`Appointment confirmed for ${newApt.patientName} at ${newApt.time}.`);
  };

  // Handle Cancel
  const handleCancelAppointment = (id: string, patientName?: string) => {
    DataStore.cancelAppointment(id);
    DataStore.logAudit(
      'APPOINTMENT_CANCELLED',
      'patient',
      id,
      `Cancelled appointment ${id} for ${patientName || 'patient'}`,
      'Scheduling Desk',
      '192.168.1.10 (Reception)'
    );
    refreshAppointments();
    showToast(`Appointment for ${patientName || 'patient'} marked cancelled.`);
  };

  // Handle Reschedule
  const handleRescheduleSubmit = () => {
    if (!rescheduleTarget) return;
    DataStore.rescheduleAppointment(rescheduleTarget.id, rescheduleTarget.date, rescheduleTime);
    DataStore.logAudit(
      'APPOINTMENT_RESCHEDULED',
      'patient',
      rescheduleTarget.id,
      `Rescheduled appointment for ${rescheduleTarget.patientName} to ${rescheduleTime}`,
      'Scheduling Desk',
      '192.168.1.10 (Reception)'
    );
    refreshAppointments();
    setRescheduleTarget(null);
    showToast(`Appointment rescheduled to ${rescheduleTime}.`);
  };

  // Handle Check-in / Enqueue into Live Queue
  const handleEnqueueAppointment = (apt: Appointment) => {
    const queue = DataStore.getQueue();
    // Check if token already exists
    const existing = queue.find(t => t.patientName === (apt.patientName || '') && t.status !== 'completed');
    if (existing) {
      showToast(`${apt.patientName || 'Patient'} is already checked in (Token ${existing.tokenNumber}).`);
      return;
    }

    const token = DataStore.generateToken({
      patientId: apt.patientId,
      clinicId: apt.clinicId || 'clinic_odyssey_care',
      doctorId: apt.doctorId,
      symptomsSummary: apt.symptoms || 'General OPD consultation request',
      department: apt.doctorSpecialty,
    });

    DataStore.logAudit(
      'APPOINTMENT_CHECKED_IN',
      'token',
      token.id,
      `Checked in scheduled appointment for ${apt.patientName || 'patient'} -> Token ${token.tokenNumber}`,
      'Reception Intake',
      '192.168.1.10 (Front Desk)',
      apt.patientName
    );

    showToast(`Checked in ${apt.patientName || 'Patient'}! Issued Token ${token.tokenNumber}.`);
    if (onNavigateToQueue) {
      onNavigateToQueue();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-900 text-white text-xs font-bold flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
              Clinical Scheduling &amp; Room Allocations
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Real-time consultation suite occupancy and synchronized diagnostic appointment book.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Date Selector */}
          <div className="flex items-center space-x-1 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-800">
            <button 
              onClick={() => setDateIndex(prev => Math.max(0, prev - 1))}
              disabled={dateIndex === 0}
              className="p-1 hover:bg-stone-200 rounded disabled:opacity-40"
              title="Previous Date"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2">{selectedDate.label}</span>
            <button 
              onClick={() => setDateIndex(prev => Math.min(dates.length - 1, prev + 1))}
              disabled={dateIndex === dates.length - 1}
              className="p-1 hover:bg-stone-200 rounded disabled:opacity-40"
              title="Next Date"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Book Slot CTA */}
          <button
            onClick={() => {
              setFormDate(selectedDate.key);
              setIsBookModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Schedule Appointment</span>
          </button>
        </div>
      </div>

      {/* Room Occupancy Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map((doc) => (
          <div key={doc.id} className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <DoorOpen className="w-4 h-4 text-emerald-700" />
                <span className="font-extrabold text-xs text-stone-900">Room {doc.room}</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                doc.status === 'consulting'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : doc.status === 'break'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-stone-100 text-stone-700'
              }`}>
                {doc.status === 'consulting' ? 'Active Consultation' : doc.status === 'break' ? 'On Break' : 'On Duty'}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <img
                src={doc.avatarUrl}
                alt={doc.name}
                className="w-10 h-10 rounded-xl object-cover border border-stone-200"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-stone-900 truncate">{doc.name}</h4>
                <p className="text-[11px] text-emerald-700 truncate">{doc.specialty}</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 text-[11px] text-stone-600 flex items-center justify-between">
              <span>Shift: <strong>08:30 — 16:30</strong></span>
              <span>Load: <strong>{doc.patientsSeenToday} seen</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Appointment Slots Timeline */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200/80 shadow-2xs space-y-4 min-w-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
              Synchronized Day Schedule ({selectedDate.label})
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Confirmed consultations synchronized with clinic room dispatch and live intake.
            </p>
          </div>

          {/* Department Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold text-stone-400">Department:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900"
            >
              <option value="all">All Specialties</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Internal Medicine">Internal Medicine</option>
              <option value="Gastroenterology">Gastroenterology</option>
            </select>
          </div>
        </div>

        {/* Schedule Table */}
        {filteredAppointments.length === 0 ? (
          <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200 space-y-3">
            <Calendar className="w-8 h-8 text-stone-400 mx-auto" />
            <div>
              <p className="text-xs font-bold text-stone-700">No scheduled appointments for {selectedDate.label}</p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                {departmentFilter !== 'all' ? `No bookings found for ${departmentFilter}. Try selecting All Specialties.` : 'Slots are currently open for walk-in scheduling.'}
              </p>
            </div>
            <button
              onClick={() => {
                setFormDate(selectedDate.key);
                setIsBookModalOpen(true);
              }}
              className="px-3.5 py-1.5 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-stone-800 inline-flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Book Appointment Slot</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto min-w-0">
            <table className="w-full min-w-[700px] text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="pb-3 pl-2">Time Slot</th>
                  <th className="pb-3">Room</th>
                  <th className="pb-3">Patient</th>
                  <th className="pb-3">Clinician</th>
                  <th className="pb-3">Department</th>
                  <th className="pb-3">Reason / Symptoms</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-stone-50/80 transition-all">
                    <td className="py-3 pl-2 font-mono font-bold text-stone-900">{apt.time}</td>
                    <td className="py-3 text-stone-700 font-bold">{apt.roomNumber || 'Room 101'}</td>
                    <td className="py-3 text-stone-900 font-bold">
                      <div className="flex items-center space-x-1.5">
                        {apt.type === 'video_call' ? <Video className="w-3.5 h-3.5 text-blue-600" /> : <User className="w-3.5 h-3.5 text-stone-400" />}
                        <span>{apt.patientName || 'Walk-in'}</span>
                      </div>
                    </td>
                    <td className="py-3 text-stone-600">{apt.doctorName}</td>
                    <td className="py-3 text-stone-500">{apt.doctorSpecialty}</td>
                    <td className="py-3 text-stone-500 text-[11px] max-w-xs truncate" title={apt.symptoms}>
                      {apt.symptoms || 'General OPD check'}
                    </td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        apt.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : apt.status === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}>
                        {apt.status === 'upcoming' ? 'Scheduled' : apt.status}
                      </span>
                    </td>
                    <td className="py-3 pr-2 text-right">
                      {apt.status !== 'cancelled' && (
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleEnqueueAppointment(apt)}
                            className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-[11px] font-bold border border-emerald-200 transition-all flex items-center space-x-1"
                            title="Check patient in and add to live queue"
                          >
                            <UserCheck className="w-3 h-3 text-emerald-600" />
                            <span>Check-In</span>
                          </button>
                          <button
                            onClick={() => {
                              setRescheduleTarget(apt);
                              setRescheduleTime(apt.time);
                            }}
                            className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-bold transition-all"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleCancelAppointment(apt.id, apt.patientName)}
                            className="px-2 py-1 rounded-lg text-rose-600 hover:bg-rose-50 text-[11px] font-bold transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Book Appointment Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-stone-200 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm font-extrabold text-stone-900">Book Clinical Appointment</h3>
              </div>
              <button onClick={() => setIsBookModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleBookSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Patient Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar or Priya Sharma"
                  value={formPatientName}
                  onChange={(e) => setFormPatientName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white"
                  autoFocus
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Consulting Doctor &amp; Suite</label>
                <select
                  value={formDoctorId}
                  onChange={(e) => setFormDoctorId(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-stone-900"
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.specialty} (Room {d.room})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Date</label>
                  <select
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                  >
                    <option value="Today">Today</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="Sep 10">Sep 10, 2026</option>
                    <option value="Sep 11">Sep 11, 2026</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Time Slot</label>
                  <select
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono font-bold"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Encounter Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormType('in_person')}
                    className={`p-2 rounded-xl border text-center font-bold ${
                      formType === 'in_person'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-stone-200 bg-stone-50 text-stone-600'
                    }`}
                  >
                    In-Person Clinic Visit
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormType('video_call')}
                    className={`p-2 rounded-xl border text-center font-bold ${
                      formType === 'video_call'
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-stone-200 bg-stone-50 text-stone-600'
                    }`}
                  >
                    Telehealth Video Consult
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Primary Symptoms / Concern</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Abdominal cramping after meals, fatigue, repeated antibiotic courses..."
                  value={formSymptoms}
                  onChange={(e) => setFormSymptoms(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 font-bold hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleTarget && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-stone-200 shadow-xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-sm font-extrabold text-stone-900">Reschedule Appointment</h3>
              <button onClick={() => setRescheduleTarget(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Select a new time slot for <strong>{rescheduleTarget.patientName}</strong> ({rescheduleTarget.doctorName}):
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">New Time Slot</label>
                <select
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono font-bold"
                >
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="02:30 PM">02:30 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  onClick={() => setRescheduleTarget(null)}
                  className="px-3.5 py-1.5 rounded-xl border border-stone-200 text-stone-700 font-bold"
                >
                  Keep Existing
                </button>
                <button
                  onClick={handleRescheduleSubmit}
                  className="px-4 py-1.5 rounded-xl bg-stone-900 text-white font-bold"
                >
                  Update Slot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
