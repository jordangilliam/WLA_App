/**
 * PA Fish and Boat Commission Data Scraper
 * 
 * Scrapes:
 * 1. PFBC water data (stocking schedules, access points, fishing waters)
 * 2. Lake habitat installations
 * 3. Conservation group documentation
 * 
 * Data Sources:
 * - PASDA (Pennsylvania Spatial Data Access)
 * - PFBC official website
 * - Local conservation group websites
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

// Types
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

interface FishingWater {
  name: string;
  type: 'Lake' | 'Stream' | 'River' | 'Pond' | 'Reservoir';
  county: string;
  latitude: number;
  longitude: number;
  species: string[];
  size?: string;
  description?: string;
  regulations?: string;
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

interface ConservationDocument {
  organization: string;
  title: string;
  url: string;
  type: 'report' | 'guide' | 'study' | 'article' | 'data';
  date?: string;
  description?: string;
  topics: string[];
}

// Configuration
const DATA_DIR = path.join(process.cwd(), 'data', 'scraped');
const OUTPUT_DIR = path.join(process.cwd(), 'data', 'scraped', 'output');

// PASDA and PFBC URLs
const PASDA_BASE_URL = 'https://www.pasda.psu.edu';
const PFBC_BASE_URL = 'https://www.fishandboat.com';
const PFBC_HABITAT_URL = 'https://www.fishandboat.com/Conservation/HabitatManagement/Pages/default.aspx';

// Conservation group URLs
const CONSERVATION_GROUPS = [
  {
    name: 'Trout Unlimited - PA Council',
    url: 'https://www.tu.org',
    searchTerms: ['Pennsylvania', 'habitat', 'restoration'],
  },
  {
    name: 'Pennsylvania Lake Management Society',
    url: 'https://www.palms.org',
    searchTerms: ['habitat', 'lake', 'management'],
  },
  {
    name: 'Pennsylvania Environmental Council',
    url: 'https://www.pecpa.org',
    searchTerms: ['water', 'habitat', 'conservation'],
  },
  {
    name: 'Chesapeake Bay Foundation - PA',
    url: 'https://www.cbf.org',
    searchTerms: ['Pennsylvania', 'watershed', 'restoration'],
  },
  {
    name: 'Western Pennsylvania Conservancy',
    url: 'https://waterlandlife.org',
    searchTerms: ['water', 'habitat', 'restoration'],
  },
  {
    name: 'Pennsylvania Watershed Association',
    url: 'https://www.pawatersheds.org',
    searchTerms: ['watershed', 'habitat', 'restoration'],
  },
];

/**
 * Fetch with retry and rate limiting
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries = 3,
  delay = 1000
): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; WLA_App/1.0)',
          ...options.headers,
        },
      });

      if (response.ok) {
        return response;
      }

      if (response.status === 429) {
        // Rate limited - wait longer
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1) * 2));
        continue;
      }

      if (response.status >= 500 && i < maxRetries - 1) {
        // Server error - retry
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
        continue;
      }

      return response;
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
    }
  }

  throw new Error(`Failed to fetch ${url} after ${maxRetries} attempts`);
}

/**
 * Scrape PFBC stocking data from PASDA
 */
async function scrapeStockingData(): Promise<StockingEvent[]> {
  console.log('🎣 Scraping PFBC stocking data...');

  try {
    // PASDA GeoJSON endpoint for trout stocking
    // Note: Actual endpoint needs to be found on PASDA website
    const pasdaUrl = `${PASDA_BASE_URL}/uci/DataSummary.aspx?dataset=PFBC_TroutStocking`;

    // For now, we'll scrape from PFBC website directly
    const pfbcStockingUrl = `${PFBC_BASE_URL}/Fishing/Stocking/Pages/default.aspx`;

    const response = await fetchWithRetry(pfbcStockingUrl);
    const html = await response.text();

    // Parse HTML to extract stocking data
    // This is a simplified parser - actual implementation would need more robust parsing
    const stockingEvents: StockingEvent[] = [];

    // Extract data from HTML tables or JSON embedded in page
    // Implementation depends on actual PFBC website structure

    console.log(`✅ Scraped ${stockingEvents.length} stocking events`);
    return stockingEvents;
  } catch (error) {
    console.error('❌ Error scraping stocking data:', error);
    return [];
  }
}

/**
 * Scrape PFBC access points
 */
