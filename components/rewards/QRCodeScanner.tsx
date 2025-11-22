'use client';

import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { decodeQRData, validateQRData, parseConfirmationCode, type QRCodeData } from '@/lib/utils/qrcode';

interface QRCodeScannerProps {
  onScan: (data: QRCodeData) => void;
  onError?: (error: string) => void;
  partnerId?: string;
  className?: string;
}

/**
 * QR Code Scanner component for partners to validate redemptions
 * Uses device camera to scan QR codes
 */
export default function QRCodeScanner({
  onScan,
  onError,
  partnerId,
  className = '',
}: QRCodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const [manualEntry, setManualEntry] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerDivId = 'qr-scanner-' + Math.random().toString(36).substring(7);

  useEffect(() => {
    // Check camera availability
    checkCamera();

    return () => {
      stopScanning();
    };
  }, []);

  const checkCamera = async () => {
    try {
      const devices = await Html5Qrcode.getCameras();
      setHasCamera(devices.length > 0);
    } catch (err) {
      console.error('Error checking cameras:', err);
      setHasCamera(false);
    }
  };

  const startScanning = async () => {
    try {
      setError(null);
      setIsScanning(true);

      // Initialize scanner
      scannerRef.current = new Html5Qrcode(scannerDivId);

      // Configure scanning
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      // Start scanning with back camera
      await scannerRef.current.start(
        { facingMode: 'environment' },
        config,
        handleScanSuccess,
        handleScanError
      );
    } catch (err: any) {
      console.error('Error starting scanner:', err);
      const errorMsg = err?.message || 'Failed to start camera';
      setError(errorMsg);
      onError?.(errorMsg);
      setIsScanning(false);
    }
  };

  const stopScanning = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
      }
      setIsScanning(false);
    } catch (err) {
      console.error('Error stopping scanner:', err);
    }
  };

  const handleScanSuccess = (decodedText: string) => {
    // Decode QR data
    const qrData = decodeQRData(decodedText);

    if (!qrData) {
      const errorMsg = 'Invalid QR code format';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    // Validate QR data
    const validation = validateQRData(qrData);
    if (!validation.valid) {
      const errorMsg = validation.errors.join(', ');
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    // Check if QR code is for this partner
    if (partnerId && qrData.partnerId !== partnerId) {
      const errorMsg = 'This reward is for a different partner';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    // Success!
    stopScanning();
    onScan(qrData);
  };

  const handleScanError = (errorMessage: string) => {
    // Ignore common scanning errors (just means no QR code in frame)
    if (errorMessage.includes('NotFoundException')) {
      return;
    }
    console.error('Scan error:', errorMessage);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = parseConfirmationCode(manualCode);
    if (!parsed) {
      const errorMsg = 'Invalid confirmation code format';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    // Validate with API
    try {
      const response = await fetch('/api/rewards/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confirmationCode: parsed,
          partnerId,
        }),
      });

      const data = await response.json();

      if (!data.valid) {
        const errorMsg = data.error || 'Invalid confirmation code';
        setError(errorMsg);
        onError?.(errorMsg);
        return;
      }

      // Convert redemption data to QR data format
      const qrData: QRCodeData = {
        confirmationCode: data.redemption.confirmation_code,
        redemptionId: data.redemption.id,
        userId: data.redemption.user_id,
        partnerId: data.redemption.partner_id,
        rewardId: data.redemption.reward_id,
        expiresAt: data.redemption.expires_at,
      };

      onScan(qrData);
      setManualCode('');
    } catch (err) {
      console.error('Error validating manual code:', err);
      const errorMsg = 'Failed to validate code';
      setError(errorMsg);
      onError?.(errorMsg);
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {!manualEntry ? (
        <>
          {/* Scanner View */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Scanner Container */}
            {isScanning ? (
              <div>
                <div id={scannerDivId} className="w-full" />

                {error && (
                  <div className="bg-red-50 border-t-2 border-red-400 px-4 py-3 text-red-700">
                    <div className="font-medium">⚠️ {error}</div>
                  </div>
                )}

                <div className="p-4 bg-gray-50 border-t text-center">
                  <p className="text-sm text-gray-600 mb-3">
                    Point your camera at the QR code
                  </p>
                  <button
                    onClick={stopScanning}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Stop Scanning
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">📱</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Scan QR Code
                </h3>
                <p className="text-gray-600 mb-6">
                  Use your camera to scan the student's QR code
                </p>

                {hasCamera ? (
                  <button
                    onClick={startScanning}
                    className="px-8 py-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors text-lg"
                  >
                    Start Camera
                  </button>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-amber-800 text-sm">
                    Camera not available. Please use manual entry below.
                  </div>
                )}

                {error && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
                    {error}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Manual Entry Option */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setManualEntry(true)}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-2 mx-auto"
            >
              <span>⌨️</span>
              <span>Enter confirmation code manually</span>
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Manual Entry View */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Manual Entry</h3>
              <button
                onClick={() => {
                  setManualEntry(false);
                  setError(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmation Code
                </label>
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                  placeholder="WLA-XXXX-9999"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-xl font-mono tracking-wider"
                  maxLength={15}
                  required
                />
                <div className="text-xs text-gray-500 mt-1 text-center">
                  Format: WLA-XXXX-9999
                </div>
              </div>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={manualCode.length < 10}
                className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Validate Code
              </button>
            </form>
          </div>

          {/* Back to Scanner */}
          {hasCamera && (
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setManualEntry(false);
                  setError(null);
                }}
                className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-2 mx-auto"
              >
                <span>📱</span>
                <span>Use camera scanner instead</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* Instructions */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <div className="text-sm text-gray-700">
          <div className="font-semibold mb-2">💡 Tips:</div>
          <ul className="space-y-1 list-disc list-inside">
            <li>Ensure good lighting for better scanning</li>
            <li>Hold the device steady over the QR code</li>
            <li>The code will scan automatically when detected</li>
            <li>Use manual entry if camera doesn't work</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

