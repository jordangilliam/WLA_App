import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/auth.config'
import { supabaseAdmin } from '@/lib/db/client'

export async function GET(
  _request: NextRequest,
  { params }: { params: { challengeId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Database connection not available' },
      { status: 500 }
    )
  }

  const { data: challengeData, error: challengeError } = await supabaseAdmin
    .from('community_challenges')
    .select('*, community_challenge_participants (*)')
    .eq('id', params.challengeId)
    .single()

  if (challengeError || !challengeData) {
    return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
  }

  const challenge = challengeData as any
  const participants = challenge.community_challenge_participants || []
  participants.sort((a: any, b: any) => b.progress - a.progress)

  return NextResponse.json({
    success: true,
    challenge: {
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      targetMetric: challenge.target_metric,
      targetValue: challenge.target_value,
      reward: challenge.reward,
      scope: challenge.scope,
      startAt: challenge.start_at,
      endAt: challenge.end_at,
      participants,
    },
  })
}





