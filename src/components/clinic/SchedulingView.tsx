import React, { useState } from 'react';
import { Calendar, Clock, User, ChevronLeft, ChevronRight, Plus, DoorOpen, CheckCircle2 } from 'lucide-react';
import { Doctor } from '../../types';

interface SchedulingViewProps {
  doctors: Doctor[];
}

export const SchedulingView: React.FC<SchedulingViewProps> = ({ doctors }) => {
  const [selectedDate, setSelectedDate] = useState('Today — Sep 8, 2026');

  const slots = [
    { time: '09:00 AM', room: '101', patient: 'Aarav Mehta (A-27)', doctor: 'Dr. A. Sharma', status: 'In Consult', specialty: 'General Medicine' },
    { time: '09:15 AM', room: '102', patient: 'Priya Sharma (B-14)', doctor: 'Dr. Arjun Shenoy', status: 'Scheduled', specialty: 'Internal Medicine' },
    { time: '09:30 AM', room: '104', patient: 'Rajesh Nair', doctor: 'Dr. Meera Nambiar', status: 'Scheduled', specialty: 'Gastroenterology' },
    { time: '09:45 AM', room: '101', patient: 'Kavita Rao', doctor: 'Dr. A. Sharma', status: 'Waiting', specialty: 'General Medicine' },
    { time: '10:00 AM', room: '102', patient: 'Siddharth V.', doctor: 'Dr. Arjun Shenoy', status: 'Scheduled', specialty: 'Internal Medicine' },
    { time: '10:15 AM', room: '104', patient: 'Ananya Deshmukh', doctor: 'Dr. Meera Nambiar', status: 'Senior Review', specialty: 'Gastroenterology' },
    { time: '10:30 AM', room: '101', patient: 'Sunil Verma', doctor: 'Dr. A. Sharma', status: 'Scheduled', specialty: 'General Medicine' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-800">
            <button className="p-1 hover:bg-stone-200 rounded"><ChevronLeft className="w-3.5 h-3.5" /></button>
            <span className="px-2">{selectedDate}</span>
            <button className="p-1 hover:bg-stone-200 rounded"><ChevronRight className="w-3.5 h-3.5" /></button>
          </div>
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
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                Active Suite
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
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
          Synchronized Day Schedule
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="pb-3 pl-2">Time Slot</th>
                <th className="pb-3">Room</th>
                <th className="pb-3">Patient</th>
                <th className="pb-3">Clinician</th>
                <th className="pb-3">Department</th>
                <th className="pb-3 pr-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {slots.map((s, idx) => (
                <tr key={idx} className="hover:bg-stone-50/80 transition-all">
                  <td className="py-3 pl-2 font-mono font-bold text-stone-900">{s.time}</td>
                  <td className="py-3 text-stone-700 font-bold">Room {s.room}</td>
                  <td className="py-3 text-stone-900 font-bold">{s.patient}</td>
                  <td className="py-3 text-stone-600">{s.doctor}</td>
                  <td className="py-3 text-stone-500">{s.specialty}</td>
                  <td className="py-3 pr-2 text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      s.status === 'In Consult'
                        ? 'bg-emerald-100 text-emerald-800'
                        : s.status === 'Senior Review'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-stone-100 text-stone-700'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
