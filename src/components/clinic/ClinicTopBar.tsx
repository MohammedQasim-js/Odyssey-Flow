import React, { useState } from 'react';
import { 
  Search, Bell, Plus, Calendar, ShieldCheck, ChevronDown, 
  User, CheckCircle2, AlertTriangle, Clock, Stethoscope, Building2
} from 'lucide-react';
import { Doctor } from '../../types';
import { DataStore } from '../../services/dataStore';

interface ClinicTopBarProps {
  onOpenNewModal: () => void;
  onSearchQuery?: (q: string) => void;
  onOpenSnapshotForAarav?: () => void;
}

export const ClinicTopBar: React.FC<ClinicTopBarProps> = ({
  onOpenNewModal,
  onSearchQuery,
  onOpenSnapshotForAarav,
}) => {
  const [search, setSearch] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const settings = DataStore.getClinicSettings();

  const notifications = [
    {
      id: 'notif_1',
      title: 'A-27: Diagnostic Stagnation Flagged',
      desc: 'DPS Score 63/100. Senior consultant review recommended.',
      time: '2m ago',
      type: 'alert' as const,
      isAarav: true,
    },
    {
      id: 'notif_2',
      title: 'Room 102 Consultation Commenced',
      desc: 'Dr. Arjun Shenoy started with Token B-14.',
      time: '6m ago',
      type: 'info' as const,
    },
    {
      id: 'notif_3',
      title: 'Sanctuary Pulse Synchronized',
      desc: 'All 7 waiting patients notified with empathetic pacing.',
      time: '12m ago',
      type: 'success' as const,
    },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (onSearchQuery) onSearchQuery(e.target.value);
  };

  return (
    <header className="bg-white border-b border-stone-200/80 px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      
      {/* Clinic Name & Today's Date */}
      <div className="flex items-center space-x-4 min-w-[280px]">
        <div className="w-10 h-10 rounded-xl bg-stone-900 text-emerald-400 flex items-center justify-center font-black text-lg shadow-xs">
          O
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-sm font-extrabold text-stone-900 tracking-tight flex items-center space-x-1.5">
              <span>{settings.clinicName}</span>
            </h1>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-stone-500 font-medium">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-stone-400" />
              <span>Tuesday, September 8, 2026</span>
            </span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">Live Operational Sync</span>
          </div>
        </div>
      </div>

      {/* Center Search Input */}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search patients, tokens (e.g. A-27), UHID, or doctors..."
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right Controls: Notifications, Profile, Quick Action */}
      <div className="flex items-center space-x-3">
        
        {/* Quick Action: "+ New" */}
        <button
          onClick={onOpenNewModal}
          className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ New</span>
        </button>

        {/* Notifications Dropdown Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-xl border border-stone-200 hover:bg-stone-50 flex items-center justify-center text-stone-600 transition-all relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-extrabold flex items-center justify-center border-2 border-white">
              3
            </span>
          </button>

          {/* Notifications Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-stone-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
                <span className="text-xs font-bold text-stone-900">Operational Alerts</span>
                <span className="text-[10px] text-emerald-700 font-semibold cursor-pointer">Mark all read</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map(n => (
                  <div 
                    key={n.id} 
                    onClick={() => {
                      if (n.isAarav && onOpenSnapshotForAarav) {
                        onOpenSnapshotForAarav();
                        setShowNotifications(false);
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      n.isAarav 
                        ? 'bg-amber-50/70 border-amber-200 cursor-pointer hover:bg-amber-100/70' 
                        : 'bg-stone-50/70 border-stone-200/70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900">{n.title}</span>
                      <span className="text-[10px] text-stone-400 font-mono">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-0.5">{n.desc}</p>
                    {n.isAarav && (
                      <span className="inline-block mt-1 text-[10px] font-bold text-amber-900 underline">
                        Open Clinical Snapshot →
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-2.5 pl-2 border-l border-stone-200">
          <img
            src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150"
            alt="Dr. A. Sharma"
            className="w-9 h-9 rounded-xl object-cover border border-stone-200 shadow-2xs"
          />
          <div className="hidden lg:block text-left">
            <span className="text-xs font-bold text-stone-900 block leading-tight">Dr. A. Sharma</span>
            <span className="text-[10px] text-stone-500 font-medium">Chief Medical Officer &amp; Admin</span>
          </div>
        </div>

      </div>

    </header>
  );
};
