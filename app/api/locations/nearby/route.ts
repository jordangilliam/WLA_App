import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/client';
import type { Track } from '@/lib/types/lesson.types';

export const dynamic = 'force-dynamic';

type FieldSiteDetail = {
  id: string;
  description?: string;
  site_type?: string;
  address?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  ecological_notes?: string;
  species_commonly_found?: string[];
  habitat_types?: string[];
  accessibility_notes?: string;
  educational_value?: string;
  difficulty_level?: string;
};

type PfbcAccessPoint = {
  id: string;
  waterwayName: string;
  name: string;
  accessType: string;
  county: string;
  region: string;
  latitude?: number;
  longitude?: number;
  amenities: string[];
  parking: boolean;
  wheelchairAccessible: boolean;
  notes?: string;
};

type PfbcStocking = {
  id: string;
  waterwayName: string;
  county: string;
  region: string;
  species: string;
  stockingDate: string;
  quantity: number;
  sizeClass: string;
  averageLength?: number;
};

const WATER_KEYWORDS = ['stream', 'creek', 'river', 'run', 'lake', 'pond', 'reservoir', 'falls', 'harbor'];
const BROOKIES_KEYWORDS = ['brook trout', 'wild trout', 'class a', 'coldwater', 'spring creek'];
const BASS_KEYWORDS = ['bass', 'warm water', 'reservoir', 'lake', 'muskie', 'walleye'];
const TURKEY_KEYWORDS = ['grouse', 'turkey', 'pheasant', 'upland', 'game lands'];
const BEAR_KEYWORDS = ['bear', 'black bear', 'denning', 'big woods'];
const FOOD_KEYWORDS = ['garden', 'agriculture', 'farm', 'orchard', 'pollinator', 'urban farm', 'food'];
const MICRO_KEYWORDS = ['macroinvertebrate', 'macro', 'water sample', 'lab', 'chemistry', 'habitat simulator'];
const INDUSTRY_KEYWORDS = ['museum', 'library', 'heritage', 'historic', 'industrial', 'mill', 'manufacturing', 'steel', 'bridge'];
const HISTORY_KEYWORDS = ['historic', 'heritage', 'interpretive', 'native', 'tribal', 'underground railroad', 'battlefield'];

const REGION_CITY_MAP: Record<string, string[]> = {
  Pittsburgh: ['pittsburgh', 'butler', 'washington', 'beaver', 'cranberry', 'mcmurray'],
  Philadelphia: ['philadelphia', 'chester', 'montgomery', 'delaware county', 'phoenixville'],
  'Lehigh Valley': ['allentown', 'bethlehem', 'easton', 'lehigh', 'carbon'],
  Harrisburg: ['harrisburg', 'mechanicsburg', 'carlisle', 'camp hill', 'lebanon'],
  Central: ['state college', 'centre', 'lewisburg', 'huntingdon', 'altoona'],
  Erie: ['erie', 'meadville', 'edmore', 'north east'],
  Northeast: ['scranton', 'wilkes-barre', 'hazleton', 'stroudsburg'],
};

const DEFAULT_REGION = 'Statewide';

