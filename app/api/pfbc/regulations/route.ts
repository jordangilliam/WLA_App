/**
 * PFBC Regulations API
 * Returns PFBC fishing regulations for waterways
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/client';
import { PFBC_REGULATIONS } from '@/data/pfbc-complete-data';


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const waterwayId = searchParams.get('waterwayId');
  const waterwayName = searchParams.get('waterwayName');
  const regulationType = searchParams.get('regulationType');
  const species = searchParams.get('species');

  try {
    let regulations = [...PFBC_REGULATIONS];

    // Filter by waterway ID
    if (waterwayId) {
      regulations = regulations.filter((r) => r.waterwayId === waterwayId);
    }

    // Filter by waterway name
    if (waterwayName) {
      regulations = regulations.filter((r) =>
        r.waterwayName.toLowerCase().includes(waterwayName.toLowerCase())
      );
    }

    // Filter by regulation type
    if (regulationType) {
      regulations = regulations.filter((r) => r.regulationType === regulationType);
    }

    // Filter by species
    if (species) {
      regulations = regulations.filter((r) => {
        if (r.species) {
          return r.species.some((s) =>
            s.toLowerCase().includes(species.toLowerCase())
          );
        }
        return false;
      });
    }

    return NextResponse.json({
      success: true,
      data: regulations,
      count: regulations.length,
      note: 'Always check current PFBC regulations before fishing. Regulations may change.',
    });
  } catch (error) {
    console.error('Error fetching PFBC regulations:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch PFBC regulations',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}



