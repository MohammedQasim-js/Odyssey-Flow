import React, { useState } from 'react';
import { 
  Play, Clock, Stethoscope, CheckCircle2, 
  AlertTriangle, UserCheck, Share2, Sparkles, 
  RefreshCw, Zap, ShieldAlert, ArrowRight
} from 'lucide-react';
import { DataStore } from '../../services/dataStore';
import { Token } from '../../types';

interface DemoControlCenterProps {
  queue: Token[];
  onStateChange: () => void;
  onShowToast?: (msg: string) => void;
}

export const DemoControlCenter: React.FC<DemoControlCenterProps> = ({
  queue,
  onStateChange,
  onShowToast,
}) => {
  const [isDelayActive, setIsDelayActive] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const aaravToken = queue.find(t => t.tokenNumber === 'A-27') || queue[0];
  const sim = DataStore.getSimulationState();

  const notify = (msg: string) => {
    setLastAction(msg);
    if (onShowToast) onShowToast(msg);
  };

  // 1. Advance Queue
  const handleAdvanceQueue = () => {
    const res = DataStore.advanceQueueSimulation();
    onStateChange();
    notify(`Advance Queue: Now serving ${res.currentServingToken}. ${res.patientsAhead} patients ahead of A-27.`);
  };

  // 2. Trigger Delay
  const handleTriggerDelay = () => {
    const delayed = DataStore.triggerDelaySimulation();
    setIsDelayActive(delayed);
    onStateChange();
    notify(delayed ? 'Trigger Delay: Clinic pace slowed (+12m wait, Sanctuary Pulse: Slight Delay).' : 'Trigger Delay: Normal pace restored.');
  };

  // 3. Doctor Reviewing
  const handleDoctorReviewing = () => {
    DataStore.doctorReviewingSimulation('A-27');
    onStateChange();
    notify('Doctor Reviewing: Clinician opening longitudinal records. Patient notified via Sanctuary Pulse.');
  };

  // 4. Call Patient
  const handleCallPatient = () => {
    DataStore.callPatientSimulation('A-27');
    onStateChange();
    notify('Call Patient: Token A-27 called to Room 101. Sanctuary Pulse chime triggered.');
  };

  // 5. Complete Consultation
  const handleCompleteConsultation = () => {
    const res = DataStore.completeConsultationSimulation('A-27');
    onStateChange();
    notify(`Complete Consultation: Token ${res?.tokenNumber || 'A-27'} consultation finished and logged.`);
  };

  // 6. Trigger Stagnation
  const handleTriggerStagnation = () => {
    const res = DataStore.triggerStagnationSimulation('A-27');
    onStateChange();
    notify(`Trigger Stagnation: Patient flagged with diagnostic stagnation (DPS: ${res.dps}/100).`);
  };

  // 7. Create Referral
  const handleCreateReferral = () => {
    const ref = DataStore.createDemoNeurologyReferral();
    onStateChange();
    notify(`Create Referral: ${ref.toSpecialty} specialist referral generated (${ref.referralToken}).`);
  };

  // 8. Improve DPS
  const handleImproveDps = () => {
    const res = DataStore.applyJourneyUpdateAndImproveDps();
    onStateChange();
    notify(`Improve DPS: Score elevated ${res.oldDps} → ${res.newDps}/100. Diagnostic stagnation resolved.`);
  };

  return (
    <div id="demo-control-center" className="bg-stone-900 text-white rounded-3xl p-5 border border-stone-800 shadow-xl relative overflow-hidden">
      {/* Glow accent */}
      <div className="absolute top-0 right-0 w-80 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-stone-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 font-bold">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-black text-sm tracking-tight text-white uppercase">
                Demo Control Center
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Clinic Admin &amp; Judge Controls
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Execute live state changes synchronized bidirectionally across Patient App &amp; Clinic Dashboard.
            </p>
          </div>
        </div>

        {/* Live status telemetry pills */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-stone-800 text-stone-300 border border-stone-700">
            Serving: <strong className="text-emerald-400">{sim.currentServingToken || 'A-20'}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-stone-800 text-stone-300 border border-stone-700">
            A-27 DPS: <strong className={aaravToken?.dpsScore < 65 ? 'text-amber-400' : 'text-emerald-400'}>{aaravToken?.dpsScore || 63}/100</strong>
          </span>
          <span className={`px-2.5 py-1 rounded-lg border ${aaravToken?.stagnationFlag ? 'bg-amber-950/60 text-amber-300 border-amber-800/80' : 'bg-stone-800 text-stone-400 border-stone-700'}`}>
            Stagnation: <strong>{aaravToken?.stagnationFlag ? 'FLAGGED' : 'CLEAR'}</strong>
          </span>
        </div>
      </div>

      {/* 8 Action Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 pt-4">
        
        {/* 1. Advance Queue */}
        <button
          id="btn-advance-queue"
          onClick={handleAdvanceQueue}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-stone-800/90 hover:bg-emerald-600 text-stone-200 hover:text-white transition-all text-center border border-stone-700/80 group"
          title="Advances queue counter and updates waiting positions"
        >
          <Play className="w-4 h-4 mb-1.5 text-emerald-400 group-hover:text-white" />
          <span className="text-xs font-bold leading-tight">Advance Queue</span>
          <span className="text-[10px] text-stone-400 group-hover:text-emerald-100 mt-0.5">+1 step</span>
        </button>

        {/* 2. Trigger Delay */}
        <button
          id="btn-trigger-delay"
          onClick={handleTriggerDelay}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all text-center border group ${
            isDelayActive || sim.isDelayed
              ? 'bg-amber-600 text-white border-amber-500'
              : 'bg-stone-800/90 hover:bg-amber-600 text-stone-200 hover:text-white border-stone-700/80'
          }`}
          title="Simulates unexpected clinical delay and notifies patient"
        >
          <Clock className="w-4 h-4 mb-1.5 text-amber-400 group-hover:text-white" />
          <span className="text-xs font-bold leading-tight">Trigger Delay</span>
          <span className="text-[10px] text-stone-400 group-hover:text-amber-100 mt-0.5">
            {isDelayActive || sim.isDelayed ? 'Active' : '+12m delay'}
          </span>
        </button>

        {/* 3. Doctor Reviewing */}
        <button
          id="btn-doctor-reviewing"
          onClick={handleDoctorReviewing}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-stone-800/90 hover:bg-sky-600 text-stone-200 hover:text-white transition-all text-center border border-stone-700/80 group"
          title="Notifies patient that clinician is reviewing longitudinal history"
        >
          <Stethoscope className="w-4 h-4 mb-1.5 text-sky-400 group-hover:text-white" />
          <span className="text-xs font-bold leading-tight">Doctor Reviewing</span>
          <span className="text-[10px] text-stone-400 group-hover:text-sky-100 mt-0.5">Pre-consult</span>
        </button>

        {/* 4. Call Patient */}
        <button
          id="btn-call-patient"
          onClick={handleCallPatient}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-stone-800/90 hover:bg-teal-600 text-stone-200 hover:text-white transition-all text-center border border-stone-700/80 group"
          title="Calls Token A-27 to Exam Room 101"
        >
          <UserCheck className="w-4 h-4 mb-1.5 text-teal-400 group-hover:text-white" />
          <span className="text-xs font-bold leading-tight">Call Patient</span>
          <span className="text-[10px] text-stone-400 group-hover:text-teal-100 mt-0.5">Token A-27</span>
        </button>

        {/* 5. Complete Consultation */}
        <button
          id="btn-complete-consultation"
          onClick={handleCompleteConsultation}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-stone-800/90 hover:bg-emerald-700 text-stone-200 hover:text-white transition-all text-center border border-stone-700/80 group"
          title="Completes consultation, logs visit summary, and frees room"
        >
          <CheckCircle2 className="w-4 h-4 mb-1.5 text-emerald-400 group-hover:text-white" />
          <span className="text-xs font-bold leading-tight">Complete Consult</span>
          <span className="text-[10px] text-stone-400 group-hover:text-emerald-100 mt-0.5">Finalize</span>
        </button>

        {/* 6. Trigger Stagnation */}
        <button
          id="btn-trigger-stagnation"
          onClick={handleTriggerStagnation}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-stone-800/90 hover:bg-amber-700 text-stone-200 hover:text-white transition-all text-center border border-stone-700/80 group"
          title="Flags patient journey with diagnostic stagnation (DPS: 63)"
        >
          <AlertTriangle className="w-4 h-4 mb-1.5 text-amber-400 group-hover:text-white" />
          <span className="text-xs font-bold leading-tight">Trigger Stagnation</span>
          <span className="text-[10px] text-stone-400 group-hover:text-amber-100 mt-0.5">DPS 63 Flag</span>
        </button>

        {/* 7. Create Referral */}
        <button
          id="btn-create-referral"
          onClick={handleCreateReferral}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-stone-800/90 hover:bg-purple-600 text-stone-200 hover:text-white transition-all text-center border border-stone-700/80 group"
          title="Generates multidisciplinary neurology referral"
        >
          <Share2 className="w-4 h-4 mb-1.5 text-purple-400 group-hover:text-white" />
          <span className="text-xs font-bold leading-tight">Create Referral</span>
          <span className="text-[10px] text-stone-400 group-hover:text-purple-100 mt-0.5">Neurology</span>
        </button>

        {/* 8. Improve DPS */}
        <button
          id="btn-improve-dps"
          onClick={handleImproveDps}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-stone-800/90 hover:bg-emerald-600 text-stone-200 hover:text-white transition-all text-center border border-stone-700/80 group"
          title="Recalculates DPS 63 → 68 and clears stagnation flag"
        >
          <Sparkles className="w-4 h-4 mb-1.5 text-emerald-400 group-hover:text-white" />
          <span className="text-xs font-bold leading-tight">Improve DPS</span>
          <span className="text-[10px] text-stone-400 group-hover:text-emerald-100 mt-0.5">63 → 68</span>
        </button>

      </div>

      {/* Last executed state feedback */}
      {lastAction && (
        <div className="mt-3 pt-2.5 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-stone-300 font-medium">Executed:</span>
            <span className="text-emerald-300 font-mono">{lastAction}</span>
          </div>
          <span className="text-[10px] text-stone-500">Live synchronized in cache &amp; state</span>
        </div>
      )}
    </div>
  );
};
