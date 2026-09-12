import React, { useState } from 'react';
import { Shield, Search, Filter, Clock, User, Laptop, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { DataStore } from '../../services/dataStore';
import { AuditLog } from '../../types';

export const AuditLogsView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [logs, setLogs] = useState<AuditLog[]>(() => {
    const existing = DataStore.getAuditLogs();
    if (existing.length > 0) return existing;
    
    // Seed initial realistic healthcare command center audit logs if empty
    return [
      {
        id: 'log_seed_1',
        action: 'Viewed patient journey',
        entityType: 'patient',
        entityId: 'pat_aarav_0',
        performedBy: 'Dr. Sharma (CMO)',
        timestamp: '09:42 AM',
        deviceIp: '192.168.1.42 (Station 01)',
        patientName: 'Aarav Mehta (A-27)',
        details: 'Inspected longitudinal diagnostic timeline across 6 encounters.',
      },
      {
        id: 'log_seed_2',
        action: 'Evaluated Stagnation Flag',
        entityType: 'dps',
        entityId: 'pat_aarav_0',
        performedBy: 'DPS Engine (Automated)',
        timestamp: '09:30 AM',
        deviceIp: '127.0.0.1 (Flow Server)',
        patientName: 'Aarav Mehta (A-27)',
        details: 'DPS score 63/100 detected. Multi-test redundancy confirmed.',
      },
      {
        id: 'log_seed_3',
        action: 'Sanctuary Pulse Updated',
        entityType: 'queue',
        entityId: 'tok_aarav_27',
        performedBy: 'Sanctuary Engine',
        timestamp: '09:28 AM',
        deviceIp: '192.168.1.15 (Lobby Display)',
        patientName: 'Aarav Mehta (A-27)',
        details: 'Paced wait notice: "Doctor reviewing history" dispatched to mobile.',
      },
      {
        id: 'log_seed_4',
        action: 'Walk-in Check-in Verified',
        entityType: 'token',
        entityId: 'tok_priya_1',
        performedBy: 'Reception Kiosk 01',
        timestamp: '09:12 AM',
        deviceIp: '192.168.1.10 (Front Desk)',
        patientName: 'Priya Sharma (B-14)',
        details: 'Simulated Aadhaar identity confirmed. Token B-14 issued.',
      },
      {
        id: 'log_seed_5',
        action: 'Consultation Completed',
        entityType: 'doctor',
        entityId: 'doc_meera_1',
        performedBy: 'Dr. Meera Nambiar',
        timestamp: '08:55 AM',
        deviceIp: '192.168.1.44 (Room 104)',
        patientName: 'Vikram Patel',
        details: 'Gastroenterology consult concluded. Lab investigation dispatched.',
      },
    ];
  });

  const handleRefresh = () => {
    setLogs(DataStore.getAuditLogs());
  };

  const filteredLogs = logs.filter(log => {
    if (filterType !== 'all' && log.entityType !== filterType) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchAction = (log.action || '').toLowerCase().includes(q);
      const matchUser = (log.performedBy || '').toLowerCase().includes(q);
      const matchDetails = (log.details || '').toLowerCase().includes(q);
      const matchPatient = (log.patientName || '').toLowerCase().includes(q);
      const matchDevice = (log.deviceIp || '').toLowerCase().includes(q);
      if (!matchAction && !matchUser && !matchDetails && !matchPatient && !matchDevice) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
              System Audit Logs &amp; Compliance Trail
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Immutable trace of all queue transitions, clinician clinical workspace access, and algorithm actions.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="px-3.5 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold flex items-center space-x-1.5 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Stream</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by action, user (e.g. Dr. Sharma), patient (A-27), or IP..."
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white"
          />
        </div>

        {/* Filter Type */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-stone-400 shrink-0" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900"
          >
            <option value="all">All Event Types</option>
            <option value="token">Token &amp; Queue</option>
            <option value="patient">Patient Records</option>
            <option value="dps">DPS Stagnation</option>
            <option value="doctor">Clinician Actions</option>
            <option value="settings">Settings Changes</option>
          </select>
        </div>

      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="pb-3 pl-2">User / Actor</th>
                <th className="pb-3">Action</th>
                <th className="pb-3">Patient / Entity</th>
                <th className="pb-3">Details / Signal</th>
                <th className="pb-3">Device / IP</th>
                <th className="pb-3 pr-2 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-stone-50/80 transition-all font-sans">
                  
                  {/* User */}
                  <td className="py-3 pl-2 font-bold text-stone-900 flex items-center space-x-2">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    <span>{log.performedBy}</span>
                  </td>

                  {/* Action */}
                  <td className="py-3 font-semibold text-emerald-800">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-[11px]">
                      {log.action}
                    </span>
                  </td>

                  {/* Patient / Entity */}
                  <td className="py-3 text-stone-800 font-medium">
                    {log.patientName || log.entityId}
                  </td>

                  {/* Details */}
                  <td className="py-3 text-stone-600 text-xs font-normal max-w-xs truncate" title={log.details}>
                    {log.details}
                  </td>

                  {/* Device / IP */}
                  <td className="py-3 text-stone-400 text-[11px] font-mono flex items-center space-x-1">
                    <Laptop className="w-3 h-3 text-stone-400 shrink-0" />
                    <span>{log.deviceIp || '192.168.1.42 (Station 01)'}</span>
                  </td>

                  {/* Timestamp */}
                  <td className="py-3 pr-2 text-right text-stone-500 font-mono text-xs">
                    {log.timestamp}
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
