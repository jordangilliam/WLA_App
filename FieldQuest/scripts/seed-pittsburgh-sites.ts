/**
 * Pittsburgh Area Field Sites Seed Data
 * Comprehensive list of parks, libraries, universities, and landmarks
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Pittsburgh City Parks
const CITY_PARKS = [
  {
    name: 'Schenley Park',
    type: 'park',
    lat: 40.4344,
    lng: -79.9486,
    radius: 200,
    description: 'Historic 456-acre park with trails, sports facilities, and the Phipps Conservatory.',
  },
  {
    name: 'Frick Park',
    type: 'park',
    lat: 40.4372,
    lng: -79.8969,
    radius: 180,
    description: 'Pittsburgh\'s largest regional park with miles of woodland trails.',
  },
  {
    name: 'Highland Park',
    type: 'park',
    lat: 40.4792,
    lng: -79.9156,
    radius: 150,
    description: 'Home to the Pittsburgh Zoo & PPG Aquarium and beautiful reservoir.',
  },
  {
    name: 'Riverview Park',
    type: 'park',
    lat: 40.4956,
    lng: -80.0158,
    radius: 160,
    description: 'North Side park with scenic overlooks of the Allegheny River.',
  },
  {
    name: 'Point State Park',
    type: 'park',
    lat: 40.4414,
    lng: -80.0097,
    radius: 100,
    description: 'Iconic downtown park at the confluence of three rivers with historic Fort Pitt.',
  },
  {
    name: 'Mellon Park',
    type: 'park',
    lat: 40.4508,
    lng: -79.9208,
    radius: 80,
    description: 'Shadyside park featuring walled gardens and open green spaces.',
  },
  {
    name: 'Arsenal Park',
    type: 'park',
    lat: 40.4597,
    lng: -79.9564,
    radius: 60,
    description: 'Lawrenceville park along the Allegheny River with sports fields.',
  },
  {
    name: 'West End Overlook Park',
    type: 'park',
    lat: 40.4389,
    lng: -80.0356,
    radius: 70,
    description: 'Scenic overlook with stunning views of downtown Pittsburgh.',
  },
]

// Allegheny County Parks
const COUNTY_PARKS = [
  {
    name: 'North Park',
    type: 'park',
    lat: 40.6011,
    lng: -79.9514,
    radius: 250,
    description: '3,075-acre county park with lake, trails, and nature center.',
  },
  {
    name: 'South Park',
    type: 'park',
    lat: 40.2978,
    lng: -79.9856,
    radius: 220,
    description: '2,013-acre park with trails, golf, and wave pool.',
  },
  {
    name: 'Boyce Park',
    type: 'park',
    lat: 40.4767,
    lng: -79.7828,
    radius: 150,
    description: 'Monroeville park with nature center, ski slopes, and trails.',
  },
  {
    name: 'Hartwood Acres Park',
    type: 'park',
    lat: 40.6200,
    lng: -79.8478,
    radius: 180,
    description: 'Historic estate with mansion, gardens, and concert venue.',
  },
  {
    name: 'Deer Lakes Park',
    type: 'park',
    lat: 40.6358,
    lng: -79.8525,
    radius: 130,
    description: 'Beautiful lakes, trails, and picnic areas in West Deer.',
  },
  {
    name: 'White Oak Park',
    type: 'park',
    lat: 40.3375,
    lng: -79.8092,
    radius: 120,
    description: 'South Hills park with sports facilities and trails.',
  },
]

// State Parks (nearby)
const STATE_PARKS = [
  {
    name: 'Raccoon Creek State Park',
    type: 'park',
    lat: 40.5139,
    lng: -80.4267,
    radius: 200,
    description: '7,572 acres with Wildflower Reserve and extensive trails.',
  },
  {
    name: 'Moraine State Park',
    type: 'lake',
    lat: 40.9556,
    lng: -80.0894,
    radius: 250,
    description: 'Large state park with 3,225-acre Lake Arthur.',
  },
]

// Greenways and Trails
const GREENWAYS = [
  {
    name: 'Three Rivers Heritage Trail - Point',
    type: 'trail',
    lat: 40.4431,
    lng: -80.0031,
    radius: 150,
    description: '24-mile trail system connecting Pittsburgh\'s rivers.',
  },
  {
    name: 'Eliza Furnace Trail',
    type: 'trail',
    lat: 40.4428,
    lng: -79.9758,
    radius: 100,
    description: 'Connects Oakland to downtown along the Monongahela.',
  },
  {
    name: 'Montour Trail - Airport Junction',
    type: 'trail',
    lat: 40.4594,
    lng: -80.1683,
    radius: 120,
    description: '63-mile rail-trail circling Pittsburgh.',
  },
  {
    name: 'Great Allegheny Passage - Homestead',
    type: 'trail',
    lat: 40.4067,
    lng: -79.9072,
    radius: 100,
    description: 'Long-distance trail to Washington DC via Ohiopyle.',
  },
]

// Carnegie Libraries (All 19 locations)
const CARNEGIE_LIBRARIES = [
  {
    name: 'Carnegie Library - Main (Oakland)',
    type: 'library',
    lat: 40.4399,
    lng: -79.9489,
    radius: 80,
    description: 'Historic main library in Oakland with extensive collections.',
  },
  {
    name: 'Carnegie Library - Allegheny',
    type: 'library',
    lat: 40.4542,
    lng: -80.0064,
    radius: 60,
    description: 'North Side branch with historic architecture.',
  },
  {
    name: 'Carnegie Library - Beechview',
    type: 'library',
    lat: 40.4064,
    lng: -80.0264,
    radius: 50,
    description: 'South Hills community library.',
  },
  {
    name: 'Carnegie Library - Brookline',
    type: 'library',
    lat: 40.3939,
    lng: -80.0228,
    radius: 50,
    description: 'Brookline neighborhood branch.',
  },
  {
    name: 'Carnegie Library - Carrick',
    type: 'library',
    lat: 40.3969,
    lng: -79.9792,
    radius: 50,
    description: 'Carrick community branch.',
  },
  {
    name: 'Carnegie Library - East Liberty',
    type: 'library',
    lat: 40.4614,
    lng: -79.9231,
    radius: 60,
    description: 'Modern East End library.',
  },
  {
    name: 'Carnegie Library - Hazelwood',
    type: 'library',
    lat: 40.4061,
    lng: -79.9394,
    radius: 50,
    description: 'Hazelwood neighborhood branch.',
  },
  {
    name: 'Carnegie Library - Homewood',
    type: 'library',
    lat: 40.4556,
    lng: -79.8975,
    radius: 50,
    description: 'Homewood community branch.',
  },
  {
    name: 'Carnegie Library - Knoxville',
    type: 'library',
    lat: 40.4119,
    lng: -79.9775,
    radius: 50,
    description: 'South Side Slopes library.',
  },
  {
    name: 'Carnegie Library - Lawrenceville',
    type: 'library',
    lat: 40.4650,
    lng: -79.9636,
    radius: 50,
    description: 'Lawrenceville neighborhood branch.',
  },
  {
    name: 'Carnegie Library - Mt. Washington',
    type: 'library',
    lat: 40.4308,
    lng: -80.0167,
    radius: 50,
    description: 'Library with views of the city.',
  },
  {
    name: 'Carnegie Library - Sheraden',
    type: 'library',
    lat: 40.4425,
    lng: -80.0606,
    radius: 50,
    description: 'West End community branch.',
  },
  {
    name: 'Carnegie Library - South Side',
    type: 'library',
    lat: 40.4275,
    lng: -79.9778,
    radius: 50,
    description: 'South Side neighborhood library.',
  },
  {
    name: 'Carnegie Library - Squirrel Hill',
    type: 'library',
    lat: 40.4328,
    lng: -79.9244,
    radius: 60,
    description: 'Busy East End neighborhood branch.',
  },
  {
    name: 'Carnegie Library - West End',
    type: 'library',
    lat: 40.4478,
    lng: -80.0472,
    radius: 50,
    description: 'West End neighborhood branch.',
  },
  {
    name: 'Carnegie Library - Woods Run',
    type: 'library',
    lat: 40.4736,
    lng: -80.0192,
    radius: 50,
    description: 'North Side community branch.',
  },
]

// Universities and Colleges
const UNIVERSITIES = [
  {
    name: 'University of Pittsburgh - Cathedral of Learning',
    type: 'university',
    lat: 40.4445,
    lng: -79.9531,
    radius: 100,
    description: 'Iconic 42-story Gothic Revival tower with Nationality Rooms.',
  },
  {
    name: 'Carnegie Mellon University - The Cut',
    type: 'university',
    lat: 40.4428,
    lng: -79.9433,
    radius: 120,
    description: 'World-renowned research university campus.',
  },
  {
    name: 'Duquesne University - Academic Walk',
    type: 'university',
    lat: 40.4392,
    lng: -79.9908,
    radius: 100,
    description: 'Bluff campus overlooking downtown Pittsburgh.',
  },
  {
    name: 'Point Park University - Downtown',
    type: 'university',
    lat: 40.4408,
    lng: -79.9972,
    radius: 80,
    description: 'Urban campus in the heart of downtown.',
  },
  {
    name: 'Chatham University - Woodland Road',
    type: 'university',
    lat: 40.4489,
    lng: -79.9144,
    radius: 90,
    description: 'Shadyside campus with historic mansion.',
  },
  {
    name: 'Robert Morris University - Moon Township',
    type: 'university',
    lat: 40.5217,
    lng: -80.1933,
    radius: 110,
    description: 'Suburban campus with modern facilities.',
  },
  {
    name: 'Community College of Allegheny County - Allegheny',
    type: 'college',
    lat: 40.4706,
    lng: -80.0189,
    radius: 80,
    description: 'North Side community college campus.',
  },
]

// Sports Venues
const SPORTS_VENUES = [
  {
    name: 'PNC Park',
    type: 'stadium',
    lat: 40.4469,
    lng: -80.0058,
    radius: 100,
    description: 'Home of the Pittsburgh Pirates with views of the skyline.',
  },
  {
    name: 'Acrisure Stadium',
    type: 'stadium',
    lat: 40.4468,
    lng: -80.0158,
    radius: 110,
    description: 'Home of the Pittsburgh Steelers.',
  },
  {
    name: 'PPG Paints Arena',
    type: 'arena',
    lat: 40.4394,
    lng: -79.9892,
    radius: 90,
    description: 'Home of the Pittsburgh Penguins.',
  },
  {
    name: 'Highmark Stadium',
    type: 'stadium',
    lat: 40.4322,
    lng: -80.0156,
    radius: 80,
    description: 'Soccer stadium on the South Side.',
  },
]

// Famous Pittsburgh Landmarks
const LANDMARKS = [
  {
    name: 'Phipps Conservatory',
    type: 'garden',
    lat: 40.4378,
    lng: -79.9494,
    radius: 80,
    description: 'Victorian glasshouse with tropical plants and seasonal flower shows.',
  },
  {
    name: 'Pittsburgh Zoo & PPG Aquarium',
    type: 'zoo',
    lat: 40.4822,
    lng: -79.9153,
    radius: 150,
    description: 'Major zoo with diverse animal exhibits and aquarium.',
  },
  {
    name: 'National Aviary',
    type: 'aviary',
    lat: 40.4544,
    lng: -80.0108,
    radius: 70,
    description: 'America\'s only independent indoor nonprofit aviary.',
  },
  {
    name: 'Carnegie Museums - Oakland',
    type: 'museum',
    lat: 40.4431,
    lng: -79.9497,
    radius: 80,
    description: 'Natural History, Art, and Science Center complex.',
  },
  {
    name: 'Andy Warhol Museum',
    type: 'museum',
    lat: 40.4489,
    lng: -80.0025,
    radius: 60,
    description: 'Largest museum dedicated to a single artist.',
  },
  {
    name: 'Randyland',
    type: 'landmark',
    lat: 40.4531,
    lng: -80.0064,
    radius: 40,
    description: 'Colorful folk art garden on the North Side.',
  },
  {
    name: 'Duquesne Incline',
    type: 'landmark',
    lat: 40.4344,
    lng: -80.0156,
    radius: 50,
    description: 'Historic cable car with panoramic city views.',
  },
  {
    name: 'Monongahela Incline',
    type: 'landmark',
    lat: 40.4300,
    lng: -79.9983,
    radius: 50,
    description: 'Oldest continuously operating funicular in the United States.',
  },
  {
    name: 'Fort Pitt Blockhouse',
    type: 'historic',
    lat: 40.4419,
    lng: -80.0089,
    radius: 40,
    description: 'Oldest structure in Pittsburgh, built in 1764.',
  },
  {
    name: 'Strip District',
    type: 'landmark',
    lat: 40.4528,
    lng: -79.9842,
    radius: 120,
    description: 'Historic market district with food vendors and shops.',
  },
]

// Anchor Community Centers
const COMMUNITY_CENTERS = [
  {
    name: 'Kingsley Center',
    type: 'community_center',
    lat: 40.4633,
    lng: -79.9389,
    radius: 60,
    description: 'Larimer community center with programs and services.',
  },
  {
    name: 'Hill House Association',
    type: 'community_center',
    lat: 40.4453,
    lng: -79.9708,
    radius: 60,
    description: 'Hill District community organization.',
  },
  {
    name: 'Homewood-Brushton YMCA',
    type: 'community_center',
    lat: 40.4567,
    lng: -79.9011,
    radius: 60,
    description: 'Community fitness and youth programs.',
  },
  {
    name: 'South Side Market House',
    type: 'community_center',
    lat: 40.4286,
    lng: -79.9764,
    radius: 50,
    description: 'Historic market and community gathering place.',
  },
]

async function seedPittsburghSites() {
  console.log('🏙️ Starting Pittsburgh area field sites seed...\n')

  const allSites = [
    ...CITY_PARKS,
    ...COUNTY_PARKS,
    ...STATE_PARKS,
    ...GREENWAYS,
    ...CARNEGIE_LIBRARIES,
    ...UNIVERSITIES,
    ...SPORTS_VENUES,
    ...LANDMARKS,
    ...COMMUNITY_CENTERS,
  ]

  console.log(`📍 Total sites to seed: ${allSites.length}`)
  console.log(`   - City Parks: ${CITY_PARKS.length}`)
  console.log(`   - County Parks: ${COUNTY_PARKS.length}`)
  console.log(`   - State Parks: ${STATE_PARKS.length}`)
  console.log(`   - Greenways: ${GREENWAYS.length}`)
  console.log(`   - Carnegie Libraries: ${CARNEGIE_LIBRARIES.length}`)
  console.log(`   - Universities: ${UNIVERSITIES.length}`)
  console.log(`   - Sports Venues: ${SPORTS_VENUES.length}`)
  console.log(`   - Landmarks: ${LANDMARKS.length}`)
  console.log(`   - Community Centers: ${COMMUNITY_CENTERS.length}\n`)

  try {
    const { data: sites, error: sitesError } = await supabase
      .from('field_sites')
      .upsert(allSites, { onConflict: 'name', ignoreDuplicates: false })
      .select()

    if (sitesError) {
      console.error('❌ Error seeding field sites:', sitesError)
      throw sitesError
    }

    console.log(`✅ Successfully seeded ${sites?.length || 0} field sites!\n`)

    // Create spawns around Pittsburgh area
    console.log('🐾 Creating spawns around Pittsburgh sites...')

    // Get species
    const { data: species } = await supabase
      .from('species')
      .select('*')

    if (species && species.length > 0 && sites && sites.length > 0) {
      const spawns = []
      
      // Create 3-5 spawns per site
      for (const site of sites.slice(0, 30)) { // First 30 sites get spawns
        const numSpawns = Math.floor(Math.random() * 3) + 3 // 3-5 spawns
        
        for (let i = 0; i < numSpawns; i++) {
          const randomSpecies = species[Math.floor(Math.random() * species.length)]
          
          // Random offset within site radius
          const offsetLat = (Math.random() - 0.5) * 0.001 * (site.radius / 50)
          const offsetLng = (Math.random() - 0.5) * 0.001 * (site.radius / 50)
          
          spawns.push({
            species_id: randomSpecies.id,
            lat: site.lat + offsetLat,
            lng: site.lng + offsetLng,
            expires_at: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours
          })
        }
      }

      const { data: createdSpawns, error: spawnsError } = await supabase
        .from('active_spawns')
        .insert(spawns)
        .select()

      if (spawnsError) {
        console.error('❌ Error creating spawns:', spawnsError)
      } else {
        console.log(`✅ Created ${createdSpawns?.length || 0} spawns across Pittsburgh!\n`)
      }
    }

    console.log('✨ Pittsburgh field sites seeding complete!\n')
    console.log('🎉 You now have comprehensive coverage of Pittsburgh area!')
    console.log('   Students can explore parks, libraries, universities, and landmarks!')

  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seedPittsburghSites()

