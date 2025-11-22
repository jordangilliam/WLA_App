/**
 * Expert Patterns API
 * Returns fly patterns from experts
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const expertId = searchParams.get('expertId');
  const expertName = searchParams.get('expertName');
  const patternType = searchParams.get('patternType');
  const season = searchParams.get('season');

  try {
    let query = supabase
      .from('expert_patterns')
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

    if (patternType) {
      query = query.eq('pattern_type', patternType);
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
    console.error('Error fetching expert patterns:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch expert patterns',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}


