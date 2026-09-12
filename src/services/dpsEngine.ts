import { Patient, DiagnosticEvent, Symptom, DiagnosticSignal, DpsSnapshot, Visit } from '../types';

/**
 * =========================================================================================
 * ODYSSEY FLOW: DIAGNOSTIC JOURNEY ANALYZER & STAGNATION DETECTION ENGINE
 * =========================================================================================
 * 
 * HEALTHCARE COMPLIANCE & SAFETY MANDATE:
 * - This is a strictly PROCESS-ANALYSIS engine.
 * - It does NOT diagnose diseases.
 * - It does NOT recommend medication.
 * - It does NOT replace clinicians.
 * - It identifies potential stagnation in the diagnostic journey.
 * 
 * Required Safety UX Language:
 * - "Potential diagnostic journey stagnation detected."
 * - "Clinical review recommended."
 * - "Process insight — not a diagnosis."
 * =========================================================================================
 */

export const SAFETY_MANDATE = {
  BANNER_TITLE: "Process insight — not a diagnosis.",
  BANNER_SUBTITLE: "Odyssey Flow evaluates diagnostic journey velocity, test redundancy, and specialist ping-pong loops. It does not predict diseases or alter pharmacological regimens.",
  DISCLAIMER: "This analytical tool is designed strictly for clinical process optimization, queue scheduling, and physician preparation. All medical judgements remain solely with authorized clinicians."
};

/**
 * Configurable prototype weights for the Diagnostic Progress Score formula
 */
export interface DpsFormulaConfig {
  uncertaintyReductionWeight: number;    // Weight for uncertainty reduction
  testNoveltyWeight: number;             // Weight for avoiding test redundancy
  specialistConvergenceWeight: number;   // Weight for specialist alignment
  hypothesisConvergenceWeight: number;   // Weight for consistent diagnostic hypotheses
  treatmentResolutionWeight: number;     // Weight for treatment response / resolution
  stagnationThresholdSlope: number;      // DPS slope per encounter threshold (e.g. <= 0.5)
  minEncountersForStagnation: number;    // Minimum encounters before stagnation can be flagged
}

export const DEFAULT_DPS_CONFIG: DpsFormulaConfig = {
  uncertaintyReductionWeight: 0.20,
  testNoveltyWeight: 0.20,
  specialistConvergenceWeight: 0.20,
  hypothesisConvergenceWeight: 0.20,
  treatmentResolutionWeight: 0.20,
  stagnationThresholdSlope: 0.5, // Flat or negative slope indicates stagnation
  minEncountersForStagnation: 3,
};

let activeFormulaConfig: DpsFormulaConfig = { ...DEFAULT_DPS_CONFIG };

/**
 * Semantic complaint clusters for grouping recurring clinical complaints
 */
export const COMPLAINT_CLUSTERS: Record<string, string[]> = {
  headache: [
    'headache', 'cephalalgia', 'migraine', 'cranial pressure', 'temple pain', 
    'throbbing head', 'tension headache', 'persistent headache', 'recurrent headache', 'head tension'
  ],
  epigastric_abdominal: [
    'abdominal pain', 'epigastric distress', 'stomach cramping', 'right upper quadrant pain', 
    'biliary colic', 'nausea', 'vomiting', 'dyspepsia', 'bloating', 'indigestion', 'gallbladder'
  ],
  musculoskeletal_joint: [
    'joint pain', 'arthralgia', 'polyarthralgia', 'morning stiffness', 'wrist pain', 
    'knee swelling', 'joint stiffness', 'inflammatory arthritis', 'swollen joints'
  ],
  vestibular_dizziness: [
    'vertigo', 'dizziness', 'spinning sensation', 'unsteadiness', 'imbalance', 
    'tinnitus', 'ear fullness', 'vestibular', 'ataxia'
  ],
  fatigue_systemic: [
    'fatigue', 'exhaustion', 'tiredness', 'lethargy', 'malaise', 'low energy', 
    'brain fog', 'post-viral exhaustion'
  ],
  respiratory: [
    'cough', 'dyspnea', 'breathlessness', 'wheezing', 'chest tightness', 'shortness of breath'
  ]
};

/**
 * Uncertainty markers detected in clinical encounter notes
 */
export const UNCERTAINTY_MARKERS = [
  'unclear', 'possible', 'suspected', 'rule out', 'r/o', 'uncertain', 
  'consider', 'unknown', 'etiology unclear', 'equivocal', 'non-specific', 
  'inconclusive', 'unspecified', 'atypical', 'unexplained', 'provisional', 
  'pending resolution', 'indeterminate', 'awaiting etiology'
];

/**
 * Historical Encounter DPS step in the trajectory
 */
export interface EncounterTrajectoryNode {
  encounterNumber: number;
  visitId: string;
  date: string;
  doctorName: string;
  specialty: string;
  facility: string;
  complaint: string;
  hypothesis: string;
  testsOrdered: string[];
  treatmentPlan: string;
  notes: string;
  dpsScore: number;
  delta: number;
  signals: {
    repeatComplaintScore: number;
    specialistTransitionIntensity: number;
    testRedundancyScore: number;
    hypothesisEntropy: number;
    noteUncertaintyScore: number;
    treatmentNonResolutionScore: number;
  };
  uncertaintyMarkersFound: string[];
  redundantTestsFound: string[];
  milestone?: string;
  isStagnant: boolean;
}

/**
 * 15-Second Doctor Snapshot Data Structure
 */
export interface DoctorSnapshotData {
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  uhid: string;
  journeyDurationDays: number;
  journeyDurationFormatted: string;
  encounterCount: number;
  specialties: string[];
  specialtiesCount: number;
  repeatedComplaintsSummary: string;
  repeatedComplaintCount: number;
  repeatComplaintScore: number;
  investigationRedundancySummary: string;
  investigationRedundancyCount: number;
  testRedundancyScore: number;
  currentDps: number;
  previousDps: number;
  dpsDelta: number;
  dpsTrend: 'improving' | 'flat' | 'declining' | 'recovering';
  dpsTrendFormatted: string;
  dpsSlope: number;
  stagnationState: 'STAGNATION_DETECTED' | 'CONVERGING' | 'MONITORING' | 'RECOVERING';
  stagnationFlag: boolean;
  topSignals: {
    title: string;
    description: string;
    severity: 'critical' | 'high' | 'moderate' | 'low';
    metric: string;
  }[];
  explainability: string[];
  queueRecommendations: {
    priorityAdjustment: string;
    consultationExtensionMinutes: number;
    seniorReviewEligible: boolean;
    seniorReviewRole: string;
    operationalAction: string;
  };
  generatedAt: string;
}

/**
 * PreConsultationSnapshot interface backwards compatibility
 */
export interface PreConsultationSnapshot {
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  dpsScore: number;
  stagnationRisk: 'optimal' | 'moderate' | 'high_stagnation' | 'critical_loop';
  stagnationFlag: boolean;
  stagnationState: 'STAGNATION_DETECTED' | 'CONVERGING' | 'MONITORING' | 'RECOVERING';
  journeyDurationDays: number;
  journeyDurationFormatted: string;
  totalInvestigations: number;
  inconclusiveInvestigations: number;
  specialtiesVisited: string[];
  keySignals: DiagnosticSignal[];
  suspectedStagnationPattern: string;
  duplicateTestPreventionAlert?: string;
  recommendedConsultationAction: string;
  recommendedInvestigationsToConsider: string[];
  dpsSlope?: number;
  explainability: string[];
  queueRecommendations: {
    priorityAdjustment: string;
    consultationExtensionMinutes: number;
    seniorReviewEligible: boolean;
    seniorReviewRole: string;
    operationalAction: string;
  };
  generatedAt: string;
}

export class DpsEngine {
  /**
   * Configuration accessors
   */
  static getConfig(): DpsFormulaConfig {
    return { ...activeFormulaConfig };
  }

  static updateConfig(newConfig: Partial<DpsFormulaConfig>): DpsFormulaConfig {
    activeFormulaConfig = { ...activeFormulaConfig, ...newConfig };
    return { ...activeFormulaConfig };
  }

  static resetConfig(): DpsFormulaConfig {
    activeFormulaConfig = { ...DEFAULT_DPS_CONFIG };
    return { ...activeFormulaConfig };
  }

