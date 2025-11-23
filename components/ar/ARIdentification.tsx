'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface ARIdentificationProps {
  isActive: boolean;
  onIdentification?: (result: any) => void;
  onClose: () => void;
  mode?: 'species' | 'bird' | 'macro';
}

interface IdentificationOverlay {
  label: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function ARIdentification({
  isActive,
  onIdentification,
  onClose,
  mode = 'species',
}: ARIdentificationProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [overlays, setOverlays] = useState<IdentificationOverlay[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const frameIntervalRef = useRef<number>();

  // Initialize camera stream
  useEffect(() => {
    if (!isActive) {
      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (frameIntervalRef.current) {
        cancelAnimationFrame(frameIntervalRef.current);
      }
      setOverlays([]);
      return;
    }

    async function initCamera() {
      try {
        // Check for camera support
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setIsSupported(false);
          setError('Camera not supported on this device');
          return;
        }

        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Use back camera
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }

        // Start processing frames
        startFrameProcessing();
      } catch (err: any) {
        console.error('Camera initialization error:', err);
        setIsSupported(false);
        setError(err.message || 'Failed to access camera');
      }
    }

    initCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (frameIntervalRef.current) {
        cancelAnimationFrame(frameIntervalRef.current);
      }
    };
  }, [isActive]);

  const captureFrame = useCallback((): string | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      return null;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64
    return canvas.toDataURL('image/jpeg', 0.8);
  }, []);

  const processFrame = useCallback(async () => {
    if (isProcessing) return;

    const frameData = captureFrame();
    if (!frameData) return;

    setIsProcessing(true);

    try {
      // Call identification API
      const response = await fetch('/api/identify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mediaType: 'image',
          imageData: frameData,
          targets: [mode],
        }),
      });

      if (!response.ok) {
        throw new Error('Identification failed');
      }

      const data = await response.json();
      const results = data.results || [];

      // Process results and create overlays
      const newOverlays: IdentificationOverlay[] = results
        .filter((r: any) => r.status === 'ok' && r.confidence && r.confidence > 0.5)
        .map((result: any, index: number) => ({
          label: result.label || 'Unknown',
          confidence: result.confidence || 0,
          x: 50 + index * 200, // Simple positioning (would use object detection in production)
          y: 100,
          width: 150,
          height: 80,
        }));

      setOverlays(newOverlays);

      // Call callback with best result
      const bestResult = results.find((r) => r.status === 'ok' && r.confidence && r.confidence > 0.7);
      if (bestResult && onIdentification) {
        onIdentification(bestResult);
      }
    } catch (err) {
      console.error('Frame processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, captureFrame, mode, onIdentification]);

  const startFrameProcessing = useCallback(() => {
    // Process frames every 2 seconds (adjustable)
    const processInterval = setInterval(() => {
      processFrame();
    }, 2000);

    // Also process on user tap (for immediate feedback)
    const handleTap = () => {
      processFrame();
    };

    if (videoRef.current) {
      videoRef.current.addEventListener('click', handleTap);
    }

    return () => {
      clearInterval(processInterval);
      if (videoRef.current) {
        videoRef.current.removeEventListener('click', handleTap);
      }
    };
  }, [processFrame]);

  if (!isActive) return null;

  if (!isSupported) {
    return (
      <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
          <div className="text-5xl mb-4">📷</div>
          <h2 className="text-2xl font-bold mb-4">Camera Not Available</h2>
          <p className="text-gray-600 mb-6">{error || 'AR identification requires camera access'}</p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-[100]">
      {/* Camera View */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />

      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        {overlays.map((overlay, index) => (
          <div
            key={index}
            className="absolute bg-black bg-opacity-70 text-white p-2 rounded-lg"
            style={{
              left: `${overlay.x}px`,
              top: `${overlay.y}px`,
              width: `${overlay.width}px`,
            }}
          >
            <div className="font-bold text-sm">{overlay.label}</div>
            <div className="text-xs opacity-80">
              {Math.round(overlay.confidence * 100)}% confidence
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={processFrame}
            disabled={isProcessing}
            className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold disabled:opacity-50"
          >
            {isProcessing ? 'Identifying...' : 'Identify'}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-700 text-white rounded-full font-semibold"
          >
            Close
          </button>
        </div>
        <p className="text-white text-center text-sm mt-4 opacity-80">
          Tap the screen or use the Identify button to identify species
        </p>
      </div>

      {/* Processing indicator */}
      {isProcessing && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span>Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
}

