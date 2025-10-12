'use client';

import { useState, useEffect, useRef } from 'react';
import { usePoints } from '@/ui/points/PointsProvider';
import { PA_WATER_BODIES_EXPANDED } from '@/data/pa-water-bodies-expanded';
import { FISHING_CONSERVATION_HISTORY } from '@/lib/data/conservation-history';
import ConservationHistory from '@/components/ConservationHistory';
import LocalHistoryResearch from '@/components/LocalHistoryResearch';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Initialize Mapbox
(mapboxgl as any).accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface FishSpecies {
  id: string;
  commonName: string;
  scientificName: string;
  category: 'Trout' | 'Bass' | 'Panfish' | 'Pike' | 'Catfish' | 'Other';
  habitat: {
    waterType: string[];
    temperature: string;
    oxygen: string;
    cover: string[];
    depth: string;
  };
  bestBait: string[];
  season: string;
  regulations: string;
  points: number;
  emoji: string;
  description: string;
}

interface WaterBody {
  id: string;
  name: string;
  type: 'Stream' | 'Lake' | 'River' | 'Pond';
  county: string;
  lat: number;
  lon: number;
  species: string[];
  stockingSchedule?: StockingEvent[];
  accessPoints: AccessPoint[];
  regulations: string;
  habitat: string;
  size?: string;
}

interface StockingEvent {
  date: string;
  species: string;
  quantity: number;
  size: string;
}

interface AccessPoint {
  name: string;
  lat: number;
  lon: number;
  amenities: string[];
  accessibility: string;
  parking: boolean;
}

interface FishingLog {
  id: string;
  timestamp: number;
  waterBodyId: string;
  speciesId: string;
  length?: number;
  weight?: number;
  bait: string;
  weather: string;
  waterTemp?: number;
  location: string;
  photos: string[];
  notes: string;
  released: boolean;
}

const PA_FISH_SPECIES: FishSpecies[] = [
  {
    id: 'brook-trout',
    commonName: 'Brook Trout',
    scientificName: 'Salvelinus fontinalis',
    category: 'Trout',
    habitat: {
      waterType: ['Cold streams', 'Spring-fed lakes'],
      temperature: '50-60°F',
      oxygen: 'High (7-10 mg/L)',
      cover: ['Undercut banks', 'Boulders', 'Logs', 'Deep pools'],
      depth: '2-6 feet in streams'
    },
    bestBait: ['Worms', 'Small spinners', 'Flies (dry & wet)', 'Corn'],
    season: 'Year-round (check regs)',
    regulations: 'PA native - Special protection in some streams',
    points: 15,
    emoji: '🐟',
    description: 'Pennsylvania\'s only native trout, prefers cold, clean water'
  },
  {
    id: 'rainbow-trout',
    commonName: 'Rainbow Trout',
    scientificName: 'Oncorhynchus mykiss',
    category: 'Trout',
    habitat: {
      waterType: ['Cold streams', 'Lakes', 'Stocked waters'],
      temperature: '50-65°F',
      oxygen: 'High (6-9 mg/L)',
      cover: ['Riffles', 'Runs', 'Pools', 'Structure'],
      depth: '1-8 feet'
    },
    bestBait: ['PowerBait', 'Spinners', 'Flies', 'Salmon eggs'],
    season: 'Stocked spring & fall',
    regulations: 'Check daily creel limits',
    points: 10,
    emoji: '🌈',
    description: 'Popular stocked trout, known for acrobatic fights'
  },
  {
    id: 'brown-trout',
    commonName: 'Brown Trout',
    scientificName: 'Salmo trutta',
    category: 'Trout',
    habitat: {
      waterType: ['Streams', 'Rivers', 'Lakes'],
      temperature: '55-65°F',
      oxygen: 'Moderate-High (5-8 mg/L)',
      cover: ['Deep pools', 'Undercut banks', 'Structure'],
      depth: '3-10 feet'
    },
    bestBait: ['Minnows', 'Nightcrawlers', 'Streamers', 'Crankbaits'],
    season: 'Year-round',
    regulations: 'Larger size limits on some waters',
    points: 12,
    emoji: '🎣',
    description: 'Wary and difficult to catch, grows large in PA waters'
  },
  {
    id: 'largemouth-bass',
    commonName: 'Largemouth Bass',
    scientificName: 'Micropterus salmoides',
    category: 'Bass',
    habitat: {
      waterType: ['Lakes', 'Ponds', 'Slow rivers'],
      temperature: '65-75°F',
      oxygen: 'Moderate (4-7 mg/L)',
      cover: ['Vegetation', 'Docks', 'Lily pads', 'Fallen trees'],
      depth: '2-15 feet (seasonal)'
    },
    bestBait: ['Plastic worms', 'Crankbaits', 'Topwater lures', 'Spinnerbaits'],
    season: 'Best May-October',
    regulations: '15" minimum (some lakes)',
    points: 10,
    emoji: '🎸',
    description: 'Aggressive predator, found in most PA lakes and ponds'
  },
  {
    id: 'smallmouth-bass',
    commonName: 'Smallmouth Bass',
    scientificName: 'Micropterus dolomieu',
    category: 'Bass',
    habitat: {
      waterType: ['Rivers', 'Streams', 'Clear lakes'],
      temperature: '65-75°F',
      oxygen: 'Moderate-High (5-8 mg/L)',
      cover: ['Rocky areas', 'Gravel bars', 'Boulders'],
      depth: '3-20 feet'
    },
    bestBait: ['Tubes', 'Hellgrammites', 'Crayfish', 'Small jigs'],
    season: 'Best June-October',
    regulations: '12" minimum',
    points: 12,
    emoji: '🥊',
    description: 'Pound-for-pound fighter, thrives in PA rivers'
  },
  {
    id: 'bluegill',
    commonName: 'Bluegill',
    scientificName: 'Lepomis macrochirus',
    category: 'Panfish',
    habitat: {
      waterType: ['Lakes', 'Ponds', 'Slow streams'],
      temperature: '70-80°F',
      oxygen: 'Moderate (4-6 mg/L)',
      cover: ['Vegetation', 'Shallow bays', 'Docks'],
      depth: '1-10 feet'
    },
    bestBait: ['Worms', 'Crickets', 'Small jigs', 'Flies'],
    season: 'Best May-September',
    regulations: 'No minimum size',
    points: 5,
    emoji: '🔵',
    description: 'Excellent for beginners, great table fare'
  },
  {
    id: 'crappie',
    commonName: 'Black Crappie',
    scientificName: 'Pomoxis nigromaculatus',
    category: 'Panfish',
    habitat: {
      waterType: ['Lakes', 'Reservoirs', 'Rivers'],
      temperature: '60-75°F',
      oxygen: 'Moderate (4-7 mg/L)',
      cover: ['Brush piles', 'Docks', 'Submerged trees'],
      depth: '5-15 feet'
    },
    bestBait: ['Minnows', 'Small jigs', 'Tube baits'],
    season: 'Spring spawn (March-May)',
    regulations: 'No minimum size',
    points: 8,
    emoji: '⚫',
    description: 'Schooling fish, great for ice fishing'
  },
  {
    id: 'yellow-perch',
    commonName: 'Yellow Perch',
    scientificName: 'Perca flavescens',
    category: 'Panfish',
    habitat: {
      waterType: ['Lakes', 'Large rivers'],
      temperature: '65-75°F',
      oxygen: 'Moderate (5-7 mg/L)',
      cover: ['Weed beds', 'Rocky areas', 'Open water'],
      depth: '10-25 feet'
    },
    bestBait: ['Minnows', 'Worms', 'Small jigs'],
    season: 'Year-round (great ice fishing)',
    regulations: 'No minimum size',
    points: 8,
    emoji: '💛',
    description: 'Schooling fish, excellent eating'
  },
  {
    id: 'northern-pike',
    commonName: 'Northern Pike',
    scientificName: 'Esox lucius',
    category: 'Pike',
    habitat: {
      waterType: ['Lakes', 'Slow rivers'],
      temperature: '55-70°F',
      oxygen: 'Moderate (5-8 mg/L)',
      cover: ['Vegetation', 'Deep weed edges', 'Points'],
      depth: '5-20 feet'
    },
    bestBait: ['Large spoons', 'Spinnerbaits', 'Live bait', 'Jerkbaits'],
    season: 'Best spring & fall',
    regulations: '24" minimum',
    points: 15,
    emoji: '🔱',
    description: 'Aggressive predator with sharp teeth, use wire leader'
  },
  {
    id: 'muskellunge',
    commonName: 'Muskellunge',
    scientificName: 'Esox masquinongy',
    category: 'Pike',
    habitat: {
      waterType: ['Large lakes', 'Rivers'],
      temperature: '60-75°F',
      oxygen: 'High (6-9 mg/L)',
      cover: ['Deep weed edges', 'Rocky points', 'Open water'],
      depth: '10-40 feet'
    },
    bestBait: ['Large lures (8-12")', 'Jerkbaits', 'Bucktails'],
    season: 'Best fall (September-November)',
    regulations: '40" minimum - Trophy fish',
    points: 25,
    emoji: '👑',
    description: 'The fish of 10,000 casts - PA\'s apex predator'
  },
  {
    id: 'channel-catfish',
    commonName: 'Channel Catfish',
    scientificName: 'Ictalurus punctatus',
    category: 'Catfish',
    habitat: {
      waterType: ['Rivers', 'Lakes', 'Ponds'],
      temperature: '70-85°F',
      oxygen: 'Low-Moderate (3-6 mg/L)',
      cover: ['Deep holes', 'Under structure', 'Bottom'],
      depth: '5-30 feet'
    },
    bestBait: ['Chicken liver', 'Stinkbait', 'Nightcrawlers', 'Cut bait'],
    season: 'Best summer (June-August)',
    regulations: 'No minimum size',
    points: 10,
    emoji: '🐈',
    description: 'Great for bank fishing, active at night'
  },
  {
    id: 'walleye',
    commonName: 'Walleye',
    scientificName: 'Sander vitreus',
    category: 'Other',
    habitat: {
      waterType: ['Lakes', 'Large rivers'],
      temperature: '60-70°F',
      oxygen: 'Moderate-High (6-8 mg/L)',
      cover: ['Rocky areas', 'Sand flats', 'Points'],
      depth: '10-30 feet'
    },
    bestBait: ['Jigs & minnows', 'Crankbaits', 'Live bait rigs'],
    season: 'Best spring & fall (low light)',
    regulations: '15" minimum',
    points: 15,
    emoji: '👁️',
    description: 'Excellent table fare, feed actively in low light'
  }
];

// Sample water bodies - in production, this would come from PFBC GIS API
// Use expanded water bodies data
const PA_WATER_BODIES = PA_WATER_BODIES_EXPANDED;

// Warmwater/Coolwater Stocking Schedules
const WARMWATER_STOCKING_SCHEDULE = [
  {
    location: 'Peace Valley Lake',
    county: 'Bucks',
    species: 'Channel Catfish',
    dates: ['May 15', 'June 12', 'July 10'],
    size: '12-16 inches',
    quantity: 500
  },
  {
    location: 'Blue Marsh Lake',
    county: 'Berks',
    species: 'Hybrid Striped Bass',
    dates: ['April 20', 'May 18'],
    size: '6-8 inches',
    quantity: 2000
  },
  {
    location: 'Lake Marburg',
    county: 'York',
    species: 'Muskellunge',
    dates: ['October 5'],
    size: '12-14 inches',
    quantity: 100
  },
  {
    location: 'Marsh Creek Lake',
    county: 'Chester',
    species: 'Walleye',
    dates: ['April 15', 'October 20'],
    size: '6-8 inches',
    quantity: 5000
  },
  {
    location: 'Glendale Lake',
    county: 'Cambria',
    species: 'Tiger Musky',
    dates: ['September 15'],
    size: '12-14 inches',
    quantity: 75
  },
  {
    location: 'Pymatuning Reservoir',
    county: 'Crawford',
    species: 'Walleye',
    dates: ['April 10', 'May 5', 'October 15'],
    size: '6-8 inches',
    quantity: 10000
  },
  {
    location: 'Lake Arthur',
    county: 'Butler',
    species: 'Muskellunge',
    dates: ['October 1'],
    size: '12-14 inches',
    quantity: 150
  },
  {
    location: 'Beltzville Lake',
    county: 'Carbon',
    species: 'Hybrid Striped Bass',
    dates: ['May 1', 'June 15'],
    size: '6-8 inches',
    quantity: 1500
  }
];

// Knot Tying Data with ASCII Diagrams
const FISHING_KNOTS = [
  {
    id: 'improved-clinch',
    name: 'Improved Clinch Knot',
    difficulty: 'Beginner',
    strength: '95%',
    uses: ['Attaching hooks', 'Tying lures', 'Terminal tackle'],
    discipline: 'Both',
    steps: [
      '1. Thread line through eye of hook',
      '2. Make 5-7 wraps around standing line',
      '3. Thread tag end through loop by eye',
      '4. Thread tag end through big loop just made',
      '5. Moisten and pull tight',
      '6. Trim tag end'
    ],
    diagram: `
    ┌──────┐
    │ Hook │───○───────
    └──────┘    ╲╱╲╱╲╱╲╱
                 ╲─○─╱
                   │
                   ╲────
    `,
    videoUrl: 'https://www.youtube.com/watch?v=improved-clinch',
    tips: 'Always moisten knot before tightening. Leave 1/8" tag end.'
  },
  {
    id: 'palomar',
    name: 'Palomar Knot',
    difficulty: 'Beginner',
    strength: '95%',
    uses: ['Braided line', 'Heavy lures', 'Strong connection'],
    discipline: 'Conventional',
    steps: [
      '1. Double 6" of line and pass through eye',
      '2. Tie overhand knot with doubled line',
      '3. Pass loop over entire lure/hook',
      '4. Moisten and pull tight',
      '5. Trim tag end'
    ],
    diagram: `
       Loop
        ○
       ╱ ╲
    ═══   ═══
    │   ╳   │
    │  ╱ ╲  │
    └─┘   └─┘
       Hook
    `,
    tips: 'Best for braided line. Very strong and reliable.'
  },
  {
    id: 'loop-knot',
    name: 'Non-Slip Loop Knot',
    difficulty: 'Intermediate',
    strength: '90%',
    uses: ['Fly fishing', 'Lure action', 'Free movement'],
    discipline: 'Both',
    steps: [
      '1. Make overhand knot in line',
      '2. Pass tag end through hook eye and back through overhand knot',
      '3. Wrap tag end around standing line 3-5 times',
      '4. Pass tag end back through overhand knot',
      '5. Moisten and tighten carefully'
    ],
    diagram: `
      ╭─○─╮
      │   │
    ═══ ○ ═══
      ╲─┴─╱
       Hook
    `,
    tips: 'Allows lure to move freely. Great for streamers and crankbaits.'
  },
  {
    id: 'blood-knot',
    name: 'Blood Knot',
    difficulty: 'Advanced',
    strength: '85%',
    uses: ['Joining tippets', 'Leader construction', 'Line-to-line'],
    discipline: 'Fly',
    steps: [
      '1. Overlap two lines 6 inches',
      '2. Wrap one end around other line 5 times',
      '3. Bring tag back and through middle opening',
      '4. Repeat with other line in opposite direction',
      '5. Pull both tag ends to tighten center',
      '6. Pull standing lines to finish'
    ],
    diagram: `
    ═══╱╲╱╲╱╲╱╲╱╲═══
       ╲───○───╱
       ╱╲╱╲╱╲╱╲╱╲
    `,
    tips: 'Works best with lines of similar diameter. Practice makes perfect!'
  },
  {
    id: 'surgeons-knot',
    name: 'Surgeon&apos;s Knot',
    difficulty: 'Beginner',
    strength: '90%',
    uses: ['Tippet to leader', 'Quick line joining', 'Dissimilar diameters'],
    discipline: 'Fly',
    steps: [
      '1. Overlap lines 6-8 inches',
      '2. Form loop with both lines',
      '3. Pass both tag ends through loop twice',
      '4. Moisten and pull all four ends',
      '5. Trim tag ends'
    ],
    diagram: `
    ═══○═══
       │
    ═══○═══
    `,
    tips: 'Faster than blood knot. Great for changing tippets quickly.'
  },
  {
    id: 'arbor-knot',
    name: 'Arbor Knot',
    difficulty: 'Beginner',
    strength: 'N/A',
    uses: ['Attaching line to reel', 'Backing to arbor', 'Initial setup'],
    discipline: 'Both',
    steps: [
      '1. Wrap line around reel arbor',
      '2. Tie overhand knot around main line',
      '3. Tie second overhand knot in tag end',
      '4. Pull tight - second knot jams against first',
      '5. Trim excess'
    ],
    diagram: `
    ═══○═══
       │
       ○
    `,
    tips: 'Simple and secure. The second knot prevents slipping.'
  },
  {
    id: 'nail-knot',
    name: 'Nail Knot',
    difficulty: 'Advanced',
    strength: '90%',
    uses: ['Fly line to leader', 'Permanent connections', 'Smooth casts'],
    discipline: 'Fly',
    steps: [
      '1. Lay nail/tube alongside fly line and leader',
      '2. Wrap leader tag end around fly line and nail 7 times',
      '3. Thread tag end through nail/tube',
      '4. Remove nail while holding wraps',
      '5. Pull tight carefully',
      '6. Trim and coat with glue'
    ],
    diagram: `
    ████████
    ╱╲╱╲╱╲╱╲
    ═══════
    `,
    tips: 'Use a nail knot tool or drinking straw. Very smooth through guides.'
  }
];

