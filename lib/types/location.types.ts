/**
 * Location and Geolocation Types
 * For the Next-Gen Conservation Platform
 */

// ============================================================================
// Location Categories
// ============================================================================

export type LocationCategory = 
  | 'state_park'
  | 'state_forest'
  | 'county_park'
  | 'city_park'
  | 'museum'
  | 'nature_center'
  | 'library'
  | 'community_center'
  | 'university'
  | 'fishing_access'
  | 'wildlife_area'
  | 'trailhead'
  | 'water_body'
  | 'conservation_area'
  | 'historic_site';

export type LocationRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

// ============================================================================
// Location Interfaces
// ============================================================================

export interface Coordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
}

export interface LocationBoundary {
  type: 'Point' | 'Polygon' | 'Circle';
  coordinates: Coordinates[];
  radius?: number; // for Circle type, in meters
}

export interface LocationMetadata {
  address?: string;
  city: string;
  county: string;
  state: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  hours?: {
    [key: string]: { open: string; close: string } | 'closed';
  };
  seasonalAccess?: {
    startMonth: number;
    endMonth: number;
  };
  amenities?: string[];
  accessibility?: string[];
}

export interface Location {
  id: string;
  name: string;
  description: string;
  category: LocationCategory;
  rarity: LocationRarity;
  
  // Geographic data
  coordinates: Coordinates;
  boundary?: LocationBoundary;
  
  // Metadata
  metadata: LocationMetadata;
  
  // Gamification
  basePoints: number;
  distanceMultiplier?: number; // bonus for remote locations
  firstVisitBonus: number;
  
  // Educational content
  species: string[]; // species likely to be found here
  habitats: string[];
  highlights: string[];
  educationalContent?: string; // markdown content
  
  // Challenges and badges
  availableChallenges: string[]; // challenge IDs
  requiredForBadges: string[]; // badge IDs
  
  // Media
  images: string[];
  mapTileUrl?: string; // for offline map caching
  
  // Status
  isActive: boolean;
  isVerified: boolean;
  isSeasonal: boolean;
  
  // Partnerships
  partnerOrganization?: string;
  hasQRCode: boolean;
  qrCodeData?: string;
  
  // Analytics
  totalVisits: number;
  uniqueVisitors: number;
  averageRating?: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// User Visit/Check-in Types
// ============================================================================

export type VisitVerificationMethod = 
  | 'gps'
  | 'qr_code'
  | 'photo'
  | 'staff_verification'
  | 'manual_review';

export interface VisitVerification {
  method: VisitVerificationMethod;
  confidence: number; // 0-100
  metadata?: {
    photoUrl?: string;
    photoExif?: Record<string, any>;
    qrCode?: string;
    staffId?: string;
    gpsAccuracy?: number;
  };
}

export interface UserVisit {
  id: string;
  userId: string;
  locationId: string;
  
  // Visit details
  checkInTime: Date;
  checkOutTime?: Date;
  durationMinutes?: number;
  
  // Verification
  verification: VisitVerification;
  isVerified: boolean;
  verifiedAt?: Date;
  
  // GPS tracking
  coordinates: Coordinates;
  routeData?: Coordinates[]; // if tracking was enabled
  distanceTraveled?: number; // meters
  
  // Engagement
  completedChallenges: string[];
  photosSubmitted: string[];
  observationsMade: string[];
  notesOrJournal?: string;
  
  // Rewards
  pointsEarned: number;
  badgesEarned: string[];
  achievementsUnlocked: string[];
  
