export type MedicationStatus =
  | "Prescribed"
  | "Dispensing"
  | "Dispensed"
  | "Partially Dispensed"
  | "Completed"
  | "Discontinued"
  | "Refill Due";

export type InvestigationStatus =
  | "Ordered"
  | "Scheduled"
  | "Sample Collected"
  | "Processing"
  | "Report Ready"
  | "Reviewed"
  | "Cancelled";

export type InvestigationCategory =
  | "Laboratory"
  | "Radiology"
  | "Imaging"
  | "Other";

export interface SiblingMedication {
  name: string;
  form: string;
  dosage: string;
  frequency: string;
  duration: string;
  timing: string;
}

export interface SuggestedPharmacy {
  id: string;
  name: string;
  area: string;
  distance: string;
  availability: "Available" | "Partial availability" | "Out of Stock";
  isOpen: boolean;
  operatingHours: string;
  phone: string;
}

export interface DispensingTimeline {
  prescriptionCreated: boolean;
  availabilityChecked: boolean;
  dispensingState: "Pending pickup" | "In preparation" | "Dispensed";
  patientNotified: boolean;
}

export interface MedicationRecord {
  id: string;
  prescriptionId: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  tokenNumber: string;
  visitReference: string;
  prescribedBy: string;
  prescriberSpecialty: string;
  prescriptionDate: string;
  medicationName: string;
  form: string; // e.g. "Oral capsule", "Tablet", "Syrup"
  route: string; // "Oral", "Topical", "IV"
  dosage: string; // "500 mg"
  frequency: string; // "3 times daily"
  frequencyCompact: string; // "1 capsule × 3/day"
  timing: string; // "After meals"
  durationDays: number;
  currentDay: number;
  startDate: string;
  endDate: string;
  quantity: number;
  refills: number;
  instructions: string;
  status: MedicationStatus;
  pharmacyName: string;
  pharmacyAvailability: "Available" | "Partial availability";
  dispensingTimeline: DispensingTimeline;
  siblingMedications?: SiblingMedication[];
  totalMedicationsInRx?: number;
}

export interface LabResultParameter {
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  flag?: "normal" | "high" | "low" | "neutral";
}

export interface InvestigationRecord {
  id: string;
  sampleId: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  tokenNumber: string;
  investigationName: string;
  category: InvestigationCategory;
  orderedBy: string;
  orderedDate: string;
  reason: string;
  priority: "Routine" | "Urgent" | "Priority Review";
  status: InvestigationStatus;
  resultStatus:
    | "Pending"
    | "Sample Collected"
    | "Analyzing"
    | "Available"
    | "Awaiting Review"
    | "Reviewed";
  eta?: string;
  isRepeated?: boolean;
  repetitionWarning?: string;
  resultsSummary?: string;
  parameters?: LabResultParameter[];
  radiologyReport?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  doctorReviewNote?: string;
}

export interface PrescriptionItem {
  number: number;
  medicationName: string;
  form: string;
  dosage: string;
  frequencyCompact: string;
  duration: string;
  timing: string;
  quantity: number;
  instructions: string;
}

export interface PrescriptionDocument {
  id: string;
  patientId: string;
  patientName: string;
  patientCode: string; // e.g. OF-000284
  patientAge: number;
  patientGender: string;
  tokenNumber: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorQualification: string;
  date: string;
  medications: PrescriptionItem[];
  generalInstructions: string;
  pharmacyName: string;
  pharmacyAvailability: string;
  status: "Active" | "Dispensed" | "Completed" | "Refill Due";
  durationTotal: string;
  clinicName: string;
  clinicAddress: string;
}

export interface PharmacyPartner {
  id: string;
  name: string;
  area: string;
  distance: string;
  address: string;
  operatingStatus: "Open" | "Closes at 11 PM" | "24x7 Open" | "Closed";
  contactPhone: string;
  supportedFulfillment: string;
  availabilityStatus: "Available" | "Partial availability";
  sampleMedicines: string[];
}
