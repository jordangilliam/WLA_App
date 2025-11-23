# Deployment Task Breakdown for Multiple Agents

This document breaks down remaining deployment tasks that can be distributed across multiple Composer agents.

## ✅ Completed Tasks
- All migrations (027-030) applied successfully
- Fixed 20+ TypeScript errors in API routes
- Fixed JSX fragment issues
- Fixed computed property name issues
- Fixed Image constructor issue

## 🔧 Remaining Build Fixes (Agent 1)

### TypeScript Errors
1. **IndexedDB Type Errors** (`lib/location/location-cache.ts`)
   - Fix remaining IDBKeyRange type issues
   - Ensure all store operations use correct types

2. **Supabase Query Type Errors** (if any remain)
   - Add type assertions to remaining Supabase queries
   - Pattern: `const { data: resultData } = await query` then `const result = resultData as any`

### Files to Check
- `lib/location/location-cache.ts` - IndexedDB operations
- Any remaining API routes with Supabase queries

## 📋 Environment Setup (Agent 2)

### Create `.env.example` Template
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# NextAuth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=

# Stripe (optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_SCHOOL_BASIC=
STRIPE_PRICE_SCHOOL_PRO=
STRIPE_PRICE_SCHOOL_UNLIMITED=
STRIPE_PRICE_DISTRICT=

# App
NEXT_PUBLIC_APP_VERSION=1.0.0
NODE_ENV=production
```

### Verify Environment Variables
- Run `npm run verify:env` to check all required vars
- Document optional variables

## 🚀 Deployment Configuration (Agent 3)

### Update Deployment Checklist
- Update `DEPLOYMENT_CHECKLIST.md` with migrations 027-030
- Add verification queries for new tables
- Document new API endpoints

### Vercel Configuration
- Verify `vercel.json` settings
- Check build command: `npm run build`
- Ensure environment variables are documented

### Create Deployment Script
- Script to verify build before deployment
- Script to check database migrations status
- Pre-deployment health checks

## 🧪 Testing & Verification (Agent 4)

### Post-Deployment Tests
- [ ] Test all new API endpoints:
  - `/api/waterways/hatches`
  - `/api/experts/techniques`
  - `/api/experts/patterns`
  - `/api/shops/nearby`
  - `/api/shops/all`
  - `/api/pfbc/mapping-layers`
  - `/api/pfbc/stocking`
  - `/api/pfbc/access-points`
  - `/api/pfbc/regulations`
  - `/api/pfbc/habitat`

- [ ] Verify database tables:
  - `macroinvertebrate_hatches`
  - `waterway_hatches`
  - `fly_fishing_experts`
  - `fly_fishing_shops`
  - `pfbc_trout_streams`
  - `pfbc_bass_waters`
  - `pfbc_stocking_schedules`
  - `pfbc_access_points`
  - `pfbc_regulations`
  - `pfbc_habitat_installations`

### Integration Tests
- Test waterways with hatch data
- Test expert knowledge integration
- Test fly shop search
- Test PFBC data endpoints

## 📚 Documentation (Agent 5)

### Update Documentation
- Update `README.md` with new features
- Document new API endpoints
- Create migration guide for 027-030
- Update architecture docs

### Create User Guides
- Fly fishing features guide
- PFBC data usage guide
- Expert knowledge guide

## 🎯 Priority Order

1. **Agent 1**: Fix remaining build errors (CRITICAL)
2. **Agent 2**: Environment setup (CRITICAL)
3. **Agent 3**: Deployment config (HIGH)
4. **Agent 4**: Testing (HIGH)
5. **Agent 5**: Documentation (MEDIUM)

## 📝 Notes

- All agents should work in separate branches
- Test locally before merging
- Coordinate on shared files (package.json, tsconfig.json)
- Use TODO comments for cross-agent dependencies


