import { NextResponse } from 'next/server';

/**
 * PFBC Data API Route
 * 
 * This API route serves as a proxy to fetch data from Pennsylvania Fish & Boat Commission
 * and PASDA (Pennsylvania Spatial Data Access) GIS services.
 * 
 * Data Sources:
 * 1. PFBC Trout Stocking Data - Via PASDA GeoJSON
 * 2. PFBC Access Points - Via PASDA GeoJSON
 * 3. Best Fishing Waters - Via PASDA GeoJSON
 * 
 * Note: These URLs are placeholders - actual PASDA data is available through:
 * https://www.pasda.psu.edu/uci/SearchResults.aspx?originator=Pennsylvania+Fish+and+Boat+Commission
 */

interface TroutStockingEvent {
  id: string;
  waterBodyName: string;
  county: string;
  date: string;
  species: string;
  quantity: number;
  size: string;
  latitude: number;
  longitude: number;
}

interface AccessPoint {
  id: string;
  name: string;
  waterBodyName: string;
  county: string;
  latitude: number;
  longitude: number;
  type: string;
  amenities: string[];
  accessibility: string;
  parking: boolean;
}

interface FishingWater {
  id: string;
  name: string;
  type: 'Lake' | 'Stream' | 'River' | 'Pond';
  county: string;
  latitude: number;
  longitude: number;
  species: string[];
  size: string;
  description: string;
  regulations: string;
}

// Sample data structure - In production, fetch from actual PASDA GeoJSON endpoints
const SAMPLE_TROUT_STOCKING: TroutStockingEvent[] = [
  {
    id: '1',
    waterBodyName: 'Spring Creek',
    county: 'Centre',
    date: '2024-04-01',
    species: 'Rainbow Trout',
    quantity: 2500,
    size: 'Adult (9-11")',
    latitude: 40.7934,
    longitude: -77.8600
  },
  {
    id: '2',
    waterBodyName: 'Penns Creek',
    county: 'Centre',
    date: '2024-04-05',
    species: 'Brown Trout',
    quantity: 1500,
    size: 'Adult (9-11")',
    latitude: 40.8670,
    longitude: -77.4167
  },
  {
    id: '3',
    waterBodyName: 'Little Lehigh Creek',
    county: 'Lehigh',
    date: '2024-04-08',
    species: 'Rainbow Trout',
    quantity: 3000,
    size: 'Adult (9-11")',
    latitude: 40.5931,
    longitude: -75.5043
  },
  {
    id: '4',
    waterBodyName: 'Kettle Creek',
    county: 'Clinton',
    date: '2024-04-10',
    species: 'Brook Trout',
    quantity: 800,
    size: 'Adult (8-10")',
    latitude: 41.3500,
    longitude: -77.8000
  },
  {
    id: '5',
    waterBodyName: 'Yellow Breeches Creek',
    county: 'Cumberland',
    date: '2024-04-12',
    species: 'Brown Trout',
    quantity: 2000,
    size: 'Adult (9-11")',
    latitude: 40.2000,
    longitude: -77.0000
  },
  {
    id: '6',
    waterBodyName: 'Tulpehocken Creek',
    county: 'Berks',
    date: '2024-04-15',
    species: 'Rainbow Trout',
    quantity: 2200,
    size: 'Adult (9-11")',
    latitude: 40.3500,
    longitude: -76.1000
  },
  {
    id: '7',
    waterBodyName: 'Big Spring Creek',
    county: 'Cumberland',
    date: '2024-04-18',
    species: 'Brown Trout',
    quantity: 1200,
    size: 'Trophy (14"+)',
    latitude: 40.1500,
    longitude: -77.2000
  },
  {
    id: '8',
    waterBodyName: 'Loyalsock Creek',
    county: 'Lycoming',
    date: '2024-04-20',
    species: 'Rainbow Trout',
    quantity: 3500,
    size: 'Adult (9-11")',
    latitude: 41.2500,
    longitude: -76.8000
  },
  {
    id: '9',
    waterBodyName: 'Brodhead Creek',
    county: 'Monroe',
    date: '2024-04-22',
    species: 'Brown Trout',
    quantity: 1800,
    size: 'Adult (9-11")',
    latitude: 41.0000,
    longitude: -75.2000
  },
  {
    id: '10',
    waterBodyName: 'Pine Creek',
    county: 'Tioga',
    date: '2024-04-25',
    species: 'Brook Trout',
    quantity: 1000,
    size: 'Adult (8-10")',
    latitude: 41.7000,
    longitude: -77.4000
  },
  // Fall stocking
  {
    id: '11',
    waterBodyName: 'Spring Creek',
    county: 'Centre',
    date: '2024-10-01',
    species: 'Brook Trout',
    quantity: 500,
    size: 'Adult (8-10")',
    latitude: 40.7934,
    longitude: -77.8600
  },
  {
    id: '12',
    waterBodyName: 'Penns Creek',
    county: 'Centre',
    date: '2024-10-05',
    species: 'Rainbow Trout',
    quantity: 1200,
    size: 'Adult (9-11")',
    latitude: 40.8670,
    longitude: -77.4167
  },
  {
    id: '13',
    waterBodyName: 'Kettle Creek',
    county: 'Clinton',
    date: '2024-10-10',
    species: 'Brown Trout',
    quantity: 600,
    size: 'Trophy (14"+)',
    latitude: 41.3500,
    longitude: -77.8000
  },
  {
    id: '14',
    waterBodyName: 'Little Lehigh Creek',
    county: 'Lehigh',
    date: '2024-10-12',
    species: 'Brown Trout',
    quantity: 2500,
    size: 'Adult (9-11")',
    latitude: 40.5931,
    longitude: -75.5043
  },
  {
    id: '15',
    waterBodyName: 'Yellow Breeches Creek',
    county: 'Cumberland',
    date: '2024-10-15',
    species: 'Rainbow Trout',
    quantity: 1800,
    size: 'Adult (9-11")',
    latitude: 40.2000,
    longitude: -77.0000
  }
];

