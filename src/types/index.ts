export type QueueStatus = 'waiting' | 'called' | 'in_consultation' | 'completed' | 'cancelled' | 'skipped' | 'needs_review';
export type TokenPriority = 'standard' | 'priority_stagnation' | 'senior_mdis';
export type DoctorStatus = 'consulting' | 'reviewing_history' | 'finishing_consult' | 'preparing' | 'break';

export interface Clinic {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  phone: string;
  specialties: string[];
  queueCount: number;
  activeDoctorsCount: number;
  averageWaitMin: number;
  rating: number;
  isOpen: boolean;
}

export interface Doctor {
  id: string;
  clinicId: string;
  name: string;
  specialty: string;
  room: string;
  avatarUrl: string;
  status: DoctorStatus;
  currentPatientToken?: string;
  experienceYears: number;
  qualification: string;
  patientsSeenToday: number;
}

export interface DoctorShift {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  shiftName: 'Morning' | 'Afternoon' | 'Evening';
  startTime: string;
  endTime: string;
  room: string;
  maxPatients: number;
  currentPatientCount: number;
  isActive: boolean;
}

export interface Patient {
  id: string;
  name?: string;
  fullName: string;
  phone: string;
  maskedPhone: string;
  masked_identity_reference?: string;
  consent_status?: 'granted' | 'pending' | 'revoked';
  hypotheticalAadhaar: string; // strictly fake/demo value e.g. "DEMO-IND-XXXX-2741"
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  bloodGroup: string;
  emergencyContact: string;
  registeredDate: string;
  hasStagnation: boolean;
  currentDps: number;
  activeJourneySummary?: string;
  uhid?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Symptom {
  id: string;
  patientId: string;
  visitId?: string;
  symptomName: string;
  severity: number; // 1 to 10
  durationDays: number;
  bodyPart: string;
  description: string;
  firstNoticedDate: string;
  created_at?: string;
}

export interface DiagnosticEvent {
  id: string;
  patientId: string;
  patient_id?: string;
  visitId?: string;
  visit_id?: string;
  date: string;
  event_date?: string;
  eventType: 'blood_test' | 'mri' | 'ct_scan' | 'xray' | 'ultrasound' | 'endoscopy' | 'biopsy' | 'specialist_consult' | string;
  event_type?: string;
  specialty?: string;
  complaint?: string;
  investigation?: string;
  hypothesis?: string;
  note_text?: string;
  facility: string;
  title: string;
  resultSummary: string;
  isConclusive: boolean;
  conclusivenessScore: number; // 0 to 100 (low means inconclusive)
  findings: string;
  orderedBy?: string;
  created_at?: string;
}

export interface DiagnosticSignal {
  id: string;
  patientId: string;
  signalType: 
    | 'repeated_complaint' 
    | 'specialist_transition' 
    | 'test_redundancy' 
    | 'hypothesis_instability' 
    | 'note_uncertainty' 
    | 'treatment_non_resolution'
    | 'unresolved_duration' 
    | 'repeated_unyielding_tests' 
    | 'cross_specialty_loop' 
    | 'symptom_divergence' 
    | 'test_delay';
  severity: 'low' | 'moderate' | 'high' | 'critical';
  title: string;
  description: string;
  detectedAt: string;
  metricValue: string;
}

export interface DpsSnapshot {
  id: string;
  patientId: string;
  patient_id?: string;
  visitId?: string;
  visit_id?: string;
  score: number; // 0 to 100
  repeat_complaint_score?: number;
  uncertainty_score?: number;
  redundancy_score?: number;
  specialist_transition_score?: number;
  hypothesis_entropy?: number;
  treatment_nonresolution_score?: number;
  stagnation_flag?: boolean;
  stagnation_state?: 'STAGNATION_DETECTED' | 'CONVERGING' | 'MONITORING' | 'RECOVERING';
  dps_slope?: number;
  confidence?: number | string;
  stagnationRisk: 'optimal' | 'moderate' | 'high_stagnation' | 'critical_loop';
  factors: {
    durationPenalty: number;
    inconclusiveTestPenalty: number;
    specialtyPingPongPenalty: number;
    symptomProgressionPenalty: number;
  };
  recommendation: string;
  suggestedAction: 'standard_queue' | 'senior_consultant_review' | 'multidisciplinary_panel' | 'advanced_imaging_triage';
  calculatedAt: string;
  created_at?: string;
}

export interface Token {
  id: string;
  visit_id?: string;
  visitId?: string;
  clinic_id?: string;
  doctor_id?: string;
  tokenNumber: string; // e.g. "A-104", "B-205", "A-27"
  token_number?: string;
  patientId: string;
  patient_id?: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  clinicId: string;
  clinicName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  roomNumber?: string;
  status: QueueStatus | 'created' | 'waiting' | 'called' | 'in_treatment' | 'skipped' | 'completed' | 'cancelled';
  priority: TokenPriority | string;
  queuePosition: number;
  queue_position?: number;
  estimatedWaitMin: number;
  estimated_wait_minutes?: number;
  sanctuary_state?: SanctuaryPulseCode | string;
  checkInTime: string;
  calledTime?: string;
  dpsScore: number;
  stagnationFlag: boolean;
  stagnationReason?: string;
  symptomsSummary: string;
  expectedDuration?: number;
  routing?: string;
  created_at?: string;
  updated_at?: string;
}

export type SanctuaryPulseCode = 
  | 'CHECKIN_CONFIRMED'
  | 'QUEUE_STABLE'
  | 'QUEUE_MOVING'
  | 'DOCTOR_REVIEWING'
  | 'SLIGHT_DELAY'
  | 'ALMOST_YOUR_TURN'
  | 'PLEASE_REPORT'
  | 'YOUR_TURN'
  | 'IN_CONSULTATION'
  | 'COMPLETED'
  | 'DELAY'
  | 'WAITING_FOR_PATIENT';

export type SanctuaryPulseStateCode = SanctuaryPulseCode;

export interface SanctuaryPulseTimelineItem {
  id?: string;
  title: string;
  subtitle?: string;
  label?: string;
  subtext?: string;
  status: 'completed' | 'active' | 'upcoming';
  state?: 'completed' | 'current' | 'upcoming';
  time?: string;
  icon?: string;
}

export interface SanctuaryPulseState {
  stateCode: SanctuaryPulseCode;
  title: string;
  headline: string;
  message: string;
  subtext: string;
  statusBadge: string;
  pulseStatus: 
    | 'checkin_confirmed'
    | 'queue_stable'
    | 'comfortably_on_track'
    | 'queue_moving'
    | 'moving_smoothly'
    | 'doctor_reviewing'
    | 'doctor_reviewing_history'
    | 'slight_delay'
    | 'delay_reported'
    | 'almost_your_turn'
    | 'turn_getting_close'
    | 'please_report'
    | 'start_heading_to_clinic'
    | 'your_turn'
    | 'you_are_next'
    | 'doctor_ready'
    | 'in_consultation'
    | 'visit_completed';
  emotionalPacing: string;
  stage: 'waiting' | 'prep' | 'approaching' | 'imminent' | 'now' | 'consulting' | 'done';
  badgeColor: 'emerald' | 'teal' | 'sky' | 'amber' | 'emerald_bright' | 'rose' | 'indigo' | 'purple';
  estimatedMinutesRemaining: number;
  patientsAhead: number;
  queuePositionLabel: string;
  secondaryEta: string;
  progressPercent: number; // 0 - 100
  doctorCurrentActivity: string;
  arrivalAlert?: {
    type: 'heading' | 'next' | 'report_reception' | 'enter_room' | 'delay';
    title: string;
    message: string;
    urgency?: 'info' | 'warning' | 'urgent';
    cta?: string;
    actionLabel?: string;
  };
  timeline: SanctuaryPulseTimelineItem[];
}

export interface Visit {
  id: string;
  patientId: string;
  patient_id?: string;
  clinicId: string;
  clinic_id?: string;
  clinicName: string;
  doctorId: string;
  doctor_id?: string;
  doctorName: string;
  specialty: string;
  date: string;
  reason: string;
  chiefComplaint?: string;
  outcome?: string;
  status: 'completed' | 'scheduled' | 'cancelled' | 'in_progress' | 'waiting';
  diagnosis?: string;
  notes: string;
  prescriptionSummary?: string;
  testsOrdered?: string[];
  resolved: boolean;
  created_at?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatarUrl?: string;
  clinicId: string;
  clinicName: string;
  clinicAddress: string;
  date: string;
  time: string;
  type: 'in_person' | 'video_call';
  status: 'upcoming' | 'completed' | 'cancelled' | 'rescheduled';
  symptoms?: string;
  roomNumber?: string;
  fee?: number;
}

export interface Referral {
  id: string;
  patientId: string;
  patient_id?: string;
  patientName: string;
  sourceVisitId?: string;
  source_visit_id?: string;
  fromDoctorId: string;
  fromDoctorName: string;
  toSpecialty: string;
  reason: string;
  priority: 'urgent' | 'routine' | 'multidisciplinary' | 'Recommended' | 'recommended' | string;
  status: 'suggested' | 'approved' | 'scheduled' | 'completed' | 'Pending' | 'pending' | string;
  referralToken?: string;
  date: string;
  clinicalNotes: string;
  specialistQueuePosition?: number;
  created_at?: string;
}

export interface BillingRecord {
  id: string;
  tokenNumber: string;
  patientId: string;
  patient_id?: string;
  visitId?: string;
  visit_id?: string;
  patientName: string;
  doctorName?: string;
  clinicName?: string;
  date: string;
  consultation_fee?: number;
  service_fee?: number;
  discount?: number;
  total?: number;
  payment_status?: string;
  payment_mode?: string;
  items: {
    description: string;
    amount: number;
  }[];
  totalAmount: number;
  status: 'paid' | 'pending' | 'insurance_processing';
  paymentMethod?: string;
  created_at?: string;
}

export interface NotificationRecord {
  id: string;
  patientId: string;
  patient_id?: string;
  tokenId?: string;
  token_id?: string;
  pulseHeadline: string;
  pulse_headline?: string;
  emotionalSubtext: string;
  emotional_subtext?: string;
  sentAt: string;
  sent_at?: string;
  read: boolean;
  createdAt?: string;
  created_at?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: 'queue' | 'patient' | 'token' | 'dps' | 'doctor' | 'billing' | 'settings' | 'referral';
  entityId: string;
  performedBy: string;
  timestamp: string;
  details: string;
  deviceIp?: string;
  patientName?: string;
}

export interface ClinicSettings {
  clinicName: string;
  address: string;
  contactNumber: string;
  departments: string[];
  defaultConsultationMin: number;
  extendedConsultationMin: number;
  seniorReviewThresholdDPS: number;
  queuePolicy: 'dps_stagnation_priority' | 'strict_fifo' | 'acuity_first';
  notificationSMS: boolean;
  pulseEmpatheticPacing: boolean;
  autoCallEnabled: boolean;
  maxPatientsPerShift: number;
}
