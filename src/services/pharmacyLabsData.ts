import {
  MedicationRecord,
  InvestigationRecord,
  PrescriptionDocument,
  PharmacyPartner,
  SuggestedPharmacy,
} from "../types/pharmacyLabs";

export const INITIAL_SUGGESTED_PHARMACIES: SuggestedPharmacy[] = [
  {
    id: "pharma_apollo_1",
    name: "Apollo Pharmacy",
    area: "Bandra West (Linking Road)",
    distance: "1.2 km",
    availability: "Available",
    isOpen: true,
    operatingHours: "Open • Closes at 11 PM",
    phone: "+91 22 2640 1192",
  },
  {
    id: "pharma_medplus_2",
    name: "MedPlus Pharmacy",
    area: "Bandra West (Hill Road)",
    distance: "1.8 km",
    availability: "Available",
    isOpen: true,
    operatingHours: "Open • 24x7",
    phone: "+91 22 2655 4310",
  },
  {
    id: "pharma_localcare_3",
    name: "LocalCare Community Pharmacy",
    area: "Pali Hill",
    distance: "0.8 km",
    availability: "Partial availability",
    isOpen: true,
    operatingHours: "Open • Closes at 10 PM",
    phone: "+91 22 2600 8841",
  },
];

export const INITIAL_MEDICATIONS: MedicationRecord[] = [
  {
    id: "med_aarav_01",
    prescriptionId: "RX-2026-0891",
    patientId: "pat_aarav_0",
    patientName: "Aarav Mehta",
    patientAge: 42,
    patientGender: "M",
    tokenNumber: "A-27",
    visitReference: "Visit A-27",
    prescribedBy: "Dr. A. Sharma",
    prescriberSpecialty: "Internal Medicine",
    prescriptionDate: "12 Sep 2026",
    medicationName: "Amoxicillin 500 mg",
    form: "Oral capsule",
    route: "Oral",
    dosage: "500 mg",
    frequency: "3 times daily",
    frequencyCompact: "1 capsule × 3/day",
    timing: "After meals",
    durationDays: 5,
    currentDay: 2,
    startDate: "12 Sep",
    endDate: "16 Sep",
    quantity: 15,
    refills: 0,
    instructions: "Take after food and complete the prescribed course.",
    status: "Dispensing",
    pharmacyName: "Apollo Pharmacy — Bandra",
    pharmacyAvailability: "Available",
    dispensingTimeline: {
      prescriptionCreated: true,
      availabilityChecked: true,
      dispensingState: "Pending pickup",
      patientNotified: true,
    },
    totalMedicationsInRx: 1,
  },
  {
    id: "med_aarav_02",
    prescriptionId: "RX-2026-0870",
    patientId: "pat_aarav_0",
    patientName: "Aarav Mehta",
    patientAge: 42,
    patientGender: "M",
    tokenNumber: "A-27",
    visitReference: "Visit A-27 (Prior Review)",
    prescribedBy: "Dr. Priya Desai",
    prescriberSpecialty: "Neurology",
    prescriptionDate: "08 Sep 2026",
    medicationName: "Naproxen 500 mg",
    form: "Film-coated tablet",
    route: "Oral",
    dosage: "500 mg",
    frequency: "2 times daily",
    frequencyCompact: "1 tab × 2/day",
    timing: "With full glass of water",
    durationDays: 7,
    currentDay: 5,
    startDate: "08 Sep",
    endDate: "15 Sep",
    quantity: 14,
    refills: 0,
    instructions:
      "Take strictly with breakfast and dinner. Do not exceed prescribed dosage.",
    status: "Prescribed",
    pharmacyName: "MedPlus — Bandra West",
    pharmacyAvailability: "Available",
    dispensingTimeline: {
      prescriptionCreated: true,
      availabilityChecked: true,
      dispensingState: "Pending pickup",
      patientNotified: true,
    },
    siblingMedications: [
      {
        name: "Pantoprazole 40 mg",
        form: "Delayed-release tablet",
        dosage: "40 mg",
        frequency: "Once daily",
        duration: "7 days",
        timing: "30 mins before breakfast",
      },
      {
        name: "Magnesium Glycinate 250 mg",
        form: "Oral capsule",
        dosage: "250 mg",
        frequency: "At bedtime",
        duration: "14 days",
        timing: "Night",
      },
    ],
    totalMedicationsInRx: 3,
  },
  {
    id: "med_priya_01",
    prescriptionId: "RX-2026-0842",
    patientId: "pat_priya_1",
    patientName: "Priya Sharma",
    patientAge: 34,
    patientGender: "F",
    tokenNumber: "B-14",
    visitReference: "Visit B-14",
    prescribedBy: "Dr. Arjun Shenoy",
    prescriberSpecialty: "Consultant Internal Medicine",
    prescriptionDate: "11 Sep 2026",
    medicationName: "Metformin 500 mg SR",
    form: "Sustained release tablet",
    route: "Oral",
    dosage: "500 mg",
    frequency: "2 times daily",
    frequencyCompact: "1 tablet × 2/day",
    timing: "With morning & evening meals",
    durationDays: 30,
    currentDay: 14,
    startDate: "01 Sep",
    endDate: "30 Sep",
    quantity: 60,
    refills: 2,
    instructions:
      "Maintain consistent intake with meals. Monitor fasting blood glucose weekly.",
    status: "Partially Dispensed",
    pharmacyName: "Apollo Pharmacy — Bandra",
    pharmacyAvailability: "Partial availability",
    dispensingTimeline: {
      prescriptionCreated: true,
      availabilityChecked: true,
      dispensingState: "In preparation",
      patientNotified: true,
    },
    siblingMedications: [
      {
        name: "Paracetamol 650 mg",
        form: "Oral tablet",
        dosage: "650 mg",
        frequency: "SOS when pain > 4",
        duration: "5 days",
        timing: "After food",
      },
    ],
    totalMedicationsInRx: 2,
  },
  {
    id: "med_rahul_01",
    prescriptionId: "RX-2026-0820",
    patientId: "pat_rahul_2",
    patientName: "Rahul Verma",
    patientAge: 42,
    patientGender: "M",
    tokenNumber: "A-19",
    visitReference: "Visit A-19",
    prescribedBy: "Dr. Meera Nambiar",
    prescriberSpecialty: "Gastroenterology",
    prescriptionDate: "10 Sep 2026",
    medicationName: "Esomeprazole 40 mg",
    form: "Enteric coated capsule",
    route: "Oral",
    dosage: "40 mg",
    frequency: "Once daily",
    frequencyCompact: "1 capsule × 1/day",
    timing: "Empty stomach (Morning)",
    durationDays: 14,
    currentDay: 3,
    startDate: "10 Sep",
    endDate: "24 Sep",
    quantity: 14,
    refills: 0,
    instructions: "Take 30 minutes before breakfast with plain lukewarm water.",
    status: "Dispensed",
    pharmacyName: "Apollo Pharmacy — Bandra",
    pharmacyAvailability: "Available",
    dispensingTimeline: {
      prescriptionCreated: true,
      availabilityChecked: true,
      dispensingState: "Dispensed",
      patientNotified: true,
    },
    totalMedicationsInRx: 1,
  },
  {
    id: "med_sunita_01",
    prescriptionId: "RX-2026-0798",
    patientId: "pat_sunita_3",
    patientName: "Sunita Deshmukh",
    patientAge: 58,
    patientGender: "F",
    tokenNumber: "C-08",
    visitReference: "Visit C-08",
    prescribedBy: "Dr. A. Sharma",
    prescriberSpecialty: "Internal Medicine",
    prescriptionDate: "06 Sep 2026",
    medicationName: "Telmisartan 40 mg",
    form: "Uncoated tablet",
    route: "Oral",
    dosage: "40 mg",
    frequency: "Once daily",
    frequencyCompact: "1 tablet × 1/day",
    timing: "Morning after breakfast",
    durationDays: 30,
    currentDay: 28,
    startDate: "14 Aug",
    endDate: "13 Sep",
    quantity: 30,
    refills: 1,
    instructions: "Monitor blood pressure log every alternate day.",
    status: "Refill Due",
    pharmacyName: "LocalCare Community Pharmacy",
    pharmacyAvailability: "Available",
    dispensingTimeline: {
      prescriptionCreated: true,
      availabilityChecked: true,
      dispensingState: "Dispensed",
      patientNotified: true,
    },
    totalMedicationsInRx: 1,
  },
  {
    id: "med_vikram_01",
    prescriptionId: "RX-2026-0755",
    patientId: "pat_vikram_5",
    patientName: "Vikram Rao",
    patientAge: 47,
    patientGender: "M",
    tokenNumber: "D-04",
    visitReference: "Visit D-04",
    prescribedBy: "Dr. Vikramaditya Sen",
    prescriberSpecialty: "Neurology",
    prescriptionDate: "01 Sep 2026",
    medicationName: "Betahistine Dihydrochloride 16 mg",
    form: "Tablet",
    route: "Oral",
    dosage: "16 mg",
    frequency: "3 times daily",
    frequencyCompact: "1 tab × 3/day",
    timing: "After food",
    durationDays: 10,
    currentDay: 10,
    startDate: "01 Sep",
    endDate: "11 Sep",
    quantity: 30,
    refills: 0,
    instructions: "Take continuously for acute vestibular stabilization.",
    status: "Completed",
    pharmacyName: "MedPlus Pharmacy",
    pharmacyAvailability: "Available",
    dispensingTimeline: {
      prescriptionCreated: true,
      availabilityChecked: true,
      dispensingState: "Dispensed",
      patientNotified: true,
    },
    totalMedicationsInRx: 1,
  },
  {
    id: "med_kavita_01",
    prescriptionId: "RX-2026-0712",
    patientId: "pat_kavita_6",
    patientName: "Kavita Nair",
    patientAge: 39,
    patientGender: "F",
    tokenNumber: "B-09",
    visitReference: "Visit B-09",
    prescribedBy: "Dr. Priya Kulkarni",
    prescriberSpecialty: "Pulmonology",
    prescriptionDate: "28 Aug 2026",
    medicationName: "Levocetirizine + Montelukast",
    form: "Tablet",
    route: "Oral",
    dosage: "5mg / 10mg",
    frequency: "Once daily",
    frequencyCompact: "1 tab × 1/day",
    timing: "Night before sleep",
    durationDays: 14,
    currentDay: 6,
    startDate: "28 Aug",
    endDate: "10 Sep",
    quantity: 14,
    refills: 0,
    instructions:
      "Discontinued due to mild daytime sedation. Switched to alternative antihistamine.",
    status: "Discontinued",
    pharmacyName: "Apollo Pharmacy — Bandra",
    pharmacyAvailability: "Available",
    dispensingTimeline: {
      prescriptionCreated: true,
      availabilityChecked: true,
      dispensingState: "Dispensed",
      patientNotified: true,
    },
    totalMedicationsInRx: 1,
  },
];

