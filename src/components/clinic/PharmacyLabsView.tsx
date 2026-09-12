import React, { useState, useEffect, useMemo } from 'react';
import { 
  Pill, Activity, FileText, Building2, Search, Filter, 
  Download, Plus, ChevronDown, CheckCircle2, Clock, AlertTriangle, 
  RefreshCw, Layers, ArrowRight, X, Check, ShieldCheck
} from 'lucide-react';
import { DataStore } from '../../services/dataStore';
import { PharmacyLabsStore } from '../../services/pharmacyLabsData';
import { 
  MedicationRecord, 
  InvestigationRecord, 
  PrescriptionDocument, 
  PharmacyPartner,
  SuggestedPharmacy 
} from '../../types/pharmacyLabs';

import { MedicationsTab } from './pharmacy/MedicationsTab';
import { MedicationDrawer } from './pharmacy/MedicationDrawer';
import { LabsTab } from './pharmacy/LabsTab';
import { InvestigationDrawer } from './pharmacy/InvestigationDrawer';
import { PrescriptionsTab } from './pharmacy/PrescriptionsTab';
import { PrescriptionDocModal } from './pharmacy/PrescriptionDocModal';
import { PharmacyNetworkTab } from './pharmacy/PharmacyNetworkTab';
import { NewPrescriptionModal } from './pharmacy/NewPrescriptionModal';
import { OrderInvestigationModal } from './pharmacy/OrderInvestigationModal';
import { UploadResultModal } from './pharmacy/UploadResultModal';
import { AddPharmacyModal } from './pharmacy/AddPharmacyModal';

export type PharmacyLabsTab = 'medications' | 'labs' | 'prescriptions' | 'network';

