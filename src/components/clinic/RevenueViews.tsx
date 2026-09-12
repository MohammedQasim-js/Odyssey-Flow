import React, { useState } from 'react';
import { DollarSign, Receipt, Briefcase, ShieldCheck, CheckCircle2, Clock, ArrowUpRight, Filter, Download } from 'lucide-react';
import { DataStore } from '../../services/dataStore';
import { BillingRecord } from '../../types';

interface RevenueViewsProps {
  viewMode: 'billing' | 'financials' | 'insurance';
}

export const RevenueViews: React.FC<RevenueViewsProps> = ({ viewMode }) => {
  const billingRecords = DataStore.getBillingRecords();

  const claims = [
    { id: 'clm_101', patient: 'Aarav Mehta', insurer: 'Star Health & Allied', policyNo: 'POL-992140', amount: '₹1,250', status: 'Approved (Cashless)', date: 'Today, 09:30 AM' },
    { id: 'clm_102', patient: 'Priya Sharma', insurer: 'HDFC ERGO Health', policyNo: 'POL-331892', amount: '₹4,800', status: 'Pre-Auth Verified', date: 'Today, 08:45 AM' },
    { id: 'clm_103', patient: 'Rajesh Nair', insurer: 'Care Health Insurance', policyNo: 'POL-884210', amount: '₹950', status: 'Approved (Direct)', date: 'Today, 08:15 AM' },
    { id: 'clm_104', patient: 'Vikram Patel', insurer: 'Max Bupa Health', policyNo: 'POL-771239', amount: '₹2,400', status: 'Settled', date: 'Yesterday' },
  ];

  const financialMetrics = [
    { title: 'Gross Clinical Revenue', value: '₹1,48,250', change: '+14.2% daily', sub: 'Consultations & Triage' },
    { title: 'Diagnostic Service Revenue', value: '₹64,800', change: '+8.5% weekly', sub: 'Labs, MRI, Ultrasound' },
    { title: 'Cashless Insurance Payouts', value: '₹58,950', change: '100% pre-authorized', sub: '4 TPA Partners Active' },
    { title: 'Average Revenue per Encounter', value: '₹1,850', change: 'Standard Tier', sub: 'Zero-friction billing' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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

        <button className="px-3.5 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 flex items-center space-x-1.5 shadow-xs">
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>Export Financial Ledger</span>
        </button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {financialMetrics.map((m, i) => (
          <div key={i} className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">{m.title}</span>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-2xl font-black text-stone-900">{m.value}</span>
              <span className="text-[11px] font-bold text-emerald-700">{m.change}</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-1">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* View Content depending on mode */}
      {viewMode === 'billing' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
            Recent Patient Invoices &amp; Token Settlements
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="pb-3 pl-2">Token</th>
                  <th className="pb-3">Patient</th>
                  <th className="pb-3">Clinician / Service</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Total Amount</th>
                  <th className="pb-3">Payment Method</th>
                  <th className="pb-3 pr-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {billingRecords.map(b => (
                  <tr key={b.id} className="hover:bg-stone-50/80 transition-all">
                    <td className="py-3 pl-2 font-mono font-bold text-stone-900">{b.tokenNumber}</td>
                    <td className="py-3 text-stone-900 font-bold">{b.patientName}</td>
                    <td className="py-3 text-stone-600">{b.doctorName || 'General OPD'}</td>
                    <td className="py-3 text-stone-500">
                      {b.items.map(it => it.description).join(', ')}
                    </td>
                    <td className="py-3 font-mono font-black text-stone-900">₹{b.totalAmount}</td>
                    <td className="py-3 text-stone-600">{b.paymentMethod || 'UPI Auto-Pay'}</td>
                    <td className="py-3 pr-2 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(viewMode === 'insurance' || viewMode === 'financials') && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
              Insurance Partner Pre-Authorizations &amp; Cashless Settlements
            </h3>
            <span className="text-xs text-stone-500">Fast-track claims queue</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="pb-3 pl-2">Claim ID</th>
                  <th className="pb-3">Patient</th>
                  <th className="pb-3">Insurance Provider</th>
                  <th className="pb-3">Policy Number</th>
                  <th className="pb-3">Claim Amount</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 pr-2 text-right">Approval Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {claims.map(c => (
                  <tr key={c.id} className="hover:bg-stone-50/80 transition-all">
                    <td className="py-3 pl-2 font-mono font-bold text-stone-700">{c.id}</td>
                    <td className="py-3 font-bold text-stone-900">{c.patient}</td>
                    <td className="py-3 text-stone-800 font-medium">{c.insurer}</td>
                    <td className="py-3 text-stone-500 font-mono">{c.policyNo}</td>
                    <td className="py-3 font-mono font-black text-stone-900">{c.amount}</td>
                    <td className="py-3 text-stone-400 text-[11px] font-mono">{c.date}</td>
                    <td className="py-3 pr-2 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
