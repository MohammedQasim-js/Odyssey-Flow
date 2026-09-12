import { 
  Clinic, Doctor, DoctorShift, Patient, Visit, Token, Symptom, 
  DiagnosticEvent, DiagnosticSignal, DpsSnapshot, Referral, BillingRecord, AuditLog, ClinicSettings,
  SanctuaryPulseStateCode, Appointment
} from '../types';
import { cache, CACHE_KEYS } from './storage';
import { DpsEngine } from './dpsEngine';
import { SupabaseService } from './supabaseService';
import { isSupabaseConfigured } from './supabaseClient';

export const DEFAULT_CLINIC_SETTINGS: ClinicSettings = {
  clinicName: 'Odyssey Apex Health Center',
  address: '104 Indiranagar Double Road, Stage 2, Bengaluru, Karnataka 560038',
  contactNumber: '+91 80 4920 1800',
  departments: ['Internal Medicine', 'Gastroenterology', 'Neurology', 'Pulmonology', 'Diagnostic Triage'],
  defaultConsultationMin: 10,
  extendedConsultationMin: 15,
  seniorReviewThresholdDPS: 65,
  queuePolicy: 'dps_stagnation_priority',
  notificationSMS: true,
  pulseEmpatheticPacing: true,
  autoCallEnabled: false,
  maxPatientsPerShift: 30,
};

// ==========================================
// SEED DATA: Realistic Healthcare Ecosystem
// ==========================================

export const INITIAL_CLINICS: Clinic[] = [
  {
    id: 'clinic_odyssey_care',
    name: 'Odyssey Care Clinic',
    code: 'ODYSSEY-BLR-00',
    address: 'Indiranagar 100ft Road, Stage 2, Bengaluru',
    city: 'Bengaluru, Karnataka',
    phone: '+91 80 4910 2200',
    specialties: ['General Medicine', 'Internal Medicine', 'Family Health'],
    queueCount: 18,
    activeDoctorsCount: 3,
    averageWaitMin: 24,
    rating: 4.8,
    isOpen: true,
  },
  {
    id: 'clinic_apex_1',
    name: 'Odyssey Apex Health Center',
    code: 'ODYSSEY-BLR-01',
    address: '100 Feet Road, HAL 2nd Stage, Indiranagar',
    city: 'Bengaluru, Karnataka',
    phone: '+91 80 4122 8900',
    specialties: ['Internal Medicine', 'Gastroenterology & Hepatology', 'Neurology', 'Diagnostic Triage'],
    queueCount: 4,
    activeDoctorsCount: 3,
    averageWaitMin: 14,
    rating: 4.9,
    isOpen: true,
  },
  {
    id: 'clinic_sanctuary_2',
    name: 'Sanctuary Multispecialty Clinic',
    code: 'SANCTUARY-BLR-02',
    address: '4th Block, 80 Feet Road, Koramangala',
    city: 'Bengaluru, Karnataka',
    phone: '+91 80 2553 4411',
    specialties: ['General Medicine', 'Cardiology', 'Pediatrics', 'Endocrinology'],
    queueCount: 6,
    activeDoctorsCount: 2,
    averageWaitMin: 22,
    rating: 4.7,
    isOpen: true,
  },
];

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc_sharma_1',
    clinicId: 'clinic_odyssey_care',
    name: 'Dr. A. Sharma',
    specialty: 'General Medicine',
    room: '101',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    status: 'reviewing_history',
    experienceYears: 15,
    qualification: 'MBBS, MD (General Medicine)',
    patientsSeenToday: 18,
  },
  {
    id: 'doc_meera_1',
    clinicId: 'clinic_apex_1',
    name: 'Dr. Meera Nambiar',
    specialty: 'Senior Gastroenterologist & Diagnostic Lead',
    room: '104',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    status: 'reviewing_history',
    experienceYears: 18,
    qualification: 'MD, DM (Gastroenterology), AIIMS New Delhi',
    patientsSeenToday: 14,
  },
  {
    id: 'doc_arjun_2',
    clinicId: 'clinic_apex_1',
    name: 'Dr. Arjun Shenoy',
    specialty: 'Consultant Internal Medicine',
    room: '102',
    avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300',
    status: 'consulting',
    experienceYears: 12,
    qualification: 'MBBS, MD (General Medicine)',
    patientsSeenToday: 19,
  },
  {
    id: 'doc_ananya_3',
    clinicId: 'clinic_apex_1',
    name: 'Dr. Ananya Rao',
    specialty: 'Diagnostic Triage & Clinical Specialist',
    room: '106',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813637-c7a6e1189c4d?auto=format&fit=crop&q=80&w=300',
    status: 'finishing_consult',
    experienceYears: 9,
    qualification: 'MD, DNB (Internal Medicine)',
    patientsSeenToday: 11,
  },
  {
    id: 'doc_vikram_4',
    clinicId: 'clinic_apex_1',
    name: 'Dr. Vikramaditya Sen',
    specialty: 'Consultant Neurologist',
    room: '201',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',
    status: 'consulting',
    experienceYears: 16,
    qualification: 'MD, DM (Neurology), NIMHANS',
    patientsSeenToday: 15,
  },
  {
    id: 'doc_priya_5',
    clinicId: 'clinic_apex_1',
    name: 'Dr. Priya Kulkarni',
    specialty: 'Pulmonology & Respiratory Medicine',
    room: '203',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    status: 'consulting',
    experienceYears: 11,
    qualification: 'MBBS, MD (Pulmonology)',
    patientsSeenToday: 12,
  },
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat_aarav_0',
    name: 'Aarav Mehta',
    fullName: 'Aarav Mehta',
    phone: '+91 98765 43242',
    maskedPhone: '+91 98XXXXXX42',
    masked_identity_reference: 'DEMO-IND-XXXX-2741',
    consent_status: 'granted',
    hypotheticalAadhaar: 'XXXX XXXX 2741',
    age: 32,
    gender: 'Male',
    bloodGroup: 'O+',
    emergencyContact: '+91 98123 00002',
    registeredDate: '2024-01-10',
    hasStagnation: true,
    currentDps: 63,
    activeJourneySummary: '8-month diagnostic odyssey: Persistent headache refractory across 3 specialties with 2 repeated scans. Stagnation flagged.',
  },
  {
    id: 'pat_priya_1',
    name: 'Priya Sharma',
    fullName: 'Priya Sharma',
    phone: '+91 98765 43241',
    maskedPhone: '+91 98XXXXXX41',
    masked_identity_reference: 'DEMO-IND-XXXX-4982',
    consent_status: 'granted',
    hypotheticalAadhaar: 'XXXX XXXX 4982',
    age: 34,
    gender: 'Female',
    bloodGroup: 'B+',
    emergencyContact: '+91 98765 00001',
    registeredDate: '2024-03-12',
    hasStagnation: true,
    currentDps: 38,
    activeJourneySummary: '6-Month Diagnostic Odyssey: Recurrent right upper quadrant pain and nausea. 3 previous ultrasounds inconclusive. Visited 3 facilities without resolution.',
  },
  {
    id: 'pat_rahul_2',
    name: 'Rahul Verma',
    fullName: 'Rahul Verma',
    phone: '+91 98123 45672',
    maskedPhone: '+91 98XXXXXX72',
    masked_identity_reference: 'DEMO-IND-XXXX-9184',
    consent_status: 'granted',
    hypotheticalAadhaar: 'XXXX XXXX 9184',
    age: 42,
    gender: 'Male',
    bloodGroup: 'O+',
    emergencyContact: '+91 98123 00002',
    registeredDate: '2024-08-19',
    hasStagnation: false,
    currentDps: 88,
    activeJourneySummary: 'Acute 3-day epigastric burning following diet change. Normal preliminary screening.',
  },
  {
    id: 'pat_sunita_3',
    name: 'Sunita Deshmukh',
    fullName: 'Sunita Deshmukh',
    phone: '+91 98234 56789',
    maskedPhone: '+91 98XXXXXX89',
    masked_identity_reference: 'DEMO-IND-XXXX-5532',
    consent_status: 'granted',
    hypotheticalAadhaar: 'XXXX XXXX 5532',
    age: 58,
    gender: 'Female',
    bloodGroup: 'A+',
    emergencyContact: '+91 98234 00003',
    registeredDate: '2024-01-05',
    hasStagnation: false,
    currentDps: 74,
    activeJourneySummary: 'Routine hypertension follow-up and intermittent vestibular dizziness.',
  },
  {
    id: 'pat_devendra_4',
    name: 'Devendra Patel',
    fullName: 'Devendra Patel',
    phone: '+91 98456 78901',
    maskedPhone: '+91 98XXXXXX01',
    masked_identity_reference: 'DEMO-IND-XXXX-1149',
    consent_status: 'granted',
    hypotheticalAadhaar: 'XXXX XXXX 1149',
    age: 29,
    gender: 'Male',
    bloodGroup: 'AB+',
    emergencyContact: '+91 98456 00004',
    registeredDate: '2024-07-22',
    hasStagnation: false,
    currentDps: 82,
    activeJourneySummary: 'Post-viral fatigue and mild dry cough for 10 days.',
  },
  {
    id: 'pat_vikram_5',
    name: 'Vikram Rao',
    fullName: 'Vikram Rao',
    phone: '+91 98567 89012',
    maskedPhone: '+91 98XXXXXX12',
    masked_identity_reference: 'DEMO-IND-XXXX-8823',
    consent_status: 'granted',
    hypotheticalAadhaar: 'XXXX XXXX 8823',
    age: 47,
    gender: 'Male',
    bloodGroup: 'A+',
    emergencyContact: '+91 98567 00005',
    registeredDate: '2023-11-14',
    hasStagnation: true,
    currentDps: 32,
    activeJourneySummary: '9-Month Diagnostic Odyssey: Episodic severe vertigo, unilateral tinnitus and unsteadiness. 2 normal brain MRIs, ENT vestibular tests unyielding.',
  },
  {
    id: 'pat_kavita_6',
    name: 'Kavita Nair',
    fullName: 'Kavita Nair',
    phone: '+91 98678 90123',
    maskedPhone: '+91 98XXXXXX23',
    masked_identity_reference: 'DEMO-IND-XXXX-3341',
    consent_status: 'granted',
    hypotheticalAadhaar: 'XXXX XXXX 3341',
    age: 39,
    gender: 'Female',
    bloodGroup: 'O-',
    emergencyContact: '+91 98678 00006',
    registeredDate: '2024-02-08',
    hasStagnation: true,
    currentDps: 41,
    activeJourneySummary: '7-Month Diagnostic Odyssey: Migratory symmetrical polyarthralgia and low-grade pyrexia. Multiple equivocal ANA titers and normal acute phase reactants.',
  },
  {
    id: 'pat_amit_7',
    name: 'Amit Trivedi',
    fullName: 'Amit Trivedi',
    phone: '+91 98789 01234',
    maskedPhone: '+91 98XXXXXX34',
    masked_identity_reference: 'DEMO-IND-XXXX-6712',
    consent_status: 'granted',
    hypotheticalAadhaar: 'XXXX XXXX 6712',
    age: 36,
    gender: 'Male',
    bloodGroup: 'B+',
    emergencyContact: '+91 98789 00007',
    registeredDate: '2024-05-18',
    hasStagnation: false,
    currentDps: 85,
    activeJourneySummary: 'Seasonal allergic rhinitis and mild throat irritation.',
  },
  {
    id: 'pat_deepa_8',
    name: 'Deepa Sundaram',
    fullName: 'Deepa Sundaram',
    phone: '+91 98890 12345',
    maskedPhone: '+91 98XXXXXX45',
    masked_identity_reference: 'DEMO-IND-XXXX-9904',
    consent_status: 'granted',
    hypotheticalAadhaar: 'XXXX XXXX 9904',
    age: 51,
    gender: 'Female',
    bloodGroup: 'A-',
    emergencyContact: '+91 98890 00008',
    registeredDate: '2023-09-30',
    hasStagnation: false,
    currentDps: 78,
    activeJourneySummary: 'Type-2 diabetes glycaemic optimization and quarterly HbA1c review.',
  },
  {
    id: 'pat_rohit_9',
    name: 'Rohit Kulkarni',
    fullName: 'Rohit Kulkarni',
    phone: '+91 98901 23456',
    maskedPhone: '+91 98XXXXXX56',
    masked_identity_reference: 'DEMO-IND-XXXX-4567',
    consent_status: 'granted',
    hypotheticalAadhaar: 'XXXX XXXX 4567',
    age: 28,
    gender: 'Male',
    bloodGroup: 'O+',
    emergencyContact: '+91 98901 00009',
    registeredDate: '2024-08-01',
    hasStagnation: false,
    currentDps: 92,
    activeJourneySummary: 'Pre-marathon cardiovascular endurance and fitness clearance.',
  },
  {
    id: 'pat_ananya_10',
    name: 'Ananya Bose',
    fullName: 'Ananya Bose',
    phone: '+91 98012 34567',
    maskedPhone: '+91 98XXXXXX67',
    masked_identity_reference: 'DEMO-IND-XXXX-8921',
    consent_status: 'granted',
    hypotheticalAadhaar: 'XXXX XXXX 8921',
    age: 45,
    gender: 'Female',
    bloodGroup: 'B-',
    emergencyContact: '+91 98012 00010',
    registeredDate: '2024-06-11',
    hasStagnation: false,
    currentDps: 71,
    activeJourneySummary: 'Work-related insomnia and intermittent tension headaches.',
  },
  {
    id: 'pat_suresh_11',
    name: 'Suresh Menon',
    fullName: 'Suresh Menon',
    phone: '+91 98123 98765',
    maskedPhone: '+91 98XXXXXX65',
    masked_identity_reference: 'DEMO-IND-XXXX-1234',
    consent_status: 'granted',
    hypotheticalAadhaar: 'XXXX XXXX 1234',
    age: 63,
    gender: 'Male',
    bloodGroup: 'AB-',
    emergencyContact: '+91 98123 00011',
    registeredDate: '2023-12-05',
    hasStagnation: false,
    currentDps: 69,
    activeJourneySummary: 'Bilateral knee osteoarthritis monitoring and physiotherapy titration.',
  },
  {
    id: 'pat_manoj_12',
    name: 'Manoj Joshi',
    fullName: 'Manoj Joshi',
    phone: '+91 98234 87654',
    maskedPhone: '+91 98XXXXXX54',
    masked_identity_reference: 'DEMO-IND-XXXX-5678',
    consent_status: 'granted',
    hypotheticalAadhaar: 'XXXX XXXX 5678',
    age: 38,
    gender: 'Male',
    bloodGroup: 'A+',
    emergencyContact: '+91 98234 00012',
    registeredDate: '2024-07-15',
    hasStagnation: false,
    currentDps: 84,
    activeJourneySummary: 'Functional dyspepsia secondary to shift-work sleep patterns.',
  },
  {
    id: 'pat_meenakshi_13',
    name: 'Meenakshi Pillai',
    fullName: 'Meenakshi Pillai',
    phone: '+91 98345 76543',
    maskedPhone: '+91 98XXXXXX43',
    masked_identity_reference: 'DEMO-IND-XXXX-9012',
    consent_status: 'granted',
    hypotheticalAadhaar: 'XXXX XXXX 9012',
    age: 55,
    gender: 'Female',
    bloodGroup: 'O+',
    emergencyContact: '+91 98345 00013',
    registeredDate: '2024-03-22',
    hasStagnation: false,
    currentDps: 77,
    activeJourneySummary: 'Primary hypothyroidism annual dosage review with stable TSH levels.',
  },
  {
    id: 'pat_aravind_14',
    name: 'Aravind Swamy',
    fullName: 'Aravind Swamy',
    phone: '+91 98456 65432',
    maskedPhone: '+91 98XXXXXX32',
    masked_identity_reference: 'DEMO-IND-XXXX-3456',
    consent_status: 'granted',
    hypotheticalAadhaar: 'XXXX XXXX 3456',
    age: 41,
    gender: 'Male',
    bloodGroup: 'B+',
    emergencyContact: '+91 98456 00014',
    registeredDate: '2024-04-05',
    hasStagnation: false,
    currentDps: 89,
    activeJourneySummary: 'Executive annual health screen and preventive cardiac wellness review.',
  },
  {
    id: 'pat_shreya_15',
    name: 'Shreya Kapoor',
    fullName: 'Shreya Kapoor',
    phone: '+91 98567 54321',
    maskedPhone: '+91 98XXXXXX21',
    masked_identity_reference: 'DEMO-IND-XXXX-7890',
    consent_status: 'granted',
    hypotheticalAadhaar: 'XXXX XXXX 7890',
    age: 26,
    gender: 'Female',
    bloodGroup: 'A+',
    emergencyContact: '+91 98567 00015',
    registeredDate: '2024-08-10',
    hasStagnation: false,
    currentDps: 83,
    activeJourneySummary: 'Episodic migraine without aura responding to triptans.',
  },
  {
    id: 'pat_harish_16',
    name: 'Harish Chawla',
    fullName: 'Harish Chawla',
    phone: '+91 98678 43210',
    maskedPhone: '+91 98XXXXXX10',
    masked_identity_reference: 'DEMO-IND-XXXX-2345',
    consent_status: 'granted',
    hypotheticalAadhaar: 'XXXX XXXX 2345',
    age: 67,
    gender: 'Male',
    bloodGroup: 'O-',
    emergencyContact: '+91 98678 00016',
    registeredDate: '2024-01-18',
    hasStagnation: false,
    currentDps: 72,
    activeJourneySummary: 'Essential benign tremor follow-up; stable neurological baseline.',
  },
  {
    id: 'pat_neha_17',
    name: 'Neha Singhal',
    fullName: 'Neha Singhal',
    phone: '+91 98789 32109',
    maskedPhone: '+91 98XXXXXX09',
    masked_identity_reference: 'DEMO-IND-XXXX-6789',
    consent_status: 'granted',
    hypotheticalAadhaar: 'XXXX XXXX 6789',
    age: 31,
    gender: 'Female',
    bloodGroup: 'B+',
    emergencyContact: '+91 98789 00017',
    registeredDate: '2024-05-25',
    hasStagnation: false,
    currentDps: 86,
    activeJourneySummary: 'Postpartum microcytic hypochromic anemia improving with oral iron.',
  },
  {
    id: 'pat_rajesh_18',
    name: 'Rajesh Bhatt',
    fullName: 'Rajesh Bhatt',
    phone: '+91 98890 21098',
    maskedPhone: '+91 98XXXXXX98',
    masked_identity_reference: 'DEMO-IND-XXXX-0123',
    consent_status: 'granted',
    hypotheticalAadhaar: 'XXXX XXXX 0123',
    age: 53,
    gender: 'Male',
    bloodGroup: 'A+',
    emergencyContact: '+91 98890 00018',
    registeredDate: '2023-10-12',
    hasStagnation: false,
    currentDps: 79,
    activeJourneySummary: 'Mild hypertriglyceridemia dietary follow-up and lipid retest.',
  },
  {
    id: 'pat_pooja_19',
    name: 'Pooja Hegde',
    fullName: 'Pooja Hegde',
    phone: '+91 98901 10987',
    maskedPhone: '+91 98XXXXXX87',
    masked_identity_reference: 'DEMO-IND-XXXX-4560',
    consent_status: 'granted',
    hypotheticalAadhaar: 'XXXX XXXX 4560',
    age: 35,
    gender: 'Female',
    bloodGroup: 'AB+',
    emergencyContact: '+91 98901 00019',
    registeredDate: '2024-08-05',
    hasStagnation: false,
    currentDps: 88,
    activeJourneySummary: 'Localized contact dermatitis forearm responding well to topical emollient.',
  },
  {
    id: 'pat_ganesh_20',
    name: 'Ganesh Natarajan',
    fullName: 'Ganesh Natarajan',
    phone: '+91 98012 09876',
    maskedPhone: '+91 98XXXXXX76',
    masked_identity_reference: 'DEMO-IND-XXXX-8901',
    consent_status: 'granted',
    hypotheticalAadhaar: 'XXXX XXXX 8901',
    age: 49,
    gender: 'Male',
    bloodGroup: 'O+',
    emergencyContact: '+91 98012 00020',
    registeredDate: '2024-06-20',
    hasStagnation: false,
    currentDps: 81,
    activeJourneySummary: 'Acute paravertebral lumbar strain after weightlifting; no radiculopathy.',
  },
  {
    id: 'pat_fatima_21',
    name: 'Fatima Zahra',
    fullName: 'Fatima Zahra',
    phone: '+91 98123 11223',
    maskedPhone: '+91 98XXXXXX23',
    masked_identity_reference: 'DEMO-IND-XXXX-3450',
    consent_status: 'granted',
    hypotheticalAadhaar: 'XXXX XXXX 3450',
    age: 44,
    gender: 'Female',
    bloodGroup: 'A-',
    emergencyContact: '+91 98123 00021',
    registeredDate: '2024-07-01',
    hasStagnation: false,
    currentDps: 75,
    activeJourneySummary: 'Recurrent minor aphthous stomatitis; serum ferritin and folate normal.',
  },
];

