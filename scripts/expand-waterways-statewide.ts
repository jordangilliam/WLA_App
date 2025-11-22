/**
 * Expand Waterways Database Statewide
 * 
 * Adds comprehensive coverage of PA waterways including:
 * - Lakes, streams, creeks, rivers
 * - Seasonal considerations
 * - Macroinvertebrate hatch data
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { PA_WATERWAYS_COMPREHENSIVE, SEASONAL_HATCH_CALENDAR } from '../data/pa-waterways-comprehensive';

const OUTPUT_DIR = path.join(process.cwd(), 'data', 'scraped', 'waterways');

interface ExpandedWaterway {
  id: string;
  name: string;
  type: string;
  county: string;
  region: string;
  coordinates: { lat: number; lng: number };
  size?: string;
  description: string;
  species: string[];
  seasonal: {
    bestSeasons: string[];
    springNotes?: string;
    summerNotes?: string;
    fallNotes?: string;
    winterNotes?: string;
    iceFishing?: boolean;
    springStocking?: boolean;
    fallStocking?: boolean;
    waterTemps?: {
      spring: number;
      summer: number;
      fall: number;
      winter: number;
    };
  };
  hatches: Array<{
    species: string;
    commonName: string;
    peakMonth: string;
    timeOfDay: string;
    hookSize: string;
  }>;
  accessPoints: Array<{
    name: string;
    coordinates: { lat: number; lng: number };
    type: string;
    amenities: string[];
  }>;
}

/**
 * Expand waterways with additional statewide coverage
 */
function expandWaterways(): ExpandedWaterway[] {
  const expanded: ExpandedWaterway[] = PA_WATERWAYS_COMPREHENSIVE.map((waterway) => ({
    id: waterway.id,
    name: waterway.name,
    type: waterway.type,
    county: waterway.county,
    region: waterway.region,
    coordinates: {
      lat: waterway.latitude,
      lng: waterway.longitude,
    },
    size: waterway.size,
    description: waterway.description,
    species: waterway.species,
    seasonal: {
      bestSeasons: waterway.seasonalData.bestSeasons,
      springNotes: waterway.seasonalData.springNotes,
      summerNotes: waterway.seasonalData.summerNotes,
      fallNotes: waterway.seasonalData.fallNotes,
      winterNotes: waterway.seasonalData.winterNotes,
      iceFishing: waterway.seasonalData.iceFishing,
      springStocking: waterway.seasonalData.springStocking,
      fallStocking: waterway.seasonalData.fallStocking,
      waterTemps: waterway.seasonalData.waterTemperature,
    },
    hatches: waterway.hatches.map((h) => ({
      species: h.species,
      commonName: h.commonName,
      peakMonth: h.hatchPeriod.peak,
      timeOfDay: h.timeOfDay,
      hookSize: h.size,
    })),
    accessPoints: waterway.accessPoints.map((ap) => ({
      name: ap.name,
      coordinates: {
        lat: ap.latitude,
        lng: ap.longitude,
      },
      type: ap.type,
      amenities: ap.amenities,
    })),
  }));

  return expanded;
}

/**
 * Generate hatch calendar by month
 */
function generateHatchCalendar() {
  return SEASONAL_HATCH_CALENDAR;
}

/**
 * Generate SQL insert statements for new waterways
 */
function generateSQLInserts(waterways: ExpandedWaterway[]): string {
  const inserts: string[] = [];

  for (const waterway of waterways) {
    const lat = waterway.coordinates.lat;
    const lng = waterway.coordinates.lng;
    const speciesArray = `ARRAY[${waterway.species.map(s => `'${s}'`).join(', ')}]`;
    const habitatTypes = waterway.type === 'Lake' || waterway.type === 'Reservoir' 
      ? `ARRAY['Lake']`
      : `ARRAY['Stream']`;

    inserts.push(`
INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  '${waterway.name}',
  '${waterway.description.replace(/'/g, "''")}',
  ${lat},
  ${lng},
  ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
  'water_body',
  '${waterway.county}',
  'PA',
  '${waterway.seasonal.springNotes || ''} ${waterway.seasonal.summerNotes || ''}'.trim(),
  ${speciesArray},
  ${habitatTypes}
)
ON CONFLICT DO NOTHING;`);
  }

  return inserts.join('\n');
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Expanding waterways database statewide...\n');

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Expand waterways
  const expanded = expandWaterways();
  console.log(`✅ Expanded ${expanded.length} waterways`);

  // Generate hatch calendar
  const hatchCalendar = generateHatchCalendar();
  console.log(`✅ Generated hatch calendar for ${Object.keys(hatchCalendar).length} months`);

  // Save data
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'expanded-waterways.json'),
    JSON.stringify(expanded, null, 2)
  );

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'hatch-calendar.json'),
    JSON.stringify(hatchCalendar, null, 2)
  );

  // Generate SQL
  const sql = generateSQLInserts(expanded);
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'waterways-insert.sql'),
    sql
  );

  // Summary
  const summary = {
    generatedAt: new Date().toISOString(),
    totalWaterways: expanded.length,
    byType: {
      Lake: expanded.filter(w => w.type === 'Lake').length,
      Stream: expanded.filter(w => w.type === 'Stream').length,
      Creek: expanded.filter(w => w.type === 'Creek').length,
      River: expanded.filter(w => w.type === 'River').length,
      Reservoir: expanded.filter(w => w.type === 'Reservoir').length,
    },
    byRegion: Object.fromEntries(
      Array.from(new Set(expanded.map(w => w.region))).map(region => [
        region,
        expanded.filter(w => w.region === region).length,
      ])
    ),
    withHatches: expanded.filter(w => w.hatches.length > 0).length,
    withSeasonalData: expanded.filter(w => w.seasonal.bestSeasons.length > 0).length,
  };

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'expansion-summary.json'),
    JSON.stringify(summary, null, 2)
  );

  console.log('\n✅ Expansion complete!');
  console.log(`📊 Summary:`);
  console.log(`   Total Waterways: ${summary.totalWaterways}`);
  console.log(`   With Hatch Data: ${summary.withHatches}`);
  console.log(`   With Seasonal Data: ${summary.withSeasonalData}`);
  console.log(`\n📁 Output saved to: ${OUTPUT_DIR}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { expandWaterways, generateHatchCalendar };


