import React, { useState } from 'react';
import { 
  User, Stethoscope, Clock, Sparkles, AlertTriangle, 
  ChevronDown, Check, Phone, ShieldCheck, ArrowRight
} from 'lucide-react';
import { Patient, Token } from '../../types';

interface DiagnosticJourneyHeaderProps {
  patient: Patient;
  token?: Token | null;
  onCallPatient?: () => void;
  onOpenSnapshot?: () => void;
  allPatients?: Patient[];
  onSelectPatient?: (patientId: string) => void;
}

export const DiagnosticJourneyHeader: React.FC<DiagnosticJourneyHeaderProps> = ({
  patient,
  token,
  onCallPatient,
  onOpenSnapshot,
  allPatients = [],
  onSelectPatient,
}) => {
  const [showPatientMenu, setShowPatientMenu] = useState(false);

  // Standardize patient display fields
  const isAarav = patient.id === 'pat_aarav_0' || (patient.fullName || patient.name || '').includes('Aarav');
  const patientIdDisplay = isAarav ? 'OF-000284' : `OF-000${patient.id.replace(/\D/g, '').padStart(3, '0') || '192'}`;
  const patientAge = isAarav ? 42 : (patient.age || 38);
  const currentToken = token?.tokenNumber || (isAarav ? 'A-27' : 'A-101');
  const doctorName = token?.doctorName || 'Dr. Sharma';
  const currentStatus = token?.status === 'in_consultation' ? 'In Consultation' : 'Waiting';
  const pulseDisplay = token?.sanctuary_state === 'DOCTOR_REVIEWING' 
    ? 'Doctor reviewing history' 
    : token?.sanctuary_state === 'ALMOST_YOUR_TURN'
    ? 'Almost your turn'
    : 'Queue stable';

  const patientDisplayName = patient.fullName || patient.name || 'Patient';

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Left: Patient Avatar & Core Demographics */}
        <div className="flex items-start sm:items-center space-x-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-stone-900 text-white font-extrabold text-lg flex items-center justify-center shadow-xs">
              {patientDisplayName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPatientMenu(!showPatientMenu)}
                  className="group flex items-center space-x-2 text-left"
                >
                  <h1 className="text-xl font-extrabold text-stone-900 tracking-tight group-hover:text-emerald-800 transition-colors">
                    {patientDisplayName}
                  </h1>
                  <ChevronDown className="w-4 h-4 text-stone-400 group-hover:text-stone-700 transition-colors" />
                </button>

                {/* Patient Switcher Menu */}
                {showPatientMenu && (
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-30 text-xs font-medium animate-in fade-in duration-150">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-100">
                      Switch Patient Odyssey
                    </div>
                    {allPatients.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          if (onSelectPatient) onSelectPatient(p.id);
                          setShowPatientMenu(false);
                        }}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-stone-50 flex items-center justify-between transition-colors"
                      >
                        <div>
                          <span className="font-bold text-stone-900 block">{p.fullName || p.name || 'Patient'}</span>
                          <span className="text-[10px] text-stone-500">
                            {p.id === 'pat_aarav_0' ? 'Flagship Stagnation Case' : `${p.age}y • DPS ${p.currentDps ?? 65}`}
                          </span>
                        </div>
                        {p.id === patient.id && <Check className="w-4 h-4 text-emerald-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 font-mono text-xs font-semibold">
                {patientIdDisplay}
              </span>

              {patient.hasStagnation && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-[11px] font-bold inline-flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3 text-amber-700" />
                  <span>Review recommended</span>
                </span>
              )}
            </div>

            {/* Sub-demographics strip */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-stone-500 font-medium">
              <span>Age: <strong className="text-stone-800 font-mono font-bold">{patientAge}</strong></span>
              <span>•</span>
              <span>Gender: <strong className="text-stone-800">{patient.gender}</strong></span>
              <span>•</span>
              <span>Blood Group: <strong className="text-stone-800 font-mono">{patient.bloodGroup || 'O+'}</strong></span>
              <span>•</span>
              <span>UHID: <strong className="text-stone-800 font-mono">IND-2026-4421</strong></span>
            </div>
          </div>
        </div>

        {/* Center/Right: Current Visit Meta & Primary Actions */}
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-stone-100">
          
          {/* Current Encounter Context */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50/80 p-3 rounded-2xl border border-stone-200/70 text-xs">
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                Current visit
              </span>
              <span className="font-mono font-extrabold text-stone-900 text-xs bg-white px-1.5 py-0.5 rounded border border-stone-200">
                {currentToken}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                Doctor
              </span>
              <span className="font-bold text-stone-800 truncate block">
                {doctorName}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                Status
              </span>
              <span className="font-semibold text-stone-700">
                {currentStatus}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                Sanctuary Pulse
              </span>
              <span className="inline-flex items-center space-x-1 font-semibold text-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>"{pulseDisplay}"</span>
              </span>
            </div>
          </div>

          {/* Top Actions: "Call Patient" & "Prepare Snapshot" */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={onCallPatient}
              className="px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold transition-all shadow-2xs flex items-center space-x-1.5"
              title="Call this patient's token to the active consultation suite"
            >
              <Stethoscope className="w-3.5 h-3.5 text-stone-600" />
              <span>Call Patient</span>
            </button>

            <button
              type="button"
              onClick={onOpenSnapshot}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5"
              title="Prepare clinical pre-consultation summary"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>Prepare Snapshot</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
