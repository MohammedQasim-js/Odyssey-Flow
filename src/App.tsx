import React, { useState, useEffect } from "react";
import { Header } from "./components/common/Header";
import {
  DemoScenarioBar,
  DEMO_STEPS,
} from "./components/common/DemoScenarioBar";
import { LandingView } from "./components/landing/LandingView";
import { PatientShell, PatientTab } from "./components/patient/PatientShell";
import { ClinicShell } from "./components/clinic/ClinicShell";
import { ClinicTab } from "./components/clinic/ClinicSidebar";
import { DataStore } from "./services/dataStore";
import { Token, Doctor } from "./types";
import { Zap, Smartphone, LayoutDashboard, ShieldCheck } from "lucide-react";

export default function App() {
  const [currentView, setCurrentView] = useState<
    "landing" | "patient" | "clinic"
  >("patient");
  const [showDemoAndHeader, setShowDemoAndHeader] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<
    "landing" | "patient" | "clinic"
  >("clinic");
  const [queue, setQueue] = useState<Token[]>(DataStore.getQueue());
  const [doctors, setDoctors] = useState<Doctor[]>(DataStore.getDoctors());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Demo Scenario Orchestration State
  const [demoStep, setDemoStep] = useState<number>(1);
  const [isSplitView, setIsSplitView] = useState<boolean>(false);
  const [patientTab, setPatientTab] = useState<PatientTab>("home");
  const [clinicTab, setClinicTab] = useState<ClinicTab>("dashboard");
  const [clinicTab, setClinicTab] = useState<ClinicTab>("pharmacy_labs");
  const [snapshotTokenNumber, setSnapshotTokenNumber] = useState<string | null>(
    null,
  );

  // Initialize data store on mount
  useEffect(() => {
    DataStore.init();
    setQueue(DataStore.getQueue());
    setDoctors(DataStore.getDoctors());

    const interval = setInterval(() => {
      setQueue(DataStore.getQueue());
      setDoctors(DataStore.getDoctors());
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleAdvanceQueue = () => {
    const { updatedQueue } = DataStore.advanceQueue();
    setQueue(updatedQueue);
    showToast("Live Queue advanced: Next patient called for consultation.");
  };

  const handleRebalanceDPS = () => {
    const res = DataStore.rebalanceQueueByDps();
    setQueue(DataStore.getQueue());
    showToast(res.message);
  };

  const handleResetDemo = () => {
    DataStore.resetDemoState();
    DataStore.resetSimulation();
    setQueue(DataStore.getQueue());
    setDoctors(DataStore.getDoctors());
    setDemoStep(1);
    setPatientTab("home");
    setClinicTab("dashboard");
    setSnapshotTokenNumber(null);
    showToast(
      "Demo dataset and simulation state restored to baseline (Step 1).",
    );
  };

  // -------------------------------------------------------------
  // END-TO-END 12-STEP SCENARIO ORCHESTRATOR
  // -------------------------------------------------------------
  const executeDemoStep = (stepNumber: number) => {
    setDemoStep(stepNumber);
    const stepDef = DEMO_STEPS.find((s) => s.stepNumber === stepNumber);
    if (!stepDef) return;

    // Direct view switching if not in split view
    if (!isSplitView) {
      if (stepDef.viewTarget === "patient") {
        setCurrentView("patient");
      } else if (stepDef.viewTarget === "clinic") {
        setCurrentView("clinic");
      }
    }

    if (stepDef.patientTab) setPatientTab(stepDef.patientTab);
    if (stepDef.clinicTab) setClinicTab(stepDef.clinicTab as ClinicTab);
    setSnapshotTokenNumber(stepDef.openTokenSnapshot || null);

    switch (stepNumber) {
      case 1: {
        // Step 1: Patient Identity Verification
        const aarav =
          DataStore.getPatients().find((p) => p.id === "pat_aarav_0") ||
          DataStore.getPatients()[0];
        DataStore.setCurrentPatient(aarav);
        setPatientTab("home");
        showToast(
          "Step 1: Patient identity verified: Aarav Mehta (XXXX XXXX 2741).",
        );
        break;
      }

      case 2: {
        // Step 2: Check-In & Token Generation
        setPatientTab("checkin");
        const aaravToken = DataStore.getQueue().find(
          (t) => t.tokenNumber === "A-27",
        );
        if (aaravToken) {
          aaravToken.queuePosition = 7;
          aaravToken.estimatedWaitMin = 24;
          aaravToken.status = "waiting";
          aaravToken.sanctuary_state = "QUEUE_STABLE";
          DataStore.setActiveToken(aaravToken);
        }
        showToast(
          "Step 2: Checked in for Persistent Headache at Odyssey Care Clinic. Token A-27 generated.",
        );
        break;
      }

      case 3: {
        // Step 3: Sanctuary Pulse: Queue Stable
        setPatientTab("pulse");
        const queueList = DataStore.getQueue();
        const aaravToken = queueList.find((t) => t.tokenNumber === "A-27");
        if (aaravToken) {
          aaravToken.queuePosition = 7;
          aaravToken.estimatedWaitMin = 24;
          aaravToken.status = "waiting";
          aaravToken.sanctuary_state = "QUEUE_STABLE";
          DataStore.setActiveToken(aaravToken);
        }
        const sim = DataStore.getSimulationState();
        DataStore.setSimulationState({
          ...sim,
          currentServingNumber: 20,
          currentServingToken: "A-20",
        });
        showToast(
          'Step 3: Sanctuary Pulse: "Queue stable" • Position 7 • ETA ~24 min.',
        );
        break;
      }

      case 4: {
        // Step 4: Queue Moves (Serving progresses A-20 -> A-23)
        setPatientTab("pulse");
        const queueList = DataStore.getQueue();
        const aaravToken = queueList.find((t) => t.tokenNumber === "A-27");
        if (aaravToken) {
          aaravToken.queuePosition = 4;
          aaravToken.estimatedWaitMin = 16;
          aaravToken.status = "waiting";
          aaravToken.sanctuary_state = "QUEUE_MOVING";
          DataStore.setActiveToken(aaravToken);
        }
        const sim = DataStore.getSimulationState();
        DataStore.setSimulationState({
          ...sim,
          currentServingNumber: 23,
          currentServingToken: "A-23",
        });
        showToast(
          'Step 4: Queue advancing! Serving A-23. Sanctuary Pulse: "Clinic is moving".',
        );
        break;
      }

      case 5: {
        // Step 5: Approaching Turn (Position 2, ETA ~8m)
        setPatientTab("pulse");
        const queueList = DataStore.getQueue();
        const aaravToken = queueList.find((t) => t.tokenNumber === "A-27");
        if (aaravToken) {
          aaravToken.queuePosition = 2;
          aaravToken.estimatedWaitMin = 8;
          aaravToken.status = "waiting";
          aaravToken.sanctuary_state = "ALMOST_YOUR_TURN";
          DataStore.setActiveToken(aaravToken);
        }
        const sim = DataStore.getSimulationState();
        DataStore.setSimulationState({
          ...sim,
          currentServingNumber: 25,
          currentServingToken: "A-25",
        });
        showToast(
          'Step 5: Position reaches 2. Sanctuary Pulse: "Your turn is getting close".',
        );
        break;
      }

      case 6: {
        // Step 6: Diagnostic Journey & Snapshot
        setSnapshotTokenNumber("A-27");
        setClinicTab("dashboard");
        if (!isSplitView) setCurrentView("clinic");
        showToast(
          "Step 6: Pre-Consultation Snapshot automatically displayed for Token A-27 (DPS 63, Stagnation Flagged).",
        );
        break;
      }

      case 7: {
        // Step 7: Queue Policy Engine Rebalance
        DataStore.applyQueuePolicyRebalance("A-27");
        setSnapshotTokenNumber("A-27");
        showToast(
          "Step 7: Queue Policy Engine applied (10m → 15m window, downstream tokens buffered +5m).",
        );
        break;
      }

      case 8: {
        // Step 8: Doctor Consultation
        DataStore.startConsultation("tok_aarav_27");
        const queueList = DataStore.getQueue();
        const aaravToken = queueList.find((t) => t.tokenNumber === "A-27");
        if (aaravToken) {
          aaravToken.sanctuary_state = "IN_CONSULTATION";
          DataStore.setActiveToken(aaravToken);
        }
        setPatientTab("pulse");
        showToast(
          'Step 8: Doctor started consultation in Room 101. Patient sees "Your consultation is in progress".',
        );
        break;
      }

      case 9: {
        // Step 9: Specialist Referral
        DataStore.createDemoNeurologyReferral();
        setClinicTab("dashboard");
        showToast(
          "Step 9: Neurology specialist referral created (REF-NEURO-27, Priority: Recommended).",
        );
        break;
      }

      case 10: {
        // Step 10: Journey Update & DPS Elevation (63 -> 68)
        const res = DataStore.applyJourneyUpdateAndImproveDps();
        showToast(
          `Step 10: Diagnostic Journey updated! DPS recalculated ${res.oldDps} → ${res.newDps}. Trajectory: Journey showing improvement.`,
        );
        break;
      }

      case 11: {
        // Step 11: Patient Experience (Journey Tab)
        setPatientTab("history");
        if (!isSplitView) setCurrentView("patient");
        showToast(
          "Step 11: Aarav views updated Journey tab: previous encounters, active Neurology referral, and DPS 68/100.",
        );
        break;
      }

      case 12: {
        // Step 12: Admin Insights & System Metrics
        setClinicTab("diagnostic_insights");
        if (!isSplitView) setCurrentView("clinic");
        showToast(
          "Step 12: Clinic intelligence updated: Stagnating journeys 3 → 2 (-33%), referral pipeline active.",
        );
        break;
      }
    }

    setQueue(DataStore.getQueue());
    setDoctors(DataStore.getDoctors());
  };

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-[#1E293B] flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Global Navbar */}
      <Header
        currentView={currentView}
        onSelectView={(v) => {
          setIsSplitView(false);
          setCurrentView(v);
        }}
        onAdvanceQueue={handleAdvanceQueue}
        onRebalanceDPS={handleRebalanceDPS}
        onResetDemo={handleResetDemo}
      />
      {/* Global Navbar & Demo Scenario Bar - Hidden for clean workspace per user request */}
      {showDemoAndHeader && (
        <>
          <Header
            currentView={currentView}
            onSelectView={(v) => {
              setIsSplitView(false);
              setCurrentView(v);
            }}
            onAdvanceQueue={handleAdvanceQueue}
            onRebalanceDPS={handleRebalanceDPS}
            onResetDemo={handleResetDemo}
          />

          {/* 12-Step Scenario Orchestrator Interactive Bar */}
          <DemoScenarioBar
            currentStep={demoStep}
            onSelectStep={executeDemoStep}
            onReset={handleResetDemo}
            isSplitView={isSplitView}
            onToggleSplitView={() => setIsSplitView(!isSplitView)}
          />
          <DemoScenarioBar
            currentStep={demoStep}
            onSelectStep={executeDemoStep}
            onReset={handleResetDemo}
            isSplitView={isSplitView}
            onToggleSplitView={() => setIsSplitView(!isSplitView)}
          />
        </>
      )}

      {/* Main View Area */}
      <main className="flex-1 flex flex-col">
        {isSplitView ? (
          /* Dual-Pane Synchronous View: Patient App (Left) + Clinic Admin (Right) */
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-140px)] bg-stone-900 border-t border-stone-800">
            {/* Left Column: Patient Mobile Shell */}
            <div className="lg:col-span-5 xl:col-span-4 border-r border-stone-800 bg-stone-950 p-4 flex flex-col items-center justify-start overflow-y-auto">
              <div className="w-full max-w-sm mb-3 flex items-center justify-between text-xs font-bold text-stone-300">
                <span className="flex items-center space-x-1.5 text-emerald-400">
                  <Smartphone className="w-4 h-4" />
                  <span>Patient Mobile Experience</span>
                </span>
                <span className="text-[10px] text-stone-400 font-mono bg-stone-800 px-2 py-0.5 rounded">
                  Live Empathy Mirror
                </span>
              </div>

              <div className="w-full max-w-sm">
                <PatientShell
                  controlledTab={patientTab}
                  onTabChange={setPatientTab}
                  onBackToOverview={() => setCurrentView("landing")}
                />
              </div>
            </div>

            {/* Right Column: Clinic Console & Doctor Workspace */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col overflow-y-auto bg-[#FBFBFC]">
              <div className="bg-stone-800 text-stone-200 border-b border-stone-700 px-4 py-2 flex items-center justify-between text-xs font-bold">
                <span className="flex items-center space-x-1.5 text-amber-300">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>
                    Odyssey Care Clinic — Physician &amp; Operations Station
                  </span>
                </span>
                <span className="text-[10px] text-stone-400 font-mono">
                  Station Node 01 • Dr. A. Sharma (CMO)
                </span>
              </div>

              <div className="flex-1">
                <ClinicShell
                  queue={queue}
                  doctors={doctors}
                  onAdvanceQueue={handleAdvanceQueue}
                  onRebalanceDPS={handleRebalanceDPS}
                  controlledTab={clinicTab}
                  controlledSnapshotTokenNumber={snapshotTokenNumber}
                  onTabChange={setClinicTab}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Standard Full-Screen View Switcher */
          <div className="flex-1">
            {currentView === "landing" && (
              <LandingView
                onOpenPatientApp={() => setCurrentView("patient")}
                onOpenClinicApp={() => setCurrentView("clinic")}
                onTriggerDpsRebalance={() => {
                  handleRebalanceDPS();
                  setCurrentView("clinic");
                }}
              />
            )}

            {currentView === "patient" && (
              <PatientShell
                controlledTab={patientTab}
                onTabChange={setPatientTab}
                onBackToOverview={() => setCurrentView("landing")}
              />
            )}

            {currentView === "clinic" && (
              <ClinicShell
                queue={queue}
                doctors={doctors}
                onAdvanceQueue={handleAdvanceQueue}
                onRebalanceDPS={handleRebalanceDPS}
                controlledTab={clinicTab}
                controlledSnapshotTokenNumber={snapshotTokenNumber}
                onTabChange={setClinicTab}
              />
            )}
          </div>
        )}
      </main>

      {/* Global Interactive Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-stone-900/95 text-white px-4 py-3 rounded-2xl shadow-2xl border border-stone-700 flex items-center space-x-3 text-xs font-medium backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <span className="flex-1 leading-snug">{toastMessage}</span>
        </div>
      )}

      {/* Discreet Demo / Header Toggle */}
      <button
        onClick={() => setShowDemoAndHeader(!showDemoAndHeader)}
        className="fixed bottom-3 left-3 z-40 px-2.5 py-1 rounded-lg bg-stone-900/60 hover:bg-stone-900 text-stone-300 hover:text-white text-[10px] font-mono border border-stone-700/60 shadow-xs backdrop-blur-xs transition-colors"
        title="Toggle demo controls and top header"
      >
        {showDemoAndHeader ? "Hide Demo Header" : "Show Demo Header"}
      </button>
    </div>
  );
}
