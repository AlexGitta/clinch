import type { PtId, PtProfile, WeeklyClass } from "../types/demo";

type WeekDay = { short: string; long: string; date: string };

export default function PtDashboard({
  pt,
  weekDays,
  weeklyClasses,
  ptRoster,
  toMinutes,
  onBack,
  onOpenPt,
}: {
  pt: PtProfile;
  weekDays: WeekDay[];
  weeklyClasses: WeeklyClass[];
  ptRoster: PtProfile[];
  toMinutes: (time: string) => number;
  onBack: () => void;
  onOpenPt: (ptId: PtId) => void;
}) {
  const coachedClassesByDay = weekDays
    .map((day, dayIndex) => ({
      day,
      classes: weeklyClasses
        .filter((item) => item.day === dayIndex && item.coach === pt.coach)
        .sort((left, right) => toMinutes(left.start) - toMinutes(right.start)),
    }))
    .filter((entry) => entry.classes.length > 0);

  return (
    <main className="mx-auto w-full max-w-[1100px] px-4 py-5 md:px-8 md:py-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">PT Workspace</p>
          <h1 className="mt-1 text-2xl font-semibold text-[var(--ink)] md:text-[2rem]">{pt.name}</h1>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">{pt.style} · {pt.location}</p>
        </div>
        <button type="button" onClick={onBack} className="inline-flex items-center rounded-md border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-xs font-semibold text-[var(--ink)]">
          Back to owner dashboard
        </button>
      </div>

      <section className="mt-3 grid gap-2 sm:grid-cols-3">
        {pt.stats.map((metric) => (
          <article key={`${pt.id}-${metric.label}`} className="demo-stat-card p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">{metric.label}</p>
            <p className="mt-1 text-xl font-semibold text-[var(--ink)]">{metric.value}</p>
          </article>
        ))}
      </section>

      <section className="mt-3 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-xl border border-[var(--line)] bg-[var(--card)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">Profile Summary</p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">{pt.bio}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {pt.focus.map((item) => (
              <span key={`${pt.id}-${item}`} className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-2 py-1 text-xs font-medium text-[var(--ink)]">
                {item}
              </span>
            ))}
          </div>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">Upcoming Availability</p>
          <div className="mt-2 space-y-1.5">
            {pt.upcoming.map((slot) => (
              <p key={`${pt.id}-${slot}`} className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink-muted)]">
                {slot}
              </p>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-[var(--line)] bg-[var(--card)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">Weekly Class Coverage</p>
          <div className="mt-3 space-y-2">
            {coachedClassesByDay.map((entry) => (
              <div key={`${pt.id}-${entry.day.short}`} className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">{entry.day.long}</p>
                <div className="mt-2 space-y-1.5">
                  {entry.classes.map((item) => (
                    <div key={item.id} className="rounded-md border border-[var(--line)] bg-[var(--card)] px-2 py-1.5">
                      <p className="text-sm font-semibold text-[var(--ink)]">{item.title}</p>
                      <p className="text-xs text-[var(--ink-muted)]">{item.start}-{item.end} · {item.room}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-3 rounded-xl border border-[var(--line)] bg-[var(--card)] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">Other PT Workspaces</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {ptRoster.map((item) => (
            <button
              key={`pt-switch-${item.id}`}
              type="button"
              onClick={() => onOpenPt(item.id)}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                item.id === pt.id
                  ? "border-[var(--accent)] bg-[var(--surface)] text-[var(--ink)]"
                  : "border-[var(--line)] bg-[var(--card)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

