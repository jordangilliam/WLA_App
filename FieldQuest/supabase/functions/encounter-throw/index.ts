import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ThrowAttemptRequest {
  encounter_id: string
  throw_quality: number // 0.0 to 1.0 (from AR/mini-game accuracy)
  item_used?: string // Optional item boost (e.g., "ultra_bait")
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

    const { encounter_id, throw_quality, item_used }: ThrowAttemptRequest = await req.json()

    // Validate throw quality
    if (throw_quality < 0 || throw_quality > 1) {
      return new Response(
        JSON.stringify({ error: 'Invalid throw quality' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get the encounter
    const { data: encounter, error: encounterError } = await supabaseClient
      .from('encounters')
      .select('*, species(*), active_spawns(*)')
      .eq('id', encounter_id)
      .eq('user_id', user.id)
      .is('outcome', null) // Must not be resolved yet
      .single()

    if (encounterError || !encounter) {
      return new Response(
        JSON.stringify({ error: 'Encounter not found or already resolved' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Check encounter timeout (5 minutes)
    const startedAt = new Date(encounter.started_at).getTime()
    const now = new Date().getTime()
    if (now - startedAt > 5 * 60 * 1000) {
      await supabaseClient
        .from('encounters')
        .update({
          outcome: 'fled',
          ended_at: new Date().toISOString(),
        })
        .eq('id', encounter_id)

      return new Response(
        JSON.stringify({ outcome: 'fled', reason: 'Encounter timed out' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Calculate final catch rate
    let catchRate = encounter.base_catch_rate

    // Throw quality bonus (up to 50% improvement)
    catchRate += throw_quality * 0.5

    // Item bonus (if applicable)
    let itemBonus = 0
    if (item_used) {
      // Check user has the item
      const { data: inventoryItem } = await supabaseClient
        .from('inventory')
        .select('*, items(*)')
        .eq('user_id', user.id)
        .eq('item_id', item_used)
        .gt('quantity', 0)
        .single()

      if (inventoryItem) {
        // Apply item multiplier
        if (inventoryItem.items.type === 'bait') {
          itemBonus = inventoryItem.items.effect_value || 0.2
          
          // Consume the item
          await supabaseClient
            .from('inventory')
            .update({ quantity: inventoryItem.quantity - 1 })
            .eq('id', inventoryItem.id)
        }
      }
    }

    catchRate = Math.min(catchRate + itemBonus, 0.99) // Cap at 99%

    // Server-side RNG for catch outcome
    const roll = Math.random()
    const caught = roll < catchRate

    let outcome: 'caught' | 'missed' = caught ? 'caught' : 'missed'
    let xp_gained = 0
    let userSpeciesId: string | null = null

    if (caught) {
      // Add species to user's collection
      const { data: existingSpecies } = await supabaseClient
        .from('user_species')
        .select('*')
        .eq('user_id', user.id)
        .eq('species_id', encounter.species_id)
        .single()

      if (existingSpecies) {
        // Increment count
        await supabaseClient
          .from('user_species')
          .update({
            count: existingSpecies.count + 1,
            last_caught_at: new Date().toISOString(),
          })
          .eq('id', existingSpecies.id)

        userSpeciesId = existingSpecies.id
        xp_gained = 10 // Duplicate catch
      } else {
        // First catch of this species
        const { data: newUserSpecies } = await supabaseClient
          .from('user_species')
          .insert({
            user_id: user.id,
            species_id: encounter.species_id,
            count: 1,
            first_caught_at: new Date().toISOString(),
            last_caught_at: new Date().toISOString(),
          })
          .select()
          .single()

        userSpeciesId = newUserSpecies?.id || null
        xp_gained = 50 // New species bonus
      }

      // Award XP based on rarity
      const rarityXP: Record<string, number> = {
        common: 10,
        uncommon: 25,
        rare: 50,
        epic: 100,
        legendary: 250,
      }
      xp_gained += rarityXP[encounter.species.rarity] || 10

      // Update user XP and species count
      await supabaseClient.rpc('increment_user_xp', {
        user_id: user.id,
        xp_amount: xp_gained,
      })

      // Despawn the spawn
      await supabaseClient
        .from('active_spawns')
        .delete()
        .eq('id', encounter.spawn_id)
    } else {
      // Small XP for attempt
      xp_gained = 5
      await supabaseClient.rpc('increment_user_xp', {
        user_id: user.id,
        xp_amount: xp_gained,
      })
    }

    // Update encounter record
    await supabaseClient
      .from('encounters')
      .update({
        outcome,
        throw_quality,
        item_used,
        catch_rate_final: catchRate,
        xp_gained,
        ended_at: new Date().toISOString(),
      })
      .eq('id', encounter_id)

    // Log result
    await supabaseClient.from('audit_log').insert({
      user_id: user.id,
      event_type: caught ? 'catch_success' : 'catch_failed',
      severity: 'info',
      details: {
        encounter_id,
        species_id: encounter.species_id,
        throw_quality,
        catch_rate: catchRate,
        roll,
        xp_gained,
      },
    })

    return new Response(
      JSON.stringify({
        outcome,
        caught,
        species: encounter.species,
        xp_gained,
        throw_quality,
        catch_rate: catchRate,
        roll,
        user_species_id: userSpeciesId,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in encounter-throw:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

