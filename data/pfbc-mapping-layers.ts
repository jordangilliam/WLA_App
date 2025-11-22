/**
 * PFBC Mapping Layers Database
 * Comprehensive trout stream classifications, bass waters, and species designations
 * Based on PA Fish & Boat Commission data
 */

export interface PFBCTroutStream {
  id: string;
  name: string;
  classification: 'Class A' | 'Wild Trout' | 'Stocked' | 'Catch & Release' | 'Delayed Harvest' | 'Trophy Trout' | 'Special Regulation';
  county: string;
  region: string;
  coordinates: { lat: number; lng: number };
  section?: string;
  regulations?: string;
  species: string[];
  notes?: string;
}

export interface PFBCBassWater {
  id: string;
  name: string;
  classification: 'Best Bass Water' | 'Bass Water' | 'Trophy Bass' | 'Largemouth Bass' | 'Smallmouth Bass';
  county: string;
  region: string;
  coordinates: { lat: number; lng: number };
  species: string[];
  notes?: string;
}

export interface PFBCSpeciesWater {
  id: string;
  name: string;
  species: string;
  classification: string;
  county: string;
  region: string;
  coordinates: { lat: number; lng: number };
  notes?: string;
}

// ============================================================================
// PFBC CLASS A WILD TROUT STREAMS
// ============================================================================
export const PFBC_CLASS_A_TROUT_STREAMS: PFBCTroutStream[] = [
  {
    id: 'spring-creek-class-a',
    name: 'Spring Creek',
    classification: 'Class A',
    county: 'Centre',
    region: 'Central',
    coordinates: { lat: 40.7981, lng: -77.8600 },
    section: "Fisherman's Paradise",
    species: ['Brown Trout', 'Rainbow Trout'],
    notes: 'Premier Class A wild trout stream',
  },
  {
    id: 'penns-creek-class-a',
    name: 'Penns Creek',
    classification: 'Class A',
    county: 'Centre',
    region: 'Central',
    coordinates: { lat: 40.8670, lng: -77.4167 },
    species: ['Brown Trout', 'Rainbow Trout'],
    notes: 'Excellent Class A wild trout stream',
  },
  {
    id: 'yellow-breeches-class-a',
    name: 'Yellow Breeches Creek',
    classification: 'Class A',
    county: 'Cumberland',
    region: 'Harrisburg',
    coordinates: { lat: 40.2342, lng: -77.0264 },
    species: ['Brown Trout', 'Rainbow Trout'],
    notes: 'Class A limestone spring creek',
  },
  {
    id: 'spruce-creek-class-a',
    name: 'Spruce Creek',
    classification: 'Class A',
    county: 'Huntingdon',
    region: 'Central',
    coordinates: { lat: 40.6000, lng: -78.1000 },
    species: ['Brown Trout', 'Rainbow Trout'],
    notes: 'Famous Class A limestone spring creek',
  },
  {
    id: 'little-juniata-class-a',
    name: 'Little Juniata River',
    classification: 'Class A',
    county: 'Huntingdon',
    region: 'Central',
    coordinates: { lat: 40.5000, lng: -78.0000 },
    species: ['Brown Trout', 'Rainbow Trout'],
    notes: 'Class A wild trout stream',
  },
  {
    id: 'loyalsock-creek-class-a',
    name: 'Loyalsock Creek',
    classification: 'Class A',
    county: 'Sullivan',
    region: 'Central',
    coordinates: { lat: 41.4000, lng: -76.7000 },
    species: ['Brown Trout', 'Rainbow Trout', 'Brook Trout'],
    notes: 'Class A wild trout stream',
  },
  {
    id: 'pine-creek-class-a',
    name: 'Pine Creek',
    classification: 'Class A',
    county: 'Lycoming',
    region: 'Central',
    coordinates: { lat: 41.4000, lng: -77.3000 },
    species: ['Brown Trout', 'Rainbow Trout'],
    notes: 'Class A wild trout stream',
  },
  {
    id: 'young-womans-creek-class-a',
    name: "Young Woman's Creek",
    classification: 'Class A',
    county: 'Clinton',
    region: 'Central',
    coordinates: { lat: 41.3000, lng: -77.7000 },
    species: ['Brook Trout'],
    notes: 'Class A wild brook trout stream',
  },
  {
    id: 'cedar-run-class-a',
    name: 'Cedar Run',
    classification: 'Class A',
    county: 'Lycoming',
    region: 'Central',
    coordinates: { lat: 41.5000, lng: -77.4000 },
    species: ['Brook Trout'],
    notes: 'Class A wild brook trout stream',
  },
  {
    id: 'beech-creek-class-a',
    name: 'Beech Creek',
    classification: 'Class A',
    county: 'Clinton',
    region: 'Central',
    coordinates: { lat: 41.2000, lng: -77.6000 },
    species: ['Brook Trout'],
    notes: 'Class A wild brook trout stream',
  },
];

