import type { PtProfile } from "../types/demo";

export default function PtProfileCard({
  pt,
  actionLabel,
  onAction,
}: {
  pt: PtProfile;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const initials = pt.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <article className="rounded-xl border border-[var(--line)] bg-[var(--card)] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-white">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-base font-semibold text-[var(--ink)]">{pt.name}</p>
          <p className="text-xs text-[var(--ink-muted)]">{pt.style} · {pt.location}</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">{pt.bio}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {pt.focus.map((tag) => (
          <span key={tag} className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-2 py-0.5 text-[10px] font-medium text-[var(--ink)]">
            {tag}
          </span>
        ))}
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex items-center rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)] transition hover:border-[var(--ink-muted)]"
        >
          {actionLabel}
        </button>
      )}
    </article>
  );
}
