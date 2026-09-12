import React, { useState } from "react";
import {
  Home,
  HeartPulse,
  PlusCircle,
  Clock,
  Receipt,
  ChevronLeft,
  Sparkles,
  Smartphone,
  Maximize2,
  Minimize2,
  Building2,
  ShieldCheck,
  User,
  Calendar,
  Activity,
  Wifi,
  Battery,
  Signal,
  ArrowLeft,
} from "lucide-react";
import { PatientHome } from "./PatientHome";
import { SanctuaryPulseView } from "./SanctuaryPulseView";
import { PatientCheckIn } from "./PatientCheckIn";
import { PatientHistoryView } from "./PatientHistoryView";
import { PatientBillingView } from "./PatientBillingView";
import { FindClinicView } from "./FindClinicView";
import { ClinicDetailView } from "./ClinicDetailView";
import { AppointmentBookingView, BookingData } from "./AppointmentBookingView";
import { ReviewAndPayView } from "./ReviewAndPayView";
import { AppointmentsView } from "./AppointmentsView";
import { PatientProfileView } from "./PatientProfileView";
import { PatientEntryModal } from "./PatientEntryModal";
import { Token, Patient, Clinic, Doctor } from "../../types";
import { DataStore } from "../../services/dataStore";

interface PatientShellProps {
  onBackToOverview?: () => void;
  controlledTab?: PatientTab;
  onTabChange?: (tab: PatientTab) => void;
}

export type PatientTab =
  | "home"
  | "pulse"
  | "checkin"
  | "clinics"
  | "history"
  | "billing"
  | "appointments"
  | "profile"
  | "clinic_detail"
  | "booking"
  | "review_pay";

