import type { AppView, PtId, PtProfile, WeeklyClass } from "../types/demo";

type OwnerMetric = { label: string; value: string; note: string };
type MembershipSlice = { name: string; count: number; percent: number };
type WeekDay = { short: string; long: string; date: string };

export default function OwnerDashboard({
  onNavigate,
  onOpenPt,
  ownerMetrics,
  membershipBreakdown,
  weekDays,
  weeklyClasses,
  ptRoster,
  toMinutes,
}: {
  onNavigate: (view: AppView) => void;
  onOpenPt: (ptId: PtId) => void;
  ownerMetrics: OwnerMetric[];
  membershipBreakdown: MembershipSlice[];
  weekDays: WeekDay[];
  weeklyClasses: WeeklyClass[];
  ptRoster: PtProfile[];
  toMinutes: (time: string) => number;
}) {
  const classesByDay = weekDays.map((_, dayIndex) =>
    weeklyClasses
      .filter((item) => item.day === dayIndex)
      .sort((left, right) => toMinutes(left.start) - toMinutes(right.start)),
  );
  const occupiedStartTimes = Array.from(new Set(weeklyClasses.map((item) => item.start))).sort(
    (left, right) => toMinutes(left) - toMinutes(right),
  );

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-5 md:px-8 md:py-7">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold leading-tight text-[var(--ink)] md:text-[2rem]">Weekly operations overview</h1>
        <button type="button" onClick={() => onNavigate("demo-select")} className="inline-flex items-center rounded-md border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-xs font-semibold text-[var(--ink)]">
          Back to view select
        </button>
      </div>

      <details className="demo-mobile-stats mt-3 rounded-xl border border-[var(--line)] bg-[var(--card)] p-3 md:hidden">
        <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--ink)] marker:content-none">
          <span className="inline-flex items-center gap-2">
            Key stats
            <span className="text-xs font-medium text-[var(--ink-muted)]">Tap to open</span>
          </span>
        </summary>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {ownerMetrics.map((metric) => (
            <article key={metric.label} className="demo-stat-card p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">{metric.label}</p>
              <p className="mt-1 text-lg font-semibold text-[var(--ink)]">{metric.value}</p>
              <p className="mt-1 text-[11px] text-[var(--ink-muted)]">{metric.note}</p>
            </article>
          ))}
        </div>
      </details>

      <section className="mt-3 hidden md:block">
        <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-6">
          {ownerMetrics.map((metric) => (
            <article key={metric.label} className="demo-stat-card p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">{metric.label}</p>
              <p className="mt-1 text-xl font-semibold leading-tight text-[var(--ink)]">{metric.value}</p>
              <p className="mt-1 text-xs text-[var(--ink-muted)]">{metric.note}</p>
            </article>
          ))}
        </div>
      </section>

      <div id="demo-calendar" className="mt-3 grid gap-3 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-xl border border-[var(--line)] bg-[var(--card)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">Weekly Class Calendar</p>
              <p className="mt-1 text-sm text-[var(--ink-muted)]">Template week - repeats each week for core timetable planning.</p>
            </div>
            <div className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--ink-muted)]">Feb 16-22</div>
          </div>

          <div className="mt-3 grid gap-2 md:hidden">
            {weekDays.map((day, dayIndex) => {
              const dayClasses = classesByDay[dayIndex] ?? [];
              if (dayClasses.length === 0) return null;
              return (
                <article key={`mobile-${day.short}`} className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">{day.long}</p>
                    <p className="text-xs text-[var(--ink-muted)]">Feb {day.date}</p>
                  </div>
                  <div className="mt-2 space-y-1.5">
                    {dayClasses.map((item) => (
                      <div key={`mobile-${item.id}`} className="rounded-md border border-[var(--line)] bg-[var(--card)] px-2 py-1.5">
                        <p className="text-sm font-semibold leading-tight text-[var(--ink)]">{item.title}</p>
                        <p className="mt-0.5 text-xs text-[var(--ink-muted)]">{item.start}-{item.end} · {item.coach}</p>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="demo-calendar-shell mt-3 hidden md:block">
            <table className="demo-calendar-table">
              <thead>
                <tr>
                  <th className="demo-calendar-head-time">Time</th>
                  {weekDays.map((day) => (
                    <th key={day.short} className="demo-calendar-head-day">
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">{day.short}</p>
                      <p className="mt-1 text-xs font-semibold text-[var(--ink)]">Feb {day.date}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {occupiedStartTimes.map((time) => (
                  <tr key={time}>
                    <th className="demo-calendar-time-cell">{time}</th>
                    {weekDays.map((day, dayIndex) => {
                      const entries = (classesByDay[dayIndex] ?? []).filter((item) => item.start === time);
                      return (
                        <td key={`${day.short}-${time}`} className="demo-calendar-slot-cell">
                          {entries.map((item) => (
                            <article key={item.id} className="demo-calendar-event">
                              <p className="demo-calendar-event-title">{item.title}</p>
                              <p className="demo-calendar-event-meta">{item.start}-{item.end}</p>
                              <p className="demo-calendar-event-status">{item.coach}</p>
                            </article>
                          ))}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div id="demo-insights" className="space-y-3">
          <section className="rounded-xl border border-[var(--line)] bg-[var(--card)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">Membership Mix</p>
            <div className="mt-3 space-y-3">
              {membershipBreakdown.map((item) => (
                <div key={item.name}>
                  <div className="mb-1 flex items-center justify-between text-xs text-[var(--ink-muted)]">
                    <span className="font-semibold text-[var(--ink)]">{item.name}</span>
                    <span>{item.count} members</span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--surface-strong)]">
                    <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-[var(--line)] bg-[var(--card)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">PT Coverage</p>
            <div className="mt-3 space-y-2 text-xs text-[var(--ink-muted)]">
              {ptRoster.map((pt) => (
                <button
                  key={`coverage-${pt.id}`}
                  type="button"
                  onClick={() => onOpenPt(pt.id)}
                  className="w-full rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-left transition hover:border-[var(--ink-muted)]"
                >
                  <p className="font-semibold text-[var(--ink)]">{pt.name}</p>
                  <p className="mt-0.5">{pt.upcoming[0]}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.07em] text-[var(--ink-muted)]">Open PT workspace</p>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

