import { useState } from "react";
import { ptClients, ptSessions, toMinutes, weekDays, weeklyClasses } from "../data/demoData";
import WeeklyCalendar from "../components/WeeklyCalendar";
import TabBar from "../components/TabBar";
import type { PtProfile } from "../types/demo";

type PtTab = "schedule" | "clients" | "profile";

const ptTabs: { key: PtTab; label: string }[] = [
  { key: "schedule", label: "Schedule" },
  { key: "clients", label: "Clients" },
  { key: "profile", label: "Profile" },
];

export default function PtWorkspace({ pt }: { pt: PtProfile }) {
  const initials = pt.name.split(" ").map((w) => w[0]).join("").toUpperCase();
  const [activeTab, setActiveTab] = useState<PtTab>("schedule");
  const [statsOpen, setStatsOpen] = useState(false);

  const ptClassesByDay = weekDays.map((_, dayIndex) =>
    weeklyClasses
      .filter((item) => item.day === dayIndex && item.coach === pt.coach)
      .sort((left, right) => toMinutes(left.start) - toMinutes(right.start)),
  );
  const ptOccupiedTimes = Array.from(
    new Set(weeklyClasses.filter((c) => c.coach === pt.coach).map((c) => c.start)),
  ).sort((a, b) => toMinutes(a) - toMinutes(b));

  const mySessions = ptSessions.filter((s) => s.ptId === pt.id);
  const myClients = ptClients[pt.id] ?? [];

  const revenueThisWeek = mySessions.reduce((sum, s) => sum + s.price, 0);

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 py-5 md:px-8 md:py-7">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-white">
          {initials}
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-[var(--ink)] md:text-[2rem]">{pt.name}</h1>
          <p className="text-sm text-[var(--ink-muted)]">{pt.style} · {pt.location}</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="mt-5">
        <TabBar tabs={ptTabs} active={activeTab} onChange={setActiveTab} />
      </div>

      {/* Schedule tab */}
      {activeTab === "schedule" && (
        <div className="mt-4 space-y-4">
          {/* Stats – collapsible on mobile, always visible on desktop */}
          <div>
            <button
              type="button"
              onClick={() => setStatsOpen((o) => !o)}
              className="flex w-full items-center justify-between rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)] md:hidden"
            >
              <span>My Stats</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${statsOpen ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div className={`grid grid-cols-2 gap-2 sm:grid-cols-4 ${statsOpen ? "mt-2" : "hidden md:grid"}`}>
              {pt.stats.map((metric) => (
                <article key={`${pt.id}-${metric.label}`} className="demo-stat-card p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">{metric.label}</p>
                  <p className="mt-1 text-xl font-semibold text-[var(--ink)]">{metric.value}</p>
                </article>
              ))}
              <article className="demo-stat-card p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">Revenue This Week</p>
                <p className="mt-1 text-xl font-semibold text-[var(--ink)]">GBP {revenueThisWeek}</p>
              </article>
            </div>
          </div>

          {/* My Schedule */}
          <section className="rounded-xl border border-[var(--line)] bg-[var(--card)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">My Schedule</p>
            <p className="mt-1 text-sm text-[var(--ink-muted)]">Classes you coach this week</p>
            <div className="mt-3">
              <WeeklyCalendar weekDays={weekDays} classesByDay={ptClassesByDay} occupiedStartTimes={ptOccupiedTimes} />
            </div>
            {mySessions.length > 0 && (
              <>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--ink-muted)]">PT Sessions</p>
                <div className="mt-2 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                  {mySessions.map((session) => {
                    const dayLabel = weekDays[session.day]?.long ?? "";
                    return (
                      <article
                        key={session.id}
                        className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-2"
                        style={{ borderLeftWidth: 3, borderLeftColor: "var(--with-accent)" }}
                      >
                        <p className="text-sm font-semibold text-[var(--ink)]">{session.type}</p>
                        <p className="text-xs text-[var(--ink-muted)]">{dayLabel} · {session.start}-{session.end}</p>
                        <p className="mt-1 text-xs text-[var(--ink-muted)]">{session.spotsLeft} spot{session.spotsLeft !== 1 ? "s" : ""} left · GBP {session.price}</p>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </section>
        </div>
      )}

      {/* Clients tab */}
      {activeTab === "clients" && (
        <section className="mt-4 rounded-xl border border-[var(--line)] bg-[var(--card)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">Client List</p>
          {myClients.length === 0 ? (
            <p className="mt-2 text-sm text-[var(--ink-muted)]">No clients yet.</p>
          ) : (
            <>
              {/* Desktop table */}
              <div className="mt-3 hidden overflow-hidden rounded-lg border border-[var(--line)] md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--line)] bg-[var(--surface)]">
                      <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">Client</th>
                      <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">Next Session</th>
                      <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">Package</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myClients.map((client) => (
                      <tr key={client.name} className="border-b border-[var(--line)] last:border-b-0">
                        <td className="px-4 py-2 font-medium text-[var(--ink)]">{client.name}</td>
                        <td className="px-4 py-2 text-[var(--ink-muted)]">{client.nextSession}</td>
                        <td className="px-4 py-2 text-[var(--ink-muted)]">{client.package}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile cards */}
              <div className="mt-3 grid gap-1.5 md:hidden">
                {myClients.map((client) => (
                  <article key={client.name} className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-2">
                    <p className="text-sm font-medium text-[var(--ink)]">{client.name}</p>
                    <p className="text-xs text-[var(--ink-muted)]">Next: {client.nextSession} · {client.package}</p>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* Profile tab */}
      {activeTab === "profile" && (
        <section className="mt-4 rounded-xl border border-[var(--line)] bg-[var(--card)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">Profile</p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">{pt.bio}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {pt.focus.map((item) => (
              <span key={`${pt.id}-${item}`} className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-2 py-1 text-xs font-medium text-[var(--ink)]">
                {item}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs text-[var(--ink-muted)]">{pt.location}</p>
        </section>
      )}
    </main>
  );
}
