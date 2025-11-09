# WLA App Development Guide

## Quick Start

### Prerequisites

- **Node.js** 18.x or higher ([nodejs.org](https://nodejs.org))
- **npm** 9.x or higher (comes with Node.js)
- **Git** for version control
- **VS Code** (recommended) or your preferred code editor

### Initial Setup

1. **Clone the repository**
```powershell
git clone https://github.com/jordangilliam/WLA_App.git
cd WLA_App
```

2. **Install dependencies**
```powershell
npm install
```

3. **Set up environment variables**

Create `.env.local` in the project root:
```
NEXT_PUBLIC_SUPABASE_URL=https://vaqcsbneypmdhrqnnjph.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-a-random-32-char-string

# Optional: For OAuth providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
AZURE_AD_CLIENT_ID=your-azure-client-id
AZURE_AD_CLIENT_SECRET=your-azure-secret
AZURE_AD_TENANT_ID=common

# Optional: For payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

4. **Run the development server**
```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
WLA_App/
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes
│   │   ├── auth/         # NextAuth.js configuration
│   │   ├── classes/      # Class management endpoints
│   │   ├── student/      # Student-specific endpoints
│   │   └── user/         # User profile endpoints
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Teacher/student dashboards
│   ├── journal/          # Field journal feature
│   ├── map/              # Interactive map
│   └── ...               # Other app pages
│
├── components/            # Reusable React components
│
├── lib/                   # Core libraries
│   ├── db/               # Database client and types
│   │   ├── client.ts     # Supabase client initialization
│   │   ├── types.ts      # TypeScript type definitions
│   │   └── migrations/   # SQL migration files
│   ├── auth/             # Authentication utilities
│   ├── offline/          # Offline-first functionality
│   │   ├── indexeddb.ts  # IndexedDB manager
│   │   └── sync-engine.ts # Sync manager
│   ├── capacitor/        # Native mobile plugins
│   └── monitoring/       # Sentry error tracking
│
├── public/                # Static assets
│   ├── sw.js             # Service worker for PWA
│   └── ...
│
├── FieldQuest/            # Separate React Native mobile app
│   ├── app/              # Expo Router navigation
│   ├── components/       # React Native components
│   ├── lib/              # Game logic and utilities
│   └── ...
│
├── capacitor.config.ts    # Capacitor configuration
├── next.config.js         # Next.js configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## Development Workflow

### Running the App

```powershell
# Development server (with hot reload)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type checking
npx tsc --noEmit
```

### Working with the Database

**Connect to Supabase:**
1. Go to [app.supabase.com](https://app.supabase.com)
2. Open your WildPraxis project
3. Go to Settings → API to get your keys

**Run migrations:**
1. Go to SQL Editor in Supabase Dashboard
2. Create a new query
3. Copy/paste SQL from `lib/db/migrations/`
4. Execute the query

**Common queries:**

```sql
-- View all users
SELECT * FROM users;

-- View all classes
SELECT * FROM classes;

-- View class enrollments
SELECT 
  ce.*, 
  u.name as student_name, 
  c.name as class_name
FROM class_enrollments ce
JOIN users u ON ce.user_id = u.id
JOIN classes c ON ce.class_id = c.id;
```

### Authentication Testing

**Test OAuth Providers:**
1. Google OAuth: Go to [console.cloud.google.com](https://console.cloud.google.com)
   - Create OAuth 2.0 credentials
   - Add redirect URI: `http://localhost:3000/api/auth/callback/google`
   
2. Azure AD: Go to [portal.azure.com](https://portal.azure.com)
   - Register new application
   - Add redirect URI: `http://localhost:3000/api/auth/callback/azure-ad`

**Test Email/Password:**
- Use the `CredentialsProvider` in `app/api/auth/auth.config.ts`
- Any email/password combo works for testing (creates new user)

### API Development

**Creating new API routes:**

1. Create file in `app/api/your-route/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/auth.config'
import { supabaseAdmin } from '@/lib/db/client'

export async function GET(req: NextRequest) {
  // 1. Authenticate
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Query database
  const { data, error } = await supabaseAdmin
    .from('your_table')
    .select('*')
    .eq('user_id', (session.user as any).id)

  // 3. Return response
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
```

2. Test with `curl` or Postman:
```bash
curl http://localhost:3000/api/your-route
```

### Component Development

**Best practices:**
- Use TypeScript for all components
- Define prop interfaces
- Use React hooks appropriately
- Keep components small and focused

**Example component:**

```typescript
// components/SpeciesCard.tsx
import { Species } from '@/lib/types'

interface SpeciesCardProps {
  species: Species
  onClick?: () => void
}

export function SpeciesCard({ species, onClick }: SpeciesCardProps) {
  return (
    <div 
      className="border rounded-lg p-4 cursor-pointer hover:shadow-lg"
      onClick={onClick}
    >
      <h3 className="font-bold">{species.common_name}</h3>
      <p className="text-sm text-gray-600">{species.scientific_name}</p>
      <span className={`badge badge-${species.rarity}`}>
        {species.rarity}
      </span>
    </div>
  )
}
```

### Styling

The app uses **Tailwind CSS** for styling:
- Utility-first CSS framework
- Configuration in `tailwind.config.js`
- Custom colors in `styles/globals.css`

**Common patterns:**
```typescript
// Card
<div className="bg-white rounded-lg shadow-md p-6">

// Button
<button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Responsive
<div className="hidden md:block"> {/* Desktop only */}
<div className="md:hidden"> {/* Mobile only */}
```

## Mobile Development

### Capacitor (iOS/Android)

**Setup:**
```powershell
# Install Capacitor dependencies
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios @capacitor/android

# Initialize platforms (already done)
npx cap init

# Build static export
npm run build:static

# Sync to native projects
npm run cap:sync

# Open in Xcode (macOS only)
npm run cap:ios

# Open in Android Studio
npm run cap:android
```

**Testing mobile features:**
- Use Chrome DevTools device emulation
- Test on physical devices for native plugins
- iOS requires macOS with Xcode
- Android requires Android Studio

### FieldQuest (React Native)

Located in `/FieldQuest` directory:

```powershell
cd FieldQuest

# Install dependencies
npm install

# Start Expo development server
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android

# Run tests
npm test
```

## Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Sign in with Google OAuth
- [ ] Sign in with Azure AD
- [ ] Sign in with email/password
- [ ] Sign out
- [ ] Protected routes redirect to login

**Teacher Features:**
- [ ] Create a class
- [ ] View class roster
- [ ] Add students to class
- [ ] Remove students from class
- [ ] Export class data

**Student Features:**
- [ ] Join class with code
- [ ] View enrolled classes
- [ ] Access journal
- [ ] Create journal entries
- [ ] Upload photos

**Offline Mode:**
- [ ] App loads when offline
- [ ] Can view cached content
- [ ] Journal entries queue when offline
- [ ] Data syncs when back online

### Automated Testing

Currently minimal - future implementation:
```powershell
# Run unit tests (when implemented)
npm test

# Run E2E tests (when implemented)
npm run test:e2e

# Coverage report
npm run test:coverage
```

## Debugging

### Browser DevTools

**React Developer Tools:**
- Install extension for Chrome/Firefox
- Inspect component tree
- View props and state

**Network Tab:**
- Monitor API calls
- Check request/response payloads
- Verify authentication headers

**Application Tab:**
- View localStorage
- Inspect IndexedDB
- Check service worker status

### VS Code Debugging

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### Common Issues

**Port 3000 already in use:**
```powershell
# Find process on port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

**Module not found:**
```powershell
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Clear Next.js cache
rm -rf .next
npm run dev
```

**Supabase connection errors:**
- Verify environment variables are set
- Check Supabase project is active (not paused)
- Verify API keys are correct
- Check network/firewall isn't blocking requests

## Code Quality

### Linting

The project uses ESLint:
```powershell
# Run linter
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

Common rules:
- No unused variables
- Proper React hooks usage
- Accessibility best practices
- TypeScript strict mode

### Type Checking

```powershell
# Check types
npx tsc --noEmit

# Watch mode
npx tsc --noEmit --watch
```

### Formatting

Use Prettier (recommended VS Code extension):
- Auto-format on save
- Configuration in `.prettierrc`

## Git Workflow

### Branch Strategy

```
main          # Production-ready code
├─ develop    # Integration branch (if needed)
├─ feature/x  # New features
├─ fix/x      # Bug fixes
└─ hotfix/x   # Urgent production fixes
```

### Commit Messages

Follow conventional commits:
```
feat: add species collection tracking
fix: resolve authentication redirect loop
docs: update deployment guide
refactor: simplify class enrollment logic
test: add unit tests for geo utilities
```

### Pull Request Process

1. Create feature branch from `main`
2. Make changes and commit
3. Push to GitHub
4. Create pull request
5. Wait for checks to pass
6. Review and merge

## Performance Optimization

### Next.js Optimization

**Image Optimization:**
```typescript
import Image from 'next/image'

<Image
  src="/species/trout.jpg"
  width={500}
  height={300}
  alt="Brook Trout"
/>
```

**Dynamic Imports:**
```typescript
import dynamic from 'next/dynamic'

const MapComponent = dynamic(
  () => import('@/components/MapView'),
  { ssr: false } // Don't render on server
)
```

**API Route Optimization:**
- Add response caching headers
- Use database connection pooling
- Implement request debouncing
- Add pagination for large datasets

### Bundle Size

```powershell
# Analyze bundle size
npm run build
# Check .next/build-manifest.json

# Use webpack-bundle-analyzer (if configured)
ANALYZE=true npm run build
```

## Environment-Specific Configuration

### Development (.env.local)
- Local database
- Test API keys
- Debug logging enabled

### Staging (.env.staging)
- Staging database
- Test payment processor
- Limited features

### Production (.env.production)
- Production database
- Live API keys
- Error tracking enabled
- Analytics enabled

## Security Best Practices

**Never commit:**
- `.env.local` or `.env` files
- API keys or secrets
- Private keys or certificates
- User data or passwords

**Always:**
- Use environment variables for secrets
- Validate user input
- Sanitize database queries (use Supabase parameterized queries)
- Implement proper authentication checks
- Use HTTPS in production
- Keep dependencies updated

## Resources

### Documentation
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)
- **React**: [react.dev](https://react.dev)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Capacitor**: [capacitorjs.com/docs](https://capacitorjs.com/docs)
- **Expo**: [docs.expo.dev](https://docs.expo.dev)

### Community
- GitHub Issues: Report bugs and request features
- Wildlife Leadership Academy: Contact for educational content questions

### Learning Resources
- [Next.js Learn](https://nextjs.org/learn)
- [React Patterns](https://reactpatterns.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [Supabase University](https://supabase.com/docs/guides)

## Next Steps

After setting up your development environment:
1. Review [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the system
2. Review [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment procedures
3. Pick a task from GitHub Issues
4. Create a feature branch and start coding!
5. Submit a pull request when ready

