# FieldQuest - Pokémon GO for Wildlife Education

A location-based mobile game for Wildlife Leadership Academy that gamifies outdoor education through AR wildlife encounters.

## Features

- 🗺️ Real-time map showing nearby field sites and wildlife spawns
- 📍 GPS-based location tracking and geofencing
- 🦌 AR wildlife encounters (with non-AR fallback)
- 📸 Photo journal with species identification
- 👨‍🏫 Teacher-created spawn events tied to classes
- 🏆 XP, levels, and species collection
- 🔐 Server-authoritative anti-cheat system

## Setup

### Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator or Android Emulator (or physical device)

### Installation

```bash
cd FieldQuest
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in:

```bash
cp .env.example .env
```

Required:
- `EXPO_PUBLIC_SUPABASE_URL` - From Supabase project settings
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - From Supabase project settings
- `EXPO_PUBLIC_MAPBOX_TOKEN` - From Mapbox account
- `EXPO_PUBLIC_API_BASE_URL` - Your WLA_App deployment URL

### Run Development Server

```bash
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on physical device

## Database Setup

Run migrations in Supabase SQL editor:

```bash
# In order:
1. lib/db/migrations/010_fieldquest.sql
2. lib/db/migrations/011_rpc_functions.sql
```

Seed with demo data:

```bash
npm run seed
```

## Testing

```bash
npm test
```

## Architecture

- **App**: Expo + React Native with Expo Router
- **State**: Zustand + React Query
- **Maps**: Mapbox GL
- **AR**: Expo GL + Three.js (abstracted for ARKit/ARCore)
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Auth**: Shared with WLA_App via JWT tokens

## Integration with WLA_App

FieldQuest syncs with the existing WLA web app:
- Shares user authentication
- Teachers create spawn events in web dashboard
- Game XP syncs to user profiles
- Species catches visible to teachers in class roster

## Project Structure

```
FieldQuest/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Bottom tab navigation
│   │   ├── map.tsx        # Main map screen
│   │   ├── collection.tsx # Species collection
│   │   ├── journal.tsx    # Photo journal
│   │   └── profile.tsx    # User profile
│   ├── encounter/         # Encounter flows
│   │   └── [spawnId].tsx
│   └── _layout.tsx
├── components/            # Reusable components
│   ├── map/
│   ├── ar/
│   └── shared/
├── lib/                   # Core utilities
│   ├── api.ts
│   ├── location.ts
│   ├── geo.ts
│   └── auth.ts
├── state/                 # Zustand stores
├── hooks/                 # Custom hooks
└── config/               # Game configuration
    ├── species.json
    └── spawn_tables.json
```

## Contributing

This project is part of the Wildlife Leadership Academy educational platform.

## License

Proprietary - Wildlife Leadership Academy

