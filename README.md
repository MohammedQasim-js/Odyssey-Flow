# Odyssey Flow: Stagnation-Aware Clinical Queue & Diagnostic Journey Platform


> **Pioneer Developers | HealthTech Hackathon Prototype**  
> _A longitudinal clinical journey intelligence system unifying intelligent queue management, diagnostic velocity tracking (DPS), and bounded policy adjustment to solve the diagnostic odyssey._



## 1. Project Overview


In conventional clinical environments, patients with unresolved or chronic conditions bounce between siloed specialists without cross-encounter context. This leads to diagnostic delay, redundant investigations, physician cognitive overload, and extreme patient anxiety.

**Odyssey Flow** closes this gap with a closed-loop platform featuring three core interfaces:

1. **Patient Mobile Experience**: Empathic queue tracking via _Sanctuary Pulse_, mobile check-in, visit history, and bill review.
2. **Clinic Operations Console**: Real-time live queue dispatch, scheduling, staff shifts, revenue & billing, and system audit logs.
3. **Doctor / Clinician Workspace**: Pre-consultation diagnostic snapshot, longitudinal signal analysis, and closed-loop multidisciplinary referral recommendations.

### The Canonical Odyssey Flow Loop


```text
Patient Check-in
       ↓
Canonical Token Generation (A-xx)
       ↓
Live Smart Queue & Sanctuary Pulse
       ↓
Longitudinal Journey Analysis
       ↓
Diagnostic Progress Score (DPS) & Stagnation Detection
       ↓
Bounded Queue Policy Adjustment (+5m Buffer)
       ↓
Doctor Pre-Consultation Snapshot
       ↓
Consultation & Multidisciplinary Referral
       ↓
Journey Update & DPS Recalculation (63 → 68)
```

---

## 2. Technology Stack

- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS v4, Lucide React, Motion (Framer Motion)
- **State Management & Architecture**: Local-first deterministic `DataStore` with reactive pub/sub and optimistic synchronization
- **Backend / Database (Optional Persistence)**: Supabase (`@supabase/supabase-js`) with schema for tokens, visits, and audit logs
- **Analytics & Scoring**: Deterministic Diagnostic Progress Score (`DpsEngine`) and Empathic Queue Engine (`SanctuaryPulseEngine`)
- **Deployment**: Vercel SPA routing (`vercel.json`), Node.js 20+

---

## 3. Installation & Setup

### Prerequisites

- Node.js 18.x or 20.x
- npm 9+ or pnpm 8+

### Quick Start (Local Run)

1. **Clone the repository:**

   ```bash
   git clone https://github.com/MohammedQasim-js/Odyssey-Flow.git
   cd Odyssey-Flow
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional for Remote Sync):**
   Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

4. **Start the local development server:**

   ```bash
   npm run dev
   ```

   Open your browser at `http://localhost:3000`.

5. **Type check & Production build:**
   ```bash
   npm run lint   # Runs tsc --noEmit (strict type-checking)
   npm run build  # Compiles optimized production bundle into dist/
   ```

---

## 4. Environment Variables

Odyssey Flow operates in **local-first mode out of the box** without any required external environment variables. If you wish to connect a live Supabase remote database, configure:

```ini
# Supabase Remote Persistence (Optional)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key

# AI Intelligence API Key (Optional prototype fallback)
VITE_GEMINI_API_KEY=
```

> **Security Note:** Do not commit production service role keys or secret credentials. All client-side keys must use public anonymous scopes.

---

## 5. Supabase Database Setup (Optional)

If connecting a Supabase project, execute the SQL schema located in `supabase/schema.sql`:

```sql
-- Core queue and token store
CREATE TABLE IF NOT EXISTS queue_tokens (
  id TEXT PRIMARY KEY,
  token_number TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  clinic_id TEXT NOT NULL,
  doctor_id TEXT,
  doctor_name TEXT,
  specialty TEXT,
  room_number TEXT,
  status TEXT NOT NULL DEFAULT 'waiting',
  queue_position INTEGER NOT NULL,
  estimated_wait_min INTEGER NOT NULL,
  dps_score INTEGER NOT NULL DEFAULT 75,
  stagnation_flag BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clinical encounters / visits
CREATE TABLE IF NOT EXISTS visits (
  id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL,
  clinic_id TEXT,
  doctor_id TEXT,
  specialty TEXT,
  date TEXT,
  reason TEXT,
  diagnosis TEXT,
  prescription_summary TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Immutable audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  details TEXT,
  actor TEXT,
  ip_address TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
```

When Supabase is unreachable or not configured, Odyssey Flow automatically falls back to deterministic local state caching with zero interruptions.

---

## 6. Demo Presets & Simulated Authentication

The prototype includes simulated phone-based OTP intake without passwords:

| Patient Name        | Mobile Number                  | Simulated OTP | Persona / Clinical Journey                                                                                                                     |
| :------------------ | :----------------------------- | :------------ | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| **Aarav Mehta**     | `+91 98765 43242`              | `4242`        | Primary demo subject (Token A-27). 8-month persistent cephalalgia, 6 encounters across 3 specialties, 2 duplicate MRIs. DPS = 63 (Stagnation). |
| **Priya Sharma**    | `+91 98765 43241`              | `4242`        | 6-month diagnostic odyssey: Recurrent right upper quadrant pain and nausea. DPS = 38.                                                          |
| **Rajesh Nair**     | `+91 98765 43243`              | `4242`        | Metabolic and GI workup. DPS = 72.                                                                                                             |
| **Walk-in Patient** | _Any unlisted 10-digit number_ | `4242`        | Dynamically registers an on-the-fly synthetic patient profile (`PAT-XXXX`) with consent toggles.                                               |

---

## 7. Prototype Features

