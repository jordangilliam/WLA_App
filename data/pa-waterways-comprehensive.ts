/**
 * Comprehensive Pennsylvania Waterways Database
 * Includes lakes, streams, creeks with seasonal considerations
 * and macroinvertebrate hatch data
 */

export interface Waterway {
  id: string;
  name: string;
  type: 'Lake' | 'Stream' | 'Creek' | 'River' | 'Pond' | 'Reservoir';
  county: string;
  region: string;
  latitude: number;
  longitude: number;
  size?: string;
  description: string;
  species: string[];
  seasonalData: SeasonalData;
  hatches: MacroinvertebrateHatch[];
  accessPoints: AccessPoint[];
  regulations?: string;
}

export interface SeasonalData {
  bestSeasons: ('spring' | 'summer' | 'fall' | 'winter')[];
  springNotes?: string;
  summerNotes?: string;
  fallNotes?: string;
  winterNotes?: string;
  iceFishing?: boolean;
  springStocking?: boolean;
  fallStocking?: boolean;
  waterTemperature?: {
    spring: number;
    summer: number;
    fall: number;
    winter: number;
  };
}

export interface MacroinvertebrateHatch {
  species: string;
  commonName: string;
  hatchPeriod: {
    start: string; // Month name
    end: string;
    peak: string;
  };
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' | 'all-day';
  waterTemperature: {
    min: number;
    optimal: number;
    max: number;
  };
  waterType: ('limestone' | 'freestone' | 'spring-fed' | 'tailwater')[];
  size: string; // Hook size
  color: string;
  notes?: string;
}

export interface AccessPoint {
  name: string;
  latitude: number;
  longitude: number;
  type: 'boat-launch' | 'shore-access' | 'wade-access' | 'fly-fishing-only';
  amenities: string[];
  parking: boolean;
  wheelchairAccessible?: boolean;
}

// Macroinvertebrate hatch data by region
const MACROINVERTEBRATE_HATCHES: Record<string, MacroinvertebrateHatch[]> = {
  limestone: [
    {
      species: 'Ephemerella subvaria',
      commonName: 'Hendrickson',
      hatchPeriod: { start: 'April', end: 'May', peak: 'Late April' },
      timeOfDay: 'afternoon',
      waterTemperature: { min: 48, optimal: 52, max: 56 },
      waterType: ['limestone', 'spring-fed'],
      size: '#12-#14',
      color: 'Dark brown body, gray wings',
      notes: 'One of the first major hatches of spring',
    },
    {
      species: 'Ephemerella invaria',
      commonName: 'Sulphur',
      hatchPeriod: { start: 'May', end: 'June', peak: 'Late May' },
      timeOfDay: 'evening',
      waterTemperature: { min: 55, optimal: 60, max: 65 },
      waterType: ['limestone', 'spring-fed'],
      size: '#16-#18',
      color: 'Yellow body, pale yellow wings',
    },
    {
      species: 'Tricorythodes',
      commonName: 'Trico',
      hatchPeriod: { start: 'July', end: 'October', peak: 'August-September' },
      timeOfDay: 'morning',
      waterTemperature: { min: 60, optimal: 65, max: 70 },
      waterType: ['limestone', 'spring-fed'],
      size: '#20-#24',
      color: 'Dark body, clear wings',
      notes: 'Early morning hatch, very small',
    },
  ],
  freestone: [
    {
      species: 'Brachycentrus',
      commonName: 'Grannom',
      hatchPeriod: { start: 'April', end: 'May', peak: 'Mid-April' },
      timeOfDay: 'afternoon',
      waterTemperature: { min: 50, optimal: 54, max: 58 },
      waterType: ['freestone'],
      size: '#14-#16',
      color: 'Olive body, gray wings',
    },
    {
      species: 'Ephemerella dorothea',
      commonName: 'March Brown',
      hatchPeriod: { start: 'March', end: 'April', peak: 'Late March' },
      timeOfDay: 'afternoon',
      waterTemperature: { min: 45, optimal: 50, max: 55 },
      waterType: ['freestone'],
      size: '#12-#14',
      color: 'Brown body, mottled wings',
    },
    {
      species: 'Isonychia',
      commonName: 'Isonychia',
      hatchPeriod: { start: 'May', end: 'July', peak: 'June' },
      timeOfDay: 'evening',
      waterTemperature: { min: 58, optimal: 62, max: 68 },
      waterType: ['freestone'],
      size: '#10-#12',
      color: 'Dark brown body, dark wings',
    },
  ],
  tailwater: [
    {
      species: 'Baetis',
      commonName: 'Blue-Winged Olive',
      hatchPeriod: { start: 'March', end: 'November', peak: 'April, October' },
      timeOfDay: 'afternoon',
      waterTemperature: { min: 45, optimal: 55, max: 65 },
      waterType: ['tailwater', 'limestone'],
      size: '#16-#20',
      color: 'Olive body, gray-blue wings',
      notes: 'Year-round hatch in tailwaters',
    },
    {
      species: 'Pseudocloeon',
      commonName: 'Tiny Blue-Winged Olive',
      hatchPeriod: { start: 'April', end: 'October', peak: 'May-September' },
      timeOfDay: 'afternoon',
      waterTemperature: { min: 50, optimal: 60, max: 70 },
      waterType: ['tailwater'],
      size: '#20-#24',
      color: 'Olive body, blue-gray wings',
    },
  ],
};

