import { Token, Doctor, SanctuaryPulseState, SanctuaryPulseCode, SanctuaryPulseTimelineItem } from '../types';

/**
 * ODYSSEY FLOW: Sanctuary Pulse Engine
 * 
 * DESIGN PRINCIPLE:
 * Human-centric, empathetic patient waiting layer that converts raw operational
 * queue events into understandable human updates.
 * 
 * The patient should feel:
 * "Informed, guided, and cared for."
 * rather than:
 * "I am sitting here waiting with no idea what is happening."
 * 
 * 10 Canonical Pulse States:
 * 1. CHECKIN_CONFIRMED  - "You're checked in" ("Your visit is safely in the queue.")
 * 2. QUEUE_STABLE       - "Queue stable" ("Everything is moving normally.")
 * 3. QUEUE_MOVING       - "Clinic is moving" ("Patients ahead of you are being seen steadily.")
 * 4. DOCTOR_REVIEWING   - "Doctor reviewing history" ("Your doctor is taking a moment to review relevant information.")
 * 5. SLIGHT_DELAY       - "Slight delay" ("The clinic is taking a little longer than usual. We'll keep you updated.")
 * 6. ALMOST_YOUR_TURN   - "Your turn is getting close" ("Please remain nearby.")
 * 7. PLEASE_REPORT      - "Please start making your way to the clinic" ("Your token is approaching.")
 * 8. YOUR_TURN          - "You're next" ("Please report to reception.")
 * 9. IN_CONSULTATION    - "Your consultation is in progress" ("Your care team is with you.")
 * 10. COMPLETED         - "Visit completed" ("Your visit has been recorded.")
 */

export interface PulseStateDefinition {
  code: SanctuaryPulseCode;
  title: string;
  message: string;
  statusBadge: string;
  badgeColor: 'emerald' | 'teal' | 'sky' | 'amber' | 'emerald_bright' | 'rose' | 'indigo' | 'purple';
  stage: 'waiting' | 'prep' | 'approaching' | 'imminent' | 'now' | 'consulting' | 'done';
  progressPercent: number;
  emotionalPacing: string;
  doctorActivity: (docName?: string, room?: string) => string;
}

