import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import heroImage from "../fistbump.png";
import capabilitiesBackdrop from "../pullup.png";
import DemoSelector from "./pages/DemoSelector";
import OwnerDashboard from "./pages/OwnerDashboard";
import PtDashboard from "./pages/PtDashboard";
import type { AppView, PtId, PtProfile, WeeklyClass } from "./types/demo";

const capabilityCards = [
  {
    title: "Recurring Billing",
    description: "Collect memberships on schedule with automated renewals and payment recovery.",
    outcome: "Predictable monthly revenue and less manual chasing.",
    points: [
      "Recurring direct debit subscriptions",
      "Automatic retry for failed renewals",
      "Transparent billing history for members and staff",
    ],
  },
  {
    title: "Flexible Membership Tiers",
    description: "Create plan rules that match your gym without repeated admin work.",
    outcome: "Fit plans to different clients and improve retention.",
    points: [
      "Plans for capped classes, unlimited access, kids-only, and more",
      "Class-type and time access controls",
      "Simple plan management from one dashboard",
    ],
  },
  {
    title: "PT Profiles and Schedules",
    description: "Give coaches clear profiles and bookable availability linked to your gym.",
    outcome: "More PT visibility, stronger credibility, and better booking conversion.",
    points: [
      "Coach bio, experience, and profile presence",
      "Weekly and one-off availability windows",
      "Gym-linked profiles members can trust",
    ],
  },
  {
    title: "Offers and Promotions",
    description: "Launch targeted offers to drive signups and convert trial interest.",
    outcome: "Convert lookers to bookers with less admin.",
    points: [
      "Discount codes for campaigns and seasonal pushes",
      "Trial sessions and first-class offers",
      "First-month discounts that transition to recurring plans",
    ],
  },
];

const withoutClinch = [
  {
    title: "Revenue loss from manual billing",
    body: "Missing payments and pay-on-attendance make monthly income inconsistent.",
  },
  {
    title: "No central member data hub",
    body: "Billing, attendance, and records are scattered across tools and hard to manage.",
  },
  {
    title: "PTs struggle for visibility and bookings",
    body: "Coaches market manually with no clear schedule visibility or reliable booking flow.",
  },
];

const withClinch = [
  {
    title: "Predictable recurring revenue",
    body: "Automated recurring billing and retries keep memberships active and monthly collections consistent.",
  },
  {
    title: "One source of truth for members",
    body: "Billing, attendance, and profiles live in one place so staff can act quickly and accurately.",
  },
  {
    title: "PT profiles that drive appointments",
    body: "Coaches are visible, gym-linked, and bookable with clear schedules and stronger credibility.",
  },
];

const ownerMetrics = [
  { label: "Active memberships", value: "184", note: "+6 this month" },
  { label: "Monthly recurring revenue", value: "GBP 12,480", note: "Projected +8.4%" },
  { label: "Class occupancy", value: "86%", note: "Week average" },
  { label: "Outstanding invoices", value: "9", note: "4 high priority" },
  { label: "PT utilization", value: "74%", note: "+5 pts vs last week" },
  { label: "7-day check-ins", value: "1,142", note: "+11% week over week" },
];

const membershipBreakdown = [
  { name: "Unlimited", count: 72, percent: 39 },
  { name: "12 Classes / Month", count: 58, percent: 31 },
  { name: "Kids Only", count: 34, percent: 18 },
  { name: "PT Bundle", count: 20, percent: 12 },
];

const weekDays = [
  { short: "Mon", long: "Monday", date: "16" },
  { short: "Tue", long: "Tuesday", date: "17" },
  { short: "Wed", long: "Wednesday", date: "18" },
  { short: "Thu", long: "Thursday", date: "19" },
  { short: "Fri", long: "Friday", date: "20" },
  { short: "Sat", long: "Saturday", date: "21" },
  { short: "Sun", long: "Sunday", date: "22" },
];