  // =========================================================================
  // SIGNAL 1: REPEATED COMPLAINT
  // =========================================================================
  /**
   * Evaluates semantic recurrence of complaints across historical encounters.
   * Returns repeatComplaintScore (0 - 100) where 100 = high repetition/friction.
   */
  static computeRepeatComplaintScore(complaints: string[]): {
    score: number;
    dominantCluster: string;
    repetitionCount: number;
    description: string;
  } {
    if (!complaints || complaints.length === 0) {
      return { score: 0, dominantCluster: 'None', repetitionCount: 0, description: 'No recorded complaints' };
    }

    const clusterCounts: Record<string, number> = {};
    const lowerComplaints = complaints.map(c => (c || '').toLowerCase());

    lowerComplaints.forEach(complaint => {
      let matchedCluster = 'other';
      for (const [clusterName, keywords] of Object.entries(COMPLAINT_CLUSTERS)) {
        if (keywords.some(kw => complaint.includes(kw))) {
          matchedCluster = clusterName;
          break;
        }
      }
      clusterCounts[matchedCluster] = (clusterCounts[matchedCluster] || 0) + 1;
    });

    let dominantCluster = 'other';
    let maxCount = 0;
    for (const [cluster, count] of Object.entries(clusterCounts)) {
      if (cluster !== 'other' && count > maxCount) {
        maxCount = count;
        dominantCluster = cluster;
      }
    }

    if (maxCount === 0 && clusterCounts['other']) {
      maxCount = clusterCounts['other'];
    }

    const total = complaints.length;
    let score = 15;

    if (maxCount >= 4) {
      score = 92;
    } else if (maxCount === 3) {
      score = 75;
    } else if (maxCount === 2) {
      score = 50;
    } else {
      score = 15;
    }

    const readableClusterName = dominantCluster.replace('_', ' ').toUpperCase();
    const description = maxCount >= 2
      ? `Identical or semantically similar ${readableClusterName} complaint appeared across ${maxCount} of ${total} clinical encounters.`
      : `Single presentation (${dominantCluster}); no recurrent symptom pattern detected.`;

    return {
      score,
      dominantCluster: readableClusterName,
      repetitionCount: maxCount,
      description
    };
  }

  // =========================================================================
  // SIGNAL 2: SPECIALIST TRANSITION INTENSITY
  // =========================================================================
  /**
   * Tracks specialty transitions (e.g. Gen Med -> Neuro -> ENT -> Neuro -> Internal Med).
   * Calculates transition intensity (0 - 100) accounting for hop counts and ping-pong loops.
   */
  static computeSpecialistTransitionIntensity(specialties: string[]): {
    score: number;
    hopCount: number;
    loopCount: number;
    uniqueCount: number;
    transitionChain: string;
    description: string;
  } {
    if (!specialties || specialties.length <= 1) {
      return {
        score: 0,
        hopCount: 0,
        loopCount: 0,
        uniqueCount: specialties?.length || 0,
        transitionChain: specialties?.[0] || 'Single Specialty',
        description: 'Single clinical specialty care; no handoff fragmentation.'
      };
    }

    let hopCount = 0;
    let loopCount = 0;
    const visitedSet = new Set<string>();
    visitedSet.add(specialties[0]);

    for (let i = 1; i < specialties.length; i++) {
      const prev = specialties[i - 1];
      const curr = specialties[i];

      if (prev !== curr) {
        hopCount++;
        // Check for ping-pong loop: returning to an already visited specialty
        if (visitedSet.has(curr) && prev !== curr) {
          loopCount++;
        }
      }
      visitedSet.add(curr);
    }

    const uniqueCount = visitedSet.size;

    // Transition Intensity Formula:
    // Hops + Loop penalty + Diversity penalty
    let score = Math.min(100, Math.round((hopCount * 18) + (loopCount * 25) + ((uniqueCount - 1) * 15)));

    const transitionChain = specialties.join(' → ');
    const description = hopCount >= 2
      ? `High transition intensity: ${hopCount} specialty transitions across ${uniqueCount} distinct specialties with ${loopCount} circular handoff loops.`
      : `Normal specialty progression (${uniqueCount} specialty visited).`;

    return {
      score,
      hopCount,
      loopCount,
      uniqueCount,
      transitionChain,
      description
    };
  }

  // =========================================================================
  // SIGNAL 3: TEST REDUNDANCY SCORE
  // =========================================================================
  /**
   * Detects repeated investigations (MRI, MRI, CBC, CBC, Ultrasound, Ultrasound)
   * within short/prolonged periods without diagnostic yield.
   * Returns testRedundancyScore (0 - 100).
   */
  static computeTestRedundancyScore(testsList: string[][], events?: DiagnosticEvent[]): {
    score: number;
    redundantModalities: string[];
    redundancyCount: number;
    description: string;
  } {
    const flatTests: string[] = [];
    testsList.forEach(list => {
      (list || []).forEach(t => flatTests.push(t.toLowerCase()));
    });

    if (events) {
      events.forEach(e => {
        if (e.eventType) flatTests.push(e.eventType.toLowerCase());
        if (e.title) flatTests.push(e.title.toLowerCase());
      });
    }

    if (flatTests.length === 0) {
      return { score: 0, redundantModalities: [], redundancyCount: 0, description: 'No diagnostic investigations recorded.' };
    }

    const modalityRules: Record<string, string[]> = {
      'Cranial MRI': ['mri brain', 'brain mri', 'cranial mri', 'iac protocol', 'mri head'],
      'Whole Abdomen Ultrasound': ['ultrasound', 'usg', 'sonography', 'us abdomen'],
      'Complete Blood Count (CBC)': ['cbc', 'complete blood count', 'hemogram', 'hematology'],
      'Abdominal / Cranial CT': ['ct scan', 'computed tomography', 'cat scan'],
      'Liver Function Panel': ['lft', 'liver function test', 'serum amylase', 'lipase'],
      'Autoimmune Serology': ['ana', 'rheumatoid factor', 'esr', 'crp', 'anti-ccp']
    };

    const modalityCounts: Record<string, number> = {};

    flatTests.forEach(test => {
      for (const [modality, patterns] of Object.entries(modalityRules)) {
        if (patterns.some(p => test.includes(p))) {
          modalityCounts[modality] = (modalityCounts[modality] || 0) + 1;
          return;
        }
      }
    });

    const redundantModalities: string[] = [];
    let redundancyCount = 0;

    for (const [modality, count] of Object.entries(modalityCounts)) {
      if (count > 1) {
        redundantModalities.push(`${modality} (${count}x)`);
        redundancyCount += (count - 1);
      }
    }

    let score = 10;
    if (redundancyCount >= 3) {
      score = 88;
    } else if (redundancyCount === 2) {
      score = 65;
    } else if (redundancyCount === 1) {
      score = 42;
    }

    const description = redundantModalities.length > 0
      ? `Redundant investigations identified: ${redundantModalities.join(', ')}. Multiple inconclusive repeats detected.`
      : 'No test redundancy identified. Investigations follow appropriate diagnostic tiers.';

    return {
      score,
      redundantModalities,
      redundancyCount,
      description
    };
  }

  // =========================================================================
  // SIGNAL 4: HYPOTHESIS INSTABILITY (ENTROPY)
  // =========================================================================
  /**
   * Tracks changes in recorded clinical hypotheses (Hypothesis A -> B -> C -> A).
   * Computes prototype hypothesis-instability measure: hypothesisEntropy (0 - 100).
   */
  static computeHypothesisEntropy(hypotheses: string[]): {
    score: number;
    distinctHypotheses: string[];
    churnCount: number;
    shannonEntropy: number;
    description: string;
  } {
    const valid = (hypotheses || []).filter(h => h && h.trim().length > 0);
    if (valid.length <= 1) {
      return {
        score: 0,
        distinctHypotheses: valid,
        churnCount: 0,
        shannonEntropy: 0,
        description: 'Consistent clinical impression; single working hypothesis.'
      };
    }

    // Measure churn (changes from visit i to i+1)
    let churnCount = 0;
    for (let i = 1; i < valid.length; i++) {
      if (valid[i].toLowerCase() !== valid[i - 1].toLowerCase()) {
        churnCount++;
      }
    }

    // Calculate frequency distribution and Shannon entropy
    const counts: Record<string, number> = {};
    valid.forEach(h => {
      const normalized = h.toLowerCase().trim();
      counts[normalized] = (counts[normalized] || 0) + 1;
    });

    const N = valid.length;
    let entropy = 0;
    for (const count of Object.values(counts)) {
      const p = count / N;
      if (p > 0) {
        entropy -= p * Math.log2(p);
      }
    }

    const maxPossibleEntropy = Math.log2(N);
    const normalizedEntropy = maxPossibleEntropy > 0 ? (entropy / maxPossibleEntropy) : 0;
    const distinctHypotheses = Object.keys(counts);

    // Score combines normalized entropy and churn rate
    const churnRatio = churnCount / (N - 1);
    const score = Math.min(100, Math.round((normalizedEntropy * 60) + (churnRatio * 40)));

    const description = score > 50
      ? `Elevated hypothesis instability (entropy: ${entropy.toFixed(2)} bits). Clinical working impression changed ${churnCount} times across ${N} visits.`
      : `Stable diagnostic direction with minimal hypothesis churn (${churnCount} adjustments).`;

    return {
      score,
      distinctHypotheses,
      churnCount,
      shannonEntropy: parseFloat(entropy.toFixed(2)),
      description
    };
  }

