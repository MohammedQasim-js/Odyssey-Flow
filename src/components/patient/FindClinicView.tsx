import React, { useState } from 'react';
import { 
  MapPin, Clock, Users, Star, Stethoscope, Search, 
  ChevronRight, Phone, Navigation, CheckCircle2, Building2,
  ArrowRight, HeartPulse, Sparkles, Filter
} from 'lucide-react';
import { DataStore } from '../../services/dataStore';
import { Clinic } from '../../types';

interface FindClinicViewProps {
  onSelectClinic: (clinic: Clinic) => void;
  onJoinQueue?: (clinic: Clinic) => void;
}

export const FindClinicView: React.FC<FindClinicViewProps> = ({ 
  onSelectClinic,
  onJoinQueue = onSelectClinic,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const clinics = DataStore.getClinics();
  const doctors = DataStore.getDoctors();

  const filtered = clinics.filter(c => {
    const q = (searchTerm || '').toLowerCase();
    const matchesSearch = (c.name || '').toLowerCase().includes(q) ||
      (c.specialties || []).some(s => (s || '').toLowerCase().includes(q)) ||
      (c.city || '').toLowerCase().includes(q) ||
      (c.address || '').toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (selectedFilter === 'All') return true;
    return (c.specialties || []).includes(selectedFilter);
  });

  return (
    <div className="space-y-4 pb-24 font-sans text-stone-900 animate-in fade-in duration-200">
      
      {/* 1. Header */}
      <div className="pt-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-stone-900">
          Find a Clinic
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Live queue transparency and instant zero-friction sanctuary check-in.
        </p>
      </div>

      {/* 2. Search Bar with circular green action */}
      <div className="relative flex items-center">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search clinics, specialties, or doctors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm border border-stone-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#34C759] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] placeholder:text-stone-400 text-stone-900"
          />
        </div>
      </div>

      {/* 3. Filter Chips */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
        {['All', 'General Medicine', 'Internal Medicine', 'Neurology', 'Diagnostic Triage'].map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`py-1.5 px-3 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedFilter === filter
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-300'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* 4. Clinics List (Matching User Prompt Exact Specs) */}
      <div className="space-y-3.5">
        {filtered.map((clinic, index) => {
          const doctorOnDuty = doctors.find(d => d.clinicId === clinic.id) || doctors[0];
          const distance = (1.2 + index * 1.6).toFixed(1);

          return (
            <div
              key={clinic.id}
              onClick={() => onSelectClinic(clinic)}
              className="bg-white rounded-3xl p-5 border border-stone-200/70 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:border-emerald-300 transition-all cursor-pointer group space-y-3"
            >
              {/* Header: Name, Distance, Open Badge */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-extrabold text-stone-900 leading-tight group-hover:text-emerald-700 transition-colors">
                      {clinic.name}
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Open
                    </span>
                  </div>

                  <p className="text-xs text-stone-500 flex items-center space-x-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{clinic.address} • {distance} km</span>
                  </p>
                </div>

                <span className="flex items-center text-xs font-bold text-stone-900 bg-stone-50 px-2.5 py-1 rounded-xl border border-stone-200/70 shrink-0 font-mono">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                  {clinic.rating}
                </span>
              </div>

              {/* Specialty */}
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Specialty:</span>
                <span className="text-xs font-semibold text-stone-700">
                  {clinic.specialties[0] || 'General Medicine'}
                </span>
              </div>

              {/* Status Section: Current queue + Sanctuary Pulse */}
              <div className="p-3 rounded-2xl bg-stone-50/80 border border-stone-100 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-stone-700 font-medium">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>{clinic.queueCount || 12} patients in queue</span>
                </div>

                <span className="flex items-center space-x-1.5 text-emerald-700 font-bold text-xs bg-emerald-50/70 px-2 py-0.5 rounded-full border border-emerald-200/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-pulse"></span>
                  <span>Clinic stable</span>
                </span>
              </div>

              {/* Bottom Action: Join Queue Button */}
              <div className="pt-1 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectClinic(clinic);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all"
                >
                  Detail
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onJoinQueue(clinic);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#34C759] hover:bg-[#2EB84F] active:bg-[#28A745] text-white text-xs font-extrabold shadow-xs transition-all flex items-center justify-center space-x-1.5"
                >
                  <span>Join Queue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
