import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/rewards
 * Get available rewards with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const partnerId = searchParams.get('partnerId');
    const category = searchParams.get('category');
    const rewardType = searchParams.get('rewardType');
    const rarity = searchParams.get('rarity');
    const minCost = searchParams.get('minCost') ? parseInt(searchParams.get('minCost')!) : undefined;
    const maxCost = searchParams.get('maxCost') ? parseInt(searchParams.get('maxCost')!) : undefined;
    const featured = searchParams.get('featured') === 'true';
    const city = searchParams.get('city');
    const tags = searchParams.get('tags')?.split(',');

    const supabase = createClient();

    // Build query using the available_rewards_view
    let query = supabase
      .from('available_rewards_view')
      .select('*', { count: 'exact' });

    // Apply filters
    if (partnerId) query = query.eq('partner_id', partnerId);
    if (category) query = query.eq('partner_category', category);
    if (rewardType) query = query.eq('reward_type', rewardType);
    if (rarity) query = query.eq('rarity', rarity);
    if (minCost !== undefined) query = query.gte('cost_rad_tokens', minCost);
    if (maxCost !== undefined) query = query.lte('cost_rad_tokens', maxCost);
    if (featured) query = query.eq('featured', true);
    if (city) query = query.eq('partner_city', city);
    if (tags && tags.length > 0) {
      query = query.contains('tags', tags);
    }

    // Only show currently available rewards
    query = query.eq('currently_available', true);
    query = query.eq('in_stock', true);

    // Apply pagination
    const offset = (page - 1) * pageSize;
    query = query.range(offset, offset + pageSize - 1);

    // Sort by featured first, then by rarity and name
    query = query.order('featured', { ascending: false })
      .order('featured_order', { ascending: true, nullsFirst: false })
      .order('cost_rad_tokens', { ascending: true });

    const { data: rewards, error, count } = await query;

    if (error) {
      console.error('Error fetching rewards:', error);
      return NextResponse.json({ error: 'Failed to fetch rewards' }, { status: 500 });
    }

    // If user is logged in, get their claim counts
    let userClaimCounts: Record<string, number> = {};
    if (session?.user?.email) {
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single();

      if (user) {
        const { data: redemptions } = await supabase
          .from('reward_redemptions')
          .select('reward_id')
          .eq('user_id', user.id)
          .in('status', ['claimed', 'approved', 'redeemed']);

        if (redemptions) {
          userClaimCounts = redemptions.reduce((acc, r) => {
            acc[r.reward_id] = (acc[r.reward_id] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
        }
      }
    }

    // Enhance rewards with user claim data
    const enhancedRewards = rewards?.map(reward => ({
      ...reward,
      userClaimCount: userClaimCounts[reward.id] || 0,
      userCanClaim: !reward.quantity_per_user || (userClaimCounts[reward.id] || 0) < reward.quantity_per_user,
    }));

    return NextResponse.json({
      rewards: enhancedRewards || [],
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    });
  } catch (error) {
    console.error('Error in rewards API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/rewards
 * Create a new reward (admin/partner only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient();

    // Get user and check permissions
    const { data: user } = await supabase
      .from('users')
      .select('id, role')
      .eq('email', session.user.email)
      .single();

    if (!user || (user.role !== 'admin' && user.role !== 'partner')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['partnerId', 'name', 'description', 'rewardType', 'costRadTokens'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Create reward
    const { data: reward, error } = await supabase
      .from('rewards')
      .insert({
        partner_id: body.partnerId,
        name: body.name,
        description: body.description,
        reward_type: body.rewardType,
        rarity: body.rarity || 'common',
        cost_rad_tokens: body.costRadTokens,
        cost_learning_points: body.costLearningPoints,
        cost_action_points: body.costActionPoints,
        retail_value: body.retailValue,
        discount_percentage: body.discountPercentage,
        is_active: body.isActive !== false,
        total_quantity: body.totalQuantity,
        quantity_remaining: body.totalQuantity,
        quantity_per_user: body.quantityPerUser || 1,
        available_start_date: body.availableStartDate,
        available_end_date: body.availableEndDate,
        available_days_of_week: body.availableDaysOfWeek,
        available_times: body.availableTimes,
        min_age: body.minAge,
        max_age: body.maxAge,
        required_level: body.requiredLevel,
        required_achievements: body.requiredAchievements,
        requires_parent_permission: body.requiresParentPermission || false,
        requires_teacher_approval: body.requiresTeacherApproval || false,
        image_url: body.imageUrl,
        icon: body.icon,
        featured: body.featured || false,
        featured_order: body.featuredOrder,
        redemption_method: body.redemptionMethod || 'qr_code',
        redemption_instructions: body.redemptionInstructions,
        requires_appointment: body.requiresAppointment || false,
        expiration_days: body.expirationDays || 30,
        terms_and_conditions: body.termsAndConditions,
        exclusions: body.exclusions,
        tags: body.tags,
        metadata: body.metadata,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating reward:', error);
      return NextResponse.json({ error: 'Failed to create reward' }, { status: 500 });
    }

    // Update partner's total rewards count
    await supabase.rpc('increment', {
      table_name: 'partner_organizations',
      id: body.partnerId,
      column_name: 'total_rewards_offered',
      amount: 1,
    });

    return NextResponse.json({ reward }, { status: 201 });
  } catch (error) {
    console.error('Error in rewards API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