// Equipment Data - Comprehensive Guide
const FISHING_EQUIPMENT = {
  conventional: {
    rods: [
      {
        type: 'Spinning Rod',
        length: '6-7 feet',
        power: 'Light to Medium',
        action: 'Fast to Moderate',
        uses: 'Versatile - Panfish, trout, bass',
        price: '$50-$200',
        bestFor: 'Beginners, general use'
      },
      {
        type: 'Baitcasting Rod',
        length: '6.6-7.6 feet',
        power: 'Medium to Heavy',
        action: 'Fast',
        uses: 'Bass, pike, larger fish',
        price: '$70-$300',
        bestFor: 'Experienced anglers, precision'
      },
      {
        type: 'Ultralight Rod',
        length: '5-6 feet',
        power: 'Ultralight',
        action: 'Fast',
        uses: 'Panfish, small trout',
        price: '$40-$150',
        bestFor: 'Small waters, light tackle'
      }
    ],
    reels: [
      {
        type: 'Spinning Reel',
        size: '1000-3000',
        dragPower: '5-15 lbs',
        gearRatio: '5.0:1 to 6.2:1',
        uses: 'All-purpose fishing',
        price: '$40-$250',
        features: ['Easy to use', 'Versatile', 'Good for beginners']
      },
      {
        type: 'Baitcasting Reel',
        size: 'Various',
        dragPower: '10-25 lbs',
        gearRatio: '6.4:1 to 8.1:1',
        uses: 'Bass, pike, accuracy',
        price: '$80-$400',
        features: ['Precise casts', 'More control', 'Higher drag']
      },
      {
        type: 'Spincast Reel',
        size: 'Various',
        dragPower: '5-10 lbs',
        gearRatio: '3.0:1 to 4.3:1',
        uses: 'Beginners, kids',
        price: '$20-$80',
        features: ['Push-button casting', 'Tangle-free', 'Easy operation']
      }
    ],
    line: [
      {
        type: 'Monofilament',
        strength: '4-20 lb test',
        stretch: 'High (25%)',
        visibility: 'Medium',
        uses: 'General purpose, topwater, crankbaits',
        pros: ['Affordable', 'Forgiving', 'Knots well'],
        cons: ['Stretches', 'Memory', 'UV degradation'],
        price: '$5-$15 per spool'
      },
      {
        type: 'Fluorocarbon',
        strength: '4-20 lb test',
        stretch: 'Low (15%)',
        visibility: 'Low (nearly invisible)',
        uses: 'Leader material, clear water, finesse',
        pros: ['Invisible underwater', 'Abrasion resistant', 'Sinks fast'],
        cons: ['Expensive', 'Stiff', 'Harder to knot'],
        price: '$15-$30 per spool'
      },
      {
        type: 'Braided',
        strength: '10-65 lb test (thin diameter)',
        stretch: 'None',
        visibility: 'High (bright colors)',
        uses: 'Heavy cover, jigs, sensitivity',
        pros: ['No stretch', 'Super strong', 'Thin', 'Lasts years'],
        cons: ['Visible', 'Expensive', 'Requires special knots'],
        price: '$20-$40 per spool'
      }
    ],
    lures: [
      {
        category: 'Crankbaits',
        types: ['Shallow', 'Medium', 'Deep diving'],
        uses: 'Bass, pike, walleye',
        action: 'Steady retrieve with wobble',
        colors: 'Match water clarity - bright or natural',
        tips: 'Deflect off structure for reaction strikes'
      },
      {
        category: 'Soft Plastics',
        types: ['Worms', 'Grubs', 'Creatures', 'Swimbaits'],
        uses: 'Bass, panfish, walleye',
        action: 'Varies - slow, twitch, swim',
        colors: 'Natural in clear, dark in murky',
        tips: 'Rig weedless for heavy cover'
      },
      {
        category: 'Spinnerbaits',
        types: ['Single', 'Double blade', 'Buzzbait'],
        uses: 'Bass, pike, musky',
        action: 'Steady retrieve, flash and vibration',
        colors: 'White, chartreuse, natural',
        tips: 'Slow-roll in cold water, burn in warm'
      },
      {
        category: 'Jigs',
        types: ['Football', 'Flipping', 'Swim jigs'],
        uses: 'Bass, walleye, panfish',
        action: 'Hop, drag, swim',
        colors: 'Match forage - crawfish, baitfish',
        tips: 'Use trailer for bulk and action'
      },
      {
        category: 'Topwater',
        types: ['Poppers', 'Walk-the-dog', 'Buzzbaits', 'Frogs'],
        uses: 'Bass, pike',
        action: 'Surface disturbance',
        colors: 'Natural, white, black',
        tips: 'Early morning and evening, calm water'
      }
    ],
    terminal: [
      {
        item: 'Hooks',
        types: ['J-hook', 'Circle hook', 'Treble', 'Wide gap'],
        sizes: '#10 (small) to 5/0 (large)',
        uses: 'Match hook size to bait and species',
        tips: 'Sharp hooks catch more fish - check often'
      },
      {
        item: 'Weights',
        types: ['Split shot', 'Bullet', 'Egg', 'Bank sinkers'],
        sizes: '1/32 oz to 1 oz+',
        uses: 'Get bait to depth, feel bottom',
        tips: 'Use lightest weight that gets the job done'
      },
      {
        item: 'Bobbers/Floats',
        types: ['Round', 'Slip bobber', 'Pencil', 'Lighted'],
        sizes: 'Micro to large',
        uses: 'Suspend bait, detect strikes',
        tips: 'Use slip bobber for deep water'
      },
      {
        item: 'Swivels',
        types: ['Barrel', 'Ball bearing', 'Snap swivels'],
        sizes: '#10 to #1',
        uses: 'Prevent line twist, quick changes',
        tips: 'Ball bearing swivels work best for spinners'
      }
    ],
    bait: [
      {
        type: 'Live Bait',
        options: ['Nightcrawlers', 'Minnows', 'Leeches', 'Crayfish', 'Crickets', 'Grubs'],
        storage: 'Cool, moist, oxygenated',
        uses: 'Universal - works for almost everything',
        tips: 'Keep fresh, check regulations on transport',
        seasons: 'Year-round'
      },
      {
        type: 'Cut Bait',
        options: ['Chicken liver', 'Hot dogs', 'Stink bait', 'Fish chunks'],
        storage: 'Refrigerate or freeze',
        uses: 'Catfish, panfish',
        tips: 'Smell attracts fish - the stinkier the better',
        seasons: 'Warm water'
      },
      {
        type: 'Prepared Bait',
        options: ['PowerBait', 'Berkley Gulp', 'Salmon eggs', 'Corn'],
        storage: 'Cool, sealed container',
        uses: 'Trout, panfish',
        tips: 'Good for stocked fish familiar with pellets',
        seasons: 'Year-round, especially stocking season'
      }
    ]
  },
  fly: {
    rods: [
      {
        weight: '3-4 wt',
        length: '7-8 feet',
        uses: 'Small streams, panfish, small trout',
        action: 'Moderate to Fast',
        price: '$100-$400',
        bestFor: 'Delicate presentations, tight spaces'
      },
      {
        weight: '5-6 wt',
        length: '8.5-9 feet',
        uses: 'All-purpose trout, bass, general',
        action: 'Medium-Fast',
        price: '$150-$600',
        bestFor: 'Most versatile, recommended for beginners'
      },
      {
        weight: '7-8 wt',
        length: '9 feet',
        uses: 'Bass, pike, steelhead, big water',
        action: 'Fast',
        price: '$200-$700',
        bestFor: 'Larger fish, wind, heavy flies'
      }
    ],
    reels: [
      {
        type: 'Click-and-Pawl',
        drag: 'Light',
        weight: '3-5 wt',
        uses: 'Small trout, panfish',
        price: '$50-$150',
        features: ['Simple', 'Light', 'Classic sound']
      },
      {
        type: 'Disc Drag',
        drag: 'Adjustable, smooth',
        weight: '5-8 wt',
        uses: 'All-purpose, larger fish',
        price: '$100-$500',
        features: ['Smooth drag', 'Reliable', 'Versatile']
      },
      {
        type: 'Large Arbor',
        drag: 'Strong',
        weight: '6-10 wt',
        uses: 'Fast retrieve, big fish',
        price: '$150-$800',
        features: ['Fast line pickup', 'Less memory', 'Better drag']
      }
    ],
    line: [
      {
        type: 'Weight Forward (WF)',
        uses: 'All-purpose, most common',
        casting: 'Good for distance and accuracy',
        price: '$40-$100',
        recommendation: 'Best for beginners'
      },
      {
        type: 'Double Taper (DT)',
        uses: 'Delicate presentations, roll casting',
        casting: 'Gentle turnover, can reverse',
        price: '$50-$100',
        recommendation: 'Traditional, small streams'
      },
      {
        type: 'Floating',
        density: 'Floats on surface',
        uses: 'Dry flies, nymphs, most situations',
        colors: 'Various for visibility',
        recommendation: '90% of fishing'
      },
      {
        type: 'Sinking',
        density: 'Sinks at rated speed',
        uses: 'Streamers, deep nymphs, lakes',
        colors: 'Usually dark',
        recommendation: 'Specialized situations'
      }
    ],
    leaders: [
      {
        type: 'Knotless Tapered',
        length: '7.5-12 feet',
        tippet: '3X to 6X',
        uses: 'Most fly fishing',
        price: '$5-$8 each',
        tips: 'Replace after several fish or when worn'
      },
      {
        type: 'Knotted',
        length: 'Custom',
        sections: '3-5 decreasing diameters',
        uses: 'Custom tapers, save money',
        price: 'DIY',
        tips: 'Build your own with different monofilament'
      },
      {
        type: 'Tippet Material',
        strength: '8X to 0X (tiny to large)',
        length: 'Add 2-4 feet to leader',
        material: 'Monofilament or fluorocarbon',
        uses: 'Extend leader, change fly size',
        tips: 'Fluorocarbon for nymphs, mono for dries'
      }
    ],
    flies: [
      {
        category: 'Dry Flies',
        purpose: 'Imitate adult insects on surface',
        types: ['Adams', 'Elk Hair Caddis', 'Parachute', 'Stimulator', 'Mayfly'],
        sizes: '#12-#20',
        when: 'Rising fish, hatches, calm water',
        techniques: 'Dead drift, twitch, skate',
        colors: 'Natural browns, olives, tans',
        mustHave: ['Adams #14-16', 'Elk Hair Caddis #14-16', 'Parachute Adams #14-18']
      },
      {
        category: 'Nymphs',
        purpose: 'Imitate subsurface insects',
        types: ['Pheasant Tail', 'Hare&apos;s Ear', 'Copper John', 'Prince Nymph', 'Stonefly'],
        sizes: '#8-#18',
        when: 'Most of the time - fish eat subsurface 90%',
        techniques: 'Dead drift with indicator, Euro nymphing',
        colors: 'Natural - olive, brown, black, copper',
        mustHave: ['Pheasant Tail #14-16', 'Hare&apos;s Ear #12-16', 'Copper John #14-18']
      },
      {
        category: 'Streamers',
        purpose: 'Imitate baitfish, leeches, crayfish',
        types: ['Woolly Bugger', 'Clouser Minnow', 'Muddler Minnow', 'Sculpin'],
        sizes: '#2-#10',
        when: 'High water, aggressive fish, big fish',
        techniques: 'Strip retrieve, swing, jerk',
        colors: 'Black, olive, white, natural',
        mustHave: ['Woolly Bugger #6-8 (black, olive)', 'Clouser Minnow #4-6']
      },
      {
        category: 'Emergers',
        purpose: 'Imitate insects hatching',
        types: ['Sparkle Dun', 'RS2', 'Klinkhamer', 'CDC Emerger'],
        sizes: '#14-#20',
        when: 'During hatches, transitioning insects',
        techniques: 'In film, slight twitch, dead drift',
        colors: 'Match natural - olives, browns, grays',
        mustHave: ['Sparkle Dun #16-18', 'RS2 #18-20']
      },
      {
        category: 'Terrestrials',
        purpose: 'Imitate land insects that fall in water',
        types: ['Ants', 'Beetles', 'Grasshoppers', 'Crickets', 'Inchworms'],
        sizes: '#10-#18',
        when: 'Summer/fall, windy days, near banks',
        techniques: 'Dead drift, occasional twitch',
        colors: 'Black, brown, green, tan',
        mustHave: ['Foam Ant #14-16', 'Beetle #14-16', 'Hopper #8-12 (summer)']
      },
      {
        category: 'Wet Flies',
        purpose: 'Traditional subsurface patterns',
        types: ['Soft Hackles', 'Classic Wets', 'Spiders'],
        sizes: '#10-#16',
        when: 'Swinging, streams, classic methods',
        techniques: 'Swing, dead drift, lift',
        colors: 'Traditional - partridge, hare, peacock',
        mustHave: ['Partridge and Orange #12-14', 'Soft Hackle Pheasant Tail #14']
      }
    ]
  }
};

