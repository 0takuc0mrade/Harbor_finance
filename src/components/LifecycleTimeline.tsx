import { TimelineEvent } from '@/lib/types';
import { formatDateTime, getStatusLabel } from '@/lib/utils';

interface LifecycleTimelineProps {
  events: TimelineEvent[];
}

const STATUS_ICONS: Record<string, { icon: string; color: string }> = {
  created: { icon: '📄', color: 'border-zinc-600' },
  submitted: { icon: '📨', color: 'border-blue-500' },
  under_review: { icon: '🔍', color: 'border-amber-500' },
  approved: { icon: '✅', color: 'border-emerald-500' },
  funded: { icon: '💰', color: 'border-orange-500' },
  repaid: { icon: '🔄', color: 'border-cyan-500' },
  settled: { icon: '🏁', color: 'border-green-500' },
  rejected: { icon: '❌', color: 'border-red-500' },
  defaulted: { icon: '⚠️', color: 'border-rose-500' },
};

export default function LifecycleTimeline({ events }: LifecycleTimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[17px] top-2 bottom-2 w-px bg-gradient-to-b from-orange-500/40 via-white/[0.08] to-transparent" />

      <div className="space-y-0">
        {events.map((event, index) => {
          const isLast = index === events.length - 1;
          const config = STATUS_ICONS[event.status] || STATUS_ICONS.created;

          return (
            <div key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
              {/* Timeline Node */}
              <div className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${config.color} bg-[#0d0e13] text-sm ${
                isLast ? 'shadow-lg shadow-orange-500/10' : ''
              }`}>
                {config.icon}
              </div>

              {/* Content */}
              <div className={`flex-1 pt-1 ${isLast ? '' : 'pb-2'}`}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-white">
                    {event.status === 'created' ? 'Created' : getStatusLabel(event.status as never)}
                  </span>
                  {event.actor && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-500 font-medium">
                      {event.actor}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-zinc-400 leading-relaxed">{event.description}</p>
                <p className="mt-1 text-[10px] text-zinc-600 font-mono">{formatDateTime(event.timestamp)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
