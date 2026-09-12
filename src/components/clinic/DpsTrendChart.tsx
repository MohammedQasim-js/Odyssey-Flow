import React, { useState } from 'react';
import { Activity, AlertTriangle, TrendingDown, Info, ShieldCheck, Sparkles } from 'lucide-react';

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
  const data: DpsPoint[] = customPoints && customPoints.length >= 3 ? customPoints : [
    { encounter: 1, label: 'Enc 1', date: 'Jan 2026', specialty: 'General Medicine', dps: 71, note: 'Initial presentation of persistent occipital cephalalgia. Standard blood panel ordered.', isStagnantZone: false },
    { encounter: 2, label: 'Enc 2', date: 'Feb 2026', specialty: 'Neurology', dps: 69, note: 'Specialist transition. Brain MRI non-contrast ordered.', isStagnantZone: false },
    { encounter: 3, label: 'Enc 3', date: 'Mar 2026', specialty: 'ENT', dps: 65, note: 'Second transition. Sinus origin evaluated, inconclusive.', isStagnantZone: false },
    { encounter: 4, label: 'Enc 4', date: 'Apr 2026', specialty: 'Neurology', dps: 64, note: 'Loop back to Neurology. Repeated Brain MRI requested.', isStagnantZone: true },
    { encounter: 5, label: 'Enc 5', date: 'May 2026', specialty: 'Internal Medicine', dps: 63, note: 'Uncertainty remains high. Diagnostic velocity slows.', isStagnantZone: true },
    { encounter: 6, label: 'Enc 6 (Current)', date: 'Jun 2026', specialty: 'General Medicine', dps: 63, note: 'Current check-in. Diagnostic Odyssey flags stagnation.', isStagnantZone: true },
  ];

  // SVG Chart Geometry
  const width = 640;
  const height = 220;
  const paddingLeft = 45;
  const paddingRight = 45;
  const paddingTop = 35;
  const paddingBottom = 40;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  const minDps = 50;
  const maxDps = 85;

  const getX = (index: number) => {
    if (data.length <= 1) return paddingLeft + chartW / 2;
    return paddingLeft + (index / (data.length - 1)) * chartW;
  };

  const getY = (val: number) => {
    const norm = (val - minDps) / (maxDps - minDps);
    return paddingTop + chartH - norm * chartH;
  };

  // Build SVG Path
  const pointsString = data.map((d, i) => `${getX(i)},${getY(d.dps)}`).join(' ');
  const areaString = `${getX(0)},${paddingTop + chartH} ` +
    data.map((d, i) => `${getX(i)},${getY(d.dps)}`).join(' ') +
    ` ${getX(data.length - 1)},${paddingTop + chartH}`;

  // Stagnation region (encounters 4 to 6: index 3 to 5)
  const stagnationStartX = getX(3) - 15;
  const stagnationEndX = getX(data.length - 1) + 15;
  const stagnationW = stagnationEndX - stagnationStartX;

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
      
      {/* Chart Header & Annotation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
              Longitudinal Diagnostic Progress Score (DPS) Trajectory
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5 font-medium">
            Tracks diagnostic velocity and convergence toward conclusive resolution.
          </p>
        </div>

        {/* Highlighted Status Annotations */}
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold inline-flex items-center space-x-1.5 shadow-2xs">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            <span>Potential stagnation</span>
          </span>

          <span className="px-3 py-1 rounded-full bg-stone-900 text-white text-xs font-bold shadow-2xs">
            Clinical review recommended
          </span>
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
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.01" />
            </linearGradient>

            {/* Stagnation zone subtle pattern/fill */}
            <linearGradient id="stagnationGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#fef3c7" stopOpacity="0.10" />
            </linearGradient>
          </defs>

          {/* Stagnation Highlighted Region */}
          <rect
            x={stagnationStartX}
            y={paddingTop - 10}
            width={stagnationW}
            height={chartH + 20}
            fill="url(#stagnationGrad)"
            rx="12"
            className="transition-all"
          />

          {/* Stagnation Region Top Label */}
          <text
            x={stagnationStartX + stagnationW / 2}
            y={paddingTop - 1}
            textAnchor="middle"
            className="text-[10px] fill-amber-800 font-bold uppercase tracking-wider"
          >
            Stagnation Plateau (Score ~63)
          </text>

          {/* Horizontal Grid lines */}
          {[50, 60, 70, 80].map((level) => {
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
                  r={isHovered ? 8 : isLast ? 6 : 5}
                  fill="#ffffff"
                  stroke={point.isStagnantZone ? '#d97706' : '#059669'}
                  strokeWidth={isHovered ? 3 : 2.5}
                  className="transition-all"
                />

                {/* Inner dot */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 3.5 : 2.5}
                  fill={point.isStagnantZone ? '#d97706' : '#059669'}
                />

                {/* Score value above dot */}
                <text
                  x={cx}
                  y={cy - 10}
                  textAnchor="middle"
                  className={`text-[11px] font-mono font-extrabold ${
                    point.isStagnantZone ? 'fill-amber-900' : 'fill-stone-900'
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

                {/* X-axis Sub-label (Date) */}
                <text
                  x={cx}
                  y={paddingTop + chartH + 30}
                  textAnchor="middle"
                  className="text-[9px] fill-stone-400 font-mono"
                >
                  {point.date.split(' ')[0]}
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
      <div className="flex flex-wrap items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100">
        <div className="flex items-center space-x-1.5">
          <Info className="w-3.5 h-3.5 text-stone-400" />
          <span>Diagnostic Progress Score measures longitudinal diagnostic velocity (normal recovery velocity: &gt;80).</span>
        </div>
        <span className="font-mono text-stone-700">
          Delta: -8 pts across 5 months (Plateaued)
        </span>
      </div>

    </div>
  );
};
