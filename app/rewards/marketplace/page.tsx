'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { Reward, PartnerOrganization, UserPointBalance } from '@/lib/types/rad-pass.types';

export default function RewardsMarketplacePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [rewards, setRewards] = useState<any[]>([]);
  const [partners, setPartners] = useState<PartnerOrganization[]>([]);
  const [balance, setBalance] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [selectedPartner, setSelectedPartner] = useState<string>('all');
  const [maxCost, setMaxCost] = useState<number>(1000);
  const [showAffordableOnly, setShowAffordableOnly] = useState(false);

  // View mode
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth?callbackUrl=/rewards/marketplace');
    } else if (status === 'authenticated') {
      fetchData();
    }
  }, [status, router]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch balance, rewards, and partners in parallel
      const [balanceRes, rewardsRes, partnersRes] = await Promise.all([
        fetch('/api/rewards/points'),
        fetch('/api/rewards'),
        fetch('/api/rewards/partners'),
      ]);

      if (balanceRes.ok) {
        const balanceData = await balanceRes.json();
        setBalance(balanceData.balance);
      }

      if (rewardsRes.ok) {
        const rewardsData = await rewardsRes.json();
        setRewards(rewardsData.rewards || []);
      }

      if (partnersRes.ok) {
        const partnersData = await partnersRes.json();
        setPartners(partnersData.partners || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter rewards
  const filteredRewards = rewards.filter((reward) => {
    if (selectedCategory !== 'all' && reward.partner_category !== selectedCategory) return false;
    if (selectedRarity !== 'all' && reward.rarity !== selectedRarity) return false;
    if (selectedPartner !== 'all' && reward.partner_id !== selectedPartner) return false;
    if (reward.cost_rad_tokens > maxCost) return false;
    if (showAffordableOnly && balance && reward.cost_rad_tokens > balance.current.radTokens) return false;

    return true;
  });

  const rarityColors = {
    common: 'from-gray-400 to-gray-500',
    uncommon: 'from-green-400 to-green-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-yellow-600',
  };

  const rarityIcons = {
    common: '⚪',
    uncommon: '🟢',
    rare: '🔵',
    epic: '🟣',
    legendary: '🟡',
  };

  const categoryIcons = {
    museum: '🏛️',
    library: '📚',
    cultural_venue: '🎭',
    restaurant: '🍕',
    entertainment: '🎮',
    retail: '🛍️',
    recreation: '⛳',
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading rewards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 pb-20 md:pb-6">
      {/* Header with Balance */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">🎁 Rewards Marketplace</h1>
              <p className="text-purple-100">Redeem your points for amazing experiences!</p>
            </div>

            {balance && (
              <div className="hidden md:block">
                <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-sm text-purple-100 mb-1">Your Balance</div>
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-2xl font-bold">{balance.current.radTokens}</div>
                      <div className="text-xs text-purple-100">RAD Tokens</div>
                    </div>
                    <div className="border-l border-white border-opacity-30 pl-4">
                      <div className="text-sm">{balance.current.learning} 📚</div>
                      <div className="text-sm">{balance.current.action} ⚡</div>
                      <div className="text-sm">{balance.current.social} 👥</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Balance */}
          {balance && (
            <div className="md:hidden mt-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-purple-100">RAD Tokens</div>
                    <div className="text-2xl font-bold">{balance.current.radTokens}</div>
                  </div>
                  <div className="text-right text-sm">
                    <div>{balance.current.learning} 📚 Learning</div>
                    <div>{balance.current.action} ⚡ Action</div>
                    <div>{balance.current.social} 👥 Social</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Filters Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="museum">🏛️ Museums</option>
              <option value="library">📚 Libraries</option>
              <option value="cultural_venue">🎭 Cultural</option>
              <option value="restaurant">🍕 Food</option>
              <option value="entertainment">🎮 Entertainment</option>
              <option value="recreation">⛳ Recreation</option>
            </select>

            {/* Partner Filter */}
            <select
              value={selectedPartner}
              onChange={(e) => setSelectedPartner(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Partners</option>
              {partners.map((partner) => (
                <option key={partner.id} value={partner.id}>
                  {partner.name}
                </option>
              ))}
            </select>

            {/* Rarity Filter */}
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Rarities</option>
              <option value="common">⚪ Common</option>
              <option value="uncommon">🟢 Uncommon</option>
              <option value="rare">🔵 Rare</option>
              <option value="epic">🟣 Epic</option>
              <option value="legendary">🟡 Legendary</option>
            </select>

            {/* Max Cost */}
            <div>
              <input
                type="range"
                min="0"
                max="1000"
                step="25"
                value={maxCost}
                onChange={(e) => setMaxCost(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-600 text-center">Max: {maxCost} tokens</div>
            </div>

            {/* Affordable Only Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showAffordableOnly}
                onChange={(e) => setShowAffordableOnly(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Affordable only</span>
            </label>
          </div>

          {/* View Mode Toggle */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {filteredRewards.length} of {rewards.length} rewards
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Rewards Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                balance={balance}
                onClaim={() => router.push(`/rewards/${reward.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRewards.map((reward) => (
              <RewardListItem
                key={reward.id}
                reward={reward}
                balance={balance}
                onClaim={() => router.push(`/rewards/${reward.id}`)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredRewards.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">🎁</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Rewards Found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedRarity('all');
                setSelectedPartner('all');
                setMaxCost(1000);
                setShowAffordableOnly(false);
              }}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Need More Tokens?</h3>
              <p className="text-purple-100">
                Convert your activity points or complete more challenges!
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/rewards/convert')}
                className="px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
              >
                Convert Points
              </button>
              <button
                onClick={() => router.push('/challenges')}
                className="px-6 py-3 bg-purple-700 text-white rounded-lg font-medium hover:bg-purple-800 transition-colors"
              >
                View Challenges
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reward Card Component (Grid View)
function RewardCard({ reward, balance, onClaim }: any) {
  const canAfford = balance && reward.cost_rad_tokens <= balance.current.radTokens;
  const canClaim = reward.user_can_claim && canAfford;

  const rarityColors = {
    common: 'from-gray-400 to-gray-500',
    uncommon: 'from-green-400 to-green-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-yellow-600',
  };

  return (
    <div
      className={`bg-white rounded-lg border-2 overflow-hidden transition-all cursor-pointer ${
        canClaim
          ? 'border-purple-300 shadow-lg hover:shadow-xl hover:scale-105'
          : 'border-gray-200 opacity-75'
      }`}
      onClick={onClaim}
    >
      {/* Header with rarity */}
      <div className={`px-4 py-3 bg-gradient-to-r ${rarityColors[reward.rarity]} text-white`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide">{reward.rarity}</span>
          <span className="text-sm font-medium">
            {reward.cost_rad_tokens} 🪙
          </span>
        </div>
      </div>

      {/* Image */}
      {reward.image_url && (
        <div className="h-40 bg-gray-100 overflow-hidden">
          <img
            src={reward.image_url}
            alt={reward.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="text-3xl">{reward.icon || '🎁'}</div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1">{reward.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{reward.description}</p>
          </div>
        </div>

        {/* Partner */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <span>{reward.partner_logo ? '🏢' : '📍'}</span>
          <span>{reward.partner_name}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>
            {reward.quantity_remaining
              ? `${reward.quantity_remaining} left`
              : 'Unlimited'}
          </span>
          <span>{reward.total_claimed || 0} claimed</span>
        </div>

        {/* Action Button */}
        <button
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            canClaim
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : !canAfford
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-gray-200 text-gray-600'
          }`}
          disabled={!canClaim}
        >
          {!canAfford
            ? `Need ${reward.cost_rad_tokens - (balance?.current.radTokens || 0)} more`
            : !reward.user_can_claim
            ? 'Max claims reached'
            : 'Claim Reward'}
        </button>
      </div>
    </div>
  );
}

// Reward List Item Component (List View)
function RewardListItem({ reward, balance, onClaim }: any) {
  const canAfford = balance && reward.cost_rad_tokens <= balance.current.radTokens;
  const canClaim = reward.user_can_claim && canAfford;

  return (
    <div
      className={`bg-white rounded-lg border-2 overflow-hidden transition-all cursor-pointer ${
        canClaim
          ? 'border-purple-300 shadow-lg hover:shadow-xl'
          : 'border-gray-200 opacity-75'
      }`}
      onClick={onClaim}
    >
      <div className="p-4 flex items-center gap-4">
        <div className="text-4xl">{reward.icon || '🎁'}</div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-gray-900">{reward.name}</h3>
              <p className="text-sm text-gray-600">{reward.partner_name}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">
                {reward.cost_rad_tokens} 🪙
              </div>
              <div className="text-xs text-gray-500 uppercase">{reward.rarity}</div>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-3">{reward.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex gap-4 text-xs text-gray-500">
              <span>
                {reward.quantity_remaining
                  ? `${reward.quantity_remaining} left`
                  : 'Unlimited'}
              </span>
              <span>{reward.total_claimed || 0} claimed</span>
            </div>

            <button
              className={`py-2 px-6 rounded-lg font-medium transition-colors ${
                canClaim
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-200 text-gray-600 cursor-not-allowed'
              }`}
              disabled={!canClaim}
            >
              {!canAfford ? 'Insufficient Tokens' : 'Claim Reward'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

