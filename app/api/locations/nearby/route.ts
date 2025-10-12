/**
 * Nearby Locations API Route
 * Find locations near user's current position
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/auth.config';
import { findLocationsWithinRadius } from '@/lib/utils/geolocation';
import type { Coordinates } from '@/lib/types/location.types';

// ============================================================================
// GET /api/locations/nearby
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const latitude = parseFloat(searchParams.get('latitude') || '');
    const longitude = parseFloat(searchParams.get('longitude') || '');
    const radius = parseInt(searchParams.get('radius') || '10000'); // Default 10km
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Validate coordinates
    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        { error: 'Invalid coordinates provided' },
        { status: 400 }
      );
    }

    const userCoords: Coordinates = { latitude, longitude };

    // Get authenticated user (optional for this endpoint)
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // TODO: Fetch locations from database using PostGIS
    // const locations = await db.$queryRaw`
    //   SELECT 
    //     id, name, category, description,
    //     ST_AsGeoJSON(coordinates)::json->'coordinates' as coords,
    //     ST_Distance(
    //       coordinates::geography,
    //       ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography
    //     ) as distance,
    //     base_points, rarity, images,
    //     is_active
    //   FROM locations
    //   WHERE 
    //     is_active = true
    //     ${category ? Prisma.sql`AND category = ${category}` : Prisma.empty}
    //     AND ST_DWithin(
    //       coordinates::geography,
    //       ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography,
    //       ${radius}
    //     )
    //   ORDER BY distance ASC
    //   LIMIT ${limit}
    // `;

    // Mock locations for development
    const mockLocations = [
      {
        id: '1',
        name: 'Gifford Pinchot State Park',
        category: 'state_park',
        description: 'Beautiful state park with lake recreation',
        coordinates: { latitude: 40.0631, longitude: -76.8622 },
        basePoints: 25,
        firstVisitBonus: 100,
        rarity: 'uncommon',
        images: ['/images/locations/pinchot.jpg'],
        hasVisited: false,
      },
      {
        id: '2',
        name: 'Ned Smith Center for Nature & Art',
        category: 'nature_center',
        description: 'Nature center with art gallery and trails',
        coordinates: { latitude: 40.5331, longitude: -76.8894 },
        basePoints: 30,
        firstVisitBonus: 100,
        rarity: 'rare',
        images: ['/images/locations/nedsmith.jpg'],
        hasVisited: false,
      },
      {
        id: '3',
        name: 'Dauphin County Library',
        category: 'library',
        description: 'Public library with nature programs',
        coordinates: { latitude: 40.2677, longitude: -76.8839 },
        basePoints: 15,
        firstVisitBonus: 50,
        rarity: 'common',
        images: [],
        hasVisited: false,
      },
    ];

    // Calculate distances and format
    const locationsWithDistance = mockLocations.map(location => {
      const distance = calculateDistanceSimple(userCoords, location.coordinates);
      return {
        ...location,
        distance,
        distanceFormatted: formatDistance(distance),
      };
    });

    // Sort by distance
    locationsWithDistance.sort((a, b) => a.distance - b.distance);

    // TODO: If user is authenticated, check which locations they've visited
    // if (userId) {
    //   const visitedIds = await db.userVisit.findMany({
    //     where: { userId },
    //     select: { locationId: true },
    //     distinct: ['locationId'],
    //   });
    //   const visitedSet = new Set(visitedIds.map(v => v.locationId));
    //   
    //   locationsWithDistance.forEach(loc => {
    //     loc.hasVisited = visitedSet.has(loc.id);
    //   });
    // }

    return NextResponse.json({
      locations: locationsWithDistance.slice(0, limit),
      userLocation: userCoords,
      radius,
      total: locationsWithDistance.length,
    });

  } catch (error) {
    console.error('Nearby locations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Simple distance calculation (Haversine)
 */
function calculateDistanceSimple(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371000; // Earth radius in meters
  const lat1 = toRadians(coord1.latitude);
  const lat2 = toRadians(coord2.latitude);
  const deltaLat = toRadians(coord2.latitude - coord1.latitude);
  const deltaLon = toRadians(coord2.longitude - coord1.longitude);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  } else {
    return `${(meters / 1000).toFixed(1)}km`;
  }
}

