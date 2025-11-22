import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/client'

/**
 * GET /api/story-missions/[missionId]/locations
 * Fetch location checkpoints for a mission
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { missionId: string } }
) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database not available' }, { status: 500 })
  }

  const { missionId } = params

  try {
    // Fetch mission locations with field site details
    const { data: missionLocations, error } = await supabaseAdmin
      .from('mission_locations')
      .select(`
        *,
        field_sites (
          id,
          name,
          latitude,
          longitude,
          address,
          city,
          state,
          site_type,
          description
        )
      `)
      .eq('mission_id', missionId)
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Failed to fetch mission locations:', error)
      return NextResponse.json(
        { error: 'Unable to fetch locations' },
        { status: 500 }
      )
    }

    // Transform to include location details
    const locations = (missionLocations || []).map((loc: any) => {
      const fieldSite = loc.field_sites
      
      return {
        id: loc.id,
        missionId: loc.mission_id,
        stageId: loc.stage_id,
        name: fieldSite?.name || loc.custom_name,
        latitude: fieldSite?.latitude || loc.custom_latitude,
        longitude: fieldSite?.longitude || loc.custom_longitude,
        address: fieldSite?.address || loc.custom_address,
        locationType: loc.location_type,
        requiredAction: loc.required_action,
        geofenceRadius: loc.geofence_radius_meters,
        qrCodeData: loc.qr_code_data,
        clueText: loc.clue_text,
        clueImageUrl: loc.clue_image_url,
        arMarkerUrl: loc.ar_marker_url,
        orderIndex: loc.order_index,
        metadata: loc.metadata || {},
      }
    })

    return NextResponse.json({ success: true, locations })
  } catch (error) {
    console.error('Failed to fetch mission locations:', error)
    return NextResponse.json(
      { error: 'Unable to fetch locations' },
      { status: 500 }
    )
  }
}