export const CANONICAL_PULSE_STATES: Record<SanctuaryPulseCode, PulseStateDefinition> = {
  CHECKIN_CONFIRMED: {
    code: 'CHECKIN_CONFIRMED',
    title: "You're checked in",
    message: "Your visit is safely in the queue.",
    statusBadge: "Checked In",
    badgeColor: "teal",
    stage: "waiting",
    progressPercent: 12,
    emotionalPacing: "Your details and diagnostic records are safely verified. Take a relaxed breath.",
    doctorActivity: () => "Queue registered in clinic workflow",
  },
  QUEUE_STABLE: {
    code: 'QUEUE_STABLE',
    title: "Queue stable",
    message: "Everything is moving normally.",
    statusBadge: "Queue Stable",
    badgeColor: "emerald",
    stage: "waiting",
    progressPercent: 25,
    emotionalPacing: "Consultations are progressing according to schedule with comfortable pacing.",
    doctorActivity: () => "Outpatient consultations moving steadily",
  },
  QUEUE_MOVING: {
    code: 'QUEUE_MOVING',
    title: "Clinic is moving",
    message: "A few patients ahead of you.",
    statusBadge: "Clinic Moving",
    badgeColor: "emerald",
    stage: "waiting",
    progressPercent: 40,
    emotionalPacing: "Rooms are turning over consistently. You will receive updates as your turn nears.",
    doctorActivity: () => "Active clinical consultation in progress",
  },
  DOCTOR_REVIEWING: {
    code: 'DOCTOR_REVIEWING',
    title: "Doctor reviewing history",
    message: "Your doctor is taking a moment to review relevant information.",
    statusBadge: "Reviewing History",
    badgeColor: "sky",
    stage: "prep",
    progressPercent: 55,
    emotionalPacing: "Your clinician is examining your longitudinal symptoms and past records before you enter.",
    doctorActivity: (docName) => `${docName || 'Doctor'} reviewing past diagnostic chart`,
  },
  SLIGHT_DELAY: {
    code: 'SLIGHT_DELAY',
    title: "Slight delay",
    message: "The clinic is taking a little longer than usual. We'll keep you updated.",
    statusBadge: "Slight Delay",
    badgeColor: "amber",
    stage: "waiting",
    progressPercent: 35,
    emotionalPacing: "Care teams take the necessary time for each patient's diagnostic complexity. We are monitoring closely.",
    doctorActivity: () => "Care team attending to extended clinical complexity",
  },
  DELAY: {
    code: 'SLIGHT_DELAY',
    title: "Slight delay",
    message: "The clinic is taking a little longer than usual. We'll keep you updated.",
    statusBadge: "Slight Delay",
    badgeColor: "amber",
    stage: "waiting",
    progressPercent: 35,
    emotionalPacing: "Care teams take the necessary time for each patient. Please make yourself comfortable.",
    doctorActivity: () => "Addressing clinical inquiry in consultation bay",
  },
  PLEASE_REPORT: {
    code: 'PLEASE_REPORT',
    title: "Please start making your way to the clinic",
    message: "Your token is approaching.",
    statusBadge: "Approaching Turn",
    badgeColor: "indigo",
    stage: "approaching",
    progressPercent: 68,
    emotionalPacing: "Start heading toward the clinic lounge if you were in the cafe, pharmacy, or garden.",
    doctorActivity: () => "Pre-consultation intake turnover in progress",
  },
  WAITING_FOR_PATIENT: {
    code: 'PLEASE_REPORT',
    title: "Please start making your way to the clinic",
    message: "Your token is approaching.",
    statusBadge: "Approaching Turn",
    badgeColor: "indigo",
    stage: "approaching",
    progressPercent: 68,
    emotionalPacing: "Your token is nearing the front of the line. Please head toward the clinic entrance.",
    doctorActivity: () => "Pre-consultation intake station turnover",
  },
  ALMOST_YOUR_TURN: {
    code: 'ALMOST_YOUR_TURN',
    title: "Your turn is getting close",
    message: "Please remain nearby.",
    statusBadge: "Almost Your Turn",
    badgeColor: "sky",
    stage: "imminent",
    progressPercent: 82,
    emotionalPacing: "Just 1 to 2 patients ahead. Please wait right outside your designated consultation room.",
    doctorActivity: (docName, room) => `Wrapping up preceding case in Room ${room || '101'}`,
  },
  YOUR_TURN: {
    code: 'YOUR_TURN',
    title: "You're next",
    message: "Please report to reception.",
    statusBadge: "You're Next",
    badgeColor: "emerald_bright",
    stage: "now",
    progressPercent: 92,
    emotionalPacing: "Your clinician is ready to receive you. You have their complete, undivided attention.",
    doctorActivity: (docName, room) => `Ready to receive you in Room ${room || '101'}`,
  },
  IN_CONSULTATION: {
    code: 'IN_CONSULTATION',
    title: "Your consultation is in progress",
    message: "Your care team is with you.",
    statusBadge: "In Consultation",
    badgeColor: "purple",
    stage: "consulting",
    progressPercent: 96,
    emotionalPacing: "Your consultation is actively underway. Your diagnostic trajectory is being documented.",
    doctorActivity: (docName, room) => `Active consultation in Room ${room || '101'}`,
  },
  COMPLETED: {
    code: 'COMPLETED',
    title: "Visit completed",
    message: "Your visit has been recorded.",
    statusBadge: "Visit Completed",
    badgeColor: "emerald",
    stage: "done",
    progressPercent: 100,
    emotionalPacing: "Your visit and longitudinal trajectory updates have been securely logged. Thank you.",
    doctorActivity: () => "Encounter finalized & prescriptions issued",
  },
};