export const INITIAL_INVESTIGATIONS: InvestigationRecord[] = [
  {
    id: "inv_201",
    sampleId: "RAD-3310",
    patientId: "pat_aarav_0",
    patientName: "Sara Khan", // Or Aarav Mehta
    patientAge: 42,
    patientGender: "M",
    tokenNumber: "A-27",
    investigationName: "MRI Brain (Non-Contrast)",
    category: "Radiology",
    orderedBy: "Dr. Priya Desai",
    orderedDate: "12 Sep 2026",
    reason:
      "Follow-up for persistent refractory holocranial cephalalgia; check for structural or venous change.",
    priority: "Priority Review",
    status: "Report Ready",
    resultStatus: "Awaiting Review",
    eta: "15 mins",
    isRepeated: true,
    repetitionWarning:
      "Similar investigation detected in previous encounter (Feb 2026 & Apr 2026).",
    resultsSummary:
      "Report finalized by Senior Radiologist Dr. M. Iyer. Brain parenchyma unremarkable; no space-occupying lesion or intracranial hypertension.",
    radiologyReport:
      "Non-contrast 3T Brain MRI shows normal gray-white matter differentiation. Ventricular system, basal cisterns and sulci are symmetric and within age-appropriate normal limits. No restricted diffusion, mass effect, or midline shift. Flow voids in major intracranial arteries preserved.",
  },
  {
    id: "inv_202",
    sampleId: "SMP-9912",
    patientId: "pat_aarav_0",
    patientName: "Aarav Mehta",
    patientAge: 42,
    patientGender: "M",
    tokenNumber: "A-27",
    investigationName: "Complete Blood Count (CBC) & ESR",
    category: "Laboratory",
    orderedBy: "Dr. A. Sharma",
    orderedDate: "12 Sep 2026",
    reason:
      "Baseline hematologic screening and systemic inflammatory marker review.",
    priority: "Routine",
    status: "Reviewed",
    resultStatus: "Reviewed",
    eta: "Completed",
    isRepeated: false,
    resultsSummary:
      "Hemoglobin 13.4 g/dL (Normal). WBC 7,800 /µL (Normal). Platelets 245,000 /µL. Mildly elevated ESR 16 mm/hr.",
    parameters: [
      {
        parameter: "Hemoglobin",
        value: "13.4",
        unit: "g/dL",
        referenceRange: "13.0 - 17.0",
        flag: "normal",
      },
      {
        parameter: "Total Leukocyte Count (WBC)",
        value: "7,800",
        unit: "/µL",
        referenceRange: "4,000 - 11,000",
        flag: "normal",
      },
      {
        parameter: "Platelets",
        value: "245,000",
        unit: "/µL",
        referenceRange: "150,000 - 450,000",
        flag: "normal",
      },
      {
        parameter: "ESR (Erythrocyte Sedimentation Rate)",
        value: "16",
        unit: "mm/hr",
        referenceRange: "0 - 15",
        flag: "high",
      },
      {
        parameter: "C-Reactive Protein (CRP)",
        value: "2.1",
        unit: "mg/L",
        referenceRange: "< 3.0",
        flag: "normal",
      },
    ],
    reviewedBy: "Dr. A. Sharma",
    reviewedAt: "12 Sep 2026, 11:20 AM",
    doctorReviewNote:
      "No severe inflammatory process or cytopenia. Mild non-specific ESR elevation consistent with chronic stress / pain syndrome.",
  },
  {
    id: "inv_203",
    sampleId: "SMP-9874",
    patientId: "pat_priya_1",
    patientName: "Priya Sharma",
    patientAge: 34,
    patientGender: "F",
    tokenNumber: "B-14",
    investigationName: "Thyroid Function Panel (T3, T4, TSH)",
    category: "Laboratory",
    orderedBy: "Dr. Arjun Shenoy",
    orderedDate: "12 Sep 2026",
    reason:
      "Investigate post-prandial fatigue, cold intolerance, and weight fluctuation.",
    priority: "Routine",
    status: "Processing",
    resultStatus: "Analyzing",
    eta: "45 mins",
    isRepeated: false,
    resultsSummary:
      "Sample collected and undergoing chemiluminescent immunoassay.",
  },
  {
    id: "inv_204",
    sampleId: "USG-4019",
    patientId: "pat_ananya_10",
    patientName: "Ananya Deshmukh",
    patientAge: 45,
    patientGender: "F",
    tokenNumber: "C-12",
    investigationName: "Whole Abdomen Ultrasound (USG)",
    category: "Imaging",
    orderedBy: "Dr. Meera Nambiar",
    orderedDate: "11 Sep 2026",
    reason: "Epigastric distress and right hypochondriac fullness.",
    priority: "Routine",
    status: "Report Ready",
    resultStatus: "Awaiting Review",
    eta: "Ready",
    isRepeated: false,
    resultsSummary:
      "Grade 1 diffuse hepatic steatosis. Normal gallbladder without calculi or wall thickening. Pancreas and spleen unremarkable.",
    radiologyReport:
      "Liver is mildly enlarged measuring 15.2 cm with increased echogenicity suggestive of Grade 1 fatty infiltration. Intrahepatic biliary radicals are non-dilated. Common bile duct measures 3.8 mm. Kidneys bilateral normal size and cortical thickness.",
  },
  {
    id: "inv_205",
    sampleId: "LAB-5102",
    patientId: "pat_devendra_4",
    patientName: "Devendra Patel",
    patientAge: 29,
    patientGender: "M",
    tokenNumber: "A-05",
    investigationName: "High-Resolution Chest CT (HRCT)",
    category: "Radiology",
    orderedBy: "Dr. Priya Kulkarni",
    orderedDate: "10 Sep 2026",
    reason: "Persistent post-viral dry cough unresolved after 3 weeks.",
    priority: "Urgent",
    status: "Reviewed",
    resultStatus: "Reviewed",
    eta: "Completed",
    isRepeated: false,
    resultsSummary:
      "No ground-glass opacities, parenchymal consolidation, or bronchiectasis. Normal mediastinal contour.",
    radiologyReport:
      "Submillimeter thin slice volumetric chest CT reveals clear lung fields bilaterally. No pleural effusion or pneumothorax. Tracheobronchial tree patent to subsegmental branches.",
    reviewedBy: "Dr. Priya Kulkarni",
    reviewedAt: "11 Sep 2026, 04:15 PM",
    doctorReviewNote:
      "Reassuring pulmonary architecture. Proceed with post-infectious bronchial hyperreactivity management.",
  },
  {
    id: "inv_206",
    sampleId: "LAB-7721",
    patientId: "pat_sunita_3",
    patientName: "Sunita Deshmukh",
    patientAge: 58,
    patientGender: "F",
    tokenNumber: "C-08",
    investigationName: "Kidney Function Test (KFT) & Serum Electrolytes",
    category: "Laboratory",
    orderedBy: "Dr. A. Sharma",
    orderedDate: "12 Sep 2026",
    reason: "Hypertension monitoring and annual creatinine clearance check.",
    priority: "Routine",
    status: "Sample Collected",
    resultStatus: "Sample Collected",
    eta: "1 hr 15 mins",
    isRepeated: false,
    resultsSummary:
      "Serum draw completed by Phlebotomy Unit 2. Barcode verified.",
  },
  {
    id: "inv_207",
    sampleId: "SMP-3319",
    patientId: "pat_vikram_5",
    patientName: "Vikram Rao",
    patientAge: 47,
    patientGender: "M",
    tokenNumber: "D-04",
    investigationName:
      "Audiometry & Vestibular Evoked Myogenic Potentials (VEMP)",
    category: "Other",
    orderedBy: "Dr. Vikramaditya Sen",
    orderedDate: "12 Sep 2026",
    reason: "Evaluate inner ear vestibular pathways for episodic vertigo.",
    priority: "Priority Review",
    status: "Scheduled",
    resultStatus: "Pending",
    eta: "2:30 PM Today",
    isRepeated: false,
    resultsSummary: "Scheduled at Audiology Diagnostics Wing Room 108.",
  },
];

