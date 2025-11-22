import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/auth.config';
import { supabaseAdmin } from '@/lib/db/client';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;
    if (!userId) {
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
        weather,
        temperature,
        tags,
        mood,
        reflection_prompts,
        field_sites!inner (
          name
        )
      `)
      .eq('user_id', userId)
      .order('visited_at', { ascending: false });

    if (error) {
      console.error('Error fetching observations:', error);
      return NextResponse.json(
        { error: 'Failed to fetch observations' },
        { status: 500 }
      );
    }

    const observationList = observations || [];
    let mediaByObservation: Record<string, any[]> = {};

    if (observationList.length > 0) {
      const observationIds = observationList.map((obs: any) => obs.id);
      const { data: mediaRows } = await supabaseAdmin
        .from('observation_media')
        .select('*')
        .eq('user_id', userId)
        .in('observation_id', observationIds)
        .neq('status', 'removed');

      if (mediaRows) {
        mediaRows.forEach((row: any) => {
          if (!row.observation_id) return;
          mediaByObservation[row.observation_id] = [
            ...(mediaByObservation[row.observation_id] || []),
            row,
          ];
        });
      }
    }

    // Transform the data to include media attachments and reserved weather slots
    const transformedObservations = observationList.map((obs: any) => ({
      id: obs.id,
      created_at: obs.created_at,
      field_site_id: obs.field_site_id,
      field_site_name: obs.field_sites?.name || 'Unknown Location',
      notes: obs.notes || '',
      species_observed: obs.species_observed || [],
      photos: obs.photos || [],
      weather: obs.weather || undefined,
      temperature: obs.temperature ?? undefined,
      tags: obs.tags || [],
      mood: obs.mood || undefined,
      reflection_prompts: obs.reflection_prompts || {},
      media: mediaByObservation[obs.id] || [],
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
    const userId = (session?.user as { id?: string } | undefined)?.id;
    if (!userId) {
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
      tags,
      mood,
      reflection_prompts,
      mediaIds,
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
        user_id: userId,
        field_site_id: field_site_id,
        notes: notes || '',
        species_observed: species_observed || [],
        photos: photos || [],
        weather: weather || null,
        temperature: temperature ?? null,
        tags: tags || [],
        mood: mood || null,
        reflection_prompts: reflection_prompts || {},
        // TODO: Add weather and temperature fields to schema
      } as never)
      .select()
      .single();

    if (error) {
      console.error('Error creating observation:', error);
      return NextResponse.json(
        { error: 'Failed to create observation' },
        { status: 500 }
      );
    }

    if (
      observation &&
      Array.isArray(mediaIds) &&
      mediaIds.length > 0
    ) {
      const validMediaIds = mediaIds.filter(
        (value: unknown): value is string =>
          typeof value === 'string' && value.length > 0
      );

      if (validMediaIds.length > 0) {
        await supabaseAdmin
          .from('observation_media')
          .update({
            observation_id: observation.id,
            field_site_id,
          } as never)
          .in('id', validMediaIds)
          .eq('user_id', userId);
      }
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

