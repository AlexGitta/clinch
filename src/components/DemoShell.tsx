import type { ReactNode } from "react";
import type { AppView, PtId } from "../types/demo";
import FloatingRoleSwitcher from "./FloatingRoleSwitcher";
import { ToastProvider } from "./Toast";

export default function DemoShell({
  theme,
  view,
  onToggleTheme,
  onNavigate,
  lastPtId,
  children,
}: {
  theme: "light" | "dark";
  view: AppView;
  onToggleTheme: () => void;
  onNavigate: (view: AppView, options?: { ptId?: PtId }) => void;
  lastPtId?: PtId;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--surface)] text-[var(--ink)]">
      <header className="border-b border-[var(--line)] bg-[var(--surface)]/95">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-4 py-5 md:px-8">
          <button type="button" onClick={() => onNavigate("landing")} className="display text-[2rem] tracking-[0.11em] text-[var(--ink)]">
            CLINCH
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--line)] bg-[var(--card)] text-[0.95rem] text-[var(--ink)] transition hover:bg-[var(--surface-strong)]"
              onClick={onToggleTheme}
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? "\u2726" : "\u263E"}
            </button>
          </div>
        </div>
      </header>
      <ToastProvider>
        {children}
        <FloatingRoleSwitcher current={view} onSwitch={onNavigate} lastPtId={lastPtId} />
      </ToastProvider>
    </div>
  );
}
