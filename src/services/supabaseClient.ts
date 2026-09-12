import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Support both environment variables and user-configured runtime credentials
export function getSupabaseCredentials(): { url: string; anonKey: string } {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  if (envUrl && envKey) {
    return { url: envUrl, anonKey: envKey };
  }

  // Fallback to local storage if user provided keys in the UI
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('odyssey_flow:supabase_custom_credentials');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.url && parsed.anonKey) {
          return { url: parsed.url, anonKey: parsed.anonKey };
        }
      }
    } catch {
      // ignore
    }
  }

  return { url: '', anonKey: '' };
}

const initialCreds = getSupabaseCredentials();

export let isSupabaseConfigured = Boolean(
  initialCreds.url && initialCreds.url.startsWith('http') && initialCreds.anonKey
);

export let supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(initialCreds.url, initialCreds.anonKey)
  : null;

export function updateSupabaseClient(url: string, anonKey: string): boolean {
  if (url && url.startsWith('http') && anonKey) {
    try {
      supabase = createClient(url, anonKey);
      isSupabaseConfigured = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'odyssey_flow:supabase_custom_credentials',
          JSON.stringify({ url, anonKey })
        );
      }
      return true;
    } catch (e) {
      console.error('[Supabase Init Error]', e);
      return false;
    }
  }
  return false;
}

/**
 * Complete Production-Ready Supabase PostgreSQL Schema DDL
 * Encompassing all 14 required medical entities with relationships, indexes & RLS.
 */
