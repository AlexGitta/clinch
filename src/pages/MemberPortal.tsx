import { useEffect, useState } from "react";
import {
  memberProfile,
  ptRoster,
  ptSessions,
  tierDefinitions,
  toMinutes,
  weekDays,
  weeklyClasses,
} from "../data/demoData";
import TabBar from "../components/TabBar";
import WeeklyCalendar from "../components/WeeklyCalendar";
import PtProfileCard from "../components/PtProfileCard";
import Modal from "../components/Modal";
import { useToast } from "../components/Toast";
import type { MemberTab, PtSession, WeeklyClass } from "../types/demo";

const memberTabs: { key: MemberTab; label: string }[] = [
  { key: "schedule", label: "Schedule" },
  { key: "membership", label: "Membership" },
  { key: "trainers", label: "Trainers" },
];

export default function MemberPortal() {
  const [tab, setTab] = useState<MemberTab>("schedule");
  const [bookedClassIds, setBookedClassIds] = useState<Set<string>>(new Set());
  const [bookedPtSessionIds, setBookedPtSessionIds] = useState<Set<string>>(new Set());
  const [modalClass, setModalClass] = useState<WeeklyClass | null>(null);
  const [modalSession, setModalSession] = useState<PtSession | null>(null);
  const [expandedPtId, setExpandedPtId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingsOpen, setBookingsOpen] = useState(false);
  const { show } = useToast();

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); }, [tab]);

  const classesByDay = weekDays.map((_, dayIndex) =>
    weeklyClasses
      .filter((item) => item.day === dayIndex)
      .sort((left, right) => toMinutes(left.start) - toMinutes(right.start)),
  );
  const occupiedStartTimes = Array.from(new Set(weeklyClasses.map((item) => item.start))).sort(
    (left, right) => toMinutes(left) - toMinutes(right),
  );

  const bookedClasses = weeklyClasses.filter((c) => bookedClassIds.has(c.id));

  const confirmClassBooking = () => {
    if (!modalClass) return;
    setBookedClassIds((prev) => new Set(prev).add(modalClass.id));
    const dayLabel = weekDays[modalClass.day]?.long ?? "";
    show(`Booked: ${modalClass.title} — ${dayLabel} ${modalClass.start}`);
    setModalClass(null);
  };

  const cancelClassBooking = (classId: string) => {
    setBookedClassIds((prev) => {
      const next = new Set(prev);
      next.delete(classId);
      return next;
    });
    const cls = weeklyClasses.find((c) => c.id === classId);
    if (cls) show(`Cancelled: ${cls.title}`, "info");
  };

  const confirmSessionBooking = () => {
    if (!modalSession) return;
    setBookedPtSessionIds((prev) => new Set(prev).add(modalSession.id));
    const pt = ptRoster.find((p) => p.id === modalSession.ptId);
    const dayLabel = weekDays[modalSession.day]?.long ?? "";
    show(`Booked: ${modalSession.type} with ${pt?.name ?? "PT"} — ${dayLabel} ${modalSession.start}`);
    setModalSession(null);
  };

  return (
    <>
      <main className="mx-auto w-full max-w-[1280px] px-4 py-5 md:px-8 md:py-7">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold leading-tight text-[var(--ink)] md:text-[2rem]">Welcome back, {memberProfile.name.split(" ")[0]}</h1>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">{memberProfile.tier} member</p>
        </div>

        <TabBar tabs={memberTabs} active={tab} onChange={setTab} />

        {/* ── Schedule tab ────────────────────────────────────────── */}
        {tab === "schedule" && (
          <div className="mt-4">
            {bookedClasses.length > 0 && (
              <section className="mb-4">
                {/* Mobile: collapsible; Desktop: always expanded */}
                <button
                  type="button"
                  onClick={() => setBookingsOpen((o) => !o)}
                  className="flex w-full items-center justify-between rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--accent)] md:hidden"
                >
                  <span>My Bookings ({bookedClasses.length})</span>
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
                    className={`transition-transform duration-200 ${bookingsOpen ? "rotate-180" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <p className="hidden text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)] md:block">My Bookings</p>
                {/* Mobile: animated collapse */}
                <div className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out md:hidden ${bookingsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="min-h-0">
                    <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                      {bookedClasses.map((cls) => {
                        const dayLabel = weekDays[cls.day]?.long ?? "";
                        return (
                          <div key={`booked-${cls.id}`} className="flex items-center justify-between gap-2 rounded-md border border-green-500/30 bg-green-500/5 px-3 py-2">
                            <div>
                              <p className="text-sm font-semibold text-[var(--ink)]">{cls.title}</p>
                              <p className="text-xs text-[var(--ink-muted)]">{dayLabel} · {cls.start}-{cls.end}</p>
                            </div>
                            <button type="button" onClick={() => cancelClassBooking(cls.id)} className="text-[10px] font-semibold uppercase tracking-[0.06em] text-red-500 hover:text-red-600">Cancel</button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                {/* Desktop: always visible */}
                <div className="mt-2 hidden gap-1.5 sm:grid-cols-2 md:grid">
                  {bookedClasses.map((cls) => {
                    const dayLabel = weekDays[cls.day]?.long ?? "";
                    return (
                      <div key={`booked-${cls.id}`} className="flex items-center justify-between gap-2 rounded-md border border-green-500/30 bg-green-500/5 px-3 py-2">
                        <div>
                          <p className="text-sm font-semibold text-[var(--ink)]">{cls.title}</p>
                          <p className="text-xs text-[var(--ink-muted)]">{dayLabel} · {cls.start}-{cls.end}</p>
                        </div>
                        <button type="button" onClick={() => cancelClassBooking(cls.id)} className="text-[10px] font-semibold uppercase tracking-[0.06em] text-red-500 hover:text-red-600">Cancel</button>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
            <WeeklyCalendar
              weekDays={weekDays}
              classesByDay={classesByDay}
              occupiedStartTimes={occupiedStartTimes}
              onClassClick={(cls) => !bookedClassIds.has(cls.id) && setModalClass(cls)}
              bookedIds={bookedClassIds}
            />
          </div>
        )}

        {/* ── Membership tab ──────────────────────────────────────── */}
        {tab === "membership" && (
          <div className="mt-4">
            <section className="rounded-xl border border-[var(--line)] bg-[var(--card)] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-white">
                  {memberProfile.name.split(" ").map((w) => w[0]).join("").toUpperCase()}
                </div>
                <div>
                  <p className="text-base font-semibold text-[var(--ink)]">{memberProfile.name}</p>
                  <p className="text-xs text-[var(--ink-muted)]">{memberProfile.email}</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <ProfileStat label="Tier" value={memberProfile.tier} />
                <ProfileStat label="Monthly Fee" value={`GBP ${memberProfile.monthlyFee}`} />
                <ProfileStat label="Next Billing" value={memberProfile.nextBilling} />
                <ProfileStat label="7-Day Check-ins" value={String(memberProfile.checkins7d)} />
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-[var(--ink-muted)]">
                  <span>Classes this month</span>
                  <span className="font-semibold text-[var(--ink)]">
                    {memberProfile.classesThisMonth}{memberProfile.classesAllowed === "Unlimited" ? " (Unlimited)" : ` / ${memberProfile.classesAllowed}`}
                  </span>
                </div>
                {memberProfile.classesAllowed !== "Unlimited" && (
                  <div className="mt-1.5 h-2 rounded-full bg-[var(--surface-strong)]">
                    <div
                      className="h-full rounded-full bg-[var(--accent)]"
                      style={{ width: `${Math.min(100, (memberProfile.classesThisMonth / (memberProfile.classesAllowed as number)) * 100)}%` }}
                    />
                  </div>
                )}
              </div>
            </section>

            <section className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">Membership Tiers</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {tierDefinitions.map((tier) => (
                  <article
                    key={tier.name}
                    className={`rounded-xl border p-4 ${
                      tier.name === memberProfile.tier
                        ? "border-[var(--accent)] bg-[var(--accent)]/5"
                        : "border-[var(--line)] bg-[var(--card)]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-base font-semibold text-[var(--ink)]">{tier.name}</p>
                      {tier.name === memberProfile.tier && (
                        <span className="rounded-md bg-[var(--accent)]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">Current</span>
                      )}
                    </div>
                    <p className="mt-1 text-lg font-semibold text-[var(--ink)]">GBP {tier.price}<span className="text-sm font-normal text-[var(--ink-muted)]">/mo</span></p>
                    <p className="mt-2 text-sm text-[var(--ink-muted)]">{tier.description}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ── Trainers tab ────────────────────────────────────────── */}
        {tab === "trainers" && (
          <div className="mt-4 grid gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search trainers..."
              className="w-full rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-base text-[var(--ink)] placeholder:text-[var(--ink-muted)] outline-none focus:border-[var(--accent)] md:text-sm"
            />
            {ptRoster.filter((pt) => {
              if (!searchQuery.trim()) return true;
              const q = searchQuery.toLowerCase();
              return (
                pt.name.toLowerCase().includes(q) ||
                pt.style.toLowerCase().includes(q) ||
                pt.focus.some((f) => f.toLowerCase().includes(q))
              );
            }).length === 0 ? (
              <p className="py-8 text-center text-sm text-[var(--ink-muted)]">No trainers found</p>
            ) : (
            ptRoster.filter((pt) => {
              if (!searchQuery.trim()) return true;
              const q = searchQuery.toLowerCase();
              return (
                pt.name.toLowerCase().includes(q) ||
                pt.style.toLowerCase().includes(q) ||
                pt.focus.some((f) => f.toLowerCase().includes(q))
              );
            }).map((pt) => {
              const sessions = ptSessions.filter((s) => s.ptId === pt.id);
              const isExpanded = expandedPtId === pt.id;
              return (
                <div key={pt.id}>
                  <PtProfileCard
                    pt={pt}
                    actionLabel={isExpanded ? "Hide Sessions" : "View Available Sessions"}
                    onAction={() => setExpandedPtId(isExpanded ? null : pt.id)}
                  />
                  {isExpanded && sessions.length > 0 && (
                    <div className="mt-2 grid gap-1.5 pl-0 sm:grid-cols-2 lg:grid-cols-3">
                      {sessions.map((session) => {
                        const dayLabel = weekDays[session.day]?.long ?? "";
                        const isBooked = bookedPtSessionIds.has(session.id);
                        return (
                          <article key={session.id} className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-semibold text-[var(--ink)]">{session.type}</p>
                                <p className="text-xs text-[var(--ink-muted)]">{dayLabel} Feb {session.date} · {session.start}-{session.end}</p>
                                <p className="mt-1 text-xs text-[var(--ink-muted)]">GBP {session.price} · {session.spotsLeft} spot{session.spotsLeft !== 1 ? "s" : ""} left</p>
                              </div>
                              {isBooked ? (
                                <span className="shrink-0 rounded-md bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-green-600">Booked</span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setModalSession(session)}
                                  className="shrink-0 rounded-md border border-[var(--accent)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--accent)] transition hover:bg-[var(--accent)] hover:text-white"
                                >
                                  Book
                                </button>
                              )}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }))}
          </div>
        )}
      </main>

      {/* ── Class booking modal ───────────────────────────────────── */}
      <Modal
        open={!!modalClass}
        onClose={() => setModalClass(null)}
        title="Confirm Booking"
        actions={
          <>
            <button type="button" onClick={() => setModalClass(null)} className="rounded-md border border-[var(--line)] px-4 py-2 text-xs font-semibold text-[var(--ink)]">Cancel</button>
            <button type="button" onClick={confirmClassBooking} className="rounded-md bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110">Confirm Booking</button>
          </>
        }
      >
        {modalClass && (
          <div className="space-y-2 text-sm text-[var(--ink-muted)]">
            <p className="text-base font-semibold text-[var(--ink)]">{modalClass.title}</p>
            <p>{weekDays[modalClass.day]?.long} · {modalClass.start}-{modalClass.end}</p>
            <p>{modalClass.coach} · {modalClass.room}</p>
            <p>{modalClass.booked}/{modalClass.capacity} booked</p>
          </div>
        )}
      </Modal>

      {/* ── PT session booking modal ──────────────────────────────── */}
      <Modal
        open={!!modalSession}
        onClose={() => setModalSession(null)}
        title="Book PT Session"
        actions={
          <>
            <button type="button" onClick={() => setModalSession(null)} className="rounded-md border border-[var(--line)] px-4 py-2 text-xs font-semibold text-[var(--ink)]">Cancel</button>
            <button type="button" onClick={confirmSessionBooking} className="rounded-md bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110">Confirm Booking</button>
          </>
        }
      >
        {modalSession && (() => {
          const pt = ptRoster.find((p) => p.id === modalSession.ptId);
          const dayLabel = weekDays[modalSession.day]?.long ?? "";
          return (
            <div className="space-y-2 text-sm text-[var(--ink-muted)]">
              <p className="text-base font-semibold text-[var(--ink)]">{modalSession.type} with {pt?.name ?? "PT"}</p>
              <p>{dayLabel} Feb {modalSession.date} · {modalSession.start}-{modalSession.end}</p>
              <p>GBP {modalSession.price} · {modalSession.spotsLeft} spot{modalSession.spotsLeft !== 1 ? "s" : ""} left</p>
            </div>
          );
        })()}
      </Modal>
    </>
  );
}

function ProfileStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-[var(--ink)]">{value}</p>
    </div>
  );
}