### 1. Smart Queue Engine

- **Deterministic Queue Lifecycle**: `CREATED` → `WAITING` → `CALLED` → `IN_CONSULTATION` → `COMPLETED` (plus `SKIPPED`, `CANCELLED`, and `RECALL`).
- **Dynamic Position Recalculation**: Recomputes queue positions, active doctor availability, and real-time ETAs on every state transition.
- **Sanctuary Pulse**: Translates raw queue mathematics into human-centric pacing messages (`QUEUE_STABLE`, `QUEUE_MOVING`, `ALMOST_YOUR_TURN`, `PLEASE_REPORT`).
- **Bounded Policy Adjustment**: Automatically detects stagnation and expands the consultation window (10m → 15m), safely buffering downstream waiting patients.

### 2. Longitudinal Diagnostic Progress Score (DPS)

- **Deterministic Signal Analysis**:
  1. _Repeated Complaint Intensity_: Identifies semantic complaint loops over time.
  2. _Specialist Transition Velocity_: Quantifies cross-specialty bouncing without resolution.
  3. _Investigation Redundancy_: Flags duplicate or unyielding imaging/labs (e.g. repeated non-contrast MRI).
  4. _Hypothesis Entropy_: Detects conflicting or shifting provisional impressions.
  5. _Note Uncertainty_: NLP markers identifying non-conclusive doctor phrasing.
  6. _Treatment Non-Resolution_: Lack of therapeutic symptom relief.
- **Dynamic Trajectory Chart**: Auto-scaled SVG visualization with stagnation plateau threshold (DPS < 65) and clinical convergence tracking.

### 3. Clinician Workspace & Closed-Loop Referral

- **Pre-Consultation Snapshot**: Summarizes longitudinal diagnostic timeline, previous hypotheses, duplicate tests, and actionable recommendations before the clinician begins consultation.
- **Closed-Loop Referral**: Generates specialist referrals (e.g., Neurology `REF-NEURO-27`) with prioritized queue slot reservation.
- **DPS Recalculation**: Immediately recalculates score (e.g., 63 → 68) upon resolution or specialist escalation.

### 4. Clinic Operations Suite

- **Interactive Shift & Staff Scheduling**: Doctor availability, on-call statuses, and room assignments.
- **Financial & Billing Suite**: Itemized invoices, simulated cashless insurance pre-authorization claims, and revenue summaries.
- **Regulatory Audit Trail**: Immutable timestamped logs for all token dispatches, clinical actions, and DPS rebalancing events.

---

## 8. 12-Step Demonstration Scenario Guide

To run the complete orchestrated hackathon story:

1. Click **Show Demo Header** in the bottom-left corner of the app.
2. Step through the 12 numbered stages:
   - **Step 1**: Patient Identity Verification (Aarav Mehta).
   - **Step 2**: Check-in & Token Generation (Token A-27).
   - **Step 3**: Sanctuary Pulse: Queue Stable (Position 7, ETA ~24m).
   - **Step 4**: Clinic Moving: Serving progresses to A-23.
   - **Step 5**: Approaching Turn: Position reaches 2.
   - **Step 6**: Pre-Consultation Snapshot: Clinician views DPS 63 and stagnation alert.
   - **Step 7**: Queue Policy Rebalance: 15-minute consultation window + buffer applied.
   - **Step 8**: Doctor Consultation: Dr. Sharma begins consult in Room 101.
   - **Step 9**: Specialist Referral: Neurology escalation logged (`REF-NEURO-27`).
   - **Step 10**: Journey Update: DPS recalculated 63 → 68.
   - **Step 11**: Patient History: Aarav views updated longitudinal journey tab.
   - **Step 12**: Diagnostic Insights: Clinic metrics reflect reduced stagnation rates.

---

## 9. Mocked Integrations & Prototype Boundaries

As this is a HealthTech hackathon prototype, the following integrations are intentionally simulated with deterministic local algorithms:

| Subsystem                                   | Prototype Implementation                                   | Production Requirement                                        |
| :------------------------------------------ | :--------------------------------------------------------- | :------------------------------------------------------------ |
| **SMS / OTP Service**                       | Simulated modal accepting `4242` for instant login         | Twilio / AWS SNS / MSG91 SMS Gateway                          |
| **National Identity (ABHA / Aadhaar)**      | Synthetic opaque references (`DEMO-IND-XXXX`)              | Official Ayushman Bharat Digital Mission (ABDM) M1/M2/M3 APIs |
| **Hospital Information System (HIS / EHR)** | Deterministic in-memory `DataStore` with local-first cache | HL7 FHIR (Fast Healthcare Interoperability Resources) R4 APIs |
| **PACS / DICOM Imaging**                    | Synthetic imaging findings and diagnostic events           | DICOMweb / Orthanc PACS server                                |
| **Payment Gateway**                         | Instant simulated checkout and invoice settlement          | Razorpay / Stripe / UPI Payment APIs                          |
| **Insurance TPA Pre-auth**                  | Simulated claims with real-time approved status            | National Health Claims Exchange (NHCX) / TPA integration      |

---

## 10. Known Limitations

1. **Browser Storage Eviction**: Local storage acts as the primary offline cache; clearing browser cache resets simulation back to baseline (can be re-initialized anytime using the "Reset Demo" button).
2. **Audio Notifications**: Browser Autoplay policies require user interaction before playing audio chimes for Sanctuary Pulse arrival alerts.
3. **Multi-Tab Synchronization**: While changes persist to `localStorage` and Supabase, real-time push to other open browser tabs relies on 1.5s polling interval rather than persistent WebSocket connections when running without Supabase Realtime.

---

## 11. License

Developed by Pioneer Developers for the HealthTech Hackathon. Distributed under the MIT License.
