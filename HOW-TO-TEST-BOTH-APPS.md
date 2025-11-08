# 🎮 How to Test Both Apps

## 🏫 **WLA_App - Education Platform**

### Where to Find Payment/Admin Features

**Admin Dashboard** (where subscriptions happen):
```
http://localhost:3000/admin/dashboard
```

This shows:
- All organizations
- Subscription status
- Student/teacher counts
- "Add Organization" button

**To Test Payments:**
1. Go to: http://localhost:3000/admin/dashboard
2. Click "Add Organization" (or select existing org)
3. Choose a subscription plan (Basic/Pro/Unlimited/District)
4. You'll be redirected to Stripe checkout
5. Use test card: `4242 4242 4242 4242`

**Teacher Features:**
```
http://localhost:3000/teacher/dashboard
http://localhost:3000/teacher/classes
```

**Student Features:**
```
http://localhost:3000/student/dashboard
http://localhost:3000/student/classes
```

---

## 🦌 **FieldQuest - Mobile Game**

FieldQuest is a separate React Native app in the `FieldQuest/` folder!

### Setup FieldQuest (First Time Only)

```powershell
# Navigate to FieldQuest folder
cd FieldQuest

# Install dependencies
..\node-portable\npm.cmd install

# Create .env file
Copy-Item .env.example .env
```

Then edit `FieldQuest/.env` with your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
EXPO_PUBLIC_MAPBOX_TOKEN=your-mapbox-token  # Optional for now
```

### Run FieldQuest

**Option 1: Web (Easiest for testing)**
```powershell
cd FieldQuest
..\node-portable\npm.cmd start
# Press 'w' for web
```

**Option 2: iOS Simulator (Mac only)**
```powershell
cd FieldQuest
..\node-portable\npm.cmd run ios
```

**Option 3: Android Emulator**
```powershell
cd FieldQuest
..\node-portable\npm.cmd run android
```

**Option 4: Your Phone (Expo Go app)**
1. Install "Expo Go" app on your phone
2. Run `npm start` in FieldQuest folder
3. Scan QR code with your phone

---

## 🔗 **Connecting the Two Apps**

### Current Status
- **WLA_App**: Teachers manage classes, students join
- **FieldQuest**: Students play game, collect species

### They Share:
- Same Supabase database
- Same user accounts
- Same classes
- Field trip locations

### How They Work Together:

1. **Teacher** uses WLA_App to:
   - Create class
   - Give students class code
   - Create spawn events at field sites

2. **Students** use FieldQuest to:
   - Join class (using code from teacher)
   - Go to field sites
   - Catch wildlife (Pokemon GO style)
   - Earn XP and achievements

3. **Teacher** sees progress in WLA_App:
   - Student engagement
   - Species collected
   - Field trip check-ins

---

## 🎯 **Quick Test Flow**

### Test WLA_App:
1. Start: `npm run dev` (in root folder)
2. Visit: http://localhost:3000
3. Sign up as teacher
4. Go to admin dashboard
5. Try subscribing (test card)

### Test FieldQuest:
1. Start: `npm start` (in FieldQuest folder)
2. Press 'w' for web
3. Visit: http://localhost:19006
4. Sign up (same account)
5. Explore map
6. See Pittsburgh field sites

---

## 🌐 **Should There Be a Link Between Them?**

**Good idea!** Let's add links:

### In WLA_App → Link to FieldQuest:
- Add "Download FieldQuest App" button
- Show QR code to download mobile app
- Link to App Store / Play Store (once published)

### In FieldQuest → Link to WLA_App:
- Add "Teacher Dashboard" link
- Opens web browser to WLA_App
- For teachers to manage classes on desktop

---

## 📱 **For Now (Testing)**

**WLA_App runs on:**
- http://localhost:3000 (desktop/teacher interface)

**FieldQuest runs on:**
- http://localhost:19006 (Expo web version)
- Or Expo Go app on your phone
- Or iOS Simulator / Android Emulator

Both use the SAME database, so:
- Create class in WLA_App
- Join it in FieldQuest
- Teacher sees student progress in WLA_App!

---

## 🚀 **Production Setup (Later)**

When deployed:
- **WLA_App**: https://wildpraxis.vercel.app
- **FieldQuest**: Native apps on App Store / Play Store
- Cross-links between them
- Single sign-on (same Supabase auth)

---

**Want me to:**
1. Add cross-links between the apps?
2. Help set up FieldQuest now?
3. Show you the admin dashboard features?

Let me know what you'd like to explore first! 🎮

