import React, { useState } from 'react';
import { 
  Activity, AlertTriangle, ArrowRight, CheckCircle2, ChevronRight, 
  HelpCircle, Info, Sparkles, TrendingDown, TrendingUp, ShieldAlert, Share2 
} from 'lucide-react';

export interface DpsTrajectoryPoint {
  id: string;
  encounterNumber: number;
  label: string;
  date: string;
  specialty: string;
  facility: string;
  dps: number;
  delta: number;
  isStagnation?: boolean;
  isReferral?: boolean;
  isProjected?: boolean;
  notes: string;
  testsOrdered?: string[];
  doctor: string;
}

export const AARAV_DEFAULT_DPS_POINTS: DpsTrajectoryPoint[] = [
  {
    id: 'enc-1',
    encounterNumber: 1,
    label: 'Initial GP Consult',
    date: '8 mos ago',
    specialty: 'General Medicine',
    facility: 'Apex Primary Health',
    dps: 72,
    delta: 0,
    notes: 'Mild bilateral tension headache. Prescribed standard NSAIDs.',
    testsOrdered: ['Basic Blood Panel (Normal)'],
    doctor: 'Dr. V. Rao',
  },
  {
    id: 'enc-2',
    encounterNumber: 2,
    label: 'GP Follow-up',
    date: '6 mos ago',
    specialty: 'General Medicine',
    facility: 'Apex Primary Health',
    dps: 70,
    delta: -2,
    notes: 'Headache unremitting. Switched analgesics to Paracetamol + Caffeine.',
    testsOrdered: ['Complete Blood Count'],
    doctor: 'Dr. V. Rao',
  },
  {
    id: 'enc-3',
    encounterNumber: 3,
    label: 'ENT Evaluation',
    date: '4 mos ago',
    specialty: 'Otolaryngology (ENT)',
    facility: 'City Sinus Care',
    dps: 67,
    delta: -3,
    notes: 'Investigated for sinus origin. Diagnostic ambiguity increasing.',
    testsOrdered: ['Nasal Endoscopy (Inconclusive)'],
    doctor: 'Dr. N. Kulkarni',
  },
  {
    id: 'enc-4',
    encounterNumber: 4,
    label: 'Ophthalmology Exam',
    date: '3 mos ago',
    specialty: 'Ophthalmology',
    facility: 'Vision Health Center',
    dps: 65,
    delta: -2,
    notes: 'Papilledema ruled out. Visual acuity normal. No convergent diagnosis.',
    testsOrdered: ['Fundus Photography (Clear)'],
    doctor: 'Dr. S. Roy',
  },
  {
    id: 'enc-5',
    encounterNumber: 5,
    label: 'Urgent Care & MRI',
    date: '1 mo ago',
    specialty: 'Acute Care & Imaging',
    facility: 'Metro Diagnostics',
    dps: 63,
    delta: -2,
    isStagnation: true,
    notes: 'Non-contrast brain scan inconclusive. Trajectory stagnant across 3 specialties.',
    testsOrdered: ['Brain MRI Non-Contrast (Normal)'],
    doctor: 'Dr. R. Gupta',
  },
  {
    id: 'enc-6',
    encounterNumber: 6,
    label: 'Targeted Neurology Referral',
    date: 'Today',
    specialty: 'Neurology (Comprehensive)',
    facility: 'Odyssey Care Clinic',
    dps: 68,
    delta: +5,
    isReferral: true,
    notes: 'Dr. A. Sharma reviews full longitudinal trajectory. Direct referral REF-NEURO-27 issued.',
    testsOrdered: ['Contrast Neurovascular Protocol'],
    doctor: 'Dr. A. Sharma',
  },
  {
    id: 'enc-7',
    encounterNumber: 7,
    label: 'Specialist Workup Convergence',
    date: 'Upcoming',
    specialty: 'Apex Neurosciences',
    facility: 'Specialized Center',
    dps: 71,
    delta: +3,
    isProjected: true,
    notes: 'Definitive cluster / neurovascular protocol initiated. Convergence velocity resumed.',
    testsOrdered: ['Contrast MRI Review', 'Autonomic Screen'],
    doctor: 'Dr. K. Iyer (Senior Review)',
  },
];

interface DpsTimelineChartProps {
  points?: DpsTrajectoryPoint[];
  currentDps?: number;
  compact?: boolean;
  highlightStagnation?: boolean;
  showAnnotations?: boolean;
  onPointClick?: (point: DpsTrajectoryPoint) => void;
}

