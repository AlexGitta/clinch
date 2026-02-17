# Clinch - Product & Business Plan

## Context

Combat sports gyms (MMA, boxing, BJJ, Muay Thai, wrestling, kickboxing) are underserved by existing booking software. Generic platforms like MindBody ($99-$699/mo) are designed for yoga studios - expensive, bloated, and a poor fit. Specialised tools (MAAT, BJJLINK, Clubworx) are immature and mostly BJJ-only. Most gym owners manage bookings through spreadsheets, WhatsApp, or Instagram DMs. The market is growing fast (7.2% CAGR globally, 44,000+ BJJ studios in US alone, 18.7% annual growth for UK martial arts businesses).

**Clinch** is a modern, affordable SaaS booking and payment platform built for combat sports gyms.

---

## Key Business Idea

**Clinch is a vertical SaaS play**: own the "booking + payments" layer for combat sports gyms, then expand.

**The wedge:** Class scheduling + recurring Stripe payments. This is the #1 pain point. Get it right, make it affordable, make it look good, and gym owners will switch.

**The expansion path:** Once Clinch is the system of record for a gym's members, schedule, and payments, it becomes the natural home for PT marketplace, retail, events, belt tracking, community features, and analytics.

**The moat:** Switching costs (members, payments, and schedule on the platform), brand loyalty in a tight-knit community (combat sports gym owners talk to each other), and accumulating sport-specific features over time.

---

## How Clinch Differs from Competitors

| | Clinch | MindBody | Zen Planner | Glofox | Gymdesk | ClassFit |
|---|---|---|---|---|---|---|
| **Built for combat sports** | Yes (brand, UX, community) | No (yoga/wellness) | Partially | No | Partially | No |
| **Modern UI** | Yes (2026 ground-up) | Dated | Dated | Yes | Adequate | Basic |
| **Target price** | £29-£79/mo | $99-$699/mo | $99-$200/mo | $110+/mo | $75-$200/mo | $40-$120/mo |
| **Full white-label widget** | Yes (full portal) | Basic embed | Basic embed | Branded app ($$$) | Limited | Basic |
| **Independent PT support** | First-class | Poor | Poor | Poor | No | No |
| **Payments** | Stripe Connect (transparent) | Proprietary (2.75-3.5%+) | Proprietary | Proprietary | Stripe | Stripe |
| **Marketplace commission** | None | 20% | N/A | N/A | N/A | 2% share |
| **Setup complexity** | Minutes | Days/weeks | Hours | Hours | Hours | Minutes |

**Core differentiators:**
- **Combat sports identity without feature lock-in.** V1 is discipline-agnostic but the brand, marketing, and UX are 100% combat sports. Sport-specific features (belt tracking, sparring management) become powerful V2+ upsells.
- **White-label widget as a core product.** Not a basic schedule embed - a full branded portal: booking, membership purchase, login, payment history. Gyms keep members on their own site.
- **PTs as first-class citizens.** Independent PTs use Clinch standalone. Gym-affiliated PTs integrate into the gym's system. No competitor handles this dual model well.
- **Transparent pricing, no hidden fees.** No marketplace commissions, no proprietary payment processing markups. Standard Stripe rates.

---

## User Types

### Gym Owner / Staff
Set up schedule, manage members, collect recurring payments, view revenue dashboards, embed widget on their website. Pain: wasted admin time, lost revenue from payment failures.

### Personal Trainer (PT)
Can operate independently (own booking link, own Stripe account) OR as part of a gym (sessions on gym schedule, revenue split). Manages availability, accepts bookings. Pain: double-bookings, chasing payments, no professional booking presence.

### Member
Browse schedule, book/cancel classes, manage membership, book PT sessions, view attendance history. Pain: uncertainty about class availability, clunky booking via WhatsApp/DMs.

---

## V1 Feature Set (MVP)

### Admin Dashboard (Gym Owner)
- Gym setup wizard (name, logo, colours, Stripe Connect onboarding)
- Class schedule management (recurring templates + one-off classes)
- Capacity limits, waitlists (auto-promote when spot opens)
- Member database (search, filter, profiles, attendance history, CSV import)
- Membership plan builder (name, price, billing frequency, class access rules: unlimited / N per month / specific class types / time restrictions)
- Stripe-powered recurring billing with dunning (auto-retry failed payments)
- Revenue dashboard (MRR, churn, failed payments)
- Staff accounts with role-based access
- Cancellation policy configuration
- Widget embed code generator

### Member Booking Portal (Web)
- Class schedule (day/week view, filterable)
- Book/cancel classes (respecting cancellation policy)
- Waitlist with auto-notification
- Membership purchase (Stripe Checkout)
- Account management (plan, payment history, update payment method)
- PT session booking (view availability, select slot, pay)
- Mobile-responsive

### White-Label Widget
- Full branded portal (not just a schedule view)
- Class booking, membership signup, member login, payment history, PT booking
- Embed via single `<script>` tag + `<div>` container
- Shadow DOM for style isolation, iframe fallback for restricted CMS
- Configurable: gym logo, colours, light/dark theme
- CDN-served, versioned

### PT Features
- Profile page with bio, specialities, pricing
- Availability management (recurring + one-off slots)
- Shareable booking link (`clinchbooking.com/pt/jess-muaythai`)
- Independent Stripe Connected Account OR gym revenue split
- Client management and session history

### Notifications (Email Only in V1)
- Booking confirmation / cancellation
- Waitlist promotion
- Payment receipt / failure
- Class cancellation by gym

