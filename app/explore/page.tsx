'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import InteractiveMap, { MapFieldSite } from '@/components/map/InteractiveMap';
import SiteFilters from '@/components/map/SiteFilters';
import NearbySitesList from '@/components/map/NearbySitesList';
import CheckInButton from '@/components/map/CheckInButton';
import { useGeolocation } from '@/lib/hooks/useGeolocation';
import type { Track } from '@/lib/types/lesson.types';
import type { CheckInResultPayload } from '@/components/checkin/CheckInFlow';

type PfbcAccessPoint = {
  id: string;
  waterwayName: string;
  name: string;
  accessType: string;
  county: string;
  region: string;
  latitude?: number;
  longitude?: number;
  amenities?: string[];
  parking?: boolean;
  wheelchairAccessible?: boolean;
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

type FieldSite = MapFieldSite & {
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  ecological_notes?: string;
  species_likely?: string[];
  speciesCommonlyFound?: string[];
  habitat_type?: string;
  habitatTypes?: string[];
  accessibility_notes?: string;
  educational_value?: string;
  difficulty_level?: string;
  trackTags?: string[];
  pillarTags?: string[];
  rarity?: string;
  region?: string;
  pfbcAccessPoints?: PfbcAccessPoint[];
  pfbcStockings?: PfbcStocking[];
};

type ExploreFilters = {
  siteType: string;
  maxDistance: number;
  searchQuery: string;
  trackTags: string[];
  pillarTags: string[];
};

type FilterChip = {
  value: string;
  label: string;
  icon: string;
  count: number;
};

type PillarRecommendation = {
  id: string;
  name: string;
  type: string;
  path: string;
  coverageTags: string[];
  pillarId: string;
  pillarTitle: string;
  pillarDescription?: string;
  pillarTracks: (string | Track)[];
};

type CheckInCelebration = {
  siteName: string;
  pointsEarned: number;
  isFirstVisit: boolean;
  message?: string;
  achievements?: string[];
};

const TRACK_FILTERS_BASE = [
  { value: 'Brookies', label: 'Brookies', icon: '🎣' },
  { value: 'Bass', label: 'Bass', icon: '🐟' },
  { value: 'Bucktails', label: 'Bucktails', icon: '🦌' },
  { value: 'Gobblers', label: 'Gobblers', icon: '🦃' },
  { value: 'Ursids', label: 'Ursids', icon: '🐻' },
];

const PILLAR_FILTERS_BASE = [
  { value: 'species', label: 'Species', icon: '🦌' },
  { value: 'waterways', label: 'Waterways', icon: '🌊' },
  { value: 'food_systems', label: 'Food Systems', icon: '🌽' },
  { value: 'micro_macro', label: 'Micro/Macro', icon: '🧪' },
  { value: 'industry_artifacts', label: 'Industry', icon: '🏭' },
  { value: 'history', label: 'History', icon: '📜' },
];

function computeFilterChips(
  base: Array<{ value: string; label: string; icon: string }>,
  sites: FieldSite[],
  mode: 'track' | 'pillar'
): FilterChip[] {
  return base.map((chip) => ({
    ...chip,
    count:
      mode === 'track'
        ? sites.filter((site) => site.trackTags?.includes(chip.value)).length
        : sites.filter((site) => site.pillarTags?.includes(chip.value)).length,
  }));
}

function formatRecommendationType(type: string): string {
  const formatMap: Record<string, string> = {
    lesson_collection: 'Lesson Collection',
    classroom_lesson: 'Classroom Lesson',
    experience: 'Action Studio',
    data_set: 'Data Pack',
    service: 'Service Opportunity',
    doc: 'Guide',
    media_collection: 'Media Pack',
  };
  return formatMap[type] || type.replace(/_/g, ' ');
}

function resolveRecommendationLink(path: string, type: string): string {
  if (!path) return '/learn';
  if (path.startsWith('/')) return path;
  if (path.startsWith('app/')) {
    let normalized = path.replace(/^app/, '');
    normalized = normalized.replace(/\/page(\.tsx)?$/, '');
    if (normalized.length === 0) return '/';
    return normalized.startsWith('/') ? normalized : `/${normalized}`;
  }
  if (type.includes('lesson')) {
    return '/learn';
  }
  return '/explore';
}

function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((value, index) => value === sortedB[index]);
}

