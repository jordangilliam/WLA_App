# Phase 1 TODO: Security & API Hardening

## Summary

This file tracks the detailed tasks for Phase 1 of the mobile deployment plan.

**Timeline**: Weeks 1-3 (November 7-28, 2025)  
**Goal**: Replace mock data with real database, implement security layer

---

## ✅ Completed (Week 1, Day 1)

### Database Infrastructure
- [x] Create `lib/db/client.ts` - Supabase client setup
- [x] Create `lib/db/types.ts` - Database type definitions
- [x] Create `lib/db/migrations/001_add_organizations.sql` - Multi-tenant schema
- [x] Create `SUPABASE_SETUP_GUIDE.md` - Setup instructions
- [x] Update `env.template` with Supabase configuration

### Security Infrastructure
- [x] Create `lib/config/environment.ts` - Environment validation
- [x] Create `lib/auth/api-middleware.ts` - API security middleware
- [x] Create example API route showing new pattern

### Documentation
- [x] Create `IMPLEMENTATION_PROGRESS.md` - Progress tracking
- [x] Create `package-install-instructions.md` - Dependency setup
- [x] Create `TODO-PHASE1.md` - This file

---

## 🚧 TODO: Remaining Phase 1 Tasks

### 1. Install Dependencies & Setup Database

**Priority**: CRITICAL  
**Estimated Time**: 2 hours  
**Owner**: Developer

