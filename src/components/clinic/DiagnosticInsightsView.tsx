import React, { useState, useMemo } from 'react';
import { 
  Activity, AlertTriangle, TrendingDown, TrendingUp, Repeat, GitMerge, 
  ShieldAlert, Sparkles, CheckCircle2, Clock, FileText, Stethoscope, 
  Sliders, ArrowRight, User, RefreshCw, ChevronRight, HelpCircle, 
  Layers, Info, Zap, Calendar, ExternalLink, Filter, Search, X
} from 'lucide-react';
import { Token, Patient } from '../../types';
import { DataStore } from '../../services/dataStore';
import { SAFETY_MANDATE } from '../../services/dpsEngine';

interface DiagnosticInsightsViewProps {
  onOpenSnapshot?: (token: Token) => void;
  onNavigateToRecords?: (patientId: string) => void;
}

export const DiagnosticInsightsView: React.FC<DiagnosticInsightsViewProps> = ({
  onOpenSnapshot,
  onNavigateToRecords,
}) => {
  // Filter state for the patients requiring review table
  const [patientSearch, setPatientSearch] = useState('');
  const [signalFilter, setSignalFilter] = useState<'all' | 'complaint' | 'transitions' | 'investigations'>('all');
  const [activeTab, setActiveTab] = useState<'aggregate' | 'loops'>('aggregate');

  // KPI Metrics as explicitly mandated:
  // Active journeys: 48
  // Improving: 28
  // Stable: 14
  // Review recommended: 6
  // Potentially stagnating: 3
  const kpis = {
    activeJourneys: 48,
    improving: 28,
    stable: 14,
    reviewRecommended: 6,
    potentiallyStagnating: 3,
  };

  // Patients requiring review list
  const reviewPatients = [
    {
      id: 'pat_aarav_0',
      name: 'Aarav Mehta',
      age: 42,
      gender: 'Male',
      tokenNumber: 'A-27',
      uhid: 'OF-000284',
      doctor: 'Dr. Sharma',
      dps: 63,
      trend: '↓',
      trendLabel: 'Stagnating',
      keySignal: 'Repeated complaint (5 encounters)',
      signalType: 'complaint',
      specialtyCount: 3,
      concern: 'Persistent headache',
      status: 'waiting' as const,
    },
    {
      id: 'pat_sara_k',
      name: 'Sara Khan',
      age: 38,
      gender: 'Female',
      tokenNumber: 'B-14',
      uhid: 'OF-000319',
      doctor: 'Dr. R. Patel',
      dps: 58,
      trend: '↓',
      trendLabel: 'Limited recent convergence',
      keySignal: 'Specialist transitions (4 transitions)',
      signalType: 'transitions',
      specialtyCount: 4,
      concern: 'Epigastric distress & nausea',
      status: 'waiting' as const,
    },
    {
      id: 'pat_rohan_v',
      name: 'Rohan Verma',
      age: 51,
      gender: 'Male',
      tokenNumber: 'A-31',
      uhid: 'OF-000192',
      doctor: 'Dr. Sharma',
      dps: 61,
      trend: '↓',
      trendLabel: 'Stagnating',
      keySignal: 'Repeated investigation detected (2 MRIs)',
      signalType: 'investigations',
      specialtyCount: 3,
      concern: 'Cervical radiculopathy & ache',
      status: 'waiting' as const,
    },
    {
      id: 'pat_meera_s',
      name: 'Meera Sen',
      age: 29,
      gender: 'Female',
      tokenNumber: 'C-08',
      uhid: 'OF-000455',
      doctor: 'Dr. V. Menon',
      dps: 55,
      trend: '↓',
      trendLabel: 'Limited recent convergence',
      keySignal: 'Elevated clinical uncertainty (4 shifts)',
      signalType: 'transitions',
      specialtyCount: 4,
      concern: 'Unexplained fatigue & arthralgia',
      status: 'waiting' as const,
    },
    {
      id: 'pat_kabir_p',
      name: 'Kabir Patel',
      age: 45,
      gender: 'Male',
      tokenNumber: 'B-22',
      uhid: 'OF-000210',
      doctor: 'Dr. R. Patel',
      dps: 64,
      trend: '→',
      trendLabel: 'Flat',
      keySignal: 'Repeated complaint (4 encounters)',
      signalType: 'complaint',
      specialtyCount: 3,
      concern: 'Atypical facial tingling',
      status: 'waiting' as const,
    },
    {
      id: 'pat_sunita_r',
      name: 'Sunita Rao',
      age: 62,
      gender: 'Female',
      tokenNumber: 'A-45',
      uhid: 'OF-000168',
      doctor: 'Dr. Sharma',
      dps: 59,
      trend: '↓',
      trendLabel: 'Review recommended',
      keySignal: 'Repeated investigation detected (3 ultrasounds)',
      signalType: 'investigations',
      specialtyCount: 3,
      concern: 'Chronic episodic RUQ discomfort',
      status: 'waiting' as const,
    },
  ];

  // Filtered patients
  const filteredPatients = useMemo(() => {
    return reviewPatients.filter(p => {
      const matchesSearch = 
        (p.name || '').toLowerCase().includes(patientSearch.toLowerCase()) ||
        (p.tokenNumber || '').toLowerCase().includes(patientSearch.toLowerCase()) ||
        (p.doctor || '').toLowerCase().includes(patientSearch.toLowerCase()) ||
        (p.keySignal || '').toLowerCase().includes(patientSearch.toLowerCase());

      const matchesSignal = 
        signalFilter === 'all' || 
        p.signalType === signalFilter;

      return matchesSearch && matchesSignal;
    });
  }, [patientSearch, signalFilter]);

  // Handle clicking Review on any patient
  const handleReviewPatient = (patientItem: typeof reviewPatients[0]) => {
    if (onOpenSnapshot) {
      // Find matching token in queue or create virtual token for snapshot modal
      const queue = DataStore.getQueue();
      const existing = queue.find(t => t.patientId === patientItem.id || t.tokenNumber === patientItem.tokenNumber);
      if (existing) {
        onOpenSnapshot(existing);
      } else {
        const dummyToken: Token = {
          id: `tok_${patientItem.id}`,
          tokenNumber: patientItem.tokenNumber,
          patientId: patientItem.id,
          patientName: patientItem.name,
          patientAge: patientItem.age,
          patientGender: patientItem.gender,
          symptomsSummary: patientItem.concern,
          doctorId: 'doc_sharma_1',
          doctorName: patientItem.doctor,
          clinicId: 'clinic_apollo_1',
          clinicName: 'Odyssey Health Sanctuary',
          specialty: 'Internal Medicine',
          priority: 'normal',
          roomNumber: '101',
          status: 'waiting',
          queuePosition: 2,
          estimatedWaitMin: 15,
          checkInTime: '09:00 AM',
          sanctuary_state: 'DOCTOR_REVIEWING',
          dpsScore: patientItem.dps,
          stagnationFlag: true,
          expectedDuration: 15,
        };
        onOpenSnapshot(dummyToken);
      }
    } else if (onNavigateToRecords) {
      onNavigateToRecords(patientItem.id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* ========================================================
          1. HEADER & STRICT SAFETY / COMPLIANCE BANNER
      ======================================================== */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
                <Activity className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-black text-stone-900 tracking-tight">
                Diagnostic Insights
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[11px] font-bold border border-stone-200">
                Clinic Aggregate
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Institutional intelligence tracking longitudinal trajectory convergence, test redundancy, specialist loops, and stagnation friction.
            </p>
          </div>

          {/* Safety Compliance Mandate */}
          <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs text-amber-950 max-w-md shadow-2xs">
            <div className="flex items-start space-x-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-[11px] text-amber-900 uppercase tracking-tight">
                  Clinical Process Intelligence
                </span>
                <p className="text-[11px] text-amber-800 leading-snug mt-0.5">
                  Identifies journey stagnation and operational friction. Avoids medical predictions, automated disease diagnoses, or prescribing.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* View Switcher Tabs */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center space-x-1.5 p-1 rounded-2xl bg-stone-100/90 border border-stone-200/70">
            <button
              onClick={() => setActiveTab('aggregate')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'aggregate'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Clinic-Level Insights &amp; Cohorts
            </button>
            <button
              onClick={() => setActiveTab('loops')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'loops'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Specialist Loop Patterns
            </button>
          </div>

          <div className="flex items-center space-x-2 text-xs text-stone-500 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Synchronized with active outpatient cohort</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. FIVE COMPACT KPI CARDS
      ======================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* 1. Active Journeys */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 text-[10px] uppercase font-extrabold tracking-wider">
            <span>Active journeys</span>
            <Activity className="w-3.5 h-3.5 text-stone-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1">
            <span className="text-2xl font-black text-stone-900">{kpis.activeJourneys}</span>
            <span className="text-xs text-stone-400 font-medium">cohorts</span>
          </div>
          <span className="text-[11px] text-stone-500 block mt-1">
            Longitudinal patient paths
          </span>
        </div>

        {/* 2. Improving */}
        <div className="bg-white rounded-2xl p-4 border border-emerald-200/80 bg-gradient-to-b from-emerald-50/20 to-white shadow-2xs">
          <div className="flex items-center justify-between text-emerald-800 text-[10px] uppercase font-extrabold tracking-wider">
            <span>Improving</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1">
            <span className="text-2xl font-black text-emerald-950">{kpis.improving}</span>
            <span className="text-xs text-emerald-700 font-semibold font-mono">58%</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium block mt-1">
            Journey showing improvement
          </span>
        </div>

        {/* 3. Stable */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-[10px] uppercase font-extrabold tracking-wider">
            <span>Stable</span>
            <Clock className="w-3.5 h-3.5 text-stone-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1">
            <span className="text-2xl font-black text-stone-900">{kpis.stable}</span>
            <span className="text-xs text-stone-500 font-semibold font-mono">29%</span>
          </div>
          <span className="text-[11px] text-stone-500 block mt-1">
            Steady trajectory
          </span>
        </div>

        {/* 4. Review Recommended */}
        <div className="bg-white rounded-2xl p-4 border border-amber-200/80 bg-gradient-to-b from-amber-50/30 to-white shadow-2xs">
          <div className="flex items-center justify-between text-amber-900 text-[10px] uppercase font-extrabold tracking-wider">
            <span>Review recommended</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1">
            <span className="text-2xl font-black text-amber-950">{kpis.reviewRecommended}</span>
            <span className="text-xs text-amber-800 font-semibold font-mono">12%</span>
          </div>
          <span className="text-[11px] text-amber-800 font-medium block mt-1">
            Review recommended
          </span>
        </div>

        {/* 5. Potentially Stagnating */}
        <div className="bg-white rounded-2xl p-4 border border-amber-300 shadow-2xs bg-amber-50/40">
          <div className="flex items-center justify-between text-amber-950 text-[10px] uppercase font-extrabold tracking-wider">
            <span>Potentially stagnating</span>
            <TrendingDown className="w-3.5 h-3.5 text-amber-700" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1">
            <span className="text-2xl font-black text-amber-950">{kpis.potentiallyStagnating}</span>
            <span className="text-xs text-amber-800 font-bold px-1.5 py-0.2 rounded bg-amber-100">
              Flagged
            </span>
          </div>
          <span className="text-[11px] text-amber-900 font-semibold block mt-1">
            Limited recent convergence
          </span>
        </div>

      </div>

      {/* ========================================================
          3. FOUR HIGH-CRAFT CLINICAL CHARTS
      ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART 1: DPS DISTRIBUTION */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
                DPS Distribution
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Diagnostic Progress Score across 48 active patient cohorts
              </p>
            </div>
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-xl bg-stone-100 text-stone-800 border border-stone-200">
              Median: 78 / 100
            </span>
          </div>

          {/* Histogram Bars */}
          <div className="space-y-3 text-xs pt-1">
            
            {/* Tier 1: <60 */}
            <div>
              <div className="flex justify-between text-[11px] font-semibold text-stone-700 mb-1">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>&lt; 60 (Potential stagnation / review recommended)</span>
                </span>
                <span className="font-mono text-stone-900 font-bold">3 cohorts (6%)</span>
              </div>
              <div className="h-3.5 w-full bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '6.25%' }}></div>
              </div>
            </div>

            {/* Tier 2: 60-69 */}
            <div>
              <div className="flex justify-between text-[11px] font-semibold text-stone-700 mb-1">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>60–69 (Limited recent convergence / monitoring)</span>
                </span>
                <span className="font-mono text-stone-900 font-bold">6 cohorts (12.5%)</span>
              </div>
              <div className="h-3.5 w-full bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '12.5%' }}></div>
              </div>
            </div>

            {/* Tier 3: 70-79 */}
            <div>
              <div className="flex justify-between text-[11px] font-semibold text-stone-700 mb-1">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-stone-400"></span>
                  <span>70–79 (Moderate convergence)</span>
                </span>
                <span className="font-mono text-stone-900 font-bold">11 cohorts (23%)</span>
              </div>
              <div className="h-3.5 w-full bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-stone-400 rounded-full" style={{ width: '23%' }}></div>
              </div>
            </div>

            {/* Tier 4: 80-89 */}
            <div>
              <div className="flex justify-between text-[11px] font-semibold text-stone-700 mb-1">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>80–89 (Journey showing improvement)</span>
                </span>
                <span className="font-mono text-stone-900 font-bold">18 cohorts (37.5%)</span>
              </div>
              <div className="h-3.5 w-full bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '37.5%' }}></div>
              </div>
            </div>

            {/* Tier 5: 90-100 */}
            <div>
              <div className="flex justify-between text-[11px] font-semibold text-stone-700 mb-1">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-700"></span>
                  <span>90–100 (Diagnostic closure achieved)</span>
                </span>
                <span className="font-mono text-stone-900 font-bold">10 cohorts (21%)</span>
              </div>
              <div className="h-3.5 w-full bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-700 rounded-full" style={{ width: '21%' }}></div>
              </div>
            </div>

          </div>

          <div className="pt-2 text-[11px] text-stone-500 flex items-center justify-between border-t border-stone-100">
            <span>Threshold for clinical review trigger: &lt; 70</span>
            <span className="font-semibold text-amber-800">9 total cohorts below threshold</span>
          </div>
        </div>

        {/* CHART 2: JOURNEY TREND */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
                Journey Trend
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Cohort trajectories tracked across 6 months
              </p>
            </div>
            <div className="flex items-center space-x-3 text-[10px] font-semibold text-stone-600">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Improving</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-stone-400"></span>
                <span>Stable</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Stagnating</span>
              </span>
            </div>
          </div>

          {/* Clean SVG Trend Visualization */}
          <div className="h-44 w-full bg-stone-50 rounded-2xl p-4 border border-stone-200/70 relative flex flex-col justify-between">
            {/* Guide lines */}
            <div className="absolute inset-x-4 top-1/4 border-b border-stone-200/60"></div>
            <div className="absolute inset-x-4 top-2/4 border-b border-stone-200/60"></div>
            <div className="absolute inset-x-4 top-3/4 border-b border-dashed border-amber-300"></div>

            {/* Labels and curve representation */}
            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120">
              {/* Improving trajectory curve */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                points="20,95 90,82 160,65 230,50 300,35 370,22"
              />
              {/* Stable trajectory curve */}
              <polyline
                fill="none"
                stroke="#78716c"
                strokeWidth="2"
                strokeDasharray="4 4"
                points="20,60 90,58 160,57 230,55 300,56 370,54"
              />
              {/* Stagnating trajectory curve */}
              <polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                points="20,65 90,72 160,78 230,82 300,84 370,86"
              />

              {/* Data points */}
              <circle cx="370" cy="22" r="3.5" fill="#10b981" />
              <circle cx="370" cy="54" r="3.5" fill="#78716c" />
              <circle cx="370" cy="86" r="3.5" fill="#f59e0b" />
            </svg>

            {/* Bottom Month Markers */}
            <div className="flex justify-between text-[10px] font-mono text-stone-400 pt-1">
              <span>Month 1</span>
              <span>Month 2</span>
              <span>Month 3</span>
              <span>Month 4</span>
              <span>Month 5</span>
              <span className="text-stone-700 font-bold">Month 6 (Current)</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-500 border-t border-stone-100 pt-2">
            <span>Stagnating cohort average: <strong className="text-amber-800 font-mono">62 DPS</strong></span>
            <span className="text-emerald-700 font-semibold">Improving cohort average: 88 DPS</span>
          </div>
        </div>

        {/* CHART 3: REFERRAL ACTIVITY */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
                Referral Activity
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Cross-specialty multidisciplinary escalations &amp; loop routing
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
              84% Loop Convergence
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-900 block">Neurology Referrals</span>
                <span className="text-[10px] text-stone-500">Refractory cephalalgia &amp; neurovascular</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-black text-stone-900 text-sm">18 cases</span>
                <span className="text-[10px] text-emerald-700 font-semibold block">8 converged, 10 active</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-900 block">ENT &amp; Sinus Clinic</span>
                <span className="text-[10px] text-stone-500">Sinusitis rule-out &amp; craniofacial endoscopy</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-black text-stone-900 text-sm">14 cases</span>
                <span className="text-[10px] text-stone-500 block">11 concluded</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-900 block">Gastroenterology</span>
                <span className="text-[10px] text-stone-500">Epigastric distress &amp; functional GI pathways</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-black text-stone-900 text-sm">12 cases</span>
                <span className="text-[10px] text-stone-500 block">9 active pathways</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-900 block">Orthopedics &amp; Spine</span>
                <span className="text-[10px] text-stone-500">Cervical &amp; musculoskeletal evaluations</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-black text-stone-900 text-sm">9 cases</span>
                <span className="text-[10px] text-stone-500 block">6 converged</span>
              </div>
            </div>

          </div>

          <div className="text-[11px] text-stone-500 border-t border-stone-100 pt-2 flex items-center justify-between">
            <span>Average loop delay before referral: 114 days</span>
            <span className="text-emerald-700 font-semibold">Reduced by 38 days with DPS flags</span>
          </div>
        </div>

        {/* CHART 4: INVESTIGATION REDUNDANCY */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
                Investigation Redundancy
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Repeated diagnostic tests without incremental yield
              </p>
            </div>
            <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
              19 Redundant Scans Avoided
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-amber-950 block">Repeated MRI / CT Scans</span>
                <span className="text-[10px] text-amber-800">Duplicate non-contrast imaging without protocol change</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-black text-amber-950 text-sm">8 flagged</span>
                <span className="text-[10px] text-amber-900 font-semibold block">Repeated investigation detected</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-900 block">Repeated Blood Panels</span>
                <span className="text-[10px] text-stone-500">Identical CBC / metabolic orders within 30 days</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-black text-stone-900 text-sm">14 cases</span>
                <span className="text-[10px] text-stone-500 block">High overlap rate</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-900 block">Ultrasound Re-evaluations</span>
                <span className="text-[10px] text-stone-500">Abdominal scans repeated without clinical progression</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-black text-stone-900 text-sm">6 cases</span>
                <span className="text-[10px] text-stone-500 block">Equivocal findings</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-900 block">Endoscopy Re-orders</span>
                <span className="text-[10px] text-stone-500">Repeat upper GI scopes with prior negative findings</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-black text-stone-900 text-sm">5 cases</span>
                <span className="text-[10px] text-stone-500 block">Diverted to neuro-gastro</span>
              </div>
            </div>

          </div>

          <div className="text-[11px] text-stone-500 border-t border-stone-100 pt-2 flex items-center justify-between">
            <span>Institutional savings from avoided duplicate tests:</span>
            <span className="text-stone-900 font-bold font-mono">₹ 1,42,000 / month</span>
          </div>
        </div>

      </div>

      {/* ========================================================
          4. PATIENT LIST: PATIENTS REQUIRING REVIEW
      ======================================================== */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
        
        {/* Table Header & Quick Filters */}
        <div className="p-5 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-stone-900">
                Patients Requiring Review
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
                {filteredPatients.length} Active Cases
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Cohorts flagged with potential stagnation, repeated complaints, or specialist transition friction.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                placeholder="Filter patient, signal, doctor..."
                className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
              {patientSearch && (
                <button onClick={() => setPatientSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Signal Filter Pills */}
            <div className="flex items-center space-x-1 text-xs">
              <button
                onClick={() => setSignalFilter('all')}
                className={`px-3 py-1 rounded-xl font-bold transition-all ${
                  signalFilter === 'all' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSignalFilter('complaint')}
                className={`px-3 py-1 rounded-xl font-bold transition-all ${
                  signalFilter === 'complaint' ? 'bg-amber-600 text-white' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                Repeated Complaint
              </button>
              <button
                onClick={() => setSignalFilter('transitions')}
                className={`px-3 py-1 rounded-xl font-bold transition-all ${
                  signalFilter === 'transitions' ? 'bg-amber-600 text-white' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                Transitions
              </button>
              <button
                onClick={() => setSignalFilter('investigations')}
                className={`px-3 py-1 rounded-xl font-bold transition-all ${
                  signalFilter === 'investigations' ? 'bg-amber-600 text-white' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                Investigations
              </button>
            </div>
          </div>
        </div>

        {/* Patients Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-400 font-extrabold uppercase text-[10px] tracking-wider bg-stone-50/60">
                <th className="py-3.5 pl-6">Patient</th>
                <th className="py-3.5 px-3">DPS</th>
                <th className="py-3.5 px-3">Trend</th>
                <th className="py-3.5 px-4">Key Signal</th>
                <th className="py-3.5 px-3 text-center">Specialty Count</th>
                <th className="py-3.5 pr-6 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              {filteredPatients.map((p) => (
                <tr 
                  key={p.id}
                  className="hover:bg-amber-50/30 transition-colors group cursor-pointer"
                  onClick={() => handleReviewPatient(p)}
                >
                  
                  {/* 1. Patient */}
                  <td className="py-4 pl-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700 font-bold text-xs shrink-0">
                        {p.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <strong className="text-stone-900 font-bold block">
                            {p.name}
                          </strong>
                          <span className="text-[10px] font-mono text-stone-500 bg-stone-100 px-1.5 py-0.2 rounded border border-stone-200">
                            {p.tokenNumber}
                          </span>
                        </div>
                        <span className="text-[11px] text-stone-500 block">
                          {p.age}y • {p.doctor} • {p.concern}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* 2. DPS */}
                  <td className="py-4 px-3 font-mono">
                    <span className="font-black text-stone-900 text-sm">
                      {p.dps}
                    </span>
                    <span className="text-[10px] text-stone-400 block">
                      / 100
                    </span>
                  </td>

                  {/* 3. Trend */}
                  <td className="py-4 px-3">
                    <div className="flex items-center space-x-1 text-amber-800">
                      <span className="font-bold text-sm leading-none">{p.trend}</span>
                      <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-900">
                        {p.trendLabel}
                      </span>
                    </div>
                  </td>

                  {/* 4. Key Signal */}
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-stone-50 text-stone-800 border border-stone-200">
                      <AlertTriangle className="w-3 h-3 text-amber-700 shrink-0" />
                      <span>{p.keySignal}</span>
                    </span>
                  </td>

                  {/* 5. Specialty Count */}
                  <td className="py-4 px-3 text-center font-mono">
                    <span className="font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded-lg border border-stone-200">
                      {p.specialtyCount}
                    </span>
                  </td>

                  {/* 6. Action: Review */}
                  <td className="py-4 pr-6 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReviewPatient(p);
                      }}
                      className="px-4 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-2xs inline-flex items-center space-x-1"
                    >
                      <span>Review</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPatients.length === 0 && (
          <div className="p-8 text-center text-stone-500 text-xs">
            No patients match the selected filter criteria.
          </div>
        )}
      </div>

    </div>
  );
};
