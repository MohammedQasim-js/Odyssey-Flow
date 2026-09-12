import React, { useState } from 'react';
import { 
  Receipt, CheckCircle2, Download, 
  Share2, ShieldCheck, Check, Building2, User, Clock
} from 'lucide-react';
import { DataStore } from '../../services/dataStore';
import { Token } from '../../types';

interface PatientBillingViewProps {
  token?: Token;
}

export const PatientBillingView: React.FC<PatientBillingViewProps> = ({ token: propToken }) => {
  const token = propToken || DataStore.getActiveToken();
  const currentPatient = DataStore.getCurrentPatient() || DataStore.getPatients()[0];
  const billingRecords = DataStore.getBillingRecords(currentPatient.id);
  const activeBill = billingRecords[0] || {
    id: 'bill_aarav_01',
    patientId: currentPatient.id,
    tokenNumber: token?.tokenNumber || 'A-27',
    doctorName: token?.doctorName || 'Dr. A. Sharma',
    clinicName: token?.clinicName || 'Odyssey Care Clinic',
    totalAmount: 800,
    status: 'paid' as const,
    date: 'Today, 10:30 AM',
    paymentMethod: 'UPI Instant Pay (Simulated)',
    items: [
      { description: 'Consultation Fee', amount: 800 },
      { description: 'Other Charges / Facility Fee', amount: 100 },
      { description: 'Healthcare Privilege Discount', amount: -100 },
    ],
  };

  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handleShare = () => {
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2500);
  };

  return (
    <div className="space-y-4 pb-28 font-sans text-stone-900 animate-in fade-in duration-200">
      
      {/* 1. Header */}
      <div className="pt-1">
        <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
          Visit Receipt
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Official consultation summary &amp; payment confirmation
        </p>
      </div>

      {/* 2. Receipt Card (Clean Mobile Receipt Layout) */}
      <div 
        id="visit-receipt-card"
        className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs relative overflow-hidden space-y-4"
      >
        {/* Receipt Header */}
        <div className="text-center pb-4 border-b border-stone-100">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center mb-2.5 shadow-2xs">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Payment Settled
          </span>
          <h2 className="text-3xl font-extrabold text-stone-900 mt-2 font-mono">
            ₹{activeBill.totalAmount}.00
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {activeBill.clinicName}
          </p>
        </div>

        {/* Core Receipt Metadata Grid: Clinic, Doctor, Patient, Visit date, Token */}
        <div className="space-y-2.5 text-xs divide-y divide-stone-100">
          <div className="pt-1 flex justify-between items-baseline">
            <span className="text-stone-500 font-medium">Clinic</span>
            <span className="font-semibold text-stone-900">{activeBill.clinicName}</span>
          </div>

          <div className="pt-2 flex justify-between items-baseline">
            <span className="text-stone-500 font-medium">Doctor</span>
            <span className="font-semibold text-stone-900">{activeBill.doctorName}</span>
          </div>

          <div className="pt-2 flex justify-between items-baseline">
            <span className="text-stone-500 font-medium">Patient</span>
            <span className="font-bold text-stone-900">{currentPatient.fullName}</span>
          </div>

          <div className="pt-2 flex justify-between items-baseline">
            <span className="text-stone-500 font-medium">Visit Date</span>
            <span className="font-mono text-stone-800">{activeBill.date}</span>
          </div>

          <div className="pt-2 flex justify-between items-baseline">
            <span className="text-stone-500 font-medium">Token</span>
            <span className="font-mono font-bold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {activeBill.tokenNumber}
            </span>
          </div>
        </div>

        {/* Fee Breakdown (Consultation fee, Other charges, Total) */}
        <div className="pt-3 border-t-2 border-dashed border-stone-200 space-y-2 text-xs">
          <div className="flex justify-between text-stone-600">
            <span>Consultation fee</span>
            <span className="font-mono font-semibold text-stone-900">₹800.00</span>
          </div>

          <div className="flex justify-between text-stone-600">
            <span>Other charges</span>
            <span className="font-mono font-semibold text-stone-900">₹100.00</span>
          </div>

          <div className="flex justify-between text-[#16A34A]">
            <span>Privilege discount</span>
            <span className="font-mono font-semibold">-₹100.00</span>
          </div>

          <div className="pt-2.5 border-t border-stone-200 flex justify-between items-baseline font-extrabold text-sm text-stone-900">
            <span>Total</span>
            <span className="font-mono text-lg text-[#16A34A]">₹800.00</span>
          </div>
        </div>

        {/* Verification Footer */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400">
          <span>Receipt ID: REC-2024-00892</span>
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3 text-[#16A34A]" />
            <span>Verified Clinic Sync</span>
          </span>
        </div>
      </div>

      {/* 3. Action Buttons: "Download Receipt" & "Share Receipt" */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          type="button"
          onClick={handleDownload}
          className="py-3.5 px-4 rounded-2xl bg-stone-900 hover:bg-black active:scale-[0.98] text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-2xs transition-all"
        >
          {downloadSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Downloaded</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Download Receipt</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="py-3.5 px-4 rounded-2xl bg-white border border-stone-200 hover:bg-stone-50 active:scale-[0.98] text-stone-800 text-xs font-bold flex items-center justify-center space-x-2 shadow-2xs transition-all"
        >
          {shareSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Link Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-stone-500" />
              <span>Share Receipt</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
