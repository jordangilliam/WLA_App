import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/rewards/validate
 * Validate a redemption confirmation code (for partner use)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { confirmationCode, partnerId } = body;

    if (!confirmationCode) {
      return NextResponse.json(
        { error: 'Missing confirmation code' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Get user (must be partner or admin)
    const { data: user } = await supabase
      .from('users')
      .select('id, role')
      .eq('email', session.user.email)
      .single();

    if (!user || (user.role !== 'admin' && user.role !== 'partner')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Find redemption
    let query = supabase
      .from('reward_redemptions')
      .select(`
        *,
        reward:rewards(*),
        partner:partner_organizations(*),
        user:users(id, display_name, email, avatar_url)
      `)
      .eq('confirmation_code', confirmationCode.toUpperCase());

    if (partnerId) {
      query = query.eq('partner_id', partnerId);
    }

    const { data: redemption, error } = await query.single();

    if (error || !redemption) {
      return NextResponse.json(
        { 
          valid: false,
          error: 'Redemption not found or invalid code',
        },
        { status: 404 }
      );
    }

    // Check status
    if (redemption.status === 'redeemed') {
      return NextResponse.json({
        valid: false,
        error: 'This reward has already been redeemed',
        redemption: {
          ...redemption,
          redeemedAt: redemption.redeemed_at,
        },
      });
    }

    if (redemption.status === 'expired') {
      return NextResponse.json({
        valid: false,
        error: 'This reward has expired',
        redemption,
      });
    }

    if (redemption.status === 'cancelled') {
      return NextResponse.json({
        valid: false,
        error: 'This reward redemption has been cancelled',
        redemption,
      });
    }

    if (redemption.status === 'pending_approval') {
      return NextResponse.json({
        valid: false,
        error: 'This reward is still awaiting approval',
        redemption,
      });
    }

    // Check expiration
    const now = new Date();
    const expiresAt = new Date(redemption.expires_at);
    if (expiresAt < now) {
      // Mark as expired
      await supabase
        .from('reward_redemptions')
        .update({ status: 'expired' })
        .eq('id', redemption.id);

      return NextResponse.json({
        valid: false,
        error: 'This reward has expired',
        redemption,
      });
    }

    // Valid redemption!
    return NextResponse.json({
      valid: true,
      redemption,
      message: 'Valid redemption code',
      canRedeem: redemption.status === 'claimed' || redemption.status === 'approved',
    });
  } catch (error) {
    console.error('Error in validate API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/rewards/validate
 * Mark a redemption as redeemed (for partner use)
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { confirmationCode, notes } = body;

    if (!confirmationCode) {
      return NextResponse.json(
        { error: 'Missing confirmation code' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Get user (must be partner or admin)
    const { data: user } = await supabase
      .from('users')
      .select('id, role')
      .eq('email', session.user.email)
      .single();

    if (!user || (user.role !== 'admin' && user.role !== 'partner')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Find and validate redemption
    const { data: redemption, error: findError } = await supabase
      .from('reward_redemptions')
      .select('*')
      .eq('confirmation_code', confirmationCode.toUpperCase())
      .single();

    if (findError || !redemption) {
      return NextResponse.json({ error: 'Redemption not found' }, { status: 404 });
    }

    // Check status
    if (redemption.status !== 'claimed' && redemption.status !== 'approved') {
      return NextResponse.json(
        { error: `Cannot redeem reward with status: ${redemption.status}` },
        { status: 400 }
      );
    }

    // Check expiration
    const now = new Date();
    const expiresAt = new Date(redemption.expires_at);
    if (expiresAt < now) {
      await supabase
        .from('reward_redemptions')
        .update({ status: 'expired' })
        .eq('id', redemption.id);

      return NextResponse.json(
        { error: 'This reward has expired' },
        { status: 400 }
      );
    }

    // Mark as redeemed
    const { data: updated, error: updateError } = await supabase
      .from('reward_redemptions')
      .update({
        status: 'redeemed',
        redeemed_at: now.toISOString(),
        redeemed_by_partner_user: user.id,
        partner_notes: notes,
      })
      .eq('id', redemption.id)
      .select(`
        *,
        reward:rewards(*),
        partner:partner_organizations(*),
        user:users(display_name, email)
      `)
      .single();

    if (updateError) {
      console.error('Error updating redemption:', updateError);
      return NextResponse.json({ error: 'Failed to mark as redeemed' }, { status: 500 });
    }

    // Update reward analytics
    await supabase
      .from('rewards')
      .update({ total_redeemed: (redemption.reward?.total_redeemed || 0) + 1 })
      .eq('id', redemption.reward_id);

    return NextResponse.json({
      success: true,
      redemption: updated,
      message: 'Reward successfully redeemed!',
    });
  } catch (error) {
    console.error('Error in validate API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

