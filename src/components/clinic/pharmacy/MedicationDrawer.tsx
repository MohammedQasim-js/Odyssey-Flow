import React, { useState } from "react";
import {
  X,
  Pill,
  CheckCircle2,
  Clock,
  MapPin,
  Share2,
  Copy,
  Send,
  ChevronRight,
  AlertCircle,
  Building2,
  User,
  Calendar,
  FileText,
  Check,
} from "lucide-react";
import {
  MedicationRecord,
  SuggestedPharmacy,
} from "../../../types/pharmacyLabs";

interface MedicationDrawerProps {
  medication: MedicationRecord | null;
  suggestedPharmacies: SuggestedPharmacy[];
  onClose: () => void;
  onUpdateStatus: (id: string, status: MedicationRecord["status"]) => void;
  onViewPrescriptionDocument?: (rxId: string) => void;
}

export const MedicationDrawer: React.FC<MedicationDrawerProps> = ({
  medication,
  suggestedPharmacies,
  onClose,
  onUpdateStatus,
  onViewPrescriptionDocument,
}) => {
  const [copiedToast, setCopiedToast] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<
    MedicationRecord["status"]
  >(medication ? medication.status : "Prescribed");

  if (!medication) return null;

  const handleCopyDetails = () => {
    const details = `Odyssey Flow Prescription Record
Patient: ${medication.patientName} (${medication.tokenNumber})
Medication: ${medication.medicationName} (${medication.form})
Dosage: ${medication.dosage} - ${medication.frequency} (${medication.timing})
Duration: ${medication.durationDays} days (Quantity: ${medication.quantity})
Prescribed by: ${medication.prescribedBy} (${medication.prescriberSpecialty})
Instructions: ${medication.instructions}`;

    navigator.clipboard?.writeText?.(details);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const handleShareWithPatient = (pharmacyName?: string) => {
    setShareToast(true);
    setTimeout(() => setShareToast(false), 3000);
  };

  const handleStatusChange = (newStatus: MedicationRecord["status"]) => {
    setCurrentStatus(newStatus);
    onUpdateStatus(medication.id, newStatus);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/40 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div
        className="w-full max-w-[460px] bg-white h-full shadow-2xl flex flex-col border-l border-stone-200 overflow-hidden animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center font-bold text-sm">
              <Pill className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Patient
                </span>
                <span className="text-xs font-bold text-stone-900">
                  {medication.patientName}
                </span>
                <span className="text-[10px] font-mono font-bold bg-stone-200/80 px-1.5 py-0.5 rounded text-stone-700">
                  {medication.tokenNumber}
                </span>
              </div>
              <h2 className="text-base font-extrabold text-stone-900 mt-0.5">
                {medication.medicationName}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
            title="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toasts */}
        {copiedToast && (
          <div className="mx-4 mt-3 p-3 bg-stone-900 text-white rounded-xl text-xs flex items-center space-x-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Prescription details copied to clipboard.</span>
          </div>
        )}
        {shareToast && (
          <div className="mx-4 mt-3 p-3 bg-emerald-900 text-white rounded-xl text-xs flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              Prescription notification sent to patient app &amp; registered
              phone.
            </span>
          </div>
        )}

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-stone-800 text-xs">
          {/* Quick Status Control Bar */}
          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Fulfillment Status
              </span>
              <span className="text-xs font-extrabold text-stone-900">
                {currentStatus}
              </span>
            </div>

            <div className="flex items-center space-x-1.5">
              <select
                value={currentStatus}
                onChange={(e) =>
                  handleStatusChange(
                    e.target.value as MedicationRecord["status"],
                  )
                }
                className="bg-white border border-stone-200 text-xs font-bold text-stone-800 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-600 shadow-2xs"
              >
                <option value="Prescribed">Prescribed</option>
                <option value="Dispensing">Dispensing</option>
                <option value="Dispensed">Dispensed</option>
                <option value="Partially Dispensed">Partially Dispensed</option>
                <option value="Completed">Completed</option>
                <option value="Discontinued">Discontinued</option>
                <option value="Refill Due">Refill Due</option>
              </select>
            </div>
          </div>

          {/* 1. Prescription Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">
                Prescription Details
              </h3>
              <span className="text-[11px] font-mono text-stone-500">
                {medication.prescriptionId}
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200/80 divide-y divide-stone-100 overflow-hidden shadow-2xs">
              <div className="grid grid-cols-2 p-3 gap-2">
                <div>
                  <span className="text-[10px] text-stone-400 block">
                    Prescribed by
                  </span>
                  <span className="font-bold text-stone-900 text-xs">
                    {medication.prescribedBy}
                  </span>
                  <span className="text-[10px] text-stone-500 block">
                    {medication.prescriberSpecialty}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">
                    Prescription Date
                  </span>
                  <span className="font-bold text-stone-900 text-xs">
                    {medication.prescriptionDate}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 p-3 gap-2 bg-stone-50/50">
                <div>
                  <span className="text-[10px] text-stone-400 block">Form</span>
                  <span className="font-bold text-stone-800">
                    {medication.form}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">
                    Route
                  </span>
                  <span className="font-bold text-stone-800">
                    {medication.route}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">Dose</span>
                  <span className="font-bold text-stone-800">
                    {medication.dosage}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 p-3 gap-2">
                <div>
                  <span className="text-[10px] text-stone-400 block">
                    Frequency
                  </span>
                  <span className="font-bold text-stone-900">
                    {medication.frequency}
                  </span>
                  <span className="text-[10px] text-emerald-800 font-semibold">
                    {medication.frequencyCompact}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">
                    Timing
                  </span>
                  <span className="font-bold text-stone-900">
                    {medication.timing}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 p-3 gap-2 bg-stone-50/50">
                <div>
                  <span className="text-[10px] text-stone-400 block">
                    Duration
                  </span>
                  <span className="font-bold text-stone-900">
                    {medication.durationDays} days
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">
                    Date Range
                  </span>
                  <span className="font-semibold text-stone-700 text-[11px]">
                    {medication.startDate} – {medication.endDate}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">
                    Quantity &amp; Refills
                  </span>
                  <span className="font-bold text-stone-900">
                    {medication.quantity} units
                  </span>
                  <span className="text-[10px] text-stone-500 block">
                    ({medication.refills} refills)
                  </span>
                </div>
              </div>

              <div className="p-3">
                <span className="text-[10px] text-stone-400 block mb-1">
                  Clinical Instructions
                </span>
                <p className="text-xs text-stone-700 bg-stone-50 p-2.5 rounded-xl border border-stone-100 leading-relaxed font-medium">
                  {medication.instructions}
                </p>
              </div>
            </div>

            <p className="text-[10px] text-stone-400 italic">
              These are clinician-entered prescription records. Odyssey Flow
              does not alter authorized medical recommendations.
            </p>
          </div>

          {/* Sibling Medications if part of multi-drug prescription */}
          {medication.siblingMedications &&
            medication.siblingMedications.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-stone-700 block">
                  Additional Medicines in this Prescription (
                  {medication.siblingMedications.length})
                </span>
                <div className="space-y-1.5">
                  {medication.siblingMedications.map((sib, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-stone-900">
                          {sib.name}
                        </span>
                        <span className="text-[10px] text-stone-500 block">
                          {sib.dosage} • {sib.timing}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-stone-600 bg-white px-2 py-0.5 rounded border border-stone-200">
                        {sib.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* 2. Medication Progress Timeline */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">
                Medication Progress
              </h3>
              <span className="text-xs font-mono font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                {medication.currentDay} / {medication.durationDays} days
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
              {/* Progress Bar */}
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.round((medication.currentDay / medication.durationDays) * 100))}%`,
                  }}
                />
              </div>

              {/* Day Pills Timeline */}
              <div className="grid grid-cols-5 gap-1.5 pt-1">
                {Array.from({
                  length: Math.min(5, medication.durationDays),
                }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const isStarted = dayNum < medication.currentDay;
                  const isCurrent = dayNum === medication.currentDay;
                  const isUpcoming = dayNum > medication.currentDay;

                  return (
                    <div
                      key={idx}
                      className={`p-2 rounded-xl text-center border text-[10px] font-bold ${
                        isCurrent
                          ? "bg-emerald-50 border-emerald-300 text-emerald-950 shadow-2xs"
                          : isStarted
                            ? "bg-stone-100 border-stone-200 text-stone-600"
                            : "bg-white border-dashed border-stone-200 text-stone-400"
                      }`}
                    >
                      <span className="block text-[11px] font-mono">
                        Day {dayNum}
                      </span>
                      <span
                        className={`text-[9px] block uppercase font-extrabold tracking-wider ${
                          isCurrent
                            ? "text-emerald-700"
                            : isStarted
                              ? "text-stone-500"
                              : "text-stone-300"
                        }`}
                      >
                        {isCurrent
                          ? "Current"
                          : isStarted
                            ? "Started"
                            : "Upcoming"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. Dispensing Status Checklist */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">
              Dispensing Status
            </h3>

            <div className="bg-white rounded-2xl border border-stone-200/80 p-3.5 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-semibold text-stone-800">
                    Prescription
                  </span>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Created
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-semibold text-stone-800">Pharmacy</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Availability checked
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      currentStatus === "Dispensed"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-900"
                    }`}
                  >
                    {currentStatus === "Dispensed" ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                  </span>
                  <span className="font-semibold text-stone-800">
                    Dispensing
                  </span>
                </div>
                <button
                  onClick={() =>
                    handleStatusChange(
                      currentStatus === "Dispensed"
                        ? "Dispensing"
                        : "Dispensed",
                    )
                  }
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded border transition-colors ${
                    currentStatus === "Dispensed"
                      ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                      : "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100"
                  }`}
                >
                  {currentStatus === "Dispensed"
                    ? "● Dispensed"
                    : "● Pending pickup"}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-semibold text-stone-800">
                    Patient notification
                  </span>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Sent
                </span>
              </div>
            </div>
          </div>

          {/* 4. Suggested Pharmacies */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">
                  Suggested Pharmacies
                </h3>
                <p className="text-[10px] text-stone-500">
                  Suggested based on availability/location (Simulated data)
                </p>
              </div>
              <span className="text-[10px] font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                Local Radius
              </span>
            </div>

            <div className="space-y-2">
              {suggestedPharmacies.map((pharmacy) => (
                <div
                  key={pharmacy.id}
                  className="bg-white rounded-2xl border border-stone-200/80 p-3 shadow-2xs hover:border-emerald-300 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <Building2 className="w-3.5 h-3.5 text-stone-500" />
                        <span className="font-bold text-stone-900 text-xs">
                          {pharmacy.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-500 block mt-0.5">
                        {pharmacy.area} •{" "}
                        <strong className="text-stone-700 font-mono">
                          {pharmacy.distance}
                        </strong>
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        pharmacy.availability === "Available"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {pharmacy.availability}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-[11px]">
                    <span className="text-stone-500 text-[10px]">
                      {pharmacy.operatingHours}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleShareWithPatient(pharmacy.name)}
                        className="px-2.5 py-1 rounded-lg text-emerald-700 hover:bg-emerald-50 font-bold text-[10px] transition-colors"
                      >
                        Share with Patient
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Patient Communication Actions */}
          <div className="space-y-2.5 pt-2">
            <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">
              Share Prescription
            </h3>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleShareWithPatient()}
                className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-200 text-stone-800 hover:text-emerald-900 font-bold text-[11px] flex flex-col items-center justify-center space-y-1 transition-all"
              >
                <Send className="w-4 h-4 text-emerald-700" />
                <span>Send to Patient</span>
              </button>

              <button
                onClick={() => {
                  if (onViewPrescriptionDocument) {
                    onViewPrescriptionDocument(medication.prescriptionId);
                  }
                }}
                className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 font-bold text-[11px] flex flex-col items-center justify-center space-y-1 transition-all"
              >
                <FileText className="w-4 h-4 text-stone-700" />
                <span>View Rx Doc</span>
              </button>

              <button
                onClick={handleCopyDetails}
                className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 font-bold text-[11px] flex flex-col items-center justify-center space-y-1 transition-all"
              >
                <Copy className="w-4 h-4 text-stone-700" />
                <span>Copy Details</span>
              </button>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-stone-600 font-bold text-xs hover:bg-stone-200 transition-colors"
          >
            Close
          </button>

          <button
            onClick={() => {
              if (onViewPrescriptionDocument) {
                onViewPrescriptionDocument(medication.prescriptionId);
              }
            }}
            className="px-4 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 shadow-xs flex items-center space-x-1.5"
          >
            <span>Full Clinical Document</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
