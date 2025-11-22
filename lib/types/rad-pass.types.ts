/**
 * RAD Pass Gamification System Types
 * Complete type definitions for the reward system
 */

// ============================================================================
// POINT SYSTEM
// ============================================================================

export type PointCurrency = 
  | 'learning_points'    // Educational activities
  | 'action_points'      // Field work
  | 'social_points'      // Community engagement
  | 'bonus_points'       // Special events
  | 'rad_tokens';        // Redeemable currency

export type PointTransactionType =
  | 'earned'
  | 'spent'
  | 'awarded'
  | 'bonus'
  | 'adjustment'
  | 'expired'
  | 'transferred'
  | 'refunded';

export interface PointTransaction {
  id: string;
  userId: string;
  currency: PointCurrency;
  transactionType: PointTransactionType;
  amount: number;
  balanceAfter: number;
  
  // Context
  sourceType?: string;
  sourceId?: string;
  description: string;
  metadata?: Record<string, any>;
  
  // Attribution
  awardedBy?: string;
  relatedTransactionId?: string;
  
  createdAt: Date;
  expiresAt?: Date;
}

export interface UserPointBalance {
  userId: string;
  
  // Current balances
  learningPoints: number;
  actionPoints: number;
  socialPoints: number;
  bonusPoints: number;
  radTokens: number;
  
  // Lifetime totals
  lifetimeLearning: number;
  lifetimeAction: number;
  lifetimeSocial: number;
  lifetimeBonus: number;
  lifetimeRadTokens: number;
  
  totalRedeemed: number;
  
  // Conversion rates
  learningToRadRate: number;
  actionToRadRate: number;
  socialToRadRate: number;
  
  updatedAt: Date;
}

export interface PointsBreakdown {
  current: {
    learning: number;
    action: number;
    social: number;
    bonus: number;
    radTokens: number;
    total: number;
  };
  lifetime: {
    learning: number;
    action: number;
    social: number;
    bonus: number;
    radTokens: number;
    total: number;
  };
  redeemed: number;
  conversionRates: {
    learningToRad: number;
    actionToRad: number;
    socialToRad: number;
  };
  nextRadToken: {
    fromLearning: number; // points needed
    fromAction: number;
    fromSocial: number;
  };
}

// ============================================================================
// PARTNERS
// ============================================================================

export type PartnerCategory =
  | 'museum'
  | 'library'
  | 'cultural_venue'
  | 'restaurant'
  | 'entertainment'
  | 'retail'
  | 'recreation'
  | 'education'
  | 'non_profit'
  | 'government';

export type PartnerStatus = 'active' | 'pending' | 'inactive' | 'suspended';

export interface PartnerOrganization {
  id: string;
  name: string;
  legalName?: string;
  description?: string;
  category: PartnerCategory;
  subcategory?: string;
  
  // Contact
  primaryContactName?: string;
  primaryContactEmail?: string;
  primaryContactPhone?: string;
  website?: string;
  
  // Location
  address?: string;
  city: string;
  state: string;
  zipCode?: string;
  coordinates?: [number, number]; // [lng, lat]
  
  // Partnership
  status: PartnerStatus;
  partnershipLevel?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  
  // Branding
  logoUrl?: string;
  bannerUrl?: string;
  brandColor?: string;
  tagline?: string;
  
  // Settings
  requiresAppointment: boolean;
  allowsGroupReservations: boolean;
  maxGroupSize?: number;
  advanceBookingDays?: number;
  redemptionInstructions?: string;
  
  // Analytics
  totalRewardsOffered: number;
  totalRedemptions: number;
  totalStudentsServed: number;
  averageRating?: number;
  
