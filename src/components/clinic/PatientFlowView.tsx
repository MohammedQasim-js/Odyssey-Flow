import React, { useState, useMemo } from 'react';
import { 
  Calendar, Filter, Download, Plus, Search, Stethoscope, 
  Clock, AlertTriangle, CheckCircle2, ChevronRight, RotateCcw, 
  Play, Pause, Zap, Sparkles, ChevronDown, RefreshCw, X,
  User, Check, Layers, SlidersHorizontal, ArrowRight, LayoutList,
  GitCommit, Activity, ShieldCheck
} from 'lucide-react';
import { Token, Doctor } from '../../types';
import { DataStore } from '../../services/dataStore';
import { SanctuaryPulseEngine } from '../../services/sanctuaryPulseEngine';
import { PatientQuickViewDrawer } from './PatientQuickViewDrawer';
import { EmptyState } from '../common/StateFeedback';

export interface PatientFlowViewProps {
  queue: Token[];
  doctors: Doctor[];
  onOpenSnapshot: (token: Token) => void;
  onNavigateToRecords: (patientId: string) => void;
  onNavigateToDiagnosticJourney?: (patientId?: string) => void;
  onNavigateToQueue?: () => void;
  onOpenNewPatient?: () => void;
  onStateChange?: () => void;
}

