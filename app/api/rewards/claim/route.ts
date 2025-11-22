import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/rewards/claim
 * Claim a reward
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { rewardId, paymentMethod, scheduledDate, scheduledTime, notes } = body;

    if (!rewardId || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields: rewardId, paymentMethod' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Get user
    const { data: user } = await supabase
      .from('users')
      .select('id, display_name, level')
      .eq('email', session.user.email)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get reward with partner info
    const { data: reward, error: rewardError } = await supabase
      .from('available_rewards_view')
      .select('*')
      .eq('id', rewardId)
      .single();

    if (rewardError || !reward) {
      return NextResponse.json({ error: 'Reward not found or not available' }, { status: 404 });
    }

    // Check availability
    if (!reward.in_stock || !reward.currently_available) {
      return NextResponse.json({ error: 'Reward is not currently available' }, { status: 400 });
    }

    // Check if reward is active
    if (!reward.is_active) {
      return NextResponse.json({ error: 'Reward is not active' }, { status: 400 });
    }

    // Check age requirements
    if (reward.min_age && user.age && user.age < reward.min_age) {
      return NextResponse.json({ error: `Must be at least ${reward.min_age} years old` }, { status: 400 });
    }
    if (reward.max_age && user.age && user.age > reward.max_age) {
      return NextResponse.json({ error: `Must be ${reward.max_age} years old or younger` }, { status: 400 });
    }

    // Check level requirements
    if (reward.required_level && user.level < reward.required_level) {
      return NextResponse.json(
        { error: `Must be level ${reward.required_level} or higher` },
        { status: 400 }
      );
    }

    // Check achievement requirements
    if (reward.required_achievements && reward.required_achievements.length > 0) {
      const { data: userAchievements } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', user.id)
        .eq('progress', 100)
        .in('achievement_id', reward.required_achievements);

      if (!userAchievements || userAchievements.length < reward.required_achievements.length) {
        return NextResponse.json(
          { error: 'Missing required achievements' },
          { status: 400 }
        );
      }
    }

    // Check if user has already claimed maximum times
    const { data: userRedemptions, error: redemptionError } = await supabase
      .from('reward_redemptions')
      .select('id')
      .eq('user_id', user.id)
      .eq('reward_id', rewardId)
      .in('status', ['claimed', 'approved', 'redeemed']);

    if (redemptionError) {
      console.error('Error checking redemptions:', redemptionError);
    } else if (userRedemptions && userRedemptions.length >= reward.quantity_per_user) {
      return NextResponse.json(
        { error: `You have already claimed this reward ${reward.quantity_per_user} time(s)` },
        { status: 400 }
      );
    }

    // Get user's point balances
    const { data: balance } = await supabase
      .from('user_point_balances')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!balance) {
      return NextResponse.json({ error: 'User balance not found' }, { status: 404 });
    }

    // Determine payment amounts
    let costPaidTokens = 0;
    let costPaidLearning = 0;
    let costPaidAction = 0;

    if (paymentMethod.radTokens) {
      costPaidTokens = reward.cost_rad_tokens;
      if (balance.rad_tokens < costPaidTokens) {
        return NextResponse.json(
          {
            error: 'Insufficient RAD tokens',
            insufficientPoints: {
              needed: costPaidTokens,
              available: balance.rad_tokens,
              currency: 'rad_tokens',
            },
          },
          { status: 400 }
        );
      }
    } else if (paymentMethod.learningPoints) {
      costPaidLearning = reward.cost_learning_points || 0;
      if (!costPaidLearning) {
        return NextResponse.json(
          { error: 'This reward cannot be purchased with learning points' },
          { status: 400 }
        );
      }
      if (balance.learning_points < costPaidLearning) {
        return NextResponse.json(
          {
            error: 'Insufficient learning points',
            insufficientPoints: {
              needed: costPaidLearning,
              available: balance.learning_points,
              currency: 'learning_points',
            },
          },
          { status: 400 }
        );
      }
    } else if (paymentMethod.actionPoints) {
      costPaidAction = reward.cost_action_points || 0;
      if (!costPaidAction) {
        return NextResponse.json(
          { error: 'This reward cannot be purchased with action points' },
          { status: 400 }
        );
      }
      if (balance.action_points < costPaidAction) {
        return NextResponse.json(
          {
            error: 'Insufficient action points',
            insufficientPoints: {
              needed: costPaidAction,
              available: balance.action_points,
              currency: 'action_points',
            },
          },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      );
    }

    // Check appointment requirements
    if (reward.requires_appointment && (!scheduledDate || !scheduledTime)) {
      return NextResponse.json(
        { error: 'This reward requires scheduling an appointment' },
        { status: 400 }
      );
    }

    // Start transaction
    // 1. Deduct points
    let transactionId: string | null = null;
    if (costPaidTokens > 0) {
      const { data: txId, error: txError } = await supabase.rpc('award_points', {
        p_user_id: user.id,
        p_currency: 'rad_tokens',
        p_amount: -costPaidTokens,
        p_source_type: 'redemption',
        p_source_id: rewardId,
        p_description: `Redeemed: ${reward.name}`,
        p_awarded_by: null,
        p_metadata: { reward_id: rewardId, partner_id: reward.partner_id },
      });
      if (txError) {
        console.error('Error deducting tokens:', txError);
        return NextResponse.json({ error: 'Failed to deduct points' }, { status: 500 });
      }
      transactionId = txId;
    } else if (costPaidLearning > 0) {
      const { data: txId, error: txError } = await supabase.rpc('award_points', {
        p_user_id: user.id,
        p_currency: 'learning_points',
        p_amount: -costPaidLearning,
        p_source_type: 'redemption',
        p_source_id: rewardId,
        p_description: `Redeemed: ${reward.name}`,
        p_awarded_by: null,
        p_metadata: { reward_id: rewardId, partner_id: reward.partner_id },
      });
      if (txError) {
        console.error('Error deducting learning points:', txError);
        return NextResponse.json({ error: 'Failed to deduct points' }, { status: 500 });
      }
      transactionId = txId;
    } else if (costPaidAction > 0) {
      const { data: txId, error: txError } = await supabase.rpc('award_points', {
        p_user_id: user.id,
        p_currency: 'action_points',
        p_amount: -costPaidAction,
        p_source_type: 'redemption',
        p_source_id: rewardId,
        p_description: `Redeemed: ${reward.name}`,
        p_awarded_by: null,
        p_metadata: { reward_id: rewardId, partner_id: reward.partner_id },
      });
      if (txError) {
        console.error('Error deducting action points:', txError);
        return NextResponse.json({ error: 'Failed to deduct points' }, { status: 500 });
      }
      transactionId = txId;
    }

    // 2. Create redemption record
    const requiresApproval = reward.requires_parent_permission || reward.requires_teacher_approval;
    
    const { data: redemption, error: redemptionError } = await supabase
      .from('reward_redemptions')
      .insert({
        reward_id: rewardId,
        user_id: user.id,
        partner_id: reward.partner_id,
        status: requiresApproval ? 'pending_approval' : 'claimed',
        point_transaction_id: transactionId,
        cost_paid_tokens: costPaidTokens,
        cost_paid_learning: costPaidLearning,
        cost_paid_action: costPaidAction,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        requires_approval: requiresApproval,
        metadata: { notes },
      })
      .select(`
        *,
        reward:rewards(*),
        partner:partner_organizations(*)
      `)
      .single();

    if (redemptionError) {
      console.error('Error creating redemption:', redemptionError);
      // Try to refund points
      if (transactionId) {
        await supabase.rpc('award_points', {
          p_user_id: user.id,
          p_currency: costPaidTokens > 0 ? 'rad_tokens' : costPaidLearning > 0 ? 'learning_points' : 'action_points',
          p_amount: costPaidTokens || costPaidLearning || costPaidAction,
          p_source_type: 'refund',
          p_source_id: rewardId,
          p_description: `Refund: ${reward.name} (redemption failed)`,
          p_awarded_by: null,
          p_metadata: { original_transaction_id: transactionId },
        });
      }
      return NextResponse.json({ error: 'Failed to create redemption' }, { status: 500 });
    }

    // 3. Update reward quantity if limited
    if (reward.total_quantity !== null) {
      await supabase
        .from('rewards')
        .update({ quantity_remaining: (reward.quantity_remaining || 0) - 1 })
        .eq('id', rewardId);
    }

    // 4. Update analytics
    await supabase
      .from('rewards')
      .update({ total_claimed: (reward.total_claimed || 0) + 1 })
      .eq('id', rewardId);

    await supabase
      .from('partner_organizations')
      .update({ 
        total_redemptions: reward.partner_total_redemptions + 1,
        total_students_served: reward.partner_total_students_served + 1,
      })
      .eq('id', reward.partner_id);

    return NextResponse.json({
      success: true,
      redemption,
      message: requiresApproval 
        ? 'Reward claimed! Waiting for approval.' 
        : 'Reward claimed successfully!',
    });
  } catch (error) {
    console.error('Error in claim API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET /api/rewards/claim
 * Get user's redemptions
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

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

    // Build query
    let query = supabase
      .from('reward_redemptions')
      .select(`
        *,
        reward:rewards(*),
        partner:partner_organizations(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: redemptions, error } = await query;

    if (error) {
      console.error('Error fetching redemptions:', error);
      return NextResponse.json({ error: 'Failed to fetch redemptions' }, { status: 500 });
    }

    // Calculate stats
    const stats = {
      totalRedeemed: redemptions?.filter(r => r.status === 'redeemed').length || 0,
      totalExpired: redemptions?.filter(r => r.status === 'expired').length || 0,
      totalCancelled: redemptions?.filter(r => r.status === 'cancelled').length || 0,
      tokensSpent: redemptions?.reduce((sum, r) => sum + r.cost_paid_tokens, 0) || 0,
      estimatedValueReceived: redemptions
        ?.filter(r => r.status === 'redeemed')
        .reduce((sum, r) => sum + (r.reward?.retail_value || 0), 0) || 0,
    };

    return NextResponse.json({
      redemptions: redemptions || [],
      stats,
    });
  } catch (error) {
    console.error('Error in claim API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

