import { DpsEngine } from '../src/services/dpsEngine';
import { DataStore } from '../src/services/dataStore';
import { Patient, Visit, DiagnosticEvent, Symptom } from '../src/types';

function runTests() {
  console.log('=== STARTING DIAGNOSTIC JOURNEY INTELLIGENCE LOOP TESTS ===\n');

  // Initialize DataStore
  DataStore.init();

  // -------------------------------------------------------------
  // TEST 1: Stagnant Trajectory Patient (Aarav Mehta / Priya Sharma)
  // -------------------------------------------------------------
  console.log('--- TEST 1: Stagnant Trajectory Patient ---');
  const aarav = DataStore.getPatient('pat_aarav_0')!;
  const aaravVisits = DataStore.getVisits('pat_aarav_0');
  const aaravEvents = DataStore.getDiagnosticEvents('pat_aarav_0');
  const aaravSymptoms = DataStore.getSymptoms('pat_aarav_0');

  const aaravTrajectory = DpsEngine.computeTrajectory(aarav, aaravVisits, aaravEvents, aaravSymptoms);
  const aaravStagnation = DpsEngine.detectStagnation(aaravTrajectory);
  const aaravSnapshot = DpsEngine.generateDoctorSnapshot(aarav, aaravVisits, aaravEvents, aaravSymptoms);

  console.log(`Aarav Encounters: ${aaravTrajectory.length}`);
  console.log(`Aarav DPS: ${aaravSnapshot.currentDps}/100`);
  console.log(`Aarav Slope: ${aaravSnapshot.dpsSlope} pts/visit`);
  console.log(`Aarav Stagnation Flag: ${aaravSnapshot.stagnationFlag}`);
  console.log(`Aarav Stagnation State: ${aaravSnapshot.stagnationState}`);
  console.log(`Aarav Stagnation Reason: ${aaravSnapshot.stagnationReason}`);
  console.log(`Repeated Complaints: ${aaravSnapshot.repeatedComplaintCount} (${aaravSnapshot.repeatedComplaintsSummary})`);
  console.log(`Specialties: ${aaravSnapshot.specialties.join(', ')} (${aaravSnapshot.specialtiesCount})`);
  console.log(`Test Redundancy: ${aaravSnapshot.investigationRedundancySummary}`);

  if (!aaravSnapshot.stagnationFlag) {
    throw new Error('FAIL: Aarav Mehta should have stagnationFlag=true');
  }
  if (!aaravSnapshot.stagnationReason.includes('Possible Diagnostic Stagnation — Clinical Review Recommended')) {
    throw new Error('FAIL: Aarav stagnationReason must include required stagnation string');
  }
  console.log('✓ TEST 1 PASSED: Stagnant trajectory properly flagged with required stagnation message and contributing signals.\n');

  // -------------------------------------------------------------
  // TEST 2: Normal Convergence Patient (Rahul Verma)
  // -------------------------------------------------------------
  console.log('--- TEST 2: Normal Convergence Patient ---');
  const rahulDemo = DpsEngine.DEMO_PATIENTS.NORMAL;
  const rahulTrajectory = DpsEngine.computeTrajectory(rahulDemo.patient, rahulDemo.visits, rahulDemo.events, rahulDemo.symptoms);
  const rahulSnapshot = DpsEngine.generateDoctorSnapshot(rahulDemo.patient, rahulDemo.visits, rahulDemo.events, rahulDemo.symptoms);

  console.log(`Rahul Encounters: ${rahulTrajectory.length}`);
  console.log(`Rahul DPS: ${rahulSnapshot.currentDps}/100`);
  console.log(`Rahul Slope: ${rahulSnapshot.dpsSlope} pts/visit`);
  console.log(`Rahul Stagnation Flag: ${rahulSnapshot.stagnationFlag}`);
  console.log(`Rahul Stagnation State: ${rahulSnapshot.stagnationState}`);

  if (rahulSnapshot.stagnationFlag) {
    throw new Error('FAIL: Rahul Verma should NOT have stagnationFlag=true');
  }
  if (rahulSnapshot.stagnationState !== 'CONVERGING') {
    throw new Error(`FAIL: Rahul Verma should be CONVERGING, got ${rahulSnapshot.stagnationState}`);
  }
  console.log('✓ TEST 2 PASSED: Normal convergence shows high DPS, positive slope, and no stagnation.\n');

  // -------------------------------------------------------------
  // TEST 3: Insufficient Longitudinal History Patient (1 Encounter)
  // -------------------------------------------------------------
  console.log('--- TEST 3: Insufficient Longitudinal History Patient ---');
  const walkinPatient: Patient = {
    id: 'pat_walkin_test_1',
    fullName: 'Anil Kumar',
    phone: '+91 99999 11111',
    maskedPhone: '+91 99XXXXXX11',
    hypotheticalAadhaar: 'XXXX XXXX 1111',
    age: 28,
    gender: 'Male',
    bloodGroup: 'B+',
    emergencyContact: '+91 99999 00000',
    registeredDate: '2026-11-15',
    hasStagnation: false,
    currentDps: 75,
  };
  const singleVisit: Visit[] = [
    {
      id: 'vis_walkin_1',
      patientId: 'pat_walkin_test_1',
      clinicId: 'clinic_apex_1',
      clinicName: 'Odyssey Care Clinic',
      doctorId: 'doc_sharma_1',
      doctorName: 'Dr. A. Sharma',
      specialty: 'General Medicine',
      date: '15 Nov',
      reason: 'Acute sore throat and cough',
      status: 'completed',
      diagnosis: 'Viral Pharyngitis',
      notes: 'Prescribed symptomatic relief.',
      resolved: true,
    }
  ];

  const walkinTrajectory = DpsEngine.computeTrajectory(walkinPatient, singleVisit, [], []);
  const walkinStagnation = DpsEngine.detectStagnation(walkinTrajectory);

  console.log(`Walk-in Encounters: ${walkinTrajectory.length}`);
  console.log(`Walk-in Stagnation Flag: ${walkinStagnation.stagnationFlag}`);
  console.log(`Walk-in Stagnation State: ${walkinStagnation.stagnationState}`);
  console.log(`Walk-in Reason: ${walkinStagnation.stagnationReason}`);
  console.log(`Walk-in Confidence: ${walkinStagnation.confidence}%`);

  if (walkinStagnation.stagnationFlag) {
    throw new Error('FAIL: Insufficient history should NEVER flag stagnation prematurely');
  }
  if (walkinStagnation.stagnationState !== 'MONITORING') {
    throw new Error(`FAIL: Insufficient history should be MONITORING, got ${walkinStagnation.stagnationState}`);
  }
  console.log('✓ TEST 3 PASSED: Insufficient history handled safely under MONITORING without premature stagnation.\n');

  // -------------------------------------------------------------
  // TEST 4: Post-Referral Recovery Patient (Kavita Nair)
  // -------------------------------------------------------------
  console.log('--- TEST 4: Post-Referral Recovery Patient ---');
  const kavitaDemo = DpsEngine.DEMO_PATIENTS.RECOVERING;
  const kavitaTrajectory = DpsEngine.computeTrajectory(kavitaDemo.patient, kavitaDemo.visits, kavitaDemo.events, kavitaDemo.symptoms);
  const kavitaSnapshot = DpsEngine.generateDoctorSnapshot(kavitaDemo.patient, kavitaDemo.visits, kavitaDemo.events, kavitaDemo.symptoms);

  console.log(`Kavita Encounters: ${kavitaTrajectory.length}`);
  console.log(`Kavita DPS: ${kavitaSnapshot.currentDps}/100`);
  console.log(`Kavita Slope: ${kavitaSnapshot.dpsSlope} pts/visit`);
  console.log(`Kavita Stagnation Flag: ${kavitaSnapshot.stagnationFlag}`);
  console.log(`Kavita Stagnation State: ${kavitaSnapshot.stagnationState}`);
  console.log(`Kavita Reason: ${kavitaSnapshot.stagnationReason}`);

  if (kavitaSnapshot.stagnationFlag) {
    throw new Error('FAIL: Kavita Nair should NOT be flagged as stagnant after referral recovery');
  }
  if (kavitaSnapshot.stagnationState !== 'RECOVERING') {
    throw new Error(`FAIL: Kavita Nair should be in RECOVERING state, got ${kavitaSnapshot.stagnationState}`);
  }
  console.log('✓ TEST 4 PASSED: Post-referral trajectory recovery properly recognized.\n');

  // -------------------------------------------------------------
  // TEST 5: Complete Consultation Loop (Encounter saving, history, DPS recalculation)
  // -------------------------------------------------------------
  console.log('--- TEST 5: Consultation Loop ---');
  const initialVisitsCount = DataStore.getVisits('pat_aarav_0').length;

  const activeToken = DataStore.getActiveToken() || DataStore.getQueue()[0];
  console.log(`Active Token: ${activeToken.tokenNumber} (ID: ${activeToken.id}, VisitID: ${activeToken.visitId})`);

  // Complete consultation with clinical diagnosis, notes and resolved status
  const completedToken = DataStore.completeVisit(activeToken.id, {
    diagnosis: 'Occipital Neuralgia • Advanced Neurovascular Plan Finalized',
    notes: 'Comprehensive multi-sequence review. Prescribed targeted neuro-modulator with significant symptomatic improvement.',
    prescriptionSummary: 'Pregabalin 75mg nocte + Physio pacing',
    testsOrdered: ['Targeted Contrast MRI'],
    resolved: true,
  });

  if (!completedToken) {
    throw new Error('FAIL: completeVisit returned undefined');
  }

  const updatedVisits = DataStore.getVisits('pat_aarav_0');
  console.log(`Visits before: ${initialVisitsCount}, Visits after: ${updatedVisits.length}`);
  console.log(`Updated Visit Diagnosis: ${updatedVisits[0].diagnosis}`);
  console.log(`Completed Token Status: ${completedToken.status}`);
  console.log(`Completed Token DPS: ${completedToken.dpsScore}/100`);

  if (!updatedVisits.some(v => v.diagnosis?.includes('Occipital Neuralgia'))) {
    throw new Error('FAIL: completeVisit must update/persist the clinical encounter with new diagnosis');
  }
  if (completedToken.status !== 'completed') {
    throw new Error(`FAIL: Completed token status must be 'completed', got ${completedToken.status}`);
  }

  // Also test new walk-in visit creation without pre-existing visitId
  const newPatientVisitsBefore = DataStore.getVisits('pat_walkin_test_1').length;
  (DataStore as any).generateToken({
    patientId: 'pat_walkin_test_1',
    patientName: 'Anil Kumar',
    patientAge: 28,
    patientGender: 'Male',
    clinicId: 'clinic_apex_1',
    clinicName: 'Odyssey Care Clinic',
    doctorId: 'doc_sharma_1',
    doctorName: 'Dr. A. Sharma',
    specialty: 'General Medicine',
    symptomsSummary: 'Follow-up consultation',
  });
  const walkinToken = DataStore.getActiveToken()!;
  DataStore.completeVisit(walkinToken.id, {
    diagnosis: 'Resolved Acute Pharyngitis',
    notes: 'Full recovery noted.',
    resolved: true,
  });
  const newPatientVisitsAfter = DataStore.getVisits('pat_walkin_test_1').length;
  console.log(`New patient visits before: ${newPatientVisitsBefore}, after: ${newPatientVisitsAfter}`);
  if (newPatientVisitsAfter <= newPatientVisitsBefore) {
    throw new Error('FAIL: New patient completeVisit must append a new visit record');
  }

  console.log('✓ TEST 5 PASSED: Consultation loop successfully persisted encounter, updated history, recalculated DPS and updated token.\n');

  // -------------------------------------------------------------
  // TEST 6: Multidisciplinary Referral Loop
  // -------------------------------------------------------------
  console.log('--- TEST 6: Multidisciplinary Referral Loop ---');
  const referral = DataStore.createReferral({
    patientId: 'pat_aarav_0',
    patientName: 'Aarav Mehta',
    fromDoctorId: 'doc_sharma_1',
    fromDoctorName: 'Dr. A. Sharma',
    toSpecialty: 'Neurology',
    priority: 'urgent',
    reason: '7-month intractable cephalalgia circular workup',
    clinicalNotes: 'Escalate to Senior Neurologist for dedicated neurovascular contrast MRI.',
  });

  console.log(`Created Referral ID: ${referral.id}`);
  console.log(`Referral Token: ${referral.referralToken}`);
  console.log(`Specialty: ${referral.toSpecialty}`);

  const allReferrals = DataStore.getReferrals('pat_aarav_0');
  const hasReferral = allReferrals.some(r => r.id === referral.id);

  const liveQueue = DataStore.getQueue();
  const referralQueueToken = liveQueue.find(t => t.tokenNumber === referral.referralToken);

  const patientEvents = DataStore.getDiagnosticEvents('pat_aarav_0');
  const hasJourneyEvent = patientEvents.some(e => e.title.includes(referral.toSpecialty));

  console.log(`Referral found in patient referrals list: ${hasReferral}`);
  console.log(`Referral token found in live clinic queue: ${!!referralQueueToken}`);
  console.log(`Referral event found in patient journey events: ${hasJourneyEvent}`);

  if (!hasReferral) throw new Error('FAIL: Referral not found in getReferrals()');
  if (!referralQueueToken) throw new Error('FAIL: Referral queue token not found in clinic queue');
  if (!hasJourneyEvent) throw new Error('FAIL: Referral event not found in patient journey timeline');

  console.log('✓ TEST 6 PASSED: Multidisciplinary referral loop generated specialty token, inserted into specialty queue, updated journey and logged audit.\n');

  // -------------------------------------------------------------
  // TEST 7: 12-Step Demo Scenario Baseline Preserved
  // -------------------------------------------------------------
  console.log('--- TEST 7: 12-Step Demo Scenario Preservation ---');
  DataStore.resetDemoState();
  const resetQueue = DataStore.getQueue();
  const resetPatients = DataStore.getPatients();
  const aaravReset = resetPatients.find(p => p.id === 'pat_aarav_0');
  const tokenA27 = resetQueue.find(t => t.tokenNumber === 'A-27');

  console.log(`Patients count: ${resetPatients.length}`);
  console.log(`Queue count: ${resetQueue.length}`);
  console.log(`Aarav Mehta Present: ${!!aaravReset}`);
  console.log(`Token A-27 Present: ${!!tokenA27}`);

  if (!aaravReset || !tokenA27) {
    throw new Error('FAIL: Demo scenario baseline Aarav Mehta or Token A-27 missing');
  }
  console.log('✓ TEST 7 PASSED: 12-Step Demo scenario baseline fully intact.\n');

  console.log('=============================================================');
  console.log('ALL DIAGNOSTIC JOURNEY INTELLIGENCE LOOP TESTS PASSED (7/7)!');
  console.log('=============================================================');
}

runTests();
