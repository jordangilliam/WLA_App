/**
 * Zustand state management for FieldQuest
 */

import { create } from 'zustand';
import type {
  UserProfile,
  LocationUpdate,
  ActiveSpawn,
  FieldSite,
  CollectionStats,
} from '../lib/types';

// ============================================================================
// User Store
// ============================================================================

interface UserState {
  profile: UserProfile | null;
  collectionStats: CollectionStats | null;
  isLoading: boolean;
  error: string | null;
  setProfile: (profile: UserProfile | null) => void;
  setCollectionStats: (stats: CollectionStats | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  collectionStats: null,
  isLoading: false,
  error: null,
  setProfile: (profile) => set({ profile }),
  setCollectionStats: (stats) => set({ collectionStats: stats }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearUser: () => set({ profile: null, collectionStats: null, error: null }),
}));

// ============================================================================
// Location Store
// ============================================================================

interface LocationState {
  currentLocation: LocationUpdate | null;
  isTracking: boolean;
  permissionGranted: boolean;
  error: string | null;
  setLocation: (location: LocationUpdate) => void;
  setTracking: (tracking: boolean) => void;
  setPermission: (granted: boolean) => void;
  setError: (error: string | null) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  currentLocation: null,
  isTracking: false,
  permissionGranted: false,
  error: null,
  setLocation: (location) => set({ currentLocation: location }),
  setTracking: (tracking) => set({ isTracking: tracking }),
  setPermission: (granted) => set({ permissionGranted: granted }),
  setError: (error) => set({ error }),
}));

// ============================================================================
// Map Store
// ============================================================================

interface MapState {
  nearbySpawns: ActiveSpawn[];
  nearbyFieldSites: FieldSite[];
  selectedSpawn: ActiveSpawn | null;
  selectedFieldSite: FieldSite | null;
  lastFetchTime: number | null;
  isLoading: boolean;
  setNearbySpawns: (spawns: ActiveSpawn[]) => void;
  setNearbyFieldSites: (sites: FieldSite[]) => void;
  setSelectedSpawn: (spawn: ActiveSpawn | null) => void;
  setSelectedFieldSite: (site: FieldSite | null) => void;
  setLastFetchTime: (time: number) => void;
  setLoading: (loading: boolean) => void;
  clearMap: () => void;
}

export const useMapStore = create<MapState>((set) => ({
  nearbySpawns: [],
  nearbyFieldSites: [],
  selectedSpawn: null,
  selectedFieldSite: null,
  lastFetchTime: null,
  isLoading: false,
  setNearbySpawns: (spawns) => set({ nearbySpawns: spawns }),
  setNearbyFieldSites: (sites) => set({ nearbyFieldSites: sites }),
  setSelectedSpawn: (spawn) => set({ selectedSpawn: spawn }),
  setSelectedFieldSite: (site) => set({ selectedFieldSite: site }),
  setLastFetchTime: (time) => set({ lastFetchTime: time }),
  setLoading: (loading) => set({ isLoading: loading }),
  clearMap: () => set({
    nearbySpawns: [],
    nearbyFieldSites: [],
    selectedSpawn: null,
    selectedFieldSite: null,
  }),
}));

// ============================================================================
// Encounter Store
// ============================================================================

interface EncounterState {
  activeEncounter: {
    id: string;
    spawnId: string;
    speciesId: string;
    speciesName: string;
    attempts: number;
    startedAt: string;
  } | null;
  isInEncounter: boolean;
  setEncounter: (encounter: EncounterState['activeEncounter']) => void;
  clearEncounter: () => void;
}

export const useEncounterStore = create<EncounterState>((set) => ({
  activeEncounter: null,
  isInEncounter: false,
  setEncounter: (encounter) => set({ activeEncounter: encounter, isInEncounter: !!encounter }),
  clearEncounter: () => set({ activeEncounter: null, isInEncounter: false }),
}));

// ============================================================================
// App State Store
// ============================================================================

interface AppState {
  isInitialized: boolean;
  featureFlags: {
    enableAR: boolean;
    enableDebug: boolean;
  };
  setInitialized: (initialized: boolean) => void;
  setFeatureFlags: (flags: Partial<AppState['featureFlags']>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isInitialized: false,
  featureFlags: {
    enableAR: process.env.EXPO_PUBLIC_ENABLE_AR === 'true',
    enableDebug: process.env.EXPO_PUBLIC_ENABLE_DEBUG === 'true',
  },
  setInitialized: (initialized) => set({ isInitialized: initialized }),
  setFeatureFlags: (flags) => set((state) => ({
    featureFlags: { ...state.featureFlags, ...flags },
  })),
}));

