# Agent 2: Environment Setup Tasks

## Objective
Create `.env.example` template and verify all required environment variables are documented.

## Tasks

### 1. Create `.env.example` File
**File:** `.env.example` (root directory)

**Content:**
```bash
# ============================================================================
# SUPABASE CONFIGURATION
# ============================================================================
# Get these from: https://app.supabase.com → Your Project → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# ============================================================================
# NEXTAUTH CONFIGURATION
# ============================================================================
# Generate secret: openssl rand -base64 32
NEXTAUTH_SECRET=your-nextauth-secret-here
# Production URL (update after deployment)
NEXTAUTH_URL=https://your-domain.vercel.app
# Local development URL
# NEXTAUTH_URL=http://localhost:3000

# ============================================================================
# MAPBOX CONFIGURATION
# ============================================================================
# Get token from: https://account.mapbox.com/access-tokens/
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1...  # Same as above
NEXT_PUBLIC_MAPBOXGL_ACCESS_TOKEN=pk.eyJ1...  # Same as above

# ============================================================================
# STRIPE CONFIGURATION (Optional - for payments)
# ============================================================================
# Get from: https://dashboard.stripe.com/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs (create products in Stripe dashboard)
STRIPE_PRICE_SCHOOL_BASIC=price_...
STRIPE_PRICE_SCHOOL_PRO=price_...
STRIPE_PRICE_SCHOOL_UNLIMITED=price_...
STRIPE_PRICE_DISTRICT=price_...

# ============================================================================
# APPLICATION CONFIGURATION
# ============================================================================
NEXT_PUBLIC_APP_VERSION=1.0.0
NODE_ENV=production

# ============================================================================
# OPTIONAL: MONITORING & ANALYTICS
# ============================================================================
# Sentry (error tracking)
# NEXT_PUBLIC_SENTRY_DSN=https://...

# Upstash Redis (rate limiting)
# UPSTASH_REDIS_REST_URL=https://...
# UPSTASH_REDIS_REST_TOKEN=...

# ============================================================================
# OPTIONAL: AI PROVIDERS (for future features)
# ============================================================================
# INATURALIST_CLIENT_ID=...
# INATURALIST_CLIENT_SECRET=...
# BIRDWEATHER_API_KEY=...
# MACRO_API_KEY=...
```

### 2. Update `bin/verify-env.ts`
**File:** `bin/verify-env.ts`

**Action:** Ensure the script checks for all required variables listed above.

**Test:** Run `npm run verify:env` to confirm it works.

### 3. Create Environment Variable Documentation
**File:** `ENV_VARIABLES.md`

**Content should include:**
- Description of each variable
- Where to get the value
- Required vs optional
- Default values (if any)
- Security notes

### 4. Verify Current `.env.local` Structure
**Action:** Check if `.env.local` exists and document which variables are currently set (without exposing values).

**Output:** Create `ENV_STATUS.md` with:
- ✅ Variables that are set
- ⚠️ Variables that are missing
- 📝 Notes about any issues

## Verification Steps

1. ✅ `.env.example` file created with all variables
2. ✅ `npm run verify:env` passes
3. ✅ Documentation created
4. ✅ No sensitive data committed to git

## Files to Create/Modify
- `.env.example` (new)
- `ENV_VARIABLES.md` (new)
- `ENV_STATUS.md` (new, optional)
- `bin/verify-env.ts` (verify, update if needed)

## Notes
- Never commit actual secrets to git
- `.env.example` should be committed
- `.env.local` should be in `.gitignore`
- Use descriptive comments in `.env.example`

