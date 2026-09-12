import React, { useState } from "react";
import {
  Building2,
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  Search,
  Plus,
  CheckCircle2,
  Check,
  ExternalLink,
} from "lucide-react";
import { PharmacyPartner } from "../../../types/pharmacyLabs";

interface PharmacyNetworkTabProps {
  pharmacies: PharmacyPartner[];
  onOpenAddModal: () => void;
  searchQuery: string;
}

export const PharmacyNetworkTab: React.FC<PharmacyNetworkTabProps> = ({
  pharmacies,
  onOpenAddModal,
  searchQuery,
}) => {
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const filtered = pharmacies.filter((p) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      !query ||
      p.name.toLowerCase().includes(query) ||
      p.area.toLowerCase().includes(query) ||
      p.address.toLowerCase().includes(query) ||
      p.sampleMedicines.some((m) => m.toLowerCase().includes(query))
    );
  });

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard?.writeText?.(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Top Advisory Banner */}
      <div className="bg-stone-100/80 rounded-2xl p-4 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-extrabold text-stone-900 block">
            Operational Fulfillment Directory
          </span>
          <p className="text-stone-600 mt-0.5">
            This directory assists clinic staff in communicating verified local
            fulfillment points to patients. Simulated availability for prototype
            demonstration.
          </p>
        </div>
        <button
          onClick={onOpenAddModal}
          className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center space-x-1.5 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Local Partner</span>
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-stone-200 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-stone-800">
            No matching availability found in the demo network
          </h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search query or add a new affiliated dispensing
            outlet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((pharma) => (
            <div
              key={pharma.id}
              className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-2xs hover:shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center border border-stone-200">
                      <Building2 className="w-4 h-4 text-emerald-800" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-stone-900 leading-tight">
                        {pharma.name}
                      </h4>
                      <span className="text-[11px] text-stone-500 font-medium block mt-0.5">
                        {pharma.area}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      pharma.availabilityStatus === "Available"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-amber-50 text-amber-900 border-amber-200"
                    }`}
                  >
                    {pharma.availabilityStatus}
                  </span>
                </div>

                {/* Distance & Hours */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-2.5 rounded-2xl border border-stone-200/60">
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      Distance from Clinic
                    </span>
                    <span className="font-mono font-extrabold text-stone-900">
                      {pharma.distance}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      Operating Hours
                    </span>
                    <span className="font-semibold text-stone-800 text-[11px]">
                      {pharma.operatingStatus}
                    </span>
                  </div>
                </div>

                {/* Address */}
                <div className="text-xs space-y-1">
                  <div className="flex items-start space-x-1.5 text-stone-600">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-relaxed">
                      {pharma.address}
                    </span>
                  </div>
                </div>

                {/* Supported Fulfillment */}
                <div className="space-y-1 pt-1 border-t border-stone-100">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                    Supported Fulfillment
                  </span>
                  <p className="text-[11px] text-stone-700 font-medium">
                    {pharma.supportedFulfillment}
                  </p>
                </div>

                {/* Sample In-Stock Medicines */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                    Sample Stock Checked
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {pharma.sampleMedicines.map((med, idx) => (
                      <span
                        key={idx}
                        className="bg-stone-100 text-stone-700 text-[10px] font-medium px-2 py-0.5 rounded-lg border border-stone-200/60"
                      >
                        {med}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleCopyPhone(pharma.contactPhone)}
                  className="text-stone-600 hover:text-stone-900 font-bold text-[11px] flex items-center space-x-1"
                >
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>
                    {copiedPhone === pharma.contactPhone
                      ? "Copied!"
                      : pharma.contactPhone}
                  </span>
                </button>

                <span className="text-[10px] text-stone-400 font-mono">
                  Verified Partner
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