// Comprehensive PA waterways database
export const PA_WATERWAYS_COMPREHENSIVE: Waterway[] = [
  // ============================================================================
  // LIMESTONE SPRING CREEKS (Central PA)
  // ============================================================================
  {
    id: 'spring-creek',
    name: 'Spring Creek',
    type: 'Creek',
    county: 'Centre',
    region: 'Central',
    latitude: 40.7981,
    longitude: -77.8600,
    size: '35 miles',
    description: 'Famous limestone spring creek running through State College. All-tackle trophy section. Year-round fishing.',
    species: ['Brown Trout', 'Rainbow Trout'],
    seasonalData: {
      bestSeasons: ['spring', 'fall', 'winter'],
      springNotes: 'Excellent Hendrickson and Sulphur hatches. Spring stocking in March-April.',
      summerNotes: 'Trico hatches in early morning. Water stays cool year-round.',
      fallNotes: 'Blue-Winged Olive hatches. Fall stocking in October.',
      winterNotes: 'Year-round fishing. Midge hatches throughout winter.',
      springStocking: true,
      fallStocking: true,
      waterTemperature: {
        spring: 52,
        summer: 58,
        fall: 55,
        winter: 45,
      },
    },
    hatches: [
      ...MACROINVERTEBRATE_HATCHES.limestone,
      {
        species: 'Chironomidae',
        commonName: 'Midges',
        hatchPeriod: { start: 'January', end: 'December', peak: 'Year-round' },
        timeOfDay: 'all-day',
        waterTemperature: { min: 35, optimal: 50, max: 65 },
        waterType: ['limestone', 'spring-fed'],
        size: '#18-#24',
        color: 'Black, olive, or cream',
        notes: 'Year-round hatch, especially important in winter',
      },
    ],
    accessPoints: [
      {
        name: "Fisherman's Paradise",
        latitude: 40.7981,
        longitude: -77.8600,
        type: 'fly-fishing-only',
        amenities: ['Parking', 'Restrooms', 'Wheelchair Accessible', 'Visitor Center'],
        parking: true,
        wheelchairAccessible: true,
      },
    ],
    regulations: 'All-tackle trophy trout section. Special regulations apply.',
  },
  {
    id: 'yellow-breeches',
    name: 'Yellow Breeches Creek',
    type: 'Creek',
    county: 'Cumberland',
    region: 'Harrisburg',
    latitude: 40.2342,
    longitude: -77.0264,
    size: '60 miles',
    description: 'Premier limestone spring creek. One of PA best trout streams with wild and stocked fish.',
    species: ['Brown Trout', 'Rainbow Trout', 'Brook Trout'],
    seasonalData: {
      bestSeasons: ['spring', 'fall'],
      springNotes: 'Hendrickson hatch in late April. Excellent spring fishing.',
      fallNotes: 'Fall stocking and Blue-Winged Olive hatches.',
      springStocking: true,
      fallStocking: true,
      waterTemperature: {
        spring: 50,
        summer: 60,
        fall: 55,
        winter: 42,
      },
    },
    hatches: MACROINVERTEBRATE_HATCHES.limestone,
    accessPoints: [
      {
        name: 'Allenberry Resort',
        latitude: 40.2342,
        longitude: -77.0264,
        type: 'wade-access',
        amenities: ['Parking', 'Resort Facilities'],
        parking: true,
      },
    ],
    regulations: 'Fly fishing only sections. Check special regulations.',
  },
  {
    id: 'big-spring-creek',
    name: 'Big Spring Creek',
    type: 'Creek',
    county: 'Cumberland',
    region: 'Harrisburg',
    latitude: 40.1500,
    longitude: -77.2000,
    size: '8 miles',
    description: 'Small but productive limestone spring creek. Trophy trout section.',
    species: ['Brown Trout', 'Rainbow Trout'],
    seasonalData: {
      bestSeasons: ['spring', 'fall'],
      springNotes: 'Early season Hendrickson hatch.',
      fallNotes: 'Fall stocking and hatches.',
      springStocking: true,
      fallStocking: true,
    },
    hatches: MACROINVERTEBRATE_HATCHES.limestone,
    accessPoints: [
      {
        name: 'Big Spring Access',
        latitude: 40.1500,
        longitude: -77.2000,
        type: 'wade-access',
        amenities: ['Parking'],
        parking: true,
      },
    ],
    regulations: 'Trophy trout regulations. Special section.',
  },

  // ============================================================================
  // FREESTONE STREAMS (Statewide)
  // ============================================================================
  {
    id: 'penns-creek',
    name: 'Penns Creek',
    type: 'Stream',
    county: 'Centre/Snyder',
    region: 'Central',
    latitude: 40.8670,
    longitude: -77.4167,
    size: '67 miles',
    description: 'Freestone stream with excellent insect hatches. One of PA premier wild trout streams.',
    species: ['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass'],
    seasonalData: {
      bestSeasons: ['spring', 'summer', 'fall'],
      springNotes: 'Grannom hatch in mid-April. March Brown in late March.',
      summerNotes: 'Isonychia hatch in June. Excellent dry fly fishing.',
      fallNotes: 'Fall colors and good fishing.',
      springStocking: true,
      waterTemperature: {
        spring: 48,
        summer: 65,
        fall: 55,
        winter: 38,
      },
    },
    hatches: MACROINVERTEBRATE_HATCHES.freestone,
    accessPoints: [
      {
        name: 'Coburn Access',
        latitude: 40.8670,
        longitude: -77.4167,
        type: 'wade-access',
        amenities: ['Parking'],
        parking: true,
      },
    ],
    regulations: 'Trophy trout section. Special regulations.',
  },
  {
    id: 'loyalsock-creek',
    name: 'Loyalsock Creek',
    type: 'Creek',
    county: 'Lycoming',
    region: 'Central',
    latitude: 41.2500,
    longitude: -76.8000,
    size: '64 miles',
    description: 'Scenic mountain stream with quality trout and bass fishing.',
    species: ['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass'],
    seasonalData: {
      bestSeasons: ['spring', 'summer'],
      springNotes: 'Spring stocking and hatches.',
      summerNotes: 'Good bass fishing in lower sections.',
      springStocking: true,
    },
    hatches: MACROINVERTEBRATE_HATCHES.freestone,
    accessPoints: [
      {
        name: 'Loyalsock Access',
        latitude: 41.2500,
        longitude: -76.8000,
        type: 'wade-access',
        amenities: ['Parking'],
        parking: true,
      },
    ],
    regulations: 'Delayed harvest and trophy trout sections.',
  },
  {
    id: 'pine-creek',
    name: 'Pine Creek',
    type: 'Creek',
    county: 'Tioga',
    region: 'Central',
    latitude: 41.7000,
    longitude: -77.4000,
    size: '87 miles',
    description: 'Pennsylvania Grand Canyon stream with diverse fishing opportunities.',
    species: ['Brook Trout', 'Brown Trout', 'Smallmouth Bass'],
    seasonalData: {
      bestSeasons: ['spring', 'summer', 'fall'],
      springNotes: 'Brook trout in headwaters. Spring stocking.',
      summerNotes: 'Bass fishing in lower sections.',
      fallNotes: 'Fall colors make this a beautiful time to fish.',
      springStocking: true,
    },
    hatches: MACROINVERTEBRATE_HATCHES.freestone,
    accessPoints: [
      {
        name: 'Leonard Harrison State Park',
        latitude: 41.7000,
        longitude: -77.4000,
        type: 'wade-access',
        amenities: ['Parking', 'Overlook', 'Trails', 'Visitor Center'],
        parking: true,
      },
    ],
    regulations: 'Varies by section - check current regulations.',
  },

  // ============================================================================
  // TAILWATER STREAMS
  // ============================================================================
  {
    id: 'tulpehocken-creek',
    name: 'Tulpehocken Creek',
    type: 'Creek',
    county: 'Berks',
    region: 'Reading',
    latitude: 40.4000,
    longitude: -76.0500,
    size: '25 miles',
    description: 'Excellent trout stream with cold water releases from Blue Marsh Dam.',
    species: ['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass'],
    seasonalData: {
      bestSeasons: ['spring', 'summer', 'fall', 'winter'],
      springNotes: 'Year-round fishing due to cold water releases.',
      summerNotes: 'Stays cool even in summer. Excellent fishing.',
      fallNotes: 'Fall stocking and hatches.',
      winterNotes: 'Year-round fishing possible.',
      springStocking: true,
      fallStocking: true,
      waterTemperature: {
        spring: 48,
        summer: 52,
        fall: 50,
        winter: 45,
      },
    },
    hatches: MACROINVERTEBRATE_HATCHES.tailwater,
    accessPoints: [
      {
        name: 'Blue Marsh Dam Tailwaters',
        latitude: 40.4000,
        longitude: -76.0500,
        type: 'wade-access',
        amenities: ['Parking'],
        parking: true,
      },
    ],
    regulations: 'Check special regulations below Blue Marsh Dam.',
  },

  // ============================================================================
  // MAJOR LAKES (Statewide)
  // ============================================================================
  {
    id: 'raystown-lake',
    name: 'Raystown Lake',
    type: 'Lake',
    county: 'Huntingdon',
    region: 'Central',
    latitude: 40.4167,
    longitude: -78.0833,
    size: '8,300 acres',
    description: 'PA largest lake with exceptional multi-species fishing. 30 miles long, 200 feet deep.',
    species: ['Smallmouth Bass', 'Largemouth Bass', 'Walleye', 'Muskellunge', 'Striped Bass', 'Channel Catfish'],
    seasonalData: {
      bestSeasons: ['spring', 'summer', 'fall'],
      springNotes: 'Excellent bass fishing. Walleye spawn in April.',
      summerNotes: 'Deep water fishing for bass and walleye. Topwater action.',
      fallNotes: 'Excellent fall fishing. Muskie season peaks.',
      winterNotes: 'Ice fishing possible in coves.',
      iceFishing: true,
      waterTemperature: {
        spring: 55,
        summer: 75,
        fall: 65,
        winter: 40,
      },
    },
    hatches: [], // Lakes have different insect patterns
    accessPoints: [
      {
        name: 'Seven Points Marina',
        latitude: 40.4167,
        longitude: -78.0833,
        type: 'boat-launch',
        amenities: ['Boat Launch', 'Marina', 'Restrooms', 'Picnic Area'],
        parking: true,
      },
    ],
    regulations: 'Bass: 15" minimum, Walleye: 18" minimum, Muskie: 40" minimum',
  },
  {
    id: 'lake-erie',
    name: 'Lake Erie - Presque Isle Bay',
    type: 'Lake',
    county: 'Erie',
    region: 'Erie',
    latitude: 42.1275,
    longitude: -80.0851,
    size: '3,200 acres (bay)',
    description: 'World-class fishing for walleye and perch with protected bay habitat.',
    species: ['Smallmouth Bass', 'Walleye', 'Yellow Perch', 'Northern Pike', 'Muskellunge', 'Channel Catfish', 'Steelhead'],
    seasonalData: {
      bestSeasons: ['spring', 'summer', 'fall'],
      springNotes: 'Walleye spawn in April. Excellent spring fishing.',
      summerNotes: 'Perch fishing peaks. Smallmouth bass active.',
      fallNotes: 'Steelhead runs begin. Excellent fall fishing.',
      winterNotes: 'Ice fishing for perch and walleye.',
      iceFishing: true,
      waterTemperature: {
        spring: 45,
        summer: 70,
        fall: 60,
        winter: 35,
      },
    },
    hatches: [],
    accessPoints: [
      {
        name: 'Presque Isle State Park',
        latitude: 42.1275,
        longitude: -80.0851,
        type: 'boat-launch',
        amenities: ['Multiple Launches', 'Parking', 'Beach', 'Trails', 'Visitor Center', 'Marina'],
        parking: true,
      },
    ],
    regulations: 'Check PA & Great Lakes regulations - Special seasons apply',
  },
  {
    id: 'lake-wallenpaupack',
    name: 'Lake Wallenpaupack',
    type: 'Reservoir',
    county: 'Pike/Wayne',
    region: 'Scranton',
    latitude: 41.3500,
    longitude: -75.1833,
    size: '5,700 acres',
    description: 'Large reservoir with rocky shorelines, submerged timber, and deep basins.',
    species: ['Smallmouth Bass', 'Largemouth Bass', 'Walleye', 'Yellow Perch', 'Crappie', 'Bluegill', 'Channel Catfish'],
    seasonalData: {
      bestSeasons: ['spring', 'summer', 'fall'],
      springNotes: 'Bass spawn in May. Excellent spring fishing.',
      summerNotes: 'Deep water fishing. Topwater action early and late.',
      fallNotes: 'Fall colors and good fishing.',
      winterNotes: 'Ice fishing possible.',
      iceFishing: true,
    },
    hatches: [],
    accessPoints: [
      {
        name: "Mangan's Boat Launch",
        latitude: 41.3500,
        longitude: -75.1833,
        type: 'boat-launch',
        amenities: ['Boat Launch', 'Parking', 'Marina'],
        parking: true,
      },
    ],
    regulations: 'Bass: 12" minimum, No size limits on panfish',
  },

  // Add more waterways...
];