const SAMPLE_ACCESS_POINTS: AccessPoint[] = [
  {
    id: 'ap-1',
    name: 'Fisherman\'s Paradise',
    waterBodyName: 'Spring Creek',
    county: 'Centre',
    latitude: 40.7934,
    longitude: -77.8600,
    type: 'Stream Access',
    amenities: ['Parking', 'Restrooms', 'Wheelchair Accessible', 'Picnic Area'],
    accessibility: 'Easy',
    parking: true
  },
  {
    id: 'ap-2',
    name: 'Coburn Access',
    waterBodyName: 'Penns Creek',
    county: 'Centre',
    latitude: 40.8670,
    longitude: -77.4167,
    type: 'Stream Access',
    amenities: ['Parking', 'Stream Access'],
    accessibility: 'Moderate',
    parking: true
  },
  {
    id: 'ap-3',
    name: 'Seven Points Marina',
    waterBodyName: 'Raystown Lake',
    county: 'Huntingdon',
    latitude: 40.4167,
    longitude: -78.0833,
    type: 'Boat Launch',
    amenities: ['Boat Launch', 'Parking', 'Marina', 'Restrooms', 'Picnic Area', 'Fuel'],
    accessibility: 'Easy',
    parking: true
  },
  {
    id: 'ap-4',
    name: 'Susquehannock Campground',
    waterBodyName: 'Raystown Lake',
    county: 'Huntingdon',
    latitude: 40.4200,
    longitude: -78.0900,
    type: 'Boat Launch',
    amenities: ['Boat Launch', 'Camping', 'Swimming', 'Parking', 'Restrooms'],
    accessibility: 'Moderate',
    parking: true
  },
  {
    id: 'ap-5',
    name: 'Presque Isle State Park',
    waterBodyName: 'Lake Erie',
    county: 'Erie',
    latitude: 42.1275,
    longitude: -80.0851,
    type: 'Multiple Launches',
    amenities: ['Multiple Launches', 'Parking', 'Beach', 'Trails', 'Visitor Center', 'Restrooms'],
    accessibility: 'Easy',
    parking: true
  },
  {
    id: 'ap-6',
    name: 'Mangan\'s Boat Launch',
    waterBodyName: 'Lake Wallenpaupack',
    county: 'Pike',
    latitude: 41.3500,
    longitude: -75.1833,
    type: 'Boat Launch',
    amenities: ['Boat Launch', 'Parking', 'Marina', 'Fuel'],
    accessibility: 'Easy',
    parking: true
  },
  {
    id: 'ap-7',
    name: 'Little Lehigh Parkway',
    waterBodyName: 'Little Lehigh Creek',
    county: 'Lehigh',
    latitude: 40.5931,
    longitude: -75.5043,
    type: 'Stream Access',
    amenities: ['Parking', 'Trails', 'Picnic Area'],
    accessibility: 'Easy',
    parking: true
  },
  {
    id: 'ap-8',
    name: 'Allenberry Resort Access',
    waterBodyName: 'Yellow Breeches Creek',
    county: 'Cumberland',
    latitude: 40.2000,
    longitude: -77.0000,
    type: 'Stream Access',
    amenities: ['Parking', 'Stream Access'],
    accessibility: 'Easy',
    parking: true
  },
  {
    id: 'ap-9',
    name: 'Leonard Harrison State Park',
    waterBodyName: 'Pine Creek',
    county: 'Tioga',
    latitude: 41.7000,
    longitude: -77.4000,
    type: 'Stream Access',
    amenities: ['Parking', 'Overlook', 'Trails', 'Visitor Center'],
    accessibility: 'Moderate',
    parking: true
  },
  {
    id: 'ap-10',
    name: 'Brodheadsville Access',
    waterBodyName: 'Brodhead Creek',
    county: 'Monroe',
    latitude: 41.0000,
    longitude: -75.2000,
    type: 'Stream Access',
    amenities: ['Parking', 'Stream Access'],
    accessibility: 'Moderate',
    parking: true
  }
];

