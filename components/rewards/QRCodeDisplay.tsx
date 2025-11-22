'use client';

import { useEffect, useRef, useState } from 'react';
import { generateQRCodeCanvas, type QRCodeData, downloadQRCode } from '@/lib/utils/qrcode';

interface QRCodeDisplayProps {
  data: QRCodeData;
  size?: number;
  brandColor?: string;
  showConfirmationCode?: boolean;
  allowDownload?: boolean;
  className?: string;
}

/**
 * Display component for QR codes with confirmation code
 * Used by students to show their reward redemption code
 */
export default function QRCodeDisplay({
  data,
  size = 300,
  brandColor = '#667eea',
  showConfirmationCode = true,
  allowDownload = true,
  className = '',
}: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateQR = async () => {
      if (!canvasRef.current) return;

      try {
        setLoading(true);
        setError(null);

        await generateQRCodeCanvas(canvasRef.current, data, {
          width: size,
          margin: 2,
          color: {
            dark: brandColor,
            light: '#FFFFFF',
          },
        });

        setLoading(false);
      } catch (err) {
        console.error('Error generating QR code:', err);
        setError('Failed to generate QR code');
        setLoading(false);
      }
    };

    generateQR();
  }, [data, size, brandColor]);

  const handleDownload = () => {
    downloadQRCode(data, `rad-pass-${data.confirmationCode}.png`);
  };

  // Check if expired
  const isExpired = new Date(data.expiresAt) < new Date();
  const daysUntilExpiry = Math.ceil(
    (new Date(data.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* QR Code Container */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl p-6 border-4 ${
          isExpired ? 'border-red-400 opacity-50' : 'border-purple-400'
        }`}
        style={{
          borderColor: isExpired ? '#f87171' : brandColor,
        }}
      >
        {loading && (
          <div
            className="flex items-center justify-center"
            style={{ width: size, height: size }}
          >
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
          </div>
        )}

        {error && (
          <div
            className="flex items-center justify-center bg-red-50 rounded-lg"
            style={{ width: size, height: size }}
          >
            <div className="text-center p-4">
              <div className="text-4xl mb-2">❌</div>
              <div className="text-red-600 font-medium">{error}</div>
            </div>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className={`${loading || error ? 'hidden' : 'block'} rounded-lg`}
          style={{ width: size, height: size }}
        />

        {isExpired && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-2xl">
            <div className="bg-white px-6 py-3 rounded-lg text-red-600 font-bold text-xl">
              EXPIRED
            </div>
          </div>
        )}

        {/* Corner decoration */}
        <div
          className="absolute top-2 right-2 text-white px-2 py-1 rounded-full text-xs font-bold"
          style={{ backgroundColor: brandColor }}
        >
          RAD PASS
        </div>
      </div>

      {/* Confirmation Code */}
      {showConfirmationCode && (
        <div className="mt-6 text-center">
          <div className="text-sm text-gray-600 font-medium mb-2">Confirmation Code</div>
          <div
            className="text-3xl font-bold tracking-wider px-6 py-3 rounded-lg inline-block"
            style={{
              color: brandColor,
              backgroundColor: `${brandColor}15`,
            }}
          >
            {data.confirmationCode}
          </div>
        </div>
      )}

      {/* Expiration Warning */}
      {!isExpired && daysUntilExpiry <= 7 && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-amber-800 text-sm">
          ⚠️ Expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 max-w-md">
        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
          <div className="font-semibold mb-2">📱 How to use:</div>
          <ol className="space-y-1 list-decimal list-inside">
            <li>Show this QR code at the partner location</li>
            <li>Staff will scan to validate your reward</li>
            <li>Enjoy your experience!</li>
          </ol>
        </div>
      </div>

      {/* Action Buttons */}
      {allowDownload && !isExpired && (
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleDownload}
            className="px-6 py-3 bg-white border-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
            style={{ borderColor: brandColor, color: brandColor }}
          >
            <span>💾</span>
            <span>Download</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-white border-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
            style={{ borderColor: brandColor, color: brandColor }}
          >
            <span>🖨️</span>
            <span>Print</span>
          </button>
        </div>
      )}
    </div>
  );
}

