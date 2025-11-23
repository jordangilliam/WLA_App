# Merge Checklist for Agent Integration

**Date:** 2025-01-23  
**Purpose:** Step-by-step checklist for merging two agents' workstreams

---

## Pre-Merge Verification

### 1. File Status Check
- [ ] Run `git status -sb` to see all modified files
- [ ] Identify overlapping files (see COORDINATION_NOTES.md section 2)
- [ ] Review uncommitted changes: `git diff --stat`

### 2. Backup Current State
- [ ] Create a backup branch: `git branch backup-pre-merge-$(date +%Y%m%d)`
- [ ] Stash current changes: `git stash push -m "Platform agent changes before merge"`

### 3. Review Other Agent's Changes
- [ ] Review `app/explore/page.tsx` changes: `git diff HEAD -- app/explore/page.tsx`
- [ ] Review `components/map/SiteFilters.tsx`: `git diff HEAD -- components/map/SiteFilters.tsx`
- [ ] Review `components/map/InteractiveMap.tsx`: `git diff HEAD -- components/map/InteractiveMap.tsx`
- [ ] Review `components/checkin/CheckInFlow.tsx`: `git diff HEAD -- components/checkin/CheckInFlow.tsx`
- [ ] Review `lib/offline/offline-queue.ts`: `git diff HEAD -- lib/offline/offline-queue.ts`

---

## Merge Execution

### Phase 1: Helper/Data Layer (Lowest Risk)

- [ ] Verify `lib/data/pillars.ts` exists and exports correctly
- [ ] Verify `lib/types/pillar.types.ts` exists
- [ ] Verify `data/taxonomy/pillar-catalog.json` exists
- [ ] Verify `lib/offline/bundleQueue.ts` exists
- [ ] **Action:** These files are new, no merge needed - commit separately

### Phase 2: API Layer (Medium Risk)

- [ ] Verify `app/api/pillars/route.ts` exists
- [ ] Verify `app/api/telemetry/explore/route.ts` exists
- [ ] **Action:** These files are new, no merge needed - commit separately

#### Merge `app/api/locations/nearby/route.ts`
- [ ] Apply stash: `git stash pop`
- [ ] Review conflicts in `app/api/locations/nearby/route.ts`
- [ ] Verify `trackTags` and `pillarTags` derivation functions exist (lines 267-376)
- [ ] Verify transformed sites include `trackTags` and `pillarTags` (lines 292-293)
- [ ] Test API endpoint: `curl "http://localhost:3000/api/locations/nearby?lat=40.4406&lng=-79.9959&radius=50000"`
- [ ] Verify response includes `trackTags` and `pillarTags` fields

### Phase 3: Component Layer (Higher Risk)

#### Merge `components/map/SiteFilters.tsx`
- [ ] Review current file for track/pillar filter chips (lines 111-163)
- [ ] Verify `trackFilters` and `pillarFilters` props are accepted
- [ ] Verify `toggleArrayFilter` function handles both `trackTags` and `pillarTags`
- [ ] Test component renders correctly with new filters
- [ ] Verify styling matches other agent's UI updates

#### Merge `components/map/InteractiveMap.tsx`
- [ ] Review `MapFieldSite` interface includes `trackTags` and `pillarTags`
- [ ] Verify map markers display correctly
- [ ] Test site selection passes full site data including tags

#### Merge `components/checkin/CheckInFlow.tsx`
- [ ] Verify `CheckInResultPayload` type includes `pointsEarned`, `isFirstVisit`, `achievements`
- [ ] Verify success callback passes payload to parent
- [ ] Test check-in flow end-to-end
- [ ] Verify celebration component receives correct data

### Phase 4: Page Layer (Highest Risk)

#### Merge `app/explore/page.tsx`
- [ ] **Critical:** This file has the most overlap
- [ ] Review other agent's UI changes (hero, layout, styling)
- [ ] Preserve new features:
  - [ ] Pillar filter state (lines 67-68)
  - [ ] Filter application logic (lines 261-269)
  - [ ] Telemetry sending (lines 204-212)
  - [ ] Recommendations fetching (lines 353-370)
  - [ ] Check-in celebration (lines 90-96, 400-420)