export const INITIAL_DIAGNOSTIC_EVENTS: DiagnosticEvent[] = [
  // Priya Sharma's extensive inconclusive timeline (Diagnostic Stagnation demonstration)
  {
    id: 'evt_p1',
    patientId: 'pat_priya_1',
    date: '2024-03-20',
    eventType: 'blood_test',
    facility: 'Apex Diagnostics Indiranagar',
    title: 'Complete Metabolic & Liver Function Panel',
    resultSummary: 'Bilirubin, ALT, AST, ALP within normal clinical range. Mild ESR elevation (18 mm/hr).',
    isConclusive: false,
    conclusivenessScore: 25,
    findings: 'Non-specific markers. Did not localize cause of acute episodic RUQ pain.',
    orderedBy: 'Dr. R. K. Gupta',
  },
  {
    id: 'evt_p2',
    patientId: 'pat_priya_1',
    date: '2024-05-14',
    eventType: 'ultrasound',
    facility: 'Metro Scans Koramangala',
    title: 'Whole Abdomen & Gallbladder Ultrasound',
    resultSummary: 'No definitive gallstones visualized. Gallbladder wall thickness normal (<3mm). CBD caliber 4mm.',
    isConclusive: false,
    conclusivenessScore: 30,
    findings: 'Reported normal despite patient experiencing 8/10 biliary colic during examination.',
    orderedBy: 'Dr. Vivek Menon',
  },
  {
    id: 'evt_p3',
    patientId: 'pat_priya_1',
    date: '2024-07-02',
    eventType: 'endoscopy',
    facility: 'Sanctuary Specialty Hospital',
    title: 'Upper GI Endoscopy (EGD)',
    resultSummary: 'Mild mucosal erythema in gastric antrum. No active ulceration or H. pylori gross signs.',
    isConclusive: false,
    conclusivenessScore: 35,
    findings: 'Inconclusive for primary etiology. Prescribed PPI with no symptomatic relief.',
    orderedBy: 'Dr. K. Swaminathan',
  },
  {
    id: 'evt_p4',
    patientId: 'pat_priya_1',
    date: '2024-08-28',
    eventType: 'ultrasound',
    facility: 'CareFirst Diagnostic Imaging',
    title: 'Repeat Focused RUQ Ultrasound',
    resultSummary: 'Repeat scan: No obvious calculus or acoustic shadowing. Subtle sludge suspected but equivocal.',
    isConclusive: false,
    conclusivenessScore: 20,
    findings: 'Repeated same tier investigation yielding zero clinical closure.',
    orderedBy: 'Walk-in Urgent Care',
  },
  // Rahul Verma's normal test
  {
    id: 'evt_r1',
    patientId: 'pat_rahul_2',
    date: '2024-08-20',
    eventType: 'blood_test',
    facility: 'Odyssey Lab',
    title: 'Routine CBC & Stool Examination',
    resultSummary: 'Normal leukocytes, no occult blood. Consistent with transient acute gastritis.',
    isConclusive: true,
    conclusivenessScore: 90,
    findings: 'Consistent acute presentation. Resolving under antacid regimen.',
    orderedBy: 'Dr. Arjun Shenoy',
  },
  // Aarav Mehta's Diagnostic Events (6 encounters, 3 specialties, 2 repeated tests, uncertainty markers)
  {
    id: 'evt_aarav_1',
    patientId: 'pat_aarav_0',
    date: '2024-01-18',
    eventType: 'blood_test',
    facility: 'Apex Central Diagnostics',
    title: 'Comprehensive Metabolic Panel & Complete Blood Count',
    resultSummary: 'All hematological parameters within standard limits. Normal ESR & CRP.',
    isConclusive: false,
    conclusivenessScore: 40,
    findings: 'Etiology of persistent occipital headaches unresolved. Non-specific tension symptoms.',
    orderedBy: 'Dr. Arjun Shenoy',
  },
  {
    id: 'evt_aarav_2',
    patientId: 'pat_aarav_0',
    date: '2024-03-20',
    eventType: 'mri',
    facility: 'Metro Diagnostic Imaging Center',
    title: 'Non-contrast Brain MRI (Repeated Test 1)',
    resultSummary: 'Unremarkable brain parenchyma. No acute infarction, hemorrhage, or mass effect. Inconclusive for pain etiology.',
    isConclusive: false,
    conclusivenessScore: 45,
    findings: 'Normal anatomical structure. Pain mechanism remains ambiguous. Uncertainty marker: subjective cephalalgia without radiological correlate.',
    orderedBy: 'Dr. Priya Desai',
  },
  {
    id: 'evt_aarav_3',
    patientId: 'pat_aarav_0',
    date: '2024-07-30',
    eventType: 'endoscopy',
    facility: 'Apex Sinus & Head Center',
    title: 'Diagnostic Nasal Endoscopy (Repeated Test 2)',
    resultSummary: 'Nasal cavity and osteomeatal complexes clear. No sinus inflammation or polyps. Inconclusive for headache cause.',
    isConclusive: false,
    conclusivenessScore: 42,
    findings: 'Sinugenic origin ruled out. Repeated negative workup. Elevated clinical uncertainty.',
    orderedBy: 'Dr. R. K. Gupta',
  },
  // Vikram Rao's 9-Month Diagnostic Odyssey Events (Stagnation Case 2)
  {
    id: 'evt_v1',
    patientId: 'pat_vikram_5',
    date: '2024-01-15',
    eventType: 'mri',
    facility: 'Apex Advanced Imaging Center',
    title: 'Brain MRI with Internal Auditory Canal (IAC) Thin Slices',
    resultSummary: 'No vestibular schwannoma (acoustic neuroma). Cerebellopontine angles clear. Ventricles normal.',
    isConclusive: false,
    conclusivenessScore: 35,
    findings: 'Unremarkable anatomical scan despite persistent severe rotational vertigo attacks.',
    orderedBy: 'Dr. A. Sharma',
  },
  {
    id: 'evt_v2',
    patientId: 'pat_vikram_5',
    date: '2024-03-22',
    eventType: 'blood_test',
    facility: 'Metro Audio-Vestibular Lab',
    title: 'Pure Tone Audiometry & Impedance Tympanometry',
    resultSummary: 'Bilateral symmetrical mild high-frequency sensory roll-off. No low-frequency fluctuant loss.',
    isConclusive: false,
    conclusivenessScore: 40,
    findings: 'Does not meet classic diagnostic criteria for Meniere disease. Etiology unclear.',
    orderedBy: 'Dr. Arjun Shenoy',
  },
  {
    id: 'evt_v3',
    patientId: 'pat_vikram_5',
    date: '2024-06-10',
    eventType: 'mri',
    facility: 'City Neuro-Radiology Center',
    title: 'Repeat High-Resolution Cranial MRI & MR Angiography',
    resultSummary: 'Duplicate cranial scan. No posterior circulation ischemia or demyelinating plaques.',
    isConclusive: false,
    conclusivenessScore: 25,
    findings: 'Redundant scan repeating first-tier neuroimaging with identical negative findings.',
    orderedBy: 'Independent Specialist Consult',
  },
  // Kavita Nair's 7-Month Diagnostic Odyssey Events (Stagnation Case 3)
  {
    id: 'evt_k1',
    patientId: 'pat_kavita_6',
    date: '2024-02-28',
    eventType: 'blood_test',
    facility: 'Apex Diagnostics Lab',
    title: 'Autoimmune Arthritis Panel (RF, Anti-CCP, ESR, CRP)',
    resultSummary: 'Rheumatoid factor < 10 IU/mL (negative). Anti-CCP negative. ESR 22 mm/hr (borderline).',
    isConclusive: false,
    conclusivenessScore: 30,
    findings: 'Seronegative for classic rheumatoid arthritis despite morning stiffness > 60 min.',
    orderedBy: 'Dr. A. Sharma',
  },
  {
    id: 'evt_k2',
    patientId: 'pat_kavita_6',
    date: '2024-05-04',
    eventType: 'blood_test',
    facility: 'Regional Immunopathology Reference Lab',
    title: 'Antinuclear Antibodies (ANA) by Indirect Immunofluorescence & HLA-B27',
    resultSummary: 'ANA positive at 1:80 dilution (speckled pattern). HLA-B27 negative.',
    isConclusive: false,
    conclusivenessScore: 35,
    findings: 'Low-titer equivocal ANA. Insufficient for definitive systemic connective tissue diagnosis.',
    orderedBy: 'Dr. Ananya Rao',
  },
  {
    id: 'evt_k3',
    patientId: 'pat_kavita_6',
    date: '2024-07-15',
    eventType: 'ultrasound',
    facility: 'Apex Musculoskeletal Imaging',
    title: 'High-Resolution Ultrasound Both Wrists & MCP Joints with Power Doppler',
    resultSummary: 'Minimal synovial thickening in bilateral 2nd MCP joints. No active power Doppler hyperemia.',
    isConclusive: false,
    conclusivenessScore: 40,
    findings: 'Sub-clinical synovitis detected. Diagnostic delay looping at 210 days without closure.',
    orderedBy: 'Dr. Ananya Rao',
  },
];

export const INITIAL_SYMPTOMS: Symptom[] = [
  {
    id: 'sym_aarav_1',
    patientId: 'pat_aarav_0',
    symptomName: 'Persistent headache',
    severity: 7,
    durationDays: 240,
    bodyPart: 'Head (Occipital & Bilateral Temples)',
    description: 'Persistent, unyielding, throbbing tension headache daily for 8 months. Refractory to analgesics across 3 specialties.',
    firstNoticedDate: '2024-01-10',
  },
  {
    id: 'sym_aarav_2',
    patientId: 'pat_aarav_0',
    symptomName: 'Fatigue',
    severity: 6,
    durationDays: 210,
    bodyPart: 'Generalized',
    description: 'Chronic exhaustion secondary to unremitting daily cephalalgia and disturbed sleep.',
    firstNoticedDate: '2024-02-12',
  },
  {
    id: 'sym_p1',
    patientId: 'pat_priya_1',
    symptomName: 'Episodic Right Upper Quadrant Colic Pain',
    severity: 8,
    durationDays: 184,
    bodyPart: 'Abdomen (Right Subcostal)',
    description: 'Post-prandial spasmodic ache radiating to the right scapula, typically 45 mins after fatty foods.',
    firstNoticedDate: '2024-03-01',
  },
  {
    id: 'sym_p2',
    patientId: 'pat_priya_1',
    symptomName: 'Persistent Low-grade Nausea & Early Satiety',
    severity: 7,
    durationDays: 140,
    bodyPart: 'Epigastric',
    description: 'Frequent morning nausea, loss of appetite, mild weight loss (3kg over 3 months).',
    firstNoticedDate: '2024-04-15',
  },
  {
    id: 'sym_r1',
    patientId: 'pat_rahul_2',
    symptomName: 'Epigastric Burning',
    severity: 5,
    durationDays: 3,
    bodyPart: 'Upper Abdomen',
    description: 'Burning sensation after spicy food, mild bloating.',
    firstNoticedDate: '2024-08-28',
  },
];

