import { useState } from "react";
import type { AppView, PtId } from "../types/demo";
import Modal from "./Modal";

const roles: { key: AppView; label: string; description: string }[] = [
  { key: "demo-owner", label: "Owner", description: "Manage members, schedules, PTs, and billing" },
  { key: "demo-pt", label: "PT", description: "View your clients, sessions, and availability" },
  { key: "demo-member", label: "Member", description: "Book classes, manage membership, and find trainers" },
];

export default function FloatingRoleSwitcher({
  current,
  onSwitch,
  lastPtId,
}: {
  current: AppView;
  onSwitch: (view: AppView, options?: { ptId?: PtId }) => void;
  lastPtId?: PtId;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 rounded-lg border border-[var(--line)] bg-[var(--card)] px-4 py-2.5 text-xs font-semibold text-[var(--ink)] shadow-lg transition hover:bg-[var(--surface-strong)]"
      >
        Change View
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Switch View">
        <p className="text-sm text-[var(--ink-muted)]">
          Explore the platform from different perspectives — each view shows a tailored experience.
        </p>
        <div className="mt-4 grid gap-2">
          {roles.map((role) => (
            <button
              key={role.key}
              type="button"
              onClick={() => {
                if (role.key === "demo-pt") {
                  onSwitch(role.key, { ptId: lastPtId });
                } else {
                  onSwitch(role.key);
                }
                setOpen(false);
              }}
              className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                current === role.key
                  ? "border-[var(--accent)] bg-[var(--accent)]/5"
                  : "border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface-strong)]"
              }`}
            >
              <p className={`text-sm font-semibold ${current === role.key ? "text-[var(--accent)]" : "text-[var(--ink)]"}`}>{role.label}</p>
              <p className="mt-0.5 text-xs text-[var(--ink-muted)]">{role.description}</p>
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
}
