# Environment Variables Documentation

Complete guide to all environment variables used in WildPraxis.

---

## Required Variables

These variables **must** be set for the application to function.

### Supabase Configuration

| Variable | Description | Where to Get | Example |
|----------|-------------|--------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase Dashboard → Settings → API | `https://xyz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anonymous key | Supabase Dashboard → Settings → API | `eyJhbGci...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-side only) | Supabase Dashboard → Settings → API | `eyJhbGci...` |
| `SUPABASE_KEY` | Alternative name for anon key (used in scripts) | Same as anon key | `eyJhbGci...` |

**Security Notes:**
- ✅ `NEXT_PUBLIC_*` variables are exposed to the client
- 🔒 `SUPABASE_SERVICE_ROLE_KEY` should NEVER be exposed to the client
- 🔒 Service role key bypasses Row Level Security - use with caution

### NextAuth Configuration

| Variable | Description | Where to Get | Example |
|----------|-------------|--------------|---------|
| `NEXTAUTH_SECRET` | Secret for signing tokens | Generate: `openssl rand -base64 32` | `abc123...` |
| `NEXTAUTH_URL` | Full URL of your application | Your domain or `http://localhost:3000` | `https://wildpraxis.com` |

**Security Notes:**
- 🔒 Keep `NEXTAUTH_SECRET` secure and never commit to git
- ⚠️ `NEXTAUTH_URL` must match your deployment URL exactly

### Mapbox Configuration

