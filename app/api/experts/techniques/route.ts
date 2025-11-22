/**
 * Expert Techniques API
 * Returns fly fishing techniques from experts
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/client';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const expertId = searchParams.get('expertId');
  const expertName = searchParams.get('expertName');
  const difficulty = searchParams.get('difficulty');
  const waterType = searchParams.get('waterType');
  const season = searchParams.get('season');

  try {
    let query = supabaseAdmin
      .from('expert_techniques')
      .select(`
        *,
        expert:fly_fishing_experts(id, name, type, location)
      `);

    if (expertId) {
      query = query.eq('expert_id', expertId);
    }

    if (expertName) {
      query = query.eq('expert.name', expertName);
    }

    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }

    if (waterType) {
      query = query.contains('water_types', [waterType]);
    }

    if (season) {
      query = query.contains('best_seasons', [season]);
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
    console.error('Error fetching expert techniques:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch expert techniques',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}