---

## Technical Architecture

**Stack:** PostgreSQL, React 18+ (Vite), TypeScript, Fastify (Node.js API), Drizzle ORM, Stripe Connect, Tailwind + shadcn/ui

**Monorepo structure (Turborepo):**
- `packages/db/` - Drizzle schema, migrations, RLS policies
- `packages/api/` - Fastify API server
- `packages/web/` - React admin dashboard + member portal
- `packages/widget/` - React widget (separate IIFE build for CDN)
- `packages/shared/` - TypeScript types shared across all packages

**Multi-tenancy:** Shared database, shared schema, PostgreSQL Row-Level Security (RLS) with `gym_id` on every tenant-scoped table. API sets `SET LOCAL app.current_gym_id` per request. Simple to operate, cheap to host, sufficient for thousands of tenants.

**Stripe Connect (Express accounts):** Gyms and PTs are Connected Accounts. Clinch collects application fees on transactions. Members are Stripe Customers. Subscriptions handle recurring billing. Webhook handler for payment events.

**Hosting:** Vercel (frontend) + Railway or Fly.io (API) + Neon or Supabase (PostgreSQL). Minimal DevOps for a solo developer.

**Key database entities:** gyms, users, gym_memberships, membership_plans, classes, class_schedules, class_instances, bookings, pt_profiles, pt_availability, pt_sessions, payments

---

## Phased Delivery

### Phase 0: Foundation (Weeks 1-3)
Monorepo setup, database schema + RLS, API scaffolding, auth (JWT), Stripe Connect basics, CI/CD

### Phase 1: Admin Dashboard (Weeks 4-8)
Gym setup, schedule management, member management, membership plans + Stripe subscriptions, payment dashboard, notifications

### Phase 2: Member Portal (Weeks 9-12)
Registration/login, schedule view, booking/cancellation, waitlists, membership purchase, account management, mobile-responsive

### Phase 3: PT Features (Weeks 13-16)
PT profiles, availability, session booking, independent + gym-affiliated flows, revenue splits

### Phase 4: White-Label Widget (Weeks 17-20)
Shared component extraction, IIFE bundle + Shadow DOM, theming, embed code generator, iframe fallback, CDN deployment

### Phase 5: Polish & Beta Launch (Weeks 21-24)
E2E testing (Playwright), performance, error monitoring (Sentry), Stripe webhook hardening, onboarding polish, beta with 3-5 UK gyms

### Phase 6: Mobile App (Weeks 25-36+)
React Native (Expo), member-facing first, push notifications, PT features, app store submission

---

## Pricing Strategy Options (TBD)

### Option A: Flat Monthly Tiers (Recommended for launch)
| Tier | Members | Price (GBP) |
|---|---|---|
| Starter | Up to 50 | 29/mo |
| Growth | Up to 150 | 49/mo |
| Pro | Up to 400 | 79/mo |

All features included at every tier. 30-day free trial, no credit card required. Annual billing at ~15% discount. Undercuts every competitor. Simple to implement and explain.

### Option B: Revenue Share
1.5-2% of payments processed, floor of 19/mo, cap of 99/mo. Low barrier to entry but unpredictable revenue and incentivises off-platform payments.

### Option C: Hybrid (Long-term consideration)
19/mo base + 0.5-1% on Stripe transactions. Best balance of affordability and revenue upside. More complex to explain. Consider migrating to this once transaction volume data exists.

**Independent PT pricing:** Low flat fee (9-15/mo) or transaction-only (1-2% on session payments).

---

## Go-to-Market (UK)

**Pre-launch:** Build in public (X, Instagram, Reddit combat sports communities). Landing page with waitlist at clinchbooking.com. Identify 5-10 beta gyms via personal network + cold outreach to gyms posting "DM to book" on Instagram.

**Beta:** Hands-on onboarding for 3-5 UK gyms. Import their data, configure everything, embed widget. Collect testimonials and video case studies.

**Growth channels:**
- Word-of-mouth in tight-knit combat sports community
- Content marketing / SEO ("boxing gym booking software UK", "MMA gym management software")
- Social proof (every gym on Clinch becomes a reference customer)
- PT channel (independent PTs evangelize to gyms they train at)
- Referral programme (free month for referring a gym)
- Presence at UK combat sports events and expos

**6-month target:** 20 paying gyms.

---

## Key Risks

| Risk | Mitigation |
|---|---|
| Solo dev bandwidth | Ruthless MVP scoping, phase discipline, no feature creep |
| Stripe Connect complexity | Start integration in Phase 0, use Express accounts |
| Widget cross-browser issues | Test on top 5 CMS platforms, offer iframe fallback |
| Low initial adoption | Beta gyms first, prove value before scaling marketing |
| Competitor response | Move fast, build community loyalty, lean into combat sports identity |

---

## Verification Plan

After each phase, verify:
1. **Phase 0:** Create a gym via API, confirm RLS isolates data, Stripe Connected Account created successfully
2. **Phase 1:** End-to-end: create gym -> add classes -> add member -> assign membership -> Stripe subscription charges successfully
3. **Phase 2:** Member signs up -> browses schedule -> books class -> receives confirmation email -> cancels -> waitlisted member promoted
4. **Phase 3:** PT sets availability -> member books session -> payment processed -> PT receives payout
5. **Phase 4:** Embed widget on test WordPress/Wix site -> member books class through widget -> full flow works
6. **Phase 5:** Run Playwright E2E suite covering all critical paths, load test API, test Stripe webhook failure/retry scenarios
