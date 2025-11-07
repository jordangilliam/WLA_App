import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get URL parameters for optional filtering
    const url = new URL(req.url)
    const lat = url.searchParams.get('lat')
    const lng = url.searchParams.get('lng')
    const radius = parseInt(url.searchParams.get('radius') || '10000', 10) // Default 10km

    const now = new Date().toISOString()

    // Get all active events
    let query = supabaseClient
      .from('spawn_events')
      .select('*, field_sites(*)')
      .lte('start_time', now)
      .gte('end_time', now)
      .eq('active', true)

    const { data: events, error: eventsError } = await query

    if (eventsError) {
      console.error('Error fetching events:', eventsError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch events' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // If location provided, filter by proximity
    let nearbyEvents = events || []
    if (lat && lng) {
      const userLat = parseFloat(lat)
      const userLng = parseFloat(lng)

      nearbyEvents = (events || []).filter((event) => {
        if (!event.field_sites) return false

        const distance = calculateDistance(
          userLat,
          userLng,
          event.field_sites.lat,
          event.field_sites.lng
        )

        return distance <= radius
      })
    }

    // Get event participation stats
    const eventStats = await Promise.all(
      nearbyEvents.map(async (event) => {
        // Count active spawns for this event
        const { count: spawnCount } = await supabaseClient
          .from('active_spawns')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', event.id)

        // Count participants (users who caught species from this event)
        const { count: participantCount } = await supabaseClient
          .from('encounters')
          .select('user_id', { count: 'exact', head: true })
          .eq('outcome', 'caught')
          .gte('started_at', event.start_time)
          .lte('started_at', event.end_time)

        return {
          ...event,
          stats: {
            active_spawns: spawnCount || 0,
            participants: participantCount || 0,
          },
        }
      })
    )

    // Check if user has participated in any events
    const { data: userParticipation } = await supabaseClient
      .from('encounters')
      .select('species_id')
      .eq('user_id', user.id)
      .eq('outcome', 'caught')
      .in('started_at', eventStats.map((e) => e.start_time))

    const participatedEventIds = new Set(
      (userParticipation || []).map((p) => p.species_id)
    )

    return new Response(
      JSON.stringify({
        events: eventStats.map((event) => ({
          ...event,
          user_participated: participatedEventIds.has(event.id),
        })),
        total_count: eventStats.length,
        timestamp: now,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in events-active:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