export const INITIAL_PRESCRIPTION_DOCS: PrescriptionDocument[] = [
  {
    id: "RX-2026-0891",
    patientId: "pat_aarav_0",
    patientName: "Aarav Mehta",
    patientCode: "OF-000284",
    patientAge: 42,
    patientGender: "Male",
    tokenNumber: "A-27",
    doctorName: "Dr. A. Sharma",
    doctorSpecialty: "Internal Medicine & Diagnostic Triage",
    doctorQualification: "MBBS, MD (General Medicine)",
    date: "12 Sep 2026",
    clinicName: "Odyssey Apex Health Center",
    clinicAddress: "100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru",
    medications: [
      {
        number: 1,
        medicationName: "Amoxicillin 500 mg",
        form: "Capsule",
        dosage: "500 mg",
        frequencyCompact: "1 capsule × 3/day",
        duration: "5 days",
        timing: "After meals",
        quantity: 15,
        instructions: "Take after food and complete the full 5-day course.",
      },
      {
        number: 2,
        medicationName: "Paracetamol 500 mg",
        form: "Tablet",
        dosage: "500 mg",
        frequencyCompact: "1 tablet when required",
        duration: "3 days",
        timing: "SOS (Pain/Fever)",
        quantity: 6,
        instructions: "Take with half glass of water for symptom flare-ups.",
      },
    ],
    generalInstructions:
      "Maintain adequate oral hydration (2.5L daily). Follow up in clinic after 5 days or if symptoms do not improve.",
    pharmacyName: "Apollo Pharmacy — Bandra West",
    pharmacyAvailability: "Available",
    status: "Active",
    durationTotal: "5 days",
  },
  {
    id: "RX-2026-0842",
    patientId: "pat_priya_1",
    patientName: "Priya Sharma",
    patientCode: "OF-000192",
    patientAge: 34,
    patientGender: "Female",
    tokenNumber: "B-14",
    doctorName: "Dr. Arjun Shenoy",
    doctorSpecialty: "Consultant Internal Medicine",
    doctorQualification: "MBBS, MD (Internal Medicine)",
    date: "11 Sep 2026",
    clinicName: "Odyssey Apex Health Center",
    clinicAddress: "100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru",
    medications: [
      {
        number: 1,
        medicationName: "Metformin 500 mg SR",
        form: "Sustained Release Tablet",
        dosage: "500 mg",
        frequencyCompact: "1 tablet × 2/day",
        duration: "30 days",
        timing: "With main meals",
        quantity: 60,
        instructions: "Take consistently at the same time each day.",
      },
    ],
    generalInstructions:
      "Routine dietary compliance advised. Repeat Fasting Blood Sugar and HbA1c in 30 days.",
    pharmacyName: "MedPlus Pharmacy",
    pharmacyAvailability: "Available",
    status: "Active",
    durationTotal: "30 days",
  },
  {
    id: "RX-2026-0820",
    patientId: "pat_rahul_2",
    patientName: "Rahul Verma",
    patientCode: "OF-000319",
    patientAge: 42,
    patientGender: "Male",
    tokenNumber: "A-19",
    doctorName: "Dr. Meera Nambiar",
    doctorSpecialty: "Senior Gastroenterologist",
    doctorQualification: "MD, DM (Gastroenterology), AIIMS",
    date: "10 Sep 2026",
    clinicName: "Odyssey Apex Health Center",
    clinicAddress: "100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru",
    medications: [
      {
        number: 1,
        medicationName: "Esomeprazole 40 mg",
        form: "Enteric Coated Capsule",
        dosage: "40 mg",
        frequencyCompact: "1 capsule × 1/day",
        duration: "14 days",
        timing: "30 mins before breakfast",
        quantity: 14,
        instructions:
          "Swallow whole with lukewarm water. Do not crush or chew.",
      },
      {
        number: 2,
        medicationName: "Domperidone 10 mg",
        form: "Tablet",
        dosage: "10 mg",
        frequencyCompact: "1 tablet × 2/day",
        duration: "7 days",
        timing: "Before meals",
        quantity: 14,
        instructions: "Take 15 minutes before lunch and dinner.",
      },
    ],
    generalInstructions:
      "Avoid oily and acidic foods. Maintain upright posture for at least 45 minutes after meals.",
    pharmacyName: "Apollo Pharmacy — Bandra",
    pharmacyAvailability: "Available",
    status: "Dispensed",
    durationTotal: "14 days",
  },
  {
    id: "RX-2026-0798",
    patientId: "pat_sunita_3",
    patientName: "Sunita Deshmukh",
    patientCode: "OF-000104",
    patientAge: 58,
    patientGender: "Female",
    tokenNumber: "C-08",
    doctorName: "Dr. A. Sharma",
    doctorSpecialty: "Internal Medicine",
    doctorQualification: "MBBS, MD",
    date: "06 Sep 2026",
    clinicName: "Odyssey Apex Health Center",
    clinicAddress: "100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru",
    medications: [
      {
        number: 1,
        medicationName: "Telmisartan 40 mg",
        form: "Uncoated Tablet",
        dosage: "40 mg",
        frequencyCompact: "1 tablet × 1/day",
        duration: "30 days",
        timing: "Morning after breakfast",
        quantity: 30,
        instructions: "Maintain consistent timing every morning.",
      },
    ],
    generalInstructions: "Record daily morning and evening BP in patient log.",
    pharmacyName: "LocalCare Community Pharmacy",
    pharmacyAvailability: "Available",
    status: "Refill Due",
    durationTotal: "30 days",
  },
];

