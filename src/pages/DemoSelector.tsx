import type { AppView } from "../types/demo";

export default function DemoSelector({ onNavigate }: { onNavigate: (view: AppView) => void }) {
  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 py-8 md:px-8 md:py-12">
      <section className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink-muted)]">Demo Navigation</p>
        <h1 className="mt-2 max-w-[18ch] text-3xl font-semibold leading-tight text-[var(--ink)] md:text-4xl">
          Choose a workspace to preview
        </h1>
        <p className="mt-3 text-sm text-[var(--ink-muted)] md:text-base">
          Explore the platform from three perspectives: gym owner, personal trainer, or member.
        </p>
      </section>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <button type="button" onClick={() => onNavigate("demo-owner")} className="demo-surface-card flex h-full w-full flex-col text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">Owner Workspace</p>
          <h2 className="mt-2 text-2xl font-semibold leading-tight text-[var(--ink)]">Gym Operations Dashboard</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">Weekly classes, membership mix, payment health, and PT roster managed from one reliable view.</p>
          <div className="mt-5 inline-flex w-fit items-center rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--ink)]">
            Open owner demo
          </div>
        </button>

        <button type="button" onClick={() => onNavigate("demo-pt")} className="demo-surface-card flex h-full w-full flex-col text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">PT Workspace</p>
          <h2 className="mt-2 text-2xl font-semibold leading-tight text-[var(--ink)]">Trainer Dashboard</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">Schedule, client list, session management, and profile — everything a coach needs in one place.</p>
          <div className="mt-5 inline-flex w-fit items-center rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--ink)]">
            Open PT demo
          </div>
        </button>

        <button type="button" onClick={() => onNavigate("demo-member")} className="demo-surface-card flex h-full w-full flex-col text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">Member Portal</p>
          <h2 className="mt-2 text-2xl font-semibold leading-tight text-[var(--ink)]">Member Experience</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">Book classes, manage your membership, and connect with trainers from a clean member interface.</p>
          <div className="mt-5 inline-flex w-fit items-center rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--ink)]">
            Open member demo
          </div>
        </button>
      </div>
    </main>
  );
}
