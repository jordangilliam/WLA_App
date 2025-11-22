import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createClient } from '@/lib/supabase/server';
import type { PointCurrency, PointTransaction, UserPointBalance } from '@/lib/types/rad-pass.types';

/**
 * GET /api/rewards/points
 * Get user's point balances and transaction history
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const includeHistory = searchParams.get('includeHistory') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');

    const supabase = createClient();

    // Get user ID
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get point balances
    const { data: balance, error: balanceError } = await supabase
      .from('user_point_balances')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (balanceError && balanceError.code !== 'PGRST116') {
      // PGRST116 is "no rows returned", which is okay
      console.error('Error fetching balance:', balanceError);
      return NextResponse.json({ error: 'Failed to fetch balance' }, { status: 500 });
    }

    // If no balance record exists, create one
    let userBalance: UserPointBalance;
    if (!balance) {
      const { data: newBalance, error: createError } = await supabase
        .from('user_point_balances')
        .insert({ user_id: user.id })
        .select()
        .single();

      if (createError || !newBalance) {
        return NextResponse.json({ error: 'Failed to create balance' }, { status: 500 });
      }
      userBalance = newBalance;
    } else {
      userBalance = balance;
    }

    const response: any = {
      balance: {
        userId: userBalance.user_id,
        current: {
          learning: userBalance.learning_points || 0,
          action: userBalance.action_points || 0,
          social: userBalance.social_points || 0,
          bonus: userBalance.bonus_points || 0,
          radTokens: userBalance.rad_tokens || 0,
          total:
            (userBalance.learning_points || 0) +
            (userBalance.action_points || 0) +
            (userBalance.social_points || 0) +
            (userBalance.bonus_points || 0),
        },
        lifetime: {
          learning: userBalance.lifetime_learning || 0,
          action: userBalance.lifetime_action || 0,
          social: userBalance.lifetime_social || 0,
          bonus: userBalance.lifetime_bonus || 0,
          radTokens: userBalance.lifetime_rad_tokens || 0,
          total:
            (userBalance.lifetime_learning || 0) +
            (userBalance.lifetime_action || 0) +
            (userBalance.lifetime_social || 0) +
            (userBalance.lifetime_bonus || 0),
        },
        redeemed: userBalance.total_redeemed || 0,
        conversionRates: {
          learningToRad: userBalance.learning_to_rad_rate || 10.0,
          actionToRad: userBalance.action_to_rad_rate || 5.0,
          socialToRad: userBalance.social_to_rad_rate || 20.0,
        },
        nextRadToken: {
          fromLearning: Math.ceil(userBalance.learning_to_rad_rate || 10) - ((userBalance.learning_points || 0) % Math.ceil(userBalance.learning_to_rad_rate || 10)),
          fromAction: Math.ceil(userBalance.action_to_rad_rate || 5) - ((userBalance.action_points || 0) % Math.ceil(userBalance.action_to_rad_rate || 5)),
          fromSocial: Math.ceil(userBalance.social_to_rad_rate || 20) - ((userBalance.social_points || 0) % Math.ceil(userBalance.social_to_rad_rate || 20)),
        },
      },
    };

    // Get transaction history if requested
    if (includeHistory) {
      const { data: transactions, error: transError } = await supabase
        .from('point_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (transError) {
        console.error('Error fetching transactions:', transError);
      } else {
        response.transactions = transactions;
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in points API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/rewards/points
 * Award points to a user or convert points to RAD tokens
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, ...params } = body;

    const supabase = createClient();

    // Get user ID
    const { data: user } = await supabase
      .from('users')
      .select('id, role')
      .eq('email', session.user.email)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (action === 'award') {
      // Award points
      const { currency, amount, sourceType, sourceId, description, targetUserId } = params;

      // Validate required fields
      if (!currency || !amount || !description) {
        return NextResponse.json(
          { error: 'Missing required fields: currency, amount, description' },
          { status: 400 }
        );
      }

      // Determine target user (for admin awarding, otherwise self)
      const userId = targetUserId || user.id;

      // Check permissions for awarding to others
      if (targetUserId && targetUserId !== user.id) {
        if (user.role !== 'admin' && user.role !== 'educator') {
          return NextResponse.json(
            { error: 'Insufficient permissions to award points to other users' },
            { status: 403 }
          );
        }
      }

      // Call award_points function
      const { data, error } = await supabase.rpc('award_points', {
        p_user_id: userId,
        p_currency: currency,
        p_amount: amount,
        p_source_type: sourceType || 'manual',
        p_source_id: sourceId || null,
        p_description: description,
        p_awarded_by: user.id,
        p_metadata: params.metadata || null,
      });

      if (error) {
        console.error('Error awarding points:', error);
        return NextResponse.json({ error: 'Failed to award points' }, { status: 500 });
      }

      // Get updated balance
      const { data: balance } = await supabase
        .from('user_point_balances')
        .select('*')
        .eq('user_id', userId)
        .single();

      return NextResponse.json({
        success: true,
        transactionId: data,
        balance,
      });
    } else if (action === 'convert') {
      // Convert points to RAD tokens
      const { learningPoints = 0, actionPoints = 0, socialPoints = 0 } = params;

      if (learningPoints < 0 || actionPoints < 0 || socialPoints < 0) {
        return NextResponse.json({ error: 'Point amounts must be non-negative' }, { status: 400 });
      }

      if (learningPoints === 0 && actionPoints === 0 && socialPoints === 0) {
        return NextResponse.json({ error: 'Must convert at least some points' }, { status: 400 });
      }

      // Get current balance to validate user has enough points
      const { data: currentBalance } = await supabase
        .from('user_point_balances')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!currentBalance) {
        return NextResponse.json({ error: 'Balance not found' }, { status: 404 });
      }

      // Check if user has enough points
      if (
        learningPoints > (currentBalance.learning_points || 0) ||
        actionPoints > (currentBalance.action_points || 0) ||
        socialPoints > (currentBalance.social_points || 0)
      ) {
        return NextResponse.json({ error: 'Insufficient points' }, { status: 400 });
      }

      // Call convert_to_rad_tokens function
      const { data: radTokensEarned, error } = await supabase.rpc('convert_to_rad_tokens', {
        p_user_id: user.id,
        p_learning_points: learningPoints,
        p_action_points: actionPoints,
        p_social_points: socialPoints,
      });

      if (error) {
        console.error('Error converting points:', error);
        return NextResponse.json({ error: 'Failed to convert points' }, { status: 500 });
      }

      // Get updated balance
      const { data: newBalance } = await supabase
        .from('user_point_balances')
        .select('*')
        .eq('user_id', user.id)
        .single();

      return NextResponse.json({
        success: true,
        radTokensEarned,
        balance: newBalance,
      });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in points API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