export const INITIAL_TOKENS: Token[] = [
  {
    id: 'tok_aarav_20',
    tokenNumber: 'A-20',
    patientId: 'pat_demo_20',
    patientName: 'Kavita Rao',
    patientAge: 45,
    patientGender: 'Female',
    clinicId: 'clinic_odyssey_care',
    clinicName: 'Odyssey Care Clinic',
    doctorId: 'doc_sharma_1',
    doctorName: 'Dr. A. Sharma',
    specialty: 'General Medicine',
    roomNumber: 'Room 101',
    status: 'in_consultation',
    priority: 'standard',
    queuePosition: 0,
    estimatedWaitMin: 0,
    checkInTime: '09:10 AM',
    calledTime: '09:35 AM',
    dpsScore: 82,
    stagnationFlag: false,
    sanctuary_state: 'IN_CONSULTATION',
    symptomsSummary: 'Routine hypertension follow-up and blood pressure check',
    expectedDuration: 10,
  },
  {
    id: 'tok_aarav_21',
    tokenNumber: 'A-21',
    patientId: 'pat_demo_21',
    patientName: 'Rohan Joshi',
    patientAge: 28,
    patientGender: 'Male',
    clinicId: 'clinic_odyssey_care',
    clinicName: 'Odyssey Care Clinic',
    doctorId: 'doc_sharma_1',
    doctorName: 'Dr. A. Sharma',
    specialty: 'General Medicine',
    roomNumber: 'Room 101',
    status: 'waiting',
    priority: 'standard',
    queuePosition: 1,
    estimatedWaitMin: 4,
    checkInTime: '09:18 AM',
    dpsScore: 85,
    stagnationFlag: false,
    sanctuary_state: 'QUEUE_MOVING',
    symptomsSummary: 'Seasonal allergic rhinitis',
    expectedDuration: 10,
  },
  {
    id: 'tok_aarav_22',
    tokenNumber: 'A-22',
    patientId: 'pat_demo_22',
    patientName: 'Meenakshi Iyer',
    patientAge: 52,
    patientGender: 'Female',
    clinicId: 'clinic_odyssey_care',
    clinicName: 'Odyssey Care Clinic',
    doctorId: 'doc_sharma_1',
    doctorName: 'Dr. A. Sharma',
    specialty: 'General Medicine',
    roomNumber: 'Room 101',
    status: 'waiting',
    priority: 'standard',
    queuePosition: 2,
    estimatedWaitMin: 8,
    checkInTime: '09:22 AM',
    dpsScore: 78,
    stagnationFlag: false,
    sanctuary_state: 'QUEUE_MOVING',
    symptomsSummary: 'Mild gastritis and dyspepsia',
    expectedDuration: 10,
  },
  {
    id: 'tok_aarav_23',
    tokenNumber: 'A-23',
    patientId: 'pat_demo_23',
    patientName: 'Sanjay Nair',
    patientAge: 39,
    patientGender: 'Male',
    clinicId: 'clinic_odyssey_care',
    clinicName: 'Odyssey Care Clinic',
    doctorId: 'doc_sharma_1',
    doctorName: 'Dr. A. Sharma',
    specialty: 'General Medicine',
    roomNumber: 'Room 101',
    status: 'waiting',
    priority: 'standard',
    queuePosition: 3,
    estimatedWaitMin: 12,
    checkInTime: '09:26 AM',
    dpsScore: 80,
    stagnationFlag: false,
    sanctuary_state: 'QUEUE_MOVING',
    symptomsSummary: 'Lower back strain after exercise',
    expectedDuration: 10,
  },
  {
    id: 'tok_aarav_24',
    tokenNumber: 'A-24',
    patientId: 'pat_demo_24',
    patientName: 'Ananya Sen',
    patientAge: 31,
    patientGender: 'Female',
    clinicId: 'clinic_odyssey_care',
    clinicName: 'Odyssey Care Clinic',
    doctorId: 'doc_sharma_1',
    doctorName: 'Dr. A. Sharma',
    specialty: 'General Medicine',
    roomNumber: 'Room 101',
    status: 'waiting',
    priority: 'standard',
    queuePosition: 4,
    estimatedWaitMin: 16,
    checkInTime: '09:30 AM',
    dpsScore: 88,
    stagnationFlag: false,
    sanctuary_state: 'QUEUE_MOVING',
    symptomsSummary: 'Routine vaccination inquiry',
    expectedDuration: 10,
  },
  {
    id: 'tok_aarav_25',
    tokenNumber: 'A-25',
    patientId: 'pat_demo_25',
    patientName: 'Deepak Saxena',
    patientAge: 44,
    patientGender: 'Male',
    clinicId: 'clinic_odyssey_care',
    clinicName: 'Odyssey Care Clinic',
    doctorId: 'doc_sharma_1',
    doctorName: 'Dr. A. Sharma',
    specialty: 'General Medicine',
    roomNumber: 'Room 101',
    status: 'waiting',
    priority: 'standard',
    queuePosition: 5,
    estimatedWaitMin: 20,
    checkInTime: '09:34 AM',
    dpsScore: 79,
    stagnationFlag: false,
    sanctuary_state: 'QUEUE_STABLE',
    symptomsSummary: 'Mild vertigo on turning head',
    expectedDuration: 10,
  },
  {
    id: 'tok_aarav_26',
    tokenNumber: 'A-26',
    patientId: 'pat_demo_26',
    patientName: 'Pooja Bhatia',
    patientAge: 27,
    patientGender: 'Female',
    clinicId: 'clinic_odyssey_care',
    clinicName: 'Odyssey Care Clinic',
    doctorId: 'doc_sharma_1',
    doctorName: 'Dr. A. Sharma',
    specialty: 'General Medicine',
    roomNumber: 'Room 101',
    status: 'waiting',
    priority: 'standard',
    queuePosition: 6,
    estimatedWaitMin: 22,
    checkInTime: '09:37 AM',
    dpsScore: 81,
    stagnationFlag: false,
    sanctuary_state: 'QUEUE_STABLE',
    symptomsSummary: 'Follow-up for iron deficiency',
    expectedDuration: 10,
  },
  {
    id: 'tok_aarav_27',
    tokenNumber: 'A-27',
    patientId: 'pat_aarav_0',
    patientName: 'Aarav Mehta',
    patientAge: 32,
    patientGender: 'Male',
    clinicId: 'clinic_odyssey_care',
    clinicName: 'Odyssey Care Clinic',
    doctorId: 'doc_sharma_1',
    doctorName: 'Dr. A. Sharma',
    specialty: 'General Medicine',
    roomNumber: 'Room 101',
    status: 'waiting',
    priority: 'standard',
    queuePosition: 7,
    estimatedWaitMin: 24,
    checkInTime: '09:40 AM',
    dpsScore: 63,
    stagnationFlag: true,
    stagnationReason: '8-Month Diagnostic Odyssey: Persistent headache refractory across 3 specialties with 2 repeated scans. Stagnation flagged.',
    sanctuary_state: 'QUEUE_STABLE',
    symptomsSummary: 'Persistent headache, Fatigue',
    expectedDuration: 10,
    routing: 'Senior review eligible',
  },
  {
    id: 'tok_aarav_28',
    tokenNumber: 'A-28',
    patientId: 'pat_demo_28',
    patientName: 'Vikas Malhotra',
    patientAge: 36,
    patientGender: 'Male',
    clinicId: 'clinic_odyssey_care',
    clinicName: 'Odyssey Care Clinic',
    doctorId: 'doc_sharma_1',
    doctorName: 'Dr. A. Sharma',
    specialty: 'General Medicine',
    roomNumber: 'Room 101',
    status: 'waiting',
    priority: 'standard',
    queuePosition: 8,
    estimatedWaitMin: 28,
    checkInTime: '09:44 AM',
    dpsScore: 77,
    stagnationFlag: false,
    sanctuary_state: 'QUEUE_STABLE',
    symptomsSummary: 'Mild cough and cold',
    expectedDuration: 10,
  },
  {
    id: 'tok_aarav_29',
    tokenNumber: 'A-29',
    patientId: 'pat_demo_29',
    patientName: 'Sangeeta Pillai',
    patientAge: 49,
    patientGender: 'Female',
    clinicId: 'clinic_odyssey_care',
    clinicName: 'Odyssey Care Clinic',
    doctorId: 'doc_sharma_1',
    doctorName: 'Dr. A. Sharma',
    specialty: 'General Medicine',
    roomNumber: 'Room 101',
    status: 'waiting',
    priority: 'standard',
    queuePosition: 9,
    estimatedWaitMin: 32,
    checkInTime: '09:48 AM',
    dpsScore: 84,
    stagnationFlag: false,
    sanctuary_state: 'QUEUE_STABLE',
    symptomsSummary: 'Diabetes routine fasting checkup',
    expectedDuration: 10,
  },
  {
    id: 'tok_1',
    tokenNumber: 'A-101',
    patientId: 'pat_sunita_3',
    patientName: 'Sunita Deshmukh',
    patientAge: 58,
    patientGender: 'Female',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_arjun_2',
    doctorName: 'Dr. Arjun Shenoy',
    specialty: 'Internal Medicine',
    status: 'in_consultation',
    priority: 'standard',
    queuePosition: 0,
    estimatedWaitMin: 0,
    checkInTime: '09:15 AM',
    calledTime: '09:40 AM',
    dpsScore: 74,
    stagnationFlag: false,
    symptomsSummary: 'BP follow up and vestibular review',
  },
  {
    id: 'tok_2',
    tokenNumber: 'A-102',
    patientId: 'pat_priya_1',
    patientName: 'Priya Sharma',
    patientAge: 34,
    patientGender: 'Female',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_meera_1',
    doctorName: 'Dr. Meera Nambiar',
    specialty: 'Senior Gastroenterology & Diagnostic Lead',
    status: 'waiting',
    priority: 'priority_stagnation',
    queuePosition: 1,
    estimatedWaitMin: 6,
    checkInTime: '09:25 AM',
    dpsScore: 38,
    stagnationFlag: true,
    stagnationReason: '6-Month Diagnostic Odyssey: 3 inconclusive ultrasounds. Rebalanced to Senior Specialist.',
    symptomsSummary: 'Chronic RUQ colic pain (180 days), intractable nausea',
  },
  {
    id: 'tok_3',
    tokenNumber: 'A-103',
    patientId: 'pat_devendra_4',
    patientName: 'Devendra Patel',
    patientAge: 29,
    patientGender: 'Male',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_ananya_3',
    doctorName: 'Dr. Ananya Rao',
    specialty: 'Diagnostic Triage',
    status: 'waiting',
    priority: 'standard',
    queuePosition: 2,
    estimatedWaitMin: 14,
    checkInTime: '09:35 AM',
    dpsScore: 82,
    stagnationFlag: false,
    symptomsSummary: 'Post-viral fatigue and dry cough',
  },
  {
    id: 'tok_4',
    tokenNumber: 'A-104',
    patientId: 'pat_rahul_2',
    patientName: 'Rahul Verma',
    patientAge: 42,
    patientGender: 'Male',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_arjun_2',
    doctorName: 'Dr. Arjun Shenoy',
    specialty: 'Internal Medicine',
    status: 'waiting',
    priority: 'standard',
    queuePosition: 3,
    estimatedWaitMin: 22,
    checkInTime: '09:48 AM',
    dpsScore: 88,
    stagnationFlag: false,
    symptomsSummary: 'Acute 3-day epigastric burning',
  },
  {
    id: 'tok_vikram_5',
    tokenNumber: 'A-105',
    patientId: 'pat_vikram_5',
    patientName: 'Vikram Rao',
    patientAge: 47,
    patientGender: 'Male',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_vikram_4',
    doctorName: 'Dr. Vikramaditya Sen',
    specialty: 'Consultant Neurologist',
    status: 'waiting',
    priority: 'priority_stagnation',
    queuePosition: 4,
    estimatedWaitMin: 28,
    checkInTime: '09:52 AM',
    dpsScore: 32,
    stagnationFlag: true,
    stagnationReason: '9-Month Diagnostic Odyssey: Intractable rotational vertigo, 2 inconclusive MRIs. Escalated to Neurology review.',
    symptomsSummary: 'Severe episodic vertigo, tinnitus, and postural instability for 270 days',
  },
  {
    id: 'tok_kavita_6',
    tokenNumber: 'A-106',
    patientId: 'pat_kavita_6',
    patientName: 'Kavita Nair',
    patientAge: 39,
    patientGender: 'Female',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_ananya_3',
    doctorName: 'Dr. Ananya Rao',
    specialty: 'Diagnostic Triage & Clinical Specialist',
    status: 'waiting',
    priority: 'priority_stagnation',
    queuePosition: 5,
    estimatedWaitMin: 36,
    checkInTime: '09:55 AM',
    dpsScore: 41,
    stagnationFlag: true,
    stagnationReason: '7-Month Diagnostic Odyssey: Migratory symmetrical polyarthralgia and pyrexia. Multiple unyielding serologies.',
    symptomsSummary: 'Symmetrical morning joint stiffness, bilateral small joint swelling, pyrexia of unknown origin',
  },
];

export const INITIAL_SHIFTS: DoctorShift[] = [
  {
    id: 'shift_1',
    doctorId: 'doc_meera_1',
    doctorName: 'Dr. Meera Nambiar',
    specialty: 'Senior Gastroenterology',
    shiftName: 'Morning',
    startTime: '08:30',
    endTime: '14:30',
    room: '104',
    maxPatients: 25,
    currentPatientCount: 14,
    isActive: true,
  },
  {
    id: 'shift_2',
    doctorId: 'doc_arjun_2',
    doctorName: 'Dr. Arjun Shenoy',
    specialty: 'Internal Medicine',
    shiftName: 'Morning',
    startTime: '09:00',
    endTime: '15:00',
    room: '102',
    maxPatients: 30,
    currentPatientCount: 19,
    isActive: true,
  },
  {
    id: 'shift_3',
    doctorId: 'doc_ananya_3',
    doctorName: 'Dr. Ananya Rao',
    specialty: 'Diagnostic Triage',
    shiftName: 'Morning',
    startTime: '09:30',
    endTime: '16:00',
    room: '106',
    maxPatients: 20,
    currentPatientCount: 11,
    isActive: true,
  },
];

export const INITIAL_BILLING: BillingRecord[] = [
  {
    id: 'bill_aarav_27',
    tokenNumber: 'A-27',
    patientId: 'pat_aarav_0',
    patientName: 'Aarav Mehta',
    date: 'Today, 09:40 AM',
    items: [
      { description: 'General Medicine Consultation Fee', amount: 800 },
      { description: 'Sanctuary Digital Queue Coordination', amount: 200 },
      { description: 'Preventive Health Care Voucher / Discount', amount: -100 },
    ],
    totalAmount: 900,
    status: 'paid',
    paymentMethod: 'UPI (aarav@okaxis)',
  },
  {
    id: 'bill_1',
    tokenNumber: 'A-102',
    patientId: 'pat_priya_1',
    patientName: 'Priya Sharma',
    date: '2024-09-08',
    items: [
      { description: 'Senior Gastroenterology & Diagnostic Consult', amount: 800 },
      { description: 'Sanctuary Digital Token & Queue Processing', amount: 50 },
      { description: 'Diagnostic History Aggregation', amount: 150 },
    ],
    totalAmount: 1000,
    status: 'paid',
    paymentMethod: 'UPI (9876543241@okhdfcbank)',
  },
  {
    id: 'bill_2',
    tokenNumber: 'A-104',
    patientId: 'pat_rahul_2',
    patientName: 'Rahul Verma',
    date: '2024-09-08',
    items: [
      { description: 'Internal Medicine General Consultation', amount: 500 },
      { description: 'Sanctuary Digital Token', amount: 50 },
    ],
    totalAmount: 550,
    status: 'paid',
    paymentMethod: 'Credit Card',
  },
];

