import React from 'react';
import { LandingNav } from './LandingNav';
import { LandingHero } from './LandingHero';
import { TwoJourneysSection } from './TwoJourneysSection';
import { SanctuaryPulseSection } from './SanctuaryPulseSection';
import { DpsSection } from './DpsSection';
import { FromInsightToActionSection } from './FromInsightToActionSection';
import { PreConsultationSnapshotSection } from './PreConsultationSnapshotSection';
import { ClosedLoopSection } from './ClosedLoopSection';
import { ClinicsPatientsSection } from './ClinicsPatientsSection';
import { PrinciplesTrustSection } from './PrinciplesTrustSection';
import { LandingCta } from './LandingCta';

interface LandingViewProps {
  onOpenPatientApp: () => void;
  onOpenClinicApp: () => void;
  onTriggerDpsRebalance: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onOpenPatientApp,
  onOpenClinicApp,
  onTriggerDpsRebalance,
}) => {
  const scrollToHowItWorks = () => {
    const el = document.getElementById('two-journeys');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 font-sans selection:bg-[#16A34A] selection:text-white">
      
      {/* 1. MINIMAL STICKY TOP NAVIGATION */}
      <LandingNav
        onOpenPrototype={onOpenClinicApp}
        onOpenPatient={onOpenPatientApp}
        onOpenClinic={onOpenClinicApp}
      />

      {/* 2. EDITORIAL HERO SECTION + LAYERED PRODUCT PREVIEW */}
      <LandingHero
        onEnterApp={onOpenClinicApp}
        onSeeHowItWorks={scrollToHowItWorks}
        onOpenPatient={onOpenPatientApp}
        onOpenClinic={onOpenClinicApp}
      />

      {/* 3. SECTION 2 — THE SYSTEMIC PROBLEM (OPERATIONS vs CLINICAL) */}
      <TwoJourneysSection />

      {/* 4. SECTION 3 — SANCTUARY PULSE (SIGNATURE EMPATHY FEATURE) */}
      <SanctuaryPulseSection onOpenPatientApp={onOpenPatientApp} />

      {/* 5. SECTION 4 & 5 — THE INTELLIGENCE LAYER & WHAT THE SYSTEM OBSERVES */}
      <DpsSection onTriggerRebalance={onTriggerDpsRebalance} />

      {/* 6. SECTION 6 — FROM INSIGHT TO ACTION (OPERATIONAL QUEUE ADAPTATION) */}
      <FromInsightToActionSection />

      {/* 7. SECTION 7 — PRE-CONSULTATION SNAPSHOT (BROWSER CLINICIAN DASHBOARD) */}
      <PreConsultationSnapshotSection onOpenClinicApp={onOpenClinicApp} />

      {/* 8. SECTION 8 — CLOSED LOOP (CONSULTATION CONTINUUM WORKFLOW) */}
      <ClosedLoopSection />

      {/* 9. SECTION 9 — FOR CLINICS + FOR PATIENTS (SPLIT EXPERIENCE) */}
      <ClinicsPatientsSection
        onOpenClinicApp={onOpenClinicApp}
        onOpenPatientApp={onOpenPatientApp}
      />

      {/* 10. SECTION 10 & 11 — PRODUCT PRINCIPLES & TRUST/SAFETY */}
      <PrinciplesTrustSection />

      {/* 11. SECTION 12 & FOOTER — VIVID GREEN CTA BLOCK & DEEP FOREST FOOTER */}
      <LandingCta
        onOpenPatientApp={onOpenPatientApp}
        onOpenClinicApp={onOpenClinicApp}
        onTriggerDpsRebalance={onTriggerDpsRebalance}
        onSeeHowItWorks={scrollToHowItWorks}
      />

    </div>
  );
};
