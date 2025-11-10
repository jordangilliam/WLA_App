import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/auth.config';
import { supabaseAdmin } from '@/lib/db/client';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check database connection
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    // Fetch user's observations with field site information
    const { data: observations, error } = await supabaseAdmin
      .from('user_visits')
      .select(`
        id,
        created_at: visited_at,
        field_site_id,
        notes,
        photos,
        species_observed,
        points_earned,
        field_sites!inner (
          name
        )
      `)
      .eq('user_id', session.user.id)
      .order('visited_at', { ascending: false });

    if (error) {
      console.error('Error fetching observations:', error);
      return NextResponse.json(
        { error: 'Failed to fetch observations' },
        { status: 500 }
      );
    }

    // Transform the data to include weather and temperature if stored
    // (We'll need to add these columns to user_visits table in a future migration)
    const transformedObservations = (observations || []).map((obs: any) => ({
      id: obs.id,
      created_at: obs.created_at,
      field_site_id: obs.field_site_id,
      field_site_name: obs.field_sites?.name || 'Unknown Location',
      notes: obs.notes || '',
      species_observed: obs.species_observed || [],
      photos: obs.photos || [],
      verified: false, // TODO: Add verification system
      teacher_feedback: null, // TODO: Add feedback system
      // Weather and temperature would come from stored data
      weather: undefined,
      temperature: undefined,
    }));

    return NextResponse.json({
      success: true,
      observations: transformedObservations,
    });
  } catch (error) {
    console.error('Error in observations API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check database connection
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      field_site_id,
      notes,
      species_observed,
      photos,
      weather,
      temperature,
    } = body;

    // Validate required fields
    if (!field_site_id) {
      return NextResponse.json(
        { error: 'Field site ID is required' },
        { status: 400 }
      );
    }

    // Create observation (linked to a visit)
    // For now, we'll update an existing visit or create a standalone observation
    // TODO: Enhance this to properly link with check-ins

    const { data: observation, error } = await supabaseAdmin
      .from('user_visits')
      .insert({
        user_id: session.user.id,
        field_site_id: field_site_id,
        notes: notes || '',
        species_observed: species_observed || [],
        photos: photos || [],
        // TODO: Add weather and temperature fields to schema
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating observation:', error);
      return NextResponse.json(
        { error: 'Failed to create observation' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      observation,
    });
  } catch (error) {
    console.error('Error in observations POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

