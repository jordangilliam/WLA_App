/**
 * PA Fly Fishing Experts Database
 * 
 * Comprehensive data on:
 * - Joe Humphreys (techniques, patterns, locations)
 * - George Daniel (modern nymphing, competition techniques)
 * - Trout Unlimited chapters
 * - Fly fishing shops
 */

export interface Expert {
  id: string;
  name: string;
  type: 'expert' | 'shop' | 'organization';
  location: string;
  region: string;
  specialties: string[];
  techniques: Technique[];
  patterns: Pattern[];
  favoriteLocations: FavoriteLocation[];
  publications: Publication[];
  contact: ContactInfo;
  bio?: string;
}

export interface Technique {
  name: string;
  description: string;
  waterTypes: string[];
  bestSeasons: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  videoUrl?: string;
}

export interface Pattern {
  name: string;
  type: 'dry-fly' | 'nymph' | 'streamer' | 'wet-fly' | 'terrestrial';
  description: string;
  targetSpecies: string[];
  bestSeasons: string[];
  hookSize: string;
  materials: string[];
  tyingInstructions?: string;
}

export interface FavoriteLocation {
  waterwayName: string;
  section?: string;
  coordinates: { lat: number; lng: number };
  why: string;
  bestSeasons: string[];
  techniques: string[];
}

export interface Publication {
  title: string;
  type: 'book' | 'article' | 'video' | 'dvd' | 'pattern';
  year?: number;
  url?: string;
  description?: string;
}

export interface ContactInfo {
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
}

// Joe Humphreys Data
export const JOE_HUMPHREYS: Expert = {
  id: 'joe-humphreys',
  name: 'Joe Humphreys',
  type: 'expert',
  location: 'State College, PA',
  region: 'Central',
  specialties: [
    'High-Stick Nymphing',
    'Leisenring Lift',
    'Streamer Fishing',
    'Dry Fly Presentation',
    'Teaching & Education',
  ],
  techniques: [
    {
      name: 'High-Stick Nymphing',
      description: 'Classic technique for fishing nymphs in pocket water and runs. Keep line off the water, use short drifts.',
      waterTypes: ['freestone', 'limestone'],
      bestSeasons: ['spring', 'fall', 'winter'],
      difficulty: 'intermediate',
    },
    {
      name: 'Leisenring Lift',
      description: 'Traditional wet fly technique where you lift the fly at the end of the drift to imitate emerging insects.',
      waterTypes: ['limestone', 'spring-fed'],
      bestSeasons: ['spring', 'summer'],
      difficulty: 'intermediate',
    },
    {
      name: 'Streamer Techniques',
      description: 'Aggressive streamer fishing for large trout. Various retrieves including strip-pause and swing methods.',
      waterTypes: ['freestone', 'limestone'],
      bestSeasons: ['spring', 'fall'],
      difficulty: 'advanced',
    },
    {
      name: 'Dry Fly Presentation',
      description: 'Precise dry fly casting and presentation techniques for selective trout.',
      waterTypes: ['limestone', 'spring-fed'],
      bestSeasons: ['spring', 'summer', 'fall'],
      difficulty: 'intermediate',
    },
  ],
  patterns: [
    {
      name: "Joe's Hopper",
      type: 'terrestrial',
      description: 'Classic terrestrial pattern for late summer fishing.',
      targetSpecies: ['Brown Trout', 'Rainbow Trout'],
      bestSeasons: ['summer', 'fall'],
      hookSize: '#10-#12',
      materials: ['Deer hair', 'Rubber legs', 'Foam body'],
    },
    {
      name: 'Humphreys Nymph',
      type: 'nymph',
      description: 'Versatile nymph pattern effective in various conditions.',
      targetSpecies: ['Brown Trout', 'Rainbow Trout', 'Brook Trout'],
      bestSeasons: ['spring', 'summer', 'fall', 'winter'],
      hookSize: '#14-#18',
      materials: ['Peacock herl', 'Wire rib', 'Hare\'s ear'],
    },
    {
      name: 'State College Special',
      type: 'dry-fly',
      description: 'Local pattern for Spring Creek hatches.',
      targetSpecies: ['Brown Trout', 'Rainbow Trout'],
      bestSeasons: ['spring', 'summer'],
      hookSize: '#14-#16',
      materials: ['Hackle', 'Dubbing', 'Wing'],
    },
  ],
  favoriteLocations: [
    {
      waterwayName: 'Spring Creek',
      section: "Fisherman's Paradise",
      coordinates: { lat: 40.7981, lng: -77.8600 },
      why: 'Primary teaching location. Year-round fishing with consistent hatches.',
      bestSeasons: ['spring', 'fall', 'winter'],
      techniques: ['High-Stick Nymphing', 'Dry Fly Presentation'],
    },
    {
      waterwayName: 'Penns Creek',
      coordinates: { lat: 40.8670, lng: -77.4167 },
      why: 'Favorite freestone stream. Excellent dry fly and streamer fishing.',
      bestSeasons: ['spring', 'summer', 'fall'],
      techniques: ['Streamer Techniques', 'Dry Fly Presentation'],
    },
    {
      waterwayName: 'Yellow Breeches Creek',
      coordinates: { lat: 40.2342, lng: -77.0264 },
      why: 'Premier limestone spring creek. Perfect for teaching advanced techniques.',
      bestSeasons: ['spring', 'fall'],
      techniques: ['Leisenring Lift', 'Dry Fly Presentation'],
    },
  ],
  publications: [
    {
      title: 'Trout Tactics',
      type: 'book',
      year: 1981,
      description: 'Comprehensive guide to trout fishing techniques.',
    },
    {
      title: "Joe Humphreys's Fly-Fishing Tactics",
      type: 'book',
      year: 1993,
      description: 'Advanced techniques and strategies.',
    },
    {
      title: 'High-Stick Nymphing Video',
      type: 'video',
      description: 'Instructional video on high-stick nymphing technique.',
    },
  ],
  contact: {
    website: 'https://www.flyfishersparadise.com',
    email: 'info@flyfishersparadise.com',
    phone: '(814) 234-4189',
    address: 'State College, PA',
  },
  bio: 'Legendary fly fishing instructor and guide. Taught thousands of anglers over decades. Expert in traditional and modern techniques.',
};

