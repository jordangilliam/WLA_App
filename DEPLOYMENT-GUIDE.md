# Complete Deployment Guide 🚀

## Overview

This guide covers deploying both **WLA_App** (Next.js PWA with Capacitor) and **FieldQuest** (React Native with Expo) to production.

---

## 📱 **WLA_App Deployment**

### Prerequisites

- [x] Node.js 18+ installed
- [x] Supabase project created
- [x] Stripe account (for payments)
- [ ] Apple Developer account ($99/year)
- [ ] Google Play Developer account ($25 one-time)
- [ ] Xcode installed (Mac only, for iOS)
- [ ] Android Studio installed (for Android)

### Step 1: Configure Environment Variables

Create `.env.local` with:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs
STRIPE_PRICE_SCHOOL_BASIC=price_...
STRIPE_PRICE_SCHOOL_PRO=price_...
STRIPE_PRICE_SCHOOL_UNLIMITED=price_...
STRIPE_PRICE_DISTRICT=price_...

# App URLs
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key
```

### Step 2: Set Up Database

```bash
# In Supabase SQL editor, run migrations in order:
1. lib/db/migrations/001_add_organizations.sql
2. lib/db/migrations/002_add_subscriptions.sql
```

### Step 3: Deploy to Vercel (Web Version)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# vercel.com → Your Project → Settings → Environment Variables
```

### Step 4: Build for Mobile (Capacitor)

```bash
# Install dependencies
npm install

# Build static export
npm run build:static

# Add iOS platform (Mac only)
npx cap add ios

# Add Android platform
npx cap add android

# Sync assets
npm run cap:sync

# Open in Xcode (iOS)
npm run cap:ios

# Open in Android Studio (Android)
npm run cap:android
```

### Step 5: Configure iOS (Mac + Xcode)

1. Open `ios/App/App.xcworkspace` in Xcode
2. Select the project → Signing & Capabilities
3. Choose your Team (Apple Developer account)
4. Set Bundle Identifier: `org.wildlifeleadership.wlaapp`
5. Add Capabilities:
   - Push Notifications
   - Background Modes (Location updates, Background fetch)
6. Configure `Info.plist`:
   ```xml
   <key>NSLocationWhenInUseUsageDescription</key>
   <string>WildPraxis needs your location for field trip check-ins</string>
   <key>NSCameraUsageDescription</key>
   <string>WildPraxis needs camera access for wildlife photo documentation</string>
   <key>NSPhotoLibraryUsageDescription</key>
   <string>WildPraxis needs access to save field trip photos</string>
   ```
7. Build → Archive
8. Distribute to App Store Connect
9. Submit for review

### Step 6: Configure Android (Android Studio)

1. Open `android/` folder in Android Studio
2. Update `android/app/build.gradle`:
   ```gradle
   android {
       defaultConfig {
           applicationId "org.wildlifeleadership.wlaapp"
           // ...
       }
       signingConfigs {
           release {
               storeFile file("your-release-key.keystore")
               storePassword "your-password"
               keyAlias "your-key-alias"
               keyPassword "your-password"
           }
       }
   }
   ```
3. Generate signing key:
   ```bash
   keytool -genkey -v -keystore your-release-key.keystore -alias your-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```
4. Build → Generate Signed Bundle/APK
5. Upload AAB to Google Play Console
6. Submit for review

---

## 🦌 **FieldQuest Deployment**

### Prerequisites

- [x] Expo account (free)
- [x] EAS CLI installed
- [ ] Apple Developer account
- [ ] Google Play Developer account

### Step 1: Configure Environment

Create `FieldQuest/.env` with:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
EXPO_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
```

### Step 2: Set Up Database

```bash
# In Supabase SQL editor, run FieldQuest migrations:
1. FieldQuest/lib/db/migrations/010_fieldquest.sql
2. FieldQuest/lib/db/migrations/011_rpc_functions.sql
3. FieldQuest/lib/db/migrations/012_rpc_helpers.sql
4. FieldQuest/lib/db/migrations/013_achievements.sql

# Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
```

### Step 3: Deploy Edge Functions

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

### Step 4: Seed Data

```bash
cd FieldQuest

# Seed PA species + Pittsburgh sites
npm run seed:all
```

### Step 5: Configure EAS

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure
```

