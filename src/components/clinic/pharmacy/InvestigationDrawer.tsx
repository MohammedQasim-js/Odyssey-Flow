import React, { useState } from "react";
import {
  X,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Calendar,
  FileText,
  Check,
  Layers,
  Stethoscope,
  ChevronRight,
} from "lucide-react";
import { InvestigationRecord } from "../../types/pharmacyLabs";

interface InvestigationDrawerProps {
  investigation: InvestigationRecord | null;
  onClose: () => void;
  onReviewResult: (id: string, notes: string) => void;
}

export const InvestigationDrawer: React.FC<InvestigationDrawerProps> = ({
  investigation,
  onClose,
  onReviewResult,
}) => {
  const [reviewNote, setReviewNote] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewedToast, setReviewedToast] = useState(false);

  if (!investigation) return null;

  const handleSaveReview = () => {
    onReviewResult(
      investigation.id,
      reviewNote.trim() || "Reviewed and reconciled with clinical history.",
    );
    setIsReviewing(false);
    setReviewedToast(true);
    setTimeout(() => setReviewedToast(false), 3000);
  };

  const getStatusBadge = (status: InvestigationRecord["status"]) => {
    switch (status) {
      case "Reviewed":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Report Ready":
        return "bg-amber-50 text-amber-900 border-amber-300";
      case "Processing":
      case "Sample Collected":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "Scheduled":
        return "bg-stone-100 text-stone-800 border-stone-200";
      case "Cancelled":
        return "bg-rose-50 text-rose-800 border-rose-200";
      default:
        return "bg-stone-100 text-stone-700 border-stone-200";
    }
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
            <div className="w-10 h-10 rounded-2xl bg-amber-100/80 text-amber-900 flex items-center justify-center font-bold text-sm">
              <Activity className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Patient
                </span>
                <span className="text-xs font-bold text-stone-900">
                  {investigation.patientName}
                </span>
                <span className="text-[10px] font-mono font-bold bg-stone-200/80 px-1.5 py-0.5 rounded text-stone-700">
                  {investigation.tokenNumber}
                </span>
              </div>
              <h2 className="text-base font-extrabold text-stone-900 mt-0.5">
                {investigation.investigationName}
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

        {/* Action Toast */}
        {reviewedToast && (
          <div className="mx-4 mt-3 p-3 bg-emerald-900 text-white rounded-xl text-xs flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              Investigation reviewed. Longitudinal journey and diagnostic record
              updated.
            </span>
          </div>
        )}

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-stone-800 text-xs">
          {/* Repetition Warning Banner (Non-judgmental diagnostic awareness) */}
          {investigation.isRepeated && (
            <div className="p-3.5 bg-amber-50/80 border border-amber-300 rounded-2xl space-y-1 text-xs animate-in fade-in">
              <div className="flex items-center space-x-2 text-amber-900 font-extrabold">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>
                  Similar investigation detected in previous encounter
                </span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                {investigation.repetitionWarning ||
                  "Previous scan on record. Retaining for longitudinal comparison with baseline without automatic prohibition."}
              </p>
            </div>
          )}

          {/* Quick Status Bar */}
          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Investigation Status
              </span>
              <span
                className={`inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${getStatusBadge(investigation.status)}`}
              >
                {investigation.status}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Category / Priority
              </span>
              <span className="text-xs font-bold text-stone-800">
                {investigation.category} •{" "}
                <strong
                  className={
                    investigation.priority === "Urgent" ||
                    investigation.priority === "Priority Review"
                      ? "text-amber-800"
                      : "text-stone-600"
                  }
                >
                  {investigation.priority}
                </strong>
              </span>
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">
              Order Specification
            </h3>

            <div className="bg-white rounded-2xl border border-stone-200/80 divide-y divide-stone-100 overflow-hidden shadow-2xs">
              <div className="grid grid-cols-2 p-3 gap-2">
                <div>
                  <span className="text-[10px] text-stone-400 block">
                    Ordered by
                  </span>
                  <span className="font-bold text-stone-900 text-xs">
                    {investigation.orderedBy}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">
                    Order Date
                  </span>
                  <span className="font-bold text-stone-900 text-xs">
                    {investigation.orderedDate}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 p-3 gap-2 bg-stone-50/50">
                <div>
                  <span className="text-[10px] text-stone-400 block">
                    Sample / Scan ID
                  </span>
                  <span className="font-mono font-bold text-stone-900">
                    {investigation.sampleId}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">
                    Turnaround ETA
                  </span>
                  <span className="font-semibold text-stone-700">
                    {investigation.eta || "Standard batch"}
                  </span>
                </div>
              </div>

              <div className="p-3">
                <span className="text-[10px] text-stone-400 block mb-1">
                  Clinical Indication / Reason
                </span>
                <p className="text-xs text-stone-700 bg-stone-50 p-2.5 rounded-xl border border-stone-100 leading-relaxed font-medium">
                  {investigation.reason}
                </p>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">
                Laboratory &amp; Imaging Findings
              </h3>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${
                  investigation.status === "Report Ready" ||
                  investigation.status === "Reviewed"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-stone-100 text-stone-600 border-stone-200"
                }`}
              >
                {investigation.resultStatus}
              </span>
            </div>

            {/* Structured Parameters Table if available */}
            {investigation.parameters && investigation.parameters.length > 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-400 uppercase text-[10px] font-bold border-b border-stone-200">
                    <tr>
                      <th className="p-2.5 pl-3">Parameter</th>
                      <th className="p-2.5">Value</th>
                      <th className="p-2.5">Unit</th>
                      <th className="p-2.5 pr-3 text-right">Reference Range</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {investigation.parameters.map((param, pIdx) => (
                      <tr key={pIdx} className="hover:bg-stone-50/50">
                        <td className="p-2.5 pl-3 font-semibold text-stone-800">
                          {param.parameter}
                        </td>
                        <td className="p-2.5 font-bold font-mono text-stone-900">
                          <span
                            className={
                              param.flag === "high"
                                ? "text-amber-800 font-extrabold bg-amber-50 px-1 rounded"
                                : ""
                            }
                          >
                            {param.value}
                          </span>
                        </td>
                        <td className="p-2.5 text-stone-500 font-mono text-[11px]">
                          {param.unit}
                        </td>
                        <td className="p-2.5 pr-3 text-right text-stone-400 font-mono text-[11px]">
                          {param.referenceRange}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}

            {/* Radiology narrative report if available */}
            {investigation.radiologyReport && (
              <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-1.5">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  Radiological Findings Narrative
                </span>
                <p className="text-xs text-stone-800 font-mono leading-relaxed bg-stone-50/80 p-3 rounded-xl border border-stone-200/60">
                  {investigation.radiologyReport}
                </p>
              </div>
            )}

            {/* Concise Summary */}
            {investigation.resultsSummary && (
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                  Diagnostic Overview
                </span>
                <p className="text-xs text-stone-700 leading-relaxed font-medium">
                  {investigation.resultsSummary}
                </p>
              </div>
            )}

            <p className="text-[10px] text-stone-400 italic">
              Odyssey Flow records and displays synthetic/demo clinical results
              for operations. Medical significance is reviewed by authorized
              clinicians.
            </p>
          </div>

          {/* Clinician Review Section */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">
              Doctor Review &amp; Journey Reconciliation
            </h3>

            {investigation.status === "Reviewed" ? (
              <div className="bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-emerald-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>
                    Reviewed by{" "}
                    {investigation.reviewedBy || "Attending Clinician"}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-800 block">
                  Reconciled: {investigation.reviewedAt || "Today"}
                </span>
                {investigation.doctorReviewNote && (
                  <p className="text-xs text-stone-800 bg-white p-2.5 rounded-xl border border-emerald-100 font-medium">
                    "{investigation.doctorReviewNote}"
                  </p>
                )}
              </div>
            ) : investigation.status === "Report Ready" ? (
              <div className="bg-amber-50/70 border border-amber-300 p-4 rounded-2xl space-y-3 text-xs">
                <div className="flex items-center space-x-2 text-amber-950 font-extrabold">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span>Awaiting clinician review</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  This report is ready for doctor evaluation. Marking as
                  reviewed will update the patient's longitudinal journey.
                </p>

                {isReviewing ? (
                  <div className="space-y-2 pt-1">
                    <textarea
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      placeholder="Add clinician note / diagnostic reconciliation note..."
                      rows={3}
                      className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-600 shadow-2xs font-medium"
                    />
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setIsReviewing(false)}
                        className="px-3 py-1.5 rounded-xl text-stone-600 hover:bg-stone-100 font-bold text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveReview}
                        className="px-4 py-1.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 shadow-xs flex items-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Confirm &amp; Mark Reviewed</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsReviewing(true)}
                    className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-1.5"
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Review Result</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-2xl text-xs text-stone-600">
                Investigation is currently in{" "}
                <strong>{investigation.status}</strong> stage. Doctor review
                workflow unlocks once the report is finalized.
              </div>
            )}
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
          <span className="text-[11px] font-mono text-stone-400">
            {investigation.id}
          </span>
        </div>
      </div>
    </div>
  );
};
