import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Info, Bell, CheckCircle2, Clock, 
  MapPin, Stethoscope, ChevronRight, Volume2, VolumeX, 
  Sparkles, Play, FileSearch, BellRing, Navigation, 
  Wind, ShieldCheck, User, Building2, AlertTriangle, 
  Coffee, Wifi, HeartPulse, RefreshCw, Layers
} from 'lucide-react';
import { Token, SanctuaryPulseCode, Doctor } from '../../types';
import { DataStore } from '../../services/dataStore';
import { 
  SanctuaryPulseEngine, 
  CANONICAL_PULSE_STATES 
} from '../../services/sanctuaryPulseEngine';

interface SanctuaryPulseViewProps {
  token?: Token;
  onBack?: () => void;
  onViewDoctorDetails?: (doctorId: string) => void;
  onNavigateToCheckIn?: () => void;
}

export const SanctuaryPulseView: React.FC<SanctuaryPulseViewProps> = ({
  token: propToken,
  onBack,
  onNavigateToCheckIn,
}) => {
  const [token, setToken] = useState<Token | undefined>(propToken || DataStore.getActiveToken());
  const [simState, setSimState] = useState(DataStore.getSimulationState());
  const [activeTabOverride, setActiveTabOverride] = useState<SanctuaryPulseCode | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [ctaConfirmedMessage, setCtaConfirmedMessage] = useState<string | null>(null);

  // Synchronize state with DataStore periodically and on window storage events
  const syncState = () => {
    const liveToken = DataStore.getActiveToken();
    if (liveToken) setToken({ ...liveToken });
    const liveSim = DataStore.getSimulationState();
    setSimState(liveSim);
    if (liveSim.forcedPulseState) {
      setActiveTabOverride(liveSim.forcedPulseState);
    }
  };

  useEffect(() => {
    syncState();
    const interval = setInterval(syncState, 1500);
    window.addEventListener('storage', syncState);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', syncState);
    };
  }, []);

  // If no token exists, fallback to default active demo token A-27 (Aarav Mehta)
  const effectiveToken: Token = token || {
    id: 'tok_aarav_default',
    tokenNumber: 'A-27',
    patientId: 'pat_aarav_0',
    patientName: 'Aarav Mehta',
    patientAge: 32,
    patientGender: 'Male',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Care Clinic',
    doctorId: 'doc_sharma_1',
    doctorName: 'Dr. A. Sharma',
    specialty: 'General Medicine',
    roomNumber: 'Room 101',
    status: 'waiting',
    priority: 'standard',
    queuePosition: 3,
    estimatedWaitMin: 12,
    checkInTime: '09:15 AM',
    dpsScore: 63,
    stagnationFlag: true,
    symptomsSummary: 'Persistent headache & chronic fatigue',
  };

  const doctor: Doctor | undefined = DataStore.getDoctors().find(
    d => d.id === effectiveToken.doctorId || d.name === effectiveToken.doctorName
  ) || {
    id: 'doc_sharma_1',
    clinicId: effectiveToken.clinicId,
    name: effectiveToken.doctorName || 'Dr. A. Sharma',
    specialty: effectiveToken.specialty || 'General Medicine',
    room: effectiveToken.roomNumber || 'Room 101',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    status: 'reviewing_history',
    experienceYears: 15,
    qualification: 'MBBS, MD (General Medicine)',
    patientsSeenToday: 18,
  };

  // Derive active patients ahead from live simulation state
  const patientsAhead = Math.max(
    0,
    simState.targetTokenNumber - simState.currentServingNumber
  );

  // Compute Human-Centric Sanctuary Pulse State
  const pulse = SanctuaryPulseEngine.computePulseState(
    effectiveToken,
    doctor,
    patientsAhead,
    activeTabOverride || undefined,
    simState.isDelayed,
    Boolean(Date.now() - (simState.lastQueueMoveTime || 0) < 5000)
  );

  // Audio chime triggers when turn arrives
  useEffect(() => {
    if (soundEnabled && (pulse.stateCode === 'YOUR_TURN' || pulse.stateCode === 'ALMOST_YOUR_TURN')) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(528, ctx.currentTime); // 528 Hz therapeutic Solfeggio frequency
          osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.3);
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.8);
        }
      } catch (e) {
        // AudioContext restricted before user interaction
      }
    }
  }, [pulse.stateCode, soundEnabled]);

  // Handle CTA clicks with feedback
  const handleCtaClick = (message: string) => {
    setCtaConfirmedMessage(message);
    setTimeout(() => setCtaConfirmedMessage(null), 3000);
  };

  // Simulation handlers
  const handleAdvanceSimulation = () => {
    DataStore.advanceQueueSimulation();
    syncState();
  };

  const handleTriggerDelay = () => {
    DataStore.triggerDelaySimulation();
    syncState();
  };

  const handleDoctorReviewing = () => {
    DataStore.doctorReviewHistory(effectiveToken.id, doctor?.id);
    syncState();
  };

  const handleApproachingTurn = () => {
    const updated = {
      ...simState,
      currentServingNumber: 25,
      currentServingToken: 'A-25',
      forcedPulseState: 'ALMOST_YOUR_TURN' as SanctuaryPulseCode,
    };
    DataStore.setSimulationState(updated);
    setActiveTabOverride('ALMOST_YOUR_TURN');
    syncState();
  };

  const handleCallPatient = () => {
    DataStore.callToken(effectiveToken.id, doctor?.name, effectiveToken.roomNumber || 'Room 101');
    setActiveTabOverride('YOUR_TURN');
    syncState();
  };

  const handleResetSimulation = () => {
    DataStore.setSimulationState({
      currentServingNumber: 20,
      currentServingToken: 'A-20',
      targetTokenNumber: 27,
      targetToken: 'A-27',
      isDelayed: false,
      autoAdvance: false,
      speedSec: 4,
      forcedPulseState: null,
      doctorReviewingToken: null,
      lastQueueMoveTime: Date.now(),
    });
    setActiveTabOverride(null);
    syncState();
  };

  // Canonical state icon generator
  const getStateBadgeStyle = (code: SanctuaryPulseCode) => {
    switch (code) {
      case 'CHECKIN_CONFIRMED':
        return 'bg-stone-100 text-stone-800 border-stone-200';
      case 'QUEUE_STABLE':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
      case 'QUEUE_MOVING':
        return 'bg-teal-50 text-teal-800 border-teal-200/80';
      case 'DOCTOR_REVIEWING':
        return 'bg-amber-50 text-amber-900 border-amber-200/80';
      case 'SLIGHT_DELAY':
      case 'DELAY':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'PLEASE_REPORT':
      case 'WAITING_FOR_PATIENT':
        return 'bg-sky-50 text-sky-900 border-sky-200/80';
      case 'ALMOST_YOUR_TURN':
        return 'bg-indigo-50 text-indigo-900 border-indigo-200/80';
      case 'YOUR_TURN':
        return 'bg-emerald-500 text-white border-emerald-600 shadow-sm';
      case 'IN_CONSULTATION':
        return 'bg-purple-50 text-purple-900 border-purple-200/80';
      case 'COMPLETED':
        return 'bg-stone-100 text-stone-800 border-stone-200';
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
    }
  };

  // State-specific reassurance copy
  const getStateSpecificNote = () => {
    if (pulse.stateCode === 'DOCTOR_REVIEWING') {
      return {
        title: 'Longitudinal Chart Review Active',
        body: 'Dr. Sharma is taking a moment to review your previous consultations, test reports, and symptom history before calling you in. This ensures your time in the room is focused entirely on clinical decisions.',
      };
    }
    if (pulse.stateCode === 'SLIGHT_DELAY' || pulse.stateCode === 'DELAY') {
      return {
        title: 'Thorough Diagnostic Care in Progress',
        body: 'The clinic is taking slightly longer than usual with a preceding patient who required complex diagnostic workup. Your appointment remains prioritized.',
      };
    }
    if (pulse.stateCode === 'YOUR_TURN') {
      return {
        title: 'Clinician Ready for You',
        body: `Please report to ${effectiveToken.roomNumber || 'Room 101'} or speak to the reception desk. Dr. Sharma has your chart pre-loaded on screen.`,
      };
    }
    return null;
  };

  const stateNote = getStateSpecificNote();

  // Dynamic CTAs based on current state
  const renderContextualCTA = () => {
    if (pulse.stateCode === 'YOUR_TURN') {
      return (
        <div className="space-y-2">
          <button
            onClick={() => handleCtaClick(`Reported arrival to ${effectiveToken.roomNumber || 'Room 101'}`)}
            className="w-full py-3.5 px-4 bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.99] text-white rounded-2xl font-bold text-sm shadow-sm flex items-center justify-center space-x-2 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>I Have Arrived at {effectiveToken.roomNumber || 'Room 101'}</span>
          </button>
          <button
            onClick={() => handleCtaClick('Reception alerted: Patient walking into lounge')}
            className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-2xl font-semibold text-xs transition-all text-center"
          >
            Notify Reception Desk
          </button>
        </div>
      );
    }

    if (pulse.stateCode === 'ALMOST_YOUR_TURN') {
      return (
        <div className="space-y-2">
          <button
            onClick={() => handleCtaClick('Waiting confirmed outside consultation door')}
            className="w-full py-3.5 px-4 bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.99] text-white rounded-2xl font-bold text-sm shadow-sm flex items-center justify-center space-x-2 transition-all"
          >
            <MapPin className="w-4 h-4" />
            <span>I Am Waiting Near {effectiveToken.roomNumber || 'Room 101'}</span>
          </button>
          <div className="flex items-center justify-between px-1 text-xs text-stone-500">
            <span>Room location: Ground Floor, Corridor A</span>
            <span className="font-semibold text-emerald-700">1–2 min away</span>
          </div>
        </div>
      );
    }

    if (pulse.stateCode === 'PLEASE_REPORT') {
      return (
        <div className="space-y-2">
          <button
            onClick={() => handleCtaClick('Directions opened: 100ft Road, Indiranagar')}
            className="w-full py-3.5 px-4 bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.99] text-white rounded-2xl font-bold text-sm shadow-sm flex items-center justify-center space-x-2 transition-all"
          >
            <Navigation className="w-4 h-4" />
            <span>Get Directions to Clinic</span>
          </button>
          <button
            onClick={() => handleCtaClick('Status updated: Heading towards clinic now')}
            className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-2xl font-semibold text-xs transition-all text-center"
          >
            I'm On My Way
          </button>
        </div>
      );
    }

    if (pulse.stateCode === 'SLIGHT_DELAY' || pulse.stateCode === 'DELAY') {
      return (
        <div className="space-y-2">
          <button
            onClick={() => setIsBreathingActive(!isBreathingActive)}
            className="w-full py-3.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl font-bold text-sm shadow-sm flex items-center justify-center space-x-2 transition-all"
          >
            <Wind className="w-4 h-4 text-emerald-400" />
            <span>{isBreathingActive ? 'Hide Breathing Exercise' : 'Try 4-4-4 Calm Breathing'}</span>
          </button>
          <div className="flex items-center justify-center space-x-4 pt-1 text-xs text-stone-500">
            <span className="flex items-center space-x-1">
              <Coffee className="w-3.5 h-3.5 text-stone-400" />
              <span>Complimentary herbal tea in lounge</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Wifi className="w-3.5 h-3.5 text-stone-400" />
              <span>Guest Wi-Fi available</span>
            </span>
          </div>
        </div>
      );
    }

    if (pulse.stateCode === 'COMPLETED') {
      return (
        <div className="space-y-2">
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
            <p className="text-xs font-semibold text-emerald-800">
              Consultation completed. Prescriptions & digital receipt are synced in your profile.
            </p>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="w-full py-3 px-4 bg-stone-900 text-white rounded-2xl font-bold text-xs hover:bg-stone-800 transition-all text-center"
            >
              Return to Home Dashboard
            </button>
          )}
        </div>
      );
    }

    // Default CTA for stable or moving queue
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-800">Paced Sanctuary Wait</p>
              <p className="text-[11px] text-stone-500">You will be notified when 2 patients remain</p>
            </div>
          </div>
          <button
            onClick={() => setIsBreathingActive(!isBreathingActive)}
            className="text-xs font-bold text-[#16A34A] hover:underline"
          >
            {isBreathingActive ? 'Close' : 'Relax'}
          </button>
        </div>
      </div>
    );
  };

  // Mini vertical live queue calculation
  const servingNum = simState.currentServingNumber;
  const tokenNum = simState.targetTokenNumber; // 27
  const queueSnippet = [
    { num: `A-${servingNum}`, label: 'Currently in consultation', isServing: true, isYou: servingNum === tokenNum },
    { num: `A-${servingNum + 1}`, label: 'Next in line', isServing: false, isYou: servingNum + 1 === tokenNum },
    { num: `A-${servingNum + 2}`, label: 'Waiting nearby', isServing: false, isYou: servingNum + 2 === tokenNum },
    ...(servingNum + 3 <= tokenNum
      ? [{ num: `A-${tokenNum}`, label: 'Your token', isServing: false, isYou: true }]
      : []),
  ].filter((item, idx, self) => self.findIndex(t => t.num === item.num) === idx);

  return (
    <div className="space-y-4 pb-28 font-sans text-stone-900">
      
      {/* 1. SCREEN HEADER */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <div className="flex items-center space-x-2">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 -ml-1 text-stone-600 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-xl font-extrabold text-stone-900 tracking-tight flex items-center space-x-1.5">
              <span>Sanctuary Pulse</span>
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse inline-block"></span>
            </h1>
            <p className="text-[11px] text-stone-500 font-medium">
              Continuous live queue pacing
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 text-stone-500 hover:text-stone-800 rounded-full hover:bg-stone-100 transition-colors"
            title={soundEnabled ? 'Chimes enabled' : 'Chimes muted'}
            aria-label={soundEnabled ? 'Mute chimes' : 'Enable chimes'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#16A34A]" />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-400" />
            )}
          </button>

          <button
            onClick={() => setShowInfoModal(true)}
            className="p-2 text-stone-500 hover:text-stone-800 rounded-full hover:bg-stone-100 transition-colors"
            aria-label="What is Sanctuary Pulse?"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Confirmation Toast if CTA clicked */}
      {ctaConfirmedMessage && (
        <div className="p-3 bg-[#16A34A] text-white rounded-2xl text-xs font-semibold flex items-center space-x-2 shadow-xs animate-in fade-in slide-in-from-top-1 duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{ctaConfirmedMessage}</span>
        </div>
      )}

      {/* 2. PRIMARY PULSE CARD (Large, dominant card occupying upper portion) */}
      <div 
        id="sanctuary-pulse-card"
        className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs relative overflow-hidden space-y-5"
      >
        {/* Soft background glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-52 h-52 rounded-full bg-emerald-50/60 blur-3xl pointer-events-none"></div>

        {/* Header inside card: Status Pill + Token badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]"></span>
            </span>
            <span className={`text-[11px] font-extrabold px-3 py-0.5 rounded-full border ${getStateBadgeStyle(pulse.stateCode)}`}>
              {pulse.statusBadge}
            </span>
          </div>

          <div className="px-3 py-1 bg-stone-100 rounded-xl border border-stone-200/80">
            <span className="text-[10px] font-semibold text-stone-500 mr-1.5 uppercase">Token</span>
            <span className="text-xs font-extrabold font-mono text-stone-900">
              {effectiveToken.tokenNumber}
            </span>
          </div>
        </div>

        {/* Main Status Typography */}
        <div className="space-y-1.5">
          <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight leading-snug">
            {pulse.title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
            {pulse.message}
          </p>
        </div>

        {/* Live Metrics Row (Patients ahead + Estimated wait) */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
              Position in Queue
            </span>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-2xl font-extrabold text-stone-900 font-mono">
                {pulse.patientsAhead <= 0 ? 'Next' : pulse.patientsAhead}
              </span>
              <span className="text-xs text-stone-500 font-medium">
                {pulse.patientsAhead <= 0 ? 'in consultation' : pulse.patientsAhead === 1 ? 'patient ahead' : 'patients ahead'}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
              Estimated Wait
            </span>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-2xl font-extrabold text-emerald-800 font-mono">
                {pulse.secondaryEta}
              </span>
            </div>
          </div>
        </div>

        {/* Soft progress indicator */}
        <div className="space-y-1.5 pt-0.5">
          <div className="flex items-center justify-between text-[10px] font-bold text-stone-400 uppercase tracking-wider">
            <span>Journey Progress</span>
            <span className="font-mono text-stone-700">{pulse.progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden">
            <div 
              className="h-full rounded-full bg-[#16A34A] transition-all duration-700 ease-out"
              style={{ width: `${pulse.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Contextual Reassurance Callout for special states */}
        {stateNote && (
          <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/80 space-y-1 text-xs text-amber-950">
            <div className="flex items-center space-x-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{stateNote.title}</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-900/90">
              {stateNote.body}
            </p>
          </div>
        )}

        {/* Primary Contextual CTA */}
        <div className="pt-1">
          {renderContextualCTA()}
        </div>
      </div>

      {/* 3. CLINIC STATUS CARD (What the clinic / doctor is doing right now) */}
      <div 
        id="sanctuary-clinic-status"
        className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3.5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-stone-500" />
            <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">
              Clinic & Clinician Status
            </h3>
          </div>
          <span className="text-[10px] font-bold text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
            {effectiveToken.roomNumber || 'Room 101'}
          </span>
        </div>

        <div className="flex items-center space-x-3.5 pt-0.5">
          <img
            src={doctor?.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300'}
            alt={effectiveToken.doctorName}
            className="w-12 h-12 rounded-2xl object-cover border border-stone-200 shadow-2xs shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-extrabold text-stone-900 truncate">
              {effectiveToken.doctorName || 'Dr. A. Sharma'}
            </h4>
            <p className="text-xs text-stone-500 truncate">
              {doctor?.qualification || 'MBBS, MD (General Medicine)'}
            </p>
            <p className="text-xs font-semibold text-[#16A34A] truncate mt-0.5">
              {effectiveToken.specialty || 'General Medicine'}
            </p>
          </div>
        </div>

        <div className="pt-2.5 border-t border-stone-100 flex items-start space-x-2 text-xs">
          <Stethoscope className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="text-stone-500 font-medium">Current activity: </span>
            <span className="text-stone-800 font-semibold">{pulse.doctorCurrentActivity}</span>
          </div>
        </div>
      </div>

      {/* 4. VERTICAL PROGRESS TIMELINE */}
      <div 
        id="sanctuary-timeline-card"
        className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">
            Sanctuary Timeline
          </h3>
          <span className="text-[10px] text-stone-400 font-medium">
            5-Stage Progressive Pacing
          </span>
        </div>

        <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
          {pulse.timeline.map((step, idx) => {
            const isDone = step.status === 'completed' || step.state === 'completed';
            const isCurrent = step.status === 'active' || step.state === 'current';

            return (
              <div key={idx} className="relative pl-8 flex items-start space-x-3">
                <div className={`absolute left-3.5 top-1 -translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                  isDone 
                    ? 'bg-[#16A34A] text-white' 
                    : isCurrent 
                    ? 'bg-white border-2 border-[#16A34A] ring-4 ring-emerald-50' 
                    : 'bg-white border-2 border-stone-300'
                }`}>
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {isCurrent && <span className="w-1.5 h-1.5 bg-[#16A34A] rounded-full"></span>}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs block font-bold ${
                      isDone ? 'text-stone-900' : isCurrent ? 'text-emerald-900' : 'text-stone-400'
                    }`}>
                      {step.title}
                    </span>
                    {step.time && (
                      <span className="text-[10px] font-mono text-stone-400">
                        {step.time}
                      </span>
                    )}
                  </div>
                  <p className={`text-[11px] block mt-0.5 leading-relaxed ${
                    isCurrent ? 'text-emerald-800 font-medium' : 'text-stone-500'
                  }`}>
                    {step.subtitle || step.subtext}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. MINI LIVE QUEUE VISUALIZATION */}
      <div 
        id="sanctuary-live-queue"
        className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3.5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-stone-500" />
            <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">
              Live Queue Sequence
            </h3>
          </div>
          <span className="text-[10px] font-mono text-stone-500">
            Now Serving: <strong className="text-stone-900">{simState.currentServingToken}</strong>
          </span>
        </div>

        <div className="space-y-2">
          {queueSnippet.map((item, idx) => (
            <div 
              key={idx}
              className={`p-3 rounded-2xl flex items-center justify-between border transition-all ${
                item.isYou 
                  ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-300' 
                  : item.isServing
                  ? 'bg-stone-50 border-stone-200'
                  : 'bg-white border-stone-200/70'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={`w-8 h-8 rounded-xl font-mono text-xs font-bold flex items-center justify-center ${
                  item.isYou
                    ? 'bg-[#16A34A] text-white shadow-2xs'
                    : item.isServing
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-700'
                }`}>
                  {item.num}
                </span>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold text-stone-900">
                      {item.isYou ? 'Your Token' : `Patient ${item.num}`}
                    </span>
                    {item.isYou && (
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-emerald-200 text-emerald-900">
                        You
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-stone-500 block">
                    {item.label}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  item.isServing
                    ? 'bg-amber-100 text-amber-900'
                    : item.isYou
                    ? 'bg-emerald-100 text-emerald-900'
                    : 'text-stone-400'
                }`}>
                  {item.isServing ? 'In Room' : item.isYou ? 'In Queue' : 'Ahead'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. MINDFULNESS / BREATHING EXERCISE (Anxiety reduction) */}
      {isBreathingActive && (
        <div 
          id="sanctuary-breathing-card"
          className="bg-emerald-50 rounded-3xl p-5 border border-emerald-200 text-center space-y-3 animate-in fade-in duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-900">
              <Wind className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-extrabold uppercase tracking-wider">
                Sanctuary Mindfulness: 4-4-4 Box Breath
              </span>
            </div>
            <button
              onClick={() => setIsBreathingActive(false)}
              className="text-xs font-bold text-emerald-800 hover:underline"
            >
              Close
            </button>
          </div>

          <p className="text-xs text-emerald-900/80 max-w-sm mx-auto leading-relaxed">
            Slow diaphragmatic breathing reduces heart rate and cortisol while you await your consultation.
          </p>

          <div className="py-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-200/90 text-emerald-950 font-extrabold text-xs flex items-center justify-center animate-pulse shadow-xs">
              Breathe
            </div>
          </div>

          <p className="text-xs font-bold text-emerald-900">
            4s Inhale • 4s Hold • 4s Exhale
          </p>
        </div>
      )}

      {/* 7. ADMIN / JUDGE SIMULATION CONTROLS (Preserved & Styled Consistently) */}
      <div 
        id="sanctuary-simulation-engine"
        className="bg-stone-900 text-white rounded-3xl p-5 shadow-sm border border-stone-800 space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
              Simulate Queue Engine
            </span>
          </div>
          <span className="text-[10px] font-mono bg-stone-800 text-stone-300 px-2 py-0.5 rounded border border-stone-700">
            Admin / Judge Control
          </span>
        </div>

        <p className="text-xs text-stone-300 leading-relaxed">
          Simulate real-time clinic queue progression. Updates <strong>Admin UI</strong>, <strong>Patient UI</strong>, <strong>localStorage</strong>, and <strong>Supabase</strong> live.
        </p>

        {/* Current serving & active state indicator */}
        <div className="p-3 bg-stone-800/90 rounded-2xl text-xs space-y-1 border border-stone-700/80 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-stone-400 font-sans">Current Serving:</span>
            <span className="font-bold text-emerald-400">
              {simState.currentServingToken} (Ahead: {patientsAhead})
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-stone-400 font-sans">Active Pulse Code:</span>
            <span className="font-bold text-sky-400">
              {pulse.stateCode}
            </span>
          </div>
        </div>

        {/* 5 Simulator Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {/* Action 1: Advance Queue */}
          <button
            onClick={handleAdvanceSimulation}
            className="p-2.5 rounded-xl bg-[#16A34A] hover:bg-emerald-600 text-white font-bold text-xs flex flex-col items-center justify-center space-y-1 transition-all shadow-xs"
            title="Advance live queue by 1 token"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Advance Queue</span>
          </button>

          {/* Action 2: Trigger Delay */}
          <button
            onClick={handleTriggerDelay}
            className={`p-2.5 rounded-xl font-bold text-xs flex flex-col items-center justify-center space-y-1 transition-all border ${
              simState.isDelayed 
                ? 'bg-amber-600 border-amber-500 text-white' 
                : 'bg-stone-800 border-stone-700 hover:bg-stone-700 text-stone-200'
            }`}
            title="Trigger or resolve clinical delay"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{simState.isDelayed ? 'Delay Active' : 'Trigger Delay'}</span>
          </button>

          {/* Action 3: Doctor Reviewing */}
          <button
            onClick={handleDoctorReviewing}
            className={`p-2.5 rounded-xl font-bold text-xs flex flex-col items-center justify-center space-y-1 transition-all border ${
              pulse.stateCode === 'DOCTOR_REVIEWING'
                ? 'bg-sky-600 border-sky-500 text-white'
                : 'bg-stone-800 border-stone-700 hover:bg-stone-700 text-stone-200'
            }`}
            title="Doctor opens patient longitudinal history"
          >
            <FileSearch className="w-3.5 h-3.5" />
            <span>Doctor Reviewing</span>
          </button>

          {/* Action 4: Approaching Turn */}
          <button
            onClick={handleApproachingTurn}
            className={`p-2.5 rounded-xl font-bold text-xs flex flex-col items-center justify-center space-y-1 transition-all border ${
              pulse.stateCode === 'ALMOST_YOUR_TURN'
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-stone-800 border-stone-700 hover:bg-stone-700 text-stone-200'
            }`}
            title="Move patient to Position #2 (almost your turn)"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Almost Turn</span>
          </button>

          {/* Action 5: Call Patient */}
          <button
            onClick={handleCallPatient}
            className={`p-2.5 rounded-xl font-bold text-xs flex flex-col items-center justify-center space-y-1 transition-all col-span-2 sm:col-span-1 border ${
              pulse.stateCode === 'YOUR_TURN'
                ? 'bg-emerald-500 border-emerald-400 text-white'
                : 'bg-stone-800 border-stone-700 hover:bg-stone-700 text-stone-200'
            }`}
            title="Call patient to reception or room"
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>Call Patient</span>
          </button>
        </div>

        {/* 10-State Quick Selector Matrix */}
        <div className="space-y-2 pt-2 border-t border-stone-800">
          <div className="flex items-center justify-between text-[10px] text-stone-400">
            <span className="font-bold uppercase tracking-wider">Direct 10-State Quick Selector:</span>
            <button
              onClick={handleResetSimulation}
              className="text-stone-400 hover:text-emerald-400 underline flex items-center space-x-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset to Default</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            {[
              { code: 'CHECKIN_CONFIRMED' as SanctuaryPulseCode, label: '1. Check-in Confirmed' },
              { code: 'QUEUE_STABLE' as SanctuaryPulseCode, label: '2. Queue Stable' },
              { code: 'QUEUE_MOVING' as SanctuaryPulseCode, label: '3. Queue Moving' },
              { code: 'DOCTOR_REVIEWING' as SanctuaryPulseCode, label: '4. Doctor Reviewing' },
              { code: 'SLIGHT_DELAY' as SanctuaryPulseCode, label: '5. Slight Delay' },
              { code: 'PLEASE_REPORT' as SanctuaryPulseCode, label: '6. Please Report' },
              { code: 'ALMOST_YOUR_TURN' as SanctuaryPulseCode, label: '7. Almost Your Turn' },
              { code: 'YOUR_TURN' as SanctuaryPulseCode, label: '8. You’re Next' },
              { code: 'IN_CONSULTATION' as SanctuaryPulseCode, label: '9. In Consultation' },
              { code: 'COMPLETED' as SanctuaryPulseCode, label: '10. Visit Completed' },
            ].map((st) => (
              <button
                key={st.code}
                onClick={() => {
                  setActiveTabOverride(st.code);
                  const sim = DataStore.getSimulationState();
                  DataStore.setSimulationState({
                    ...sim,
                    forcedPulseState: st.code,
                  });
                  syncState();
                }}
                className={`p-1.5 rounded-lg text-left transition-all truncate border ${
                  pulse.stateCode === st.code
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-stone-800/80 border-stone-700/60 text-stone-400 hover:text-stone-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Information Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[#16A34A]" />
                <h3 className="font-extrabold text-stone-900 text-base">About Sanctuary Pulse</h3>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-stone-600 space-y-2.5 leading-relaxed">
              <p>
                <strong>Sanctuary Pulse</strong> is Odyssey Flow's status communication system. It replaces ambiguous token counters with real-time reassurance.
              </p>
              <ul className="list-disc pl-4 space-y-1 text-stone-600">
                <li>Know where you are in the queue at any moment</li>
                <li>Understand exactly what the clinician is doing</li>
                <li>Receive gentle, predictable notifications when it's time to act</li>
                <li>Eliminate crowded waiting room anxiety</li>
              </ul>
              <p className="text-[11px] text-stone-500 pt-1">
                Odyssey Flow • Enigma 5.0 HealthTech Track
              </p>
            </div>

            <button
              onClick={() => setShowInfoModal(false)}
              className="w-full py-2.5 bg-stone-900 text-white rounded-2xl text-xs font-bold hover:bg-stone-800 transition-all"
            >
              Got it
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