export const DpsTimelineChart: React.FC<DpsTimelineChartProps> = ({
  points = AARAV_DEFAULT_DPS_POINTS,
  currentDps = 68,
  compact = false,
  highlightStagnation = true,
  showAnnotations = true,
  onPointClick,
}) => {
  const [selectedPointId, setSelectedPointId] = useState<string>(
    currentDps >= 68 ? 'enc-6' : 'enc-5'
  );
  const [hoveredPointId, setHoveredPointId] = useState<string | null>(null);

  // SVG Coordinate mapping
  const width = compact ? 560 : 780;
  const height = compact ? 220 : 300;
  const padding = {
    top: compact ? 30 : 40,
    right: compact ? 40 : 60,
    bottom: compact ? 45 : 55,
    left: compact ? 45 : 55,
  };

  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  // Scale bounds
  const minDps = 58;
  const maxDps = 78;

  const getX = (index: number) => {
    return padding.left + (index / (points.length - 1)) * innerWidth;
  };

  const getY = (val: number) => {
    const ratio = (val - minDps) / (maxDps - minDps);
    return padding.top + (1 - ratio) * innerHeight;
  };

  // Generate cubic bezier path string
  const generatePath = () => {
    if (points.length < 2) return '';
    const coords = points.map((p, i) => ({ x: getX(i), y: getY(p.dps) }));
    let d = `M ${coords[0].x} ${coords[0].y}`;

    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i === 0 ? i : i - 1];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  // Stagnation boundary Y & Convergence Y
  const convergenceY = getY(75);
  const stagnationY = getY(65);

  const activePoint = points.find(p => p.id === (hoveredPointId || selectedPointId)) || points[points.length - 2];

  return (
    <div className="w-full bg-white rounded-3xl border border-stone-200/90 p-4 sm:p-6 shadow-xs select-none">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/50">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-extrabold text-stone-900 tracking-tight">
                Longitudinal DPS Trajectory
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
                Diagnostic Progress Score
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium">
              Tracks convergence velocity across encounters, pinpointing ambiguity stagnation and specialist intervention.
            </p>
          </div>
        </div>

        {/* Live Legend */}
        <div className="flex items-center space-x-3 text-[11px] font-medium text-stone-500 shrink-0">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Stagnation (63)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>Referral (+5 pts)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
            <span>Convergence (71)</span>
          </span>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative overflow-x-auto py-2">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-auto max-h-[320px] overflow-visible"
        >
          <defs>
            {/* Linear Gradient for Chart Line */}
            <linearGradient id="dpsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="45%" stopColor="#d97706" />
              <stop offset="70%" stopColor="#d97706" />
              <stop offset="85%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            {/* Gradient for Stagnation Zone Ambient */}
            <linearGradient id="stagnationZone" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#fef3c7" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Stagnation Ambiguity Zone Background Highlight */}
          {highlightStagnation && (
            <rect
              x={getX(3) - 15}
              y={padding.top}
              width={getX(5) - getX(3) + 30}
              height={innerHeight}
              fill="url(#stagnationZone)"
              rx="12"
            />
          )}

          {/* Reference Threshold: Convergence Boundary (DPS 75) */}
          <line
            x1={padding.left}
            y1={convergenceY}
            x2={width - padding.right}
            y2={convergenceY}
            stroke="#10b981"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.45"
          />
          <text
            x={padding.left}
            y={convergenceY - 6}
            fill="#059669"
            fontSize="9"
            fontWeight="bold"
            fontFamily="monospace"
          >
            CONVERGENCE THRESHOLD (75)
          </text>

          {/* Reference Threshold: Stagnation Friction Floor (DPS 65) */}
          <line
            x1={padding.left}
            y1={stagnationY}
            x2={width - padding.right}
            y2={stagnationY}
            stroke="#f59e0b"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            opacity="0.6"
          />
          <text
            x={padding.left}
            y={stagnationY - 6}
            fill="#b45309"
            fontSize="9"
            fontWeight="bold"
            fontFamily="monospace"
          >
            STAGNATION FRICTION BOUNDARY (65)
          </text>

          {/* Horizontal Grid lines */}
          {[60, 65, 70, 75].map((level) => (
            <g key={level}>
              <line
                x1={padding.left}
                y1={getY(level)}
                x2={width - padding.right}
                y2={getY(level)}
                stroke="#e7e5e4"
                strokeWidth="1"
              />
              <text
                x={padding.left - 8}
                y={getY(level) + 3}
                fill="#a8a29e"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="end"
              >
                {level}
              </text>
            </g>
          ))}

          {/* Connecting Smooth Trajectory Line */}
          <path
            d={generatePath()}
            fill="none"
            stroke="url(#dpsGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Stagnation Period Bracket Annotation */}
          {showAnnotations && (
            <g>
              <rect
                x={getX(4) - 58}
                y={getY(63) + 26}
                width="116"
                height="22"
                rx="6"
                fill="#fef3c7"
                stroke="#fcd34d"
                strokeWidth="1"
              />
              <text
                x={getX(4)}
                y={getY(63) + 40}
                fill="#92400e"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
              >
                ⚠ 63 Stagnation Plateau
              </text>
              <line
                x1={getX(4)}
                y1={getY(63) + 10}
                x2={getX(4)}
                y2={getY(63) + 26}
                stroke="#d97706"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            </g>
          )}

          {/* Targeted Referral Annotation (Enc 6) */}
          {showAnnotations && (
            <g>
              <rect
                x={getX(5) - 65}
                y={getY(68) - 34}
                width="130"
                height="22"
                rx="6"
                fill="#ecfdf5"
                stroke="#a7f3d0"
                strokeWidth="1"
              />
              <text
                x={getX(5)}
                y={getY(68) - 20}
                fill="#065f46"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
              >
                ★ Referral: REF-NEURO-27
              </text>
              <line
                x1={getX(5)}
                y1={getY(68) - 12}
                x2={getX(5)}
                y2={getY(68) - 2}
                stroke="#10b981"
                strokeWidth="1.2"
              />
            </g>
          )}

          {/* Encounter Nodes / Markers */}
          {points.map((p, i) => {
            const cx = getX(i);
            const cy = getY(p.dps);
            const isSelected = p.id === selectedPointId;
            const isHovered = p.id === hoveredPointId;

            return (
              <g 
                key={p.id}
                className="cursor-pointer transition-transform duration-150"
                onClick={() => {
                  setSelectedPointId(p.id);
                  if (onPointClick) onPointClick(p);
                }}
                onMouseEnter={() => setHoveredPointId(p.id)}
                onMouseLeave={() => setHoveredPointId(null)}
              >
                {/* Outer Glow Halo on Active */}
                {(isSelected || isHovered) && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="14"
                    fill={p.isStagnation ? '#fef3c7' : p.isReferral ? '#d1fae5' : '#e0f2fe'}
                    opacity="0.8"
                  />
                )}

                {/* Main Node Circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected || isHovered ? '7' : '5.5'}
                  fill={
                    p.isStagnation 
                      ? '#d97706' 
                      : p.isReferral 
                      ? '#059669' 
                      : p.isProjected 
                      ? '#0284c7' 
                      : '#475569'
                  }
                  stroke="#ffffff"
                  strokeWidth="2.5"
                />

                {/* Score Number above node */}
                <text
                  x={cx}
                  y={cy - 10}
                  fill={
                    p.isStagnation 
                      ? '#b45309' 
                      : p.isReferral 
                      ? '#047857' 
                      : p.isProjected 
                      ? '#0369a1' 
                      : '#1e293b'
                  }
                  fontSize={isSelected || isHovered ? '11' : '10'}
                  fontWeight="bold"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {p.dps}
                </text>

                {/* Encounter Label below Axis */}
                <text
                  x={cx}
                  y={height - padding.bottom + 16}
                  fill="#475569"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  E{p.encounterNumber}
                </text>

                <text
                  x={cx}
                  y={height - padding.bottom + 28}
                  fill="#94a3b8"
                  fontSize="8.5"
                  textAnchor="middle"
                >
                  {p.date}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Encounter Inspector Drawer */}
      {activePoint && (
        <div className="mt-2 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-md bg-white border border-stone-200 font-mono font-bold text-stone-800 text-[10px]">
                Encounter #{activePoint.encounterNumber} • {activePoint.date}
              </span>
              <strong className="text-stone-900 font-bold">{activePoint.label}</strong>
              <span className="text-stone-400">|</span>
              <span className="text-stone-600">{activePoint.specialty} ({activePoint.doctor})</span>
            </div>
            <p className="text-stone-600 font-medium">
              {activePoint.notes}
            </p>
            {activePoint.testsOrdered && activePoint.testsOrdered.length > 0 && (
              <div className="flex items-center space-x-1.5 text-[11px] text-stone-500 pt-0.5">
                <span className="font-semibold text-stone-700">Orders:</span>
                <span>{activePoint.testsOrdered.join(', ')}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Progress Score
              </span>
              <div className="flex items-center justify-end space-x-1">
                <span className="text-lg font-mono font-extrabold text-stone-900">
                  {activePoint.dps}
                </span>
                <span className="text-stone-400 text-xs">/100</span>
                {activePoint.delta !== 0 && (
                  <span className={`text-[11px] font-bold ml-1 flex items-center ${
                    activePoint.delta > 0 ? 'text-emerald-700' : 'text-amber-700'
                  }`}>
                    {activePoint.delta > 0 ? (
                      <><TrendingUp className="w-3 h-3 mr-0.5" />+{activePoint.delta}</>
                    ) : (
                      <><TrendingDown className="w-3 h-3 mr-0.5" />{activePoint.delta}</>
                    )}
                  </span>
                )}
              </div>
            </div>

            {activePoint.isStagnation && (
              <div className="px-2.5 py-1.5 rounded-xl bg-amber-100 text-amber-900 font-bold text-[11px] flex items-center space-x-1 border border-amber-300">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                <span>Stagnation Period</span>
              </div>
            )}

            {activePoint.isReferral && (
              <div className="px-2.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-[11px] flex items-center space-x-1 border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Referral Convergence</span>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
