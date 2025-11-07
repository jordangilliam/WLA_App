/**
 * API client for FieldQuest
 * Handles all communication with Supabase backend
 */

import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import type {
  NearbyResponse,
  EncounterStartResponse,
  EncounterThrowResponse,
  UserProfile,
  CollectionStats,
  Species,
  FieldSite,
  LevelUpResult,
} from './types';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: {
      getItem: async (key: string) => {
        return await SecureStore.getItemAsync(key);
      },
      setItem: async (key: string, value: string) => {
        await SecureStore.setItemAsync(key, value);
      },
      removeItem: async (key: string) => {
        await SecureStore.deleteItemAsync(key);
      },
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

class FieldQuestAPI {
  /**
   * Get nearby field sites and spawns
   */
  async getNearby(lat: number, lng: number, radius = 300): Promise<NearbyResponse> {
    try {
      // Get field sites
      const { data: fieldSites, error: sitesError } = await supabase
        .rpc('nearby_field_sites', {
          user_lat: lat,
          user_lng: lng,
          radius_meters: radius,
        });

      if (sitesError) throw sitesError;

      // Get active spawns
      const { data: spawns, error: spawnsError } = await supabase
        .rpc('nearby_spawns', {
          user_lat: lat,
          user_lng: lng,
          radius_meters: radius,
        });

      if (spawnsError) throw spawnsError;

      // Report location for anti-cheat
      await this.reportLocation(lat, lng);

      return {
        fieldSites: fieldSites || [],
        spawns: spawns || [],
      };
    } catch (error) {
      console.error('Error fetching nearby:', error);
      throw error;
    }
  }

  /**
   * Start an encounter with a spawn
   */
  async startEncounter(
    spawnId: string,
    userLat: number,
    userLng: number
  ): Promise<EncounterStartResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('encounter-start', {
        body: {
          spawnId,
          userLat,
          userLng,
        },
      });

      if (error) throw error;
      return data as EncounterStartResponse;
    } catch (error) {
      console.error('Error starting encounter:', error);
      throw error;
    }
  }

  /**
   * Attempt to catch a species (throw)
   */
  async throwAtEncounter(
    encounterId: string,
    throwQuality: number,
    itemsUsed: string[] = []
  ): Promise<EncounterThrowResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('encounter-throw', {
        body: {
          encounterId,
          throwQuality,
          itemsUsed,
        },
      });

      if (error) throw error;
      return data as EncounterThrowResponse;
    } catch (error) {
      console.error('Error throwing at encounter:', error);
      throw error;
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId?: number): Promise<UserProfile | null> {
    try {
      let query = supabase.from('users').select('*');
      
      if (userId) {
        query = query.eq('id', userId);
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;
        query = query.eq('email', user.email);
      }

      const { data, error } = await query.single();
      if (error) throw error;
      
      return data as UserProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  /**
   * Get user collection statistics
   */
  async getCollectionStats(userId: number): Promise<CollectionStats | null> {
    try {
      const { data, error } = await supabase.rpc('user_collection_stats', {
        p_user_id: userId,
      });

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('Error fetching collection stats:', error);
      return null;
    }
  }

  /**
   * Get user's caught species
   */
  async getUserSpecies(userId: number) {
    try {
      const { data, error } = await supabase
        .from('user_species')
        .select(`
          *,
          species:species_id (*)
        `)
        .eq('user_id', userId)
        .eq('is_first_catch', true)
        .order('caught_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user species:', error);
      return [];
    }
  }

  /**
   * Get all species (for collection view)
   */
  async getAllSpecies(): Promise<Species[]> {
    try {
      const { data, error } = await supabase
        .from('species')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data as Species[];
    } catch (error) {
      console.error('Error fetching species:', error);
      return [];
    }
  }

  /**
   * Get field site details
   */
  async getFieldSite(siteId: string): Promise<FieldSite | null> {
    try {
      const { data, error } = await supabase
        .from('field_sites')
        .select('*')
        .eq('id', siteId)
        .single();

      if (error) throw error;
      return data as FieldSite;
    } catch (error) {
      console.error('Error fetching field site:', error);
      return null;
    }
  }

  /**
   * Report location for anti-cheat tracking
   */
  private async reportLocation(lat: number, lng: number): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('users')
        .update({
          last_location: `POINT(${lng} ${lat})`,
          last_location_time: new Date().toISOString(),
        })
        .eq('email', user.email);
    } catch (error) {
      console.error('Error reporting location:', error);
    }
  }

  /**
   * Sign in with WLA App JWT token
   */
  async signInWithToken(token: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: token,
      });

      if (error) throw error;
      return !!data.session;
    } catch (error) {
      console.error('Error signing in with token:', error);
      return false;
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  }

  /**
   * Check authentication status
   */
  async isAuthenticated(): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  }
}

export const api = new FieldQuestAPI();

