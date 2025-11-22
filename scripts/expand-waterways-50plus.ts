/**
 * Expand Waterways to 50+ Locations
 * Adds comprehensive statewide coverage
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { PA_WATERWAYS_COMPREHENSIVE } from '../data/pa-waterways-comprehensive';
import { PA_WATERWAYS_EXPANDED } from '../data/pa-waterways-expanded';

const OUTPUT_DIR = path.join(process.cwd(), 'data', 'scraped', 'waterways-expanded');

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
 * Generate comprehensive waterways list (50+)
 */
function generate50PlusWaterways(): ExpandedWaterway[] {
  const waterways: ExpandedWaterway[] = [];

  // Start with existing comprehensive waterways
  PA_WATERWAYS_COMPREHENSIVE.forEach((w) => {
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
  });

  // Add expanded waterways
  PA_WATERWAYS_EXPANDED.forEach((w) => {
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

  // Add more waterways to reach 50+
  const additionalWaterways: ExpandedWaterway[] = [
    // More Central PA streams
    {
      id: 'bald-eagle-creek',
      name: 'Bald Eagle Creek',
      type: 'Creek',
      county: 'Centre',
      region: 'Central',
      coordinates: { lat: 40.9000, lng: -77.8000 },
      size: '40 miles',
      description: 'Excellent freestone stream with good trout fishing.',
      species: ['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass'],
      seasonal: { bestSeasons: ['spring', 'summer', 'fall'], springStocking: true },
      hatches: [],
      accessPoints: [],
    },
    {
      id: 'moshannon-creek',
      name: 'Moshannon Creek',
      type: 'Creek',
      county: 'Centre',
      region: 'Central',
      coordinates: { lat: 41.0000, lng: -78.0000 },
      size: '50 miles',
      description: 'Large freestone stream with diverse fishing.',
      species: ['Brown Trout', 'Smallmouth Bass'],
      seasonal: { bestSeasons: ['spring', 'summer'], springStocking: true },
      hatches: [],
      accessPoints: [],
    },
    // More Western PA
    {
      id: 'clarion-river',
      name: 'Clarion River',
      type: 'River',
      county: 'Clarion',
      region: 'Pittsburgh',
      coordinates: { lat: 41.2000, lng: -79.2000 },
      size: '110 miles',
      description: 'Major river with excellent smallmouth bass fishing.',
      species: ['Smallmouth Bass', 'Walleye', 'Channel Catfish'],
      seasonal: { bestSeasons: ['spring', 'summer', 'fall'] },
      hatches: [],
      accessPoints: [],
    },
    {
      id: 'youghiogheny-river',
      name: 'Youghiogheny River',
      type: 'River',
      county: 'Fayette',
      region: 'Pittsburgh',
      coordinates: { lat: 40.1000, lng: -79.5000 },
      size: '134 miles',
      description: 'Scenic river with excellent fishing.',
      species: ['Smallmouth Bass', 'Walleye', 'Brown Trout'],
      seasonal: { bestSeasons: ['spring', 'summer', 'fall'], springStocking: true },
      hatches: [],
      accessPoints: [],
    },
    // More Eastern PA
    {
      id: 'lehigh-river',
      name: 'Lehigh River',
      type: 'River',
      county: 'Lehigh',
      region: 'Lehigh Valley',
      coordinates: { lat: 40.6000, lng: -75.5000 },
      size: '103 miles',
      description: 'Major river with trout and bass fishing.',
      species: ['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass'],
      seasonal: { bestSeasons: ['spring', 'summer', 'fall'], springStocking: true },
      hatches: [],
      accessPoints: [],
    },
    {
      id: 'schuylkill-river-reading',
      name: 'Schuylkill River',
      type: 'River',
      county: 'Schuylkill',
      region: 'Reading',
      coordinates: { lat: 40.3000, lng: -76.0000 },
      size: '135 miles',
      description: 'Major river system with diverse fishing.',
      species: ['Smallmouth Bass', 'Walleye', 'Brown Trout'],
      seasonal: { bestSeasons: ['spring', 'summer', 'fall'] },
      hatches: [],
      accessPoints: [],
    },
    // More lakes
    {
      id: 'pymatuning-lake',
      name: 'Pymatuning Lake',
      type: 'Reservoir',
      county: 'Crawford',
      region: 'Erie',
      coordinates: { lat: 41.6000, lng: -80.5000 },
      size: '17,088 acres',
      description: 'Massive reservoir on PA/OH border. Excellent fishing.',
      species: ['Walleye', 'Muskellunge', 'Largemouth Bass', 'Smallmouth Bass', 'Crappie'],
      seasonal: { bestSeasons: ['spring', 'summer', 'fall'], iceFishing: true },
      hatches: [],
      accessPoints: [],
    },
    {
      id: 'shenango-river-lake',
      name: 'Shenango River Lake',
      type: 'Reservoir',
      county: 'Mercer',
      region: 'Pittsburgh',
      coordinates: { lat: 41.3000, lng: -80.4000 },
      size: '3,560 acres',
      description: 'Large reservoir with excellent fishing.',
      species: ['Largemouth Bass', 'Smallmouth Bass', 'Walleye', 'Crappie'],
      seasonal: { bestSeasons: ['spring', 'summer', 'fall'] },
      hatches: [],
      accessPoints: [],
    },
    // More creeks
    {
      id: 'swatara-creek',
      name: 'Swatara Creek',
      type: 'Creek',
      county: 'Lebanon',
      region: 'Harrisburg',
      coordinates: { lat: 40.3000, lng: -76.4000 },
      size: '70 miles',
      description: 'Excellent warm-water stream with bass and trout.',
      species: ['Smallmouth Bass', 'Brown Trout', 'Rainbow Trout'],
      seasonal: { bestSeasons: ['spring', 'summer', 'fall'], springStocking: true },
      hatches: [],
      accessPoints: [],
    },
    {
      id: 'conodoguinet-creek',
      name: 'Conodoguinet Creek',
      type: 'Creek',
      county: 'Cumberland',
      region: 'Harrisburg',
      coordinates: { lat: 40.2789, lng: -77.2147 },
      size: '90 miles',
      description: 'Long creek with good trout and bass fishing.',
      species: ['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass'],
      seasonal: { bestSeasons: ['spring', 'summer', 'fall'], springStocking: true },
      hatches: [],
      accessPoints: [],
    },
    // More waterways to reach 50+
    {
      id: 'loyalsock-creek',
      name: 'Loyalsock Creek',
      type: 'Creek',
      county: 'Sullivan',
      region: 'Scranton',
      coordinates: { lat: 41.4000, lng: -76.7000 },
      size: '64 miles',
      description: 'Excellent freestone stream with wild trout.',
      species: ['Brown Trout', 'Rainbow Trout', 'Brook Trout'],
      seasonal: { bestSeasons: ['spring', 'summer', 'fall'], springStocking: true },
      hatches: [],
      accessPoints: [],
    },
    {
      id: 'pine-creek',
      name: 'Pine Creek',
      type: 'Creek',
      county: 'Tioga',
      region: 'Scranton',
      coordinates: { lat: 41.6000, lng: -77.4000 },
      size: '87 miles',
      description: 'Scenic canyon stream with excellent fishing.',
      species: ['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass'],
      seasonal: { bestSeasons: ['spring', 'summer', 'fall'], springStocking: true },
      hatches: [],
      accessPoints: [],
    },
    {
      id: 'cowanesque-lake',
      name: 'Cowanesque Lake',
      type: 'Reservoir',
      county: 'Tioga',
      region: 'Scranton',
      coordinates: { lat: 41.9000, lng: -77.2000 },
      size: '1,085 acres',
      description: 'Northern PA reservoir with excellent fishing.',
      species: ['Largemouth Bass', 'Smallmouth Bass', 'Walleye', 'Crappie'],
      seasonal: { bestSeasons: ['spring', 'summer', 'fall'], iceFishing: true },
      hatches: [],
      accessPoints: [],
    },
    {
      id: 'raystown-lake',
      name: 'Raystown Lake',
      type: 'Reservoir',
      county: 'Huntingdon',
      region: 'Central',
      coordinates: { lat: 40.3000, lng: -78.0000 },
      size: '8,300 acres',
      description: 'Large reservoir with diverse fishing opportunities.',
      species: ['Largemouth Bass', 'Smallmouth Bass', 'Striped Bass', 'Walleye', 'Muskellunge'],
      seasonal: { bestSeasons: ['spring', 'summer', 'fall'] },
      hatches: [],
      accessPoints: [],
    },
    {
      id: 'mahoning-creek',
      name: 'Mahoning Creek',
      type: 'Creek',
      county: 'Armstrong',
      region: 'Pittsburgh',
      coordinates: { lat: 40.8000, lng: -79.2000 },
      size: '30 miles',
      description: 'Good freestone stream with trout and bass.',
      species: ['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass'],
      seasonal: { bestSeasons: ['spring', 'summer', 'fall'], springStocking: true },
      hatches: [],
      accessPoints: [],
    },
    {
      id: 'crooked-creek',
      name: 'Crooked Creek',
      type: 'Creek',
      county: 'Armstrong',
      region: 'Pittsburgh',
      coordinates: { lat: 40.7000, lng: -79.4000 },
      size: '25 miles',
      description: 'Productive freestone stream.',
      species: ['Brown Trout', 'Rainbow Trout'],
      seasonal: { bestSeasons: ['spring', 'summer'], springStocking: true },
      hatches: [],
      accessPoints: [],
    },
    {
      id: 'tulpehocken-creek',
      name: 'Tulpehocken Creek',
      type: 'Creek',
      county: 'Berks',
      region: 'Reading',
      coordinates: { lat: 40.4000, lng: -76.1000 },
      size: '20 miles',
      description: 'Limestone-influenced stream with good trout fishing.',
      species: ['Brown Trout', 'Rainbow Trout'],
      seasonal: { bestSeasons: ['spring', 'fall'], springStocking: true },
      hatches: [],
      accessPoints: [],
    },
    {
      id: 'manatawny-creek',
      name: 'Manatawny Creek',
      type: 'Creek',
      county: 'Berks',
      region: 'Reading',
      coordinates: { lat: 40.3000, lng: -75.6000 },
      size: '30 miles',
      description: 'Good trout stream in Berks County.',
      species: ['Brown Trout', 'Rainbow Trout'],
      seasonal: { bestSeasons: ['spring', 'summer'], springStocking: true },
      hatches: [],
      accessPoints: [],
    },
    {
      id: 'tobyhanna-creek',
      name: 'Tobyhanna Creek',
      type: 'Creek',
      county: 'Monroe',
      region: 'Scranton',
      coordinates: { lat: 41.2000, lng: -75.4000 },
      size: '20 miles',
      description: 'Pocono stream with good trout fishing.',
      species: ['Brown Trout', 'Rainbow Trout', 'Brook Trout'],
      seasonal: { bestSeasons: ['spring', 'summer'], springStocking: true },
      hatches: [],
      accessPoints: [],
    },
    {
      id: 'bushkill-creek',
      name: 'Bushkill Creek',
      type: 'Creek',
      county: 'Northampton',
      region: 'Lehigh Valley',
      coordinates: { lat: 40.7000, lng: -75.2000 },
      size: '25 miles',
      description: 'Good trout stream in Lehigh Valley.',
      species: ['Brown Trout', 'Rainbow Trout'],
      seasonal: { bestSeasons: ['spring', 'summer'], springStocking: true },
      hatches: [],
      accessPoints: [],
    },
    {
      id: 'saw-creek',
      name: 'Saw Creek',
      type: 'Creek',
      county: 'Pike',
      region: 'Scranton',
      coordinates: { lat: 41.3000, lng: -75.0000 },
      size: '15 miles',
      description: 'Small but productive Pocono stream.',
      species: ['Brown Trout', 'Rainbow Trout', 'Brook Trout'],
      seasonal: { bestSeasons: ['spring', 'summer'], springStocking: true },
      hatches: [],
      accessPoints: [],
    },
    {
      id: 'wissahickon-creek',
      name: 'Wissahickon Creek',
      type: 'Creek',
      county: 'Philadelphia',
      region: 'Philadelphia',
      coordinates: { lat: 40.0500, lng: -75.2000 },
      size: '23 miles',
      description: 'Urban stream with trout and bass fishing.',
      species: ['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass'],
      seasonal: { bestSeasons: ['spring', 'summer'], springStocking: true },
      hatches: [],
      accessPoints: [],
    },
    {
      id: 'perkiomen-creek',
      name: 'Perkiomen Creek',
      type: 'Creek',
      county: 'Montgomery',
      region: 'Philadelphia',
      coordinates: { lat: 40.2000, lng: -75.5000 },
      size: '37 miles',
      description: 'Good warm-water stream with trout in upper sections.',
      species: ['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass'],
      seasonal: { bestSeasons: ['spring', 'summer'], springStocking: true },
      hatches: [],
      accessPoints: [],
    },
    {
      id: 'conestoga-river',
      name: 'Conestoga River',
      type: 'River',
      county: 'Lancaster',
      region: 'Harrisburg',
      coordinates: { lat: 40.0500, lng: -76.3000 },
      size: '62 miles',
      description: 'Good warm-water river with bass fishing.',
      species: ['Smallmouth Bass', 'Largemouth Bass', 'Brown Trout'],
      seasonal: { bestSeasons: ['spring', 'summer', 'fall'] },
      hatches: [],
      accessPoints: [],
    },
    {
      id: 'octoraro-creek',
      name: 'Octoraro Creek',
      type: 'Creek',
      county: 'Lancaster',
      region: 'Harrisburg',
      coordinates: { lat: 39.9000, lng: -76.2000 },
      size: '22 miles',
      description: 'Good trout stream in Lancaster County.',
      species: ['Brown Trout', 'Rainbow Trout'],
      seasonal: { bestSeasons: ['spring', 'summer'], springStocking: true },
      hatches: [],
      accessPoints: [],
    },
    {
      id: 'codorus-creek',
      name: 'Codorus Creek',
      type: 'Creek',
      county: 'York',
      region: 'Harrisburg',
      coordinates: { lat: 39.9500, lng: -76.7000 },
      size: '42 miles',
      description: 'Good trout stream with bass in lower sections.',
      species: ['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass'],
      seasonal: { bestSeasons: ['spring', 'summer'], springStocking: true },
      hatches: [],
      accessPoints: [],
    },
    {
      id: 'catawissa-creek',
      name: 'Catawissa Creek',
      type: 'Creek',
      county: 'Schuylkill',
      region: 'Reading',
      coordinates: { lat: 40.9000, lng: -76.2000 },
      size: '30 miles',
      description: 'Good freestone stream with trout.',
      species: ['Brown Trout', 'Rainbow Trout'],
      seasonal: { bestSeasons: ['spring', 'summer'], springStocking: true },
      hatches: [],
      accessPoints: [],
    },
    {
      id: 'tunkhannock-creek',
      name: 'Tunkhannock Creek',
      type: 'Creek',
      county: 'Wyoming',
      region: 'Scranton',
      coordinates: { lat: 41.5000, lng: -75.9000 },
      size: '30 miles',
      description: 'Good trout stream in northeast PA.',
      species: ['Brown Trout', 'Rainbow Trout'],
      seasonal: { bestSeasons: ['spring', 'summer'], springStocking: true },
      hatches: [],
      accessPoints: [],
    },
    {
      id: 'lackawanna-river',
      name: 'Lackawanna River',
      type: 'River',
      county: 'Lackawanna',
      region: 'Scranton',
      coordinates: { lat: 41.4000, lng: -75.7000 },
      size: '40 miles',
      description: 'Urban river with improving trout fishing.',
      species: ['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass'],
      seasonal: { bestSeasons: ['spring', 'summer'], springStocking: true },
      hatches: [],
      accessPoints: [],
    },
  ];

  waterways.push(...additionalWaterways);

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
    const habitatTypes = waterway.type === 'Lake' || waterway.type === 'Reservoir' 
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
  console.log('🚀 Expanding waterways to 50+ locations...\n');

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const waterways = generate50PlusWaterways();
  console.log(`✅ Generated ${waterways.length} waterways`);

  // Save data
  await fs.writeFile(
    path.join(OUTPUT_DIR, '50plus-waterways.json'),
    JSON.stringify(waterways, null, 2)
  );

  // Generate SQL
  const sql = generateSQLInserts(waterways);
  await fs.writeFile(
    path.join(OUTPUT_DIR, '50plus-waterways-insert.sql'),
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
    },
    byRegion: Object.fromEntries(
      Array.from(new Set(waterways.map(w => w.region))).map(region => [
        region,
        waterways.filter(w => w.region === region).length,
      ])
    ),
    withHatches: waterways.filter(w => w.hatches && w.hatches.length > 0).length,
    withSeasonalData: waterways.filter(w => w.seasonal && w.seasonal.bestSeasons).length,
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

export { generate50PlusWaterways };

