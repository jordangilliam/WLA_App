# Agent 4: Testing & Verification Tasks

## Objective
Create test scripts and verification procedures for all new API endpoints and database tables.

## Tasks

### 1. Create API Endpoint Test Script
**File:** `scripts/test-api-endpoints.ts`

**Test all endpoints:**
```typescript
// Test endpoints:
- GET /api/waterways/hatches
- GET /api/experts/techniques
- GET /api/experts/patterns
- GET /api/shops/nearby?lat=40.4406&lng=-79.9959
- GET /api/shops/all
- GET /api/pfbc/mapping-layers
- GET /api/pfbc/stocking
- GET /api/pfbc/access-points
- GET /api/pfbc/regulations
- GET /api/pfbc/habitat
```

**Script should:**
- Make requests to each endpoint
- Verify response structure
- Check for expected data
- Report any failures

**Usage:** `npm run test:api`

### 2. Create Database Verification Script
**File:** `scripts/verify-database.ts`

**Verify all tables exist and have data:**
```typescript
// Check tables:
- macroinvertebrate_hatches (should have 9+ rows)
- waterway_hatches (should have associations)
- fly_fishing_experts (should have 2+ rows)
- expert_techniques (should have techniques)
- expert_patterns (should have patterns)
- fly_fishing_shops (should have 60+ rows)
- pfbc_trout_streams (should have 110+ rows)
- pfbc_bass_waters (should have rows)
- pfbc_other_species_waters (should have rows)
- pfbc_stocking_schedules (should have 13+ rows)
- pfbc_access_points (should have 15+ rows)
- pfbc_regulations (should have rows)
- pfbc_habitat_installations (should have rows)
```

**Script should:**
- Connect to Supabase
- Count rows in each table
- Verify expected counts
- Report any missing data

**Usage:** `npm run verify:db`

### 3. Create Integration Test Suite
**File:** `scripts/integration-tests.ts`

**Test workflows:**
1. **Waterway + Hatch Integration**
   - Query waterway
   - Verify associated hatches
   - Check seasonal data

2. **Expert Knowledge Integration**
   - Query expert
   - Verify techniques
   - Verify patterns
   - Verify favorite locations

3. **Fly Shop Search**
   - Test nearby search
   - Test filtering
   - Verify location data

4. **PFBC Data Integration**
   - Test mapping layers
   - Test stocking schedules
   - Test access points
   - Verify geospatial data

### 4. Create Post-Deployment Verification Checklist
**File:** `POST_DEPLOYMENT_CHECKLIST.md`

**Include:**
- [ ] Homepage loads
- [ ] Authentication works
- [ ] All API endpoints respond
- [ ] Database queries succeed
- [ ] Map displays correctly
- [ ] Fly fishing features work
- [ ] PFBC data displays
- [ ] No console errors
- [ ] Performance is acceptable

### 5. Add Test Scripts to package.json
**File:** `package.json`

**Add:**
```json
"scripts": {
  "test:api": "tsx scripts/test-api-endpoints.ts",
  "test:integration": "tsx scripts/integration-tests.ts",
  "verify:db": "tsx scripts/verify-database.ts",
  "test:all": "npm run test:api && npm run verify:db && npm run test:integration"
}
```

## Verification Steps

1. ✅ API test script created and runs successfully
2. ✅ Database verification script created and runs successfully
3. ✅ Integration tests created
4. ✅ Post-deployment checklist created
5. ✅ All scripts added to package.json

## Files to Create/Modify
- `scripts/test-api-endpoints.ts` (new)
- `scripts/verify-database.ts` (new)
- `scripts/integration-tests.ts` (new)
- `POST_DEPLOYMENT_CHECKLIST.md` (new)
- `package.json` (add scripts)

## Notes
- Tests should be idempotent (can run multiple times)
- Include helpful error messages
- Test both success and failure cases
- Document expected results


