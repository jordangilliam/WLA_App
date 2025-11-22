import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/client'

/**
 * GET /api/story-missions/[missionId]/stages/[stageId]/media
 * Fetch media items for a specific mission stage
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { missionId: string; stageId: string } }
) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database not available' }, { status: 500 })
  }

  const { missionId, stageId } = params

  try {
    // Get stage content which may contain media references
    const { data: stageData } = await supabaseAdmin
      .from('story_mission_stages')
      .select('content')
      .eq('id', stageId)
      .eq('mission_id', missionId)
      .single()

    const stage = stageData as { content: any } | null
    const media: any[] = []

    // Extract media from stage content if present
    if (stage?.content && typeof stage.content === 'object') {
      const content = stage.content as any
      if (content.media && Array.isArray(content.media)) {
        content.media.forEach((item: any, index: number) => {
          media.push({
            id: `${stageId}-media-${index}`,
            missionId,
            stageId,
            type: item.type || 'image',
            url: item.url,
            thumbnailUrl: item.thumbnailUrl,
            title: item.title,
            description: item.description,
            credit: item.credit,
            order: item.order ?? index,
          })
        })
      }
    }

    return NextResponse.json({ success: true, media })
  } catch (error) {
    console.error('Failed to fetch stage media:', error)
    return NextResponse.json(
      { error: 'Unable to fetch media' },
      { status: 500 }
    )
  }
}


