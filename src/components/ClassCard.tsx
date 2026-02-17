import type { WeeklyClass } from "../types/demo";

export default function ClassCard({
  cls,
  bookable,
  booked,
  onBook,
  compact,
}: {
  cls: WeeklyClass;
  bookable?: boolean;
  booked?: boolean;
  onBook?: () => void;
  compact?: boolean;
}) {
  return (
    <div className={`rounded-md border border-[var(--line)] bg-[var(--card)] ${compact ? "px-2 py-1.5" : "p-3"}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className={`font-semibold leading-tight text-[var(--ink)] ${compact ? "text-sm" : "text-base"}`}>{cls.title}</p>
          <p className={`mt-0.5 text-[var(--ink-muted)] ${compact ? "text-xs" : "text-sm"}`}>
            {cls.start}-{cls.end} · {cls.coach} · {cls.room}
          </p>
          {!compact && (
            <p className="mt-1 text-xs text-[var(--ink-muted)]">
              {cls.booked}/{cls.capacity} booked
            </p>
          )}
        </div>
        {booked && (
          <span className="shrink-0 rounded-md bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-green-600">
            Booked
          </span>
        )}
        {bookable && !booked && onBook && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBook();
            }}
            className="shrink-0 rounded-md border border-[var(--accent)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--accent)] transition hover:bg-[var(--accent)] hover:text-white"
          >
            Book
          </button>
        )}
      </div>
    </div>
  );
}