  // Social
  companions?: string[]; // other user IDs
  isPublic: boolean;
  rating?: number;
  review?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Challenge Types
// ============================================================================

export type ChallengeType = 
  | 'discovery'
  | 'conservation'
  | 'scavenger_hunt'
  | 'data_collection'
  | 'educational'
  | 'social'
  | 'seasonal'
  | 'time_limited';

export type ChallengeDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface ChallengeRequirement {
  type: 'visit_location' | 'identify_species' | 'collect_data' | 'complete_quiz' | 'take_photo' | 'custom';
  value: any;
  description: string;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: ChallengeType;
  difficulty: ChallengeDifficulty;
  
  // Requirements
  requirements: ChallengeRequirement[];
  locationIds?: string[]; // specific locations required
  speciesIds?: string[]; // specific species to find
  
  // Rewards
  pointsReward: number;
  badgeReward?: string;
  physicalReward?: string;
  
  // Timing
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  seasonalMonths?: number[]; // 1-12
  
  // Gamification
  participantCount: number;
  completionCount: number;
  completionRate?: number;
  
  // Educational
  learningObjectives?: string[];
  relatedContent?: string[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Badge System Types
// ============================================================================

export type BadgeCategory = 
  | 'explorer'
  | 'scientist'
  | 'scholar'
  | 'ambassador'
  | 'master'
  | 'special';

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'elite';

export interface BadgeRequirement {
  type: string;
  count?: number;
  description: string;
  progress?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  tier: BadgeTier;
  
  // Requirements
  requirements: BadgeRequirement[];
  prerequisiteBadges?: string[];
  
  // Rewards
  pointsReward: number;
  unlocksRewards?: string[];
  
  // Display
  iconUrl: string;
  iconUrlLocked?: string;
  color: string;
  
  // Rarity
  rarity: LocationRarity;
  earnedByCount: number;
  earnedByPercentage?: number;
  
  // Status
  isActive: boolean;
  isHidden: boolean; // secret badges
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  
  // Earning details
  earnedAt: Date;
  earnedBy?: string; // what triggered it
  progress: number; // 0-100
  
  // Display
  isDisplayed: boolean;
  displayOrder?: number;
  
  // Social
  shareCount: number;
  likeCount: number;
}

// ============================================================================
// Reward Types
// ============================================================================

export type RewardType = 'virtual' | 'physical' | 'experience' | 'opportunity';
export type RewardStatus = 'available' | 'claimed' | 'fulfilled' | 'expired';

export interface Reward {
  id: string;
  name: string;
  description: string;
  type: RewardType;
  
  // Cost
  pointCost: number;
  badgeRequirements?: string[];
  tierRequirement?: BadgeTier;
  
  // Inventory
  totalQuantity?: number; // null for unlimited
  remainingQuantity?: number;
  
  // Partner
  providedBy?: string; // partner organization
  partnerLogo?: string;
  value?: number; // dollar value for reporting
  
  // Details
  images: string[];
  terms?: string;
  expirationDays?: number;
  
  // Fulfillment
  requiresShipping: boolean;
  requiresScheduling: boolean;
  redemptionInstructions?: string;
  
  // Status
  isActive: boolean;
  isFeatured: boolean;
  
  // Analytics
  claimCount: number;
  fulfillmentRate?: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  availableUntil?: Date;
}

export interface UserReward {
  id: string;
  userId: string;
  rewardId: string;
  
  // Claim details
  claimedAt: Date;
  status: RewardStatus;
  
  // Fulfillment
  fulfilledAt?: Date;
  trackingNumber?: string;
  scheduledDate?: Date;
  
  // User info (for fulfillment)
  shippingAddress?: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  
  // Redemption
  redemptionCode?: string;
  redeemedAt?: Date;
  expiresAt?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Partnership Types
// ============================================================================

export type PartnerType = 'state_agency' | 'educational' | 'conservation' | 'corporate' | 'foundation';

export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  description: string;
  
  // Contact
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  
  // Branding
  logo: string;
  primaryColor?: string;
  
  // Contributions
  locationsProvided: string[];
  rewardsProvided: string[];
  eventsHosted: string[];
  
  // Agreement
  agreementStartDate?: Date;
  agreementEndDate?: Date;
  isActive: boolean;
  
  // Analytics
  totalStudentsReached: number;
  totalRewardsDistributed: number;
  impactMetrics?: Record<string, any>;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Geolocation Utilities
// ============================================================================

export interface GeolocationState {
  isTracking: boolean;
  isSupported: boolean;
  currentPosition?: Coordinates;
  error?: string;
  accuracy?: number;
  lastUpdate?: Date;
}

export interface RouteTracking {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  points: Array<Coordinates & { timestamp: Date }>;
  totalDistance: number; // meters
  averageSpeed?: number; // m/s
  elevationGain?: number; // meters
}

// ============================================================================
// Map Configuration
// ============================================================================

export interface MapConfig {
  center: Coordinates;
  zoom: number;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  style: string; // MapLibre style URL
  markers?: {
    locationId: string;
    coordinates: Coordinates;
    category: LocationCategory;
    isVisited: boolean;
  }[];
}

// ============================================================================
// Offline Map Types
// ============================================================================

export interface OfflineMapTile {
  id: string;
  zoom: number;
  x: number;
  y: number;
  data: Blob;
  downloadedAt: Date;
  expiresAt?: Date;
}

export interface OfflineMapRegion {
  id: string;
  name: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  zoomLevels: number[];
  totalTiles: number;
  downloadedTiles: number;
  isComplete: boolean;
  sizeBytes: number;
  lastUpdated: Date;
}

