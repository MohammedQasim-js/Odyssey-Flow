import React, { useState } from "react";
import { X, UploadCloud, Check, FileText, CheckCircle2 } from "lucide-react";
import { InvestigationRecord } from "../../../types/pharmacyLabs";

interface UploadResultModalProps {
  investigations: InvestigationRecord[];
  onClose: () => void;
  onUploadResult: (id: string, summary: string) => void;
}

export const UploadResultModal: React.FC<UploadResultModalProps> = ({
  investigations,
  onClose,
  onUploadResult,
}) => {
  const pendingList = investigations.filter((i) => i.status !== "Reviewed");
  const [selectedInvId, setSelectedInvId] = useState<string>(
    pendingList[0]?.id || investigations[0]?.id || "",
  );
  const [summary, setSummary] = useState<string>(
    "Biochemical profile within normal physiological reference ranges. No critical electrolyte shifts.",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvId) return;
    onUploadResult(selectedInvId, summary);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200/80 w-full max-w-md flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xs">
              <UploadCloud className="w-4 h-4 text-blue-800" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-stone-900">
                Upload Diagnostic Result
              </h2>
              <span className="text-[11px] text-stone-500 font-medium">
                Simulate Diagnostic Report Sync
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
              Select Investigation Order
            </label>
            <select
              value={selectedInvId}
              onChange={(e) => setSelectedInvId(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 font-bold focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              {investigations.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.patientName} — {inv.investigationName} ({inv.sampleId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
              Diagnostic Report Summary &amp; Findings
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={4}
              placeholder="Enter lab findings or radiological narrative summary..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-500 text-[11px]">
            Uploading will change status to{" "}
            <strong>Report Ready (Awaiting Review)</strong>, enabling clinician
            sign-off.
          </div>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold shadow-xs flex items-center space-x-1"
            >
              <Check className="w-4 h-4" />
              <span>Sync &amp; Save Result</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
