import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/auth.config'
import { supabaseAdmin } from '@/lib/db/client'

const contributeSchema = z.object({
  participantId: z.string().uuid(),
  eventType: z.string().min(3).max(64),
  value: z.number().int().min(1).default(1),
  metadata: z.record(z.any()).optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { challengeId: string } }
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

  let payload: z.infer<typeof contributeSchema>
  try {
    payload = contributeSchema.parse(await request.json())
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

  const { data: participantData, error: participantError } = await supabaseAdmin
    .from('community_challenge_participants')
    .select('id, challenge_id')
    .eq('id', payload.participantId)
    .eq('challenge_id', params.challengeId)
    .single()

  if (participantError || !participantData) {
    return NextResponse.json(
      { error: 'Participant not found in this challenge' },
      { status: 404 }
    )
  }

  const participant = participantData as { id: string; challenge_id: string }

  const { error: insertError } = await supabaseAdmin
    .from('community_challenge_events')
    .insert({
      challenge_id: participant.challenge_id,
      participant_id: participant.id,
      user_id: userId,
      event_type: payload.eventType,
      value: payload.value,
      metadata: payload.metadata ?? null,
    } as any)

  if (insertError) {
    console.error('Failed to record challenge contribution', insertError)
    return NextResponse.json(
      { error: 'Unable to record contribution' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}





