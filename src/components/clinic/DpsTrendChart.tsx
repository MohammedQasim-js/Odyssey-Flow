import React, { useState } from 'react';
import { AlertTriangle, Info, ShieldCheck } from 'lucide-react';

interface DpsPoint {
  encounter: number;
  label: string;
  date: string;
  specialty: string;
  dps: number;
  note: string;
  isStagnantZone?: boolean;
}

interface DpsTrendChartProps {
  points?: DpsPoint[];
  currentDps?: number;
  trendLabel?: string;
  onPointClick?: (encounterIdx: number) => void;
}

export const DpsTrendChart: React.FC<DpsTrendChartProps> = ({
  points: customPoints,
  currentDps = 63,
  trendLabel = 'Stagnating',
  onPointClick,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Default points matching user specification: 71, 69, 65, 64, 63, 63 across encounters
  const data: DpsPoint[] = customPoints && customPoints.length >= 2 ? customPoints : [
    { encounter: 1, label: 'Enc 1', date: 'Jan 2026', specialty: 'General Medicine', dps: 71, note: 'Initial presentation of persistent occipital cephalalgia. Standard blood panel ordered.', isStagnantZone: false },
    { encounter: 2, label: 'Enc 2', date: 'Feb 2026', specialty: 'Neurology', dps: 69, note: 'Specialist transition. Brain MRI non-contrast ordered.', isStagnantZone: false },
    { encounter: 3, label: 'Enc 3', date: 'Mar 2026', specialty: 'ENT', dps: 65, note: 'Second transition. Sinus origin evaluated, inconclusive.', isStagnantZone: false },
    { encounter: 4, label: 'Enc 4', date: 'Apr 2026', specialty: 'Neurology', dps: 64, note: 'Loop back to Neurology. Repeated Brain MRI requested.', isStagnantZone: true },
    { encounter: 5, label: 'Enc 5', date: 'May 2026', specialty: 'Internal Medicine', dps: 63, note: 'Uncertainty remains high. Diagnostic velocity slows.', isStagnantZone: true },
    { encounter: 6, label: 'Enc 6 (Current)', date: 'Jun 2026', specialty: 'General Medicine', dps: 63, note: 'Current check-in. Diagnostic Odyssey flags stagnation.', isStagnantZone: true },
  ];

  // SVG Chart Geometry
  const width = 680;
  const height = 240;
  const paddingLeft = 45;
  const paddingRight = 45;
  const paddingTop = 38;
  const paddingBottom = 46;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  // Dynamic Y-Axis scale calculation based on actual points
  const scores = data.map((d) => d.dps);
  const dataMin = Math.min(...scores);
  const dataMax = Math.max(...scores);

  // Determine clean step size and bounds
  const rawRange = dataMax - dataMin;
  const step = rawRange > 45 ? 20 : 10;
  // Pad bounds by at least 6 points so values near the edges do not touch borders
  const minDps = Math.max(0, Math.floor((dataMin - 6) / step) * step);
  const maxDps = Math.min(100, Math.ceil((dataMax + 6) / step) * step);

  // Generate grid levels
  const effectiveMax = maxDps === minDps ? minDps + 20 : maxDps;
  const gridLevels: number[] = [];
  for (let val = minDps; val <= effectiveMax; val += step) {
    gridLevels.push(val);
  }

  const getX = (index: number) => {
    if (data.length <= 1) return paddingLeft + chartW / 2;
    return paddingLeft + (index / (data.length - 1)) * chartW;
  };

  const getY = (val: number) => {
    const clamped = Math.max(minDps, Math.min(effectiveMax, val));
    const norm = (clamped - minDps) / (effectiveMax - minDps);
    return paddingTop + chartH - norm * chartH;
  };

  // Build SVG Path
  const pointsString = data.map((d, i) => `${getX(i)},${getY(d.dps)}`).join(' ');
  const areaString = `${getX(0)},${paddingTop + chartH} ` +
    data.map((d, i) => `${getX(i)},${getY(d.dps)}`).join(' ') +
    ` ${getX(data.length - 1)},${paddingTop + chartH}`;

  // Stagnation region calculation (points with isStagnantZone === true or dps < 65)
  const stagnantIndices = data
    .map((d, i) => (d.isStagnantZone || d.dps < 65) ? i : -1)
    .filter((i) => i !== -1);

  const hasStagnation = stagnantIndices.length > 0;
  const firstStagIdx = hasStagnation ? stagnantIndices[0] : -1;
  const lastStagIdx = hasStagnation ? stagnantIndices[stagnantIndices.length - 1] : -1;

  const halfStep = chartW / (Math.max(1, data.length - 1) * 2);
  const stagnationStartX = hasStagnation
    ? Math.max(paddingLeft, getX(firstStagIdx) - Math.min(24, halfStep))
    : 0;
  const stagnationEndX = hasStagnation
    ? Math.min(width - paddingRight, getX(lastStagIdx) + Math.min(24, halfStep))
    : 0;
  const stagnationW = stagnationEndX - stagnationStartX;

  // Stagnation threshold line (DPS = 65)
  const stagnationThreshold = 65;
  const showThresholdLine = stagnationThreshold >= minDps && stagnationThreshold <= effectiveMax;
  const thresholdY = getY(stagnationThreshold);

  // Delta calculation for summary strip
  const firstDps = data[0].dps;
  const lastDps = data[data.length - 1].dps;
  const delta = lastDps - firstDps;
  const deltaFormatted = `${delta > 0 ? '+' : ''}${delta} pts`;

  // Helper to format encounter date cleanly without slicing off month names
  const formatEncounterDate = (dateStr: string) => {
    if (!dateStr) return '';
    const trimmed = dateStr.trim();
    // If ISO string like 2026-01-10
    if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
      const d = new Date(trimmed);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    }
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 2) {
      // If "10 Jan" or "10 Jan 2026"
      if (/^\d+$/.test(parts[0])) {
        return `${parts[0]} ${parts[1]}`;
      }
      // If "Jan 2026"
      return `${parts[0]} '${parts[1].slice(-2)}`;
    }
    return trimmed;
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] space-y-4">
      
      {/* Chart Header & Annotation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-stone-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Longitudinal Diagnostic Progress Score (DPS) Trajectory
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5 font-normal">
            Tracks diagnostic velocity and convergence toward conclusive resolution.
          </p>
        </div>

        {/* Highlighted Status Annotations */}
        <div className="flex flex-wrap items-center gap-2">
          {hasStagnation && (
            <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-[11px] font-bold inline-flex items-center space-x-1.5 shadow-2xs">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              <span>Potential stagnation</span>
            </span>
          )}

          <span className="px-3 py-1 rounded-full bg-stone-900 text-stone-100 text-[11px] font-bold shadow-2xs inline-flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Clinical review recommended</span>
          </span>
        </div>
      </div>

      {/* Chart Legend Bar */}
      <div className="flex flex-wrap items-center gap-4 text-[11px] text-stone-600 px-1">
        <div className="flex items-center space-x-1.5">
          <span className="w-3.5 h-1 rounded-full bg-emerald-600"></span>
          <span className="font-medium">DPS Trajectory</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300"></span>
          <span className="font-medium">Stagnation Plateau (Score &lt; 65)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-emerald-100"></span>
          <span className="font-medium">Clinical Encounter Point</span>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            {/* Soft Green Gradient under line */}
            <linearGradient id="dpsAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.01" />
            </linearGradient>

            {/* Stagnation zone subtle pattern/fill */}
            <linearGradient id="stagnationGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#fef3c7" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {/* Stagnation Highlighted Region */}
          {hasStagnation && (
            <g>
              <rect
                x={stagnationStartX}
                y={paddingTop}
                width={stagnationW}
                height={chartH}
                fill="url(#stagnationGrad)"
                rx="8"
                className="transition-all"
              />
              <text
                x={stagnationStartX + stagnationW / 2}
                y={paddingTop + 14}
                textAnchor="middle"
                className="text-[10px] fill-amber-800 font-bold uppercase tracking-wider"
              >
                Stagnation Plateau (Score &lt; 65)
              </text>
            </g>
          )}

          {/* Horizontal Grid lines */}
          {gridLevels.map((level) => {
            const y = getY(level);
            return (
              <g key={level}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#e7e5e4"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 3.5}
                  textAnchor="end"
                  className="text-[10px] fill-stone-400 font-mono font-medium"
                >
                  {level}
                </text>
              </g>
            );
          })}

          {/* Stagnation Threshold Reference Line (DPS = 65) */}
          {showThresholdLine && (
            <g>
              <line
                x1={paddingLeft}
                y1={thresholdY}
                x2={width - paddingRight}
                y2={thresholdY}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                strokeWidth="1.5"
                opacity="0.8"
              />
              <text
                x={width - paddingRight}
                y={thresholdY - 4}
                textAnchor="end"
                className="text-[9px] fill-amber-700 font-mono font-bold"
              >
                Threshold (65)
              </text>
            </g>
          )}

          {/* Shaded Area under Curve */}
          <polygon
            points={areaString}
            fill="url(#dpsAreaGrad)"
          />

          {/* Main DPS Line */}
          <polyline
            fill="none"
            stroke="#059669"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={pointsString}
          />

          {/* Data Points and Interactivity */}
          {data.map((point, i) => {
            const cx = getX(i);
            const cy = getY(point.dps);
            const isHovered = hoveredIdx === i;
            const isLast = i === data.length - 1;
            const isStagnantPoint = point.isStagnantZone || point.dps < 65;

            // Smart label position: if point is in upper 22px of chart area, place label below dot to prevent top clipping
            const isNearTop = cy < paddingTop + 22;
            const labelY = isNearTop ? cy + 18 : cy - 10;

            return (
              <g
                key={point.encounter}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => onPointClick && onPointClick(i)}
              >
                {/* Vertical drop guide on hover */}
                {isHovered && (
                  <line
                    x1={cx}
                    y1={paddingTop}
                    x2={cx}
                    y2={paddingTop + chartH}
                    stroke="#a8a29e"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Outer halo */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 8 : isLast ? 6.5 : 5.5}
                  fill="#ffffff"
                  stroke={isStagnantPoint ? '#d97706' : '#059669'}
                  strokeWidth={isHovered ? 3 : 2.5}
                  className="transition-all"
                />

                {/* Inner dot */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 3.5 : 2.5}
                  fill={isStagnantPoint ? '#d97706' : '#059669'}
                />

                {/* Score value above or below dot - never collides with X-axis labels */}
                <text
                  x={cx}
                  y={labelY}
                  textAnchor="middle"
                  className={`text-[11px] font-mono font-extrabold ${
                    isStagnantPoint ? 'fill-amber-900' : 'fill-stone-900'
                  }`}
                >
                  {point.dps}
                </text>

                {/* X-axis Label */}
                <text
                  x={cx}
                  y={paddingTop + chartH + 18}
                  textAnchor="middle"
                  className="text-[10px] fill-stone-700 font-bold"
                >
                  {point.label}
                </text>

                {/* X-axis Sub-label (Date - formatted with month & day) */}
                <text
                  x={cx}
                  y={paddingTop + chartH + 32}
                  textAnchor="middle"
                  className="text-[9px] fill-stone-400 font-mono"
                >
                  {formatEncounterDate(point.date)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip Detail */}
        {hoveredIdx !== null && data[hoveredIdx] && (
          <div className="mt-2 p-3 bg-stone-900 text-white rounded-2xl shadow-xl text-xs flex items-center justify-between animate-in fade-in duration-100">
            <div>
              <span className="text-emerald-400 font-mono font-bold mr-2">
                {data[hoveredIdx].date} • {data[hoveredIdx].specialty}
              </span>
              <span className="text-stone-300">
                {data[hoveredIdx].note}
              </span>
            </div>
            <div className="pl-4 shrink-0 font-mono font-extrabold text-sm text-white">
              DPS: {data[hoveredIdx].dps} / 100
            </div>
          </div>
        )}
      </div>

      {/* Metric explanation strip */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-100">
        <div className="flex items-center space-x-1.5">
          <Info className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span>Diagnostic Progress Score measures longitudinal diagnostic velocity (normal recovery velocity: &gt;80).</span>
        </div>
        <span className="font-mono text-stone-700 font-semibold">
          Delta: {deltaFormatted} across {data.length} encounters ({trendLabel || (hasStagnation ? 'Plateaued' : 'Active')})
        </span>
      </div>

    </div>
  );
};