  // =========================================================================
  // SIGNAL 5: NOTE UNCERTAINTY SCORE
  // =========================================================================
  /**
   * Detects uncertainty markers in physician notes:
   * "unclear", "possible", "suspected", "rule out", "uncertain", "consider", 
   * "unknown", "etiology unclear", "equivocal", "non-specific", "inconclusive".
   * This is a process signal, NOT an LLM diagnosis.
   */
  static computeNoteUncertaintyScore(notes: string[]): {
    score: number;
    markersDetected: string[];
    affectedNotesCount: number;
    markerDensity: number;
    description: string;
  } {
    if (!notes || notes.length === 0) {
      return { score: 0, markersDetected: [], affectedNotesCount: 0, markerDensity: 0, description: 'No encounter notes available.' };
    }

    const foundMarkers = new Set<string>();
    let affectedNotesCount = 0;
    let totalMarkerOccurrences = 0;

    notes.forEach(noteText => {
      const lower = (noteText || '').toLowerCase();
      let noteHasMarker = false;

      UNCERTAINTY_MARKERS.forEach(marker => {
        if (lower.includes(marker)) {
          foundMarkers.add(marker);
          noteHasMarker = true;
          totalMarkerOccurrences++;
        }
      });

      if (noteHasMarker) {
        affectedNotesCount++;
      }
    });

    const totalNotes = notes.length;
    const affectedRatio = affectedNotesCount / totalNotes;
    const markerDensity = parseFloat((totalMarkerOccurrences / totalNotes).toFixed(2));

    let score = Math.min(100, Math.round((affectedRatio * 70) + Math.min(30, totalMarkerOccurrences * 8)));

    const markersList = Array.from(foundMarkers);
    const description = affectedNotesCount > 0
      ? `Uncertainty markers detected in ${affectedNotesCount} of ${totalNotes} doctor notes (${markersList.slice(0, 4).map(m => `"${m}"`).join(', ')}). High process ambiguity.`
      : 'Low ambiguity in physician documentation. Definitive clinical phrasing observed.';

    return {
      score,
      markersDetected: markersList,
      affectedNotesCount,
      markerDensity,
      description
    };
  }

  // =========================================================================
  // SIGNAL 6: TREATMENT NON-RESOLUTION SCORE
  // =========================================================================
  /**
   * Detects repeated treatment changes, discontinued therapies, lack of documented 
   * improvement, and unresolved outcome patterns.
   */
  static computeTreatmentNonResolutionScore(
    treatments: string[],
    resolvedFlags: boolean[],
    notes: string[]
  ): {
    score: number;
    therapySwitchesCount: number;
    unresolvedCount: number;
    nonResolutionPhrases: string[];
    description: string;
  } {
    const nonResolutionPhrases = [
      'no symptomatic relief', 'persistent pain', 'intractable', 'unresolved', 
      'attacks continue', 'failed to respond', 'discontinued due to', 'minimal relief', 
      'refractory', 'symptoms worsening'
    ];

    const detectedPhrases: string[] = [];
    (notes || []).forEach(n => {
      const lower = (n || '').toLowerCase();
      nonResolutionPhrases.forEach(p => {
        if (lower.includes(p) && !detectedPhrases.includes(p)) {
          detectedPhrases.push(p);
        }
      });
    });

    let therapySwitchesCount = 0;
    if (treatments && treatments.length > 1) {
      for (let i = 1; i < treatments.length; i++) {
        if (treatments[i] && treatments[i - 1] && treatments[i].toLowerCase() !== treatments[i - 1].toLowerCase()) {
          therapySwitchesCount++;
        }
      }
    }

    const unresolvedCount = resolvedFlags.filter(r => !r).length;
    const totalEncounterCount = resolvedFlags.length || 1;
    const unresolvedRatio = unresolvedCount / totalEncounterCount;

    let score = Math.min(100, Math.round(
      (unresolvedRatio * 45) + 
      (therapySwitchesCount * 15) + 
      (detectedPhrases.length * 15)
    ));

    if (unresolvedCount === 0 && therapySwitchesCount === 0) {
      score = 10;
    }

    const description = score > 50
      ? `High treatment non-resolution: ${therapySwitchesCount} therapy modifications with persistent uncharacterized symptoms (${detectedPhrases.slice(0, 2).join(', ')}).`
      : `Treatment response favorable; symptoms resolving as expected.`;

    return {
      score,
      therapySwitchesCount,
      unresolvedCount,
      nonResolutionPhrases: detectedPhrases,
      description
    };
  }

  // =========================================================================
  // DPS FORMULA CALCULATION
  // =========================================================================
  /**
   * Diagnostic Progress Score (0 - 100).
   * Higher score = stronger apparent journey convergence.
   * Lower score = weaker convergence (stagnation).
   * 
   * Uses configurable prototype formula combining the 5 convergence dimensions.
   */
  static calculateDPS(signals: {
    repeatComplaintScore: number;
    specialistTransitionIntensity: number;
    testRedundancyScore: number;
    hypothesisEntropy: number;
    noteUncertaintyScore: number;
    treatmentNonResolutionScore: number;
  }, journeyDays: number = 30): number {
    const cfg = activeFormulaConfig;

    // Convergence dimensions (0 - 100, where 100 is best)
    const uncertaintyReduction = Math.max(0, 100 - signals.noteUncertaintyScore);
    const testNovelty = Math.max(0, 100 - signals.testRedundancyScore);
    const specialistConvergence = Math.max(0, 100 - signals.specialistTransitionIntensity);
    const hypothesisConvergence = Math.max(0, 100 - signals.hypothesisEntropy);
    const treatmentResolution = Math.max(0, 100 - signals.treatmentNonResolutionScore);

    // Weighted combination
    const rawScore = 
      (uncertaintyReduction * cfg.uncertaintyReductionWeight) +
      (testNovelty * cfg.testNoveltyWeight) +
      (specialistConvergence * cfg.specialistConvergenceWeight) +
      (hypothesisConvergence * cfg.hypothesisConvergenceWeight) +
      (treatmentResolution * cfg.treatmentResolutionWeight);

    // Journey duration friction: minor dampening if duration exceeds 90 or 180 days with low convergence
    let durationFriction = 0;
    if (journeyDays > 180 && rawScore < 65) durationFriction = 8;
    else if (journeyDays > 90 && rawScore < 70) durationFriction = 4;

    const finalScore = Math.max(15, Math.min(98, Math.round(rawScore - durationFriction)));
    return finalScore;
  }

  // =========================================================================
  // TRAJECTORY CALCULATOR: ENCOUNTER-BY-ENCOUNTER
  // =========================================================================
  /**
   * Calculates DPS for every historical encounter (Visit 1 -> 71, Visit 2 -> 69, etc.)
   * and returns trajectory nodes with milestone annotations.
   */
  static computeTrajectory(
    patient: Patient,
    visits: Visit[],
    events: DiagnosticEvent[] = [],
    symptoms: Symptom[] = []
  ): EncounterTrajectoryNode[] {
    if (!visits || visits.length === 0) {
      return [];
    }

    const sortedVisits = [...visits].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const trajectory: EncounterTrajectoryNode[] = [];

    let previousDps = 75;

    sortedVisits.forEach((visit, index) => {
      const historicalSlice = sortedVisits.slice(0, index + 1);

      const complaints = historicalSlice.map(v => v.reason || v.chiefComplaint || 'Clinical evaluation');
      const specialties = historicalSlice.map(v => v.specialty || 'General Medicine');
      const tests = historicalSlice.map(v => v.testsOrdered || []);
      const hypotheses = historicalSlice.map(v => v.diagnosis || '');
      const treatments = historicalSlice.map(v => v.prescriptionSummary || '');
      const notes = historicalSlice.map(v => v.notes || '');
      const resolvedFlags = historicalSlice.map(v => !!v.resolved);

      const sigRepeat = this.computeRepeatComplaintScore(complaints);
      const sigTrans = this.computeSpecialistTransitionIntensity(specialties);
      const sigRedun = this.computeTestRedundancyScore(tests, events);
      const sigHyp = this.computeHypothesisEntropy(hypotheses);
      const sigUnc = this.computeNoteUncertaintyScore(notes);
      const sigTreat = this.computeTreatmentNonResolutionScore(treatments, resolvedFlags, notes);

      const dps = this.calculateDPS({
        repeatComplaintScore: sigRepeat.score,
        specialistTransitionIntensity: sigTrans.score,
        testRedundancyScore: sigRedun.score,
        hypothesisEntropy: sigHyp.score,
        noteUncertaintyScore: sigUnc.score,
        treatmentNonResolutionScore: sigTreat.score,
      }, (index + 1) * 35);

      const delta = index === 0 ? 0 : dps - previousDps;
      previousDps = dps;

      // Determine milestones
      let milestone: string | undefined = undefined;
      if (index === 0) {
        milestone = 'Intake / Initial Presentation';
      } else if (sigTrans.hopCount >= 2 && index === 2) {
        milestone = 'Cross-Specialty Transition';
      } else if (sigRedun.redundancyCount >= 1 && !milestone) {
        milestone = 'Duplicate Workup Detected';
      } else if (delta >= 12) {
        milestone = 'Diagnostic Convergence Breakthrough';
      } else if (index === sortedVisits.length - 1 && dps < 65) {
        milestone = 'Active Stagnation Alert';
      }

      trajectory.push({
        encounterNumber: index + 1,
        visitId: visit.id,
        date: visit.date,
        doctorName: visit.doctorName || 'Attending Physician',
        specialty: visit.specialty || 'General Medicine',
        facility: visit.clinicName || 'Clinic',
        complaint: visit.reason || visit.chiefComplaint || 'Evaluation',
        hypothesis: visit.diagnosis || 'Provisional Impression',
        testsOrdered: visit.testsOrdered || [],
        treatmentPlan: visit.prescriptionSummary || 'Standard protocol',
        notes: visit.notes || '',
        dpsScore: dps,
        delta,
        signals: {
          repeatComplaintScore: sigRepeat.score,
          specialistTransitionIntensity: sigTrans.score,
          testRedundancyScore: sigRedun.score,
          hypothesisEntropy: sigHyp.score,
          noteUncertaintyScore: sigUnc.score,
          treatmentNonResolutionScore: sigTreat.score,
        },
        uncertaintyMarkersFound: sigUnc.markersDetected,
        redundantTestsFound: sigRedun.redundantModalities,
        milestone,
        isStagnant: dps < 65 && index >= 2,
      });
    });

    return trajectory;
  }

