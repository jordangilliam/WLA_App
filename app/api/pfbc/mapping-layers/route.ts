/**
 * PFBC Mapping Layers API
 * Returns PFBC trout stream classifications, bass waters, and species designations
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  PFBC_CLASS_A_TROUT_STREAMS,
  PFBC_WILD_TROUT_STREAMS,
  PFBC_DELAYED_HARVEST_STREAMS,
  PFBC_TROPHY_TROUT_STREAMS,
  PFBC_BEST_BASS_WATERS,
  PFBC_OTHER_SPECIES_WATERS,
} from '@/data/pfbc-mapping-layers';
import {
  EXPANDED_CLASS_A_TROUT_STREAMS,
  EXPANDED_WILD_TROUT_STREAMS,
  EXPANDED_DELAYED_HARVEST_STREAMS,
  EXPANDED_TROPHY_TROUT_STREAMS,
  EXPANDED_BEST_BASS_WATERS,
  EXPANDED_OTHER_SPECIES_WATERS,
} from '@/data/pfbc-mapping-layers-expanded';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const layerType = searchParams.get('layerType'); // 'class-a', 'wild-trout', 'delayed-harvest', 'trophy-trout', 'bass', 'other-species'
  const region = searchParams.get('region');
  const county = searchParams.get('county');
  const species = searchParams.get('species');

  try {
    let data: any[] = [];

    switch (layerType) {
      case 'class-a':
        data = [...PFBC_CLASS_A_TROUT_STREAMS, ...EXPANDED_CLASS_A_TROUT_STREAMS];
        break;
      case 'wild-trout':
        data = [...PFBC_WILD_TROUT_STREAMS, ...EXPANDED_WILD_TROUT_STREAMS];
        break;
      case 'delayed-harvest':
        data = [...PFBC_DELAYED_HARVEST_STREAMS, ...EXPANDED_DELAYED_HARVEST_STREAMS];
        break;
      case 'trophy-trout':
        data = [...PFBC_TROPHY_TROUT_STREAMS, ...EXPANDED_TROPHY_TROUT_STREAMS];
        break;
      case 'bass':
        data = [...PFBC_BEST_BASS_WATERS, ...EXPANDED_BEST_BASS_WATERS];
        break;
      case 'other-species':
        data = [...PFBC_OTHER_SPECIES_WATERS, ...EXPANDED_OTHER_SPECIES_WATERS];
        break;
      default:
        // Return all layers
        return NextResponse.json({
          success: true,
          layers: {
            classATroutStreams: [...PFBC_CLASS_A_TROUT_STREAMS, ...EXPANDED_CLASS_A_TROUT_STREAMS],
            wildTroutStreams: [...PFBC_WILD_TROUT_STREAMS, ...EXPANDED_WILD_TROUT_STREAMS],
            delayedHarvestStreams: [...PFBC_DELAYED_HARVEST_STREAMS, ...EXPANDED_DELAYED_HARVEST_STREAMS],
            trophyTroutStreams: [...PFBC_TROPHY_TROUT_STREAMS, ...EXPANDED_TROPHY_TROUT_STREAMS],
            bestBassWaters: [...PFBC_BEST_BASS_WATERS, ...EXPANDED_BEST_BASS_WATERS],
            otherSpeciesWaters: [...PFBC_OTHER_SPECIES_WATERS, ...EXPANDED_OTHER_SPECIES_WATERS],
          },
        });
    }

    // Filter by region if provided
    if (region) {
      data = data.filter((item) => item.region === region);
    }

    // Filter by county if provided
    if (county) {
      data = data.filter((item) => item.county === county);
    }

    // Filter by species if provided
    if (species) {
      data = data.filter((item) => {
        if (Array.isArray(item.species)) {
          return item.species.some((s: string) =>
            s.toLowerCase().includes(species.toLowerCase())
          );
        }
        return (
          item.species?.toLowerCase().includes(species.toLowerCase()) ||
          item.classification?.toLowerCase().includes(species.toLowerCase())
        );
      });
    }

    return NextResponse.json({
      success: true,
      layerType,
      data,
      count: data.length,
    });
  } catch (error) {
    console.error('Error fetching PFBC mapping layers:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch PFBC mapping layers',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

