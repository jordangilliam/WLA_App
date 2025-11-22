/**
 * Seed script for Carmen Sandiego-style story missions
 * 
 * Usage:
 * 1. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env
 * 2. Run: npx tsx scripts/seed-missions.ts
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

// Carmen Sandiego x Pokémon GO style missions
const SAMPLE_MISSIONS = [
  {
    title: 'The Vanishing Watershed Mystery',
    synopsis: 'A critical watershed monitoring station has gone silent. Track down clues across Pennsylvania\'s waterways, identify pollution sources, and restore the monitoring network. Each site visit reveals new evidence—part detective work, part field science.',
    storylineId: 'watershed_arc_001',
    heroImageUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800',
    difficulty: 'Explorer',
    subjectTags: ['hydrology', 'water_quality', 'conservation'],
    recommendedGrades: ['6', '7', '8', '9'],
    startAt: new Date().toISOString(),
    endAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
    stages: [
      {
        title: 'Decode the Silent Station',
        summary: 'Visit the first monitoring site and collect water quality data. The station\'s last transmission contained cryptic coordinates.',
        learningObjective: 'Understand basic water quality parameters (pH, turbidity, dissolved oxygen)',
        order: 0,
        targetMetric: 'check_ins',
        targetValue: 1,
        content: {
          type: 'location_based',
          siteHint: 'Look for sites near major waterways',
          clue: 'The station sits where three tributaries converge',
        },
        reward: {
          points: 50,
          badge: 'Water Detective',
        },
      },
      {
        title: 'Trace the Contaminant Trail',
        summary: 'Follow the pollution indicators upstream. Photograph evidence of erosion, runoff, or unusual water conditions.',
        learningObjective: 'Identify sources of water pollution and their environmental impact',
        order: 1,
        targetMetric: 'photos_taken',
        targetValue: 5,
        content: {
          type: 'photo_challenge',
          instructions: 'Capture images of: erosion patterns, storm drains, vegetation buffers, water clarity, and any unusual findings',
        },
        reward: {
          points: 100,
          badge: 'Pollution Tracker',
        },
      },
      {
        title: 'Species Sentinel Network',
        summary: 'Identify indicator species at each site. Certain aquatic species act as "canaries in the coal mine" for water health.',
        learningObjective: 'Learn about bioindicators and their role in ecosystem health assessment',
        order: 2,
        targetMetric: 'species_count',
        targetValue: 8,
        content: {
          type: 'species_hunt',
          targetSpecies: ['brook_trout', 'caddisfly', 'stonefly', 'mayfly', 'freshwater_mussel'],
          hint: 'Clean water species are your allies',
        },
        reward: {
          points: 150,
          badge: 'Bioindicator Expert',
        },
      },
      {
        title: 'Restore the Network',
        summary: 'Visit 5 different monitoring sites and submit quality readings. Your data will help restore the watershed monitoring network.',
        learningObjective: 'Practice systematic data collection and contribute to citizen science',
        order: 3,
        targetMetric: 'observations',
        targetValue: 5,
        content: {
          type: 'data_collection',
          requiredFields: ['pH', 'turbidity', 'temperature', 'dissolved_oxygen'],
        },
        reward: {
          points: 200,
          badge: 'Watershed Guardian',
        },
      },
    ],
  },
  {
    title: 'The Invasive Plant Heist',
    synopsis: 'An invasive plant species is spreading across Pennsylvania\'s ecosystems, threatening native biodiversity. Track its spread, document locations, and help coordinate removal efforts. Think Carmen Sandiego tracking stolen artifacts—except these "artifacts" are ecological threats.',
    storylineId: 'invasive_arc_001',
    heroImageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
    difficulty: 'Ranger',
    subjectTags: ['botany', 'ecology', 'invasive_species', 'conservation'],
    recommendedGrades: ['7', '8', '9', '10'],
    startAt: new Date().toISOString(),
    endAt: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(), // 120 days
    stages: [
      {
        title: 'Identify the Suspect',
        summary: 'Learn to identify the target invasive species through field guides and photo identification. Your first "sighting" unlocks the mission.',
        learningObjective: 'Master plant identification techniques and understand invasive species characteristics',
        order: 0,
        targetMetric: 'observations',
        targetValue: 1,
        content: {
          type: 'identification_challenge',
          targetSpecies: 'japanese_knotweed', // or other common PA invasive
          resources: ['field_guide', 'photo_matching', 'ai_identification'],
        },
        reward: {
          points: 75,
          badge: 'Plant Detective',
        },
      },
      {
        title: 'Map the Infestation',
        summary: 'Document 10 different locations where the invasive species appears. GPS coordinates and photos are critical evidence.',
        learningObjective: 'Practice geospatial data collection and understand distribution patterns',
        order: 1,
        targetMetric: 'sites_visited',
        targetValue: 10,
        content: {
          type: 'mapping_challenge',
          requiredData: ['latitude', 'longitude', 'photo', 'population_density', 'habitat_type'],
        },
        reward: {
          points: 150,
          badge: 'Invasive Tracker',
        },
      },
      {
        title: 'Document the Impact',
        summary: 'Observe and photograph how the invasive species affects native plants and wildlife. Compare invaded vs. non-invaded areas.',
        learningObjective: 'Understand ecological impacts of invasive species on native ecosystems',
        order: 2,
        targetMetric: 'photos_taken',
        targetValue: 8,
        content: {
          type: 'comparison_study',
          comparePoints: ['native_plant_diversity', 'wildlife_habitat', 'soil_health'],
        },
        reward: {
          points: 175,
          badge: 'Ecological Analyst',
        },
      },
      {
        title: 'Coordinate the Response',
        summary: 'Submit your findings to the removal coordination network. Help prioritize sites for treatment.',
        learningObjective: 'Participate in collaborative conservation efforts and data-driven decision making',
        order: 3,
        targetMetric: 'observations',
        targetValue: 3,
        content: {
          type: 'data_submission',
          submissionFormat: 'conservation_report',
          includeRecommendations: true,
        },
        reward: {
          points: 250,
          badge: 'Conservation Coordinator',
        },
      },
    ],
  },
  {
    title: 'Wildlife Rescue Operation',
    synopsis: 'Reports of distressed wildlife are coming in from across the state. Investigate habitats, identify species in need, and document conditions. Your field work helps wildlife rehabilitators prioritize rescue efforts—like Pokémon GO encounters, but with real conservation impact.',
    storylineId: 'wildlife_rescue_arc_001',
    heroImageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    difficulty: 'Explorer',
    subjectTags: ['wildlife', 'conservation', 'habitat_assessment', 'citizen_science'],
    recommendedGrades: ['5', '6', '7', '8'],
    startAt: new Date().toISOString(),
    endAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
    stages: [
      {
        title: 'Establish Base Camp',
        summary: 'Set up your field observation protocol. Visit your first wildlife habitat site and complete a habitat assessment.',
        learningObjective: 'Learn habitat assessment techniques and wildlife observation protocols',
        order: 0,
        targetMetric: 'check_ins',
        targetValue: 1,
        content: {
          type: 'habitat_assessment',
          checklist: ['habitat_type', 'food_sources', 'water_access', 'shelter', 'human_impact'],
        },
        reward: {
          points: 50,
          badge: 'Field Biologist',
        },
      },
      {
        title: 'Species Inventory',
        summary: 'Identify and document 15 different wildlife species across multiple habitats. Build your field guide as you explore.',
        learningObjective: 'Develop species identification skills and understand habitat preferences',
        order: 1,
        targetMetric: 'species_count',
        targetValue: 15,
        content: {
          type: 'species_collection',
          categories: ['birds', 'mammals', 'reptiles', 'amphibians', 'insects'],
          requirePhotos: true,
        },
        reward: {
          points: 200,
          badge: 'Wildlife Spotter',
        },
      },
      {
        title: 'Document Distress Signals',
        summary: 'Look for signs of wildlife in distress: injured animals, habitat destruction, pollution impacts. Report findings with photos and location data.',
        learningObjective: 'Recognize wildlife distress indicators and learn proper reporting procedures',
        order: 2,
        targetMetric: 'observations',
        targetValue: 5,
        content: {
          type: 'distress_assessment',
          indicators: ['injured_animal', 'habitat_loss', 'pollution', 'food_scarcity', 'predator_pressure'],
          reportingProtocol: 'wildlife_rehab_network',
        },
        reward: {
          points: 150,
          badge: 'Wildlife Guardian',
        },
      },
      {
        title: 'Habitat Restoration Plan',
        summary: 'Based on your observations, propose habitat improvements. Submit a restoration plan for review.',
        learningObjective: 'Apply field observations to conservation planning and habitat restoration',
        order: 3,
        targetMetric: 'observations',
        targetValue: 1,
        content: {
          type: 'restoration_planning',
          requiredElements: ['problem_identification', 'proposed_solutions', 'implementation_steps', 'success_metrics'],
        },
        reward: {
          points: 300,
          badge: 'Habitat Hero',
        },
      },
    ],
  },
  {
    title: 'The Pollinator Pathway',
    synopsis: 'Help establish a pollinator corridor across Pennsylvania by documenting native pollinator plants, tracking pollinator activity, and mapping nectar routes. Like tracking Carmen Sandiego across continents, but you\'re mapping ecological connections.',
    storylineId: 'pollinator_arc_001',
    heroImageUrl: 'https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=800',
    difficulty: 'Ranger',
    subjectTags: ['pollinators', 'botany', 'ecology', 'conservation'],
    recommendedGrades: ['6', '7', '8', '9', '10'],
    startAt: new Date().toISOString(),
    endAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), // 180 days (seasonal)
    stages: [
      {
        title: 'Identify Native Pollinator Plants',
        summary: 'Learn to identify 20 native Pennsylvania plants that support pollinators. Document each with photos and location.',
        learningObjective: 'Master native plant identification and understand pollinator-plant relationships',
        order: 0,
        targetMetric: 'species_count',
        targetValue: 20,
        content: {
          type: 'plant_identification',
          focus: 'native_pollinator_plants',
          resources: ['native_plant_guide', 'bloom_calendar', 'pollinator_preferences'],
        },
        reward: {
          points: 150,
          badge: 'Plant Expert',
        },
      },
      {
        title: 'Track Pollinator Activity',
        summary: 'Observe and photograph pollinators visiting native plants. Document at least 10 different pollinator species.',
        learningObjective: 'Learn pollinator identification and understand foraging behavior',
        order: 1,
        targetMetric: 'species_count',
        targetValue: 10,
        content: {
          type: 'pollinator_watch',
          targetGroups: ['bees', 'butterflies', 'moths', 'hummingbirds', 'beetles'],
          observationTime: 'minimum_15_minutes_per_site',
        },
        reward: {
          points: 200,
          badge: 'Pollinator Watcher',
        },
      },
      {
        title: 'Map the Nectar Route',
        summary: 'Visit 12 different sites with pollinator plants and document connections. Build a map of the pollinator pathway.',
        learningObjective: 'Understand landscape connectivity and pollinator movement patterns',
        order: 2,
        targetMetric: 'sites_visited',
        targetValue: 12,
        content: {
          type: 'pathway_mapping',
          requiredData: ['plant_density', 'pollinator_activity', 'site_spacing', 'habitat_quality'],
        },
        reward: {
          points: 250,
          badge: 'Pathway Mapper',
        },
      },
      {
        title: 'Plant the Corridor',
        summary: 'Create a pollinator action plan for your area. Submit recommendations for native plant installations.',
        learningObjective: 'Apply pollinator conservation knowledge to create actionable restoration plans',
        order: 3,
        targetMetric: 'observations',
        targetValue: 1,
        content: {
          type: 'action_planning',
          usePollinatorPlanner: true,
          includePlantList: true,
          includeMaintenancePlan: true,
        },
        reward: {
          points: 300,
          badge: 'Pollinator Champion',
        },
      },
    ],
  },
]

async function seedMissions() {
  console.log('🎯 Starting mission seed...\n')

  try {
    // Get a user ID for created_by (or use null if none available)
    const { data: users } = await supabase.from('users').select('id').limit(1)
    const creatorId = users && users.length > 0 ? users[0].id : null

    let seededCount = 0
    let skippedCount = 0

    for (const missionData of SAMPLE_MISSIONS) {
      // Check if mission already exists
      const { data: existing } = await supabase
        .from('story_missions')
        .select('id')
        .eq('title', missionData.title)
        .single()

      if (existing) {
        console.log(`⏭️  Skipping "${missionData.title}" (already exists)`)
        skippedCount++
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

      const { error: stagesError } = await supabase
        .from('story_mission_stages')
        .insert(stagesPayload as never)

      if (stagesError) {
        console.error(`❌ Failed to add stages for "${missionData.title}":`, stagesError)
        continue
      }

      console.log(`✅ Seeded mission: "${missionData.title}" with ${missionData.stages.length} stages`)
      seededCount++
    }

    console.log('\n✨ Mission seeding complete!\n')
    console.log(`Summary:`)
    console.log(`  - ${seededCount} missions created`)
    console.log(`  - ${skippedCount} missions skipped (already exist)`)
    console.log(`  - Total stages: ${seededCount * 4}`)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

// Run the seed function
seedMissions()