- [ ] Preserve other agent's UI:
  - [ ] Hero section styling
  - [ ] Layout improvements
  - [ ] Component structure
- [ ] Test Explore page loads correctly
- [ ] Test filters work (track and pillar)
- [ ] Test recommendations appear
- [ ] Test check-in flow triggers celebration

### Phase 5: Database Migration

- [ ] Verify `supabase/migrations/031_explore_activity_log.sql` exists
- [ ] Apply migration to database:
  ```bash
  # Via Supabase CLI
  supabase migration up
  
  # Or via dashboard: Copy SQL and run in SQL editor
  ```
- [ ] Verify table created: `SELECT * FROM explore_activity_log LIMIT 1;`
- [ ] Verify RLS policies: Test insert/select as authenticated user
- [ ] Verify indexes exist: `\d explore_activity_log` (in psql)

---

## Post-Merge Testing

### Build & Lint
- [ ] Run `npm run build` - should complete without errors
- [ ] Run `npm run lint` - should pass (warnings OK, errors must be fixed)
- [ ] Fix any TypeScript errors
- [ ] Fix any critical linting errors

### Integration Tests

#### Test 1: Explore Map with Pillar Filters
- [ ] Navigate to `/explore`
- [ ] Verify map loads with field sites
- [ ] Click track filter chip (e.g., "Brookies")
- [ ] Verify sites filter correctly
- [ ] Click pillar filter chip (e.g., "Waterways")
- [ ] Verify combined filters work
- [ ] Check browser console for errors

#### Test 2: Site Recommendations
- [ ] Select a site on Explore map
- [ ] Verify recommendations panel appears
- [ ] Verify recommendations match site's trackTags/pillarTags
- [ ] Click "Queue for Later" on a recommendation
- [ ] Verify bundle appears in IndexedDB (check DevTools > Application > IndexedDB)

#### Test 3: Check-In Flow with Awards
- [ ] Navigate to `/explore`
- [ ] Select a site within check-in range
- [ ] Click "Check In"
- [ ] Complete check-in flow (photo, observation)
- [ ] Verify celebration animation shows points earned
- [ ] Verify points update in dashboard (may still be localStorage)
- [ ] Check browser console for telemetry errors

#### Test 4: Telemetry Logging
- [ ] Perform actions in Explore (filter changes, check-ins)
- [ ] Check Supabase `explore_activity_log` table:
  ```sql
  SELECT * FROM explore_activity_log 
  ORDER BY created_at DESC 
  LIMIT 10;
  ```
- [ ] Verify events are logged correctly

### Regression Tests

- [ ] Test Learn page still works (`/learn`)
- [ ] Test Dashboard still works (`/dashboard/student`)
- [ ] Test Fishing page still works (`/fishing`)
- [ ] Test Check-in flow still works
- [ ] Test Map still displays sites
- [ ] Test Navigation still works

---

## Known Issues & TODOs

### Immediate Issues
- [ ] Point system still uses localStorage - needs server-side implementation
- [ ] Learn page doesn't use pillars yet - opportunity for future enhancement
- [ ] Dashboard points still local - needs `/api/points/summary` integration

### Future Enhancements
- [ ] Integrate pillars into Learn page
- [ ] Implement server-side point system
- [ ] Add journal offline sync
- [ ] Wire missions to pillar recommendations

---

## Rollback Plan

If merge causes critical issues:

1. **Revert to backup branch:**
   ```bash
   git checkout backup-pre-merge-YYYYMMDD
   ```

2. **Or reset to last known good commit:**
   ```bash
   git log --oneline -10  # Find good commit
   git reset --hard <commit-hash>
   ```

3. **Restore stashed changes:**
   ```bash
   git stash list
   git stash apply stash@{0}
   ```

---

## Sign-Off

- [ ] All merge steps completed
- [ ] All tests passed
- [ ] No critical errors
- [ ] Documentation updated
- [ ] Ready for production

**Completed by:** _______________  
**Date:** _______________  
**Notes:** _______________

