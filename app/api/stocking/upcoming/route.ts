import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check database connection
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const species = searchParams.get('species');
    const startDate = searchParams.get('startDate') || new Date().toISOString().split('T')[0];

    // Fetch upcoming stockings using the RPC function
    const { data: stockings, error } = await supabaseAdmin.rpc(
      'get_upcoming_stockings',
      {
        days_ahead: 90,
        limit_count: limit,
      } as never
    );

    if (error) {
      console.error('Error fetching stockings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch stocking schedule' },
        { status: 500 }
      );
    }

    const stockingRows = (stockings as any[] | null) || [];

    // Fetch field sites for the stocked locations
    const fieldSiteIds = [...new Set(stockingRows.map((s: any) => s.field_site_id))];

    const { data: fieldSites, error: sitesError } = await supabaseAdmin
      .from('field_sites')
      .select('id, name, latitude, longitude, site_type')
      .in('id', fieldSiteIds);

    if (sitesError) {
      console.error('Error fetching field sites:', sitesError);
    }

    // Transform data
    const transformedStockings = stockingRows.map((stocking: any) => ({
      id: stocking.id,
      field_site_id: stocking.field_site_id,
      site_name: stocking.site_name,
      stocking_date: stocking.stocking_date,
      species: stocking.species,
      quantity: stocking.quantity || 0,
      size_range: stocking.size_range || 'Various',
      status: stocking.status || 'scheduled',
      water_body_name: stocking.water_body_name,
    }));

    return NextResponse.json({
      success: true,
      stockings: transformedStockings,
      fieldSites: fieldSites || [],
      count: transformedStockings.length,
    });
  } catch (error) {
    console.error('Error in stocking API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

