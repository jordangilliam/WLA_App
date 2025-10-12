/**
 * Achievement Badge System
 * 
 * Gamification system that rewards users for conservation activities,
 * field work, learning, and engagement with the platform.
 */

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'Fishing' | 'Learning' | 'Conservation' | 'Field Work' | 'Social' | 'Master';
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  points: number;
  requirement: {
    type: string;
    count: number;
    description: string;
  };
  earned: boolean;
  earnedDate?: number;
  progress: number;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
}

// Define all achievements
export const ALL_ACHIEVEMENTS: Achievement[] = [
  // FISHING ACHIEVEMENTS
  {
    id: 'first-catch',
    name: 'First Cast',
    description: 'Log your first fishing catch',
    icon: '🎣',
    category: 'Fishing',
    tier: 'Bronze',
    points: 10,
    requirement: {
      type: 'catches',
      count: 1,
      description: 'Log 1 fishing catch'
    },
    earned: false,
    progress: 0,
    rarity: 'Common'
  },
  {
    id: 'ten-catches',
    name: 'Angler',
    description: 'Log 10 fishing catches',
    icon: '🎣',
    category: 'Fishing',
    tier: 'Silver',
    points: 50,
    requirement: {
      type: 'catches',
      count: 10,
      description: 'Log 10 fishing catches'
    },
    earned: false,
    progress: 0,
    rarity: 'Uncommon'
  },
  {
    id: 'fifty-catches',
    name: 'Master Angler',
    description: 'Log 50 fishing catches',
    icon: '🏆',
    category: 'Fishing',
    tier: 'Gold',
    points: 250,
    requirement: {
      type: 'catches',
      count: 50,
      description: 'Log 50 fishing catches'
    },
    earned: false,
    progress: 0,
    rarity: 'Rare'
  },
  {
    id: 'brook-trout',
    name: 'Brookie Hunter',
    description: 'Catch a wild brook trout',
    icon: '🐟',
    category: 'Fishing',
    tier: 'Gold',
    points: 100,
    requirement: {
      type: 'species',
      count: 1,
      description: 'Catch a brook trout'
    },
    earned: false,
    progress: 0,
    rarity: 'Rare'
  },
  {
    id: 'grand-slam',
    name: 'PA Grand Slam',
    description: 'Catch brook, brown, and rainbow trout',
    icon: '🌟',
    category: 'Fishing',
    tier: 'Platinum',
    points: 500,
    requirement: {
      type: 'trout-slam',
      count: 3,
      description: 'Catch all 3 trout species'
    },
    earned: false,
    progress: 0,
    rarity: 'Epic'
  },
  {
    id: 'trophy-fish',
    name: 'Trophy Hunter',
    description: 'Catch a fish over 20 inches',
    icon: '👑',
    category: 'Fishing',
    tier: 'Gold',
    points: 200,
    requirement: {
      type: 'size',
      count: 20,
      description: 'Catch a fish over 20 inches'
    },
    earned: false,
    progress: 0,
    rarity: 'Rare'
  },
  {
    id: 'visit-ten-waters',
    name: 'Water Explorer',
    description: 'Fish at 10 different water bodies',
    icon: '🗺️',
    category: 'Fishing',
    tier: 'Silver',
    points: 100,
    requirement: {
      type: 'waters-visited',
      count: 10,
      description: 'Visit 10 different waters'
    },
    earned: false,
    progress: 0,
    rarity: 'Uncommon'
  },

  // LEARNING ACHIEVEMENTS
  {
    id: 'first-lesson',
    name: 'Student',
    description: 'Complete your first lesson',
    icon: '📚',
    category: 'Learning',
    tier: 'Bronze',
    points: 10,
    requirement: {
      type: 'lessons',
      count: 1,
      description: 'Complete 1 lesson'
    },
    earned: false,
    progress: 0,
    rarity: 'Common'
  },
  {
    id: 'five-lessons',
    name: 'Scholar',
    description: 'Complete 5 lessons',
    icon: '📖',
    category: 'Learning',
    tier: 'Silver',
    points: 50,
    requirement: {
      type: 'lessons',
      count: 5,
      description: 'Complete 5 lessons'
    },
    earned: false,
    progress: 0,
    rarity: 'Uncommon'
  },
  {
    id: 'all-lessons',
    name: 'Conservationist',
    description: 'Complete all lessons',
    icon: '🎓',
    category: 'Learning',
    tier: 'Platinum',
    points: 500,
    requirement: {
      type: 'lessons',
      count: 12,
      description: 'Complete all 12 lessons'
    },
    earned: false,
    progress: 0,
    rarity: 'Epic'
  },
  {
    id: 'quiz-master',
    name: 'Quiz Master',
    description: 'Score 100% on any quiz',
    icon: '💯',
    category: 'Learning',
    tier: 'Gold',
    points: 100,
    requirement: {
      type: 'perfect-quiz',
      count: 1,
      description: 'Get 100% on a quiz'
    },
    earned: false,
    progress: 0,
    rarity: 'Rare'
  },

  // CONSERVATION ACHIEVEMENTS
  {
    id: 'first-observation',
    name: 'Observer',
    description: 'Log your first field observation',
    icon: '👁️',
    category: 'Conservation',
    tier: 'Bronze',
    points: 10,
    requirement: {
      type: 'observations',
      count: 1,
      description: 'Log 1 observation'
    },
    earned: false,
    progress: 0,
    rarity: 'Common'
  },
  {
    id: 'macro-expert',
    name: 'Macro Expert',
    description: 'Identify 10 macroinvertebrates',
    icon: '🔬',
    category: 'Conservation',
    tier: 'Gold',
    points: 150,
    requirement: {
      type: 'macros',
      count: 10,
      description: 'Identify 10 macroinvertebrates'
    },
    earned: false,
    progress: 0,
    rarity: 'Rare'
  },
  {
    id: 'plant-identifier',
    name: 'Botanist',
    description: 'Identify 15 native plants',
    icon: '🌿',
    category: 'Conservation',
    tier: 'Gold',
    points: 150,
    requirement: {
      type: 'plants',
      count: 15,
      description: 'Identify 15 plants'
    },
    earned: false,
    progress: 0,
    rarity: 'Rare'
  },
  {
    id: 'bug-hunter',
    name: 'Entomologist',
    description: 'Identify 12 insect species',
    icon: '🦋',
    category: 'Conservation',
    tier: 'Gold',
    points: 150,
    requirement: {
      type: 'insects',
      count: 12,
      description: 'Identify 12 insects'
    },
    earned: false,
    progress: 0,
    rarity: 'Rare'
  },
  {
    id: 'water-guardian',
    name: 'Water Guardian',
    description: 'Submit 5 water quality reports',
    icon: '💧',
    category: 'Conservation',
    tier: 'Silver',
    points: 75,
    requirement: {
      type: 'water-reports',
      count: 5,
      description: 'Submit 5 water reports'
    },
    earned: false,
    progress: 0,
    rarity: 'Uncommon'
  },
  {
    id: 'habitat-builder',
    name: 'Habitat Designer',
    description: 'Create 10 successful habitat simulations',
    icon: '🏕️',
    category: 'Conservation',
    tier: 'Gold',
    points: 100,
    requirement: {
      type: 'habitats',
      count: 10,
      description: 'Create 10 habitats scoring 80%+'
    },
    earned: false,
    progress: 0,
    rarity: 'Rare'
  },

  // FIELD WORK ACHIEVEMENTS
  {
    id: 'gps-tracker',
    name: 'Trail Blazer',
    description: 'Complete your first GPS track',
    icon: '📍',
    category: 'Field Work',
    tier: 'Bronze',
    points: 25,
    requirement: {
      type: 'gps-tracks',
      count: 1,
      description: 'Complete 1 GPS track'
    },
    earned: false,
    progress: 0,
    rarity: 'Common'
  },
  {
    id: 'distance-walker',
    name: 'Distance Walker',
    description: 'Walk 10 miles with GPS tracking',
    icon: '🥾',
    category: 'Field Work',
    tier: 'Silver',
    points: 100,
    requirement: {
      type: 'distance',
      count: 10,
      description: 'Walk 10 miles'
    },
    earned: false,
    progress: 0,
    rarity: 'Uncommon'
  },
  {
    id: 'marathon-hiker',
    name: 'Marathon Hiker',
    description: 'Walk 26.2 miles with GPS tracking',
    icon: '🏃',
    category: 'Field Work',
    tier: 'Platinum',
    points: 500,
    requirement: {
      type: 'distance',
      count: 26.2,
      description: 'Walk a marathon distance'
    },
    earned: false,
    progress: 0,
    rarity: 'Epic'
  },
  {
    id: 'waypoint-master',
    name: 'Waypoint Master',
    description: 'Mark 50 waypoints',
    icon: '📌',
    category: 'Field Work',
    tier: 'Gold',
    points: 150,
    requirement: {
      type: 'waypoints',
      count: 50,
      description: 'Mark 50 waypoints'
    },
    earned: false,
    progress: 0,
    rarity: 'Rare'
  },
  {
    id: 'photo-doc',
    name: 'Photographer',
    description: 'Upload 100 field photos',
    icon: '📸',
    category: 'Field Work',
    tier: 'Silver',
    points: 75,
    requirement: {
      type: 'photos',
      count: 100,
      description: 'Upload 100 photos'
    },
    earned: false,
    progress: 0,
    rarity: 'Uncommon'
  },

  // SOCIAL ACHIEVEMENTS
  {
    id: 'first-share',
    name: 'Sharer',
    description: 'Share your first catch report',
    icon: '📤',
    category: 'Social',
    tier: 'Bronze',
    points: 10,
    requirement: {
      type: 'shares',
      count: 1,
      description: 'Share 1 report'
    },
    earned: false,
    progress: 0,
    rarity: 'Common'
  },
  {
    id: 'streak-7',
    name: 'Dedicated',
    description: 'Log in for 7 days in a row',
    icon: '🔥',
    category: 'Social',
    tier: 'Silver',
    points: 50,
    requirement: {
      type: 'streak',
      count: 7,
      description: 'Maintain a 7-day streak'
    },
    earned: false,
    progress: 0,
    rarity: 'Uncommon'
  },
  {
    id: 'streak-30',
    name: 'Committed',
    description: 'Log in for 30 days in a row',
    icon: '🔥',
    category: 'Social',
    tier: 'Gold',
    points: 200,
    requirement: {
      type: 'streak',
      count: 30,
      description: 'Maintain a 30-day streak'
    },
    earned: false,
    progress: 0,
    rarity: 'Rare'
  },
  {
    id: 'streak-365',
    name: 'Year-Round Conservationist',
    description: 'Log in for 365 days in a row',
    icon: '💎',
    category: 'Social',
    tier: 'Diamond',
    points: 2000,
    requirement: {
      type: 'streak',
      count: 365,
      description: 'Maintain a 365-day streak'
    },
    earned: false,
    progress: 0,
    rarity: 'Legendary'
  },

  // MASTER ACHIEVEMENTS
  {
    id: 'point-1000',
    name: 'Achiever',
    description: 'Earn 1,000 total points',
    icon: '⭐',
    category: 'Master',
    tier: 'Silver',
    points: 0, // Milestone, no additional points
    requirement: {
      type: 'total-points',
      count: 1000,
      description: 'Earn 1,000 points'
    },
    earned: false,
    progress: 0,
    rarity: 'Uncommon'
  },
  {
    id: 'point-5000',
    name: 'Champion',
    description: 'Earn 5,000 total points',
    icon: '🏆',
    category: 'Master',
    tier: 'Gold',
    points: 0,
    requirement: {
      type: 'total-points',
      count: 5000,
      description: 'Earn 5,000 points'
    },
    earned: false,
    progress: 0,
    rarity: 'Rare'
  },
  {
    id: 'point-10000',
    name: 'Legend',
    description: 'Earn 10,000 total points',
    icon: '👑',
    category: 'Master',
    tier: 'Platinum',
    points: 0,
    requirement: {
      type: 'total-points',
      count: 10000,
      description: 'Earn 10,000 points'
    },
    earned: false,
    progress: 0,
    rarity: 'Epic'
  },
  {
    id: 'all-badges',
    name: 'Badge Collector',
    description: 'Earn all other achievements',
    icon: '💎',
    category: 'Master',
    tier: 'Diamond',
    points: 5000,
    requirement: {
      type: 'all-badges',
      count: 30,
      description: 'Earn all badges'
    },
    earned: false,
    progress: 0,
    rarity: 'Legendary'
  }
];