export const INITIAL_VISITS: Visit[] = [
  {
    id: 'vis_aarav_6',
    patientId: 'pat_aarav_0',
    clinicId: 'clinic_odyssey_care',
    clinicName: 'Odyssey Care Clinic',
    doctorId: 'doc_sharma_1',
    doctorName: 'Dr. A. Sharma',
    specialty: 'General Medicine',
    date: '08 Sep',
    reason: 'Persistent headache',
    chiefComplaint: 'Persistent headache (daily tension-type)',
    status: 'completed',
    diagnosis: 'Unresolved Cephalalgia • Longitudinal Stagnation Flagged',
    outcome: 'Referred for Senior Diagnostic Review',
    notes: 'Severe daily tension headache refractory to standard NSAIDs and muscle relaxants. Flagged for longitudinal diagnostic review.',
    testsOrdered: ['Repeat Vitals', 'Neurological Evaluation'],
    resolved: false,
  },
  {
    id: 'vis_aarav_5',
    patientId: 'pat_aarav_0',
    clinicId: 'clinic_apex_1',
    clinicName: 'Apex Sinus & Head Center',
    doctorId: 'doc_gupta_4',
    doctorName: 'Dr. R. K. Gupta',
    specialty: 'ENT & Sinus Clinic',
    date: '28 Jul',
    reason: 'Persistent headache (Sinus vs cervicogenic)',
    chiefComplaint: 'Persistent headache with facial tightness',
    status: 'completed',
    diagnosis: 'Non-sinugenic Cephalalgia • Inconclusive Endoscopy',
    outcome: 'Sinus Pathology Ruled Out',
    notes: 'Diagnostic nasal endoscopy unremarkable. No mucosal thickening or purulence. Pain etiology remains ambiguous.',
    testsOrdered: ['Diagnostic Nasal Endoscopy', 'Sinus CT'],
    resolved: false,
  },
  {
    id: 'vis_aarav_4',
    patientId: 'pat_aarav_0',
    clinicId: 'clinic_eye_1',
    clinicName: 'City Ophthalmic Institute',
    doctorId: 'doc_sunita_3',
    doctorName: 'Dr. Sunita Deshmukh',
    specialty: 'Ophthalmology',
    date: '12 Jun',
    reason: 'Persistent headache with retro-orbital pressure',
    chiefComplaint: 'Persistent headache with eye strain',
    status: 'completed',
    diagnosis: 'Refractive Error Excluded • Ocular Pathology Absent',
    outcome: 'Vision Normal; Ocular Origin Excluded',
    notes: 'Bilateral fundoscopy normal. No papilledema. Intraocular pressure 14 mmHg OU. Cephalalgia is non-ocular.',
    testsOrdered: ['Slit Lamp Exam', 'Fundoscopy', 'Visual Acuity'],
    resolved: false,
  },
  {
    id: 'vis_aarav_3',
    patientId: 'pat_aarav_0',
    clinicId: 'clinic_odyssey_care',
    clinicName: 'Odyssey Care Clinic',
    doctorId: 'doc_sharma_1',
    doctorName: 'Dr. A. Sharma',
    specialty: 'General Medicine',
    date: '02 May',
    reason: 'Persistent headache & occipital tightness',
    chiefComplaint: 'Persistent headache and neck stiffness',
    status: 'completed',
    diagnosis: 'Tension-type Headache vs Cranial Neuralgia',
    outcome: 'Trial Treatment Failed',
    notes: 'Prescribed trial of amitriptyline and lifestyle modifications. Symptoms unchanged after 4 weeks of therapy.',
    testsOrdered: ['C-Reactive Protein', 'ESR'],
    resolved: false,
  },
  {
    id: 'vis_aarav_2',
    patientId: 'pat_aarav_0',
    clinicId: 'clinic_metro_1',
    clinicName: 'Metro Diagnostic Imaging Center',
    doctorId: 'doc_priya_2',
    doctorName: 'Dr. Priya Desai',
    specialty: 'Diagnostic Radiology',
    date: '18 Mar',
    reason: 'Persistent headache investigation',
    chiefComplaint: 'Persistent headache (Radiological Workup)',
    status: 'completed',
    diagnosis: 'Unremarkable Brain MRI • Etiology Inconclusive',
    outcome: 'No Structural Lesion Identified',
    notes: 'Non-contrast MRI of the brain showed normal parenchymal signal intensity. Inconclusive for headache mechanism.',
    testsOrdered: ['Non-contrast Brain MRI (Repeated Test 1)'],
    resolved: false,
  },
  {
    id: 'vis_aarav_1',
    patientId: 'pat_aarav_0',
    clinicId: 'clinic_apex_1',
    clinicName: 'Apex Care Center',
    doctorId: 'doc_arjun_2',
    doctorName: 'Dr. Arjun Shenoy',
    specialty: 'Internal Medicine',
    date: '10 Jan',
    reason: 'Persistent headache & chronic fatigue',
    chiefComplaint: 'Persistent headache (Initial Presentation)',
    status: 'completed',
    diagnosis: 'Cephalalgia Under Investigation',
    outcome: 'Initial Workup Non-Diagnostic',
    notes: 'Initial presentation with 3-week history of daily band-like pressure. Routine metabolic and inflammatory tests normal.',
    testsOrdered: ['CBC', 'Metabolic Panel', 'Thyroid Profile'],
    resolved: false,
  },
  // Priya Sharma (Stagnation Case 1)
  {
    id: 'vis_priya_1',
    patientId: 'pat_priya_1',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_arjun_2',
    doctorName: 'Dr. Arjun Shenoy',
    specialty: 'Internal Medicine',
    date: '15 Mar',
    reason: 'Episodic postprandial right upper quadrant pain',
    status: 'completed',
    diagnosis: 'Unspecified abdominal pain • Awaiting imaging',
    notes: 'Severe cramping 45 min after dinner. Advised LFT and ultrasound abdomen.',
    testsOrdered: ['LFT (Liver Function Test)', 'Ultrasound Whole Abdomen'],
    resolved: false,
  },
  {
    id: 'vis_priya_2',
    patientId: 'pat_priya_1',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_arjun_2',
    doctorName: 'Dr. Arjun Shenoy',
    specialty: 'Internal Medicine',
    date: '18 May',
    reason: 'Review of normal ultrasound report; persistent pain',
    status: 'completed',
    diagnosis: 'Suspected functional gallbladder dyskinesia',
    notes: 'Ultrasound reported normal gallbladder without calculi. Prescribed antispasmodic.',
    testsOrdered: ['Repeat LFT', 'Serum Amylase'],
    resolved: false,
  },
  {
    id: 'vis_priya_3',
    patientId: 'pat_priya_1',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_meera_1',
    doctorName: 'Dr. Meera Nambiar',
    specialty: 'Gastroenterology',
    date: '04 Jul',
    reason: 'Intractable colic, weight loss (3kg), nausea',
    status: 'completed',
    diagnosis: 'Diagnostic Stagnation: Biliary colic vs sphincter of Oddi dysfunction',
    notes: 'Upper GI endoscopy revealed mild duodenitis. Pain persists. Scheduled MRCP.',
    testsOrdered: ['Upper GI Endoscopy', 'MRCP (Magnetic Resonance Cholangiopancreatography)'],
    resolved: false,
  },
  {
    id: 'vis_priya_4',
    patientId: 'pat_priya_1',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_meera_1',
    doctorName: 'Dr. Meera Nambiar',
    specialty: 'Senior Gastroenterology & Diagnostic Lead',
    date: '08 Sep',
    reason: 'Priority Stagnation consultation via Odyssey DPS triage',
    status: 'in_progress',
    diagnosis: 'Biliary dyskinesia under active multidisciplinary workup',
    notes: 'DPS score 38. Re-evaluated for specialized CCK-HIDA scintigraphy scan.',
    testsOrdered: ['HIDA Scan with CCK stimulation'],
    resolved: false,
  },
  // Vikram Rao (Stagnation Case 2: 9-Month Vertigo Odyssey)
  {
    id: 'vis_vikram_1',
    patientId: 'pat_vikram_5',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_sharma_1',
    doctorName: 'Dr. A. Sharma',
    specialty: 'General Medicine',
    date: '10 Dec',
    reason: 'Sudden onset spinning sensation, unsteadiness, vomiting',
    status: 'completed',
    diagnosis: 'Acute peripheral vestibular neuritis',
    notes: 'Horizontal nystagmus noted. Started on cinnarizine and antiemetics.',
    testsOrdered: ['Routine Hematology', 'ECG 12-lead'],
    resolved: false,
  },
  {
    id: 'vis_vikram_2',
    patientId: 'pat_vikram_5',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_arjun_2',
    doctorName: 'Dr. Arjun Shenoy',
    specialty: 'Internal Medicine',
    date: '22 Feb',
    reason: 'Recurrent severe vertigo attacks, left ear fullness',
    status: 'completed',
    diagnosis: 'Atypical Meniere vs vestibular migraine',
    notes: 'Audiogram within normal limits. Referred for cranial magnetic resonance imaging.',
    testsOrdered: ['Pure Tone Audiometry', 'MRI Brain with IAC protocols'],
    resolved: false,
  },
  {
    id: 'vis_vikram_3',
    patientId: 'pat_vikram_5',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_vikram_4',
    doctorName: 'Dr. Vikramaditya Sen',
    specialty: 'Consultant Neurologist',
    date: '19 May',
    reason: 'Follow-up on normal brain MRI; persistent unsteadiness',
    status: 'completed',
    diagnosis: 'Diagnostic Stagnation: Persistent Postural-Perceptual Dizziness (PPPD)',
    notes: 'Both MRIs normal. Diagnostic journey duration exceeding 180 days with no convergence.',
    testsOrdered: ['Videonystagmography (VNG)', 'Dynamic Posturography'],
    resolved: false,
  },
  {
    id: 'vis_vikram_4',
    patientId: 'pat_vikram_5',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_vikram_4',
    doctorName: 'Dr. Vikramaditya Sen',
    specialty: 'Consultant Neurologist',
    date: '08 Sep',
    reason: 'Active triage visit - DPS 32 priority rebalance',
    status: 'waiting',
    diagnosis: 'Central vs vestibular vestibular migraine syndrome under advanced review',
    notes: 'DPS score 32. Patient assigned priority slot to review specialized vestibular testing.',
    testsOrdered: ['Specialized Vestibular Evoked Myogenic Potentials (VEMP)'],
    resolved: false,
  },
  // Kavita Nair (Stagnation Case 3: 7-Month Polyarthralgia Odyssey)
  {
    id: 'vis_kavita_1',
    patientId: 'pat_kavita_6',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_sharma_1',
    doctorName: 'Dr. A. Sharma',
    specialty: 'General Medicine',
    date: '12 Feb',
    reason: 'Bilateral hand and wrist stiffness in morning (>1 hour)',
    status: 'completed',
    diagnosis: 'Inflammatory polyarthritis under evaluation',
    notes: 'Prescribed NSAIDs. Ordered inflammatory markers and rheumatoid serologies.',
    testsOrdered: ['ESR', 'CRP', 'Serum Uric Acid'],
    resolved: false,
  },
  {
    id: 'vis_kavita_2',
    patientId: 'pat_kavita_6',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_ananya_3',
    doctorName: 'Dr. Ananya Rao',
    specialty: 'Diagnostic Triage & Clinical Specialist',
    date: '14 Apr',
    reason: 'Migratory joint swelling, low-grade evening fever',
    status: 'completed',
    diagnosis: 'Seronegative arthritis vs early connective tissue disease',
    notes: 'Rheumatoid factor and anti-CCP negative. Mildly positive ANA (1:80 speckled).',
    testsOrdered: ['ANA Comprehensive Profile (17 antigens)', 'HLA-B27'],
    resolved: false,
  },
  {
    id: 'vis_kavita_3',
    patientId: 'pat_kavita_6',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_ananya_3',
    doctorName: 'Dr. Ananya Rao',
    specialty: 'Diagnostic Triage & Clinical Specialist',
    date: '28 Jun',
    reason: 'Persistent exhaustion, intermittent pleuritic chest ache',
    status: 'completed',
    diagnosis: 'Diagnostic Odyssey: Equivocal autoimmune disease progression',
    notes: 'ANA profile inconclusive. DPS calculated at 41. Flagged for multidisciplinary rheumatology panel.',
    testsOrdered: ['Complement C3/C4', 'High-resolution Musculoskeletal Ultrasound Hands'],
    resolved: false,
  },
  // Rahul Verma
  {
    id: 'vis_rahul_1',
    patientId: 'pat_rahul_2',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_arjun_2',
    doctorName: 'Dr. Arjun Shenoy',
    specialty: 'Internal Medicine',
    date: '29 Aug',
    reason: 'Acute epigastric burning post meals',
    status: 'completed',
    diagnosis: 'Acute gastritis secondary to NSAID ingestion',
    notes: 'Started on proton pump inhibitor (rabeprazole) and sucralfate.',
    testsOrdered: ['H. Pylori Stool Antigen'],
    resolved: true,
  },
  // Sunita Deshmukh
  {
    id: 'vis_sunita_1',
    patientId: 'pat_sunita_3',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_arjun_2',
    doctorName: 'Dr. Arjun Shenoy',
    specialty: 'Internal Medicine',
    date: '10 Jan',
    reason: 'Hypertension monitoring and medication titration',
    status: 'completed',
    diagnosis: 'Essential hypertension well controlled',
    notes: 'BP 128/82 mmHg. Maintained on telmisartan 40mg.',
    testsOrdered: ['Serum Creatinine', 'Urine Microalbumin'],
    resolved: true,
  },
  {
    id: 'vis_sunita_2',
    patientId: 'pat_sunita_3',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_arjun_2',
    doctorName: 'Dr. Arjun Shenoy',
    specialty: 'Internal Medicine',
    date: '08 Sep',
    reason: 'Intermittent dizzy spells while getting out of bed',
    status: 'in_progress',
    diagnosis: 'Mild postural orthostatic hypotension',
    notes: 'In consultation Room 102 with Dr. Arjun Shenoy.',
    testsOrdered: ['Supine and Standing Blood Pressure Checks'],
    resolved: false,
  },
  // Devendra Patel
  {
    id: 'vis_devendra_1',
    patientId: 'pat_devendra_4',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_ananya_3',
    doctorName: 'Dr. Ananya Rao',
    specialty: 'Diagnostic Triage',
    date: '24 Jul',
    reason: 'Post-viral lethargy following upper respiratory tract infection',
    status: 'completed',
    diagnosis: 'Post-viral convalescent fatigue',
    notes: 'Reassured. Hydration and rest advised.',
    testsOrdered: ['Complete Hemogram'],
    resolved: true,
  },
  // Amit Trivedi
  {
    id: 'vis_amit_1',
    patientId: 'pat_amit_7',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_priya_5',
    doctorName: 'Dr. Priya Kulkarni',
    specialty: 'Pulmonology',
    date: '20 May',
    reason: 'Allergic sneezing bouts, watery eyes, morning throat clearing',
    status: 'completed',
    diagnosis: 'Moderate persistent allergic rhinitis',
    notes: 'Prescribed fluticasone nasal spray and fexofenadine.',
    testsOrdered: ['Total IgE', 'Absolute Eosinophil Count'],
    resolved: true,
  },
  // Deepa Sundaram
  {
    id: 'vis_deepa_1',
    patientId: 'pat_deepa_8',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_arjun_2',
    doctorName: 'Dr. Arjun Shenoy',
    specialty: 'Internal Medicine',
    date: '02 Oct',
    reason: 'Quarterly diabetic evaluation & HbA1c review',
    status: 'completed',
    diagnosis: 'Type 2 Diabetes Mellitus with good glycaemic control',
    notes: 'HbA1c 6.8%. Continued metformin and lifestyle regimen.',
    testsOrdered: ['HbA1c', 'Lipid Panel', 'Fundus Examination'],
    resolved: true,
  },
  // Rohit Kulkarni
  {
    id: 'vis_rohit_1',
    patientId: 'pat_rohit_9',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_sharma_1',
    doctorName: 'Dr. A. Sharma',
    specialty: 'General Medicine',
    date: '04 Aug',
    reason: 'Pre-athletic sports clearance evaluation',
    status: 'completed',
    diagnosis: 'Healthy adult - cleared for endurance athletics',
    notes: 'Resting pulse 54 bpm. Resting ECG showed sinus bradycardia (athlete\'s heart).',
    testsOrdered: ['Treadmill Stress Test', 'Echocardiogram 2D'],
    resolved: true,
  },
  // Ananya Bose
  {
    id: 'vis_ananya_1',
    patientId: 'pat_ananya_10',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_sharma_1',
    doctorName: 'Dr. A. Sharma',
    specialty: 'General Medicine',
    date: '15 Jun',
    reason: 'Initial onset insomnia and chronic work-related tension headache',
    status: 'completed',
    diagnosis: 'Tension-type headache associated with occupational stress',
    notes: 'Sleep hygiene protocols provided. Mild muscle relaxant for bedtime.',
    testsOrdered: ['Serum Magnesium', 'TSH'],
    resolved: true,
  },
  // Suresh Menon
  {
    id: 'vis_suresh_1',
    patientId: 'pat_suresh_11',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_arjun_2',
    doctorName: 'Dr. Arjun Shenoy',
    specialty: 'Internal Medicine',
    date: '12 Dec',
    reason: 'Bilateral knee crepitus and stair-climbing difficulty',
    status: 'completed',
    diagnosis: 'Grade 2 primary knee osteoarthritis',
    notes: 'Referred to clinical physiotherapy and quadriceps strengthening.',
    testsOrdered: ['X-ray Both Knees AP/Lateral Standing'],
    resolved: true,
  },
  // Manoj Joshi
  {
    id: 'vis_manoj_1',
    patientId: 'pat_manoj_12',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_meera_1',
    doctorName: 'Dr. Meera Nambiar',
    specialty: 'Gastroenterology',
    date: '18 Jul',
    reason: 'Early satiety, postprandial fullness for 2 months',
    status: 'completed',
    diagnosis: 'Postprandial Distress Syndrome (Rome IV functional dyspepsia)',
    notes: 'Prescribed prokinetic (itopride) and dietary modifications.',
    testsOrdered: ['Upper Abdominal Ultrasound'],
    resolved: true,
  },
  // Meenakshi Pillai
  {
    id: 'vis_meenakshi_1',
    patientId: 'pat_meenakshi_13',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_ananya_3',
    doctorName: 'Dr. Ananya Rao',
    specialty: 'Diagnostic Triage',
    date: '25 Mar',
    reason: 'Annual thyroxine titration visit',
    status: 'completed',
    diagnosis: 'Hashimoto thyroiditis on stable replacement',
    notes: 'TSH 2.4 uIU/mL. Maintained levothyroxine 75 mcg daily.',
    testsOrdered: ['Free T3, Free T4, TSH'],
    resolved: true,
  },
  // Aravind Swamy
  {
    id: 'vis_aravind_1',
    patientId: 'pat_aravind_14',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_sharma_1',
    doctorName: 'Dr. A. Sharma',
    specialty: 'General Medicine',
    date: '10 Apr',
    reason: 'Annual executive comprehensive health check',
    status: 'completed',
    diagnosis: 'Mild central adiposity with metabolic wellness baseline',
    notes: 'Framingham 10-year risk score < 5%. Advised aerobic exercise.',
    testsOrdered: ['Carotid Intima-Media Doppler', 'Serum Homocysteine'],
    resolved: true,
  },
  // Shreya Kapoor
  {
    id: 'vis_shreya_1',
    patientId: 'pat_shreya_15',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_vikram_4',
    doctorName: 'Dr. Vikramaditya Sen',
    specialty: 'Consultant Neurologist',
    date: '14 Aug',
    reason: 'Right hemicranial throbbing headache with photophobia and nausea',
    status: 'completed',
    diagnosis: 'Episodic migraine without aura',
    notes: 'Started on rizatriptan for acute attacks and riboflavin prophylaxis.',
    testsOrdered: ['Visual Acuity & Fundoscopy'],
    resolved: true,
  },
  // Harish Chawla
  {
    id: 'vis_harish_1',
    patientId: 'pat_harish_16',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_vikram_4',
    doctorName: 'Dr. Vikramaditya Sen',
    specialty: 'Consultant Neurologist',
    date: '22 Jan',
    reason: 'Bilateral postural hand tremor while holding tea cup',
    status: 'completed',
    diagnosis: 'Benign essential tremor',
    notes: 'No cogwheel rigidity. Propranolol 20mg initiated.',
    testsOrdered: ['Serum Ceruloplasmin', 'Thyroid Profile'],
    resolved: true,
  },
  // Neha Singhal
  {
    id: 'vis_neha_1',
    patientId: 'pat_neha_17',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_sharma_1',
    doctorName: 'Dr. A. Sharma',
    specialty: 'General Medicine',
    date: '29 May',
    reason: 'Postpartum fatigue, pallor, and brittle fingernails',
    status: 'completed',
    diagnosis: 'Microcytic hypochromic iron deficiency anemia',
    notes: 'Hemoglobin 9.2 g/dL. Oral ferrous ascorbate prescribed.',
    testsOrdered: ['Serum Ferritin', 'Total Iron Binding Capacity'],
    resolved: true,
  },
  // Rajesh Bhatt
  {
    id: 'vis_rajesh_1',
    patientId: 'pat_rajesh_18',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_arjun_2',
    doctorName: 'Dr. Arjun Shenoy',
    specialty: 'Internal Medicine',
    date: '16 Oct',
    reason: 'Routine lipid profile review',
    status: 'completed',
    diagnosis: 'Isolated hypertriglyceridemia',
    notes: 'Triglycerides 240 mg/dL. Prescribed dietary omega-3.',
    testsOrdered: ['Lipoprotein (a)', 'ApoB'],
    resolved: true,
  },
  // Pooja Hegde
  {
    id: 'vis_pooja_1',
    patientId: 'pat_pooja_19',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_sharma_1',
    doctorName: 'Dr. A. Sharma',
    specialty: 'General Medicine',
    date: '08 Aug',
    reason: 'Pruritic erythematous plaques on distal right wrist',
    status: 'completed',
    diagnosis: 'Allergic contact dermatitis (nickel watch buckle)',
    notes: 'Topical mometasone cream provided. Immediate resolution.',
    testsOrdered: ['Skin Patch Test Review'],
    resolved: true,
  },
  // Ganesh Natarajan
  {
    id: 'vis_ganesh_1',
    patientId: 'pat_ganesh_20',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_ananya_3',
    doctorName: 'Dr. Ananya Rao',
    specialty: 'Diagnostic Triage',
    date: '22 Jun',
    reason: 'Acute lower back spasm following lifting luggage',
    status: 'completed',
    diagnosis: 'Mechanical acute lumbosacral muscle strain',
    notes: 'Straight leg raise negative bilaterally. Prescribed thiocolchicoside.',
    testsOrdered: ['Lumbosacral Spine X-Ray'],
    resolved: true,
  },
  // Fatima Zahra
  {
    id: 'vis_fatima_1',
    patientId: 'pat_fatima_21',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Apex Health Center',
    doctorId: 'doc_sharma_1',
    doctorName: 'Dr. A. Sharma',
    specialty: 'General Medicine',
    date: '05 Jul',
    reason: 'Recurrent painful shallow oral mucosal ulcers',
    status: 'completed',
    diagnosis: 'Recurrent aphthous stomatitis',
    notes: 'Triamcinolone acetonide dental paste prescribed.',
    testsOrdered: ['Serum B12', 'Serum Folate'],
    resolved: true,
  },
];

