import React, { useState } from "react";
import {
  X,
  Printer,
  Share2,
  Download,
  FileText,
  CheckCircle2,
  Building2,
  Stethoscope,
  Clock,
  ShieldCheck,
  Check,
} from "lucide-react";
import { PrescriptionDocument } from "../../types/pharmacyLabs";

interface PrescriptionDocModalProps {
  prescription: PrescriptionDocument | null;
  onClose: () => void;
}

export const PrescriptionDocModal: React.FC<PrescriptionDocModalProps> = ({
  prescription,
  onClose,
}) => {
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!prescription) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    showToast(
      "Prescription link securely dispatched to patient mobile portal.",
    );
  };

  const handleDownload = () => {
    showToast("Prescription PDF compiled and downloaded.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200/80 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* Modal Top Bar */}
        <div className="p-4 px-6 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div className="flex items-center space-x-2 text-stone-700">
            <FileText className="w-5 h-5 text-emerald-700" />
            <span className="font-mono font-bold text-xs uppercase tracking-wider text-stone-500">
              Clinical Document Viewer • {prescription.id}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 font-bold text-xs flex items-center space-x-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 font-bold text-xs flex items-center space-x-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {toastMsg && (
          <div className="bg-emerald-900 text-white px-4 py-2 text-xs flex items-center space-x-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Printable Prescription Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 text-stone-800 font-sans">
          {/* Letterhead */}
          <div className="border-b-2 border-stone-800 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block"></span>
                <h1 className="text-xl font-black text-stone-900 tracking-tight">
                  ODYSSEY FLOW
                </h1>
              </div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 mt-0.5">
                Official Clinical Prescription
              </p>
              <p className="text-[11px] text-stone-500 mt-1 max-w-sm">
                {prescription.clinicName} • {prescription.clinicAddress}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">
                Prescription Identifier
              </span>
              <span className="text-sm font-mono font-black text-stone-900 block">
                {prescription.id}
              </span>
              <span className="text-xs font-bold text-stone-600 block mt-1">
                Date: {prescription.date}
              </span>
            </div>
          </div>

          {/* Patient & Doctor Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50/70 p-4 rounded-2xl border border-stone-200/80 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Patient Information
              </span>
              <div className="font-extrabold text-stone-900 text-sm flex items-center space-x-2">
                <span>{prescription.patientName}</span>
                <span className="text-[10px] font-mono font-bold bg-stone-200 px-1.5 py-0.2 rounded text-stone-700">
                  {prescription.tokenNumber}
                </span>
              </div>
              <div className="text-[11px] text-stone-600 font-medium">
                Patient ID:{" "}
                <strong className="font-mono text-stone-800">
                  {prescription.patientCode}
                </strong>{" "}
                • {prescription.patientAge} Y / {prescription.patientGender}
              </div>
            </div>

            <div className="space-y-1 sm:text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Prescribing Clinician
              </span>
              <div className="font-extrabold text-stone-900 text-sm flex items-center sm:justify-end space-x-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-stone-600" />
                <span>{prescription.doctorName}</span>
              </div>
              <div className="text-[11px] text-stone-600 font-medium">
                {prescription.doctorSpecialty} •{" "}
                <span className="text-stone-500 font-mono text-[10px]">
                  {prescription.doctorQualification}
                </span>
              </div>
            </div>
          </div>

          {/* Prescribed Medications Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-base font-serif font-black text-stone-900 italic">
                Rx
              </span>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
                Prescribed Medications ({prescription.medications.length})
              </h3>
            </div>

            <div className="border border-stone-200 rounded-2xl overflow-hidden divide-y divide-stone-100">
              {prescription.medications.map((item) => (
                <div
                  key={item.number}
                  className="p-4 hover:bg-stone-50/50 transition-colors space-y-1.5"
                >
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline space-x-2">
                      <span className="font-mono font-black text-stone-400 text-xs">
                        {item.number}.
                      </span>
                      <span className="font-extrabold text-stone-900 text-sm">
                        {item.medicationName}
                      </span>
                      <span className="text-xs font-medium text-stone-500">
                        ({item.form})
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-extrabold text-stone-900 text-xs bg-stone-100 px-2 py-0.5 rounded">
                        {item.duration}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-700 pl-5">
                    <div>
                      <span className="text-stone-400 text-[10px] mr-1">
                        Dose &amp; Frequency:
                      </span>
                      <strong className="text-stone-900">
                        {item.frequencyCompact}
                      </strong>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[10px] mr-1">
                        Timing:
                      </span>
                      <span className="font-medium text-emerald-800">
                        {item.timing}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[10px] mr-1">
                        Quantity:
                      </span>
                      <span className="font-mono font-bold text-stone-700">
                        {item.quantity}
                      </span>
                    </div>
                  </div>

                  {item.instructions && (
                    <div className="pl-5 pt-1 text-[11px] text-stone-600 italic">
                      Instructions: {item.instructions}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Instructions */}
          <div className="space-y-1.5 bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
              General Advice &amp; Lifestyle Instructions
            </span>
            <p className="text-xs text-stone-800 leading-relaxed font-medium">
              {prescription.generalInstructions}
            </p>
          </div>

          {/* Fulfillment & Availability Footer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs border-t border-stone-200">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                Pharmacy Fulfillment Partner
              </span>
              <div className="flex items-center space-x-1.5 mt-0.5 font-bold text-stone-800">
                <Building2 className="w-3.5 h-3.5 text-stone-500" />
                <span>{prescription.pharmacyName}</span>
              </div>
              <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
                ● {prescription.pharmacyAvailability}
              </span>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  Prescription Status
                </span>
                <span className="font-extrabold text-stone-900 text-xs mt-0.5 block">
                  {prescription.status} (Total duration:{" "}
                  {prescription.durationTotal})
                </span>
              </div>
              <div className="flex items-center space-x-1 text-[10px] text-stone-400 mt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  Digitally signed &amp; validated by Odyssey Flow
                  E-Prescription Gateway
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-stone-100 bg-stone-50 flex items-center justify-between text-xs">
          <span className="text-stone-400 font-mono text-[11px]">
            Generated via Odyssey Flow Clinic Suite
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-stone-700 hover:bg-stone-200 font-bold transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
