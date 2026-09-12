import React, { useState } from "react";
import { X, Building2, Check, MapPin, Phone } from "lucide-react";
import { PharmacyPartner } from "../../types/pharmacyLabs";

interface AddPharmacyModalProps {
  onClose: () => void;
  onAddPharmacy: (partner: PharmacyPartner) => void;
}

export const AddPharmacyModal: React.FC<AddPharmacyModalProps> = ({
  onClose,
  onAddPharmacy,
}) => {
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [distance, setDistance] = useState("1.5 km");
  const [operatingStatus, setOperatingStatus] =
    useState<PharmacyPartner["operatingStatus"]>("Open");
  const [phone, setPhone] = useState("+91 22 ");
  const [supportedFulfillment, setSupportedFulfillment] = useState(
    "In-store Pickup • Express Home Delivery",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !area.trim()) return;

    const newPartner: PharmacyPartner = {
      id: `pharma_${Date.now()}`,
      name: name.trim(),
      area: area.trim(),
      address: address.trim() || `${area.trim()}, Mumbai`,
      distance,
      operatingStatus,
      contactPhone: phone.trim() || "+91 22 2600 0000",
      supportedFulfillment,
      availabilityStatus: "Available",
      sampleMedicines: [
        "General Formularies",
        "Essential Antibiotics",
        "Analgesics",
      ],
    };

    onAddPharmacy(newPartner);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200/80 w-full max-w-lg flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              <Building2 className="w-4 h-4 text-emerald-800" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-stone-900">
                Add Affiliated Pharmacy
              </h2>
              <span className="text-[11px] text-stone-500 font-medium">
                Expand Operational Fulfillment Directory
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Pharmacy Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Wellness Hub Chemist"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-600"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Area / Locality
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Bandra West"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
              Full Physical Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Shop 2, Hill Road, Bandra West, Mumbai 400050"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Distance (from Clinic)
              </label>
              <input
                type="text"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="e.g. 1.5 km"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Operating Status
              </label>
              <select
                value={operatingStatus}
                onChange={(e) => setOperatingStatus(e.target.value as any)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 font-semibold"
              >
                <option value="Open">Open</option>
                <option value="24x7 Open">24x7 Open</option>
                <option value="Closes at 11 PM">Closes at 11 PM</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
              Supported Fulfillment Channels
            </label>
            <input
              type="text"
              value={supportedFulfillment}
              onChange={(e) => setSupportedFulfillment(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 font-medium"
            />
          </div>

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
              className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold shadow-xs flex items-center space-x-1"
            >
              <Check className="w-4 h-4" />
              <span>Register Partner</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
