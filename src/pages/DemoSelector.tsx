import type { AppView } from "../types/demo";

export default function DemoSelector({ onNavigate }: { onNavigate: (view: AppView) => void }) {
  return (
    <main className="mx-auto w-full max-w-[1120px] px-5 py-8 md:px-8 md:py-12">
      <section className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink-muted)]">Demo Navigation</p>
        <h1 className="mt-2 max-w-[18ch] text-3xl font-semibold leading-tight text-[var(--ink)] md:text-4xl">
          Choose a workspace to preview
        </h1>
        <p className="mt-3 max-w-[65ch] text-sm text-[var(--ink-muted)] md:text-base">
          Focused on operational clarity: weekly schedule, occupancy, revenue, and coach utilization in a single SaaS-style interface.
        </p>
      </section>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <button type="button" onClick={() => onNavigate("demo-owner")} className="demo-surface-card flex h-full w-full flex-col text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">Owner Workspace</p>
          <h2 className="mt-2 text-2xl font-semibold leading-tight text-[var(--ink)]">Gym Operations Dashboard</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">Weekly classes, membership mix, payment health, and PT roster managed from one reliable view.</p>
          <div className="mt-5 inline-flex w-fit items-center rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--ink)]">
            Open owner demo
          </div>
        </button>

        <div className="demo-surface-card bg-[var(--surface)]/60">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--ink-muted)]">Member Workspace</p>
          <h2 className="mt-2 text-2xl font-semibold leading-tight text-[var(--ink)]">Member Portal Preview</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">Class booking and account management screens are queued for the next demo iteration.</p>
          <p className="mt-5 text-xs font-medium text-[var(--ink-muted)]">Status: in product design</p>
        </div>
      </div>
    </main>
  );
}