export const PatientFlowView: React.FC<PatientFlowViewProps> = ({
  queue,
  doctors,
  onOpenSnapshot,
  onNavigateToRecords,
  onNavigateToDiagnosticJourney,
  onNavigateToQueue,
  onOpenNewPatient,
  onStateChange,
}) => {
  // View mode toggle: 'list' (default) vs 'flow'
  const [viewMode, setViewMode] = useState<'list' | 'flow'>('list');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedAttention, setSelectedAttention] = useState('all');
  const [selectedPulse, setSelectedPulse] = useState('all');

  // Quick View Drawer state
  const [quickViewToken, setQuickViewToken] = useState<Token | null>(null);

  // Operational Simulation / Manage Queue Panel
  const [isManageQueueOpen, setIsManageQueueOpen] = useState(false);
  const [isQueuePaused, setIsQueuePaused] = useState(DataStore.isQueuePaused());

  // Date selection state
  const [selectedDateLabel, setSelectedDateLabel] = useState('Today, 12 Sep 2026');
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Distinct departments from doctors
  const departments = useMemo(() => {
    const list = Array.from(new Set(doctors.map(d => d.specialty.split(' ')[0]))).filter(Boolean);
    return ['All Departments', ...list];
  }, [doctors]);

  // Sanctuary Pulse compact mapping
  const getCompactPulse = (t: Token) => {
    const doc = doctors.find(d => d.id === t.doctorId || d.name === t.doctorName);
    const pulse = SanctuaryPulseEngine.computePulseState(t, doc, t.queuePosition, t.sanctuary_state as any);

    let shortLabel = 'Queue stable';
    let dotColor = 'bg-emerald-500';

    if (t.status === 'in_consultation' || t.status === 'in_treatment') {
      shortLabel = 'In treatment';
      dotColor = 'bg-emerald-500 animate-pulse';
    } else if (t.status === 'called') {
      shortLabel = 'Called to bay';
      dotColor = 'bg-sky-500';
    } else if (pulse.stateCode === 'DOCTOR_REVIEWING') {
      shortLabel = 'Doctor reviewing';
      dotColor = 'bg-sky-500';
    } else if (pulse.stateCode === 'ALMOST_YOUR_TURN') {
      shortLabel = 'Almost your turn';
      dotColor = 'bg-indigo-500';
    } else if (pulse.stateCode === 'SLIGHT_DELAY') {
      shortLabel = 'Slight delay';
      dotColor = 'bg-amber-500';
    } else if (pulse.stateCode === 'QUEUE_MOVING') {
      shortLabel = 'Clinic moving';
      dotColor = 'bg-emerald-500';
    } else if (t.status === 'completed') {
      shortLabel = 'Visit complete';
      dotColor = 'bg-stone-400';
    }

    return {
      shortLabel,
      dotColor,
      fullMessage: pulse.message,
      fullTitle: pulse.title,
    };
  };

  // Clinical Attention mapping (Normal: —, Review recommended, Journey stagnating, Senior review)
  const getAttention = (t: Token) => {
    if (t.stagnationFlag && t.dpsScore < 50) {
      return {
        key: 'stagnating',
        label: 'Journey stagnating',
        classes: 'bg-rose-50 text-rose-800 border-rose-200/80 font-semibold',
      };
    }
    if (t.stagnationFlag || t.dpsScore <= 65) {
      return {
        key: 'review_recommended',
        label: 'Review recommended',
        classes: 'bg-amber-50 text-amber-900 border-amber-200/80 font-semibold',
      };
    }
    if (t.priority === 'senior_mdis') {
      return {
        key: 'senior',
        label: 'Senior review',
        classes: 'bg-indigo-50 text-indigo-900 border-indigo-200/80 font-semibold',
      };
    }
    return {
      key: 'normal',
      label: '—',
      classes: 'text-stone-300 font-mono',
    };
  };

  // Operational Status Pill
  const getStatusPill = (status: string) => {
    switch (status) {
      case 'in_consultation':
      case 'in_treatment':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>IN TREATMENT</span>
          </span>
        );
      case 'called':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200">
            <span>CALLED</span>
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-600 border border-stone-200">
            COMPLETED
          </span>
        );
      case 'skipped':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            SKIPPED
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-400 border border-stone-200 line-through">
            CANCELLED
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200">
            WAITING
          </span>
        );
    }
  };

  // Filtered Queue
  const filteredQueue = useMemo(() => {
    return queue.filter((t) => {
      // Doctor filter
      if (selectedDoctor !== 'all' && t.doctorId !== selectedDoctor) return false;

      // Status filter
      if (selectedStatus !== 'all') {
        if (selectedStatus === 'in_treatment' && t.status !== 'in_consultation' && t.status !== 'in_treatment') return false;
        else if (selectedStatus !== 'in_treatment' && t.status !== selectedStatus) return false;
      }

      // Department filter
      if (selectedDepartment !== 'all') {
        const match = (t.specialty || '').toLowerCase().includes(selectedDepartment.toLowerCase().replace('all departments', ''));
        if (!match) return false;
      }

      // Attention filter
      if (selectedAttention !== 'all') {
        const att = getAttention(t);
        if (selectedAttention !== att.key) return false;
      }

      // Sanctuary Pulse filter
      if (selectedPulse !== 'all') {
        const pulse = getCompactPulse(t);
        if (selectedPulse === 'stable' && !pulse.shortLabel.includes('stable')) return false;
        if (selectedPulse === 'moving' && !pulse.shortLabel.includes('moving')) return false;
        if (selectedPulse === 'reviewing' && !pulse.shortLabel.includes('reviewing')) return false;
        if (selectedPulse === 'almost_turn' && !pulse.shortLabel.includes('Almost')) return false;
        if (selectedPulse === 'delay' && !pulse.shortLabel.includes('delay')) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = (t.patientName || '').toLowerCase().includes(q);
        const matchToken = (t.tokenNumber || '').toLowerCase().includes(q);
        const matchReason = (t.symptomsSummary || '').toLowerCase().includes(q);
        const matchDoctor = (t.doctorName || '').toLowerCase().includes(q);
        if (!matchName && !matchToken && !matchReason && !matchDoctor) return false;
      }

      return true;
    });
  }, [
    queue,
    selectedDoctor,
    selectedStatus,
    selectedDepartment,
    selectedAttention,
    selectedPulse,
    searchQuery
  ]);

  // Primary Call Next logic
  const handleCallNext = () => {
    const waitingList = queue.filter(t => t.status === 'waiting');
    const calledToken = queue.find(t => t.status === 'called');

    if (calledToken) {
      DataStore.startConsultation(calledToken.id);
    }

    if (waitingList.length > 0) {
      const nextToken = waitingList[0];
      DataStore.callToken(nextToken.id);
      DataStore.advanceQueueSimulation();
      showToast(`Token ${nextToken.tokenNumber} (${nextToken.patientName}) called to Room ${nextToken.roomNumber || '101'}`);
    } else {
      DataStore.advanceQueueSimulation();
      showToast('Queue advanced to next interval');
    }

    if (onStateChange) onStateChange();
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDoctor('all');
    setSelectedStatus('all');
    setSelectedDepartment('all');
    setSelectedAttention('all');
    setSelectedPulse('all');
  };

  const isAnyFilterActive = searchQuery || selectedDoctor !== 'all' || selectedStatus !== 'all' || selectedDepartment !== 'all' || selectedAttention !== 'all' || selectedPulse !== 'all';

  // Queue Visualization: Current, Next, Your Queue, Following
  const queueSequence = useMemo(() => {
    const inConsult = queue.find(t => t.status === 'in_consultation' || t.status === 'in_treatment');
    const called = queue.find(t => t.status === 'called');
    const waiting = queue.filter(t => t.status === 'waiting');

    const items: Array<{
      role: 'CURRENT' | 'NEXT' | 'YOUR QUEUE' | 'FOLLOWING';
      token: Token;
      tagColor: string;
    }> = [];

    if (inConsult) {
      items.push({
        role: 'CURRENT',
        token: inConsult,
        tagColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      });
    }

    if (called && (!inConsult || called.id !== inConsult.id)) {
      items.push({
        role: 'NEXT',
        token: called,
        tagColor: 'bg-sky-50 text-sky-800 border-sky-200',
      });
    }

    // Identify target token (e.g. A-27 or first waiting)
    const targetAarav = waiting.find(t => t.tokenNumber === 'A-27') || waiting[0];
    if (targetAarav && !items.some(i => i.token.id === targetAarav.id)) {
      items.push({
        role: 'YOUR QUEUE',
        token: targetAarav,
        tagColor: 'bg-stone-900 text-white border-stone-900',
      });
    }

    // Subsequent waiting tokens
    waiting.forEach((t) => {
      if (items.length >= 4) return;
      if (!items.some(i => i.token.id === t.id)) {
        items.push({
          role: 'FOLLOWING',
          token: t,
          tagColor: 'bg-stone-100 text-stone-700 border-stone-200',
        });
      }
    });

    return items;
  }, [queue]);

  return (
    <div className="space-y-5 font-sans text-stone-900">
      
      {/* Action Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-stone-700 flex items-center space-x-2 text-xs font-semibold animate-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. PAGE HEADER */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
                Patient Flow
              </h1>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>LIVE QUEUE</span>
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1 font-medium">
              Real-time operational queue monitoring from lounge check-in to consultation.
            </p>
          </div>

          {/* Right Header Controls: View Mode Toggle, Call Next, + New Patient */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            
            {/* View Mode Toggle: List vs Flow (Default: List) */}
            <div className="bg-stone-100 p-1 rounded-xl flex items-center border border-stone-200/70 text-xs font-bold">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span>List</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('flow')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                  viewMode === 'flow'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <GitCommit className="w-3.5 h-3.5" />
                <span>Flow</span>
              </button>
            </div>

            {/* Date Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDateMenuOpen(!isDateMenuOpen)}
                className="px-3.5 py-2 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold flex items-center space-x-2 transition-all"
              >
                <Calendar className="w-3.5 h-3.5 text-stone-500" />
                <span>{selectedDateLabel}</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {isDateMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl shadow-lg border border-stone-200 py-1.5 z-30 text-xs font-medium">
                  {['Today, 12 Sep 2026', 'Yesterday, 11 Sep 2026', 'Tomorrow, 13 Sep 2026'].map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        setSelectedDateLabel(d);
                        setIsDateMenuOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-stone-50 text-stone-700 flex items-center justify-between"
                    >
                      <span>{d}</span>
                      {selectedDateLabel === d && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Manage Queue Toggle */}
            <button
              type="button"
              onClick={() => setIsManageQueueOpen(!isManageQueueOpen)}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                isManageQueueOpen 
                  ? 'bg-stone-900 text-white border-stone-900' 
                  : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
              }`}
              title="Queue simulation & actions"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Simulate</span>
            </button>

            {/* Primary Action: Call Next */}
            <button
              type="button"
              onClick={handleCallNext}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all flex items-center space-x-1.5 shadow-xs"
            >
              <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
              <span>Call Next</span>
            </button>

            {/* + New Patient */}
            {onOpenNewPatient && (
              <button
                type="button"
                onClick={onOpenNewPatient}
                className="px-3.5 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold flex items-center space-x-1 shadow-xs transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>New Patient</span>
              </button>
            )}

          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. QUEUE VISUALIZATION (Compact Sequence Above Table) */}
      {/* ======================================================== */}
      {queueSequence.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Live Queue Progression
            </span>
            <span className="text-[10px] text-stone-400 font-mono">
              Click token to inspect
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {queueSequence.map((item, idx) => {
              const isTargetSelected = quickViewToken?.id === item.token.id;
              return (
                <div
                  key={item.token.id}
                  onClick={() => setQuickViewToken(item.token)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isTargetSelected
                      ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                      : 'border-stone-200/80 bg-stone-50/50 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${item.tagColor}`}>
                      {item.role}
                    </span>
                    <span className="text-xs font-extrabold font-mono text-stone-900">
                      {item.token.tokenNumber}
                    </span>
                  </div>

                  <div className="mt-2.5">
                    <span className="text-xs font-bold text-stone-900 truncate block">
                      {item.token.patientName}
                    </span>
                    <span className="text-[10px] text-stone-500 truncate block mt-0.5">
                      {item.token.doctorName}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. FILTER BAR (Outside the table) */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-2xs space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 text-xs">
          
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patient, token, reason..."
              className="w-full pl-8 pr-7 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Doctor Filter */}
          <div>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full px-2.5 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-900"
            >
              <option value="all">All Doctors</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-900"
            >
              <option value="all">All Statuses</option>
              <option value="waiting">Waiting</option>
              <option value="called">Called</option>
              <option value="in_treatment">In Treatment</option>
              <option value="completed">Completed</option>
              <option value="skipped">Skipped</option>
            </select>
          </div>

          {/* Attention Filter */}
          <div>
            <select
              value={selectedAttention}
              onChange={(e) => setSelectedAttention(e.target.value)}
              className="w-full px-2.5 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-900"
            >
              <option value="all">All Attention Levels</option>
              <option value="normal">Normal (—)</option>
              <option value="review_recommended">Review Recommended</option>
              <option value="stagnating">Journey Stagnating</option>
              <option value="senior">Senior Review</option>
            </select>
          </div>

          {/* Sanctuary Pulse Filter */}
          <div>
            <select
              value={selectedPulse}
              onChange={(e) => setSelectedPulse(e.target.value)}
              className="w-full px-2.5 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-900"
            >
              <option value="all">All Pulse States</option>
              <option value="stable">Queue stable</option>
              <option value="moving">Clinic moving</option>
              <option value="reviewing">Doctor reviewing</option>
              <option value="almost_turn">Almost your turn</option>
              <option value="delay">Slight delay</option>
            </select>
          </div>

        </div>

        {/* Active Filter Clear Helper */}
        {isAnyFilterActive && (
          <div className="flex items-center justify-between pt-1 text-xs text-stone-500 border-t border-stone-100">
            <span>Filtering {filteredQueue.length} of {queue.length} active records</span>
            <button
              type="button"
              onClick={handleResetFilters}
              className="font-semibold text-stone-800 hover:text-stone-950 underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* SIMULATE & OPERATIONS PANEL */}
      {/* ======================================================== */}
      {isManageQueueOpen && (
        <div className="bg-stone-900 text-white rounded-3xl p-5 border border-stone-800 shadow-md space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                Queue Simulation Controls
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsManageQueueOpen(false)}
              className="text-stone-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <button
              type="button"
              onClick={() => {
                DataStore.advanceQueueSimulation();
                showToast('Advanced queue simulation by 1 step');
                if (onStateChange) onStateChange();
              }}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold flex items-center space-x-1.5"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>Step Queue</span>
            </button>

            <button
              type="button"
              onClick={() => {
                DataStore.triggerDelaySimulation();
                showToast('Toggled slight delay notice');
                if (onStateChange) onStateChange();
              }}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold flex items-center space-x-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Broadcast Delay</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const target = queue.find(t => t.status === 'waiting');
                DataStore.doctorReviewingSimulation(target?.id);
                showToast(`Broadcasted: Doctor reviewing for ${target?.tokenNumber || 'A-27'}`);
                if (onStateChange) onStateChange();
              }}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold flex items-center space-x-1.5"
            >
              <Stethoscope className="w-3.5 h-3.5 text-sky-400" />
              <span>Doctor Reviewing</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const target = queue.find(t => t.status === 'waiting');
                DataStore.approachingTurnSimulation(target?.id);
                showToast(`Broadcasted: Almost your turn for ${target?.tokenNumber || 'A-27'}`);
                if (onStateChange) onStateChange();
              }}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold flex items-center space-x-1.5"
            >
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span>Approaching Turn</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. MAIN VIEW: LIST (TABLE) OR FLOW (VISUAL STAGES) */}
      {/* ======================================================== */}
      
      {viewMode === 'list' ? (
        /* ======================================================== */
        /* REDESIGNED PATIENT FLOW TABLE (EXACT 8 COLUMNS) */
        /* ======================================================== */
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
          
          {/* Table Header Bar */}
          <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-stone-900">
                Patient Queue Roster
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                {filteredQueue.length} {filteredQueue.length === 1 ? 'patient' : 'patients'}
              </span>
            </div>

            <span className="text-[11px] text-stone-400 font-mono hidden sm:inline">
              Click row to open Quick View drawer
            </span>
          </div>

          {filteredQueue.length === 0 ? (
            <div className="p-12 text-center">
              <EmptyState
                type="no-search-results"
                title="No matching patients found"
                description="Try clearing search keywords or resetting your filter criteria."
                actionLabel="Clear Filters"
                onAction={handleResetFilters}
              />
            </div>
          ) : (
            <>
              {/* Desktop / Tablet Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="bg-stone-50/75 border-b border-stone-200/80 text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4 pl-6 w-[28%]">PATIENT</th>
                      <th className="py-3.5 px-4 w-[11%]">TOKEN</th>
                      <th className="py-3.5 px-4 w-[16%]">DOCTOR</th>
                      <th className="py-3.5 px-4 w-[11%]">QUEUE</th>
                      <th className="py-3.5 px-4 w-[12%]">STATUS</th>
                      <th className="py-3.5 px-4 w-[12%]">PULSE</th>
                      <th className="py-3.5 px-4 w-[14%]">ATTENTION</th>
                      <th className="py-3.5 px-4 pr-6 text-right w-[8%]">ACTION</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-stone-100">
                    {filteredQueue.map((token) => {
                      const pulse = getCompactPulse(token);
                      const attention = getAttention(token);
                      const isSelected = quickViewToken?.id === token.id;
                      const patientsAhead = Math.max(0, (token.queuePosition || 1) - 1);
                      const estimatedWait = token.estimatedWaitMin || (patientsAhead + 1) * 4;

                      return (
                        <tr
                          key={token.id}
                          onClick={() => setQuickViewToken(token)}
                          className={`cursor-pointer transition-colors ${
                            isSelected 
                              ? 'bg-stone-100/80' 
                              : 'hover:bg-stone-50/70'
                          }`}
                          style={{ height: '78px' }}
                        >
                          
                          {/* COLUMN 1 — PATIENT (Widest column) */}
                          <td className="py-3.5 px-4 pl-6">
                            <div className="flex items-center space-x-3.5">
                              {/* Avatar */}
                              <div className="w-10 h-10 rounded-2xl bg-stone-100 border border-stone-200/80 flex items-center justify-center font-bold text-stone-800 text-xs shrink-0 font-mono">
                                {token.patientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </div>

                              <div className="min-w-0 flex-1">
                                {/* Patient name (strongest text) */}
                                <span className="font-extrabold text-stone-900 text-sm block truncate">
                                  {token.patientName}
                                </span>
                                {/* Age / gender in a small muted line */}
                                <span className="text-[11px] text-stone-400 block font-mono">
                                  {token.patientAge} {token.patientGender.charAt(0)}
                                </span>
                                {/* Current visit reason underneath in smaller text */}
                                <span className="text-[11px] text-stone-500 block truncate max-w-[200px] mt-0.5" title={token.symptomsSummary}>
                                  {token.symptomsSummary || 'General consultation'}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* COLUMN 2 — TOKEN */}
                          <td className="py-3.5 px-4">
                            <div className="font-mono">
                              <span className="font-black text-stone-900 text-sm tracking-tight block">
                                {token.tokenNumber}
                              </span>
                              <span className="text-[10px] text-stone-400 font-sans block mt-0.5 whitespace-nowrap">
                                {token.status === 'in_consultation' ? 'in suite' : `#${token.queuePosition || 1} in queue`}
                              </span>
                            </div>
                          </td>

                          {/* COLUMN 3 — DOCTOR */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-2.5">
                              <div className="w-8 h-8 rounded-full bg-emerald-100/80 text-emerald-900 flex items-center justify-center text-xs font-bold shrink-0 border border-emerald-200/60">
                                {token.doctorName.replace('Dr. ', '')[0]}
                              </div>
                              <div className="min-w-0">
                                <span className="font-semibold text-stone-900 text-xs block truncate max-w-[130px]">
                                  {token.doctorName}
                                </span>
                                <span className="text-[10px] text-stone-400 block truncate max-w-[130px]">
                                  {token.specialty || 'General Medicine'}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* COLUMN 4 — QUEUE (Vertical hierarchy: #7, 6 ahead, ~24 min) */}
                          <td className="py-3.5 px-4 font-mono">
                            {token.status === 'in_consultation' ? (
                              <div>
                                <span className="font-bold text-emerald-800 block text-xs">In Suite</span>
                                <span className="text-[10px] text-stone-400 font-sans block mt-0.5">Active now</span>
                              </div>
                            ) : token.status === 'called' ? (
                              <div>
                                <span className="font-bold text-sky-800 block text-xs">Next</span>
                                <span className="text-[10px] text-stone-500 font-sans block mt-0.5">Called to bay</span>
                              </div>
                            ) : token.status === 'completed' ? (
                              <div>
                                <span className="text-stone-400 block text-xs">Done</span>
                                <span className="text-[10px] text-stone-300 font-sans block mt-0.5">—</span>
                              </div>
                            ) : (
                              <div>
                                <span className="font-extrabold text-stone-900 block text-xs">
                                  #{token.queuePosition || 1}
                                </span>
                                <span className="text-[11px] text-stone-500 font-sans block mt-0.5">
                                  {patientsAhead} ahead
                                </span>
                                <span className="text-[10px] text-emerald-700 font-sans block">
                                  ~{estimatedWait} min
                                </span>
                              </div>
                            )}
                          </td>

                          {/* COLUMN 5 — STATUS (Operational status pill) */}
                          <td className="py-3.5 px-4">
                            {getStatusPill(token.status)}
                          </td>

                          {/* COLUMN 6 — SANCTUARY PULSE (Compact indicator with hover message) */}
                          <td className="py-3.5 px-4">
                            <div 
                              className="flex items-center space-x-1.5 cursor-help"
                              title={pulse.fullMessage}
                            >
                              <span className={`w-2 h-2 rounded-full shrink-0 ${pulse.dotColor}`} />
                              <span className="text-xs font-semibold text-stone-700 truncate max-w-[125px]">
                                {pulse.shortLabel}
                              </span>
                            </div>
                          </td>

                          {/* COLUMN 7 — ATTENTION (— or badge) */}
                          <td className="py-3.5 px-4">
                            {attention.key === 'normal' ? (
                              <span className="text-stone-300 font-mono text-xs pl-2">—</span>
                            ) : (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] border whitespace-nowrap ${attention.classes}`}>
                                {attention.label}
                              </span>
                            )}
                          </td>

                          {/* COLUMN 8 — ACTION (View button) */}
                          <td className="py-3.5 px-4 pr-6 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setQuickViewToken(token);
                              }}
                              className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300 active:scale-95 text-stone-800 text-xs font-bold transition-all inline-flex items-center space-x-1 shadow-2xs"
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

              {/* Mobile Structured Card Layout (Prevents horizontal overflow on small screens) */}
              <div className="md:hidden divide-y divide-stone-100">
                {filteredQueue.map((token) => {
                  const pulse = getCompactPulse(token);
                  const attention = getAttention(token);

                  return (
                    <div
                      key={token.id}
                      onClick={() => setQuickViewToken(token)}
                      className="p-4 space-y-3 cursor-pointer hover:bg-stone-50/70 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center font-bold text-stone-800 text-xs font-mono">
                            {token.patientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <span className="font-extrabold text-stone-900 text-sm block">
                              {token.patientName}
                            </span>
                            <span className="text-[11px] text-stone-400 font-mono">
                              {token.patientAge} {token.patientGender.charAt(0)} • {token.symptomsSummary}
                            </span>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-lg bg-stone-900 text-white font-mono font-bold text-xs">
                          {token.tokenNumber}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-stone-100">
                        <div>
                          <span className="text-[10px] text-stone-400 uppercase font-semibold block">Clinician</span>
                          <span className="font-semibold text-stone-800">{token.doctorName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 uppercase font-semibold block">Queue</span>
                          <span className="font-mono text-stone-800">#{token.queuePosition || 1}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center space-x-1.5">
                          <span className={`w-2 h-2 rounded-full ${pulse.dotColor}`} />
                          <span className="text-xs font-semibold text-stone-700">{pulse.shortLabel}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          {attention.key !== 'normal' && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] border ${attention.classes}`}>
                              {attention.label}
                            </span>
                          )}
                          <span className="text-xs font-bold text-emerald-700 flex items-center">
                            <span>View</span>
                            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

        </div>
      ) : (
        /* ======================================================== */
        /* FLOW MODE: VISUAL QUEUE PROGRESSION LANES */
        /* ======================================================== */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Lane 1: In Treatment */}
            <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-xs font-extrabold text-stone-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>In Treatment</span>
                </span>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {queue.filter(t => t.status === 'in_consultation' || t.status === 'in_treatment').length}
                </span>
              </div>

              <div className="space-y-2.5">
                {queue.filter(t => t.status === 'in_consultation' || t.status === 'in_treatment').map(t => (
                  <div
                    key={t.id}
                    onClick={() => setQuickViewToken(t)}
                    className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 hover:bg-emerald-50 cursor-pointer transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-stone-900">{t.patientName}</span>
                      <span className="font-mono font-bold text-xs bg-stone-900 text-white px-2 py-0.5 rounded-md">
                        {t.tokenNumber}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 truncate">{t.symptomsSummary}</p>
                    <div className="flex items-center justify-between pt-1 text-[11px] border-t border-emerald-200/60">
                      <span className="font-medium text-stone-700">{t.doctorName}</span>
                      <span className="text-emerald-800 font-bold">In Suite</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lane 2: Called */}
            <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-xs font-extrabold text-stone-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                  <span>Called</span>
                </span>
                <span className="text-xs font-mono font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-full">
                  {queue.filter(t => t.status === 'called').length}
                </span>
              </div>

              <div className="space-y-2.5">
                {queue.filter(t => t.status === 'called').map(t => (
                  <div
                    key={t.id}
                    onClick={() => setQuickViewToken(t)}
                    className="p-3.5 rounded-2xl bg-sky-50/50 border border-sky-200/70 hover:bg-sky-50 cursor-pointer transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-stone-900">{t.patientName}</span>
                      <span className="font-mono font-bold text-xs bg-stone-900 text-white px-2 py-0.5 rounded-md">
                        {t.tokenNumber}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 truncate">{t.symptomsSummary}</p>
                    <div className="flex items-center justify-between pt-1 text-[11px] border-t border-sky-200/60">
                      <span className="font-medium text-stone-700">{t.doctorName}</span>
                      <span className="text-sky-800 font-bold">Proceeding to bay</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lane 3: Waiting */}
            <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-2xs space-y-3 md:col-span-2">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-xs font-extrabold text-stone-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-stone-400"></span>
                  <span>Waiting in Lounge</span>
                </span>
                <span className="text-xs font-mono font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full">
                  {queue.filter(t => t.status === 'waiting').length}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {queue.filter(t => t.status === 'waiting').map(t => {
                  const attention = getAttention(t);
                  return (
                    <div
                      key={t.id}
                      onClick={() => setQuickViewToken(t)}
                      className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 hover:border-stone-300 hover:bg-stone-100/60 cursor-pointer transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-stone-900">{t.patientName}</span>
                        <span className="font-mono font-bold text-xs bg-stone-900 text-white px-2 py-0.5 rounded-md">
                          {t.tokenNumber}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 truncate">{t.symptomsSummary}</p>
                      
                      <div className="flex items-center justify-between pt-1 text-[11px] border-t border-stone-200/60">
                        <span className="text-stone-500 font-mono">#{t.queuePosition || 1} in queue</span>
                        {attention.key !== 'normal' ? (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] border ${attention.classes}`}>
                            {attention.label}
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-semibold font-mono">
                            ~{t.estimatedWaitMin || 12} min
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. PATIENT QUICK VIEW DRAWER */}
      {/* ======================================================== */}
      <PatientQuickViewDrawer
        token={quickViewToken}
        doctor={doctors.find(d => d.id === quickViewToken?.doctorId || d.name === quickViewToken?.doctorName)}
        onClose={() => setQuickViewToken(null)}
        onOpenSnapshot={onOpenSnapshot}
        onNavigateToRecords={onNavigateToRecords}
        onNavigateToDiagnosticJourney={onNavigateToDiagnosticJourney}
        onStateChange={onStateChange}
      />

    </div>
  );
};
