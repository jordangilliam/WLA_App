# Package Installation Instructions

## Prerequisites

Before proceeding, ensure you have:
- Node.js 18+ installed
- npm or yarn package manager
- Access to terminal/command prompt

## Step 1: Install Core Dependencies

These are required for Phase 1 (Database & Security):

```bash
npm install @supabase/supabase-js zod
```

**What these do:**
- `@supabase/supabase-js` - PostgreSQL database client for Supabase
- `zod` - TypeScript-first schema validation library

## Step 2: Verify Installation

Check that packages were installed:

```bash
npm list @supabase/supabase-js zod
```

You should see both packages listed with version numbers.

## Step 3: Install Optional Dependencies (Recommended)

For production-ready features:

```bash
npm install @upstash/redis
```

**What this does:**
- `@upstash/redis` - Redis client for rate limiting in production

## Step 4: Phase 3 Dependencies (Later)

When ready for Capacitor mobile development (Week 7+):

```bash
# Capacitor core
npm install @capacitor/core @capacitor/cli

# Platform support
npm install @capacitor/ios @capacitor/android

# Native plugins
npm install @capacitor/camera @capacitor/geolocation @capacitor/filesystem @capacitor/preferences @capacitor/app @capacitor/haptics @capacitor/keyboard @capacitor/network @capacitor/status-bar
```

## Step 5: Dev Dependencies

For testing and development:

```bash
npm install -D @types/node typescript eslint
```

## Troubleshooting

### Error: "npm not found"

**Windows:**
```powershell
# Check if Node.js is installed
node --version

# If not installed, download from: https://nodejs.org/
# Restart terminal after installation
```

**Mac/Linux:**
```bash
# Check if Node.js is installed
node --version

# Install via nvm (recommended):
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### Error: "Permission denied"

**Mac/Linux:**
```bash
sudo npm install @supabase/supabase-js zod
```

**Windows:**
Run terminal as Administrator

### Error: "EACCES" or "EPERM"

This means npm doesn't have permission to install packages. Fix by:

```bash
# Set npm to use local directory
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Error: "Package not found" or "Network error"

Check your internet connection and try again. Or use yarn instead:

```bash
# Install yarn
npm install -g yarn

# Use yarn to install
yarn add @supabase/supabase-js zod
```

## Verification

After installation, verify the app still builds:

```bash
npm run dev
```

Visit `http://localhost:3000` - the app should load without errors.

## Next Steps

1. ✅ Dependencies installed
2. 📖 Follow `SUPABASE_SETUP_GUIDE.md` to set up database
3. 🔐 Add environment variables to `.env.local`
4. 🚀 Start implementing API routes with Supabase

## Package Versions

**Current (as of November 2025):**
- `@supabase/supabase-js`: ^2.39.0
- `zod`: ^3.22.4
- `@upstash/redis`: ^1.28.0

Check for updates: `npm outdated`

