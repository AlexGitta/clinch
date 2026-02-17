import type {
  AppView,
  InvoiceRow,
  MemberProfile,
  MembershipSlice,
  OwnerMemberRow,
  OwnerMetric,
  PtClient,
  PtId,
  PtProfile,
  PtSession,
  TierDefinition,
  WeekDay,
  WeeklyClass,
} from "../types/demo";

/* ── Utility functions ───────────────────────────────────────────── */

export function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function getPtIdFromHash(hash: string): PtId | null {
  if (!hash.startsWith("#demo-pt-")) return null;
  const ptId = hash.replace("#demo-pt-", "");
  const match = ptRoster.find((pt) => pt.id === ptId);
  return match ? match.id : null;
}

export function getViewFromHash(): AppView {
  if (typeof window === "undefined") return "landing";
  const hash = window.location.hash;
  if (hash === "#demo-select") return "demo-select";
  if (hash === "#demo-owner") return "demo-owner";
  if (hash.startsWith("#demo-pt-")) return "demo-pt";
  if (hash === "#demo-member") return "demo-member";
  return "landing";
}

export function setHashForView(view: AppView, ptId?: PtId) {
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

/* ── Landing page data ───────────────────────────────────────────── */

export const capabilityCards = [
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

export const withoutClinch = [
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

export const withClinch = [
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

/* ── Owner metrics ───────────────────────────────────────────────── */

export const ownerMetrics: OwnerMetric[] = [
  { label: "Active memberships", value: "184", note: "+6 this month" },
  { label: "Monthly recurring revenue", value: "GBP 12,480", note: "Projected +8.4%" },
  { label: "Class occupancy", value: "86%", note: "Week average" },
  { label: "Outstanding invoices", value: "9", note: "4 high priority" },
  { label: "PT utilization", value: "74%", note: "+5 pts vs last week" },
  { label: "7-day check-ins", value: "1,142", note: "+11% week over week" },
];

export const membershipBreakdown: MembershipSlice[] = [
  { name: "Unlimited", count: 72, percent: 39 },
  { name: "12 Classes / Month", count: 58, percent: 31 },
  { name: "Kids Only", count: 34, percent: 18 },
  { name: "PT Bundle", count: 20, percent: 12 },
];

/* ── Weekly schedule ─────────────────────────────────────────────── */

export const weekDays: WeekDay[] = [
  { short: "Mon", long: "Monday", date: "16" },
  { short: "Tue", long: "Tuesday", date: "17" },
  { short: "Wed", long: "Wednesday", date: "18" },
  { short: "Thu", long: "Thursday", date: "19" },
  { short: "Fri", long: "Friday", date: "20" },
  { short: "Sat", long: "Saturday", date: "21" },
  { short: "Sun", long: "Sunday", date: "22" },
];

export const weeklyClasses: WeeklyClass[] = [
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

/* ── PT roster ───────────────────────────────────────────────────── */

export const ptRoster: PtProfile[] = [
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

/* ── New data: Member profile ────────────────────────────────────── */

export const memberProfile: MemberProfile = {
  id: "alex-rivera",
  name: "Alex Rivera",
  email: "alex.rivera@email.com",
  tier: "Unlimited",
  monthlyFee: 89,
  nextBilling: "1 Mar 2026",
  classesThisMonth: 14,
  classesAllowed: "Unlimited",
  checkins7d: 5,
};

/* ── New data: Owner members list ────────────────────────────────── */

export const ownerMembersList: OwnerMemberRow[] = [
  { id: "m1", name: "Alex Rivera", email: "alex.rivera@email.com", tier: "Unlimited", monthlyFee: 89, joined: "Sep 2024", status: "active", lastCheckin: "Today" },
  { id: "m2", name: "Jordan Osei", email: "jordan.osei@email.com", tier: "12 Classes / Month", monthlyFee: 59, joined: "Jan 2025", status: "active", lastCheckin: "Yesterday" },
  { id: "m3", name: "Sam Patel", email: "sam.patel@email.com", tier: "Unlimited", monthlyFee: 89, joined: "Mar 2024", status: "active", lastCheckin: "Today" },
  { id: "m4", name: "Casey Nguyen", email: "casey.nguyen@email.com", tier: "PT Bundle", monthlyFee: 129, joined: "Nov 2024", status: "overdue", lastCheckin: "3 days ago" },
  { id: "m5", name: "Morgan Ellis", email: "morgan.ellis@email.com", tier: "Kids Only", monthlyFee: 39, joined: "Jun 2025", status: "active", lastCheckin: "Today" },
  { id: "m6", name: "Taylor Brooks", email: "taylor.brooks@email.com", tier: "Unlimited", monthlyFee: 89, joined: "Aug 2023", status: "active", lastCheckin: "2 days ago" },
  { id: "m7", name: "Riley Kim", email: "riley.kim@email.com", tier: "12 Classes / Month", monthlyFee: 59, joined: "Feb 2025", status: "cancelled", lastCheckin: "2 weeks ago" },
  { id: "m8", name: "Jamie Frost", email: "jamie.frost@email.com", tier: "PT Bundle", monthlyFee: 129, joined: "Dec 2024", status: "active", lastCheckin: "Yesterday" },
];

/* ── New data: PT sessions (bookable) ────────────────────────────── */

export const ptSessions: PtSession[] = [
  { id: "pts-1", ptId: "jess-cole", day: 0, date: "16", start: "13:00", end: "14:00", type: "1-on-1", spotsLeft: 1, price: 45 },
  { id: "pts-2", ptId: "jess-cole", day: 0, date: "16", start: "14:00", end: "15:00", type: "Small Group", spotsLeft: 3, price: 25 },
  { id: "pts-3", ptId: "jess-cole", day: 2, date: "18", start: "10:00", end: "11:00", type: "1-on-1", spotsLeft: 1, price: 45 },
  { id: "pts-4", ptId: "jess-cole", day: 4, date: "20", start: "12:00", end: "13:00", type: "Small Group", spotsLeft: 2, price: 25 },
  { id: "pts-5", ptId: "ari-nunes", day: 1, date: "17", start: "09:00", end: "10:00", type: "1-on-1", spotsLeft: 1, price: 45 },
  { id: "pts-6", ptId: "ari-nunes", day: 1, date: "17", start: "10:00", end: "11:00", type: "Small Group", spotsLeft: 4, price: 25 },
  { id: "pts-7", ptId: "ari-nunes", day: 3, date: "19", start: "15:00", end: "16:00", type: "1-on-1", spotsLeft: 1, price: 45 },
  { id: "pts-8", ptId: "ari-nunes", day: 5, date: "21", start: "10:00", end: "11:00", type: "Small Group", spotsLeft: 3, price: 25 },
  { id: "pts-9", ptId: "leah-park", day: 0, date: "16", start: "15:00", end: "16:00", type: "1-on-1", spotsLeft: 1, price: 40 },
  { id: "pts-10", ptId: "leah-park", day: 0, date: "16", start: "16:00", end: "17:00", type: "Small Group", spotsLeft: 4, price: 20 },
  { id: "pts-11", ptId: "leah-park", day: 2, date: "18", start: "15:00", end: "16:00", type: "1-on-1", spotsLeft: 1, price: 40 },
  { id: "pts-12", ptId: "leah-park", day: 5, date: "21", start: "09:00", end: "10:00", type: "Small Group", spotsLeft: 3, price: 20 },
];

/* ── New data: PT clients ────────────────────────────────────────── */

export const ptClients: Record<PtId, PtClient[]> = {
  "jess-cole": [
    { name: "Alex Rivera", nextSession: "Mon 13:00", package: "8-session pack" },
    { name: "Sam Patel", nextSession: "Wed 10:00", package: "Monthly unlimited" },
    { name: "Jamie Frost", nextSession: "Fri 12:00", package: "4-session pack" },
    { name: "Taylor Brooks", nextSession: "Mon 14:00", package: "Drop-in" },
  ],
  "ari-nunes": [
    { name: "Jordan Osei", nextSession: "Tue 09:00", package: "Monthly unlimited" },
    { name: "Casey Nguyen", nextSession: "Thu 15:00", package: "8-session pack" },
    { name: "Morgan Ellis", nextSession: "Sat 10:00", package: "4-session pack" },
  ],
  "leah-park": [
    { name: "Riley Kim", nextSession: "Mon 15:00", package: "4-session pack" },
    { name: "Morgan Ellis", nextSession: "Wed 15:00", package: "Kids program" },
    { name: "Jamie Frost", nextSession: "Sat 09:00", package: "Drop-in" },
  ],
};

/* ── New data: Invoices ──────────────────────────────────────────── */

export const invoices: InvoiceRow[] = [
  { id: "inv-1", memberName: "Alex Rivera", amount: 89, status: "paid", date: "1 Feb 2026", tier: "Unlimited" },
  { id: "inv-2", memberName: "Jordan Osei", amount: 59, status: "paid", date: "1 Feb 2026", tier: "12 Classes / Month" },
  { id: "inv-3", memberName: "Casey Nguyen", amount: 129, status: "overdue", date: "1 Feb 2026", tier: "PT Bundle" },
  { id: "inv-4", memberName: "Sam Patel", amount: 89, status: "paid", date: "1 Feb 2026", tier: "Unlimited" },
  { id: "inv-5", memberName: "Taylor Brooks", amount: 89, status: "pending", date: "1 Feb 2026", tier: "Unlimited" },
  { id: "inv-6", memberName: "Riley Kim", amount: 59, status: "failed", date: "1 Feb 2026", tier: "12 Classes / Month" },
  { id: "inv-7", memberName: "Morgan Ellis", amount: 39, status: "paid", date: "1 Feb 2026", tier: "Kids Only" },
  { id: "inv-8", memberName: "Jamie Frost", amount: 129, status: "pending", date: "1 Feb 2026", tier: "PT Bundle" },
];

/* ── New data: Tier definitions ──────────────────────────────────── */

export const tierDefinitions: TierDefinition[] = [
  { name: "Unlimited", price: 89, description: "Unlimited classes per month, all disciplines, priority booking" },
  { name: "12 Classes / Month", price: 59, description: "12 classes per month, choose any discipline" },
  { name: "Kids Only", price: 39, description: "Unlimited kids classes, youth programs and events" },
  { name: "PT Bundle", price: 129, description: "Unlimited classes plus 4 PT sessions per month" },
];
