# WLA App Architecture

## System Overview

The WLA (Wildlife Leadership Academy) Conservation Ambassadors platform is a full-stack web and mobile application built with modern technologies for educational conservation programs.

### Technology Stack

**Frontend:**
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling
- **PWA** - Progressive Web App capabilities

**Backend:**
- **Next.js API Routes** - Serverless functions
- **NextAuth.js** - Authentication
- **Supabase** - PostgreSQL database + Auth + Storage
- **Edge Functions** - Supabase serverless functions (for FieldQuest)

**Mobile:**
- **Capacitor** - Native iOS/Android wrapper
- **React Native (Expo)** - FieldQuest mobile game

**Infrastructure:**
- **Vercel** - Web app hosting
- **Supabase** - Database and backend services
- **Sentry** - Error tracking
- **Stripe** - Payment processing (optional)

## Architecture Patterns

### App Router Structure

Next.js 13+ App Router with server and client components:

```
app/
├── layout.tsx          # Root layout (server component)
├── page.tsx            # Home page (server component)
├── auth/               # Authentication pages
│   └── page.tsx
├── dashboard/          # Teacher/student dashboards
│   ├── teacher/
│   │   ├── page.tsx   # Teacher dashboard
│   │   └── classes/[classId]/page.tsx
│   └── student/
├── api/                # API routes (serverless functions)
│   ├── auth/
│   ├── classes/
│   ├── student/
│   └── user/
└── ...
```

###Server vs Client Components

**Server Components** (default):
- Fetch data directly from database
- No JavaScript sent to client
- Better performance and SEO
- Used for: layouts, static pages, data fetching

**Client Components** (`'use client'`):
- Interactive UI with state
- Access to browser APIs
- Event handlers
- Used for: forms, interactive maps, real-time features

## Database Architecture

### Schema Overview

```sql
-- Core User Management
users
  ├── id (UUID, PK)
  ├── email (TEXT, UNIQUE)
  ├── name (TEXT)
  ├── role (ENUM: student, teacher, admin)
  ├── avatar_url (TEXT)
  └── created_at (TIMESTAMP)

-- Educational Organization
organizations
  ├── id (UUID, PK)
  ├── name (TEXT)
  ├── license_type (TEXT)
  ├── max_students (INTEGER)
  └── stripe_customer_id (TEXT)

organization_users
  ├── organization_id (FK → organizations)
  ├── user_id (FK → users)
  ├── role (ENUM: owner, admin, member)
  └── joined_at (TIMESTAMP)

-- Class Management
classes
  ├── id (UUID, PK)
  ├── teacher_id (FK → users)
  ├── organization_id (FK → organizations)
  ├── name (TEXT)
  ├── code (TEXT, UNIQUE) # 6-char join code
  ├── subject (TEXT)
  └── created_at (TIMESTAMP)

class_enrollments
  ├── class_id (FK → classes)
  ├── user_id (FK → users)
  ├── enrolled_at (TIMESTAMP)
  └── PRIMARY KEY (class_id, user_id)

-- Field Work & Check-ins
check_ins
  ├── id (UUID, PK)
  ├── user_id (FK → users)
  ├── location (GEOGRAPHY)
  ├── notes (TEXT)
  ├── photos (TEXT[])
  └── created_at (TIMESTAMP)

-- FieldQuest Game Tables (separate mobile app)
field_sites
  ├── id (UUID, PK)
  ├── name (TEXT)
  ├── location (GEOGRAPHY)
  ├── site_type (TEXT)
  └── description (TEXT)

species
  ├── id (UUID, PK)
  ├── common_name (TEXT)
  ├── scientific_name (TEXT)
  ├── rarity (ENUM: common, uncommon, rare, epic, legendary)
  ├── habitat (TEXT)
  └── conservation_status (TEXT)

user_species (collection tracking)
  ├── user_id (FK → users)
  ├── species_id (FK → species)
  ├── first_caught_at (TIMESTAMP)
  ├── catch_count (INTEGER)
  └── PRIMARY KEY (user_id, species_id)

achievements
  ├── id (UUID, PK)
  ├── title (TEXT)
  ├── description (TEXT)
  ├── category (TEXT)
  ├── points (INTEGER)
  └── icon (TEXT)

user_achievements
  ├── user_id (FK → users)
  ├── achievement_id (FK → achievements)
  ├── earned_at (TIMESTAMP)
  └── PRIMARY KEY (user_id, achievement_id)
```

### Row Level Security (RLS)

Supabase uses PostgreSQL RLS to secure data at the database level:

**users table:**
```sql
-- Users can read their own data
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

**classes table:**
```sql
-- Teachers can view their own classes
CREATE POLICY "Teachers can view own classes"
  ON classes FOR SELECT
  USING (teacher_id = auth.uid());

-- Teachers can create classes
CREATE POLICY "Teachers can create classes"
  ON classes FOR INSERT
  WITH CHECK (teacher_id = auth.uid());
```

**class_enrollments table:**
```sql
-- Students can view their own enrollments
CREATE POLICY "Students can view own enrollments"
  ON class_enrollments FOR SELECT
  USING (user_id = auth.uid());

-- Students can enroll themselves
CREATE POLICY "Students can join classes"
  ON class_enrollments FOR INSERT
  WITH CHECK (user_id = auth.uid());
```

### Database Functions

**Generate unique class code:**
```sql
CREATE OR REPLACE FUNCTION generate_class_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;
```

**Calculate XP for level (FieldQuest):**
```sql
CREATE OR REPLACE FUNCTION calculate_xp_for_level(level INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN 100 * level * level;
END;
$$ LANGUAGE plpgsql;
```

**Geospatial queries (FieldQuest):**
```sql
CREATE OR REPLACE FUNCTION nearby_field_sites(
  lat FLOAT,
  lng FLOAT,
  radius_meters FLOAT DEFAULT 300
)
RETURNS SETOF field_sites AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM field_sites
  WHERE ST_DWithin(
    location,
    ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
    radius_meters
  );
END;
$$ LANGUAGE plpgsql;
```

## API Architecture

### REST API Endpoints

All API routes are in `app/api/` and follow REST conventions:

#### Authentication
```
POST   /api/auth/signin         # Sign in
POST   /api/auth/signout        # Sign out
GET    /api/auth/session        # Get current session
```

#### Classes (Teacher)
```
GET    /api/classes             # List teacher's classes
POST   /api/classes             # Create new class
GET    /api/classes/[id]        # Get class details
PUT    /api/classes/[id]        # Update class
DELETE /api/classes/[id]        # Delete class

GET    /api/classes/[id]/students     # List class students
POST   /api/classes/[id]/students     # Add student to class
DELETE /api/classes/[id]/students/[studentId]  # Remove student
```

#### Classes (Student)
```
POST   /api/classes/join        # Join class with code
GET    /api/student/classes     # List enrolled classes
```

#### User Profile
```
GET    /api/user/profile        # Get user profile
PUT    /api/user/profile        # Update user profile
```

#### Check-ins
```
GET    /api/check-in            # List user's check-ins
POST   /api/check-in            # Create new check-in
```

#### Payments (Optional)
```
POST   /api/webhooks/stripe     # Stripe webhook handler
```

### API Request/Response Format

**Request headers:**
```
Content-Type: application/json
Cookie: next-auth.session-token=...
```

**Success response:**
```json
{
  "data": [...],
  "message": "Success"
}
```

**Error response:**
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Authentication Flow

1. User clicks "Sign in with Google"
2. NextAuth.js redirects to Google OAuth
3. User authorizes application
4. Google redirects back with authorization code
5. NextAuth.js exchanges code for access token
6. NextAuth.js creates session cookie
7. Session stored in JWT token (stateless)
8. Subsequent requests include session cookie
9. API routes verify session with `getServerSession()`
10. User data loaded from Supabase

**Session structure:**
```typescript
{
  user: {
    id: string,          // Supabase user ID
    email: string,
    name: string,
    image: string,
    role: 'student' | 'teacher' | 'admin'
  },
  expires: string,       // ISO timestamp
  access_token: string,  // OAuth access token
  refresh_token: string  // OAuth refresh token
}
```

## Offline-First Architecture

### Service Worker

PWA functionality via `public/sw.js`:

**Caching strategy:**
- **Network-first**: API calls (check-in, data sync)
- **Cache-first**: Static assets (images, CSS, JS)
- **Stale-while-revalidate**: Educational content

```javascript
// Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('wla-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/offline',
        '/manifest.json',
        // ... other static assets
      ])
    })
  )
})

// Serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})
```

### IndexedDB for Offline Data

`lib/offline/indexeddb.ts` manages client-side database:

**Stores:**
- `photos` - Cached field photos
- `lessons` - Educational content
- `progress` - User progress data
- `sync_queue` - Pending sync operations

```typescript
class IndexedDBManager {
  async init() {
    const db = await openDB('wla-offline', 1, {
      upgrade(db) {
        db.createObjectStore('photos', { keyPath: 'id' })
        db.createObjectStore('lessons', { keyPath: 'id' })
        db.createObjectStore('progress', { keyPath: 'id' })
        db.createObjectStore('sync_queue', { keyPath: 'id', autoIncrement: true })
      }
    })
    return db
  }

