import React, { useState } from 'react';
import { 
  Clock, Stethoscope, AlertTriangle, Zap, CheckCircle2, 
  User, RefreshCw, Eye, ArrowUpDown, ChevronRight, Sparkles,
  Pause, Play, SkipForward, RotateCcw, UserCheck, ShieldAlert,
  Activity, CheckCircle, Search, SlidersHorizontal, Filter, X
} from 'lucide-react';
import { Token, Doctor } from '../../types';
import { DataStore } from '../../services/dataStore';
import { SanctuaryPulseEngine } from '../../services/sanctuaryPulseEngine';
import { QueueTimelineStrip } from './QueueTimelineStrip';
import { PatientQuickViewDrawer } from './PatientQuickViewDrawer';
import { EmptyState } from '../common/StateFeedback';

export interface LiveQueueViewProps {
  queue: Token[];
  doctors: Doctor[];
  onAdvanceQueue: () => void;
  onRebalanceDPS: () => void;
  onSelectPatient: (patientId: string) => void;
  onNavigateToDiagnosticJourney?: (patientId?: string) => void;
  onOpenSnapshot?: (token: Token) => void;
  onOpenNewPatient?: () => void;
  onStateChange?: () => void;
}

export const LiveQueueView: React.FC<LiveQueueViewProps> = ({
  queue,
  doctors,
  onAdvanceQueue,
  onRebalanceDPS,
  onSelectPatient,
  onNavigateToDiagnosticJourney,
  onOpenSnapshot,
  onOpenNewPatient,
  onStateChange,
}) => {
  const [filter, setFilter] = useState<'all' | 'waiting' | 'stagnant' | 'skipped'>('all');
  const [pulseFilter, setPulseFilter] = useState<string>('all');
  const [clinicalSignalFilter, setClinicalSignalFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPaused, setIsPaused] = useState(DataStore.isQueuePaused());
  const [quickViewToken, setQuickViewToken] = useState<Token | null>(null);

  // Helper to map token to Sanctuary Pulse text
  const getPulseInfo = (t: Token) => {
    const doc = doctors.find(d => d.id === t.doctorId || d.name === t.doctorName);
    const pulse = SanctuaryPulseEngine.computePulseState(t, doc, t.queuePosition, t.sanctuary_state as any);
    return {
      title: pulse.title,
      code: pulse.stateCode,
    };
  };

  // Helper for Clinical Signal
  const getClinicalSignal = (t: Token) => {
    if (t.stagnationFlag && t.dpsScore < 50) {
      return {
        key: 'stagnating',
        label: 'Stagnating',
        classes: 'bg-rose-50 text-rose-800 border-rose-300 font-bold',
        isAlert: true,
      };
    }
    if (t.stagnationFlag || t.dpsScore <= 65) {
      return {
        key: 'review_recommended',
        label: 'Review recommended',
        classes: 'bg-amber-50 text-amber-900 border-amber-300 font-bold hover:bg-amber-100/80',
        isAlert: true,
      };
    }
    if (t.dpsScore >= 85) {
      return {
        key: 'improving',
        label: 'Improving',
        classes: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-medium',
        isAlert: false,
      };
    }
    if (t.dpsScore >= 70) {
      return {
        key: 'stable_journey',
        label: 'Stable journey',
        classes: 'bg-stone-50 text-stone-700 border-stone-200 font-medium',
        isAlert: false,
      };
    }
    return {
      key: 'no_signal',
      label: '—',
      classes: 'text-stone-400 font-mono',
      isAlert: false,
    };
  };

  // Filter logic
  const filteredQueue = queue.filter(t => {
    if (filter === 'waiting' && t.status !== 'waiting' && t.status !== 'called') return false;
    if (filter === 'stagnant' && !t.stagnationFlag) return false;
    if (filter === 'skipped' && t.status !== 'skipped') return false;

    if (pulseFilter !== 'all') {
      const pulse = getPulseInfo(t);
      if (pulseFilter === 'stable' && pulse.code !== 'QUEUE_STABLE') return false;
      if (pulseFilter === 'moving' && pulse.code !== 'QUEUE_MOVING') return false;
      if (pulseFilter === 'reviewing' && pulse.code !== 'DOCTOR_REVIEWING') return false;
      if (pulseFilter === 'almost_turn' && pulse.code !== 'ALMOST_YOUR_TURN') return false;
      if (pulseFilter === 'delayed' && pulse.code !== 'SLIGHT_DELAY') return false;
      if (pulseFilter === 'your_turn' && pulse.code !== 'YOUR_TURN' && pulse.code !== 'PLEASE_REPORT') return false;
    }

    if (clinicalSignalFilter !== 'all') {
      const sig = getClinicalSignal(t);
      if (sig.key !== clinicalSignalFilter) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (t.patientName || '').toLowerCase().includes(q);
      const matchToken = (t.tokenNumber || '').toLowerCase().includes(q);
      const matchReason = (t.symptomsSummary || '').toLowerCase().includes(q);
      if (!matchName && !matchToken && !matchReason) return false;
    }

    return true;
  });

  const stagnantCount = queue.filter(t => t.stagnationFlag && t.status === 'waiting').length;
  const stableCount = queue.filter(t => !t.stagnationFlag && t.status !== 'skipped' && t.dpsScore >= 70).length;
  const attentionCount = queue.filter(t => (t.stagnationFlag || (t.dpsScore >= 50 && t.dpsScore < 70) || t.sanctuary_state === 'SLIGHT_DELAY') && t.status !== 'skipped').length;
  const urgentCount = queue.filter(t => t.status === 'skipped' || t.priority === 'urgent' || (t.dpsScore < 50 && t.stagnationFlag)).length;

  const handlePauseToggle = () => {
    const nextState = !isPaused;
    DataStore.pauseQueue(nextState);
    setIsPaused(nextState);
    if (onStateChange) onStateChange();
  };

  const handleCall = (token: Token) => {
    DataStore.callToken(token.id);
    if (onStateChange) onStateChange();
  };

  const handleDoctorStatusChange = (doctorId: string, status: Doctor['status']) => {
    DataStore.updateDoctorStatus(doctorId, status);
    if (status === 'reviewing_history') {
      const upcoming = queue.find(t => t.doctorId === doctorId && (t.status === 'waiting' || t.status === 'called'));
      if (upcoming) {
        DataStore.doctorReviewHistory(upcoming.id, doctorId);
      }
    }
    if (onStateChange) onStateChange();
  };

  // Operational status pill
  const getStatusPill = (status: string) => {
    switch (status) {
      case 'in_consultation':
      case 'in_treatment':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>In Treatment</span>
          </span>
        );
      case 'called':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200">
            Called
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-600 border border-stone-200">
            Completed
          </span>
        );
      case 'skipped':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            Skipped
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200">
            Waiting
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Rebalance Action */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">Live Smart Queue Command</h2>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
              isPaused 
                ? 'bg-amber-50 text-amber-800 border-amber-300' 
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              {isPaused ? '⏸ Paused' : `${queue.filter(t => t.status === 'waiting').length} Active in Lounge`}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Zero-friction token routing powered by Longitudinal Diagnostic Progress Score (DPS).
          </p>
        </div>

        {/* Primary Operational Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onRebalanceDPS}
            className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5"
          >
            <Zap className="w-4 h-4" />
            <span>Rebalance Queue by DPS</span>
          </button>

          <button
            onClick={handlePauseToggle}
            className={`px-3.5 py-2.5 rounded-2xl border text-xs font-bold flex items-center space-x-1.5 transition-all ${
              isPaused 
                ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700' 
                : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'Resume Queue' : 'Pause Queue'}</span>
          </button>

          <button
            onClick={onAdvanceQueue}
            className="px-4 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5"
          >
            <Stethoscope className="w-4 h-4 text-emerald-400" />
            <span>Call Next</span>
          </button>
        </div>
      </div>

      {/* Stagnation Banner Alert (If any diagnostic delays present) */}
      {stagnantCount > 0 && (
        <div className="p-4 rounded-3xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900">
                {stagnantCount} Patient with Diagnostic Stagnation Detected in Queue (e.g. Token A-27)
              </h4>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Patients with repeat scans and multi-specialty transitions are prioritized for senior clinical review.
              </p>
            </div>
          </div>
          <button
            onClick={onRebalanceDPS}
            className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 shadow-xs"
          >
            Rebalance by DPS
          </button>
        </div>
      )}

      {/* Live Queue Visualization Timeline */}
      <QueueTimelineStrip
        queue={queue}
        onSelectToken={(token) => setQuickViewToken(token)}
        selectedTokenId={quickViewToken?.id}
      />

      {/* Admin / Judge Demo Controls: Simulate Queue */}
      <div className="bg-stone-900 text-white rounded-3xl p-5 shadow-sm border border-stone-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
              Simulate Queue Control (Syncs Live to Patient Mobile & Supabase)
            </h3>
          </div>
          <span className="text-[10px] font-mono bg-stone-800 text-stone-300 px-2 py-0.5 rounded border border-stone-700">
            Admin / Judge Demo
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={() => {
              DataStore.advanceQueueSimulation();
              if (onStateChange) onStateChange();
            }}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs"
            title="Advance queue by 1 token"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Advance Queue</span>
          </button>

          <button
            onClick={() => {
              DataStore.triggerDelaySimulation();
              if (onStateChange) onStateChange();
            }}
            className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs"
            title="Trigger or resolve slight clinic delay"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Trigger Delay</span>
          </button>

          <button
            onClick={() => {
              const target = queue.find(t => t.status === 'waiting');
              DataStore.doctorReviewingSimulation(target?.id);
              if (onStateChange) onStateChange();
            }}
            className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs"
            title="Notify upcoming patient: Doctor reviewing history"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Doctor Reviewing</span>
          </button>

          <button
            onClick={() => {
              const target = queue.find(t => t.status === 'waiting');
              DataStore.approachingTurnSimulation(target?.id);
              if (onStateChange) onStateChange();
            }}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs"
            title="Notify patient: Almost your turn (Position #2)"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Approaching Turn</span>
          </button>

          <button
            onClick={() => {
              const target = queue.find(t => t.status === 'waiting');
              DataStore.callPatientSimulation(target?.id);
              if (onStateChange) onStateChange();
            }}
            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs"
            title="Call patient: You're next / Please report"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Call Patient</span>
          </button>
        </div>
      </div>

      {/* Doctor Micro-Status Controller */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-extrabold text-stone-800 uppercase tracking-wider">
            Active Clinician Micro-Statuses (Controls Sanctuary Pulse on Patient Mobile)
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold">
            ● Real-time Mobile Sync
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {doctors.map((doc) => (
            <div key={doc.id} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-900 block truncate">{doc.name}</span>
                <span className="text-[11px] text-stone-500">Room {doc.room} • {doc.specialty.split(' ')[0]}</span>
              </div>
              <select
                value={doc.status}
                onChange={(e) => handleDoctorStatusChange(doc.id, e.target.value as Doctor['status'])}
                className="text-xs font-bold bg-white border border-stone-200 rounded-xl px-2.5 py-1.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900"
              >
                <option value="consulting">In Consultation</option>
                <option value="reviewing_history">Reviewing History</option>
                <option value="finishing_consult">Finishing Consult</option>
                <option value="break">On Break</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
        
        {/* Table Top Bar with Quick Search & Filters */}
        <div className="p-4 border-b border-stone-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filter === 'all' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              All Tokens ({queue.length})
            </button>
            <button
              onClick={() => setFilter('waiting')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filter === 'waiting' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Waiting Only ({queue.filter(t => t.status === 'waiting').length})
            </button>
            <button
              onClick={() => setFilter('stagnant')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filter === 'stagnant' ? 'bg-amber-600 text-white' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Review Cases ({queue.filter(t => t.stagnationFlag).length})
            </button>
            <button
              onClick={() => setFilter('skipped')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filter === 'skipped' ? 'bg-stone-800 text-white' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Skipped ({queue.filter(t => t.status === 'skipped').length})
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative w-full md:w-48">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter tokens..."
                className="w-full pl-7 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table Content */}
        {filteredQueue.length === 0 ? (
          <div className="p-10">
            <EmptyState 
              type={filter === 'stagnant' ? 'no-diagnostic-concern' : 'no-queue'}
              title={
                filter === 'stagnant' 
                  ? 'No diagnostic concern detected'
                  : 'No queue tokens in this category'
              }
              description="Select another filter above or reset to view all patient tokens."
              actionLabel="View All Tokens"
              onAction={() => {
                setFilter('all');
                setSearchQuery('');
              }}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50/70 border-b border-stone-200/80 text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 pl-6">Patient</th>
                  <th className="py-3.5 px-3">Token</th>
                  <th className="py-3.5 px-3 hidden md:table-cell">Reason</th>
                  <th className="py-3.5 px-3">Doctor</th>
                  <th className="py-3.5 px-3 hidden lg:table-cell">Queue Pos</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3">Sanctuary Pulse</th>
                  <th className="py-3.5 px-3">Clinical Signal</th>
                  <th className="py-3.5 px-4 pr-6 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-100">
                {filteredQueue.map((token) => {
                  const pulse = getPulseInfo(token);
                  const signal = getClinicalSignal(token);
                  const isSelected = quickViewToken?.id === token.id;

                  return (
                    <tr 
                      key={token.id}
                      onClick={() => setQuickViewToken(token)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-stone-100/70' : 'hover:bg-stone-50/70'
                      }`}
                    >
                      {/* 1. Patient */}
                      <td className="py-3.5 px-4 pl-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center font-bold text-stone-700 text-xs shrink-0">
                            {token.patientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <span className="font-semibold text-stone-900 block truncate max-w-[140px]">
                              {token.patientName}
                            </span>
                            <span className="text-[11px] text-stone-400 block font-mono">
                              {token.patientAge}y • {token.patientGender}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 2. Token */}
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-1 rounded-md bg-stone-100 text-stone-900 font-mono font-bold text-xs border border-stone-200">
                          {token.tokenNumber}
                        </span>
                      </td>

                      {/* 3. Reason */}
                      <td className="py-3.5 px-3 hidden md:table-cell">
                        <span className="text-xs text-stone-600 block max-w-[180px] truncate">
                          {token.symptomsSummary || 'General consultation'}
                        </span>
                      </td>

                      {/* 4. Doctor */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold shrink-0">
                            {token.doctorName.replace('Dr. ', '')[0]}
                          </div>
                          <div>
                            <span className="font-medium text-stone-900 block truncate max-w-[110px]">
                              {token.doctorName}
                            </span>
                            <span className="text-[10px] text-stone-400 block">
                              Room {token.roomNumber || '101'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 5. Queue Pos */}
                      <td className="py-3.5 px-3 hidden lg:table-cell font-mono">
                        {token.status === 'in_consultation' ? (
                          <span className="text-emerald-700 font-bold">In Suite</span>
                        ) : token.status === 'called' ? (
                          <span className="text-sky-700 font-bold">Next</span>
                        ) : (
                          <span className="text-stone-700 font-semibold">#{token.queuePosition || 1}</span>
                        )}
                      </td>

                      {/* 6. Status */}
                      <td className="py-3.5 px-3">
                        {getStatusPill(token.status)}
                      </td>

                      {/* 7. Sanctuary Pulse */}
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-800 border border-stone-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span className="truncate max-w-[140px]">{pulse.title}</span>
                        </span>
                      </td>

                      {/* 8. Clinical Signal */}
                      <td className="py-3.5 px-3">
                        {signal.key !== 'no_signal' ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (signal.isAlert && onNavigateToDiagnosticJourney) {
                                onNavigateToDiagnosticJourney(token.patientId);
                              } else {
                                setQuickViewToken(token);
                              }
                            }}
                            className={`px-2.5 py-0.5 rounded-full text-[11px] border transition-all inline-flex items-center space-x-1 ${signal.classes}`}
                            title={signal.isAlert ? "Click to open Diagnostic Journey" : undefined}
                          >
                            {signal.isAlert && <AlertTriangle className="w-2.5 h-2.5 shrink-0 text-amber-700" />}
                            <span>{signal.label}</span>
                          </button>
                        ) : (
                          <span className="text-stone-400 font-mono pl-3">—</span>
                        )}
                      </td>

                      {/* 9. Action */}
                      <td className="py-3.5 px-4 pr-6 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuickViewToken(token);
                          }}
                          className="px-3 py-1 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300 text-stone-700 text-xs font-semibold transition-all inline-flex items-center space-x-1"
                        >
                          <span>View</span>
                          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Right-Side Quick View Drawer */}
      <PatientQuickViewDrawer
        token={quickViewToken}
        doctor={doctors.find(d => d.id === quickViewToken?.doctorId || d.name === quickViewToken?.doctorName)}
        onClose={() => setQuickViewToken(null)}
        onOpenSnapshot={(t) => {
          if (onOpenSnapshot) onOpenSnapshot(t);
        }}
        onNavigateToRecords={(id) => {
          onSelectPatient(id);
        }}
        onNavigateToDiagnosticJourney={(id) => {
          if (onNavigateToDiagnosticJourney) onNavigateToDiagnosticJourney(id);
        }}
        onStateChange={onStateChange}
      />

    </div>
  );
};