export class SanctuaryPulseEngine {
  /**
   * Evaluates current queue conditions and derives the active human-centric pulse state
   */
  static computePulseState(
    token: Token,
    doctor?: Doctor,
    patientsAhead: number = 0,
    forcedState?: SanctuaryPulseCode,
    isDelayed: boolean = false,
    queueRecentMoved: boolean = false
  ): SanctuaryPulseState {
    const docName = doctor?.name || token.doctorName || 'Dr. Sharma';
    const room = doctor?.room || token.roomNumber || 'Room 101';
    const tokenNum = token.tokenNumber || 'A-27';

    // 1. Determine which canonical code applies
    let resolvedCode: SanctuaryPulseCode = 'QUEUE_STABLE';

    if (forcedState) {
      // Map legacy aliases cleanly
      if (forcedState === 'DELAY') resolvedCode = 'SLIGHT_DELAY';
      else if (forcedState === 'WAITING_FOR_PATIENT') resolvedCode = 'PLEASE_REPORT';
      else resolvedCode = forcedState;
    } else if (token.status === 'completed') {
      resolvedCode = 'COMPLETED';
    } else if (token.status === 'in_consultation' || token.status === 'in_treatment') {
      resolvedCode = 'IN_CONSULTATION';
    } else if (token.status === 'called' || patientsAhead <= 0) {
      resolvedCode = 'YOUR_TURN';
    } else if (isDelayed) {
      resolvedCode = 'SLIGHT_DELAY';
    } else if (doctor?.status === 'reviewing_history' || token.sanctuary_state === 'DOCTOR_REVIEWING') {
      resolvedCode = 'DOCTOR_REVIEWING';
    } else if (patientsAhead <= 2) {
      resolvedCode = 'ALMOST_YOUR_TURN';
    } else if (patientsAhead <= 4) {
      resolvedCode = 'PLEASE_REPORT';
    } else if (queueRecentMoved) {
      resolvedCode = 'QUEUE_MOVING';
    } else if (token.status === 'created' || (token.queuePosition && token.queuePosition >= 8 && patientsAhead >= 7)) {
      resolvedCode = 'CHECKIN_CONFIRMED';
    } else {
      resolvedCode = 'QUEUE_STABLE';
    }

    const def = CANONICAL_PULSE_STATES[resolvedCode] || CANONICAL_PULSE_STATES.QUEUE_STABLE;

    // Calculate secondary ETA & queue position label
    let secondaryEta = '~15 mins';
    let queuePositionLabel = `Position #${patientsAhead} in queue`;

    if (resolvedCode === 'COMPLETED') {
      secondaryEta = 'Visit Concluded';
      queuePositionLabel = 'Completed';
    } else if (resolvedCode === 'IN_CONSULTATION') {
      secondaryEta = 'In Progress';
      queuePositionLabel = `In Room ${room}`;
    } else if (resolvedCode === 'YOUR_TURN') {
      secondaryEta = 'Calling Now';
      queuePositionLabel = 'You are next';
    } else if (resolvedCode === 'ALMOST_YOUR_TURN') {
      secondaryEta = patientsAhead === 1 ? '~4 mins' : '~8 mins';
      queuePositionLabel = patientsAhead === 1 ? '1 patient ahead' : '2 patients ahead';
    } else if (resolvedCode === 'PLEASE_REPORT') {
      secondaryEta = `~${Math.max(10, patientsAhead * 4)} mins`;
      queuePositionLabel = `${patientsAhead} patients ahead`;
    } else if (resolvedCode === 'SLIGHT_DELAY') {
      const wait = Math.max(15, (patientsAhead || 4) * 5 + 10);
      secondaryEta = `~${wait} mins (adjusted)`;
      queuePositionLabel = `${patientsAhead || 4} patients ahead`;
    } else if (resolvedCode === 'CHECKIN_CONFIRMED') {
      secondaryEta = `~${Math.max(15, patientsAhead * 4)} mins`;
      queuePositionLabel = 'Safely in Queue';
    } else {
      secondaryEta = `~${Math.max(8, patientsAhead * 4)} mins`;
      queuePositionLabel = `${patientsAhead} patients ahead`;
    }

    // Build Arrival Alert if applicable
    let arrivalAlert: SanctuaryPulseState['arrivalAlert'] = undefined;

    if (resolvedCode === 'YOUR_TURN') {
      arrivalAlert = {
        type: 'enter_room',
        title: "You're next",
        message: `Please report to reception or enter ${room}. ${docName} is ready for you.`,
        urgency: 'urgent',
        cta: `Enter ${room}`,
        actionLabel: `Report to ${room}`,
      };
    } else if (resolvedCode === 'ALMOST_YOUR_TURN') {
      arrivalAlert = {
        type: 'report_reception',
        title: "Your turn is getting close",
        message: `Only ${patientsAhead === 1 ? '1 patient' : '2 patients'} ahead of you. Please remain nearby outside ${room}.`,
        urgency: 'urgent',
        cta: 'Wait Near Room',
        actionLabel: 'I am nearby',
      };
    } else if (resolvedCode === 'PLEASE_REPORT') {
      arrivalAlert = {
        type: 'heading',
        title: "Please start making your way to the clinic",
        message: "Your token is approaching. Please head toward the clinic waiting lounge.",
        urgency: 'warning',
        cta: 'Start heading to clinic',
        actionLabel: 'On my way',
      };
    } else if (resolvedCode === 'SLIGHT_DELAY') {
      arrivalAlert = {
        type: 'delay',
        title: "Slight delay reported",
        message: "The clinic is taking a little longer than usual. We will keep you updated.",
        urgency: 'info',
        cta: 'Explore Lounge Amenities',
        actionLabel: 'View amenities',
      };
    }

    // Build responsive event timeline
    const timeline = this.buildTimeline(resolvedCode, tokenNum, docName, room, patientsAhead);

    return {
      stateCode: resolvedCode,
      title: def.title,
      headline: def.title,
      message: def.message,
      subtext: def.message,
      statusBadge: def.statusBadge,
      pulseStatus: this.mapPulseStatus(resolvedCode),
      emotionalPacing: def.emotionalPacing,
      stage: def.stage,
      badgeColor: def.badgeColor,
      estimatedMinutesRemaining: resolvedCode === 'COMPLETED' ? 0 : Math.max(0, patientsAhead * 4),
      patientsAhead,
      queuePositionLabel,
      secondaryEta,
      progressPercent: def.progressPercent,
      doctorCurrentActivity: def.doctorActivity(docName, room),
      arrivalAlert,
      timeline,
    };
  }