// George Daniel Data
export const GEORGE_DANIEL: Expert = {
  id: 'george-daniel',
  name: 'George Daniel',
  type: 'expert',
  location: 'State College, PA',
  region: 'Central',
  specialties: [
    'Modern Nymphing',
    'Competition Fly Fishing',
    'Tight-Line Techniques',
    'French Nymphing',
    'Czech Nymphing',
  ],
  techniques: [
    {
      name: 'French Nymphing',
      description: 'Long leader, no indicator technique. Highly effective in pocket water and fast runs.',
      waterTypes: ['freestone', 'limestone'],
      bestSeasons: ['spring', 'summer', 'fall', 'winter'],
      difficulty: 'advanced',
    },
    {
      name: 'Czech Nymphing',
      description: 'Short-line, heavy nymph technique for fast water. Extremely effective.',
      waterTypes: ['freestone'],
      bestSeasons: ['spring', 'summer', 'fall'],
      difficulty: 'advanced',
    },
    {
      name: 'Tight-Line Nymphing',
      description: 'Contact technique maintaining direct connection to the fly.',
      waterTypes: ['freestone', 'limestone'],
      bestSeasons: ['spring', 'summer', 'fall', 'winter'],
      difficulty: 'intermediate',
    },
    {
      name: 'Competition Techniques',
      description: 'Advanced techniques used in competitive fly fishing.',
      waterTypes: ['freestone', 'limestone'],
      bestSeasons: ['spring', 'summer', 'fall', 'winter'],
      difficulty: 'advanced',
    },
  ],
  patterns: [
    {
      name: 'Perdigon',
      type: 'nymph',
      description: 'Competition-style nymph pattern. Sinks fast, highly visible.',
      targetSpecies: ['Brown Trout', 'Rainbow Trout'],
      bestSeasons: ['spring', 'summer', 'fall', 'winter'],
      hookSize: '#14-#18',
      materials: ['Tungsten bead', 'Epoxy', 'Flash'],
    },
    {
      name: 'Squirmy Wormy',
      type: 'nymph',
      description: 'Realistic worm imitation. Highly effective.',
      targetSpecies: ['Brown Trout', 'Rainbow Trout'],
      bestSeasons: ['spring', 'summer', 'fall'],
      hookSize: '#12-#16',
      materials: ['Squirmy material', 'Tungsten bead'],
    },
    {
      name: 'Competition Nymphs',
      type: 'nymph',
      description: 'Various competition-style patterns designed for effectiveness.',
      targetSpecies: ['Brown Trout', 'Rainbow Trout'],
      bestSeasons: ['spring', 'summer', 'fall', 'winter'],
      hookSize: '#14-#20',
      materials: ['Tungsten', 'Flash', 'Synthetic materials'],
    },
  ],
  favoriteLocations: [
    {
      waterwayName: 'Spring Creek',
      section: "Fisherman's Paradise",
      coordinates: { lat: 40.7981, lng: -77.8600 },
      why: 'Primary teaching and competition location. Perfect for modern nymphing techniques.',
      bestSeasons: ['spring', 'fall', 'winter'],
      techniques: ['French Nymphing', 'Tight-Line Nymphing'],
    },
    {
      waterwayName: 'Yellow Breeches Creek',
      coordinates: { lat: 40.2342, lng: -77.0264 },
      why: 'Excellent limestone spring creek for advanced techniques.',
      bestSeasons: ['spring', 'fall'],
      techniques: ['French Nymphing', 'Tight-Line Nymphing'],
    },
  ],
  publications: [
    {
      title: 'Dynamic Nymphing',
      type: 'book',
      year: 2011,
      description: 'Comprehensive guide to modern nymphing techniques.',
      url: 'https://www.amazon.com/Dynamic-Nymphing-George-Daniel/dp/0811707421',
    },
    {
      title: 'Strip-Set',
      type: 'book',
      year: 2015,
      description: 'Advanced techniques for streamer fishing.',
    },
    {
      title: 'Modern Nymphing Techniques',
      type: 'video',
      description: 'Instructional video series on modern nymphing.',
    },
  ],
  contact: {
    website: 'https://www.georgedaniel.com',
    email: 'george@georgedaniel.com',
    address: 'State College, PA',
  },
  bio: 'World-class competitive fly angler and instructor. Expert in modern European nymphing techniques. Multiple-time US Fly Fishing Team member.',
};

