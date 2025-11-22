import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/client'

/**
 * GET /api/story-missions/[missionId]/media
 * Fetch media items for a mission
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { missionId: string } }
) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database not available' }, { status: 500 })
  }

  const { missionId } = params

  try {
    // For now, return media from mission hero_image_url
    // In the future, this could query a mission_media table
    const { data: missionData } = await supabaseAdmin
      .from('story_missions')
      .select('hero_image_url')
      .eq('id', missionId)
      .single()

    const mission = missionData as { hero_image_url: string | null } | null
    const media: any[] = []
    
    if (mission?.hero_image_url) {
      media.push({
        id: `${missionId}-hero`,
        missionId,
        type: 'image',
        url: mission.hero_image_url,
        thumbnailUrl: mission.hero_image_url,
        title: 'Mission Hero Image',
        order: 0,
      })
    }

    return NextResponse.json({ success: true, media })
  } catch (error) {
    console.error('Failed to fetch mission media:', error)
    return NextResponse.json(
      { error: 'Unable to fetch media' },
      { status: 500 }
    )
  }
}


