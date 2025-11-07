import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NearbyRequest {
  lat: number
  lng: number
  radius?: number // meters, default 300
}

serve(async (req) => {
  // Handle CORS
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

    // Get user from JWT
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

    const { lat, lng, radius = 300 }: NearbyRequest = await req.json()

    if (!lat || !lng) {
      return new Response(
        JSON.stringify({ error: 'Missing lat/lng parameters' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get nearby field sites using RPC function
    const { data: sites, error: sitesError } = await supabaseClient.rpc(
      'nearby_field_sites',
      {
        user_lat: lat,
        user_lng: lng,
        radius_meters: radius,
      }
    )

    if (sitesError) {
      console.error('Error fetching field sites:', sitesError)
    }

    // Get nearby active spawns using RPC function
    const { data: spawns, error: spawnsError } = await supabaseClient.rpc(
      'nearby_spawns',
      {
        user_lat: lat,
        user_lng: lng,
        radius_meters: radius,
      }
    )

    if (spawnsError) {
      console.error('Error fetching spawns:', spawnsError)
    }

    // Get active events
    const now = new Date().toISOString()
    const { data: events, error: eventsError } = await supabaseClient
      .from('spawn_events')
      .select('*')
      .lte('start_time', now)
      .gte('end_time', now)
      .eq('active', true)

    if (eventsError) {
      console.error('Error fetching events:', eventsError)
    }

    // Update user's last known location
    await supabaseClient
      .from('users')
      .update({
        last_lat: lat,
        last_lng: lng,
        last_seen: new Date().toISOString(),
      })
      .eq('id', user.id)

    return new Response(
      JSON.stringify({
        field_sites: sites || [],
        spawns: spawns || [],
        active_events: events || [],
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in world-nearby:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

