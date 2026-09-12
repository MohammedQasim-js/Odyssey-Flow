import React, { useState } from "react";
import {
  X,
  Pill,
  Check,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  User,
  Stethoscope,
  AlertTriangle,
  FileText,
  CheckCircle2,
} from "lucide-react";
import {
  MedicationRecord,
  PrescriptionDocument,
} from "../../../types/pharmacyLabs";
import { Patient } from "../../../types";

interface NewPrescriptionModalProps {
  patients: Patient[];
  onClose: () => void;
  onIssuePrescription: (
    record: MedicationRecord,
    doc: PrescriptionDocument,
  ) => void;
}

export const NewPrescriptionModal: React.FC<NewPrescriptionModalProps> = ({
  patients,
  onClose,
  onIssuePrescription,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form states
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    patients[0]?.id || "pat_aarav_0",
  );
  const [medicationName, setMedicationName] =
    useState<string>("Amoxicillin 500 mg");
  const [formType, setFormType] = useState<string>("Oral capsule");
  const [route, setRoute] = useState<string>("Oral");
  const [dosage, setDosage] = useState<string>("500 mg");
  const [frequency, setFrequency] = useState<string>("3 times daily");
  const [frequencyCompact, setFrequencyCompact] =
    useState<string>("1 capsule × 3/day");
  const [timing, setTiming] = useState<string>("After meals");
  const [durationDays, setDurationDays] = useState<number>(5);
  const [quantity, setQuantity] = useState<number>(15);
  const [refills, setRefills] = useState<number>(0);
  const [instructions, setInstructions] = useState<string>(
    "Take after food and complete the full prescribed course.",
  );
  const [prescribedBy, setPrescribedBy] = useState<string>("Dr. A. Sharma");

  const selectedPatient =
    patients.find((p) => p.id === selectedPatientId) || patients[0];

  const totalSteps = 7;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const rxId = `RX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newMedRecord: MedicationRecord = {
      id: `med_${Date.now()}`,
      prescriptionId: rxId,
      patientId: selectedPatient.id,
      patientName: selectedPatient.fullName,
      patientAge: selectedPatient.age,
      patientGender: selectedPatient.gender === "Male" ? "M" : "F",
      tokenNumber: selectedPatient.id === "pat_aarav_0" ? "A-27" : "A-12",
      visitReference: `Visit Today (${prescribedBy})`,
      prescribedBy,
      prescriberSpecialty: "Internal Medicine & Diagnostic Triage",
      prescriptionDate: "12 Sep 2026",
      medicationName,
      form: formType,
      route,
      dosage,
      frequency,
      frequencyCompact,
      timing,
      durationDays,
      currentDay: 1,
      startDate: "12 Sep",
      endDate: `${12 + durationDays} Sep`,
      quantity,
      refills,
      instructions,
      status: "Prescribed",
      pharmacyName: "Apollo Pharmacy — Bandra",
      pharmacyAvailability: "Available",
      dispensingTimeline: {
        prescriptionCreated: true,
        availabilityChecked: true,
        dispensingState: "Pending pickup",
        patientNotified: true,
      },
      totalMedicationsInRx: 1,
    };

    const newDoc: PrescriptionDocument = {
      id: rxId,
      patientId: selectedPatient.id,
      patientName: selectedPatient.fullName,
      patientCode: `OF-000${Math.floor(100 + Math.random() * 900)}`,
      patientAge: selectedPatient.age,
      patientGender: selectedPatient.gender,
      tokenNumber: selectedPatient.id === "pat_aarav_0" ? "A-27" : "A-12",
      doctorName: prescribedBy,
      doctorSpecialty: "Internal Medicine & Diagnostic Triage",
      doctorQualification: "MBBS, MD",
      date: "12 Sep 2026",
      clinicName: "Odyssey Apex Health Center",
      clinicAddress: "100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru",
      medications: [
        {
          number: 1,
          medicationName,
          form: formType,
          dosage,
          frequencyCompact,
          duration: `${durationDays} days`,
          timing,
          quantity,
          instructions,
        },
      ],
      generalInstructions: instructions,
      pharmacyName: "Apollo Pharmacy — Bandra",
      pharmacyAvailability: "Available",
      status: "Active",
      durationTotal: `${durationDays} days`,
    };

    onIssuePrescription(newMedRecord, newDoc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200/80 w-full max-w-xl flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-stone-900">
                New Prescription
              </h2>
              <span className="text-[11px] text-stone-500 font-medium">
                Step {currentStep} of {totalSteps}
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

        {/* Multi-step Progress Bar */}
        <div className="w-full bg-stone-100 h-1">
          <div
            className="bg-emerald-600 h-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 flex-1 text-xs">
          {/* Step 1: Select Patient */}
          {currentStep === 1 && (
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-extrabold text-stone-900">
                  Step 1: Select Patient
                </h3>
                <p className="text-stone-500 mt-0.5">
                  Select the active or registered patient for this prescription
                  encounter.
                </p>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {patients.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPatientId(p.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedPatientId === p.id
                        ? "border-emerald-500 bg-emerald-50/60 shadow-2xs"
                        : "border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-stone-200 text-stone-700 flex items-center justify-center font-bold">
                        {p.fullName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-extrabold text-stone-900 block">
                          {p.fullName}
                        </span>
                        <span className="text-[11px] text-stone-500">
                          {p.age} Y • {p.gender} • {p.bloodGroup}
                        </span>
                      </div>
                    </div>
                    {selectedPatientId === p.id && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Medication */}
          {currentStep === 2 && (
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-extrabold text-stone-900">
                  Step 2: Medication &amp; Form
                </h3>
                <p className="text-stone-500 mt-0.5">
                  Enter the precise pharmaceutical molecule and formulation.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                    Medication Name
                  </label>
                  <input
                    type="text"
                    value={medicationName}
                    onChange={(e) => setMedicationName(e.target.value)}
                    placeholder="e.g. Amoxicillin 500 mg"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                      Pharmaceutical Form
                    </label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    >
                      <option value="Oral capsule">Oral capsule</option>
                      <option value="Tablet">Tablet</option>
                      <option value="Film-coated tablet">
                        Film-coated tablet
                      </option>
                      <option value="Sustained release tablet">
                        Sustained release tablet
                      </option>
                      <option value="Oral suspension">Oral suspension</option>
                      <option value="Inhaler">Inhaler</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                      Route
                    </label>
                    <select
                      value={route}
                      onChange={(e) => setRoute(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    >
                      <option value="Oral">Oral</option>
                      <option value="Sublingual">Sublingual</option>
                      <option value="Inhalation">Inhalation</option>
                      <option value="Topical">Topical</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Dosage */}
          {currentStep === 3 && (
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-extrabold text-stone-900">
                  Step 3: Dosage Strength
                </h3>
                <p className="text-stone-500 mt-0.5">
                  Specify dosage per administration unit.
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Dose Unit / Strength
                </label>
                <input
                  type="text"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="e.g. 500 mg or 40 mg"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {["250 mg", "500 mg", "650 mg", "40 mg", "10 mg", "5 mg"].map(
                  (st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setDosage(st)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                        dosage === st
                          ? "bg-stone-900 text-white border-stone-900"
                          : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                      }`}
                    >
                      {st}
                    </button>
                  ),
                )}
              </div>
            </div>
          )}

          {/* Step 4: Frequency & Timing */}
          {currentStep === 4 && (
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-extrabold text-stone-900">
                  Step 4: Frequency &amp; Timing
                </h3>
                <p className="text-stone-500 mt-0.5">
                  Define intervals and meal relationship.
                </p>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                      Frequency
                    </label>
                    <select
                      value={frequency}
                      onChange={(e) => {
                        setFrequency(e.target.value);
                        if (e.target.value === "3 times daily")
                          setFrequencyCompact("1 capsule × 3/day");
                        else if (e.target.value === "2 times daily")
                          setFrequencyCompact("1 tablet × 2/day");
                        else if (e.target.value === "Once daily")
                          setFrequencyCompact("1 tablet × 1/day");
                        else setFrequencyCompact("When required (SOS)");
                      }}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    >
                      <option value="3 times daily">3 times daily (TDS)</option>
                      <option value="2 times daily">2 times daily (BD)</option>
                      <option value="Once daily">Once daily (OD)</option>
                      <option value="When required (SOS)">
                        When required (SOS)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                      Meal Relationship
                    </label>
                    <select
                      value={timing}
                      onChange={(e) => setTiming(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    >
                      <option value="After meals">After meals</option>
                      <option value="Before meals">Before meals</option>
                      <option value="With meals">With meals</option>
                      <option value="Empty stomach (Morning)">
                        Empty stomach (Morning)
                      </option>
                      <option value="At bedtime">At bedtime</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                    Compact Summary String
                  </label>
                  <input
                    type="text"
                    value={frequencyCompact}
                    onChange={(e) => setFrequencyCompact(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Duration & Quantity */}
          {currentStep === 5 && (
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-extrabold text-stone-900">
                  Step 5: Duration &amp; Units
                </h3>
                <p className="text-stone-500 mt-0.5">
                  Prescription timeframe and total dispensing units.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    value={durationDays}
                    onChange={(e) => {
                      const days = parseInt(e.target.value) || 1;
                      setDurationDays(days);
                      setQuantity(days * 3);
                    }}
                    min={1}
                    max={90}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                    Total Quantity (Units)
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    min={1}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Instructions */}
          {currentStep === 6 && (
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-extrabold text-stone-900">
                  Step 6: Patient Instructions
                </h3>
                <p className="text-stone-500 mt-0.5">
                  Clinical directions, warnings, and refill allowances.
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Specific Patient Instructions
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={3}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                    Authorized Refills
                  </label>
                  <input
                    type="number"
                    value={refills}
                    onChange={(e) => setRefills(parseInt(e.target.value) || 0)}
                    min={0}
                    max={5}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                    Prescribing Doctor
                  </label>
                  <input
                    type="text"
                    value={prescribedBy}
                    onChange={(e) => setPrescribedBy(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Review & Safety Disclosure */}
          {currentStep === 7 && (
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-extrabold text-stone-900">
                  Step 7: Final Review &amp; Issuance
                </h3>
                <p className="text-stone-500 mt-0.5">
                  Verify prescription summary before digital signing.
                </p>
              </div>

              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Patient:</span>
                  <strong className="text-stone-900">
                    {selectedPatient.fullName} ({selectedPatient.age} Y)
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Medication:</span>
                  <strong className="text-stone-900">
                    {medicationName} ({dosage})
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Frequency:</span>
                  <span className="font-bold text-emerald-800">
                    {frequencyCompact} • {timing}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Duration &amp; Qty:</span>
                  <strong className="text-stone-900">
                    {durationDays} days ({quantity} units)
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Prescriber:</span>
                  <span className="text-stone-800">{prescribedBy}</span>
                </div>
              </div>

              {/* Medication Safety UX Banner */}
              <div className="p-3 bg-amber-50/70 border border-amber-300 rounded-2xl flex items-start space-x-2 text-xs text-amber-900">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <strong>Medication Safety Policy:</strong> Odyssey Flow
                  records and manages prescriptions authorized by licensed
                  clinicians. Synthetic clinical entries are simulated for
                  demonstration.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-stone-100 bg-stone-50 flex items-center justify-between text-xs">
          {currentStep > 1 ? (
            <button
              onClick={handleBack}
              className="px-4 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 font-bold transition-colors flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < totalSteps ? (
            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold transition-all shadow-xs flex items-center space-x-1"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-all shadow-xs flex items-center space-x-1"
            >
              <Check className="w-4 h-4" />
              <span>Issue Prescription</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
