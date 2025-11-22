import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/auth.config'
import { supabaseAdmin } from '@/lib/db/client'

const updateSchema = z.object({
  stageId: z.string().uuid(),
  status: z.enum(['pending', 'in_progress', 'completed']),
  notes: z.string().max(2000).optional(),
})

export async function GET(
  _request: NextRequest,
  { params }: { params: { missionId: string } }
) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Database connection not available' },
      { status: 500 }
    )
  }

  const { data: stages } = await supabaseAdmin
    .from('story_mission_stages')
    .select('*')
    .eq('mission_id', params.missionId)
    .order('order_index', { ascending: true })

  if (!stages || stages.length === 0) {
    return NextResponse.json({ error: 'Mission or stages not found' }, { status: 404 })
  }

  const { data: stageProgress } = await supabaseAdmin
    .from('story_mission_stage_progress')
    .select('*')
    .eq('mission_id', params.missionId)
    .eq('user_id', userId)

  const stageStatusMap = new Map(
    (stageProgress || []).map((row) => [row.stage_id, row])
  )

  const { data: missionProgressRow } = await supabaseAdmin
    .from('story_mission_progress')
    .select('*')
    .eq('mission_id', params.missionId)
    .eq('user_id', userId)
    .single()

  const completedStages = (stageProgress || []).filter(
    (row) => row.status === 'completed'
  ).length

  const missionProgress = missionProgressRow || {
    mission_id: params.missionId,
    user_id: userId,
    current_stage: completedStages,
    completed: completedStages >= stages.length,
    completed_at: missionProgressRow?.completed_at ?? null,
  }

  return NextResponse.json({
    success: true,
    missionProgress,
    stages: stages.map((stage: any) => ({
      ...stage,
      status: stageStatusMap.get(stage.id)?.status ?? 'pending',
      notes: stageStatusMap.get(stage.id)?.notes ?? null,
    })),
  })
}

export async function POST(
  request: NextRequest,
  { params }: { params: { missionId: string } }
) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Database connection not available' },
      { status: 500 }
    )
  }

  let payload: z.infer<typeof updateSchema>
  try {
    payload = updateSchema.parse(await request.json())
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.flatten() },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Invalid payload' },
      { status: 400 }
    )
  }

  const { data: stage, error: stageError } = await supabaseAdmin
    .from('story_mission_stages')
    .select('id, mission_id, order_index')
    .eq('id', payload.stageId)
    .eq('mission_id', params.missionId)
    .single()

  if (stageError || !stage) {
    return NextResponse.json({ error: 'Stage not found' }, { status: 404 })
  }

  const { data: upserted, error: progressError } = await supabaseAdmin
    .from('story_mission_stage_progress')
    .upsert(
      {
        mission_id: params.missionId,
        stage_id: payload.stageId,
        user_id: userId,
        status: payload.status,
        notes: payload.notes ?? null,
      } as never,
      { onConflict: 'stage_id,user_id' }
    )
    .select()
    .single()

  if (progressError || !upserted) {
    console.error('Failed to update stage progress', progressError)
    return NextResponse.json(
      { error: 'Unable to update stage status' },
      { status: 500 }
    )
  }

  const { data: allStages } = await supabaseAdmin
    .from('story_mission_stages')
    .select('id')
    .eq('mission_id', params.missionId)

  const { data: completedStages } = await supabaseAdmin
    .from('story_mission_stage_progress')
    .select('stage_id')
    .eq('mission_id', params.missionId)
    .eq('user_id', userId)
    .eq('status', 'completed')

  const stageCount = allStages?.length ?? 0
  const completedCount = completedStages?.length ?? 0
  const missionCompleted = stageCount > 0 && completedCount >= stageCount

  await supabaseAdmin
    .from('story_mission_progress')
    .upsert(
      {
        mission_id: params.missionId,
        user_id: userId,
        current_stage: completedCount,
        completed: missionCompleted,
        completed_at: missionCompleted ? new Date().toISOString() : null,
      } as never,
      { onConflict: 'mission_id,user_id' }
    )

  return NextResponse.json({
    success: true,
    stageProgress: upserted,
    missionStatus: {
      completedStages: completedCount,
      totalStages: stageCount,
      completed: missionCompleted,
    },
  })
}





