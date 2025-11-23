# Cross-Track Explore & Learn Blueprint

This document translates Plan Sections 3–5 into concrete wiring steps for Explore, Learn, and Mission flows so any student can move outside their “home” track while still surfacing Bucktails/Bass/Brookies/Gobblers/Ursids highlights.

---

## 1. Goals
1. **Track-first storytelling** — highlight the five legacy tracks everywhere, even when students filter by new themes (Species, Waterways, Food Systems, Micro/Macro, Industry, History).
2. **Cross-track discovery** — let students stack filters from `data/taxonomy/pillar-catalog.json`, build bundle queues, and launch Action Studios regardless of assigned track.
3. **Ambassador loop** — tie Explore selections → Learn bundles → Mission stages → point awards, so real-world volunteer work, AI IDs, and workshops flow into the same ledger (see `docs/points-system-audit.md`).

---

## 2. Explore 2.0 (`app/explore/page.tsx`)

| Layer | Implementation Notes |
| --- | --- |
| **Pillar filter pills** | - Import `pillar-catalog.json` (via a lightweight helper, e.g., `lib/data/pillars.ts`).<br>- Replace the current `siteType` dropdown with a pill strip: first row = Tracks (Bucktails → Ursids), second row = Pillars (Species, Waterways, Food, Micro/Macro, Industry, History).<br>- Each pill sets `filters.catalogTags: string[]` in component state. |
| **Data fusion** | - Extend the existing `/api/locations/nearby` response to include `catalogTags` per site (initially derived by matching site metadata to pillar assets; fallback to manual mapping until Supabase supports it).<br>- Filter logic: show sites where `site.catalogTags` intersects the active tags OR the student’s home track. |
| **Sidecar recommendations** | - When a site is selected, fetch recommended Learn bundles & missions by calling a new helper `getPillarRecommendations(site.tags)` (reads the JSON catalog).<br>- Display two cards under the site drawer: “Study Pack” (links to Learn) and “Mission Pack” (links to `/missions`). |
| **Action hooks** | - “Queue for Later” button pushes `{ siteId, pillarId[] }` into IndexedDB (same queue the other agent is wiring). This queue feeds Learn bundles when the student opens `/learn`. |

> **Visibility:** Track hero cards stay pinned at the top of Explore (`Field Site Explorer` hero). Pillar filters never hide the original tracks; they only add overlays.

---

## 3. Learn 2.0 (`app/learn/page.tsx`)

| Layer | Implementation Notes |
| --- | --- |
| **Data source** | - Add `lib/data/pillars.ts` that reads `data/taxonomy/pillar-catalog.json` and exposes helpers like `getPillarAssets('waterways')`.<br>- Merge this with the existing `allLessons` array: if a lesson’s `track` matches a track hero, show under track; if the lesson’s `id` matches a catalog asset, also surface it under the Pillar tab. |
| **Action Studios rail** | - Insert a new section above the lesson cards: `Action Studios`, populated from catalog entries with `type === 'experience'` (e.g., Pollinator Plan, Habitat Simulator, Macro Key).<br>- Each tile includes: `coverageTags`, `requiredLogin` flag, offline capability indicator. |
| **Bundle queue** | - On page load, read the Explore queue (from IndexedDB). For each entry, display a “Queued Bundle” card that lists 3 recommended lessons + 1 Action Studio; clicking consumes the queue item.<br>- When a bundle is launched, emit `POST /api/bundles/launch` so teachers (and WildPraxis) can audit usage. |
| **Telemetry** | - Every Action Studio launch triggers the new point service (`/api/points/award` once implemented). For anonymous sessions, save to offline queue until login. |

---

## 4. Mission Control Enhancements (`app/missions/page.tsx`)

1. **Pillar-aware missions** — Add a “Filters” strip (same tags). Use Supabase column `story_missions.tags` (if missing, store JSON) so students can find missions relevant to Food Systems, Industry, etc.
2. **Location bridge** — Connect `missionLocations` to Explore by storing `field_site_id` references (Plan Section 5). When Explore sends a site bundle, highlight missions whose stages include those sites.
3. **Service opportunities** — Create mission templates for volunteer/workshop/camp events: each mission stage can reference `industry_artifacts` or `food_systems` assets from the catalog to ensure data consistency.
4. **Point integration** — Once `/api/points/award` is live, every completed mission stage triggers `calculateChallengePoints` server-side and syncs to point events (per audit doc).

---

## 5. Ambassador Dashboard Connectors

- **Student dashboard (`app/dashboard/student/page.tsx`)**
  - Replace current `usePoints()` stats with `/api/points/summary`.
  - Add “Latest Bundle” card pulling from the queue / mission completions.
  - Embed “Track Highlights” carousel fed by pillar catalog to remind students of their home track while showing cross-track progress.

- **Teacher dashboard (`app/dashboard/teacher/TeacherDashboardClient.tsx`)**
  - Surface per-pillar participation: query Supabase view `teacher_pillar_engagement` (counts of bundle launches, mission completions).
  - Provide quick links to export per-track/per-pillar CSVs for WildPraxis evaluation (`/exports` enhancements).

---

## 6. Data & API Checklist

1. `data/taxonomy/pillar-catalog.json` — canonical mapping (already added).
2. `lib/data/pillars.ts` — helper that caches catalog data server-side (to be implemented alongside UI changes).
3. `/api/pillars` (optional) — Next route to expose catalog to the browser with caching headers.
4. Explore queue storage — use `lib/offline/bundleQueue.ts` (backed by the new `bundles` store in `lib/offline/offline-queue.ts`) for adding, listing, and consuming queued bundles.
5. Mission tagging — add `tags text[]` or `jsonb` column to `story_missions` via Supabase migration.

---

## 7. Dependencies & Coordination Notes

- The parallel learning-content agent can continue expanding lesson files; as long as they reference `coverageTags` or `track` metadata, they will auto-populate the catalog.
- Before wiring UI, finalize `/api/points/award` so Action Studios and missions accrue conservation points consistently (see `docs/points-system-audit.md`).
- Coordinate via daily diff review to avoid conflicting edits in `app/learn/page.tsx` and mission APIs.

