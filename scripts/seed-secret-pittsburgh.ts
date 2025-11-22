/**
 * Seed S.E.C.R.E.T.-style missions for Pittsburgh museums, parks, and libraries
 * 
 * Creates immersive mystery missions that unlock clues at real locations
 * 
 * Usage:
 * npx tsx scripts/seed-secret-pittsburgh.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// S.E.C.R.E.T. Pittsburgh Missions
const SECRET_MISSIONS = [
  {
    title: 'The Carnegie Conspiracy',
    synopsis: 'A mysterious message has been discovered in the Carnegie Library archives. Follow clues across Pittsburgh\'s cultural institutions to uncover a hidden story connecting Andrew Carnegie\'s legacy to modern conservation efforts. Each library and museum holds a piece of the puzzle.',
    storylineId: 'secret_carnegie_001',
    heroImageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
    difficulty: 'Explorer',
    subjectTags: ['history', 'literature', 'conservation', 'pittsburgh'],
    recommendedGrades: ['6', '7', '8', '9', '10'],
    startAt: new Date().toISOString(),
    endAt: null, // Ongoing mission
    stages: [
      {
        title: 'The First Clue: Main Library',
        summary: 'Visit the Carnegie Library Main Branch in Oakland. Find the QR code near the natural history section. Scan it to reveal the first encrypted message.',
        learningObjective: 'Explore library resources and understand Carnegie\'s educational mission',
        order: 0,
        targetMetric: 'check_ins',
        targetValue: 1,
        content: {
          type: 'qr_code',
          locationHint: 'Natural History Section, Second Floor',
          qrCode: 'CARNEGIE-001-MAIN-LIB',
          clue: 'The steel magnate\'s greatest gift was not steel, but knowledge. Find where three rivers meet.',
        },
        reward: {
          points: 50,
          badge: 'Library Explorer',
        },
      },
      {
        title: 'The Second Clue: Museum of Natural History',
        summary: 'Visit the Carnegie Museum of Natural History. Use AR view at the dinosaur exhibit to reveal the next clue hidden in the fossil display.',
        learningObjective: 'Learn about Pennsylvania\'s natural history and conservation challenges',
        order: 1,
        targetMetric: 'check_ins',
        targetValue: 1,
        content: {
          type: 'ar_marker',
          locationHint: 'Dinosaur Hall, T-Rex Exhibit',
          arMarker: '/ar-markers/carnegie-dino.png',
          clue: 'What once roamed these lands now needs protection. Visit the place where water meets land.',
        },
        reward: {
          points: 75,
          badge: 'Natural Historian',
        },
      },
      {
        title: 'The Third Clue: Point State Park',
        summary: 'Travel to Point State Park where the three rivers converge. Take a photo of the fountain and upload it to unlock the next clue.',
        learningObjective: 'Understand Pittsburgh\'s geography and watershed importance',
        order: 2,
        targetMetric: 'photos_taken',
        targetValue: 1,
        content: {
          type: 'photo_challenge',
          requiredSubject: 'Point State Park Fountain',
          clue: 'The confluence reveals the path. Seek knowledge where books meet nature.',
        },
        reward: {
          points: 100,
          badge: 'River Explorer',
        },
      },
      {
        title: 'The Final Revelation: Phipps Conservatory',
        summary: 'Visit Phipps Conservatory and scan the QR code in the Tropical Forest Conservatory. This reveals the final message connecting Carnegie\'s vision to modern conservation.',
        learningObjective: 'Connect historical philanthropy to contemporary environmental stewardship',
        order: 3,
        targetMetric: 'check_ins',
        targetValue: 1,
        content: {
          type: 'qr_code',
          locationHint: 'Tropical Forest Conservatory',
          qrCode: 'CARNEGIE-004-PHIPPS',
          clue: 'The secret: Education and nature preservation are intertwined. Your mission is to protect what Carnegie helped build.',
        },
        reward: {
          points: 200,
          badge: 'Carnegie Secret Keeper',
        },
      },
    ],
    locations: [
      {
        fieldSiteName: 'Carnegie Library - Main (Oakland)',
        locationType: 'qr_code',
        requiredAction: 'qr_scan',
        geofenceRadius: 30,
        orderIndex: 0,
      },
      {
        fieldSiteName: 'Carnegie Museum of Natural History',
        locationType: 'ar_marker',
        requiredAction: 'ar_view',
        geofenceRadius: 50,
        orderIndex: 1,
      },
      {
        customName: 'Point State Park Fountain',
        customLatitude: 40.4417,
        customLongitude: -80.0117,
        locationType: 'challenge',
        requiredAction: 'photo',
        geofenceRadius: 100,
        orderIndex: 2,
      },
      {
        fieldSiteName: 'Phipps Conservatory',
        locationType: 'qr_code',
        requiredAction: 'qr_scan',
        geofenceRadius: 50,
        orderIndex: 3,
      },
    ],
  },
  {
    title: 'The Hidden Parks Mystery',
    synopsis: 'Someone has been leaving cryptic messages in Pittsburgh\'s parks. Each message reveals a conservation secret about the city\'s green spaces. Follow the trail from Frick Park to Schenley Park, uncovering the hidden connections between urban nature and wildlife.',
    storylineId: 'secret_parks_001',
    heroImageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    difficulty: 'Ranger',
    subjectTags: ['ecology', 'urban_nature', 'wildlife', 'conservation'],
    recommendedGrades: ['5', '6', '7', '8'],
    startAt: new Date().toISOString(),
    endAt: null,
    stages: [
      {
        title: 'Frick Park: The Trailhead',
        summary: 'Start at Frick Park\'s Blue Slide Playground. Scan the QR code on the trailhead sign to begin your journey.',
        learningObjective: 'Identify urban park ecosystems and their importance',
        order: 0,
        targetMetric: 'check_ins',
        targetValue: 1,
        content: {
          type: 'qr_code',
          locationHint: 'Blue Slide Playground Trailhead',
          qrCode: 'PARKS-001-FRICK',
          clue: 'The largest park holds the first secret. Find where children play and nature thrives.',
        },
        reward: {
          points: 50,
          badge: 'Park Explorer',
        },
      },
      {
        title: 'Highland Park: The Reservoir',
        summary: 'Visit Highland Park Reservoir. Use AR view to see hidden wildlife markers around the water. Document what you find.',
        learningObjective: 'Observe urban water ecosystems and wildlife adaptation',
        order: 1,
        targetMetric: 'observations',
        targetValue: 3,
        content: {
          type: 'ar_marker',
          locationHint: 'Highland Park Reservoir Overlook',
          arMarker: '/ar-markers/highland-reservoir.png',
          clue: 'Water sustains life. Find the park where three ecosystems meet.',
        },
        reward: {
          points: 100,
          badge: 'Wildlife Watcher',
        },
      },
      {
        title: 'Schenley Park: The Convergence',
        summary: 'Travel to Schenley Park\'s Panther Hollow. Take photos of three different plant species and identify them using the app\'s AI.',
        learningObjective: 'Practice species identification and understand biodiversity',
        order: 2,
        targetMetric: 'species_count',
        targetValue: 3,
        content: {
          type: 'photo_challenge',
          requiredSubjects: ['native_tree', 'wildflower', 'bird'],
          clue: 'Diversity is strength. The final clue awaits where knowledge grows.',
        },
        reward: {
          points: 150,
          badge: 'Biodiversity Expert',
        },
      },
      {
        title: 'The Final Secret: Phipps Conservatory Gardens',
        summary: 'Return to Phipps Conservatory\'s outdoor gardens. Scan the final QR code to reveal how Pittsburgh\'s parks connect to global conservation efforts.',
        learningObjective: 'Understand local-to-global conservation connections',
        order: 3,
        targetMetric: 'check_ins',
        targetValue: 1,
        content: {
          type: 'qr_code',
          locationHint: 'Outdoor Garden, Native Plant Section',
          qrCode: 'PARKS-004-PHIPPS-GARDEN',
          clue: 'The secret: Every park is a sanctuary. Your mission is to protect these green spaces for future generations.',
        },
        reward: {
          points: 200,
          badge: 'Park Guardian',
        },
      },
    ],
    locations: [
      {
        fieldSiteName: 'Frick Park',
        locationType: 'qr_code',
        requiredAction: 'qr_scan',
        geofenceRadius: 100,
        orderIndex: 0,
      },
      {
        fieldSiteName: 'Highland Park',
        locationType: 'ar_marker',
        requiredAction: 'ar_view',
        geofenceRadius: 150,
        orderIndex: 1,
      },
      {
        fieldSiteName: 'Schenley Park',
        locationType: 'challenge',
        requiredAction: 'photo',
        geofenceRadius: 200,
        orderIndex: 2,
      },
      {
        fieldSiteName: 'Phipps Conservatory',
        locationType: 'qr_code',
        requiredAction: 'qr_scan',
        geofenceRadius: 50,
        orderIndex: 3,
      },
    ],
  },
  {
    title: 'The Library Code',
    synopsis: 'A secret network of clues connects Pittsburgh\'s Carnegie Libraries. Each library holds a piece of a code that reveals a hidden conservation message. Visit libraries across the city, scanning QR codes and solving puzzles to unlock the final secret.',
    storylineId: 'secret_libraries_001',
    heroImageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800',
    difficulty: 'Explorer',
    subjectTags: ['literature', 'history', 'community', 'pittsburgh'],
    recommendedGrades: ['4', '5', '6', '7', '8'],
    startAt: new Date().toISOString(),
    endAt: null,
    stages: [
      {
        title: 'The Code Begins: Main Library',
        summary: 'Start at the Main Carnegie Library. Find the QR code in the children\'s section to get your first code fragment.',
        learningObjective: 'Explore library resources and understand community spaces',
        order: 0,
        targetMetric: 'check_ins',
        targetValue: 1,
        content: {
          type: 'qr_code',
          locationHint: 'Children\'s Section, First Floor',
          qrCode: 'LIBRARY-001-MAIN',
          clue: 'Code Fragment 1: "KNOWLEDGE" - Find the library where three neighborhoods meet.',
        },
        reward: {
          points: 50,
          badge: 'Library Detective',
        },
      },
      {
        title: 'Fragment Two: Squirrel Hill',
        summary: 'Visit the Squirrel Hill Library. Scan the QR code near the community board to get the second fragment.',
        learningObjective: 'Understand how libraries serve diverse communities',
        order: 1,
        targetMetric: 'check_ins',
        targetValue: 1,
        content: {
          type: 'qr_code',
          locationHint: 'Community Board, Main Floor',
          qrCode: 'LIBRARY-002-SQUIRREL',
          clue: 'Code Fragment 2: "IS" - The next clue waits where rivers flow.',
        },
        reward: {
          points: 50,
          badge: 'Community Explorer',
        },
      },
      {
        title: 'Fragment Three: Lawrenceville',
        summary: 'Travel to Lawrenceville Library. Use AR view in the reading garden to reveal the third fragment.',
        learningObjective: 'Explore urban library spaces and their role in neighborhoods',
        order: 2,
        targetMetric: 'check_ins',
        targetValue: 1,
        content: {
          type: 'ar_marker',
          locationHint: 'Reading Garden, Outdoor Space',
          arMarker: '/ar-markers/lawrenceville-garden.png',
          clue: 'Code Fragment 3: "POWER" - Find the library near the university.',
        },
        reward: {
          points: 75,
          badge: 'Urban Explorer',
        },
      },
      {
        title: 'The Final Code: East Liberty',
        summary: 'Visit East Liberty Library and scan the final QR code. Combine all fragments to reveal the secret message.',
        learningObjective: 'Synthesize information from multiple sources',
        order: 3,
        targetMetric: 'check_ins',
        targetValue: 1,
        content: {
          type: 'qr_code',
          locationHint: 'Main Reading Room',
          qrCode: 'LIBRARY-004-EAST-LIBERTY',
          clue: 'Code Fragment 4: "FOR ALL" - The secret: "KNOWLEDGE IS POWER FOR ALL" - Libraries make conservation education accessible to everyone.',
        },
        reward: {
          points: 150,
          badge: 'Library Code Breaker',
        },
      },
    ],
    locations: [
      {
        fieldSiteName: 'Carnegie Library - Main (Oakland)',
        locationType: 'qr_code',
        requiredAction: 'qr_scan',
        geofenceRadius: 30,
        orderIndex: 0,
      },
      {
        fieldSiteName: 'Carnegie Library - Squirrel Hill',
        locationType: 'qr_code',
        requiredAction: 'qr_scan',
        geofenceRadius: 30,
        orderIndex: 1,
      },
      {
        fieldSiteName: 'Carnegie Library - Lawrenceville',
        locationType: 'ar_marker',
        requiredAction: 'ar_view',
        geofenceRadius: 40,
        orderIndex: 2,
      },
      {
        fieldSiteName: 'Carnegie Library - East Liberty',
        locationType: 'qr_code',
        requiredAction: 'qr_scan',
        geofenceRadius: 30,
        orderIndex: 3,
      },
    ],
  },
]

async function seedSecretMissions() {
  console.log('🔐 Starting S.E.C.R.E.T. Pittsburgh mission seed...\n')

  try {
    // Get a user ID for created_by
    const { data: users } = await supabase.from('users').select('id').limit(1)
    const creatorId = users && users.length > 0 ? users[0].id : null

    // Get field sites for location matching
    const { data: fieldSites } = await supabase
      .from('field_sites')
      .select('id, name, latitude, longitude')
      .eq('city', 'Pittsburgh')

    if (!fieldSites || fieldSites.length === 0) {
      console.error('❌ No Pittsburgh field sites found. Please seed field sites first.')
      process.exit(1)
    }

    const siteMap = new Map(fieldSites.map((site: any) => [site.name, site]))

    let seededCount = 0

    for (const missionData of SECRET_MISSIONS) {
      // Check if mission already exists
      const { data: existing } = await supabase
        .from('story_missions')
        .select('id')
        .eq('title', missionData.title)
        .single()

      if (existing) {
        console.log(`⏭️  Skipping "${missionData.title}" (already exists)`)
        continue
      }

      // Insert mission
      const { data: mission, error: missionError } = await supabase
        .from('story_missions')
        .insert({
          title: missionData.title,
          synopsis: missionData.synopsis,
          storyline_id: missionData.storylineId,
          hero_image_url: missionData.heroImageUrl,
          difficulty: missionData.difficulty,
          subject_tags: missionData.subjectTags,
          recommended_grades: missionData.recommendedGrades,
          start_at: missionData.startAt,
          end_at: missionData.endAt,
          created_by: creatorId,
          is_active: true,
        } as never)
        .select()
        .single()

      if (missionError || !mission) {
        console.error(`❌ Failed to create mission "${missionData.title}":`, missionError)
        continue
      }

      // Insert stages
      const stagesPayload = missionData.stages.map((stage) => ({
        mission_id: mission.id,
        order_index: stage.order,
        title: stage.title,
        summary: stage.summary,
        learning_objective: stage.learningObjective,
        target_metric: stage.targetMetric,
        target_value: stage.targetValue,
        content: stage.content,
        reward: stage.reward,
      }))

      const { data: stages, error: stagesError } = await supabase
        .from('story_mission_stages')
        .insert(stagesPayload as never)
        .select()

      if (stagesError || !stages) {
        console.error(`❌ Failed to add stages for "${missionData.title}":`, stagesError)
        continue
      }

      // Create stage map for location linking
      const stageMap = new Map(stages.map((s: any, idx: number) => [idx, s.id]))

      // Insert mission locations
      const locationsPayload = missionData.locations.map((loc) => {
        const fieldSite = loc.fieldSiteName ? siteMap.get(loc.fieldSiteName) : null
        const stageId = stageMap.get(loc.orderIndex)

        const locationData: any = {
          mission_id: mission.id,
          stage_id: stageId,
          location_type: loc.locationType,
          required_action: loc.requiredAction,
          geofence_radius_meters: loc.geofenceRadius,
          order_index: loc.orderIndex,
        }

        if (fieldSite) {
          locationData.field_site_id = fieldSite.id
        } else if ('customName' in loc && loc.customName) {
          locationData.custom_name = loc.customName
          locationData.custom_latitude = loc.customLatitude
          locationData.custom_longitude = loc.customLongitude
        }

        // Add QR code or AR marker data from stage content
        const stage = missionData.stages[loc.orderIndex]
        if (stage?.content) {
          if (stage.content.qrCode) {
            locationData.qr_code_data = stage.content.qrCode
            locationData.clue_text = stage.content.clue
          }
          if (stage.content.arMarker) {
            locationData.ar_marker_url = stage.content.arMarker
            locationData.clue_text = stage.content.clue
          }
          if (stage.content.locationHint) {
            locationData.metadata = { locationHint: stage.content.locationHint }
          }
        }

        return locationData
      })

      const { error: locationsError } = await supabase
        .from('mission_locations')
        .insert(locationsPayload as never)

      if (locationsError) {
        console.error(`❌ Failed to add locations for "${missionData.title}":`, locationsError)
        continue
      }

      console.log(`✅ Seeded mission: "${missionData.title}"`)
      console.log(`   - ${stages.length} stages`)
      console.log(`   - ${locationsPayload.length} locations`)
      seededCount++
    }

    console.log('\n✨ S.E.C.R.E.T. mission seeding complete!\n')
    console.log(`Summary:`)
    console.log(`  - ${seededCount} missions created`)
    console.log(`  - ${seededCount * 4} stages total`)
    console.log(`  - ${seededCount * 4} locations total`)
    console.log('\n🎯 Next steps:')
    console.log('  1. Print QR codes and place them at the locations')
    console.log('  2. Create AR marker images and upload to /public/ar-markers/')
    console.log('  3. Test missions by visiting locations in Pittsburgh')
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

// Run the seed function
seedSecretMissions()


