import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/db/client'
import { withSecurity, validateBody } from '@/lib/auth/api-middleware'

const joinSchema = z.object({
  entityType: z.enum(['class', 'organization', 'global']).default('class'),
  entityId: z.string().optional(),
  displayName: z.string().min(3).max(120).optional(),
  goal: z.number().int().min(1).optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { challengeId: string } }
) {
  const authResult = await withSecurity(request, {
    requireRole: 'educator',
  })

  if (authResult instanceof NextResponse) {
    return authResult
  }

  const validation = await validateBody(request, joinSchema)
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

  const { data: challengeData, error: challengeError } = await supabaseAdmin
    .from('community_challenges')
    .select('id, is_active, start_at, end_at, scope')
    .eq('id', params.challengeId)
    .single()

  if (challengeError || !challengeData) {
    return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
  }

  const challenge = challengeData as { id: string; is_active: boolean; start_at: string | null; end_at: string | null; scope: string }

  if (challenge.end_at && new Date(challenge.end_at) < new Date()) {
    return NextResponse.json(
      { error: 'Challenge already ended' },
      { status: 400 }
    )
  }

  let entityDisplayName = data.displayName ?? 'Community Team'
  let entityId: string | null = data.entityId ?? null

  if (data.entityType === 'class') {
    if (!data.entityId) {
      return NextResponse.json(
        { error: 'entityId is required for class challenges' },
        { status: 400 }
      )
    }

    const { data: classroomData, error: classError } = await supabaseAdmin
      .from('classes')
      .select('id, name, teacher_id')
      .eq('id', data.entityId)
      .single()

    if (classError || !classroomData) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 })
    }

    const classroom = classroomData as { id: string; name: string; teacher_id: string }
    const teacherId = (authResult as any).user?.id
    if (teacherId !== classroom.teacher_id) {
      return NextResponse.json(
        { error: 'You can only enroll classes you teach' },
        { status: 403 }
      )
    }

    entityDisplayName = data.displayName || classroom.name || 'Class Team'
    entityId = classroom.id.toString()
  }

  if (data.entityType === 'organization' && !data.entityId) {
    return NextResponse.json(
      { error: 'entityId is required for organization challenges' },
      { status: 400 }
    )
  }

  const { data: participant, error: participantError } = await supabaseAdmin
    .from('community_challenge_participants')
    .insert({
      challenge_id: challenge.id,
      entity_type: data.entityType,
      entity_id: entityId,
      display_name: entityDisplayName,
      goal_override: data.goal ?? null,
    } as never)
    .select()
    .single()

  if (participantError || !participant) {
    if (
      participantError?.code === '23505' ||
      participantError?.message?.includes('duplicate')
    ) {
      return NextResponse.json(
        { error: 'This participant is already registered' },
        { status: 400 }
      )
    }

    console.error('Failed to add participant', participantError)
    return NextResponse.json(
      { error: 'Unable to join challenge' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, participant })
}





