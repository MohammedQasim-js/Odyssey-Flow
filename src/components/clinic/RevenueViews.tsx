import React, { useState, useMemo } from 'react';
import { 
  DollarSign, Receipt, Briefcase, ShieldCheck, CheckCircle2, Clock, 
  ArrowUpRight, Filter, Download, Plus, Search, X, AlertCircle, FileText,
  CreditCard, Smartphone, Banknote, Building2
} from 'lucide-react';
import { DataStore } from '../../services/dataStore';
import { BillingRecord, InsuranceClaim } from '../../types';

interface RevenueViewsProps {
  viewMode: 'billing' | 'financials' | 'insurance';
}

export const RevenueViews: React.FC<RevenueViewsProps> = ({ viewMode }) => {
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>(() => DataStore.getBillingRecords());
  const [claims, setClaims] = useState<InsuranceClaim[]>(() => DataStore.getInsuranceClaims());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Billing Filters & Modals
  const [billingSearch, setBillingSearch] = useState('');
  const [billingStatusFilter, setBillingStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [isNewBillModalOpen, setIsNewBillModalOpen] = useState(false);
  const [payingBill, setPayingBill] = useState<BillingRecord | null>(null);
  const [selectedPayMethod, setSelectedPayMethod] = useState('UPI Auto-Pay');

  // New Bill Form
  const [formPatientName, setFormPatientName] = useState('');
  const [formTokenNumber, setFormTokenNumber] = useState('');
  const [formDoctorName, setFormDoctorName] = useState('Dr. A. Sharma');
  const [formDescription, setFormDescription] = useState('Comprehensive Diagnostic Consult');
  const [formAmount, setFormAmount] = useState('800');
  const [formStatus, setFormStatus] = useState<'paid' | 'pending'>('pending');
  const [formBillError, setFormBillError] = useState<string | null>(null);

  // Insurance Filters & Modals
  const [claimStatusFilter, setClaimStatusFilter] = useState<string>('all');
  const [isNewClaimModalOpen, setIsNewClaimModalOpen] = useState(false);
  const [claimPatientName, setClaimPatientName] = useState('');
  const [claimInsurer, setClaimInsurer] = useState('Star Health & Allied');
  const [claimPolicyNo, setClaimPolicyNo] = useState('');
  const [claimAmount, setClaimAmount] = useState('2500');
  const [claimNotes, setClaimNotes] = useState('');
  const [claimError, setClaimError] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const refreshBilling = () => {
    setBillingRecords([...DataStore.getBillingRecords()]);
  };

  const refreshClaims = () => {
    setClaims([...DataStore.getInsuranceClaims()]);
  };

  // Dynamic Financial Calculations
  const grossRevenue = useMemo(() => {
    return billingRecords.reduce((acc, b) => acc + (b.totalAmount || 0), 0);
  }, [billingRecords]);

  const realizedRevenue = useMemo(() => {
    return billingRecords
      .filter(b => b.status === 'paid')
      .reduce((acc, b) => acc + (b.totalAmount || 0), 0);
  }, [billingRecords]);

  const pendingReceivables = useMemo(() => {
    return billingRecords
      .filter(b => b.status === 'pending')
      .reduce((acc, b) => acc + (b.totalAmount || 0), 0);
  }, [billingRecords]);

  const totalClaimsAmount = useMemo(() => {
    return claims.reduce((acc, c) => acc + (c.amountNumber || 0), 0);
  }, [claims]);

  const avgRevenuePerEncounter = useMemo(() => {
    if (billingRecords.length === 0) return 0;
    return Math.round(grossRevenue / billingRecords.length);
  }, [grossRevenue, billingRecords]);

  // Filtered Billing Records
  const filteredBilling = useMemo(() => {
    return billingRecords.filter(b => {
      if (billingStatusFilter !== 'all' && b.status !== billingStatusFilter) return false;
      if (billingSearch.trim()) {
        const q = billingSearch.toLowerCase();
        const matchName = (b.patientName || '').toLowerCase().includes(q);
        const matchToken = (b.tokenNumber || '').toLowerCase().includes(q);
        const matchDoctor = (b.doctorName || '').toLowerCase().includes(q);
        if (!matchName && !matchToken && !matchDoctor) return false;
      }
      return true;
    });
  }, [billingRecords, billingStatusFilter, billingSearch]);

  // Filtered Claims
  const filteredClaims = useMemo(() => {
    return claims.filter(c => {
      if (claimStatusFilter !== 'all') {
        if (claimStatusFilter === 'approved' && !c.status.includes('Approved')) return false;
        if (claimStatusFilter === 'preauth' && !c.status.includes('Pre-Auth')) return false;
        if (claimStatusFilter === 'review' && !c.status.includes('Review')) return false;
        if (claimStatusFilter === 'settled' && !c.status.includes('Settled')) return false;
      }
      return true;
    });
  }, [claims, claimStatusFilter]);

  // Handle Mark as Paid
  const handleConfirmPayment = () => {
    if (!payingBill) return;
    DataStore.payBillingRecord(payingBill.id, selectedPayMethod);
    refreshBilling();
    setPayingBill(null);
    showToast(`Invoice ${payingBill.tokenNumber} marked PAID via ${selectedPayMethod}.`);
  };

  // Handle Create New Bill
  const handleCreateBillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPatientName.trim() || !formTokenNumber.trim()) {
      setFormBillError('Please enter both patient name and token number.');
      return;
    }
    const amt = parseFloat(formAmount) || 500;
    const newBill = DataStore.createBillingRecord({
      tokenNumber: formTokenNumber.trim(),
      patientId: `pat_${Date.now()}`,
      patientName: formPatientName.trim(),
      doctorName: formDoctorName,
      clinicName: 'Odyssey Apex Health Center',
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: [
        { description: formDescription.trim() || 'General OPD Consultation', amount: amt },
      ],
      totalAmount: amt,
      status: formStatus,
      paymentMethod: formStatus === 'paid' ? 'UPI FastPay' : undefined,
    });

    refreshBilling();
    setIsNewBillModalOpen(false);
    setFormPatientName('');
    setFormTokenNumber('');
    setFormBillError(null);
    showToast(`Created invoice ${newBill.id} for ${newBill.patientName} (₹${newBill.totalAmount}).`);
  };

  // Handle Claim Status Update
  const handleUpdateClaimStatus = (claimId: string, status: InsuranceClaim['status']) => {
    DataStore.updateClaimStatus(claimId, status);
    refreshClaims();
    showToast(`Claim ${claimId} transitioned to: ${status}`);
  };

  // Handle Create New Claim
  const handleCreateClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimPatientName.trim() || !claimPolicyNo.trim()) {
      setClaimError('Please provide patient name and insurance policy number.');
      return;
    }
    const amtNum = parseFloat(claimAmount) || 2000;
    const newClaim = DataStore.createInsuranceClaim({
      patient: claimPatientName.trim(),
      insurer: claimInsurer,
      policyNo: claimPolicyNo.trim().toUpperCase(),
      amount: `₹${amtNum.toLocaleString()}`,
      amountNumber: amtNum,
      status: 'Pre-Auth Verified',
      diagnosis: 'Diagnostic Investigation & Specialty Pacing Workup',
      preAuthNotes: claimNotes.trim() || 'Pre-authorized digital cashless verification submitted to insurer.',
    });

    refreshClaims();
    setIsNewClaimModalOpen(false);
    setClaimPatientName('');
    setClaimPolicyNo('');
    setClaimNotes('');
    setClaimError(null);
    showToast(`Pre-auth claim ${newClaim.id} submitted for ${newClaim.patient}.`);
  };

  // Handle Export Financial Ledger CSV
  const handleExportLedger = () => {
    const headers = ['Invoice_ID', 'Token_Number', 'Patient_Name', 'Doctor_Service', 'Items', 'Total_INR', 'Payment_Method', 'Status', 'Date'];
    const rows = billingRecords.map(b => [
      `"${b.id}"`,
      `"${b.tokenNumber}"`,
      `"${b.patientName}"`,
      `"${b.doctorName || 'General OPD'}"`,
      `"${b.items.map(it => it.description).join('; ')}"`,
      b.totalAmount,
      `"${b.paymentMethod || 'Unpaid'}"`,
      `"${b.status}"`,
      `"${b.date}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `odyssey_financial_ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    DataStore.logAudit(
      'FINANCIAL_LEDGER_EXPORTED',
      'billing',
      'all',
      `Exported ${billingRecords.length} billing records to CSV ledger.`,
      'Chief Financial Officer',
      '192.168.1.5 (Finance Station)'
    );

    showToast(`Exported ${billingRecords.length} billing records to CSV ledger.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-900 text-white text-xs font-bold flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            {viewMode === 'billing' && <Receipt className="w-5 h-5 text-emerald-700" />}
            {viewMode === 'financials' && <DollarSign className="w-5 h-5 text-emerald-700" />}
            {viewMode === 'insurance' && <Briefcase className="w-5 h-5 text-emerald-700" />}
            <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
              {viewMode === 'billing' && 'Billing & Consultation Claims'}
              {viewMode === 'financials' && 'Clinic Financials & Revenue Analytics'}
              {viewMode === 'insurance' && 'Insurance Partners & Cashless TPA'}
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Zero-friction digital payments synced with token dispatch and longitudinal claims validation.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={handleExportLedger}
            className="px-3.5 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 flex items-center space-x-1.5 shadow-xs transition-all"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Financial Ledger</span>
          </button>
        </div>
      </div>

      {/* Simulated Integration Notice for Insurance */}
      {viewMode === 'insurance' && (
        <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-center justify-between text-xs text-blue-900">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <span className="font-extrabold block">Simulated Cashless TPA Integration (Prototype Mode)</span>
              <span className="text-[11px] text-blue-700">
                Demonstrating automated policy eligibility verification and instant claim clearance with synthetic health insurer APIs.
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsNewClaimModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold shrink-0 shadow-xs flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5 text-blue-300" />
            <span>Submit Pre-Auth Claim</span>
          </button>
        </div>
      )}

      {/* Financial Overview Cards (Dynamically Computed from DataStore) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Gross Clinical Revenue</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-stone-900">₹{grossRevenue.toLocaleString()}</span>
            <span className="text-[11px] font-bold text-emerald-700">+{billingRecords.length} billed</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Consultations &amp; Triage services</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Realized Collections</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-emerald-800">₹{realizedRevenue.toLocaleString()}</span>
            <span className="text-[11px] font-bold text-emerald-700">
              {grossRevenue > 0 ? `${Math.round((realizedRevenue / grossRevenue) * 100)}%` : '0%'}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Settled via UPI, Cash &amp; Cards</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Pending Receivables</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-amber-800">₹{pendingReceivables.toLocaleString()}</span>
            <span className="text-[11px] font-bold text-amber-700">
              {billingRecords.filter(b => b.status === 'pending').length} pending
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Awaiting checkout settlement</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Avg Encounter Value</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-stone-900">₹{avgRevenuePerEncounter.toLocaleString()}</span>
            <span className="text-[11px] font-bold text-emerald-700">Standard Tier</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Zero-friction billing</p>
        </div>
      </div>

      {/* 1. BILLING TAB CONTENT */}
      {viewMode === 'billing' && (
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200/80 shadow-2xs space-y-4 min-w-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
                Recent Patient Invoices &amp; Token Settlements
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Every consultation generates a canonical token invoice synchronized with digital checkout.
              </p>
            </div>

            <button
              onClick={() => setIsNewBillModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Generate New Bill</span>
            </button>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={billingSearch}
                onChange={(e) => setBillingSearch(e.target.value)}
                placeholder="Search invoices by patient name, token (e.g. A-27), or doctor..."
                className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-stone-400" />
              <select
                value={billingStatusFilter}
                onChange={(e) => setBillingStatusFilter(e.target.value as any)}
                className="text-xs font-semibold px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900"
              >
                <option value="all">All Invoices ({billingRecords.length})</option>
                <option value="paid">Paid ({billingRecords.filter(b => b.status === 'paid').length})</option>
                <option value="pending">Pending ({billingRecords.filter(b => b.status === 'pending').length})</option>
              </select>
            </div>
          </div>

          {/* Table */}
          {filteredBilling.length === 0 ? (
            <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200 space-y-2">
              <Receipt className="w-8 h-8 text-stone-400 mx-auto" />
              <p className="text-xs font-bold text-stone-700">No invoices match your search criteria</p>
              <p className="text-[11px] text-stone-500">Try adjusting your filters or generating a new invoice.</p>
            </div>
          ) : (
            <div className="overflow-x-auto min-w-0">
              <table className="w-full min-w-[700px] text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px] tracking-wider">
                    <th className="pb-3 pl-2">Token</th>
                    <th className="pb-3">Patient</th>
                    <th className="pb-3">Clinician / Service</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3">Total Amount</th>
                    <th className="pb-3">Payment Method</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 pr-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {filteredBilling.map(b => (
                    <tr key={b.id} className="hover:bg-stone-50/80 transition-all">
                      <td className="py-3 pl-2 font-mono font-bold text-stone-900">{b.tokenNumber}</td>
                      <td className="py-3 text-stone-900 font-bold">{b.patientName}</td>
                      <td className="py-3 text-stone-600">{b.doctorName || 'General OPD'}</td>
                      <td className="py-3 text-stone-500 max-w-xs truncate" title={b.items.map(it => it.description).join(', ')}>
                        {b.items.map(it => it.description).join(', ')}
                      </td>
                      <td className="py-3 font-mono font-black text-stone-900">₹{b.totalAmount}</td>
                      <td className="py-3 text-stone-600">{b.paymentMethod || 'Awaiting Checkout'}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          b.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {b.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 pr-2 text-right">
                        {b.status === 'pending' ? (
                          <button
                            onClick={() => setPayingBill(b)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition-all inline-flex items-center space-x-1"
                          >
                            <CreditCard className="w-3 h-3" />
                            <span>Mark Paid</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-stone-400 font-semibold">Settled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 2. FINANCIALS TAB CONTENT */}
      {viewMode === 'financials' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-2xs space-y-3">
              <div className="flex items-center space-x-2 pb-2 border-b border-stone-100">
                <Receipt className="w-4 h-4 text-emerald-700" />
                <h4 className="text-xs font-bold text-stone-900 uppercase">Consultations</h4>
              </div>
              <p className="text-2xl font-black text-stone-900">₹{(realizedRevenue * 0.7).toFixed(0)}</p>
              <p className="text-[11px] text-stone-500">General OPD and subspecialty reviews.</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-2xs space-y-3">
              <div className="flex items-center space-x-2 pb-2 border-b border-stone-100">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <h4 className="text-xs font-bold text-stone-900 uppercase">Diagnostic &amp; Labs</h4>
              </div>
              <p className="text-2xl font-black text-stone-900">₹{(realizedRevenue * 0.25).toFixed(0)}</p>
              <p className="text-[11px] text-stone-500">Ultrasound, Serology, and Redundant test yield.</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-2xs space-y-3">
              <div className="flex items-center space-x-2 pb-2 border-b border-stone-100">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <h4 className="text-xs font-bold text-stone-900 uppercase">Sanctuary Pacing</h4>
              </div>
              <p className="text-2xl font-black text-stone-900">₹{(realizedRevenue * 0.05).toFixed(0)}</p>
              <p className="text-[11px] text-stone-500">Digital token dispatch and queue coordination.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200/80 shadow-2xs space-y-4 min-w-0">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
                  Transaction Audit Ledger
                </h3>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Complete chronological trace of all billing events and receipts.
                </p>
              </div>
              <button 
                onClick={handleExportLedger}
                className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto min-w-0">
              <table className="w-full min-w-[700px] text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px] tracking-wider">
                    <th className="pb-3 pl-2">Invoice ID</th>
                    <th className="pb-3">Patient</th>
                    <th className="pb-3">Service</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Payment Mode</th>
                    <th className="pb-3 pr-2 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {billingRecords.map(b => (
                    <tr key={b.id} className="hover:bg-stone-50/80 transition-all">
                      <td className="py-3 pl-2 font-mono font-bold text-stone-700">{b.id}</td>
                      <td className="py-3 font-bold text-stone-900">{b.patientName} ({b.tokenNumber})</td>
                      <td className="py-3 text-stone-600">{b.items[0]?.description || 'OPD Service'}</td>
                      <td className="py-3 font-mono font-black text-stone-900">₹{b.totalAmount}</td>
                      <td className="py-3 text-stone-600">{b.paymentMethod || 'Pending'}</td>
                      <td className="py-3 pr-2 text-right text-stone-500 font-mono text-[11px]">{b.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. INSURANCE PARTNERS TAB CONTENT */}
      {viewMode === 'insurance' && (
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200/80 shadow-2xs space-y-4 min-w-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
                Insurance Partner Pre-Authorizations &amp; Cashless Settlements
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Real-time claim status and fast-track pre-authorization queue.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-stone-400" />
              <select
                value={claimStatusFilter}
                onChange={(e) => setClaimStatusFilter(e.target.value)}
                className="text-xs font-semibold px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900"
              >
                <option value="all">All Claims ({claims.length})</option>
                <option value="approved">Approved Cashless</option>
                <option value="preauth">Pre-Auth Verified</option>
                <option value="review">In Review</option>
                <option value="settled">Settled</option>
              </select>
            </div>
          </div>

          {filteredClaims.length === 0 ? (
            <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200 space-y-2">
              <Briefcase className="w-8 h-8 text-stone-400 mx-auto" />
              <p className="text-xs font-bold text-stone-700">No insurance claims match the selected filter</p>
              <button
                onClick={() => setIsNewClaimModalOpen(true)}
                className="px-3.5 py-1.5 bg-stone-900 text-white font-bold text-xs rounded-xl hover:bg-stone-800"
              >
                Submit New Pre-Auth
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto min-w-0">
              <table className="w-full min-w-[700px] text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px] tracking-wider">
                    <th className="pb-3 pl-2">Claim ID</th>
                    <th className="pb-3">Patient</th>
                    <th className="pb-3">Insurance Provider</th>
                    <th className="pb-3">Policy Number</th>
                    <th className="pb-3">Claim Amount</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Approval Status</th>
                    <th className="pb-3 pr-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {filteredClaims.map(c => (
                    <tr key={c.id} className="hover:bg-stone-50/80 transition-all">
                      <td className="py-3 pl-2 font-mono font-bold text-stone-700">{c.id}</td>
                      <td className="py-3 font-bold text-stone-900">{c.patient}</td>
                      <td className="py-3 text-stone-800 font-medium">{c.insurer}</td>
                      <td className="py-3 text-stone-500 font-mono">{c.policyNo}</td>
                      <td className="py-3 font-mono font-black text-stone-900">{c.amount}</td>
                      <td className="py-3 text-stone-400 text-[11px] font-mono">{c.date}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          c.status.includes('Approved') || c.status.includes('Settled')
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : c.status.includes('Pre-Auth')
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 pr-2 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {c.status !== 'Approved (Cashless)' && c.status !== 'Settled' && (
                            <button
                              onClick={() => handleUpdateClaimStatus(c.id, 'Approved (Cashless)')}
                              className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-[11px] font-bold border border-emerald-200"
                            >
                              Approve
                            </button>
                          )}
                          {c.status !== 'Settled' && (
                            <button
                              onClick={() => handleUpdateClaimStatus(c.id, 'Settled')}
                              className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-bold"
                            >
                              Settle
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Pay Bill Modal */}
      {payingBill && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-stone-200 shadow-xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-sm font-extrabold text-stone-900">Mark Invoice as Paid</h3>
              <button onClick={() => setPayingBill(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Confirm payment of <strong>₹{payingBill.totalAmount}</strong> for <strong>{payingBill.patientName}</strong> (Token {payingBill.tokenNumber}):
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Select Payment Method</label>
                <div className="space-y-1.5">
                  {['UPI Auto-Pay', 'Cash Counter', 'Debit / Credit Card', 'Insurance Direct Settlement'].map(mode => (
                    <label 
                      key={mode} 
                      onClick={() => setSelectedPayMethod(mode)}
                      className={`flex items-center space-x-2 p-2 rounded-xl border cursor-pointer font-bold transition-all ${
                        selectedPayMethod === mode ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-stone-200 bg-stone-50 text-stone-700'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="payMethod" 
                        checked={selectedPayMethod === mode} 
                        onChange={() => setSelectedPayMethod(mode)} 
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{mode}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  onClick={() => setPayingBill(null)}
                  className="px-3.5 py-1.5 rounded-xl border border-stone-200 text-stone-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPayment}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Confirm Paid
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate New Bill Modal */}
      {isNewBillModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-stone-200 shadow-xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-sm font-extrabold text-stone-900">Generate Patient Bill</h3>
              <button onClick={() => setIsNewBillModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {formBillError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formBillError}</span>
              </div>
            )}

            <form onSubmit={handleCreateBillSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Patient Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Aarav Mehta"
                    value={formPatientName}
                    onChange={(e) => setFormPatientName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Token Number</label>
                  <input
                    type="text"
                    placeholder="e.g. A-27 or B-14"
                    value={formTokenNumber}
                    onChange={(e) => setFormTokenNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Clinician / Service</label>
                <select
                  value={formDoctorName}
                  onChange={(e) => setFormDoctorName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                >
                  <option value="Dr. A. Sharma">Dr. A. Sharma (General Medicine)</option>
                  <option value="Dr. Arjun Shenoy">Dr. Arjun Shenoy (Internal Medicine)</option>
                  <option value="Dr. Meera Nambiar">Dr. Meera Nambiar (Gastroenterology)</option>
                  <option value="Diagnostic Laboratory">Diagnostic Laboratory (Blood &amp; Stool Panel)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Item Description</label>
                <input
                  type="text"
                  placeholder="e.g. Comprehensive Diagnostic Consultation"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Initial Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                  >
                    <option value="pending">Pending (Unpaid)</option>
                    <option value="paid">Paid (Immediate)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsNewBillModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-stone-200 text-stone-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-stone-900 text-white font-bold"
                >
                  Create Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Insurance Pre-Auth Claim Modal */}
      {isNewClaimModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-stone-200 shadow-xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-sm font-extrabold text-stone-900">Submit Pre-Authorization Claim</h3>
              <button onClick={() => setIsNewClaimModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {claimError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{claimError}</span>
              </div>
            )}

            <form onSubmit={handleCreateClaimSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Patient Name</label>
                <input
                  type="text"
                  placeholder="e.g. Aarav Mehta"
                  value={claimPatientName}
                  onChange={(e) => setClaimPatientName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                  autoFocus
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Insurance Provider</label>
                <select
                  value={claimInsurer}
                  onChange={(e) => setClaimInsurer(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                >
                  <option value="Star Health & Allied">Star Health &amp; Allied</option>
                  <option value="HDFC ERGO Health">HDFC ERGO Health</option>
                  <option value="Care Health Insurance">Care Health Insurance</option>
                  <option value="Max Bupa Health">Max Bupa Health</option>
                  <option value="ICICI Lombard Complete Health">ICICI Lombard Complete Health</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Policy Number</label>
                  <input
                    type="text"
                    placeholder="POL-992140"
                    value={claimPolicyNo}
                    onChange={(e) => setClaimPolicyNo(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono uppercase font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Estimated Claim (₹)</label>
                  <input
                    type="number"
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Pre-Auth Clinical Justification</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Longitudinal GI symptoms unresolved after standard courses; specialist review & endoscopy indicated."
                  value={claimNotes}
                  onChange={(e) => setClaimNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsNewClaimModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-stone-200 text-stone-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-blue-900 text-white font-bold"
                >
                  Submit Pre-Auth
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