// Casting Techniques Data
const CASTING_TECHNIQUES = {
  conventional: [
    {
      name: 'Overhead Cast',
      difficulty: 'Beginner',
      uses: 'Most common, open water',
      steps: [
        'Hold rod at 10 o&apos;clock position',
        'Bring rod tip back smoothly to 1 o&apos;clock',
        'Pause briefly as rod loads',
        'Accelerate forward to 10 o&apos;clock',
        'Stop rod abruptly and release line',
        'Follow through slightly downward'
      ],
      tips: 'Use your wrist and forearm. Don&apos;t overpower it. Let the rod do the work.',
      commonMistakes: ['Casting too hard', 'Not pausing on backcast', 'Poor timing'],
      videoUrl: '/videos/overhead-cast.mp4'
    },
    {
      name: 'Sidearm Cast',
      difficulty: 'Beginner',
      uses: 'Under trees, wind, low trajectory',
      steps: [
        'Lower rod to horizontal position',
        'Sweep rod back parallel to water',
        'Pause to load rod',
        'Sweep forward with acceleration',
        'Release and follow through',
        'Keep lure low to water'
      ],
      tips: 'Great for windy conditions. Keeps lure under wind.',
      commonMistakes: ['Hitting the water on backcast', 'Too high follow-through'],
      videoUrl: '/videos/sidearm-cast.mp4'
    },
    {
      name: 'Pitching',
      difficulty: 'Intermediate',
      uses: 'Accuracy, close targets, quiet entry',
      steps: [
        'Let lure hang 6-12 inches from rod tip',
        'Hold lure in off hand',
        'Point rod at target',
        'Release lure while lifting rod tip smoothly',
        'Lure swings forward like pendulum',
        'Feather line for accuracy'
      ],
      tips: 'Quiet presentation. Great for docks and cover.',
      commonMistakes: ['Releasing too early', 'Too much arm movement'],
      videoUrl: '/videos/pitching.mp4'
    },
    {
      name: 'Flipping',
      difficulty: 'Intermediate',
      uses: 'Very close accuracy, heavy cover',
      steps: [
        'Strip out 6-8 feet of line',
        'Hold rod high at 12 o&apos;clock',
        'Pull line with off hand',
        'Swing lure forward with rod movement',
        'Use wrist pop at end',
        'Lure drops straight down'
      ],
      tips: 'Best for baitcasting. Very accurate for tight spots.',
      commonMistakes: ['Too much power', 'Poor line control'],
      videoUrl: '/videos/flipping.mp4'
    },
    {
      name: 'Roll Cast (Spinning)',
      difficulty: 'Intermediate',
      uses: 'Obstacles behind, short casts',
      steps: [
        'Sweep rod back slowly',
        'Let line hang in a curve',
        'Don&apos;t bring rod all the way back',
        'Accelerate forward strongly',
        'Line rolls forward along water',
        'No backcast needed'
      ],
      tips: 'Useful when you can&apos;t backcast. Works best with heavier lures.',
      commonMistakes: ['Too fast backcast', 'Not enough power forward'],
      videoUrl: '/videos/roll-cast-spin.mp4'
    },
    {
      name: 'Skip Cast',
      difficulty: 'Advanced',
      uses: 'Under docks, overhangs, tight spaces',
      steps: [
        'Use sidearm angle',
        'Bring rod back low',
        'Accelerate very fast forward',
        'Release on forward stroke',
        'Aim at water 3-4 feet in front',
        'Lure skips like a stone'
      ],
      tips: 'Takes practice. Use heavier baits. Watch for backlash.',
      commonMistakes: ['Too much power', 'Wrong angle', 'Backlash'],
      videoUrl: '/videos/skip-cast.mp4'
    }
  ],
  fly: [
    {
      name: 'Basic Overhead Cast',
      difficulty: 'Beginner',
      uses: 'Foundation of all fly casting',
      steps: [
        'Start with rod at 9 o&apos;clock (horizontal)',
        'Accelerate smoothly to 1 o&apos;clock (backcast)',
        'Stop rod abruptly - let line straighten',
        'Pause - WAIT for line to load',
        'Accelerate forward to 10 o&apos;clock',
        'Stop abruptly and let line unfurl',
        'Lower rod tip as fly lands'
      ],
      tips: 'Focus on the PAUSE. Most beginners rush it. Let the line load the rod on the backcast.',
      commonMistakes: ['Breaking the wrist', 'No pause', 'Too much power', 'Wide arc'],
      videoUrl: '/videos/fly-overhead.mp4'
    },
    {
      name: 'False Casting',
      difficulty: 'Beginner',
      uses: 'Working out line, drying fly, measuring distance',
      steps: [
        'Same as overhead cast',
        'Don&apos;t let line land - keep in air',
        'Back and forth motion',
        'Pause at each end',
        'Add line by pulling with off hand',
        'Cast when ready'
      ],
      tips: 'Don&apos;t false cast too much - 2-3 times is usually enough.',
      commonMistakes: ['Too many false casts', 'Inconsistent loops', 'Creep'],
      videoUrl: '/videos/false-cast.mp4'
    },
    {
      name: 'Roll Cast',
      difficulty: 'Beginner',
      uses: 'Trees/obstacles behind, sinking line, close range',
      steps: [
        'Slowly raise rod tip, pulling line',
        'Let line hang behind rod forming D-loop',
        'Line should be on water surface',
        'Accelerate forward powerfully',
        'Stop at 10 o&apos;clock',
        'Line rolls forward on surface'
      ],
      tips: 'Essential skill. No backcast needed. Great for tight spots.',
      commonMistakes: ['Not enough line on water', 'Too fast', 'Poor D-loop'],
      videoUrl: '/videos/roll-cast-fly.mp4'
    },
    {
      name: 'Reach Cast',
      difficulty: 'Intermediate',
      uses: 'Drag-free drifts, cross-currents, mending',
      steps: [
        'Execute normal forward cast',
        'As line extends, reach rod upstream',
        'Line lands with upstream curve',
        'Provides extra drag-free drift',
        'Follow drift with rod tip',
        'Mend as needed'
      ],
      tips: 'Gives you more drag-free drift time. Essential for technical water.',
      commonMistakes: ['Reaching too early', 'Not enough reach', 'Poor timing'],
      videoUrl: '/videos/reach-cast.mp4'
    },
    {
      name: 'Double Haul',
      difficulty: 'Advanced',
      uses: 'Distance, wind, heavy flies, fast casts',
      steps: [
        'Start backcast with line hand pull (1st haul)',
        'Release line hand during backcast pause',
        'Begin forward cast',
        'Pull sharply with line hand (2nd haul)',
        'Release for shoot',
        'Extra line speed and distance'
      ],
      tips: 'Timing is everything. Practice the rhythm. Haul = more line speed.',
      commonMistakes: ['Poor timing', 'Weak hauls', 'Not releasing on shoot'],
      videoUrl: '/videos/double-haul.mp4'
    },
    {
      name: 'Curve Cast',
      difficulty: 'Advanced',
      uses: 'Around obstacles, drag avoidance, precision',
      steps: [
        'Begin normal cast',
        'At end of forward cast, move rod tip in curve',
        'Hook around to side',
        'Line follows rod tip path',
        'Creates curve in line',
        'Fly lands with curved leader'
      ],
      tips: 'Right curve: hook rod tip right. Left curve: hook left.',
      commonMistakes: ['Too much power', 'Wrong timing', 'Inconsistent curve'],
      videoUrl: '/videos/curve-cast.mp4'
    }
  ]
};

// Pennsylvania Insects for Match the Hatch
const PA_AQUATIC_INSECTS = [
  {
    id: 'blue-wing-olive',
    name: 'Blue-Winged Olive (BWO)',
    scientificName: 'Baetis spp.',
    type: 'Mayfly',
    months: ['March', 'April', 'May', 'September', 'October'],
    time: 'Afternoon, cloudy days',
    size: '#16-#20',
    waterTemp: '45-55°F',
    emergence: 'Sporadic, often in bad weather',
    nymph: {
      appearance: 'Small, olive-brown, streamlined',
      habitat: 'Moderate currents, rocks',
      size: '#16-#18',
      patterns: ['Pheasant Tail', 'RS2', 'BWO Nymph']
    },
    emerger: {
      appearance: 'Olive body, emerging wings',
      behavior: 'Stuck in surface film',
      patterns: ['Sparkle Dun', 'RS2', 'BWO Emerger']
    },
    adult: {
      appearance: 'Olive body, gray wings',
      size: '#16-#20',
      patterns: ['Parachute Adams', 'CDC BWO', 'Comparadun']
    },
    points: 15,
    difficulty: 'Intermediate',
    tips: 'Fish are selective during BWO hatches. Match the size carefully. Try emergers first.'
  },
  {
    id: 'sulphur',
    name: 'Sulphur',
    scientificName: 'Ephemerella spp.',
    type: 'Mayfly',
    months: ['May', 'June'],
    time: 'Evening, 7-9 PM',
    size: '#14-#18',
    waterTemp: '55-65°F',
    emergence: 'Predictable, heavy hatches',
    nymph: {
      appearance: 'Yellow-olive, crawler type',
      habitat: 'Slower water, silt/gravel',
      size: '#14-#16',
      patterns: ['Pheasant Tail', 'Hare&apos;s Ear', 'Sulphur Nymph']
    },
    emerger: {
      appearance: 'Yellow body, splitting shuck',
      behavior: 'Long emergence, vulnerable',
      patterns: ['Sparkle Dun Sulphur', 'CDC Emerger']
    },
    adult: {
      appearance: 'Yellow-cream body, pale wings',
      size: '#16-#18',
      patterns: ['Light Cahill', 'Sulphur Dun', 'Parachute Sulphur']
    },
    points: 20,
    difficulty: 'Intermediate',
    tips: 'Fantastic evening hatch. Fish can be very selective. Bring lights for dusk.'
  },
  {
    id: 'hendrickson',
    name: 'Hendrickson',
    scientificName: 'Ephemerella subvaria',
    type: 'Mayfly',
    months: ['April', 'May'],
    time: 'Afternoon, 2-5 PM',
    size: '#12-#14',
    waterTemp: '50-55°F',
    emergence: 'First major spring hatch',
    nymph: {
      appearance: 'Brown, robust, crawler',
      habitat: 'Riffles, moderate flow',
      size: '#12-#14',
      patterns: ['Hare&apos;s Ear', 'Hendrickson Nymph', 'Pheasant Tail']
    },
    emerger: {
      appearance: 'Reddish-brown, emerging',
      behavior: 'Quick emergence',
      patterns: ['CDC Emerger', 'Hendrickson Emerger']
    },
    adult: {
      appearance: 'Pinkish-tan body (male) or olive-brown (female)',
      size: '#12-#14',
      patterns: ['Red Quill (male)', 'Hendrickson Dun (female)', 'Parachute Hendrickson']
    },
    points: 20,
    difficulty: 'Beginner',
    tips: 'Signals spring fishing is ON! Larger flies are easier for beginners.'
  },
  {
    id: 'march-brown',
    name: 'March Brown',
    scientificName: 'Maccaffertium vicarium',
    type: 'Mayfly',
    months: ['May', 'June'],
    time: 'Midday to afternoon',
    size: '#10-#12',
    waterTemp: '52-60°F',
    emergence: 'Good hatch in freestone streams',
    nymph: {
      appearance: 'Brown, mottled, flat',
      habitat: 'Fast water, clinging to rocks',
      size: '#10-#12',
      patterns: ['March Brown Nymph', 'Hare&apos;s Ear', 'Stonefly Nymph']
    },
    emerger: {
      appearance: 'Brown body, emerging wings',
      behavior: 'Surface emergence',
      patterns: ['March Brown Emerger', 'CDC Emerger']
    },
    adult: {
      appearance: 'Brown body, mottled wings',
      size: '#10-#12',
      patterns: ['March Brown Dry', 'Light Cahill', 'Adams']
    },
    points: 15,
    difficulty: 'Beginner',
    tips: 'Large, easy to see. Great for beginners learning to match the hatch.'
  },
  {
    id: 'green-drake',
    name: 'Green Drake',
    scientificName: 'Ephemera guttulata',
    type: 'Mayfly',
    months: ['May', 'June'],
    time: 'Evening, 7-9 PM',
    size: '#8-#10',
    waterTemp: '60-68°F',
    emergence: 'Short season, legendary hatch',
    nymph: {
      appearance: 'Large, cream-brown, burrower',
      habitat: 'Silt, sand, slower water',
      size: '#6-#10',
      patterns: ['Green Drake Nymph', 'Wiggle Nymph', 'Hare&apos;s Ear']
    },
    emerger: {
      appearance: 'Large, yellow-green, struggling',
      behavior: 'Difficult emergence, vulnerable',
      patterns: ['Green Drake Emerger', 'CDC Emerger', 'Cripple']
    },
    adult: {
      appearance: 'Huge, yellow-green body, mottled wings',
      size: '#8-#10',
      patterns: ['Green Drake Dry', 'Extended Body Drake', 'Parachute Drake']
    },
    points: 30,
    difficulty: 'Advanced',
    tips: 'The hatch! Plan your year around it. Short window. Bring big flies and expect big fish.'
  },
  {
    id: 'trico',
    name: 'Trico',
    scientificName: 'Tricorythodes spp.',
    type: 'Mayfly',
    months: ['July', 'August', 'September'],
    time: 'Early morning, 6-10 AM',
    size: '#20-#26',
    waterTemp: '65-75°F',
    emergence: 'Massive spinner falls',
    nymph: {
      appearance: 'Tiny, dark, crawler',
      habitat: 'Slow water, weeds',
      size: '#20-#24',
      patterns: ['Tiny Pheasant Tail', 'RS2', 'Black Beauty']
    },
    emerger: {
      appearance: 'Minute, dark body',
      behavior: 'Quick emergence',
      patterns: ['Trico Emerger', 'CDC Trico']
    },
    adult: {
      appearance: 'Tiny! Black body, white wings (spinner)',
      size: '#22-#26',
      patterns: ['Trico Spinner', 'Black and White', 'Poly-Wing Spinner']
    },
    points: 25,
    difficulty: 'Advanced',
    tips: 'Tiny flies, picky fish. Use 6X-7X tippet. Spinner falls blanket the water. Be patient.'
  },
  {
    id: 'caddis',
    name: 'Caddis',
    scientificName: 'Multiple families',
    type: 'Caddisfly',
    months: ['April', 'May', 'June', 'July', 'August', 'September'],
    time: 'Afternoon to evening',
    size: '#12-#18',
    waterTemp: '50-70°F',
    emergence: 'Sporadic, long season',
    larva: {
      appearance: 'Worm-like, in case or free-living',
      habitat: 'Rocks, vegetation, bottom',
      size: '#12-#16',
      patterns: ['Caddis Larva', 'Green Rockworm', 'Bead Head Caddis']
    },
    pupa: {
      appearance: 'Swims to surface, wings visible',
      behavior: 'Fast emerger, vulnerable',
      patterns: ['Soft Hackle', 'LaFontaine Sparkle Pupa', 'Emergent Caddis']
    },
    adult: {
      appearance: 'Tent-wing shape, tan/olive/brown',
      size: '#12-#18',
      patterns: ['Elk Hair Caddis', 'Goddard Caddis', 'X-Caddis']
    },
    points: 15,
    difficulty: 'Beginner',
    tips: 'One of the most reliable hatches. Fish are aggressive. Try skating or twitching the fly.'
  },
  {
    id: 'stonefly',
    name: 'Stonefly',
    scientificName: 'Multiple families',
    type: 'Stonefly',
    months: ['February', 'March', 'April'],
    time: 'Early spring, all day',
    size: '#6-#10',
    waterTemp: '38-50°F',
    emergence: 'Crawls out on rocks/shore',
    nymph: {
      appearance: 'Large, flat, two tails',
      habitat: 'Fast water, well-oxygenated',
      size: '#4-#10',
      patterns: ['Pat&apos;s Rubber Legs', 'Kaufmann Stone', 'Prince Nymph']
    },
    adult: {
      appearance: 'Large, four wings flat over back',
      size: '#6-#10',
      patterns: ['Stimulator', 'Adult Stonefly', 'Amy&apos;s Ant (large)']
    },
    points: 20,
    difficulty: 'Beginner',
    tips: 'Early season staple. Nymphs work year-round. Adults in spring. Big flies = big fish.'
  },
  {
    id: 'midge',
    name: 'Midge',
    scientificName: 'Chironomidae',
    type: 'Midge',
    months: ['All year, especially winter'],
    time: 'All day, esp. afternoon',
    size: '#18-#26',
    waterTemp: '32-80°F',
    emergence: 'Year-round, consistent',
    larva: {
      appearance: 'Tiny, segmented worm',
      habitat: 'Bottom, silt, slow water',
      size: '#18-#22',
      patterns: ['Zebra Midge', 'Brassie', 'Blood Midge']
    },
    pupa: {
      appearance: 'Curved body, prominent head',
      behavior: 'Hangs in film',
      patterns: ['Zebra Midge', 'WD-40', 'Disco Midge']
    },
    adult: {
      appearance: 'Tiny mosquito-like, black/olive/cream',
      size: '#20-#26',
      patterns: ['Griffith&apos;s Gnat', 'Midge Adult', 'Black Gnat']
    },
    points: 10,
    difficulty: 'Advanced',
    tips: 'Winter fishing lifesaver. Small and technical. Use fine tippet. Fish are sipping.'
  }
];

