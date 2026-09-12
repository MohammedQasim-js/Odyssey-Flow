import React, { useState } from 'react';
import { 
  Activity, Smartphone, LayoutDashboard, RefreshCw, 
  Sparkles, Shield, ArrowRight, Stethoscope, ChevronRight, Zap,
  Play, Clock, UserCheck, CheckCircle2, ChevronDown
} from 'lucide-react';
import { DataStore } from '../../services/dataStore';

interface HeaderProps {
  currentView: 'landing' | 'patient' | 'clinic';
  onSelectView: (view: 'landing' | 'patient' | 'clinic') => void;
  onAdvanceQueue: () => void;
  onRebalanceDPS: () => void;
  onResetDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSelectView,
  onAdvanceQueue,
  onRebalanceDPS,
  onResetDemo,
}) => {
  const [showSimMenu, setShowSimMenu] = useState(false);

  const handleSimAction = (action: string) => {
    if (action === 'advance') DataStore.advanceQueueSimulation();
    if (action === 'delay') DataStore.triggerDelaySimulation();
    if (action === 'review') DataStore.doctorReviewingSimulation();
    if (action === 'approach') DataStore.approachingTurnSimulation();
    if (action === 'call') DataStore.callPatientSimulation();
    if (action === 'reset') DataStore.resetSimulation();
    setShowSimMenu(false);
  };
  return (
    <header className="sticky top-0 z-50 bg-[#FBFBFC]/90 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Hackathon Info */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectView('landing')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-stone-900">ODYSSEY<span className="text-emerald-600 font-extrabold ml-1">FLOW</span></span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                Enigma 5.0
              </span>
            </div>
            <p className="text-[11px] text-stone-500 hidden sm:block">
              Pioneer Developers • Zero-Friction Queue &amp; Longitudinal DPS
            </p>
          </div>
        </div>

        {/* Interface Navigation Switcher */}
        <nav className="flex items-center space-x-1 p-1 bg-stone-100/90 rounded-xl border border-stone-200/70 text-xs font-medium">
          <button
            onClick={() => onSelectView('landing')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
              currentView === 'landing'
                ? 'bg-white text-stone-900 shadow-sm font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => onSelectView('patient')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
              currentView === 'patient'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Patient App</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/30 text-white ml-0.5">Mobile</span>
          </button>

          <button
            onClick={() => onSelectView('clinic')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
              currentView === 'clinic'
                ? 'bg-stone-900 text-white shadow-sm font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
            <span>Clinic Admin</span>
          </button>
        </nav>

        {/* Quick Demo Controls */}
        <div className="flex items-center space-x-2 relative">
          
          {/* Simulate Queue Dropdown for Admin & Judges */}
          <div className="relative">
            <button
              onClick={() => setShowSimMenu(!showSimMenu)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-xs"
              title="Simulate queue events live across Patient & Clinic screens"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Simulate Queue</span>
              <ChevronDown className="w-3 h-3 text-white/80" />
            </button>

            {showSimMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-stone-900 text-white rounded-2xl shadow-xl border border-stone-800 p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 border-b border-stone-800 mb-1">
                  Queue Simulation Events
                </div>

                <button
                  onClick={() => handleSimAction('advance')}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-stone-800 flex items-center space-x-2 text-stone-200"
                >
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Advance Queue (+1)</span>
                </button>

                <button
                  onClick={() => handleSimAction('delay')}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-stone-800 flex items-center space-x-2 text-stone-200"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Trigger Delay (Slight Delay)</span>
                </button>

                <button
                  onClick={() => handleSimAction('review')}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-stone-800 flex items-center space-x-2 text-stone-200"
                >
                  <Stethoscope className="w-3.5 h-3.5 text-sky-400" />
                  <span>Doctor Reviewing</span>
                </button>

                <button
                  onClick={() => handleSimAction('approach')}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-stone-800 flex items-center space-x-2 text-stone-200"
                >
                  <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Approaching Turn (Pos #2)</span>
                </button>

                <button
                  onClick={() => handleSimAction('call')}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-stone-800 flex items-center space-x-2 text-stone-200"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Call Patient (Your Turn)</span>
                </button>

                <div className="border-t border-stone-800 mt-1 pt-1">
                  <button
                    onClick={() => handleSimAction('reset')}
                    className="w-full text-left px-2.5 py-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-stone-200 text-[11px] flex items-center space-x-2"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset Simulation</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onRebalanceDPS}
            title="Algorithmically rebalance queue by Diagnostic Progress Score (DPS)"
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Rebalance by DPS</span>
          </button>

          <button
            onClick={onAdvanceQueue}
            title="Advance live queue (call next patient)"
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-sm"
          >
            <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
            <span>Call Next</span>
          </button>

          {/* Demo Mode Badge */}
          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Demo Mode</span>
            <span className="text-[10px] text-emerald-600 font-normal">(Seeded)</span>
          </div>

          <button
            id="header-reset-demo-btn"
            onClick={onResetDemo}
            title="Reset prototype state to initial demo dataset"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-300/80 transition-colors shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
            <span>Reset Demo</span>
          </button>
        </div>

      </div>
    </header>
  );
};
