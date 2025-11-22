/**
 * PASDA (Pennsylvania Spatial Data Access) Scraper
 * 
 * Scrapes GeoJSON data from PASDA for PFBC water data
 * 
 * PASDA provides GIS data for:
 * - Trout stocking schedules
 * - Fishing access points
 * - Best fishing waters
 * - Lake habitat installations
 * - Water body boundaries
 */

import * as fs from 'fs/promises';
import * as path from 'path';

const PASDA_BASE_URL = 'https://www.pasda.psu.edu';
const OUTPUT_DIR = path.join(process.cwd(), 'data', 'scraped', 'pasda');

/**
 * PASDA Dataset IDs for PFBC data
 * These need to be found on the PASDA website
 */
const PASDA_DATASETS = {
  troutStocking: 'PFBC_TroutStocking_2024',
  accessPoints: 'PFBC_AccessPoints',
  fishingWaters: 'PFBC_BestFishingWaters',
  lakeHabitat: 'PFBC_LakeHabitat',
  waterBodies: 'PFBC_WaterBodies',
};

/**
 * Fetch GeoJSON from PASDA
 */
async function fetchPASDADataset(datasetId: string): Promise<any> {
  const url = `${PASDA_BASE_URL}/arcgis/rest/services/pasda/${datasetId}/MapServer/0/query?where=1%3D1&outFields=*&f=geojson`;

  console.log(`📥 Fetching ${datasetId} from PASDA...`);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WLA_App/1.0)',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Fetched ${data.features?.length || 0} features`);
    return data;
  } catch (error) {
    console.error(`❌ Error fetching ${datasetId}:`, error);
    throw error;
  }
}

/**
 * Transform GeoJSON to app format
 */
function transformStockingData(geojson: any): any[] {
  if (!geojson.features) return [];

  return geojson.features.map((feature: any) => {
    const props = feature.properties;
    const coords = feature.geometry.coordinates;

    return {
      waterBodyName: props.WATER_BODY || props.WATERWAY_NAME || 'Unknown',
      county: props.COUNTY || 'Unknown',
      date: props.STOCK_DATE || props.DATE || '',
      species: props.SPECIES || 'Unknown',
      quantity: parseInt(props.QUANTITY || props.NUMBER || '0', 10),
      size: props.SIZE || props.SIZE_CLASS || 'Unknown',
      latitude: coords?.[1],
      longitude: coords?.[0],
      locationDetails: props.LOCATION || props.DETAILS,
    };
  });
}

function transformAccessPoints(geojson: any): any[] {
  if (!geojson.features) return [];

  return geojson.features.map((feature: any) => {
    const props = feature.properties;
    const coords = feature.geometry.coordinates;

    return {
      name: props.ACCESS_NAME || props.NAME || 'Unknown',
      waterBodyName: props.WATER_BODY || props.WATERWAY_NAME || 'Unknown',
      county: props.COUNTY || 'Unknown',
      latitude: coords?.[1],
      longitude: coords?.[0],
      type: props.TYPE || props.ACCESS_TYPE || 'Unknown',
      amenities: props.AMENITIES ? props.AMENITIES.split(',').map((a: string) => a.trim()) : [],
      accessibility: props.ACCESSIBILITY || 'Unknown',
      parking: props.PARKING === 'Yes' || props.PARKING === true || props.PARKING === 'Y',
    };
  });
}

function transformFishingWaters(geojson: any): any[] {
  if (!geojson.features) return [];

  return geojson.features.map((feature: any) => {
    const props = feature.properties;
    const coords = feature.geometry.coordinates;

    return {
      name: props.WATER_NAME || props.NAME || 'Unknown',
      type: props.TYPE || 'Unknown',
      county: props.COUNTY || 'Unknown',
      latitude: coords?.[1],
      longitude: coords?.[0],
      species: props.SPECIES ? props.SPECIES.split(',').map((s: string) => s.trim()) : [],
      size: props.SIZE || props.ACRES || '',
      description: props.DESCRIPTION || '',
      regulations: props.REGULATIONS || '',
    };
  });
}

function transformHabitatInstallations(geojson: any): any[] {
  if (!geojson.features) return [];

  return geojson.features.map((feature: any) => {
    const props = feature.properties;
    const coords = feature.geometry.coordinates;

    return {
      lakeName: props.LAKE_NAME || props.NAME || 'Unknown',
      county: props.COUNTY || 'Unknown',
      installationType: props.INSTALLATION_TYPE || props.TYPE || 'Unknown',
      installationDate: props.INSTALLATION_DATE || props.DATE || '',
      coordinates: coords ? { latitude: coords[1], longitude: coords[0] } : undefined,
      structureType: props.STRUCTURE_TYPE || props.STRUCTURE || 'Unknown',
      description: props.DESCRIPTION || '',
      mapUrl: props.MAP_URL || '',
    };
  });
}

/**
 * Save transformed data
 */
async function saveTransformedData(data: any[], filename: string): Promise<void> {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const filepath = path.join(OUTPUT_DIR, filename);
  await fs.writeFile(filepath, JSON.stringify(data, null, 2));
  console.log(`💾 Saved ${filename} (${data.length} records)`);
}

/**
 * Main scraping function
 */
async function main() {
  console.log('🚀 Starting PASDA data scraping...\n');

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Scrape all datasets
  const results: Record<string, any> = {};

  for (const [key, datasetId] of Object.entries(PASDA_DATASETS)) {
    try {
      const geojson = await fetchPASDADataset(datasetId);

      // Transform based on dataset type
      let transformed: any[] = [];
      let filename = '';

      switch (key) {
        case 'troutStocking':
          transformed = transformStockingData(geojson);
          filename = 'stocking-events.json';
          break;
        case 'accessPoints':
          transformed = transformAccessPoints(geojson);
          filename = 'access-points.json';
          break;
        case 'fishingWaters':
          transformed = transformFishingWaters(geojson);
          filename = 'fishing-waters.json';
          break;
        case 'lakeHabitat':
          transformed = transformHabitatInstallations(geojson);
          filename = 'habitat-installations.json';
          break;
        default:
          // Save raw GeoJSON
          filename = `${key}-raw.json`;
          transformed = geojson;
      }

      results[key] = transformed;
      await saveTransformedData(transformed, filename);

      // Also save raw GeoJSON
      await saveTransformedData(geojson, `${key}-raw-geojson.json`);
    } catch (error) {
      console.error(`❌ Failed to scrape ${key}:`, error);
      results[key] = { error: error instanceof Error ? error.message : 'Unknown error' };
    }

    // Rate limiting
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  // Create summary
  const summary = {
    scrapedAt: new Date().toISOString(),
    datasets: Object.keys(PASDA_DATASETS),
    counts: Object.fromEntries(
      Object.entries(results).map(([key, value]) => [
        key,
        Array.isArray(value) ? value.length : 'error',
      ])
    ),
  };

  await saveTransformedData([summary], 'scraping-summary.json');

  console.log('\n✅ PASDA scraping complete!');
  console.log(`📊 Summary:`);
  Object.entries(summary.counts).forEach(([key, count]) => {
    console.log(`   ${key}: ${count}`);
  });
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { fetchPASDADataset, transformStockingData, transformAccessPoints };