const TRACK_VALUES: Track[] = ['Brookies', 'Bass', 'Bucktails', 'Gobblers', 'Ursids', 'All'];

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const radius = parseFloat(searchParams.get('radius') || '50000'); // 50km default

    // Validate coordinates
    if (!lat || !lng || lat === 0 || lng === 0) {
      return NextResponse.json(
        { error: 'Valid latitude and longitude required' },
        { status: 400 }
      );
    }

    // Check database connection
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    // Use the nearby_field_sites database function
    const { data: sites, error } = await supabaseAdmin.rpc(
      'nearby_field_sites',
      {
        user_lat: lat,
        user_lng: lng,
        radius_meters: radius,
      } as never
    );

    if (error) {
      console.error('Error fetching nearby sites:', error);
      return NextResponse.json(
        { error: 'Failed to fetch nearby sites' },
        { status: 500 }
      );
    }

    const siteList = (sites as any[] | null) || [];
    const siteIds = siteList.map((site) => site.id);

    let detailLookup = new Map<string, FieldSiteDetail>();
    let pfbcAccessMap = new Map<string, PfbcAccessPoint[]>();
    let pfbcStockingMap = new Map<string, PfbcStocking[]>();

    if (siteIds.length > 0) {
      const { data: details, error: detailError } = await supabaseAdmin
        .from('field_sites')
        .select(
          [
            'id',
            'description',
            'site_type',
            'address',
            'city',
            'state',
            'latitude',
            'longitude',
            'ecological_notes',
            'species_commonly_found',
            'habitat_types',
            'accessibility_notes',
            'educational_value',
            'difficulty_level',
          ].join(',')
        )
        .in('id', siteIds);

      if (detailError) {
        console.warn('Unable to load full field site details', detailError);
      } else if (details) {
        details.forEach((detail: FieldSiteDetail) => {
          detailLookup.set(detail.id, detail);
        });
      }

      // Fetch PFBC data but fail gracefully if tables are unavailable
      try {
        const { data: accessData } = await supabaseAdmin
          .from('pfbc_access_points')
          .select(
            [
              'id',
              'field_site_id',
              'waterway_name',
              'name',
              'access_type',
              'county',
              'region',
              'latitude',
              'longitude',
              'amenities',
              'parking',
              'wheelchair_accessible',
              'notes',
            ].join(',')
          )
          .in('field_site_id', siteIds);

        accessData?.forEach((point: any) => {
          if (!point.field_site_id) return;
          const normalized: PfbcAccessPoint = {
            id: point.id,
            waterwayName: point.waterway_name,
            name: point.name,
            accessType: point.access_type,
            county: point.county,
            region: point.region,
            latitude: point.latitude,
            longitude: point.longitude,
            amenities: point.amenities || [],
            parking: Boolean(point.parking),
            wheelchairAccessible: Boolean(point.wheelchair_accessible),
            notes: point.notes || undefined,
          };

          const list = pfbcAccessMap.get(point.field_site_id) || [];
          list.push(normalized);
          pfbcAccessMap.set(point.field_site_id, list);
        });
      } catch (pfbcAccessError) {
        console.warn('PFBC access points unavailable', pfbcAccessError);
      }

      try {
        const { data: stockingData } = await supabaseAdmin
          .from('pfbc_stocking_schedules')
          .select(
            [
              'id',
              'field_site_id',
              'waterway_name',
              'county',
              'region',
              'species',
              'stocking_date',
              'quantity',
              'size_class',
              'average_length',
            ].join(',')
          )
          .in('field_site_id', siteIds);

        stockingData?.forEach((row: any) => {
          if (!row.field_site_id) return;
          const normalized: PfbcStocking = {
            id: row.id,
            waterwayName: row.waterway_name,
            county: row.county,
            region: row.region,
            species: row.species,
            stockingDate: row.stocking_date,
            quantity: row.quantity,
            sizeClass: row.size_class,
            averageLength: row.average_length || undefined,
          };
          const list = pfbcStockingMap.get(row.field_site_id) || [];
          list.push(normalized);
          pfbcStockingMap.set(row.field_site_id, list);
        });
      } catch (pfbcStockingError) {
        console.warn('PFBC stocking data unavailable', pfbcStockingError);
      }
    }

    const transformedSites = siteList.map((site: any) => {
      const fullSite = detailLookup.get(site.id);

      const description = fullSite?.description || site.description;
      const siteType = fullSite?.site_type || site.site_type;
      const city = fullSite?.city || site.city || 'Unknown';
      const state = fullSite?.state || site.state || 'PA';
      const latitude = fullSite?.latitude ?? site.latitude;
      const longitude = fullSite?.longitude ?? site.longitude;
      const speciesArray = fullSite?.species_commonly_found || [];
      const habitatArray = fullSite?.habitat_types || [];

      const textContext = [
        site.name,
        description,
        fullSite?.ecological_notes,
        speciesArray.join(' '),
        habitatArray.join(' '),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const trackTags = deriveTrackTags(textContext, siteType);
      const pillarTags = derivePillarTags(textContext, siteType, trackTags);
      const rarity = deriveRarity(siteType, trackTags, pillarTags);
      const region = deriveRegion(city);

      return {
        id: site.id,
        name: site.name,
        description,
        site_type: siteType,
        address: fullSite?.address || site.address,
        city,
        state,
        distance_meters: site.distance_meters,
        visit_count: site.visit_count || 0,
        latitude,
        longitude,
        ecological_notes: fullSite?.ecological_notes,
        species_likely: speciesArray,
        speciesCommonlyFound: speciesArray,
        habitat_type: habitatArray.join(', '),
        habitatTypes: habitatArray,
        accessibility_notes: fullSite?.accessibility_notes,
        educational_value: fullSite?.educational_value,
        difficulty_level: fullSite?.difficulty_level,
        trackTags,
        pillarTags,
        rarity,
        region,
        pfbcAccessPoints: pfbcAccessMap.get(site.id) || [],
        pfbcStockings: pfbcStockingMap.get(site.id) || [],
      };
    });

    return NextResponse.json({
      success: true,
      sites: transformedSites,
      count: transformedSites.length,
      userLocation: { latitude: lat, longitude: lng },
      radius: radius,
    });
  } catch (error) {
    console.error('Error in nearby locations API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function deriveTrackTags(text: string, siteType?: string): Track[] {
  const tags = new Set<Track>();

  if (matchesAny(text, BROOKIES_KEYWORDS) || matchesAny(siteType, ['stream', 'creek'])) {
    tags.add('Brookies');
  }

  if (matchesAny(text, BASS_KEYWORDS) || matchesAny(siteType, ['lake', 'reservoir', 'marina'])) {
    tags.add('Bass');
  }

  if (matchesAny(text, BEAR_KEYWORDS) || matchesAny(siteType, ['forest', 'wildlife area'])) {
    tags.add('Ursids');
  }

  if (matchesAny(text, TURKEY_KEYWORDS) || matchesAny(siteType, ['game lands', 'upland'])) {
    tags.add('Gobblers');
  }

  if (siteType && siteType.includes('park')) {
    tags.add('Bucktails');
  }

  if (tags.size === 0) {
    tags.add('All');
  }

  return Array.from(tags);
}

function derivePillarTags(text: string, siteType: string | undefined, trackTags: Track[]): string[] {
  const tags = new Set<string>();
  tags.add('species');

  if (
    trackTags.includes('Brookies') ||
    matchesAny(text, WATER_KEYWORDS) ||
    (siteType && /water|river|lake/i.test(siteType))
  ) {
    tags.add('waterways');
  }

  if (matchesAny(text, FOOD_KEYWORDS) || (siteType && siteType.includes('garden'))) {
    tags.add('food_systems');
  }

  if (matchesAny(text, MICRO_KEYWORDS)) {
    tags.add('micro_macro');
  }

  if (matchesAny(text, INDUSTRY_KEYWORDS) || (siteType && /museum|library|heritage|landmark/i.test(siteType))) {
    tags.add('industry_artifacts');
  }

  if (matchesAny(text, HISTORY_KEYWORDS)) {
    tags.add('history');
  }

  return Array.from(tags);
}

function deriveRarity(siteType: string | undefined, trackTags: Track[], pillarTags: string[]): string {
  if (pillarTags.includes('industry_artifacts') || pillarTags.includes('history')) {
    return 'epic';
  }

  if (siteType && siteType.includes('state_park')) {
    return 'rare';
  }

  if (trackTags.includes('Brookies') && pillarTags.includes('waterways')) {
    return 'rare';
  }

  if (pillarTags.length >= 3) {
    return 'uncommon';
  }

  return 'common';
}

function deriveRegion(city?: string): string {
  if (!city) return DEFAULT_REGION;
  const normalized = city.toLowerCase();
  for (const [region, cities] of Object.entries(REGION_CITY_MAP)) {
    if (cities.some((candidate) => normalized.includes(candidate))) {
      return region;
    }
  }
  return DEFAULT_REGION;
}

function matchesAny(text: string | undefined, keywords: string[]): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return keywords.some((keyword) => lower.includes(keyword));
}
