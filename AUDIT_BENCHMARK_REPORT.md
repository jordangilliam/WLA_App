## Repo & Experience Audit (2025-11-21)

### 1. Inventory Snapshot
- `app/` – Next.js App Router tree with ~50 routes (dashboards, journal, collections, exports, keys, etc.). Heavy use of server components plus API routes under `app/api/*` for classes, challenges, automations, exports, cron jobs, etc.
- `components/` – Reusable React UI (celebrations, check-in flow, dashboards, layout nav, map widgets, offline helpers, journal entries, auth modals).
- `lib/` – Core logic (Supabase client, gamification engine, hooks, offline queue, payments, monitoring, validation) plus SQL schema/migrations under `lib/db`.
- `supabase/` – Additional migrations + `functions/sync-pfbc-stocking`.
- `FieldQuest/` – Expo + React Native mobile experience with Zustand stores, Mapbox integration, Supabase edge function clients, seed scripts, and status docs.
- `public/` – PWA assets, service worker, `TroutTower` legacy game bundle (~100 files) and general media.
- `data/`, `curriculum/`, `legal/`, `scripts/`, `styles/`, `ui/`, `docs` (`ARCHITECTURE.md`, deployment guides, etc.) provide supporting content.

Observations:
- Multiple deployment docs (`DEPLOYMENT.md`, `DEPLOYMENT-GUIDE.md`, `DEPLOYMENT_GUIDE.md`, `DEPLOYMENT_CHECKLIST.md`) and migration histories create duplication—needs consolidation into a single source of truth.
- FieldQuest already mirrors Pokémon GO loop (spawns, encounters, AR fallback) but RN screens/Map components are still stubs per `IMPLEMENTATION-STATUS.md`.
- Monorepo currently flat; no workspace separation for shared code. `lib/types` reused by both web/mobile but not exposed formally.
- `.env.example` exists but web/mobile/env instructions spread across several docs; no automated validation script yet.
- Legacy content (`public/TroutTower`, `YOUR-14-VALUES.txt`) should be tagged/archived to avoid bloated deployments.

### 2. Benchmark Alignment
**Duolingo (progression/streak discipline):**
- Strengths: Existing achievements, streaks, celebration modals (`components/celebrations/*`), progress maps, teacher dashboards.
- Gaps: Need consistent “daily quests” surface, hearts/energy-like mechanic, and proactive teacher nudges similar to Duolingo classroom analytics. Recommendation: centralize progression logic in `lib/engine/gamification.ts` with streak decay rules + push/email prompts.

**Pokémon GO (FieldQuest geo loop):**
- Foundation: Supabase migrations (`lib/db/migrations/010_fieldquest.sql`), edge functions, Zustand stores, Mapbox RN scaffolding, anti-cheat + encounter logic already defined.
- Gaps: RN UI screens missing; need high-polish spawn/encounter UX, AR/fallback interactions, reward animations, and telemetry piped back to web dashboards so teachers can monitor live encounters (parity with Pokémon GO events dashboard).

**ClassDojo (teacher/admin experience):**
- Strengths: `app/dashboard/teacher/*`, `components/dashboard/*`, exports, automations, onboarding docs.
- Gaps: Need real-time comms/notifications, easier parent involvement, and mobile-usage analytics embedded in teacher view. Suggest adding live status cards (students online, FieldQuest catches, AI identifications awaiting approval) plus automated weekly summaries similar to ClassDojo reports.

### 3. Critical Gaps & Recommendations
1. **Monorepo Hygiene**
   - Introduce workspaces (`apps/web`, `apps/mobile`, `packages/shared`) to formalize shared TypeScript types, utilities, and AI adapters. Keeps Supabase types, gamification logic, and new AI services consistent across platforms.