// PA Fly Fishing Shops
export const PA_FLY_SHOPS_DATA = [
  {
    id: 'tco-state-college',
    name: 'TCO Fly Shop',
    location: 'State College, PA',
    region: 'Central',
    address: '2101 E College Ave, State College, PA 16801',
    phone: '(814) 234-4189',
    website: 'https://www.tcoflyfishing.com',
    services: ['Fly Fishing Gear', 'Guided Trips', 'Classes', 'Fly Tying', 'Custom Rods'],
    guides: true,
    flyTying: true,
    classes: true,
    coordinates: { lat: 40.7981, lng: -77.8600 },
  },
  {
    id: 'tco-reading',
    name: 'TCO Fly Shop',
    location: 'Reading, PA',
    region: 'Reading',
    address: 'Reading, PA',
    website: 'https://www.tcoflyfishing.com',
    services: ['Fly Fishing Gear', 'Guided Trips', 'Classes'],
    guides: true,
    classes: true,
  },
  {
    id: 'tco-bryn-mawr',
    name: 'TCO Fly Shop',
    location: 'Bryn Mawr, PA',
    region: 'Philadelphia',
    address: 'Bryn Mawr, PA',
    website: 'https://www.tcoflyfishing.com',
    services: ['Fly Fishing Gear', 'Guided Trips', 'Classes'],
    guides: true,
    classes: true,
  },
  {
    id: 'fly-fishers-paradise',
    name: "Fly Fisher's Paradise",
    location: 'State College, PA',
    region: 'Central',
    address: 'State College, PA',
    phone: '(814) 234-4189',
    website: 'https://www.flyfishersparadise.com',
    services: ['Fly Fishing Gear', 'Guided Trips', 'Classes', 'Joe Humphreys Instruction'],
    guides: true,
    classes: true,
    coordinates: { lat: 40.7981, lng: -77.8600 },
  },
  {
    id: 'spruce-creek-outfitters',
    name: 'Spruce Creek Outfitters',
    location: 'Spruce Creek, PA',
    region: 'Central',
    address: 'Spruce Creek, PA',
    website: 'https://www.sprucecreekoutfitters.com',
    services: ['Fly Fishing Gear', 'Guided Trips', 'Lodging'],
    guides: true,
  },
  {
    id: 'feathered-hook',
    name: 'The Feathered Hook',
    location: 'Coburn, PA',
    region: 'Central',
    address: 'Coburn, PA',
    website: 'https://www.featheredhook.com',
    services: ['Fly Fishing Gear', 'Guided Trips', 'Lodging', 'Classes'],
    guides: true,
    classes: true,
    coordinates: { lat: 40.8670, lng: -77.4167 },
  },
  {
    id: 'fly-shop-boiling-springs',
    name: 'The Fly Shop',
    location: 'Boiling Springs, PA',
    region: 'Harrisburg',
    address: 'Boiling Springs, PA',
    website: 'https://www.theflyshop.com',
    services: ['Fly Fishing Gear', 'Guided Trips'],
    guides: true,
    coordinates: { lat: 40.2342, lng: -77.0264 },
  },
  {
    id: 'anglers-paradise',
    name: "Angler's Paradise",
    location: 'Allentown, PA',
    region: 'Lehigh Valley',
    address: 'Allentown, PA',
    website: 'https://www.anglersparadise.com',
    services: ['Fly Fishing Gear', 'Guided Trips', 'Classes'],
    guides: true,
    classes: true,
  },
  {
    id: 'fly-fishing-outfitters',
    name: 'Fly Fishing Outfitters',
    location: 'Pittsburgh, PA',
    region: 'Pittsburgh',
    address: 'Pittsburgh, PA',
    website: 'https://www.flyfishingoutfitters.com',
    services: ['Fly Fishing Gear', 'Guided Trips'],
    guides: true,
  },
  {
    id: 'sporting-gentleman',
    name: 'The Sporting Gentleman',
    location: 'Erie, PA',
    region: 'Erie',
    address: 'Erie, PA',
    website: 'https://www.sportinggentleman.com',
    services: ['Fly Fishing Gear', 'Guided Trips', 'Lake Erie Specialists'],
    guides: true,
    coordinates: { lat: 42.1275, lng: -80.0851 },
  },
];

