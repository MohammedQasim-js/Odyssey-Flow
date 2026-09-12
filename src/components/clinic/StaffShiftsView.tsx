import React, { useState } from 'react';
import { 
  UserCheck, Stethoscope, Clock, ShieldCheck, 
  MapPin, CheckCircle2, ChevronRight, Activity 
} from 'lucide-react';
import { DataStore, INITIAL_SHIFTS } from '../../services/dataStore';
import { Doctor, DoctorShift } from '../../types';

export const StaffShiftsView: React.FC = () => {
  const doctors = DataStore.getDoctors();
  const [shifts, setShifts] = useState<DoctorShift[]>(INITIAL_SHIFTS);

  const handleStatusChange = (doctorId: string, status: Doctor['status']) => {
    DataStore.updateDoctorStatus(doctorId, status);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">Staff &amp; Shifts Management</h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              {doctors.length} Doctors Active
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Doctor statuses directly synchronize with the patient Sanctuary Pulse experience.
          </p>
        </div>
      </div>

      {/* Doctor Roster Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {doctors.map((doc) => {
          const shift = shifts.find(s => s.doctorId === doc.id);

          return (
            <div key={doc.id} className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-4">
              
              <div className="flex items-start space-x-3">
                <img
                  src={doc.avatarUrl}
                  alt={doc.name}
                  className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-stone-900 truncate">{doc.name}</h3>
                  <p className="text-xs text-emerald-700 font-medium truncate">{doc.specialty}</p>
                  <p className="text-[11px] text-stone-500">{doc.qualification}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs">
                <div className="p-2 rounded-lg bg-stone-50">
                  <span className="text-[10px] text-stone-400 block uppercase">Room</span>
                  <strong className="text-stone-800">Room {doc.room}</strong>
                </div>
                <div className="p-2 rounded-lg bg-stone-50">
                  <span className="text-[10px] text-stone-400 block uppercase">Patients Today</span>
                  <strong className="text-stone-800">{doc.patientsSeenToday} seen</strong>
                </div>
              </div>

              {/* Status Switcher (Direct Sanctuary Pulse connection) */}
              <div className="pt-2 border-t border-stone-100">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
                  Current Status (Feeds Sanctuary Pulse)
                </label>
                <select
                  value={doc.status}
                  onChange={(e) => handleStatusChange(doc.id, e.target.value as Doctor['status'])}
                  className="w-full text-xs font-semibold p-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="consulting">In Consultation</option>
                  <option value="reviewing_history">Reviewing History</option>
                  <option value="finishing_consult">Finishing Current Consult</option>
                  <option value="preparing">Preparing Next Case</option>
                  <option value="break">On Break</option>
                </select>
              </div>

              {/* Shift info */}
              {shift && (
                <div className="text-[11px] text-stone-500 flex items-center justify-between pt-1">
                  <span>Shift: {shift.shiftName} ({shift.startTime} - {shift.endTime})</span>
                  <span className="text-emerald-700 font-bold">On Duty</span>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
