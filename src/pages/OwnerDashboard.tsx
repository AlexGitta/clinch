import { useState } from "react";
import {
  invoices,
  membershipBreakdown,
  ownerMembersList,
  ptRoster,
  toMinutes,
  weekDays,
  weeklyClasses,
} from "../data/demoData";
import TabBar from "../components/TabBar";
import WeeklyCalendar from "../components/WeeklyCalendar";
import PtProfileCard from "../components/PtProfileCard";
import Modal from "../components/Modal";
import type { OwnerMemberRow, OwnerTab, PtId } from "../types/demo";

const ownerTabs: { key: OwnerTab; label: string }[] = [
  { key: "schedule", label: "Schedule" },
  { key: "members", label: "Members" },
  { key: "pts", label: "PTs" },
  { key: "billing", label: "Billing" },
];

export default function OwnerDashboard({
  onOpenPt,
}: {
  onOpenPt: (ptId: PtId) => void;
}) {
  const [tab, setTab] = useState<OwnerTab>("schedule");
  const [selectedMember, setSelectedMember] = useState<OwnerMemberRow | null>(null);
  const [memberSearch, setMemberSearch] = useState("");
  const [scheduleStatsOpen, setScheduleStatsOpen] = useState(false);

  const classesByDay = weekDays.map((_, dayIndex) =>
    weeklyClasses
      .filter((item) => item.day === dayIndex)
      .sort((left, right) => toMinutes(left.start) - toMinutes(right.start)),
  );
  const occupiedStartTimes = Array.from(new Set(weeklyClasses.map((item) => item.start))).sort(
    (left, right) => toMinutes(left) - toMinutes(right),
  );

  const totalClasses = weeklyClasses.length;
  const avgOccupancy = Math.round(weeklyClasses.reduce((sum, c) => sum + (c.booked / c.capacity) * 100, 0) / totalClasses);
  const spotsRemaining = weeklyClasses.reduce((sum, c) => sum + (c.capacity - c.booked), 0);

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 py-5 md:px-8 md:py-7">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold leading-tight text-[var(--ink)] md:text-[2rem]">Southside Combat Gym</h1>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">Feb 16-22, 2026</p>
        </div>
      </div>

      <TabBar tabs={ownerTabs} active={tab} onChange={setTab} />

      {/* ── Schedule tab ────────────────────────────────────────── */}
      {tab === "schedule" && (
        <div className="mt-4">
          {/* Stats – collapsible on mobile, always visible on desktop */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setScheduleStatsOpen((o) => !o)}
              className="flex w-full items-center justify-between rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)] md:hidden"
            >
              <span>Schedule Stats</span>
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
                className={`transition-transform duration-200 ${scheduleStatsOpen ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div className={`grid gap-2 sm:grid-cols-3 ${scheduleStatsOpen ? "mt-2" : "hidden md:grid"}`}>
              <StatCard label="Total Classes This Week" value={String(totalClasses)} />
              <StatCard label="Average Occupancy" value={`${avgOccupancy}%`} />
              <StatCard label="Spots Remaining" value={String(spotsRemaining)} />
            </div>
          </div>
          <WeeklyCalendar weekDays={weekDays} classesByDay={classesByDay} occupiedStartTimes={occupiedStartTimes} />
        </div>
      )}

      {/* ── Members tab ─────────────────────────────────────────── */}
      {tab === "members" && (
        <div className="mt-4">
          <div className="grid gap-2 sm:grid-cols-3">
            <StatCard label="Active Members" value="184" />
            <StatCard label="New This Month" value="+6" />
            <StatCard label="Retention Rate" value="94%" />
          </div>

          <section className="mt-4 rounded-xl border border-[var(--line)] bg-[var(--card)] p-4">
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

          <input
            type="text"
            value={memberSearch}
            onChange={(e) => setMemberSearch(e.target.value)}
            placeholder="Search members..."
            className="mt-4 w-full rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--ink-muted)] outline-none focus:border-[var(--accent)]"
          />

          {/* Desktop table */}
          <div className="mt-4 hidden overflow-hidden rounded-xl border border-[var(--line)] md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--line)] bg-[var(--surface)]">
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">Name</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">Tier</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">Joined</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">Status</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">Last Check-in</th>
                </tr>
              </thead>
              <tbody>
                {ownerMembersList.filter((m) => {
                  if (!memberSearch.trim()) return true;
                  const q = memberSearch.toLowerCase();
                  return m.name.toLowerCase().includes(q) || m.tier.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
                }).map((m) => (
                  <tr key={m.id} className="cursor-pointer border-b border-[var(--line)] last:border-b-0 hover:bg-[var(--surface)]" onClick={() => setSelectedMember(m)}>
                    <td className="px-4 py-2.5 font-medium text-[var(--ink)]">{m.name}</td>
                    <td className="px-4 py-2.5 text-[var(--ink-muted)]">{m.tier}</td>
                    <td className="px-4 py-2.5 text-[var(--ink-muted)]">{m.joined}</td>
                    <td className="px-4 py-2.5"><StatusBadge status={m.status} /></td>
                    <td className="px-4 py-2.5 text-[var(--ink-muted)]">{m.lastCheckin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-4 grid gap-2 md:hidden">
            {ownerMembersList.filter((m) => {
              if (!memberSearch.trim()) return true;
              const q = memberSearch.toLowerCase();
              return m.name.toLowerCase().includes(q) || m.tier.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
            }).map((m) => (
              <article key={m.id} className="cursor-pointer rounded-lg border border-[var(--line)] bg-[var(--card)] p-3 hover:bg-[var(--surface)]" onClick={() => setSelectedMember(m)}>
                <div className="flex items-center justify-between">
                  <p className="font-medium text-[var(--ink)]">{m.name}</p>
                  <StatusBadge status={m.status} />
                </div>
                <p className="mt-1 text-xs text-[var(--ink-muted)]">{m.tier} · Joined {m.joined} · Last: {m.lastCheckin}</p>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* ── PTs tab ─────────────────────────────────────────────── */}
      {tab === "pts" && (
        <div className="mt-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <StatCard label="Active PTs" value="3" />
            <StatCard label="Avg Utilization" value="76%" />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {ptRoster.map((pt) => (
              <PtProfileCard key={pt.id} pt={pt} actionLabel="Open Workspace" onAction={() => onOpenPt(pt.id)} />
            ))}
          </div>
        </div>
      )}

      {/* ── Billing tab ─────────────────────────────────────────── */}
      {tab === "billing" && (
        <div className="mt-4">
          <div className="grid gap-2 sm:grid-cols-3">
            <StatCard label="MRR" value="GBP 12,480" />
            <StatCard label="Outstanding" value="9" />
            <StatCard label="Collection Rate" value="97.2%" />
          </div>

          {/* Desktop table */}
          <div className="mt-4 hidden overflow-hidden rounded-xl border border-[var(--line)] md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--line)] bg-[var(--surface)]">
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">Member</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">Amount</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">Tier</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">Date</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-[var(--line)] last:border-b-0">
                    <td className="px-4 py-2.5 font-medium text-[var(--ink)]">{inv.memberName}</td>
                    <td className="px-4 py-2.5 text-[var(--ink-muted)]">GBP {inv.amount}</td>
                    <td className="px-4 py-2.5 text-[var(--ink-muted)]">{inv.tier}</td>
                    <td className="px-4 py-2.5 text-[var(--ink-muted)]">{inv.date}</td>
                    <td className="px-4 py-2.5"><InvoiceBadge status={inv.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-4 grid gap-2 md:hidden">
            {invoices.map((inv) => (
              <article key={inv.id} className="rounded-lg border border-[var(--line)] bg-[var(--card)] p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-[var(--ink)]">{inv.memberName}</p>
                  <InvoiceBadge status={inv.status} />
                </div>
                <p className="mt-1 text-xs text-[var(--ink-muted)]">GBP {inv.amount} · {inv.tier} · {inv.date}</p>
              </article>
            ))}
          </div>
        </div>
      )}
      <Modal
        open={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        title="Member Details"
        actions={
          <button type="button" onClick={() => setSelectedMember(null)} className="rounded-md border border-[var(--line)] px-4 py-2 text-xs font-semibold text-[var(--ink)]">Close</button>
        }
      >
        {selectedMember && (() => {
          const initials = selectedMember.name.split(" ").map((w) => w[0]).join("").toUpperCase();
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-base font-bold text-white">{initials}</div>
                <div>
                  <p className="text-base font-semibold text-[var(--ink)]">{selectedMember.name}</p>
                  <p className="text-xs text-[var(--ink-muted)]">{selectedMember.email}</p>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">Tier</p>
                  <p className="mt-0.5 text-sm font-semibold text-[var(--ink)]">{selectedMember.tier}</p>
                </div>
                <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">Monthly Fee</p>
                  <p className="mt-0.5 text-sm font-semibold text-[var(--ink)]">GBP {selectedMember.monthlyFee}</p>
                </div>
                <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">Status</p>
                  <p className="mt-0.5"><StatusBadge status={selectedMember.status} /></p>
                </div>
                <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">Joined</p>
                  <p className="mt-0.5 text-sm font-semibold text-[var(--ink)]">{selectedMember.joined}</p>
                </div>
                <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 sm:col-span-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">Last Check-in</p>
                  <p className="mt-0.5 text-sm font-semibold text-[var(--ink)]">{selectedMember.lastCheckin}</p>
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="demo-stat-card p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">{label}</p>
      <p className="mt-1 text-xl font-semibold text-[var(--ink)]">{value}</p>
    </article>
  );
}

function StatusBadge({ status }: { status: "active" | "overdue" | "cancelled" }) {
  const styles = {
    active: "bg-green-500/10 text-green-600",
    overdue: "bg-amber-500/10 text-amber-600",
    cancelled: "bg-neutral-500/10 text-neutral-500",
  };
  return (
    <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] ${styles[status]}`}>
      {status}
    </span>
  );
}

function InvoiceBadge({ status }: { status: "paid" | "pending" | "overdue" | "failed" }) {
  const styles = {
    paid: "bg-green-500/10 text-green-600",
    pending: "bg-yellow-500/10 text-yellow-600",
    overdue: "bg-red-500/10 text-red-600",
    failed: "bg-red-500/10 text-red-600",
  };
  return (
    <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] ${styles[status]}`}>
      {status}
    </span>
  );
}
