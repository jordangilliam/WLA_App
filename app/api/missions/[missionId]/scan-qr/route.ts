import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/auth.config'
import { supabaseAdmin } from '@/lib/db/client'

/**
 * POST /api/missions/[missionId]/scan-qr
 * Handle QR code scanning for mission locations
 */
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
    return NextResponse.json({ error: 'Database not available' }, { status: 500 })
  }

  const { missionId } = params
  const body = await request.json()
  const { qrCodeData, locationId, latitude, longitude } = body

  if (!qrCodeData) {
    return NextResponse.json({ error: 'QR code data required' }, { status: 400 })
  }

  try {
    // Find mission location with matching QR code
    const { data: locationData, error: locationError } = await supabaseAdmin
      .from('mission_locations')
      .select('*')
      .eq('mission_id', missionId)
      .eq('qr_code_data', qrCodeData)
      .single()

    if (locationError || !locationData) {
      return NextResponse.json(
        { error: 'Invalid QR code or location not found' },
        { status: 404 }
      )
    }

    const location = locationData as any

    // Verify user is within geofence (if location provided)
    if (latitude && longitude && location.latitude && location.longitude) {
      const distance = calculateDistance(
        latitude,
        longitude,
        location.latitude || location.custom_latitude,
        location.longitude || location.custom_longitude
      )

      if (distance > (location.geofence_radius_meters || 50)) {
        return NextResponse.json(
          { error: 'You must be at the location to scan this QR code', distance },
          { status: 403 }
        )
      }
    }

    // Record visit
    const { data: visit, error: visitError } = await supabaseAdmin
      .from('mission_location_visits')
      .insert({
        mission_location_id: location.id,
        user_id: userId,
        action_taken: 'qr_scan',
        metadata: {
          qrCode: qrCodeData,
          scannedAt: new Date().toISOString(),
        },
      } as never)
      .select()
      .single()

    if (visitError) {
      console.error('Failed to record visit:', visitError)
    }

    return NextResponse.json({
      success: true,
      location: {
        id: location.id,
        clueText: location.clue_text,
        clueImageUrl: location.clue_image_url,
        nextStage: location.stage_id,
      },
      visit,
    })
  } catch (error) {
    console.error('QR scan error:', error)
    return NextResponse.json(
      { error: 'Failed to process QR scan' },
      { status: 500 }
    )
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000 // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}