| Variable | Description | Where to Get | Example |
|----------|-------------|--------------|---------|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox access token | [Mapbox Account](https://account.mapbox.com/access-tokens/) | `pk.eyJ1...` |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Same as above (alias) | Same as above | `pk.eyJ1...` |
| `NEXT_PUBLIC_MAPBOXGL_ACCESS_TOKEN` | Same as above (alias) | Same as above | `pk.eyJ1...` |

**Notes:**
- All three variables should have the same value
- Required for interactive maps functionality

---

## Optional Variables

These variables enable additional features but are not required for basic functionality.

### Stripe Payment Processing

| Variable | Description | Required For | Where to Get |
|----------|-------------|--------------|--------------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | School subscriptions | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `STRIPE_SECRET_KEY` | Stripe secret key | Payment processing | Stripe Dashboard |
| `STRIPE_WEBHOOK_SECRET` | Webhook endpoint secret | Webhook verification | Stripe Dashboard → Webhooks |
| `STRIPE_PRICE_SCHOOL_BASIC` | Basic plan price ID | Basic subscriptions | Stripe Dashboard → Products |
| `STRIPE_PRICE_SCHOOL_PRO` | Pro plan price ID | Pro subscriptions | Stripe Dashboard → Products |
| `STRIPE_PRICE_SCHOOL_UNLIMITED` | Unlimited plan price ID | Unlimited subscriptions | Stripe Dashboard → Products |
| `STRIPE_PRICE_DISTRICT` | District plan price ID | District subscriptions | Stripe Dashboard → Products |

**When to Set:**
- Only required if enabling paid school subscriptions
- Can skip for free/grant-funded deployments

### Application Configuration

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `NEXT_PUBLIC_APP_VERSION` | Application version number | `1.0.0` | `1.2.3` |
| `NODE_ENV` | Environment mode | `development` | `production` |

### Cron Jobs

| Variable | Description | Required For | Example |
|----------|-------------|--------------|---------|
| `CRON_SECRET` | Secret for protecting cron endpoints | Scheduled tasks | `random-secret-string` |

**When to Set:**
- Required for PFBC data sync scheduled tasks
- Generate: `openssl rand -base64 32`

### FieldQuest Mobile App

| Variable | Description | Required For | Example |
|----------|-------------|--------------|---------|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase URL for mobile | FieldQuest app | `https://xyz.supabase.co` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key for mobile | FieldQuest app | `eyJhbGci...` |
| `EXPO_PUBLIC_MAPBOX_TOKEN` | Mapbox token for mobile | FieldQuest maps | `pk.eyJ1...` |
| `EXPO_PUBLIC_API_BASE_URL` | Web API base URL | FieldQuest sync | `https://wildpraxis.com` |

**When to Set:**
- Only required if deploying the FieldQuest mobile app
- Can skip for web-only deployments

### Monitoring & Error Tracking

| Variable | Description | Required For | Where to Get |
|----------|-------------|--------------|--------------|
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry error tracking (web) | Error monitoring | [Sentry Dashboard](https://sentry.io/) |
| `EXPO_PUBLIC_SENTRY_DSN` | Sentry error tracking (mobile) | Mobile error monitoring | Sentry Dashboard |

**When to Set:**
- Highly recommended for production deployments
- Free tier available at Sentry.io

### Rate Limiting

| Variable | Description | Required For | Where to Get |
|----------|-------------|--------------|--------------|
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL | API rate limiting | [Upstash Console](https://console.upstash.com/) |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token | API rate limiting | Upstash Console |

**When to Set:**
- Optional for small deployments
- Recommended for public-facing APIs

### AI Identification Providers

| Variable | Description | Required For | Where to Get |
|----------|-------------|--------------|--------------|
| `INATURALIST_CLIENT_ID` | iNaturalist OAuth client ID | Species identification | [iNaturalist Settings](https://www.inaturalist.org/oauth/applications) |
| `INATURALIST_CLIENT_SECRET` | iNaturalist OAuth secret | Species identification | iNaturalist Settings |
| `BIRDWEATHER_API_KEY` | BirdWeather API key | Bird sound identification | [BirdWeather](https://app.birdweather.com/) |
| `BIRDWEATHER_API_URL` | BirdWeather API endpoint | Bird identification | `https://app.birdweather.com/api/v1` |
| `MACRO_API_KEY` | Macro API key | Advanced AI features | Contact provider |
| `MACRO_API_URL` | Macro API endpoint | Advanced AI features | Contact provider |
| `NEXT_PUBLIC_AI_GATEWAY_URL` | AI Gateway URL | AI features | Your AI gateway |

**When to Set:**
- Only required when enabling AI-powered species identification
- Currently in development, not required for MVP

### Global Soundscapes Integration

| Variable | Description | Required For | Where to Get |
|----------|-------------|--------------|--------------|
| `PURDUE_SOUNDSCAPES_API_URL` | Purdue Soundscapes API | Soundscape exports | Contact Purdue |
| `PURDUE_SOUNDSCAPES_API_KEY` | Purdue API key | Soundscape integration | Contact Purdue |

**When to Set:**
- Only if partnering with Purdue's Global Soundscapes project
- Not required for standard deployments

---

## Environment-Specific Configuration

### Local Development (.env.local)

```bash
# Minimum required for local development
NEXT_PUBLIC_SUPABASE_URL=https://vaqcsbneypmdhrqnnjph.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
SUPABASE_SERVICE_ROLE_KEY=your-key
SUPABASE_KEY=your-key
NEXTAUTH_SECRET=local-secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_MAPBOX_TOKEN=your-token
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your-token
NEXT_PUBLIC_MAPBOXGL_ACCESS_TOKEN=your-token
```

### Production (Vercel/Netlify)

```bash
# All required variables
# Plus optional variables based on features enabled
NODE_ENV=production
NEXTAUTH_URL=https://your-production-domain.com
# ... all other variables
```

### Staging (Optional)

```bash
# Same as production but with staging URLs
NEXTAUTH_URL=https://staging.your-domain.com
# Use test Stripe keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

---

## Security Best Practices

### ✅ DO:
- Use different secrets for each environment
- Rotate secrets regularly
- Use environment variable management (Vercel secrets, etc.)
- Keep `.env.local` in `.gitignore`
- Use strong random values for secrets
- Limit service role key usage to server-side only

### ❌ DON'T:
- Commit `.env.local` to git
- Share secrets in Slack/email
- Use the same secrets across environments
- Expose service role key to client
- Use weak/predictable secrets

---

## Troubleshooting

### "Missing environment variables" error

**Symptoms:**
- Build fails with environment variable errors
- Application crashes on startup

**Solutions:**
1. Verify all required variables are set
2. Check variable names match exactly (case-sensitive)
3. Run: `npm run verify:env`
4. Check for trailing spaces in values

### "Invalid Supabase credentials" error

**Symptoms:**
- Database queries fail
- Authentication doesn't work

**Solutions:**
1. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
2. Check anon key is valid and not expired
3. Ensure project is not paused in Supabase dashboard
4. Verify Row Level Security policies

### "Map not loading" error

**Symptoms:**
- Map tiles don't load
- Blank map area

**Solutions:**
1. Verify Mapbox token is valid
2. Check token scopes include map access
3. Ensure all three Mapbox variables are set
4. Check for browser console errors

### "Stripe payment failed" error

**Symptoms:**
- Payment button doesn't work
- Webhook errors

**Solutions:**
1. Verify Stripe keys match environment (test vs live)
2. Check webhook secret is correct
3. Ensure webhook endpoint is accessible
4. Verify price IDs are correct

---

## Verification Script

Run the environment verification script:

```bash
npm run verify:env
```

This will check:
- ✅ All required variables are set
- ✅ Variables have non-empty values
- ⚠️ Optional variables that are missing
- ℹ️ Which `.env` files were loaded

---

## Getting Help

If you need help with environment setup:
1. Check this documentation
2. Review `.env.example` for reference
3. Run `npm run verify:env` for diagnostics
4. Contact: stringtheorysolutionsllc@gmail.com

---

**Last Updated:** November 22, 2025
**Version:** 1.0

