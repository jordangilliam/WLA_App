import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EncounterStartRequest {
  spawn_id: string
  lat: number
  lng: number
}

// Haversine distance calculation
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3 // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // Distance in meters
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

    const { spawn_id, lat, lng }: EncounterStartRequest = await req.json()

    // Get the spawn
    const { data: spawn, error: spawnError } = await supabaseClient
      .from('active_spawns')
      .select('*, species(*)')
      .eq('id', spawn_id)
      .gte('expires_at', new Date().toISOString())
      .single()

    if (spawnError || !spawn) {
      return new Response(
        JSON.stringify({ error: 'Spawn not found or expired' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Verify user is within range (50m for encounters)
    const distance = calculateDistance(lat, lng, spawn.lat, spawn.lng)
    if (distance > 50) {
      return new Response(
        JSON.stringify({ error: 'Too far from spawn', distance }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Check for impossible movement (anti-cheat)
    const { data: userData } = await supabaseClient
      .from('users')
      .select('last_lat, last_lng, last_seen')
      .eq('id', user.id)
      .single()

    if (userData?.last_lat && userData?.last_lng && userData?.last_seen) {
      const lastSeenTime = new Date(userData.last_seen).getTime()
      const now = new Date().getTime()
      const timeDiffSeconds = (now - lastSeenTime) / 1000

      if (timeDiffSeconds > 0 && timeDiffSeconds < 300) {
        // Within 5 minutes
        const distanceFromLast = calculateDistance(
          lat,
          lng,
          userData.last_lat,
          userData.last_lng
        )
        const maxPossibleDistance = timeDiffSeconds * 30 // 30 m/s = ~108 km/h
        
        if (distanceFromLast > maxPossibleDistance) {
          // Log suspicious activity
          await supabaseClient.from('audit_log').insert({
            user_id: user.id,
            event_type: 'impossible_movement',
            severity: 'high',
            details: {
              distance: distanceFromLast,
              time_diff: timeDiffSeconds,
              max_possible: maxPossibleDistance,
            },
          })

          return new Response(
            JSON.stringify({ error: 'Movement validation failed' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        }
      }
    }

    // Calculate base catch rate based on rarity
    let baseCatchRate = 0.7 // Common
    switch (spawn.species.rarity) {
      case 'uncommon':
        baseCatchRate = 0.5
        break
      case 'rare':
        baseCatchRate = 0.3
        break
      case 'epic':
        baseCatchRate = 0.15
        break
      case 'legendary':
        baseCatchRate = 0.05
        break
    }

    // Create encounter record
    const { data: encounter, error: encounterError } = await supabaseClient
      .from('encounters')
      .insert({
        user_id: user.id,
        spawn_id: spawn_id,
        species_id: spawn.species_id,
        lat: lat,
        lng: lng,
        base_catch_rate: baseCatchRate,
        started_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (encounterError) {
      console.error('Error creating encounter:', encounterError)
      return new Response(JSON.stringify({ error: 'Failed to start encounter' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Log encounter start
    await supabaseClient.from('audit_log').insert({
      user_id: user.id,
      event_type: 'encounter_started',
      severity: 'info',
      details: {
        encounter_id: encounter.id,
        species_id: spawn.species_id,
        spawn_id: spawn_id,
      },
    })

    return new Response(
      JSON.stringify({
        encounter_id: encounter.id,
        species: spawn.species,
        base_catch_rate: baseCatchRate,
        started_at: encounter.started_at,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in encounter-start:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

