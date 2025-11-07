# FieldQuest Deployment Guide

This guide walks you through deploying the FieldQuest mobile app to production.

## Prerequisites

- [ ] Supabase project created and configured
- [ ] Mapbox account with API token
- [ ] Apple Developer account (for iOS)
- [ ] Google Play Console account (for Android)
- [ ] EAS CLI installed: `npm install -g eas-cli`

## Step 1: Configure Supabase

### 1.1 Run Database Migrations

In your Supabase project SQL editor, run these migration files in order:

1. `lib/db/migrations/010_fieldquest.sql` - Core game tables
2. `lib/db/migrations/011_rpc_functions.sql` - Geospatial RPC functions
3. `lib/db/migrations/012_rpc_helpers.sql` - Helper functions

### 1.2 Deploy Edge Functions

```bash
cd FieldQuest

# Login to Supabase
npx supabase login

# Link your project
npx supabase link --project-ref your-project-ref

# Deploy all edge functions
npx supabase functions deploy world-nearby
npx supabase functions deploy encounter-start
npx supabase functions deploy encounter-throw
npx supabase functions deploy poi-interact
npx supabase functions deploy events-active
```

### 1.3 Enable PostGIS Extension

In Supabase SQL editor:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

### 1.4 Seed Test Data

```bash
# Copy environment variables
cp .env.example .env

# Edit .env with your Supabase credentials

# Run seed script
npm run seed
```

## Step 2: Configure Mapbox

1. Sign up at https://www.mapbox.com/
2. Create a new token with these scopes:
   - `styles:read`
   - `fonts:read`
   - `datasets:read`
3. Copy your token to `.env`:

```bash
EXPO_PUBLIC_MAPBOX_TOKEN=pk.your_token_here
```

## Step 3: Test Locally

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

## Step 4: Configure EAS Build

### 4.1 Initialize EAS

```bash
eas login
eas build:configure
```

### 4.2 Update app.json

```json
{
  "expo": {
    "name": "FieldQuest",
    "slug": "fieldquest",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "org.wildlifeleadership.fieldquest",
      "buildNumber": "1",
      "supportsTablet": true,
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "FieldQuest needs your location to show nearby wildlife and field sites.",
        "NSLocationAlwaysAndWhenInUseUsageDescription": "FieldQuest uses your location in the background to notify you of nearby wildlife.",
        "NSCameraUsageDescription": "FieldQuest needs camera access for AR wildlife encounters."
      }
    },
    "android": {
      "package": "org.wildlifeleadership.fieldquest",
      "versionCode": 1,
      "permissions": [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "CAMERA"
      ]
    }
  }
}
```

### 4.3 Configure Environment Variables

```bash
# Set secrets for EAS
eas secret:create --name NEXT_PUBLIC_SUPABASE_URL --value "https://your-project.supabase.co" --type string
eas secret:create --name NEXT_PUBLIC_SUPABASE_ANON_KEY --value "your-anon-key" --type string
eas secret:create --name EXPO_PUBLIC_MAPBOX_TOKEN --value "your-mapbox-token" --type string
```

## Step 5: Build for Production

### 5.1 iOS Build

```bash
# Build for TestFlight (internal testing)
eas build --platform ios --profile preview

# Build for App Store (production)
eas build --platform ios --profile production
```

### 5.2 Android Build

```bash
# Build APK for testing
eas build --platform android --profile preview

# Build AAB for Play Store
eas build --platform android --profile production
```

## Step 6: Submit to App Stores

### 6.1 iOS App Store

```bash
eas submit --platform ios
```

Required assets:
- App icon (1024x1024)
- Screenshots (multiple sizes)
- Privacy policy URL
- App description

### 6.2 Google Play Store

```bash
eas submit --platform android
```

Required assets:
- Feature graphic (1024x500)
- Icon (512x512)
- Screenshots (phone and tablet)
- Privacy policy URL
- App description

## Step 7: Monitoring & Analytics

### 7.1 Enable Sentry (Error Tracking)

```bash
npm install @sentry/react-native

# Initialize Sentry
npx @sentry/wizard -i reactNative -p ios android
```

### 7.2 Configure Analytics

Update `app/_layout.tsx` to include analytics:

```typescript
import * as Analytics from 'expo-firebase-analytics'

// Track screen views
Analytics.logEvent('screen_view', {
  screen_name: 'MapScreen',
})
```

## Step 8: Post-Launch Checklist

- [ ] Monitor Sentry for crash reports
- [ ] Check Supabase logs for edge function errors
- [ ] Monitor API rate limits
- [ ] Set up automated spawns using cron jobs
- [ ] Create first teacher spawn event
- [ ] Test with real users
- [ ] Gather feedback and iterate

## Troubleshooting

### "Edge function not found"

Ensure edge functions are deployed:
```bash
npx supabase functions list
```

### "Location permission denied"

Check that permissions are correctly configured in `app.json` and requested in code.

### "Mapbox map not loading"

Verify your Mapbox token is correctly set in environment variables and has the right scopes.

### Build fails with "Missing environment variable"

Ensure all secrets are set in EAS:
```bash
eas secret:list
```

## Support

For issues or questions:
- GitHub Issues: [your-repo]/issues
- Email: support@wildlifeleadershipacademy.org
- Documentation: [your-docs-url]

