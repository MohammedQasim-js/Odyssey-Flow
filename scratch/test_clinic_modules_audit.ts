import { DataStore } from '../src/services/dataStore';

console.log('--- STARTING CLINIC MODULES AUDIT TEST SUITE ---');

DataStore.init();

// Test 1: Scheduling & Appointments
console.log('\n[1] Testing Operations: Scheduling & Appointments...');
const initialApts = DataStore.getAppointments();
console.log(`Initial appointments count: ${initialApts.length}`);

const testApt = {
  id: 'apt_test_audit_99',
  patientId: 'pat_test_99',
  patientName: 'Test Patient Audit',
  doctorId: 'doc_sharma_1',
  doctorName: 'Dr. A. Sharma',
  doctorSpecialty: 'General Medicine',
  clinicId: 'clinic_odyssey_care',
  clinicName: 'Odyssey Apex Health Center',
  clinicAddress: 'Indiranagar 100ft Road',
  date: 'Today',
  time: '11:45 AM',
  type: 'in_person' as const,
  status: 'upcoming' as const,
  symptoms: 'Audit validation symptoms',
  roomNumber: 'Room 101',
  fee: 800,
};
DataStore.saveAppointment(testApt);
const aptsAfterSave = DataStore.getAppointments();
console.log(`Appointments after save: ${aptsAfterSave.length}`);
if (!aptsAfterSave.some(a => a.id === testApt.id)) {
  throw new Error('Failed to save test appointment');
}

DataStore.rescheduleAppointment(testApt.id, 'Tomorrow', '03:15 PM');
const rescheduled = DataStore.getAppointments().find(a => a.id === testApt.id);
console.log(`Rescheduled appointment: date=${rescheduled?.date}, time=${rescheduled?.time}`);
if (rescheduled?.date !== 'Tomorrow' || rescheduled?.time !== '03:15 PM') {
  throw new Error('Failed to reschedule appointment');
}

DataStore.cancelAppointment(testApt.id);
const cancelled = DataStore.getAppointments().find(a => a.id === testApt.id);
console.log(`Cancelled appointment status: ${cancelled?.status}`);
if (cancelled?.status !== 'cancelled') {
  throw new Error('Failed to cancel appointment');
}

// Test 2: Staff & Shifts
console.log('\n[2] Testing Operations: Staff & Shifts...');
const doctors = DataStore.getDoctors();
console.log(`Total doctors: ${doctors.length}`);
const doc1 = doctors[0];
DataStore.updateDoctorStatus(doc1.id, 'reviewing_history');
const doc1Updated = DataStore.getDoctors().find(d => d.id === doc1.id);
console.log(`Doctor ${doc1.name} status updated to: ${doc1Updated?.status}`);
if (doc1Updated?.status !== 'reviewing_history') {
  throw new Error('Failed to update doctor status');
}

DataStore.updateDoctorRoom(doc1.id, '105');
const doc1Room = DataStore.getDoctors().find(d => d.id === doc1.id);
console.log(`Doctor ${doc1.name} room updated to: Room ${doc1Room?.room}`);
if (doc1Room?.room !== '105') {
  throw new Error('Failed to update doctor room');
}

const shifts = DataStore.getDoctorShifts();
console.log(`Doctor shifts count: ${shifts.length}`);
DataStore.updateDoctorShift(doc1.id, { shiftName: 'Evening', startTime: '16:00', endTime: '22:00' });
const updatedShift = DataStore.getDoctorShifts().find(s => s.doctorId === doc1.id);
console.log(`Doctor shift updated: ${updatedShift?.shiftName} (${updatedShift?.startTime}-${updatedShift?.endTime})`);
if (updatedShift?.shiftName !== 'Evening') {
  throw new Error('Failed to update doctor shift');
}

// Test 3: Revenue - Billing
console.log('\n[3] Testing Revenue: Billing...');
const billing = DataStore.getBillingRecords();
console.log(`Total billing records: ${billing.length}`);

const newBill = DataStore.createBillingRecord({
  tokenNumber: 'X-99',
  patientId: 'pat_test_99',
  patientName: 'Test Patient Billing',
  doctorName: 'Dr. Arjun Shenoy',
  date: 'Today',
  items: [{ description: 'Test Procedure', amount: 1500 }],
  totalAmount: 1500,
  status: 'pending',
});
console.log(`Created new bill: ${newBill.id}, status: ${newBill.status}`);
if (newBill.status !== 'pending' || newBill.totalAmount !== 1500) {
  throw new Error('Failed to create new bill');
}

const paidBill = DataStore.payBillingRecord(newBill.id, 'UPI FastPay');
console.log(`Paid bill status: ${paidBill?.status}, method: ${paidBill?.paymentMethod}`);
if (paidBill?.status !== 'paid' || paidBill?.paymentMethod !== 'UPI FastPay') {
  throw new Error('Failed to pay billing record');
}

// Test 4: Revenue - Insurance Claims
console.log('\n[4] Testing Revenue: Insurance Claims...');
const claims = DataStore.getInsuranceClaims();
console.log(`Total insurance claims: ${claims.length}`);

const newClaim = DataStore.createInsuranceClaim({
  patient: 'Test Claim Patient',
  insurer: 'Star Health & Allied',
  policyNo: 'POL-TEST-001',
  amount: '₹3,500',
  amountNumber: 3500,
  status: 'In Review',
  diagnosis: 'Gastroenterology review',
});
console.log(`Created new claim: ${newClaim.id}, status: ${newClaim.status}`);
if (newClaim.status !== 'In Review') {
  throw new Error('Failed to create insurance claim');
}

const approvedClaim = DataStore.updateClaimStatus(newClaim.id, 'Approved (Cashless)', 'Auto-verified with TPA');
console.log(`Updated claim status: ${approvedClaim?.status}`);
if (approvedClaim?.status !== 'Approved (Cashless)') {
  throw new Error('Failed to update insurance claim status');
}

// Test 5: System Settings & Audit Logs
console.log('\n[5] Testing System: Settings & Audit Logs...');
const currentSettings = DataStore.getClinicSettings();
DataStore.updateClinicSettings({
  ...currentSettings,
  defaultConsultationMin: 12,
  extendedConsultationMin: 18,
});
const updatedSettings = DataStore.getClinicSettings();
console.log(`Updated intake window: ${updatedSettings.defaultConsultationMin}m, extended: ${updatedSettings.extendedConsultationMin}m`);
if (updatedSettings.defaultConsultationMin !== 12) {
  throw new Error('Failed to update clinic settings');
}

const auditLogs = DataStore.getAuditLogs();
console.log(`Total audit logs logged: ${auditLogs.length}`);
if (auditLogs.length === 0) {
  throw new Error('Expected audit logs to be populated');
}
console.log(`Most recent audit log: action=${auditLogs[0].action}, performer=${auditLogs[0].performedBy}`);

console.log('\n--- ALL CLINIC MODULES TESTS PASSED (100%) ---');
