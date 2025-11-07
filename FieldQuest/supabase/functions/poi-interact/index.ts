import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface POIInteractRequest {
  field_site_id: string
  lat: number
  lng: number
}

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

    const { field_site_id, lat, lng }: POIInteractRequest = await req.json()

    // Get field site
    const { data: site, error: siteError } = await supabaseClient
      .from('field_sites')
      .select('*')
      .eq('id', field_site_id)
      .single()

    if (siteError || !site) {
      return new Response(
        JSON.stringify({ error: 'Field site not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Verify user is within geofence
    const distance = calculateDistance(lat, lng, site.lat, site.lng)
    if (distance > site.radius) {
      return new Response(
        JSON.stringify({ error: 'Not within site boundary', distance, required: site.radius }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Check cooldown (default 4 hours per site)
    const cooldownHours = 4
    const cooldownTime = new Date(Date.now() - cooldownHours * 60 * 60 * 1000).toISOString()

    const { data: recentVisit } = await supabaseClient
      .from('audit_log')
      .select('*')
      .eq('user_id', user.id)
      .eq('event_type', 'poi_interacted')
      .gte('created_at', cooldownTime)
      .contains('details', { field_site_id })
      .single()

    if (recentVisit) {
      const nextAvailable = new Date(
        new Date(recentVisit.created_at).getTime() + cooldownHours * 60 * 60 * 1000
      ).toISOString()
      
      return new Response(
        JSON.stringify({
          error: 'Site on cooldown',
          next_available: nextAvailable,
        }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Roll loot based on site type
    const rewards: any[] = []
    let xp_gained = 25 // Base XP for visiting

    // Basic item rewards
    const itemRolls = Math.floor(Math.random() * 3) + 1 // 1-3 items

    for (let i = 0; i < itemRolls; i++) {
      const roll = Math.random()
      let itemType = 'basic_bait'
      let quantity = 1

      if (roll < 0.5) {
        itemType = 'basic_bait'
        quantity = Math.floor(Math.random() * 3) + 1
      } else if (roll < 0.8) {
        itemType = 'field_journal_page'
        quantity = 1
      } else if (roll < 0.95) {
        itemType = 'rare_bait'
        quantity = 1
      } else {
        itemType = 'camera_upgrade'
        quantity = 1
        xp_gained += 50 // Bonus XP for rare item
      }

      // Get or create item
      let { data: item } = await supabaseClient
        .from('items')
        .select('*')
        .eq('name', itemType)
        .single()

      if (!item) {
        // Create default item if not exists
        const { data: newItem } = await supabaseClient
          .from('items')
          .insert({
            name: itemType,
            type: itemType.includes('bait') ? 'bait' : 'tool',
            description: `A ${itemType.replace('_', ' ')}`,
            effect_value: itemType.includes('bait') ? 0.2 : 0,
          })
          .select()
          .single()
        
        item = newItem
      }

      if (item) {
        // Add to user inventory
        const { data: existingInventory } = await supabaseClient
          .from('inventory')
          .select('*')
          .eq('user_id', user.id)
          .eq('item_id', item.id)
          .single()

        if (existingInventory) {
          await supabaseClient
            .from('inventory')
            .update({ quantity: existingInventory.quantity + quantity })
            .eq('id', existingInventory.id)
        } else {
          await supabaseClient
            .from('inventory')
            .insert({
              user_id: user.id,
              item_id: item.id,
              quantity,
            })
        }

        rewards.push({ item: item.name, quantity })
      }
    }

    // Award XP
    await supabaseClient.rpc('increment_user_xp', {
      user_id: user.id,
      xp_amount: xp_gained,
    })

    // Increment visit count
    const { data: userData } = await supabaseClient
      .from('users')
      .select('sites_visited')
      .eq('id', user.id)
      .single()

    await supabaseClient
      .from('users')
      .update({ sites_visited: (userData?.sites_visited || 0) + 1 })
      .eq('id', user.id)

    // Log interaction
    await supabaseClient.from('audit_log').insert({
      user_id: user.id,
      event_type: 'poi_interacted',
      severity: 'info',
      details: {
        field_site_id,
        site_name: site.name,
        rewards,
        xp_gained,
        lat,
        lng,
      },
    })

    return new Response(
      JSON.stringify({
        success: true,
        site: {
          id: site.id,
          name: site.name,
          type: site.type,
        },
        rewards,
        xp_gained,
        next_visit_available: new Date(
          Date.now() + cooldownHours * 60 * 60 * 1000
        ).toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in poi-interact:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

