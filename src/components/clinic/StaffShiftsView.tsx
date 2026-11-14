import React, { useState } from 'react';
import { 
  UserCheck, Stethoscope, Clock, ShieldCheck, 
  MapPin, CheckCircle2, ChevronRight, Activity, DoorOpen,
  Filter, X, AlertCircle, Edit2, Users
} from 'lucide-react';
import { DataStore } from '../../services/dataStore';
import { Doctor, DoctorShift } from '../../types';

export const StaffShiftsView: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>(() => DataStore.getDoctors());
  const [shifts, setShifts] = useState<DoctorShift[]>(() => DataStore.getDoctorShifts());
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Room Assignment Modal
  const [editingDoctorRoom, setEditingDoctorRoom] = useState<Doctor | null>(null);
  const [selectedNewRoom, setSelectedNewRoom] = useState<string>('101');

  // Shift Edit Modal
  const [editingShift, setEditingShift] = useState<DoctorShift | null>(null);
  const [shiftNameInput, setShiftNameInput] = useState<'Morning' | 'Afternoon' | 'Evening'>('Morning');
  const [startTimeInput, setStartTimeInput] = useState('08:30');
  const [endTimeInput, setEndTimeInput] = useState('14:30');
  const [isActiveDutyInput, setIsActiveDutyInput] = useState(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const refreshState = () => {
    setDoctors([...DataStore.getDoctors()]);
    setShifts([...DataStore.getDoctorShifts()]);
  };

  // Status Change handler
  const handleStatusChange = (doctorId: string, status: Doctor['status']) => {
    DataStore.updateDoctorStatus(doctorId, status);
    refreshState();
    const doc = doctors.find(d => d.id === doctorId);
    showToast(`Updated ${doc?.name || 'Doctor'} status to: ${status.replace('_', ' ').toUpperCase()}`);
  };

  // Room Change handler
  const handleRoomSave = () => {
    if (!editingDoctorRoom) return;
    DataStore.updateDoctorRoom(editingDoctorRoom.id, selectedNewRoom);
    refreshState();
    showToast(`Reassigned ${editingDoctorRoom.name} to Room ${selectedNewRoom}.`);
    setEditingDoctorRoom(null);
  };

  // Shift Change handler
  const handleShiftSave = () => {
    if (!editingShift) return;
    DataStore.updateDoctorShift(editingShift.doctorId, {
      shiftName: shiftNameInput,
      startTime: startTimeInput,
      endTime: endTimeInput,
      isActive: isActiveDutyInput,
    });
    refreshState();
    showToast(`Updated shift schedule for ${editingShift.doctorName}.`);
    setEditingShift(null);
  };

  // Filtered Doctors
  const filteredDoctors = doctors.filter(doc => {
    if (departmentFilter !== 'all' && !doc.specialty.toLowerCase().includes(departmentFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  const queue = DataStore.getQueue();

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

      {/* Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">Staff &amp; Shifts Management</h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              {doctors.length} Doctors Active
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Doctor availability and suite statuses directly feed the patient Sanctuary Pulse experience.
          </p>
        </div>

        {/* Department Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-stone-400" />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900"
          >
            <option value="all">All Specialties</option>
            <option value="General Medicine">General Medicine</option>
            <option value="Internal Medicine">Internal Medicine</option>
            <option value="Gastroenterology">Gastroenterology</option>
          </select>
        </div>
      </div>

      {/* Doctor Roster Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDoctors.map((doc) => {
          const shift = shifts.find(s => s.doctorId === doc.id);
          const assignedTokens = queue.filter(t => t.doctorId === doc.id && t.status !== 'completed');
          const currentInConsult = queue.find(t => t.doctorId === doc.id && (t.status === 'in_consultation' || t.status === 'called'));

          return (
            <div key={doc.id} className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-4">
              
              {/* Doctor Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 min-w-0">
                  <img
                    src={doc.avatarUrl}
                    alt={doc.name}
                    className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-stone-900 truncate">{doc.name}</h3>
                    <p className="text-xs text-emerald-700 font-medium truncate">{doc.specialty}</p>
                    <p className="text-[11px] text-stone-500">{doc.qualification}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setEditingDoctorRoom(doc);
                    setSelectedNewRoom(doc.room);
                  }}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all"
                  title="Reassign Consultation Suite"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Room & Load Info */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs">
                <div className="p-2 rounded-lg bg-stone-50">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-stone-400 uppercase">Consult Suite</span>
                    <button
                      onClick={() => {
                        setEditingDoctorRoom(doc);
                        setSelectedNewRoom(doc.room);
                      }}
                      className="text-[10px] text-emerald-700 font-bold hover:underline"
                    >
                      Change
                    </button>
                  </div>
                  <strong className="text-stone-800 flex items-center space-x-1 mt-0.5">
                    <DoorOpen className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Room {doc.room}</span>
                  </strong>
                </div>

                <div className="p-2 rounded-lg bg-stone-50">
                  <span className="text-[10px] text-stone-400 block uppercase">Patients Seen</span>
                  <strong className="text-stone-800 flex items-center space-x-1 mt-0.5">
                    <Users className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                    <span>{doc.patientsSeenToday} today</span>
                  </strong>
                </div>
              </div>

              {/* Status Switcher (Direct Sanctuary Pulse connection) */}
              <div className="pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    Current Status (Sanctuary Pulse)
                  </label>
                  <span className={`w-2 h-2 rounded-full ${
                    doc.status === 'consulting' ? 'bg-emerald-500 animate-pulse' : doc.status === 'break' ? 'bg-amber-500' : 'bg-stone-400'
                  }`} />
                </div>
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

              {/* Active Queue Patient spotlight */}
              {currentInConsult ? (
                <div className="p-2 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900">
                  <span className="text-[10px] font-bold uppercase tracking-wider block text-emerald-700">Now In Suite</span>
                  <div className="font-bold truncate mt-0.5">
                    Token {currentInConsult.tokenNumber} — {currentInConsult.patientName}
                  </div>
                </div>
              ) : (
                <div className="p-2 rounded-xl bg-stone-50 text-xs text-stone-500 flex items-center justify-between">
                  <span>Queue Roster:</span>
                  <span className="font-bold text-stone-700">{assignedTokens.length} waiting</span>
                </div>
              )}

              {/* Shift info & Edit */}
              {shift && (
                <div className="text-[11px] text-stone-500 flex items-center justify-between pt-2 border-t border-stone-100">
                  <div>
                    <span>{shift.shiftName} Shift: </span>
                    <strong className="text-stone-700">{shift.startTime} - {shift.endTime}</strong>
                  </div>
                  <button
                    onClick={() => {
                      setEditingShift(shift);
                      setShiftNameInput(shift.shiftName);
                      setStartTimeInput(shift.startTime);
                      setEndTimeInput(shift.endTime);
                      setIsActiveDutyInput(shift.isActive);
                    }}
                    className="text-[11px] font-bold text-emerald-700 hover:underline"
                  >
                    Edit Shift
                  </button>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Reassign Suite Modal */}
      {editingDoctorRoom && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-stone-200 shadow-xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-sm font-extrabold text-stone-900">Reassign Consultation Suite</h3>
              <button onClick={() => setEditingDoctorRoom(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Select room allocation for <strong>{editingDoctorRoom.name}</strong> ({editingDoctorRoom.specialty}):
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Assigned Suite</label>
                <select
                  value={selectedNewRoom}
                  onChange={(e) => setSelectedNewRoom(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                >
                  <option value="101">Room 101 (General OPD Suite)</option>
                  <option value="102">Room 102 (Internal Medicine Examination Suite)</option>
                  <option value="104">Room 104 (Senior Gastroenterology Suite)</option>
                  <option value="105">Room 105 (Diagnostic Consultation Suite)</option>
                  <option value="106">Room 106 (Triage Assessment Suite)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  onClick={() => setEditingDoctorRoom(null)}
                  className="px-3.5 py-1.5 rounded-xl border border-stone-200 text-stone-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRoomSave}
                  className="px-4 py-1.5 rounded-xl bg-stone-900 text-white font-bold"
                >
                  Save Allocation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Shift Modal */}
      {editingShift && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-stone-200 shadow-xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-sm font-extrabold text-stone-900">Modify Doctor Shift</h3>
              <button onClick={() => setEditingShift(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Configure shift hours for <strong>{editingShift.doctorName}</strong>:
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Shift Name</label>
                <select
                  value={shiftNameInput}
                  onChange={(e) => setShiftNameInput(e.target.value as any)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                >
                  <option value="Morning">Morning Shift (Standard OPD)</option>
                  <option value="Afternoon">Afternoon Shift (Specialty Review)</option>
                  <option value="Evening">Evening Shift (Extended Hours)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Start Time</label>
                  <input
                    type="time"
                    value={startTimeInput}
                    onChange={(e) => setStartTimeInput(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTimeInput}
                    onChange={(e) => setEndTimeInput(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2 p-2 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActiveDutyInput}
                    onChange={(e) => setIsActiveDutyInput(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="font-bold text-stone-800">Currently On Active Roster</span>
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  onClick={() => setEditingShift(null)}
                  className="px-3.5 py-1.5 rounded-xl border border-stone-200 text-stone-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleShiftSave}
                  className="px-4 py-1.5 rounded-xl bg-stone-900 text-white font-bold"
                >
                  Save Shift
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
