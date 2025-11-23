import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/client';

/**
 * GET /api/field-sites/[siteId]/missions
 * Fetch missions associated with a specific field site
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { siteId: string } }
) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database not available' }, { status: 500 });
  }

  const { siteId } = params;

  try {
    // Fetch missions that have locations at this field site
    const { data: missionLocations, error } = await supabaseAdmin
      .from('mission_locations')
      .select(`
        id,
        mission_id,
        stage_id,
        location_type,
        required_action,
        order_index,
        story_missions (
          id,
          title,
          synopsis,
          hero_image_url,
          difficulty
        )
      `)
      .eq('field_site_id', siteId)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Failed to fetch missions for site:', error);
      return NextResponse.json(
        { error: 'Unable to fetch missions' },
        { status: 500 }
      );
    }

    // Group by mission and transform
    const missionMap = new Map<string, any>();
    
    (missionLocations || []).forEach((ml: any) => {
      const mission = ml.story_missions;
      if (!mission) return;

      if (!missionMap.has(mission.id)) {
        missionMap.set(mission.id, {
          id: mission.id,
          title: mission.title,
          synopsis: mission.synopsis,
          heroImageUrl: mission.hero_image_url,
          difficulty: mission.difficulty,
          locations: [],
        });
      }

      const missionData = missionMap.get(mission.id);
      missionData.locations.push({
        id: ml.id,
        stageId: ml.stage_id,
        locationType: ml.location_type,
        requiredAction: ml.required_action,
        orderIndex: ml.order_index,
      });
    });

    const missions = Array.from(missionMap.values());

    return NextResponse.json({ success: true, missions });
  } catch (error) {
    console.error('Failed to fetch missions for site:', error);
    return NextResponse.json(
      { error: 'Unable to fetch missions' },
      { status: 500 }
    );
  }
}

