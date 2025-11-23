# Mission System Features

## Overview
Three modular components for the Carmen Sandiego x Pokémon GO style mission system:

1. **Seed Script** - Sample missions with storylines
2. **AR Map Hooks** - Location-based triggers and geofencing
3. **Mission Media** - Visual storytelling and evidence collection

---

## 1. Seed Script (`scripts/seed-missions.ts`)

### Purpose
Populates the database with sample missions featuring:
- Watershed mysteries
- Invasive plant tracking
- Wildlife rescue operations
- Pollinator pathway mapping

### Usage
```bash
# Set environment variables in .env
NEXT_PUBLIC_SUPABASE_URL=your_url
SUPABASE_SERVICE_ROLE_KEY=your_key

# Run seed script
npx tsx scripts/seed-missions.ts
```

### Features
- 4 complete missions with 4 stages each
- Carmen Sandiego-style narratives
- Location-based challenges
- Photo/observation requirements
- Reward badges and points

---

## 2. AR Map Hooks (`components/missions/MissionMapHooks.tsx`)

### Purpose
Provides location-based mission triggers similar to Pokémon GO's geofencing system.

### Key Components

#### `useMissionMap` Hook
```typescript
const {
  location,
  nearbyLocations,
  proximityAlerts,
  reachedLocations,
  geoError,
  isTracking,
} = useMissionMap({
  missionLocations: MissionLocation[],
  proximityThreshold?: number, // meters (default: 200)
  updateInterval?: number, // ms (default: 5000)
  onProximityAlert?: (alert: ProximityAlert) => void,
  onLocationReached?: (location: MissionLocation) => void,
})
```

#### `MissionProximityAlert` Component
Displays floating alerts when users approach mission locations.

### Features
- Real-time geofence detection
- Distance calculations (Haversine formula)
- Proximity alerts with customizable thresholds
- Location reached callbacks
- Automatic location tracking updates

### Integration Example
```typescript
import { useMissionMap, MissionProximityAlert } from '@/components/missions/MissionMapHooks'

// In your component
const { proximityAlerts } = useMissionMap({
  missionLocations: locations,
  onProximityAlert: (alert) => {
    // Show notification
  },
  onLocationReached: (location) => {
    // Trigger stage progression
  },
})

// Render alerts
<MissionProximityAlert alerts={proximityAlerts} />
```

---

## 3. Mission Media (`components/missions/MissionMedia.tsx`)

### Purpose
Handles visual storytelling with hero images, galleries, and evidence collection.

### Key Components

#### `MissionHeroImage`
Displays large hero images for missions with overlay text.

#### `MissionMediaGallery`
Grid of media items (images, videos, audio, documents) with click handlers.

#### `MissionMediaModal`
Full-screen media viewer with metadata display.

#### `MissionMedia` (Main Component)
```typescript
<MissionMedia
  missionId={missionId}
  stageId={stageId} // optional
  heroImageUrl={heroImageUrl}
  mediaItems={mediaItems} // optional - will fetch if not provided
  onMediaClick={(media) => setSelectedMedia(media)}
  showHero={true}
  showGallery={true}
/>
```

### Features
- Hero image display with synopsis overlay
- Media gallery with thumbnails
- Full-screen media modal
- Support for images, videos, audio, documents
- API integration for fetching media

### API Endpoints
- `GET /api/story-missions/[missionId]/media` - Fetch mission media
- `GET /api/story-missions/[missionId]/stages/[stageId]/media` - Fetch stage media

---

## Integration Status

### ✅ Completed
- Seed script with 4 sample missions
- AR map hooks with geofencing
- Mission media components
- API endpoints for media
- Mission page integration
- Mission card with hero images
- Proximity alerts UI

### 🔄 Next Steps
1. Create `mission_locations` table for persistent location data
2. Add location management in admin panel
3. Integrate with field sites API
4. Add AR overlay components (WebXR/AR.js)
5. Connect media uploads to observation system

---

## File Structure

```
scripts/
  └── seed-missions.ts          # Seed script

components/missions/
  ├── MissionCard.tsx            # Mission card with hero image
  ├── MissionMapHooks.tsx         # Location-based hooks
  ├── MissionMedia.tsx            # Media components
  └── MissionStageList.tsx        # Stage checklist

app/
  ├── missions/
  │   └── page.tsx                # Main mission hub
  └── api/story-missions/
      ├── route.ts                # List/create missions
      └── [missionId]/
          ├── route.ts            # Get mission details
          ├── progress/route.ts   # Progress tracking
          ├── locations/route.ts  # Location endpoints
          └── media/route.ts      # Media endpoints
```

---

## Design Philosophy

### Carmen Sandiego Style
- Mystery-driven narratives
- Clue collection and evidence gathering
- Multi-stage investigations
- Visual storytelling

### Pokémon GO Style
- Location-based triggers
- Geofencing and proximity alerts
- Field exploration
- Real-world interaction

### Combined Experience
- Story missions unlock at specific locations
- Evidence collection through photos/observations
- Progress tracking across multiple sites
- Community challenges and leaderboards