// Trout Unlimited PA Chapters
export const TU_PA_CHAPTERS = [
  {
    id: 'tu-pa-council',
    name: 'Pennsylvania Council',
    region: 'Statewide',
    website: 'https://www.tu.org',
    focus: ['Conservation', 'Habitat Restoration', 'Education', 'Advocacy'],
  },
  {
    id: 'tu-allegheny-mountain',
    name: 'Allegheny Mountain Chapter',
    region: 'Western PA',
    focus: ['Conservation', 'Habitat Restoration'],
  },
  {
    id: 'tu-spring-creek',
    name: 'Spring Creek Chapter',
    region: 'Central PA',
    focus: ['Spring Creek Conservation', 'Education'],
  },
  {
    id: 'tu-yellow-breeches',
    name: 'Yellow Breeches Chapter',
    region: 'South Central PA',
    focus: ['Yellow Breeches Conservation', 'Habitat Restoration'],
  },
  {
    id: 'tu-penns-creek',
    name: 'Penns Creek Chapter',
    region: 'Central PA',
    focus: ['Penns Creek Conservation', 'Education'],
  },
  {
    id: 'tu-lackawanna',
    name: 'Lackawanna Chapter',
    region: 'Northeast PA',
    focus: ['Conservation', 'Habitat Restoration'],
  },
  {
    id: 'tu-delaware-river',
    name: 'Delaware River Chapter',
    region: 'Eastern PA',
    focus: ['Delaware River Conservation', 'Habitat Restoration'],
  },
];

// Export all data
export const FLY_FISHING_EXPERTS = [JOE_HUMPHREYS, GEORGE_DANIEL];
export const ALL_FLY_SHOPS = PA_FLY_SHOPS_DATA;
export const ALL_TU_CHAPTERS = TU_PA_CHAPTERS;



