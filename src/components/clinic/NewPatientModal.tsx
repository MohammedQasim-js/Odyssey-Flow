import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2, Stethoscope, AlertTriangle, Building2 } from 'lucide-react';
import { DataStore } from '../../services/dataStore';
import { Doctor } from '../../types';

interface NewPatientModalProps {
  onClose: () => void;
  onPatientCreated: () => void;
  doctors: Doctor[];
}

export const NewPatientModal: React.FC<NewPatientModalProps> = ({
  onClose,
  onPatientCreated,
  doctors,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('32');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || '');
  const [symptoms, setSymptoms] = useState('');
  const [durationDays, setDurationDays] = useState(30);
  const [isStagnantCandidate, setIsStagnantCandidate] = useState(false);
  const [createdToken, setCreatedToken] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !symptoms.trim()) return;

    // Create token in DataStore
    const token = DataStore.generateToken({
      patientId: `pat_walkin_${Date.now()}`,
      clinicId: 'clinic_odyssey_care',
      doctorId,
      symptomsSummary: symptoms,
      durationDays: isStagnantCandidate ? 120 : durationDays,
    });

    setCreatedToken(token.tokenNumber);
    onPatientCreated();

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2.5 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">Direct Patient Intake &amp; Token</h3>
            <p className="text-xs text-stone-500">Zero-friction walk-in check-in</p>
          </div>
        </div>

        {createdToken ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-emerald-900">Token Generated Successfully</h4>
            <div className="font-mono text-3xl font-black text-emerald-800">{createdToken}</div>
            <p className="text-xs text-emerald-700">Patient assigned to live Sanctuary Pulse queue.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Patient Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Vikram Singhania"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Mobile (+91)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98765 00000"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Age / Gender</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-16 px-2 py-2 bg-stone-50 border border-stone-200 rounded-xl text-center focus:outline-none focus:ring-2 focus:ring-stone-900"
                  />
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="flex-1 px-2 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Assign Doctor / Specialty</label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900"
              >
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.specialty} (Room {d.room})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Primary Symptoms / Concern *</label>
              <textarea
                required
                rows={2}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g. Chronic abdominal distress and episodic nausea for 4 months"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white"
              />
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-900 block">Flag for Longitudinal Stagnation Review</span>
                <span className="text-[11px] text-stone-500">Unresolved complaints &gt;60 days</span>
              </div>
              <input
                type="checkbox"
                checked={isStagnantCandidate}
                onChange={(e) => setIsStagnantCandidate(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold shadow-xs transition-all"
              >
                Issue Token &amp; Route
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
