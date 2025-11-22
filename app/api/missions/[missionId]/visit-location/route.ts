import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/auth.config'
import { supabaseAdmin } from '@/lib/db/client'

/**
 * POST /api/missions/[missionId]/visit-location
 * Record a visit to a mission location (check-in, photo, observation, etc.)
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
  const { locationId, action, latitude, longitude, mediaId, notes } = body

  if (!locationId || !action) {
    return NextResponse.json(
      { error: 'locationId and action are required' },
      { status: 400 }
    )
  }

  try {
    // Get location details
    const { data: location, error: locationError } = await supabaseAdmin
      .from('mission_locations')
      .select('*')
      .eq('id', locationId)
      .eq('mission_id', missionId)
      .single()

    if (locationError || !location) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      )
    }

    // Verify geofence if location provided
    if (latitude && longitude) {
      const locLat = location.custom_latitude || (location.field_sites as any)?.latitude
      const locLon = location.custom_longitude || (location.field_sites as any)?.longitude

      if (locLat && locLon) {
        const distance = calculateDistance(latitude, longitude, locLat, locLon)
        const radius = location.geofence_radius_meters || 50

        if (distance > radius) {
          return NextResponse.json(
            {
              error: 'You must be at the location',
              distance: Math.round(distance),
              requiredRadius: radius,
            },
            { status: 403 }
          )
        }
      }
    }

    // Record visit
    const { data: visit, error: visitError } = await supabaseAdmin
      .from('mission_location_visits')
      .insert({
        mission_location_id: locationId,
        user_id: userId,
        action_taken: action,
        evidence_media_id: mediaId,
        notes,
        metadata: {
          latitude,
          longitude,
          visitedAt: new Date().toISOString(),
        },
      } as never)
      .select()
      .single()

    if (visitError) {
      console.error('Failed to record visit:', visitError)
      return NextResponse.json(
        { error: 'Failed to record visit' },
        { status: 500 }
      )
    }

    // Return location details including clue
    return NextResponse.json({
      success: true,
      visit,
      location: {
        id: location.id,
        clueText: location.clue_text,
        clueImageUrl: location.clue_image_url,
        arMarkerUrl: location.ar_marker_url,
        nextStage: location.stage_id,
      },
    })
  } catch (error) {
    console.error('Location visit error:', error)
    return NextResponse.json(
      { error: 'Failed to record location visit' },
      { status: 500 }
    )
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000
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