export const INITIAL_PHARMACY_PARTNERS: PharmacyPartner[] = [
  {
    id: "pharma_net_01",
    name: "Apollo Pharmacy",
    area: "Bandra West (Linking Road)",
    distance: "1.2 km",
    address:
      "Shop 4-5, Silver Beach Plaza, Linking Road, Bandra West, Mumbai 400050",
    operatingStatus: "Open",
    contactPhone: "+91 22 2640 1192",
    supportedFulfillment:
      "In-store Pickup • Express Home Delivery • Digital Token Verification",
    availabilityStatus: "Available",
    sampleMedicines: [
      "Amoxicillin 500mg",
      "Esomeprazole 40mg",
      "Paracetamol 650mg",
      "Telmisartan 40mg",
    ],
  },
  {
    id: "pharma_net_02",
    name: "MedPlus Pharmacy",
    area: "Bandra West (Hill Road)",
    distance: "1.8 km",
    address:
      "Ground Floor, Hill View Apt, Hill Road, Bandra West, Mumbai 400050",
    operatingStatus: "24x7 Open",
    contactPhone: "+91 22 2655 4310",
    supportedFulfillment:
      "24x7 Counter • In-store Pickup • Prescription Drive-thru",
    availabilityStatus: "Available",
    sampleMedicines: [
      "Naproxen 500mg",
      "Pantoprazole 40mg",
      "Metformin 500mg SR",
      "Betahistine 16mg",
    ],
  },
  {
    id: "pharma_net_03",
    name: "LocalCare Community Dispensary",
    area: "Pali Hill",
    distance: "0.8 km",
    address: "12 Nargis Dutt Road, Pali Hill, Bandra West, Mumbai 400050",
    operatingStatus: "Open",
    contactPhone: "+91 22 2600 8841",
    supportedFulfillment:
      "Senior Citizen Priority • Walk-in Fulfillment • Local Delivery",
    availabilityStatus: "Partial availability",
    sampleMedicines: [
      "Telmisartan 40mg",
      "Amoxicillin 500mg",
      "Omeprazole 20mg",
    ],
  },
  {
    id: "pharma_net_04",
    name: "Wellness Forever 24x7",
    area: "Khar West (S.V. Road)",
    distance: "2.4 km",
    address: "Corner of 14th Road & S.V. Road, Khar West, Mumbai 400052",
    operatingStatus: "24x7 Open",
    contactPhone: "+91 22 2648 9900",
    supportedFulfillment:
      "24-Hour Emergency • Cold Chain Biologicals • Express Dispatch",
    availabilityStatus: "Available",
    sampleMedicines: [
      "Specialty Injections",
      "Antibiotics",
      "Cardiac Care",
      "Diabetic Supplies",
    ],
  },
  {
    id: "pharma_net_05",
    name: "Fortis Health Point Dispensary",
    area: "Bandra Reclamation",
    distance: "3.1 km",
    address: "Near Reclamation Circle, Bandra West, Mumbai 400050",
    operatingStatus: "Closes at 11 PM",
    contactPhone: "+91 22 2642 7700",
    supportedFulfillment:
      "Direct Hospital Liaison • Diagnostic Lab Drop-off • Insurance Desk",
    availabilityStatus: "Available",
    sampleMedicines: [
      "Hospital Formularies",
      "Surgical Dressings",
      "Critical Diagnostics Support",
    ],
  },
];

