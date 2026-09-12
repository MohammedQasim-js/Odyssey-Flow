import React from "react";
import {
  FileText,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  Printer,
  Download,
} from "lucide-react";
import { PrescriptionDocument } from "../../../types/pharmacyLabs";

interface PrescriptionsTabProps {
  prescriptions: PrescriptionDocument[];
  onSelectPrescription: (prescription: PrescriptionDocument) => void;
  searchQuery: string;
  statusFilter: string;
}

export const PrescriptionsTab: React.FC<PrescriptionsTabProps> = ({
  prescriptions,
  onSelectPrescription,
  searchQuery,
  statusFilter,
}) => {
  const filtered = prescriptions.filter((rx) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      rx.id.toLowerCase().includes(query) ||
      rx.patientName.toLowerCase().includes(query) ||
      rx.patientCode.toLowerCase().includes(query) ||
      rx.doctorName.toLowerCase().includes(query) ||
      rx.medications.some((m) =>
        m.medicationName.toLowerCase().includes(query),
      );

    const matchesStatus =
      !statusFilter || statusFilter === "all" || rx.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: PrescriptionDocument["status"]) => {
    switch (status) {
      case "Active":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "Dispensed":
      case "Completed":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Refill Due":
        return "bg-rose-50 text-rose-800 border-rose-200";
      default:
        return "bg-stone-100 text-stone-700 border-stone-200";
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-stone-900">
            Prescription Registry &amp; Clinical Documentation
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Archival history of formal medical prescriptions issued across
            clinic encounters.
          </p>
        </div>
        <div className="text-xs font-mono font-bold text-stone-500 bg-stone-50 px-2.5 py-1 rounded-xl border border-stone-200/80">
          Showing {filtered.length} of {prescriptions.length} records
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-stone-800">
            No prescriptions found
          </h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            No prescription records match your current query or filter criteria.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="pb-3 pl-3">Prescription ID</th>
                <th className="pb-3">Patient</th>
                <th className="pb-3">Prescribing Doctor</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Medications</th>
                <th className="pb-3">Duration</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 pr-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {filtered.map((rx) => (
                <tr
                  key={rx.id}
                  className="hover:bg-stone-50/80 transition-colors"
                >
                  {/* Rx ID */}
                  <td className="py-4 pl-3 font-mono font-bold text-stone-900">
                    <span className="text-xs font-mono font-black text-stone-900 block">
                      {rx.id}
                    </span>
                    <span className="text-[10px] text-stone-400 font-normal">
                      Digital Encrypted
                    </span>
                  </td>

                  {/* Patient */}
                  <td className="py-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center font-bold text-xs border border-stone-200">
                        {rx.patientName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-extrabold text-stone-900 text-xs block">
                          {rx.patientName}
                        </span>
                        <span className="text-[11px] text-stone-500 block">
                          {rx.patientCode} • {rx.tokenNumber}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Doctor */}
                  <td className="py-4">
                    <span className="font-bold text-stone-800 text-xs block">
                      {rx.doctorName}
                    </span>
                    <span className="text-[10px] text-stone-400 block truncate max-w-[150px]">
                      {rx.doctorSpecialty}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-4 font-mono text-stone-700 text-xs">
                    {rx.date}
                  </td>

                  {/* Medication Count */}
                  <td className="py-4">
                    <span className="font-bold text-stone-900 text-xs block">
                      {rx.medications.length}{" "}
                      {rx.medications.length === 1 ? "Medicine" : "Medicines"}
                    </span>
                    <span className="text-[11px] text-stone-500 block truncate max-w-[170px]">
                      {rx.medications.map((m) => m.medicationName).join(", ")}
                    </span>
                  </td>

                  {/* Duration */}
                  <td className="py-4 font-mono font-bold text-stone-700 text-xs">
                    {rx.durationTotal}
                  </td>

                  {/* Status */}
                  <td className="py-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${getStatusBadge(rx.status)}`}
                    >
                      {rx.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-4 pr-3 text-right">
                    <button
                      onClick={() => onSelectPrescription(rx)}
                      className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-900 text-stone-700 hover:text-white font-bold text-xs transition-all shadow-2xs inline-flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Document</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
