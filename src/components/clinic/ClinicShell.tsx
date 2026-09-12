import React, { useState } from 'react';
import { ClinicSidebar, ClinicTab } from './ClinicSidebar';
import { ClinicTopBar } from './ClinicTopBar';
import { ClinicDashboard } from './ClinicDashboard';
import { LiveQueueView } from './LiveQueueView';
import { PatientFlowView } from './PatientFlowView';
import { SchedulingView } from './SchedulingView';
import { StaffShiftsView } from './StaffShiftsView';
import { RevenueViews } from './RevenueViews';
import { PatientRecordsView } from './PatientRecordsView';
import { PharmacyLabsView } from './PharmacyLabsView';
import { DiagnosticInsightsView } from './DiagnosticInsightsView';
import { ClinicSettingsView } from './ClinicSettingsView';
import { AuditLogsView } from './AuditLogsView';
import { PreConsultationSnapshotModal } from './PreConsultationSnapshotModal';
import { NewPatientModal } from './NewPatientModal';
import { Token, Doctor } from '../../types';
import { DataStore } from '../../services/dataStore';

interface ClinicShellProps {
  queue: Token[];
  doctors: Doctor[];
  onAdvanceQueue: () => void;
  onRebalanceDPS: () => void;
  controlledTab?: ClinicTab;
  controlledSnapshotTokenNumber?: string | null;
  onTabChange?: (tab: ClinicTab) => void;
}