const weeklyClasses: WeeklyClass[] = [
  { id: "mon-mt-fund-1800", day: 0, start: "18:00", end: "19:00", title: "Muay Thai Fundamentals", coach: "Coach Amir", booked: 18, capacity: 24, room: "Main Floor" },
  { id: "mon-mt-adv-1900", day: 0, start: "19:00", end: "20:00", title: "Muay Thai Advanced", coach: "Coach Amir", booked: 15, capacity: 20, room: "Main Floor" },
  { id: "mon-mma-0900", day: 0, start: "09:00", end: "10:00", title: "MMA Morning Session", coach: "Coach Ellis", booked: 11, capacity: 16, room: "Cage Room" },
  { id: "mon-kids-1630", day: 0, start: "16:30", end: "17:30", title: "Kids Class", coach: "Coach Mara", booked: 14, capacity: 18, room: "Kids Studio" },
  { id: "mon-bjj-fund-1800", day: 0, start: "18:00", end: "19:00", title: "BJJ Fundamentals", coach: "Coach Ari", booked: 20, capacity: 24, room: "Mat Room B" },
  { id: "mon-bjj-adv-1900", day: 0, start: "19:00", end: "20:00", title: "BJJ Advanced", coach: "Coach Ari", booked: 17, capacity: 20, room: "Mat Room B" },

  { id: "tue-mt-fund-1800", day: 1, start: "18:00", end: "19:00", title: "Muay Thai Fundamentals", coach: "Coach Amir", booked: 17, capacity: 24, room: "Main Floor" },
  { id: "tue-mt-adv-1900", day: 1, start: "19:00", end: "20:00", title: "Muay Thai Advanced", coach: "Coach Amir", booked: 16, capacity: 20, room: "Main Floor" },
  { id: "tue-sc-0800", day: 1, start: "08:00", end: "09:00", title: "S+C", coach: "Coach Ellis", booked: 12, capacity: 16, room: "Strength Zone" },
  { id: "tue-kids-1630", day: 1, start: "16:30", end: "17:30", title: "Kids Class", coach: "Coach Mara", booked: 15, capacity: 18, room: "Kids Studio" },
  { id: "tue-bjj-fund-1800", day: 1, start: "18:00", end: "19:00", title: "BJJ Fundamentals", coach: "Coach Ari", booked: 22, capacity: 24, room: "Mat Room B" },
  { id: "tue-bjj-adv-1900", day: 1, start: "19:00", end: "20:00", title: "BJJ Advanced", coach: "Coach Ari", booked: 18, capacity: 20, room: "Mat Room B" },

  { id: "wed-mt-fund-1800", day: 2, start: "18:00", end: "19:00", title: "Muay Thai Fundamentals", coach: "Coach Amir", booked: 19, capacity: 24, room: "Main Floor" },
  { id: "wed-mt-adv-1900", day: 2, start: "19:00", end: "20:00", title: "Muay Thai Advanced", coach: "Coach Amir", booked: 14, capacity: 20, room: "Main Floor" },
  { id: "wed-mma-0900", day: 2, start: "09:00", end: "10:00", title: "MMA Morning Session", coach: "Coach Ellis", booked: 10, capacity: 16, room: "Cage Room" },
  { id: "wed-kids-1630", day: 2, start: "16:30", end: "17:30", title: "Kids Class", coach: "Coach Mara", booked: 13, capacity: 18, room: "Kids Studio" },
  { id: "wed-bjj-fund-1800", day: 2, start: "18:00", end: "19:00", title: "BJJ Fundamentals", coach: "Coach Ari", booked: 21, capacity: 24, room: "Mat Room B" },
  { id: "wed-bjj-adv-1900", day: 2, start: "19:00", end: "20:00", title: "BJJ Advanced", coach: "Coach Ari", booked: 16, capacity: 20, room: "Mat Room B" },

  { id: "thu-mt-fund-1800", day: 3, start: "18:00", end: "19:00", title: "Muay Thai Fundamentals", coach: "Coach Amir", booked: 18, capacity: 24, room: "Main Floor" },
  { id: "thu-mt-adv-1900", day: 3, start: "19:00", end: "20:00", title: "Muay Thai Advanced", coach: "Coach Amir", booked: 15, capacity: 20, room: "Main Floor" },
  { id: "thu-sc-0800", day: 3, start: "08:00", end: "09:00", title: "S+C", coach: "Coach Ellis", booked: 14, capacity: 16, room: "Strength Zone" },
  { id: "thu-kids-1630", day: 3, start: "16:30", end: "17:30", title: "Kids Class", coach: "Coach Mara", booked: 16, capacity: 18, room: "Kids Studio" },
  { id: "thu-bjj-fund-1800", day: 3, start: "18:00", end: "19:00", title: "BJJ Fundamentals", coach: "Coach Ari", booked: 22, capacity: 24, room: "Mat Room B" },
  { id: "thu-bjj-adv-1900", day: 3, start: "19:00", end: "20:00", title: "BJJ Advanced", coach: "Coach Ari", booked: 19, capacity: 20, room: "Mat Room B" },

  { id: "fri-kids-1630", day: 4, start: "16:30", end: "17:30", title: "Kids Class", coach: "Coach Mara", booked: 15, capacity: 18, room: "Kids Studio" },
  { id: "fri-bjj-fund-1800", day: 4, start: "18:00", end: "19:00", title: "BJJ Fundamentals", coach: "Coach Ari", booked: 20, capacity: 24, room: "Mat Room B" },
  { id: "fri-bjj-adv-1900", day: 4, start: "19:00", end: "20:00", title: "BJJ Advanced", coach: "Coach Ari", booked: 17, capacity: 20, room: "Mat Room B" },
  { id: "fri-spar-1800", day: 4, start: "18:00", end: "20:00", title: "Muay Thai Sparring", coach: "Coach Amir", booked: 18, capacity: 20, room: "Main Floor" },

  { id: "sat-sc-0900", day: 5, start: "09:00", end: "10:00", title: "S+C", coach: "Coach Ellis", booked: 15, capacity: 18, room: "Strength Zone" },

  { id: "sun-spar-1400", day: 6, start: "12:00", end: "14:00", title: "Muay Thai Sparring", coach: "Coach Amir", booked: 16, capacity: 20, room: "Main Floor" },
  { id: "sun-sc-1100", day: 6, start: "11:00", end: "12:00", title: "S+C", coach: "Coach Ellis", booked: 12, capacity: 18, room: "Strength Zone" },
];