Update `eas.json`:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "env": {
        "NEXT_PUBLIC_SUPABASE_URL": "https://your-project.supabase.co",
        "EXPO_PUBLIC_MAPBOX_TOKEN": "your-mapbox-token"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Step 6: Set EAS Secrets

```bash
# Set secrets (not in code)
eas secret:create --name NEXT_PUBLIC_SUPABASE_ANON_KEY --value "your-anon-key" --type string
eas secret:create --name SUPABASE_SERVICE_ROLE_KEY --value "your-service-key" --type string
```

### Step 7: Build for iOS

```bash
# Build for TestFlight
eas build --platform ios --profile production

# Wait for build to complete (15-30 minutes)
# Download and install on device for testing

# Submit to App Store
eas submit --platform ios
```

### Step 8: Build for Android

```bash
# Build AAB for Play Store
eas build --platform android --profile production

# Wait for build
# Download and test

# Submit to Play Store
eas submit --platform android
```

---

## 🎨 **App Assets (Both Apps)**

### WLA_App Assets

Place in `public/` folder:
- `icon.png` (512x512) - App icon
- `splash.png` (2048x2732) - Splash screen

### FieldQuest Assets

Place in `FieldQuest/assets/` folder (from WildPraxis logo):
- `icon.png` (1024x1024)
- `adaptive-icon.png` (1024x1024)
- `splash.png` (2048x2048)
- `notification-icon.png` (96x96)

Use ImageMagick to process (see `FieldQuest/README-ASSETS.md`).

---

## 🔐 **Security Checklist**

### Before Production:

- [ ] Change all default passwords
- [ ] Set up Stripe webhook (https://your-domain.com/api/webhooks/stripe)
- [ ] Enable RLS policies in Supabase
- [ ] Set up Sentry for error tracking
- [ ] Configure CORS for your domain
- [ ] Enable rate limiting (Upstash Redis)
- [ ] Set up backup strategy for database
- [ ] Configure monitoring alerts
- [ ] Test all payment flows
- [ ] Test subscription webhooks
- [ ] Verify mobile deep linking
- [ ] Test push notifications

---

## 📊 **Post-Deployment**

### Monitor

- Vercel Analytics (web traffic)
- Supabase Dashboard (database, API)
- Stripe Dashboard (subscriptions, revenue)
- Apple App Store Connect (iOS downloads, crashes)
- Google Play Console (Android downloads, crashes)

### Update Process

**WLA_App**:
```bash
# Update code
npm run build
vercel --prod

# Update mobile
npm run build:static
npm run cap:sync
# Then rebuild in Xcode/Android Studio
```

**FieldQuest**:
```bash
# OTA update (small changes)
eas update --branch production

# Full rebuild (native changes)
eas build --platform all --profile production
eas submit --platform all
```

---

## 🎯 **Quick Commands Reference**

### WLA_App

```bash
npm run dev                    # Local development
npm run build                  # Web build
npm run build:static           # Static export for Capacitor
npm run cap:sync               # Sync web → native
npm run cap:ios                # Open Xcode
npm run cap:android            # Open Android Studio
npm run deploy:mobile          # Build + sync
```

### FieldQuest

```bash
npm start                      # Development server
npm run seed:pittsburgh        # Seed Pittsburgh sites
npm run seed:all               # Seed everything
npm test                       # Run tests
eas build --platform ios       # Build iOS
eas build --platform android   # Build Android
eas submit --platform all      # Submit to stores
```

---

## 🆘 **Troubleshooting**

### "Build failed" in EAS
- Check `eas.json` configuration
- Verify all secrets are set
- Check logs: `eas build:list`

### "Static export failed" in Next.js
- Remove dynamic routes or use `generateStaticParams`
- Check `next.config.js` output mode
- Verify no runtime-only features

### "Supabase connection failed"
- Verify environment variables
- Check RLS policies
- Test with Supabase client directly

### "Stripe webhook not receiving events"
- Verify webhook URL is publicly accessible
- Check webhook signature
- Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### "Push notifications not working"
- iOS: Check provisioning profile includes push capability
- Android: Verify google-services.json is configured
- Test with Expo push notification tool

---

## 📱 **App Store Submission Checklist**

### Apple App Store

- [ ] App icon (1024x1024)
- [ ] Screenshots (6.5", 5.5" displays)
- [ ] App name and subtitle
- [ ] Description (4000 chars)
- [ ] Keywords
- [ ] Support URL
- [ ] Privacy policy URL
- [ ] Age rating
- [ ] Test account credentials (for review)

### Google Play Store

- [ ] Feature graphic (1024x500)
- [ ] App icon (512x512)
- [ ] Screenshots (phone + tablet)
- [ ] Short description (80 chars)
- [ ] Full description (4000 chars)
- [ ] Privacy policy URL
- [ ] Content rating
- [ ] Test track (internal/closed/open)

---

## 🎉 **Launch Day!**

1. Monitor error tracking closely
2. Watch for crash reports
3. Respond to user reviews
4. Check payment webhooks working
5. Verify sync is functioning
6. Monitor API rate limits
7. Track user signups
8. Celebrate! 🥳

---

**Status**: Ready for deployment! ✅  
**Last Updated**: November 8, 2024  
**Contact**: support@wildlifeleadershipacademy.org