export const PharmacyLabsView: React.FC = () => {
  // Navigation State - Default: 'medications'
  const [activeTab, setActiveTab] = useState<PharmacyLabsTab>('medications');

  // Loading & Error States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  // Global Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [isQuickActionMenuOpen, setIsQuickActionMenuOpen] = useState<boolean>(false);

  // Store data state
  const [medications, setMedications] = useState<MedicationRecord[]>([]);
  const [investigations, setInvestigations] = useState<InvestigationRecord[]>([]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionDocument[]>([]);
  const [pharmacies, setPharmacies] = useState<PharmacyPartner[]>([]);
  const [suggestedPharmacies, setSuggestedPharmacies] = useState<SuggestedPharmacy[]>([]);

  // Drawers & Modals State
  const [selectedMedication, setSelectedMedication] = useState<MedicationRecord | null>(null);
  const [selectedInvestigation, setSelectedInvestigation] = useState<InvestigationRecord | null>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionDocument | null>(null);

  const [isNewRxModalOpen, setIsNewRxModalOpen] = useState<boolean>(false);
  const [isOrderInvModalOpen, setIsOrderInvModalOpen] = useState<boolean>(false);
  const [isUploadResultModalOpen, setIsUploadResultModalOpen] = useState<boolean>(false);
  const [isAddPharmacyModalOpen, setIsAddPharmacyModalOpen] = useState<boolean>(false);

  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const patients = useMemo(() => DataStore.getPatients(), []);

  // Load Data
  const loadData = () => {
    setIsLoading(true);
    setHasError(false);
    try {
      setMedications(PharmacyLabsStore.getMedications());
      setInvestigations(PharmacyLabsStore.getInvestigations());
      setPrescriptions(PharmacyLabsStore.getPrescriptions());
      setPharmacies(PharmacyLabsStore.getPharmacies());
      setSuggestedPharmacies(PharmacyLabsStore.getSuggestedPharmacies());
    } catch (err) {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 3500);
  };

  // KPIs
  const summaryKpis = useMemo(() => {
    return PharmacyLabsStore.getSummaryKpis();
  }, [medications, investigations]);

  const labKpis = useMemo(() => {
    return PharmacyLabsStore.getLabKpis();
  }, [investigations]);

  // Handlers
  const handleUpdateMedicationStatus = (id: string, status: MedicationRecord['status']) => {
    const updated = PharmacyLabsStore.updateMedicationStatus(id, status);
    setMedications([...updated]);
    if (selectedMedication && selectedMedication.id === id) {
      setSelectedMedication({ ...selectedMedication, status });
    }
    showToast(`Prescription status updated to: ${status}`);
  };

  const handleReviewInvestigation = (id: string, notes: string) => {
    const updated = PharmacyLabsStore.reviewInvestigation(id, 'Dr. A. Sharma', notes);
    setInvestigations([...updated]);
    if (selectedInvestigation && selectedInvestigation.id === id) {
      setSelectedInvestigation({
        ...selectedInvestigation,
        status: 'Reviewed',
        resultStatus: 'Reviewed',
        reviewedBy: 'Dr. A. Sharma',
        doctorReviewNote: notes,
      });
    }
    showToast('Investigation reviewed and synchronized with patient longitudinal journey.');
  };

  const handleIssuePrescription = (newRecord: MedicationRecord, newDoc: PrescriptionDocument) => {
    PharmacyLabsStore.addMedication(newRecord);
    PharmacyLabsStore.addPrescription(newDoc);
    setMedications([...PharmacyLabsStore.getMedications()]);
    setPrescriptions([...PharmacyLabsStore.getPrescriptions()]);
    showToast(`New prescription ${newDoc.id} issued successfully.`);
  };

  const handleOrderInvestigation = (newInv: InvestigationRecord) => {
    PharmacyLabsStore.orderInvestigation(newInv);
    setInvestigations([...PharmacyLabsStore.getInvestigations()]);
    showToast(`Diagnostic order ${newInv.sampleId} dispatched.`);
  };

  const handleUploadResult = (id: string, summary: string) => {
    const updated = PharmacyLabsStore.updateInvestigationResult(id, summary);
    setInvestigations([...updated]);
    showToast('Diagnostic findings uploaded. Report ready for clinician review.');
  };

  const handleAddPharmacy = (partner: PharmacyPartner) => {
    PharmacyLabsStore.addPharmacy(partner);
    setPharmacies([...PharmacyLabsStore.getPharmacies()]);
    showToast(`Affiliated partner ${partner.name} registered.`);
  };

  const handleOpenPrescriptionDocumentById = (rxId: string) => {
    const doc = prescriptions.find(p => p.id === rxId) || prescriptions[0];
    if (doc) {
      setSelectedPrescription(doc);
    }
  };

  const handleExportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Record ID,Patient,Item,Type,Status\n" +
      medications.map(m => `"${m.prescriptionId}","${m.patientName}","${m.medicationName}","Medication","${m.status}"`).join("\n") + "\n" +
      investigations.map(i => `"${i.sampleId}","${i.patientName}","${i.investigationName}","Investigation","${i.status}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `odyssey_pharmacy_labs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Clinical operations report exported as CSV.');
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification Banner */}
      {notificationToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-stone-900 text-white rounded-2xl shadow-xl flex items-center space-x-3 text-xs border border-stone-800 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{notificationToast}</span>
          <button 
            onClick={() => setNotificationToast(null)}
            className="text-stone-400 hover:text-white ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. PAGE HEADER */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          {/* Title & Subtitle */}
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">
                Pharmacy &amp; Labs
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                Clinical Operations Workspace
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Manage prescriptions, medication fulfillment, investigations, and patient results.
            </p>
          </div>

          {/* Right Controls: Search, Filter, Export, "+ New" Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient, medicine, lab, Rx..."
                className="pl-8 pr-3 py-2 bg-stone-50 border border-stone-200/80 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-600 w-full sm:w-56 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-colors ${
                  statusFilter !== 'all' 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                    : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Filter className="w-3.5 h-3.5 text-stone-500" />
                <span>{statusFilter === 'all' ? 'Filter' : statusFilter}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 mt-1.5 w-48 bg-white border border-stone-200 rounded-2xl shadow-xl p-1.5 z-40 text-xs animate-in fade-in">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    Filter by Status
                  </div>
                  {['all', 'Prescribed', 'Dispensing', 'Dispensed', 'Partially Dispensed', 'Report Ready', 'Reviewed', 'Refill Due'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => {
                        setStatusFilter(opt);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                        statusFilter === opt ? 'bg-stone-100 font-bold text-stone-900' : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span>{opt === 'all' ? 'All Statuses' : opt}</span>
                      {statusFilter === opt && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Export */}
            <button
              onClick={handleExportData}
              className="px-3 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-2xs"
              title="Export Clinical Records"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {/* "+ New" Quick Action Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsQuickActionMenuOpen(!isQuickActionMenuOpen)}
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-white" />
                <span>+ New</span>
                <ChevronDown className="w-3 h-3 text-stone-300" />
              </button>

              {isQuickActionMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-52 bg-white border border-stone-200 rounded-2xl shadow-xl p-1.5 z-40 text-xs animate-in fade-in divide-y divide-stone-100">
                  <div className="space-y-0.5 pb-1">
                    <button
                      onClick={() => {
                        setIsQuickActionMenuOpen(false);
                        setIsNewRxModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-emerald-50 text-stone-800 hover:text-emerald-950 font-bold flex items-center space-x-2 transition-colors"
                    >
                      <Pill className="w-4 h-4 text-emerald-700" />
                      <span>New Prescription</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsQuickActionMenuOpen(false);
                        setIsOrderInvModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-amber-50 text-stone-800 hover:text-amber-950 font-bold flex items-center space-x-2 transition-colors"
                    >
                      <Activity className="w-4 h-4 text-amber-700" />
                      <span>Order Investigation</span>
                    </button>
                  </div>

                  <div className="space-y-0.5 pt-1">
                    <button
                      onClick={() => {
                        setIsQuickActionMenuOpen(false);
                        setIsAddPharmacyModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-stone-100 text-stone-800 font-medium flex items-center space-x-2 transition-colors"
                    >
                      <Building2 className="w-4 h-4 text-stone-600" />
                      <span>Add Pharmacy</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsQuickActionMenuOpen(false);
                        setIsUploadResultModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-stone-100 text-stone-800 font-medium flex items-center space-x-2 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-stone-600" />
                      <span>Upload Result</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* 2. SUMMARY KPI ROW (5 compact metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        
        {/* Metric 1: Active Prescriptions */}
        <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Active Prescriptions
            </span>
            <Pill className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1.5">
            <span className="text-2xl font-mono font-black text-stone-900">
              {summaryKpis.activePrescriptions}
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
              Active
            </span>
          </div>
          <span className="text-[10px] text-stone-400 block mt-1">
            Across ongoing visits
          </span>
        </div>

        {/* Metric 2: Medicines Dispensed Today */}
        <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Dispensed Today
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1.5">
            <span className="text-2xl font-mono font-black text-stone-900">
              {summaryKpis.dispensedToday}
            </span>
            <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-1.5 py-0.2 rounded">
              Fulfilled
            </span>
          </div>
          <span className="text-[10px] text-stone-400 block mt-1">
            Verified local pickups
          </span>
        </div>

        {/* Metric 3: Pending Investigations */}
        <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Pending Investigations
            </span>
            <Activity className="w-4 h-4 text-stone-500" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1.5">
            <span className="text-2xl font-mono font-black text-stone-900">
              {summaryKpis.pendingInvestigations}
            </span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
              In Flight
            </span>
          </div>
          <span className="text-[10px] text-stone-400 block mt-1">
            Pathology &amp; imaging
          </span>
        </div>

        {/* Metric 4: Results Awaiting Review */}
        <div className="bg-white p-4 rounded-3xl border border-amber-300 bg-amber-50/40 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider block">
              Awaiting Review
            </span>
            <Clock className="w-4 h-4 text-amber-700" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1.5">
            <span className="text-2xl font-mono font-black text-amber-950">
              {summaryKpis.resultsAwaitingReview}
            </span>
            <span className="text-[10px] font-extrabold text-amber-900 bg-amber-200/70 px-1.5 py-0.2 rounded">
              Action Req.
            </span>
          </div>
          <span className="text-[10px] text-amber-800 font-medium block mt-1">
            Doctor review pending
          </span>
        </div>

        {/* Metric 5: Refill / Follow-up Due */}
        <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Refill / Follow-up Due
            </span>
            <RefreshCw className="w-4 h-4 text-stone-500" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1.5">
            <span className="text-2xl font-mono font-black text-stone-900">
              {summaryKpis.refillDue}
            </span>
            <span className="text-[10px] font-bold text-stone-600 bg-stone-100 px-1.5 py-0.2 rounded">
              Follow-up
            </span>
          </div>
          <span className="text-[10px] text-stone-400 block mt-1">
            Course nearing completion
          </span>
        </div>

      </div>

      {/* 3. SEGMENTED NAVIGATION */}
      <div className="bg-white rounded-2xl p-1.5 border border-stone-200/80 shadow-2xs flex items-center justify-between overflow-x-auto">
        <div className="flex items-center space-x-1 min-w-max">
          
          <button
            type="button"
            onClick={() => setActiveTab('medications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'medications'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Medications</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
              activeTab === 'medications' ? 'bg-stone-800 text-stone-200' : 'bg-stone-100 text-stone-600'
            }`}>
              {medications.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('labs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'labs'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Lab &amp; Investigations</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
              activeTab === 'labs' ? 'bg-stone-800 text-stone-200' : 'bg-stone-100 text-stone-600'
            }`}>
              {investigations.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('prescriptions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'prescriptions'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Prescriptions</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
              activeTab === 'prescriptions' ? 'bg-stone-800 text-stone-200' : 'bg-stone-100 text-stone-600'
            }`}>
              {prescriptions.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('network')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'network'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Pharmacy Network</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
              activeTab === 'network' ? 'bg-stone-800 text-stone-200' : 'bg-stone-100 text-stone-600'
            }`}>
              {pharmacies.length}
            </span>
          </button>

        </div>

        <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>Longitudinal Linkage:</span>
          <strong className="text-stone-800">Consultation → Rx → Diagnostics → Patient Journey</strong>
        </div>
      </div>

      {/* 4. CONTENT & ERROR / LOADING STATES */}
      {hasError ? (
        <div className="bg-white rounded-3xl p-12 border border-rose-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-stone-900">Unable to load medication records</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            An error occurred while loading clinical records. Please retry to synchronize with the local data store.
          </p>
          <button
            onClick={loadData}
            className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : isLoading ? (
        <div className="bg-white rounded-3xl p-8 border border-stone-200/80 space-y-4 animate-pulse">
          <div className="h-4 bg-stone-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-12 bg-stone-100 rounded-2xl"></div>
            <div className="h-12 bg-stone-100 rounded-2xl"></div>
            <div className="h-12 bg-stone-100 rounded-2xl"></div>
          </div>
        </div>
      ) : (
        <div>
          {/* TAB 1: MEDICATIONS */}
          {activeTab === 'medications' && (
            <MedicationsTab
              medications={medications}
              onSelectMedication={(med) => setSelectedMedication(med)}
              searchQuery={searchQuery}
              statusFilter={statusFilter}
            />
          )}

          {/* TAB 2: LAB & INVESTIGATIONS */}
          {activeTab === 'labs' && (
            <LabsTab
              investigations={investigations}
              onSelectInvestigation={(inv) => setSelectedInvestigation(inv)}
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              labKpis={labKpis}
            />
          )}

          {/* TAB 3: PRESCRIPTIONS */}
          {activeTab === 'prescriptions' && (
            <PrescriptionsTab
              prescriptions={prescriptions}
              onSelectPrescription={(doc) => setSelectedPrescription(doc)}
              searchQuery={searchQuery}
              statusFilter={statusFilter}
            />
          )}

          {/* TAB 4: PHARMACY NETWORK */}
          {activeTab === 'network' && (
            <PharmacyNetworkTab
              pharmacies={pharmacies}
              onOpenAddModal={() => setIsAddPharmacyModalOpen(true)}
              searchQuery={searchQuery}
            />
          )}
        </div>
      )}

      {/* 5. DRAWERS & MODALS */}

      {/* Medication Details Drawer */}
      {selectedMedication && (
        <MedicationDrawer
          medication={selectedMedication}
          suggestedPharmacies={suggestedPharmacies}
          onClose={() => setSelectedMedication(null)}
          onUpdateStatus={handleUpdateMedicationStatus}
          onViewPrescriptionDocument={handleOpenPrescriptionDocumentById}
        />
      )}

      {/* Investigation Details Drawer */}
      {selectedInvestigation && (
        <InvestigationDrawer
          investigation={selectedInvestigation}
          onClose={() => setSelectedInvestigation(null)}
          onReviewResult={handleReviewInvestigation}
        />
      )}

      {/* Full Prescription Document Modal */}
      {selectedPrescription && (
        <PrescriptionDocModal
          prescription={selectedPrescription}
          onClose={() => setSelectedPrescription(null)}
        />
      )}

      {/* New Prescription Multi-step Modal */}
      {isNewRxModalOpen && (
        <NewPrescriptionModal
          patients={patients}
          onClose={() => setIsNewRxModalOpen(false)}
          onIssuePrescription={handleIssuePrescription}
        />
      )}

      {/* Order Investigation Modal */}
      {isOrderInvModalOpen && (
        <OrderInvestigationModal
          patients={patients}
          onClose={() => setIsOrderInvModalOpen(false)}
          onOrderInvestigation={handleOrderInvestigation}
        />
      )}

      {/* Upload Result Modal */}
      {isUploadResultModalOpen && (
        <UploadResultModal
          investigations={investigations}
          onClose={() => setIsUploadResultModalOpen(false)}
          onUploadResult={handleUploadResult}
        />
      )}

      {/* Add Pharmacy Partner Modal */}
      {isAddPharmacyModalOpen && (
        <AddPharmacyModal
          onClose={() => setIsAddPharmacyModalOpen(false)}
          onAddPharmacy={handleAddPharmacy}
        />
      )}

    </div>
  );
};