class PharmacyLabsStoreService {
  private medications: MedicationRecord[] = [...INITIAL_MEDICATIONS];
  private investigations: InvestigationRecord[] = [...INITIAL_INVESTIGATIONS];
  private prescriptions: PrescriptionDocument[] = [
    ...INITIAL_PRESCRIPTION_DOCS,
  ];
  private pharmacies: PharmacyPartner[] = [...INITIAL_PHARMACY_PARTNERS];
  private suggestedPharmacies: SuggestedPharmacy[] = [
    ...INITIAL_SUGGESTED_PHARMACIES,
  ];

  // ===============================
  // KPI METRICS
  // ===============================
  public getSummaryKpis() {
    // Return realistic dynamic values anchored to existing state
    const activePrescriptions =
      this.medications.filter(
        (m) =>
          m.status === "Prescribed" ||
          m.status === "Dispensing" ||
          m.status === "Partially Dispensed",
      ).length + 14;
    const dispensedToday = 42;
    const pendingInvestigations =
      this.investigations.filter(
        (i) => i.status !== "Reviewed" && i.status !== "Cancelled",
      ).length + 3;
    const resultsAwaitingReview =
      this.investigations.filter((i) => i.status === "Report Ready").length + 2;
    const refillDue =
      this.medications.filter((m) => m.status === "Refill Due").length + 5;

    return {
      activePrescriptions,
      dispensedToday,
      pendingInvestigations,
      resultsAwaitingReview,
      refillDue,
    };
  }

