import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import heroImage from "../fistbump.png";
import capabilitiesBackdrop from "../pullup.png";
import DemoSelector from "./pages/DemoSelector";
import OwnerDashboard from "./pages/OwnerDashboard";
import PtWorkspace from "./pages/PtWorkspace";
import MemberPortal from "./pages/MemberPortal";
import DemoShell from "./components/DemoShell";
import type { AppView, PtId } from "./types/demo";
import {
  capabilityCards,
  withClinch,
  withoutClinch,
  ptRoster,
  getPtIdFromHash,
  getViewFromHash,
  setHashForView,
} from "./data/demoData";

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const revealIfAlreadyNear = () => {
      const rect = node.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.92) {
        setVisible(true);
        return true;
      }
      return false;
    };
    if (revealIfAlreadyNear()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        const crossedRevealLine = entry.boundingClientRect.top <= window.innerHeight * 0.9;
        if (entry.isIntersecting || entry.intersectionRatio > 0 || crossedRevealLine) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: [0, 0.08, 0.18], rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal-on-scroll ${visible ? "is-visible" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

function AppHeader({
  theme,
  onToggleTheme,
  onNavigate,
}: {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onNavigate: (view: AppView) => void;
}) {
  return (
    <header className="border-b border-[var(--line)] bg-[var(--surface)]/95">
      <div className="mx-auto flex w-full max-w-[1120px] items-center justify-between px-5 py-5 md:px-8">
        <button type="button" onClick={() => onNavigate("landing")} className="display text-[2rem] tracking-[0.11em] text-[var(--ink)]">
          CLINCH
        </button>
        <nav className="hidden items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)] md:flex">
          <a href="#capabilities" className="transition-colors hover:text-[var(--ink)]">Capabilities</a>
          <a href="#footer" className="transition-colors hover:text-[var(--ink)]">Contact</a>
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--line)] bg-[var(--card)] text-[0.95rem] text-[var(--ink)] transition hover:bg-[var(--surface-strong)]"
            onClick={onToggleTheme}
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? "\u2726" : "\u263E"}
          </button>
          <button className="rounded-md bg-[var(--ink)] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--surface)] transition hover:bg-[var(--ink-soft)] md:text-xs">
            Join Beta
          </button>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  const [activeCapability, setActiveCapability] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [view, setView] = useState<AppView>(() => getViewFromHash());
  const [selectedPtId, setSelectedPtId] = useState<PtId>(() => {
    if (typeof window === "undefined") return ptRoster[0]?.id ?? "jess-cole";
    return getPtIdFromHash(window.location.hash) ?? ptRoster[0]?.id ?? "jess-cole";
  });
  const capabilityCount = capabilityCards.length;
  const capabilityCardRefs = useRef<Array<HTMLElement | null>>([]);
  const capabilityManualUntilRef = useRef(0);
  const fallbackPt = ptRoster[0];
  if (!fallbackPt) return null;
  const selectedPt = ptRoster.find((pt) => pt.id === selectedPtId) ?? fallbackPt;

  const toggleTheme = () => setTheme((c) => (c === "dark" ? "light" : "dark"));

  const focusPrevCapability = () => setActiveCapability((current) => (current - 1 + capabilityCount) % capabilityCount);
  const focusNextCapability = () => setActiveCapability((current) => (current + 1) % capabilityCount);
  const setCapabilityFromTap = (index: number) => {
    capabilityManualUntilRef.current = Date.now() + 1200;
    setActiveCapability(index);
  };

  const navigateTo = (nextView: AppView, options?: { ptId?: PtId }) => {
    if (options?.ptId) setSelectedPtId(options.ptId);
    const nextPtId = options?.ptId ?? selectedPtId;
    setView(nextView);
    setHashForView(nextView, nextPtId);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  const openPtWorkspace = (ptId: PtId) => navigateTo("demo-pt", { ptId });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onHashChange = () => {
      setView(getViewFromHash());
      const hashPtId = getPtIdFromHash(window.location.hash);
      if (hashPtId) setSelectedPtId(hashPtId);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("clinch-theme");
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      return;
    }
    setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("clinch-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (view !== "landing") return;
    if (typeof window === "undefined") return;

    const mobileQuery = window.matchMedia("(max-width: 767px)");
    let frameId = 0;
    let settleTimer = 0;
    let fastScrollUntil = 0;
    let lastScrollY = window.scrollY;
    let lastScrollAt = performance.now();

    const getVisibleRatio = (rect: DOMRect) => {
      const viewportTop = 0;
      const viewportBottom = window.innerHeight;
      const visiblePx = Math.max(0, Math.min(rect.bottom, viewportBottom) - Math.max(rect.top, viewportTop));
      return visiblePx / Math.max(rect.height, 1);
    };

    const syncActiveCapability = () => {
      if (!mobileQuery.matches) return;
      if (Date.now() < capabilityManualUntilRef.current) return;
      if (performance.now() < fastScrollUntil) return;

      const viewportHeight = window.innerHeight;
      const focusLine = viewportHeight * 0.46;
      let bestIndex = -1;
      let bestVisibility = 0;
      let bestDistance = Number.POSITIVE_INFINITY;

      capabilityCardRefs.current.forEach((node, index) => {
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const visibility = getVisibleRatio(rect);
        if (visibility <= 0.01) return;

        const center = rect.top + rect.height / 2;
        const distance = Math.abs(center - focusLine);
        const clearlyMoreVisible = visibility > bestVisibility + 0.03;
        const visibilityTie = Math.abs(visibility - bestVisibility) <= 0.03;
        if (clearlyMoreVisible || (visibilityTie && distance < bestDistance)) {
          bestIndex = index;
          bestVisibility = visibility;
          bestDistance = distance;
        }
      });

      if (bestIndex < 0) return;

      setActiveCapability((current) => {
        if (current === bestIndex) return current;
        const currentNode = capabilityCardRefs.current[current];
        if (!currentNode) return bestIndex;

        const currentRect = currentNode.getBoundingClientRect();
        const currentVisibility = getVisibleRatio(currentRect);
        const currentDistance = Math.abs(currentRect.top + currentRect.height / 2 - focusLine);
        const visibilityLead = bestVisibility - currentVisibility;
        const distanceLead = currentDistance - bestDistance;
        const shouldSwitch = visibilityLead > 0.12 || distanceLead > 38 || currentVisibility < 0.16;
        return shouldSwitch ? bestIndex : current;
      });
    };

    const queueSync = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        syncActiveCapability();
      });
    };

    const onScroll = () => {
      if (!mobileQuery.matches) return;
      const now = performance.now();
      const delta = Math.abs(window.scrollY - lastScrollY);
      const elapsed = Math.max(now - lastScrollAt, 1);
      const velocity = delta / elapsed;
      lastScrollY = window.scrollY;
      lastScrollAt = now;

      if (velocity > 1.2) {
        fastScrollUntil = now + 120;
      }
      if (settleTimer) window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        fastScrollUntil = 0;
        queueSync();
      }, 90);
      queueSync();
    };

    const handleViewportChange = () => {
      lastScrollY = window.scrollY;
      lastScrollAt = performance.now();
      queueSync();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", handleViewportChange);
    mobileQuery.addEventListener("change", handleViewportChange);
    queueSync();

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      if (settleTimer) window.clearTimeout(settleTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", handleViewportChange);
      mobileQuery.removeEventListener("change", handleViewportChange);
    };
  }, [view]);

  /* ── Demo views wrapped in DemoShell ─────────────────────────── */

  if (view === "demo-select") {
    return (
      <div className="min-h-screen bg-[var(--surface)] text-[var(--ink)]">
        <AppHeader theme={theme} onToggleTheme={toggleTheme} onNavigate={navigateTo} />
        <DemoSelector onNavigate={navigateTo} />
      </div>
    );
  }

  if (view === "demo-owner") {
    return (
      <DemoShell theme={theme} view={view} onToggleTheme={toggleTheme} onNavigate={navigateTo} lastPtId={selectedPtId}>
        <OwnerDashboard onOpenPt={openPtWorkspace} />
      </DemoShell>
    );
  }

  if (view === "demo-pt") {
    return (
      <DemoShell theme={theme} view={view} onToggleTheme={toggleTheme} onNavigate={navigateTo} lastPtId={selectedPtId}>
        <PtWorkspace pt={selectedPt} onOpenPt={openPtWorkspace} />
      </DemoShell>
    );
  }

  if (view === "demo-member") {
    return (
      <DemoShell theme={theme} view={view} onToggleTheme={toggleTheme} onNavigate={navigateTo} lastPtId={selectedPtId}>
        <MemberPortal />
      </DemoShell>
    );
  }

  /* ── Landing page ────────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--ink)]">
      <AppHeader theme={theme} onToggleTheme={toggleTheme} onNavigate={navigateTo} />
      <main>
        <section className="w-full pt-6 md:mx-auto md:max-w-[880px] md:px-8 md:pt-10">
          <Reveal>
            <div className="hero-image-shell relative overflow-hidden rounded-none border-y border-[var(--line)] md:rounded-xl md:border lg:-mx-14 xl:-mx-24">
              <img src={heroImage} alt="Two fighters touching fists" className="hero-image h-[270px] w-full object-cover object-center sm:h-[340px] md:h-[430px] lg:h-[500px]" />
              <div className="absolute inset-0 bg-black/24" />
              <div className="absolute inset-x-0 top-0">
                <div className="mx-auto w-full max-w-[880px] px-5 pt-4 sm:pt-6 md:px-8 md:pt-8">
                  <div className="hero-text hero-text-fade font-extrabold">
                    <p className="text-[0.9rem] uppercase tracking-[0.11em] sm:text-[1rem] md:text-[1.1rem]">Built by fighters, for fighters</p>
                    <p className="mt-1 max-w-[17ch] text-[1.95rem] uppercase leading-[0.88] sm:text-[2.35rem] md:text-[3rem] lg:text-[3.55rem]">Booking and memberships for combat gyms.</p>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-[8%] left-1/2 z-[60] -translate-x-1/2 md:bottom-[9%]">
                <button
                  type="button"
                  onClick={() => navigateTo("demo-select")}
                  className="inline-flex min-w-[200px] items-center justify-center rounded-md px-11 py-3 text-sm font-extrabold uppercase tracking-[0.11em] transition hover:bg-neutral-100 md:min-w-[220px] md:px-12 md:py-4 md:text-base"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    border: "3px solid #000000",
                    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.42)",
                  }}
                >
                  View Demo
                </button>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="mx-auto w-full max-w-[880px] px-5 pb-12 pt-10 md:px-8 md:pb-16 md:pt-12">
          <Reveal delay={80}>
            <h1 className="display max-w-[12ch] text-[2.7rem] uppercase leading-[0.88] text-[var(--ink)] sm:text-[3rem] md:max-w-[24ch] md:text-[3.2rem]">
              <span className="md:block">Focus on the fight, </span><span className="md:block">not the admin.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-5 max-w-[62ch] text-[1.03rem] leading-relaxed text-[var(--ink-muted)]">
              Clinch is an all-in-one booking platform for recurring memberships, PT scheduling, and day-to-day member operations.
            </p>
          </Reveal>
        </section>

        <section id="capabilities" className="capabilities-bg-section relative overflow-hidden border-y border-[var(--line)]">
          <img src={capabilitiesBackdrop} alt="" aria-hidden className="capabilities-bg-image absolute inset-0 h-full w-full object-cover" />
          <div className="capabilities-content relative z-10 mx-auto w-full max-w-[1120px] px-5 py-12 md:px-8 md:py-16">
            <h2 className="hero-text max-w-[16ch] text-[2.5rem] uppercase leading-[0.9] md:text-[3.2rem]">Core capabilities</h2>
            <div className="mt-5 hidden justify-end gap-2 md:flex">
              <button type="button" className="capability-nav-btn" onClick={focusPrevCapability} aria-label="Focus previous capability">{"<"}</button>
              <button type="button" className="capability-nav-btn" onClick={focusNextCapability} aria-label="Focus next capability">{">"}</button>
            </div>
            <div className="capability-rail mt-6 grid items-start gap-3 md:grid-cols-2 lg:grid-cols-4">
              {capabilityCards.map((item, idx) => (
                <article
                  key={item.title}
                  className={`capability-card feature-card rounded-xl border border-[var(--line)] p-5 ${idx === activeCapability ? "is-active" : "is-inactive"}`}
                  data-cap-index={idx}
                  ref={(node) => { capabilityCardRefs.current[idx] = node; }}
                  onMouseEnter={() => setActiveCapability(idx)}
                  onFocus={() => setCapabilityFromTap(idx)}
                  onClick={() => setCapabilityFromTap(idx)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={idx === activeCapability}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setCapabilityFromTap(idx);
                    }
                  }}
                >
                  <h3 className="text-base font-black uppercase leading-tight text-[var(--ink)]">{item.title}</h3>
                  <p className="capability-description mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">{item.description}</p>
                  <div className="capability-detail-layer">
                    <p className="capability-outcome mt-3 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ink-soft)]">{item.outcome}</p>
                    <ul className="capability-points mt-3 space-y-2 text-sm text-[var(--ink-muted)]">
                      {item.points.map((point) => (
                        <li key={point} className="rounded-md border border-[var(--line)] bg-[var(--card)] px-3 py-2">{point}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[880px] px-5 pb-12 pt-10 md:px-8 md:pb-16 md:pt-12">
          <div className="md:hidden">
            <Reveal delay={220}><p className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--ink-muted)]">Swipe to compare</p></Reveal>
            <div className="mobile-compare-track mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden pb-2">
              <Reveal className="mobile-compare-panel min-w-full snap-start" delay={260}>
                <section className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--with-accent)]">With Clinch Booking :</p>
                  <div className="mt-3 grid gap-3">{withClinch.map((item, idx) => (<article key={item.title} className={`feature-card with-card with-step-${idx + 1} rounded-lg border p-4`}><h3 className="text-sm font-black uppercase tracking-[0.03em] text-[var(--ink)]">{item.title}</h3><p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">{item.body}</p></article>))}</div>
                </section>
              </Reveal>
              <Reveal className="mobile-compare-panel min-w-full snap-start" delay={320}>
                <section className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--without-accent)]">Without Clinch Booking :</p>
                  <div className="mt-3 grid gap-3">{withoutClinch.map((item, idx) => (<article key={item.title} className={`feature-card without-card without-step-${idx + 1} rounded-lg border p-4`}><h3 className="text-sm font-black uppercase tracking-[0.03em] text-[var(--ink)]">{item.title}</h3><p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">{item.body}</p></article>))}</div>
                </section>
              </Reveal>
            </div>
          </div>

          <div className="hidden md:block">
            <Reveal delay={220}><p className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--with-accent)]">With Clinch Booking :</p></Reveal>
            <div className="mt-3 grid gap-3 md:grid-cols-3">{withClinch.map((item, idx) => (<Reveal key={item.title} delay={280 + idx * 80}><article className={`feature-card with-card with-step-${idx + 1} rounded-lg border p-4`}><h3 className="text-sm font-black uppercase tracking-[0.03em] text-[var(--ink)]">{item.title}</h3><p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">{item.body}</p></article></Reveal>))}</div>
            <Reveal delay={560}><p className="mt-7 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--without-accent)]">Without Clinch Booking :</p></Reveal>
            <div className="mt-3 grid gap-3 md:grid-cols-3">{withoutClinch.map((item, idx) => (<Reveal key={item.title} delay={620 + idx * 80}><article className={`feature-card without-card without-step-${idx + 1} rounded-lg border p-4`}><h3 className="text-sm font-black uppercase tracking-[0.03em] text-[var(--ink)]">{item.title}</h3><p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">{item.body}</p></article></Reveal>))}</div>
          </div>
        </section>

        <footer id="footer" className="border-t border-[var(--line)] bg-[var(--surface)]">
          <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-8 px-5 py-10 md:px-8 md:py-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="display text-[2.1rem] uppercase tracking-[0.08em] text-[var(--ink)]">CLINCH</p>
                <p className="mt-2 max-w-[44ch] text-sm leading-relaxed text-[var(--ink-muted)]">Booking and memberships for combat gyms. Built by fighters, for fighters.</p>
              </div>
              <div className="flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
                <a href="#capabilities" className="transition-colors hover:text-[var(--ink)]">Core Capabilities</a>
                <button type="button" onClick={() => navigateTo("demo-select")} className="transition-colors hover:text-[var(--ink)]">View Demo</button>
                <a href="mailto:hello@clinchbooking.com" className="transition-colors hover:text-[var(--ink)]">hello@clinchbooking.com</a>
              </div>
            </div>
            <div className="border-t border-[var(--line)] pt-4 text-xs text-[var(--ink-muted)]">(c) {new Date().getFullYear()} Clinch Booking. All rights reserved.</div>
          </div>
        </footer>
      </main>
    </div>
  );
}
