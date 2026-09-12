import React, { useState } from "react";
import {
  X,
  Activity,
  AlertTriangle,
  CheckCircle2,
  FlaskConical,
  Scan,
  Radio,
  ShieldCheck,
  Check,
} from "lucide-react";
import {
  InvestigationRecord,
  InvestigationCategory,
} from "../../../types/pharmacyLabs";
import { Patient } from "../../../types";

interface OrderInvestigationModalProps {
  patients: Patient[];
  onClose: () => void;
  onOrderInvestigation: (record: InvestigationRecord) => void;
}

export const OrderInvestigationModal: React.FC<
  OrderInvestigationModalProps
> = ({ patients, onClose, onOrderInvestigation }) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    patients[0]?.id || "pat_aarav_0",
  );
  const [category, setCategory] = useState<InvestigationCategory>("Radiology");
  const [testName, setTestName] = useState<string>("Brain MRI (Non-Contrast)");
  const [priority, setPriority] = useState<
    "Routine" | "Urgent" | "Priority Review"
  >("Routine");
  const [orderedBy, setOrderedBy] = useState<string>("Dr. Priya Desai");
  const [clinicalReason, setClinicalReason] = useState<string>(
    "Evaluation of persistent headache refractory to primary analgesics.",
  );

  const selectedPatient =
    patients.find((p) => p.id === selectedPatientId) || patients[0];

  // Clinical duplicate / repetition check
  const isPotentialDuplicate =
    (selectedPatient.id === "pat_aarav_0" ||
      selectedPatient.fullName.includes("Aarav")) &&
    (testName.toLowerCase().includes("mri") ||
      testName.toLowerCase().includes("brain"));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: InvestigationRecord = {
      id: `inv_${Date.now()}`,
      sampleId:
        category === "Radiology"
          ? `RAD-${Math.floor(2000 + Math.random() * 8000)}`
          : `SMP-${Math.floor(2000 + Math.random() * 8000)}`,
      patientId: selectedPatient.id,
      patientName: selectedPatient.fullName,
      patientAge: selectedPatient.age,
      patientGender: selectedPatient.gender === "Male" ? "M" : "F",
      tokenNumber: selectedPatient.id === "pat_aarav_0" ? "A-27" : "B-12",
      investigationName: testName,
      category,
      orderedBy,
      orderedDate: "12 Sep 2026",
      reason: clinicalReason,
      priority,
      status: "Ordered",
      resultStatus: "Pending",
      eta: priority === "Urgent" ? "45 mins" : "2 hrs",
      isRepeated: isPotentialDuplicate,
      repetitionWarning: isPotentialDuplicate
        ? "Similar investigation detected in previous encounter. Retaining for longitudinal baseline comparison."
        : undefined,
      resultsSummary:
        "Investigation ordered. Sample collection or radiology slot assignment pending.",
    };

    onOrderInvestigation(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200/80 w-full max-w-lg flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
              <Activity className="w-4 h-4 text-amber-800" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-stone-900">
                Order Diagnostic Investigation
              </h2>
              <span className="text-[11px] text-stone-500 font-medium">
                Pathology &amp; Radiological Requisition
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

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 flex-1 overflow-y-auto text-xs"
        >
          {/* Patient Selection */}
          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
              Select Patient
            </label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 font-bold focus:outline-none focus:ring-1 focus:ring-amber-600"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({p.age} Y • {p.gender})
                </option>
              ))}
            </select>
          </div>

          {/* Category Selection */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "Laboratory", label: "Laboratory", icon: FlaskConical },
              { id: "Radiology", label: "Radiology", icon: Scan },
              { id: "Imaging", label: "Imaging / USG", icon: Radio },
            ].map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id as InvestigationCategory)}
                  className={`p-2.5 rounded-xl border text-center font-bold text-xs flex flex-col items-center justify-center space-y-1 transition-all ${
                    isSelected
                      ? "bg-stone-900 text-white border-stone-900 shadow-2xs"
                      : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Test Name */}
          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
              Investigation Name
            </label>
            <input
              type="text"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              placeholder="e.g. Non-Contrast Brain MRI, CBC, Whole Abdomen USG"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 font-bold focus:outline-none focus:ring-1 focus:ring-amber-600"
              required
            />
          </div>

          {/* Clinical Repetition Awareness Indicator */}
          {isPotentialDuplicate && (
            <div className="p-3 bg-amber-50/90 border border-amber-300 rounded-2xl flex items-start space-x-2 text-amber-900 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong>
                  Similar investigation detected in previous encounter.
                </strong>
                <p className="mt-0.5 text-amber-800">
                  Odyssey Flow links this new requisition with prior scans to
                  trace longitudinal diagnostic yield without blocking clinician
                  discretion.
                </p>
              </div>
            </div>
          )}

          {/* Priority and Doctor */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 font-semibold"
              >
                <option value="Routine">Routine</option>
                <option value="Urgent">Urgent</option>
                <option value="Priority Review">Priority Review</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Ordering Clinician
              </label>
              <input
                type="text"
                value={orderedBy}
                onChange={(e) => setOrderedBy(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 font-bold"
                required
              />
            </div>
          </div>

          {/* Clinical Reason */}
          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
              Clinical Reason / Indication
            </label>
            <textarea
              value={clinicalReason}
              onChange={(e) => setClinicalReason(e.target.value)}
              rows={3}
              placeholder="Document the clinical question or differential diagnosis this investigation aims to answer..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 font-medium focus:outline-none focus:ring-1 focus:ring-amber-600"
              required
            />
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold transition-all shadow-xs flex items-center space-x-1"
            >
              <Check className="w-4 h-4" />
              <span>Submit Requisition</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
