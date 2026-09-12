import React, { useState } from 'react';
import { 
  Database, Copy, Check, RefreshCw, Shield, 
  Server, HardDrive, Key, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { SUPABASE_SCHEMA_SQL, isSupabaseConfigured } from '../../services/supabaseClient';
import { DataStore } from '../../services/dataStore';
import { cache, CACHE_KEYS } from '../../services/storage';

export const SupabaseSettingsView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'schema' | 'cache' | 'audit'>('schema');
  const auditLogs = DataStore.getAuditLogs();

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetData = () => {
    if (confirm('Reset prototype cache and restore default demo patients, queue, and doctors?')) {
      DataStore.resetDemoState();
      window.location.reload();
    }
  };

  const tables = [
    { name: 'clinics', count: 2, desc: 'Health centers, specialties & queue configurations' },
    { name: 'doctors', count: 3, desc: 'Clinician profiles, rooms, statuses for Sanctuary Pulse' },
    { name: 'doctor_shifts', count: 3, desc: 'Active shift schedules and room allocations' },
    { name: 'patients', count: 4, desc: 'Simulated Aadhaar-linked registry profiles' },
    { name: 'visits', count: 8, desc: 'Past consultation histories and resolution statuses' },
    { name: 'tokens', count: 4, desc: 'Live operational queue tokens with DPS priorities' },
    { name: 'symptoms', count: 6, desc: 'Presenting complaints, severity, duration & trajectory' },
    { name: 'diagnostic_events', count: 5, desc: 'Longitudinal scans, lab yields & conclusiveness scores' },
    { name: 'diagnostic_signals', count: 3, desc: 'Extracted stagnation friction & delay markers' },
    { name: 'dps_snapshots', count: 4, desc: 'Diagnostic Progress Score logs & penalty breakdowns' },
    { name: 'referrals', count: 2, desc: 'Sub-specialist & multidisciplinary panel escalations' },
    { name: 'billing', count: 2, desc: 'Zero-friction digital tokens and invoice ledgers' },
    { name: 'notifications', count: 12, desc: 'Sanctuary Pulse empathetic state update events' },
    { name: 'audit_logs', count: auditLogs.length, desc: 'System trace of queue rebalancing & status changes' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              Supabase Architecture &amp; Prototype Cache
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              14 Tables Defined
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            PostgreSQL relational schema with RLS policies, combined with an offline-first client cache layer.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopySql}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied SQL Script' : 'Copy Supabase DDL'}</span>
          </button>

          <button
            onClick={handleResetData}
            className="px-3 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center space-x-1"
            title="Reset to fresh demo dataset"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Connection & Architecture Status Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Supabase Status */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Supabase PostgreSQL Backend
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {isSupabaseConfigured ? 'Connected to Remote Cloud' : 'Ready (Zero-Dependency Mode)'}
            </span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            {isSupabaseConfigured
              ? 'Real-time synchronization active with remote Supabase project instance.'
              : 'App is running in zero-friction demo mode with automatic mock-fallback. When VITE_SUPABASE_URL is provided, it seamlessly connects to live PostgreSQL.'}
          </p>
        </div>

        {/* LocalStorage Cache Architecture */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <HardDrive className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Prototype Cache (localStorage)
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
              Transient Key-Value Store
            </span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Per hackathon design principles, transient states (queue tokens, current patient session, Sanctuary Pulse) use an abstract cache layer ready to swap with Redis in production.
          </p>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('schema')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'schema' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          14 Relational Tables
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'audit' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Audit Logs ({auditLogs.length})
        </button>
      </div>

      {/* Tab: Schema List */}
      {activeTab === 'schema' && (
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-50 border-b border-stone-200/80 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">PostgreSQL Table</th>
                <th className="py-3 px-4">Entity Description</th>
                <th className="py-3 px-4 text-right">Seed Records</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {tables.map((t, idx) => (
                <tr key={idx} className="hover:bg-stone-50/60">
                  <td className="py-3 px-4 font-mono font-bold text-stone-900">
                    public.{t.name}
                  </td>
                  <td className="py-3 px-4 text-stone-600">
                    {t.desc}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-stone-800">
                    {t.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-2">
          <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block mb-3">
            System Operations &amp; DPS Rebalancing Trace
          </span>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 font-mono">{log.action}</span>
                  <span className="text-[11px] text-stone-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-stone-600 mt-1">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
