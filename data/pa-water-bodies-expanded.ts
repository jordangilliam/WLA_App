/**
 * Expanded Pennsylvania Water Bodies Database
 * Focus on popular, well-maintained locations near urban centers
 */

export interface WaterBody {
  id: string;
  name: string;
  type: 'Stream' | 'Lake' | 'River' | 'Pond';
  county: string;
  region: 'Philadelphia' | 'Pittsburgh' | 'Harrisburg' | 'Lehigh Valley' | 'Erie' | 'Scranton' | 'Reading' | 'Lancaster' | 'Central';
  urbanProximity: 'Urban' | 'Suburban' | 'Rural';
  lat: number;
  lon: number;
  species: string[];
  stockingSchedule?: StockingEvent[];
  accessPoints: AccessPoint[];
  regulations: string;
  habitat: string;
  size?: string;
  maintenance: 'High' | 'Medium' | 'Low';
  popularity: number; // 1-10 scale
}

export interface StockingEvent {
  date: string;
  species: string;
  quantity: number;
  size: string;
}

export interface AccessPoint {
  name: string;
  lat: number;
  lon: number;
  amenities: string[];
  accessibility: string;
  parking: boolean;
}

export const PA_WATER_BODIES_EXPANDED: WaterBody[] = [
  // ============================================================================
  // PHILADELPHIA REGION - High Urban Access
  // ============================================================================
  {
    id: 'peace-valley-lake',
    name: 'Peace Valley Lake',
    type: 'Lake',
    county: 'Bucks',
    region: 'Philadelphia',
    urbanProximity: 'Suburban',
    lat: 40.3706,
    lon: -75.2635,
    species: ['largemouth-bass', 'smallmouth-bass', 'crappie', 'bluegill', 'channel-catfish', 'muskie'],
    stockingSchedule: [
      { date: '2024-05-01', species: 'Muskellunge', quantity: 200, size: 'Adult' }
    ],
    accessPoints: [
      {
        name: 'Peace Valley Nature Center',
        lat: 40.3706,
        lon: -75.2635,
        amenities: ['Boat launch', 'Nature center', 'Trails', 'Parking', 'Restrooms'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    regulations: 'Electric motors only, Bass: 12" minimum',
    habitat: '365-acre lake with coves, lily pads, and structure. Popular urban fishing destination 30 minutes from Philadelphia.',
    size: '365 acres',
    maintenance: 'High',
    popularity: 9
  },
  {
    id: 'belmont-lake-fdr',
    name: 'Belmont Lake (FDR Park)',
    type: 'Lake',
    county: 'Philadelphia',
    region: 'Philadelphia',
    urbanProximity: 'Urban',
    lat: 39.9008,
    lon: -75.1933,
    species: ['largemouth-bass', 'bluegill', 'crappie', 'channel-catfish', 'carp'],
    accessPoints: [
      {
        name: 'FDR Park Access',
        lat: 39.9008,
        lon: -75.1933,
        amenities: ['Shore fishing', 'Parking', 'Trails', 'Picnic area', 'Playgrounds'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    regulations: 'Shore fishing only, Standard PA regulations',
    habitat: 'Urban lake in South Philadelphia. Great for youth and beginner anglers. Recently renovated.',
    size: '25 acres',
    maintenance: 'High',
    popularity: 8
  },
  {
    id: 'schuylkill-river-philly',
    name: 'Schuylkill River (Philadelphia)',
    type: 'River',
    county: 'Philadelphia',
    region: 'Philadelphia',
    urbanProximity: 'Urban',
    lat: 40.0094,
    lon: -75.1844,
    species: ['smallmouth-bass', 'channel-catfish', 'striped-bass', 'carp', 'american-shad'],
    accessPoints: [
      {
        name: 'Fairmount Water Works',
        lat: 40.0094,
        lon: -75.1844,
        amenities: ['Shore fishing', 'Parking', 'Trails', 'Historical site', 'Visitor center'],
        accessibility: 'Easy',
        parking: true
      },
      {
        name: 'Bartram\'s Garden',
        lat: 39.9328,
        lon: -75.2225,
        amenities: ['Shore fishing', 'Gardens', 'Parking', 'Education center'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    regulations: 'Check for consumption advisories, Standard PA regulations',
    habitat: 'Urban river with improving water quality. Excellent smallmouth bass fishing along boathouse row.',
    size: '20 miles in Philadelphia',
    maintenance: 'High',
    popularity: 8
  },
  {
    id: 'ridley-creek',
    name: 'Ridley Creek',
    type: 'Stream',
    county: 'Delaware',
    region: 'Philadelphia',
    urbanProximity: 'Suburban',
    lat: 39.9086,
    lon: -75.4444,
    species: ['brown-trout', 'rainbow-trout'],
    stockingSchedule: [
      { date: '2024-04-01', species: 'Rainbow Trout', quantity: 2000, size: 'Adult' },
      { date: '2024-04-15', species: 'Brown Trout', quantity: 1500, size: 'Adult' },
      { date: '2024-10-01', species: 'Brown Trout', quantity: 1000, size: 'Adult' }
    ],
    accessPoints: [
      {
        name: 'Ridley Creek State Park',
        lat: 39.9086,
        lon: -75.4444,
        amenities: ['Stream access', 'Parking', 'Trails', 'Historic sites'],
        accessibility: 'Moderate',
        parking: true
      }
    ],
    regulations: 'Stocked trout waters, Standard trout season',
    habitat: 'Scenic suburban stream with excellent spring and fall trout stocking program',
    size: '5 miles stocked section',
    maintenance: 'High',
    popularity: 9
  },
  {
    id: 'lake-galena',
    name: 'Lake Galena',
    type: 'Lake',
    county: 'Bucks',
    region: 'Philadelphia',
    urbanProximity: 'Suburban',
    lat: 40.3369,
    lon: -75.0836,
    species: ['largemouth-bass', 'bluegill', 'crappie', 'channel-catfish'],
    accessPoints: [
      {
        name: 'Peace Valley Park',
        lat: 40.3369,
        lon: -75.0836,
        amenities: ['Shore fishing', 'Parking', 'Trails', 'Picnic area'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    regulations: 'No boats, Shore fishing only',
    habitat: 'Small urban lake perfect for family fishing, adjacent to Peace Valley',
    size: '30 acres',
    maintenance: 'High',
    popularity: 7
  },

  // ============================================================================
  // PITTSBURGH REGION - High Urban Access
  // ============================================================================
  {
    id: 'north-park-lake',
    name: 'North Park Lake',
    type: 'Lake',
    county: 'Allegheny',
    region: 'Pittsburgh',
    urbanProximity: 'Suburban',
    lat: 40.6178,
    lon: -79.9506,
    species: ['largemouth-bass', 'bluegill', 'crappie', 'channel-catfish', 'northern-pike'],
    stockingSchedule: [
      { date: '2024-05-01', species: 'Northern Pike', quantity: 150, size: 'Adult' }
    ],
    accessPoints: [
      {
        name: 'North Park Boat Launch',
        lat: 40.6178,
        lon: -79.9506,
        amenities: ['Boat launch', 'Boat rental', 'Parking', 'Trails', 'Swimming pool', 'Marina'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    regulations: 'Electric motors only, Bass: 15" minimum',
    habitat: '75-acre lake in Pittsburgh\'s premier county park. Excellent for families with full amenities.',
    size: '75 acres',
    maintenance: 'High',
    popularity: 10
  },
  {
    id: 'boyce-park-lake',
    name: 'Boyce Park Lake',
    type: 'Lake',
    county: 'Allegheny',
    region: 'Pittsburgh',
    urbanProximity: 'Suburban',
    lat: 40.4872,
    lon: -79.7697,
    species: ['largemouth-bass', 'bluegill', 'crappie', 'channel-catfish'],
    accessPoints: [
      {
        name: 'Boyce Park',
        lat: 40.4872,
        lon: -79.7697,
        amenities: ['Shore fishing', 'Parking', 'Trails', 'Nature center'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    regulations: 'No boats, Shore fishing only',
    habitat: 'Small urban lake in Allegheny County park, great for kids and beginners',
    size: '15 acres',
    maintenance: 'High',
    popularity: 7
  },
  {
    id: 'raccoon-lake',
    name: 'Raccoon Lake',
    type: 'Lake',
    county: 'Beaver',
    region: 'Pittsburgh',
    urbanProximity: 'Suburban',
    lat: 40.5372,
    lon: -80.4397,
    species: ['largemouth-bass', 'muskellunge', 'walleye', 'crappie', 'bluegill', 'channel-catfish'],
    stockingSchedule: [
      { date: '2024-05-10', species: 'Muskellunge', quantity: 300, size: 'Adult' },
      { date: '2024-05-20', species: 'Walleye', quantity: 2000, size: 'Fingerling' }
    ],
    accessPoints: [
      {
        name: 'Raccoon Creek State Park Marina',
        lat: 40.5372,
        lon: -80.4397,
        amenities: ['Boat launch', 'Marina', 'Camping', 'Swimming', 'Parking', 'Trails'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    regulations: 'Bass: 15" minimum, Muskie: 40" minimum',
    habitat: '101-acre lake with rocky structure. Excellent muskie fishing 30 minutes from Pittsburgh.',
    size: '101 acres',
    maintenance: 'High',
    popularity: 9
  },
  {
    id: 'moraine-state-park-lake',
    name: 'Lake Arthur (Moraine State Park)',
    type: 'Lake',
    county: 'Butler',
    region: 'Pittsburgh',
    urbanProximity: 'Suburban',
    lat: 40.9500,
    lon: -79.9833,
    species: ['smallmouth-bass', 'largemouth-bass', 'muskellunge', 'walleye', 'crappie', 'yellow-perch', 'channel-catfish'],
    stockingSchedule: [
      { date: '2024-05-05', species: 'Muskellunge', quantity: 500, size: 'Adult' },
      { date: '2024-05-15', species: 'Walleye', quantity: 3000, size: 'Fingerling' }
    ],
    accessPoints: [
      {
        name: 'Pleasant Valley',
        lat: 40.9500,
        lon: -79.9833,
        amenities: ['Boat launch', 'Marina', 'Parking', 'Restrooms'],
        accessibility: 'Easy',
        parking: true
      },
      {
        name: 'McDanel\'s Launch',
        lat: 40.9600,
        lon: -80.0000,
        amenities: ['Boat launch', 'Parking'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    regulations: 'Bass: 15" minimum, Muskie: 40" minimum',
    habitat: '3,225-acre lake with diverse structure. Premier destination for muskie and walleye.',
    size: '3,225 acres, 42 miles of shoreline',
    maintenance: 'High',
    popularity: 10
  },
  {
    id: 'three-rivers-confluence',
    name: 'Three Rivers (Confluence)',
    type: 'River',
    county: 'Allegheny',
    region: 'Pittsburgh',
    urbanProximity: 'Urban',
    lat: 40.4406,
    lon: -80.0150,
    species: ['smallmouth-bass', 'channel-catfish', 'flathead-catfish', 'walleye', 'sauger'],
    accessPoints: [
      {
        name: 'Point State Park',
        lat: 40.4406,
        lon: -80.0150,
        amenities: ['Shore fishing', 'Parking', 'Historic site', 'Trails', 'Fountain'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    regulations: 'Check PA regulations, Urban fishing program',
    habitat: 'Where Allegheny, Monongahela, and Ohio Rivers meet. Excellent urban fishing location.',
    size: 'Multi-river system',
    maintenance: 'High',
    popularity: 8
  },

  // ============================================================================
  // HARRISBURG REGION - Capital Area
  // ============================================================================
  {
    id: 'yellow-breeches-creek',
    name: 'Yellow Breeches Creek',
    type: 'Stream',
    county: 'Cumberland',
    region: 'Harrisburg',
    urbanProximity: 'Suburban',
    lat: 40.2342,
    lon: -77.0264,
    species: ['brown-trout', 'rainbow-trout'],
    stockingSchedule: [
      { date: '2024-04-01', species: 'Brown Trout', quantity: 3000, size: 'Adult' },
      { date: '2024-04-10', species: 'Rainbow Trout', quantity: 2500, size: 'Adult' },
      { date: '2024-10-01', species: 'Brown Trout', quantity: 2000, size: 'Adult' }
    ],
    accessPoints: [
      {
        name: 'Allenberry Resort',
        lat: 40.2342,
        lon: -77.0264,
        amenities: ['Stream access', 'Parking', 'Resort facilities'],
        accessibility: 'Easy',
        parking: true
      },
      {
        name: 'Williams Grove',
        lat: 40.2100,
        lon: -77.0500,
        amenities: ['Stream access', 'Parking'],
        accessibility: 'Moderate',
        parking: true
      }
    ],
    regulations: 'Fly fishing only sections, Check special regulations',
    habitat: 'Limestone spring creek. One of PA\'s premier trout streams with wild and stocked fish.',
    size: '40 miles',
    maintenance: 'High',
    popularity: 10
  },
  {
    id: 'conodoguinet-creek',
    name: 'Conodoguinet Creek',
    type: 'Stream',
    county: 'Cumberland',
    region: 'Harrisburg',
    urbanProximity: 'Suburban',
    lat: 40.2789,
    lon: -77.2147,
    species: ['brown-trout', 'rainbow-trout', 'smallmouth-bass'],
    stockingSchedule: [
      { date: '2024-04-01', species: 'Rainbow Trout', quantity: 2000, size: 'Adult' }
    ],
    accessPoints: [
      {
        name: 'Messiah College Access',
        lat: 40.2789,
        lon: -77.2147,
        amenities: ['Stream access', 'Parking'],
        accessibility: 'Moderate',
        parking: true
      }
    ],
    regulations: 'Standard trout regulations',
    habitat: 'Freestone stream with good trout populations and smallmouth bass',
    size: '30 miles stocked',
    maintenance: 'High',
    popularity: 8
  },
  {
    id: 'pinchot-lake',
    name: 'Pinchot Lake (Gifford Pinchot State Park)',
    type: 'Lake',
    county: 'York',
    region: 'Harrisburg',
    urbanProximity: 'Suburban',
    lat: 40.0631,
    lon: -76.8622,
    species: ['largemouth-bass', 'smallmouth-bass', 'muskellunge', 'crappie', 'bluegill', 'channel-catfish'],
    stockingSchedule: [
      { date: '2024-05-01', species: 'Muskellunge', quantity: 200, size: 'Adult' }
    ],
    accessPoints: [
      {
        name: 'Gifford Pinchot State Park Marina',
        lat: 40.0631,
        lon: -76.8622,
        amenities: ['Boat launch', 'Boat rental', 'Camping', 'Swimming', 'Parking', 'Trails'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    regulations: 'Bass: 15" minimum, Muskie: 40" minimum',
    habitat: '340-acre lake with coves and structure. Popular family destination near Harrisburg.',
    size: '340 acres',
    maintenance: 'High',
    popularity: 9
  },
  {
    id: 'susquehanna-harrisburg',
    name: 'Susquehanna River (Harrisburg)',
    type: 'River',
    county: 'Dauphin',
    region: 'Harrisburg',
    urbanProximity: 'Urban',
    lat: 40.2632,
    lon: -76.8861,
    species: ['smallmouth-bass', 'muskellunge', 'walleye', 'channel-catfish', 'flathead-catfish'],
    accessPoints: [
      {
        name: 'City Island',
        lat: 40.2632,
        lon: -76.8861,
        amenities: ['Shore fishing', 'Boat launch', 'Parking', 'Recreation', 'Restrooms'],
        accessibility: 'Easy',
        parking: true
      },
      {
        name: 'Fort Hunter Park',
        lat: 40.3144,
        lon: -76.8511,
        amenities: ['Shore fishing', 'Parking', 'Historic site', 'Trails'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    regulations: 'Standard PA regulations, Check consumption advisories',
    habitat: 'Major river system with excellent smallmouth bass and muskie fishing. Urban access.',
    size: 'Major river',
    maintenance: 'High',
    popularity: 9
  },

  // ============================================================================
  // LEHIGH VALLEY REGION - Allentown/Bethlehem/Easton
  // ============================================================================
  {
    id: 'leaser-lake',
    name: 'Leaser Lake',
    type: 'Lake',
    county: 'Lehigh',
    region: 'Lehigh Valley',
    urbanProximity: 'Suburban',
    lat: 40.6425,
    lon: -75.6092,
    species: ['largemouth-bass', 'bluegill', 'crappie', 'channel-catfish'],
    accessPoints: [
      {
        name: 'Leaser Lake Park',
        lat: 40.6425,
        lon: -75.6092,
        amenities: ['Shore fishing', 'Parking', 'Trails', 'Picnic area'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    regulations: 'No boats, Shore fishing only',
    habitat: 'Popular urban lake for Lehigh County residents. Family-friendly.',
    size: '117 acres',
    maintenance: 'High',
    popularity: 8
  },
  {
    id: 'minsi-lake',
    name: 'Minsi Lake',
    type: 'Lake',
    county: 'Northampton',
    region: 'Lehigh Valley',
    urbanProximity: 'Suburban',
    lat: 40.7719,
    lon: -75.2494,
    species: ['largemouth-bass', 'crappie', 'bluegill', 'channel-catfish'],
    accessPoints: [
      {
        name: 'Minsi Lake Park',
        lat: 40.7719,
        lon: -75.2494,
        amenities: ['Shore fishing', 'Parking', 'Trails', 'Nature center'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    regulations: 'No boats, Shore fishing only',
    habitat: 'Small urban lake in Northampton County park system',
    size: '25 acres',
    maintenance: 'High',
    popularity: 7
  },
  {
    id: 'jordan-creek',
    name: 'Jordan Creek',
    type: 'Stream',
    county: 'Lehigh',
    region: 'Lehigh Valley',
    urbanProximity: 'Suburban',
    lat: 40.5939,
    lon: -75.5372,
    species: ['brown-trout', 'rainbow-trout'],
    stockingSchedule: [
      { date: '2024-04-01', species: 'Rainbow Trout', quantity: 2500, size: 'Adult' },
      { date: '2024-04-15', species: 'Brown Trout', quantity: 1000, size: 'Adult' }
    ],
    accessPoints: [
      {
        name: 'Trexlertown Access',
        lat: 40.5939,
        lon: -75.5372,
        amenities: ['Stream access', 'Parking'],
        accessibility: 'Moderate',
        parking: true
      }
    ],
    regulations: 'Standard trout regulations',
    habitat: 'Urban stream with good spring trout fishing near Allentown',
    size: '12 miles stocked',
    maintenance: 'High',
    popularity: 8
  },
  {
    id: 'ontelaunee-lake',
    name: 'Lake Ontelaunee',
    type: 'Lake',
    county: 'Berks',
    region: 'Lehigh Valley',
    urbanProximity: 'Suburban',
    lat: 40.5256,
    lon: -75.8078,
    species: ['largemouth-bass', 'smallmouth-bass', 'walleye', 'muskellunge', 'crappie', 'yellow-perch'],
    stockingSchedule: [
      { date: '2024-05-01', species: 'Walleye', quantity: 1500, size: 'Fingerling' }
    ],
    accessPoints: [
      {
        name: 'Ontelaunee Park',
        lat: 40.5256,
        lon: -75.8078,
        amenities: ['Boat launch', 'Parking', 'Trails'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    regulations: 'Bass: 15" minimum',
    habitat: '1,082-acre reservoir with diverse structure serving Lehigh Valley',
    size: '1,082 acres',
    maintenance: 'High',
    popularity: 9
  },

  // ============================================================================
  // ERIE REGION - Great Lakes
  // ============================================================================
  {
    id: 'lake-erie-presque-isle',
    name: 'Lake Erie (Presque Isle Bay)',
    type: 'Lake',
    county: 'Erie',
    region: 'Erie',
    urbanProximity: 'Urban',
    lat: 42.1275,
    lon: -80.0851,
    species: ['smallmouth-bass', 'walleye', 'yellow-perch', 'northern-pike', 'muskellunge', 'channel-catfish', 'steelhead'],
    stockingSchedule: [
      { date: '2024-04-15', species: 'Steelhead', quantity: 10000, size: 'Yearling' }
    ],
    accessPoints: [
      {
        name: 'Presque Isle State Park',
        lat: 42.1275,
        lon: -80.0851,
        amenities: ['Multiple launches', 'Parking', 'Beach', 'Trails', 'Visitor center', 'Marina'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    regulations: 'Check PA & Great Lakes regulations - Special seasons apply',
    habitat: 'World-class fishing for walleye and perch. Protected bay with weed beds and rocky structure.',
    size: '3,200 acres (Presque Isle Bay)',
    maintenance: 'High',
    popularity: 10
  },
  {
    id: 'elk-creek-erie',
    name: 'Elk Creek',
    type: 'Stream',
    county: 'Erie',
    region: 'Erie',
    urbanProximity: 'Suburban',
    lat: 42.0464,
    lon: -80.3719,
    species: ['steelhead', 'rainbow-trout', 'brown-trout', 'salmon'],
    stockingSchedule: [
      { date: '2024-04-01', species: 'Steelhead', quantity: 5000, size: 'Yearling' }
    ],
    accessPoints: [
      {
        name: 'Elk Creek Access Area',
        lat: 42.0464,
        lon: -80.3719,
        amenities: ['Stream access', 'Parking'],
        accessibility: 'Moderate',
        parking: true
      }
    ],
    regulations: 'Check Lake Erie tributary regulations, Special trout/salmon stamps',
    habitat: 'Premier steelhead stream flowing to Lake Erie. Fall and spring runs.',
    size: '30 miles',
    maintenance: 'High',
    popularity: 10
  },

  // ============================================================================
  // SCRANTON/WILKES-BARRE REGION - Northeast PA
  // ============================================================================
  {
    id: 'frances-slocum-lake',
    name: 'Frances Slocum Lake',
    type: 'Lake',
    county: 'Luzerne',
    region: 'Scranton',
    urbanProximity: 'Suburban',
    lat: 41.2681,
    lon: -75.9381,
    species: ['largemouth-bass', 'crappie', 'bluegill', 'channel-catfish'],
    accessPoints: [
      {
        name: 'Frances Slocum State Park',
        lat: 41.2681,
        lon: -75.9381,
        amenities: ['Boat launch', 'Camping', 'Swimming', 'Parking', 'Trails'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    regulations: 'Electric motors only, Bass: 12" minimum',
    habitat: '165-acre lake with lily pads and structure near Wilkes-Barre',
    size: '165 acres',
    maintenance: 'High',
    popularity: 8
  },
  {
    id: 'harveys-lake',
    name: 'Harveys Lake',
    type: 'Lake',
    county: 'Luzerne',
    region: 'Scranton',
    urbanProximity: 'Suburban',
    lat: 41.3569,
    lon: -76.0428,
    species: ['largemouth-bass', 'smallmouth-bass', 'walleye', 'yellow-perch', 'crappie', 'bluegill'],
    accessPoints: [
      {
        name: 'Public Access Area',
        lat: 41.3569,
        lon: -76.0428,
        amenities: ['Boat launch', 'Parking'],
        accessibility: 'Moderate',
        parking: true
      }
    ],
    regulations: 'Standard PA regulations',
    habitat: 'Largest natural lake entirely in PA. Deep water with diverse species. Popular destination.',
    size: '621 acres, 120 feet deep',
    maintenance: 'Medium',
    popularity: 9
  },
  {
    id: 'lake-wallenpaupack',
    name: 'Lake Wallenpaupack',
    type: 'Lake',
    county: 'Pike/Wayne',
    region: 'Scranton',
    urbanProximity: 'Rural',
    lat: 41.3500,
    lon: -75.1833,
    species: ['smallmouth-bass', 'largemouth-bass', 'walleye', 'yellow-perch', 'crappie', 'bluegill', 'channel-catfish'],
    stockingSchedule: [
      { date: '2024-05-10', species: 'Walleye', quantity: 3000, size: 'Fingerling' }
    ],
    accessPoints: [
      {
        name: 'Mangan\'s Boat Launch',
        lat: 41.3500,
        lon: -75.1833,
        amenities: ['Boat launch', 'Parking', 'Marina'],
        accessibility: 'Easy',
        parking: true
      },
      {
        name: 'Ironwood Point',
        lat: 41.3400,
        lon: -75.1900,
        amenities: ['Boat launch', 'Parking', 'Camping'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    regulations: 'Bass: 12" minimum, No size limits on panfish',
    habitat: '5,700-acre reservoir with rocky shorelines, submerged timber, and deep basins. Premier destination.',
    size: '5,700 acres, 52 miles of shoreline',
    maintenance: 'High',
    popularity: 10
  },
  {
    id: 'lake-sheridan',
    name: 'Lake Sheridan',
    type: 'Lake',
    county: 'Lackawanna',
    region: 'Scranton',
    urbanProximity: 'Urban',
    lat: 41.4506,
    lon: -75.6661,
    species: ['largemouth-bass', 'crappie', 'bluegill', 'channel-catfish'],
    accessPoints: [
      {
        name: 'Merli-Sarnoski Park',
        lat: 41.4506,
        lon: -75.6661,
        amenities: ['Boat launch', 'Parking', 'Trails', 'Picnic area'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    regulations: 'Electric motors only',
    habitat: 'Popular urban lake near Scranton with good shore access',
    size: '45 acres',
    maintenance: 'High',
    popularity: 7
  },

  // ============================================================================
  // READING REGION - Berks County
  // ============================================================================
  {
    id: 'blue-marsh-lake',
    name: 'Blue Marsh Lake',
    type: 'Lake',
    county: 'Berks',
    region: 'Reading',
    urbanProximity: 'Suburban',
    lat: 40.3758,
    lon: -75.9244,
    species: ['largemouth-bass', 'smallmouth-bass', 'striped-bass', 'muskellunge', 'walleye', 'crappie', 'channel-catfish'],
    stockingSchedule: [
      { date: '2024-05-01', species: 'Muskellunge', quantity: 400, size: 'Adult' },
      { date: '2024-05-15', species: 'Striped Bass', quantity: 3000, size: 'Fingerling' }
    ],
    accessPoints: [
      {
        name: 'Dry Brooks Day Use Area',
        lat: 40.3758,
        lon: -75.9244,
        amenities: ['Boat launch', 'Parking', 'Beach', 'Trails'],
        accessibility: 'Easy',
        parking: true
      },
      {
        name: 'Stilling Basin',
        lat: 40.3650,
        lon: -75.9150,
        amenities: ['Boat launch', 'Parking'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    regulations: 'Bass: 15" minimum, Muskie: 40" minimum, Striped Bass: 20" minimum',
    habitat: '1,147-acre federal reservoir with diverse structure. Excellent multi-species fishery near Reading.',
    size: '1,147 acres',
    maintenance: 'High',
    popularity: 10
  },
  {
    id: 'antietam-lake',
    name: 'Antietam Lake',
    type: 'Lake',
    county: 'Berks',
    region: 'Reading',
    urbanProximity: 'Suburban',
    lat: 40.4267,
    lon: -75.9767,
    species: ['largemouth-bass', 'crappie', 'bluegill', 'channel-catfish'],
    accessPoints: [
      {
        name: 'Antietam Lake Park',
        lat: 40.4267,
        lon: -75.9767,
        amenities: ['Boat launch', 'Parking', 'Trails', 'Picnic area'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    regulations: 'Electric motors only',
    habitat: 'Popular family fishing destination near Reading with good shore access',
    size: '85 acres',
    maintenance: 'High',
    popularity: 8
  },
  {
    id: 'tulpehocken-creek',
    name: 'Tulpehocken Creek',
    type: 'Stream',
    county: 'Berks',
    region: 'Reading',
    urbanProximity: 'Suburban',
    lat: 40.4000,
    lon: -76.0500,
    species: ['brown-trout', 'rainbow-trout', 'smallmouth-bass'],
    stockingSchedule: [
      { date: '2024-04-01', species: 'Rainbow Trout', quantity: 3000, size: 'Adult' },
      { date: '2024-04-10', species: 'Brown Trout', quantity: 1500, size: 'Adult' },
      { date: '2024-10-01', species: 'Brown Trout', quantity: 1000, size: 'Adult' }
    ],
    accessPoints: [
      {
        name: 'Blue Marsh Dam Tailwaters',
        lat: 40.4000,
        lon: -76.0500,
        amenities: ['Stream access', 'Parking'],
        accessibility: 'Moderate',
        parking: true
      }
    ],
    regulations: 'Check special regulations below Blue Marsh Dam',
    habitat: 'Excellent trout stream with cold water releases from Blue Marsh Dam',
    size: '25 miles',
    maintenance: 'High',
    popularity: 9
  },

  // ============================================================================
  // LANCASTER/YORK REGION - South Central PA
  // ============================================================================
  {
    id: 'lake-marburg',
    name: 'Lake Marburg (Codorus State Park)',
    type: 'Lake',
    county: 'York',
    region: 'Lancaster',
    urbanProximity: 'Suburban',
    lat: 39.8142,
    lon: -76.8472,
    species: ['largemouth-bass', 'smallmouth-bass', 'muskellunge', 'crappie', 'bluegill', 'channel-catfish'],
    stockingSchedule: [
      { date: '2024-05-01', species: 'Muskellunge', quantity: 300, size: 'Adult' }
    ],
    accessPoints: [
      {
        name: 'Marina',
        lat: 39.8142,
        lon: -76.8472,
        amenities: ['Boat launch', 'Marina', 'Boat rental', 'Camping', 'Swimming', 'Parking'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    regulations: 'Bass: 15" minimum, Muskie: 40" minimum',
    habitat: '1,275-acre lake with coves and points. Premier bass and muskie destination near York.',
    size: '1,275 acres, 26 miles of shoreline',
    maintenance: 'High',
    popularity: 10
  },
  {
    id: 'muddy-run',
    name: 'Muddy Run Reservoir',
    type: 'Lake',
    county: 'Lancaster',
    region: 'Lancaster',
    urbanProximity: 'Rural',
    lat: 39.8244,
    lon: -76.3069,
    species: ['striped-bass', 'hybrid-striped-bass', 'walleye', 'largemouth-bass', 'crappie', 'channel-catfish'],
    stockingSchedule: [
      { date: '2024-05-01', species: 'Striped Bass', quantity: 5000, size: 'Fingerling' }
    ],
    accessPoints: [
      {
        name: 'Muddy Run Park',
        lat: 39.8244,
        lon: -76.3069,
        amenities: ['Boat launch', 'Parking', 'Trails'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    regulations: 'Striped Bass: 20" minimum, Hybrid: 15" minimum',
    habitat: '100-acre reservoir known for striped bass fishing near Lancaster',
    size: '100 acres',
    maintenance: 'High',
    popularity: 8
  },
  {
    id: 'conestoga-river',
    name: 'Conestoga River',
    type: 'River',
    county: 'Lancaster',
    region: 'Lancaster',
    urbanProximity: 'Suburban',
    lat: 40.0447,
    lon: -76.3050,
    species: ['smallmouth-bass', 'channel-catfish', 'carp'],
    accessPoints: [
      {
        name: 'Lancaster County Park',
        lat: 40.0447,
        lon: -76.3050,
        amenities: ['Shore fishing', 'Parking', 'Trails', 'Playground'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    regulations: 'Standard PA regulations',
    habitat: 'Warm water stream with good smallmouth bass populations in Lancaster County',
    size: '60 miles',
    maintenance: 'Medium',
    popularity: 7
  },

  // ============================================================================
  // CENTRAL PA REGION - State College Area
  // ============================================================================
  {
    id: 'penns-creek',
    name: 'Penns Creek',
    type: 'Stream',
    county: 'Centre/Snyder',
    region: 'Central',
    urbanProximity: 'Rural',
    lat: 40.8670,
    lon: -77.4167,
    species: ['brown-trout', 'rainbow-trout', 'smallmouth-bass'],
    stockingSchedule: [
      { date: '2024-04-05', species: 'Brown Trout', quantity: 1500, size: 'Adult' }
    ],
    accessPoints: [
      {
        name: 'Coburn Access',
        lat: 40.8670,
        lon: -77.4167,
        amenities: ['Parking', 'Stream access'],
        accessibility: 'Moderate',
        parking: true
      },
      {
        name: 'Weikert Access',
        lat: 40.8800,
        lon: -77.3500,
        amenities: ['Parking', 'Stream access', 'Camping'],
        accessibility: 'Moderate',
        parking: true
      }
    ],
    regulations: 'Trophy trout section - Special regulations',
    habitat: 'Freestone stream with excellent insect hatches. One of PA\'s premier wild trout streams.',
    size: '67 miles',
    maintenance: 'Medium',
    popularity: 10
  },
  {
    id: 'spring-creek',
    name: 'Spring Creek',
    type: 'Stream',
    county: 'Centre',
    region: 'Central',
    urbanProximity: 'Urban',
    lat: 40.7981,
    lon: -77.8600,
    species: ['brown-trout', 'rainbow-trout'],
    stockingSchedule: [
      { date: '2024-04-01', species: 'Rainbow Trout', quantity: 2000, size: 'Adult' }
    ],
    accessPoints: [
      {
        name: 'Fisherman\'s Paradise',
        lat: 40.7981,
        lon: -77.8600,
        amenities: ['Stream access', 'Parking', 'Visitor center', 'Accessible fishing', 'Restrooms'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    regulations: 'All-tackle trophy trout section, Special regulations',
    habitat: 'Limestone spring creek running through State College. Famous all-tackle trophy section.',
    size: '35 miles',
    maintenance: 'High',
    popularity: 10
  },
  {
    id: 'raystown-lake',
    name: 'Raystown Lake',
    type: 'Lake',
    county: 'Huntingdon',
    region: 'Central',
    urbanProximity: 'Rural',
    lat: 40.4167,
    lon: -78.0833,
    species: ['smallmouth-bass', 'largemouth-bass', 'walleye', 'muskellunge', 'striped-bass', 'channel-catfish'],
    stockingSchedule: [
      { date: '2024-05-15', species: 'Walleye', quantity: 5000, size: 'Fingerling' },
      { date: '2024-06-01', species: 'Muskellunge', quantity: 500, size: 'Adult' }
    ],
    accessPoints: [
      {
        name: 'Seven Points Marina',
        lat: 40.4167,
        lon: -78.0833,
        amenities: ['Boat launch', 'Parking', 'Marina', 'Restrooms', 'Picnic area'],
        accessibility: 'Easy',
        parking: true
      },
      {
        name: 'Susquehannock Campground',
        lat: 40.4200,
        lon: -78.0900,
        amenities: ['Boat launch', 'Camping', 'Swimming', 'Parking'],
        accessibility: 'Moderate',
        parking: true
      },
      {
        name: 'James Creek',
        lat: 40.3800,
        lon: -78.1200,
        amenities: ['Boat launch', 'Parking'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    regulations: 'Bass: 15" minimum, Walleye: 18" minimum, Muskie: 40" minimum',
    habitat: '8,300-acre reservoir with rocky points, coves, and deep channels. PA\'s largest lake with exceptional multi-species fishing.',
    size: '8,300 acres, 30 miles long, 200 feet deep',
    maintenance: 'High',
    popularity: 10
  }
];

// Summary statistics
export const WATER_BODIES_STATS = {
  total: PA_WATER_BODIES_EXPANDED.length,
  byRegion: {
    'Philadelphia': PA_WATER_BODIES_EXPANDED.filter(w => w.region === 'Philadelphia').length,
    'Pittsburgh': PA_WATER_BODIES_EXPANDED.filter(w => w.region === 'Pittsburgh').length,
    'Harrisburg': PA_WATER_BODIES_EXPANDED.filter(w => w.region === 'Harrisburg').length,
    'Lehigh Valley': PA_WATER_BODIES_EXPANDED.filter(w => w.region === 'Lehigh Valley').length,
    'Erie': PA_WATER_BODIES_EXPANDED.filter(w => w.region === 'Erie').length,
    'Scranton': PA_WATER_BODIES_EXPANDED.filter(w => w.region === 'Scranton').length,
    'Reading': PA_WATER_BODIES_EXPANDED.filter(w => w.region === 'Reading').length,
    'Lancaster': PA_WATER_BODIES_EXPANDED.filter(w => w.region === 'Lancaster').length,
    'Central': PA_WATER_BODIES_EXPANDED.filter(w => w.region === 'Central').length,
  },
  byType: {
    'Lake': PA_WATER_BODIES_EXPANDED.filter(w => w.type === 'Lake').length,
    'Stream': PA_WATER_BODIES_EXPANDED.filter(w => w.type === 'Stream').length,
    'River': PA_WATER_BODIES_EXPANDED.filter(w => w.type === 'River').length,
  },
  highMaintenanceCount: PA_WATER_BODIES_EXPANDED.filter(w => w.maintenance === 'High').length,
  urbanAccessCount: PA_WATER_BODIES_EXPANDED.filter(w => w.urbanProximity === 'Urban' || w.urbanProximity === 'Suburban').length,
};

