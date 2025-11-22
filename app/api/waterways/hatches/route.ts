/**
 * Waterway Hatch Data API
 * Returns macroinvertebrate hatch information for waterways
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/client';


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const waterwayId = searchParams.get('waterwayId');
  const month = searchParams.get('month');
  const waterType = searchParams.get('waterType');

  try {
    let query = supabaseAdmin
      .from('waterway_hatches')
      .select(`
        *,
        hatch:macroinvertebrate_hatches(*),
        waterway:field_sites(id, name, site_type)
      `);

    if (waterwayId) {
      query = query.eq('field_site_id', waterwayId);
    }

    if (month) {
      query = query.eq('hatch.peak_month', month);
    }

    if (waterType) {
      query = query.contains('hatch.water_types', [waterType]);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0,
    });
  } catch (error) {
    console.error('Error fetching hatch data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch hatch data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}


