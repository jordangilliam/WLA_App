'use client';

import { useState } from 'react';
import { Camera } from '@capacitor/camera';
import { CameraResultType, CameraSource } from '@capacitor/camera';

interface PhotoCaptureProps {
  onPhotoTaken: (photoUrl: string, photoData: string) => void;
  onSkip: () => void;
}

export default function PhotoCapture({ onPhotoTaken, onSkip }: PhotoCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const takePicture = async (source: CameraSource) => {
    try {
      setIsCapturing(true);
      setError(null);

      // Check if running in native or web
      const isNative = (window as any).Capacitor?.isNativePlatform();

      if (!isNative && source === CameraSource.Camera) {
        // Fallback to HTML5 camera on web
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment';
        
        input.onchange = async (e: any) => {
          const file = e.target?.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64 = reader.result as string;
              setPreviewUrl(base64);
              onPhotoTaken(base64, base64);
            };
            reader.readAsDataURL(file);
          }
        };
        
        input.click();
        setIsCapturing(false);
        return;
      }

      // Use Capacitor Camera for native
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: source,
        width: 1920,
        height: 1920,
        saveToGallery: false,
      });

      if (image.dataUrl) {
        setPreviewUrl(image.dataUrl);
        onPhotoTaken(image.dataUrl, image.dataUrl);
      }
    } catch (err: any) {
      console.error('Error taking photo:', err);
      if (err.message !== 'User cancelled photos app') {
        setError('Failed to capture photo. Please try again.');
      }
    } finally {
      setIsCapturing(false);
    }
  };

  const retakePhoto = () => {
    setPreviewUrl(null);
    setError(null);
  };

  // If we have a preview, show it
  if (previewUrl) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Photo Preview</h3>
          <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-gray-100">
            <img
              src={previewUrl}
              alt="Site photo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={retakePhoto}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            📷 Retake Photo
          </button>
          <button
            onClick={onSkip}
            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Continue →
          </button>
        </div>
      </div>
    );
  }

  // Show camera options
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-6 text-center">
        <div className="text-6xl mb-4">📸</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Take a Photo (Optional)
        </h3>
        <p className="text-gray-600 mb-6">
          Capture the site, wildlife you see, or anything interesting! Photos help document your
          visits and contribute to citizen science.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => takePicture(CameraSource.Camera)}
            disabled={isCapturing}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-bold text-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isCapturing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Opening Camera...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>📷</span>
                Take Photo with Camera
              </span>
            )}
          </button>

          <button
            onClick={() => takePicture(CameraSource.Photos)}
            disabled={isCapturing}
            className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center gap-2">
              <span>🖼️</span>
              Choose from Gallery
            </span>
          </button>

          <button
            onClick={onSkip}
            className="w-full px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Skip Photo →
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">📌 Photo Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Include landmarks to show location context</li>
          <li>• Capture wildlife you observe</li>
          <li>• Document habitat features</li>
          <li>• Take clear, well-lit photos</li>
          <li>• Respect wildlife - observe from distance</li>
        </ul>
      </div>
    </div>
  );
}