export const ClinicShell: React.FC<ClinicShellProps> = ({
  queue,
  doctors,
  onAdvanceQueue,
  onRebalanceDPS,
  controlledTab,
  controlledSnapshotTokenNumber,
  onTabChange,
}) => {
  const [internalTab, setInternalTab] = useState<ClinicTab>('dashboard');
  const activeTab = controlledTab !== undefined ? controlledTab : internalTab;

  const setActiveTab = (tab: ClinicTab) => {
    setInternalTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>('pat_aarav_0');
  const [activeSnapshotToken, setActiveSnapshotToken] = useState<Token | null>(null);
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);

  const [localQueue, setLocalQueue] = useState<Token[]>(queue);

  // Sync with prop changes
  React.useEffect(() => {
    setLocalQueue(queue);
  }, [queue]);

  const displayQueue = localQueue;

  // Sync snapshot token when controlledSnapshotTokenNumber changes
  React.useEffect(() => {
    if (controlledSnapshotTokenNumber) {
      const target = displayQueue.find(t => t.tokenNumber === controlledSnapshotTokenNumber || t.id === controlledSnapshotTokenNumber) || null;
      setActiveSnapshotToken(target);
    }
  }, [controlledSnapshotTokenNumber, displayQueue]);

  const waitingCount = displayQueue.filter(t => t.status === 'waiting').length;
  const stagnantCount = displayQueue.filter(t => t.stagnationFlag && t.status === 'waiting').length;

  const handleStateChange = () => {
    // Immediate reactive local re-render from DataStore
    setLocalQueue(DataStore.getQueue());
  };

  const handleOpenSnapshotForAarav = () => {
    const aaravToken = displayQueue.find(t => t.tokenNumber === 'A-27' || (t.patientName && t.patientName.includes('Aarav'))) || displayQueue[0];
    if (aaravToken) {
      setActiveSnapshotToken(aaravToken);
    }
  };

  const handleStartConsultationFromSnapshot = (tokenId: string) => {
    DataStore.startConsultation(tokenId);
    handleStateChange();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <ClinicDashboard
            queue={displayQueue}
            doctors={doctors}
            onNavigateToQueue={() => setActiveTab('live_queue')}
            onNavigateToRecords={(id) => {
              if (id) setSelectedPatientId(id);
              setActiveTab('patient_records');
            }}
            onOpenSnapshot={(token) => setActiveSnapshotToken(token)}
            onStateChange={handleStateChange}
          />
        );

      case 'patient_flow':
        return (
          <PatientFlowView
            queue={displayQueue}
            doctors={doctors}
            onOpenSnapshot={(token) => setActiveSnapshotToken(token)}
            onNavigateToRecords={(id) => {
              setSelectedPatientId(id);
              setActiveTab('patient_records');
            }}
            onNavigateToDiagnosticJourney={(id) => {
              if (id) setSelectedPatientId(id);
              setActiveTab('diagnostic_insights');
            }}
            onNavigateToQueue={() => setActiveTab('live_queue')}
            onOpenNewPatient={() => setIsNewPatientModalOpen(true)}
            onStateChange={handleStateChange}
          />
        );

      case 'live_queue':
        return (
          <LiveQueueView
            queue={displayQueue}
            doctors={doctors}
            onAdvanceQueue={onAdvanceQueue}
            onRebalanceDPS={onRebalanceDPS}
            onSelectPatient={(patientId) => {
              setSelectedPatientId(patientId);
              setActiveTab('patient_records');
            }}
            onNavigateToDiagnosticJourney={(id) => {
              if (id) setSelectedPatientId(id);
              setActiveTab('diagnostic_insights');
            }}
            onOpenSnapshot={(token) => setActiveSnapshotToken(token)}
            onOpenNewPatient={() => setIsNewPatientModalOpen(true)}
            onStateChange={handleStateChange}
          />
        );

      case 'scheduling':
        return <SchedulingView doctors={doctors} />;

      case 'staff_shifts':
        return <StaffShiftsView />;

      case 'billing':
        return <RevenueViews viewMode="billing" />;

      case 'financials':
        return <RevenueViews viewMode="financials" />;

      case 'insurance':
        return <RevenueViews viewMode="insurance" />;

      case 'patient_records':
        return (
          <PatientRecordsView
            selectedPatientId={selectedPatientId}
            onSelectPatientId={setSelectedPatientId}
            onOpenSnapshot={(token) => setActiveSnapshotToken(token)}
            onCallPatient={(tokenId) => {
              DataStore.callToken(tokenId);
              handleStateChange();
            }}
            onNavigateToDiagnosticJourney={() => setActiveTab('diagnostic_insights')}
            queue={displayQueue}
          />
        );

      case 'pharmacy_labs':
        return <PharmacyLabsView />;

      case 'diagnostic_insights':
        return (
          <DiagnosticInsightsView
            onOpenSnapshot={(token) => setActiveSnapshotToken(token)}
            onNavigateToRecords={(id) => {
              setSelectedPatientId(id);
              setActiveTab('patient_records');
            }}
          />
        );

      case 'settings':
        return <ClinicSettingsView />;

      case 'audit_logs':
        return <AuditLogsView />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      
      {/* Top Bar with Clinic Name, Date, Search, Notifications, Profile, and "+ New" */}
      <ClinicTopBar
        onOpenNewModal={() => setIsNewPatientModalOpen(true)}
        onOpenSnapshotForAarav={handleOpenSnapshotForAarav}
        onSearchQuery={(q) => {
          if ((q || '').toLowerCase().includes('a-27') || (q || '').toLowerCase().includes('aarav')) {
            handleOpenSnapshotForAarav();
          }
        }}
      />

      <div className="flex flex-1">
        
        {/* Left Sidebar with Exact 4 Groups */}
        <ClinicSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          waitingCount={waitingCount}
          stagnantCount={stagnantCount}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {renderContent()}
        </main>

      </div>

      {/* Pre-Consultation Clinical Snapshot Modal */}
      {activeSnapshotToken && (
        <PreConsultationSnapshotModal
          token={activeSnapshotToken}
          onClose={() => setActiveSnapshotToken(null)}
          onStartConsultation={handleStartConsultationFromSnapshot}
          onReviewFullJourney={(patId) => {
            setSelectedPatientId(patId);
            setActiveTab('patient_records');
          }}
          onOpenReferralModal={(patId) => {
            setSelectedPatientId(patId);
            setActiveTab('patient_records');
          }}
        />
      )}

      {/* Walk-in "+ New" Registration Modal */}
      {isNewPatientModalOpen && (
        <NewPatientModal
          doctors={doctors}
          onClose={() => setIsNewPatientModalOpen(false)}
          onPatientCreated={() => {
            handleStateChange();
          }}
        />
      )}

    </div>
  );
};
