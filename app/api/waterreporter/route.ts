import { NextResponse } from 'next/server';

/**
 * WaterReporter API Integration
 * 
 * Fetches community water quality observations from WaterReporter API
 * Documentation: https://docs.waterreporter.org/
 * 
 * This proxy API route handles authentication and data formatting.
 */

interface WaterReporterObservation {
  id: string;
  created: string;
  updated: string;
  status: 'published' | 'draft' | 'pending';
  owner: number; // user ID
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  description: string;
  pollution: boolean;
  images?: string[];
  waterQuality?: {
    ph?: number;
    temperature?: number;
    turbidity?: string;
    dissolvedOxygen?: number;
  };
  tags?: string[];
}

interface FormattedObservation {
  id: string;
  timestamp: number;
  latitude: number;
  longitude: number;
  description: string;
  isPollution: boolean;
  waterQuality?: {
    ph?: number;
    temperature?: number;
    turbidity?: string;
    dissolvedOxygen?: number;
  };
  images?: string[];
  tags?: string[];
  source: 'waterreporter';
}

// Sample data for development - Replace with actual API calls in production
const SAMPLE_OBSERVATIONS: FormattedObservation[] = [
  {
    id: 'wr-1',
    timestamp: Date.now() - 86400000, // 1 day ago
    latitude: 40.7934,
    longitude: -77.8600,
    description: 'Clear water observed in Spring Creek. Good mayfly hatch.',
    isPollution: false,
    waterQuality: {
      ph: 7.2,
      temperature: 58,
      turbidity: 'Clear',
      dissolvedOxygen: 8.5
    },
    tags: ['spring-creek', 'trout', 'clear-water'],
    source: 'waterreporter'
  },
  {
    id: 'wr-2',
    timestamp: Date.now() - 172800000, // 2 days ago
    latitude: 40.4167,
    lon: -78.0833,
    description: 'Raystown Lake water quality good. No visible pollution.',
    isPollution: false,
    waterQuality: {
      ph: 7.5,
      temperature: 72,
      turbidity: 'Slightly turbid',
      dissolvedOxygen: 7.0
    },
    tags: ['raystown-lake', 'bass', 'good-conditions'],
    source: 'waterreporter'
  },
  {
    id: 'wr-3',
    timestamp: Date.now() - 259200000, // 3 days ago
    latitude: 40.5931,
    longitude: -75.5043,
    description: 'Oil sheen observed in Little Lehigh Creek. Possible runoff from parking lot.',
    isPollution: true,
    waterQuality: {
      turbidity: 'Cloudy'
    },
    tags: ['little-lehigh', 'pollution', 'runoff'],
    source: 'waterreporter'
  },
  {
    id: 'wr-4',
    timestamp: Date.now() - 345600000, // 4 days ago
    latitude: 42.1275,
    longitude: -80.0851,
    description: 'Lake Erie water quality excellent. Walleye are biting!',
    isPollution: false,
    waterQuality: {
      ph: 8.0,
      temperature: 65,
      turbidity: 'Clear',
      dissolvedOxygen: 9.0
    },
    tags: ['lake-erie', 'walleye', 'excellent-conditions'],
    source: 'waterreporter'
  },
  {
    id: 'wr-5',
    timestamp: Date.now() - 432000000, // 5 days ago
    latitude: 40.8670,
    longitude: -77.4167,
    description: 'Sediment runoff observed in Penns Creek after heavy rain. Water cloudy.',
    isPollution: true,
    waterQuality: {
      turbidity: 'Very turbid',
      ph: 6.8
    },
    tags: ['penns-creek', 'sediment', 'storm-runoff'],
    source: 'waterreporter'
  },
  {
    id: 'wr-6',
    timestamp: Date.now() - 518400000, // 6 days ago
    latitude: 41.3500,
    longitude: -75.1833,
    description: 'Lake Wallenpaupack clear and calm. Great smallmouth bass fishing.',
    isPollution: false,
    waterQuality: {
      ph: 7.3,
      temperature: 68,
      turbidity: 'Clear',
      dissolvedOxygen: 7.5
    },
    tags: ['wallenpaupack', 'smallmouth-bass', 'good-fishing'],
    source: 'waterreporter'
  },
  {
    id: 'wr-7',
    timestamp: Date.now() - 604800000, // 7 days ago
    latitude: 40.2000,
    longitude: -77.0000,
    description: 'Yellow Breeches Creek flowing well. Sulphur hatch starting.',
    isPollution: false,
    waterQuality: {
      ph: 7.4,
      temperature: 62,
      turbidity: 'Clear',
      dissolvedOxygen: 8.0
    },
    tags: ['yellow-breeches', 'trout', 'hatch'],
    source: 'waterreporter'
  },
  {
    id: 'wr-8',
    timestamp: Date.now() - 691200000, // 8 days ago
    latitude: 41.2500,
    longitude: -76.8000,
    description: 'Loyalsock Creek water quality excellent after recent cold front.',
    isPollution: false,
    waterQuality: {
      ph: 7.1,
      temperature: 55,
      turbidity: 'Clear',
      dissolvedOxygen: 9.2
    },
    tags: ['loyalsock-creek', 'trout', 'cold-water'],
    source: 'waterreporter'
  },
  {
    id: 'wr-9',
    timestamp: Date.now() - 777600000, // 9 days ago
    latitude: 40.3500,
    longitude: -76.1000,
    description: 'Tulpehocken Creek slightly elevated after rain. Fish still active.',
    isPollution: false,
    waterQuality: {
      turbidity: 'Slightly turbid',
      ph: 7.0
    },
    tags: ['tulpehocken-creek', 'high-water'],
    source: 'waterreporter'
  },
  {
    id: 'wr-10',
    timestamp: Date.now() - 864000000, // 10 days ago
    latitude: 41.7000,
    longitude: -77.4000,
    description: 'Pine Creek (PA Grand Canyon) pristine conditions. Wild trout abundant.',
    isPollution: false,
    waterQuality: {
      ph: 6.9,
      temperature: 52,
      turbidity: 'Clear',
      dissolvedOxygen: 9.5
    },
    tags: ['pine-creek', 'wild-trout', 'pristine'],
    source: 'waterreporter'
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bbox = searchParams.get('bbox'); // Format: west,south,east,north
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const pollutionOnly = searchParams.get('pollutionOnly') === 'true';

  try {
    // In production, fetch from actual WaterReporter API:
    // const apiUrl = 'https://api.waterreporter.org/v1/report';
    // const response = await fetch(apiUrl, {
    //   headers: {
    //     'Authorization': `Bearer ${process.env.WATERREPORTER_API_KEY}`,
    //     'Content-Type': 'application/json'
    //   }
    // });

    let observations = [...SAMPLE_OBSERVATIONS];

    // Filter by bounding box
    if (bbox) {
      const [west, south, east, north] = bbox.split(',').map(Number);
      observations = observations.filter(obs => 
        obs.longitude >= west &&
        obs.longitude <= east &&
        obs.latitude >= south &&
        obs.latitude <= north
      );
    }

    // Filter by date range
    if (startDate && endDate) {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      observations = observations.filter(obs =>
        obs.timestamp >= start && obs.timestamp <= end
      );
    }

    // Filter by pollution
    if (pollutionOnly) {
      observations = observations.filter(obs => obs.isPollution);
    }

    return NextResponse.json({
      success: true,
      data: observations,
      count: observations.length,
      source: 'Sample Data - Replace with WaterReporter API in production',
      apiDocs: 'https://docs.waterreporter.org/'
    });
  } catch (error) {
    console.error('WaterReporter API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch water quality observations',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * POST - Submit new water quality observation
 * 
 * In production, this would submit to WaterReporter API
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.latitude || !body.longitude || !body.description) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: latitude, longitude, description'
      }, { status: 400 });
    }

    // In production, post to WaterReporter API:
    // const apiUrl = 'https://api.waterreporter.org/v1/report';
    // const response = await fetch(apiUrl, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.WATERREPORTER_API_KEY}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     geometry: {
    //       type: 'Point',
    //       coordinates: [body.longitude, body.latitude]
    //     },
    //     description: body.description,
    //     pollution: body.isPollution || false,
    //     waterQuality: body.waterQuality
    //   })
    // });

    // For now, return success with generated ID
    const newObservation: FormattedObservation = {
      id: `wr-${Date.now()}`,
      timestamp: Date.now(),
      latitude: body.latitude,
      longitude: body.longitude,
      description: body.description,
      isPollution: body.isPollution || false,
      waterQuality: body.waterQuality,
      images: body.images,
      tags: body.tags,
      source: 'waterreporter'
    };

    return NextResponse.json({
      success: true,
      data: newObservation,
      message: 'Observation submitted successfully (sample mode)'
    });
  } catch (error) {
    console.error('Failed to submit observation:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to submit observation',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * TODO: Production Implementation
 * 
 * 1. Get WaterReporter API key:
 *    - Sign up at https://waterreporter.org/
 *    - Request API access
 *    - Add to .env.local: WATERREPORTER_API_KEY=your_key_here
 * 
 * 2. Implement actual API calls:
 *    - GET /v1/report - Fetch observations
 *    - POST /v1/report - Submit observations
 *    - Handle authentication
 *    - Transform data format
 * 
 * 3. Add caching:
 *    - Cache observations for performance
 *    - Implement refresh strategy
 *    - Handle offline mode
 * 
 * 4. Add image upload:
 *    - Upload photos to WaterReporter
 *    - Handle large files
 *    - Add progress tracking
 * 
 * 5. Implement user authentication:
 *    - Link WLA accounts to WaterReporter
 *    - Handle OAuth if available
 *    - Track user contributions
 */

