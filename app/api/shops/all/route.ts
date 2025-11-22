/**
 * All Fly Shops API
 * Returns comprehensive list of all PA fly shops
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ALL_COMPREHENSIVE_FLY_SHOPS } from '@/data/pa-fly-shops-comprehensive';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get('region');
  const county = searchParams.get('county');
  const hasGuides = searchParams.get('hasGuides') === 'true';
  const hasClasses = searchParams.get('hasClasses') === 'true';
  const hasFlyTying = searchParams.get('hasFlyTying') === 'true';

  try {
    let shops = [...ALL_COMPREHENSIVE_FLY_SHOPS];

    // Filter by region if provided
    if (region) {
      shops = shops.filter((shop) => shop.region === region);
    }

    // Filter by county if provided
    if (county) {
      shops = shops.filter((shop) => shop.county === county);
    }

    // Filter by services
    if (hasGuides) {
      shops = shops.filter((shop) => shop.hasGuides === true);
    }

    if (hasClasses) {
      shops = shops.filter((shop) => shop.hasClasses === true);
    }

    if (hasFlyTying) {
      shops = shops.filter((shop) => shop.hasFlyTying === true);
    }

    return NextResponse.json({
      success: true,
      data: shops,
      count: shops.length,
    });
  } catch (error) {
    console.error('Error fetching fly shops:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch fly shops',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

