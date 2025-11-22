import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/rewards/partners
 * Get partner organizations with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const status = searchParams.get('status') || 'active';
    const featured = searchParams.get('featured') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    const supabase = createClient();

    // Build query
    let query = supabase
      .from('partner_organizations')
      .select('*', { count: 'exact' });

    // Apply filters
    if (category) query = query.eq('category', category);
    if (city) query = query.eq('city', city);
    if (status) query = query.eq('status', status);

    // Sort
    query = query.order('name', { ascending: true });

    // Pagination
    const offset = (page - 1) * pageSize;
    query = query.range(offset, offset + pageSize - 1);

    const { data: partners, error, count } = await query;

    if (error) {
      console.error('Error fetching partners:', error);
      return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
    }

    // For each partner, get reward count
    const partnersWithStats = await Promise.all(
      (partners || []).map(async (partner) => {
        const { data: rewards } = await supabase
          .from('rewards')
          .select('id', { count: 'exact' })
          .eq('partner_id', partner.id)
          .eq('is_active', true);

        return {
          ...partner,
          activeRewardsCount: rewards?.length || 0,
        };
      })
    );

    return NextResponse.json({
      partners: partnersWithStats,
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    });
  } catch (error) {
    console.error('Error in partners API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/rewards/partners
 * Create a new partner organization (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient();

    // Check permissions
    const { data: user } = await supabase
      .from('users')
      .select('id, role')
      .eq('email', session.user.email)
      .single();

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'category', 'city'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Create partner
    const { data: partner, error } = await supabase
      .from('partner_organizations')
      .insert({
        name: body.name,
        legal_name: body.legalName,
        description: body.description,
        category: body.category,
        subcategory: body.subcategory,
        primary_contact_name: body.primaryContactName,
        primary_contact_email: body.primaryContactEmail,
        primary_contact_phone: body.primaryContactPhone,
        website: body.website,
        address: body.address,
        city: body.city,
        state: body.state || 'PA',
        zip_code: body.zipCode,
        coordinates: body.coordinates ? `POINT(${body.coordinates[0]} ${body.coordinates[1]})` : null,
        status: body.status || 'pending',
        partnership_level: body.partnershipLevel,
        contract_start_date: body.contractStartDate,
        contract_end_date: body.contractEndDate,
        logo_url: body.logoUrl,
        banner_url: body.bannerUrl,
        brand_color: body.brandColor,
        tagline: body.tagline,
        requires_appointment: body.requiresAppointment || false,
        allows_group_reservations: body.allowsGroupReservations !== false,
        max_group_size: body.maxGroupSize,
        advance_booking_days: body.advanceBookingDays,
        redemption_instructions: body.redemptionInstructions,
        api_enabled: body.apiEnabled || false,
        webhook_url: body.webhookUrl,
        metadata: body.metadata,
        terms_and_conditions: body.termsAndConditions,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating partner:', error);
      return NextResponse.json({ error: 'Failed to create partner' }, { status: 500 });
    }

    return NextResponse.json({ partner }, { status: 201 });
  } catch (error) {
    console.error('Error in partners API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

