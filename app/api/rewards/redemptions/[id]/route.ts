import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/rewards/redemptions/[id]
 * Get a specific redemption by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient();

    // Get user
    const { data: user } = await supabase
      .from('users')
      .select('id, role')
      .eq('email', session.user.email)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get redemption
    const { data: redemption, error } = await supabase
      .from('reward_redemptions')
      .select(`
        *,
        reward:rewards(*),
        partner:partner_organizations(*)
      `)
      .eq('id', params.id)
      .single();

    if (error || !redemption) {
      return NextResponse.json({ error: 'Redemption not found' }, { status: 404 });
    }

    // Check permissions - user can only see their own redemptions unless admin/partner
    if (
      redemption.user_id !== user.id &&
      user.role !== 'admin' &&
      user.role !== 'partner'
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ redemption });
  } catch (error) {
    console.error('Error fetching redemption:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/rewards/redemptions/[id]
 * Cancel a redemption and refund points
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient();

    // Get user
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get redemption
    const { data: redemption, error: fetchError } = await supabase
      .from('reward_redemptions')
      .select('*')
      .eq('id', params.id)
      .single();

    if (fetchError || !redemption) {
      return NextResponse.json({ error: 'Redemption not found' }, { status: 404 });
    }

    // Check ownership
    if (redemption.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if cancellable
    if (redemption.status === 'redeemed') {
      return NextResponse.json(
        { error: 'Cannot cancel a redeemed reward' },
        { status: 400 }
      );
    }

    if (redemption.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Redemption already cancelled' },
        { status: 400 }
      );
    }

    // Cancel redemption
    const { error: updateError } = await supabase
      .from('reward_redemptions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancelled_by: user.id,
        cancellation_reason: 'User cancelled',
      })
      .eq('id', params.id);

    if (updateError) {
      console.error('Error cancelling redemption:', updateError);
      return NextResponse.json({ error: 'Failed to cancel redemption' }, { status: 500 });
    }

    // Refund points
    const currency = redemption.cost_paid_tokens > 0
      ? 'rad_tokens'
      : redemption.cost_paid_learning > 0
      ? 'learning_points'
      : 'action_points';

    const amount = redemption.cost_paid_tokens ||
      redemption.cost_paid_learning ||
      redemption.cost_paid_action ||
      0;

    if (amount > 0) {
      await supabase.rpc('award_points', {
        p_user_id: user.id,
        p_currency: currency,
        p_amount: amount,
        p_source_type: 'refund',
        p_source_id: params.id,
        p_description: 'Refund for cancelled redemption',
        p_awarded_by: null,
        p_metadata: { original_redemption_id: params.id },
      });
    }

    // Update reward quantity if limited
    if (redemption.reward_id) {
      await supabase.rpc('increment', {
        table_name: 'rewards',
        id: redemption.reward_id,
        column_name: 'quantity_remaining',
        amount: 1,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Redemption cancelled and points refunded',
    });
  } catch (error) {
    console.error('Error cancelling redemption:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

