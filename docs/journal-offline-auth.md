# Journal Offline & Auth Gating Plan

Youth need a full-featured journal that works offline, yet WildPraxis still has to moderate shared data, leaderboards, and geo-tracked missions. This plan defines how we separate “local-first journaling” from “cloud-synced impact” without blocking creativity.

---

## 1. Current State Summary

- `app/journal/page.tsx` already runs completely offline: entries live in `localStorage` (`wla-journal-entries`) and a quick add awards 5 client-side points via `usePoints().award`.  
- `app/journal-new/JournalPageClient.tsx` is the authenticated experience that pulls from `/api/observations` and requires login before rendering.
- There is no bridge between the two experiences, and uploading observations to WildPraxis/personal clouds currently requires being logged in.

---

## 2. Experience Requirements

| Capability | Offline / Anonymous | Authenticated (student logged in) |
| --- | --- | --- |
| Create/edit/delete journal entries | ✅ (full fidelity, stored locally) | ✅ (local first, with optional sync on save) |
| Attach photos/audio (cached locally) | ✅ (stores base64 strings/Blob URLs) | ✅ (upload queue + Supabase storage) |
| Access leaderboard, missions, check-ins | 🚫 (show CTA to log in) | ✅ (after auth) |
| Export locally (TXT/CSV) | ✅ | ✅ |
| Export to personal cloud (Drive/OneDrive) | Prompt login to authorize provider | ✅ (reuse `app/api/export/*`) |
| Submit to WildPraxis / leaderboard scoring | Prompt login; queue until authenticated | ✅ (calls new `/api/journal/sync`) |
| Geolocated missions / AI ID | CTA to log in; allow offline draft but mark as “pending sync” | ✅ (verifies user + location) |

---

## 3. Architecture

### 3.1 Local Storage & IndexedDB
1. Replace `localStorage` in `app/journal/page.tsx` with the existing IndexedDB helpers (`lib/offline/indexeddb.ts`) so large media + audio recordings can be stored offline.
2. Define a shared record shape in `lib/types/journal.types.ts`, e.g.:
   ```ts
   type LocalJournalEntry = {
     id: string;
     createdAt: number;
     entryType: 'observation' | 'reflection' | 'data' | 'photo';
     content: string;
     media?: { type: 'photo' | 'audio'; payload: string };
     location?: { lat: number; lng: number; accuracy?: number };
     tags: string[];
     mood?: string;
     syncStatus: 'local' | 'queued' | 'synced' | 'failed';
   };
   ```
3. Expose a `useJournalStore()` hook that both `app/journal/page.tsx` and `app/journal-new/JournalPageClient.tsx` can consume so drafts are identical regardless of auth state.

### 3.2 Sync Service
1. Create `/api/journal/sync` that accepts `{ entries: LocalJournalEntry[] }`. It:
   - Requires auth (NextAuth session).
   - Deduplicates based on `{user_id, entry.id}`; new entries insert into Supabase `observations`.
   - Uploads media to Supabase storage (or student-selected cloud) and replaces base64 payloads with signed URLs.
   - Returns which entries synced + new server IDs so the local store can mark them as `synced`.
2. Add `JournalSyncService` (client) that:
   - Watches for auth changes. When a user logs in, reads all `syncStatus: 'queued'` entries and POSTs them.
   - Handles retries/backoff and shows progress to the student (“3 journal entries ready to upload” banner).

### 3.3 Auth Gating Component
Wrap both journal routes with a shared `JournalAccessGate`:
```tsx
<JournalAccessGate
  requireAuthFor={['cloudExports', 'leaderboards', 'geoMissions']}
>
  <JournalPage />
</JournalAccessGate>
```
- Anonymous users see inline notices (“Log in to sync with WildPraxis”) but can continue editing locally.
- When they tap “Sync now” the gate routes them through `/auth?callback=/journal`.

### 3.4 Teacher / WildPraxis Integration
1. Every synced entry triggers:
   - `/api/points/award` (when implemented) so journaling credits points server-side.
   - Optional webhook to WildPraxis (“new journal submission awaiting review”).
2. Teachers view pending entries via `/api/observations?status=pending` (already scaffolded); show provenance badge (“Offline → Synced on Nov 23”).

### 3.5 Personal Cloud Uploads
1. Reuse the existing export endpoints under `app/api/export/*`. Require login to initiate OAuth tokens.
2. From the offline journal, offer a “Save to my Drive/OneDrive” button:
   - If unauthenticated, prompt login with message: “We’ll sync your local entries after you connect your account.”
   - After auth, the queue uploads to both Supabase (for teachers) and the personal cloud (for the student).

---

## 4. UI Changes

1. **Journal switcher** — Add tabs at `/journal`:
   - “Local Notebook” (old offline UI) → always accessible.
   - “Synced Feed” (existing `/journal-new`) → disabled state until login.
2. **Sync banners** — Show a persistent CTA (“3 entries waiting to sync · Sign in to share with your mentor.”).
3. **Geo features** — Keep geolocation capture available offline (already in `getCurrentLocation`). Mark entries that include GPS but are unsynced so the missions system can later credit real site visits.
4. **Audit log** — Provide a toggle for students to send a copy to their guardians/backpack; store this preference locally.

---

## 5. Implementation Steps

1. Abstract journal storage into `lib/journal/localStore.ts` (wraps IndexedDB + fallback to localStorage).
2. Build new `/api/journal/sync` route and Supabase table migration.
3. Update both journal pages to use `useJournalStore`. `app/journal-new` filters by `syncStatus` and merges with server entries.
4. Add `JournalAccessGate` + UI messaging for auth-required actions (leaderboards, check-ins, cloud exports, geo missions).
5. Wire exports + WildPraxis uploads to the sync queue so they only fire when logged in.

Result: Students can always journal, even offline. When they decide to publish or participate in missions/leaderboards, they authenticate once, sync their queue, and WildPraxis receives real data for evaluation and posting.

