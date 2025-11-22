/**
 * PFBC Access Points API
 * Returns PFBC boat launches, shore access, and wade access points
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/client';
import { PFBC_ACCESS_POINTS } from '@/data/pfbc-complete-data';


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const waterwayName = searchParams.get('waterwayName');
  const county = searchParams.get('county');
  const region = searchParams.get('region');
  const type = searchParams.get('type');
  const wheelchairAccessible = searchParams.get('wheelchairAccessible') === 'true';

  try {
    let accessPoints = [...PFBC_ACCESS_POINTS];

    // Filter by waterway name
    if (waterwayName) {
      accessPoints = accessPoints.filter((a) =>
        a.waterwayName.toLowerCase().includes(waterwayName.toLowerCase())
      );
    }

    // Filter by county
    if (county) {
      accessPoints = accessPoints.filter((a) => a.county === county);
    }

    // Filter by region
    if (region) {
      accessPoints = accessPoints.filter((a) => a.region === region);
    }

    // Filter by type
    if (type) {
      accessPoints = accessPoints.filter((a) => a.type === type);
    }

    // Filter by wheelchair accessible
    if (wheelchairAccessible) {
      accessPoints = accessPoints.filter((a) => a.wheelchairAccessible === true);
    }

    return NextResponse.json({
      success: true,
      data: accessPoints,
      count: accessPoints.length,
      note: 'This is sample data. In production, sync with PFBC API or PASDA GeoJSON.',
    });
  } catch (error) {
    console.error('Error fetching PFBC access points:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch PFBC access points',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}


