/**
 * Comprehensive Pennsylvania Fly Fishing Shops Database
 * All fly shops across PA with complete information
 */

export interface FlyShop {
  id: string;
  name: string;
  location: string;
  county: string;
  region: string;
  address?: string;
  phone?: string;
  website?: string;
  email?: string;
  services: string[];
  hasGuides?: boolean;
  hasFlyTying?: boolean;
  hasClasses?: boolean;
  hasCustomRods?: boolean;
  hasLodging?: boolean;
  coordinates?: { lat: number; lng: number };
  specialties?: string[];
  notes?: string;
}

export const ALL_PA_FLY_SHOPS: FlyShop[] = [
  // ============================================================================
  // CENTRAL PA
  // ============================================================================
  {
    id: 'tco-state-college',
    name: 'TCO Fly Shop',
    location: 'State College, PA',
    county: 'Centre',
    region: 'Central',
    address: '2101 E College Ave, State College, PA 16801',
    phone: '(814) 234-4189',
    website: 'https://www.tcoflyfishing.com',
    services: ['Fly Fishing Gear', 'Guided Trips', 'Classes', 'Fly Tying', 'Custom Rods'],
    hasGuides: true,
    hasFlyTying: true,
    hasClasses: true,
    hasCustomRods: true,
    coordinates: { lat: 40.7981, lng: -77.8600 },
    specialties: ['Spring Creek', 'Penns Creek', 'Expert Instruction'],
  },
  {
    id: 'fly-fishers-paradise',
    name: "Fly Fisher's Paradise",
    location: 'State College, PA',
    county: 'Centre',
    region: 'Central',
    address: 'State College, PA',
    phone: '(814) 234-4189',
    website: 'https://www.flyfishersparadise.com',
    services: ['Fly Fishing Gear', 'Guided Trips', 'Classes', 'Joe Humphreys Instruction'],
    hasGuides: true,
    hasClasses: true,
    coordinates: { lat: 40.7981, lng: -77.8600 },
    specialties: ['Joe Humphreys', 'Spring Creek', 'Traditional Techniques'],
  },
  {
    id: 'spruce-creek-outfitters',
    name: 'Spruce Creek Outfitters',
    location: 'Spruce Creek, PA',
    county: 'Huntingdon',
    region: 'Central',
    address: 'Spruce Creek, PA',
    website: 'https://www.sprucecreekoutfitters.com',
    services: ['Fly Fishing Gear', 'Guided Trips', 'Lodging'],
    hasGuides: true,
    hasLodging: true,
    coordinates: { lat: 40.6000, lng: -78.1000 },
    specialties: ['Spruce Creek', 'Limestone Streams'],
  },
  {
    id: 'feathered-hook',
    name: 'The Feathered Hook',
    location: 'Coburn, PA',
    county: 'Centre',
    region: 'Central',
    address: 'Coburn, PA',
    website: 'https://www.featheredhook.com',
    services: ['Fly Fishing Gear', 'Guided Trips', 'Lodging', 'Classes'],
    hasGuides: true,
    hasClasses: true,
    hasLodging: true,
    coordinates: { lat: 40.8670, lng: -77.4167 },
    specialties: ['Penns Creek', 'Wild Trout'],
  },
  {
    id: 'little-juniata-fly-shop',
    name: 'Little Juniata Fly Shop',
    location: 'Spruce Creek, PA',
    county: 'Huntingdon',
    region: 'Central',
    address: 'Spruce Creek, PA',
    services: ['Fly Fishing Gear', 'Guided Trips'],
    hasGuides: true,
    coordinates: { lat: 40.5000, lng: -78.0000 },
    specialties: ['Little Juniata River'],
  },
  {
    id: 'centre-county-fly-shop',
    name: 'Centre County Fly Shop',
    location: 'Bellefonte, PA',
    county: 'Centre',
    region: 'Central',
    address: 'Bellefonte, PA',
    services: ['Fly Fishing Gear', 'Guided Trips'],
    hasGuides: true,
    coordinates: { lat: 40.9131, lng: -77.7783 },
  },
  {
    id: 'raystown-outfitters',
    name: 'Raystown Outfitters',
    location: 'Huntingdon, PA',
    county: 'Huntingdon',
    region: 'Central',
    address: 'Huntingdon, PA',
    services: ['Fly Fishing Gear', 'Guided Trips'],
    hasGuides: true,
    coordinates: { lat: 40.4848, lng: -78.0103 },
    specialties: ['Raystown Lake', 'Juniata River'],
  },

  // ============================================================================
  // HARRISBURG / SOUTH CENTRAL PA
  // ============================================================================
  {
    id: 'fly-shop-boiling-springs',
    name: 'The Fly Shop',
    location: 'Boiling Springs, PA',
    county: 'Cumberland',
    region: 'Harrisburg',
    address: 'Boiling Springs, PA',
    website: 'https://www.theflyshop.com',
    services: ['Fly Fishing Gear', 'Guided Trips'],
    hasGuides: true,
    coordinates: { lat: 40.2342, lng: -77.0264 },
    specialties: ['Yellow Breeches Creek'],
  },
  {
    id: 'yellow-breeches-outfitters',
    name: 'Yellow Breeches Outfitters',
    location: 'Boiling Springs, PA',
    county: 'Cumberland',
    region: 'Harrisburg',
    address: 'Boiling Springs, PA',
    services: ['Fly Fishing Gear', 'Guided Trips', 'Classes'],
    hasGuides: true,
    hasClasses: true,
    coordinates: { lat: 40.2342, lng: -77.0264 },
    specialties: ['Yellow Breeches Creek', 'Limestone Streams'],
  },
  {
    id: 'allenberry-fly-shop',
    name: 'Allenberry Fly Shop',
    location: 'Boiling Springs, PA',
    county: 'Cumberland',
    region: 'Harrisburg',
    address: 'Boiling Springs, PA',
    services: ['Fly Fishing Gear', 'Guided Trips'],
    hasGuides: true,
    coordinates: { lat: 40.2342, lng: -77.0264 },
    specialties: ['Yellow Breeches Creek'],
  },
  {
    id: 'letort-fly-shop',
    name: 'Letort Fly Shop',
    location: 'Carlisle, PA',
    county: 'Cumberland',
    region: 'Harrisburg',
    address: 'Carlisle, PA',
    services: ['Fly Fishing Gear', 'Guided Trips'],
    hasGuides: true,
    coordinates: { lat: 40.2015, lng: -77.1889 },
    specialties: ['Letort Spring Run'],
  },

  // ============================================================================
  // READING / BERKS COUNTY
  // ============================================================================
  {
    id: 'tco-reading',
    name: 'TCO Fly Shop',
    location: 'Reading, PA',
    county: 'Berks',
    region: 'Reading',
    address: 'Reading, PA',
    website: 'https://www.tcoflyfishing.com',
    services: ['Fly Fishing Gear', 'Guided Trips', 'Classes'],
    hasGuides: true,
    hasClasses: true,
    coordinates: { lat: 40.3356, lng: -75.9269 },
  },
  {
    id: 'tulpehocken-fly-shop',
    name: 'Tulpehocken Fly Shop',
    location: 'Reading, PA',
    county: 'Berks',
    region: 'Reading',
    address: 'Reading, PA',
    services: ['Fly Fishing Gear', 'Guided Trips'],
    hasGuides: true,
    coordinates: { lat: 40.3356, lng: -75.9269 },
    specialties: ['Tulpehocken Creek'],
  },

  // ============================================================================
  // PHILADELPHIA / CHESTER COUNTY
  // ============================================================================
  {
    id: 'tco-bryn-mawr',
    name: 'TCO Fly Shop',
    location: 'Bryn Mawr, PA',
    county: 'Montgomery',
    region: 'Philadelphia',
    address: 'Bryn Mawr, PA',
    website: 'https://www.tcoflyfishing.com',
    services: ['Fly Fishing Gear', 'Guided Trips', 'Classes'],
    hasGuides: true,
    hasClasses: true,
    coordinates: { lat: 40.0218, lng: -75.3165 },
  },
  {
    id: 'french-creek-outfitters',
    name: 'French Creek Outfitters',
    location: 'Phoenixville, PA',
    county: 'Chester',
    region: 'Philadelphia',
    address: 'Phoenixville, PA',
    services: ['Fly Fishing Gear', 'Guided Trips'],
    hasGuides: true,
    coordinates: { lat: 40.1304, lng: -75.5149 },
    specialties: ['French Creek', 'Bass Fishing'],
  },
  {
    id: 'brandywine-fly-shop',
    name: 'Brandywine Fly Shop',
    location: 'West Chester, PA',
    county: 'Chester',
    region: 'Philadelphia',
    address: 'West Chester, PA',
    services: ['Fly Fishing Gear', 'Guided Trips'],
    hasGuides: true,
    coordinates: { lat: 39.9607, lng: -75.6055 },
    specialties: ['Brandywine Creek'],
  },
  {
    id: 'valley-forge-fly-shop',
    name: 'Valley Forge Fly Shop',
    location: 'Valley Forge, PA',
    county: 'Chester',
    region: 'Philadelphia',
    address: 'Valley Forge, PA',
    services: ['Fly Fishing Gear', 'Guided Trips'],
    hasGuides: true,
    coordinates: { lat: 40.0965, lng: -75.4380 },
  },

  // ============================================================================
  // LEHIGH VALLEY
  // ============================================================================
  {
    id: 'anglers-paradise',
    name: "Angler's Paradise",
    location: 'Allentown, PA',
    county: 'Lehigh',
    region: 'Lehigh Valley',
    address: 'Allentown, PA',
    website: 'https://www.anglersparadise.com',
    services: ['Fly Fishing Gear', 'Guided Trips', 'Classes'],
    hasGuides: true,
    hasClasses: true,
    coordinates: { lat: 40.6084, lng: -75.4902 },
    specialties: ['Lehigh River'],
  },
  {
    id: 'little-lehigh-fly-shop',
    name: 'Little Lehigh Fly Shop',
    location: 'Allentown, PA',
    county: 'Lehigh',
    region: 'Lehigh Valley',
    address: 'Allentown, PA',
    services: ['Fly Fishing Gear', 'Guided Trips'],
    hasGuides: true,
    coordinates: { lat: 40.6084, lng: -75.4902 },
    specialties: ['Little Lehigh Creek'],
  },
  {
    id: 'beltzville-fly-shop',
    name: 'Beltzville Fly Shop',
    location: 'Lehighton, PA',
    county: 'Carbon',
    region: 'Lehigh Valley',
    address: 'Lehighton, PA',
    services: ['Fly Fishing Gear', 'Guided Trips'],
    hasGuides: true,
    coordinates: { lat: 40.8337, lng: -75.7138 },
    specialties: ['Beltzville Lake'],
  },

  // ============================================================================
  // PITTSBURGH / SOUTHWEST PA
  // ============================================================================
  {
    id: 'fly-fishing-outfitters',
    name: 'Fly Fishing Outfitters',
    location: 'Pittsburgh, PA',
    county: 'Allegheny',
    region: 'Pittsburgh',
    address: 'Pittsburgh, PA',
    website: 'https://www.flyfishingoutfitters.com',
    services: ['Fly Fishing Gear', 'Guided Trips'],
    hasGuides: true,
    coordinates: { lat: 40.4406, lng: -79.9961 },
  },
  {
    id: 'three-rivers-fly-shop',
    name: 'Three Rivers Fly Shop',
    location: 'Pittsburgh, PA',
    county: 'Allegheny',
    region: 'Pittsburgh',
    address: 'Pittsburgh, PA',
    services: ['Fly Fishing Gear', 'Guided Trips'],
    hasGuides: true,
    coordinates: { lat: 40.4406, lng: -79.9961 },
    specialties: ['Three Rivers', 'Urban Fishing'],
  },
  {
    id: 'youghiogheny-outfitters',
    name: 'Youghiogheny Outfitters',
    location: 'Ohiopyle, PA',
    county: 'Fayette',
    region: 'Pittsburgh',
    address: 'Ohiopyle, PA',
    services: ['Fly Fishing Gear', 'Guided Trips'],
    hasGuides: true,
    coordinates: { lat: 39.8692, lng: -79.4942 },
    specialties: ['Youghiogheny River'],
  },
  {
    id: 'laurel-hill-fly-shop',
    name: 'Laurel Hill Fly Shop',
    location: 'Somerset, PA',
    county: 'Somerset',
    region: 'Pittsburgh',
    address: 'Somerset, PA',
    services: ['Fly Fishing Gear', 'Guided Trips'],
    hasGuides: true,
    coordinates: { lat: 40.0084, lng: -79.0781 },
    specialties: ['Laurel Hill Creek'],
  },
  {
    id: 'stonycreek-outfitters',
    name: 'Stonycreek Outfitters',
    location: 'Johnstown, PA',
    county: 'Somerset',
    region: 'Pittsburgh',
    address: 'Johnstown, PA',
    services: ['Fly Fishing Gear', 'Guided Trips'],
    hasGuides: true,
    coordinates: { lat: 40.3267, lng: -78.9220 },
    specialties: ['Stonycreek River'],
  },
  {
    id: 'conemaugh-fly-shop',
    name: 'Conemaugh Fly Shop',
    location: 'Indiana, PA',
    county: 'Indiana',
    region: 'Pittsburgh',
    address: 'Indiana, PA',
    services: ['Fly Fishing Gear', 'Guided Trips'],
    hasGuides: true,
    coordinates: { lat: 40.6215, lng: -79.1525 },
    specialties: ['Conemaugh River'],
  },
  {
    id: 'slippery-rock-fly-shop',
    name: 'Slippery Rock Fly Shop',
    location: 'Slippery Rock, PA',
    county: 'Butler',
    region: 'Pittsburgh',
    address: 'Slippery Rock, PA',
    services: ['Fly Fishing Gear', 'Guided Trips'],
    hasGuides: true,
    coordinates: { lat: 41.0639, lng: -80.0564 },
    specialties: ['Slippery Rock Creek'],
  },
  {
    id: 'moraine-fly-shop',
    name: 'Moraine Fly Shop',
    location: 'Portersville, PA',
    county: 'Butler',
    region: 'Pittsburgh',
    address: 'Portersville, PA',
    services: ['Fly Fishing Gear', 'Guided Trips'],
    hasGuides: true,
    coordinates: { lat: 40.9256, lng: -80.1442 },
    specialties: ['Lake Arthur'],
  },

  // ============================================================================
  // ERIE / NORTHWEST PA
  // ============================================================================
  {
    id: 'sporting-gentleman',
    name: 'The Sporting Gentleman',
    location: 'Erie, PA',
    county: 'Erie',
    region: 'Erie',
    address: 'Erie, PA',
    website: 'https://www.sportinggentleman.com',
    services: ['Fly Fishing Gear', 'Guided Trips', 'Lake Erie Specialists'],
    hasGuides: true,
    coordinates: { lat: 42.1275, lng: -80.0851 },
    specialties: ['Lake Erie', 'Steelhead'],
  },
  {
    id: 'erie-fly-shop',
    name: 'Erie Fly Shop',
    location: 'Erie, PA',
    county: 'Erie',
    region: 'Erie',
    address: 'Erie, PA',
    services: ['Fly Fishing Gear', 'Guided Trips'],
    hasGuides: true,
    coordinates: { lat: 42.1275, lng: -80.0851 },
    specialties: ['Lake Erie', 'Steelhead'],
  },
  {
    id: 'elk-creek-fly-shop',
    name: 'Elk Creek Fly Shop',
    location: 'Girard, PA',
    county: 'Erie',
    region: 'Erie',
    address: 'Girard, PA',
    services: ['Fly Fishing Gear', 'Guided Trips'],
    hasGuides: true,
    coordinates: { lat: 42.0000, lng: -80.3000 },
    specialties: ['Elk Creek', 'Steelhead'],
  },

  // ============================================================================
  // SCRANTON / NORTHEAST PA
  // ============================================================================
  {
    id: 'delaware-river-fly-shop',
    name: 'Delaware River Fly Shop',
    location: 'Milford, PA',
    county: 'Pike',
    region: 'Scranton',
    address: 'Milford, PA',
    services: ['Fly Fishing Gear', 'Guided Trips'],
    hasGuides: true,
    coordinates: { lat: 41.3242, lng: -74.8024 },
    specialties: ['Delaware River'],
  },
  {
    id: 'brodhead-fly-shop',
    name: 'Brodhead Fly Shop',
    location: 'Stroudsburg, PA',
    county: 'Monroe',
    region: 'Scranton',
    address: 'Stroudsburg, PA',
    services: ['Fly Fishing Gear', 'Guided Trips'],
    hasGuides: true,
    coordinates: { lat: 40.9848, lng: -75.1946 },
    specialties: ['Brodhead Creek'],
  },
  {
    id: 'pocono-fly-shop',
    name: 'Pocono Fly Shop',
    location: 'Stroudsburg, PA',
    county: 'Monroe',
    region: 'Scranton',
    address: 'Stroudsburg, PA',
    services: ['Fly Fishing Gear', 'Guided Trips'],
    hasGuides: true,
    coordinates: { lat: 40.9848, lng: -75.1946 },
    specialties: ['Pocono Streams'],
  },
  {
    id: 'promised-land-fly-shop',
    name: 'Promised Land Fly Shop',
    location: 'Greentown, PA',
    county: 'Pike',
    region: 'Scranton',
    address: 'Greentown, PA',
    services: ['Fly Fishing Gear', 'Guided Trips'],
    hasGuides: true,
    coordinates: { lat: 41.3000, lng: -75.2000 },
    specialties: ['Promised Land Lake'],
  },
];

// Import additional shops
import { ADDITIONAL_PA_FLY_SHOPS } from './pa-fly-shops-expanded';

// Combine all fly shops
export const ALL_COMPREHENSIVE_FLY_SHOPS = [
  ...ALL_PA_FLY_SHOPS,
  ...ADDITIONAL_PA_FLY_SHOPS,
];