  // =========================================================================
  // STAGNATION DETECTOR
  // =========================================================================
  /**
   * Flags potential stagnation if:
   * 1. Enough encounters exist (>= minEncountersForStagnation)
   * 2. Recent DPS has a flat or negative trend (slope <= stagnationThresholdSlope)
   * 3. Current DPS is sub-optimal (< 70)
   */
  static detectStagnation(trajectory: EncounterTrajectoryNode[]): {
    stagnationFlag: boolean;
    stagnationState: 'STAGNATION_DETECTED' | 'CONVERGING' | 'MONITORING' | 'RECOVERING';
    dpsSlope: number;
    stagnationReason: string;
    confidence: number;
  } {
    const cfg = activeFormulaConfig;
    if (!trajectory || trajectory.length < 2) {
      return {
        stagnationFlag: false,
        stagnationState: 'MONITORING',
        dpsSlope: 0,
        stagnationReason: 'Insufficient longitudinal encounters to evaluate diagnostic trajectory velocity.',
        confidence: 45
      };
    }

    const n = trajectory.length;
    const currentScore = trajectory[n - 1].dpsScore;

    // Calculate recent slope across last 3 encounters (or all if fewer)
    const windowSize = Math.min(n, 3);
    const windowStart = n - windowSize;
    const scoreStart = trajectory[windowStart].dpsScore;
    const scoreEnd = trajectory[n - 1].dpsScore;
    const encountersElapsed = windowSize - 1;
    const dpsSlope = parseFloat(((scoreEnd - scoreStart) / (encountersElapsed || 1)).toFixed(2));

    // Check for recovery pattern: previously stagnant, then recent sharp jump (> 10 points)
    const hasPriorStagnation = trajectory.slice(0, n - 1).some(t => t.isStagnant || t.dpsScore < 65);
    if (hasPriorStagnation && dpsSlope >= 6.0 && currentScore >= 75) {
      return {
        stagnationFlag: false,
        stagnationState: 'RECOVERING',
        dpsSlope,
        stagnationReason: 'Post-referral trajectory recovery detected: Significant diagnostic convergence observed following specialized investigation.',
        confidence: 88
      };
    }

    // Check for active stagnation
    if (n >= cfg.minEncountersForStagnation) {
      if (dpsSlope <= cfg.stagnationThresholdSlope && currentScore < 70) {
        return {
          stagnationFlag: true,
          stagnationState: 'STAGNATION_DETECTED',
          dpsSlope,
          stagnationReason: `Potential diagnostic journey stagnation detected: DPS trajectory plateaued (slope: ${dpsSlope} pts/visit) across ${n} encounters without diagnostic closure.`,
          confidence: 85
        };
      }
    }

    // Normal convergence
    if (currentScore >= 78) {
      return {
        stagnationFlag: false,
        stagnationState: 'CONVERGING',
        dpsSlope,
        stagnationReason: 'Diagnostic trajectory progressing normally toward resolution.',
        confidence: 90
      };
    }

    return {
      stagnationFlag: false,
      stagnationState: 'MONITORING',
      dpsSlope,
      stagnationReason: 'Diagnostic trajectory under standard clinical observation.',
      confidence: 70
    };
  }

  // =========================================================================
  // EXPLAINABILITY ENGINE ("Always explain WHY")
  // =========================================================================
  /**
   * Generates a concrete, numbered bullet breakdown of why stagnation was flagged.
   */
  static generateExplainability(
    trajectory: EncounterTrajectoryNode[],
    snapshotData: {
      repeatedCount: number;
      dominantComplaint: string;
      specialtiesCount: number;
      specialtiesList: string[];
      redundantTests: string[];
      uncertaintyNotesCount: number;
      totalNotes: number;
      dpsSlope: number;
      recentScore: number;
    }
  ): string[] {
    const reasons: string[] = [];

    // 1. Repeated complaint
    if (snapshotData.repeatedCount >= 2) {
      reasons.push(
        `Same or semantically similar complaint (${snapshotData.dominantComplaint}) appeared across ${snapshotData.repeatedCount} encounters without symptomatic resolution.`
      );
    }

    // 2. Specialty transitions
    if (snapshotData.specialtiesCount >= 2) {
      reasons.push(
        `${snapshotData.specialtiesCount} medical specialties involved (${snapshotData.specialtiesList.join(', ')}), showing care fragmentation.`
      );
    }

    // 3. Test Redundancy
    if (snapshotData.redundantTests && snapshotData.redundantTests.length > 0) {
      reasons.push(
        `Duplicate or unyielding investigations repeated (${snapshotData.redundantTests.join(', ')}), with no change in clinical trajectory.`
      );
    } else {
      reasons.push('Serial baseline screenings completed without definitive etiology identified.');
    }

    // 4. Note uncertainty
    if (snapshotData.uncertaintyNotesCount > 0) {
      reasons.push(
        `Physician encounter notes reflect persistent uncertainty markers across ${snapshotData.uncertaintyNotesCount} of ${snapshotData.totalNotes} visits.`
      );
    }

    // 5. DPS slope
    const n = trajectory.length;
    if (snapshotData.dpsSlope <= 0.5) {
      reasons.push(
        `Diagnostic Progress Score remained nearly flat over recent encounters (Slope: ${snapshotData.dpsSlope} pts/visit; current score: ${snapshotData.recentScore}/100).`
      );
    } else {
      reasons.push(
        `Diagnostic velocity measured at ${snapshotData.dpsSlope} pts/visit with active convergence monitoring.`
      );
    }

    return reasons;
  }

  // =========================================================================
  // QUEUE POLICY RECOMMENDATIONS
  // =========================================================================
  /**
   * Generates operational recommendations for the Queue Policy Engine:
   * - Priority adjustment
   * - Bounded consultation extension
   * - Senior-review eligibility
   */
  static getQueueRecommendations(
    stagnationState: 'STAGNATION_DETECTED' | 'CONVERGING' | 'MONITORING' | 'RECOVERING',
    dpsScore: number,
    journeyDurationDays: number
  ): {
    priorityAdjustment: string;
    consultationExtensionMinutes: number;
    seniorReviewEligible: boolean;
    seniorReviewRole: string;
    operationalAction: string;
  } {
    if (stagnationState === 'STAGNATION_DETECTED') {
      return {
        priorityAdjustment: 'Elevate to Priority Tier: Stagnation Review',
        consultationExtensionMinutes: 10,
        seniorReviewEligible: true,
        seniorReviewRole: 'Senior Consultant & Multidisciplinary Diagnostic Board',
        operationalAction: 'Auto-allocate +10 min buffer for comprehensive history synthesis and route to Senior Physician.',
      };
    }

    if (stagnationState === 'RECOVERING') {
      return {
        priorityAdjustment: 'Fast-Track Follow-up (Active Convergence)',
        consultationExtensionMinutes: 5,
        seniorReviewEligible: true,
        seniorReviewRole: 'Subspecialty Lead (Targeted Review)',
        operationalAction: 'Maintain current subspecialist alignment; confirm symptomatic remission.',
      };
    }

    if (dpsScore < 75) {
      return {
        priorityAdjustment: 'Standard Priority with Longitudinal Alert',
        consultationExtensionMinutes: 5,
        seniorReviewEligible: false,
        seniorReviewRole: 'Attending Physician',
        operationalAction: 'Review prior lab imaging reports before ordering repeat scans.',
      };
    }

    return {
      priorityAdjustment: 'Standard Queue Priority',
      consultationExtensionMinutes: 0,
      seniorReviewEligible: false,
      seniorReviewRole: 'Attending Physician',
      operationalAction: 'Standard consultation intake. Trajectory on track.',
    };
  }