export const INITIAL_REFERRALS: Referral[] = [
  {
    id: 'ref_priya_1',
    patientId: 'pat_priya_1',
    patientName: 'Priya Sharma',
    fromDoctorId: 'doc_arjun_2',
    fromDoctorName: 'Dr. Arjun Shenoy',
    toSpecialty: 'Gastroenterology',
    reason: 'Suspicion of Biliary Dyspraxia vs Sphincter of Oddi Dysfunction',
    priority: 'Urgent',
    status: 'Pending',
    referralToken: 'REF-GASTRO-102',
    specialistQueuePosition: 1,
    date: 'Yesterday, 04:15 PM',
    clinicalNotes: 'Stagnation flagged. Expedited to Senior Gastroenterologist Dr. Meera Nambiar.',
  },
];

// ==========================================
// DATA STORE & REPOSITORY SERVICE
// ==========================================

export class DataStore {
  // Ensure store is initialized in cache
  static init() {
    if (!cache.get(CACHE_KEYS.CLINICS_LIST)) {
      cache.set(CACHE_KEYS.CLINICS_LIST, INITIAL_CLINICS);
    }
    if (!cache.get(CACHE_KEYS.DOCTORS_STATE)) {
      cache.set(CACHE_KEYS.DOCTORS_STATE, INITIAL_DOCTORS);
    }
    if (!cache.get(CACHE_KEYS.PATIENT_RECORDS)) {
      cache.set(CACHE_KEYS.PATIENT_RECORDS, INITIAL_PATIENTS);
    }
    if (!cache.get(CACHE_KEYS.CACHED_QUEUE)) {
      cache.set(CACHE_KEYS.CACHED_QUEUE, INITIAL_TOKENS);
    }
    if (!cache.get(CACHE_KEYS.DIAGNOSTIC_EVENTS)) {
      cache.set(CACHE_KEYS.DIAGNOSTIC_EVENTS, INITIAL_DIAGNOSTIC_EVENTS);
    }
    if (!cache.get(CACHE_KEYS.BILLING_RECORDS)) {
      cache.set(CACHE_KEYS.BILLING_RECORDS, INITIAL_BILLING);
    }
    if (!cache.get(CACHE_KEYS.VISIT_RECORDS)) {
      cache.set(CACHE_KEYS.VISIT_RECORDS, INITIAL_VISITS);
    }
    if (!cache.get(CACHE_KEYS.REFERRAL_RECORDS)) {
      cache.set(CACHE_KEYS.REFERRAL_RECORDS, INITIAL_REFERRALS);
    }
    // Set default active patient session to Aarav Mehta (or Priya) for instant rich demo
    if (!cache.get(CACHE_KEYS.CURRENT_PATIENT_SESSION)) {
      cache.set(CACHE_KEYS.CURRENT_PATIENT_SESSION, INITIAL_PATIENTS[0]);
    }
    if (!cache.get(CACHE_KEYS.ACTIVE_TOKEN)) {
      cache.set(CACHE_KEYS.ACTIVE_TOKEN, INITIAL_TOKENS[0]); // A-27 for Aarav
    }
    if (!cache.get(CACHE_KEYS.SIMULATION_STATE)) {
      cache.set(CACHE_KEYS.SIMULATION_STATE, {
        currentServingNumber: 20,
        currentServingToken: 'A-20',
        targetTokenNumber: 27,
        targetToken: 'A-27',
        isDelayed: false,
        autoAdvance: false,
        speedSec: 4,
      });
    }

    // Subscribe to Supabase real-time updates when connected
    try {
      SupabaseService.initRealtime({
        onTokenUpdate: (token) => {
          const queue = [...DataStore.getQueue()];
          const index = queue.findIndex(t => t.id === token.id || t.tokenNumber === token.tokenNumber);
          if (index !== -1) {
            queue[index] = {
              ...queue[index],
              status: token.status,
              queuePosition: token.queuePosition,
              estimatedWaitMin: token.estimatedWaitMin,
              roomNumber: token.roomNumber || queue[index].roomNumber,
            };
            cache.set(CACHE_KEYS.CACHED_QUEUE, queue);
          }
        },
        onVisitUpdate: (visit) => {
          console.log('[Supabase Realtime] Visit update received:', visit.id);
        },
        onNotification: (notification) => {
          console.log('[Supabase Realtime] Notification received:', notification?.pulse_headline || notification);
        },
        onReferralUpdate: (referral) => {
          console.log('[Supabase Realtime] Referral update received:', referral.id);
        },
      });
    } catch {
      // Non-blocking in demo mode
    }
  }

  // --- Clinics ---
  static getClinics(): Clinic[] {
    this.init();
    return cache.get<Clinic[]>(CACHE_KEYS.CLINICS_LIST) || INITIAL_CLINICS;
  }

  static getClinic(id: string): Clinic | undefined {
    return this.getClinics().find(c => c.id === id);
  }

  // --- Doctors ---
  static getDoctors(): Doctor[] {
    this.init();
    return cache.get<Doctor[]>(CACHE_KEYS.DOCTORS_STATE) || INITIAL_DOCTORS;
  }

  static updateDoctorStatus(doctorId: string, status: Doctor['status']): Doctor | undefined {
    const doctors = this.getDoctors().map(doc => {
      if (doc.id === doctorId) {
        return { ...doc, status };
      }
      return doc;
    });
    cache.set(CACHE_KEYS.DOCTORS_STATE, doctors);
    this.logAudit('DOCTOR_STATUS_UPDATE', 'doctor', doctorId, `Status changed to ${status}`);
    return doctors.find(d => d.id === doctorId);
  }

  // --- Patients ---
  static getPatients(): Patient[] {
    this.init();
    return cache.get<Patient[]>(CACHE_KEYS.PATIENT_RECORDS) || INITIAL_PATIENTS;
  }

  static getPatient(id: string): Patient | undefined {
    return this.getPatients().find(p => p.id === id);
  }

  static getCurrentPatient(): Patient {
    this.init();
    return cache.get<Patient>(CACHE_KEYS.CURRENT_PATIENT_SESSION) || this.getPatients()[0];
  }

  static setCurrentPatient(patient: Patient): void {
    this.init();
    cache.set(CACHE_KEYS.CURRENT_PATIENT_SESSION, patient);
    const token = this.getActiveToken(patient.id);
    if (token) {
      cache.set(CACHE_KEYS.ACTIVE_TOKEN, token);
    }
    this.logAudit('PATIENT_SESSION_CHANGED', 'patient', patient.id, `Active patient session set to ${patient.fullName}`);
  }

  /**
   * Simulated Aadhaar-Linked Patient Retrieval
   * COMPLIANCE: Strictly simulated prototype flow. No real Aadhaar API or storage.
   */
  static lookupPatientByPhone(phone: string): { 
    found: boolean; 
    patient?: Patient; 
    simulatedAadhaarRef?: string; 
    message: string;
  } {
    const cleanPhone = phone.replace(/\D/g, '');
    const patients = this.getPatients();
    
    // Match against last 10 digits
    const matched = patients.find(p => p.phone.replace(/\D/g, '').endsWith(cleanPhone.slice(-10)));

    if (matched) {
      return {
        found: true,
        patient: matched,
        simulatedAadhaarRef: matched.hypotheticalAadhaar,
        message: 'Identity matched via simulated Aadhaar-linked registry.',
      };
    }

    return {
      found: false,
      message: 'No existing patient profile found for this mobile number.',
    };
  }

  // --- Queue & Tokens ---
  static getQueue(): Token[] {
    this.init();
    return cache.get<Token[]>(CACHE_KEYS.CACHED_QUEUE) || INITIAL_TOKENS;
  }

  static getActiveToken(patientId?: string): Token | undefined {
    const queue = this.getQueue();
    if (patientId) {
      return queue.find(t => t.patientId === patientId && t.status !== 'completed' && t.status !== 'cancelled');
    }
    const cachedToken = cache.get<Token>(CACHE_KEYS.ACTIVE_TOKEN);
    if (cachedToken) {
      const live = queue.find(t => t.id === cachedToken.id);
      return live || cachedToken;
    }
    return queue[1]; // default to A-102
  }

  static setActiveToken(token: Token): void {
    this.init();
    cache.set(CACHE_KEYS.ACTIVE_TOKEN, token);
  }

  /**
   * Advance Queue (Call next patient / in consultation / complete)
   */
  static advanceQueue(clinicId?: string): { updatedQueue: Token[]; activeToken: Token | null } {
    let queue = [...this.getQueue()];
    
    // Find who is currently called or in consultation
    const inConsultIndex = queue.findIndex(t => t.status === 'in_consultation');
    if (inConsultIndex >= 0) {
      // Complete current consultation
      queue[inConsultIndex] = {
        ...queue[inConsultIndex],
        status: 'completed',
        queuePosition: -1,
      };
      this.logAudit('QUEUE_COMPLETED', 'token', queue[inConsultIndex].id, `Token ${queue[inConsultIndex].tokenNumber} consultation completed`);
    }

    // Call the next waiting patient
    const nextWaitingIndex = queue.findIndex(t => t.status === 'waiting' || t.status === 'called');
    if (nextWaitingIndex >= 0) {
      const wasCalled = queue[nextWaitingIndex].status === 'called';
      queue[nextWaitingIndex] = {
        ...queue[nextWaitingIndex],
        status: wasCalled ? 'in_consultation' : 'called',
        calledTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        queuePosition: 0,
        estimatedWaitMin: 0,
      };

      this.logAudit(
        wasCalled ? 'CONSULTATION_STARTED' : 'PATIENT_CALLED',
        'token',
        queue[nextWaitingIndex].id,
        `Token ${queue[nextWaitingIndex].tokenNumber} status is now ${queue[nextWaitingIndex].status}`
      );
    }

    // Re-index remaining waiting positions
    let pos = 1;
    queue = queue.map(t => {
      if (t.status === 'waiting') {
        const estWait = Math.max(3, pos * 7);
        pos++;
        return { ...t, queuePosition: pos - 1, estimatedWaitMin: estWait };
      }
      return t;
    });

    cache.set(CACHE_KEYS.CACHED_QUEUE, queue);
    
    // Also update active cached token
    const activeWaiting = queue.find(t => t.patientId === 'pat_priya_1') || queue[0];
    if (activeWaiting) {
      cache.set(CACHE_KEYS.ACTIVE_TOKEN, activeWaiting);
    }

    return { updatedQueue: queue, activeToken: activeWaiting };
  }

