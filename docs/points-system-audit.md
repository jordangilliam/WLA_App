# Conservation Points Audit

## 1. Current Client-Side Awarding

| Flow | File | Trigger | Points Logic | Persistence |
| --- | --- | --- | --- | --- |
| Lesson quiz + completion | `components/lesson/LessonDisplay.tsx` | Passing score or manual completion | Awards up to 10 pts based on quiz percentage or flat 5 pts for reading completion | Uses `usePoints().award` which only updates localStorage (`ui/points/PointsProvider.tsx`) |
| Habitat builder scoring | `app/habitat/page.tsx` | Habitat simulation score tiers | Awards 50–100% of species-specific base points | Local only (`award`) |
| Field keys (plants/macro/insects/bugs) | `app/keys/*/page.tsx` | Submitting an ID | Awards static points per ID | Local only |
| Journal entry bonus | `app/journal/page.tsx` | Saving an entry | Awards 5 pts | Local only |
| Explore hero buttons | `app/page.tsx` hero CTAs | Clicking themed cards | Awards 5–15 pts for quick tasks | Local only |
| Outreach events | `app/outreach/page.tsx` | Completing an event card | Awards event.points | Local only |
| Species + macro data (fishing page) | `app/fishing/page.tsx` | Logging catches or matching hatches | Awards species.points or challenge points | Local only |
| Terrestrial study cards | `app/terrestrials/page.tsx` | Studying an animal | Awards 25 pts per selection | Local only |

All of these calls ultimately hit the `PointsProvider` hook, which bootstraps from `localStorage` and never reaches Supabase or Next APIs. (`PointsProvider` only stores `user-points` and `user-streak` locally and derives level/badge counts on the fly.)  
```1:76:ui/points/PointsProvider.tsx
'use client';
...
  useEffect(() => {
    const saved = localStorage.getItem('user-points');
    if (saved) {
      setPoints(parseInt(saved, 10));
    }
  }, []);
...
  const addPoints = (amount: number, activity: string) => {
    setPoints(prev => {
      const newTotal = prev + amount;
      localStorage.setItem('user-points', newTotal.toString());
      console.log(`Earned ${amount} points for: ${activity}`);
      return newTotal;
    });
  };
```

## 2. Server/API Awarding Status

| Endpoint | Expected Behavior | Current State |
| --- | --- | --- |
| `POST /api/check-in` | Verify geofence, create check-in record, award base + bonus points, write history | Uses mock location data, calculates `pointsEarned`, but never persists check-in or increments user totals (TODO comments only)  
```86:135:app/api/check-in/route.ts
    let pointsEarned = location.basePoints;
    const isFirstVisit = true;
    if (isFirstVisit) {
      pointsEarned += location.firstVisitBonus;
    }
    ...
    // TODO: Save to database
    // TODO: Update user points
``` |
| `POST /api/story-missions/[missionId]/progress` | Update stage status and award mission XP/points | Persists stage progress in Supabase but no point calculation or bridge to gamification |
| `POST /api/identify` | Run AI ID, log record, award observation points | Persists identifications to Supabase but awards nothing |
| Lesson progress hooks (`useProgress`) | Should sync to Supabase to support leaderboards | Entirely localStorage, no user_id context |

Dashboards consequently display the ephemeral local totals instead of real data. The student dashboard reads `usePoints()` for hero stats, so a refresh on another device resets points.  
```37:128:app/dashboard/student/page.tsx
const { total: points, level, currentStreak, badges } = usePoints();
...
const heroStats = [
  { label: 'Total Points', value: formatNumber(points), icon: ICONS.award },
```
Teacher dashboards show a hard-coded `points_earned_week` placeholder (`app/dashboard/teacher/TeacherDashboardClient.tsx` lines 45-55).

## 3. Gap vs. Gamification Engine

`lib/engine/gamification.ts` already defines level ladders, badge checks, visit/challenge/learning point calculators, and leaderboard helpers. None of the client/UI code calls into this engine, nor is there a backing Supabase table for `user_points`, `point_events`, or `user_stats`. Without a canonical ledger:

- Streaks, badges, and level progression are derived from `points` in local state, diverging from the engine’s `experience`-based rules.
- Leaderboards, exports, and teacher reports cannot be populated because there is no persisted total or ledger to aggregate.
- Mission/check-in APIs must duplicate logic (currently TODOs) instead of reusing `calculateVisitPoints` & `calculateChallengePoints`.

## 4. Recommended Unified Awarding Service

1. **Data Model (Supabase)**
   - `user_point_totals`: `{ user_id PK, total_points, lifetime_points, level, experience, streak_current, streak_updated_at }`
   - `point_events`: append-only ledger with `{ id, user_id, source_type ('lesson' | 'check_in' | ...), source_id, points, metadata JSONB, created_at }`
   - (Optional) `streak_events` and `ambassador_stats` tables to align with `UserStats` from `lib/types/gamification.types.ts`.

2. **Server-side Awarding API**
   - Introduce `POST /api/points/award` (or Supabase RPC) that receives `{ userId, source, points, metadata }`, validates via `gamification` helpers, writes to `point_events`, bumps totals, and returns the updated `level`, `streak`, and newly unlocked badges.
   - All existing actions (check-ins, missions, lessons, journal submissions, AI IDs) call this service instead of `usePoints().award`.
   - Expose a `GET /api/points/summary` for dashboards to render consistent stats.

3. **Client Changes**
   - Replace `usePoints` with a thin cache of server state: fetch summary on mount, optimistically update after `award` calls, invalidate on reconnect, and fall back to local drafts when offline.
   - Keep an offline queue (existing IndexedDB queue) to store pending award events; replay them through the API when connectivity returns.

4. **Telemetry & Dashboards**
   - Teacher dashboard queries `point_events` aggregated by class/student for “Points This Week”.
   - Student dashboard hero stats pull from `user_point_totals`.
   - Leaderboards call `calculateWeeklyLeaderboard` with persisted weekly rollups.

## 5. Next Steps

1. Stand up the `user_point_totals` + `point_events` tables (SQL migration) and seed with existing demo users if needed.
2. Implement `/api/points/award` that wraps `calculateLearningPoints`, `calculateVisitPoints`, etc., and enforces idempotency by hashing `{user, source_type, source_id}`.
3. Update lesson, habitat, journal, keys, mission, and check-in flows to call the new service instead of `usePoints().award`.
4. Refactor `PointsProvider` into a client cache that hydrates from `/api/points/summary`, subscribes to SSE/websocket updates later, and submits offline award events via IndexedDB queue.
5. Drive dashboards/leaderboards off the new API responses so WildPraxis receives authoritative point totals for evaluation and posting.

This audit gives us the authoritative list of touchpoints and the gaps we must address before wiring Explore/Learn/Mission updates or sharing data with external reviewers.

