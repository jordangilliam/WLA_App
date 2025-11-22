import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/auth.config'
import { runIdentificationPipeline } from '@/lib/ai'
import { supabaseAdmin } from '@/lib/db/client'

const identifySchema = z.object({
  mediaType: z.enum(['image', 'audio']).default('image'),
  imageData: z.string().optional(),
  audioData: z.string().optional(),
  targets: z.array(z.enum(['species', 'bird', 'macro'])).default(['species']),
  metadata: z
    .object({
      observationId: z.string().uuid().optional(),
      fieldSiteId: z.string().uuid().optional(),
      mediaId: z.string().uuid().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional(),
})

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  const userId = (session?.user as { id?: string } | undefined)?.id

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = identifySchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const payload = parsed.data

  if (payload.mediaType === 'image' && !payload.imageData) {
    return NextResponse.json(
      { error: 'imageData is required for image identifications' },
      { status: 400 }
    )
  }

  if (payload.mediaType === 'audio' && !payload.audioData) {
    return NextResponse.json(
      { error: 'audioData is required for audio identifications' },
      { status: 400 }
    )
  }

  const results = await runIdentificationPipeline({
    mediaType: payload.mediaType,
    imageData: payload.imageData,
    audioData: payload.audioData,
    targets: payload.targets,
    latitude: payload.metadata?.latitude,
    longitude: payload.metadata?.longitude,
  })

  if (supabaseAdmin) {
    const records = results.map((result) => ({
      user_id: userId,
      observation_id: payload.metadata?.observationId ?? null,
      field_site_id: payload.metadata?.fieldSiteId ?? null,
      provider: result.provider,
      mode: result.mode,
      label: result.label,
      confidence: result.confidence,
      status: result.status === 'ok' ? 'pending' : 'auto',
      result: result,
      media_id: payload.metadata?.mediaId ?? null,
    }))

    try {
      await supabaseAdmin.from('ai_identifications').insert(records as never)
    } catch (error) {
      console.error('Failed to persist AI identification:', error)
    }
  }

  return NextResponse.json({ results })
}

