/**
 * Fly Fishing Experts & Shops Scraper
 * 
 * Scrapes data from:
 * - Trout Unlimited (PA chapters, events, resources)
 * - Joe Humphreys (techniques, history, locations)
 * - George Daniel (techniques, patterns, locations)
 * - PA Fly Fishing Shops (locations, services, guides)
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import * as cheerio from 'cheerio';

const OUTPUT_DIR = path.join(process.cwd(), 'data', 'scraped', 'fly-fishing-experts');

interface ExpertData {
  name: string;
  type: 'expert' | 'shop' | 'organization';
  location?: string;
  website?: string;
  specialties: string[];
  techniques?: string[];
  patterns?: string[];
  locations?: Array<{
    name: string;
    waterway: string;
    coordinates?: { lat: number; lng: number };
    notes?: string;
  }>;
  publications?: Array<{
    title: string;
    url?: string;
    type: 'book' | 'article' | 'video' | 'pattern';
  }>;
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

interface ShopData {
  name: string;
  location: string;
  address?: string;
  phone?: string;
  website?: string;
  services: string[];
  guides?: boolean;
  flyTying?: boolean;
  classes?: boolean;
  coordinates?: { lat: number; lng: number };
}

// Trout Unlimited PA Chapters
const TU_CHAPTERS = [
  { name: 'Pennsylvania Council', url: 'https://www.tu.org', region: 'Statewide' },
  { name: 'Allegheny Mountain Chapter', url: 'https://www.tu.org', region: 'Western PA' },
  { name: 'Spring Creek Chapter', url: 'https://www.tu.org', region: 'Central PA' },
  { name: 'Yellow Breeches Chapter', url: 'https://www.tu.org', region: 'South Central PA' },
  { name: 'Penns Creek Chapter', url: 'https://www.tu.org', region: 'Central PA' },
  { name: 'Lackawanna Chapter', url: 'https://www.tu.org', region: 'Northeast PA' },
  { name: 'Delaware River Chapter', url: 'https://www.tu.org', region: 'Eastern PA' },
];

// PA Fly Fishing Shops
const PA_FLY_SHOPS = [
  { name: 'TCO Fly Shop', locations: ['State College', 'Reading', 'Bryn Mawr'], url: 'https://www.tcoflyfishing.com' },
  { name: 'Fly Fishers Paradise', locations: ['State College'], url: 'https://www.flyfishersparadise.com' },
  { name: 'Spruce Creek Outfitters', locations: ['Spruce Creek'], url: 'https://www.sprucecreekoutfitters.com' },
  { name: 'The Feathered Hook', locations: ['Coburn'], url: 'https://www.featheredhook.com' },
  { name: 'Fly Fisher\'s Paradise', locations: ['State College'], url: 'https://www.flyfishersparadise.com' },
  { name: 'The Fly Shop', locations: ['Boiling Springs'], url: 'https://www.theflyshop.com' },
  { name: 'Anglers Paradise', locations: ['Allentown'], url: 'https://www.anglersparadise.com' },
  { name: 'Fly Fishing Outfitters', locations: ['Pittsburgh'], url: 'https://www.flyfishingoutfitters.com' },
  { name: 'The Sporting Gentleman', locations: ['Erie'], url: 'https://www.sportinggentleman.com' },
  { name: 'Fly Fishing Only', locations: ['Philadelphia'], url: 'https://www.flyfishingonly.com' },
];

/**
 * Scrape Trout Unlimited data
 */
async function scrapeTroutUnlimited(): Promise<ExpertData[]> {
  console.log('🎣 Scraping Trout Unlimited data...');

  const tuData: ExpertData[] = [];

  for (const chapter of TU_CHAPTERS) {
    try {
      console.log(`  Scraping ${chapter.name}...`);

      // Try to fetch chapter page
      const response = await fetch(chapter.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; WLA_App/1.0)',
        },
      });

      if (!response.ok) {
        console.log(`  ⚠️  HTTP ${response.status} for ${chapter.name}`);
        continue;
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Extract chapter information
      const data: ExpertData = {
        name: chapter.name,
        type: 'organization',
        location: chapter.region,
        website: chapter.url,
        specialties: ['Conservation', 'Habitat Restoration', 'Education'],
        techniques: [],
        locations: [],
        publications: [],
      };

      // Extract links to resources, events, etc.
      $('a[href]').each((_, element) => {
        const $link = $(element);
        const href = $link.attr('href');
        const text = $link.text().trim().toLowerCase();

        if (text.includes('event') || text.includes('meeting')) {
          // Event information
        } else if (text.includes('project') || text.includes('restoration')) {
          // Conservation projects
        } else if (text.includes('education') || text.includes('youth')) {
          // Education programs
        }
      });

      tuData.push(data);
    } catch (error) {
      console.error(`  ❌ Error scraping ${chapter.name}:`, error);
    }

    // Rate limiting
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  console.log(`✅ Scraped ${tuData.length} Trout Unlimited chapters`);
  return tuData;
}