// ============================================================================
// PFBC WILD TROUT STREAMS
// ============================================================================
export const PFBC_WILD_TROUT_STREAMS: PFBCTroutStream[] = [
  {
    id: 'slate-run-wild',
    name: 'Slate Run',
    classification: 'Wild Trout',
    county: 'Lycoming',
    region: 'Central',
    coordinates: { lat: 41.4000, lng: -77.5000 },
    species: ['Brook Trout'],
    notes: 'Wild brook trout stream',
  },
  {
    id: 'kettle-creek-wild',
    name: 'Kettle Creek',
    classification: 'Wild Trout',
    county: 'Clinton',
    region: 'Central',
    coordinates: { lat: 41.3500, lng: -77.8000 },
    species: ['Brook Trout', 'Brown Trout'],
    notes: 'Wild trout stream',
  },
  {
    id: 'first-fork-sinnemahoning-wild',
    name: 'First Fork Sinnemahoning Creek',
    classification: 'Wild Trout',
    county: 'Potter',
    region: 'Central',
    coordinates: { lat: 41.6000, lng: -77.9000 },
    species: ['Brook Trout'],
    notes: 'Wild brook trout stream',
  },
  {
    id: 'sinnemahoning-creek-wild',
    name: 'Sinnemahoning Creek',
    classification: 'Wild Trout',
    county: 'Cameron',
    region: 'Central',
    coordinates: { lat: 41.5000, lng: -78.0000 },
    species: ['Brown Trout', 'Rainbow Trout', 'Brook Trout'],
    notes: 'Wild trout stream',
  },
];

// ============================================================================
// PFBC DELAYED HARVEST STREAMS
// ============================================================================
export const PFBC_DELAYED_HARVEST_STREAMS: PFBCTroutStream[] = [
  {
    id: 'yellow-breeches-delayed',
    name: 'Yellow Breeches Creek',
    classification: 'Delayed Harvest',
    county: 'Cumberland',
    region: 'Harrisburg',
    coordinates: { lat: 40.2342, lng: -77.0264 },
    section: 'Delayed Harvest Section',
    regulations: 'Catch and release only, artificial lures only, Oct 1 - Feb 28',
    species: ['Brown Trout', 'Rainbow Trout'],
    notes: 'Delayed harvest section',
  },
  {
    id: 'little-lehigh-delayed',
    name: 'Little Lehigh Creek',
    classification: 'Delayed Harvest',
    county: 'Lehigh',
    region: 'Lehigh Valley',
    coordinates: { lat: 40.6000, lng: -75.5000 },
    section: 'Delayed Harvest Section',
    regulations: 'Catch and release only, artificial lures only, Oct 1 - Feb 28',
    species: ['Brown Trout', 'Rainbow Trout'],
    notes: 'Delayed harvest section',
  },
  {
    id: 'tulpehocken-delayed',
    name: 'Tulpehocken Creek',
    classification: 'Delayed Harvest',
    county: 'Berks',
    region: 'Reading',
    coordinates: { lat: 40.4000, lng: -76.1000 },
    section: 'Delayed Harvest Section',
    regulations: 'Catch and release only, artificial lures only, Oct 1 - Feb 28',
    species: ['Brown Trout', 'Rainbow Trout'],
    notes: 'Delayed harvest section',
  },
];