export default function ExplorePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { location, error: locationError, isLoading: locationLoading } = useGeolocation();
  const ICONS = useMemo(
    () => ({
      compass: '/images/icons/Map.jpg',
      habitat: '/images/icons/Habitat.png',
      macro: '/images/icons/Micor(Macro).png',
      journal: '/images/icons/journal.jpg',
      award: '/images/icons/award.jpg',
    }),
    []
  );
  
  const [sites, setSites] = useState<FieldSite[]>([]);
  const [filteredSites, setFilteredSites] = useState<FieldSite[]>([]);
  const [selectedSite, setSelectedSite] = useState<FieldSite | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ExploreFilters>({
    siteType: 'all',
    maxDistance: 50000, // 50km default
    searchQuery: '',
    trackTags: [],
    pillarTags: [],
  });
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [recommendations, setRecommendations] = useState<PillarRecommendation[]>([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [missions, setMissions] = useState<any[]>([]);
  const [missionsLoading, setMissionsLoading] = useState(false);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [challengesLoading, setChallengesLoading] = useState(false);
  const [checkInCelebration, setCheckInCelebration] = useState<CheckInCelebration | null>(null);
  const celebrationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const trackFilters = useMemo<FilterChip[]>(
    () => computeFilterChips(TRACK_FILTERS_BASE, sites, 'track'),
    [sites]
  );
  const pillarFilters = useMemo<FilterChip[]>(
    () => computeFilterChips(PILLAR_FILTERS_BASE, sites, 'pillar'),
    [sites]
  );
  const sendTelemetry = useCallback(async (eventType: string, payload: Record<string, any>) => {
    try {
      await fetch('/api/telemetry/explore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType, payload }),
      });
    } catch (error) {
      console.warn('Telemetry send failed', error);
    }
  }, []);
  const previousFiltersRef = useRef<ExploreFilters | null>(null);

  const fetchNearbySites = useCallback(async (lat: number, lng: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/locations/nearby?lat=${lat}&lng=${lng}&radius=${filters.maxDistance}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch sites');
      }

      const data = await response.json();
      setSites((data.sites || []) as FieldSite[]);
    } catch (error) {
      console.error('Error fetching nearby sites:', error);
    } finally {
      setLoading(false);
    }
  }, [filters.maxDistance]);

  const applyFilters = useCallback(() => {
    let filtered = [...sites];

    // Filter by site type
    if (filters.siteType !== 'all') {
      filtered = filtered.filter((site) => site.site_type === filters.siteType);
    }

    // Filter by search query
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (site) =>
          site.name.toLowerCase().includes(query) ||
          site.city?.toLowerCase().includes(query) ||
          site.description?.toLowerCase().includes(query)
      );
    }

    // Filter by distance
    filtered = filtered.filter(
      (site) => !site.distance_meters || site.distance_meters <= filters.maxDistance
    );

    if (filters.trackTags.length > 0) {
      filtered = filtered.filter((site) =>
        site.trackTags?.some((tag) => filters.trackTags.includes(tag))
      );
    }

    if (filters.pillarTags.length > 0) {
      filtered = filtered.filter((site) =>
        site.pillarTags?.some((tag) => filters.pillarTags.includes(tag))
      );
    }

    // Sort by distance
    filtered.sort((a, b) => {
      if (!a.distance_meters) return 1;
      if (!b.distance_meters) return -1;
      return a.distance_meters - b.distance_meters;
    });

    setFilteredSites(filtered);
  }, [sites, filters]);

  // Fetch nearby sites when location changes
  useEffect(() => {
    if (location) {
      fetchNearbySites(location.latitude, location.longitude);
    }
  }, [location, fetchNearbySites]);

  useEffect(() => {
    return () => {
      if (celebrationTimeoutRef.current) {
        clearTimeout(celebrationTimeoutRef.current);
      }
    };
  }, []);

  // Apply filters when sites or filters change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