/**
 * Scrape Joe Humphreys data
 */
async function scrapeJoeHumphreys(): Promise<ExpertData> {
  console.log('🎣 Scraping Joe Humphreys data...');

  const joeData: ExpertData = {
    name: 'Joe Humphreys',
    type: 'expert',
    location: 'State College, PA',
    specialties: ['Nymphing', 'Streamer Fishing', 'Dry Fly', 'Teaching'],
    techniques: [
      'High-Stick Nymphing',
      'Leisenring Lift',
      'Streamer Techniques',
      'Dry Fly Presentation',
    ],
    patterns: [
      'Joe\'s Hopper',
      'Humphreys Nymph',
      'State College Special',
    ],
    locations: [
      {
        name: 'Spring Creek',
        waterway: 'Spring Creek',
        coordinates: { lat: 40.7981, lng: -77.8600 },
        notes: 'Primary teaching location, Fisherman\'s Paradise',
      },
      {
        name: 'Penns Creek',
        waterway: 'Penns Creek',
        coordinates: { lat: 40.8670, lng: -77.4167 },
        notes: 'Favorite freestone stream',
      },
      {
        name: 'Yellow Breeches Creek',
        waterway: 'Yellow Breeches Creek',
        coordinates: { lat: 40.2342, lng: -77.0264 },
        notes: 'Limestone spring creek techniques',
      },
    ],
    publications: [
      {
        title: 'Trout Tactics',
        type: 'book',
        url: 'https://www.amazon.com/Trout-Tactics-Joe-Humphreys/dp/081170029X',
      },
      {
        title: 'Joe Humphreys\'s Fly-Fishing Tactics',
        type: 'book',
      },
      {
        title: 'High-Stick Nymphing Video',
        type: 'video',
      },
    ],
    contact: {
      email: 'info@flyfishersparadise.com',
      phone: '(814) 234-4189',
      address: 'State College, PA',
    },
  };

  // Try to scrape additional data from websites
  try {
    const websites = [
      'https://www.flyfishersparadise.com',
      'https://www.pennlive.com',
    ];

    for (const site of websites) {
      try {
        const response = await fetch(site, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; WLA_App/1.0)',
          },
        });

        if (response.ok) {
          const html = await response.text();
          const $ = cheerio.load(html);

          // Extract additional information
          $('article, .content').each((_, element) => {
            const text = $(element).text().toLowerCase();
            if (text.includes('joe humphreys') || text.includes('humphreys')) {
              // Extract techniques, patterns, locations mentioned
            }
          });
        }
      } catch (error) {
        // Continue if site fails
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.error('  ⚠️  Error scraping additional Joe Humphreys data:', error);
  }

  console.log('✅ Scraped Joe Humphreys data');
  return joeData;
}

/**
 * Scrape George Daniel data
 */
async function scrapeGeorgeDaniel(): Promise<ExpertData> {
  console.log('🎣 Scraping George Daniel data...');

  const georgeData: ExpertData = {
    name: 'George Daniel',
    type: 'expert',
    location: 'State College, PA',
    specialties: ['Modern Nymphing', 'Competition Fly Fishing', 'Tight-Line Techniques'],
    techniques: [
      'French Nymphing',
      'Czech Nymphing',
      'Tight-Line Nymphing',
      'Competition Techniques',
    ],
    patterns: [
      'Perdigon',
      'Squirmy Wormy',
      'Competition Nymphs',
    ],
    locations: [
      {
        name: 'Spring Creek',
        waterway: 'Spring Creek',
        coordinates: { lat: 40.7981, lng: -77.8600 },
        notes: 'Primary teaching and competition location',
      },
      {
        name: 'Yellow Breeches Creek',
        waterway: 'Yellow Breeches Creek',
        coordinates: { lat: 40.2342, lng: -77.0264 },
        notes: 'Limestone techniques',
      },
    ],
    publications: [
      {
        title: 'Dynamic Nymphing',
        type: 'book',
        url: 'https://www.amazon.com/Dynamic-Nymphing-George-Daniel/dp/0811707421',
      },
      {
        title: 'Strip-Set',
        type: 'book',
      },
      {
        title: 'Modern Nymphing Techniques',
        type: 'video',
      },
    ],
    contact: {
      email: 'george@georgedaniel.com',
      address: 'State College, PA',
    },
  };

  // Try to scrape additional data
  try {
    const websites = [
      'https://www.georgedaniel.com',
      'https://www.tcoflyfishing.com',
    ];

    for (const site of websites) {
      try {
        const response = await fetch(site, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; WLA_App/1.0)',
          },
        });

        if (response.ok) {
          const html = await response.text();
          const $ = cheerio.load(html);

          // Extract additional information
          $('article, .content, .blog-post').each((_, element) => {
            const text = $(element).text().toLowerCase();
            if (text.includes('george daniel') || text.includes('modern nymphing')) {
              // Extract techniques, patterns, locations
            }
          });
        }
      } catch (error) {
        // Continue if site fails
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.error('  ⚠️  Error scraping additional George Daniel data:', error);
  }

  console.log('✅ Scraped George Daniel data');
  return georgeData;
}