  /**
   * REBALANCE QUEUE BY DPS (Core Innovation)
   * Patients flagged with Diagnostic Stagnation / low DPS are prioritized and routed
   * to senior specialists rather than languishing behind simple routine checks.
   */
  static rebalanceQueueByDps(): { rebalanced: boolean; affectedTokens: string[]; message: string } {
    let queue = [...this.getQueue()];
    const waitingTokens = queue.filter(t => t.status === 'waiting');
    
    // Find if any waiting token has low DPS (< 50) and is not at position 1
    const stagnantWaiting = waitingTokens.filter(t => t.dpsScore < 50 || t.stagnationFlag);
    
    if (stagnantWaiting.length === 0) {
      return {
        rebalanced: false,
        affectedTokens: [],
        message: 'All waiting patients have stable diagnostic progress scores. Queue order is optimal.',
      };
    }

    // Sort waiting tokens: stagnant/critical DPS comes first, then by checkInTime
    const nonWaiting = queue.filter(t => t.status !== 'waiting');
    
    waitingTokens.sort((a, b) => {
      // Prioritize low DPS / flagged stagnation
      if (a.stagnationFlag && !b.stagnationFlag) return -1;
      if (!a.stagnationFlag && b.stagnationFlag) return 1;
      return a.dpsScore - b.dpsScore;
    });

    // Reassign queue positions and wait times
    let pos = 1;
    const reindexedWaiting = waitingTokens.map(t => {
      const wait = Math.max(4, pos * 6);
      const isPrioritized = t.stagnationFlag;
      const updated: Token = {
        ...t,
        queuePosition: pos,
        estimatedWaitMin: wait,
        priority: isPrioritized ? 'priority_stagnation' : 'standard',
        stagnationReason: isPrioritized 
          ? `Priority Rebalanced: Diagnostic Progress Score (${t.dpsScore}/100) indicates multi-test delay. Fast-tracked to Senior Consultant.`
          : undefined,
      };
      pos++;
      return updated;
    });

    const finalQueue = [...nonWaiting, ...reindexedWaiting];
    cache.set(CACHE_KEYS.CACHED_QUEUE, finalQueue);

    const affected = stagnantWaiting.map(t => t.tokenNumber);
    this.logAudit(
      'QUEUE_REBALANCED_DPS',
      'queue',
      'clinic_apex_1',
      `Rebalanced queue based on Diagnostic Progress Score for tokens: ${affected.join(', ')}`
    );

    return {
      rebalanced: true,
      affectedTokens: affected,
      message: `Queue rebalanced! Patients with Diagnostic Stagnation (${affected.join(', ')}) elevated to Senior Clinician triage.`,
    };
  }

  /**
   * Apply Stagnation-Aware Queue Policy Engine Rebalance (Scenario Step 7)
   * Expected duration: 10 min -> 15 min (+5 min buffer)
   * Routing: Senior review eligible
   * Updates ETA for downstream tokens behind A-27
   */
  static applyQueuePolicyRebalance(tokenId?: string): { success: boolean; token: Token; affectedDownstream: string[] } {
    let queue = [...this.getQueue()];
    const targetToken = queue.find(t => t.id === tokenId || t.tokenNumber === tokenId || t.tokenNumber === 'A-27') || queue[0];
    if (!targetToken) return { success: false, token: {} as Token, affectedDownstream: [] };

    const oldDuration = targetToken.expectedDuration || 10;
    const newDuration = 15;
    const addedBuffer = newDuration - oldDuration; // +5 minutes

    targetToken.expectedDuration = newDuration;
    targetToken.routing = 'Senior review eligible';
    targetToken.priority = 'priority_stagnation';

    // Update ETA estimates for patients behind this token
    const affectedDownstream: string[] = [];
    queue = queue.map(t => {
      if (t.id === targetToken.id) {
        return targetToken;
      }
      if (t.status === 'waiting' && t.queuePosition > targetToken.queuePosition) {
        affectedDownstream.push(t.tokenNumber);
        return {
          ...t,
          estimatedWaitMin: t.estimatedWaitMin + addedBuffer,
        };
      }
      return t;
    });

    cache.set(CACHE_KEYS.CACHED_QUEUE, queue);
    cache.set(CACHE_KEYS.ACTIVE_TOKEN, targetToken);

    this.logAudit(
      'QUEUE_POLICY_REBALANCED',
      'queue',
      targetToken.tokenNumber,
      `Queue Policy Engine applied to Token ${targetToken.tokenNumber}: Expected duration ${oldDuration}m → ${newDuration}m, Routing: Senior review eligible. Buffer applied to downstream tokens: ${affectedDownstream.join(', ')}`,
      'Dr. A. Sharma',
      '192.168.1.42 (Exam Room 101)',
      targetToken.patientName
    );

    return { success: true, token: targetToken, affectedDownstream };
  }

  /**
   * Scenario Step 9: Create Neurology Referral
   */
  static createDemoNeurologyReferral(customData?: Partial<Referral>): Referral {
    const referral: Referral = {
      id: customData?.id || 'ref_aarav_27',
      patientId: customData?.patientId || 'pat_aarav_0',
      patientName: customData?.patientName || 'Aarav Mehta',
      fromDoctorId: customData?.fromDoctorId || 'doc_sharma_1',
      fromDoctorName: customData?.fromDoctorName || 'Dr. Sharma',
      toSpecialty: customData?.toSpecialty || 'Neurology',
      reason: customData?.reason || 'Persistent diagnostic trajectory with limited recent convergence.',
      priority: customData?.priority || 'Recommended',
      status: customData?.status || 'Pending',
      referralToken: customData?.referralToken || 'NEU-04',
      specialistQueuePosition: customData?.specialistQueuePosition || 2,
      date: 'Today, 10:05 AM',
      clinicalNotes: customData?.clinicalNotes || 'Escalated for Multidisciplinary Review. Suspect atypical neurovascular mechanism.',
    };

    const referrals = this.getReferrals();
    const filtered = referrals.filter(r => r.id !== referral.id && r.referralToken !== referral.referralToken && r.referralToken !== 'REF-NEURO-27');
    cache.set(CACHE_KEYS.REFERRAL_RECORDS, [referral, ...filtered]);

    this.logAudit(
      'REFERRAL_CREATED',
      'referral',
      referral.id,
      `Referral created for ${referral.patientName}: ${referral.toSpecialty} (${referral.referralToken}), Priority: ${referral.priority}`,
      'Dr. Sharma',
      '192.168.1.42 (Exam Room 101)',
      referral.patientName
    );

    return referral;
  }

  /**
   * Scenario Step 10: Confirm & Update Journey (DPS 63 -> 68)
   */
  static applyJourneyUpdateAndImproveDps(): { oldDps: number; newDps: number; event: DiagnosticEvent } {
    const event: DiagnosticEvent = {
      id: 'evt_aarav_neuro_4',
      patientId: 'pat_aarav_0',
      date: 'Today, 10:15 AM',
      eventType: 'neurology_review',
      facility: 'Odyssey Apex Comprehensive Neurology Center',
      title: 'Comprehensive Neurological Evaluation & Contrast MRI Ordered',
      resultSummary: 'Detailed cranial nerve and cervical workup completed. High-resolution contrast-enhanced neurovascular imaging protocol initiated.',
      isConclusive: true,
      conclusivenessScore: 88,
      findings: 'Diagnostic trajectory actively advancing toward definitive etiology. Stagnation broken by direct neurology panel referral.',
      orderedBy: 'Dr. A. Sharma & Dr. K. Iyer',
    };

    // Add event
    const events = this.getDiagnosticEvents();
    const existingIdx = events.findIndex(e => e.id === event.id);
    if (existingIdx === -1) {
      cache.set(CACHE_KEYS.DIAGNOSTIC_EVENTS, [event, ...events]);
    }

    // Update Aarav's DPS: 63 -> 68
    const patients = this.getPatients().map(p => {
      if (p.id === 'pat_aarav_0') {
        return {
          ...p,
          currentDps: 68,
          hasStagnation: false,
          activeJourneySummary: 'Journey showing improvement: Active Neurology referral (REF-NEURO-27) scheduled. Diagnostic progress score elevated to 68/100.',
        };
      }
      return p;
    });
    cache.set(CACHE_KEYS.PATIENT_RECORDS, patients);

    // Update Aarav's token
    const queue = this.getQueue().map(t => {
      if (t.patientId === 'pat_aarav_0' || t.tokenNumber === 'A-27') {
        return {
          ...t,
          dpsScore: 68,
          stagnationFlag: false,
        };
      }
      return t;
    });
    cache.set(CACHE_KEYS.CACHED_QUEUE, queue);

    this.logAudit(
      'DPS_IMPROVED',
      'patient',
      'pat_aarav_0',
      `Diagnostic Progress Score updated for Aarav Mehta: 63 → 68. Trajectory: Journey showing improvement. Stagnation resolved.`,
      'Longitudinal Diagnostic Engine',
      'System Autonomous Worker',
      'Aarav Mehta'
    );

    return { oldDps: 63, newDps: 68, event };
  }

  /**
   * Action: Trigger Diagnostic Stagnation
   * Sets patient and token to Stagnation Flagged state (DPS 63) with audit log and sync
   */
  static triggerStagnationSimulation(tokenId?: string): { success: boolean; token: Token; dps: number } {
    let queue = [...this.getQueue()];
    const target = tokenId 
      ? queue.find(t => t.id === tokenId || t.tokenNumber === tokenId)
      : (queue.find(t => t.tokenNumber === 'A-27') || queue[0]);

    if (!target) return { success: false, token: {} as Token, dps: 63 };

    target.stagnationFlag = true;
    target.priority = 'priority_stagnation';
    target.dpsScore = 63;
    target.stagnationReason = 'Diagnostic trajectory plateaued: 8-month delay across 3 specialties with repeated negative CT/MRI workup.';

    // Update queue & active token
    queue = queue.map(t => t.id === target.id ? target : t);
    cache.set(CACHE_KEYS.CACHED_QUEUE, queue);
    cache.set(CACHE_KEYS.ACTIVE_TOKEN, target);

    // Update patient record
    const patients = this.getPatients().map(p => {
      if (p.id === target.patientId || p.id === 'pat_aarav_0') {
        return {
          ...p,
          hasStagnation: true,
          currentDps: 63,
          activeJourneySummary: '8-month diagnostic odyssey: Persistent headache refractory across 3 specialties with 2 repeated scans. Stagnation flagged.',
        };
      }
      return p;
    });
    cache.set(CACHE_KEYS.PATIENT_RECORDS, patients);

    this.logAudit(
      'STAGNATION_FLAGGED',
      'patient',
      target.patientId,
      `Diagnostic stagnation flagged for ${target.patientName} (Token ${target.tokenNumber}). DPS: 63/100. Senior review recommended.`,
      'Diagnostic AI Engine',
      'System Sentinel',
      target.patientName
    );

    // Supabase async sync
    SupabaseService.updateTokenStatus(target.id, target.status, {
      stagnation_flag: true,
      dps_score: 63,
    }).catch(err => console.warn('[Supabase] triggerStagnation token sync:', err));

    return { success: true, token: target, dps: 63 };
  }

  /**
   * Action: Complete Consultation
   * Completes active or target consultation, frees clinician, updates Sanctuary Pulse
   */
  static completeConsultationSimulation(tokenId?: string): Token | undefined {
    const queue = this.getQueue();
    // Prioritize currently consulting token, or target, or A-27
    const inConsult = queue.find(t => t.status === 'in_consultation');
    const target = tokenId 
      ? queue.find(t => t.id === tokenId || t.tokenNumber === tokenId)
      : (inConsult || queue.find(t => t.tokenNumber === 'A-27') || queue[0]);

    if (!target) return undefined;

    const completed = this.completeVisit(target.id);
    if (completed) {
      completed.sanctuary_state = 'COMPLETED';
      cache.set(CACHE_KEYS.ACTIVE_TOKEN, completed);

      const sim = this.getSimulationState();
      this.setSimulationState({
        ...sim,
        forcedPulseState: 'COMPLETED',
      });
    }

    return completed;
  }

  /**
   * DIRECT QUEUE CONTROLS (Operations Command Center)
   */
  static callToken(tokenId: string, doctorName?: string, room?: string): Token | undefined {
    let queue = [...this.getQueue()];
    const index = queue.findIndex(t => t.id === tokenId || t.tokenNumber === tokenId);
    if (index === -1) return undefined;

    const target = queue[index];
    const updatedToken: Token = {
      ...target,
      status: 'called',
      calledTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      queuePosition: 0,
      estimatedWaitMin: 0,
      doctorName: doctorName || target.doctorName,
      roomNumber: room || target.roomNumber || 'Room 101',
    };
    queue[index] = updatedToken;

    // Recalculate remaining waiting positions
    let pos = 1;
    queue = queue.map((t, idx) => {
      if (idx !== index && t.status === 'waiting') {
        const res = { ...t, queuePosition: pos, estimatedWaitMin: pos * 6 };
        pos++;
        return res;
      }
      return t;
    });

    cache.set(CACHE_KEYS.CACHED_QUEUE, queue);
    cache.set(CACHE_KEYS.ACTIVE_TOKEN, updatedToken);

    this.logAudit(
      'TOKEN_CALLED',
      'token',
      target.id,
      `Called Token ${target.tokenNumber} (${target.patientName}) to ${updatedToken.roomNumber || 'Room 101'}`,
      doctorName || 'Dr. Sharma (CMO)',
      '192.168.1.42 (Station 01)',
      target.patientName
    );

    // Asynchronous Supabase synchronization & real-time broadcast
    SupabaseService.clinicCallNextFlow(target.id, updatedToken.doctorName, updatedToken.roomNumber).catch(err => {
      console.warn('[Supabase] clinicCallNextFlow error:', err);
    });

    return updatedToken;
  }

  static startConsultation(tokenId: string): Token | undefined {
    let queue = [...this.getQueue()];
    const index = queue.findIndex(t => t.id === tokenId || t.tokenNumber === tokenId);
    if (index === -1) return undefined;

    const target = queue[index];
    const updatedToken: Token = {
      ...target,
      status: 'in_consultation',
      queuePosition: 0,
      estimatedWaitMin: 0,
    };
    queue[index] = updatedToken;
    cache.set(CACHE_KEYS.CACHED_QUEUE, queue);
    cache.set(CACHE_KEYS.ACTIVE_TOKEN, updatedToken);

    // Update doctor's current status
    const doctors = this.getDoctors().map(doc => {
      if (doc.id === target.doctorId || doc.name === target.doctorName) {
        return { ...doc, status: 'consulting' as const, currentPatientToken: target.tokenNumber };
      }
      return doc;
    });
    cache.set(CACHE_KEYS.DOCTORS_STATE, doctors);

    this.logAudit(
      'CONSULTATION_STARTED',
      'token',
      target.id,
      `Consultation actively started for Token ${target.tokenNumber}`,
      target.doctorName,
      '192.168.1.42 (Station 01)',
      target.patientName
    );

    // Asynchronous Supabase synchronization
    SupabaseService.doctorStartConsultationFlow(target.id).catch(err => {
      console.warn('[Supabase] doctorStartConsultationFlow error:', err);
    });

    return updatedToken;
  }