  /**
   * Maps internal code to pulseStatus string
   */
  private static mapPulseStatus(code: SanctuaryPulseCode): SanctuaryPulseState['pulseStatus'] {
    switch (code) {
      case 'CHECKIN_CONFIRMED': return 'checkin_confirmed';
      case 'QUEUE_STABLE': return 'queue_stable';
      case 'QUEUE_MOVING': return 'queue_moving';
      case 'DOCTOR_REVIEWING': return 'doctor_reviewing_history';
      case 'SLIGHT_DELAY':
      case 'DELAY': return 'slight_delay';
      case 'ALMOST_YOUR_TURN': return 'almost_your_turn';
      case 'PLEASE_REPORT':
      case 'WAITING_FOR_PATIENT': return 'please_report';
      case 'YOUR_TURN': return 'your_turn';
      case 'IN_CONSULTATION': return 'in_consultation';
      case 'COMPLETED': return 'visit_completed';
      default: return 'queue_stable';
    }
  }

  /**
   * Builds the empathetic journey timeline according to current state
   */
  static buildTimeline(
    code: SanctuaryPulseCode,
    tokenNum: string,
    docName: string,
    room: string,
    patientsAhead: number
  ): SanctuaryPulseTimelineItem[] {
    const isCompleted = code === 'COMPLETED';
    const isConsulting = code === 'IN_CONSULTATION' || isCompleted;
    const isTurn = code === 'YOUR_TURN' || isConsulting;
    const isImminent = code === 'ALMOST_YOUR_TURN' || isTurn;
    const isApproaching = code === 'PLEASE_REPORT' || isImminent;
    const isReviewing = code === 'DOCTOR_REVIEWING' || isApproaching;
    const isMoving = code === 'QUEUE_MOVING' || isReviewing;

    return [
      {
        id: 't_checkin',
        title: "You're checked in",
        subtitle: `Token ${tokenNum} active`,
        label: "Checked in",
        subtext: "Digital token verified and synced",
        status: 'completed',
        state: 'completed',
        time: '09:15 AM',
      },
      {
        id: 't_queue',
        title: "Queue paced smoothly",
        subtitle: isMoving ? "Steady flow maintained" : "Everything moving normally",
        label: "Queue operating",
        subtext: "Smart scheduling active",
        status: isMoving ? 'completed' : 'active',
        state: isMoving ? 'completed' : 'current',
        time: '09:20 AM',
      },
      {
        id: 't_review',
        title: "Doctor reviewing history",
        subtitle: `${docName} reviewing longitudinal charts`,
        label: "History Review",
        subtext: "Diagnostic notes pre-loaded",
        status: isApproaching ? 'completed' : (code === 'DOCTOR_REVIEWING' ? 'active' : 'upcoming'),
        state: isApproaching ? 'completed' : (code === 'DOCTOR_REVIEWING' ? 'current' : 'upcoming'),
        time: isReviewing ? '09:28 AM' : undefined,
      },
      {
        id: 't_approaching',
        title: "Approaching clinic",
        subtitle: isImminent ? "Wait outside consultation room" : "Token nearing front",
        label: "Approach Clinic",
        subtext: `Designated bay: ${room}`,
        status: isTurn ? 'completed' : (code === 'PLEASE_REPORT' || code === 'ALMOST_YOUR_TURN' ? 'active' : 'upcoming'),
        state: isTurn ? 'completed' : (code === 'PLEASE_REPORT' || code === 'ALMOST_YOUR_TURN' ? 'current' : 'upcoming'),
        time: isApproaching ? '09:34 AM' : undefined,
      },
      {
        id: 't_consult',
        title: "Consultation in room",
        subtitle: isCompleted ? `Completed with ${docName}` : (code === 'IN_CONSULTATION' ? "Care team is with you" : `Ready in ${room}`),
        label: "Consultation",
        subtext: "Personalized clinical evaluation",
        status: isCompleted ? 'completed' : (isConsulting || isTurn ? 'active' : 'upcoming'),
        state: isCompleted ? 'completed' : (isConsulting || isTurn ? 'current' : 'upcoming'),
        time: isTurn ? '09:40 AM' : undefined,
      },
    ];
  }

