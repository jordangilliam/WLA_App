/**
 * Import Scraped PFBC Data into Supabase
 * 
 * Imports scraped data from JSON files into Supabase database
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error('Missing Supabase credentials in .env.local');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const DATA_DIR = path.join(process.cwd(), 'data', 'scraped', 'consolidated');

interface StockingEvent {
  waterBodyName: string;
  county: string;
  date: string;
  species: string;
  quantity: number;
  size: string;
  latitude?: number;
  longitude?: number;
  locationDetails?: string;
}

interface AccessPoint {
  name: string;
  waterBodyName: string;
  county: string;
  latitude: number;
  longitude: number;
  type: string;
  amenities: string[];
  accessibility: string;
  parking: boolean;
}

interface HabitatInstallation {
  lakeName: string;
  county: string;
  installationType: string;
  installationDate?: string;
  coordinates?: { latitude: number; longitude: number };
  structureType: string;
  description?: string;
  mapUrl?: string;
}

/**
 * Import stocking events
 */
async function importStockingEvents(events: StockingEvent[]): Promise<void> {
  console.log(`📥 Importing ${events.length} stocking events...`);

  for (const event of events) {
    try {
      // Find or create field site for water body
      const { data: site } = await supabase
        .from('field_sites')
        .select('id')
        .eq('name', event.waterBodyName)
        .eq('site_type', 'water_body')
        .single();

      let siteId = site?.id;

      if (!siteId && event.latitude && event.longitude) {
        // Create field site if it doesn't exist
        const { data: newSite, error } = await supabase
          .from('field_sites')
          .insert({
            name: event.waterBodyName,
            description: `Stocked water body in ${event.county} County`,
            latitude: event.latitude,
            longitude: event.longitude,
            location: `POINT(${event.longitude} ${event.latitude})`,
            site_type: 'water_body',
            city: event.county,
            state: 'PA',
            species_commonly_found: [event.species],
          })
          .select('id')
          .single();

        if (error) {
          console.error(`  ❌ Error creating site for ${event.waterBodyName}:`, error);
          continue;
        }

        siteId = newSite?.id;
      }

      if (!siteId) {
        console.warn(`  ⚠️  Skipping ${event.waterBodyName} - no coordinates`);
        continue;
      }

      // Insert stocking schedule
      const { error } = await supabase.from('stocking_schedules').insert({
        field_site_id: siteId,
        species: event.species,
        stocking_date: event.date,
        quantity: event.quantity,
        size_class: event.size,
        location_details: event.locationDetails,
        actual_stocked: true,
      });

      if (error) {
        console.error(`  ❌ Error inserting stocking for ${event.waterBodyName}:`, error);
      }
    } catch (error) {
      console.error(`  ❌ Error processing ${event.waterBodyName}:`, error);
    }
  }

  console.log(`✅ Imported stocking events`);
}

/**
 * Import access points
 */
async function importAccessPoints(points: AccessPoint[]): Promise<void> {
  console.log(`📥 Importing ${points.length} access points...`);

  for (const point of points) {
    try {
      // Find or create field site
      const { data: site } = await supabase
        .from('field_sites')
        .select('id')
        .eq('name', point.waterBodyName)
        .eq('site_type', 'water_body')
        .single();

      if (!site) {
        console.warn(`  ⚠️  Skipping ${point.name} - water body not found`);
        continue;
      }

      // Update water body details with access point info
      const { error } = await supabase
        .from('water_body_details')
        .upsert({
          field_site_id: site.id,
          access_type: point.type === 'Boat Launch' ? ['Boat Launch'] : ['Public', 'Roadside'],
          parking_available: point.parking,
          wheelchair_accessible: point.accessibility === 'Easy',
          difficulty: point.accessibility,
        });

      if (error) {
        console.error(`  ❌ Error updating access point ${point.name}:`, error);
      }
    } catch (error) {
      console.error(`  ❌ Error processing ${point.name}:`, error);
    }
  }

  console.log(`✅ Imported access points`);
}

/**
 * Import habitat installations
 */
async function importHabitatInstallations(installations: HabitatInstallation[]): Promise<void> {
  console.log(`📥 Importing ${installations.length} habitat installations...`);

  for (const installation of installations) {
    try {
      // Find field site
      const { data: site } = await supabase
        .from('field_sites')
        .select('id')
        .eq('name', installation.lakeName)
        .eq('site_type', 'water_body')
        .single();

      if (!site) {
        console.warn(`  ⚠️  Skipping ${installation.lakeName} - lake not found`);
        continue;
      }

      // Update water body details with habitat info
      const { error } = await supabase
        .from('water_body_details')
        .upsert({
          field_site_id: site.id,
          safety_notes: `Habitat installation: ${installation.structureType} (${installation.installationType})`,
        });

      if (error) {
        console.error(`  ❌ Error updating habitat for ${installation.lakeName}:`, error);
      }
    } catch (error) {
      console.error(`  ❌ Error processing ${installation.lakeName}:`, error);
    }
  }

  console.log(`✅ Imported habitat installations`);
}

/**
 * Main import function
 */
async function main() {
  const args = process.argv.slice(2);
  const importType = args[0] || 'all';

  console.log('🚀 Starting PFBC data import...\n');

  try {
    // Load consolidated data
    const dataPath = path.join(DATA_DIR, 'consolidated-data.json');
    const dataContent = await fs.readFile(dataPath, 'utf-8');
    const data = JSON.parse(dataContent);

    if (importType === 'all' || importType === 'stocking') {
      if (data.stockingEvents?.length > 0) {
        await importStockingEvents(data.stockingEvents);
      } else {
        console.log('⚠️  No stocking events to import');
      }
    }

    if (importType === 'all' || importType === 'access-points') {
      if (data.accessPoints?.length > 0) {
        await importAccessPoints(data.accessPoints);
      } else {
        console.log('⚠️  No access points to import');
      }
    }

    if (importType === 'all' || importType === 'habitat') {
      if (data.habitatInstallations?.length > 0) {
        await importHabitatInstallations(data.habitatInstallations);
      } else {
        console.log('⚠️  No habitat installations to import');
      }
    }

    console.log('\n✅ Import complete!');
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      console.error('❌ Consolidated data file not found. Run scraping first:');
      console.error('   npm run scrape:all');
    } else {
      console.error('❌ Import failed:', error);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { importStockingEvents, importAccessPoints, importHabitatInstallations };



