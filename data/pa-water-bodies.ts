/**
 * Pennsylvania Water Bodies Database
 * Comprehensive list of lakes, streams, and rivers across all PA regions
 * 
 * Organized by:
 * - Geographic region
 * - Water body type
 * - Species present
 * - PFBC management classification
 */

export interface WaterBody {
  id: string;
  name: string;
  type: 'Stream' | 'Lake' | 'River' | 'Pond' | 'Reservoir';
  county: string;
  region: 'Northwest' | 'Southwest' | 'Northcentral' | 'Southcentral' | 'Northeast' | 'Southeast';
  lat: number;
  lon: number;
  species: string[];
  size?: string;
  habitat: string;
  regulations: string;
  accessPoints: {
    name: string;
    lat: number;
    lon: number;
    amenities: string[];
    accessibility: string;
    parking: boolean;
  }[];
  stockingSchedule?: {
    date: string;
    species: string;
    quantity: number;
    size: string;
  }[];
  bestTime?: string;
  tips?: string;
}

export const PA_WATER_BODIES: WaterBody[] = [
  // NORTHWEST REGION
  {
    id: 'lake-erie',
    name: 'Lake Erie (Presque Isle Bay)',
    type: 'Lake',
    county: 'Erie',
    region: 'Northwest',
    lat: 42.1275,
    lon: -80.0851,
    species: ['smallmouth-bass', 'walleye', 'yellow-perch', 'northern-pike', 'muskellunge', 'channel-catfish'],
    size: '3,200 acres (bay)',
    habitat: 'World-class fishing for walleye and perch. Protected bay with weed beds and rocky structure.',
    regulations: 'Check PA & Great Lakes regulations - Special seasons apply',
    accessPoints: [
      {
        name: 'Presque Isle State Park',
        lat: 42.1275,
        lon: -80.0851,
        amenities: ['Multiple launches', 'Parking', 'Beach', 'Trails', 'Visitor center', 'Restrooms'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    bestTime: 'Walleye: March-May, Perch: Fall',
    tips: 'Night fishing for walleye in spring. Ice fishing for perch in winter.'
  },
  {
    id: 'pymatuning-lake',
    name: 'Pymatuning Lake',
    type: 'Reservoir',
    county: 'Crawford',
    region: 'Northwest',
    lat: 41.5139,
    lon: -80.4734,
    species: ['muskellunge', 'walleye', 'crappie', 'bluegill', 'channel-catfish', 'yellow-perch'],
    size: '14,000 acres (PA side)',
    habitat: 'Largest lake in PA. Shallow reservoir with extensive weed beds and submerged timber.',
    regulations: 'Muskie: 40" minimum, Walleye: 15" minimum',
    accessPoints: [
      {
        name: 'Jamestown Marina',
        lat: 41.4900,
        lon: -80.4500,
        amenities: ['Boat launch', 'Marina', 'Parking', 'Restrooms', 'Fuel'],
        accessibility: 'Easy',
        parking: true
      },
      {
        name: 'Tuttle Point',
        lat: 41.5400,
        lon: -80.4800,
        amenities: ['Boat launch', 'Parking', 'Picnic area'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    bestTime: 'Muskie: Fall, Crappie: Spring spawn',
    tips: 'Excellent crappie fishing around brush piles in spring.'
  },
  {
    id: 'conneaut-lake',
    name: 'Conneaut Lake',
    type: 'Lake',
    county: 'Crawford',
    region: 'Northwest',
    lat: 41.6114,
    lon: -80.3103,
    species: ['walleye', 'muskellunge', 'yellow-perch', 'crappie', 'bluegill'],
    size: '929 acres',
    habitat: 'Natural glacial lake with sandy bottom and weed beds.',
    regulations: 'Standard PA regulations apply',
    accessPoints: [
      {
        name: 'Conneaut Lake Park Marina',
        lat: 41.6114,
        lon: -80.3103,
        amenities: ['Boat launch', 'Marina', 'Parking', 'Fuel'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    bestTime: 'Walleye: Spring & Fall',
    tips: 'Night trolling for walleye is productive.'
  },

  // SOUTHWEST REGION
  {
    id: 'raystown-lake',
    name: 'Raystown Lake',
    type: 'Reservoir',
    county: 'Huntingdon',
    region: 'Southwest',
    lat: 40.4167,
    lon: -78.0833,
    species: ['smallmouth-bass', 'largemouth-bass', 'walleye', 'muskellunge', 'crappie', 'bluegill', 'yellow-perch', 'channel-catfish'],
    size: '8,300 acres, 30 miles long',
    habitat: '8,300-acre reservoir with rocky points, coves, and deep channels. Excellent structure for bass and muskie.',
    regulations: 'Bass: 15" minimum, Walleye: 18" minimum, Muskie: 40" minimum',
    accessPoints: [
      {
        name: 'Seven Points Marina',
        lat: 40.4167,
        lon: -78.0833,
        amenities: ['Boat launch', 'Parking', 'Marina', 'Restrooms', 'Picnic area', 'Fuel'],
        accessibility: 'Easy',
        parking: true
      },
      {
        name: 'Susquehannock Campground',
        lat: 40.4200,
        lon: -78.0900,
        amenities: ['Boat launch', 'Camping', 'Swimming', 'Parking', 'Restrooms'],
        accessibility: 'Moderate',
        parking: true
      }
    ],
    bestTime: 'Smallmouth: May-October, Striped Bass: Spring',
    tips: 'Target rocky points for smallmouth. Muskie fishing excellent in fall.'
  },
  {
    id: 'youghiogheny-river-lake',
    name: 'Youghiogheny River Lake',
    type: 'Reservoir',
    county: 'Somerset',
    region: 'Southwest',
    lat: 39.7975,
    lon: -79.3753,
    species: ['smallmouth-bass', 'walleye', 'northern-pike', 'crappie', 'bluegill'],
    size: '2,840 acres',
    habitat: 'Deep reservoir in Laurel Highlands with clear water and rocky structure.',
    regulations: 'Walleye: 18" minimum',
    accessPoints: [
      {
        name: 'Tub Run Recreation Area',
        lat: 39.7975,
        lon: -79.3753,
        amenities: ['Boat launch', 'Camping', 'Parking', 'Restrooms'],
        accessibility: 'Moderate',
        parking: true
      }
    ],
    bestTime: 'Smallmouth: Summer, Walleye: Spring',
    tips: 'Excellent smallmouth bass fishing in summer months.'
  },
  {
    id: 'high-point-lake',
    name: 'High Point Lake',
    type: 'Lake',
    county: 'Somerset',
    region: 'Southwest',
    lat: 40.0183,
    lon: -79.1833,
    species: ['largemouth-bass', 'bluegill', 'crappie', 'channel-catfish'],
    size: '82 acres',
    habitat: 'Shallow lake at 2,400 feet elevation in mountains.',
    regulations: 'No motors over 20 HP',
    accessPoints: [
      {
        name: 'High Point Lake Park',
        lat: 40.0183,
        lon: -79.1833,
        amenities: ['Boat launch', 'Parking', 'Beach', 'Picnic area'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    bestTime: 'Bass: May-September',
    tips: 'Family-friendly fishing with good panfish populations.'
  },

  // NORTHCENTRAL REGION
  {
    id: 'spring-creek',
    name: 'Spring Creek',
    type: 'Stream',
    county: 'Centre',
    region: 'Northcentral',
    lat: 40.7934,
    lon: -77.8600,
    species: ['brook-trout', 'brown-trout', 'rainbow-trout'],
    size: '15 miles',
    habitat: 'Spring-fed limestone stream with excellent trout habitat and year-round fishing',
    regulations: 'Fly fishing only, catch & release in designated areas',
    accessPoints: [
      {
        name: 'Fisherman\'s Paradise',
        lat: 40.7934,
        lon: -77.8600,
        amenities: ['Parking', 'Restrooms', 'Wheelchair accessible', 'Picnic area'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    stockingSchedule: [
      { date: '2024-04-01', species: 'Rainbow Trout', quantity: 2500, size: 'Adult' },
      { date: '2024-10-01', species: 'Brook Trout', quantity: 500, size: 'Adult' }
    ],
    bestTime: 'Year-round, best during hatches',
    tips: 'One of PA\'s best trout streams. Learn to match the hatch.'
  },
  {
    id: 'penns-creek',
    name: 'Penns Creek',
    type: 'Stream',
    county: 'Centre/Snyder',
    region: 'Northcentral',
    lat: 40.8670,
    lon: -77.4167,
    species: ['brown-trout', 'smallmouth-bass'],
    size: '67 miles',
    habitat: 'Freestone stream with excellent insect hatches and deep pools',
    regulations: 'Trophy trout section - Special regulations',
    accessPoints: [
      {
        name: 'Coburn Access',
        lat: 40.8670,
        lon: -77.4167,
        amenities: ['Parking', 'Stream access'],
        accessibility: 'Moderate',
        parking: true
      }
    ],
    stockingSchedule: [
      { date: '2024-04-05', species: 'Brown Trout', quantity: 1500, size: 'Adult' }
    ],
    bestTime: 'Green Drake hatch (late May), Fall',
    tips: 'Famous for Green Drake mayfly hatch. Fish large dry flies.'
  },
  {
    id: 'pine-creek',
    name: 'Pine Creek',
    type: 'Stream',
    county: 'Tioga',
    region: 'Northcentral',
    lat: 41.7000,
    lon: -77.4000,
    species: ['brook-trout', 'brown-trout', 'smallmouth-bass'],
    size: '87 miles',
    habitat: 'Pennsylvania Grand Canyon stream with diverse fishing opportunities',
    regulations: 'Varies by section - check current regulations',
    accessPoints: [
      {
        name: 'Leonard Harrison State Park',
        lat: 41.7000,
        lon: -77.4000,
        amenities: ['Parking', 'Overlook', 'Trails', 'Visitor center'],
        accessibility: 'Moderate',
        parking: true
      }
    ],
    stockingSchedule: [
      { date: '2024-04-25', species: 'Brook Trout', quantity: 1000, size: 'Adult' }
    ],
    bestTime: 'Trout: Spring & Fall, Bass: Summer',
    tips: 'Hike into the canyon for solitude and wild trout.'
  },
  {
    id: 'kettle-creek',
    name: 'Kettle Creek',
    type: 'Stream',
    county: 'Clinton',
    region: 'Northcentral',
    lat: 41.3500,
    lon: -77.8000,
    species: ['brook-trout', 'brown-trout'],
    size: '44 miles',
    habitat: 'Remote wilderness stream with native and stocked trout',
    regulations: 'Trophy trout regulations in select areas',
    accessPoints: [
      {
        name: 'Kettle Creek State Park',
        lat: 41.3500,
        lon: -77.8000,
        amenities: ['Parking', 'Camping', 'Stream access'],
        accessibility: 'Moderate',
        parking: true
      }
    ],
    stockingSchedule: [
      { date: '2024-04-10', species: 'Brook Trout', quantity: 800, size: 'Adult' }
    ],
    bestTime: 'Spring & Fall',
    tips: 'Remote fishing with potential for large wild trout.'
  },
  {
    id: 'loyalsock-creek',
    name: 'Loyalsock Creek',
    type: 'Stream',
    county: 'Lycoming',
    region: 'Northcentral',
    lat: 41.2500,
    lon: -76.8000,
    species: ['brown-trout', 'rainbow-trout', 'smallmouth-bass'],
    size: '64 miles',
    habitat: 'Scenic mountain stream with quality trout and bass fishing',
    regulations: 'Delayed harvest and trophy trout sections',
    accessPoints: [
      {
        name: 'Worlds End State Park',
        lat: 41.2500,
        lon: -76.8000,
        amenities: ['Parking', 'Camping', 'Stream access', 'Trails'],
        accessibility: 'Moderate',
        parking: true
      }
    ],
    stockingSchedule: [
      { date: '2024-04-20', species: 'Rainbow Trout', quantity: 3500, size: 'Adult' }
    ],
    bestTime: 'April-June for trout',
    tips: 'Delayed harvest area provides excellent early season fishing.'
  },

  // SOUTHCENTRAL REGION
  {
    id: 'yellow-breeches-creek',
    name: 'Yellow Breeches Creek',
    type: 'Stream',
    county: 'Cumberland',
    region: 'Southcentral',
    lat: 40.2000,
    lon: -77.0000,
    species: ['brown-trout', 'rainbow-trout'],
    size: '60 miles',
    habitat: 'Popular limestone stream with consistent hatches and large trout',
    regulations: 'Special trophy regulations in sections',
    accessPoints: [
      {
        name: 'Allenberry Resort Access',
        lat: 40.2000,
        lon: -77.0000,
        amenities: ['Parking', 'Stream access'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    stockingSchedule: [
      { date: '2024-04-12', species: 'Brown Trout', quantity: 2000, size: 'Adult' }
    ],
    bestTime: 'Year-round, Sulphur hatch (May-June)',
    tips: 'Challenging fishing for educated trout. Use small flies.'
  },
  {
    id: 'big-spring-creek',
    name: 'Big Spring Creek',
    type: 'Stream',
    county: 'Cumberland',
    region: 'Southcentral',
    lat: 40.1500,
    lon: -77.2000,
    species: ['brown-trout'],
    size: '7 miles',
    habitat: 'Crystal-clear spring creek with trophy brown trout',
    regulations: 'Catch & release, fly fishing only',
    accessPoints: [
      {
        name: 'Children\'s Lake',
        lat: 40.1500,
        lon: -77.2000,
        amenities: ['Parking', 'Park', 'Stream access'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    stockingSchedule: [
      { date: '2024-04-18', species: 'Brown Trout', quantity: 1200, size: 'Trophy (14"+)' }
    ],
    bestTime: 'Year-round',
    tips: 'Sight fishing for trophy browns. Very technical fishing.'
  },
  {
    id: 'letort-spring-run',
    name: 'Letort Spring Run',
    type: 'Stream',
    county: 'Cumberland',
    region: 'Southcentral',
    lat: 40.2017,
    lon: -77.1883,
    species: ['brown-trout'],
    size: '9 miles',
    habitat: 'Legendary limestone spring creek, birthplace of modern fly fishing',
    regulations: 'All catch & release, fly fishing only',
    accessPoints: [
      {
        name: 'Letort Park',
        lat: 40.2017,
        lon: -77.1883,
        amenities: ['Parking', 'Park', 'Stream access'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    bestTime: 'Year-round, best May-October',
    tips: 'Historic water. Very challenging. Fish small flies and fine tippets.'
  },
  {
    id: 'codorus-creek',
    name: 'Codorus Creek',
    type: 'Stream',
    county: 'York',
    region: 'Southcentral',
    lat: 39.9500,
    lon: -76.7300,
    species: ['smallmouth-bass', 'rainbow-trout', 'brown-trout'],
    size: '50 miles',
    habitat: 'Freestone stream with mix of trout and warmwater species',
    regulations: 'Delayed harvest area in sections',
    accessPoints: [
      {
        name: 'Codorus State Park',
        lat: 39.8200,
        lon: -76.8500,
        amenities: ['Parking', 'Lake access', 'Boat launch', 'Camping'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    bestTime: 'Trout: Spring, Bass: Summer',
    tips: 'Good delayed harvest fishing early season.'
  },
  {
    id: 'lake-marburg',
    name: 'Lake Marburg (Codorus State Park)',
    type: 'Lake',
    county: 'York',
    region: 'Southcentral',
    lat: 39.8200,
    lon: -76.8500,
    species: ['largemouth-bass', 'smallmouth-bass', 'crappie', 'bluegill', 'channel-catfish'],
    size: '1,275 acres',
    habitat: 'Large warm-water lake with coves, points, and submerged structure',
    regulations: 'Standard PA regulations',
    accessPoints: [
      {
        name: 'Codorus Marina',
        lat: 39.8200,
        lon: -76.8500,
        amenities: ['Boat launch', 'Marina', 'Parking', 'Camping', 'Swimming'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    bestTime: 'Bass: April-October',
    tips: 'Excellent bass fishing with healthy populations of both species.'
  },

  // NORTHEAST REGION
  {
    id: 'lake-wallenpaupack',
    name: 'Lake Wallenpaupack',
    type: 'Reservoir',
    county: 'Pike/Wayne',
    region: 'Northeast',
    lat: 41.3500,
    lon: -75.1833,
    species: ['smallmouth-bass', 'largemouth-bass', 'walleye', 'yellow-perch', 'crappie', 'bluegill', 'channel-catfish'],
    size: '5,700 acres, 52 miles of shoreline',
    habitat: '5,700-acre reservoir with rocky shorelines, submerged timber, and deep basins',
    regulations: 'Bass: 12" minimum, No size limits on panfish',
    accessPoints: [
      {
        name: 'Mangan\'s Boat Launch',
        lat: 41.3500,
        lon: -75.1833,
        amenities: ['Boat launch', 'Parking', 'Marina', 'Fuel'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    bestTime: 'Smallmouth: May-October, Ice fishing in winter',
    tips: 'Target rocky points for smallmouth. Excellent ice fishing.'
  },
  {
    id: 'beltzville-lake',
    name: 'Beltzville Lake',
    type: 'Reservoir',
    county: 'Carbon',
    region: 'Northeast',
    lat: 40.8456,
    lon: -75.6178,
    species: ['smallmouth-bass', 'largemouth-bass', 'walleye', 'crappie', 'bluegill'],
    size: '949 acres',
    habitat: 'Clear reservoir with rocky structure and deep water',
    regulations: 'Bass: 15" minimum',
    accessPoints: [
      {
        name: 'Beltzville State Park',
        lat: 40.8456,
        lon: -75.6178,
        amenities: ['Boat launch', 'Parking', 'Beach', 'Picnic area'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    bestTime: 'Smallmouth: Summer',
    tips: 'Excellent smallmouth bass lake with clear water.'
  },
  {
    id: 'brodhead-creek',
    name: 'Brodhead Creek',
    type: 'Stream',
    county: 'Monroe',
    region: 'Northeast',
    lat: 41.0000,
    lon: -75.2000,
    species: ['brown-trout', 'rainbow-trout'],
    size: '20 miles (stocked section)',
    habitat: 'Pocono Mountain stream with delayed harvest area',
    regulations: 'Delayed harvest section with special regs',
    accessPoints: [
      {
        name: 'Brodheadsville Access',
        lat: 41.0000,
        lon: -75.2000,
        amenities: ['Parking', 'Stream access'],
        accessibility: 'Moderate',
        parking: true
      }
    ],
    stockingSchedule: [
      { date: '2024-04-22', species: 'Brown Trout', quantity: 1800, size: 'Adult' }
    ],
    bestTime: 'April-June',
    tips: 'Delayed harvest provides excellent early season fishing.'
  },
  {
    id: 'tobyhanna-creek',
    name: 'Tobyhanna Creek',
    type: 'Stream',
    county: 'Monroe',
    region: 'Northeast',
    lat: 41.1500,
    lon: -75.4500,
    species: ['brown-trout', 'brook-trout'],
    size: '12 miles',
    habitat: 'Pocono swamp stream with wild brook trout',
    regulations: 'Special regulation sections',
    accessPoints: [
      {
        name: 'Tobyhanna State Park',
        lat: 41.1986,
        lon: -75.3864,
        amenities: ['Parking', 'Camping', 'Lake access'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    bestTime: 'Spring & Fall',
    tips: 'Native brook trout in headwaters. Explore tributaries.'
  },

  // SOUTHEAST REGION
  {
    id: 'little-lehigh-creek',
    name: 'Little Lehigh Creek',
    type: 'Stream',
    county: 'Lehigh',
    region: 'Southeast',
    lat: 40.5931,
    lon: -75.5043,
    species: ['brown-trout', 'rainbow-trout'],
    size: '26 miles',
    habitat: 'Urban trout stream with excellent fly fishing opportunities',
    regulations: 'Catch & release fly fishing only in special regulation areas',
    accessPoints: [
      {
        name: 'Little Lehigh Parkway',
        lat: 40.5931,
        lon: -75.5043,
        amenities: ['Parking', 'Trails', 'Picnic area'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    stockingSchedule: [
      { date: '2024-04-08', species: 'Rainbow Trout', quantity: 3000, size: 'Adult' },
      { date: '2024-10-12', species: 'Brown Trout', quantity: 2500, size: 'Adult' }
    ],
    bestTime: 'Year-round, best during hatches',
    tips: 'Excellent urban fishery. Watch for hatches and rising fish.'
  },
  {
    id: 'tulpehocken-creek',
    name: 'Tulpehocken Creek',
    type: 'Stream',
    county: 'Berks',
    region: 'Southeast',
    lat: 40.3500,
    lon: -76.1000,
    species: ['rainbow-trout', 'brown-trout'],
    size: '38 miles',
    habitat: 'Limestone-influenced stream with good trout populations',
    regulations: 'Delayed harvest sections',
    accessPoints: [
      {
        name: 'Blue Marsh Lake',
        lat: 40.3667,
        lon: -75.9833,
        amenities: ['Parking', 'Boat launch', 'Trails'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    stockingSchedule: [
      { date: '2024-04-15', species: 'Rainbow Trout', quantity: 2200, size: 'Adult' }
    ],
    bestTime: 'April-June',
    tips: 'Delayed harvest section provides quality early season fishing.'
  },
  {
    id: 'blue-marsh-lake',
    name: 'Blue Marsh Lake',
    type: 'Reservoir',
    county: 'Berks',
    region: 'Southeast',
    lat: 40.3667,
    lon: -75.9833,
    species: ['largemouth-bass', 'smallmouth-bass', 'crappie', 'bluegill', 'channel-catfish', 'muskie'],
    size: '1,150 acres',
    habitat: 'Clear reservoir with rocky points and coves',
    regulations: 'Muskie: 40" minimum',
    accessPoints: [
      {
        name: 'Dry Brooks Day Use Area',
        lat: 40.3667,
        lon: -75.9833,
        amenities: ['Boat launch', 'Parking', 'Beach', 'Trails'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    bestTime: 'Bass: May-October',
    tips: 'Muskie fishing is improving. Target main lake points for bass.'
  },
  {
    id: 'french-creek',
    name: 'French Creek',
    type: 'Stream',
    county: 'Chester',
    region: 'Southeast',
    lat: 40.1500,
    lon: -75.7500,
    species: ['smallmouth-bass', 'rainbow-trout', 'brown-trout'],
    size: '117 miles',
    habitat: 'One of PA\'s most biodiverse streams with excellent smallmouth bass',
    regulations: 'Stocked trout sections in spring',
    accessPoints: [
      {
        name: 'Hopewell Furnace NHS',
        lat: 40.2106,
        lon: -75.7683,
        amenities: ['Parking', 'Trails', 'Historic site'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    bestTime: 'Smallmouth: June-October',
    tips: 'Incredible biodiversity. Focus on smallmouth in summer.'
  },
  {
    id: 'marsh-creek-lake',
    name: 'Marsh Creek Lake',
    type: 'Lake',
    county: 'Chester',
    region: 'Southeast',
    lat: 40.0756,
    lon: -75.7969,
    species: ['largemouth-bass', 'crappie', 'bluegill', 'channel-catfish'],
    size: '535 acres',
    habitat: 'Shallow lake with weed beds and good panfish populations',
    regulations: 'Standard PA regulations',
    accessPoints: [
      {
        name: 'Marsh Creek State Park',
        lat: 40.0756,
        lon: -75.7969,
        amenities: ['Boat launch', 'Parking', 'Sailing', 'Picnic area'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    bestTime: 'Crappie: April-May',
    tips: 'Excellent crappie fishing in spring around brush piles.'
  },

  // ADDITIONAL TROPHY WATERS
  {
    id: 'fishing-creek',
    name: 'Fishing Creek',
    type: 'Stream',
    county: 'Clinton',
    region: 'Northcentral',
    lat: 41.3000,
    lon: -77.5000,
    species: ['brook-trout', 'brown-trout'],
    size: '29 miles',
    habitat: 'Wild trout stream with native brook trout',
    regulations: 'Wild trout regulations - No stocking',
    accessPoints: [
      {
        name: 'Lamar Access',
        lat: 41.0000,
        lon: -77.5200,
        amenities: ['Parking', 'Stream access'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    bestTime: 'April-October',
    tips: 'Excellent wild trout stream. Fish dry flies in summer.'
  },
  {
    id: 'clarion-river',
    name: 'Clarion River',
    type: 'River',
    county: 'Clarion',
    region: 'Northwest',
    lat: 41.2000,
    lon: -79.4000,
    species: ['smallmouth-bass', 'rainbow-trout', 'brown-trout'],
    size: '110 miles',
    habitat: 'Scenic river with mix of trout and bass fishing',
    regulations: 'Trophy trout sections',
    accessPoints: [
      {
        name: 'Cook Forest State Park',
        lat: 41.3408,
        lon: -79.2206,
        amenities: ['Parking', 'Camping', 'Cabins', 'Trails'],
        accessibility: 'Moderate',
        parking: true
      }
    ],
    bestTime: 'Trout: Spring, Bass: Summer',
    tips: 'Float fishing popular. Canoe/kayak rentals available.'
  },
  {
    id: 'allegheny-river',
    name: 'Allegheny River',
    type: 'River',
    county: 'Warren',
    region: 'Northwest',
    lat: 41.8000,
    lon: -79.2000,
    species: ['smallmouth-bass', 'walleye', 'muskellunge', 'channel-catfish'],
    size: '325 miles (in PA)',
    habitat: 'Large river with diverse fishing opportunities',
    regulations: 'Check specific sections for regulations',
    accessPoints: [
      {
        name: 'Kinzua Dam',
        lat: 41.8361,
        lon: -79.0169,
        amenities: ['Boat launch', 'Parking', 'Visitor center'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    bestTime: 'Smallmouth: May-October',
    tips: 'Excellent float fishing. Target rocky areas for smallmouth.'
  },
  {
    id: 'susquehanna-river-north',
    name: 'Susquehanna River (North Branch)',
    type: 'River',
    county: 'Bradford',
    region: 'Northeast',
    lat: 41.8500,
    lon: -76.5000,
    species: ['smallmouth-bass', 'walleye', 'muskellunge', 'channel-catfish'],
    size: '444 miles total',
    habitat: 'Major river system with excellent smallmouth bass fishing',
    regulations: 'Check specific pools for regulations',
    accessPoints: [
      {
        name: 'Athens Boat Launch',
        lat: 41.9569,
        lon: -76.5169,
        amenities: ['Boat launch', 'Parking'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    bestTime: 'Smallmouth: May-October',
    tips: 'Target rocky riffles and ledges for smallmouth.'
  },
  {
    id: 'susquehanna-river-west',
    name: 'Susquehanna River (West Branch)',
    type: 'River',
    county: 'Lycoming',
    region: 'Northcentral',
    lat: 41.2400,
    lon: -76.8700,
    species: ['smallmouth-bass', 'walleye', 'muskellunge', 'channel-catfish'],
    size: '243 miles',
    habitat: 'Productive warmwater fishery with improving water quality',
    regulations: 'Check specific sections',
    accessPoints: [
      {
        name: 'Williamsport Boat Launch',
        lat: 41.2411,
        lon: -77.0011,
        amenities: ['Boat launch', 'Parking'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    bestTime: 'Smallmouth: May-October',
    tips: 'Float fishing productive. Target islands and ledges.'
  }
];

// Helper functions
export const getWaterBodiesByRegion = (region: WaterBody['region']) => {
  return PA_WATER_BODIES.filter(w => w.region === region);
};

export const getWaterBodiesByCounty = (county: string) => {
  return PA_WATER_BODIES.filter(w => w.county.includes(county));
};

export const getWaterBodiesByType = (type: WaterBody['type']) => {
  return PA_WATER_BODIES.filter(w => w.type === type);
};

export const getWaterBodiesWithStocking = () => {
  return PA_WATER_BODIES.filter(w => w.stockingSchedule && w.stockingSchedule.length > 0);
};

export const getTroutStreams = () => {
  return PA_WATER_BODIES.filter(w => 
    w.type === 'Stream' && 
    (w.species.includes('brook-trout') || w.species.includes('brown-trout') || w.species.includes('rainbow-trout'))
  );
};

export const getBassLakes = () => {
  return PA_WATER_BODIES.filter(w => 
    (w.type === 'Lake' || w.type === 'Reservoir') && 
    (w.species.includes('largemouth-bass') || w.species.includes('smallmouth-bass'))
  );
};

// County list for filtering
export const PA_COUNTIES = [
  'Adams', 'Allegheny', 'Armstrong', 'Beaver', 'Bedford', 'Berks', 'Blair', 'Bradford',
  'Bucks', 'Butler', 'Cambria', 'Cameron', 'Carbon', 'Centre', 'Chester', 'Clarion',
  'Clearfield', 'Clinton', 'Columbia', 'Crawford', 'Cumberland', 'Dauphin', 'Delaware',
  'Elk', 'Erie', 'Fayette', 'Forest', 'Franklin', 'Fulton', 'Greene', 'Huntingdon',
  'Indiana', 'Jefferson', 'Juniata', 'Lackawanna', 'Lancaster', 'Lawrence', 'Lebanon',
  'Lehigh', 'Luzerne', 'Lycoming', 'McKean', 'Mercer', 'Mifflin', 'Monroe', 'Montgomery',
  'Montour', 'Northampton', 'Northumberland', 'Perry', 'Philadelphia', 'Pike', 'Potter',
  'Schuylkill', 'Snyder', 'Somerset', 'Sullivan', 'Susquehanna', 'Tioga', 'Union',
  'Venango', 'Warren', 'Washington', 'Wayne', 'Westmoreland', 'Wyoming', 'York'
];

