# Changelog

All notable changes to WildPraxis will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

#### Fly Fishing Features
- **Expert Knowledge System** - Comprehensive techniques and patterns from legendary anglers
  - Joe Humphreys techniques (High-Stick Nymphing, Leisenring Lift, Streamer Techniques, Dry Fly Presentation)
  - George Daniel techniques (French Nymphing, Czech Nymphing, Tight-Line Nymphing, Competition Techniques)
  - Expert fly patterns (Joe's Hopper, Humphreys Nymph, Perdigon, Squirmy Wormy, Competition Nymphs)
  - Expert favorite locations with detailed notes
  - Expert publications database
  
- **Macroinvertebrate Hatch System** - Complete hatch information for Pennsylvania waterways
  - 9 major hatch species (Hendrickson, Sulphur, Trico, Midges, Grannom, March Brown, Isonychia, BWO, Tiny BWO)
  - Hatch timing data (start month, peak month, end month)
  - Time of day preferences (morning, afternoon, evening, night, all-day)
  - Water temperature ranges (min, optimal, max)
  - Water type associations (limestone, freestone, spring-fed, tailwater)
  - Hook sizes and color descriptions
  - Waterway-specific hatch associations with intensity ratings
  
- **Seasonal Waterway Data** - Comprehensive seasonal fishing information
  - Best seasons for each waterway
  - Seasonal notes (spring, summer, fall, winter)
  - Average water temperatures by season
  - Ice fishing information
  - Stocking schedules (spring and fall)
  - 254 waterways with full seasonal data
  
- **Fly Fishing Shop Database** - Complete directory of Pennsylvania fly shops
  - 60+ fly fishing shops across PA
  - Location data (address, coordinates, region, county)
  - Services offered (guides, classes, fly tying, custom rods, lodging)
  - Contact information (phone, email, website)
  - Specialties and notes

#### PFBC Data Integration
- **Mapping Layers** - Official Pennsylvania Fish & Boat Commission designations
  - 110+ Class A trout streams
  - Wild Trout waters
  - Stocked trout waters
  - Catch & Release sections
  - Delayed Harvest areas
  - Trophy Trout waters
  - Special Regulation areas
  - Best Bass Waters
  - Trophy Bass waters
  - Largemouth and Smallmouth Bass designations
  - Other species waters (Walleye, Muskie, Steelhead)
  
- **Stocking Schedules** - Complete PFBC stocking data
  - 13+ stocking schedule entries
  - Species information (trout, bass, muskie, walleye)
  - Stocking dates and locations
  - Quantity and size class data
  - Average length information
  - Geospatial coordinates
  
- **Access Points** - Public fishing access locations
  - 15+ access points
  - Access types (boat launch, shore access, wade access, fly fishing only, handicap accessible)
  - Amenities information
  - Parking availability
  - Wheelchair accessibility
  - Geospatial coordinates
  
- **Fishing Regulations** - Comprehensive regulation data
  - 8+ regulation entries
  - Regulation types (Catch & Release, Delayed Harvest, Trophy Trout, Special Regulation, Size Limit, Creel Limit)
  - Season information
  - Species-specific regulations
  - Section-specific rules
  
- **Habitat Installations** - PFBC habitat enhancement data
  - 7+ habitat installation records
  - Installation types (Lunker Structure, Fish Attractor, Habitat Enhancement, Spawning Bed, Cover Structure)
  - Target species information
  - Installation dates
  - Geospatial coordinates
  - Detailed descriptions

#### API Endpoints
- `GET /api/waterways/hatches` - Macroinvertebrate hatch data
- `GET /api/experts/techniques` - Expert fly fishing techniques
- `GET /api/experts/patterns` - Expert fly patterns
- `GET /api/shops/nearby` - Find nearby fly fishing shops
- `GET /api/shops/all` - Get all Pennsylvania fly shops
- `GET /api/pfbc/mapping-layers` - PFBC mapping layer data
- `GET /api/pfbc/stocking` - Stocking schedules
- `GET /api/pfbc/access-points` - Fishing access points
- `GET /api/pfbc/regulations` - Fishing regulations
- `GET /api/pfbc/habitat` - Habitat installations

### Database

#### Migrations
- **Migration 027** - Seasonal waterway data and macroinvertebrate hatches
  - Added `macroinvertebrate_hatches` table
  - Added `waterway_hatches` association table
  - Extended `water_body_details` with seasonal data columns
  - Seeded 9 hatch species
  - Added seasonal data for 5 major waterways
  
- **Migration 028** - Fly fishing experts and shops
  - Added `fly_fishing_experts` table
  - Added `expert_techniques` table
  - Added `expert_patterns` table
  - Added `expert_favorite_locations` table
  - Added `expert_publications` table
  - Added `fly_fishing_shops` table
  - Seeded data for Joe Humphreys and George Daniel
  - Seeded 10 fly fishing shops
  - Seeded 7 Trout Unlimited chapters
  
- **Migration 029** - PFBC mapping layers
  - Added `pfbc_trout_streams` table
  - Added `pfbc_bass_waters` table
  - Added `pfbc_other_species_waters` table
  - Extended `fly_fishing_shops` with specialties and notes
  - Seeded 110+ stream designations
  - Seeded bass water designations
  - Seeded other species water designations
  
- **Migration 030** - Complete PFBC integration
  - Added `pfbc_stocking_schedules` table
  - Added `pfbc_access_points` table
  - Added `pfbc_regulations` table
  - Added `pfbc_habitat_installations` table
  - Seeded 13 stocking schedules
  - Seeded 15 access points
  - Seeded 8 regulations
  - Seeded 7 habitat installations

#### Row Level Security
- Public read access to all fly fishing and PFBC data tables
- Secure write access limited to authenticated administrators

### Documentation
- Created `docs/MIGRATIONS_027_030.md` - Complete migration guide
- Created `docs/FLY_FISHING_GUIDE.md` - User guide for fly fishing features
- Created `docs/PFBC_DATA_GUIDE.md` - PFBC data usage guide
- Created `docs/EXPERT_KNOWLEDGE_GUIDE.md` - Expert knowledge system guide
- Updated `DEPLOYMENT_CHECKLIST.md` with new migration verification
- Created `DEPLOYMENT_STEPS.md` - Step-by-step deployment guide
- Created `POST_DEPLOYMENT_CHECKLIST.md` - Post-deployment verification
- Created `ENV_VARIABLES.md` - Complete environment variable documentation
- Created `.env.example` - Environment variable template
- Updated `README.md` with fly fishing and PFBC features

### Scripts
- Created `scripts/pre-deploy-check.ts` - Pre-deployment verification script
- Created `scripts/test-api-endpoints.ts` - API endpoint testing
- Created `scripts/verify-database.ts` - Database verification
- Created `scripts/integration-tests.ts` - Integration testing
- Added npm scripts for testing and verification

### Improved
- Enhanced waterway data model with seasonal information
- Improved geospatial queries for fly shops and access points
- Better organization of PFBC data by classification type
- More comprehensive expert knowledge structure

### Fixed
- Build process now completes successfully with zero errors
- Resolved TypeScript typing issues in API routes
- Fixed React Hook dependency warnings in useRobustGeolocation

---

## [1.0.0] - 2025-11-22

### Initial Release

#### Core Features
- **Gamification System**
  - Points and levels
  - Achievements (50+ badges)
  - Streaks
  - Celebration animations with confetti
  - Sound effects and haptics
  
- **Collections System (Pokemon-Style)**
  - Field site collection (140+ locations)
  - Species cards with 3D flip animation
  - Rarity system (Common → Uncommon → Rare → Epic → Legendary)
  - Progress tracking
  
- **Challenges**
  - Daily challenges (5-10 min tasks)
  - Weekly challenges (longer-term goals)
  - Team challenges (class collective goals)
  - Photo challenges with teacher approval
  
- **Competition & Social**
  - Class leaderboards (weekly rankings)
  - Real-time activity feed
  - Top contributors recognition
  - Class-only social environment
  
- **Field Work**
  - Interactive map with 140+ field sites
  - Geofenced check-in system
  - Observation journal
  - Photo documentation
  - Offline mode with sync queue
  
- **Teacher Tools**
  - Live monitoring dashboard
  - Field trip mode
  - Approval workflow
  - Class management
  - Reports and CSV exports
  
- **iPad Optimization**
  - Touch targets 60px minimum (WCAG AA)
  - Landscape mode support
  - Split-screen compatibility
  - Multi-user PIN switching
  - Offline-first architecture

#### Pennsylvania Coverage
- **Pittsburgh Area** - 64 field sites
- **Statewide** - State College, Harrisburg, Philadelphia, Coatesville, East Stroudsburg
- **Trout Waters** - 16 stocked streams and lakes
- **State Parks** - Ricketts Glen, Worlds End, Cherry Springs, Presque Isle, Pine Creek Gorge

#### Tech Stack
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + PostGIS)
- Mapbox GL
- NextAuth.js
- Vercel/Netlify deployment

#### Database
- Complete schema with 50+ tables
- Row Level Security policies
- PostGIS geospatial queries
- Automated migrations

---

## Release Notes

### Version Numbering
- **Major version** (1.x.x) - Breaking changes or major new features
- **Minor version** (x.1.x) - New features, backwards compatible
- **Patch version** (x.x.1) - Bug fixes and minor improvements

### Support
For questions or issues, contact: stringtheorysolutionsllc@gmail.com

---

**Last Updated:** November 22, 2025
