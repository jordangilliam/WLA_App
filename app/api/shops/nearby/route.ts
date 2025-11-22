/**
 * Nearby Fly Shops API
 * Returns fly fishing shops near a location
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lng = parseFloat(searchParams.get('lng') || '0');
  const radius = parseFloat(searchParams.get('radius') || '50'); // km
  const region = searchParams.get('region');
  const hasGuides = searchParams.get('hasGuides') === 'true';
  const hasClasses = searchParams.get('hasClasses') === 'true';

  try {
    let query = supabase
      .from('fly_fishing_shops')
      .select('*');

    if (region) {
      query = query.eq('region', region);
    }

    if (hasGuides) {
      query = query.eq('has_guides', true);
    }

    if (hasClasses) {
      query = query.eq('has_classes', true);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Filter by distance if coordinates provided
    let shops = data || [];
    if (lat && lng && shops.length > 0) {
      shops = shops
        .filter((shop) => shop.latitude && shop.longitude)
        .map((shop) => {
          const distance = calculateDistance(lat, lng, shop.latitude, shop.longitude);
          return { ...shop, distance };
        })
        .filter((shop) => shop.distance <= radius)
        .sort((a, b) => a.distance - b.distance);
    }

    return NextResponse.json({
      success: true,
      data: shops,
      count: shops.length,
    });
  } catch (error) {
    console.error('Error fetching nearby shops:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch nearby shops',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}