  async set(store, key, value) {
    const db = await this.init()
    await db.put(store, { id: key, data: value, timestamp: Date.now() })
  }

  async get(store, key) {
    const db = await this.init()
    const result = await db.get(store, key)
    return result?.data
  }
}
```

### Sync Engine

`lib/offline/sync-engine.ts` handles offline→online sync:

**Sync process:**
1. User makes change while offline
2. Change added to `sync_queue` in IndexedDB
3. When online, `SyncEngine` processes queue
4. POST changes to API
5. On success, remove from queue
6. On conflict, present resolution UI
7. On error, retry with exponential backoff

```typescript
class SyncEngine {
  async syncAll() {
    const queue = await indexedDB.getAll('sync_queue')
    
    for (const item of queue) {
      try {
        await this.syncItem(item)
        await indexedDB.delete('sync_queue', item.id)
      } catch (error) {
        // Retry logic
        item.retryCount++
        if (item.retryCount < 5) {
          await indexedDB.update('sync_queue', item)
        }
      }
    }
  }

  async syncItem(item) {
    const response = await fetch(item.endpoint, {
      method: item.method,
      body: JSON.stringify(item.data),
      headers: { 'Content-Type': 'application/json' }
    })

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.status}`)
    }

    return response.json()
  }
}
```

## Mobile Architecture

### Capacitor Integration

Capacitor wraps the Next.js web app for native iOS/Android:

**Configuration** (`capacitor.config.ts`):
```typescript
import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'org.wildlifeleadership.wlaapp',
  appName: 'WildPraxis',
  webDir: 'out', // Next.js static export
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Camera: {},
    Geolocation: {},
    PushNotifications: {},
    Preferences: {}
  }
}

export default config
```

**Native plugins usage:**
```typescript
import { Camera } from '@capacitor/camera'
import { Geolocation } from '@capacitor/geolocation'

// Take photo
const photo = await Camera.getPhoto({
  quality: 90,
  allowEditing: true,
  resultType: CameraResultType.Uri
})

// Get location
const position = await Geolocation.getCurrentPosition()
```

### FieldQuest React Native App

Separate mobile game app in `/FieldQuest`:

**Navigation** (Expo Router):
```
FieldQuest/
└── app/
    ├── _layout.tsx        # Root layout
    ├── index.tsx          # Entry/redirect
    ├── (tabs)/            # Tab navigator
    │   ├── _layout.tsx
    │   ├── map.tsx
    │   ├── collection.tsx
    │   ├── journal.tsx
    │   └── profile.tsx
    ├── encounter/[spawnId].tsx  # Dynamic route
    └── onboarding.tsx
```

**State management** (Zustand):
```typescript
// FieldQuest/state/store.ts
import { create } from 'zustand'

export const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  level: 1,
  xp: 0,
  addXP: (amount) => set((state) => ({
    xp: state.xp + amount
  }))
}))

export const useLocationStore = create((set) => ({
  location: null,
  setLocation: (location) => set({ location }),
  tracking: false,
  startTracking: () => set({ tracking: true })
}))
```

## Security Architecture

### Authentication & Authorization

**Authentication** (NextAuth.js):
- Session-based with JWT tokens
- Multiple providers: Google OAuth, Azure AD, Email/Password
- Server-side session validation
- CSRF protection built-in

**Authorization** (custom middleware):
```typescript
// lib/auth/api-middleware.ts
export async function requireAuth(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return session
}

export async function requireRole(req: NextRequest, role: string) {
  const session = await requireAuth(req)
  if ((session.user as any).role !== role) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return session
}
```

### Data Security

**Row Level Security (RLS):**
- Database-level access control
- Users can only access their own data
- Teachers can only access their classes
- Admins can access organization data

**API Security:**
- All API routes require authentication
- Input validation on all endpoints
- SQL injection prevention (parameterized queries)
- XSS prevention (React escapes by default)

**Secrets Management:**
- Environment variables for all secrets
- `.env.local` never committed to Git
- Production secrets in Vercel/Netlify
- Supabase service role key for server-only operations

## Performance Optimization

### Next.js Optimizations

**Static Generation:**
- Pre-render pages at build time
- Used for: home, about, static content

**Server-Side Rendering:**
- Render on each request
- Used for: dashboards, user-specific pages

**API Route Caching:**
```typescript
export const revalidate = 60 // Revalidate every 60 seconds

export async function GET(req: NextRequest) {
  const data = await fetchData()
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
    }
  })
}
```

### Database Optimizations

**Indexes:**
```sql
CREATE INDEX idx_classes_teacher ON classes(teacher_id);
CREATE INDEX idx_enrollments_user ON class_enrollments(user_id);
CREATE INDEX idx_checkins_user_date ON check_ins(user_id, created_at);

-- Geospatial index for FieldQuest
CREATE INDEX idx_field_sites_location ON field_sites USING GIST(location);
```

**Query optimization:**
- Use `select()` to specify columns (don't fetch all)
- Implement pagination for large datasets
- Use database functions for complex operations
- Cache frequent queries

### Asset Optimization

**Images:**
- Next.js Image component for automatic optimization
- WebP format with fallback
- Lazy loading below the fold
- Responsive images with srcset

**Code splitting:**
- Dynamic imports for large components
- Separate bundles per route
- Lazy load non-critical features

## Monitoring & Observability

### Error Tracking (Sentry)

**Configuration:**
```typescript
// lib/monitoring/sentry.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1, // 10% of transactions
  beforeSend(event) {
    // Filter sensitive data
    if (event.request?.headers) {
      delete event.request.headers['authorization']
    }
    return event
  }
})
```

**Usage:**
```typescript
try {
  await riskyOperation()
} catch (error) {
  Sentry.captureException(error, {
    tags: { operation: 'riskyOperation' },
    user: { id: session.user.id }
  })
  throw error
}
```

### Analytics

**Vercel Analytics:**
- Automatic page view tracking
- Web Vitals monitoring
- No configuration needed

**Custom events:**
```typescript
import { track } from '@vercel/analytics'

// Track custom events
track('class_created', {
  teacher_id: user.id,
  class_name: className
})

track('student_joined', {
  class_id: classId,
  student_id: studentId
})
```

## Deployment Architecture

### Production Stack

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ├─── HTTPS ───┐
       │             │
┌──────▼──────┐ ┌───▼────────┐
│   Vercel    │ │  Supabase  │
│  (Next.js)  │ │ (Postgres) │
└─────────────┘ └────────────┘
       │
       ├─── Webhooks ───┐
       │                │
┌──────▼──────┐    ┌───▼────┐
│   Stripe    │    │ Sentry │
│ (Payments)  │    │(Errors)│
└─────────────┘    └────────┘
```

### CI/CD Pipeline

```
GitHub Push
    ↓
Vercel Detects Change
    ↓
├─ Install Dependencies
├─ Run TypeScript Check
├─ Run Linter
├─ Build Next.js App
├─ Run Tests (when implemented)
└─ Deploy to Production
    ↓
    ├─ Preview URL (for PRs)
    └─ Production URL (for main branch)
```

## Scalability Considerations

### Current Capacity

**Vercel (Free/Pro):**
- Serverless functions auto-scale
- 100GB bandwidth (free) / 1TB (pro)
- No limits on concurrent users

**Supabase (Free/Pro):**
- 500MB / 8GB database
- 50K / 100K monthly active users
- Unlimited API requests

### Scaling Strategy

**When to scale:**
- Database > 80% capacity
- Response times > 2 seconds
- Error rate > 1%

**How to scale:**
1. **Database**: Upgrade to Supabase Pro or Enterprise
2. **Compute**: Vercel Enterprise for dedicated infrastructure
3. **CDN**: Add Cloudflare for global content delivery
4. **Caching**: Implement Redis for session and API caching

## Development Best Practices

### Code Organization

- **Components**: Reusable UI components
- **Lib**: Business logic and utilities
- **App**: Pages and API routes
- **Types**: Centralized TypeScript definitions

### Testing Strategy

1. **Unit Tests**: Functions and utilities
2. **Component Tests**: React components
3. **Integration Tests**: API routes
4. **E2E Tests**: Critical user flows
5. **Manual Testing**: On physical devices

### Documentation

- Code comments for complex logic
- JSDoc for public functions
- README for setup instructions
- This ARCHITECTURE.md for system overview

## Future Enhancements

- [ ] GraphQL API (alternative to REST)
- [ ] Real-time updates with Supabase Realtime
- [ ] Advanced analytics dashboard
- [ ] Native mobile apps (React Native)
- [ ] AI-powered species identification
- [ ] Offline-first with CRDTs
- [ ] Multiplayer features
- [ ] Video streaming for lessons

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Expo Documentation](https://docs.expo.dev)
- [NextAuth.js Documentation](https://next-auth.js.org)