// Telemetry for filter usage
useEffect(() => {
  if (!previousFiltersRef.current) {
    previousFiltersRef.current = filters;
    return;
  }

  const prev = previousFiltersRef.current;
  const trackChanged = !arraysEqual(prev.trackTags, filters.trackTags);
  const pillarChanged = !arraysEqual(prev.pillarTags, filters.pillarTags);
  const siteTypeChanged = prev.siteType !== filters.siteType;
  const distanceChanged = prev.maxDistance !== filters.maxDistance;

  if (trackChanged || pillarChanged || siteTypeChanged || distanceChanged) {
    sendTelemetry('explore_filters', {
      siteType: filters.siteType,
      maxDistance: filters.maxDistance,
      trackTags: filters.trackTags,
      pillarTags: filters.pillarTags,
    });
  }

  previousFiltersRef.current = filters;
}, [filters, sendTelemetry]);

  // Load pillar recommendations when site changes
  useEffect(() => {
    let cancelled = false;

    if (!selectedSite) {
      setRecommendations([]);
      setRecommendationsLoading(false);
      setMissions([]);
      setMissionsLoading(false);
      setChallenges([]);
      setChallengesLoading(false);
      return;
    }

    const tags = Array.from(
      new Set([...(selectedSite.pillarTags || []), ...(selectedSite.trackTags || [])])
    );

    // Load pillar recommendations
    if (tags.length > 0) {
      setRecommendationsLoading(true);
      const params = new URLSearchParams();
      params.set('tags', tags.join(','));
      params.set('limit', '8');

      fetch(`/api/pillars?${params.toString()}`)
        .then((res) => res.json())
        .then((payload) => {
          if (cancelled) return;
          setRecommendations((payload.recommendations || []) as PillarRecommendation[]);
        })
        .catch((error) => {
          if (!cancelled) {
            console.error('Failed to load pillar recommendations', error);
            setRecommendations([]);
          }
        })
        .finally(() => {
          if (!cancelled) setRecommendationsLoading(false);
        });
    } else {
      setRecommendations([]);
      setRecommendationsLoading(false);
    }

    // Load missions for this site
    setMissionsLoading(true);
    fetch(`/api/field-sites/${selectedSite.id}/missions`)
      .then((res) => res.json())
      .then((payload) => {
        if (cancelled) return;
        setMissions(payload.missions || []);
      })
      .catch((error) => {
        if (!cancelled) {
          console.error('Failed to load missions', error);
          setMissions([]);
        }
      })
      .finally(() => {
        if (!cancelled) setMissionsLoading(false);
      });

    // Load challenges for this site
    setChallengesLoading(true);
    fetch(`/api/field-sites/${selectedSite.id}/challenges`)
      .then((res) => res.json())
      .then((payload) => {
        if (cancelled) return;
        setChallenges(payload.challenges || []);
      })
      .catch((error) => {
        if (!cancelled) {
          console.error('Failed to load challenges', error);
          setChallenges([]);
        }
      })
      .finally(() => {
        if (!cancelled) setChallengesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedSite]);

  const handleSiteSelect = (site: FieldSite) => {
    setSelectedSite(site);
  };

  const handleCheckInSuccess = useCallback(
    (result?: CheckInResultPayload) => {
      if (location) {
        fetchNearbySites(location.latitude, location.longitude);
      }

      if (selectedSite && result) {
        if (celebrationTimeoutRef.current) {
          clearTimeout(celebrationTimeoutRef.current);
        }

        setCheckInCelebration({
          siteName: selectedSite.name,
          pointsEarned: result.pointsEarned ?? 0,
          isFirstVisit: Boolean(result.isFirstVisit),
          message: result.message,
          achievements: result.newAchievements
            ?.map((achievement) => achievement?.title || achievement?.achievementId)
            .filter(Boolean) as string[] | undefined,
        });

        celebrationTimeoutRef.current = setTimeout(() => {
          setCheckInCelebration(null);
        }, 6000);

        sendTelemetry('explore_check_in', {
          siteId: selectedSite.id,
          trackTags: selectedSite.trackTags,
          pillarTags: selectedSite.pillarTags,
          pointsEarned: result.pointsEarned ?? 0,
          firstVisit: Boolean(result.isFirstVisit),
        });
      }
    },
    [fetchNearbySites, location, selectedSite, sendTelemetry]
  );

  // Calculate derived values using useMemo (must be before any conditional returns)
  const totalSites = useMemo(() => filteredSites.length, [filteredSites]);
  const libraryCount = useMemo(
    () => sites.filter((s) => s.site_type === 'library').length,
    [sites]
  );
  const parkCount = useMemo(
    () => sites.filter((s) => s.site_type === 'park' || s.site_type === 'state_park').length,
    [sites]
  );
  const troutCount = useMemo(
    () =>
      sites.filter((s) => {
        const habitat = s.habitat_type?.toLowerCase() || '';
        return (
          s.trackTags?.includes('Brookies') ||
          s.pillarTags?.includes('waterways') ||
          habitat.includes('trout')
        );
      }).length,
    [sites]
  );
  const reachableSites = useMemo(
    () =>
      filteredSites.filter(
        (site) => typeof site.distance_meters === 'number' && site.distance_meters <= 200
      ),
    [filteredSites]
  );

  // Redirect to auth if not logged in (after all hooks)
  if (status === 'unauthenticated') {
    router.push('/auth?callbackUrl=/explore');
    return null;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at 15% 20%, rgba(29,166,219,0.2), transparent 45%), radial-gradient(circle at 80% 0%, rgba(234,126,55,0.2), transparent 50%), #F8FAFF',
        paddingBottom: '4rem',
      }}
    >
      {checkInCelebration && (
        <div
          style={{
            maxWidth: '900px',
            margin: '1rem auto 0',
            background: 'linear-gradient(120deg, #10B981, #059669)',
            color: 'white',
            borderRadius: '20px',
            padding: '1.5rem',
            boxShadow: '0 20px 45px rgba(16,185,129,0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div style={{ fontSize: '2rem' }}>🎉</div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem' }}>
              {checkInCelebration.siteName}
            </p>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
              Earned {checkInCelebration.pointsEarned} conservation points
              {checkInCelebration.isFirstVisit ? ' · First visit!' : ''}
            </p>
            {checkInCelebration.achievements && checkInCelebration.achievements.length > 0 && (
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', opacity: 0.85 }}>
                New achievements: {checkInCelebration.achievements.join(', ')}
              </p>
            )}
          </div>
          <button
            onClick={() => setCheckInCelebration(null)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '999px',
              color: 'white',
              padding: '0.35rem 0.9rem',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Close
          </button>
        </div>
      )}

      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '28px',
          margin: '1.5rem auto',
          padding: '3.5rem 2rem',
          maxWidth: '1200px',
          color: 'white',
          background: 'linear-gradient(135deg, #023047 0%, #0077B6 50%, #0096C7 100%)',
          boxShadow: '0 25px 60px rgba(2,48,71,0.35)',
        }}
      >
        <Image
          src="/images/hero/Hero BAckground.jpg"
          alt="PA waters background"
          fill
          priority
          style={{ objectFit: 'cover', opacity: 0.15 }}
        />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <p
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 1.6rem',
              background: 'rgba(255, 214, 10, 0.9)',
              color: '#053047',
              borderRadius: '999px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}
          >
            <Image src={ICONS.compass} alt="Compass icon" width={28} height={28} style={{ borderRadius: '8px' }} />
            Field Site Explorer
          </p>
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 4vw, 3.8rem)',
              fontWeight: 900,
              marginBottom: '1rem',
              textShadow: '0 10px 35px rgba(0,0,0,0.35)',
            }}
          >
            Discover Conservation Hotspots Across Pennsylvania
          </h1>
          <p
            style={{
              fontSize: '1.2rem',
              maxWidth: '720px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            Enable location to get a personalized map of WLA-approved libraries, parks, trout waters, and study sites.
            Check in, log habitat data, and earn conservation points along the way.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1.5rem',
              padding: '1.75rem',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '22px',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {[
              { label: 'Sites Nearby', value: totalSites || '—' },
              { label: 'Libraries', value: libraryCount },
              { label: 'Parks', value: parkCount },
              { label: 'Trout Waters', value: troutCount },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{ fontSize: '2.4rem', fontWeight: 900 }}>{stat.value}</div>
                <div style={{ opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        <div
          style={{
            background: 'white',
            borderRadius: '24px',
            padding: '1.75rem',
            boxShadow: '0 20px 50px rgba(15,23,42,0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#023047', margin: 0 }}>Filter & View Modes</h2>
                <p style={{ color: '#5E6A82', marginTop: '0.3rem' }}>
                  Use adaptive filters to find sites that match your conservation mission.
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '0.6rem',
                  background: '#F1F5F9',
                  padding: '0.4rem',
                  borderRadius: '999px',
                }}
              >
                {[
                  { key: 'map', label: 'Map View', icon: ICONS.compass },
                  { key: 'list', label: 'List View', icon: ICONS.journal },
                ].map((option) => {
                  const active = viewMode === option.key;
                  return (
                    <button
                      key={option.key}
                      onClick={() => setViewMode(option.key as 'map' | 'list')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        border: 'none',
                        borderRadius: '999px',
                        padding: '0.35rem 1rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: active ? '#063F5C' : 'transparent',
                        color: active ? 'white' : '#0F172A',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Image src={option.icon} alt={option.label} width={20} height={20} style={{ borderRadius: '6px' }} />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <SiteFilters
              filters={filters}
              onFiltersChange={setFilters}
              siteCount={filteredSites.length}
              trackFilters={trackFilters}
              pillarFilters={pillarFilters}
            />
          </div>
        </div>

        {location && reachableSites.length > 0 && (
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '1.25rem',
              boxShadow: '0 15px 35px rgba(15,23,42,0.08)',
              border: '1px solid rgba(148,163,184,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>Within 200 meters</h3>
              <span style={{ fontSize: '0.85rem', color: '#475569' }}>
                {reachableSites.length} site{reachableSites.length !== 1 ? 's' : ''} nearby
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
              {reachableSites.slice(0, 3).map((site) => (
                <div
                  key={site.id}
                  style={{
                    minWidth: '220px',
                    background: '#F8FAFC',
                    borderRadius: '16px',
                    padding: '0.9rem',
                    border: '1px solid rgba(148,163,184,0.3)',
                  }}
                >
                  <p style={{ margin: 0, fontWeight: 600, color: '#0F172A' }}>{site.name}</p>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.9rem', color: '#475569' }}>
                    {Math.round(site.distance_meters!)}m away
                  </p>
                  <button
                    onClick={() => setSelectedSite(site)}
                    style={{
                      marginTop: '0.6rem',
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(120deg,#0EA5E9,#2563EB)',
                      color: 'white',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Focus &amp; Check In
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {locationError && (
          <div
            style={{
              background: 'linear-gradient(120deg, #FFF4CC, #FFE9A1)',
              borderRadius: '20px',
              padding: '1.5rem',
              border: '1px solid rgba(253, 186, 116, 0.5)',
              boxShadow: '0 10px 30px rgba(253, 186, 116, 0.3)',
            }}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Image src={ICONS.award} alt="Warning icon" width={48} height={48} style={{ borderRadius: '12px' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#8C4A03' }}>Location Access Needed</h3>
                <p style={{ margin: '0.3rem 0 0', color: '#7C5B11', lineHeight: 1.5 }}>
                  {locationError}. Enable location services to unlock nearby site recommendations and check-ins.
                </p>
              </div>
            </div>
          </div>
        )}

        {loading || locationLoading ? (
          <div
            style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '24px',
              boxShadow: '0 20px 50px rgba(15,23,42,0.08)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)', backgroundSize: '200% 100%', animation: 'skeleton-loading 1.5s ease-in-out infinite' }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ width: '70%', height: '1.25rem', borderRadius: '8px', background: 'linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)', backgroundSize: '200% 100%', animation: 'skeleton-loading 1.5s ease-in-out infinite' }} />
                  <div style={{ width: '50%', height: '1rem', borderRadius: '8px', background: 'linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)', backgroundSize: '200% 100%', animation: 'skeleton-loading 1.5s ease-in-out infinite' }} />
                </div>
              </div>
              <div style={{ width: '100%', height: '200px', borderRadius: '12px', background: 'linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)', backgroundSize: '200% 100%', animation: 'skeleton-loading 1.5s ease-in-out infinite' }} />
            </div>
          </div>
        ) : filteredSites.length === 0 ? (
          <div
            style={{
              background: 'white',
              padding: '3rem',
              borderRadius: '24px',
              boxShadow: '0 20px 50px rgba(15,23,42,0.08)',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🗺️</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem' }}>
                No sites found
              </h3>
              <p style={{ fontSize: '1rem', color: '#64748B', maxWidth: '500px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
                {filters.searchQuery || filters.trackTags.length > 0 || filters.pillarTags.length > 0
                  ? 'Try adjusting your filters or search terms to find more sites.'
                  : 'Enable location services to discover field sites near you, or browse all sites on the map.'}
              </p>
              {(filters.searchQuery || filters.trackTags.length > 0 || filters.pillarTags.length > 0) && (
                <button
                  onClick={() => setFilters({ siteType: 'all', maxDistance: 50000, searchQuery: '', trackTags: [], pillarTags: [] })}
                  style={{
                    padding: '0.875rem 1.75rem',
                    background: '#0EA5E9',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 600,
                    fontSize: '1rem',
                    cursor: 'pointer',
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: viewMode === 'map' ? 'minmax(0, 1fr) 380px' : '1fr',
              gap: '1.5rem',
              alignItems: 'flex-start',
            }}
          >
            {viewMode === 'map' ? (
              <>
                <div
                  style={{
                    background: 'white',
                    borderRadius: '28px',
                    padding: '1rem',
                    minHeight: '620px',
                    boxShadow: '0 20px 60px rgba(2,48,71,0.12)',
                  }}
                >
                  <InteractiveMap
                    sites={filteredSites}
                    userLocation={location}
                    selectedSite={selectedSite}
                    onSiteSelect={handleSiteSelect}
                  />
                </div>

                <div style={{ position: 'sticky', top: '1.5rem' }}>
                  {selectedSite ? (
                    <div
                      style={{
                        background: 'white',
                        borderRadius: '24px',
                        padding: '1.75rem',
                        boxShadow: '0 20px 50px rgba(15,23,42,0.1)',
                      }}
                    >
                      <button
                        onClick={() => setSelectedSite(null)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#64748B',
                          fontWeight: 600,
                          marginBottom: '1rem',
                          cursor: 'pointer',
                        }}
                      >
                        ← Back to nearby list
                      </button>
                      <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#012A3A' }}>{selectedSite.name}</h2>
                      <p style={{ margin: '0.5rem 0 1rem', color: '#475569' }}>{selectedSite.description}</p>

                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            padding: '0.35rem 1rem',
                            borderRadius: '999px',
                            background: 'rgba(16,185,129,0.12)',
                            color: '#047857',
                            fontWeight: 600,
                          }}
                        >
                          {selectedSite.site_type}
                        </span>
                        {selectedSite.distance_meters && (
                          <span
                            style={{
                              padding: '0.35rem 1rem',
                              borderRadius: '999px',
                              background: 'rgba(14,165,233,0.12)',
                              color: '#0369A1',
                              fontWeight: 600,
                            }}
                          >
                            {(selectedSite.distance_meters / 1000).toFixed(1)} km away
                          </span>
                        )}
                          {selectedSite.rarity && (
                            <span
                              style={{
                                padding: '0.35rem 1rem',
                                borderRadius: '999px',
                                background: 'rgba(234,179,8,0.15)',
                                color: '#92400E',
                                fontWeight: 600,
                                textTransform: 'capitalize',
                              }}
                            >
                              {selectedSite.rarity} rarity
                            </span>
                          )}
                      </div>

                      {selectedSite.trackTags && selectedSite.trackTags.length > 0 && (
                        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', marginTop: '1rem' }}>
                          <h4 style={{ margin: 0, fontWeight: 700, color: '#012A3A' }}>🏅 Track Highlights</h4>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                            {selectedSite.trackTags.map((tag) => (
                              <span
                                key={tag}
                                style={{
                                  padding: '0.3rem 0.9rem',
                                  borderRadius: '999px',
                                  background: 'rgba(16,185,129,0.15)',
                                  color: '#047857',
                                  fontWeight: 600,
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedSite.pillarTags && selectedSite.pillarTags.length > 0 && (
                        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', marginTop: '1rem' }}>
                          <h4 style={{ margin: 0, fontWeight: 700, color: '#012A3A' }}>🧭 Pillar Focus</h4>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                            {selectedSite.pillarTags.map((tag) => (
                              <span
                                key={tag}
                                style={{
                                  padding: '0.3rem 0.9rem',
                                  borderRadius: '12px',
                                  background: 'rgba(59,130,246,0.12)',
                                  color: '#1D4ED8',
                                  fontWeight: 600,
                                  textTransform: 'capitalize',
                                }}
                              >
                                {tag.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', marginTop: '1rem' }}>
                        <h3 style={{ margin: 0, fontWeight: 700, color: '#012A3A' }}>📍 Location</h3>
                        <p style={{ margin: '0.4rem 0 0', color: '#475569' }}>
                          {selectedSite.address}
                          <br />
                          {selectedSite.city}, {selectedSite.state}
                          {selectedSite.region ? ` · ${selectedSite.region}` : ''}
                        </p>
                      </div>

                      {selectedSite.ecological_notes && (
                        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', marginTop: '1rem' }}>
                          <h3 style={{ margin: 0, fontWeight: 700, color: '#012A3A' }}>🌿 Ecology</h3>
                          <p style={{ marginTop: '0.4rem', color: '#475569' }}>{selectedSite.ecological_notes}</p>
                        </div>
                      )}

                      {(selectedSite.species_likely?.length || selectedSite.speciesCommonlyFound?.length) && (
                        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', marginTop: '1rem' }}>
                          <h3 style={{ margin: 0, fontWeight: 700, color: '#012A3A' }}>🦅 Species to Look For</h3>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                            {(selectedSite.species_likely || selectedSite.speciesCommonlyFound || [])
                              .slice(0, 6)
                              .map((species, idx) => (
                              <span
                                key={idx}
                                style={{
                                  padding: '0.3rem 0.8rem',
                                  borderRadius: '12px',
                                  background: '#EEF2FF',
                                  color: '#4338CA',
                                  fontSize: '0.85rem',
                                }}
                              >
                                {species}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedSite.habitatTypes && selectedSite.habitatTypes.length > 0 && (
                        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', marginTop: '1rem' }}>
                          <h3 style={{ margin: 0, fontWeight: 700, color: '#012A3A' }}>🏞️ Habitat Types</h3>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                            {selectedSite.habitatTypes.map((habitat) => (
                              <span
                                key={habitat}
                                style={{
                                  padding: '0.3rem 0.9rem',
                                  borderRadius: '12px',
                                  background: 'rgba(5,150,105,0.12)',
                                  color: '#065F46',
                                  fontSize: '0.85rem',
                                }}
                              >
                                {habitat}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedSite.pfbcAccessPoints && selectedSite.pfbcAccessPoints.length > 0 && (
                        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', marginTop: '1rem' }}>
                          <h3 style={{ margin: 0, fontWeight: 700, color: '#012A3A' }}>🚗 PFBC Access</h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
                            {selectedSite.pfbcAccessPoints.slice(0, 3).map((point) => (
                              <div
                                key={point.id}
                                style={{
                                  padding: '0.75rem',
                                  borderRadius: '12px',
                                  border: '1px solid #E5E7EB',
                                  background: '#F9FAFB',
                                }}
                              >
                                <div style={{ fontWeight: 600, color: '#0F172A' }}>{point.name}</div>
                                <div style={{ fontSize: '0.9rem', color: '#475569' }}>
                                  {point.accessType} · {point.county} County
                                </div>
                                {point.amenities && point.amenities.length > 0 && (
                                  <div style={{ marginTop: '0.35rem', fontSize: '0.85rem', color: '#64748B' }}>
                                    Amenities: {point.amenities.join(', ')}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedSite.pfbcStockings && selectedSite.pfbcStockings.length > 0 && (
                        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', marginTop: '1rem' }}>
                          <h3 style={{ margin: 0, fontWeight: 700, color: '#012A3A' }}>🐟 Upcoming Stockings</h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.75rem' }}>
                            {selectedSite.pfbcStockings.slice(0, 3).map((stock) => (
                              <div key={stock.id} style={{ fontSize: '0.9rem', color: '#475569' }}>
                                <strong>{stock.species}</strong> · {new Date(stock.stockingDate).toLocaleDateString()} ·{' '}
                                {stock.region}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Missions Section */}
                      {(missionsLoading || missions.length > 0) && (
                        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', marginTop: '1rem' }}>
                          <h3 style={{ margin: 0, fontWeight: 700, color: '#012A3A' }}>🎯 Available Missions</h3>
                          {missionsLoading ? (
                            <p style={{ marginTop: '0.75rem', color: '#64748B' }}>Loading missions…</p>
                          ) : missions.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
                              {missions.map((mission) => (
                                <Link
                                  key={mission.id}
                                  href={`/missions?mission=${mission.id}`}
                                  style={{
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '14px',
                                    padding: '0.9rem',
                                    background: 'linear-gradient(135deg, rgba(236,72,153,0.05), rgba(219,39,119,0.05))',
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    transition: 'all 0.2s ease',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(15,23,42,0.12)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                  }}
                                >
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>{mission.title}</div>
                                      {mission.synopsis && (
                                        <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.5rem' }}>
                                          {mission.synopsis.length > 80 ? `${mission.synopsis.substring(0, 80)}...` : mission.synopsis}
                                        </div>
                                      )}
                                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        {mission.difficulty && (
                                          <span
                                            style={{
                                              padding: '0.25rem 0.7rem',
                                              borderRadius: '999px',
                                              background: 'rgba(236,72,153,0.15)',
                                              color: '#BE185D',
                                              fontSize: '0.75rem',
                                              fontWeight: 600,
                                            }}
                                          >
                                            {mission.difficulty}
                                          </span>
                                        )}
                                        <span
                                          style={{
                                            padding: '0.25rem 0.7rem',
                                            borderRadius: '999px',
                                            background: 'rgba(59,130,246,0.15)',
                                            color: '#1D4ED8',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                          }}
                                        >
                                          {mission.locations.length} location{mission.locations.length !== 1 ? 's' : ''}
                                        </span>
                                      </div>
                                    </div>
                                    <div style={{ fontSize: '1.5rem' }}>→</div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <p style={{ marginTop: '0.75rem', color: '#64748B', fontSize: '0.9rem' }}>
                              No missions available at this location yet.
                            </p>
                          )}
                        </div>
                      )}

                      {/* Challenges Section */}
                      {(challengesLoading || challenges.length > 0) && (
                        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', marginTop: '1rem' }}>
                          <h3 style={{ margin: 0, fontWeight: 700, color: '#012A3A' }}>🏆 Available Challenges</h3>
                          {challengesLoading ? (
                            <p style={{ marginTop: '0.75rem', color: '#64748B' }}>Loading challenges…</p>
                          ) : challenges.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
                              {challenges.slice(0, 3).map((challenge) => (
                                <Link
                                  key={challenge.id}
                                  href="/challenges"
                                  style={{
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '14px',
                                    padding: '0.9rem',
                                    background: challenge.completed
                                      ? 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.1))'
                                      : 'linear-gradient(135deg, rgba(251,146,60,0.05), rgba(234,88,12,0.05))',
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    transition: 'all 0.2s ease',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(15,23,42,0.12)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                  }}
                                >
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                                    <div style={{ flex: 1 }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <span style={{ fontSize: '1.25rem' }}>{challenge.icon}</span>
                                        <div style={{ fontWeight: 700, color: '#0F172A' }}>{challenge.title}</div>
                                      </div>
                                      {challenge.description && (
                                        <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.5rem' }}>
                                          {challenge.description.length > 70 ? `${challenge.description.substring(0, 70)}...` : challenge.description}
                                        </div>
                                      )}
                                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <span
                                          style={{
                                            padding: '0.25rem 0.7rem',
                                            borderRadius: '999px',
                                            background: challenge.difficulty === 'easy' ? 'rgba(16,185,129,0.15)' : challenge.difficulty === 'medium' ? 'rgba(59,130,246,0.15)' : 'rgba(139,92,246,0.15)',
                                            color: challenge.difficulty === 'easy' ? '#047857' : challenge.difficulty === 'medium' ? '#1D4ED8' : '#6D28D9',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            textTransform: 'capitalize',
                                          }}
                                        >
                                          {challenge.difficulty}
                                        </span>
                                        <span
                                          style={{
                                            padding: '0.25rem 0.7rem',
                                            borderRadius: '999px',
                                            background: 'rgba(251,146,60,0.15)',
                                            color: '#C2410C',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                          }}
                                        >
                                          +{challenge.rewardPoints} pts
                                        </span>
                                        {challenge.completed && (
                                          <span
                                            style={{
                                              padding: '0.25rem 0.7rem',
                                              borderRadius: '999px',
                                              background: 'rgba(16,185,129,0.2)',
                                              color: '#047857',
                                              fontSize: '0.75rem',
                                              fontWeight: 600,
                                            }}
                                          >
                                            ✓ Complete
                                          </span>
                                        )}
                                      </div>
                                      {!challenge.completed && challenge.targetCount > 0 && (
                                        <div style={{ marginTop: '0.5rem' }}>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B', marginBottom: '0.25rem' }}>
                                            <span>
                                              {challenge.currentProgress} / {challenge.targetCount}
                                            </span>
                                            <span>{Math.round(challenge.progressPercent)}%</span>
                                          </div>
                                          <div style={{ height: '6px', borderRadius: '999px', background: '#E2E8F0', overflow: 'hidden' }}>
                                            <div
                                              style={{
                                                height: '100%',
                                                width: `${challenge.progressPercent}%`,
                                                background: 'linear-gradient(90deg, #F97316, #EA580C)',
                                                borderRadius: '999px',
                                                transition: 'width 0.3s ease',
                                              }}
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    <div style={{ fontSize: '1.5rem' }}>→</div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <p style={{ marginTop: '0.75rem', color: '#64748B', fontSize: '0.9rem' }}>
                              No challenges available at this location.
                            </p>
                          )}
                        </div>
                      )}

                      {/* Recommendations Section */}
                      {(recommendationsLoading || recommendations.length > 0) && (
                        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', marginTop: '1rem' }}>
                          <h3 style={{ margin: 0, fontWeight: 700, color: '#012A3A' }}>🎒 Recommended Content</h3>
                          <p style={{ margin: '0.25rem 0 0.75rem', fontSize: '0.85rem', color: '#64748B' }}>
                            Personalized learning content, missions, and challenges for this location
                          </p>
                          {recommendationsLoading ? (
                            <p style={{ marginTop: '0.75rem', color: '#64748B' }}>Loading personalized recommendations…</p>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
                              {recommendations.slice(0, 3).map((rec) => {
                                const link = resolveRecommendationLink(rec.path, rec.type);
                                return (
                                  <div
                                    key={rec.id}
                                    style={{
                                      border: '1px solid #E5E7EB',
                                      borderRadius: '14px',
                                      padding: '0.9rem',
                                      background: '#F8FAFC',
                                    }}
                                  >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                                      <div>
                                        <div style={{ fontWeight: 700, color: '#0F172A' }}>{rec.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                                          {formatRecommendationType(rec.type)} · {rec.pillarTitle}
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => router.push(link)}
                                        style={{
                                          padding: '0.4rem 0.85rem',
                                          borderRadius: '10px',
                                          border: 'none',
                                          background: '#0EA5E9',
                                          color: 'white',
                                          fontWeight: 600,
                                          cursor: 'pointer',
                                        }}
                                      >
                                        Launch
                                      </button>
                                    </div>
                                    {rec.coverageTags && rec.coverageTags.length > 0 && (
                                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                        {rec.coverageTags.slice(0, 4).map((tag) => (
                                          <span
                                            key={tag}
                                            style={{
                                              padding: '0.25rem 0.7rem',
                                              borderRadius: '999px',
                                              background: 'rgba(59,130,246,0.15)',
                                              color: '#1D4ED8',
                                              fontSize: '0.75rem',
                                            }}
                                          >
                                            {tag}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}

                      <div style={{ marginTop: '1.5rem' }}>
                        <CheckInButton site={selectedSite} userLocation={location} onSuccess={handleCheckInSuccess} />
                        <button
                          onClick={() => router.push(`/sites/${selectedSite.id}`)}
                          style={{
                            marginTop: '0.75rem',
                            width: '100%',
                            padding: '0.85rem',
                            borderRadius: '16px',
                            border: '1px solid #CBD5F5',
                            background: '#F8FAFF',
                            fontWeight: 600,
                            color: '#0F172A',
                            cursor: 'pointer',
                          }}
                        >
                          View Full Details →
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        background: 'white',
                        borderRadius: '24px',
                        padding: '1.75rem',
                        boxShadow: '0 20px 50px rgba(15,23,42,0.1)',
                      }}
                    >
                      <h3 style={{ marginTop: 0, fontSize: '1.3rem', fontWeight: 800, color: '#012A3A' }}>
                        Nearby Sites ({filteredSites.length})
                      </h3>
                      <NearbySitesList sites={filteredSites.slice(0, 10)} onSiteSelect={handleSiteSelect} />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div
                style={{
                  background: 'white',
                  borderRadius: '24px',
                  padding: '1rem',
                  boxShadow: '0 18px 40px rgba(15,23,42,0.08)',
                }}
              >
                <NearbySitesList
                  sites={filteredSites}
                  onSiteSelect={(site) => {
                    setSelectedSite(site);
                    setViewMode('map');
                  }}
                  detailed
                />
              </div>
            )}
          </div>
        )}

        {location && !loading && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              marginTop: '1rem',
            }}
          >
            {[
              { label: 'Sites Near You', value: sites.length, icon: ICONS.compass, accent: '#0EA5E9' },
              { label: 'Libraries', value: libraryCount, icon: ICONS.macro, accent: '#A855F7' },
              { label: 'Parks & Wildlands', value: parkCount, icon: ICONS.habitat, accent: '#22C55E' },
              { label: 'Trout Waters', value: troutCount, icon: ICONS.award, accent: '#F97316' },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.9rem',
                  boxShadow: '0 15px 35px rgba(15,23,42,0.08)',
                }}
              >
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '16px',
                    background: `${stat.accent}1A`,
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <Image src={stat.icon} alt={stat.label} width={34} height={34} style={{ borderRadius: '10px' }} />
                </div>
                <div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A' }}>{stat.value}</div>
                  <div style={{ color: '#64748B', fontWeight: 600 }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