  // =========================================================================
  // DOCTOR SNAPSHOT GENERATOR (< 15 SECONDS)
  // =========================================================================
  /**
   * Generates a compact, highly scannable summary for clinicians:
   * - Journey duration
   * - Encounter count
   * - Specialties involved
   * - Repeated complaints
   * - Investigation redundancy
   * - DPS & DPS trend
   * - Stagnation state
   * - Top signals
   * Under 15 seconds to parse. No long AI essays.
   */
  static generateDoctorSnapshot(
    patient: Patient,
    visits: Visit[],
    events: DiagnosticEvent[] = [],
    symptoms: Symptom[] = []
  ): DoctorSnapshotData {
    const trajectory = this.computeTrajectory(patient, visits, events, symptoms);
    const stagnationResult = this.detectStagnation(trajectory);

    const complaints = visits.map(v => v.reason || v.chiefComplaint || 'Clinical evaluation');
    const specialties = Array.from(new Set(visits.map(v => v.specialty || 'General Medicine')));
    const tests = visits.map(v => v.testsOrdered || []);
    const hypotheses = visits.map(v => v.diagnosis || '');
    const treatments = visits.map(v => v.prescriptionSummary || '');
    const notes = visits.map(v => v.notes || '');
    const resolvedFlags = visits.map(v => !!v.resolved);

    const sigRepeat = this.computeRepeatComplaintScore(complaints);
    const sigTrans = this.computeSpecialistTransitionIntensity(visits.map(v => v.specialty || 'General Medicine'));
    const sigRedun = this.computeTestRedundancyScore(tests, events);
    const sigHyp = this.computeHypothesisEntropy(hypotheses);
    const sigUnc = this.computeNoteUncertaintyScore(notes);
    const sigTreat = this.computeTreatmentNonResolutionScore(treatments, resolvedFlags, notes);

    const currentDps = trajectory.length > 0 ? trajectory[trajectory.length - 1].dpsScore : patient.currentDps || 70;
    const previousDps = trajectory.length > 1 ? trajectory[trajectory.length - 2].dpsScore : currentDps;
    const dpsDelta = currentDps - previousDps;

    // Journey duration
    let maxDays = 30;
    symptoms.forEach(s => { if (s.durationDays > maxDays) maxDays = s.durationDays; });
    if (visits.length > 1) {
      const dates = visits.map(v => new Date(v.date).getTime()).filter(t => !isNaN(t));
      if (dates.length >= 2) {
        const spanDays = Math.round((Math.max(...dates) - Math.min(...dates)) / (1000 * 60 * 60 * 24));
        if (spanDays > maxDays) maxDays = spanDays;
      }
    }
    const months = Math.max(1, Math.round(maxDays / 30));
    const journeyDurationFormatted = `${months} months (${maxDays} days)`;

    // Trend formatting
    let dpsTrend: 'improving' | 'flat' | 'declining' | 'recovering' = 'flat';
    let dpsTrendFormatted = `Flat (${stagnationResult.dpsSlope > 0 ? '+' : ''}${stagnationResult.dpsSlope} pts/visit)`;

    if (stagnationResult.stagnationState === 'RECOVERING') {
      dpsTrend = 'recovering';
      dpsTrendFormatted = `Recovering (+${Math.abs(dpsDelta)} pts jump)`;
    } else if (stagnationResult.dpsSlope >= 3) {
      dpsTrend = 'improving';
      dpsTrendFormatted = `Improving (+${stagnationResult.dpsSlope} pts/visit)`;
    } else if (stagnationResult.dpsSlope <= -2) {
      dpsTrend = 'declining';
      dpsTrendFormatted = `Declining (${stagnationResult.dpsSlope} pts/visit)`;
    }

    // Top signals
    const topSignals = [
      {
        title: 'Repeated Complaints',
        description: sigRepeat.description,
        severity: sigRepeat.score >= 80 ? ('critical' as const) : sigRepeat.score >= 50 ? ('high' as const) : ('low' as const),
        metric: `${sigRepeat.repetitionCount}x recurrent (${sigRepeat.dominantCluster})`,
      },
      {
        title: 'Specialist Transition Intensity',
        description: sigTrans.description,
        severity: sigTrans.score >= 70 ? ('critical' as const) : sigTrans.score >= 40 ? ('high' as const) : ('low' as const),
        metric: `${sigTrans.hopCount} hops (${sigTrans.uniqueCount} specialties)`,
      },
      {
        title: 'Investigation Redundancy',
        description: sigRedun.description,
        severity: sigRedun.score >= 60 ? ('critical' as const) : sigRedun.score >= 35 ? ('high' as const) : ('low' as const),
        metric: sigRedun.redundantModalities.length > 0 ? sigRedun.redundantModalities.join(', ') : 'None detected',
      },
      {
        title: 'Note Uncertainty Markers',
        description: sigUnc.description,
        severity: sigUnc.score >= 70 ? ('critical' as const) : ('moderate' as const),
        metric: `${sigUnc.affectedNotesCount}/${notes.length} notes flagged`,
      }
    ];

    // Explainability
    const explainability = this.generateExplainability(trajectory, {
      repeatedCount: sigRepeat.repetitionCount,
      dominantComplaint: sigRepeat.dominantCluster,
      specialtiesCount: specialties.length,
      specialtiesList: specialties,
      redundantTests: sigRedun.redundantModalities,
      uncertaintyNotesCount: sigUnc.affectedNotesCount,
      totalNotes: notes.length,
      dpsSlope: stagnationResult.dpsSlope,
      recentScore: currentDps,
    });

    // Queue Recommendations
    const queueRecommendations = this.getQueueRecommendations(
      stagnationResult.stagnationState,
      currentDps,
      maxDays
    );

    return {
      patientId: patient.id,
      patientName: patient.fullName || patient.name || 'Patient',
      age: patient.age || 35,
      gender: patient.gender || 'Unknown',
      uhid: patient.uhid || `ODYSSEY-${patient.id.slice(-4).toUpperCase()}`,
      journeyDurationDays: maxDays,
      journeyDurationFormatted,
      encounterCount: visits.length,
      specialties,
      specialtiesCount: specialties.length,
      repeatedComplaintsSummary: `${sigRepeat.dominantCluster} (${sigRepeat.repetitionCount} visits)`,
      repeatedComplaintCount: sigRepeat.repetitionCount,
      repeatComplaintScore: sigRepeat.score,
      investigationRedundancySummary: sigRedun.redundantModalities.length > 0 ? sigRedun.redundantModalities.join(', ') : 'None',
      investigationRedundancyCount: sigRedun.redundancyCount,
      testRedundancyScore: sigRedun.score,
      currentDps,
      previousDps,
      dpsDelta,
      dpsTrend,
      dpsTrendFormatted,
      dpsSlope: stagnationResult.dpsSlope,
      stagnationState: stagnationResult.stagnationState,
      stagnationFlag: stagnationResult.stagnationFlag,
      topSignals,
      explainability,
      queueRecommendations,
      generatedAt: new Date().toISOString(),
    };
  }

  // =========================================================================
  // BACKWARDS-COMPATIBLE API METHODS FOR APP
  // =========================================================================

  /**
   * Backwards-compatible computeDPS method
   */
  static computeDPS(
    patient: Patient,
    events: DiagnosticEvent[] = [],
    symptoms: Symptom[] = [],
    visits: Visit[] = []
  ): DpsSnapshot {
    const trajectory = this.computeTrajectory(patient, visits.length > 0 ? visits : (patient as any).visits || [], events, symptoms);
    const lastNode = trajectory.length > 0 ? trajectory[trajectory.length - 1] : null;
    const stagnation = this.detectStagnation(trajectory);

    const score = lastNode ? lastNode.dpsScore : (patient.currentDps || 65);

    let stagnationRisk: DpsSnapshot['stagnationRisk'] = 'optimal';
    if (score < 45) stagnationRisk = 'critical_loop';
    else if (score < 65) stagnationRisk = 'high_stagnation';
    else if (score < 75) stagnationRisk = 'moderate';

    let suggestedAction: DpsSnapshot['suggestedAction'] = 'standard_queue';
    if (stagnationRisk === 'critical_loop') suggestedAction = 'multidisciplinary_panel';
    else if (stagnationRisk === 'high_stagnation') suggestedAction = 'senior_consultant_review';
    else if (stagnationRisk === 'moderate') suggestedAction = 'advanced_imaging_triage';

    return {
      id: `dps_${patient.id}_${Date.now()}`,
      patientId: patient.id,
      score,
      repeat_complaint_score: lastNode?.signals.repeatComplaintScore,
      uncertainty_score: lastNode?.signals.noteUncertaintyScore,
      redundancy_score: lastNode?.signals.testRedundancyScore,
      specialist_transition_score: lastNode?.signals.specialistTransitionIntensity,
      hypothesis_entropy: lastNode?.signals.hypothesisEntropy,
      treatment_nonresolution_score: lastNode?.signals.treatmentNonResolutionScore,
      stagnation_flag: stagnation.stagnationFlag,
      stagnation_state: stagnation.stagnationState,
      dps_slope: stagnation.dpsSlope,
      stagnationRisk,
      factors: {
        durationPenalty: 10,
        inconclusiveTestPenalty: 12,
        specialtyPingPongPenalty: 8,
        symptomProgressionPenalty: 5,
      },
      recommendation: stagnation.stagnationReason,
      suggestedAction,
      calculatedAt: new Date().toISOString(),
    };
  }