export const PatientShell: React.FC<PatientShellProps> = ({
  onBackToOverview,
  controlledTab,
  onTabChange,
}) => {
  const [internalTab, setInternalTab] = useState<PatientTab>("home");
  const activeTab = controlledTab !== undefined ? controlledTab : internalTab;

  const setActiveTab = (tab: PatientTab) => {
    setInternalTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  // Viewport mode: '390' (Primary 390x844 target), '375', '412', or 'full'
  const [viewportWidth, setViewportWidth] = useState<
    "375" | "390" | "412" | "full"
  >("390");

  const [activeToken, setActiveToken] = useState<Token | undefined>(
    DataStore.getActiveToken(),
  );
  const [selectedClinic, setSelectedClinic] = useState<Clinic>(
    () => DataStore.getClinics()[0],
  );
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | undefined>(
    undefined,
  );
  const [currentBookingData, setCurrentBookingData] =
    useState<BookingData | null>(null);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);

  const [currentPatient, setCurrentPatient] = useState<Patient>(
    DataStore.getCurrentPatient() || DataStore.getPatients()[0],
  );

  const handleTokenCreated = (newToken: Token) => {
    DataStore.setActiveToken(newToken);
    setActiveToken(newToken);
    setActiveTab("pulse");
  };

  const handleOpenClinicDetail = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    const docs = DataStore.getDoctors().filter((d) => d.clinicId === clinic.id);
    setSelectedDoctor(docs[0]);
    setActiveTab("clinic_detail");
  };

  const handleStartBooking = (clinic: Clinic, doctor?: Doctor) => {
    setSelectedClinic(clinic);
    setSelectedDoctor(
      doctor || DataStore.getDoctors().find((d) => d.clinicId === clinic.id),
    );
    setActiveTab("booking");
  };

  const handleBookingContinue = (bookingData: BookingData) => {
    setCurrentBookingData(bookingData);
    setActiveTab("review_pay");
  };

  const handlePaymentSuccess = (token: Token) => {
    DataStore.setActiveToken(token);
    setActiveToken(token);
    setActiveTab("pulse");
  };

  const handleAuthenticated = (patient: Patient) => {
    setCurrentPatient(patient);
    const token = DataStore.getActiveToken();
    setActiveToken(token);
  };

  // Compute container width classes based on chosen viewport
  const getViewportWidthClass = () => {
    switch (viewportWidth) {
      case "375":
        return "w-[375px] max-w-[375px] h-[min(812px,calc(100dvh-96px))]";
      case "390":
        return "w-[390px] max-w-[390px] h-[min(844px,calc(100dvh-96px))]";
      case "412":
        return "w-[412px] max-w-[412px] h-[min(860px,calc(100dvh-96px))]";
      case "full":
        return "w-full max-w-xl h-[90vh]";
      default:
        return "w-[390px] max-w-[390px] h-[min(844px,calc(100dvh-96px))]";
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <PatientHome
            token={activeToken}
            patient={currentPatient}
            onNavigateToPulse={() => setActiveTab("pulse")}
            onNavigateToCheckIn={() => handleStartBooking(selectedClinic)}
            onNavigateToClinics={() => setActiveTab("clinics")}
            onNavigateToHistory={() => setActiveTab("history")}
            onNavigateToAppointments={() => setActiveTab("appointments")}
            onSelectClinic={handleOpenClinicDetail}
            onOpenEntryModal={() => setIsEntryModalOpen(true)}
          />
        );
      case "pulse":
        return (
          <SanctuaryPulseView
            token={activeToken}
            onBack={() => setActiveTab("home")}
            onNavigateToCheckIn={() => handleStartBooking(selectedClinic)}
          />
        );
      case "checkin":
        return (
          <PatientCheckIn
            onTokenCreated={handleTokenCreated}
            initialClinicId={selectedClinic.id}
          />
        );
      case "clinics":
        return (
          <FindClinicView
            onSelectClinic={handleOpenClinicDetail}
            onJoinQueue={handleStartBooking}
          />
        );
      case "clinic_detail":
        return (
          <ClinicDetailView
            clinic={selectedClinic}
            onBack={() => setActiveTab("home")}
            onJoinQueue={handleStartBooking}
          />
        );
      case "booking":
        return (
          <AppointmentBookingView
            clinic={selectedClinic}
            doctor={selectedDoctor}
            patient={currentPatient}
            onBack={() => setActiveTab("clinic_detail")}
            onContinue={handleBookingContinue}
          />
        );
      case "review_pay":
        return currentBookingData ? (
          <ReviewAndPayView
            bookingData={currentBookingData}
            onBack={() => setActiveTab("booking")}
            onPaymentSuccess={handlePaymentSuccess}
          />
        ) : (
          <PatientHome
            token={activeToken}
            patient={currentPatient}
            onNavigateToPulse={() => setActiveTab("pulse")}
            onNavigateToCheckIn={() => handleStartBooking(selectedClinic)}
            onNavigateToClinics={() => setActiveTab("clinics")}
            onNavigateToHistory={() => setActiveTab("history")}
            onNavigateToAppointments={() => setActiveTab("appointments")}
            onSelectClinic={handleOpenClinicDetail}
            onOpenEntryModal={() => setIsEntryModalOpen(true)}
          />
        );
      case "appointments":
        return (
          <AppointmentsView
            onBookNew={() => handleStartBooking(selectedClinic)}
            onSelectClinic={handleOpenClinicDetail}
          />
        );
      case "history":
        return <PatientHistoryView patient={currentPatient} />;
      case "billing":
        return <PatientBillingView token={activeToken} />;
      case "profile":
        return (
          <PatientProfileView
            patient={currentPatient}
            onOpenBilling={() => setActiveTab("billing")}
            onOpenJourney={() => setActiveTab("history")}
            onOpenAppointments={() => setActiveTab("appointments")}
            onSwitchPatient={() => setIsEntryModalOpen(true)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F6] py-3 sm:py-6 px-2 flex flex-col items-center justify-center font-sans text-stone-900">
      {/* 1. Top Preview Controls & Viewport Switcher (375px, 390px, 412px, Full) */}
      <div className="w-full max-w-md flex items-center justify-between mb-3 px-2 text-xs text-stone-600">
        <div className="flex items-center space-x-2">
          {onBackToOverview && (
            <button
              onClick={onBackToOverview}
              className="flex items-center space-x-1 hover:text-stone-900 bg-white px-2.5 py-1 rounded-xl border border-stone-200 shadow-2xs font-semibold active:scale-95 transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}
          <span className="font-extrabold text-stone-900">ODYSSEY FLOW</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 text-[10px]">
            Patient Mobile
          </span>
        </div>

        {/* Viewport size buttons */}
        <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-stone-200 shadow-2xs text-[11px] font-semibold">
          <button
            onClick={() => setViewportWidth("375")}
            className={`px-1.5 py-0.5 rounded-lg transition-colors ${viewportWidth === "375" ? "bg-stone-900 text-white" : "text-stone-500 hover:text-stone-900"}`}
            title="iPhone SE / Mini (375px)"
          >
            375
          </button>
          <button
            onClick={() => setViewportWidth("390")}
            className={`px-1.5 py-0.5 rounded-lg transition-colors ${viewportWidth === "390" ? "bg-[#34C759] text-white font-bold" : "text-stone-500 hover:text-stone-900"}`}
            title="Primary Target: iPhone 13/14/15 (390x844)"
          >
            390
          </button>
          <button
            onClick={() => setViewportWidth("412")}
            className={`px-1.5 py-0.5 rounded-lg transition-colors ${viewportWidth === "412" ? "bg-stone-900 text-white" : "text-stone-500 hover:text-stone-900"}`}
            title="Pixel / Galaxy (412px)"
          >
            412
          </button>
          <button
            onClick={() => setViewportWidth("full")}
            className={`px-1.5 py-0.5 rounded-lg transition-colors ${viewportWidth === "full" ? "bg-stone-900 text-white" : "text-stone-500 hover:text-stone-900"}`}
            title="Full fluid layout"
          >
            Full
          </button>
        </div>
      </div>

      {/* 2. Mobile Device Frame Container (Warm off-white #F8F9FA inside) */}
      <div
        className={`${
          viewportWidth === "full"
            ? "bg-[#FAF9F6] overflow-hidden flex flex-col"
            : "bg-[#FAF9F6] shadow-[0_20px_60px_rgba(0,0,0,0.12)] border-[9px] border-stone-900 rounded-[3rem] overflow-hidden flex flex-col"
        } transition-all duration-300 relative ${getViewportWidthClass()}`}
      >
        {/* iOS Dynamic Status Bar (Matching Reference 9:00, signal, wifi, battery) */}
        <div className="pt-2 px-6 pb-1 flex items-center justify-between text-stone-900 text-xs font-bold shrink-0 select-none z-50">
          <span className="font-semibold tracking-tight text-[13px]">9:00</span>

          {/* Dynamic Island / Notch pill */}
          <div className="w-24 h-4 bg-stone-900 rounded-full mx-auto flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-stone-950 mr-2"></div>
            <div className="w-2 h-2 rounded-full bg-emerald-500/80"></div>
          </div>

          <div className="flex items-center space-x-1.5 text-stone-800">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="w-5 h-2.5 rounded border border-stone-800 p-0.5 flex items-center">
              <div className="w-full h-full bg-[#34C759] rounded-2xs"></div>
            </div>
          </div>
        </div>

        {/* Scrollable Screen Content */}
        <div className="flex-1 px-4 pt-2 pb-24 overflow-y-auto no-scrollbar">
          {renderTabContent()}
        </div>

        {/* 3. Clean Bottom Navigation Bar (Matching User Prompt Exact Specs: Home, Queue, Journey, Appointments, Profile) */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-stone-200/80 px-3 py-2 flex items-center justify-around z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          {/* Home */}
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all ${
              activeTab === "home" ||
              activeTab === "clinics" ||
              activeTab === "clinic_detail" ||
              activeTab === "booking" ||
              activeTab === "review_pay"
                ? "text-[#16A34A] font-extrabold"
                : "text-stone-400 hover:text-stone-700"
            }`}
          >
            <div
              className={`p-1 rounded-xl transition-colors ${
                activeTab === "home" ? "bg-emerald-50 text-[#34C759]" : ""
              }`}
            >
              <Home className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
          </button>

          {/* Queue (Sanctuary Pulse) */}
          <button
            onClick={() => setActiveTab("pulse")}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all relative ${
              activeTab === "pulse"
                ? "text-[#16A34A] font-extrabold"
                : "text-stone-400 hover:text-stone-700"
            }`}
          >
            <div
              className={`p-1 rounded-xl relative transition-colors ${
                activeTab === "pulse" ? "bg-emerald-50 text-[#34C759]" : ""
              }`}
            >
              <HeartPulse className="w-5 h-5" />
              {activeToken && (
                <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-[#34C759] ring-2 ring-white animate-pulse"></span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Queue</span>
          </button>

          {/* Journey */}
          <button
            onClick={() => setActiveTab("history")}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all ${
              activeTab === "history"
                ? "text-[#16A34A] font-extrabold"
                : "text-stone-400 hover:text-stone-700"
            }`}
          >
            <div
              className={`p-1 rounded-xl transition-colors ${
                activeTab === "history" ? "bg-emerald-50 text-[#34C759]" : ""
              }`}
            >
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Journey</span>
          </button>

          {/* Appointments */}
          <button
            onClick={() => setActiveTab("appointments")}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all ${
              activeTab === "appointments"
                ? "text-[#16A34A] font-extrabold"
                : "text-stone-400 hover:text-stone-700"
            }`}
          >
            <div
              className={`p-1 rounded-xl transition-colors ${
                activeTab === "appointments"
                  ? "bg-emerald-50 text-[#34C759]"
                  : ""
              }`}
            >
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">
              Appointments
            </span>
          </button>

          {/* Profile */}
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all ${
              activeTab === "profile" || activeTab === "billing"
                ? "text-[#16A34A] font-extrabold"
                : "text-stone-400 hover:text-stone-700"
            }`}
          >
            <div
              className={`p-1 rounded-xl transition-colors ${
                activeTab === "profile" ? "bg-emerald-50 text-[#34C759]" : ""
              }`}
            >
              <User className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Profile</span>
          </button>
        </div>
      </div>

      {/* 4. Identity Verification & Low-Friction Entry Modal */}
      <PatientEntryModal
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        onAuthenticated={handleAuthenticated}
      />
    </div>
  );
};
