import React, { useState } from "react";
import {
  Pill,
  Eye,
  ChevronDown,
  ChevronUp,
  Layers,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";
import { MedicationRecord } from "../../types/pharmacyLabs";

interface MedicationsTabProps {
  medications: MedicationRecord[];
  onSelectMedication: (medication: MedicationRecord) => void;
  searchQuery: string;
  statusFilter: string;
}

export const MedicationsTab: React.FC<MedicationsTabProps> = ({
  medications,
  onSelectMedication,
  searchQuery,
  statusFilter,
}) => {
  const [expandedRxId, setExpandedRxId] = useState<string | null>(null);

  // Filter logic
  const filtered = medications.filter((m) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      m.patientName.toLowerCase().includes(query) ||
      m.medicationName.toLowerCase().includes(query) ||
      m.tokenNumber.toLowerCase().includes(query) ||
      m.pharmacyName.toLowerCase().includes(query) ||
      m.prescribedBy.toLowerCase().includes(query);

    const matchesStatus =
      !statusFilter || statusFilter === "all" || m.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: MedicationRecord["status"]) => {
    switch (status) {
      case "Dispensed":
      case "Completed":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Dispensing":
        return "bg-amber-50 text-amber-900 border-amber-200";
      case "Partially Dispensed":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "Prescribed":
        return "bg-stone-100 text-stone-800 border-stone-200";
      case "Refill Due":
        return "bg-rose-50 text-rose-800 border-rose-200";
      case "Discontinued":
        return "bg-stone-200/70 text-stone-600 border-stone-300 line-through";
      default:
        return "bg-stone-100 text-stone-700 border-stone-200";
    }
  };

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedRxId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-stone-900">
            Active Medications &amp; Dispensing Queue
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Operational overview of ongoing courses, prescription duration, and
            local dispensing points.
          </p>
        </div>
        <div className="text-xs font-mono font-bold text-stone-500 bg-stone-50 px-2.5 py-1 rounded-xl border border-stone-200/80">
          Showing {filtered.length} of {medications.length} prescriptions
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <Pill className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-stone-800">
            No active prescriptions
          </h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            No patients currently have medication records requiring attention
            matching your search criteria.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="pb-3 pl-3">Patient</th>
                <th className="pb-3">Medication</th>
                <th className="pb-3">Prescription</th>
                <th className="pb-3">Duration</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Pharmacy</th>
                <th className="pb-3 pr-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {filtered.map((item) => {
                const isExpanded = expandedRxId === item.id;
                const hasSiblings = !!(
                  item.siblingMedications && item.siblingMedications.length > 0
                );

                return (
                  <React.Fragment key={item.id}>
                    <tr className="hover:bg-stone-50/80 transition-colors">
                      {/* Patient Cell */}
                      <td className="py-4 pl-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center font-bold text-xs shrink-0 border border-stone-200">
                            {item.patientName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-extrabold text-stone-900 text-xs flex items-center space-x-1.5">
                              <span>{item.patientName}</span>
                              <span className="text-[10px] font-mono font-bold bg-stone-100 px-1.5 py-0.2 rounded text-stone-600">
                                {item.tokenNumber}
                              </span>
                            </div>
                            <div className="text-[11px] text-stone-500 flex items-center space-x-2 mt-0.5">
                              <span>
                                {item.patientAge} {item.patientGender}
                              </span>
                              <span className="text-stone-300">•</span>
                              <span className="text-stone-600 font-medium">
                                {item.visitReference}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Medication Cell */}
                      <td className="py-4">
                        <div className="space-y-0.5">
                          <span className="font-extrabold text-stone-900 text-xs block">
                            {item.medicationName}
                          </span>
                          <span className="text-[11px] text-stone-500 block">
                            {item.form}
                          </span>

                          {hasSiblings && (
                            <button
                              onClick={(e) => toggleExpand(item.id, e)}
                              className="mt-1 inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-lg transition-colors"
                            >
                              <Layers className="w-3 h-3" />
                              <span>
                                {item.totalMedicationsInRx ||
                                  item.siblingMedications?.length! + 1}{" "}
                                medications
                              </span>
                              {isExpanded ? (
                                <ChevronUp className="w-3 h-3 ml-0.5" />
                              ) : (
                                <ChevronDown className="w-3 h-3 ml-0.5" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Prescription Cell */}
                      <td className="py-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-stone-900 text-xs block">
                            {item.frequencyCompact}
                          </span>
                          <span className="text-[11px] text-stone-500 font-medium block">
                            {item.timing}
                          </span>
                        </div>
                      </td>

                      {/* Duration Cell */}
                      <td className="py-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-stone-900 text-xs">
                              {item.durationDays} days
                            </span>
                            <span className="text-[10px] font-mono text-stone-400">
                              ({item.startDate}–{item.endDate})
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-stone-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-emerald-600 h-full rounded-full"
                                style={{
                                  width: `${Math.min(100, Math.round((item.currentDay / item.durationDays) * 100))}%`,
                                }}
                              />
                            </div>
                            <span className="text-[11px] font-bold text-stone-600">
                              Day {item.currentDay} of {item.durationDays}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status Cell */}
                      <td className="py-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${getStatusBadge(item.status)}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* Pharmacy Cell */}
                      <td className="py-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-stone-800 text-xs block truncate max-w-[170px]">
                            {item.pharmacyName}
                          </span>
                          <span
                            className={`text-[10px] font-bold inline-block ${
                              item.pharmacyAvailability === "Available"
                                ? "text-emerald-700"
                                : "text-amber-700"
                            }`}
                          >
                            {item.pharmacyAvailability}
                          </span>
                        </div>
                      </td>

                      {/* Action Cell */}
                      <td className="py-4 pr-3 text-right">
                        <button
                          onClick={() => onSelectMedication(item)}
                          className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-900 text-stone-700 hover:text-white font-bold text-xs transition-all shadow-2xs inline-flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>

                    {/* Sibling Medications Dropdown */}
                    {isExpanded && item.siblingMedications && (
                      <tr className="bg-stone-50/60 border-y border-stone-200/60">
                        <td colSpan={7} className="py-3 px-6">
                          <div className="text-[11px] text-stone-500 font-bold mb-2 uppercase tracking-wider">
                            Additional Prescribed Items in {item.prescriptionId}
                            :
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {item.siblingMedications.map((sib, sIdx) => (
                              <div
                                key={sIdx}
                                className="bg-white p-2.5 rounded-xl border border-stone-200 flex items-center justify-between text-xs"
                              >
                                <div>
                                  <span className="font-bold text-stone-900">
                                    {sib.name}
                                  </span>
                                  <span className="text-[11px] text-stone-500 block">
                                    {sib.form} • {sib.dosage} • {sib.timing}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="text-stone-800 font-mono font-bold text-xs">
                                    {sib.frequency}
                                  </span>
                                  <span className="text-[10px] text-stone-400 block">
                                    {sib.duration}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
