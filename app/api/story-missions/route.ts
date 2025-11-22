import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/db/client'
import { withSecurity, validateBody } from '@/lib/auth/api-middleware'

const missionSchema = z.object({
  title: z.string().min(3),
  synopsis: z.string().max(4000).optional(),
  storylineId: z.string().optional(),
  heroImageUrl: z.string().url().optional(),
  difficulty: z.string().optional(),
  subjectTags: z.array(z.string()).optional(),
  recommendedGrades: z.array(z.string()).optional(),
  startAt: z.string().datetime().optional(),
  endAt: z.string().datetime().optional(),
  stages: z
    .array(
      z.object({
        title: z.string().min(3),
        summary: z.string().optional(),
        learningObjective: z.string().optional(),
        order: z.number().int().min(0).optional(),
        targetMetric: z
          .enum([
            'check_ins',
            'observations',
            'species_count',
            'sites_visited',
            'distance_traveled',
            'photos_taken',
            'consecutive_days',
          ])
          .optional(),
        targetValue: z.number().int().min(1).optional(),
        content: z.record(z.any()).optional(),
        reward: z.record(z.any()).optional(),
      })
    )
    .min(1),
})

export async function GET(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Database connection not available' },
      { status: 500 }
    )
  }

  const { searchParams } = new URL(request.url)
  const limit = Number(searchParams.get('limit') ?? '10')

  const { data, error } = await supabaseAdmin
    .from('story_missions')
    .select(
      `
      *,
      story_mission_stages (*)
    `
    )
    .eq('is_active', true)
    .order('start_at', { ascending: false })
    .limit(Math.max(1, Math.min(limit, 20)))

  if (error) {
    console.error('Failed to load story missions', error)
    return NextResponse.json(
      { error: 'Unable to load missions' },
      { status: 500 }
    )
  }

  const response = ((data || []) as any[]).map((mission: any) => ({
    id: mission.id,
    title: mission.title,
    synopsis: mission.synopsis,
    heroImageUrl: mission.hero_image_url,
    storylineId: mission.storyline_id,
    difficulty: mission.difficulty,
    subjectTags: mission.subject_tags,
    recommendedGrades: mission.recommended_grades,
    startAt: mission.start_at,
    endAt: mission.end_at,
    stages: (mission as any).story_mission_stages
      ? (mission as any).story_mission_stages.sort(
          (a: any, b: any) => a.order_index - b.order_index
        )
      : [],
  }))

  return NextResponse.json({ success: true, missions: response })
}

export async function POST(request: NextRequest) {
  const authResult = await withSecurity(request, { requireRole: 'educator' })
  if (authResult instanceof NextResponse) {
    return authResult
  }

  const validation = await validateBody(request, missionSchema)
  if (validation instanceof NextResponse) {
    return validation
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Database connection not available' },
      { status: 500 }
    )
  }

  const payload = validation.data
  const now = new Date()
  const startAt = payload.startAt ? new Date(payload.startAt) : now
  const endAt = payload.endAt ? new Date(payload.endAt) : null

  const { data: missionData, error: insertError } = await supabaseAdmin
    .from('story_missions')
    .insert({
      title: payload.title,
      synopsis: payload.synopsis ?? null,
      storyline_id: payload.storylineId ?? null,
      hero_image_url: payload.heroImageUrl ?? null,
      difficulty: payload.difficulty ?? 'medium',
      subject_tags: payload.subjectTags ?? [],
      recommended_grades: payload.recommendedGrades ?? [],
      start_at: startAt.toISOString(),
      end_at: endAt?.toISOString() ?? null,
      created_by: (authResult as any).user?.id ?? null,
    } as never)
    .select()
    .single()

  if (insertError || !missionData) {
    console.error('Failed to create mission', insertError)
    return NextResponse.json(
      { error: 'Unable to create mission' },
      { status: 500 }
    )
  }

  const mission = missionData as { id: string }

  const stagesPayload = payload.stages.map((stage, idx) => ({
    mission_id: mission.id,
    order_index: stage.order ?? idx,
    title: stage.title,
    summary: stage.summary ?? null,
    learning_objective: stage.learningObjective ?? null,
    target_metric: stage.targetMetric ?? null,
    target_value: stage.targetValue ?? null,
    content: stage.content ?? null,
    reward: stage.reward ?? null,
  }))

  const { error: stageError } = await supabaseAdmin
    .from('story_mission_stages')
    .insert(stagesPayload as never)

  if (stageError) {
    console.error('Failed to insert mission stages', stageError)
    return NextResponse.json(
      { error: 'Mission created but failed to add stages' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, mission })
}