// Keep original small set for backwards compatibility
const OLD_PA_WATER_BODIES: WaterBody[] = [
  {
    id: 'spring-creek',
    name: 'Spring Creek',
    type: 'Stream',
    county: 'Centre',
    lat: 40.7934,
    lon: -77.8600,
    species: ['brook-trout', 'brown-trout', 'rainbow-trout'],
    stockingSchedule: [
      { date: '2024-04-01', species: 'Rainbow Trout', quantity: 2500, size: 'Adult' },
      { date: '2024-04-15', species: 'Brown Trout', quantity: 1000, size: 'Adult' },
      { date: '2024-10-01', species: 'Brook Trout', quantity: 500, size: 'Adult' }
    ],
    accessPoints: [
      {
        name: 'Fisherman\'s Paradise',
        lat: 40.7934,
        lon: -77.8600,
        amenities: ['Parking', 'Restrooms', 'Wheelchair accessible'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    regulations: 'Fly fishing only, catch & release',
    habitat: 'Spring-fed limestone stream with excellent trout habitat',
    size: '15 miles'
  },
  {
    id: 'lake-raystown',
    name: 'Raystown Lake',
    type: 'Lake',
    county: 'Huntingdon',
    lat: 40.4167,
    lon: -78.0833,
    species: ['smallmouth-bass', 'largemouth-bass', 'walleye', 'muskellunge', 'crappie', 'bluegill', 'yellow-perch', 'channel-catfish'],
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
      }
    ],
    regulations: 'Bass: 15" minimum, Walleye: 18" minimum, Muskie: 40" minimum',
    habitat: '8,300-acre reservoir with rocky points, coves, and deep channels. Excellent structure for bass and muskie.',
    size: '8,300 acres, 30 miles long'
  },
  {
    id: 'lake-erie',
    name: 'Lake Erie (Presque Isle Bay)',
    type: 'Lake',
    county: 'Erie',
    lat: 42.1275,
    lon: -80.0851,
    species: ['smallmouth-bass', 'walleye', 'yellow-perch', 'northern-pike', 'muskellunge', 'channel-catfish'],
    accessPoints: [
      {
        name: 'Presque Isle State Park',
        lat: 42.1275,
        lon: -80.0851,
        amenities: ['Multiple launches', 'Parking', 'Beach', 'Trails', 'Visitor center'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    regulations: 'Check PA & Great Lakes regulations - Special seasons apply',
    habitat: 'World-class fishing for walleye and perch. Protected bay with weed beds and rocky structure.',
    size: '3,200 acres (Presque Isle Bay)'
  },
  {
    id: 'penns-creek',
    name: 'Penns Creek',
    type: 'Stream',
    county: 'Centre/Snyder',
    lat: 40.8670,
    lon: -77.4167,
    species: ['brown-trout', 'smallmouth-bass'],
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
      }
    ],
    regulations: 'Trophy trout section - Special regulations',
    habitat: 'Freestone stream with excellent insect hatches, deep pools',
    size: '67 miles'
  },
  {
    id: 'lake-wallenpaupack',
    name: 'Lake Wallenpaupack',
    type: 'Lake',
    county: 'Pike/Wayne',
    lat: 41.3500,
    lon: -75.1833,
    species: ['smallmouth-bass', 'largemouth-bass', 'walleye', 'yellow-perch', 'crappie', 'bluegill', 'channel-catfish'],
    accessPoints: [
      {
        name: 'Mangan\'s Boat Launch',
        lat: 41.3500,
        lon: -75.1833,
        amenities: ['Boat launch', 'Parking', 'Marina'],
        accessibility: 'Easy',
        parking: true
      }
    ],
    regulations: 'Bass: 12" minimum, No size limits on panfish',
    habitat: '5,700-acre reservoir with rocky shorelines, submerged timber, and deep basins',
    size: '5,700 acres, 52 miles of shoreline'
  }
];

export default function FishingPage() {
  const { award: addPoints } = usePoints();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'stocking' | 'lakes' | 'species' | 'log' | 'conventional' | 'fly' | 'knots' | 'equipment' | 'match-hatch' | 'resources' | 'history'>('map');
  const [selectedWaterBody, setSelectedWaterBody] = useState<WaterBody | null>(null);
  const [selectedSpecies, setSelectedSpecies] = useState<FishSpecies | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCounty, setFilterCounty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLogs, setUserLogs] = useState<FishingLog[]>([]);
  const [showLogForm, setShowLogForm] = useState(false);

  // Log form state
  const [logForm, setLogForm] = useState({
    waterBodyId: '',
    speciesId: '',
    length: '',
    weight: '',
    bait: '',
    weather: '',
    waterTemp: '',
    location: '',
    notes: '',
    released: true
  });
  const [logPhotos, setLogPhotos] = useState<string[]>([]);

  // Match the Hatch game state
  const [matchHatchScore, setMatchHatchScore] = useState(0);
  const [matchHatchStreak, setMatchHatchStreak] = useState(0);
  const [matchedInsects, setMatchedInsects] = useState<string[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<typeof PA_AQUATIC_INSECTS[0] | null>(null);
  const [showHatchGame, setShowHatchGame] = useState(false);
  const [selectedFlyGuess, setSelectedFlyGuess] = useState<string>('');
  
  // Knots/Equipment/Casting state
  const [selectedKnot, setSelectedKnot] = useState<typeof FISHING_KNOTS[0] | null>(null);
  const [selectedCastType, setSelectedCastType] = useState<'conventional' | 'fly'>('conventional');
  const [selectedEquipmentType, setSelectedEquipmentType] = useState<'conventional' | 'fly'>('conventional');

  // Load user logs from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('wla-fishing-logs');
    if (stored) {
      setUserLogs(JSON.parse(stored));
    }
    
    // Load Match the Hatch progress
    const hatchData = localStorage.getItem('wla-match-hatch');
    if (hatchData) {
      const parsed = JSON.parse(hatchData);
      setMatchHatchScore(parsed.score || 0);
      setMatchedInsects(parsed.matched || []);
      setMatchHatchStreak(parsed.streak || 0);
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [-77.7278, 40.9699], // Center of PA
      zoom: 6.5
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true
    }), 'top-right');

    // Add markers for water bodies
    map.current.on('load', () => {
      PA_WATER_BODIES.forEach((waterBody) => {
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.width = '32px';
        el.style.height = '32px';
        el.style.cursor = 'pointer';
        el.innerHTML = waterBody.type === 'Lake' ? '🏞️' : '🌊';
        el.style.fontSize = '24px';

        new mapboxgl.Marker(el)
          .setLngLat([waterBody.lon, waterBody.lat])
          .setPopup(new mapboxgl.Popup().setHTML(`
            <strong>${waterBody.name}</strong><br/>
            ${waterBody.type} - ${waterBody.county} County<br/>
            <button onclick="window.dispatchEvent(new CustomEvent('selectWaterBody', {detail: '${waterBody.id}'}))">
              View Details
            </button>
          `))
          .addTo(map.current!);
      });
    });
  }, []);

  // Handle water body selection
  useEffect(() => {
    const handleSelect = (e: any) => {
      const waterBody = PA_WATER_BODIES.find(w => w.id === e.detail);
      if (waterBody) {
        setSelectedWaterBody(waterBody);
        setActiveTab('map');
      }
    };
    window.addEventListener('selectWaterBody', handleSelect);
    return () => window.removeEventListener('selectWaterBody', handleSelect);
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setLogPhotos(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmitLog = () => {
    if (!logForm.waterBodyId || !logForm.speciesId) {
      alert('Please select a water body and species');
      return;
    }

    const newLog: FishingLog = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      waterBodyId: logForm.waterBodyId,
      speciesId: logForm.speciesId,
      length: logForm.length ? parseFloat(logForm.length) : undefined,
      weight: logForm.weight ? parseFloat(logForm.weight) : undefined,
      bait: logForm.bait,
      weather: logForm.weather,
      waterTemp: logForm.waterTemp ? parseFloat(logForm.waterTemp) : undefined,
      location: logForm.location,
      photos: logPhotos,
      notes: logForm.notes,
      released: logForm.released
    };

    const updated = [newLog, ...userLogs];
    setUserLogs(updated);
    localStorage.setItem('wla-fishing-logs', JSON.stringify(updated));

    // Award points
    const species = PA_FISH_SPECIES.find(s => s.id === logForm.speciesId);
    if (species) {
      addPoints(species.points, `Caught ${species.commonName}`);
    }

    // Reset form
    setLogForm({
      waterBodyId: '',
      speciesId: '',
      length: '',
      weight: '',
      bait: '',
      weather: '',
      waterTemp: '',
      location: '',
      notes: '',
      released: true
    });
    setLogPhotos([]);
    setShowLogForm(false);
  };

  const filteredWaterBodies = PA_WATER_BODIES.filter(w => {
    if (filterType !== 'all' && w.type !== filterType) return false;
    if (filterCounty !== 'all' && w.county !== filterCounty) return false;
    if (searchQuery && !w.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredSpecies = PA_FISH_SPECIES.filter(s => {
    if (searchQuery && !s.commonName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !s.scientificName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const counties = ['all', ...Array.from(new Set(PA_WATER_BODIES.map(w => w.county)))].sort();

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #023047 0%, #0077B6 50%, #00B4D8 100%)', paddingTop: '1rem' }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem 2rem' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', color: 'white', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
            🎣 Pennsylvania Fishing Guide
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.95 }}>
            Complete Fishing Education • Conventional & Fly • Match the Hatch • Knots & Equipment
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { id: 'map', label: '🗺️ Map', icon: '🗺️' },
            { id: 'stocking', label: '📅 Stocking', icon: '🌈' },
            { id: 'lakes', label: '🏞️ Waters', icon: '🏞️' },
            { id: 'species', label: '🐟 Species', icon: '🐟' },
            { id: 'conventional', label: '🎣 Conventional', icon: '🎣' },
            { id: 'fly', label: '🪰 Fly Fishing', icon: '🪰' },
            { id: 'knots', label: '🪢 Knots', icon: '🪢' },
            { id: 'equipment', label: '🎒 Equipment', icon: '🎒' },
            { id: 'match-hatch', label: '🦋 Match Hatch', icon: '🦋' },
            { id: 'resources', label: '📚 Resources', icon: '📚' },
            { id: 'history', label: '📜 History', icon: '📜' },
            { id: 'log', label: '📝 Log', icon: '📝' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="btn"
              style={{
                background: activeTab === tab.id 
                  ? 'linear-gradient(135deg, #FFD60A, #FFB703)'
                  : 'rgba(255,255,255,0.2)',
                color: activeTab === tab.id ? '#023047' : 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(255,214,10,0.3)' : 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Interactive Map Tab */}
        {activeTab === 'map' && (
          <div className="card section">
            <div style={{ display: 'grid', gridTemplateColumns: selectedWaterBody ? '1fr 400px' : '1fr', gap: '1.5rem' }}>
              <div>
                <h2>🗺️ Pennsylvania Waters</h2>
                <p style={{ color: '#6B7280', marginBottom: '1rem' }}>
                  Click markers to explore fishing locations across Pennsylvania
                </p>
                <div 
                  ref={mapContainer} 
                  style={{ 
                    width: '100%', 
                    height: '600px', 
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }} 
                />
              </div>

              {selectedWaterBody && (
                <div className="card" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div>
                      <h3>{selectedWaterBody.name}</h3>
                      <p style={{ color: '#6B7280', marginTop: '0.25rem' }}>
                        {selectedWaterBody.type} • {selectedWaterBody.county} County
                      </p>
                    </div>
                    <button 
                      onClick={() => setSelectedWaterBody(null)}
                      style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4>Overview</h4>
                    <p style={{ color: '#4B5563', lineHeight: 1.6 }}>{selectedWaterBody.habitat}</p>
                    {selectedWaterBody.size && (
                      <p style={{ color: '#6B7280', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                        <strong>Size:</strong> {selectedWaterBody.size}
                      </p>
                    )}
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4>Regulations</h4>
                    <p style={{ color: '#4B5563', lineHeight: 1.6 }}>{selectedWaterBody.regulations}</p>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4>Species Present</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {selectedWaterBody.species.map(speciesId => {
                        const species = PA_FISH_SPECIES.find(s => s.id === speciesId);
                        return species ? (
                          <span 
                            key={speciesId}
                            style={{
                              background: '#E0F2FE',
                              color: '#0C4A6E',
                              padding: '0.5rem 1rem',
                              borderRadius: '8px',
                              fontSize: '0.9rem',
                              fontWeight: 600
                            }}
                          >
                            {species.emoji} {species.commonName}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>

                  {selectedWaterBody.stockingSchedule && selectedWaterBody.stockingSchedule.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h4>📅 Stocking Schedule</h4>
                      {selectedWaterBody.stockingSchedule.map((event, idx) => (
                        <div 
                          key={idx}
                          style={{
                            background: '#F0F9FF',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            marginTop: '0.5rem',
                            borderLeft: '4px solid #0077B6'
                          }}
                        >
                          <div style={{ fontWeight: 600, color: '#023047' }}>{event.species}</div>
                          <div style={{ fontSize: '0.9rem', color: '#4B5563', marginTop: '0.25rem' }}>
                            {new Date(event.date).toLocaleDateString()} • {event.quantity} fish • {event.size}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <h4>🚗 Access Points</h4>
                    {selectedWaterBody.accessPoints.map((access, idx) => (
                      <div 
                        key={idx}
                        style={{
                          background: '#F9FAFB',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          marginTop: '0.5rem'
                        }}
                      >
                        <div style={{ fontWeight: 600, color: '#023047' }}>{access.name}</div>
                        <div style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '0.25rem' }}>
                          {access.amenities.join(' • ')}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#059669', marginTop: '0.25rem', fontWeight: 600 }}>
                          Accessibility: {access.accessibility}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Trout Stocking Tab */}
        {activeTab === 'stocking' && (
          <div className="card section">
            <h2>📅 2024 Trout Stocking Schedule</h2>
            <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
              Plan your fishing trips around PFBC stocking schedules
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
              {PA_WATER_BODIES
                .filter(w => w.stockingSchedule && w.stockingSchedule.length > 0)
                .map(waterBody => (
                  <div 
                    key={waterBody.id}
                    className="card"
                    style={{ background: '#F0F9FF', border: '2px solid #0077B6' }}
                  >
                    <h3>{waterBody.name}</h3>
                    <p style={{ color: '#6B7280', marginBottom: '1rem' }}>
                      {waterBody.type} • {waterBody.county} County
                    </p>

                    {waterBody.stockingSchedule!.map((event, idx) => (
                      <div 
                        key={idx}
                        style={{
                          background: 'white',
                          padding: '1rem',
                          borderRadius: '8px',
                          marginTop: '0.75rem',
                          borderLeft: '4px solid #0077B6'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <div style={{ fontWeight: 700, color: '#023047', fontSize: '1.1rem' }}>
                            {event.species}
                          </div>
                          <div style={{ 
                            background: '#FFD60A', 
                            color: '#023047', 
                            padding: '0.25rem 0.75rem', 
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontWeight: 700
                          }}>
                            {event.size}
                          </div>
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#4B5563' }}>
                          📅 {new Date(event.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#059669', fontWeight: 600, marginTop: '0.25rem' }}>
                          🐟 {event.quantity.toLocaleString()} fish
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => {
                        setSelectedWaterBody(waterBody);
                        setActiveTab('map');
                      }}
                      className="btn"
                      style={{
                        marginTop: '1rem',
                        width: '100%',
                        background: '#0077B6',
                        color: 'white'
                      }}
                    >
                      View on Map
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Lakes & Streams Tab */}
        {activeTab === 'lakes' && (
          <div className="card section">
            <h2>🏞️ Lakes & Streams Directory</h2>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="input"
                style={{ minWidth: '150px' }}
              >
                <option value="all">All Types</option>
                <option value="Lake">Lakes</option>
                <option value="Stream">Streams</option>
                <option value="River">Rivers</option>
              </select>

              <select 
                value={filterCounty}
                onChange={(e) => setFilterCounty(e.target.value)}
                className="input"
                style={{ minWidth: '150px' }}
              >
                {counties.map(county => (
                  <option key={county} value={county}>
                    {county === 'all' ? 'All Counties' : `${county} County`}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input"
                style={{ flex: 1, minWidth: '200px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
              {filteredWaterBodies.map(waterBody => (
                <div key={waterBody.id} className="card" style={{ background: '#F9FAFB' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h3>{waterBody.name}</h3>
                    <span style={{ fontSize: '2rem' }}>
                      {waterBody.type === 'Lake' ? '🏞️' : '🌊'}
                    </span>
                  </div>
                  
                  <p style={{ color: '#6B7280', marginBottom: '1rem' }}>
                    {waterBody.type} • {waterBody.county} County
                  </p>

                  {waterBody.size && (
                    <p style={{ color: '#4B5563', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                      <strong>Size:</strong> {waterBody.size}
                    </p>
                  )}

                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#023047' }}>
                      Species ({waterBody.species.length}):
                    </strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {waterBody.species.slice(0, 4).map(speciesId => {
                        const species = PA_FISH_SPECIES.find(s => s.id === speciesId);
                        return species ? (
                          <span key={speciesId} style={{ fontSize: '1.5rem' }} title={species.commonName}>
                            {species.emoji}
                          </span>
                        ) : null;
                      })}
                      {waterBody.species.length > 4 && (
                        <span style={{ color: '#6B7280', fontSize: '0.9rem', alignSelf: 'center' }}>
                          +{waterBody.species.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedWaterBody(waterBody);
                      setActiveTab('map');
                    }}
                    className="btn"
                    style={{
                      width: '100%',
                      background: '#0077B6',
                      color: 'white'
                    }}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Species Guide Tab */}
        {activeTab === 'species' && (
          <div className="card section">
            <h2>🐟 Pennsylvania Fish Species Guide</h2>
            <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
              Habitat requirements, best baits, and fishing tips for PA species
            </p>

            <input
              type="text"
              placeholder="Search species..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
              style={{ marginBottom: '1.5rem' }}
            />

            {selectedSpecies ? (
              <div>
                <button 
                  onClick={() => setSelectedSpecies(null)}
                  className="btn-outline"
                  style={{ marginBottom: '1rem' }}
                >
                  ← Back to All Species
                </button>

                <div className="card" style={{ background: '#F0F9FF', border: '3px solid #0077B6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                    <div>
                      <h2>{selectedSpecies.emoji} {selectedSpecies.commonName}</h2>
                      <p style={{ fontStyle: 'italic', color: '#6B7280', marginTop: '0.25rem' }}>
                        {selectedSpecies.scientificName}
                      </p>
                      <span style={{
                        display: 'inline-block',
                        background: '#FFD60A',
                        color: '#023047',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        fontWeight: 700,
                        marginTop: '0.5rem'
                      }}>
                        {selectedSpecies.category}
                      </span>
                    </div>
                    <div style={{
                      background: '#059669',
                      color: 'white',
                      padding: '0.75rem 1.25rem',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '1.1rem'
                    }}>
                      +{selectedSpecies.points} Points
                    </div>
                  </div>

                  <p style={{ fontSize: '1.1rem', color: '#023047', marginBottom: '2rem', lineHeight: 1.6 }}>
                    {selectedSpecies.description}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                    <div>
                      <h3 style={{ color: '#023047', marginBottom: '1rem' }}>🏞️ Habitat Requirements</h3>
                      
                      <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ display: 'block', color: '#0077B6', marginBottom: '0.5rem' }}>
                          Water Type:
                        </strong>
                        <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: 1.8 }}>
                          {selectedSpecies.habitat.waterType.map((type, idx) => (
                            <li key={idx} style={{ color: '#4B5563' }}>{type}</li>
                          ))}
                        </ul>
                      </div>

                      <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ display: 'block', color: '#0077B6', marginBottom: '0.25rem' }}>
                          Temperature:
                        </strong>
                        <p style={{ color: '#4B5563', margin: 0 }}>{selectedSpecies.habitat.temperature}</p>
                      </div>

                      <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ display: 'block', color: '#0077B6', marginBottom: '0.25rem' }}>
                          Dissolved Oxygen:
                        </strong>
                        <p style={{ color: '#4B5563', margin: 0 }}>{selectedSpecies.habitat.oxygen}</p>
                      </div>

                      <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ display: 'block', color: '#0077B6', marginBottom: '0.25rem' }}>
                          Preferred Depth:
                        </strong>
                        <p style={{ color: '#4B5563', margin: 0 }}>{selectedSpecies.habitat.depth}</p>
                      </div>

                      <div>
                        <strong style={{ display: 'block', color: '#0077B6', marginBottom: '0.5rem' }}>
                          Cover & Structure:
                        </strong>
                        <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: 1.8 }}>
                          {selectedSpecies.habitat.cover.map((cover, idx) => (
                            <li key={idx} style={{ color: '#4B5563' }}>{cover}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 style={{ color: '#023047', marginBottom: '1rem' }}>🎣 Fishing Info</h3>
                      
                      <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ display: 'block', color: '#0077B6', marginBottom: '0.5rem' }}>
                          Best Baits:
                        </strong>
                        <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: 1.8 }}>
                          {selectedSpecies.bestBait.map((bait, idx) => (
                            <li key={idx} style={{ color: '#4B5563' }}>{bait}</li>
                          ))}
                        </ul>
                      </div>

                      <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ display: 'block', color: '#0077B6', marginBottom: '0.25rem' }}>
                          Best Season:
                        </strong>
                        <p style={{ color: '#4B5563', margin: 0 }}>{selectedSpecies.season}</p>
                      </div>

                      <div style={{
                        background: '#FEF3C7',
                        border: '2px solid #F59E0B',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginTop: '1.5rem'
                      }}>
                        <strong style={{ display: 'block', color: '#92400E', marginBottom: '0.5rem' }}>
                          ⚖️ Regulations:
                        </strong>
                        <p style={{ color: '#78350F', margin: 0, fontSize: '0.95rem' }}>
                          {selectedSpecies.regulations}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    background: '#E0F2FE',
                    border: '2px solid #0077B6',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <h3 style={{ color: '#023047', marginBottom: '1rem' }}>📍 Where to Find This Species</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
                      {PA_WATER_BODIES
                        .filter(w => w.species.includes(selectedSpecies.id))
                        .map(waterBody => (
                          <button
                            key={waterBody.id}
                            onClick={() => {
                              setSelectedWaterBody(waterBody);
                              setActiveTab('map');
                            }}
                            className="btn"
                            style={{
                              background: 'white',
                              color: '#0077B6',
                              border: '2px solid #0077B6'
                            }}
                          >
                            {waterBody.name}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {filteredSpecies.map(species => (
                  <div 
                    key={species.id}
                    className="card"
                    onClick={() => setSelectedSpecies(species)}
                    style={{
                      cursor: 'pointer',
                      background: '#F9FAFB',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                      <div>
                        <h3>{species.emoji} {species.commonName}</h3>
                        <p style={{ fontStyle: 'italic', color: '#6B7280', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                          {species.scientificName}
                        </p>
                      </div>
                      <span style={{
                        background: '#059669',
                        color: 'white',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: 700
                      }}>
                        +{species.points}
                      </span>
                    </div>

                    <span style={{
                      display: 'inline-block',
                      background: '#E0F2FE',
                      color: '#0C4A6E',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      marginBottom: '0.75rem'
                    }}>
                      {species.category}
                    </span>

                    <p style={{ color: '#4B5563', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                      {species.description}
                    </p>

                    <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                      <strong style={{ color: '#023047' }}>Best Season:</strong> {species.season}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Fishing Log Tab */}
        {activeTab === 'log' && (
          <div className="card section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2>📝 My Fishing Log</h2>
                <p style={{ color: '#6B7280', marginTop: '0.5rem' }}>
                  Track your catches and earn points • {userLogs.length} total entries
                </p>
              </div>
              <button
                onClick={() => setShowLogForm(!showLogForm)}
                className="btn"
                style={{
                  background: 'linear-gradient(135deg, #059669, #047857)',
                  color: 'white'
                }}
              >
                {showLogForm ? '✕ Cancel' : '+ Log a Catch'}
              </button>
            </div>

            {showLogForm && (
              <div className="card" style={{ background: '#F0FDF4', border: '2px solid #059669', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>🎣 Log New Catch</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="label">Water Body *</label>
                    <select
                      value={logForm.waterBodyId}
                      onChange={(e) => setLogForm({ ...logForm, waterBodyId: e.target.value })}
                      className="input"
                      required
                    >
                      <option value="">Select water body...</option>
                      {PA_WATER_BODIES.map(w => (
                        <option key={w.id} value={w.id}>{w.name} ({w.type})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">Species *</label>
                    <select
                      value={logForm.speciesId}
                      onChange={(e) => setLogForm({ ...logForm, speciesId: e.target.value })}
                      className="input"
                      required
                    >
                      <option value="">Select species...</option>
                      {PA_FISH_SPECIES.map(s => (
                        <option key={s.id} value={s.id}>{s.emoji} {s.commonName}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">Length (inches)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={logForm.length}
                      onChange={(e) => setLogForm({ ...logForm, length: e.target.value })}
                      className="input"
                      placeholder="e.g. 14.5"
                    />
                  </div>

                  <div>
                    <label className="label">Weight (lbs)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={logForm.weight}
                      onChange={(e) => setLogForm({ ...logForm, weight: e.target.value })}
                      className="input"
                      placeholder="e.g. 2.3"
                    />
                  </div>

                  <div>
                    <label className="label">Bait/Lure</label>
                    <input
                      type="text"
                      value={logForm.bait}
                      onChange={(e) => setLogForm({ ...logForm, bait: e.target.value })}
                      className="input"
                      placeholder="e.g. Nightcrawler"
                    />
                  </div>

                  <div>
                    <label className="label">Weather</label>
                    <input
                      type="text"
                      value={logForm.weather}
                      onChange={(e) => setLogForm({ ...logForm, weather: e.target.value })}
                      className="input"
                      placeholder="e.g. Sunny, 72°F"
                    />
                  </div>

                  <div>
                    <label className="label">Water Temp (°F)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={logForm.waterTemp}
                      onChange={(e) => setLogForm({ ...logForm, waterTemp: e.target.value })}
                      className="input"
                      placeholder="e.g. 65"
                    />
                  </div>

                  <div>
                    <label className="label">Specific Location</label>
                    <input
                      type="text"
                      value={logForm.location}
                      onChange={(e) => setLogForm({ ...logForm, location: e.target.value })}
                      className="input"
                      placeholder="e.g. North shore, near dock"
                    />
                  </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <label className="label">Notes</label>
                  <textarea
                    value={logForm.notes}
                    onChange={(e) => setLogForm({ ...logForm, notes: e.target.value })}
                    className="input"
                    rows={3}
                    placeholder="Add any additional details..."
                  />
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <label className="label">Photos</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="input"
                  />
                  {logPhotos.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      {logPhotos.map((photo, idx) => (
                        <img 
                          key={idx}
                          src={photo} 
                          alt={`Upload ${idx + 1}`}
                          style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={logForm.released}
                      onChange={(e) => setLogForm({ ...logForm, released: e.target.checked })}
                      style={{ width: '20px', height: '20px' }}
                    />
                    <span style={{ fontSize: '1rem', color: '#023047' }}>
                      Fish was released (catch & release)
                    </span>
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button
                    onClick={handleSubmitLog}
                    className="btn"
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #059669, #047857)',
                      color: 'white'
                    }}
                  >
                    💾 Save Catch
                  </button>
                  <button
                    onClick={() => {
                      setShowLogForm(false);
                      setLogForm({
                        waterBodyId: '',
                        speciesId: '',
                        length: '',
                        weight: '',
                        bait: '',
                        weather: '',
                        waterTemp: '',
                        location: '',
                        notes: '',
                        released: true
                      });
                      setLogPhotos([]);
                    }}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {userLogs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#6B7280' }}>
                <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎣</div>
                <h3 style={{ color: '#374151' }}>No Catches Logged Yet</h3>
                <p>Start logging your catches to track your fishing success and earn points!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {userLogs.map(log => {
                  const waterBody = PA_WATER_BODIES.find(w => w.id === log.waterBodyId);
                  const species = PA_FISH_SPECIES.find(s => s.id === log.speciesId);
                  
                  return (
                    <div key={log.id} className="card" style={{ background: '#F9FAFB' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div>
                          <h3>{species?.emoji} {species?.commonName}</h3>
                          <p style={{ color: '#6B7280', marginTop: '0.25rem' }}>
                            {waterBody?.name} • {new Date(log.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <div style={{
                          background: log.released ? '#ECFDF5' : '#FEF3C7',
                          color: log.released ? '#065F46' : '#92400E',
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          height: 'fit-content'
                        }}>
                          {log.released ? '♻️ Released' : '🎣 Kept'}
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                        {log.length && (
                          <div>
                            <strong style={{ display: 'block', color: '#6B7280', fontSize: '0.85rem' }}>Length</strong>
                            <p style={{ color: '#023047', fontSize: '1.1rem', fontWeight: 600, margin: '0.25rem 0 0' }}>
                              {log.length}&quot;
                            </p>
                          </div>
                        )}
                        {log.weight && (
                          <div>
                            <strong style={{ display: 'block', color: '#6B7280', fontSize: '0.85rem' }}>Weight</strong>
                            <p style={{ color: '#023047', fontSize: '1.1rem', fontWeight: 600, margin: '0.25rem 0 0' }}>
                              {log.weight} lbs
                            </p>
                          </div>
                        )}
                        {log.bait && (
                          <div>
                            <strong style={{ display: 'block', color: '#6B7280', fontSize: '0.85rem' }}>Bait</strong>
                            <p style={{ color: '#023047', fontSize: '1.1rem', fontWeight: 600, margin: '0.25rem 0 0' }}>
                              {log.bait}
                            </p>
                          </div>
                        )}
                        {log.waterTemp && (
                          <div>
                            <strong style={{ display: 'block', color: '#6B7280', fontSize: '0.85rem' }}>Water Temp</strong>
                            <p style={{ color: '#023047', fontSize: '1.1rem', fontWeight: 600, margin: '0.25rem 0 0' }}>
                              {log.waterTemp}°F
                            </p>
                          </div>
                        )}
                      </div>

                      {log.photos.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', overflowX: 'auto' }}>
                          {log.photos.map((photo, idx) => (
                            <img 
                              key={idx}
                              src={photo} 
                              alt={`Catch ${idx + 1}`}
                              style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                            />
                          ))}
                        </div>
                      )}

                      {log.notes && (
                        <p style={{ color: '#4B5563', fontSize: '0.95rem', fontStyle: 'italic', borderLeft: '3px solid #0077B6', paddingLeft: '1rem' }}>
                          {log.notes}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Conventional Fishing Tab */}
        {activeTab === 'conventional' && (
          <div className="card section">
            <h2>🎣 Conventional Fishing Guide</h2>
            <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
              Master spinning, baitcasting, and conventional techniques for PA waters
            </p>

            <div style={{ display: 'grid', gap: '2rem' }}>
              {/* Lure Fishing Section */}
              <div className="card" style={{ background: '#F0F9FF' }}>
                <h3>🎯 Lure Fishing Techniques</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                  {FISHING_EQUIPMENT.conventional.lures.map((lure, idx) => (
                    <div key={idx} className="card" style={{ background: 'white' }}>
                      <h4 style={{ color: '#0077B6', marginBottom: '0.75rem' }}>{lure.category}</h4>
                      <div style={{ marginBottom: '0.75rem' }}>
                        <strong style={{ display: 'block', fontSize: '0.9rem', color: '#6B7280' }}>Types:</strong>
                        <p style={{ color: '#4B5563', marginTop: '0.25rem' }}>{lure.types.join(', ')}</p>
                      </div>
                      <div style={{ marginBottom: '0.75rem' }}>
                        <strong style={{ display: 'block', fontSize: '0.9rem', color: '#6B7280' }}>Best For:</strong>
                        <p style={{ color: '#4B5563', marginTop: '0.25rem' }}>{lure.uses}</p>
                      </div>
                      <div style={{ marginBottom: '0.75rem' }}>
                        <strong style={{ display: 'block', fontSize: '0.9rem', color: '#6B7280' }}>Action:</strong>
                        <p style={{ color: '#4B5563', marginTop: '0.25rem' }}>{lure.action}</p>
                      </div>
                      <div style={{ background: '#FEF3C7', padding: '0.75rem', borderRadius: '8px', marginTop: '0.75rem' }}>
                        <strong style={{ fontSize: '0.9rem', color: '#92400E' }}>💡 Pro Tip:</strong>
                        <p style={{ fontSize: '0.9rem', color: '#78350F', marginTop: '0.25rem' }}>{lure.tips}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Bait Section */}
              <div className="card" style={{ background: '#F0FDF4' }}>
                <h3>🪱 Live & Prepared Bait Guide</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                  {FISHING_EQUIPMENT.conventional.bait.map((bait, idx) => (
                    <div key={idx} className="card" style={{ background: 'white' }}>
                      <h4 style={{ color: '#059669' }}>{bait.type}</h4>
                      <div style={{ marginBottom: '0.75rem' }}>
                        <strong style={{ display: 'block', fontSize: '0.9rem', color: '#6B7280' }}>Options:</strong>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                          {bait.options.map((opt, i) => (
                            <span key={i} style={{ background: '#ECFDF5', color: '#065F46', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                              {opt}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong style={{ fontSize: '0.9rem', color: '#6B7280' }}>Storage:</strong>
                        <p style={{ fontSize: '0.9rem', color: '#4B5563', marginTop: '0.25rem' }}>{bait.storage}</p>
                      </div>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong style={{ fontSize: '0.9rem', color: '#6B7280' }}>Best For:</strong>
                        <p style={{ fontSize: '0.9rem', color: '#4B5563', marginTop: '0.25rem' }}>{bait.uses}</p>
                      </div>
                      <div style={{ background: '#FEF3C7', padding: '0.75rem', borderRadius: '8px', marginTop: '0.75rem' }}>
                        <strong style={{ fontSize: '0.9rem', color: '#92400E' }}>💡 Tip:</strong>
                        <p style={{ fontSize: '0.9rem', color: '#78350F', marginTop: '0.25rem' }}>{bait.tips}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Casting Guide */}
              <div className="card" style={{ background: '#FEF2F2' }}>
                <h3>🎯 Conventional Casting Techniques</h3>
                <p style={{ color: '#6B7280', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                  Master these essential casts for spinning and baitcasting setups
                </p>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {CASTING_TECHNIQUES.conventional.map((cast, idx) => (
                    <div key={idx} className="card" style={{ background: 'white' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <h4 style={{ color: '#DC2626' }}>{cast.name}</h4>
                        <span style={{ 
                          background: cast.difficulty === 'Beginner' ? '#ECFDF5' : cast.difficulty === 'Intermediate' ? '#FEF3C7' : '#FEE2E2',
                          color: cast.difficulty === 'Beginner' ? '#065F46' : cast.difficulty === 'Intermediate' ? '#92400E' : '#991B1B',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          fontWeight: 600
                        }}>
                          {cast.difficulty}
                        </span>
                      </div>
                      <p style={{ color: '#6B7280', fontSize: '0.95rem', marginBottom: '1rem' }}>
                        <strong>Use:</strong> {cast.uses}
                      </p>
                      <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#374151' }}>Steps:</strong>
                        <ol style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
                          {cast.steps.map((step, i) => (
                            <li key={i} style={{ color: '#4B5563', fontSize: '0.95rem' }}>{step}</li>
                          ))}
                        </ol>
                      </div>
                      <div style={{ background: '#DBEAFE', padding: '1rem', borderRadius: '8px' }}>
                        <strong style={{ color: '#1E40AF' }}>💡 Tips:</strong>
                        <p style={{ color: '#1E3A8A', marginTop: '0.5rem', fontSize: '0.95rem' }}>{cast.tips}</p>
                        <p style={{ color: '#7C3AED', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                          <strong>Common Mistakes:</strong> {cast.commonMistakes.join(', ')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fly Fishing Tab */}
        {activeTab === 'fly' && (
          <div className="card section">
            <h2>🪰 Fly Fishing Guide for Pennsylvania</h2>
            <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
              Complete fly fishing education from dry flies to nymphing techniques
            </p>

            <div style={{ display: 'grid', gap: '2rem' }}>
              {/* Fly Categories */}
              <div className="card" style={{ background: '#FFF7ED' }}>
                <h3>🦋 Fly Pattern Categories</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                  {FISHING_EQUIPMENT.fly.flies.map((flyCategory, idx) => (
                    <div key={idx} className="card" style={{ background: 'white' }}>
                      <h4 style={{ color: '#EA580C', marginBottom: '0.75rem' }}>{flyCategory.category}</h4>
                      <p style={{ color: '#6B7280', fontSize: '0.95rem', marginBottom: '1rem' }}>
                        {flyCategory.purpose}
                      </p>
                      <div style={{ marginBottom: '0.75rem' }}>
                        <strong style={{ display: 'block', fontSize: '0.9rem', color: '#374151' }}>Common Patterns:</strong>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                          {flyCategory.types.map((type, i) => (
                            <span key={i} style={{ background: '#FFF7ED', color: '#9A3412', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong style={{ fontSize: '0.9rem', color: '#374151' }}>Size Range:</strong>
                        <p style={{ fontSize: '0.9rem', color: '#4B5563', marginTop: '0.25rem' }}>{flyCategory.sizes}</p>
                      </div>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong style={{ fontSize: '0.9rem', color: '#374151' }}>When to Use:</strong>
                        <p style={{ fontSize: '0.9rem', color: '#4B5563', marginTop: '0.25rem' }}>{flyCategory.when}</p>
                      </div>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong style={{ fontSize: '0.9rem', color: '#374151' }}>Techniques:</strong>
                        <p style={{ fontSize: '0.9rem', color: '#4B5563', marginTop: '0.25rem' }}>{flyCategory.techniques}</p>
                      </div>
                      <div style={{ background: '#DBEAFE', padding: '0.75rem', borderRadius: '8px', marginTop: '0.75rem' }}>
                        <strong style={{ fontSize: '0.9rem', color: '#1E40AF' }}>🎒 Must-Have Flies:</strong>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                          {flyCategory.mustHave.map((fly, i) => (
                            <li key={i} style={{ fontSize: '0.85rem', color: '#1E3A8A' }}>{fly}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fly Fishing Techniques */}
              <div className="card" style={{ background: '#F0F9FF' }}>
                <h3>🎯 Fly Fishing Techniques</h3>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4>Dry Fly Fishing</h4>
                  <p style={{ color: '#6B7280', marginBottom: '1rem' }}>
                    The most visual and exciting form of fly fishing. Watch fish rise to take your fly on the surface.
                  </p>
                  <div style={{ background: 'white', padding: '1rem', borderRadius: '8px' }}>
                    <strong>Key Techniques:</strong>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', lineHeight: 1.8 }}>
                      <li><strong>Dead Drift:</strong> Let fly float naturally with current, no drag</li>
                      <li><strong>Upstream Presentation:</strong> Cast upstream, retrieve slack as fly drifts down</li>
                      <li><strong>Mending:</strong> Flip line upstream to extend drag-free drift</li>
                      <li><strong>Matching Hatch Size:</strong> Critical for selective fish - match insect size exactly</li>
                    </ul>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h4>Nymph Fishing</h4>
                  <p style={{ color: '#6B7280', marginBottom: '1rem' }}>
                    Accounts for 90% of a trout&apos;s diet. Master nymphing to catch more fish.
                  </p>
                  <div style={{ background: 'white', padding: '1rem', borderRadius: '8px' }}>
                    <strong>Key Techniques:</strong>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', lineHeight: 1.8 }}>
                      <li><strong>Indicator Nymphing:</strong> Use strike indicator (bobber), dead drift nymphs near bottom</li>
                      <li><strong>Euro Nymphing (Czech/Polish):</strong> No indicator, tight line, feel strikes</li>
                      <li><strong>High-Sticking:</strong> Keep line off water, rod high, feel everything</li>
                      <li><strong>Two-Fly Rig:</strong> Heavy fly + dropper for different depths</li>
                    </ul>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h4>Streamer Fishing</h4>
                  <p style={{ color: '#6B7280', marginBottom: '1rem' }}>
                    Target big, aggressive fish with baitfish imitations. Active, exciting fishing.
                  </p>
                  <div style={{ background: 'white', padding: '1rem', borderRadius: '8px' }}>
                    <strong>Key Techniques:</strong>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', lineHeight: 1.8 }}>
                      <li><strong>Strip Retrieve:</strong> Pull line in short, erratic strips to imitate fleeing baitfish</li>
                      <li><strong>Swing:</strong> Let streamer swing across current, twitch rod tip</li>
                      <li><strong>Jerk-Strip-Pause:</strong> Jerk rod, strip line, pause - triggers strikes</li>
                      <li><strong>Bank Beating:</strong> Cast tight to banks where big fish ambush</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4>Emerger Fishing</h4>
                  <p style={{ color: '#6B7280', marginBottom: '1rem' }}>
                    Target insects transitioning from nymph to adult - the most vulnerable stage.
                  </p>
                  <div style={{ background: 'white', padding: '1rem', borderRadius: '8px' }}>
                    <strong>Key Techniques:</strong>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', lineHeight: 1.8 }}>
                      <li><strong>In the Film:</strong> Fly hangs in surface film, half submerged</li>
                      <li><strong>Greased Leader:</strong> Float leader to keep emerger just under surface</li>
                      <li><strong>Subtle Takes:</strong> Watch for swirls, gentle rises - set hook gently</li>
                      <li><strong>Transition Times:</strong> Fish emergers when you see fish rising but not taking dries</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Fly Casting Guide */}
              <div className="card" style={{ background: '#F5F3FF' }}>
                <h3>🎣 Fly Casting Mastery</h3>
                <p style={{ color: '#6B7280', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                  Learn the elegant art of fly casting - timing and rhythm over power
                </p>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {CASTING_TECHNIQUES.fly.map((cast, idx) => (
                    <div key={idx} className="card" style={{ background: 'white' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <h4 style={{ color: '#7C3AED' }}>{cast.name}</h4>
                        <span style={{ 
                          background: cast.difficulty === 'Beginner' ? '#ECFDF5' : cast.difficulty === 'Intermediate' ? '#FEF3C7' : '#FEE2E2',
                          color: cast.difficulty === 'Beginner' ? '#065F46' : cast.difficulty === 'Intermediate' ? '#92400E' : '#991B1B',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          fontWeight: 600
                        }}>
                          {cast.difficulty}
                        </span>
                      </div>
                      <p style={{ color: '#6B7280', fontSize: '0.95rem', marginBottom: '1rem' }}>
                        <strong>Use:</strong> {cast.uses}
                      </p>
                      <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#374151' }}>Steps:</strong>
                        <ol style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
                          {cast.steps.map((step, i) => (
                            <li key={i} style={{ color: '#4B5563', fontSize: '0.95rem' }}>{step}</li>
                          ))}
                        </ol>
                      </div>
                      <div style={{ background: '#FEF3C7', padding: '1rem', borderRadius: '8px' }}>
                        <strong style={{ color: '#92400E' }}>💡 Essential Tips:</strong>
                        <p style={{ color: '#78350F', marginTop: '0.5rem', fontSize: '0.95rem' }}>{cast.tips}</p>
                        <p style={{ color: '#7C3AED', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                          <strong>Avoid:</strong> {cast.commonMistakes.join(', ')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
```

## Knots Tab

```tsx
        {/* Knots Tab */}
        {activeTab === 'knots' && (
          <div className="card section">
            <h2>🪢 Essential Fishing Knots</h2>
            <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
              Master these critical knots for conventional and fly fishing success
            </p>

            {selectedKnot ? (
              <div>
                <button 
                  onClick={() => setSelectedKnot(null)}
                  className="btn-outline"
                  style={{ marginBottom: '1.5rem' }}
                >
                  ← Back to All Knots
                </button>

                <div className="card" style={{ background: '#F9FAFB' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                    <div>
                      <h3>{selectedKnot.name}</h3>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ 
                          background: selectedKnot.difficulty === 'Beginner' ? '#ECFDF5' : selectedKnot.difficulty === 'Intermediate' ? '#FEF3C7' : '#FEE2E2',
                          color: selectedKnot.difficulty === 'Beginner' ? '#065F46' : selectedKnot.difficulty === 'Intermediate' ? '#92400E' : '#991B1B',
                          padding: '0.35rem 0.85rem',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          fontWeight: 600
                        }}>
                          {selectedKnot.difficulty}
                        </span>
                        <span style={{ 
                          background: '#DBEAFE',
                          color: '#1E40AF',
                          padding: '0.35rem 0.85rem',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          fontWeight: 600
                        }}>
                          {selectedKnot.strength} Strength
                        </span>
                        <span style={{ 
                          background: '#F3E8FF',
                          color: '#6B21A8',
                          padding: '0.35rem 0.85rem',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          fontWeight: 600
                        }}>
                          {selectedKnot.discipline}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <h4>Common Uses:</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                      {selectedKnot.uses.map((use, i) => (
                        <span key={i} style={{ background: '#ECFDF5', color: '#065F46', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <h4>Tying Steps:</h4>
                    <ol style={{ paddingLeft: '1.5rem', lineHeight: 2, marginTop: '0.75rem' }}>
                      {selectedKnot.steps.map((step, i) => (
                        <li key={i} style={{ color: '#374151', fontSize: '1rem', marginBottom: '0.5rem' }}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Visual Diagram:</h4>
                    <pre style={{ 
                      background: '#F3F4F6', 
                      padding: '1.5rem', 
                      borderRadius: '8px', 
                      overflow: 'auto',
                      fontSize: '1.1rem',
                      lineHeight: 1.6,
                      color: '#1F2937'
                    }}>
                      {selectedKnot.diagram}
                    </pre>
                  </div>

                  <div style={{ background: '#FEF3C7', border: '2px solid #F59E0B', padding: '1.5rem', borderRadius: '12px' }}>
                    <h4 style={{ color: '#92400E', marginBottom: '0.75rem' }}>💡 Pro Tips:</h4>
                    <p style={{ color: '#78350F', fontSize: '1rem', lineHeight: 1.6 }}>{selectedKnot.tips}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {FISHING_KNOTS.map((knot) => (
                  <div 
                    key={knot.id}
                    className="card"
                    onClick={() => setSelectedKnot(knot)}
                    style={{
                      cursor: 'pointer',
                      background: '#F9FAFB',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                      <h3>{knot.name}</h3>
                      <span style={{ 
                        background: knot.difficulty === 'Beginner' ? '#ECFDF5' : knot.difficulty === 'Intermediate' ? '#FEF3C7' : '#FEE2E2',
                        color: knot.difficulty === 'Beginner' ? '#065F46' : knot.difficulty === 'Intermediate' ? '#92400E' : '#991B1B',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 600
                      }}>
                        {knot.difficulty}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>
                        <strong>Strength:</strong> {knot.strength}
                      </span>
                      <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>
                        <strong>For:</strong> {knot.discipline}
                      </span>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <strong style={{ fontSize: '0.9rem', color: '#374151' }}>Best Uses:</strong>
                      <p style={{ fontSize: '0.9rem', color: '#4B5563', marginTop: '0.5rem' }}>
                        {knot.uses.join(', ')}
                      </p>
                    </div>

                    <button 
                      className="btn"
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #0077B6, #023047)',
                        color: 'white'
                      }}
                    >
                      View Instructions →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
```

## Equipment Tab

```tsx
        {/* Equipment Tab */}
        {activeTab === 'equipment' && (
          <div className="card section">
            <h2>🎒 Fishing Equipment Guide</h2>
            <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
              Everything you need to know about rods, reels, line, and gear
            </p>

            {/* Discipline Selector */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
              <button
                onClick={() => setSelectedEquipmentType('conventional')}
                className="btn"
                style={{
                  background: selectedEquipmentType === 'conventional' 
                    ? 'linear-gradient(135deg, #0077B6, #023047)'
                    : 'rgba(255,255,255,0.2)',
                  color: selectedEquipmentType === 'conventional' ? 'white' : '#023047',
                  padding: '0.75rem 2rem',
                  fontSize: '1.1rem'
                }}
              >
                🎣 Conventional
              </button>
              <button
                onClick={() => setSelectedEquipmentType('fly')}
                className="btn"
                style={{
                  background: selectedEquipmentType === 'fly' 
                    ? 'linear-gradient(135deg, #7C3AED, #5B21B6)'
                    : 'rgba(255,255,255,0.2)',
                  color: selectedEquipmentType === 'fly' ? 'white' : '#5B21B6',
                  padding: '0.75rem 2rem',
                  fontSize: '1.1rem'
                }}
              >
                🪰 Fly Fishing
              </button>
            </div>

            {selectedEquipmentType === 'conventional' ? (
              <div style={{ display: 'grid', gap: '2rem' }}>
                {/* Rods */}
                <div className="card" style={{ background: '#F0F9FF' }}>
                  <h3>🎣 Rods</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                    {FISHING_EQUIPMENT.conventional.rods.map((rod, idx) => (
                      <div key={idx} className="card" style={{ background: 'white' }}>
                        <h4 style={{ color: '#0077B6' }}>{rod.type}</h4>
                        <div style={{ marginTop: '1rem', lineHeight: 2 }}>
                          <div><strong>Length:</strong> {rod.length}</div>
                          <div><strong>Power:</strong> {rod.power}</div>
                          <div><strong>Action:</strong> {rod.action}</div>
                          <div><strong>Best For:</strong> {rod.uses}</div>
                          <div><strong>Price Range:</strong> {rod.price}</div>
                        </div>
                        <div style={{ background: '#ECFDF5', padding: '0.75rem', borderRadius: '8px', marginTop: '1rem' }}>
                          <strong style={{ color: '#065F46' }}>Recommended For:</strong>
                          <p style={{ color: '#047857', marginTop: '0.5rem' }}>{rod.bestFor}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reels */}
                <div className="card" style={{ background: '#FFF7ED' }}>
                  <h3>🎣 Reels</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                    {FISHING_EQUIPMENT.conventional.reels.map((reel, idx) => (
                      <div key={idx} className="card" style={{ background: 'white' }}>
                        <h4 style={{ color: '#EA580C' }}>{reel.type}</h4>
                        <div style={{ marginTop: '1rem', lineHeight: 2 }}>
                          <div><strong>Size:</strong> {reel.size}</div>
                          <div><strong>Drag Power:</strong> {reel.dragPower}</div>
                          <div><strong>Gear Ratio:</strong> {reel.gearRatio}</div>
                          <div><strong>Best For:</strong> {reel.uses}</div>
                          <div><strong>Price Range:</strong> {reel.price}</div>
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                          <strong>Features:</strong>
                          <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            {reel.features.map((feature, i) => (
                              <li key={i} style={{ color: '#4B5563' }}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Line Types */}
                <div className="card" style={{ background: '#F5F3FF' }}>
                  <h3>🧵 Fishing Line</h3>
                  <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1rem' }}>
                    {FISHING_EQUIPMENT.conventional.line.map((line, idx) => (
                      <div key={idx} className="card" style={{ background: 'white' }}>
                        <h4 style={{ color: '#7C3AED' }}>{line.type}</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
                          <div>
                            <div style={{ marginBottom: '0.75rem' }}>
                              <strong>Strength:</strong>
                              <p style={{ color: '#4B5563', marginTop: '0.25rem' }}>{line.strength}</p>
                            </div>
                            <div style={{ marginBottom: '0.75rem' }}>
                              <strong>Stretch:</strong>
                              <p style={{ color: '#4B5563', marginTop: '0.25rem' }}>{line.stretch}</p>
                            </div>
                            <div style={{ marginBottom: '0.75rem' }}>
                              <strong>Visibility:</strong>
                              <p style={{ color: '#4B5563', marginTop: '0.25rem' }}>{line.visibility}</p>
                            </div>
                            <div>
                              <strong>Price:</strong>
                              <p style={{ color: '#4B5563', marginTop: '0.25rem' }}>{line.price}</p>
                            </div>
                          </div>
                          <div>
                            <div style={{ marginBottom: '1rem' }}>
                              <strong style={{ color: '#059669' }}>✓ Pros:</strong>
                              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                                {line.pros.map((pro, i) => (
                                  <li key={i} style={{ color: '#047857', fontSize: '0.9rem' }}>{pro}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <strong style={{ color: '#DC2626' }}>✗ Cons:</strong>
                              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                                {line.cons.map((con, i) => (
                                  <li key={i} style={{ color: '#B91C1C', fontSize: '0.9rem' }}>{con}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div style={{ background: '#DBEAFE', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
                          <strong>Best Uses:</strong>
                          <p style={{ marginTop: '0.5rem', color: '#1E3A8A' }}>{line.uses}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Terminal Tackle */}
                <div className="card" style={{ background: '#FEF2F2' }}>
                  <h3>🎣 Terminal Tackle</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                    {FISHING_EQUIPMENT.conventional.terminal.map((item, idx) => (
                      <div key={idx} className="card" style={{ background: 'white' }}>
                        <h4 style={{ color: '#DC2626' }}>{item.item}</h4>
                        <div style={{ marginTop: '1rem' }}>
                          <strong>Types:</strong>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                            {item.types.map((type, i) => (
                              <span key={i} style={{ background: '#FEE2E2', color: '#991B1B', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                          <strong>Sizes:</strong>
                          <p style={{ color: '#4B5563', marginTop: '0.5rem' }}>{item.sizes}</p>
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                          <strong>Uses:</strong>
                          <p style={{ color: '#4B5563', marginTop: '0.5rem' }}>{item.uses}</p>
                        </div>
                        <div style={{ background: '#FEF3C7', padding: '0.75rem', borderRadius: '8px', marginTop: '1rem' }}>
                          <strong>💡 Tip:</strong>
                          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#78350F' }}>{item.tips}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Fly Equipment
              <div style={{ display: 'grid', gap: '2rem' }}>
                {/* Fly Rods */}
                <div className="card" style={{ background: '#F5F3FF' }}>
                  <h3>🪰 Fly Rods</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                    {FISHING_EQUIPMENT.fly.rods.map((rod, idx) => (
                      <div key={idx} className="card" style={{ background: 'white' }}>
                        <h4 style={{ color: '#7C3AED' }}>{rod.weight}</h4>
                        <div style={{ marginTop: '1rem', lineHeight: 2 }}>
                          <div><strong>Length:</strong> {rod.length}</div>
                          <div><strong>Action:</strong> {rod.action}</div>
                          <div><strong>Best For:</strong> {rod.uses}</div>
                          <div><strong>Price Range:</strong> {rod.price}</div>
                        </div>
                        <div style={{ background: '#F3E8FF', padding: '0.75rem', borderRadius: '8px', marginTop: '1rem' }}>
                          <strong style={{ color: '#6B21A8' }}>Recommended For:</strong>
                          <p style={{ color: '#5B21B6', marginTop: '0.5rem' }}>{rod.bestFor}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fly Reels */}
                <div className="card" style={{ background: '#FFF7ED' }}>
                  <h3>🎣 Fly Reels</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                    {FISHING_EQUIPMENT.fly.reels.map((reel, idx) => (
                      <div key={idx} className="card" style={{ background: 'white' }}>
                        <h4 style={{ color: '#EA580C' }}>{reel.type}</h4>
                        <div style={{ marginTop: '1rem', lineHeight: 2 }}>
                          <div><strong>Drag:</strong> {reel.drag}</div>
                          <div><strong>Weight:</strong> {reel.weight}</div>
                          <div><strong>Best For:</strong> {reel.uses}</div>
                          <div><strong>Price Range:</strong> {reel.price}</div>
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                          <strong>Features:</strong>
                          <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            {reel.features.map((feature, i) => (
                              <li key={i} style={{ color: '#4B5563' }}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fly Line */}
                <div className="card" style={{ background: '#F0F9FF' }}>
                  <h3>🧵 Fly Line</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                    {FISHING_EQUIPMENT.fly.line.map((line, idx) => (
                      <div key={idx} className="card" style={{ background: 'white' }}>
                        <h4 style={{ color: '#0077B6' }}>{line.type}</h4>
                        <div style={{ marginTop: '1rem', lineHeight: 2 }}>
                          <div><strong>Uses:</strong> {line.uses}</div>
                          {line.casting && <div><strong>Casting:</strong> {line.casting}</div>}
                          {line.density && <div><strong>Density:</strong> {line.density}</div>}
                          {line.colors && <div><strong>Colors:</strong> {line.colors}</div>}
                          {line.price && <div><strong>Price:</strong> {line.price}</div>}
                        </div>
                        <div style={{ background: '#ECFDF5', padding: '0.75rem', borderRadius: '8px', marginTop: '1rem' }}>
                          <strong>Recommendation:</strong>
                          <p style={{ marginTop: '0.5rem', color: '#047857' }}>{line.recommendation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Leaders & Tippet */}
                <div className="card" style={{ background: '#FEF2F2' }}>
                  <h3>🎯 Leaders & Tippet</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                    {FISHING_EQUIPMENT.fly.leaders.map((leader, idx) => (
                      <div key={idx} className="card" style={{ background: 'white' }}>
                        <h4 style={{ color: '#DC2626' }}>{leader.type}</h4>
                        <div style={{ marginTop: '1rem', lineHeight: 2 }}>
                          {leader.length && <div><strong>Length:</strong> {leader.length}</div>}
                          {leader.tippet && <div><strong>Tippet Size:</strong> {leader.tippet}</div>}
                          {leader.sections && <div><strong>Sections:</strong> {leader.sections}</div>}
                          {leader.strength && <div><strong>Strength:</strong> {leader.strength}</div>}
                          {leader.material && <div><strong>Material:</strong> {leader.material}</div>}
                          <div><strong>Uses:</strong> {leader.uses}</div>
                          {leader.price && <div><strong>Price:</strong> {leader.price}</div>}
                        </div>
                        <div style={{ background: '#FEF3C7', padding: '0.75rem', borderRadius: '8px', marginTop: '1rem' }}>
                          <strong>💡 Tip:</strong>
                          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#78350F' }}>{leader.tips}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
```

## Match the Hatch Tab (Gamified)

```tsx
        {/* Match the Hatch Tab - Gamified */}
        {activeTab === 'match-hatch' && (
          <div className="card section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2>🦋 Match the Hatch Challenge</h2>
                <p style={{ color: '#6B7280', marginTop: '0.5rem' }}>
                  Learn PA aquatic insects and earn points by matching flies to hatches
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ textAlign: 'center', background: '#F0F9FF', padding: '1rem 1.5rem', borderRadius: '12px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0077B6' }}>{matchHatchScore}</div>
                  <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>Points</div>
                </div>
                <div style={{ textAlign: 'center', background: '#FEF3C7', padding: '1rem 1.5rem', borderRadius: '12px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F59E0B' }}>{matchHatchStreak}</div>
                  <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>Streak</div>
                </div>
                <div style={{ textAlign: 'center', background: '#ECFDF5', padding: '1rem 1.5rem', borderRadius: '12px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#059669' }}>{matchedInsects.length}/{PA_AQUATIC_INSECTS.length}</div>
                  <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>Mastered</div>
                </div>
              </div>
            </div>

            {showHatchGame && currentChallenge ? (
              <div className="card" style={{ background: '#F9FAFB' }}>
                <button 
                  onClick={() => {
                    setShowHatchGame(false);
                    setCurrentChallenge(null);
                    setSelectedFlyGuess('');
                  }}
                  className="btn-outline"
                  style={{ marginBottom: '1.5rem' }}
                >
                  ← Back to Insects
                </button>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎯 Match This Hatch!</h3>
                  <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🦋</div>
                    <h4 style={{ fontSize: '1.5rem', color: '#023047', marginBottom: '0.5rem' }}>
                      {currentChallenge.name}
                    </h4>
                    <p style={{ fontStyle: 'italic', color: '#6B7280', marginBottom: '1rem' }}>
                      {currentChallenge.scientificName}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                        Hatches: {currentChallenge.months.join(', ')}
                      </span>
                      <span style={{ background: '#FEF3C7', color: '#92400E', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                        {currentChallenge.time}
                      </span>
                      <span style={{ background: '#F3E8FF', color: '#6B21A8', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                        Size: {currentChallenge.size}
                      </span>
                    </div>
                  </div>

                  <h4 style={{ marginBottom: '1rem' }}>Which fly pattern would you use?</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    {currentChallenge.adult.patterns.map((pattern, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedFlyGuess(pattern);
                          // Award points
                          const newScore = matchHatchScore + currentChallenge.points;
                          const newStreak = matchHatchStreak + 1;
                          setMatchHatchScore(newScore);
                          setMatchHatchStreak(newStreak);
                          if (!matchedInsects.includes(currentChallenge.id)) {
                            setMatchedInsects([...matchedInsects, currentChallenge.id]);
                          }
                          // Save progress
                          localStorage.setItem('wla-match-hatch', JSON.stringify({
                            score: newScore,
                            streak: newStreak,
                            matched: [...matchedInsects, currentChallenge.id]
                          }));
                          // Award points through context
                          addPoints(currentChallenge.points, `Matched ${currentChallenge.name}!`);
                          setTimeout(() => {
                            alert(`Correct! +${currentChallenge.points} points! 🎉`);
                            setShowHatchGame(false);
                            setCurrentChallenge(null);
                            setSelectedFlyGuess('');
                          }, 500);
                        }}
                        className="btn"
                        style={{
                          background: selectedFlyGuess === pattern ? 'linear-gradient(135deg, #059669, #047857)' : 'white',
                          color: selectedFlyGuess === pattern ? 'white' : '#023047',
                          border: '2px solid #0077B6',
                          padding: '1rem',
                          fontSize: '1rem'
                        }}
                      >
                        {pattern}
                      </button>
                    ))}
                  </div>

                  <div style={{ background: '#DBEAFE', padding: '1.5rem', borderRadius: '12px', textAlign: 'left' }}>
                    <h4 style={{ color: '#1E40AF', marginBottom: '1rem' }}>Hatch Details:</h4>
                    <div style={{ display: 'grid', gap: '0.75rem', color: '#1E3A8A' }}>
                      <div><strong>Water Temp:</strong> {currentChallenge.waterTemp}</div>
                      <div><strong>Emergence:</strong> {currentChallenge.emergence}</div>
                      <div><strong>Nymph Patterns:</strong> {currentChallenge.nymph.patterns.join(', ')}</div>
                      {currentChallenge.emerger && (
                        <div><strong>Emerger Patterns:</strong> {currentChallenge.emerger.patterns.join(', ')}</div>
                      )}
                      <div><strong>Difficulty:</strong> {currentChallenge.difficulty}</div>
                      <div><strong>💡 Tip:</strong> {currentChallenge.tips}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {PA_AQUATIC_INSECTS.map((insect) => (
                  <div 
                    key={insect.id}
                    className="card"
                    style={{
                      background: matchedInsects.includes(insect.id) ? '#ECFDF5' : '#F9FAFB',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onClick={() => {
                      setCurrentChallenge(insect);
                      setShowHatchGame(true);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {matchedInsects.includes(insect.id) && (
                      <div style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: '#059669',
                        color: 'white',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem'
                      }}>
                        ✓
                      </div>
                    )}

                    <h3 style={{ marginBottom: '0.5rem' }}>{insect.name}</h3>
                    <p style={{ fontStyle: 'italic', color: '#6B7280', fontSize: '0.9rem', marginBottom: '1rem' }}>
                      {insect.scientificName}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                      <span style={{ 
                        background: insect.difficulty === 'Beginner' ? '#ECFDF5' : insect.difficulty === 'Intermediate' ? '#FEF3C7' : '#FEE2E2',
                        color: insect.difficulty === 'Beginner' ? '#065F46' : insect.difficulty === 'Intermediate' ? '#92400E' : '#991B1B',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem'
                      }}>
                        {insect.difficulty}
                      </span>
                      <span style={{ background: '#FEF3C7', color: '#92400E', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                        +{insect.points} pts
                      </span>
                    </div>

                    <div style={{ fontSize: '0.9rem', color: '#4B5563', lineHeight: 1.6 }}>
                      <div><strong>Type:</strong> {insect.type}</div>
                      <div><strong>Hatches:</strong> {insect.months.slice(0, 3).join(', ')}{insect.months.length > 3 && '...'}</div>
                      <div><strong>Time:</strong> {insect.time}</div>
                      <div><strong>Size:</strong> {insect.size}</div>
                    </div>

                    <button 
                      className="btn"
                      style={{
                        width: '100%',
                        marginTop: '1rem',
                        background: matchedInsects.includes(insect.id) 
                          ? 'linear-gradient(135deg, #059669, #047857)'
                          : 'linear-gradient(135deg, #0077B6, #023047)',
                        color: 'white'
                      }}
                    >
                      {matchedInsects.includes(insect.id) ? 'Review Match →' : 'Test Your Skills →'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
```

## Resources Tab (State Parks & Programs)

```tsx
        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="card section">
            <h2>📚 Pennsylvania Fishing Resources</h2>
            <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
              State parks, programs, training opportunities, and conservation resources
            </p>

            <div style={{ display: 'grid', gap: '2rem' }}>
              {/* State Parks with Fishing */}
              <div className="card" style={{ background: '#F0F9FF' }}>
                <h3>🏞️ Top Pennsylvania State Parks for Fishing</h3>
                <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
                  Pennsylvania has 121 state parks with fishing opportunities. Here are some of the best:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {[
                    {
                      name: 'Moraine State Park',
                      county: 'Butler',
                      water: 'Lake Arthur (3,225 acres)',
                      species: ['Musky', 'Walleye', 'Bass', 'Crappie', 'Perch'],
                      features: ['Boat launch', 'Marina', 'Fishing pier', 'Shore access'],
                      programs: ['Free fishing workshops', 'Youth fishing day', 'Kayak fishing tours']
                    },
                    {
                      name: 'Promised Land State Park',
                      county: 'Pike',
                      water: 'Promised Land Lake & Lower Lake',
                      species: ['Trout', 'Bass', 'Pickerel', 'Panfish'],
                      features: ['Boat rental', 'Accessible fishing pier', 'Stream access'],
                      programs: ['Fly fishing clinics', 'Family fishing events', 'Ice fishing workshops']
                    },
                    {
                      name: 'Presque Isle State Park',
                      county: 'Erie',
                      water: 'Lake Erie & Presque Isle Bay',
                      species: ['Walleye', 'Perch', 'Bass', 'Steelhead', 'Musky'],
                      features: ['Multi-species fishery', 'Shore fishing', 'Boat launch'],
                      programs: ['Fishing clinics year-round', 'Junior angler program', 'Ice fishing']
                    },
                    {
                      name: 'Ricketts Glen State Park',
                      county: 'Luzerne/Sullivan/Columbia',
                      water: 'Lake Jean & streams',
                      species: ['Trout', 'Bass', 'Panfish'],
                      features: ['Lake fishing', 'Stream fishing', 'Boat rental'],
                      programs: ['Trout fishing workshop', 'Family fishing day', 'Fly fishing basics']
                    },
                    {
                      name: 'Codorus State Park',
                      county: 'York',
                      water: 'Lake Marburg (1,275 acres)',
                      species: ['Bass', 'Musky', 'Crappie', 'Catfish'],
                      features: ['Multiple boat launches', 'Marina', 'Fishing piers'],
                      programs: ['Youth fishing tournament', 'Fishing workshops', 'Boat fishing clinic']
                    },
                    {
                      name: 'Marsh Creek State Park',
                      county: 'Chester',
                      water: 'Marsh Creek Lake (535 acres)',
                      species: ['Bass', 'Trout', 'Walleye', 'Perch'],
                      features: ['Sailing', 'Boat launch', 'Shore fishing'],
                      programs: ['Beginner fishing clinics', 'Family fishing days', 'Fly fishing intro']
                    }
                  ].map((park, idx) => (
                    <div key={idx} className="card" style={{ background: 'white' }}>
                      <h4 style={{ color: '#0077B6', marginBottom: '0.5rem' }}>{park.name}</h4>
                      <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '1rem' }}>
                        {park.county} County
                      </p>
                      <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ fontSize: '0.9rem', color: '#374151' }}>Water Body:</strong>
                        <p style={{ fontSize: '0.9rem', color: '#4B5563', marginTop: '0.25rem' }}>{park.water}</p>
                      </div>
                      <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ fontSize: '0.9rem', color: '#374151' }}>Target Species:</strong>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                          {park.species.map((species, i) => (
                            <span key={i} style={{ background: '#ECFDF5', color: '#065F46', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                              {species}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ fontSize: '0.9rem', color: '#374151' }}>Features:</strong>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                          {park.features.map((feature, i) => (
                            <li key={i} style={{ fontSize: '0.85rem', color: '#4B5563' }}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                      <div style={{ background: '#FEF3C7', padding: '0.75rem', borderRadius: '8px' }}>
                        <strong style={{ fontSize: '0.9rem', color: '#92400E' }}>Programs:</strong>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                          {park.programs.map((program, i) => (
                            <li key={i} style={{ fontSize: '0.85rem', color: '#78350F' }}>{program}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education Programs */}
              <div className="card" style={{ background: '#F0FDF4' }}>
                <h3>🎓 Fishing Education & Training</h3>
                <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1rem' }}>
                  <div className="card" style={{ background: 'white' }}>
                    <h4 style={{ color: '#059669' }}>PFBC Fishing Education</h4>
                    <p style={{ color: '#4B5563', marginBottom: '1rem' }}>
                      Pennsylvania Fish & Boat Commission offers comprehensive fishing education programs
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', lineHeight: 2 }}>
                      <li><strong>Fishing 101:</strong> Free beginner workshops at state parks</li>
                      <li><strong>Fishing Mentors:</strong> One-on-one instruction from certified anglers</li>
                      <li><strong>Youth Fishing Day:</strong> Annual free fishing day with equipment provided</li>
                      <li><strong>Women&apos;s Fishing Clinics:</strong> Workshops specifically for women anglers</li>
                      <li><strong>Fly Fishing Schools:</strong> Multi-day intensive fly fishing courses</li>
                      <li><strong>Online Resources:</strong> Video tutorials, species guides, regulations</li>
                    </ul>
                    <a 
                      href="https://www.fishandboat.com/Education/Pages/default.aspx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn"
                      style={{ 
                        display: 'inline-block',
                        marginTop: '1rem',
                        background: 'linear-gradient(135deg, #059669, #047857)',
                        color: 'white'
                      }}
                    >
                      Visit PFBC Education →
                    </a>
                  </div>

                  <div className="card" style={{ background: 'white' }}>
                    <h4 style={{ color: '#059669' }}>Trout in the Classroom</h4>
                    <p style={{ color: '#4B5563', marginBottom: '1rem' }}>
                      Students raise trout from eggs to fingerlings, learning aquatic ecosystems
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', lineHeight: 2 }}>
                      <li>Hands-on science education</li>
                      <li>Water quality monitoring</li>
                      <li>Stream habitat assessment</li>
                      <li>Conservation ethics</li>
                      <li>Stock fish in local streams as class</li>
                    </ul>
                    <a 
                      href="https://www.fishandboat.com/Education/TIC/Pages/default.aspx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn"
                      style={{ 
                        display: 'inline-block',
                        marginTop: '1rem',
                        background: 'linear-gradient(135deg, #059669, #047857)',
                        color: 'white'
                      }}
                    >
                      Learn About TIC →
                    </a>
                  </div>

                  <div className="card" style={{ background: 'white' }}>
                    <h4 style={{ color: '#059669' }}>Angler & Boater Education</h4>
                    <p style={{ color: '#4B5563', marginBottom: '1rem' }}>
                      Certification courses and advanced skills training
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', lineHeight: 2 }}>
                      <li><strong>Boating Safety Course:</strong> Required for operating powerboats</li>
                      <li><strong>Kayak Fishing Skills:</strong> Safety and techniques for kayak anglers</li>
                      <li><strong>Ice Fishing Safety:</strong> Winter fishing safety and techniques</li>
                      <li><strong>Species ID Workshops:</strong> Learn to identify PA fish species</li>
                      <li><strong>Conservation Volunteer:</strong> Stream cleanups, fish surveys, habitat work</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Conservation & Regulations */}
              <div className="card" style={{ background: '#FFF7ED' }}>
                <h3>🌱 Conservation & Stewardship</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                  <div className="card" style={{ background: 'white' }}>
                    <h4 style={{ color: '#EA580C' }}>Catch & Release Best Practices</h4>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem', lineHeight: 2 }}>
                      <li>Use barbless hooks</li>
                      <li>Keep fish in water when possible</li>
                      <li>Wet hands before handling</li>
                      <li>Support fish horizontally</li>
                      <li>Minimize fight time</li>
                      <li>Revive fish before release</li>
                      <li>Avoid handling gills</li>
                    </ul>
                  </div>

                  <div className="card" style={{ background: 'white' }}>
                    <h4 style={{ color: '#EA580C' }}>Stream Etiquette</h4>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem', lineHeight: 2 }}>
                      <li>Respect other anglers&apos; space</li>
                      <li>Enter stream below other anglers</li>
                      <li>Don&apos;t crowd fishing spots</li>
                      <li>Pack out all trash</li>
                      <li>Respect private property</li>
                      <li>Share knowledge with beginners</li>
                      <li>Report pollution or violations</li>
                    </ul>
                  </div>

                  <div className="card" style={{ background: 'white' }}>
                    <h4 style={{ color: '#EA580C' }}>Important Regulations</h4>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem', lineHeight: 2 }}>
                      <li>Valid PA fishing license required (16+)</li>
                      <li>Free Youth Fishing Days (no license)</li>
                      <li>Trout/Salmon permit for stocked waters</li>
                      <li>Know season dates & creel limits</li>
                      <li>Size restrictions by species</li>
                      <li>Special regulations on some waters</li>
                      <li>Barbless hooks in some streams</li>
                    </ul>
                    <a 
                      href="https://www.fishandboat.com/regulations"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn"
                      style={{ 
                        display: 'inline-block',
                        marginTop: '1rem',
                        background: 'linear-gradient(135deg, #EA580C, #C2410C)',
                        color: 'white',
                        width: '100%'
                      }}
                    >
                      View Current Regulations →
                    </a>
                  </div>
                </div>
              </div>

              {/* Links & Resources */}
              <div className="card" style={{ background: '#F5F3FF' }}>
                <h3>🔗 Useful Links</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                  {[
                    { name: 'PA Fish & Boat Commission', url: 'https://www.fishandboat.com', desc: 'Official state fishing authority' },
                    { name: 'Trout Stocking Schedule', url: 'https://pfbc.maps.arcgis.com/apps/webappviewer/index.html', desc: 'Real-time stocking updates' },
                    { name: 'Buy Fishing License', url: 'https://www.pa.wildlifelicense.com/start.php', desc: 'Online license sales' },
                    { name: 'PA State Parks', url: 'https://www.dcnr.pa.gov/StateParks', desc: 'Park information & reservations' },
                    { name: 'Stream Access Map', url: 'https://www.fishandboat.com/Fish/PennsylvaniaFishes/Pages/PublicFishingAccess.aspx', desc: 'Find public fishing access' },
                    { name: 'Wildlife Leadership Academy', url: 'https://wildlifeleadershipacademy.org', desc: 'Conservation education' }
                  ].map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card"
                      style={{
                        background: 'white',
                        textDecoration: 'none',
                        color: 'inherit',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <h4 style={{ color: '#7C3AED', marginBottom: '0.5rem' }}>{link.name}</h4>
                      <p style={{ fontSize: '0.9rem', color: '#6B7280' }}>{link.desc}</p>
                      <div style={{ marginTop: '0.75rem', color: '#7C3AED', fontSize: '0.9rem', fontWeight: 600 }}>
                        Visit Site →
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conservation History Tab */}
        {activeTab === 'history' && (
          <>
            <ConservationHistory history={FISHING_CONSERVATION_HISTORY} />
            
            {/* Local History Research Exercise */}
            <div style={{ marginTop: '2rem' }}>
              <LocalHistoryResearch />
            </div>
          </>
        )}

      </div>
    </div>
  );
}