export const SUPABASE_SCHEMA_SQL = `-- ==============================================================================
-- ODYSSEY FLOW: Supabase PostgreSQL Complete DDL Schema
-- Hackathon: Enigma 5.0 — Genesis (HealthTech)
-- Persistent Database Architecture
-- ==============================================================================

-- 1. CLINICS
CREATE TABLE IF NOT EXISTS public.clinics (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    specialties TEXT[] NOT NULL DEFAULT '{}',
    queue_count INT DEFAULT 0,
    active_doctors_count INT DEFAULT 0,
    average_wait_min INT DEFAULT 15,
    rating NUMERIC(2,1) DEFAULT 4.8,
    is_open BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DOCTORS (Relationship: Clinic -> Doctors)
CREATE TABLE IF NOT EXISTS public.doctors (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    clinic_id TEXT REFERENCES public.clinics(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    room VARCHAR(50) NOT NULL,
    avatar_url TEXT,
    status VARCHAR(50) DEFAULT 'consulting',
    experience_years INT DEFAULT 5,
    qualification VARCHAR(255) NOT NULL,
    patients_seen_today INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DOCTOR SHIFTS (Relationship: Doctor -> Shifts)
CREATE TABLE IF NOT EXISTS public.doctor_shifts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    doctor_id TEXT REFERENCES public.doctors(id) ON DELETE CASCADE,
    shift_name VARCHAR(50) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room VARCHAR(50) NOT NULL,
    max_patients INT DEFAULT 30,
    current_patient_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PATIENTS
CREATE TABLE IF NOT EXISTS public.patients (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    masked_phone VARCHAR(20),
    masked_identity_reference VARCHAR(50) DEFAULT 'DEMO-IND-XXXX-2741',
    consent_status VARCHAR(50) DEFAULT 'granted',
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    blood_group VARCHAR(10),
    emergency_contact VARCHAR(20),
    has_stagnation BOOLEAN DEFAULT false,
    current_dps INT DEFAULT 85,
    active_journey_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. VISITS (Relationship: Patient -> Visits)
CREATE TABLE IF NOT EXISTS public.visits (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    patient_id TEXT REFERENCES public.patients(id) ON DELETE CASCADE,
    clinic_id TEXT REFERENCES public.clinics(id) ON DELETE SET NULL,
    doctor_id TEXT REFERENCES public.doctors(id) ON DELETE SET NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    reason TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'completed',
    diagnosis TEXT,
    notes TEXT,
    prescription_summary TEXT,
    tests_ordered TEXT[] DEFAULT '{}',
    resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SYMPTOMS (Relationship: Visit -> Symptoms)
CREATE TABLE IF NOT EXISTS public.symptoms (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    patient_id TEXT REFERENCES public.patients(id) ON DELETE CASCADE,
    visit_id TEXT REFERENCES public.visits(id) ON DELETE SET NULL,
    symptom_name VARCHAR(255) NOT NULL,
    severity INT CHECK (severity BETWEEN 1 AND 10),
    duration_days INT NOT NULL,
    body_part VARCHAR(100),
    description TEXT,
    first_noticed_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TOKENS (Relationship: Visit -> Token, Patient -> Token)
CREATE TABLE IF NOT EXISTS public.tokens (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    visit_id TEXT REFERENCES public.visits(id) ON DELETE SET NULL,
    clinic_id TEXT REFERENCES public.clinics(id) ON DELETE CASCADE,
    doctor_id TEXT REFERENCES public.doctors(id) ON DELETE SET NULL,
    patient_id TEXT REFERENCES public.patients(id) ON DELETE CASCADE,
    token_number VARCHAR(20) NOT NULL,
    status VARCHAR(50) DEFAULT 'waiting', -- 'created', 'waiting', 'called', 'in_treatment', 'skipped', 'completed', 'cancelled'
    queue_position INT NOT NULL,
    priority VARCHAR(50) DEFAULT 'standard', -- 'standard', 'priority_stagnation', 'senior_mdis'
    estimated_wait_minutes INT DEFAULT 15,
    sanctuary_state VARCHAR(50) DEFAULT 'QUEUE_STABLE',
    check_in_time TIMESTAMPTZ DEFAULT NOW(),
    called_time TIMESTAMPTZ,
    dps_score INT DEFAULT 85,
    stagnation_flag BOOLEAN DEFAULT false,
    stagnation_reason TEXT,
    symptoms_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. DIAGNOSTIC EVENTS (Relationship: Visit -> Diagnostic Events, Patient -> Diagnostic Events)
CREATE TABLE IF NOT EXISTS public.diagnostic_events (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    patient_id TEXT REFERENCES public.patients(id) ON DELETE CASCADE,
    visit_id TEXT REFERENCES public.visits(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL,
    specialty VARCHAR(100),
    complaint TEXT,
    investigation TEXT,
    hypothesis TEXT,
    note_text TEXT,
    event_date DATE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    facility VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    result_summary TEXT NOT NULL,
    is_conclusive BOOLEAN DEFAULT false,
    conclusiveness_score INT DEFAULT 20,
    findings TEXT,
    ordered_by VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. DIAGNOSTIC SIGNALS
CREATE TABLE IF NOT EXISTS public.diagnostic_signals (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    patient_id TEXT REFERENCES public.patients(id) ON DELETE CASCADE,
    signal_type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) DEFAULT 'moderate',
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    metric_value VARCHAR(100),
    detected_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. DPS SNAPSHOTS (Relationship: Patient -> DPS Snapshots, Visit -> DPS Snapshots)
CREATE TABLE IF NOT EXISTS public.dps_snapshots (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    patient_id TEXT REFERENCES public.patients(id) ON DELETE CASCADE,
    visit_id TEXT REFERENCES public.visits(id) ON DELETE SET NULL,
    score INT NOT NULL CHECK (score BETWEEN 0 AND 100),
    uncertainty_score INT DEFAULT 20,
    redundancy_score INT DEFAULT 15,
    specialist_transition_score INT DEFAULT 10,
    hypothesis_entropy NUMERIC(4,2) DEFAULT 0.45,
    treatment_nonresolution_score INT DEFAULT 25,
    stagnation_flag BOOLEAN DEFAULT false,
    confidence NUMERIC(3,2) DEFAULT 0.85,
    stagnation_risk VARCHAR(50) NOT NULL,
    factors JSONB NOT NULL DEFAULT '{}',
    recommendation TEXT NOT NULL,
    suggested_action VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. REFERRALS (Relationship: Patient -> Referrals, Visit -> Referrals)
CREATE TABLE IF NOT EXISTS public.referrals (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    patient_id TEXT REFERENCES public.patients(id) ON DELETE CASCADE,
    source_visit_id TEXT REFERENCES public.visits(id) ON DELETE SET NULL,
    from_doctor_id TEXT REFERENCES public.doctors(id) ON DELETE SET NULL,
    specialty VARCHAR(100) NOT NULL,
    priority VARCHAR(50) DEFAULT 'routine',
    reason TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'suggested',
    date DATE DEFAULT CURRENT_DATE,
    clinical_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. BILLING (Relationship: Visit -> Billing, Patient -> Billing)
CREATE TABLE IF NOT EXISTS public.billing (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    patient_id TEXT REFERENCES public.patients(id) ON DELETE CASCADE,
    visit_id TEXT REFERENCES public.visits(id) ON DELETE SET NULL,
    token_number VARCHAR(20) NOT NULL,
    consultation_fee NUMERIC(10,2) DEFAULT 500.00,
    service_fee NUMERIC(10,2) DEFAULT 100.00,
    discount NUMERIC(10,2) DEFAULT 0.00,
    total NUMERIC(10,2) DEFAULT 600.00,
    payment_status VARCHAR(50) DEFAULT 'paid',
    payment_mode VARCHAR(50) DEFAULT 'UPI',
    items JSONB NOT NULL DEFAULT '[]',
    total_amount NUMERIC(10,2) NOT NULL DEFAULT 600.00,
    status VARCHAR(50) DEFAULT 'paid',
    payment_method VARCHAR(50) DEFAULT 'UPI',
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. NOTIFICATIONS (Relationship: Patient -> Notifications, Token -> Notifications)
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    patient_id TEXT REFERENCES public.patients(id) ON DELETE CASCADE,
    token_id TEXT REFERENCES public.tokens(id) ON DELETE CASCADE,
    pulse_headline VARCHAR(255) NOT NULL,
    emotional_subtext TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(255) NOT NULL,
    performed_by VARCHAR(255) NOT NULL,
    details TEXT,
    device_ip VARCHAR(50),
    patient_name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_tokens_clinic_status ON public.tokens(clinic_id, status);
CREATE INDEX IF NOT EXISTS idx_tokens_patient ON public.tokens(patient_id);
CREATE INDEX IF NOT EXISTS idx_visits_patient ON public.visits(patient_id);
CREATE INDEX IF NOT EXISTS idx_diagnostic_events_patient ON public.diagnostic_events(patient_id);
CREATE INDEX IF NOT EXISTS idx_diagnostic_signals_patient ON public.diagnostic_signals(patient_id);
CREATE INDEX IF NOT EXISTS idx_dps_snapshots_patient ON public.dps_snapshots(patient_id);
CREATE INDEX IF NOT EXISTS idx_patients_phone ON public.patients(phone);
CREATE INDEX IF NOT EXISTS idx_referrals_patient ON public.referrals(patient_id);
CREATE INDEX IF NOT EXISTS idx_billing_patient ON public.billing(patient_id);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostic_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dps_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read for clinics" ON public.clinics FOR SELECT USING (true);
CREATE POLICY "Public read for doctors" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Public read for tokens" ON public.tokens FOR SELECT USING (true);
CREATE POLICY "Public read for patients" ON public.patients FOR SELECT USING (true);
CREATE POLICY "Public read for visits" ON public.visits FOR SELECT USING (true);
CREATE POLICY "Public read for symptoms" ON public.symptoms FOR SELECT USING (true);
CREATE POLICY "Public read for diagnostic_events" ON public.diagnostic_events FOR SELECT USING (true);
CREATE POLICY "Public read for dps_snapshots" ON public.dps_snapshots FOR SELECT USING (true);
CREATE POLICY "Public read for referrals" ON public.referrals FOR SELECT USING (true);
CREATE POLICY "Public read for billing" ON public.billing FOR SELECT USING (true);
CREATE POLICY "Public read for notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Public read for audit_logs" ON public.audit_logs FOR SELECT USING (true);
`;
