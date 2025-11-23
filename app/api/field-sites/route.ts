import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/client';

// Enable caching for better performance (5 minutes)
export const revalidate = 300;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius') || '50000'; // 50km default
    const limit = parseInt(searchParams.get('limit') || '100'); // Limit results
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    let query = supabaseAdmin
      .from('field_sites')
      .select('id, name, description, site_type, latitude, longitude, address, city, state, ecological_notes, species_commonly_found, habitat_types', { count: 'exact' })
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .limit(Math.min(limit, 200)) // Cap at 200
      .range(offset, offset + Math.min(limit, 200) - 1);

    // If location provided, use PostGIS for efficient distance filtering
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      const maxRadius = parseInt(radius);

      // Use PostGIS ST_DWithin for efficient distance filtering
      // This filters in the database instead of fetching all records
      const { data: sites, error, count } = await supabaseAdmin.rpc('get_nearby_field_sites', {
        user_lat: userLat,
        user_lng: userLng,
        max_distance_meters: maxRadius,
        result_limit: Math.min(limit, 200),
        result_offset: offset,
      });

      if (error) {
        // Fallback to client-side calculation if RPC doesn't exist
        console.warn('PostGIS RPC not available, using fallback:', error);
        return await fallbackDistanceQuery(userLat, userLng, maxRadius, limit, offset);
      }

      return NextResponse.json(
        { 
          sites: sites || [],
          pagination: {
            total: count || 0,
            limit,
            offset,
            hasMore: (count || 0) > offset + limit,
          },
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          },
        }
      );
    }

    const { data: sites, error, count } = await query;

    if (error) {
      console.error('Error fetching field sites:', error);
      return NextResponse.json(
        { error: 'Failed to fetch field sites' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        sites: sites || [],
        pagination: {
          total: count || 0,
          limit,
          offset,
          hasMore: (count || 0) > offset + limit,
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('Unexpected error fetching field sites:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Fallback function if PostGIS RPC is not available
async function fallbackDistanceQuery(
  userLat: number,
  userLng: number,
  maxRadius: number,
  limit: number,
  offset: number
) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Database connection not available' },
      { status: 500 }
    );
  }

  // Fetch sites with a reasonable limit for client-side filtering
  const { data: sites, error } = await supabaseAdmin
    .from('field_sites')
    .select('id, name, description, site_type, latitude, longitude, address, city, state, ecological_notes, species_commonly_found, habitat_types')
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)
    .limit(500); // Reasonable limit for client-side filtering

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch field sites' },
      { status: 500 }
    );
  }

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
    .sort((a, b) => a.distance_meters - b.distance_meters)
    .slice(offset, offset + limit);

  return NextResponse.json(
    { 
      sites: sitesWithDistance,
      pagination: {
        total: sitesWithDistance.length,
        limit,
        offset,
        hasMore: sitesWithDistance.length === limit,
      },
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    }
  );
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

