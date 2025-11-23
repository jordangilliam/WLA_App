# Learning-Agent Handshake & Integration Notes

The other Cursor agent is actively refactoring the learning surfaces (`app/learn`, `app/explore`, `app/fishing`, dashboards, etc.) and has already dropped `docs/PA_CONTENT_INVENTORY.md` as their source of truth. To avoid collisions and keep wiring compatible, use this document as the coordination checklist.

---

## 1. Touchpoints updated in the last 48 hours

| Area | Files currently modified | Notes |
| --- | --- | --- |
| Explore map + field sites | `app/explore/page.tsx`, `app/api/locations/nearby/route.ts` (via git status), `components/map/*` | Other agent is likely rewiring filters/layout. Avoid large refactors until they land their branch; layer new pillar filters via feature flags. |
| Learn surface & onboarding | `app/learn/page.tsx`, `app/page.tsx`, `UI_RESTORED.md` | Their rebuild modernizes hero + sections. Feed new “Action Studios” using helper modules (see below) instead of editing hero markup directly. |
| Dashboards | `app/dashboard/student/page.tsx`, `app/dashboard/teacher/TeacherDashboardClient.tsx`, `components/dashboard/TeacherNav.tsx`, `components/profile/ProfileMenu.tsx` | They are polishing nav + stats. When swapping in `/api/points/summary`, coordinate by leaving TODO comments rather than rewriting components. |
| Fishing / PFBC hub | `app/fishing/page.tsx` | Already being aligned with PA inventory doc; route new data helpers through `lib/data` so both agents share the same APIs. |

> Use `git diff origin/main -- <file>` before editing any of the rows above to understand their latest changes.

---

## 2. New coordination assets (this agent)

| Asset | Purpose | Integration expectation |
| --- | --- | --- |
| `docs/points-system-audit.md` | Canonical map of point-awarding flows + target `/api/points/award` contract | Other agent should wire their new UI surfaces (dashboards, missions, Explore) to the forthcoming point service instead of the `PointsProvider` local storage. |
| `data/taxonomy/pillar-catalog.json` + `docs/education-taxonomy.md` | Pillar/track catalog for Species, Waterways, Food Systems, Micro/Macro, Industry, History | Their learning components can read this catalog (via a helper module) to populate filters, Action Studios, and narrative cards. |
| `docs/cross-track-experience-plan.md` | Explore/Learn/Mission wiring plan | Serves as the blueprint for hooking their layout work into pillar-aware filters and bundle queues. |
| `docs/journal-offline-auth.md` | Offline journaling + auth gating spec | When the other agent touches `app/journal-new` or `app/journal`, match this design so anonymous journaling stays intact while sync + leaderboard actions remain gated. |

All of these docs live in `docs/` and are referenced by plan to ensure we stay compatible.

---

## 3. Contracts & Feature Flags

1. **Pillar helper module** — `lib/data/pillars.ts` now exposes `getPillars`, `getPillarRecommendations`, etc. (all backed by `data/taxonomy/pillar-catalog.json`). Other agent should import from this helper rather than referencing the JSON directly. Add feature flag `NEXT_PUBLIC_ENABLE_PILLAR_FILTERS` so UI scaffolding can ship while we finish data plumbing.
2. **Bundle queue** — `lib/offline/bundleQueue.ts` now wraps the IndexedDB `bundles` store (implemented inside `lib/offline/offline-queue.ts`). Other agent can call `queueBundle`, `listQueuedBundles`, and `consumeBundle` immediately; syncing/telemetry can layer on later.
3. **Point service** — Until `/api/points/award` exists, leave TODO comments near awardable actions (lessons, missions, dashboards) referencing `docs/points-system-audit.md`. When the endpoint ships, swapping from `usePoints().award` to the API requires only the helper call.
4. **Journal gate** — If they touch `app/journal-new/JournalPageClient.tsx`, respect the `JournalAccessGate` pattern described in `docs/journal-offline-auth.md` so offline journaling keeps working.

---

## 4. Working Agreement

1. **Daily diff check**: Before committing, run:
   ```bash
   git fetch origin
   git diff --stat origin/main...HEAD
   git diff origin/main -- app/learn/page.tsx
   ```
   to view their outstanding edits.
2. **Shared notes**: When you add new datasets or curriculum files, append entries to `data/taxonomy/pillar-catalog.json` and (if PA-specific) `docs/PA_CONTENT_INVENTORY.md` so the other agent can consume them immediately.
3. **Coordination log**: If we need longer-term tracking, start `COORDINATION_NOTES.md` in the root and timestamp short notes (e.g., “2025-11-23 – waiting for mission tags migration”) so both agents stay informed.
4. **API stability**: Don’t rename existing API routes (`/api/observations`, `/api/locations/nearby`, `/api/story-missions/*`) without cross-agent agreement; instead, add new routes or versioned handlers.

With these agreements, both agents can continue their workstreams (learning content wiring vs. platform scaffolding) while sharing the same data contracts and avoiding regressions.***

