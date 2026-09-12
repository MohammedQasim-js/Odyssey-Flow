import React from 'react';
import { 
  AlertCircle, RefreshCw, Inbox, CheckCircle2, ShieldCheck, 
  Search, Stethoscope, Clock, FileText, Activity 
} from 'lucide-react';

export type EmptyStateType = 
  | 'no-queue' 
  | 'no-diagnostic-concern' 
  | 'no-visits' 
  | 'no-referrals' 
  | 'no-search-results' 
  | 'custom';

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'no-queue',
  title,
  description,
  actionLabel,
  onAction,
  className = '',
  icon,
}) => {
  let defaultIcon = <Inbox className="w-8 h-8 text-stone-400" />;
  let defaultTitle = 'No records available';
  let defaultDesc = 'There is currently no data to display for this view.';

  switch (type) {
    case 'no-queue':
      defaultIcon = <Clock className="w-8 h-8 text-emerald-600" />;
      defaultTitle = 'No active queue';
      defaultDesc = 'The waiting queue is currently clear. Patients will appear here as they complete check-in.';
      break;
    case 'no-diagnostic-concern':
      defaultIcon = <ShieldCheck className="w-8 h-8 text-emerald-600" />;
      defaultTitle = 'No diagnostic concern detected';
      defaultDesc = 'All current patient trajectories are progressing normally. No stagnation or multi-test ambiguity flags.';
      break;
    case 'no-visits':
      defaultIcon = <FileText className="w-8 h-8 text-stone-400" />;
      defaultTitle = 'No previous visits found';
      defaultDesc = 'There are no historical encounter records recorded for this patient identifier.';
      break;
    case 'no-referrals':
      defaultIcon = <Stethoscope className="w-8 h-8 text-sky-600" />;
      defaultTitle = 'No active referrals';
      defaultDesc = 'No specialist referrals currently pending or scheduled.';
      break;
    case 'no-search-results':
      defaultIcon = <Search className="w-8 h-8 text-stone-400" />;
      defaultTitle = 'No matching records';
      defaultDesc = 'Try adjusting your search criteria or clearing active filters.';
      break;
  }

  return (
    <div 
      className={`p-8 sm:p-12 text-center rounded-3xl bg-stone-50/70 border border-stone-200/80 flex flex-col items-center justify-center space-y-3 ${className}`}
      role="status"
    >
      <div className="w-14 h-14 rounded-2xl bg-white border border-stone-200/80 shadow-2xs flex items-center justify-center text-stone-600">
        {icon || defaultIcon}
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className="text-sm font-bold text-stone-900">{title || defaultTitle}</h4>
        <p className="text-xs text-stone-500 leading-relaxed">{description || defaultDesc}</p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 px-4 py-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 text-xs font-bold transition-all shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Something went wrong while updating the queue.',
  onRetry,
  className = '',
}) => {
  return (
    <div 
      className={`p-5 sm:p-6 rounded-2xl bg-rose-50/80 border border-rose-200 text-stone-900 flex items-start space-x-3.5 ${className}`}
      role="alert"
    >
      <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
        <AlertCircle className="w-4 h-4" />
      </div>
      <div className="flex-1 space-y-1">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-rose-900">
          Sync Notice
        </h4>
        <p className="text-xs text-rose-800 font-medium leading-relaxed">
          {message}
        </p>
        {onRetry && (
          <div className="pt-2">
            <button
              onClick={onRetry}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-rose-400"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Try again</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const SkeletonQueueRow: React.FC = () => {
  return (
    <tr className="animate-pulse">
      <td className="py-4 px-4"><div className="h-6 w-12 bg-stone-200 rounded-md"></div></td>
      <td className="py-4 px-4">
        <div className="space-y-1.5">
          <div className="h-4 w-28 bg-stone-200 rounded"></div>
          <div className="h-3 w-16 bg-stone-100 rounded"></div>
        </div>
      </td>
      <td className="py-4 px-4"><div className="h-5 w-24 bg-stone-200 rounded-full"></div></td>
      <td className="py-4 px-4"><div className="h-5 w-28 bg-stone-200 rounded-full"></div></td>
      <td className="py-4 px-4"><div className="h-5 w-16 bg-stone-200 rounded"></div></td>
      <td className="py-4 px-4"><div className="h-5 w-20 bg-stone-100 rounded"></div></td>
      <td className="py-4 px-4"><div className="h-4 w-24 bg-stone-200 rounded"></div></td>
      <td className="py-4 px-4"><div className="h-4 w-14 bg-stone-200 rounded"></div></td>
      <td className="py-4 px-4 text-right"><div className="h-8 w-24 bg-stone-200 rounded-xl ml-auto"></div></td>
    </tr>
  );
};

export const SkeletonCard: React.FC<{ lines?: number }> = ({ lines = 3 }) => {
  return (
    <div className="p-5 rounded-3xl bg-white border border-stone-200/80 animate-pulse space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-4 w-32 bg-stone-200 rounded"></div>
        <div className="h-5 w-16 bg-stone-200 rounded-full"></div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="h-3 bg-stone-100 rounded" style={{ width: `${85 - i * 15}%` }}></div>
        ))}
      </div>
    </div>
  );
};