  /**
   * Helper to retrieve arrival alert
   */
  static getArrivalAlert(stateOrPatientsAhead: SanctuaryPulseState | number, room: string = 'Room 101') {
    if (typeof stateOrPatientsAhead === 'object') {
      return stateOrPatientsAhead.arrivalAlert;
    }
    const patientsAhead = stateOrPatientsAhead;
    if (patientsAhead <= 0) {
      return {
        type: 'enter_room' as const,
        title: "You're next",
        message: `Please report to reception or enter ${room}. The doctor is ready to receive you.`,
        urgency: 'urgent' as const,
        cta: `Enter ${room}`,
        actionLabel: `Report to ${room}`,
      };
    }
    if (patientsAhead === 1) {
      return {
        type: 'report_reception' as const,
        title: "Your turn is getting close",
        message: `You are next in sequence. Please wait outside ${room}.`,
        urgency: 'urgent' as const,
        cta: 'Wait Outside Room',
        actionLabel: 'I am nearby',
      };
    }
    if (patientsAhead <= 3) {
      return {
        type: 'heading' as const,
        title: "Please start making your way to the clinic",
        message: `Only ${patientsAhead} patients ahead. Please make your way toward the clinic lounge.`,
        urgency: 'warning' as const,
        cta: 'Heading to clinic',
        actionLabel: 'On my way',
      };
    }
    return null;
  }

  /**
   * Helper to retrieve timeline steps
   */
  static getTimelineSteps(stateOrPatientsAhead: SanctuaryPulseState | number, room: string = 'Room 101') {
    if (typeof stateOrPatientsAhead === 'object') {
      return stateOrPatientsAhead.timeline;
    }
    const patientsAhead = stateOrPatientsAhead;
    const code: SanctuaryPulseCode = 
      patientsAhead <= 0 ? 'YOUR_TURN' :
      patientsAhead <= 2 ? 'ALMOST_YOUR_TURN' :
      patientsAhead <= 4 ? 'PLEASE_REPORT' :
      'QUEUE_STABLE';
    return this.buildTimeline(code, 'A-27', 'Dr. Sharma', room, patientsAhead);
  }

  /**
   * Empathetic mindfulness pacing prompts to soothe waiting anxiety
   */
  static getMindfulnessPacing(): { title: string; prompt: string; action: string } {
    return {
      title: 'Empathetic Healthcare Pacing',
      prompt: 'Quality clinical care takes uninterrupted time. Each patient receives complete presence, just as you will.',
      action: '4-4-4 Box Breathing: Inhale 4s, Hold 4s, Exhale 4s.',
    };
  }
}
