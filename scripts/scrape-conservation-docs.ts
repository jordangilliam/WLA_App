/**
 * Conservation Group Documentation Scraper
 * 
 * Scrapes documentation from:
 * - Trout Unlimited PA
 * - Pennsylvania Lake Management Society
 * - Pennsylvania Environmental Council
 * - Chesapeake Bay Foundation PA
 * - Western Pennsylvania Conservancy
 * - Pennsylvania Watershed Association
 * - Local watershed associations
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import * as cheerio from 'cheerio';

const OUTPUT_DIR = path.join(process.cwd(), 'data', 'scraped', 'conservation');

interface ConservationDocument {
  organization: string;
  title: string;
  url: string;
  type: 'report' | 'guide' | 'study' | 'article' | 'data' | 'map' | 'video';
  date?: string;
  description?: string;
  topics: string[];
  fileType?: 'pdf' | 'html' | 'doc' | 'xls' | 'csv';
  fileSize?: string;
}

const CONSERVATION_GROUPS = [
  {
    name: 'Trout Unlimited - PA Council',
    baseUrl: 'https://www.tu.org',
    searchPaths: ['/conservation', '/pennsylvania', '/habitat'],
    keywords: ['habitat', 'restoration', 'Pennsylvania', 'trout', 'stream'],
  },
  {
    name: 'Pennsylvania Lake Management Society',
    baseUrl: 'https://www.palms.org',
    searchPaths: ['/resources', '/publications', '/research'],
    keywords: ['lake', 'habitat', 'management', 'Pennsylvania'],
  },
  {
    name: 'Pennsylvania Environmental Council',
    baseUrl: 'https://www.pecpa.org',
    searchPaths: ['/resources', '/publications', '/water'],
    keywords: ['water', 'habitat', 'conservation', 'Pennsylvania'],
  },
  {
    name: 'Chesapeake Bay Foundation - PA',
    baseUrl: 'https://www.cbf.org',
    searchPaths: ['/pennsylvania', '/resources', '/publications'],
    keywords: ['Pennsylvania', 'watershed', 'restoration', 'habitat'],
  },
  {
    name: 'Western Pennsylvania Conservancy',
    baseUrl: 'https://waterlandlife.org',
    searchPaths: ['/water', '/resources', '/publications'],
    keywords: ['water', 'habitat', 'restoration', 'Pennsylvania'],
  },
  {
    name: 'Pennsylvania Watershed Association',
    baseUrl: 'https://www.pawatersheds.org',
    searchPaths: ['/resources', '/publications', '/data'],
    keywords: ['watershed', 'habitat', 'restoration', 'Pennsylvania'],
  },
];

/**
 * Extract documents from HTML page
 */
function extractDocuments(html: string, baseUrl: string, organization: string): ConservationDocument[] {
  const $ = cheerio.load(html);
  const documents: ConservationDocument[] = [];

  // Find all links that might be documents
  $('a[href]').each((_, element) => {
    const $link = $(element);
    const href = $link.attr('href');
    const text = $link.text().trim();

    if (!href || !text) return;

    // Check if it's a document link
    const isPDF = href.toLowerCase().endsWith('.pdf');
    const isDoc = href.toLowerCase().match(/\.(doc|docx|xls|xlsx|csv)$/);
    const isDocumentPage = text.toLowerCase().includes('report') ||
                          text.toLowerCase().includes('guide') ||
                          text.toLowerCase().includes('study') ||
                          text.toLowerCase().includes('publication') ||
                          text.toLowerCase().includes('data');

    if (isPDF || isDoc || isDocumentPage) {
      const fullUrl = href.startsWith('http') ? href : new URL(href, baseUrl).toString();
      
      // Determine document type
      let docType: ConservationDocument['type'] = 'article';
      if (text.toLowerCase().includes('report')) docType = 'report';
      else if (text.toLowerCase().includes('guide')) docType = 'guide';
      else if (text.toLowerCase().includes('study') || text.toLowerCase().includes('research')) docType = 'study';
      else if (text.toLowerCase().includes('data') || text.toLowerCase().includes('dataset')) docType = 'data';
      else if (text.toLowerCase().includes('map')) docType = 'map';

      // Extract topics from surrounding text
      const parentText = $link.parent().text().toLowerCase();
      const topics: string[] = [];
      const keywords = ['habitat', 'restoration', 'water', 'stream', 'lake', 'fish', 'trout', 'watershed', 'conservation'];
      keywords.forEach(keyword => {
        if (parentText.includes(keyword)) topics.push(keyword);
      });

      documents.push({
        organization,
        title: text,
        url: fullUrl,
        type: docType,
        topics,
        fileType: isPDF ? 'pdf' : isDoc ? (href.match(/\.(doc|docx)$/) ? 'doc' : 'xls') : undefined,
        description: $link.parent().next().text().trim().substring(0, 200),
      });
    }
  });

  return documents;
}

