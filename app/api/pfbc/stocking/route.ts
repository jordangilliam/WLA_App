/**
 * PFBC Stocking Schedule API
 * Returns PFBC trout and other species stocking schedules
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/client';
import { PFBC_STOCKING_SCHEDULES } from '@/data/pfbc-complete-data';


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const waterwayId = searchParams.get('waterwayId');
  const waterwayName = searchParams.get('waterwayName');
  const county = searchParams.get('county');
  const region = searchParams.get('region');
  const species = searchParams.get('species');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    let schedules = [...PFBC_STOCKING_SCHEDULES];

    // Filter by waterway ID
    if (waterwayId) {
      schedules = schedules.filter((s) => s.waterwayId === waterwayId);
    }

    // Filter by waterway name
    if (waterwayName) {
      schedules = schedules.filter((s) =>
        s.waterwayName.toLowerCase().includes(waterwayName.toLowerCase())
      );
    }

    // Filter by county
    if (county) {
      schedules = schedules.filter((s) => s.county === county);
    }

    // Filter by region
    if (region) {
      schedules = schedules.filter((s) => s.region === region);
    }

    // Filter by species
    if (species) {
      schedules = schedules.filter((s) =>
        s.species.toLowerCase().includes(species.toLowerCase())
      );
    }

    // Filter by date range
    if (startDate && endDate) {
      schedules = schedules.filter((s) => {
        const stockDate = new Date(s.stockingDate);
        return stockDate >= new Date(startDate) && stockDate <= new Date(endDate);
      });
    }

    return NextResponse.json({
      success: true,
      data: schedules,
      count: schedules.length,
      note: 'This is sample data. In production, sync with PFBC API: https://apps.fishandboat.pa.gov/StockingSchedule/',
    });
  } catch (error) {
    console.error('Error fetching PFBC stocking schedules:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch PFBC stocking schedules',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}