2. **Environment & Tooling**
   - Create `bin/verify-env.ts` to ensure Supabase, Stripe, NextAuth, Mapbox, Sentry, Upstash, Purdue Global Soundscapes, and AI provider keys are present before builds (mirrors Duolingo’s internal env gating).
   - Add onboarding script for new laptops (Node, npm, Expo CLI, Capacitor, Stripe CLI, Supabase CLI) documenting OS-specific steps and linking to map token setup.
3. **Security & Monitoring**
   - Reconfirm Supabase RLS policies and NextAuth middleware coverage; expand audit logging for payments, AI requests, exports, and FieldQuest telemetry. Add Sentry instrumentation for both Next.js and Expo apps.
4. **Payments Readiness**
   - Run Stripe CLI webhooks against `app/api/webhooks/stripe/route.ts`, ensure `lib/payments/stripe.ts` handles subscription state transitions, and expose license status on admin dashboards (district vs school tiers).
5. **AI Identification Suite**
   - Build modular adapters in `lib/ai/identification/` with providers: iNaturalist API, BirdWeather/bird-song model, macroinvertebrate.org dataset. Provide offline fallback using TensorFlow.js/TFLite models bundled in FieldQuest and PWA.
   - Integrate into `components/checkin/PhotoCapture.tsx` + journal flows with teacher review pipelines, storing confidence scores + provider metadata for auditing.
6. **Global Soundscapes Integration**
   - Extend journal to capture field audio (web + FieldQuest) with metadata, exportable to Purdue’s Global Soundscapes program via opt-in API. If unavailable, scaffold sibling repo (`global-soundscapes-hub`) to host recordings and analytics for Penn State Extension proposals.
7. **Engagement Enhancements**
   - Gamification pass referencing Duolingo/ClassDojo: add daily streak reminders, progress ladders, teacher shoutouts, parent digests.
   - FieldQuest parity with Pokémon GO: finalize map/encounter screens, polish AR interactions, and integrate telemetry charts into teacher dashboards.
8. **Documentation Cleanup**
   - Merge duplicative deployment/migration docs, keep `README.md`, `ARCHITECTURE.md`, `SUPABASE_SETUP_GUIDE.md`, and new “Experience Playbook” as canonical references.
   - Add “New Device Setup” and “AI Usage & Review” guides per plan.

### Content & Data Review Highlights
- `curriculum/lesson-plans/lesson-01`–`05` align with current ambassador tracks but lack audio/soundscape prompts—opportunity to append Global Soundscapes activities.
- `data/series/*` and `data/sessions/*` JSON sets (Bass, Brookies, Bucktails, Gobblers, Ursids) still reference 2024 dates; need refresh for upcoming season.
- `supabase/migrations` include trout stocking, statewide expansion, challenges, leaderboards, species cards, and photo challenges; confirm latest migration order matches `MIGRATION_HISTORY_COMPLETE.md`.
- `public/TroutTower` artifacts inflate repo size (legacy desktop game). Archive externally or convert into optional download to streamline deployments.
- Legal docs (`legal/*.md`) last updated early 2025; ensure AI identification + audio capture flows reflected in privacy policy (COPPA/FERPA, sound recordings).
- `FieldQuest/FIELDQUEST-PROGRESS.md` and `IMPLEMENTATION-STATUS.md` show clear backlog for RN screens and Mapbox integration; sync with teacher dashboard requirements once telemetry added.

### 4. Immediate Next Steps
1. Finalize workspace re-org and env verification tooling.
2. Run Supabase + NextAuth health checks, add test harnesses.
3. Execute Stripe CLI tests and surface payment states in admin UI.
4. Kick off AI adapter implementation + teacher review UX.
5. Prototype Global Soundscapes export + fallback repo scaffold.
6. Plan FieldQuest UI sprint for Pokémon GO feature parity.
7. Update docs/test matrix per plan (QA + deployment playbooks).

This audit confirms the current monorepo foundation is solid and highlights the key actions required to reach Duolingo/Pokémon GO/ClassDojo engagement levels while delivering the AI identification and Global Soundscapes goals.