  // Metadata
  metadata?: Record<string, any>;
  termsAndConditions?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface PartnerAnalytics {
  partnerId: string;
  period: 'day' | 'week' | 'month' | 'year' | 'all_time';
  
  redemptions: {
    claimed: number;
    redeemed: number;
    expired: number;
    cancelled: number;
  };
  
  financial: {
    tokensRedeemed: number;
    estimatedValueProvided: number;
  };
  
  users: {
    unique: number;
    new: number;
    returning: number;
  };
  
  ratings: {
    average: number;
    total: number;
    distribution: Record<number, number>; // star rating -> count
  };
  
  popularRewards: Array<{
    rewardId: string;
    rewardName: string;
    redemptionCount: number;
  }>;
  
  peakHours: Record<string, number>; // hour -> redemption count
  peakDays: Record<string, number>; // day of week -> redemption count
}

// ============================================================================
// REWARDS
// ============================================================================

export type RewardType =
  | 'admission'
  | 'food'
  | 'merchandise'
  | 'experience'
  | 'digital'
  | 'discount'
  | 'upgrade'
  | 'donation';

export type RewardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Reward {
  id: string;
  partnerId: string;
  partnerName?: string; // Populated from join
  partnerLogo?: string;
  
  // Reward details
  name: string;
  description: string;
  rewardType: RewardType;
  rarity: RewardRarity;
  
  // Cost
  costRadTokens: number;
  costLearningPoints?: number;
  costActionPoints?: number;
  
  // Value
  retailValue?: number;
  discountPercentage?: number;
  
  // Availability
  isActive: boolean;
  totalQuantity?: number;
  quantityRemaining?: number;
  quantityPerUser: number;
  
  // Scheduling
  availableStartDate?: string;
  availableEndDate?: string;
  availableDaysOfWeek?: number[];
  availableTimes?: {
    start: string;
    end: string;
  };
  
  // Requirements
  minAge?: number;
  maxAge?: number;
  requiredLevel?: number;
  requiredAchievements?: string[];
  requiresParentPermission: boolean;
  requiresTeacherApproval: boolean;
  
  // Display
  imageUrl?: string;
  icon?: string;
  featured: boolean;
  featuredOrder?: number;
  
  // Redemption
  redemptionMethod: string;
  redemptionInstructions?: string;
  requiresAppointment: boolean;
  expirationDays: number;
  
  // Terms
  termsAndConditions?: string;
  exclusions?: string;
  
  // Analytics
  totalClaimed: number;
  totalRedeemed: number;
  totalExpired: number;
  averageRedemptionTimeDays?: number;
  
  // Metadata
  tags?: string[];
  metadata?: Record<string, any>;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface RewardWithPartner extends Reward {
  partner: PartnerOrganization;
  userClaimCount?: number; // How many times current user has claimed
  userCanClaim: boolean;
  inStock: boolean;
  currentlyAvailable: boolean;
}

// ============================================================================
// REDEMPTIONS
// ============================================================================

export type RedemptionStatus =
  | 'claimed'
  | 'pending_approval'
  | 'approved'
  | 'redeemed'
  | 'expired'
  | 'cancelled'
  | 'refunded';

export interface RewardRedemption {
  id: string;
  rewardId: string;
  userId: string;
  partnerId: string;
  
  // Redemption details
  status: RedemptionStatus;
  confirmationCode: string;
  qrCodeData?: string;
  
  // Cost paid
  pointTransactionId?: string;
  costPaidTokens: number;
  costPaidLearning?: number;
  costPaidAction?: number;
  
  // Scheduling
  scheduledDate?: string;
  scheduledTime?: string;
  appointmentConfirmation?: string;
  
  // Approval
  requiresApproval: boolean;
  approvalRequestedAt?: Date;
  approvedBy?: string;
  approvedAt?: Date;
  approvalNotes?: string;
  
  // Timing
  claimedAt: Date;
  redeemedAt?: Date;
  redeemedByPartnerUser?: string;
  redemptionLocation?: string;
  expiresAt: Date;
  
  // Cancellation
  cancelledAt?: Date;
  cancelledBy?: string;
  cancellationReason?: string;
  refundIssued: boolean;
  
  // Feedback
  userRating?: number;
  userFeedback?: string;
  partnerNotes?: string;
  
  metadata?: Record<string, any>;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface RedemptionWithDetails extends RewardRedemption {
  reward: Reward;
  partner: PartnerOrganization;
  userName?: string;
  userAvatar?: string;
}

// ============================================================================
// GRADE INTEGRATION
// ============================================================================

export type GradeCategory =
  | 'participation'
  | 'field_work'
  | 'knowledge'
  | 'collaboration'
  | 'conservation_action'
  | 'leadership';

export interface GradeAssignment {
  id: string;
  teacherId: string;
  classId?: string;
  
  name: string;
  description?: string;
  category: GradeCategory;
  
  // Requirements
  requiredLearningPoints?: number;
  requiredActionPoints?: number;
  requiredSocialPoints?: number;
  requiredCheckIns?: number;
  requiredAchievements?: number;
  requiredChallengeCompletions?: number;
  specificAchievementIds?: string[];
  
  // Grading
  totalPossiblePoints: number;
  conversionFormula?: string;
  gradeLetterScale?: Record<string, number>;
  
  // Dates
  assignedDate: string;
  dueDate?: string;
  
  // Settings
  allowLateSubmission: boolean;
  latePenaltyPercentage?: number;
  extraCreditAvailable: boolean;
  extraCreditMaxPoints?: number;
  
  // Display
  isPublished: boolean;
  weight?: number;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentGrade {
  id: string;
  assignmentId: string;
  studentId: string;
  
  // Points earned (gamification)
  learningPointsEarned: number;
  actionPointsEarned: number;
  socialPointsEarned: number;
  checkInsCompleted: number;
  achievementsCompleted: number;
  
  // Calculated grade (academic)
  pointsEarned: number;
  pointsPossible: number;
  percentage: number;
  letterGrade?: string;
  
  // Status
  isSubmitted: boolean;
  submittedAt?: Date;
  isLate: boolean;
  isGraded: boolean;
  gradedAt?: Date;
  gradedBy?: string;
  
  // Feedback
  teacherComments?: string;
  privateNotes?: string;
  
  // Extra credit
  extraCreditPoints?: number;
  extraCreditNote?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface GradeReport {
  student: {
    id: string;
    name: string;
    avatar?: string;
  };
  assignment: GradeAssignment;
  grade: StudentGrade;
  progress: {
    learningPoints: {
      current: number;
      required: number;
      percentage: number;
    };
    actionPoints: {
      current: number;
      required: number;
      percentage: number;
    };
    socialPoints: {
      current: number;
      required: number;
      percentage: number;
    };
    checkIns: {
      current: number;
      required: number;
      percentage: number;
    };
    achievements: {
      current: number;
      required: number;
      percentage: number;
    };
  };
  isComplete: boolean;
  daysUntilDue?: number;
  isOverdue: boolean;
}

// ============================================================================
// RAD PASS DEPLOYMENT
// ============================================================================

export interface RadPassDeployment {
  id: string;
  deploymentName: string;
  subdomain: string;
  customDomain?: string;
  
  // Organization
  organizationName: string;
  organizationType?: string;
  primaryContactEmail: string;
  
  // Branding
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  customCss?: string;
  
  // Features
  featuresEnabled?: Record<string, boolean>;
  
  // Point configuration
  pointConversionRates?: Record<string, number>;
  pointExpirationEnabled: boolean;
  pointExpirationDays?: number;
  
  // Integration
  apiKey: string;
  webhookUrl?: string;
  ssoEnabled: boolean;
  ssoProvider?: string;
  ssoConfig?: Record<string, any>;
  
  // Licensing
  licenseType: string;
  monthlyFee: number;
  transactionFeePercentage?: number;
  contractStartDate: string;
  contractEndDate?: string;
  isActive: boolean;
  
  // Analytics
  totalUsers: number;
  totalPartners: number;
  totalRedemptions: number;
  monthlyActiveUsers: number;
  
  // Support
  supportEmail?: string;
  supportPhone?: string;
  supportHours?: string;
  
  metadata?: Record<string, any>;
  
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// PROMOTIONAL CAMPAIGNS
// ============================================================================

export interface PromotionalCampaign {
  id: string;
  name: string;
  description?: string;
  campaignType: string;
  
  // Targeting
  targetAudience?: Record<string, any>;
  deploymentId?: string;
  
  // Bonus configuration
  bonusMultiplier?: number;
  bonusFlatAmount?: number;
  affectedActivities?: string[];
  
  // Featured items
  featuredRewardIds?: string[];
  featuredPartnerIds?: string[];
  
  // Dates
  startDate: Date;
  endDate: Date;
  
  isActive: boolean;
  
  // Analytics
  totalParticipants: number;
  totalBonusPointsAwarded: number;
  totalRedemptionsDuringCampaign: number;
  
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface ClaimRewardRequest {
  rewardId: string;
  userId: string;
  paymentMethod: {
    radTokens?: number;
    learningPoints?: number;
    actionPoints?: number;
  };
  scheduledDate?: string;
  scheduledTime?: string;
  notes?: string;
}

export interface ClaimRewardResponse {
  success: boolean;
  redemption?: RedemptionWithDetails;
  error?: string;
  insufficientPoints?: {
    needed: number;
    available: number;
    currency: PointCurrency;
  };
}

export interface ConvertPointsRequest {
  userId: string;
  learningPoints?: number;
  actionPoints?: number;
  socialPoints?: number;
}

export interface ConvertPointsResponse {
  success: boolean;
  radTokensEarned: number;
  newBalance: UserPointBalance;
  transactions: PointTransaction[];
}

export interface RewardSearchFilters {
  partnerId?: string;
  category?: PartnerCategory;
  rewardType?: RewardType;
  rarity?: RewardRarity;
  minCost?: number;
  maxCost?: number;
  requiresAppointment?: boolean;
  city?: string;
  featured?: boolean;
  availableNow?: boolean;
  tags?: string[];
}

export interface RewardSearchResult {
  rewards: RewardWithPartner[];
  total: number;
  page: number;
  pageSize: number;
  filters: RewardSearchFilters;
}

export interface UserRewardHistory {
  userId: string;
  redemptions: RedemptionWithDetails[];
  stats: {
    totalRedeemed: number;
    totalExpired: number;
    totalCancelled: number;
    tokensSpent: number;
    estimatedValueReceived: number;
    favoritePartners: Array<{
      partnerId: string;
      partnerName: string;
      redemptionCount: number;
    }>;
    rewardTypeBreakdown: Record<RewardType, number>;
  };
}

export interface PartnerDashboardStats {
  partner: PartnerOrganization;
  analytics: PartnerAnalytics;
  recentRedemptions: RedemptionWithDetails[];
  activeRewards: Reward[];
  alertsAndNotifications: Array<{
    type: 'low_stock' | 'expiring_soon' | 'needs_approval' | 'negative_review';
    message: string;
    count: number;
    actionUrl?: string;
  }>;
}

// ============================================================================
// HELPER TYPES
// ============================================================================

export interface PointsCalculator {
  calculatePointsForActivity(
    activityType: string,
    activityData: any,
    userId: string
  ): Promise<{
    currency: PointCurrency;
    amount: number;
    description: string;
    multiplier?: number;
  }>;
  
  convertToRadTokens(
    userId: string,
    points: Partial<Record<PointCurrency, number>>
  ): Promise<number>;
  
  canAffordReward(
    userId: string,
    reward: Reward
  ): Promise<boolean>;
}

export interface RedemptionValidator {
  canClaimReward(
    userId: string,
    rewardId: string
  ): Promise<{
    canClaim: boolean;
    reason?: string;
    requirements?: string[];
  }>;
  
  validateRedemption(
    confirmationCode: string,
    partnerId: string
  ): Promise<{
    valid: boolean;
    redemption?: RewardRedemption;
    error?: string;
  }>;
}

export interface GradeCalculator {
  calculateGrade(
    assignmentId: string,
    studentId: string
  ): Promise<{
    percentage: number;
    letterGrade: string;
    pointsEarned: number;
    pointsPossible: number;
    breakdown: Record<string, any>;
  }>;
  
  exportGrades(
    assignmentId: string,
    format: 'csv' | 'xlsx' | 'pdf'
  ): Promise<Buffer>;
}