  /**
   * Backwards-compatible extractDiagnosticSignals
   */
  static extractDiagnosticSignals(
    patient: Patient,
    events: DiagnosticEvent[] = [],
    symptoms: Symptom[] = [],
    visits: Visit[] = []
  ): DiagnosticSignal[] {
    const signals: DiagnosticSignal[] = [];
    const visitsToUse = visits.length > 0 ? visits : (patient as any).visits || [];

    if (visitsToUse.length > 0) {
      const complaints = visitsToUse.map(v => v.reason || v.chiefComplaint || '');
      const rep = this.computeRepeatComplaintScore(complaints);
      if (rep.repetitionCount >= 2) {
        signals.push({
          id: `sig_rep_${patient.id}`,
          patientId: patient.id,
          signalType: 'repeated_complaint',
          severity: rep.score >= 80 ? 'critical' : 'high',
          title: `Recurrent Complaint Pattern (${rep.dominantCluster})`,
          description: rep.description,
          detectedAt: new Date().toISOString(),
          metricValue: `${rep.repetitionCount} occurrences`,
        });
      }

      const specialties = visitsToUse.map(v => v.specialty || '');
      const trans = this.computeSpecialistTransitionIntensity(specialties);
      if (trans.hopCount >= 2) {
        signals.push({
          id: `sig_trans_${patient.id}`,
          patientId: patient.id,
          signalType: 'specialist_transition',
          severity: trans.score >= 70 ? 'critical' : 'high',
          title: `Specialist Transition Friction (${trans.hopCount} hops)`,
          description: trans.description,
          detectedAt: new Date().toISOString(),
          metricValue: trans.transitionChain,
        });
      }

      const notes = visitsToUse.map(v => v.notes || '');
      const unc = this.computeNoteUncertaintyScore(notes);
      if (unc.affectedNotesCount > 0) {
        signals.push({
          id: `sig_unc_${patient.id}`,
          patientId: patient.id,
          signalType: 'note_uncertainty',
          severity: unc.score >= 70 ? 'high' : 'moderate',
          title: `Process Uncertainty in Encounter Notes`,
          description: unc.description,
          detectedAt: new Date().toISOString(),
          metricValue: `${unc.affectedNotesCount} notes`,
        });
      }
    }

    const unyielding = events.filter(e => !e.isConclusive);
    if (unyielding.length >= 2) {
      signals.push({
        id: `sig_tests_${patient.id}`,
        patientId: patient.id,
        signalType: 'test_redundancy',
        severity: unyielding.length >= 3 ? 'critical' : 'high',
        title: `Inconclusive Test Clustering (${unyielding.length} scans/labs)`,
        description: `${unyielding.length} investigations returned normal/equivocal results without diagnostic closure.`,
        metricValue: `${unyielding.length} unyielding tests`,
        detectedAt: new Date().toISOString(),
      });
    }

    return signals;
  }

  /**
   * Backwards-compatible generatePreConsultationSnapshot
   */
  static generatePreConsultationSnapshot(
    patient: Patient,
    events: DiagnosticEvent[] = [],
    symptoms: Symptom[] = [],
    dpsSnapshot?: DpsSnapshot,
    visits: Visit[] = []
  ): PreConsultationSnapshot {
    const visitsToUse = visits.length > 0 ? visits : (patient as any).visits || [];
    const docSnapshot = this.generateDoctorSnapshot(patient, visitsToUse, events, symptoms);
    const keySignals = this.extractDiagnosticSignals(patient, events, symptoms, visitsToUse);

    const inconclusive = events.filter(e => !e.isConclusive);
    let duplicateAlert: string | undefined = undefined;
    if (docSnapshot.investigationRedundancyCount > 0) {
      duplicateAlert = `PREVENT DUPLICATE ORDERING: ${docSnapshot.investigationRedundancySummary} has already been performed without diagnostic yield. Escalate to targeted advanced modality.`;
    }

    return {
      patientId: patient.id,
      patientName: docSnapshot.patientName,
      age: docSnapshot.age,
      gender: docSnapshot.gender,
      dpsScore: docSnapshot.currentDps,
      stagnationRisk: docSnapshot.currentDps < 45 ? 'critical_loop' : docSnapshot.currentDps < 65 ? 'high_stagnation' : docSnapshot.currentDps < 75 ? 'moderate' : 'optimal',
      stagnationFlag: docSnapshot.stagnationFlag,
      stagnationState: docSnapshot.stagnationState,
      journeyDurationDays: docSnapshot.journeyDurationDays,
      journeyDurationFormatted: docSnapshot.journeyDurationFormatted,
      totalInvestigations: events.length || visitsToUse.reduce((acc, v) => acc + (v.testsOrdered?.length || 0), 0),
      inconclusiveInvestigations: inconclusive.length,
      specialtiesVisited: docSnapshot.specialties,
      keySignals,
      suspectedStagnationPattern: docSnapshot.stagnationFlag
        ? 'Diagnostic Stagnation Pattern: Recurring complaints with serial normal tier-1 screenings, high note ambiguity, and care fragmentation across specialties.'
        : 'Convergent Diagnostic Trajectory: Linear clinical progression toward diagnostic closure.',
      duplicateTestPreventionAlert: duplicateAlert,
      recommendedConsultationAction: docSnapshot.queueRecommendations.operationalAction,
      recommendedInvestigationsToConsider: [
        'Multi-sequence Contrast MRI / MRCP or targeted biomarker profiling',
        'Comprehensive Autoimmune & Seronegative Inflammatory Panel',
        'Direct Senior Multidisciplinary Diagnostic Board Review',
      ],
      dpsSlope: docSnapshot.dpsSlope,
      explainability: docSnapshot.explainability,
      queueRecommendations: docSnapshot.queueRecommendations,
      generatedAt: new Date().toISOString(),
    };
  }

