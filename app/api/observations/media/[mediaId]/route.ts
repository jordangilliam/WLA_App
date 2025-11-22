import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { Buffer } from 'node:buffer'
import { authOptions } from '@/app/api/auth/auth.config'
import { supabaseAdmin } from '@/lib/db/client'
import { runIdentificationPipeline } from '@/lib/ai'
import type { IdentificationResult } from '@/lib/ai/types'

const OBSERVATION_MEDIA_BUCKET =
  process.env.OBSERVATION_MEDIA_BUCKET || 'observations'

const updateSchema = z.object({
  status: z.enum(['pending', 'available', 'failed', 'removed']).optional(),
  observationId: z.string().uuid().optional(),
  fieldSiteId: z.string().uuid().optional(),
  capturedAt: z.string().datetime().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  metadata: z.record(z.any()).optional(),
  triggerAnalysis: z.boolean().optional(),
})

type ObservationMedia = {
  id: string
  user_id: string
  observation_id: string | null
  field_site_id: string | null
  media_type: 'photo' | 'audio' | 'video'
  storage_path: string
  preview_path: string | null
  status: 'pending' | 'available' | 'failed' | 'removed'
  captured_at: string | null
  latitude: number | null
  longitude: number | null
  metadata: Record<string, unknown> | null
}

const MODERATOR_ROLES = new Set(['educator', 'teacher', 'admin', 'partner'])

export async function PATCH(
  request: NextRequest,
  { params }: { params: { mediaId: string } }
) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
  const role = (session?.user as { role?: string } | undefined)?.role

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Supabase admin client not configured' },
      { status: 500 }
    )
  }

  const body = await request.json()
  const parsed = updateSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { data: existingData, error: fetchError } = await supabaseAdmin
    .from('observation_media')
    .select('*')
    .eq('id', params.mediaId)
    .single()

  if (fetchError || !existingData) {
    return NextResponse.json({ error: 'Media not found' }, { status: 404 })
  }

  const existing = existingData as ObservationMedia
  const isOwner = existing.user_id === userId
  const canModerate = role ? MODERATOR_ROLES.has(role) : false

  if (!isOwner && !canModerate) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const payload = parsed.data
  const updates: Record<string, unknown> = {}

  if (payload.status) updates.status = payload.status
  if (payload.observationId !== undefined)
    updates.observation_id = payload.observationId
  if (payload.fieldSiteId !== undefined)
    updates.field_site_id = payload.fieldSiteId
  if (payload.capturedAt !== undefined) updates.captured_at = payload.capturedAt
  if (payload.latitude !== undefined) updates.latitude = payload.latitude
  if (payload.longitude !== undefined) updates.longitude = payload.longitude
  if (payload.metadata !== undefined) updates.metadata = payload.metadata

  if (Object.keys(updates).length === 0 && !payload.triggerAnalysis) {
    return NextResponse.json({ error: 'No updates supplied' }, { status: 400 })
  }

  const { data: updatedData, error: updateError } = await supabaseAdmin
    .from('observation_media')
    .update(updates as never)
    .eq('id', params.mediaId)
    .select()
    .single()

  if (updateError || !updatedData) {
    console.error('Failed to update observation media', updateError)
    return NextResponse.json(
      { error: 'Failed to update media record' },
      { status: 500 }
    )
  }

  const updated = updatedData as ObservationMedia

  let analysisResults: IdentificationResult[] | null = null
  const shouldAnalyze =
    (payload.triggerAnalysis ||
      (payload.status === 'available' && existing.status !== 'available')) &&
    updated.media_type !== 'video'

  if (shouldAnalyze) {
    try {
      analysisResults = await analyzeMedia(updated as ObservationMedia)
    } catch (error) {
      console.error('Failed to analyze media asset', error)
    }
  }

  return NextResponse.json({
    success: true,
    media: updated,
    analysis: analysisResults,
  })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { mediaId: string } }
) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
  const role = (session?.user as { role?: string } | undefined)?.role

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Supabase admin client not configured' },
      { status: 500 }
    )
  }

  const { data: existingData, error: fetchError } = await supabaseAdmin
    .from('observation_media')
    .select('*')
    .eq('id', params.mediaId)
    .single()

  if (fetchError || !existingData) {
    return NextResponse.json({ error: 'Media not found' }, { status: 404 })
  }

  const existing = existingData as ObservationMedia
  const isOwner = existing.user_id === userId
  const canModerate = role ? MODERATOR_ROLES.has(role) : false

  if (!isOwner && !canModerate) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const objectsToRemove = [existing.storage_path]
  if (existing.preview_path) {
    objectsToRemove.push(existing.preview_path)
  }

  if (objectsToRemove.length) {
    const { error: storageError } = await supabaseAdmin.storage
      .from(OBSERVATION_MEDIA_BUCKET)
      .remove(objectsToRemove)

    if (storageError) {
      console.error('Failed to remove storage objects', storageError)
    }
  }

  await supabaseAdmin
    .from('observation_media')
    .update({ status: 'removed' } as never)
    .eq('id', params.mediaId)

  return NextResponse.json({ success: true })
}

async function analyzeMedia(
  media: ObservationMedia
): Promise<IdentificationResult[] | null> {
  if (!supabaseAdmin) return null

  const { data, error } = await supabaseAdmin.storage
    .from(OBSERVATION_MEDIA_BUCKET)
    .download(media.storage_path)

  if (error || !data) {
    throw error || new Error('Missing media content')
  }

  const arrayBuffer = await data.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const base64 = buffer.toString('base64')
  const mediaType = media.media_type === 'photo' ? 'image' : 'audio'

  const results = await runIdentificationPipeline({
    mediaType,
    imageData: mediaType === 'image' ? base64 : undefined,
    audioData: mediaType === 'audio' ? base64 : undefined,
    targets: media.media_type === 'audio' ? ['macro', 'species'] : ['species', 'bird'],
    latitude: media.latitude ?? undefined,
    longitude: media.longitude ?? undefined,
  })

  if (results.length) {
    await supabaseAdmin
      .from('ai_identifications')
      .insert(
        results.map((result) => ({
          user_id: media.user_id,
          observation_id: media.observation_id,
          field_site_id: media.field_site_id,
          provider: result.provider,
          mode: result.mode,
          label: result.label,
          confidence: result.confidence,
          status: result.status === 'ok' ? 'pending' : 'auto',
          result: result,
          media_id: media.id,
        })) as never
      )
  }

  return results
}


