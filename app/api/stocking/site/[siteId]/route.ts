import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { siteId: string } }
) {
  try {
    // Check database connection
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    const { siteId } = params;

    // Fetch field site details
    const { data: site, error: siteError } = await supabaseAdmin
      .from('field_sites')
      .select('*, water_body_details(*)')
      .eq('id', siteId)
      .single();

    if (siteError || !site) {
      return NextResponse.json(
        { error: 'Field site not found' },
        { status: 404 }
      );
    }

    const siteRow = site as {
      id: number
      name: string
      latitude: number
      longitude: number
      site_type?: string | null
      description?: string | null
      ecology_notes?: string | null
      access_info?: string | null
      regulations?: string | null
      safety_notes?: string | null
      water_body_details?: any
    }

    // Fetch stocking schedules for this site
    const { data: stockings, error: stockingsError } = await supabaseAdmin
      .from('stocking_schedules')
      .select('*')
      .eq('field_site_id', siteId)
      .order('stocking_date', { ascending: true });

    if (stockingsError) {
      console.error('Error fetching stockings:', stockingsError);
    }

    // Fetch catch reports for this site (if available)
    const { data: catchReports, error: catchError } = await supabaseAdmin
      .from('catch_reports')
      .select('*')
      .eq('field_site_id', siteId)
      .order('report_date', { ascending: false })
      .limit(10);

    if (catchError) {
      console.error('Error fetching catch reports:', catchError);
    }

    // Calculate next stocking
    const stockingList = (stockings as any[] | null) || []

    const upcomingStockings = stockingList.filter(
      (s: any) => new Date(s.stocking_date) >= new Date() && s.status === 'scheduled'
    );

    const nextStocking = upcomingStockings.length > 0 ? upcomingStockings[0] : null;

    // Calculate recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentStockings = stockingList.filter(
      (s: any) =>
        new Date(s.stocking_date) >= thirtyDaysAgo &&
        new Date(s.stocking_date) <= new Date() &&
        s.status === 'completed'
    );

    const totalStocked = recentStockings.reduce(
      (sum: number, s: any) => sum + (s.quantity || 0),
      0
    );

    return NextResponse.json({
      success: true,
      site: {
        id: siteRow.id,
        name: siteRow.name,
        latitude: siteRow.latitude,
        longitude: siteRow.longitude,
        site_type: siteRow.site_type,
        description: siteRow.description,
        ecology_notes: siteRow.ecology_notes,
        access_info: siteRow.access_info,
        regulations: siteRow.regulations,
        safety_notes: siteRow.safety_notes,
      },
      waterBody: siteRow.water_body_details || null,
      nextStocking: nextStocking
        ? {
            date: nextStocking.stocking_date,
            species: nextStocking.species,
            quantity: nextStocking.quantity,
            sizeRange: nextStocking.size_range,
          }
        : null,
      recentActivity: {
        stockingsLast30Days: recentStockings.length,
        fishStockedLast30Days: totalStocked,
      },
      allStockings: stockings || [],
      recentCatchReports: catchReports || [],
    });
  } catch (error) {
    console.error('Error in site stocking API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

