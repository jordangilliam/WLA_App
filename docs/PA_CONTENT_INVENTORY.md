# Pennsylvania Content & Indigenous Knowledge Inventory

This document catalogs where Pennsylvania-specific, indigenous history, and state park data currently lives in the codebase. Use it as the source of truth when wiring Supabase content into the live app.

---

## 1. Supabase Migrations & Tables

| Migration | Tables / Columns | Purpose |
|-----------|------------------|---------|
| `supabase/migrations/014_species_cards.sql` | `species_cards` (category, rarity, PA-native flag, seasons, discovery points), `user_species_collection`, helper functions (`get_user_species_collection`, `discover_species`) | Pokémon-style wildlife cards for PA species plus user collection tracking. Contains PA-native flag useful for state-focused missions. |
| `supabase/migrations/025_expand_pa_waterways.sql` | Adds dozens of `field_sites` rows with PA waterways (lat/lng geography, habitat notes, species arrays, addresses) | Core dataset for county/state-park waterways, ready for Explore map and fishing hub queries. |
| `supabase/migrations/026_expand_pa_safe_spaces.sql` | Inserts `field_sites` entries for libraries, museums, indigenous/heritage parks, state parks across PA regions | Covers indigenous-informed safe spaces, urban parks, museums—critical for afterschool/summer programming coverage. |
| `supabase/migrations/028_fly_fishing_experts.sql` | `fly_fishing_experts`, `expert_techniques`, `expert_patterns`, `expert_favorite_locations`, `expert_publications`, `fly_fishing_shops` + RLS policies | Structured knowledge for species-specific instruction (Joe Humphreys, George Daniel), PA fly shops, Trout Unlimited chapters. |
| `supabase/migrations/030_pfbc_complete_integration.sql` | `pfbc_stocking_schedules`, `pfbc_access_points`, `pfbc_regulations`, `pfbc_habitat_installations` + seed data + RLS | Live-ready PFBC data: stocking events, access points (state park launch sites), regulations, habitat work. |
| Other supporting migrations | `supabase/migrations/005_add_trout_waters_and_stocking.sql`, `006_statewide_expansion.sql`, `004_seed_pittsburgh_field_sites.sql`, RPC `nearby_field_sites` | Earlier inserts for region-based sites, state parks, and RPC used by Explore map to fetch geospatial results. |

**Action:** Wire front-end queries directly to these tables instead of hard-coded arrays; re-run Supabase type generation (`supabase gen types typescript`) after confirming production DB has the same migrations.

---

## 2. Static Data Files & Curriculum Assets

| File / Directory | Description |
|------------------|-------------|
| `data/pa-waterways-*.ts` (`pa-waterways-expanded`, `pa-waterways-comprehensive`, `pa-waterways-ultra-expansion`, etc.) | Multiple tiers of PA waterways datasets with metadata (regions, best species, highlights) used for UI prototyping. |
| `data/pa-water-bodies-expanded.ts` | Consolidated array of lakes, reservoirs, and park-connected water bodies including amenities. |
| `data/pfbc-*.ts` (`pfbc-complete-data.ts`, `pfbc-mapping-layers.ts`, `pfbc-mapping-layers-expanded.ts`) | Client-side mirrors of PFBC tables (stocking, access points, layers) that should eventually be Supabase-driven. |
| `data/fly-fishing-experts.ts`, `data/pa-fly-shops-*.ts` | Detailed info on experts, Trout Unlimited chapters, and statewide fly shops (services, regions). |
| `data/series/*.json`, `data/sessions/*.json` | Themed content packs (Brookies, Bucktails, etc.) for narrative missions with PA framing. |
| `lib/data/conservation-history.ts` | PA-specific conservation timelines (birds, fisheries, terrestrial) with key species and figures. |
| `lib/data/lessons-cross-cutting.ts`, `lib/data/lessons-aquatic.ts`, `lib/data/lessons-terrestrial.ts` | Lesson blueprints that include indigenous tracking traditions, cultural history callouts, and PA species identifications. |
| `curriculum/lesson-plans/lesson-0*.md` | Markdown lesson plans highlighting indigenous knowledge, state parks, and Pennsylvania examples (e.g., Lesson 02 track identification, Lesson 05 conservation careers). |
| `docs/PA_EXPANSION_GUIDE.md`, `PA_PARKS_EXPLORATION_GUIDE.md`, `REGIONAL_EXPANSION_COMPLETE.md`, `ULTRA_EXPANSION_COMPLETE.md` | Narrative summaries of statewide expansion work that can inform marketing copy. |
| RAD docs (`RAD_PASS_DEVELOPMENT_ROADMAP.md`, `RAD_PASS_LICENSING_GUIDE.md`, `RAD_PASS_LICENSING_GUIDE.md`) | Requirements for RAD Pass partnership, including classroom/afterschool tie-ins. |

**Action:** Treat TS/JSON files as reference data; prioritize migrating the authoritative sets into Supabase (already seeded via migrations) and expose them through typed query helpers. Markdown lessons can remain in filesystem but surface through CMS-like ingestion or API wrappers.

---

## 3. UI Touchpoints Using Hard-Coded PA Content

| Location | Current Behavior | Notes / Next Step |
|----------|------------------|-------------------|
| `app/fishing/page.tsx` | Large client component with inline arrays: `PA_FISH_SPECIES`, state-park cards, PFBC resources, PFBC “sample data” badges | Replace arrays with Supabase-backed data fetched via server component or loader; use caching and streaming to keep performance high. |
| `app/api/pfbc-data/route.ts` | Returns placeholder PASDA arrays for stocking events, access points, best waters | Swap for real Supabase queries against `pfbc_*` tables with query params (county, species, dates). |
| `app/explore/page.tsx` + `app/api/locations/nearby/route.ts` | Explore map already hits `nearby_field_sites` RPC but only selects limited columns | Ensure Supabase RPC returns the newly inserted state parks, indigenous safe spaces, and includes metadata (habitat, indigenous history tags) for filtering. |
| `components/map/*` (`InteractiveMap`, `SiteFilters`, `ProgressHeatmap`) | Filter chips include `state_park`, `museum`, etc. but visuals still use static “demo” data for some overlays | After Supabase wiring, ensure filters reflect new site types (state park, indigenous site, RAD partner). |
| `app/collections/sites/page.tsx`, `app/progress/map/page.tsx` | Site lists/maps contain static entries (Point State Park, Ricketts Glen) | Convert to dynamic lists fed by `field_sites` table with region filters. |
| `app/outreach/page.tsx`, `app/page.tsx`, `app/learn/page.tsx` | Marketing copy already references Pennsylvania agencies; can be enriched with live metrics from Supabase tables (counts of parks, species, etc.). |
| `components/map/SiteFilters.tsx`, `components/map/NearbySitesList.tsx` | UI ready for new filters (state parks, indigenous knowledge). Needs consistent icons and data hydration once API returns richer metadata. |

**Action:** Use this inventory to guide the new query helpers and API routes so these UI surfaces automatically reflect the Supabase datasets without manual duplication.

---

With this catalog complete, continue with the next plan steps: regenerate Supabase types, design query helper modules, and wire data into the UI. Keep this document updated as new datasets land.***