  static completeVisit(tokenId: string): Token | undefined {
    let queue = [...this.getQueue()];
    const index = queue.findIndex(t => t.id === tokenId || t.tokenNumber === tokenId);
    if (index === -1) return undefined;

    const target = queue[index];
    const updatedToken: Token = {
      ...target,
      status: 'completed',
      queuePosition: -1,
      estimatedWaitMin: 0,
    };
    queue[index] = updatedToken;

    // Increment doctor patient count
    const doctors = this.getDoctors().map(doc => {
      if (doc.id === target.doctorId || doc.name === target.doctorName) {
        return { 
          ...doc, 
          status: 'reviewing_history' as const, 
          currentPatientToken: undefined,
          patientsSeenToday: (doc.patientsSeenToday || 0) + 1 
        };
      }
      return doc;
    });
    cache.set(CACHE_KEYS.DOCTORS_STATE, doctors);

    // Re-index remaining waiting
    let pos = 1;
    queue = queue.map((t, idx) => {
      if (idx !== index && t.status === 'waiting') {
        const res = { ...t, queuePosition: pos, estimatedWaitMin: pos * 6 };
        pos++;
        return res;
      }
      return t;
    });

    cache.set(CACHE_KEYS.CACHED_QUEUE, queue);
    cache.set(CACHE_KEYS.ACTIVE_TOKEN, updatedToken);

    this.logAudit(
      'VISIT_COMPLETED',
      'token',
      target.id,
      `Consultation completed for Token ${target.tokenNumber}. Diagnostic summaries synced.`,
      target.doctorName,
      '192.168.1.42 (Station 01)',
      target.patientName
    );

    // Asynchronous Supabase synchronization
    SupabaseService.doctorCompleteConsultationFlow(target.id).catch(err => {
      console.warn('[Supabase] doctorCompleteConsultationFlow error:', err);
    });

    return updatedToken;
  }

  static doctorReviewHistory(tokenId: string, doctorId?: string): Token | undefined {
    let queue = [...this.getQueue()];
    const index = queue.findIndex(t => t.id === tokenId || t.tokenNumber === tokenId);
    if (index === -1) return undefined;

    const target = queue[index];
    const updatedToken: Token = {
      ...target,
      sanctuary_state: 'DOCTOR_REVIEWING',
    };
    queue[index] = updatedToken;
    cache.set(CACHE_KEYS.CACHED_QUEUE, queue);
    cache.set(CACHE_KEYS.ACTIVE_TOKEN, updatedToken);

    // Update doctor's status
    const doctors = this.getDoctors().map(doc => {
      if (doc.id === target.doctorId || doc.name === target.doctorName || (doctorId && doc.id === doctorId)) {
        return { 
          ...doc, 
          status: 'reviewing_history' as const, 
          currentPatientToken: target.tokenNumber 
        };
      }
      return doc;
    });
    cache.set(CACHE_KEYS.DOCTORS_STATE, doctors);

    // Update simulation state
    const sim = this.getSimulationState();
    this.setSimulationState({
      ...sim,
      doctorReviewingToken: target.tokenNumber,
      forcedPulseState: 'DOCTOR_REVIEWING',
    });

    this.logAudit(
      'DOCTOR_REVIEWING_HISTORY',
      'token',
      target.id,
      `Doctor is reviewing longitudinal history & diagnostic chart for Token ${target.tokenNumber} (${target.patientName})`,
      target.doctorName,
      '192.168.1.42 (Station 01)',
      target.patientName
    );

    // Asynchronous Supabase synchronization & notification
    SupabaseService.updateTokenStatus(target.id, target.status, {
      sanctuary_state: 'DOCTOR_REVIEWING',
    }).catch(err => console.warn('[Supabase] doctorReviewHistory token sync:', err));

    SupabaseService.addNotification({
      user_id: target.patientId,
      title: 'Doctor reviewing history',
      message: 'Your doctor is taking a moment to review your past diagnostic records.',
      type: 'pulse',
    }).catch(err => console.warn('[Supabase] doctorReviewHistory notif sync:', err));

    return updatedToken;
  }

  static skipToken(tokenId: string, reason: string = 'Patient did not respond to chime'): Token | undefined {
    let queue = [...this.getQueue()];
    const index = queue.findIndex(t => t.id === tokenId || t.tokenNumber === tokenId);
    if (index === -1) return undefined;

    const target = queue[index];
    const updatedToken: Token = {
      ...target,
      status: 'skipped',
      queuePosition: -1,
      stagnationReason: reason,
    };
    queue[index] = updatedToken;

    // Re-index waiting
    let pos = 1;
    queue = queue.map((t, idx) => {
      if (idx !== index && t.status === 'waiting') {
        const res = { ...t, queuePosition: pos, estimatedWaitMin: pos * 6 };
        pos++;
        return res;
      }
      return t;
    });

    cache.set(CACHE_KEYS.CACHED_QUEUE, queue);

    this.logAudit(
      'TOKEN_SKIPPED',
      'token',
      target.id,
      `Token ${target.tokenNumber} skipped: ${reason}`,
      'Clinic Coordinator',
      '192.168.1.10 (Reception Desk)',
      target.patientName
    );

    return updatedToken;
  }

  static recallToken(tokenId: string): Token | undefined {
    let queue = [...this.getQueue()];
    const index = queue.findIndex(t => t.id === tokenId || t.tokenNumber === tokenId);
    if (index === -1) return undefined;

    const target = queue[index];
    const updatedToken: Token = {
      ...target,
      status: 'waiting',
      queuePosition: 1,
      estimatedWaitMin: 4,
    };
    queue[index] = updatedToken;

    // Shift other waiting tokens
    let pos = 2;
    queue = queue.map((t, idx) => {
      if (idx !== index && t.status === 'waiting') {
        const res = { ...t, queuePosition: pos, estimatedWaitMin: pos * 6 };
        pos++;
        return res;
      }
      return t;
    });

    cache.set(CACHE_KEYS.CACHED_QUEUE, queue);
    cache.set(CACHE_KEYS.ACTIVE_TOKEN, updatedToken);

    this.logAudit(
      'TOKEN_RECALLED',
      'token',
      target.id,
      `Token ${target.tokenNumber} recalled and restored to Priority Position 1.`,
      'Clinic Coordinator',
      '192.168.1.10 (Reception Desk)',
      target.patientName
    );

    return updatedToken;
  }

  static markArrived(tokenId: string): Token | undefined {
    let queue = [...this.getQueue()];
    const index = queue.findIndex(t => t.id === tokenId || t.tokenNumber === tokenId);
    if (index === -1) return undefined;

    const target = queue[index];
    this.logAudit(
      'PATIENT_ARRIVED',
      'token',
      target.id,
      `Patient ${target.patientName} (Token ${target.tokenNumber}) checked in and present in sanctuary lounge`,
      'Reception Kiosk 01',
      '192.168.1.15 (Front Lobby)',
      target.patientName
    );
    return target;
  }

  static pauseQueue(isPaused: boolean): boolean {
    cache.set(CACHE_KEYS.QUEUE_PAUSED, isPaused);
    this.logAudit(
      isPaused ? 'QUEUE_PAUSED' : 'QUEUE_RESUMED',
      'queue',
      'clinic_apex_1',
      isPaused ? 'Clinic queue paused for room turnover/shift handoff' : 'Clinic queue resumed normal patient dispatch',
      'Clinic Ops Manager',
      '192.168.1.42 (Station 01)'
    );
    return isPaused;
  }

  static isQueuePaused(): boolean {
    return Boolean(cache.get<boolean>(CACHE_KEYS.QUEUE_PAUSED));
  }

  // --- Clinic Settings ---
  static getClinicSettings(): ClinicSettings {
    this.init();
    return cache.get<ClinicSettings>(CACHE_KEYS.CLINIC_SETTINGS) || DEFAULT_CLINIC_SETTINGS;
  }

  static updateClinicSettings(settings: Partial<ClinicSettings>): ClinicSettings {
    this.init();
    const current = this.getClinicSettings();
    const updated = { ...current, ...settings };
    cache.set(CACHE_KEYS.CLINIC_SETTINGS, updated);
    this.logAudit(
      'SETTINGS_UPDATED',
      'settings',
      'clinic_apex_1',
      `Updated clinic operational parameters: policy=${updated.queuePolicy}, consultation=${updated.defaultConsultationMin}m`,
      'Clinic Administrator',
      '192.168.1.1 (Admin Console)'
    );
    return updated;
  }

  /**
   * Token Generation / Check-in
   */
  static generateToken(params: {
    patientId: string;
    clinicId: string;
    doctorId?: string;
    symptomsSummary: string;
    severity?: number;
    durationDays?: number;
  }): Token {
    const queue = this.getQueue();
    const patient = this.getPatient(params.patientId);
    const clinic = this.getClinic(params.clinicId) || INITIAL_CLINICS[0];
    const doctors = this.getDoctors();
    
    // Choose doctor (if patient has low DPS, assign Senior Specialist)
    let assignedDoctor = doctors.find(d => d.id === params.doctorId);
    if (!assignedDoctor) {
      if (patient && patient.currentDps < 50) {
        assignedDoctor = doctors.find(d => (d.specialty || '').includes('Senior') || (d.specialty || '').includes('Diagnostic')) || doctors[0];
      } else {
        assignedDoctor = doctors[1] || doctors[0];
      }
    }

    const nextNumber = `A-${101 + queue.length}`;
    const waitingCount = queue.filter(t => t.status === 'waiting').length;
    const estWait = (waitingCount + 1) * 8;

    const isStagnant = (patient?.currentDps || 85) < 50 || (params.durationDays && params.durationDays > 60);

    const newToken: Token = {
      id: `tok_${Date.now()}`,
      tokenNumber: nextNumber,
      patientId: params.patientId,
      patientName: patient?.fullName || 'Walk-in Patient',
      patientAge: patient?.age || 30,
      patientGender: patient?.gender || 'Other',
      clinicId: clinic.id,
      clinicName: clinic.name,
      doctorId: assignedDoctor.id,
      doctorName: assignedDoctor.name,
      specialty: assignedDoctor.specialty,
      status: 'waiting',
      priority: isStagnant ? 'priority_stagnation' : 'standard',
      queuePosition: waitingCount + 1,
      estimatedWaitMin: estWait,
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dpsScore: patient?.currentDps || 85,
      stagnationFlag: Boolean(isStagnant),
      stagnationReason: isStagnant ? 'Duration > 60 days with uncharacterized symptoms' : undefined,
      symptomsSummary: params.symptomsSummary,
    };

    queue.push(newToken);
    cache.set(CACHE_KEYS.CACHED_QUEUE, queue);
    cache.set(CACHE_KEYS.ACTIVE_TOKEN, newToken);

    this.logAudit('TOKEN_GENERATED', 'token', newToken.id, `Generated token ${newToken.tokenNumber} for ${newToken.patientName}`);

    // Asynchronous Supabase synchronization
    if (patient) {
      SupabaseService.patientJoinQueueFlow({
        patient,
        clinicId: clinic.id,
        clinicName: clinic.name,
        doctorId: assignedDoctor.id,
        doctorName: assignedDoctor.name,
        specialty: assignedDoctor.specialty,
        reason: params.symptomsSummary || 'Walk-in Consultation',
        symptomsSummary: params.symptomsSummary || '',
        severity: params.severity || 6,
        durationDays: params.durationDays || 14,
      }).catch(err => {
        console.warn('[Supabase] patientJoinQueueFlow error:', err);
      });
    }

    return newToken;
  }

  // --- Diagnostic Events & Signals ---
  static getDiagnosticEvents(patientId?: string): DiagnosticEvent[] {
    this.init();
    const events = cache.get<DiagnosticEvent[]>(CACHE_KEYS.DIAGNOSTIC_EVENTS) || INITIAL_DIAGNOSTIC_EVENTS;
    return patientId ? events.filter(e => e.patientId === patientId) : events;
  }

  static getSymptoms(patientId?: string): Symptom[] {
    return patientId ? INITIAL_SYMPTOMS.filter(s => s.patientId === patientId) : INITIAL_SYMPTOMS;
  }

  // --- Billing ---
  static getBillingRecords(patientId?: string): BillingRecord[] {
    this.init();
    const records = cache.get<BillingRecord[]>(CACHE_KEYS.BILLING_RECORDS) || INITIAL_BILLING;
    return patientId ? records.filter(b => b.patientId === patientId) : records;
  }

  static payBillingRecord(billId: string, paymentMethod: string = 'UPI FastPay'): BillingRecord | undefined {
    const records = this.getBillingRecords().map(b => {
      if (b.id === billId || b.tokenNumber === billId) {
        return { ...b, status: 'paid' as const, paymentMethod };
      }
      return b;
    });
    cache.set(CACHE_KEYS.BILLING_RECORDS, records);
    this.logAudit('BILLING_PAID', 'billing', billId, `Bill ${billId} marked paid via ${paymentMethod}`);
    return records.find(b => b.id === billId || b.tokenNumber === billId);
  }

  // --- Encounters & Visits ---
  static getVisits(patientId?: string): Visit[] {
    this.init();
    const visits = cache.get<Visit[]>(CACHE_KEYS.VISIT_RECORDS) || INITIAL_VISITS;
    return patientId ? visits.filter(v => v.patientId === patientId) : visits;
  }

  // --- Appointments ---
  static getAppointments(patientId?: string): Appointment[] {
    this.init();
    const stored = cache.get<Appointment[]>('odyssey_appointments');
    if (stored && stored.length > 0) {
      return patientId ? stored.filter(a => a.patientId === patientId) : stored;
    }
    const defaultAppointments: Appointment[] = [
      {
        id: 'apt_sharma_01',
        patientId: 'pat_aarav_0',
        doctorId: 'doc_sharma_1',
        doctorName: 'Dr. A. Sharma',
        doctorSpecialty: 'General Medicine',
        doctorAvatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
        clinicId: 'clinic_odyssey_care',
        clinicName: 'Odyssey Care Clinic',
        clinicAddress: 'Indiranagar 100ft Road, Bengaluru',
        date: 'Tomorrow',
        time: '10:30 AM',
        type: 'in_person',
        status: 'upcoming',
        symptoms: 'Diarrhea & Fatigue Consultation',
        roomNumber: 'Room 101',
        fee: 800,
      },
    ];
    cache.set('odyssey_appointments', defaultAppointments);
    return patientId ? defaultAppointments.filter(a => a.patientId === patientId) : defaultAppointments;
  }

  static saveAppointment(apt: Appointment): void {
    this.init();
    const list = this.getAppointments();
    const filtered = list.filter(a => a.id !== apt.id);
    const updated = [apt, ...filtered];
    cache.set('odyssey_appointments', updated);
  }

  static rescheduleAppointment(aptId: string, newDate: string, newTime: string): Appointment | null {
    this.init();
    const list = this.getAppointments();
    const target = list.find(a => a.id === aptId);
    if (!target) return null;
    target.date = newDate;
    target.time = newTime;
    target.status = 'upcoming';
    cache.set('odyssey_appointments', [...list]);
    return target;
  }

  static cancelAppointment(aptId: string): void {
    this.init();
    const list = this.getAppointments();
    const target = list.find(a => a.id === aptId);
    if (target) {
      target.status = 'cancelled';
      cache.set('odyssey_appointments', [...list]);
    }
  }

  // --- Specialist Referrals ---
  static getReferrals(patientId?: string): Referral[] {
    this.init();
    const referrals = cache.get<Referral[]>(CACHE_KEYS.REFERRAL_RECORDS) || INITIAL_REFERRALS;
    return patientId ? referrals.filter(r => r.patientId === patientId) : referrals;
  }

