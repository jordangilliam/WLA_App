# Lint Debt Tracker (2025-11-21)

Snapshot from `npm run lint` (Node 18). Categories:

1. **`react/no-unescaped-entities` (15 errors)**  
   - Affects hero copy in `app/page.tsx`, `app/challenges*`, `app/collections*`, `app/leaderboard`, `app/stocking`, `app/switch-user`, `components/checkin/CheckInFlow`, etc.  
   - Fix: replace `'` with `&rsquo;` / escaped apostrophes or wrap copy in `{`…`}` strings.

2. **React hook dependency warnings (13 files)**  
   - `TeacherDashboardClient`, `dashboard/classes/[classId]`, `explore`, `exports`, `journal-new`, `stocking/[siteId]`, `InteractiveMap`, `GlobalSearchModal`, `NavigationContext`, etc.  
   - Action: memoize callback functions (`useCallback`) or include missing deps if safe. Where async functions defined inline, hoist or disable via ESLint comment if intentional.

3. **`@next/next/no-img-element` (20+ warnings)**  
   - Many marketing/guide pages (fishing, games, gobblers, journal, keys, map).  
   - Strategy: convert to `next/image` when image is static asset. For large tables of icons (keys pages) consider wrapper component to gradually migrate. Some may warrant rule disable if dynamic image sets required.

4. **New components**  
   - `components/offline/SyncStatus.tsx` now flagged for apostrophe; fix alongside category #1.  
   - No unique issues from newly added review panel.

5. **General plan**  
   - Phase A: fix all unescaped apostrophes + `SyncStatus`.  
   - Phase B: address top hook warnings (critical dashboards/maps).  
   - Phase C: audit `<img>` usage—replace easy wins (hero sections) with `next/image`, document exceptions.  
   - Phase D: rerun `npm run lint`, update this file, and keep rule set strict to avoid regressions.