const ptRoster: PtProfile[] = [
  {
    id: "jess-cole",
    name: "Jess Cole",
    coach: "Coach Amir",
    style: "Striking and fight conditioning",
    location: "Main Gym Floor",
    bio: "Specializes in technical Muay Thai progression and safe, structured sparring preparation.",
    upcoming: ["Mon 13:00-16:00", "Wed 10:00-14:00", "Fri 12:00-16:00"],
    focus: ["Muay Thai fundamentals", "Advanced striking", "Sparring prep"],
    stats: [
      { label: "Active PT clients", value: "19" },
      { label: "Sessions this week", value: "26" },
      { label: "Utilization", value: "82%" },
    ],
  },
  {
    id: "ari-nunes",
    name: "Ari Nunes",
    coach: "Coach Ari",
    style: "No-Gi and takedown defense",
    location: "Mat Room B",
    bio: "Runs fundamentals-to-advanced BJJ tracks with a strong focus on positional control and competition readiness.",
    upcoming: ["Tue 09:00-12:00", "Thu 15:00-19:00", "Sat 10:00-13:00"],
    focus: ["BJJ fundamentals", "BJJ advanced", "No-gi coaching"],
    stats: [
      { label: "Active PT clients", value: "14" },
      { label: "Sessions this week", value: "21" },
      { label: "Utilization", value: "76%" },
    ],
  },
  {
    id: "leah-park",
    name: "Leah Park",
    coach: "Coach Mara",
    style: "Youth development and fundamentals",
    location: "Kids Program Studio",
    bio: "Leads youth classes and beginner pathways focused on consistency, confidence, and technical quality.",
    upcoming: ["Mon 15:00-18:00", "Wed 15:00-18:00", "Sat 09:00-12:00"],
    focus: ["Kids class curriculum", "Beginner onboarding", "Movement fundamentals"],
    stats: [
      { label: "Active PT clients", value: "11" },
      { label: "Sessions this week", value: "17" },
      { label: "Utilization", value: "71%" },
    ],
  },
];

function getPtIdFromHash(hash: string): PtId | null {
  if (!hash.startsWith("#demo-pt-")) return null;
  const ptId = hash.replace("#demo-pt-", "");
  const match = ptRoster.find((pt) => pt.id === ptId);
  return match ? match.id : null;
}