// Achievement Manager Class
export class AchievementManager {
  private achievements: Achievement[] = [];

  constructor() {
    this.loadAchievements();
  }

  /**
   * Load achievements from local storage
   */
  private loadAchievements(): void {
    try {
      const stored = localStorage.getItem('wla-achievements');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.achievements = ALL_ACHIEVEMENTS.map(achievement => {
          const saved = parsed.find((a: Achievement) => a.id === achievement.id);
          return saved || achievement;
        });
      } else {
        this.achievements = [...ALL_ACHIEVEMENTS];
      }
    } catch (error) {
      console.error('Failed to load achievements:', error);
      this.achievements = [...ALL_ACHIEVEMENTS];
    }
  }

  /**
   * Save achievements to local storage
   */
  private saveAchievements(): void {
    try {
      localStorage.setItem('wla-achievements', JSON.stringify(this.achievements));
    } catch (error) {
      console.error('Failed to save achievements:', error);
    }
  }

  /**
   * Check and update achievement progress
   */
  checkProgress(type: string, currentValue: number): Achievement[] {
    const newlyEarned: Achievement[] = [];

    this.achievements.forEach(achievement => {
      if (achievement.earned || achievement.requirement.type !== type) {
        return;
      }

      const progress = Math.min(100, (currentValue / achievement.requirement.count) * 100);
      achievement.progress = progress;

      if (currentValue >= achievement.requirement.count) {
        achievement.earned = true;
        achievement.earnedDate = Date.now();
        newlyEarned.push(achievement);
      }
    });

    if (newlyEarned.length > 0) {
      this.saveAchievements();
    }

    return newlyEarned;
  }

  /**
   * Get all achievements
   */
  getAll(): Achievement[] {
    return [...this.achievements];
  }

  /**
   * Get earned achievements
   */
  getEarned(): Achievement[] {
    return this.achievements.filter(a => a.earned);
  }

  /**
   * Get achievements in progress
   */
  getInProgress(): Achievement[] {
    return this.achievements.filter(a => !a.earned && a.progress > 0);
  }

  /**
   * Get achievements by category
   */
  getByCategory(category: Achievement['category']): Achievement[] {
    return this.achievements.filter(a => a.category === category);
  }

  /**
   * Get achievements by rarity
   */
  getByRarity(rarity: Achievement['rarity']): Achievement[] {
    return this.achievements.filter(a => a.rarity === rarity);
  }

  /**
   * Get total points from earned achievements
   */
  getTotalPoints(): number {
    return this.achievements
      .filter(a => a.earned)
      .reduce((sum, a) => sum + a.points, 0);
  }

  /**
   * Get completion percentage
   */
  getCompletionPercentage(): number {
    const earned = this.achievements.filter(a => a.earned).length;
    return Math.round((earned / this.achievements.length) * 100);
  }

  /**
   * Reset all achievements (for testing)
   */
  reset(): void {
    this.achievements = ALL_ACHIEVEMENTS.map(a => ({ ...a, earned: false, progress: 0 }));
    this.saveAchievements();
  }
}

// Export singleton instance
export const achievementManager = new AchievementManager();

