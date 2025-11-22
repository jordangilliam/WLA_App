# Cross-Device Setup & Environment Verification

Use this checklist whenever you bring the WLA_App repo onto a new laptop (macOS, Windows, or Linux). It covers tool installation, secrets management, and the automated verification script added in Phase 1.

---

## 1. Install Core Tooling

| Tool | Version | Notes |
| --- | --- | --- |
| Node.js | 18.x LTS | Install via nvm (mac/Linux) or official installer (Windows). Enables npm + npx. |
| npm | 9.x | Bundled with Node. Required for Next.js scripts and `tsx`. |
| Git | Latest | Ensure `git config --global user.name/email` set. |
| VS Code | Latest | Recommended editor with TypeScript/ESLint extensions. |
| Xcode Command Line Tools | macOS only | `xcode-select --install` for iOS builds. |
| Android Studio + SDK | Optional | Needed for native Android + FieldQuest testing. |
| Homebrew / Chocolatey | Optional | Simplifies installing CLI dependencies. |

### Additional CLIs
- **Supabase CLI**: `npm install -g supabase` (or Homebrew). Used for local database management and migrations.
- **Stripe CLI**: `brew install stripe/stripe-cli/stripe` or download from stripe.dev. Needed to trigger webhooks.
- **Expo CLI**: `npm install -g expo-cli` (paired with EAS for FieldQuest).
- **Capacitor CLI**: Already in repo deps, but `npm install -g @capacitor/cli` eases native builds.
- **Vercel CLI** (optional): `npm install -g vercel` for on-machine deployments.

---

## 2. Configure Environment Files

Create/refresh the following files (examples live in `env.template` and `FieldQuest/.env.example` if present):

| Target | Location | Purpose |
| --- | --- | --- |
| Web (Next.js) | `.env.local` | Supabase, NextAuth, Mapbox, Stripe, Sentry, Upstash, Cron secrets. |
| Mobile (FieldQuest) | `FieldQuest/.env` | Expo public Supabase/Mapbox values + API base URL. |
| Deployment | Vercel Project Settings | Same keys as `.env.local` but stored securely server-side. |
| Expo/EAS | `eas secrets` | Mirror FieldQuest env vars for cloud builds. |

### Minimum Variables (Web)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_MAPBOX_TOKEN`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_SCHOOL_BASIC`, `STRIPE_PRICE_SCHOOL_PRO`, `STRIPE_PRICE_SCHOOL_UNLIMITED`, `STRIPE_PRICE_DISTRICT`
- `CRON_SECRET`

### Minimum Variables (FieldQuest)
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_API_BASE_URL`
- `EXPO_PUBLIC_MAPBOX_TOKEN`

### Optional / Upcoming Integrations
- `NEXT_PUBLIC_SENTRY_DSN`, `EXPO_PUBLIC_SENTRY_DSN`
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- `INATURALIST_CLIENT_ID`, `INATURALIST_CLIENT_SECRET`
- `BIRDWEATHER_API_KEY`, `MACRO_API_KEY`
- `PURDUE_SOUNDSCAPES_API_URL`, `PURDUE_SOUNDSCAPES_API_KEY`

---

## 3. Generate Keys & Secrets

1. **Supabase**: Project settings → API. Copy Project URL, anon key, and service_role key.
2. **NextAuth**: `openssl rand -base64 32` for `NEXTAUTH_SECRET`. Update `NEXTAUTH_URL` for local (`http://localhost:3000`) vs. prod.
3. **Mapbox**: Account → Tokens. Create dedicated token for WLA (scoped to maps/tiles).
4. **Stripe**: Dashboard → Developers → API keys + webhook signing secret (per environment). Record price IDs for each plan.
5. **Upstash** (optional): Create Redis REST DB for rate limiting.
6. **Sentry**: Project DSN values for both web and FieldQuest.
7. **AI Providers & Soundscapes**: Obtain keys from iNaturalist, BirdWeather (or selected API), macroinvertebrate.org (if available), and Purdue partners.

---

## 4. Run the Verification Script

Once the env files are populated:

```bash
npm install   # ensures devDependency "tsx" is available
npm run verify:env
```

The script (`bin/verify-env.ts`):
- Loads `.env.local`, `.env`, `FieldQuest/.env`, and `FieldQuest/.env.local` automatically.
- Checks for all required categories (Supabase, NextAuth, Mapbox, Stripe, Cron, FieldQuest linkage).
- Warns about optional integrations (Sentry, Upstash, AI adapters, Purdue Soundscapes).
- Exits with code `1` if any required key is missing, preventing builds/deploys.

> **Tip:** Run `npm run verify:env` inside CI before `npm run build` to enforce consistency.

---

## 5. Device-Specific Notes

- **macOS + iOS Builds**
  - Install Xcode + Command Line Tools (`xcode-select --install`).
  - Trust developer certificates and run `npx cap sync ios` after building.
  - For FieldQuest, use `npx expo run:ios` or EAS Build with Apple credentials.

- **Windows**
  - Install Windows Subsystem for Linux (optional) for better scripting.
  - Use PowerShell ≥ 7 for scripts.
  - Ensure `npm config set script-shell powershell.exe` if hitting shell issues.

- **Android**
  - Enable USB debugging on devices.
  - Set `ANDROID_HOME` and add `platform-tools` to PATH.

---

## 6. Troubleshooting

| Issue | Fix |
| --- | --- |
| `npm run verify:env` reports missing variables | Confirm `.env.local` exists, values aren’t quoted, and there are no trailing spaces. |
| Stripe webhook errors | Run `stripe listen --forward-to localhost:3000/api/webhooks/stripe` and ensure `STRIPE_WEBHOOK_SECRET` matches CLI output. |
| Supabase auth errors | Project may be paused—visit Supabase dashboard to resume; verify RLS policies. |
| Mapbox map blank | Token missing or not allowed for domain; regenerate token with Styles:Read + Tiles:Read scopes. |
| FieldQuest cannot reach API | Confirm `EXPO_PUBLIC_API_BASE_URL` matches deployed Next.js domain (https://wla-app.vercel.app, etc.). |

---

## 7. Next Steps

1. Run `npm install` (web) and `cd FieldQuest && npm install`.
2. Execute `npm run verify:env`.
3. Start services:
   - Web: `npm run dev`
   - Mobile: `cd FieldQuest && npm start`
4. Log into Supabase + Stripe CLI for integration testing.
5. Document any machine-specific quirks in this file for future contributors.

