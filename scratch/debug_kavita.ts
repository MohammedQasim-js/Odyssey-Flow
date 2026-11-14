import { DpsEngine } from '../src/services/dpsEngine';

const kavita = DpsEngine.DEMO_PATIENTS.RECOVERING;
console.log('Kavita Visits count:', kavita.visits.length);
kavita.visits.forEach(v => console.log(v.date, v.specialty, v.diagnosis, 'resolved:', v.resolved));

const traj = DpsEngine.computeTrajectory(kavita.patient, kavita.visits, kavita.events, kavita.symptoms);
traj.forEach(t => {
  console.log('Enc', t.encounterNumber, 'Date:', t.date, 'DPS:', t.dpsScore, 'Delta:', t.delta, 'Signals:', t.signals);
});