// ============================================================================
// PFBC TROPHY TROUT STREAMS
// ============================================================================
export const PFBC_TROPHY_TROUT_STREAMS: PFBCTroutStream[] = [
  {
    id: 'spring-creek-trophy',
    name: 'Spring Creek',
    classification: 'Trophy Trout',
    county: 'Centre',
    region: 'Central',
    coordinates: { lat: 40.7981, lng: -77.8600 },
    section: "Fisherman's Paradise",
    regulations: 'All-tackle trophy trout section',
    species: ['Brown Trout', 'Rainbow Trout'],
    notes: 'Trophy trout section',
  },
  {
    id: 'yellow-breeches-trophy',
    name: 'Yellow Breeches Creek',
    classification: 'Trophy Trout',
    county: 'Cumberland',
    region: 'Harrisburg',
    coordinates: { lat: 40.2342, lng: -77.0264 },
    section: 'Trophy Trout Section',
    regulations: 'All-tackle trophy trout section',
    species: ['Brown Trout', 'Rainbow Trout'],
    notes: 'Trophy trout section',
  },
];

// ============================================================================
// PFBC BEST BASS WATERS
// ============================================================================
export const PFBC_BEST_BASS_WATERS: PFBCBassWater[] = [
  {
    id: 'raystown-lake-bass',
    name: 'Raystown Lake',
    classification: 'Best Bass Water',
    county: 'Huntingdon',
    region: 'Central',
    coordinates: { lat: 40.3000, lng: -78.0000 },
    species: ['Largemouth Bass', 'Smallmouth Bass', 'Striped Bass'],
    notes: 'PFBC Best Bass Water',
  },
  {
    id: 'lake-arthur-bass',
    name: 'Lake Arthur (Moraine State Park)',
    classification: 'Best Bass Water',
    county: 'Butler',
    region: 'Pittsburgh',
    coordinates: { lat: 40.9000, lng: -80.1000 },
    species: ['Largemouth Bass', 'Smallmouth Bass'],
    notes: 'PFBC Best Bass Water',
  },
  {
    id: 'french-creek-bass',
    name: 'French Creek',
    classification: 'Best Bass Water',
    county: 'Chester',
    region: 'Philadelphia',
    coordinates: { lat: 40.1000, lng: -75.6000 },
    species: ['Smallmouth Bass', 'Largemouth Bass'],
    notes: 'PFBC Best Bass Water - Stream',
  },
  {
    id: 'juniata-river-bass',
    name: 'Juniata River',
    classification: 'Best Bass Water',
    county: 'Huntingdon',
    region: 'Central',
    coordinates: { lat: 40.5000, lng: -77.8000 },
    species: ['Smallmouth Bass', 'Largemouth Bass'],
    notes: 'PFBC Best Bass Water - River',
  },
  {
    id: 'susquehanna-river-bass',
    name: 'Susquehanna River',
    classification: 'Best Bass Water',
    county: 'Dauphin',
    region: 'Harrisburg',
    coordinates: { lat: 40.2597, lng: -76.8822 },
    species: ['Smallmouth Bass', 'Largemouth Bass'],
    notes: 'PFBC Best Bass Water - River',
  },
  {
    id: 'allegheny-river-bass',
    name: 'Allegheny River',
    classification: 'Best Bass Water',
    county: 'Allegheny',
    region: 'Pittsburgh',
    coordinates: { lat: 40.4406, lng: -79.9961 },
    species: ['Smallmouth Bass', 'Largemouth Bass'],
    notes: 'PFBC Best Bass Water - River',
  },
  {
    id: 'monongahela-river-bass',
    name: 'Monongahela River',
    classification: 'Best Bass Water',
    county: 'Allegheny',
    region: 'Pittsburgh',
    coordinates: { lat: 40.4406, lng: -79.9961 },
    species: ['Smallmouth Bass', 'Largemouth Bass'],
    notes: 'PFBC Best Bass Water - River',
  },
  {
    id: 'youghiogheny-river-bass',
    name: 'Youghiogheny River',
    classification: 'Best Bass Water',
    county: 'Fayette',
    region: 'Pittsburgh',
    coordinates: { lat: 40.1000, lng: -79.5000 },
    species: ['Smallmouth Bass'],
    notes: 'PFBC Best Bass Water - River',
  },
  {
    id: 'lehigh-river-bass',
    name: 'Lehigh River',
    classification: 'Best Bass Water',
    county: 'Lehigh',
    region: 'Lehigh Valley',
    coordinates: { lat: 40.6000, lng: -75.5000 },
    species: ['Smallmouth Bass'],
    notes: 'PFBC Best Bass Water - River',
  },
  {
    id: 'schuylkill-river-bass',
    name: 'Schuylkill River',
    classification: 'Best Bass Water',
    county: 'Schuylkill',
    region: 'Lehigh Valley',
    coordinates: { lat: 40.7000, lng: -76.2000 },
    species: ['Smallmouth Bass'],
    notes: 'PFBC Best Bass Water - River',
  },
];

