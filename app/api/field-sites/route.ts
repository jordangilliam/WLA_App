import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/client';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius') || '50000'; // 50km default

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    let query = supabaseAdmin
      .from('field_sites')
      .select('id, name, description, site_type, latitude, longitude, address, city, state, ecological_notes, species_commonly_found, habitat_types');

    // If location provided, filter by distance
    if (lat && lng) {
      // PostGIS distance query (in meters)
      query = query
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);
    }

    const { data: sites, error } = await query;

    if (error) {
      console.error('Error fetching field sites:', error);
      return NextResponse.json(
        { error: 'Failed to fetch field sites' },
        { status: 500 }
      );
    }

    // Calculate distance if user location provided
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      const maxRadius = parseInt(radius);

      const sitesArray = (sites as Array<{ latitude: number; longitude: number }> | null) || [];
      const sitesWithDistance = sitesArray
        .map((site) => {
          const distance = calculateDistance(
            userLat,
            userLng,
            site.latitude,
            site.longitude
          );
          return {
            ...site,
            distance_meters: Math.round(distance),
          };
        })
        .filter((site) => site.distance_meters <= maxRadius)
        .sort((a, b) => a.distance_meters - b.distance_meters);

      return NextResponse.json({ sites: sitesWithDistance });
    }

    return NextResponse.json({ sites: sites || [] });
  } catch (error) {
    console.error('Unexpected error fetching field sites:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Haversine formula for distance calculation
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