const SAMPLE_BEST_WATERS: FishingWater[] = [
  {
    id: 'water-1',
    name: 'Spring Creek',
    type: 'Stream',
    county: 'Centre',
    latitude: 40.7934,
    longitude: -77.8600,
    species: ['Brook Trout', 'Brown Trout', 'Rainbow Trout'],
    size: '15 miles',
    description: 'Spring-fed limestone stream with excellent trout habitat and year-round fishing',
    regulations: 'Fly fishing only, catch & release in designated areas'
  },
  {
    id: 'water-2',
    name: 'Raystown Lake',
    type: 'Lake',
    county: 'Huntingdon',
    latitude: 40.4167,
    longitude: -78.0833,
    species: ['Smallmouth Bass', 'Largemouth Bass', 'Walleye', 'Muskellunge', 'Crappie', 'Bluegill', 'Yellow Perch', 'Channel Catfish'],
    size: '8,300 acres',
    description: 'Premier fishing destination with rocky points, coves, and deep channels',
    regulations: 'Bass: 15" minimum, Walleye: 18" minimum, Muskie: 40" minimum'
  },
  {
    id: 'water-3',
    name: 'Lake Erie (Presque Isle Bay)',
    type: 'Lake',
    county: 'Erie',
    latitude: 42.1275,
    longitude: -80.0851,
    species: ['Smallmouth Bass', 'Walleye', 'Yellow Perch', 'Northern Pike', 'Muskellunge', 'Channel Catfish'],
    size: '3,200 acres (bay)',
    description: 'World-class fishing for walleye and perch with protected bay habitat',
    regulations: 'Check PA & Great Lakes regulations - Special seasons apply'
  },
  {
    id: 'water-4',
    name: 'Lake Wallenpaupack',
    type: 'Lake',
    county: 'Pike/Wayne',
    latitude: 41.3500,
    longitude: -75.1833,
    species: ['Smallmouth Bass', 'Largemouth Bass', 'Walleye', 'Yellow Perch', 'Crappie', 'Bluegill', 'Channel Catfish'],
    size: '5,700 acres',
    description: 'Large reservoir with rocky shorelines, submerged timber, and deep basins',
    regulations: 'Bass: 12" minimum, No size limits on panfish'
  },
  {
    id: 'water-5',
    name: 'Penns Creek',
    type: 'Stream',
    county: 'Centre/Snyder',
    latitude: 40.8670,
    longitude: -77.4167,
    species: ['Brown Trout', 'Smallmouth Bass'],
    size: '67 miles',
    description: 'Freestone stream with excellent insect hatches and deep pools',
    regulations: 'Trophy trout section - Special regulations'
  },
  {
    id: 'water-6',
    name: 'Little Lehigh Creek',
    type: 'Stream',
    county: 'Lehigh',
    latitude: 40.5931,
    longitude: -75.5043,
    species: ['Brown Trout', 'Rainbow Trout'],
    size: '26 miles',
    description: 'Urban trout stream with excellent fly fishing opportunities',
    regulations: 'Catch & release fly fishing only in special regulation areas'
  },
  {
    id: 'water-7',
    name: 'Kettle Creek',
    type: 'Stream',
    county: 'Clinton',
    latitude: 41.3500,
    longitude: -77.8000,
    species: ['Brook Trout', 'Brown Trout'],
    size: '44 miles',
    description: 'Remote wilderness stream with native and stocked trout',
    regulations: 'Trophy trout regulations in select areas'
  },
  {
    id: 'water-8',
    name: 'Yellow Breeches Creek',
    type: 'Stream',
    county: 'Cumberland',
    latitude: 40.2000,
    longitude: -77.0000,
    species: ['Brown Trout', 'Rainbow Trout'],
    size: '60 miles',
    description: 'Popular limestone stream with consistent hatches and large trout',
    regulations: 'Special trophy regulations in sections'
  },
  {
    id: 'water-9',
    name: 'Pine Creek',
    type: 'Stream',
    county: 'Tioga',
    latitude: 41.7000,
    longitude: -77.4000,
    species: ['Brook Trout', 'Brown Trout', 'Smallmouth Bass'],
    size: '87 miles',
    description: 'Pennsylvania Grand Canyon stream with diverse fishing opportunities',
    regulations: 'Varies by section - check current regulations'
  },
  {
    id: 'water-10',
    name: 'Loyalsock Creek',
    type: 'Stream',
    county: 'Lycoming',
    latitude: 41.2500,
    longitude: -76.8000,
    species: ['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass'],
    size: '64 miles',
    description: 'Scenic mountain stream with quality trout and bass fishing',
    regulations: 'Delayed harvest and trophy trout sections'
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dataType = searchParams.get('type');
  const county = searchParams.get('county');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    switch (dataType) {
      case 'stocking':
        // Use comprehensive PFBC stocking data
        const { PFBC_STOCKING_SCHEDULES } = await import('@/data/pfbc-complete-data');
        let stockingData = PFBC_STOCKING_SCHEDULES.map(s => ({
          id: s.waterwayId,
          waterway: s.waterwayName,
          county: s.county,
          date: s.stockingDate,
          species: s.species,
          quantity: s.quantity,
          size: s.sizeClass,
          averageLength: s.averageLength,
          coordinates: s.coordinates,
          notes: s.notes,
        }));
        
        if (county && county !== 'all') {
          stockingData = stockingData.filter(s => s.county === county);
        }
        
        if (startDate && endDate) {
          stockingData = stockingData.filter(s => {
            const stockDate = new Date(s.date);
            return stockDate >= new Date(startDate) && stockDate <= new Date(endDate);
          });
        }
        
        return NextResponse.json({
          success: true,
          data: stockingData,
          count: stockingData.length,
          source: 'PFBC Complete Data - Sync with PFBC API in production: https://apps.fishandboat.pa.gov/StockingSchedule/'
        });

      case 'access-points':
        // Use comprehensive PFBC access points data
        const { PFBC_ACCESS_POINTS } = await import('@/data/pfbc-complete-data');
        let accessData = PFBC_ACCESS_POINTS.map(a => ({
          id: a.id,
          waterway: a.waterwayName,
          name: a.name,
          type: a.type,
          county: a.county,
          coordinates: a.coordinates,
          amenities: a.amenities,
          parking: a.parking,
          wheelchairAccessible: a.wheelchairAccessible,
          notes: a.notes,
        }));
        
        if (county && county !== 'all') {
          accessData = accessData.filter(a => a.county === county);
        }
        
        return NextResponse.json({
          success: true,
          data: accessData,
          count: accessData.length,
          source: 'PFBC Complete Data - Sync with PASDA GeoJSON in production'
        });

      case 'best-waters':
        // Redirect to mapping layers endpoint for comprehensive water data
        return NextResponse.json({
          success: true,
          message: 'Use /api/pfbc/mapping-layers for comprehensive water data',
          redirect: '/api/pfbc/mapping-layers',
          data: SAMPLE_BEST_WATERS, // Fallback sample data
          count: SAMPLE_BEST_WATERS.length,
          source: 'Legacy endpoint - Use /api/pfbc/mapping-layers for production data'
        });

      case 'all':
        return NextResponse.json({
          success: true,
          data: {
            stocking: SAMPLE_TROUT_STOCKING,
            accessPoints: SAMPLE_ACCESS_POINTS,
            bestWaters: SAMPLE_BEST_WATERS
          },
          source: 'Sample Data - Replace with PASDA GeoJSON in production'
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid data type. Use: stocking, access-points, best-waters, or all'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('PFBC Data API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch PFBC data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * Legacy PFBC Data API Route
 * 
 * This route now redirects to dedicated PFBC endpoints:
 * - Stocking: /api/pfbc/stocking
 * - Access Points: /api/pfbc/access-points
 * - Regulations: /api/pfbc/regulations
 * - Habitat: /api/pfbc/habitat
 * - Mapping Layers: /api/pfbc/mapping-layers
 * 
 * For production, use the sync script: npm run sync:pfbc
 * This syncs data from PFBC sources and updates the database.
 */