function getViewFromHash(): AppView {
  if (typeof window === "undefined") return "landing";
  const hash = window.location.hash;
  if (hash === "#demo-select") return "demo-select";
  if (hash === "#demo-owner") return "demo-owner";
  if (hash.startsWith("#demo-pt-")) return "demo-pt";
  if (hash === "#demo-member") return "demo-member";
  return "landing";
}

function setHashForView(view: AppView, ptId?: PtId) {
  if (typeof window === "undefined") return;
  if (view === "landing") {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    return;
  }
  if (view === "demo-select") {
    window.location.hash = "demo-select";
    return;
  }
  if (view === "demo-owner") {
    window.location.hash = "demo-owner";
    return;
  }
  if (view === "demo-pt") {
    const fallbackPtId = ptRoster[0]?.id;
    const safePtId = ptId ?? fallbackPtId;
    if (safePtId) window.location.hash = `demo-pt-${safePtId}`;
    return;
  }
  window.location.hash = "demo-member";
}

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

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -14% 0px" },
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
  compact,
  demoNav,
  onToggleTheme,
  onNavigate,
}: {
  theme: "light" | "dark";
  compact?: boolean;
  demoNav?: boolean;
  onToggleTheme: () => void;
  onNavigate: (view: AppView) => void;
}) {
  return (
    <header className="border-b border-[var(--line)] bg-[var(--surface)]/95">
      <div className="mx-auto flex w-full max-w-[1120px] items-center justify-between px-5 py-5 md:px-8">
        <button type="button" onClick={() => onNavigate("landing")} className="display text-[2rem] tracking-[0.11em] text-[var(--ink)]">
          CLINCH
        </button>
        {!compact && (
          <nav className="hidden items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)] md:flex">
            <a href="#capabilities" className="transition-colors hover:text-[var(--ink)]">Capabilities</a>
            <a href="#footer" className="transition-colors hover:text-[var(--ink)]">Contact</a>
          </nav>
        )}
        {compact && demoNav && (
          <nav className="hidden items-center gap-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)] md:flex">
            <a href="#demo-calendar" className="transition-colors hover:text-[var(--ink)]">Calendar</a>
            <a href="#demo-insights" className="transition-colors hover:text-[var(--ink)]">Insights</a>
            <button type="button" onClick={() => onNavigate("demo-select")} className="transition-colors hover:text-[var(--ink)]">Switch view</button>
          </nav>
        )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--line)] bg-[var(--card)] text-[0.95rem] text-[var(--ink)] transition hover:bg-[var(--surface-strong)]"
            onClick={onToggleTheme}
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? "\u2726" : "\u263E"}
          </button>
          {compact && demoNav && (
            <button type="button" onClick={() => onNavigate("demo-select")} className="hidden rounded-md border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--ink)] md:inline-flex">
              Demo views
            </button>
          )}
          {!compact && (
            <button className="rounded-md bg-[var(--ink)] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--surface)] transition hover:bg-[var(--ink-soft)] md:text-xs">
              Join Beta
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
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
  const capabilityVisibilityRef = useRef<number[]>(new Array(capabilityCount).fill(0));
  const fallbackPt = ptRoster[0];
  if (!fallbackPt) return null;
  const selectedPt = ptRoster.find((pt) => pt.id === selectedPtId) ?? fallbackPt;

  const focusPrevCapability = () => setActiveCapability((current) => (current - 1 + capabilityCount) % capabilityCount);
  const focusNextCapability = () => setActiveCapability((current) => (current + 1) % capabilityCount);

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
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    capabilityVisibilityRef.current = new Array(capabilityCount).fill(0);
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    let observer: IntersectionObserver | null = null;

    const observeForMobile = () => {
      if (observer) observer.disconnect();
      if (!mobileQuery.matches) return;
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const node = entry.target as HTMLElement;
            const index = Number(node.dataset.capIndex);
            if (!Number.isNaN(index)) {
              capabilityVisibilityRef.current[index] = entry.isIntersecting ? entry.intersectionRatio : 0;
            }
          }
          let bestIndex = 0;
          let bestRatio = 0;
          capabilityVisibilityRef.current.forEach((ratio, index) => {
            if (ratio > bestRatio) {
              bestRatio = ratio;
              bestIndex = index;
            }
          });
          if (bestRatio > 0) {
            setActiveCapability((current) => {
              if (current === bestIndex) return current;
              const currentRatio = capabilityVisibilityRef.current[current] ?? 0;
              const clearWinner = bestRatio >= currentRatio + 0.12;
              const currentMostlyGone = currentRatio < 0.2 && bestRatio > 0.2;
              return clearWinner || currentMostlyGone ? bestIndex : current;
            });
          }
        },
        { threshold: [0.15, 0.3, 0.45, 0.6, 0.75], rootMargin: "-12% 0px -38% 0px" },
      );
      capabilityCardRefs.current.forEach((node) => node && observer?.observe(node));
    };

    observeForMobile();
    const handleViewportChange = () => observeForMobile();
    mobileQuery.addEventListener("change", handleViewportChange);
    return () => {
      observer?.disconnect();
      mobileQuery.removeEventListener("change", handleViewportChange);
    };
  }, [capabilityCount, view]);

  if (view === "demo-select") {
    return (
      <div className="min-h-screen bg-[var(--surface)] text-[var(--ink)]">
        <AppHeader theme={theme} compact onToggleTheme={() => setTheme((c) => (c === "dark" ? "light" : "dark"))} onNavigate={navigateTo} />
        <DemoSelector onNavigate={navigateTo} />
      </div>
    );
  }

  if (view === "demo-owner") {
    return (
      <div className="min-h-screen bg-[var(--surface)] text-[var(--ink)]">
        <AppHeader theme={theme} compact demoNav onToggleTheme={() => setTheme((c) => (c === "dark" ? "light" : "dark"))} onNavigate={navigateTo} />
        <OwnerDashboard
          onNavigate={navigateTo}
          onOpenPt={openPtWorkspace}
          ownerMetrics={ownerMetrics}
          membershipBreakdown={membershipBreakdown}
          weekDays={weekDays}
          weeklyClasses={weeklyClasses}
          ptRoster={ptRoster}
          toMinutes={toMinutes}
        />
      </div>
    );
  }

  if (view === "demo-pt") {
    return (
      <div className="min-h-screen bg-[var(--surface)] text-[var(--ink)]">
        <AppHeader theme={theme} compact onToggleTheme={() => setTheme((c) => (c === "dark" ? "light" : "dark"))} onNavigate={navigateTo} />
        <PtDashboard
          pt={selectedPt}
          weekDays={weekDays}
          weeklyClasses={weeklyClasses}
          ptRoster={ptRoster}
          toMinutes={toMinutes}
          onBack={() => navigateTo("demo-owner")}
          onOpenPt={openPtWorkspace}
        />
      </div>
    );
  }

  if (view === "demo-member") {
    return (
      <div className="min-h-screen bg-[var(--surface)] text-[var(--ink)]">
        <AppHeader theme={theme} compact onToggleTheme={() => setTheme((c) => (c === "dark" ? "light" : "dark"))} onNavigate={navigateTo} />
        <main className="mx-auto w-full max-w-[960px] px-5 py-14 md:px-8">
          <h1 className="display text-[2.5rem] uppercase leading-[0.9]">Member view coming next</h1>
          <p className="mt-4 text-[var(--ink-muted)]">Owner view is ready now. Member flow can be added next.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--ink)]">
      <AppHeader theme={theme} onToggleTheme={() => setTheme((c) => (c === "dark" ? "light" : "dark"))} onNavigate={navigateTo} />
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
              <div className="absolute bottom-[5%] left-1/2 z-[60] -translate-x-1/2">
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
                  onFocus={() => setActiveCapability(idx)}
                  onClick={() => setActiveCapability(idx)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={idx === activeCapability}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setActiveCapability(idx);
                    }
                  }}
                >
                  <h3 className="text-base font-black uppercase leading-tight text-[var(--ink)]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">{item.description}</p>
                  <p className="capability-outcome mt-3 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ink-soft)]">{item.outcome}</p>
                  <ul className="capability-points mt-3 space-y-2 text-sm text-[var(--ink-muted)]">
                    {item.points.map((point) => (
                      <li key={point} className="rounded-md border border-[var(--line)] bg-[var(--card)] px-3 py-2">{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[880px] px-5 pb-12 pt-10 md:px-8 md:pb-16 md:pt-12">
          <div className="md:hidden">
            <Reveal delay={220}><p className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--ink-muted)]">Swipe to compare</p></Reveal>
            <div className="mobile-compare-track mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
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
