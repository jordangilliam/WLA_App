/**
 * Expand Regional Waterways
 * Focus on Southwest PA, Central PA, Lehigh Valley, and Chester County
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { ALL_REGIONAL_WATERWAYS } from '../data/pa-waterways-regional-focus';
import { PA_WATERWAYS_COMPREHENSIVE } from '../data/pa-waterways-comprehensive';

const OUTPUT_DIR = path.join(process.cwd(), 'data', 'scraped', 'regional-waterways');

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
  seasonal: any;
  hatches: any[];
  accessPoints: any[];
}

/**
 * Generate comprehensive regional waterways list
 */
function generateRegionalWaterways(): ExpandedWaterway[] {
  const waterways: ExpandedWaterway[] = [];

  // Start with existing comprehensive waterways
  PA_WATERWAYS_COMPREHENSIVE.forEach((w) => {
    // Filter to focus regions
    if (['Central', 'Pittsburgh', 'Lehigh Valley', 'Philadelphia'].includes(w.region)) {
      waterways.push({
        id: w.id,
        name: w.name,
        type: w.type,
        county: w.county,
        region: w.region,
        coordinates: { lat: w.latitude, lng: w.longitude },
        size: w.size,
        description: w.description,
        species: w.species,
        seasonal: w.seasonalData,
        hatches: w.hatches,
        accessPoints: w.accessPoints,
      });
    }
  });

  // Add regional waterways
  ALL_REGIONAL_WATERWAYS.forEach((w) => {
    if (w.id && w.name && w.latitude && w.longitude) {
      waterways.push({
        id: w.id,
        name: w.name,
        type: w.type || 'Creek',
        county: w.county || 'Unknown',
        region: w.region || 'Central',
        coordinates: { lat: w.latitude, lng: w.longitude },
        size: w.size,
        description: w.description || '',
        species: w.species || [],
        seasonal: w.seasonalData || {},
        hatches: w.hatches || [],
        accessPoints: [],
      });
    }
  });

  return waterways;
}

/**
 * Generate SQL inserts
 */
function generateSQLInserts(waterways: ExpandedWaterway[]): string {
  const inserts: string[] = [];

  for (const waterway of waterways) {
    const lat = waterway.coordinates.lat;
    const lng = waterway.coordinates.lng;
    const speciesArray = `ARRAY[${waterway.species.map(s => `'${s.replace(/'/g, "''")}'`).join(', ')}]`;
    const habitatTypes = waterway.type === 'Lake' || waterway.type === 'Reservoir' || waterway.type === 'Pond'
      ? `ARRAY['Lake']`
      : `ARRAY['Stream']`;

    inserts.push(`
INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  '${waterway.name.replace(/'/g, "''")}',
  '${waterway.description.replace(/'/g, "''")}',
  ${lat},
  ${lng},
  ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
  'water_body',
  '${waterway.county.replace(/'/g, "''")}',
  'PA',
  '${(waterway.seasonal.springNotes || '').replace(/'/g, "''")}',
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
  console.log('🚀 Expanding regional waterways...\n');
  console.log('Focus regions: Southwest PA, Central PA, Lehigh Valley, Chester County\n');

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const waterways = generateRegionalWaterways();
  console.log(`✅ Generated ${waterways.length} waterways`);

  // Group by region
  const byRegion: Record<string, number> = {};
  waterways.forEach(w => {
    byRegion[w.region] = (byRegion[w.region] || 0) + 1;
  });

  console.log('\n📊 By Region:');
  Object.entries(byRegion).forEach(([region, count]) => {
    console.log(`   ${region}: ${count} waterways`);
  });

  // Save data
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'regional-waterways.json'),
    JSON.stringify(waterways, null, 2)
  );

  // Generate SQL
  const sql = generateSQLInserts(waterways);
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'regional-waterways-insert.sql'),
    sql
  );

  // Summary
  const summary = {
    generatedAt: new Date().toISOString(),
    totalWaterways: waterways.length,
    byType: {
      Lake: waterways.filter(w => w.type === 'Lake').length,
      Stream: waterways.filter(w => w.type === 'Stream').length,
      Creek: waterways.filter(w => w.type === 'Creek').length,
      River: waterways.filter(w => w.type === 'River').length,
      Reservoir: waterways.filter(w => w.type === 'Reservoir').length,
      Pond: waterways.filter(w => w.type === 'Pond').length,
    },
    byRegion,
    focusRegions: {
      'Southwest PA (Pittsburgh)': byRegion['Pittsburgh'] || 0,
      'Central PA': byRegion['Central'] || 0,
      'Lehigh Valley': byRegion['Lehigh Valley'] || 0,
      'Chester County (Philadelphia)': byRegion['Philadelphia'] || 0,
    },
    withHatches: waterways.filter(w => w.hatches && w.hatches.length > 0).length,
    withSeasonalData: waterways.filter(w => w.seasonal && w.seasonal.bestSeasons).length,
  };

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'regional-expansion-summary.json'),
    JSON.stringify(summary, null, 2)
  );

  console.log('\n✅ Regional expansion complete!');
  console.log(`📊 Summary:`);
  console.log(`   Total Waterways: ${summary.totalWaterways}`);
  console.log(`   Southwest PA: ${summary.focusRegions['Southwest PA (Pittsburgh)']}`);
  console.log(`   Central PA: ${summary.focusRegions['Central PA']}`);
  console.log(`   Lehigh Valley: ${summary.focusRegions['Lehigh Valley']}`);
  console.log(`   Chester County: ${summary.focusRegions['Chester County (Philadelphia)']}`);
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

export { generateRegionalWaterways };



