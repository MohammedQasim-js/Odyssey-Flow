import React, { useState, useMemo } from 'react';
import { 
  Users, Clock, Activity, AlertTriangle, Zap, 
  Stethoscope, ChevronRight, ArrowUpRight, CheckCircle2, 
  Pause, Play, SkipForward, RotateCcw, UserCheck, DollarSign, 
  DoorOpen, HeartPulse, Sparkles, Filter, MoreHorizontal,
  ShieldAlert, FileText, Search, TrendingUp, ArrowRight,
  ShieldCheck, BarChart3, AlertCircle, Layers, Eye
} from 'lucide-react';
import { Token, Doctor } from '../../types';
import { DataStore } from '../../services/dataStore';
import { SanctuaryPulseEngine, CANONICAL_PULSE_STATES } from '../../services/sanctuaryPulseEngine';
import { DemoControlCenter } from './DemoControlCenter';

interface ClinicDashboardProps {
  queue: Token[];
  doctors: Doctor[];
  onNavigateToQueue: () => void;
  onNavigateToRecords: (patientId?: string) => void;
  onOpenSnapshot: (token: Token) => void;
  onStateChange: () => void;
}

export const ClinicDashboard: React.FC<ClinicDashboardProps> = ({
  queue,
  doctors,
  onNavigateToQueue,
  onNavigateToRecords,
  onOpenSnapshot,
  onStateChange,
}) => {
  const [isPaused, setIsPaused] = useState(DataStore.isQueuePaused());
  const [patientFlowFilter, setPatientFlowFilter] = useState<'all' | 'waiting' | 'in_treatment' | 'stagnant' | 'completed'>('all');
  const [patientSearch, setPatientSearch] = useState('');
  const [showDemoControls, setShowDemoControls] = useState(true);

  // Queue categorizations
  const waitingTokens = queue.filter(t => t.status === 'waiting');
  const inConsultTokens = queue.filter(t => t.status === 'in_consultation' || t.status === 'called');
  const completedTokens = queue.filter(t => t.status === 'completed');
  const skippedTokens = queue.filter(t => t.status === 'skipped');
  const stagnantTokens = queue.filter(t => t.stagnationFlag && t.status !== 'completed');

  const currentServingToken = inConsultTokens[0] || queue.find(t => t.queuePosition === 0);
  const nextUpToken = waitingTokens[0];

  // Specific spotlight patient: Aarav Mehta (A-27)
  const aaravToken = queue.find(t => t.tokenNumber === 'A-27' || (t.patientName && t.patientName.includes('Aarav'))) || queue[0];

  // Filtered queue for the Live Patient Flow table
  const filteredQueue = useMemo(() => {
    return queue.filter(t => {
      // Text search
      if (patientSearch.trim()) {
        const query = patientSearch.toLowerCase();
        const matchName = (t.patientName || '').toLowerCase().includes(query);
        const matchToken = (t.tokenNumber || '').toLowerCase().includes(query);
        const matchDoctor = (t.doctorName || '').toLowerCase().includes(query);
        const matchSymptom = (t.symptomsSummary || '').toLowerCase().includes(query);
        if (!matchName && !matchToken && !matchDoctor && !matchSymptom) return false;
      }

      // Status filter
      if (patientFlowFilter === 'waiting') return t.status === 'waiting' || t.status === 'called';
      if (patientFlowFilter === 'in_treatment') return t.status === 'in_consultation';
      if (patientFlowFilter === 'stagnant') return t.stagnationFlag;
      if (patientFlowFilter === 'completed') return t.status === 'completed';
      return true;
    });
  }, [queue, patientFlowFilter, patientSearch]);

  // Handler for Queue Controls
  const handleCallNext = () => {
    const nextWaiting = waitingTokens[0];
    if (nextWaiting) {
      DataStore.callToken(nextWaiting.id);
      onStateChange();
      // Automatically trigger pre-consultation clinical snapshot
      onOpenSnapshot(nextWaiting);
    } else {
      DataStore.advanceQueue();
      onStateChange();
    }
  };

  const handlePauseToggle = () => {
    const nextState = !isPaused;
    DataStore.pauseQueue(nextState);
    setIsPaused(nextState);
    onStateChange();
  };

  const handleSkip = (tokenId: string) => {
    DataStore.skipToken(tokenId);
    onStateChange();
  };

  const handleRecall = (tokenId: string) => {
    DataStore.recallToken(tokenId);
    onStateChange();
  };

  const handleStartConsultation = (tokenId: string) => {
    DataStore.startConsultation(tokenId);
    onStateChange();
  };

  const handleCompleteVisit = (tokenId: string) => {
    DataStore.completeVisit(tokenId);
    onStateChange();
  };

  const handleRebalanceDPS = () => {
    DataStore.rebalanceQueueByDps();
    onStateChange();
  };

  const handleDoctorReviewHistory = (tokenId: string, doctorId: string) => {
    DataStore.doctorReviewHistory(tokenId, doctorId);
    onStateChange();
  };

  // Helper to get patient-specific pulse state for the Sanctuary Pulse card
  const getPatientPulseData = (t: Token) => {
    const doc = doctors.find(d => d.id === t.doctorId);
    return SanctuaryPulseEngine.computePulseState(t, doc, t.queuePosition);
  };

  return (
    <div className="space-y-6">
      
      {/* 0. Demo Control Center Toggle & Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Hackathon Demo Scenario Controls
            </span>
          </div>
          <button
            onClick={() => setShowDemoControls(!showDemoControls)}
            className="text-[11px] font-semibold text-stone-500 hover:text-stone-900 transition-colors"
          >
            {showDemoControls ? 'Collapse Simulation Bar ▲' : 'Expand Simulation Bar ▼'}
          </button>
        </div>

        {showDemoControls && (
          <DemoControlCenter
            queue={queue}
            onStateChange={onStateChange}
          />
        )}
      </div>

      {/* 1. Header Area: Greeting & Live Queue State Bar */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
              Good morning, Clinical Operations Team
            </h2>
            <span className={`text-[11px] font-bold px-3 py-0.5 rounded-full border ${
              isPaused 
                ? 'bg-amber-50 text-amber-800 border-amber-300' 
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              {isPaused ? '⏸ Queue Paused' : '● Live Operations Active'}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Odyssey Flow Command Center • Suites 101–106 • Real-time queue synthesized with Longitudinal Diagnostic Progress analysis.
          </p>
        </div>

        {/* Global Operational Queue Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleRebalanceDPS}
            className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-stone-950 text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-all"
            title="Reorder queue by Diagnostic Progress Score to prioritize stagnating complex cases"
          >
            <Zap className="w-4 h-4 text-stone-950" />
            <span>Rebalance by DPS</span>
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
            onClick={handleCallNext}
            className="px-4 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 active:bg-stone-950 text-white text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-all"
          >
            <Stethoscope className="w-4 h-4 text-emerald-400" />
            <span>Call Next ({nextUpToken ? nextUpToken.tokenNumber : 'A-27'})</span>
          </button>
        </div>
      </div>

      {/* 2. Pre-Consultation Alert (Prominent Clinical Stagnation Banner) */}
      {aaravToken && aaravToken.stagnationFlag && (
        <div className="p-5 rounded-3xl bg-amber-50/80 border border-amber-300/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-start space-x-3.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-md bg-amber-200/80 text-amber-950">
                  Pre-Consultation Alert
                </span>
                <span className="text-xs font-black text-stone-900">
                  Token {aaravToken.tokenNumber} ({aaravToken.patientName}) — Diagnostic Stagnation Detected
                </span>
                <span className="text-[10px] font-mono font-bold bg-white/80 px-2 py-0.5 rounded border border-amber-300 text-stone-800">
                  DPS: {aaravToken.dpsScore}/100
                </span>
              </div>
              <p className="text-xs text-amber-950/80 mt-1 leading-relaxed max-w-3xl">
                3 prior uncoordinated outpatient encounters across Cardiology &amp; Pulmonology for persistent chest tightness without etiology confirmation. Recommended 15-min consultation buffer &amp; immediate multidisciplinary clinical snapshot review.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 w-full md:w-auto">
            <button
              onClick={() => onOpenSnapshot(aaravToken)}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-all w-full md:w-auto justify-center"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Open Clinical Snapshot</span>
            </button>
            <button
              onClick={() => handleDoctorReviewHistory(aaravToken.id, aaravToken.doctorId)}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-100/70 border border-amber-300 text-stone-900 text-xs font-bold transition-all shrink-0"
              title="Notify patient that doctor is reviewing records"
            >
              Review History
            </button>
          </div>
        </div>
      )}

      {/* 3. KPI Row: 5 Core Healthcare Operations Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* 1. Active Queue */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-extrabold text-stone-400 tracking-wider">Active Queue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-stone-900">{waitingTokens.length + inConsultTokens.length}</span>
            <span className="text-xs text-stone-500 font-medium">in station</span>
          </div>
          <div className="mt-2 text-[11px] text-stone-500 flex items-center justify-between">
            <span>{waitingTokens.length} in lounge</span>
            <span className="font-semibold text-emerald-700">{inConsultTokens.length} in consult</span>
          </div>
        </div>

        {/* 2. Avg Wait Time */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-extrabold text-stone-400 tracking-wider">Avg Wait Time</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-stone-900">11.4 min</span>
            <span className="text-xs text-emerald-700 font-bold">-43% vs benchmark</span>
          </div>
          <div className="mt-2 text-[11px] text-stone-500 flex items-center justify-between">
            <span>Sanctuary Pacing</span>
            <span className="text-stone-700 font-mono font-semibold">Goal: &lt;15m</span>
          </div>
        </div>

        {/* 3. Patients Seen */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-extrabold text-stone-400 tracking-wider">Patients Seen</span>
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-stone-900">{completedTokens.length + 38}</span>
            <span className="text-xs text-stone-400 font-medium">/ 65 today</span>
          </div>
          <div className="mt-2 text-[11px] text-stone-500 flex items-center justify-between">
            <span className="text-emerald-700 font-semibold">+6 patients / hr</span>
            <span className="font-mono text-stone-500">58% of target</span>
          </div>
        </div>

        {/* 4. Stagnating Journeys */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-extrabold text-stone-400 tracking-wider">Stagnating Journeys</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-amber-950">{stagnantTokens.length} Flagged</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
              Needs Review
            </span>
          </div>
          <div className="mt-2 text-[11px] text-stone-500 flex items-center justify-between">
            <span>DPS &lt; 70 or unlinked</span>
            <span className="font-semibold text-amber-800 font-mono">Buffer Active</span>
          </div>
        </div>

        {/* 5. Doctor Utilization */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-extrabold text-stone-400 tracking-wider">Doctor Utilization</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-stone-900">91.2%</span>
            <span className="text-xs text-purple-700 font-semibold">Efficiency</span>
          </div>
          <div className="mt-2 text-[11px] text-stone-500 flex items-center justify-between">
            <span>{doctors.length} Doctors Active</span>
            <span className="text-emerald-700 font-bold">7 / 8 Suites</span>
          </div>
        </div>

      </div>

      {/* 4. Primary Area: Live Patient Flow (8 cols) & Sanctuary Pulse Clinic View (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: "Live Patient Flow" (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-stone-700" />
                <h3 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider">
                  Live Patient Flow
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Real-time queue synchronized with diagnostic progress and clinical telemetry.
              </p>
            </div>

            {/* Search Input for Patient Flow */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                placeholder="Filter by name, token, doctor..."
                className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setPatientFlowFilter('all')}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                patientFlowFilter === 'all'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All ({queue.length})
            </button>
            <button
              onClick={() => setPatientFlowFilter('waiting')}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                patientFlowFilter === 'waiting'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Waiting ({waitingTokens.length})
            </button>
            <button
              onClick={() => setPatientFlowFilter('in_treatment')}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                patientFlowFilter === 'in_treatment'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              In Treatment ({inConsultTokens.length})
            </button>
            <button
              onClick={() => setPatientFlowFilter('stagnant')}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                patientFlowFilter === 'stagnant'
                  ? 'bg-amber-500 text-stone-950 font-black'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              }`}
            >
              Flagged: Review Recommended ({stagnantTokens.length})
            </button>
            <button
              onClick={() => setPatientFlowFilter('completed')}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                patientFlowFilter === 'completed'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Completed ({completedTokens.length})
            </button>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1040px] text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 font-extrabold uppercase text-[10px] tracking-wider">
                  <th className="whitespace-nowrap pb-4 pl-2">Patient</th>
                  <th className="whitespace-nowrap pb-4">Chief Complaint</th>
                  <th className="whitespace-nowrap pb-4">Doctor / Room</th>
                  <th className="whitespace-nowrap pb-4" style={{ minWidth: 76 }}>Token</th>
                  <th className="whitespace-nowrap pb-4">Status</th>
                  <th className="whitespace-nowrap pb-4">Sanctuary Pulse</th>
                  <th className="whitespace-nowrap pb-4">Priority / DPS</th>
                  <th className="whitespace-nowrap pb-4 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredQueue.map((t) => {
                  const isAarav = t.tokenNumber === 'A-27' || (t.patientName && t.patientName.includes('Aarav'));
                  const isWaiting = t.status === 'waiting';
                  const isCalled = t.status === 'called';
                  const isInConsult = t.status === 'in_consultation';
                  const isCompleted = t.status === 'completed';
                  const isSkipped = t.status === 'skipped';
                  const pulse = getPatientPulseData(t);

                  return (
                    <tr 
                      key={t.id} 
                      className={`hover:bg-stone-50/90 transition-all ${
                        isAarav ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      {/* Patient */}
                      <td className="py-5 pl-2 font-semibold text-stone-900">
                        <div 
                          onClick={() => onOpenSnapshot(t)}
                          className="cursor-pointer hover:text-emerald-700"
                        >
                          <span className="font-bold block text-stone-900">{t.patientName}</span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {t.patientAge}y • {t.patientGender}
                          </span>
                        </div>
                      </td>

                      {/* Reason */}
                      <td className="py-5 text-stone-600 max-w-[130px] truncate" title={t.symptomsSummary}>
                        {t.symptomsSummary || 'Diagnostic Evaluation'}
                      </td>

                      {/* Doctor */}
                      <td className="py-5 text-stone-800 font-medium">
                        <span className="block truncate">{t.doctorName}</span>
                        <span className="text-[10px] text-stone-400 font-mono">{t.roomNumber || 'Room 101'}</span>
                      </td>

                      {/* Token */}
                      <td className="py-5 font-mono font-black text-stone-900 whitespace-nowrap" style={{ minWidth: 76 }}>
                        <span
                          className="inline-flex px-2 py-1 rounded-md bg-stone-100 border border-stone-200"
                          style={{ minWidth: 44, whiteSpace: 'nowrap', wordBreak: 'keep-all' }}
                        >
                          {t.tokenNumber}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-5 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold ${
                          isInConsult
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : isCalled
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : isWaiting
                            ? 'bg-stone-100 text-stone-700 border border-stone-200'
                            : isCompleted
                            ? 'bg-stone-100 text-stone-400 line-through'
                            : isSkipped
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-stone-100 text-stone-600'
                        }`}>
                          {isInConsult ? 'In Treatment' : isCalled ? 'Called' : isWaiting ? 'Waiting' : isCompleted ? 'Completed' : isSkipped ? 'Skipped' : 'Needs Review'}
                        </span>
                      </td>

                      {/* Sanctuary Pulse */}
                      <td className="py-5 text-[11px]">
                        <span 
                          className="truncate block max-w-[130px] font-medium text-stone-700" 
                          title={`${pulse.statusBadge}: ${pulse.title}`}
                        >
                          {pulse.title}
                        </span>
                        <span className="text-[10px] text-stone-400 block font-mono">
                          {pulse.statusBadge}
                        </span>
                      </td>

                      {/* Priority / DPS */}
                      <td className="py-5">
                        {t.stagnationFlag ? (
                          <div 
                            onClick={() => onOpenSnapshot(t)}
                            className="cursor-pointer"
                          >
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center space-x-1 w-fit">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              <span>Review Recommended</span>
                            </span>
                            <span className="text-[9px] text-amber-800 font-mono font-bold block mt-0.5">
                              DPS: {t.dpsScore}/100
                            </span>
                          </div>
                        ) : (
                          <div>
                            <span className="text-[10px] font-semibold text-stone-500">
                              Standard
                            </span>
                            <span className="text-[9px] text-stone-400 font-mono block">
                              DPS: {t.dpsScore}/100
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-5 pr-2 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1">
                          
                          {/* Pre-Consultation Snapshot */}
                          <button
                            onClick={() => onOpenSnapshot(t)}
                            className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-[10px] font-bold transition-all"
                            title="Open Clinical Snapshot"
                          >
                            Snapshot
                          </button>

                          {/* Review History Trigger */}
                          {isWaiting && (
                            <button
                              onClick={() => handleDoctorReviewHistory(t.id, t.doctorId)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                                t.sanctuary_state === 'DOCTOR_REVIEWING'
                                  ? 'bg-sky-100 text-sky-800 border-sky-300'
                                  : 'bg-white hover:bg-sky-50 text-sky-700 border-sky-200'
                              }`}
                              title="Doctor clicks Review History -> Patient sees 'Doctor reviewing history'"
                            >
                              Review
                            </button>
                          )}

                          {/* Call / Start / Complete controls */}
                          {isWaiting && (
                            <button
                              onClick={() => {
                                DataStore.callToken(t.id);
                                onStateChange();
                                onOpenSnapshot(t);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-[10px] font-bold"
                            >
                              Call
                            </button>
                          )}

                          {isCalled && (
                            <button
                              onClick={() => handleStartConsultation(t.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold"
                            >
                              Start
                            </button>
                          )}

                          {isInConsult && (
                            <button
                              onClick={() => handleCompleteVisit(t.id)}
                              className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-900 text-white text-[10px] font-bold"
                            >
                              Complete
                            </button>
                          )}

                          {isSkipped && (
                            <button
                              onClick={() => handleRecall(t.id)}
                              className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold"
                            >
                              Recall
                            </button>
                          )}

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredQueue.length === 0 && (
            <div className="py-8 text-center text-stone-400 text-xs">
              No patients match the selected filter or search query.
            </div>
          )}
        </div>

        {/* Right: Signature Card: "Sanctuary Pulse" (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            
            {/* Sanctuary Pulse Card Header */}
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <HeartPulse className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-stone-900">
                  Sanctuary Pulse
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Clinic Command View
              </span>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed">
              Signature empathetic waiting engine. Broadcasts transparent clinical context to eliminate patient waiting anxiety.
            </p>

            {/* Live Aggregate Clinic State */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/80">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">Clinic State</span>
                <strong className="text-sm font-black text-emerald-950 block mt-0.5">Clinic Stable</strong>
                <span className="text-[10px] text-emerald-700">Predictable flow</span>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Avg Intake Wait</span>
                <strong className="text-sm font-black text-stone-900 block mt-0.5">12 min avg</strong>
                <span className="text-[10px] text-stone-500">Benchmark: 20 min</span>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Active Clinicians</span>
                <strong className="text-sm font-black text-stone-900 block mt-0.5">{doctors.length} active</strong>
                <span className="text-[10px] text-stone-500">Rooms 101–106</span>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80">
                <span className="text-[10px] uppercase font-bold text-amber-800 block">Diagnostic Flags</span>
                <strong className="text-sm font-black text-amber-950 block mt-0.5">{stagnantTokens.length} flagged</strong>
                <span className="text-[10px] text-amber-800">Buffer allocated</span>
              </div>
            </div>

            {/* Individual Patient Pulse States */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 block">
                  Live Patient Pulse Sync
                </span>
                <span className="text-[10px] text-stone-400 font-mono">Real-time mobile feed</span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {queue.slice(0, 5).map((t) => {
                  const pulse = getPatientPulseData(t);
                  return (
                    <div 
                      key={t.id}
                      onClick={() => onOpenSnapshot(t)}
                      className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer flex items-center justify-between text-xs transition-all"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-stone-900 px-1.5 py-0.5 rounded bg-stone-100 text-[10px]">
                          {t.tokenNumber}
                        </span>
                        <span className="font-medium text-stone-800 truncate max-w-[100px]">{t.patientName}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-bold text-stone-800 block truncate max-w-[120px]">
                          {pulse.title}
                        </span>
                        <span className="text-[9px] text-stone-400 font-mono">
                          {pulse.statusBadge}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Operator Guidance on Psychological Pacing */}
            <div className="p-3 rounded-2xl bg-stone-900 text-white text-xs">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                Psychological Waiting Pacing
              </span>
              <p className="text-[11px] text-stone-300 mt-1 leading-relaxed">
                By contextualizing why delays happen (e.g. "Doctor reviewing history"), patient perceived wait stress is reduced by ~40%.
              </p>
            </div>

            {/* Quick Simulation Trigger Bar on Sanctuary Pulse */}
            <div className="p-3.5 rounded-2xl bg-stone-950 text-white text-xs space-y-2.5 border border-stone-800">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>Interactive Queue Simulation</span>
                </span>
                <span className="text-[9px] font-mono bg-stone-800 text-stone-400 px-1.5 py-0.5 rounded">
                  Live Reactivity
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <button
                  onClick={() => {
                    DataStore.advanceQueueSimulation();
                    onStateChange();
                  }}
                  className="px-2 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 font-bold text-white flex items-center justify-center space-x-1"
                >
                  <Play className="w-3 h-3" />
                  <span>Advance Queue</span>
                </button>

                <button
                  onClick={() => {
                    DataStore.triggerDelaySimulation();
                    onStateChange();
                  }}
                  className="px-2 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 font-bold text-white flex items-center justify-center space-x-1"
                >
                  <Clock className="w-3 h-3" />
                  <span>Trigger Delay</span>
                </button>

                <button
                  onClick={() => {
                    const upcoming = waitingTokens[0] || aaravToken;
                    DataStore.doctorReviewingSimulation(upcoming?.id);
                    onStateChange();
                  }}
                  className="px-2 py-1.5 rounded-lg bg-sky-700 hover:bg-sky-600 font-bold text-white flex items-center justify-center space-x-1"
                >
                  <Stethoscope className="w-3 h-3" />
                  <span>Doctor Reviewing</span>
                </button>

                <button
                  onClick={() => {
                    const upcoming = waitingTokens[0] || aaravToken;
                    DataStore.approachingTurnSimulation(upcoming?.id);
                    onStateChange();
                  }}
                  className="px-2 py-1.5 rounded-lg bg-indigo-700 hover:bg-indigo-600 font-bold text-white flex items-center justify-center space-x-1"
                >
                  <UserCheck className="w-3 h-3" />
                  <span>Approaching Turn</span>
                </button>

                <button
                  onClick={() => {
                    const upcoming = waitingTokens[0] || aaravToken;
                    DataStore.callPatientSimulation(upcoming?.id);
                    onStateChange();
                  }}
                  className="px-2 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-600 font-bold text-white flex items-center justify-center space-x-1 col-span-2"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Call Patient (Your Turn Chime)</span>
                </button>
              </div>
            </div>

          </div>

          {/* Quick Queue Operations Bar */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-2xs space-y-3">
            <h4 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">
              Quick Queue Controls
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  const first = waitingTokens[0];
                  if (first) handleSkip(first.id);
                }}
                className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 font-bold text-stone-700 flex items-center justify-center space-x-1"
              >
                <SkipForward className="w-3.5 h-3.5 text-stone-500" />
                <span>Skip Current</span>
              </button>

              <button
                onClick={() => {
                  const skipped = skippedTokens[0];
                  if (skipped) handleRecall(skipped.id);
                }}
                className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 font-bold text-stone-700 flex items-center justify-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                <span>Recall Skipped</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* 5. Secondary Row: Queue Health, Diagnostic Journey Insights, Peak Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Queue Health & Velocity */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
                Queue Health &amp; Flow Velocity
              </h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Optimal
            </span>
          </div>

          <div className="space-y-3">
            {/* Visual Queue Status Distribution Bar */}
            <div>
              <div className="flex items-center justify-between text-[11px] mb-1.5 font-semibold text-stone-600">
                <span>Queue Status Distribution</span>
                <span className="font-mono font-bold text-stone-900">{queue.length} Active Tokens</span>
              </div>
              <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden flex">
                <div 
                  style={{ width: `${(inConsultTokens.length / Math.max(queue.length, 1)) * 100}%` }} 
                  className="bg-emerald-500 h-full" 
                  title="In Treatment"
                />
                <div 
                  style={{ width: `${(waitingTokens.length / Math.max(queue.length, 1)) * 100}%` }} 
                  className="bg-stone-400 h-full" 
                  title="Waiting in Lounge"
                />
                <div 
                  style={{ width: `${(stagnantTokens.length / Math.max(queue.length, 1)) * 100}%` }} 
                  className="bg-amber-400 h-full" 
                  title="Stagnant Flagged"
                />
                <div 
                  style={{ width: `${(completedTokens.length / Math.max(queue.length, 1)) * 100}%` }} 
                  className="bg-stone-200 h-full" 
                  title="Completed"
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-stone-400 mt-1.5 flex-wrap gap-1">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>In Consult ({inConsultTokens.length})</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-stone-400"></span>
                  <span>Waiting ({waitingTokens.length})</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>Stagnant ({stagnantTokens.length})</span>
                </span>
              </div>
            </div>

            {/* Flow Velocity Metrics */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs">
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                <span className="text-[10px] font-bold uppercase text-stone-400 block">SLA Compliance</span>
                <strong className="text-base font-black text-stone-900 block mt-0.5">94.2%</strong>
                <span className="text-[10px] text-emerald-700 font-medium">Within target window</span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                <span className="text-[10px] font-bold uppercase text-stone-400 block">Pacing Rate</span>
                <strong className="text-base font-black text-stone-900 block mt-0.5">4.8 pt/hr</strong>
                <span className="text-[10px] text-stone-500">Per active suite</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Diagnostic Journey Insights */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
                Diagnostic Journey Insights
              </h3>
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              DPS Engine
            </span>
          </div>

          <div className="space-y-3">
            {/* DPS Distribution Breakdown */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-stone-600">
                <span>Population DPS Distribution</span>
                <span className="font-mono text-stone-900 font-bold">Avg DPS: 78/100</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-stone-600 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Stable Journeys (&gt;75)</span>
                  </span>
                  <span className="font-mono font-bold text-stone-900">78%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-600 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span>Under Observation (50-75)</span>
                  </span>
                  <span className="font-mono font-bold text-stone-900">16%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-600 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                    <span>Stagnant Flagged (&lt;50)</span>
                  </span>
                  <span className="font-mono font-bold text-stone-900">6%</span>
                </div>
              </div>
            </div>

            {/* Impact Metric Blocks */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs">
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                <span className="text-[10px] font-bold uppercase text-stone-400 block">Avg Resolution</span>
                <strong className="text-base font-black text-stone-900 block mt-0.5">2.4 visits</strong>
                <span className="text-[10px] text-emerald-700 font-medium">-58% vs baseline</span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                <span className="text-[10px] font-bold uppercase text-stone-400 block">Savings / Flag</span>
                <strong className="text-base font-black text-stone-900 block mt-0.5">₹4,200</strong>
                <span className="text-[10px] text-stone-500">Redundant tests saved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Peak Activity & Flow Pacing */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
                Peak Activity &amp; Flow Pacing
              </h3>
            </div>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              Live Hourly
            </span>
          </div>

          <div className="space-y-3">
            {/* Hourly Pacing Chart Representation */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-stone-600">
                <span>Hourly Inflow Distribution</span>
                <span className="text-emerald-700 font-bold">11 AM - 12 PM Peak</span>
              </div>
              
              {/* Minimal bar timeline */}
              <div className="h-14 flex items-end justify-between gap-1.5 pt-2">
                {[
                  { time: '9 AM', height: '45%', active: false },
                  { time: '10 AM', height: '70%', active: false },
                  { time: '11 AM', height: '100%', active: true },
                  { time: '12 PM', height: '85%', active: false },
                  { time: '1 PM', height: '40%', active: false },
                  { time: '2 PM', height: '65%', active: false },
                  { time: '3 PM', height: '50%', active: false },
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div 
                      style={{ height: bar.height }} 
                      className={`w-full rounded-md transition-all ${
                        bar.active ? 'bg-stone-900 shadow-xs' : 'bg-stone-200 hover:bg-stone-300'
                      }`}
                    />
                    <span className={`text-[9px] font-mono ${bar.active ? 'font-bold text-stone-900' : 'text-stone-400'}`}>
                      {bar.time.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Turnaround Metrics */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs">
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                <span className="text-[10px] font-bold uppercase text-stone-400 block">Room Turnaround</span>
                <strong className="text-base font-black text-stone-900 block mt-0.5">3.2 min</strong>
                <span className="text-[10px] text-emerald-700 font-medium">Sanitized &amp; prepped</span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                <span className="text-[10px] font-bold uppercase text-stone-400 block">Consult Adherence</span>
                <strong className="text-base font-black text-stone-900 block mt-0.5">11.4 min</strong>
                <span className="text-[10px] text-stone-500">Benchmark: 12 min</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 6. Lower Section: Clinical Attention (Patients Requiring Review / Multidisciplinary Escalation) */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
          <div>
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider">
                Clinical Attention • Diagnostic Escalation Hub
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Identifies patients experiencing diagnostic stagnation, uncoordinated multi-specialty consultations, or repeated investigations.
            </p>
          </div>

          <button
            onClick={() => onNavigateToRecords('pat_aarav_0')}
            className="text-xs font-bold text-stone-700 hover:text-stone-900 flex items-center space-x-1"
          >
            <span>View All Longitudinal Records</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Detailed Flagged Patients Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Spotlight Patient: Aarav Mehta (A-27) */}
          <div className="p-5 rounded-3xl bg-amber-50/40 border border-amber-300/80 space-y-3 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-black text-sm px-2 py-0.5 rounded-lg bg-stone-900 text-white">
                    {aaravToken ? aaravToken.tokenNumber : 'A-27'}
                  </span>
                  <h4 className="font-extrabold text-stone-900 text-sm">
                    {aaravToken ? aaravToken.patientName : 'Aarav Mehta'}
                  </h4>
                  <span className="text-[11px] text-stone-500 font-mono">
                    42y • Male • UHID: ODYSSEY-2026-9481
                  </span>
                </div>
                <p className="text-xs font-medium text-amber-950">
                  Chief Concern: Persistent chest tightness &amp; dyspnea on exertion.
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-200 text-amber-950">
                  DPS 63/100
                </span>
                <span className="text-[10px] text-amber-900 font-bold block mt-1">
                  Stagnation Flagged
                </span>
              </div>
            </div>

            {/* Diagnostic Journey Details */}
            <div className="p-3 rounded-2xl bg-white/80 border border-amber-200/80 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-stone-700">3 Prior Uncoordinated Encounters</span>
                <span className="text-stone-500">Cardiology &amp; Pulmonology</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                2 prior normal ECGs, 2 redundant chest X-rays. No cross-specialty reconciliation recorded between departments.
              </p>
              <div className="text-[10px] font-medium text-emerald-800 flex items-center space-x-1 pt-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Recommendation: 15m consultation buffer &amp; Pre-consultation clinical snapshot review.</span>
              </div>
            </div>

            {/* Actions for Aarav Mehta */}
            <div className="flex items-center space-x-2 pt-1">
              <button
                onClick={() => aaravToken && onOpenSnapshot(aaravToken)}
                className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-all"
              >
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open Pre-Consultation Snapshot</span>
              </button>

              <button
                onClick={() => aaravToken && handleDoctorReviewHistory(aaravToken.id, aaravToken.doctorId)}
                className="px-3 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 text-xs font-bold transition-all"
              >
                Review History
              </button>

              <button
                onClick={handleRebalanceDPS}
                className="px-3 py-2 rounded-xl bg-amber-500/80 hover:bg-amber-500 text-stone-950 text-xs font-bold transition-all"
                title="Rebalance queue priority based on clinical need"
              >
                Prioritize in Queue
              </button>
            </div>
          </div>

          {/* Secondary Flagged Case: Token C-08 (Meera Patel) */}
          <div className="p-5 rounded-3xl bg-stone-50 border border-stone-200/80 space-y-3 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-black text-sm px-2 py-0.5 rounded-lg bg-stone-200 text-stone-900">
                    C-08
                  </span>
                  <h4 className="font-extrabold text-stone-900 text-sm">
                    Meera Patel
                  </h4>
                  <span className="text-[11px] text-stone-500 font-mono">
                    29y • Female • UHID: ODYSSEY-2026-3829
                  </span>
                </div>
                <p className="text-xs font-medium text-stone-700">
                  Chief Concern: 4th dermatology revisit for recurring facial erythema &amp; photosensitivity.
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                  DPS 58/100
                </span>
                <span className="text-[10px] text-stone-500 block mt-1">
                  Revisit Stagnation
                </span>
              </div>
            </div>

            {/* Diagnostic Journey Details */}
            <div className="p-3 rounded-2xl bg-white border border-stone-200/80 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-stone-700">Multi-Episode Topicals Ineffective</span>
                <span className="text-stone-500">Dermatology Suite 104</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Repeated topical corticosteroids prescribed without antinuclear antibody (ANA) autoimmune screening.
              </p>
              <div className="text-[10px] font-medium text-emerald-800 flex items-center space-x-1 pt-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Recommendation: Suggest Rheumatology cross-consultation.</span>
              </div>
            </div>

            {/* Actions for Meera */}
            <div className="flex items-center space-x-2 pt-1">
              <button
                onClick={() => {
                  const target = queue.find(t => t.tokenNumber === 'C-08') || aaravToken;
                  if (target) onOpenSnapshot(target);
                }}
                className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-all"
              >
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span>Review Case Snapshot</span>
              </button>

              <button
                onClick={() => onNavigateToRecords('pat_meera_1')}
                className="px-3 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 text-xs font-bold transition-all"
              >
                Full Journey Record
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
