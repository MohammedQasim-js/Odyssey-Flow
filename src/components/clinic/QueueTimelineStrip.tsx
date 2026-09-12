import React from 'react';
import { ArrowRight, Clock, AlertTriangle, Stethoscope, CheckCircle2, ChevronRight } from 'lucide-react';
import { Token } from '../../types';

interface QueueTimelineStripProps {
  queue: Token[];
  onSelectToken: (token: Token) => void;
  selectedTokenId?: string;
}

export const QueueTimelineStrip: React.FC<QueueTimelineStripProps> = ({
  queue,
  onSelectToken,
  selectedTokenId,
}) => {
  // Identify key chronological sequence:
  // 1. Currently in consultation or serving
  // 2. Called / next up
  // 3. Waiting sequence (e.g. A-27, A-28, A-29...)
  const inConsult = queue.find(t => t.status === 'in_consultation' || t.status === 'in_treatment') || null;
  const called = queue.find(t => t.status === 'called') || null;
  const waitingTokens = queue.filter(t => t.status === 'waiting');

  // Build a 5-item sequential preview (or all active if smaller)
  const timelineItems: Array<{
    token: Token;
    role: 'current' | 'called' | 'you_are_here' | 'upcoming';
    badge: string;
  }> = [];

  if (inConsult) {
    timelineItems.push({
      token: inConsult,
      role: 'current',
      badge: 'CURRENT',
    });
  }

  if (called && (!inConsult || called.id !== inConsult.id)) {
    timelineItems.push({
      token: called,
      role: 'called',
      badge: 'NEXT UP',
    });
  }

  // Add the next waiting items (max 5 total)
  waitingTokens.forEach((t) => {
    if (timelineItems.length >= 6) return;
    if (timelineItems.some(i => i.token.id === t.id)) return;

    const isAaravOrFlagged = t.tokenNumber === 'A-27' || t.stagnationFlag;
    timelineItems.push({
      token: t,
      role: isAaravOrFlagged ? 'you_are_here' : 'upcoming',
      badge: isAaravOrFlagged ? 'ATTENTION' : `#${t.queuePosition || timelineItems.length}`,
    });
  });

  if (timelineItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-3.5 shadow-2xs">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[11px] font-bold text-stone-900 uppercase tracking-wider">
            Live Queue Progression
          </span>
          <span className="text-[11px] text-stone-400 font-normal">
            • Real-time suite & lounge timeline
          </span>
        </div>
        <span className="text-[10px] text-stone-400 font-mono hidden sm:inline">
          Click any token to inspect
        </span>
      </div>

      {/* Horizontal Minimalist Timeline */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {timelineItems.map((item, idx) => {
          const isSelected = selectedTokenId === item.token.id;
          const isCurrent = item.role === 'current';
          const isCalled = item.role === 'called';
          const isAttention = item.role === 'you_are_here';

          return (
            <React.Fragment key={item.token.id}>
              {idx > 0 && (
                <div className="text-stone-300 shrink-0 flex items-center px-0.5">
                  <ArrowRight className="w-3.5 h-3.5 text-stone-300" />
                </div>
              )}

              <button
                type="button"
                onClick={() => onSelectToken(item.token)}
                className={`flex-shrink-0 text-left px-3 py-2 rounded-xl border transition-all text-xs ${
                  isSelected
                    ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                    : isCurrent
                    ? 'border-emerald-300 bg-emerald-50/60 text-stone-900 hover:border-emerald-400'
                    : isCalled
                    ? 'border-sky-300 bg-sky-50/60 text-stone-900 hover:border-sky-400'
                    : isAttention
                    ? 'border-amber-300 bg-amber-50/50 text-stone-900 hover:border-amber-400'
                    : 'border-stone-200 bg-stone-50 hover:bg-white hover:border-stone-300 text-stone-800'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span
                    className={`font-mono font-black text-xs ${
                      isSelected
                        ? 'text-white'
                        : isCurrent
                        ? 'text-emerald-900'
                        : isAttention
                        ? 'text-amber-950'
                        : 'text-stone-900'
                    }`}
                  >
                    {item.token.tokenNumber}
                  </span>

                  <span
                    className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full tracking-wider ${
                      isSelected
                        ? 'bg-stone-800 text-stone-200'
                        : isCurrent
                        ? 'bg-emerald-200 text-emerald-900'
                        : isCalled
                        ? 'bg-sky-200 text-sky-900'
                        : isAttention
                        ? 'bg-amber-200 text-amber-950'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span
                    className={`font-medium truncate max-w-[105px] text-[11px] ${
                      isSelected ? 'text-stone-200' : 'text-stone-700'
                    }`}
                  >
                    {item.token.patientName.split(' ')[0]}
                  </span>
                  <span className={`text-[10px] ${isSelected ? 'text-stone-400' : 'text-stone-400'}`}>
                    • {item.token.status === 'in_consultation' ? 'Suite' : `~${item.token.estimatedWaitMin || 4}m`}
                  </span>
                </div>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
