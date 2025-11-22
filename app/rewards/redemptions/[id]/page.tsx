'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import QRCodeDisplay from '@/components/rewards/QRCodeDisplay';
import type { QRCodeData } from '@/lib/utils/qrcode';

export default function RedemptionDetailPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const redemptionId = params.id as string;

  const [redemption, setRedemption] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      fetchRedemption();
    }
  }, [session, redemptionId]);

  const fetchRedemption = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/rewards/redemptions/${redemptionId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch redemption');
      }

      const data = await response.json();
      setRedemption(data.redemption);
    } catch (err: any) {
      console.error('Error fetching redemption:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this redemption? Your points will be refunded.')) {
      return;
    }

    try {
      const response = await fetch(`/api/rewards/redemptions/${redemptionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel redemption');
      }

      alert('Redemption cancelled successfully. Your points have been refunded.');
      router.push('/rewards/my-rewards');
    } catch (err: any) {
      console.error('Error cancelling redemption:', err);
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your reward...</p>
        </div>
      </div>
    );
  }

  if (error || !redemption) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Redemption Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'This redemption does not exist.'}</p>
          <button
            onClick={() => router.push('/rewards/marketplace')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  // Prepare QR code data
  const qrData: QRCodeData = {
    confirmationCode: redemption.confirmation_code,
    redemptionId: redemption.id,
    userId: redemption.user_id,
    partnerId: redemption.partner_id,
    rewardId: redemption.reward_id,
    expiresAt: redemption.expires_at,
  };

  const isExpired = new Date(redemption.expires_at) < new Date();
  const isCancelled = redemption.status === 'cancelled';
  const isRedeemed = redemption.status === 'redeemed';
  const isPending = redemption.status === 'pending_approval';
  const canUse = redemption.status === 'claimed' || redemption.status === 'approved';

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="mb-4 text-purple-100 hover:text-white flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold mb-2">Your Reward</h1>
          <p className="text-purple-100">
            {isRedeemed
              ? 'Successfully redeemed!'
              : isExpired
              ? 'This reward has expired'
              : isCancelled
              ? 'This redemption was cancelled'
              : isPending
              ? 'Waiting for approval'
              : 'Ready to use'}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Code Section */}
          <div className="flex flex-col items-center">
            {canUse && !isExpired ? (
              <>
                <QRCodeDisplay
                  data={qrData}
                  size={300}
                  brandColor="#9333ea"
                  showConfirmationCode={true}
                  allowDownload={true}
                />

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 max-w-md">
                  <div className="font-semibold mb-1">📱 Ready to use!</div>
                  <p>Show this QR code at {redemption.partner?.name} to claim your reward.</p>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <div className="text-6xl mb-4">
                  {isRedeemed ? '✅' : isExpired ? '⏰' : isCancelled ? '❌' : '⏳'}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {isRedeemed
                    ? 'Already Redeemed'
                    : isExpired
                    ? 'Expired'
                    : isCancelled
                    ? 'Cancelled'
                    : 'Pending Approval'}
                </h3>
                <p className="text-gray-600">
                  {isRedeemed
                    ? `Redeemed on ${new Date(redemption.redeemed_at).toLocaleDateString()}`
                    : isExpired
                    ? `Expired on ${new Date(redemption.expires_at).toLocaleDateString()}`
                    : isCancelled
                    ? 'This redemption was cancelled and points were refunded'
                    : 'Waiting for teacher or parent approval'}
                </p>
              </div>
            )}
          </div>

          {/* Reward Details Section */}
          <div className="space-y-6">
            {/* Reward Info Card */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-lg">
              {redemption.reward?.image_url && (
                <div className="h-48 bg-gray-100">
                  <img
                    src={redemption.reward.image_url}
                    alt={redemption.reward?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="text-4xl">{redemption.reward?.icon || '🎁'}</div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {redemption.reward?.name}
                    </h2>
                    <p className="text-gray-600">{redemption.reward?.description}</p>
                  </div>
                </div>

                {/* Partner Info */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center gap-3 mb-3">
                    {redemption.partner?.logo_url ? (
                      <img
                        src={redemption.partner.logo_url}
                        alt={redemption.partner.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">
                        🏛️
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-gray-900">
                        {redemption.partner?.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {redemption.partner?.city}, {redemption.partner?.state}
                      </div>
                    </div>
                  </div>

                  {redemption.partner?.address && (
                    <div className="text-sm text-gray-600 mb-2">
                      📍 {redemption.partner.address}
                    </div>
                  )}

                  {redemption.partner?.phone && (
                    <div className="text-sm text-gray-600 mb-2">
                      📞 {redemption.partner.phone}
                    </div>
                  )}

                  {redemption.partner?.website && (
                    <a
                      href={redemption.partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                    >
                      🌐 Visit Website →
                    </a>
                  )}
                </div>

                {/* Redemption Instructions */}
                {redemption.reward?.redemption_instructions && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="font-semibold text-gray-900 mb-2">Instructions:</div>
                    <p className="text-sm text-gray-600">
                      {redemption.reward.redemption_instructions}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Redemption Details</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`font-medium ${
                      isRedeemed
                        ? 'text-green-600'
                        : isExpired
                        ? 'text-red-600'
                        : isCancelled
                        ? 'text-gray-600'
                        : isPending
                        ? 'text-amber-600'
                        : 'text-blue-600'
                    }`}
                  >
                    {redemption.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Claimed:</span>
                  <span className="font-medium">
                    {new Date(redemption.claimed_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Expires:</span>
                  <span className={`font-medium ${isExpired ? 'text-red-600' : ''}`}>
                    {new Date(redemption.expires_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Cost:</span>
                  <span className="font-medium">{redemption.cost_paid_tokens} 🪙 tokens</span>
                </div>

                {redemption.scheduled_date && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Scheduled:</span>
                    <span className="font-medium">
                      {new Date(redemption.scheduled_date).toLocaleDateString()}
                      {redemption.scheduled_time && ` at ${redemption.scheduled_time}`}
                    </span>
                  </div>
                )}

                {isRedeemed && redemption.redeemed_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Redeemed:</span>
                    <span className="font-medium text-green-600">
                      {new Date(redemption.redeemed_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            {canUse && !isExpired && (
              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/rewards/marketplace')}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Browse More Rewards
                </button>

                <button
                  onClick={handleCancel}
                  className="px-6 py-3 bg-white border-2 border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Feedback (if redeemed) */}
            {isRedeemed && !redemption.user_rating && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="font-semibold text-amber-900 mb-2">How was your experience?</div>
                <button
                  onClick={() => router.push(`/rewards/redemptions/${redemptionId}/rate`)}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
                >
                  Rate Experience
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