/**
 * Scrape organization website
 */
async function scrapeOrganization(group: typeof CONSERVATION_GROUPS[0]): Promise<ConservationDocument[]> {
  console.log(`📚 Scraping ${group.name}...`);

  const allDocuments: ConservationDocument[] = [];

  for (const searchPath of group.searchPaths) {
    try {
      const url = `${group.baseUrl}${searchPath}`;
      console.log(`  Fetching ${url}...`);

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; WLA_App/1.0)',
        },
      });

      if (!response.ok) {
        console.log(`  ⚠️  HTTP ${response.status} for ${url}`);
        continue;
      }

      const html = await response.text();
      const documents = extractDocuments(html, url, group.name);
      allDocuments.push(...documents);

      console.log(`  ✅ Found ${documents.length} documents`);
    } catch (error) {
      console.error(`  ❌ Error scraping ${searchPath}:`, error);
    }

    // Rate limiting
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return allDocuments;
}

/**
 * Main scraping function
 */
async function main() {
  console.log('🚀 Starting conservation documentation scraping...\n');

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const allDocuments: ConservationDocument[] = [];

  // Scrape each organization
  for (const group of CONSERVATION_GROUPS) {
    const documents = await scrapeOrganization(group);
    allDocuments.push(...documents);
  }

  // Remove duplicates (same URL)
  const uniqueDocuments = Array.from(
    new Map(allDocuments.map(doc => [doc.url, doc])).values()
  );

  // Save results
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'conservation-documents.json'),
    JSON.stringify(uniqueDocuments, null, 2)
  );

  // Create summary by organization
  const summary = {
    scrapedAt: new Date().toISOString(),
    totalDocuments: uniqueDocuments.length,
    byOrganization: Object.fromEntries(
      CONSERVATION_GROUPS.map(group => [
        group.name,
        uniqueDocuments.filter(doc => doc.organization === group.name).length,
      ])
    ),
    byType: {
      report: uniqueDocuments.filter(doc => doc.type === 'report').length,
      guide: uniqueDocuments.filter(doc => doc.type === 'guide').length,
      study: uniqueDocuments.filter(doc => doc.type === 'study').length,
      article: uniqueDocuments.filter(doc => doc.type === 'article').length,
      data: uniqueDocuments.filter(doc => doc.type === 'data').length,
      map: uniqueDocuments.filter(doc => doc.type === 'map').length,
    },
  };

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'scraping-summary.json'),
    JSON.stringify(summary, null, 2)
  );

  console.log('\n✅ Conservation documentation scraping complete!');
  console.log(`📊 Summary:`);
  console.log(`   Total Documents: ${uniqueDocuments.length}`);
  Object.entries(summary.byOrganization).forEach(([org, count]) => {
    console.log(`   ${org}: ${count}`);
  });
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { scrapeOrganization, extractDocuments };



