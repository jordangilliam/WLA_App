/**
 * PFBC Habitat Installations API
 * Returns PFBC habitat installations (lunker structures, fish attractors, etc.)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/client';
import { PFBC_HABITAT_INSTALLATIONS } from '@/data/pfbc-complete-data';


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const waterwayName = searchParams.get('waterwayName');
  const county = searchParams.get('county');
  const region = searchParams.get('region');
  const installationType = searchParams.get('installationType');
  const targetSpecies = searchParams.get('targetSpecies');

  try {
    let installations = [...PFBC_HABITAT_INSTALLATIONS];

    // Filter by waterway name
    if (waterwayName) {
      installations = installations.filter((i) =>
        i.waterwayName.toLowerCase().includes(waterwayName.toLowerCase())
      );
    }

    // Filter by county
    if (county) {
      installations = installations.filter((i) => i.county === county);
    }

    // Filter by region
    if (region) {
      installations = installations.filter((i) => i.region === region);
    }

    // Filter by installation type
    if (installationType) {
      installations = installations.filter((i) => i.installationType === installationType);
    }

    // Filter by target species
    if (targetSpecies) {
      installations = installations.filter((i) =>
        i.targetSpecies.some((s) =>
          s.toLowerCase().includes(targetSpecies.toLowerCase())
        )
      );
    }

    return NextResponse.json({
      success: true,
      data: installations,
      count: installations.length,
      note: 'PFBC habitat installations improve fishing opportunities',
    });
  } catch (error) {
    console.error('Error fetching PFBC habitat installations:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch PFBC habitat installations',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}