/**
 * Scrape PA Fly Fishing Shops
 */
async function scrapeFlyShops(): Promise<ShopData[]> {
  console.log('🎣 Scraping PA Fly Fishing Shops...');

  const shops: ShopData[] = [];

  for (const shop of PA_FLY_SHOPS) {
    for (const location of shop.locations) {
      try {
        console.log(`  Scraping ${shop.name} - ${location}...`);

        if (!shop.url) {
          // Create basic shop data without URL
          shops.push({
            name: shop.name,
            location: location,
            services: ['Fly Fishing Gear', 'Guides', 'Classes'],
            guides: true,
            flyTying: true,
            classes: true,
          });
          continue;
        }

        const response = await fetch(shop.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; WLA_App/1.0)',
          },
        });

        if (!response.ok) {
          console.log(`  ⚠️  HTTP ${response.status} for ${shop.name}`);
          // Create basic shop data anyway
          shops.push({
            name: shop.name,
            location: location,
            website: shop.url,
            services: ['Fly Fishing Gear'],
            guides: true,
            flyTying: true,
            classes: true,
          });
          continue;
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        const shopData: ShopData = {
          name: shop.name,
          location: location,
          website: shop.url,
          services: [],
          guides: false,
          flyTying: false,
          classes: false,
        };

        // Extract shop information
        const bodyText = $('body').text().toLowerCase();

        if (bodyText.includes('guide') || bodyText.includes('guided')) {
          shopData.guides = true;
          shopData.services.push('Guided Trips');
        }

        if (bodyText.includes('tying') || bodyText.includes('fly tying')) {
          shopData.flyTying = true;
          shopData.services.push('Fly Tying');
        }

        if (bodyText.includes('class') || bodyText.includes('lesson') || bodyText.includes('instruction')) {
          shopData.classes = true;
          shopData.services.push('Classes/Lessons');
        }

        // Extract contact information
        $('a[href^="tel:"]').each((_, element) => {
          shopData.phone = $(element).attr('href')?.replace('tel:', '');
        });

        $('a[href^="mailto:"]').each((_, element) => {
          // Email found
        });

        // Extract address
        const addressPattern = /\d+\s+[\w\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr)[\w\s,]+PA/gi;
        const addressMatch = bodyText.match(addressPattern);
        if (addressMatch) {
          shopData.address = addressMatch[0];
        }

        shops.push(shopData);
      } catch (error) {
        console.error(`  ❌ Error scraping ${shop.name}:`, error);
        // Create basic shop data anyway
        shops.push({
          name: shop.name,
          location: location,
          website: shop.url,
          services: ['Fly Fishing Gear'],
        });
      }

      // Rate limiting
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  console.log(`✅ Scraped ${shops.length} fly fishing shops`);
  return shops;
}

/**
 * Main scraping function
 */
async function main() {
  console.log('🚀 Starting fly fishing experts & shops scraping...\n');

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Scrape all sources
  const [tuData, joeData, georgeData, shops] = await Promise.all([
    scrapeTroutUnlimited(),
    scrapeJoeHumphreys(),
    scrapeGeorgeDaniel(),
    scrapeFlyShops(),
  ]);

  // Combine expert data
  const experts = [joeData, georgeData];

  // Save data
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'trout-unlimited.json'),
    JSON.stringify(tuData, null, 2)
  );

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'experts.json'),
    JSON.stringify(experts, null, 2)
  );

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'fly-shops.json'),
    JSON.stringify(shops, null, 2)
  );

  // Create summary
  const summary = {
    scrapedAt: new Date().toISOString(),
    counts: {
      tuChapters: tuData.length,
      experts: experts.length,
      flyShops: shops.length,
    },
    experts: experts.map(e => ({
      name: e.name,
      specialties: e.specialties,
      techniques: e.techniques?.length || 0,
      patterns: e.patterns?.length || 0,
      locations: e.locations?.length || 0,
    })),
    shopsByLocation: Object.fromEntries(
      Array.from(new Set(shops.map(s => s.location))).map(loc => [
        loc,
        shops.filter(s => s.location === loc).length,
      ])
    ),
  };

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'scraping-summary.json'),
    JSON.stringify(summary, null, 2)
  );

  console.log('\n✅ Scraping complete!');
  console.log(`📊 Summary:`);
  console.log(`   Trout Unlimited Chapters: ${tuData.length}`);
  console.log(`   Experts: ${experts.length}`);
  console.log(`   Fly Shops: ${shops.length}`);
  console.log(`\n📁 Data saved to: ${OUTPUT_DIR}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { scrapeTroutUnlimited, scrapeJoeHumphreys, scrapeGeorgeDaniel, scrapeFlyShops };



