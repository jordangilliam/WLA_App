/**
 * Supabase Edge Function: Sync PFBC Stocking Data
 * 
 * Fetches trout stocking schedules from PA Fish & Boat Commission API
 * and updates the database with current information.
 * 
 * Should be triggered:
 * - Weekly via cron job
 * - Manually when PFBC publishes new schedules
 * - On-demand via API call
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PFBCStockingEvent {
  water_body: string;
  county: string;
  stock_date: string;
  species: string;
  number: number;
  size: string;
  location_details?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    console.log('🎣 Starting PFBC stocking data sync...');

    // Fetch stocking data from PFBC
    // Note: PFBC API endpoint - adjust based on actual API structure
    // const pfbcResponse = await fetch(
    //   'https://apps.fishandboat.pa.gov/api/StockingSchedule?county=Allegheny',
    //   {
    //     headers: {
    //       'Accept': 'application/json',
    //     },
    //   }
    // );

    // For now, use mock data structure
    // In production, uncomment above and remove mock data
    const mockPFBCData: PFBCStockingEvent[] = [
      {
        water_body: 'Deer Creek',
        county: 'Allegheny',
        stock_date: '2025-03-15',
        species: 'Rainbow Trout',
        number: 750,
        size: 'Adult',
        location_details: 'Harmarville section',
      },
      {
        water_body: 'North Park Lake',
        county: 'Allegheny',
        stock_date: '2025-03-10',
        species: 'Rainbow Trout',
        number: 2000,
        size: 'Adult',
      },
      // Add more as received from API
    ];

    // const pfbcData: PFBCStockingEvent[] = await pfbcResponse.json();
    const pfbcData = mockPFBCData;

    console.log(`📊 Received ${pfbcData.length} stocking events from PFBC`);

    // Fetch all field sites to match water bodies
    const { data: fieldSites, error: sitesError } = await supabaseClient
      .from('field_sites')
      .select('id, name, site_type');

    if (sitesError) {
      throw new Error(`Failed to fetch field sites: ${sitesError.message}`);
    }

    console.log(`🗺️  Loaded ${fieldSites.length} field sites for matching`);

    // Process each stocking event
    let inserted = 0;
    let updated = 0;
    let skipped = 0;

    for (const event of pfbcData) {
      // Match water body name to field site
      const matchedSite = fieldSites.find(
        (site) =>
          site.name.toLowerCase().includes(event.water_body.toLowerCase()) ||
          event.water_body.toLowerCase().includes(site.name.toLowerCase())
      );

      if (!matchedSite) {
        console.log(`⚠️  Could not match water body: ${event.water_body}`);
        skipped++;
        continue;
      }

      // Convert species name to standard format
      const speciesMap: Record<string, string> = {
        'Rainbow': 'Rainbow Trout',
        'Rainbow Trout': 'Rainbow Trout',
        'Brown': 'Brown Trout',
        'Brown Trout': 'Brown Trout',
        'Brook': 'Brook Trout',
        'Brook Trout': 'Brook Trout',
        'Golden': 'Golden Rainbow Trout',
        'Golden Rainbow': 'Golden Rainbow Trout',
      };

      const species = speciesMap[event.species] || event.species;

      // Convert size to size_class
      const sizeClassMap: Record<string, string> = {
        'Adult': 'Adult',
        'Trophy': 'Trophy',
        'Sub-adult': 'Sub-adult',
        'Fingerling': 'Fingerling',
      };

      const sizeClass = sizeClassMap[event.size] || 'Adult';

      // Check if this stocking event already exists
      const { data: existing, error: checkError } = await supabaseClient
        .from('stocking_schedules')
        .select('id, actual_stocked')
        .eq('field_site_id', matchedSite.id)
        .eq('stocking_date', event.stock_date)
        .eq('species', species)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error(`Error checking existing stocking: ${checkError.message}`);
        continue;
      }

      const stockingDate = new Date(event.stock_date);
      const today = new Date();
      const isHistorical = stockingDate < today;

      if (existing) {
        // Update existing record
        const { error: updateError } = await supabaseClient
          .from('stocking_schedules')
          .update({
            quantity: event.number,
            size_class: sizeClass,
            specific_location: event.location_details,
            actual_stocked: isHistorical,
            last_synced_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        if (updateError) {
          console.error(`Error updating stocking: ${updateError.message}`);
        } else {
          updated++;
          console.log(`✅ Updated: ${event.water_body} - ${event.stock_date} - ${species}`);
        }
      } else {
        // Insert new record
        const { error: insertError } = await supabaseClient
          .from('stocking_schedules')
          .insert({
            field_site_id: matchedSite.id,
            stocking_date: event.stock_date,
            species: species,
            quantity: event.number,
            average_length_inches: 10.5, // Default, update if API provides
            size_class: sizeClass,
            specific_location: event.location_details,
            actual_stocked: isHistorical,
            public_notice: true,
            pfbc_report_id: `PFBC-${event.county}-${event.stock_date}`,
            educational_notes: isHistorical
              ? 'Historical stocking event imported from PFBC data.'
              : 'Upcoming stocking event. Great opportunity for field trip!',
            last_synced_at: new Date().toISOString(),
          });

        if (insertError) {
          console.error(`Error inserting stocking: ${insertError.message}`);
        } else {
          inserted++;
          console.log(`✨ Inserted: ${event.water_body} - ${event.stock_date} - ${species}`);
        }
      }
    }

    // Mark past stockings as completed
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { error: markCompleteError } = await supabaseClient
      .from('stocking_schedules')
      .update({ actual_stocked: true })
      .lt('stocking_date', new Date().toISOString())
      .eq('actual_stocked', false);

    if (markCompleteError) {
      console.error(`Error marking past stockings: ${markCompleteError.message}`);
    }

    const summary = {
      success: true,
      message: 'PFBC stocking data sync completed',
      stats: {
        processed: pfbcData.length,
        inserted,
        updated,
        skipped,
        timestamp: new Date().toISOString(),
      },
    };

    console.log('🎉 Sync complete!', summary);

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('❌ Error syncing PFBC data:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

/* 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Deploy this Edge Function:
 *    npx supabase functions deploy sync-pfbc-stocking
 * 
 * 2. Set up weekly cron job in Supabase Dashboard:
 *    - Go to Database > Cron Jobs
 *    - Create new job:
 *      Name: "Sync PFBC Stocking Data"
 *      Schedule: "0 2 * * 1" (Every Monday at 2 AM)
 *      SQL: SELECT net.http_post(
 *             url:='https://[YOUR-PROJECT-REF].supabase.co/functions/v1/sync-pfbc-stocking',
 *             headers:='{"Authorization": "Bearer [SERVICE-ROLE-KEY]"}'::jsonb
 *           );
 * 
 * 3. Manual trigger (for testing):
 *    curl -X POST \
 *      https://[YOUR-PROJECT-REF].supabase.co/functions/v1/sync-pfbc-stocking \
 *      -H "Authorization: Bearer [ANON-KEY]"
 * 
 * 4. PFBC API Integration:
 *    - Contact PA Fish & Boat Commission for API access
 *    - Update fetch URL with actual API endpoint
 *    - Add any required API keys to Supabase secrets
 *    - Test with real data before enabling cron job
 * 
 * 5. Monitor logs in Supabase Dashboard > Edge Functions > Logs
 */

