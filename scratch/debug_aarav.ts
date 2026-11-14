import { DpsEngine } from '../src/services/dpsEngine';
import { DataStore } from '../src/services/dataStore';

DataStore.init();
const aarav = DataStore.getPatient('pat_aarav_0')!;
const visits = DataStore.getVisits('pat_aarav_0');
const events = DataStore.getDiagnosticEvents('pat_aarav_0');
const symptoms = DataStore.getSymptoms('pat_aarav_0');

console.log('Aarav Visits count:', visits.length);
visits.forEach(v => console.log(v.date, v.specialty, v.diagnosis));

const traj = DpsEngine.computeTrajectory(aarav, visits, events, symptoms);
traj.forEach(t => {
  console.log('Enc', t.encounterNumber, 'Date:', t.date, 'DPS:', t.dpsScore, 'Delta:', t.delta);
});
