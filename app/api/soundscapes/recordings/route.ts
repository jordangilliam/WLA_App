import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/auth.config'
import { supabaseAdmin } from '@/lib/db/client'
import { exportToPurdueSoundscapes } from '@/lib/soundscapes/purdue'
import { withSecurity } from '@/lib/auth/api-middleware'

const createSchema = z.object({
  audioData: z.string(),
  durationSeconds: z.number().positive(),
  sampleRate: z.number().optional(),
  metadata: z
    .object({
      observationId: z.string().uuid().optional(),
      fieldSiteId: z.string().uuid().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      sendToPurdue: z.boolean().optional(),
    })
    .optional(),
})

const listSchema = z.object({
  scope: z.enum(['mine', 'review']).default('mine'),
  status: z.enum(['stored', 'pending_export', 'exported', 'failed']).optional(),
})

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  const userId = (session?.user as { id?: string } | undefined)?.id

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = createSchema.safeParse(await request.json())
  if (!payload.success) {
    return NextResponse.json(
      { error: 'Invalid payload', details: payload.error.flatten() },
      { status: 400 }
    )
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Supabase admin client unavailable' },
      { status: 500 }
    )
  }

  const metadata = payload.data.metadata || {}
  const record = {
    user_id: userId,
    observation_id: metadata.observationId ?? null,
    field_site_id: metadata.fieldSiteId ?? null,
    duration_seconds: payload.data.durationSeconds,
    sample_rate: payload.data.sampleRate ?? null,
    audio_data: payload.data.audioData,
    status: metadata.sendToPurdue ? 'pending_export' : 'stored',
    metadata,
  }

  const { data, error } = await supabaseAdmin
    .from('soundscape_recordings')
    .insert(record as never)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const inserted = data as { id: string }

  if (metadata.sendToPurdue) {
    const exportResult = await exportToPurdueSoundscapes({
      audioData: payload.data.audioData,
      durationSeconds: payload.data.durationSeconds,
      metadata,
    })

    const statusUpdate = exportResult.ok
      ? {
          status: 'exported',
          export_attempts: 1,
          exported_at: new Date().toISOString(),
          purdue_request_id: exportResult.data?.requestId ?? null,
        }
      : {
          status: 'failed',
          export_attempts: 1,
        }

    await supabaseAdmin
      .from('soundscape_recordings')
      .update(statusUpdate as never)
      .eq('id', inserted.id)
  }

  return NextResponse.json({ recording: inserted })
}

export async function GET(request: NextRequest) {
  const params = listSchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams.entries())
  )

  if (!params.success) {
    return NextResponse.json(
      { error: 'Invalid query params', details: params.error.flatten() },
      { status: 400 }
    )
  }

  const scope = params.data.scope

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Supabase admin client unavailable' },
      { status: 500 }
    )
  }

  if (scope === 'review') {
    const authResult = await withSecurity(request, { requireRole: 'educator' })
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const query = supabaseAdmin
      .from('soundscape_recordings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (params.data.status) {
      query.eq('status', params.data.status)
    }

    const { data, error } = await query
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ items: data })
  }

  // scope === 'mine'
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from('soundscape_recordings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ items: data })
}

