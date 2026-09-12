import React from 'react';
import { 
  BarChart3, TrendingUp, AlertTriangle, CheckCircle2, 
  Clock, Activity, ArrowUpRight, Zap, ShieldCheck 
} from 'lucide-react';
import { DataStore } from '../../services/dataStore';

export const ReportsView: React.FC = () => {
  const queue = DataStore.getQueue();
  const patients = DataStore.getPatients();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              Clinical Intelligence &amp; Operational Reports
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Audit &amp; Insights
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Measuring diagnostic velocity, test duplication averted, and queue efficiency.
          </p>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Diagnostic Velocity</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-extrabold text-stone-900">+42%</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> Faster
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">From initial visit to subspecialty triage</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Redundant Scans Prevented</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-extrabold text-stone-900">73</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-0.5" /> Averted
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Saved ~₹1.8L in patient out-of-pocket costs</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Avg Stagnant Wait Time</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-extrabold text-stone-900">8.4m</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              -65%
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Fast-tracked via DPS queue rebalancing</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Sanctuary Pulse NPS</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-extrabold text-emerald-700">92%</span>
            <span className="text-xs font-bold text-emerald-600">Satisfaction</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Patients reporting reduced waiting anxiety</p>
        </div>

      </div>

      {/* Clinical Diagnostic Yield Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
          Diagnostic Investigation Yield Analysis (Why Stagnation Occurs)
        </h3>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-stone-700">Tier-1 Routine Ultrasound (Abdominal)</span>
              <span className="text-rose-600 font-bold">28% Conclusive Yield (72% Redundant)</span>
            </div>
            <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden flex">
              <div className="bg-emerald-500 h-full" style={{ width: '28%' }}></div>
              <div className="bg-rose-400 h-full" style={{ width: '72%' }}></div>
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Primary bottleneck for RUQ pain patients. Odyssey Flow intercepts repeat orders and escalates to MRCP/CT.
            </p>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-stone-700">General Metabolic &amp; Blood Panel</span>
              <span className="text-amber-600 font-bold">42% Conclusive Yield</span>
            </div>
            <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden flex">
              <div className="bg-emerald-500 h-full" style={{ width: '42%' }}></div>
              <div className="bg-amber-400 h-full" style={{ width: '58%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-stone-700">Senior Multidisciplinary Panel Review (Odyssey Routed)</span>
              <span className="text-emerald-700 font-bold">89% Diagnostic Closure</span>
            </div>
            <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden flex">
              <div className="bg-emerald-600 h-full" style={{ width: '89%' }}></div>
              <div className="bg-stone-200 h-full" style={{ width: '11%' }}></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