  public getLabKpis() {
    const pendingOrders = 9;
    const samplesCollected = 6;
    const resultsAvailable = 4;
    const awaitingDoctorReview = 3;
    const completedToday = 11;

    return {
      pendingOrders,
      samplesCollected,
      resultsAvailable,
      awaitDoctorReview: awaitingDoctorReview,
      completedToday,
    };
  }

  // ===============================
  // MEDICATIONS
  // ===============================
  public getMedications(): MedicationRecord[] {
    return this.medications;
  }

  public updateMedicationStatus(
    id: string,
    status: MedicationRecord["status"],
  ) {
    this.medications = this.medications.map((med) => {
      if (med.id === id) {
        const isDispensed = status === "Dispensed";
        return {
          ...med,
          status,
          dispensingTimeline: {
            ...med.dispensingTimeline,
            dispensingState: isDispensed
              ? "Dispensed"
              : med.dispensingTimeline.dispensingState,
          },
        };
      }
      return med;
    });
    return this.medications;
  }

  public updateDispensingStep(
    id: string,
    step: "prescriptionCreated" | "availabilityChecked" | "patientNotified",
    val: boolean,
  ) {
    this.medications = this.medications.map((med) => {
      if (med.id === id) {
        return {
          ...med,
          dispensingTimeline: {
            ...med.dispensingTimeline,
            [step]: val,
          },
        };
      }
      return med;
    });
    return this.medications;
  }

