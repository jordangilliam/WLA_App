'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  difficulty: 'bronze' | 'silver' | 'gold' | 'platinum';
  points_reward: number;
  requirement_type: string;
  requirement_count: number;
  secret: boolean;
}

interface UserAchievement {
  achievement_id: string;
  unlocked_at: string;
  progress?: number;
  current_count?: number;
}

export default function AchievementsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth?callbackUrl=/achievements');
    } else if (status === 'authenticated') {
      fetchAchievements();
    }
  }, [status, router]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/achievements');

      if (response.ok) {
        const data = await response.json();
        setAchievements(data.achievements || []);
        setUserAchievements(data.userAchievements || []);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const unlockedAchievements = userAchievements.length;
  const totalAchievements = achievements.length;
  const completionPercentage =
    totalAchievements > 0 ? Math.round((unlockedAchievements / totalAchievements) * 100) : 0;
  const totalPointsEarned = achievements
    .filter((a) => userAchievements.some((ua) => ua.achievement_id === a.id))
    .reduce((sum, a) => sum + a.points_reward, 0);

  // Get categories
  const categories = ['all', ...new Set(achievements.map((a) => a.category))];

  // Filter achievements
  const filteredAchievements = achievements.filter((achievement) => {
    const isUnlocked = userAchievements.some((ua) => ua.achievement_id === achievement.id);

    if (showUnlockedOnly && !isUnlocked) return false;
    if (selectedCategory !== 'all' && achievement.category !== selectedCategory) return false;
    if (selectedDifficulty !== 'all' && achievement.difficulty !== selectedDifficulty)
      return false;

    return true;
  });

  // Group by category
  const achievementsByCategory = categories.reduce((acc, category) => {
    if (category === 'all') return acc;

    const categoryAchievements = filteredAchievements.filter((a) => a.category === category);
    if (categoryAchievements.length > 0) {
      acc[category] = categoryAchievements;
    }
    return acc;
  }, {} as Record<string, Achievement[]>);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">🏆 Achievements</h1>
          <p className="text-purple-100">Your conservation journey milestones</p>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold">{unlockedAchievements}</div>
              <div className="text-sm text-purple-100">Achievements Unlocked</div>
            </div>

            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold">{completionPercentage}%</div>
              <div className="text-sm text-purple-100">Completion Rate</div>
            </div>

            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold">{totalPointsEarned}</div>
              <div className="text-sm text-purple-100">Points from Achievements</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4">
            {/* Category Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories
                  .filter((c) => c !== 'all')
                  .map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-700 mb-1">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Difficulties</option>
                <option value="bronze">🥉 Bronze</option>
                <option value="silver">🥈 Silver</option>
                <option value="gold">🥇 Gold</option>
                <option value="platinum">💎 Platinum</option>
              </select>
            </div>

            {/* Show Unlocked Only Toggle */}
            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="showUnlockedOnly"
                checked={showUnlockedOnly}
                onChange={(e) => setShowUnlockedOnly(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <label htmlFor="showUnlockedOnly" className="text-sm text-gray-700">
                Unlocked Only
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {selectedCategory === 'all' ? (
          // Show grouped by category
          <div className="space-y-8">
            {Object.entries(achievementsByCategory).map(([category, categoryAchievements]) => (
              <div key={category}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 capitalize">
                  {category} Achievements
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryAchievements.map((achievement) => {
                    const userAchievement = userAchievements.find(
                      (ua) => ua.achievement_id === achievement.id
                    );
                    return (
                      <AchievementCard
                        key={achievement.id}
                        achievement={achievement}
                        userAchievement={userAchievement}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Show filtered achievements
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAchievements.map((achievement) => {
              const userAchievement = userAchievements.find(
                (ua) => ua.achievement_id === achievement.id
              );
              return (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  userAchievement={userAchievement}
                />
              );
            })}
          </div>
        )}

        {filteredAchievements.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Achievements Found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedDifficulty('all');
                setShowUnlockedOnly(false);
              }}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Achievement Card Component
function AchievementCard({
  achievement,
  userAchievement,
}: {
  achievement: Achievement;
  userAchievement?: UserAchievement;
}) {
  const isUnlocked = !!userAchievement;
  const progress = userAchievement?.progress || 0;
  const currentCount = userAchievement?.current_count || 0;
  const progressPercentage = Math.min((currentCount / achievement.requirement_count) * 100, 100);

  const difficultyColors = {
    bronze: 'from-orange-400 to-orange-600',
    silver: 'from-gray-400 to-gray-600',
    gold: 'from-yellow-400 to-yellow-600',
    platinum: 'from-purple-400 to-purple-600',
  };

  const difficultyIcons = {
    bronze: '🥉',
    silver: '🥈',
    gold: '🥇',
    platinum: '💎',
  };

  return (
    <div
      className={`rounded-lg border-2 overflow-hidden transition-all ${
        isUnlocked
          ? 'border-purple-300 bg-white shadow-lg hover:shadow-xl'
          : 'border-gray-200 bg-gray-50 opacity-60'
      }`}
    >
      {/* Header with difficulty badge */}
      <div
        className={`px-4 py-3 bg-gradient-to-r ${
          difficultyColors[achievement.difficulty]
        } text-white`}
      >
        <div className="flex items-center justify-between">
          <span className="text-2xl">{difficultyIcons[achievement.difficulty]}</span>
          <span className="text-xs font-semibold uppercase tracking-wide">
            {achievement.difficulty}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Icon and Title */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`text-4xl ${!isUnlocked && 'grayscale opacity-40'}`}>
            {achievement.secret && !isUnlocked ? '❓' : achievement.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1">
              {achievement.secret && !isUnlocked ? 'Secret Achievement' : achievement.title}
            </h3>
            <p className="text-sm text-gray-600">
              {achievement.secret && !isUnlocked
                ? 'Unlock to reveal details'
                : achievement.description}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {!isUnlocked && !achievement.secret && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>
                {currentCount} / {achievement.requirement_count}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Points Badge */}
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
            +{achievement.points_reward} pts
          </span>

          {isUnlocked && userAchievement && (
            <span className="text-xs text-gray-500">
              Unlocked {new Date(userAchievement.unlocked_at).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

