import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/auth.config';
import { supabaseAdmin } from '@/lib/db/client';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // Verify ownership before deleting
    const { data: observation, error: fetchError } = await supabaseAdmin
      .from('user_visits')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !observation) {
      return NextResponse.json(
        { error: 'Observation not found' },
        { status: 404 }
      );
    }

    if (observation.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this observation' },
        { status: 403 }
      );
    }

    // Delete the observation
    const { error: deleteError } = await supabaseAdmin
      .from('user_visits')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting observation:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete observation' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Observation deleted successfully',
    });
  } catch (error) {
    console.error('Error in observation DELETE:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;
    const body = await request.json();
    const { notes, species_observed, photos } = body;

    // Verify ownership before updating
    const { data: observation, error: fetchError } = await supabaseAdmin
      .from('user_visits')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !observation) {
      return NextResponse.json(
        { error: 'Observation not found' },
        { status: 404 }
      );
    }

    if (observation.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to update this observation' },
        { status: 403 }
      );
    }

    // Update the observation
    const updateData: any = {};
    if (notes !== undefined) updateData.notes = notes;
    if (species_observed !== undefined) updateData.species_observed = species_observed;
    if (photos !== undefined) updateData.photos = photos;

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('user_visits')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating observation:', updateError);
      return NextResponse.json(
        { error: 'Failed to update observation' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      observation: updated,
    });
  } catch (error) {
    console.error('Error in observation PATCH:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

