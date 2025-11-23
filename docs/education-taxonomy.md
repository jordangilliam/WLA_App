# Education Taxonomy Map

This document pairs with `data/taxonomy/pillar-catalog.json` to describe the themed learning pillars that power WildPraxis. Each pillar lists the primary assets already in the repo plus integration notes so the Explore/Learn wiring (and the parallel learning-content agent) can plug into the same structure.

> **How to read the catalog:** `pillar-catalog.json` is the machine-readable index. Each `asset` entry contains the `path`, `type`, and `coverageTags` the UI can consume for filters or feature flags.

---

## 1. Species & Wildlife Management (Bucktails · Gobblers · Ursids)

- **Assets**
  - `lib/data/lessons-terrestrial.ts` — long-form deer/turkey/bear lessons, quizzes, and field labs.
  - `curriculum/lesson-plans/lesson-02-track-identification.md` — classroom flow for track ID, already structured for Action Studios.
  - `app/terrestrials/page.tsx` + `app/gobblers/page.tsx` — interactive study cards, image assets in `public/images/tracks/`.
- **Integration hooks**
  - Use `coverageTags` (tracks/signs/habitat) to pre-filter Learn results when a student switches to a track card.
  - Expose Explore overlays for “Signs to search for” pulled from `app/terrestrials`.
- **Gaps**
  - Needs shared species metadata service + mission templates that tie sign discoveries to Explore check-ins.

## 2. Waterways, Watersheds & Fisheries (Brookies · Bass)

- **Assets**
  - `lib/data/lessons-aquatic.ts` — macro/micro lessons tied to waterways.
  - `data/pa-water-bodies-expanded.ts` + `data/pfbc-complete-data.ts` — 254-site dataset with stocking, regulations, access points.
  - `app/fishing/page.tsx` + `app/stocking/page.tsx` — React experiences already using PFBC data.
- **Integration hooks**
  - Populate Explore filters (“Waterways”, “PFBC Layers”) straight from the catalog entry rather than re-hardcoding Mapbox sources.
  - Link Learn cards to Explore selections by matching water-body `id`.
- **Gaps**
  - Need real water-quality logs + macro dashboards to fulfill “field data logging” requirement.

## 3. Food Systems, Agriculture & Pollinators

- **Assets**
  - `lib/data/pollinator-plants.ts` + `app/pollinators/plan/page.tsx` — keystone plant references and plan builder UX.
  - `curriculum/lesson-plans/lesson-05-conservation-careers.md` — agriculture vs. management pathways.
  - Agricultural content nodes embedded inside `lib/data/lessons-cross-cutting.ts`.
- **Integration hooks**
  - Serve the plan builder as an “Action Studio” tile under Learn for any student toggling the Food Systems filter.
  - Add Explore overlay for partner gardens/CSAs once data arrives (placeholder entry already created in JSON gaps).
- **Gaps**
  - No current Explore layer for community partners; need supabase table + connectors when data is available.

## 4. Micro/Macro Life & Lab Work

- **Assets**
  - `app/keys/macro/page.tsx` and `data/scraped/waterways/hatch-calendar.json` — interactive ID tools + emergent data.
  - `app/habitat/page.tsx` — habitat simulator scoring system (ties to points audit).
  - `AI_IDENTIFICATION_GUIDE.md` — provider wiring for macro + species AI.
- **Integration hooks**
  - Expose `coverageTags` (EPT, AI, lab) as Learn filters and auto-suggest macros on Explore when a macro-rich water body is selected.
  - Align `app/habitat` scoring events with the new point service once built.
- **Gaps**
  - Need offline capture queue that syncs macro samples + AI IDs to the same Supabase tables.

## 5. Industry Artifacts & Conservation Economy

- **Assets**
  - `data/pa-fly-shops-comprehensive.ts`, `data/pfbc-mapping-layers-expanded.ts` — directories of shops, access structures, and PASDA layers.
  - `data/scraped/conservation/conservation-documents.json` — scanned partner docs that can become mission lore.
  - `public/TroutTower/` — interpreted media for exhibits/workshops.
- **Integration hooks**
  - Convert shop + infrastructure entries into `Explore` callouts and mission stages (“Visit a fly shop, interview staff”).
  - Provide teacher exports for industry partners (via `app/exports`).
- **Gaps**
  - Missing narrative/lesson cards linking economic partners to student missions; needs content writer + mission template.

## 6. Historical Narratives & Timelines

- **Assets**
  - `lib/data/conservation-history.ts` — structured timeline (birds, fisheries, terrestrial).
  - `curriculum/lesson-plans/lesson-03-bird-observation.md` — includes tourism/economics history prompts.
  - `PA_EXPANSION_GUIDE.md`, `AUDIT_BENCHMARK_REPORT.md` — published narratives of statewide rollout.
- **Integration hooks**
  - Feed the timeline data into Learn as a “History” filter and push callouts into Explore site detail drawers.
  - Make mission templates for “History Walk” experiences referencing these entries.
- **Gaps**
  - No timeline widgets yet; need lightweight component that reads `conservation-history.ts` and surfaces per-track eras.

---

### How to extend
1. Add/modify catalog entries in `data/taxonomy/pillar-catalog.json`.
2. Reference the same `id` inside new APIs or Supabase tables so Explore/Learn filters remain stable.
3. When wiring UI, read the catalog first—never hardcode the path list (keeps us aligned with the other agent’s work).***

