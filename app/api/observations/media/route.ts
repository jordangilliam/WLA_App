import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/auth.config'
import { supabaseAdmin } from '@/lib/db/client'

const OBSERVATION_MEDIA_BUCKET =
  process.env.OBSERVATION_MEDIA_BUCKET || 'observations'

const createMediaSchema = z.object({
  observationId: z.string().uuid().optional(),
  fieldSiteId: z.string().uuid().optional(),
  mediaType: z.enum(['photo', 'audio', 'video']),
  fileExtension: z.string().regex(/^[a-z0-9]+$/i).default('jpg'),
  capturedAt: z.string().datetime().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  source: z.string().max(64).optional(),
  metadata: z.record(z.any()).optional(),
})

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Supabase admin client not configured' },
      { status: 500 }
    )
  }

  const json = await request.json()
  const parsed = createMediaSchema.safeParse(json)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const payload = parsed.data
  const mediaId = randomUUID()
  const cleanExt = payload.fileExtension.toLowerCase()
  const pathSegments = [userId]

  if (payload.observationId) {
    pathSegments.push(payload.observationId)
  }

  pathSegments.push(mediaId)
  const storagePath = `${pathSegments.join('/')}.${cleanExt}`

  const { data: mediaRow, error } = await supabaseAdmin
    .from('observation_media')
    .insert({
      id: mediaId,
      user_id: userId,
      observation_id: payload.observationId ?? null,
      field_site_id: payload.fieldSiteId ?? null,
      media_type: payload.mediaType,
      storage_path: storagePath,
      captured_at: payload.capturedAt ?? null,
      latitude: payload.latitude ?? null,
      longitude: payload.longitude ?? null,
      source: payload.source ?? 'app',
      metadata: payload.metadata ?? null,
    } as never)
    .select()
    .single()

  if (error || !mediaRow) {
    console.error('Failed to create observation media record', error)
    return NextResponse.json(
      { error: 'Failed to create media record' },
      { status: 500 }
    )
  }

  const { data: signedUpload, error: signedError } = await supabaseAdmin.storage
    .from(OBSERVATION_MEDIA_BUCKET)
    .createSignedUploadUrl(storagePath, 60 * 10)

  if (signedError || !signedUpload) {
    console.error('Failed to create signed upload URL', signedError)

    // Best effort cleanup of dangling DB row
    await supabaseAdmin
      .from('observation_media')
      .delete()
      .eq('id', mediaId)

    return NextResponse.json(
      { error: 'Unable to create upload URL' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    media: mediaRow,
    upload: {
      url: signedUpload.signedUrl,
      token: signedUpload.token,
      path: storagePath,
      bucket: OBSERVATION_MEDIA_BUCKET,
    },
  })
}


