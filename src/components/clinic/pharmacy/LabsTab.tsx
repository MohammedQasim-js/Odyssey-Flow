import React from "react";
import {
  Activity,
  Eye,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  FlaskConical,
  Scan,
  Radio,
  HelpCircle,
} from "lucide-react";
import {
  InvestigationRecord,
  InvestigationCategory,
} from "../../../types/pharmacyLabs";

interface LabsTabProps {
  investigations: InvestigationRecord[];
  onSelectInvestigation: (investigation: InvestigationRecord) => void;
  searchQuery: string;
  statusFilter: string;
  categoryFilter?: string;
  labKpis: {
    pendingOrders: number;
    samplesCollected: number;
    resultsAvailable: number;
    awaitDoctorReview: number;
    completedToday: number;
  };
}

export const LabsTab: React.FC<LabsTabProps> = ({
  investigations,
  onSelectInvestigation,
  searchQuery,
  statusFilter,
  categoryFilter,
  labKpis,
}) => {
  const filtered = investigations.filter((inv) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      inv.patientName.toLowerCase().includes(query) ||
      inv.investigationName.toLowerCase().includes(query) ||
      inv.sampleId.toLowerCase().includes(query) ||
      inv.orderedBy.toLowerCase().includes(query) ||
      inv.tokenNumber.toLowerCase().includes(query);

    const matchesStatus =
      !statusFilter || statusFilter === "all" || inv.status === statusFilter;
    const matchesCat =
      !categoryFilter ||
      categoryFilter === "all" ||
      inv.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCat;
  });

  const getCategoryIcon = (category: InvestigationCategory) => {
    switch (category) {
      case "Laboratory":
        return <FlaskConical className="w-3.5 h-3.5 text-emerald-700" />;
      case "Radiology":
        return <Scan className="w-3.5 h-3.5 text-blue-700" />;
      case "Imaging":
        return <Radio className="w-3.5 h-3.5 text-purple-700" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-stone-600" />;
    }
  };

  const getStatusBadge = (status: InvestigationRecord["status"]) => {
    switch (status) {
      case "Reviewed":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Report Ready":
        return "bg-amber-50 text-amber-900 border-amber-300 font-extrabold";
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
    <div className="space-y-4">
      {/* LAB KPI ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Pending Orders
          </span>
          <span className="text-xl font-mono font-black text-stone-900 mt-1 block">
            {labKpis.pendingOrders}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Samples Collected
          </span>
          <span className="text-xl font-mono font-black text-stone-900 mt-1 block">
            {labKpis.samplesCollected}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Results Available
          </span>
          <span className="text-xl font-mono font-black text-emerald-800 mt-1 block">
            {labKpis.resultsAvailable}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-amber-300 bg-amber-50/40 shadow-2xs">
          <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider block">
            Awaiting Doctor Review
          </span>
          <span className="text-xl font-mono font-black text-amber-950 mt-1 block">
            {labKpis.awaitDoctorReview}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Completed Today
          </span>
          <span className="text-xl font-mono font-black text-stone-900 mt-1 block">
            {labKpis.completedToday}
          </span>
        </div>
      </div>

      {/* INVESTIGATION TABLE */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-stone-900">
              Active Laboratory &amp; Diagnostic Investigations
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Pathology blood panels, radiological scans, ultrasound imaging,
              and clinical review workflows.
            </p>
          </div>
          <div className="text-xs font-mono font-bold text-stone-500 bg-stone-50 px-2.5 py-1 rounded-xl border border-stone-200/80">
            Showing {filtered.length} of {investigations.length} investigations
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
              <Activity className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-stone-800">
              All investigations are up to date
            </h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              No pending orders or unprocessed diagnostic investigations match
              the current search filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="pb-3 pl-3">Patient</th>
                  <th className="pb-3">Investigation</th>
                  <th className="pb-3">Ordered By</th>
                  <th className="pb-3">Ordered</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Result</th>
                  <th className="pb-3 pr-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {filtered.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-stone-50/80 transition-colors"
                  >
                    {/* Patient Cell */}
                    <td className="py-4 pl-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center font-bold text-xs shrink-0 border border-stone-200">
                          {inv.patientName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-extrabold text-stone-900 text-xs flex items-center space-x-1.5">
                            <span>{inv.patientName}</span>
                            <span className="text-[10px] font-mono font-bold bg-stone-100 px-1.5 py-0.2 rounded text-stone-600">
                              {inv.tokenNumber}
                            </span>
                          </div>
                          <div className="text-[11px] text-stone-500 flex items-center space-x-2 mt-0.5">
                            <span>
                              {inv.patientAge} {inv.patientGender}
                            </span>
                            <span className="text-stone-300">•</span>
                            <span className="font-mono text-stone-500 text-[10px]">
                              {inv.sampleId}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Investigation Cell */}
                    <td className="py-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1.5">
                          <span className="p-1 rounded bg-stone-100 border border-stone-200 inline-flex">
                            {getCategoryIcon(inv.category)}
                          </span>
                          <span className="font-extrabold text-stone-900 text-xs">
                            {inv.investigationName}
                          </span>
                        </div>

                        {/* Repeated investigation pill indicator */}
                        {inv.isRepeated && (
                          <div className="inline-flex items-center space-x-1 text-[10px] font-bold text-amber-900 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-2.5 h-2.5 text-amber-700" />
                            <span>
                              Similar investigation in previous encounter
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Ordered By Cell */}
                    <td className="py-4">
                      <span className="font-bold text-stone-800 text-xs block">
                        {inv.orderedBy}
                      </span>
                      <span className="text-[10px] text-stone-400 block font-medium">
                        {inv.category}
                      </span>
                    </td>

                    {/* Ordered Date Cell */}
                    <td className="py-4">
                      <span className="font-mono text-stone-700 text-xs block">
                        {inv.orderedDate}
                      </span>
                      <span className="text-[10px] text-stone-400 block">
                        ETA: {inv.eta || "Completed"}
                      </span>
                    </td>

                    {/* Status Cell */}
                    <td className="py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${getStatusBadge(inv.status)}`}
                      >
                        {inv.status}
                      </span>
                    </td>

                    {/* Result Cell */}
                    <td className="py-4">
                      <div className="space-y-0.5">
                        <span
                          className={`text-[11px] font-extrabold block ${
                            inv.status === "Report Ready"
                              ? "text-amber-800"
                              : inv.status === "Reviewed"
                                ? "text-emerald-800"
                                : "text-stone-700"
                          }`}
                        >
                          {inv.resultStatus}
                        </span>
                        {inv.priority === "Urgent" ||
                        inv.priority === "Priority Review" ? (
                          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                            ● {inv.priority}
                          </span>
                        ) : null}
                      </div>
                    </td>

                    {/* Action Cell */}
                    <td className="py-4 pr-3 text-right">
                      {inv.status === "Report Ready" ? (
                        <button
                          onClick={() => onSelectInvestigation(inv)}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs transition-all shadow-xs inline-flex items-center space-x-1"
                        >
                          <Activity className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onSelectInvestigation(inv)}
                          className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-900 text-stone-700 hover:text-white font-bold text-xs transition-all shadow-2xs inline-flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
