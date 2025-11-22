import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/auth.config'
import { supabaseAdmin } from '@/lib/db/client'
import { generatePollinatorPlan } from '@/lib/pollinators/recommendations'

const planSchema = z.object({
  locationType: z.string().min(3),
  region: z.string().min(2).optional(),
  sunExposure: z.enum(['full', 'partial', 'shade']),
  soilMoisture: z.enum(['dry', 'medium', 'wet']),
  availableArea: z.number().int().min(5).max(5000).optional(),
  maintenanceLevel: z.enum(['low', 'medium', 'high']),
  bloomFocus: z.enum(['spring', 'summer', 'fall', 'extended']).optional(),
})

export async function GET(request: NextRequest) {
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

  const { searchParams } = new URL(request.url)
  const limit = Math.max(1, Math.min(Number(searchParams.get('limit') ?? '8'), 25))

  const { data, error } = await supabaseAdmin
    .from('pollinator_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Failed to load pollinator plans', error)
    return NextResponse.json({ error: 'Unable to load plans' }, { status: 500 })
  }

  return NextResponse.json({ success: true, plans: data ?? [] })
}

export async function POST(request: NextRequest) {
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

  let payload: z.infer<typeof planSchema>
  try {
    payload = planSchema.parse(await request.json())
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.flatten() },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }

  const plan = generatePollinatorPlan({
    locationType: payload.locationType,
    region: payload.region ?? 'Mid-Atlantic',
    sunExposure: payload.sunExposure,
    soilMoisture: payload.soilMoisture,
    availableArea: payload.availableArea ?? 100,
    maintenanceLevel: payload.maintenanceLevel,
    bloomFocus: payload.bloomFocus ?? 'extended',
  })

  const { data, error } = await supabaseAdmin
    .from('pollinator_plans')
    .insert({
      user_id: userId,
      location_type: payload.locationType,
      region: payload.region ?? null,
      sun_exposure: payload.sunExposure,
      soil_moisture: payload.soilMoisture,
      available_area_sqft: payload.availableArea ?? null,
      maintenance_level: payload.maintenanceLevel,
      bloom_focus: payload.bloomFocus ?? null,
      recommendations: plan as never,
    } as never)
    .select()
    .single()

  if (error || !data) {
    console.error('Failed to save pollinator plan', error)
    return NextResponse.json({ error: 'Unable to save plan' }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    plan: data,
  })
}



