import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/client'

export async function GET(
  request: NextRequest,
  { params }: { params: { missionId: string } }
) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Database connection not available' },
      { status: 500 }
    )
  }

  const { searchParams } = new URL(request.url)
  const includeStages = searchParams.get('stages') !== 'false'

  const query = supabaseAdmin
    .from('story_missions')
    .select(
      includeStages
        ? '*, story_mission_stages (*)'
        : '*'
    )
    .eq('id', params.missionId)
    .single()

  const { data: missionData, error } = await query

  if (error || !missionData) {
    return NextResponse.json({ error: 'Mission not found' }, { status: 404 })
  }

  const data = missionData as any

  const mission = {
    id: data.id,
    title: data.title,
    synopsis: data.synopsis,
    storylineId: data.storyline_id,
    heroImageUrl: data.hero_image_url,
    difficulty: data.difficulty,
    subjectTags: data.subject_tags,
    recommendedGrades: data.recommended_grades,
    startAt: data.start_at,
    endAt: data.end_at,
    stages: includeStages
      ? ((data as any).story_mission_stages || []).sort(
          (a: any, b: any) => a.order_index - b.order_index
        )
      : undefined,
  }

  return NextResponse.json({ success: true, mission })
}