  public addMedication(record: MedicationRecord) {
    this.medications = [record, ...this.medications];
    return this.medications;
  }

  // ===============================
  // INVESTIGATIONS
  // ===============================
  public getInvestigations(): InvestigationRecord[] {
    return this.investigations;
  }

  public reviewInvestigation(id: string, reviewerName: string, notes: string) {
    this.investigations = this.investigations.map((inv) => {
      if (inv.id === id) {
        return {
          ...inv,
          status: "Reviewed" as const,
          resultStatus: "Reviewed" as const,
          reviewedBy: reviewerName,
          reviewedAt:
            new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }) + " Today",
          doctorReviewNote: notes,
        };
      }
      return inv;
    });
    return this.investigations;
  }

  public orderInvestigation(inv: InvestigationRecord) {
    this.investigations = [inv, ...this.investigations];
    return this.investigations;
  }

  public updateInvestigationResult(
    id: string,
    resultsSummary: string,
    parameters?: InvestigationRecord["parameters"],
  ) {
    this.investigations = this.investigations.map((inv) => {
      if (inv.id === id) {
        return {
          ...inv,
          status: "Report Ready" as const,
          resultStatus: "Awaiting Review" as const,
          resultsSummary,
          parameters: parameters || inv.parameters,
        };
      }
      return inv;
    });
    return this.investigations;
  }

  // ===============================
  // PRESCRIPTIONS
  // ===============================
  public getPrescriptions(): PrescriptionDocument[] {
    return this.prescriptions;
  }

  public addPrescription(doc: PrescriptionDocument) {
    this.prescriptions = [doc, ...this.prescriptions];
    return this.prescriptions;
  }

  // ===============================
  // PHARMACY PARTNERS
  // ===============================
  public getPharmacies(): PharmacyPartner[] {
    return this.pharmacies;
  }

  public getSuggestedPharmacies(): SuggestedPharmacy[] {
    return this.suggestedPharmacies;
  }

  public addPharmacy(partner: PharmacyPartner) {
    this.pharmacies = [partner, ...this.pharmacies];
    return this.pharmacies;
  }
}

export const PharmacyLabsStore = new PharmacyLabsStoreService();
