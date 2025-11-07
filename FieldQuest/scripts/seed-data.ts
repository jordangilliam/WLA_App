/**
 * Seed script to populate FieldQuest database with test data
 * 
 * Usage:
 * 1. Set your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env
 * 2. Run: npx tsx scripts/seed-data.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Pennsylvania native species data
const PA_SPECIES = [
  {
    common_name: 'White-tailed Deer',
    scientific_name: 'Odocoileus virginianus',
    rarity: 'common',
    conservation_status: 'LC',
    description: 'Pennsylvania\'s state animal. Found throughout forests and fields.',
    habitat: 'forest, field',
    fun_fact: 'Can jump up to 10 feet high and 30 feet long!',
  },
  {
    common_name: 'Eastern Box Turtle',
    scientific_name: 'Terrapene carolina',
    rarity: 'uncommon',
    conservation_status: 'VU',
    description: 'A terrestrial turtle with a hinged shell that closes completely.',
    habitat: 'forest, wetland',
    fun_fact: 'Can live over 100 years in the wild.',
  },
  {
    common_name: 'Bald Eagle',
    scientific_name: 'Haliaeetus leucocephalus',
    rarity: 'rare',
    conservation_status: 'LC',
    description: 'America\'s national bird, making a strong comeback in PA.',
    habitat: 'water, forest',
    fun_fact: 'Their nests can weigh over 2,000 pounds!',
  },
  {
    common_name: 'Brook Trout',
    scientific_name: 'Salvelinus fontinalis',
    rarity: 'uncommon',
    conservation_status: 'LC',
    description: 'Pennsylvania\'s state fish. Needs cold, clean water.',
    habitat: 'stream',
    fun_fact: 'Only trout species native to Pennsylvania.',
  },
  {
    common_name: 'Black Bear',
    scientific_name: 'Ursus americanus',
    rarity: 'rare',
    conservation_status: 'LC',
    description: 'Pennsylvania has one of the largest black bear populations in the US.',
    habitat: 'forest',
    fun_fact: 'Can smell food from over a mile away!',
  },
  {
    common_name: 'Red-spotted Newt',
    scientific_name: 'Notophthalmus viridescens',
    rarity: 'common',
    conservation_status: 'LC',
    description: 'Small salamander with three life stages.',
    habitat: 'wetland, forest',
    fun_fact: 'Their bright orange juvenile stage warns predators of toxins.',
  },
  {
    common_name: 'Eastern Bluebird',
    scientific_name: 'Sialia sialis',
    rarity: 'common',
    conservation_status: 'LC',
    description: 'Beautiful blue songbird that nests in tree cavities.',
    habitat: 'field, forest',
    fun_fact: 'Males are brighter blue than females.',
  },
  {
    common_name: 'Timber Rattlesnake',
    scientific_name: 'Crotalus horridus',
    rarity: 'epic',
    conservation_status: 'EN',
    description: 'Pennsylvania\'s largest venomous snake. Endangered in PA.',
    habitat: 'forest, rocky',
    fun_fact: 'Can sense heat from warm-blooded prey using facial pits.',
  },
  {
    common_name: 'Indiana Bat',
    scientific_name: 'Myotis sodalis',
    rarity: 'legendary',
    conservation_status: 'EN',
    description: 'Endangered bat species found in PA caves.',
    habitat: 'cave, forest',
    fun_fact: 'Eats up to half its body weight in insects each night!',
  },
  {
    common_name: 'Wild Turkey',
    scientific_name: 'Meleagris gallopavo',
    rarity: 'uncommon',
    conservation_status: 'LC',
    description: 'Large game bird successfully reintroduced to Pennsylvania.',
    habitat: 'forest, field',
    fun_fact: 'Can fly up to 55 mph for short distances.',
  },
]

// Field sites across Pennsylvania
const PA_FIELD_SITES = [
  {
    name: 'Shaver\'s Creek Environmental Center',
    type: 'education_center',
    lat: 40.6945,
    lng: -77.9036,
    radius: 100,
    description: 'Environmental education center in the heart of central PA.',
  },
  {
    name: 'Rothrock State Forest',
    type: 'forest',
    lat: 40.7128,
    lng: -77.8547,
    radius: 150,
    description: 'Beautiful state forest with hiking trails and streams.',
  },
  {
    name: 'Spring Creek',
    type: 'stream',
    lat: 40.7934,
    lng: -77.8600,
    radius: 50,
    description: 'Famous trout stream running through State College.',
  },
  {
    name: 'Greenwood Furnace State Park',
    type: 'park',
    lat: 40.6334,
    lng: -77.7294,
    radius: 120,
    description: 'Historic park with lake and extensive trails.',
  },
  {
    name: 'Stone Valley Recreation Area',
    type: 'lake',
    lat: 40.6889,
    lng: -77.7778,
    radius: 100,
    description: 'Penn State\'s outdoor recreation area with a scenic lake.',
  },
  {
    name: 'Tussey Mountain',
    type: 'mountain',
    lat: 40.7445,
    lng: -78.0123,
    radius: 200,
    description: 'Mountain ridge offering panoramic views.',
  },
  {
    name: 'Black Moshannon State Park',
    type: 'wetland',
    lat: 40.8967,
    lng: -78.0622,
    radius: 150,
    description: 'Unique wetland bog ecosystem.',
  },
  {
    name: 'Bald Eagle State Park',
    type: 'lake',
    lat: 41.0564,
    lng: -77.7342,
    radius: 180,
    description: 'Large state park with lake and bald eagle nesting sites.',
  },
  {
    name: 'Penn\'s Cave',
    type: 'cave',
    lat: 40.8834,
    lng: -77.6367,
    radius: 80,
    description: 'America\'s only all-water cavern and wildlife park.',
  },
  {
    name: 'Whipple Dam State Park',
    type: 'park',
    lat: 40.6678,
    lng: -77.7456,
    radius: 100,
    description: 'Small park with a scenic dam and swimming area.',
  },
]

// Basic items for the game
const GAME_ITEMS = [
  {
    name: 'basic_bait',
    type: 'bait',
    description: 'Simple bait to increase catch rate by 20%',
    effect_value: 0.2,
  },
  {
    name: 'rare_bait',
    type: 'bait',
    description: 'Premium bait to increase catch rate by 40%',
    effect_value: 0.4,
  },
  {
    name: 'ultra_bait',
    type: 'bait',
    description: 'Legendary bait to increase catch rate by 60%',
    effect_value: 0.6,
  },
  {
    name: 'field_journal_page',
    type: 'tool',
    description: 'Additional journal page for documenting observations',
    effect_value: 0,
  },
  {
    name: 'camera_upgrade',
    type: 'tool',
    description: 'Better camera for wildlife photography',
    effect_value: 0,
  },
  {
    name: 'binoculars',
    type: 'tool',
    description: 'Helps spot species from farther away',
    effect_value: 50, // Increased detection radius in meters
  },
]

async function seedDatabase() {
  console.log('🌱 Starting database seed...\n')

  try {
    // 1. Seed Species
    console.log('📝 Seeding species...')
    const { data: species, error: speciesError } = await supabase
      .from('species')
      .upsert(PA_SPECIES, { onConflict: 'scientific_name', ignoreDuplicates: false })
      .select()

    if (speciesError) {
      console.error('Error seeding species:', speciesError)
    } else {
      console.log(`✅ Seeded ${species?.length || 0} species\n`)
    }

    // 2. Seed Field Sites
    console.log('📍 Seeding field sites...')
    const { data: sites, error: sitesError } = await supabase
      .from('field_sites')
      .upsert(PA_FIELD_SITES, { onConflict: 'name', ignoreDuplicates: false })
      .select()

    if (sitesError) {
      console.error('Error seeding field sites:', sitesError)
    } else {
      console.log(`✅ Seeded ${sites?.length || 0} field sites\n`)
    }

    // 3. Seed Items
    console.log('🎒 Seeding items...')
    const { data: items, error: itemsError } = await supabase
      .from('items')
      .upsert(GAME_ITEMS, { onConflict: 'name', ignoreDuplicates: false })
      .select()

    if (itemsError) {
      console.error('Error seeding items:', itemsError)
    } else {
      console.log(`✅ Seeded ${items?.length || 0} items\n`)
    }

    // 4. Create some test spawns (if species and sites exist)
    if (species && species.length > 0 && sites && sites.length > 0) {
      console.log('🐾 Creating test spawns...')
      
      const testSpawns = []
      for (let i = 0; i < Math.min(20, sites.length * 2); i++) {
        const randomSite = sites[Math.floor(Math.random() * sites.length)]
        const randomSpecies = species[Math.floor(Math.random() * species.length)]
        
        // Random offset within site radius
        const offsetLat = (Math.random() - 0.5) * 0.002 // ~220m max
        const offsetLng = (Math.random() - 0.5) * 0.002
        
        testSpawns.push({
          species_id: randomSpecies.id,
          lat: randomSite.lat + offsetLat,
          lng: randomSite.lng + offsetLng,
          expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours
        })
      }

      const { data: spawns, error: spawnsError } = await supabase
        .from('active_spawns')
        .insert(testSpawns)
        .select()

      if (spawnsError) {
        console.error('Error creating spawns:', spawnsError)
      } else {
        console.log(`✅ Created ${spawns?.length || 0} test spawns\n`)
      }
    }

    console.log('✨ Database seeding complete!\n')
    console.log('Summary:')
    console.log(`  - ${PA_SPECIES.length} species`)
    console.log(`  - ${PA_FIELD_SITES.length} field sites`)
    console.log(`  - ${GAME_ITEMS.length} items`)
    console.log('  - 20 test spawns (2 hour duration)')
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

// Run the seed function
seedDatabase()

