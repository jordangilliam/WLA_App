// ============================================================================
// FieldQuest TypeScript Type Definitions
// ============================================================================

export type SpeciesRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type SpeciesType = 'fish' | 'bird' | 'mammal' | 'amphibian' | 'reptile' | 'insect' | 'plant';
export type EncounterOutcome = 'in_progress' | 'success' | 'fled' | 'timeout';
export type ItemType = 'bait' | 'lure' | 'camera' | 'tool' | 'consumable';

// ============================================================================
// Species
// ============================================================================

export interface Species {
  id: string;
  name: string;
  scientific_name: string | null;
  species_type: SpeciesType;
  rarity: SpeciesRarity;
  habitat_types: string[];
  description: string | null;
  conservation_status: string | null;
  educational_facts: EducationalFacts | null;
  image_url: string | null;
  model_3d_url: string | null;
  catch_difficulty: number; // 1-5
  base_xp: number;
  is_active: boolean;
  created_at: string;
}

export interface EducationalFacts {
  diet?: string;
  habitat?: string;
  threats?: string;
  fun_fact?: string;
  conservation_efforts?: string;
  [key: string]: string | undefined;
}

// ============================================================================
// Field Sites (POIs)
// ============================================================================

export interface FieldSite {
  id: string;
  name: string;
  description: string | null;
  site_type: string; // stream, trail, park, forest, lake, wetland
  latitude: number;
  longitude: number;
  geofence_radius: number; // meters
  organization_id: number | null;
  created_by: number | null;
  loot_table_id: string | null;
  is_active: boolean;
  metadata: Record<string, any>;
  created_at: string;
  distance_meters?: number; // Added by nearby query
}

// ============================================================================
// Spawns
// ============================================================================

export interface SpawnEvent {
  id: string;
  field_site_id: string;
  species_id: string;
  event_type: 'teacher_event' | 'system_spawn' | 'special_event';
  event_name: string | null;
  created_by: number | null;
  class_id: number | null;
  start_time: string;
  end_time: string;
  spawn_rate: number;
  max_spawns: number;
  current_spawns: number;
  difficulty_modifier: number;
  is_active: boolean;
  metadata: Record<string, any>;
  created_at: string;
}

export interface ActiveSpawn {
  id: string;
  spawn_event_id: string;
  species_id: string;
  species_name?: string; // Added by join
  species_type?: SpeciesType; // Added by join
  rarity?: SpeciesRarity; // Added by join
  latitude: number;
  longitude: number;
  spawn_time: string;
  despawn_time: string;
  encounter_difficulty: number;
  is_caught: boolean;
  caught_by: number | null;
  caught_at: string | null;
  distance_meters?: number; // Added by nearby query
}

// ============================================================================
// User Collection
// ============================================================================

export interface UserSpecies {
  id: string;
  user_id: number;
  species_id: string;
  spawn_id: string;
  caught_at: string;
  catch_location: {
    latitude: number;
    longitude: number;
  } | null;
  field_site_id: string | null;
  catch_metadata: CatchMetadata;
  is_first_catch: boolean;
  xp_earned: number;
}

export interface CatchMetadata {
  weather?: string;
  time_of_day?: 'morning' | 'afternoon' | 'evening' | 'night';
  throw_quality?: number;
  items_used?: string[];
  [key: string]: any;
}

// ============================================================================
// Encounters
// ============================================================================

export interface Encounter {
  id: string;
  user_id: number;
  spawn_id: string;
  species_id: string;
  started_at: string;
  ended_at: string | null;
  outcome: EncounterOutcome;
  attempts: number;
  used_items: string[];
  catch_quality: number | null;
  xp_earned: number;
  server_verified: boolean;
}

export interface EncounterStartResponse {
  encounter: Encounter;
  species: Species;
}

export interface EncounterThrowResponse {
  success: boolean;
  fled?: boolean;
  attempts_remaining?: number;
  xp?: number;
  is_first_catch?: boolean;
  level_up?: boolean;
  new_level?: number;
}

// ============================================================================
// Items & Inventory
// ============================================================================

export interface Item {
  id: string;
  name: string;
  item_type: ItemType;
  description: string | null;
  icon_url: string | null;
  effects: ItemEffects;
  is_active: boolean;
  created_at: string;
}

export interface ItemEffects {
  catch_rate_boost?: number;
  duration?: number; // seconds
  spawn_rate_boost?: number;
  xp_multiplier?: number;
  [key: string]: any;
}

export interface InventoryItem {
  id: string;
  user_id: number;
  item_id: string;
  quantity: number;
  acquired_at: string;
  updated_at: string;
  item?: Item; // Joined item data
}

// ============================================================================
// Location & Map
// ============================================================================

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationUpdate {
  coords: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
}

export interface NearbyResponse {
  fieldSites: FieldSite[];
  spawns: ActiveSpawn[];
}

// ============================================================================
// User & Profile
// ============================================================================

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'parent' | 'admin';
  avatar_url: string | null;
  total_xp: number;
  level: number;
  species_caught: number;
  last_location: Coordinates | null;
  last_location_time: string | null;
  created_at: string;
}

export interface CollectionStats {
  total_species: number;
  caught_species: number;
  completion_rate: number;
  common_caught: number;
  uncommon_caught: number;
  rare_caught: number;
  epic_caught: number;
  legendary_caught: number;
}

// ============================================================================
// API Responses
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LevelUpResult {
  new_xp: number;
  new_level: number;
  leveled_up: boolean;
}

// ============================================================================
// Audit & Security
// ============================================================================

export interface AuditLogEntry {
  id: string;
  user_id: number;
  event_type: string;
  event_data: Record<string, any>;
  location: Coordinates | null;
  server_time: string;
  client_time: string | null;
  integrity_flags: string[];
  severity: 'info' | 'warning' | 'suspicious' | 'ban';
}

export interface MovementCheck {
  possible: boolean;
  speed: number; // m/s
  distance: number; // meters
  time_diff: number; // seconds
}

