import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/db/client'
import { withSecurity, validateBody } from '@/lib/auth/api-middleware'

const createChallengeSchema = z.object({
  title: z.string().min(3),
  description: z.string().max(2000).optional(),
  storylineId: z.string().optional(),
  scope: z.enum(['class', 'organization', 'global']).default('class'),
  targetMetric: z.enum([
    'check_ins',
    'observations',
    'species_count',
    'sites_visited',
    'distance_traveled',
    'photos_taken',
    'consecutive_days',
  ]),
  targetValue: z.number().int().min(1).default(10),
  reward: z.record(z.any()).optional(),
  startAt: z.string().datetime().optional(),
  endAt: z.string().datetime().optional(),
})

export async function GET(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Database connection not available' },
      { status: 500 }
    )
  }

  const nowIso = new Date().toISOString()
  const { searchParams } = new URL(request.url)
  const limit = Number(searchParams.get('limit') ?? '10')

  const { data, error } = await supabaseAdmin
    .from('community_challenges')
    .select(
      `
      *,
      community_challenge_participants (
        id,
        entity_type,
        entity_id,
        display_name,
        goal_override,
        progress,
        last_event_at
      )
    `
    )
    .eq('is_active', true)
    .lte('start_at', nowIso)
    .order('start_at', { ascending: false })
    .limit(Math.max(1, Math.min(limit, 50)))

  if (error) {
    console.error('Failed to load community challenges', error)
    return NextResponse.json(
      { error: 'Unable to load challenges' },
      { status: 500 }
    )
  }

  const formatted = ((data || []) as any[]).map((challenge: any) => ({
    id: challenge.id,
    title: challenge.title,
    description: challenge.description,
    storylineId: challenge.storyline_id,
    scope: challenge.scope,
    targetMetric: challenge.target_metric,
    targetValue: challenge.target_value,
    reward: challenge.reward,
    startAt: challenge.start_at,
    endAt: challenge.end_at,
    participants: challenge.community_challenge_participants
      ? (challenge as any).community_challenge_participants.sort(
          (a: any, b: any) => b.progress - a.progress
        )
      : [],
  }))

  return NextResponse.json({ success: true, challenges: formatted })
}

export async function POST(request: NextRequest) {
  const authResult = await withSecurity(request, {
    requireRole: 'educator',
  })

  if (authResult instanceof NextResponse) {
    return authResult
  }

  const validation = await validateBody(request, createChallengeSchema)
  if (validation instanceof NextResponse) {
    return validation
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Database connection not available' },
      { status: 500 }
    )
  }

  const { data } = validation
  const now = new Date()
  const startAt = data.startAt ? new Date(data.startAt) : now
  const endAt = data.endAt ? new Date(data.endAt) : null

  if (endAt && endAt <= startAt) {
    return NextResponse.json(
      { error: 'endAt must be after startAt' },
      { status: 400 }
    )
  }

  const { data: record, error } = await supabaseAdmin
    .from('community_challenges')
    .insert({
      title: data.title,
      description: data.description ?? null,
      storyline_id: data.storylineId ?? null,
      scope: data.scope,
      target_metric: data.targetMetric,
      target_value: data.targetValue,
      reward: data.reward ?? null,
      start_at: startAt.toISOString(),
      end_at: endAt?.toISOString() ?? null,
      created_by: (authResult as any).user?.id ?? null,
    } as never)
    .select()
    .single()

  if (error || !record) {
    console.error('Failed to create community challenge', error)
    return NextResponse.json(
      { error: 'Unable to create challenge' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, challenge: record })
}