  // =========================================================================
  // DEMO MODE: 3 SPECIFIED PATIENT TYPES
  // =========================================================================
  /**
   * 3 dedicated demo profiles:
   * 1. NORMAL: DPS improving (48 -> 68 -> 84 -> 92)
   * 2. STAGNATING: DPS flat / decreasing (71 -> 69 -> 65 -> 64 -> 63 -> 63)
   * 3. RECOVERING: DPS initially flat, then improves after referral (62 -> 61 -> 60 -> 60 -> 78 -> 92)
   */
  static readonly DEMO_PATIENTS = {
    NORMAL: {
      type: 'NORMAL' as const,
      label: 'Normal (DPS Improving)',
      description: 'Acute presentation with rapid conclusive diagnosis, low uncertainty, and clear resolution.',
      patient: {
        id: 'demo_normal_rahul',
        fullName: 'Rahul Verma',
        age: 42,
        gender: 'Male' as const,
        phone: '+91 98123 45672',
        maskedPhone: '+91 98XXXXXX72',
        hypotheticalAadhaar: 'XXXX XXXX 9184',
        bloodGroup: 'O+',
        emergencyContact: '+91 98123 00002',
        registeredDate: '2024-07-10',
        hasStagnation: false,
        currentDps: 92,
        uhid: 'ODYSSEY-NRM-9184',
        activeJourneySummary: 'Acute epigastric burning with rapid H. pylori diagnosis and complete symptomatic remission.',
      } as Patient,
      symptoms: [
        {
          id: 'sym_norm_1',
          patientId: 'demo_normal_rahul',
          symptomName: 'Acute Epigastric Burning',
          severity: 6,
          durationDays: 14,
          bodyPart: 'Epigastrium',
          description: 'Postprandial heartburn and gnawing epigastric pain.',
          firstNoticedDate: '2024-07-01',
        }
      ] as Symptom[],
      visits: [
        {
          id: 'vis_norm_1',
          patientId: 'demo_normal_rahul',
          clinicId: 'clinic_apex_1',
          clinicName: 'Odyssey Apex Health Center',
          doctorId: 'doc_arjun_2',
          doctorName: 'Dr. Arjun Shenoy',
          specialty: 'Internal Medicine',
          date: '2024-07-10',
          reason: 'Acute postprandial burning sensation in epigastrium',
          chiefComplaint: 'Epigastric distress',
          status: 'completed' as const,
          diagnosis: 'Suspected acute peptic ulcer disease vs H. pylori gastritis',
          notes: 'Patient reports 10 days of gnawing pain relieved by antacids. Ordered stool antigen test and baseline CBC.',
          prescriptionSummary: 'Proton pump inhibitor (Pantoprazole 40mg od)',
          testsOrdered: ['H. pylori Stool Antigen Test', 'Routine CBC'],
          resolved: false,
        },
        {
          id: 'vis_norm_2',
          patientId: 'demo_normal_rahul',
          clinicId: 'clinic_apex_1',
          clinicName: 'Odyssey Apex Health Center',
          doctorId: 'doc_arjun_2',
          doctorName: 'Dr. Arjun Shenoy',
          specialty: 'Internal Medicine',
          date: '2024-07-24',
          reason: 'Review of lab investigations; persistent mild dyspepsia',
          chiefComplaint: 'Follow-up lab review',
          status: 'completed' as const,
          diagnosis: 'Conclusive: Active Helicobacter pylori associated gastritis',
          notes: 'Stool antigen positive. Initiated standard 14-day clarithromycin triple eradication therapy. Good compliance.',
          prescriptionSummary: '14-Day Triple Therapy (Amoxicillin 1g bd + Clarithromycin 500mg bd + Pantoprazole 40mg bd)',
          testsOrdered: ['Repeat stool antigen at 6 weeks'],
          resolved: false,
        },
        {
          id: 'vis_norm_3',
          patientId: 'demo_normal_rahul',
          clinicId: 'clinic_apex_1',
          clinicName: 'Odyssey Apex Health Center',
          doctorId: 'doc_arjun_2',
          doctorName: 'Dr. Arjun Shenoy',
          specialty: 'Internal Medicine',
          date: '2024-08-20',
          reason: 'Post-eradication follow-up; pain reduced by 85%',
          chiefComplaint: 'Post-treatment follow-up',
          status: 'completed' as const,
          diagnosis: 'Eradication therapy completed • Significant symptomatic improvement',
          notes: 'Pain completely abated. Appetite normalized. Patient tolerating normal diet.',
          prescriptionSummary: 'Tapering dose of Pantoprazole',
          testsOrdered: [],
          resolved: true,
        },
        {
          id: 'vis_norm_4',
          patientId: 'demo_normal_rahul',
          clinicId: 'clinic_apex_1',
          clinicName: 'Odyssey Apex Health Center',
          doctorId: 'doc_arjun_2',
          doctorName: 'Dr. Arjun Shenoy',
          specialty: 'Internal Medicine',
          date: '2024-09-05',
          reason: 'Final clearance checkup; repeat antigen negative',
          chiefComplaint: 'Final discharge visit',
          status: 'completed' as const,
          diagnosis: 'Resolved H. pylori Gastritis • Discharged from active care',
          notes: 'Repeat H. pylori antigen negative. Mucosal healing achieved. Patient discharged in full health.',
          prescriptionSummary: 'PRN antacids only',
          testsOrdered: [],
          resolved: true,
        },
      ] as Visit[],
      events: [
        {
          id: 'evt_norm_1',
          patientId: 'demo_normal_rahul',
          date: '2024-07-12',
          eventType: 'blood_test',
          facility: 'Apex Central Diagnostics',
          title: 'H. pylori Stool Antigen Test',
          resultSummary: 'Positive for H. pylori bacterial antigen',
          isConclusive: true,
          conclusivenessScore: 95,
          findings: 'Definitive microbiological confirmation of H. pylori colonization.',
        }
      ] as DiagnosticEvent[],
    },

    STAGNATING: {
      type: 'STAGNATING' as const,
      label: 'Stagnating (DPS Flat / Decreasing)',
      description: 'Protracted multi-specialty delay loop, repeated complaints, redundant normal scans, and high note ambiguity.',
      patient: {
        id: 'demo_stagnating_priya',
        fullName: 'Priya Sharma',
        age: 34,
        gender: 'Female' as const,
        phone: '+91 98765 43241',
        maskedPhone: '+91 98XXXXXX41',
        hypotheticalAadhaar: 'XXXX XXXX 4982',
        bloodGroup: 'B+',
        emergencyContact: '+91 98765 00001',
        registeredDate: '2024-02-14',
        hasStagnation: true,
        currentDps: 63,
        uhid: 'ODYSSEY-STG-4982',
        activeJourneySummary: '7-Month Diagnostic Odyssey: Intractable bilateral cranial throbbing & facial pressure. 2 normal cranial MRIs across 3 clinical specialties.',
      } as Patient,
      symptoms: [
        {
          id: 'sym_stg_1',
          patientId: 'demo_stagnating_priya',
          symptomName: 'Recurrent Craniofacial Throbbing & Headache',
          severity: 8,
          durationDays: 210,
          bodyPart: 'Head & Face',
          description: 'Intense bilateral frontal throbbing, temporal pressure, and photophobia.',
          firstNoticedDate: '2024-02-10',
        }
      ] as Symptom[],
      visits: [
        {
          id: 'vis_stg_1',
          patientId: 'demo_stagnating_priya',
          clinicId: 'clinic_apex_1',
          clinicName: 'Odyssey Apex Health Center',
          doctorId: 'doc_sharma_1',
          doctorName: 'Dr. A. Sharma',
          specialty: 'General Medicine',
          date: '2024-02-18',
          reason: 'Severe recurrent frontal headache and facial tightness',
          chiefComplaint: 'Persistent headache',
          status: 'completed' as const,
          diagnosis: 'Tension headache vs acute frontal sinusitis',
          notes: 'Patient reports 10 days of throbbing pressure. Etiology unclear. Advised paracetamol and nasal decongestant. Rule out sinusitis.',
          prescriptionSummary: 'Paracetamol 650mg + Xylometazoline nasal spray',
          testsOrdered: ['Complete Blood Count (CBC)', 'Sinus X-Ray'],
          resolved: false,
        },
        {
          id: 'vis_stg_2',
          patientId: 'demo_stagnating_priya',
          clinicId: 'clinic_apex_1',
          clinicName: 'Odyssey Apex Health Center',
          doctorId: 'doc_ananya_3',
          doctorName: 'Dr. Ananya Rao',
          specialty: 'ENT',
          date: '2024-04-02',
          reason: 'Sinus x-ray normal; persistent craniofacial pressure and headache',
          chiefComplaint: 'Recurrent headache & facial pain',
          status: 'completed' as const,
          diagnosis: 'Unspecified craniofacial pain • Normal sinus endoscopy',
          notes: 'Nasal endoscopy shows clear ostiomeatal complex. Possible atypical migraine or trigeminal pain. Etiology uncertain. Advised cranial MRI.',
          prescriptionSummary: 'Naproxen 500mg bd + Flunarizine 5mg nocte',
          testsOrdered: ['Cranial MRI with contrast', 'Pure Tone Audiometry'],
          resolved: false,
        },
        {
          id: 'vis_stg_3',
          patientId: 'demo_stagnating_priya',
          clinicId: 'clinic_apex_1',
          clinicName: 'Odyssey Apex Health Center',
          doctorId: 'doc_vikram_4',
          doctorName: 'Dr. Vikramaditya Sen',
          specialty: 'Neurology',
          date: '2024-05-15',
          reason: 'Review of normal cranial MRI; headache episodes worsening',
          chiefComplaint: 'Persistent throbbing headache',
          status: 'completed' as const,
          diagnosis: 'Suspected chronic migraine with medication overuse headache',
          notes: 'Cranial MRI entirely normal without intracranial lesions. Prescribed topiramate. Patient expressed high anxiety due to lack of diagnostic answers.',
          prescriptionSummary: 'Topiramate 25mg bd + Zolmitriptan PRN',
          testsOrdered: ['Repeat CBC', 'Serum Electrolytes', 'Thyroid Profile'],
          resolved: false,
        },
        {
          id: 'vis_stg_4',
          patientId: 'demo_stagnating_priya',
          clinicId: 'clinic_apex_1',
          clinicName: 'Odyssey Apex Health Center',
          doctorId: 'doc_vikram_4',
          doctorName: 'Dr. Vikramaditya Sen',
          specialty: 'Neurology',
          date: '2024-06-28',
          reason: 'Topiramate discontinued due to cognitive fog; daily headache persists',
          chiefComplaint: 'Intractable daily headache',
          status: 'completed' as const,
          diagnosis: 'Diagnostic Stagnation: Atypical facial pain vs hemicrania continua',
          notes: 'Therapy discontinued due to adverse effects. Etiology remains unclear. Re-evaluated for indomethacin trial. Suspected non-specific cephalalgia.',
          prescriptionSummary: 'Trial of Indomethacin 25mg tds',
          testsOrdered: ['Repeat Cranial MRI with dedicated CISS sequences'],
          resolved: false,
        },
        {
          id: 'vis_stg_5',
          patientId: 'demo_stagnating_priya',
          clinicId: 'clinic_apex_1',
          clinicName: 'Odyssey Apex Health Center',
          doctorId: 'doc_arjun_2',
          doctorName: 'Dr. Arjun Shenoy',
          specialty: 'Internal Medicine',
          date: '2024-08-04',
          reason: 'Indomethacin caused severe dyspepsia; headache unchanged',
          chiefComplaint: 'Chronic headache & gastrointestinal distress',
          status: 'completed' as const,
          diagnosis: 'Care Fragmentation: Recurrent headache with secondary drug intolerance',
          notes: 'Indomethacin stopped. Patient has visited 3 specialties across 180 days with identical symptoms and duplicate normal imaging. Diagnostic impasse.',
          prescriptionSummary: 'Amitriptyline 10mg nocte + PPI',
          testsOrdered: ['ESR', 'CRP', 'Autoimmune Panel (ANA)'],
          resolved: false,
        },
        {
          id: 'vis_stg_6',
          patientId: 'demo_stagnating_priya',
          clinicId: 'clinic_apex_1',
          clinicName: 'Odyssey Apex Health Center',
          doctorId: 'doc_meera_1',
          doctorName: 'Dr. Meera Nambiar',
          specialty: 'Senior Diagnostic Lead',
          date: '2024-09-08',
          reason: 'Priority Stagnation Review routed by Odyssey Queue Policy Engine',
          chiefComplaint: '7-month intractable headache odyssey',
          status: 'in_progress' as const,
          diagnosis: 'Potential diagnostic stagnation flagged: Autoimmune / CSF dynamics review indicated',
          notes: 'DPS trajectory plateaued at 63/100 across 6 encounters. Auto-assigned +10 min buffer. Preparing multidisciplinary consult.',
          prescriptionSummary: 'Under active diagnostic panel synthesis',
          testsOrdered: ['MR Venogram & CSF Pressure Assessment', 'High-titer Autoantibody Panel'],
          resolved: false,
        },
      ] as Visit[],
      events: [
        {
          id: 'evt_stg_1',
          patientId: 'demo_stagnating_priya',
          date: '2024-04-10',
          eventType: 'mri',
          facility: 'Apex Imaging Center',
          title: 'Cranial MRI with IV Contrast',
          resultSummary: 'Normal brain parenchyma and ventricles. No acute intracranial pathology.',
          isConclusive: false,
          conclusivenessScore: 30,
          findings: 'Completely unremarkable brain MRI. Non-diagnostic for headache etiology.',
        },
        {
          id: 'evt_stg_2',
          patientId: 'demo_stagnating_priya',
          date: '2024-07-05',
          eventType: 'mri',
          facility: 'Metro Scans & Labs',
          title: 'Repeat Cranial MRI with CISS Sequences',
          resultSummary: 'Normal repeat cranial MRI. No vascular loops or mass lesions.',
          isConclusive: false,
          conclusivenessScore: 25,
          findings: 'Duplicate normal scan. Findings unchanged from previous MRI 3 months prior.',
        }
      ] as DiagnosticEvent[],
    },

    RECOVERING: {
      type: 'RECOVERING' as const,
      label: 'Recovering (Post-Referral Breakthrough)',
      description: 'Initially flat and stagnant across 4 encounters, followed by prompt resolution after specialized referral.',
      patient: {
        id: 'demo_recovering_kavita',
        fullName: 'Kavita Nair',
        age: 39,
        gender: 'Female' as const,
        phone: '+91 98678 90123',
        maskedPhone: '+91 98XXXXXX23',
        hypotheticalAadhaar: 'XXXX XXXX 3341',
        bloodGroup: 'O-',
        emergencyContact: '+91 98678 00006',
        registeredDate: '2024-02-08',
        hasStagnation: false,
        currentDps: 92,
        uhid: 'ODYSSEY-REC-3341',
        activeJourneySummary: '7-Month Joint Odyssey: Symmetrical polyarthralgia initially stagnant across General Medicine & Orthopedics, resolved post-Rheumatology referral.',
      } as Patient,
      symptoms: [
        {
          id: 'sym_rec_1',
          patientId: 'demo_recovering_kavita',
          symptomName: 'Symmetrical Hand & Wrist Stiffness',
          severity: 7,
          durationDays: 195,
          bodyPart: 'Hands & Wrists',
          description: 'Severe early morning stiffness (>90 minutes), tender metacarpophalangeal joints.',
          firstNoticedDate: '2024-02-01',
        }
      ] as Symptom[],
      visits: [
        {
          id: 'vis_rec_1',
          patientId: 'demo_recovering_kavita',
          clinicId: 'clinic_apex_1',
          clinicName: 'Odyssey Apex Health Center',
          doctorId: 'doc_sharma_1',
          doctorName: 'Dr. A. Sharma',
          specialty: 'General Medicine',
          date: '2024-02-12',
          reason: 'Bilateral hand and wrist stiffness in morning (>1 hour)',
          chiefComplaint: 'Joint pain and morning stiffness',
          status: 'completed' as const,
          diagnosis: 'Non-specific inflammatory polyarthralgia vs overuse strain',
          notes: 'Prescribed NSAIDs. Ordered inflammatory markers and basic rheumatoid factor.',
          prescriptionSummary: 'Aceclofenac 100mg bd',
          testsOrdered: ['ESR', 'CRP', 'Serum Uric Acid'],
          resolved: false,
        },
        {
          id: 'vis_rec_2',
          patientId: 'demo_recovering_kavita',
          clinicId: 'clinic_apex_1',
          clinicName: 'Odyssey Apex Health Center',
          doctorId: 'doc_ananya_3',
          doctorName: 'Dr. Ananya Rao',
          specialty: 'Orthopedics',
          date: '2024-04-14',
          reason: 'Normal uric acid; persistent bilateral hand stiffness and swelling',
          chiefComplaint: 'Hand joint stiffness',
          status: 'completed' as const,
          diagnosis: 'Suspected tenosynovitis vs early seronegative arthropathy',
          notes: 'X-rays of bilateral hands normal. RF negative. Advised wrist splints and intermittent analgesics. Possible early CTD.',
          prescriptionSummary: 'Etoricoxib 90mg od',
          testsOrdered: ['Hand X-Rays', 'Rheumatoid Factor (RF)'],
          resolved: false,
        },
        {
          id: 'vis_rec_3',
          patientId: 'demo_recovering_kavita',
          clinicId: 'clinic_apex_1',
          clinicName: 'Odyssey Apex Health Center',
          doctorId: 'doc_ananya_3',
          doctorName: 'Dr. Ananya Rao',
          specialty: 'Orthopedics',
          date: '2024-05-30',
          reason: 'Stiffness spreading to ankles; NSAIDs losing efficacy',
          chiefComplaint: 'Migratory polyarthralgia',
          status: 'completed' as const,
          diagnosis: 'Unspecified seronegative arthralgia • Stagnation developing',
          notes: 'Repeat RF negative. ESR minimally elevated. Patient expresses frustration at lack of diagnosis. Etiology uncertain.',
          prescriptionSummary: 'Tramadol PRN + Topical gel',
          testsOrdered: ['Repeat ESR & CRP', 'HLA-B27'],
          resolved: false,
        },
        {
          id: 'vis_rec_4',
          patientId: 'demo_recovering_kavita',
          clinicId: 'clinic_apex_1',
          clinicName: 'Odyssey Apex Health Center',
          doctorId: 'doc_sharma_1',
          doctorName: 'Dr. A. Sharma',
          specialty: 'General Medicine',
          date: '2024-07-10',
          reason: 'Review of persistent symptoms; Odyssey Flow flags diagnostic stagnation',
          chiefComplaint: 'Bilateral hand stiffness and fatigue',
          status: 'completed' as const,
          diagnosis: 'Flagged by Odyssey Flow: Recommended referral to Rheumatology',
          notes: 'Odyssey Engine flagged flat DPS (60/100) across 4 visits. Triggered urgent referral to Rheumatology specialist.',
          prescriptionSummary: 'Bridge steroids pending rheumatology intake',
          testsOrdered: ['Urgent Referral to Rheumatology'],
          resolved: false,
        },
        {
          id: 'vis_rec_5',
          patientId: 'demo_recovering_kavita',
          clinicId: 'clinic_apex_1',
          clinicName: 'Odyssey Apex Health Center',
          doctorId: 'doc_meera_1',
          doctorName: 'Dr. Meera Nambiar',
          specialty: 'Rheumatology & Autoimmune Lead',
          date: '2024-08-05',
          reason: 'Post-Referral Consultation: High-titer Anti-CCP and Power Doppler US',
          chiefComplaint: 'Rheumatology referral intake',
          status: 'completed' as const,
          diagnosis: 'Conclusive: Seronegative Erosive Rheumatoid Arthritis (Early Stage)',
          notes: 'Anti-CCP returned strongly positive (>250 U/mL). Power Doppler US confirmed active grade-2 synovitis in bilateral MCP 2 & 3 joints. Definitive diagnosis established.',
          prescriptionSummary: 'Initiated Methotrexate 15mg/week + Folic Acid + low-dose Prednisolone taper',
          testsOrdered: ['Anti-CCP Antibodies', 'High-frequency Synovial Ultrasound'],
          resolved: false,
        },
        {
          id: 'vis_rec_6',
          patientId: 'demo_recovering_kavita',
          clinicId: 'clinic_apex_1',
          clinicName: 'Odyssey Apex Health Center',
          doctorId: 'doc_meera_1',
          doctorName: 'Dr. Meera Nambiar',
          specialty: 'Rheumatology & Autoimmune Lead',
          date: '2024-09-02',
          reason: '4-week follow-up post-DMARD initiation; morning stiffness resolved',
          chiefComplaint: 'Post-treatment response follow-up',
          status: 'completed' as const,
          diagnosis: 'Clinical Remission on DMARD Therapy • Excellent Treatment Response',
          notes: 'Morning stiffness reduced to under 10 minutes. Synovial swelling completely resolved. Inflammatory markers normalized. Trajectory fully converged.',
          prescriptionSummary: 'Continue Methotrexate maintenance',
          testsOrdered: ['Quarterly CBC and LFT monitoring'],
          resolved: true,
        },
      ] as Visit[],
      events: [
        {
          id: 'evt_rec_1',
          patientId: 'demo_recovering_kavita',
          date: '2024-08-06',
          eventType: 'blood_test',
          facility: 'Rheumatology Advanced Serology Lab',
          title: 'Anti-Cyclic Citrullinated Peptide (Anti-CCP)',
          resultSummary: 'Strongly Positive (>250 U/mL; ref < 20)',
          isConclusive: true,
          conclusivenessScore: 98,
          findings: 'High specificity diagnostic confirmation for early inflammatory erosive arthritis.',
        },
        {
          id: 'evt_rec_2',
          patientId: 'demo_recovering_kavita',
          date: '2024-08-07',
          eventType: 'ultrasound',
          facility: 'Joint Imaging Center',
          title: 'Power Doppler Ultrasound Hands & Wrists',
          resultSummary: 'Grade 2 Synovial Hypertrophy with active Doppler vascularity',
          isConclusive: true,
          conclusivenessScore: 95,
          findings: 'Definitive imaging evidence of active inflammatory synovitis.',
        }
      ] as DiagnosticEvent[],
    }
  };
}
