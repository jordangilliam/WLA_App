'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import QRCodeScanner from '@/components/rewards/QRCodeScanner';
import type { QRCodeData } from '@/lib/utils/qrcode';

export default function PartnerValidationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [validatedRedemption, setValidatedRedemption] = useState<any | null>(null);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (qrData: QRCodeData) => {
    setValidating(true);
    setError(null);

    try {
      // Validate with API
      const response = await fetch('/api/rewards/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confirmationCode: qrData.confirmationCode,
        }),
      });

      const data = await response.json();

      if (!data.valid) {
        setError(data.error || 'Invalid redemption code');
        setValidating(false);
        return;
      }

      setValidatedRedemption(data.redemption);
    } catch (err: any) {
      console.error('Error validating redemption:', err);
      setError('Failed to validate redemption');
    } finally {
      setValidating(false);
    }
  };

  const handleRedeem = async () => {
    if (!validatedRedemption) return;

    if (!confirm('Confirm that you have provided this reward to the student?')) {
      return;
    }

    try {
      const response = await fetch('/api/rewards/validate', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confirmationCode: validatedRedemption.confirmation_code,
          notes: '', // Could add optional notes field
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to mark as redeemed');
      }

      // Success!
      alert('✅ Reward successfully redeemed!');
      setValidatedRedemption(null);
    } catch (err: any) {
      console.error('Error redeeming:', err);
      alert(err.message);
    }
  };

  const handleCancel = () => {
    setValidatedRedemption(null);
    setError(null);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to validate redemptions.</p>
          <button
            onClick={() => router.push('/auth')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Partner Validation</h1>
          <p className="text-purple-100">Scan student QR codes to validate rewards</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {!validatedRedemption ? (
          <>
            {/* Scanner */}
            <QRCodeScanner
              onScan={handleScan}
              onError={setError}
              className="max-w-2xl mx-auto"
            />

            {/* Validating State */}
            {validating && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center max-w-md mx-auto">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <div className="text-blue-800 font-medium">Validating redemption...</div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="mt-12">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Validations</h2>
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-500">
                No recent validations
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Validation Success - Show Details */}
            <div className="max-w-2xl mx-auto">
              {/* Success Banner */}
              <div className="bg-green-50 border-2 border-green-400 rounded-lg p-6 mb-6 text-center">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-green-900 mb-2">Valid Redemption!</h2>
                <p className="text-green-700">This QR code is authentic and ready to redeem.</p>
              </div>

              {/* Redemption Details */}
              <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4">
                  <h3 className="text-xl font-bold">Redemption Details</h3>
                </div>

                <div className="p-6 space-y-6">
                  {/* Student Info */}
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-2">Student</div>
                    <div className="flex items-center gap-3">
                      {validatedRedemption.user?.avatar_url ? (
                        <img
                          src={validatedRedemption.user.avatar_url}
                          alt={validatedRedemption.user.display_name}
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-xl">
                          👤
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-gray-900">
                          {validatedRedemption.user?.display_name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {validatedRedemption.user?.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reward Info */}
                  <div className="border-t border-gray-200 pt-6">
                    <div className="text-sm font-medium text-gray-600 mb-2">Reward</div>
                    <div className="flex items-start gap-3">
                      <div className="text-4xl">{validatedRedemption.reward?.icon || '🎁'}</div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">
                          {validatedRedemption.reward?.name}
                        </div>
                        <div className="text-gray-600">
                          {validatedRedemption.reward?.description}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Confirmation Code */}
                  <div className="border-t border-gray-200 pt-6">
                    <div className="text-sm font-medium text-gray-600 mb-2">Confirmation Code</div>
                    <div className="text-2xl font-bold text-purple-600 tracking-wider font-mono">
                      {validatedRedemption.confirmation_code}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="border-t border-gray-200 pt-6 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Claimed</div>
                      <div className="font-medium">
                        {new Date(validatedRedemption.claimed_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Expires</div>
                      <div className="font-medium">
                        {new Date(validatedRedemption.expires_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Cost</div>
                      <div className="font-medium">
                        {validatedRedemption.cost_paid_tokens} 🪙 tokens
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Status</div>
                      <div className="font-medium text-green-600">
                        {validatedRedemption.status.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  {/* Redemption Instructions */}
                  {validatedRedemption.reward?.redemption_instructions && (
                    <div className="border-t border-gray-200 pt-6">
                      <div className="text-sm font-medium text-gray-600 mb-2">
                        Redemption Instructions
                      </div>
                      <div className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                        {validatedRedemption.reward.redemption_instructions}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleRedeem}
                  className="flex-1 px-8 py-4 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 transition-colors shadow-lg"
                >
                  ✓ Confirm Redemption
                </button>

                <button
                  onClick={handleCancel}
                  className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>

              {/* Warning */}
              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                <strong>⚠️ Important:</strong> Only click "Confirm Redemption" after you have
                provided the reward to the student. This action cannot be undone.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