// Export hatch data separately for easy reference
export const MACROINVERTEBRATE_HATCH_DATA = MACROINVERTEBRATE_HATCHES;

// Seasonal hatch calendar by month
export const SEASONAL_HATCH_CALENDAR: Record<string, MacroinvertebrateHatch[]> = {
  January: [
    { species: 'Chironomidae', commonName: 'Midges', hatchPeriod: { start: 'January', end: 'December', peak: 'Year-round' }, timeOfDay: 'all-day', waterTemperature: { min: 35, optimal: 50, max: 65 }, waterType: ['limestone', 'spring-fed'], size: '#18-#24', color: 'Black, olive, or cream' },
  ],
  February: [
    { species: 'Chironomidae', commonName: 'Midges', hatchPeriod: { start: 'January', end: 'December', peak: 'Year-round' }, timeOfDay: 'all-day', waterTemperature: { min: 35, optimal: 50, max: 65 }, waterType: ['limestone', 'spring-fed'], size: '#18-#24', color: 'Black, olive, or cream' },
  ],
  March: [
    { species: 'Baetis', commonName: 'Blue-Winged Olive', hatchPeriod: { start: 'March', end: 'November', peak: 'April, October' }, timeOfDay: 'afternoon', waterTemperature: { min: 45, optimal: 55, max: 65 }, waterType: ['tailwater', 'limestone'], size: '#16-#20', color: 'Olive body, gray-blue wings' },
    { species: 'Ephemerella dorothea', commonName: 'March Brown', hatchPeriod: { start: 'March', end: 'April', peak: 'Late March' }, timeOfDay: 'afternoon', waterTemperature: { min: 45, optimal: 50, max: 55 }, waterType: ['freestone'], size: '#12-#14', color: 'Brown body, mottled wings' },
  ],
  April: [
    { species: 'Ephemerella subvaria', commonName: 'Hendrickson', hatchPeriod: { start: 'April', end: 'May', peak: 'Late April' }, timeOfDay: 'afternoon', waterTemperature: { min: 48, optimal: 52, max: 56 }, waterType: ['limestone', 'spring-fed'], size: '#12-#14', color: 'Dark brown body, gray wings' },
    { species: 'Brachycentrus', commonName: 'Grannom', hatchPeriod: { start: 'April', end: 'May', peak: 'Mid-April' }, timeOfDay: 'afternoon', waterTemperature: { min: 50, optimal: 54, max: 58 }, waterType: ['freestone'], size: '#14-#16', color: 'Olive body, gray wings' },
  ],
  May: [
    { species: 'Ephemerella invaria', commonName: 'Sulphur', hatchPeriod: { start: 'May', end: 'June', peak: 'Late May' }, timeOfDay: 'evening', waterTemperature: { min: 55, optimal: 60, max: 65 }, waterType: ['limestone', 'spring-fed'], size: '#16-#18', color: 'Yellow body, pale yellow wings' },
    { species: 'Isonychia', commonName: 'Isonychia', hatchPeriod: { start: 'May', end: 'July', peak: 'June' }, timeOfDay: 'evening', waterTemperature: { min: 58, optimal: 62, max: 68 }, waterType: ['freestone'], size: '#10-#12', color: 'Dark brown body, dark wings' },
  ],
  June: [
    { species: 'Isonychia', commonName: 'Isonychia', hatchPeriod: { start: 'May', end: 'July', peak: 'June' }, timeOfDay: 'evening', waterTemperature: { min: 58, optimal: 62, max: 68 }, waterType: ['freestone'], size: '#10-#12', color: 'Dark brown body, dark wings' },
  ],
  July: [
    { species: 'Tricorythodes', commonName: 'Trico', hatchPeriod: { start: 'July', end: 'October', peak: 'August-September' }, timeOfDay: 'morning', waterTemperature: { min: 60, optimal: 65, max: 70 }, waterType: ['limestone', 'spring-fed'], size: '#20-#24', color: 'Dark body, clear wings' },
  ],
  August: [
    { species: 'Tricorythodes', commonName: 'Trico', hatchPeriod: { start: 'July', end: 'October', peak: 'August-September' }, timeOfDay: 'morning', waterTemperature: { min: 60, optimal: 65, max: 70 }, waterType: ['limestone', 'spring-fed'], size: '#20-#24', color: 'Dark body, clear wings' },
  ],
  September: [
    { species: 'Tricorythodes', commonName: 'Trico', hatchPeriod: { start: 'July', end: 'October', peak: 'August-September' }, timeOfDay: 'morning', waterTemperature: { min: 60, optimal: 65, max: 70 }, waterType: ['limestone', 'spring-fed'], size: '#20-#24', color: 'Dark body, clear wings' },
  ],
  October: [
    { species: 'Baetis', commonName: 'Blue-Winged Olive', hatchPeriod: { start: 'March', end: 'November', peak: 'April, October' }, timeOfDay: 'afternoon', waterTemperature: { min: 45, optimal: 55, max: 65 }, waterType: ['tailwater', 'limestone'], size: '#16-#20', color: 'Olive body, gray-blue wings' },
  ],
  November: [
    { species: 'Baetis', commonName: 'Blue-Winged Olive', hatchPeriod: { start: 'March', end: 'November', peak: 'April, October' }, timeOfDay: 'afternoon', waterTemperature: { min: 45, optimal: 55, max: 65 }, waterType: ['tailwater', 'limestone'], size: '#16-#20', color: 'Olive body, gray-blue wings' },
  ],
  December: [
    { species: 'Chironomidae', commonName: 'Midges', hatchPeriod: { start: 'January', end: 'December', peak: 'Year-round' }, timeOfDay: 'all-day', waterTemperature: { min: 35, optimal: 50, max: 65 }, waterType: ['limestone', 'spring-fed'], size: '#18-#24', color: 'Black, olive, or cream' },
  ],
};