// ============================================================================
// PFBC OTHER SPECIES WATERS
// ============================================================================
export const PFBC_OTHER_SPECIES_WATERS: PFBCSpeciesWater[] = [
  {
    id: 'lake-erie-walleye',
    name: 'Lake Erie',
    species: 'Walleye',
    classification: 'Best Walleye Water',
    county: 'Erie',
    region: 'Erie',
    coordinates: { lat: 42.1275, lng: -80.0851 },
    notes: 'PFBC Best Walleye Water',
  },
  {
    id: 'pymatuning-walleye',
    name: 'Pymatuning Lake',
    species: 'Walleye',
    classification: 'Best Walleye Water',
    county: 'Crawford',
    region: 'Erie',
    coordinates: { lat: 41.6000, lng: -80.5000 },
    notes: 'PFBC Best Walleye Water',
  },
  {
    id: 'raystown-striped-bass',
    name: 'Raystown Lake',
    species: 'Striped Bass',
    classification: 'Striped Bass Water',
    county: 'Huntingdon',
    region: 'Central',
    coordinates: { lat: 40.3000, lng: -78.0000 },
    notes: 'PFBC Striped Bass Water',
  },
  {
    id: 'lake-arthur-muskie',
    name: 'Lake Arthur (Moraine State Park)',
    species: 'Muskellunge',
    classification: 'Muskie Water',
    county: 'Butler',
    region: 'Pittsburgh',
    coordinates: { lat: 40.9000, lng: -80.1000 },
    notes: 'PFBC Muskie Water',
  },
  {
    id: 'elk-creek-steelhead',
    name: 'Elk Creek',
    species: 'Steelhead',
    classification: 'Steelhead Water',
    county: 'Erie',
    region: 'Erie',
    coordinates: { lat: 42.0000, lng: -80.3000 },
    notes: 'PFBC Steelhead Water',
  },
  {
    id: 'trout-run-steelhead',
    name: 'Trout Run',
    species: 'Steelhead',
    classification: 'Steelhead Water',
    county: 'Erie',
    region: 'Erie',
    coordinates: { lat: 42.0000, lng: -80.2000 },
    notes: 'PFBC Steelhead Water',
  },
  {
    id: 'twenty-mile-creek-steelhead',
    name: 'Twenty Mile Creek',
    species: 'Steelhead',
    classification: 'Steelhead Water',
    county: 'Erie',
    region: 'Erie',
    coordinates: { lat: 42.0000, lng: -80.1000 },
    notes: 'PFBC Steelhead Water',
  },
];

// Import expanded layers
import {
  EXPANDED_CLASS_A_TROUT_STREAMS,
  EXPANDED_WILD_TROUT_STREAMS,
  EXPANDED_DELAYED_HARVEST_STREAMS,
  EXPANDED_TROPHY_TROUT_STREAMS,
  EXPANDED_BEST_BASS_WATERS,
  EXPANDED_OTHER_SPECIES_WATERS,
} from './pfbc-mapping-layers-expanded';

// Combine all PFBC mapping layers
export const ALL_PFBC_MAPPING_LAYERS = {
  classATroutStreams: [
    ...PFBC_CLASS_A_TROUT_STREAMS,
    ...EXPANDED_CLASS_A_TROUT_STREAMS,
  ],
  wildTroutStreams: [
    ...PFBC_WILD_TROUT_STREAMS,
    ...EXPANDED_WILD_TROUT_STREAMS,
  ],
  delayedHarvestStreams: [
    ...PFBC_DELAYED_HARVEST_STREAMS,
    ...EXPANDED_DELAYED_HARVEST_STREAMS,
  ],
  trophyTroutStreams: [
    ...PFBC_TROPHY_TROUT_STREAMS,
    ...EXPANDED_TROPHY_TROUT_STREAMS,
  ],
  bestBassWaters: [
    ...PFBC_BEST_BASS_WATERS,
    ...EXPANDED_BEST_BASS_WATERS,
  ],
  otherSpeciesWaters: [
    ...PFBC_OTHER_SPECIES_WATERS,
    ...EXPANDED_OTHER_SPECIES_WATERS,
  ],
};