  static createReferral(referralData: Omit<Referral, 'id'> & { id?: string }): Referral {
    this.init();
    const referrals = this.getReferrals();
    const newReferral: Referral = {
      id: referralData.id || `ref_${Date.now()}`,
      patientId: referralData.patientId,
      patientName: referralData.patientName,
      fromDoctorId: referralData.fromDoctorId,
      fromDoctorName: referralData.fromDoctorName,
      toSpecialty: referralData.toSpecialty,
      reason: referralData.reason,
      priority: referralData.priority || 'Urgent',
      status: referralData.status || 'Pending',
      specialistQueuePosition: referralData.specialistQueuePosition || (referrals.length + 1),
      date: referralData.date || 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      clinicalNotes: referralData.clinicalNotes || 'Odyssey DPS Escalation Referral',
    };
    const updated = [newReferral, ...referrals];
    cache.set(CACHE_KEYS.REFERRAL_RECORDS, updated);
    this.logAudit(
      'REFERRAL_CREATED',
      'referral',
      newReferral.id,
      `Specialist referral created for ${newReferral.patientName} to ${newReferral.toSpecialty}`,
      newReferral.fromDoctorName,
      '192.168.1.42 (Station 01)',
      newReferral.patientName
    );

    // Asynchronous Supabase synchronization
    SupabaseService.createReferralFlow(newReferral).catch(err => {
      console.warn('[Supabase] createReferral error:', err);
    });

    return newReferral;
  }

  // --- Supabase Persistence Utilities ---
  static async seedSupabase(): Promise<{ success: boolean; message: string }> {
    const res = await SupabaseService.seedSupabaseDatabase({
      clinics: this.getClinics(),
      doctors: this.getDoctors(),
      doctorShifts: INITIAL_SHIFTS,
      patients: this.getPatients(),
      visits: this.getVisits(),
      tokens: this.getQueue(),
      symptoms: INITIAL_SYMPTOMS,
      diagnosticEvents: this.getDiagnosticEvents(),
      referrals: this.getReferrals(),
      billing: this.getBillingRecords(),
    });
    return {
      success: res.success,
      message: res.message || (res.success ? `Seeded ${res.count} records into Supabase PostgreSQL tables!` : (res.error || 'Seeding failed')),
    };
  }

  static isSupabaseConnected(): boolean {
    return isSupabaseConfigured;
  }

  // --- Simulation Engine State for Sanctuary Pulse ---
  static getSimulationState(): {
    currentServingNumber: number;
    currentServingToken: string;
    targetTokenNumber: number;
    targetToken: string;
    isDelayed: boolean;
    autoAdvance: boolean;
    speedSec: number;
    forcedPulseState?: SanctuaryPulseStateCode | null;
    doctorReviewingToken?: string | null;
    lastQueueMoveTime?: number;
  } {
    this.init();
    const fallback = {
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
    };
    return cache.get(CACHE_KEYS.SIMULATION_STATE) || fallback;
  }

  static setSimulationState(state: any) {
    cache.set(CACHE_KEYS.SIMULATION_STATE, state);
  }

  /**
   * Action 1: Advance Queue
   * Moves live queue forward by 1 token, updating Admin UI, Patient UI, localStorage and Supabase
   */
  static stepSimulationQueue(): { currentServingToken: string; patientsAhead: number } {
    return this.advanceQueueSimulation();
  }

  static advanceQueueSimulation(): { currentServingToken: string; patientsAhead: number } {
    const sim = this.getSimulationState();
    const nextNum = sim.currentServingNumber < 28 ? sim.currentServingNumber + 1 : sim.currentServingNumber;
    const updatedSim = {
      ...sim,
      currentServingNumber: nextNum,
      currentServingToken: `A-${nextNum}`,
      lastQueueMoveTime: Date.now(),
      forcedPulseState: null, // clear manual override on queue advancement
    };
    this.setSimulationState(updatedSim);

    // Update queue token positions
    const queue = this.getQueue();
    const aaravToken = queue.find(t => t.tokenNumber === 'A-27') || queue[0];
    const patientsAhead = Math.max(0, 27 - nextNum);

    if (aaravToken) {
      const isCalled = nextNum >= 27;
      const isDone = nextNum > 27;
      aaravToken.queuePosition = patientsAhead;
      aaravToken.estimatedWaitMin = patientsAhead * 4;
      aaravToken.status = isDone ? 'completed' : isCalled ? 'called' : 'waiting';
      aaravToken.sanctuary_state = isDone 
        ? 'COMPLETED' 
        : isCalled 
        ? 'YOUR_TURN' 
        : patientsAhead === 1 
        ? 'PLEASE_REPORT'
        : patientsAhead === 2 
        ? 'ALMOST_YOUR_TURN' 
        : patientsAhead < 7 
        ? 'QUEUE_MOVING' 
        : 'QUEUE_STABLE';
      
      cache.set(CACHE_KEYS.CACHED_QUEUE, queue);
      cache.set(CACHE_KEYS.ACTIVE_TOKEN, aaravToken);

      // Async sync with Supabase
      SupabaseService.updateTokenStatus(aaravToken.id, aaravToken.status, {
        queue_position: patientsAhead,
        estimated_wait_minutes: patientsAhead * 4,
        sanctuary_state: aaravToken.sanctuary_state,
      }).catch(err => console.warn('[Supabase] advanceQueue token sync:', err));
    }

    this.logAudit(
      'QUEUE_ADVANCED',
      'queue',
      `A-${nextNum}`,
      `Queue advanced to Token A-${nextNum}. Target patient A-27 now has ${patientsAhead} ahead.`,
      'Queue Simulation Engine',
      '192.168.1.1 (Simulator)'
    );

    return {
      currentServingToken: `A-${nextNum}`,
      patientsAhead,
    };
  }

  /**
   * Action 2: Trigger Delay
   * Reports a slight delay due to extended diagnostic reviews
   */
  static triggerDelaySimulation(forceValue?: boolean): boolean {
    const sim = this.getSimulationState();
    const isDelayed = forceValue !== undefined ? forceValue : !sim.isDelayed;
    this.setSimulationState({ 
      ...sim, 
      isDelayed,
      forcedPulseState: isDelayed ? 'SLIGHT_DELAY' : null,
    });

    const queue = this.getQueue();
    const aaravToken = queue.find(t => t.tokenNumber === 'A-27') || queue[0];
    if (aaravToken) {
      aaravToken.sanctuary_state = isDelayed ? 'SLIGHT_DELAY' : 'QUEUE_STABLE';
      aaravToken.estimatedWaitMin = isDelayed ? aaravToken.estimatedWaitMin + 12 : Math.max(4, aaravToken.queuePosition * 4);
      cache.set(CACHE_KEYS.CACHED_QUEUE, queue);
      cache.set(CACHE_KEYS.ACTIVE_TOKEN, aaravToken);

      SupabaseService.updateTokenStatus(aaravToken.id, aaravToken.status, {
        sanctuary_state: isDelayed ? 'SLIGHT_DELAY' : 'QUEUE_STABLE',
        estimated_wait_minutes: aaravToken.estimatedWaitMin,
      }).catch(err => console.warn('[Supabase] triggerDelay token sync:', err));

      if (isDelayed) {
        SupabaseService.addNotification({
          user_id: aaravToken.patientId,
          title: 'Slight delay reported',
          message: 'The clinic is taking a little longer than usual. We will keep you updated.',
          type: 'pulse',
        }).catch(err => console.warn('[Supabase] triggerDelay notif sync:', err));
      }
    }

    this.logAudit(
      isDelayed ? 'DELAY_TRIGGERED' : 'DELAY_RESOLVED',
      'queue',
      'sim_delay',
      isDelayed ? 'Simulated delay triggered: clinical turnaround extended.' : 'Simulated delay cleared: clinic pace restored.',
      'Queue Simulation Engine',
      '192.168.1.1 (Simulator)'
    );

    return isDelayed;
  }

  static toggleSimulationDelay(): boolean {
    return this.triggerDelaySimulation();
  }

  /**
   * Action 3: Doctor Reviewing
   * Simulates clinician opening and reviewing patient's longitudinal history
   */
  static doctorReviewingSimulation(tokenId?: string): void {
    const queue = this.getQueue();
    const target = tokenId 
      ? queue.find(t => t.id === tokenId || t.tokenNumber === tokenId)
      : (queue.find(t => t.tokenNumber === 'A-27') || queue[0]);

    if (target) {
      this.doctorReviewHistory(target.id, target.doctorId);
    } else {
      const sim = this.getSimulationState();
      this.setSimulationState({
        ...sim,
        forcedPulseState: 'DOCTOR_REVIEWING',
      });
    }
  }

  /**
   * Action 4: Approaching Turn
   * Moves patient to position #2 (almost your turn) so patient is alerted to remain nearby
   */
  static approachingTurnSimulation(tokenId?: string): void {
    const sim = this.getSimulationState();
    this.setSimulationState({
      ...sim,
      currentServingNumber: 25,
      currentServingToken: 'A-25',
      forcedPulseState: 'ALMOST_YOUR_TURN',
    });

    const queue = this.getQueue();
    const target = tokenId 
      ? queue.find(t => t.id === tokenId || t.tokenNumber === tokenId)
      : (queue.find(t => t.tokenNumber === 'A-27') || queue[0]);

    if (target) {
      target.queuePosition = 2;
      target.estimatedWaitMin = 8;
      target.status = 'waiting';
      target.sanctuary_state = 'ALMOST_YOUR_TURN';
      cache.set(CACHE_KEYS.CACHED_QUEUE, queue);
      cache.set(CACHE_KEYS.ACTIVE_TOKEN, target);

      SupabaseService.updateTokenStatus(target.id, 'waiting', {
        queue_position: 2,
        estimated_wait_minutes: 8,
        sanctuary_state: 'ALMOST_YOUR_TURN',
      }).catch(err => console.warn('[Supabase] approachingTurn token sync:', err));

      SupabaseService.addNotification({
        user_id: target.patientId,
        title: 'Your turn is getting close',
        message: 'Only 2 patients ahead. Please remain nearby outside your consultation room.',
        type: 'pulse',
      }).catch(err => console.warn('[Supabase] approachingTurn notif sync:', err));
    }

    this.logAudit(
      'QUEUE_APPROACHING',
      'token',
      target?.id || 'A-27',
      `Patient ${target?.patientName || 'Aarav'} transitioned to ALMOST_YOUR_TURN (2 ahead)`,
      'Queue Simulation Engine',
      '192.168.1.1 (Simulator)'
    );
  }

  /**
   * Action 5: Call Patient
   * Triggers YOUR_TURN state and calls patient to reception / consultation room
   */
  static callPatientSimulation(tokenId?: string): void {
    const queue = this.getQueue();
    const target = tokenId 
      ? queue.find(t => t.id === tokenId || t.tokenNumber === tokenId)
      : (queue.find(t => t.tokenNumber === 'A-27') || queue[0]);

    const sim = this.getSimulationState();
    this.setSimulationState({
      ...sim,
      currentServingNumber: 27,
      currentServingToken: 'A-27',
      forcedPulseState: 'YOUR_TURN',
    });

    if (target) {
      this.callToken(target.id, target.doctorName, target.roomNumber || 'Room 101');
      target.sanctuary_state = 'YOUR_TURN';
      cache.set(CACHE_KEYS.ACTIVE_TOKEN, target);
    }
  }

  /**
   * Explicitly sets any of the 10 Sanctuary Pulse States for instant demo verification
   */
  static setExplicitPulseState(code: SanctuaryPulseStateCode | null, tokenId?: string): void {
    const sim = this.getSimulationState();
    this.setSimulationState({
      ...sim,
      forcedPulseState: code,
      isDelayed: code === 'SLIGHT_DELAY' || code === 'DELAY',
    });

    const queue = this.getQueue();
    const target = tokenId 
      ? queue.find(t => t.id === tokenId || t.tokenNumber === tokenId)
      : (queue.find(t => t.tokenNumber === 'A-27') || queue[0]);

    if (target) {
      if (code) {
        target.sanctuary_state = code;
        if (code === 'COMPLETED') {
          target.status = 'completed';
          target.queuePosition = -1;
          target.estimatedWaitMin = 0;
        } else if (code === 'IN_CONSULTATION') {
          target.status = 'in_consultation';
          target.queuePosition = 0;
          target.estimatedWaitMin = 0;
        } else if (code === 'YOUR_TURN') {
          target.status = 'called';
          target.queuePosition = 0;
          target.estimatedWaitMin = 0;
        } else if (code === 'ALMOST_YOUR_TURN') {
          target.status = 'waiting';
          target.queuePosition = 2;
          target.estimatedWaitMin = 8;
        } else if (code === 'PLEASE_REPORT') {
          target.status = 'waiting';
          target.queuePosition = 4;
          target.estimatedWaitMin = 16;
        } else if (code === 'CHECKIN_CONFIRMED') {
          target.status = 'waiting';
          target.queuePosition = 8;
          target.estimatedWaitMin = 32;
        } else {
          target.status = 'waiting';
          target.queuePosition = 5;
          target.estimatedWaitMin = 20;
        }
      }
      cache.set(CACHE_KEYS.CACHED_QUEUE, queue);
      cache.set(CACHE_KEYS.ACTIVE_TOKEN, target);

      if (code) {
        SupabaseService.updateTokenStatus(target.id, target.status, {
          sanctuary_state: code,
          queue_position: target.queuePosition,
          estimated_wait_minutes: target.estimatedWaitMin,
        }).catch(err => console.warn('[Supabase] setExplicitPulseState token sync:', err));
      }
    }

    this.logAudit(
      'PULSE_STATE_OVERRIDE',
      'token',
      code || 'RESET',
      `Sanctuary Pulse manually set to ${code || 'DYNAMIC AUTO'} for token ${target?.tokenNumber || 'A-27'}`,
      'Simulation Switcher',
      '192.168.1.1 (Simulator)'
    );
  }

  static resetSimulation(): void {
    const sim = this.getSimulationState();
    const resetState = {
      ...sim,
      currentServingNumber: 20,
      currentServingToken: 'A-20',
      isDelayed: false,
      autoAdvance: false,
      forcedPulseState: null,
      doctorReviewingToken: null,
    };
    this.setSimulationState(resetState);

    const queue = this.getQueue();
    const aaravToken = queue.find(t => t.tokenNumber === 'A-27');
    if (aaravToken) {
      aaravToken.queuePosition = 7;
      aaravToken.estimatedWaitMin = 24;
      aaravToken.status = 'waiting';
      aaravToken.sanctuary_state = 'QUEUE_STABLE';
      cache.set(CACHE_KEYS.CACHED_QUEUE, queue);
      cache.set(CACHE_KEYS.ACTIVE_TOKEN, aaravToken);
    }
  }

  // --- Audit Logs ---
  static logAudit(
    action: string, 
    entityType: AuditLog['entityType'], 
    entityId: string, 
    details: string,
    performedBy: string = 'Dr. Sharma (CMO)',
    deviceIp: string = '192.168.1.42 (Station 01)',
    patientName?: string
  ) {
    const logs = cache.get<AuditLog[]>(CACHE_KEYS.AUDIT_LOGS) || [];
    const newLog: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      action,
      entityType,
      entityId,
      performedBy,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      details,
      deviceIp,
      patientName,
    };
    logs.unshift(newLog);
    // Keep max 50 logs in prototype cache
    cache.set(CACHE_KEYS.AUDIT_LOGS, logs.slice(0, 50));
  }

  static getAuditLogs(): AuditLog[] {
    return cache.get<AuditLog[]>(CACHE_KEYS.AUDIT_LOGS) || [];
  }

  // Reset demo state
  static resetDemoState() {
    cache.set(CACHE_KEYS.CLINICS_LIST, INITIAL_CLINICS);
    cache.set(CACHE_KEYS.DOCTORS_STATE, INITIAL_DOCTORS);
    cache.set(CACHE_KEYS.PATIENT_RECORDS, INITIAL_PATIENTS);
    cache.set(CACHE_KEYS.CACHED_QUEUE, INITIAL_TOKENS);
    cache.set(CACHE_KEYS.DIAGNOSTIC_EVENTS, INITIAL_DIAGNOSTIC_EVENTS);
    cache.set(CACHE_KEYS.BILLING_RECORDS, INITIAL_BILLING);
    cache.set(CACHE_KEYS.CURRENT_PATIENT_SESSION, INITIAL_PATIENTS[0]);
    cache.set(CACHE_KEYS.ACTIVE_TOKEN, INITIAL_TOKENS[1]);
    this.logAudit('DEMO_RESET', 'queue', 'all', 'Reset demo state to baseline seed data.');
  }
}
