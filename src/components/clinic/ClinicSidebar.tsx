import React from 'react';
import { 
  LayoutDashboard, Users, Clock, Calendar, UserCheck, 
  BarChart3, Receipt, Settings, Shield, Activity, 
  DollarSign, Briefcase, Pill, Sparkles, AlertTriangle, 
  Layers, FileText
} from 'lucide-react';

export type ClinicTab = 
  | 'dashboard'
  | 'patient_flow'
  | 'live_queue'
  | 'scheduling'
  | 'staff_shifts'
  | 'billing'
  | 'financials'
  | 'insurance'
  | 'patient_records'
  | 'pharmacy_labs'
  | 'diagnostic_insights'
  | 'settings'
  | 'audit_logs';

interface ClinicSidebarProps {
  activeTab: ClinicTab;
  onSelectTab: (tab: ClinicTab) => void;
  waitingCount: number;
  stagnantCount: number;
}

export const ClinicSidebar: React.FC<ClinicSidebarProps> = ({
  activeTab,
  onSelectTab,
  waitingCount,
  stagnantCount,
}) => {
  const sections = [
    {
      group: 'Operations',
      items: [
        { id: 'dashboard' as ClinicTab, label: 'Dashboard', icon: LayoutDashboard },
        { 
          id: 'patient_flow' as ClinicTab, 
          label: 'Patient Flow', 
          icon: Users,
          alertBadge: stagnantCount > 0 ? `${stagnantCount} Review` : undefined,
        },
        { 
          id: 'live_queue' as ClinicTab, 
          label: 'Queue', 
          icon: Clock,
          badge: waitingCount > 0 ? `${waitingCount}` : undefined,
        },
        { id: 'scheduling' as ClinicTab, label: 'Scheduling', icon: Calendar },
        { id: 'staff_shifts' as ClinicTab, label: 'Staff & Shifts', icon: UserCheck },
      ],
    },
    {
      group: 'Revenue',
      items: [
        { id: 'billing' as ClinicTab, label: 'Billing & Claims', icon: Receipt },
        { id: 'financials' as ClinicTab, label: 'Financials', icon: DollarSign },
        { id: 'insurance' as ClinicTab, label: 'Insurance Partners', icon: Briefcase },
      ],
    },
    {
      group: 'Clinical',
      items: [
        { id: 'patient_records' as ClinicTab, label: 'Patient Records', icon: FileText },
        { id: 'pharmacy_labs' as ClinicTab, label: 'Pharmacy & Labs', icon: Pill },
        { id: 'diagnostic_insights' as ClinicTab, label: 'Diagnostic Insights', icon: Activity },
      ],
    },
    {
      group: 'System',
      items: [
        { id: 'settings' as ClinicTab, label: 'Settings', icon: Settings },
        { id: 'audit_logs' as ClinicTab, label: 'Audit Logs', icon: Shield },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-stone-200/80 flex flex-col justify-between p-4 shrink-0 h-[calc(100vh-3.75rem)] sticky top-[3.75rem] overflow-y-auto">
      
      <div className="space-y-5">
        
        {/* Clinic Location Badge */}
        <div className="px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200/70">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold text-stone-900 truncate">Odyssey Apex Care</span>
          </div>
          <span className="text-[11px] text-stone-500 block mt-0.5 truncate">
            Suite 101-106 • Command Center
          </span>
        </div>

        {/* Grouped Navigation */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.group} className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 px-3 block">
                {section.group}
              </span>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left ${
                      isActive
                        ? 'bg-stone-900 text-white font-bold shadow-2xs'
                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-stone-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0 ml-1">
                      {item.alertBadge && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                          {item.alertBadge}
                        </span>
                      )}
                      {item.badge && !item.alertBadge && (
                        <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                          isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-700'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Health Indicator, Help & Operator Profile */}
      <div className="pt-3 mt-4 border-t border-stone-200/80 space-y-3">
        {/* Sanctuary Sync Status */}
        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Sanctuary Sync</span>
            <span className="text-[10px] font-bold text-emerald-700 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>100% Live</span>
            </span>
          </div>
          <p className="text-[11px] text-stone-400 mt-1 leading-snug">
            Mobile tokens &amp; Sanctuary Pulse synced with station telemetry.
          </p>
        </div>

        {/* Documentation & Help Link */}
        <div className="flex items-center justify-between px-2 text-xs text-stone-500 hover:text-stone-900 transition-colors cursor-pointer">
          <span className="text-[11px] font-medium flex items-center space-x-1.5">
            <Shield className="w-3.5 h-3.5 text-stone-400" />
            <span>Protocol v2.4 • Help Docs</span>
          </span>
          <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            Active
          </span>
        </div>

        {/* Operator Profile */}
        <div className="p-2.5 rounded-2xl bg-white border border-stone-200/80 flex items-center space-x-3 shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-stone-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
            RN
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900 truncate">Dr. Rajesh Nair</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Active On-Duty"></span>
            </div>
            <span className="text-[10px] text-stone-500 block truncate">Chief Clinical Ops • Station 01</span>
          </div>
        </div>
      </div>

    </aside>
  );
};