**Tasks:**
- [ ] Run `npm install @supabase/supabase-js zod`
- [ ] Create Supabase account at supabase.com
- [ ] Create new Supabase project
- [ ] Get API keys from Supabase dashboard
- [ ] Add keys to `.env.local`:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  SUPABASE_SERVICE_ROLE_KEY=your-service-key
  ```
- [ ] Run `lib/db/schema.sql` in Supabase SQL Editor
- [ ] Run `lib/db/migrations/001_add_organizations.sql`
- [ ] Verify tables created successfully
- [ ] Test database connection

**Resources:**
- `SUPABASE_SETUP_GUIDE.md`
- `package-install-instructions.md`

---

### 2. Update API Routes to Use Supabase

**Priority**: CRITICAL  
**Estimated Time**: 8-12 hours  
**Owner**: Developer

Update these API routes (in order of priority):

#### High Priority (Core Features)
- [ ] `app/api/classes/route.ts` - Class management
  - [ ] GET - Fetch classes from database
  - [ ] POST - Create class with validation
  - Use `app/api/classes/route.EXAMPLE.ts` as template

- [ ] `app/api/classes/[classId]/route.ts` - Individual class
  - [ ] GET - Fetch single class
  - [ ] PUT - Update class
  - [ ] DELETE - Soft delete (archive)

- [ ] `app/api/classes/[classId]/students/route.ts` - Class roster
  - [ ] GET - Fetch students in class
  - [ ] POST - Add student to class

#### Medium Priority (User Management)
- [ ] `app/api/check-in/route.ts` - Location check-ins
  - [ ] POST - Record check-in with GPS validation
  - [ ] Store in `check_ins` table (create if needed)

- [ ] `app/api/partners/route.ts` - Partner organizations
  - [ ] GET - Fetch partners from database
  - [ ] Add RLS policies

#### Lower Priority (Can stay mock for now)
- [ ] `app/api/locations/nearby/route.ts`
- [ ] `app/api/scholarships/route.ts`
- [ ] `app/api/pfbc-data/route.ts`

**For Each Route:**
1. Import Supabase client and middleware
2. Replace `getServerSession` with `withSecurity()`
3. Remove mock data
4. Add Supabase queries
5. Add Zod validation for POST/PUT
6. Add error handling
7. Add audit logging
8. Test with Postman or similar

**Testing Checklist Per Route:**
- [ ] Unauthenticated request returns 401
- [ ] Wrong role returns 403
- [ ] Valid request returns data
- [ ] Invalid input returns 400 with details
- [ ] Database errors handled gracefully

---

### 3. Implement OAuth Token Refresh

**Priority**: HIGH  
**Estimated Time**: 4 hours  
**Owner**: Developer

**Files to Update:**
- [ ] `app/api/export/google-drive/route.ts`
  - [ ] Add token refresh logic
  - [ ] Store tokens in database (encrypted)
  - [ ] Handle expired tokens gracefully

- [ ] `app/api/export/onedrive/route.ts`
  - [ ] Same as Google Drive

**Implementation Steps:**
1. Create `lib/oauth/token-manager.ts`:
   ```typescript
   export async function refreshGoogleToken(userId: string): Promise<string>
   export async function refreshMicrosoftToken(userId: string): Promise<string>
   ```
2. Store tokens in new table:
   ```sql
   CREATE TABLE oauth_tokens (
     user_id UUID REFERENCES users(id),
     provider TEXT, -- 'google', 'microsoft'
     access_token TEXT,
     refresh_token TEXT,
     expires_at TIMESTAMP,
     encrypted_at TIMESTAMP DEFAULT NOW()
   );
   ```
3. Encrypt tokens before storing (use crypto library)
4. Auto-refresh when token expires

---

### 4. Set Up Row Level Security (RLS) Policies

**Priority**: CRITICAL  
**Estimated Time**: 3 hours  
**Owner**: Developer

**Tables Needing RLS:**

- [ ] `users` table
  - [ ] Users can read their own profile
  - [ ] Users can update their own profile
  - [ ] Admins can read all users

- [ ] `classes` table
  - [ ] Teachers can CRUD their own classes
  - [ ] Students can read classes they're enrolled in
  - [ ] Admins can read all classes

- [ ] `organization_users` table
  - [ ] Users can see their own org memberships
  - [ ] Org admins can manage members

- [ ] Create audit_logs table and policies:
  ```sql
  CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    ip_address TEXT,
    user_agent TEXT,
    success BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  ```

**Testing RLS:**
- [ ] Try to access another user's data (should fail)
- [ ] Try to update another user's class (should fail)
- [ ] Verify teachers can only see their classes
- [ ] Verify students can only see enrolled classes

---

### 5. Environment Configuration

**Priority**: HIGH  
**Estimated Time**: 1 hour  
**Owner**: Developer

- [ ] Verify `.env.local` has all required variables
- [ ] Test environment validation:
  ```typescript
  import { getEnv } from '@/lib/config/environment';
  const env = getEnv(); // Should not throw errors
  ```
- [ ] Set up separate `.env.production` for deployment
- [ ] Document all environment variables
- [ ] Add `.env.local` to `.gitignore` (verify)

---

### 6. Rate Limiting (Optional for Phase 1)

**Priority**: MEDIUM  
**Estimated Time**: 2 hours  
**Owner**: Developer

**For Production (Week 3):**
- [ ] Sign up for Upstash (upstash.com)
- [ ] Create Redis database
- [ ] Add to `.env.local`:
  ```
  UPSTASH_REDIS_REST_URL=https://...
  UPSTASH_REDIS_REST_TOKEN=...
  ```
- [ ] Update `lib/auth/api-middleware.ts` to use Redis:
  ```typescript
  import { Redis } from '@upstash/redis';
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  ```
- [ ] Test rate limiting works across server restarts

**For Development:**
- Current in-memory rate limiting is fine
- Resets on server restart (expected)

---

### 7. Testing & Verification

**Priority**: CRITICAL  
**Estimated Time**: 4 hours  
**Owner**: Developer + Tester

**Manual Testing:**
- [ ] Sign in with Google OAuth
- [ ] Create a class (educator role)
- [ ] Join a class (student role)
- [ ] Try to create class as student (should fail)
- [ ] Upload photo to journal
- [ ] Check GPS location
- [ ] Test offline mode (should still work for cached data)

**API Testing (use Postman/Insomnia):**
- [ ] GET `/api/classes` with auth token
- [ ] POST `/api/classes` with valid data
- [ ] POST `/api/classes` with invalid data (should return 400)
- [ ] POST `/api/classes` without auth (should return 401)
- [ ] POST `/api/classes` as student (should return 403)
- [ ] Test rate limiting (100+ requests in 1 minute)

**Database Testing:**
- [ ] Verify data persists across app restarts
- [ ] Check that RLS policies work
- [ ] Test with multiple users/organizations
- [ ] Verify audit logs are created

---

### 8. Documentation & Cleanup

**Priority**: MEDIUM  
**Estimated Time**: 2 hours  
**Owner**: Developer

- [ ] Update README.md with setup instructions
- [ ] Document new API patterns
- [ ] Create migration guide for other developers
- [ ] Remove old mock data files (if any)
- [ ] Update API documentation
- [ ] Screenshot Supabase dashboard for docs

---

## Phase 1 Completion Criteria

Phase 1 is complete when:

- [x] Database client configured
- [x] Environment validation implemented
- [x] API middleware created
- [ ] At least 3 API routes use real database
- [ ] RLS policies tested and working
- [ ] OAuth token refresh implemented
- [ ] Rate limiting functional
- [ ] All tests passing
- [ ] Documentation updated

---

## Timeline Breakdown

### Week 1 (Nov 7-13)
- [x] Days 1-2: Database setup and security infrastructure
- [ ] Days 3-4: Update high-priority API routes
- [ ] Day 5: Testing and bug fixes

### Week 2 (Nov 14-20)
- [ ] Days 1-3: Update remaining API routes
- [ ] Day 4: Implement OAuth token refresh
- [ ] Day 5: RLS policies and testing

### Week 3 (Nov 21-27)
- [ ] Days 1-2: Rate limiting and monitoring setup
- [ ] Day 3-4: Comprehensive testing
- [ ] Day 5: Documentation and Phase 1 wrap-up

---

## Blockers & Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| npm not available | HIGH | Document manual installation process |
| Supabase free tier limits | MEDIUM | Monitor usage, upgrade if needed |
| API routes too coupled to mock data | MEDIUM | Refactor incrementally |
| RLS policies too restrictive | LOW | Test thoroughly before deployment |

---

## Success Metrics

- [ ] 100% of core API routes use real database
- [ ] 0 mock data in production code
- [ ] All authentication tests passing
- [ ] RLS policies prevent unauthorized access
- [ ] Rate limiting prevents abuse
- [ ] API response time < 500ms (95th percentile)

---

## Next: Phase 2

Once Phase 1 is complete, move to:
- **Phase 2: Offline-First Architecture** (Weeks 4-6)
- See `capacitor-mobile-deployment.plan.md` for details

---

**Status**: Week 1, Day 1 - Foundation Complete ✅  
**Next Milestone**: Install dependencies and set up Supabase  
**Questions/Blockers**: npm not found in PATH - needs manual installation

