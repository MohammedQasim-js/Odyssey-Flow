import { DpsEngine } from '../src/services/dpsEngine';

const rahul = DpsEngine.DEMO_PATIENTS.NORMAL;
console.log('Rahul Visits:');
rahul.visits.forEach(v => console.log(v.date, v.reason, v.diagnosis, 'resolved:', v.resolved));

const traj = DpsEngine.computeTrajectory(rahul.patient, rahul.visits, rahul.events, rahul.symptoms);
traj.forEach(t => {
  console.log('Enc', t.encounterNumber, 'DPS:', t.dpsScore, 'Signals:', t.signals);
});
