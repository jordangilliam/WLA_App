import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/auth.config';
import { supabaseAdmin } from '@/lib/db/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const radius = parseFloat(searchParams.get('radius') || '50000'); // 50km default

    // Validate coordinates
    if (!lat || !lng || lat === 0 || lng === 0) {
      return NextResponse.json(
        { error: 'Valid latitude and longitude required' },
        { status: 400 }
      );
    }

    // Check database connection
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    // Use the nearby_field_sites database function
    const { data: sites, error } = await supabaseAdmin.rpc(
      'nearby_field_sites',
      {
        user_lat: lat,
        user_lng: lng,
        radius_meters: radius,
      } as never
    );

    if (error) {
      console.error('Error fetching nearby sites:', error);
      return NextResponse.json(
        { error: 'Failed to fetch nearby sites' },
        { status: 500 }
      );
    }

    // Transform the data to include latitude/longitude
    // The PostGIS geography type is returned as a point
    const siteList = (sites as any[] | null) || []
    const transformedSites = siteList.map((site: any) => ({
      id: site.id,
      name: site.name,
      description: site.description,
      site_type: site.site_type,
      address: site.address,
      city: site.city || 'Unknown',
      state: site.state || 'PA',
      distance_meters: site.distance_meters,
      visit_count: site.visit_count || 0,
      // Extract lat/lng from geography
      latitude: site.latitude,
      longitude: site.longitude,
    }));

    // If the function doesn't return lat/lng, fetch them separately
    if (transformedSites.length > 0 && !transformedSites[0].latitude) {
      const siteIds = transformedSites.map((s: any) => s.id);
      const { data: fullSites } = await supabaseAdmin
        .from('field_sites')
        .select('id, name, description, site_type, address, city, state, ecological_notes, species_likely, habitat_type')
        .in('id', siteIds);

      // Merge the data
      transformedSites.forEach((site: any) => {
        const fullSite = (fullSites || []).find((fs: any) => fs.id === site.id);
        if (fullSite) {
          Object.assign(site, fullSite);
        }
      });

      // Extract coordinates from location geography
      for (const site of transformedSites) {
        const { data: coords } = await supabaseAdmin
          .from('field_sites')
          .select('location')
          .eq('id', site.id)
          .single();

        const coordRow = coords as { location?: any } | null

        if (coordRow && coordRow.location) {
          // Parse WKT or GeoJSON
          try {
            // PostGIS returns geography as GeoJSON
            const locationStr = coordRow.location;
            if (typeof locationStr === 'string') {
              // Parse WKT format: POINT(lng lat)
              const match = locationStr.match(/POINT\(([^ ]+) ([^)]+)\)/);
              if (match) {
                site.longitude = parseFloat(match[1]);
                site.latitude = parseFloat(match[2]);
              }
            } else if (locationStr.coordinates) {
              // GeoJSON format
              site.longitude = locationStr.coordinates[0];
              site.latitude = locationStr.coordinates[1];
            }
          } catch (e) {
            console.error('Error parsing location:', e);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      sites: transformedSites,
      count: transformedSites.length,
      userLocation: { latitude: lat, longitude: lng },
      radius: radius,
    });
  } catch (error) {
    console.error('Error in nearby locations API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
