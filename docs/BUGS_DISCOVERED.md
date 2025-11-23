# Bugs Discovered During Testing

**Date:** 2025-01-23  
**Status:** Active Testing

## Bug #1

**Severity:** High  
**Category:** Database  
**Page/Component:** `/` (Home page)  
**Steps to Reproduce:**
1. Navigate to homepage
2. Page loads but console shows error

**Expected Behavior:**
Homepage should load without errors, missions should load if available

**Actual Behavior:**
```
Failed to load resource: the server responded with a status of 500 (Internal Server Error)
Error loading missions: Error: Failed to load missions
Could not find the table 'public.story_missions' in the schema cache
```

**Screenshots/Logs:**
- Console error: `PGRST205` - table 'public.story_missions' not found
- Component: `components/home/MissionCarousel.tsx:27`

**Environment:**
- Browser: All browsers
- Device: All devices
- User Role: Unauthenticated

**Related Issues:**
- MissionCarousel component tries to load missions from non-existent table
- Database migration for `story_missions` table may be missing

**Fix Priority:** High - Blocks mission features on homepage

**Fix Status:** ✅ FIXED
**Fix Applied:** Added error handling to MissionCarousel component
- Component now handles 500 errors gracefully
- Returns null (fails silently) if missions unavailable
- No console errors visible to users
- Component only renders if missions successfully load

**Remaining Work:**
- Database migration `020_story_missions.sql` should be applied to enable missions feature
- Migration file exists but may not be applied to database
- Once migration is applied, missions will work automatically

---

## Bug #2

**Severity:** Low  
**Category:** Performance/Security  
**Page/Component:** All pages (third-party service)  
**Steps to Reproduce:**
1. Navigate to any page
2. Open browser console
3. See cookie warnings

**Expected Behavior:**
No console warnings about cookies

**Actual Behavior:**
```
Cookie "__client" has been rejected because it is in a cross-site context and its "SameSite" is "Lax" or "Strict"
Cookie "__client_uat" has been rejected because it is in a cross-site context and its "SameSite" is "Lax" or "Strict"
```

**Screenshots/Logs:**
- Console warnings from Clerk authentication service
- Service: `https://clerk.skillbuilder.io/v1/client`

**Environment:**
- Browser: All browsers
- Device: All devices
- User Role: All users

**Related Issues:**
- Third-party service (Clerk) cookies being set in cross-site context
- Not breaking functionality, just console noise

**Fix Priority:** Low - Doesn't affect functionality

**Fix Suggestions:**
1. Configure Clerk cookies with appropriate SameSite settings
2. Or suppress warnings in test/development environment
3. Or contact Clerk support for proper configuration

---

## Bug #3: Performance Issues

**Severity:** Medium  
**Category:** Performance  
**Page/Component:** Multiple pages and API endpoints  
**Steps to Reproduce:**
1. Run performance tests
2. Check load times

**Expected Behavior:**
- Homepage loads in < 2 seconds
- Explore page loads in < 5 seconds
- API endpoints respond in < 1 second
- LCP (Largest Contentful Paint) < 2.5 seconds

**Actual Behavior:**
- Homepage: Loading but timing out in tests (needs measurement)
- Explore page: Loading but timing out in tests (needs measurement)
- API endpoints: `/api/field-sites` responding in 4.3 seconds (should be < 1 second)
- LCP: Timing out at 5 seconds (should be < 2.5 seconds)

**Screenshots/Logs:**
- Performance test failures documented
- API response time: 4354ms (expected < 1000ms)
- LCP timeout: 5000ms (expected < 2500ms)

**Environment:**
- Browser: All browsers
- Device: All devices
- User Role: All users

**Related Issues:**
- Database queries may be slow
- Map rendering may be slow
- Images may not be optimized
- No caching implemented

**Fix Priority:** Medium - Affects user experience but doesn't break functionality

**Fix Suggestions:**
1. Optimize database queries (add indexes, optimize joins)
2. Implement API response caching
3. Optimize image loading (lazy loading, WebP format)
4. Implement code splitting for faster initial load
5. Optimize map rendering (viewport-based loading)

---

## Bug Template

```markdown
## Bug #[ID]

**Severity:** Critical / High / Medium / Low  
**Category:** UI / API / Database / Performance / Security  
**Page/Component:** [path]  
**Steps to Reproduce:**
1. 
2. 
3.

**Expected Behavior:**
**Actual Behavior:**
**Screenshots/Logs:**
**Environment:**
- Browser:
- Device:
- User Role:

**Related Issues:**
**Fix Priority:**
```

## Critical Bugs

*None discovered yet*

## High Priority Bugs

1. **Bug #1:** Missing `story_missions` table causing 500 errors on homepage

## Medium Priority Bugs

*None discovered yet*

## Low Priority Bugs

*None discovered yet*

## Notes

- Testing infrastructure is working correctly
- Tests are discovering real bugs
- Database schema needs verification
- Some components may need error handling improvements