async function scrapeAccessPoints(): Promise<AccessPoint[]> {
  console.log('📍 Scraping PFBC access points...');

  try {
    // PASDA GeoJSON endpoint for access points
    const pasdaUrl = `${PASDA_BASE_URL}/uci/DataSummary.aspx?dataset=PFBC_AccessPoints`;

    const response = await fetchWithRetry(pasdaUrl);
    const data = await response.json();

    // Parse GeoJSON data
    const accessPoints: AccessPoint[] = [];

    if (data.type === 'FeatureCollection' && data.features) {
      for (const feature of data.features) {
        const props = feature.properties;
        const coords = feature.geometry.coordinates;

        accessPoints.push({
          name: props.ACCESS_NAME || props.NAME || 'Unknown',
          waterBodyName: props.WATER_BODY || props.WATERWAY_NAME || 'Unknown',
          county: props.COUNTY || 'Unknown',
          latitude: coords[1],
          longitude: coords[0],
          type: props.TYPE || props.ACCESS_TYPE || 'Unknown',
          amenities: props.AMENITIES ? props.AMENITIES.split(',') : [],
          accessibility: props.ACCESSIBILITY || 'Unknown',
          parking: props.PARKING === 'Yes' || props.PARKING === true,
        });
      }
    }

    console.log(`✅ Scraped ${accessPoints.length} access points`);
    return accessPoints;
  } catch (error) {
    console.error('❌ Error scraping access points:', error);
    return [];
  }
}

/**
 * Scrape lake habitat installations
 */
async function scrapeHabitatInstallations(): Promise<HabitatInstallation[]> {
  console.log('🏗️ Scraping lake habitat installations...');

  const installations: HabitatInstallation[] = [];

  try {
    // PFBC Lake Habitat page
    const response = await fetchWithRetry(PFBC_HABITAT_URL);
    const html = await response.text();

    // Parse HTML to extract habitat installation data
    // Look for lake names, installation types, dates, coordinates

    // Example structure (needs actual parsing):
    // - Lake name
    // - Installation type (artificial structures, shoreline stabilization, etc.)
    // - Installation date
    // - Map URL or coordinates
    // - Structure type (cribs, brush piles, etc.)

    // For now, return empty array - needs actual parsing implementation
    console.log(`✅ Scraped ${installations.length} habitat installations`);
    return installations;
  } catch (error) {
    console.error('❌ Error scraping habitat installations:', error);
    return [];
  }
}

/**
 * Scrape conservation group documentation
 */
async function scrapeConservationDocs(): Promise<ConservationDocument[]> {
  console.log('📚 Scraping conservation group documentation...');

  const documents: ConservationDocument[] = [];

  for (const group of CONSERVATION_GROUPS) {
    try {
      console.log(`  Scraping ${group.name}...`);

      const response = await fetchWithRetry(group.url);
      const html = await response.text();

      // Parse HTML to find documentation links
      // Look for:
      // - PDF links
      // - Report pages
      // - Data downloads
      // - Article links

      // Extract document metadata:
      // - Title
      // - URL
      // - Type (report, guide, study, etc.)
      // - Date
      // - Description
      // - Topics/tags

      // For now, return empty - needs actual parsing
    } catch (error) {
      console.error(`  ❌ Error scraping ${group.name}:`, error);
    }
  }

  console.log(`✅ Scraped ${documents.length} conservation documents`);
  return documents;
}

/**
 * Save data to JSON files
 */
async function saveData(data: any, filename: string): Promise<void> {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const filepath = path.join(OUTPUT_DIR, filename);
  await fs.writeFile(filepath, JSON.stringify(data, null, 2));
  console.log(`💾 Saved ${filename}`);
}

/**
 * Main scraping function
 */
async function main() {
  console.log('🚀 Starting PFBC data scraping...\n');

  // Create output directory
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Scrape all data sources
  const [stockingData, accessPoints, habitatInstallations, conservationDocs] =
    await Promise.all([
      scrapeStockingData(),
      scrapeAccessPoints(),
      scrapeHabitatInstallations(),
      scrapeConservationDocs(),
    ]);

  // Save to JSON files
  await Promise.all([
    saveData(stockingData, 'stocking-events.json'),
    saveData(accessPoints, 'access-points.json'),
    saveData(habitatInstallations, 'habitat-installations.json'),
    saveData(conservationDocs, 'conservation-documents.json'),
  ]);

  // Create summary
  const summary = {
    scrapedAt: new Date().toISOString(),
    counts: {
      stockingEvents: stockingData.length,
      accessPoints: accessPoints.length,
      habitatInstallations: habitatInstallations.length,
      conservationDocuments: conservationDocs.length,
    },
    sources: {
      pfbc: PFBC_BASE_URL,
      pasda: PASDA_BASE_URL,
      conservationGroups: CONSERVATION_GROUPS.map((g) => g.name),
    },
  };

  await saveData(summary, 'scraping-summary.json');

  console.log('\n✅ Scraping complete!');
  console.log(`📊 Summary:`);
  console.log(`   Stocking Events: ${stockingData.length}`);
  console.log(`   Access Points: ${accessPoints.length}`);
  console.log(`   Habitat Installations: ${habitatInstallations.length}`);
  console.log(`   Conservation Documents: ${conservationDocs.length}`);
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export {
  scrapeStockingData,
  scrapeAccessPoints,
  scrapeHabitatInstallations,
  scrapeConservationDocs,
};


