'use client';

import { useState, useRef, useEffect } from 'react';
import SoundIdentifier from './SoundIdentifier';

interface SoundRecorderProps {
  onRecordingComplete?: (audioData: string, duration: number) => void;
  onIdentification?: (results: any[]) => void;
  autoIdentify?: boolean;
  maxDuration?: number; // seconds
}

export default function SoundRecorder({
  onRecordingComplete,
  onIdentification,
  autoIdentify = false,
  maxDuration = 60,
}: SoundRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioData, setAudioData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        stopRecording();
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const base64 = await blobToBase64(blob);
        const durationSeconds = duration;

        setAudioData(base64);
        setIsRecording(false);
        setDuration(0);

        if (onRecordingComplete) {
          onRecordingComplete(base64, durationSeconds);
        }

        // Auto-identify if enabled
        if (autoIdentify && onIdentification) {
          try {
            const response = await fetch('/api/sound/identify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audioData: base64 }),
            });
            const data = await response.json();
            if (data.success) {
              onIdentification(data.results);
            }
          } catch (err) {
            console.error('Auto-identification failed:', err);
          }
        }

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      startTimeRef.current = Date.now();

      // Update duration
      durationIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - (startTimeRef.current || 0);
        const seconds = Math.floor(elapsed / 1000);
        setDuration(seconds);

        // Auto-stop at max duration
        if (seconds >= maxDuration) {
          stopRecording();
        }
      }, 100);
    } catch (err: any) {
      console.error('Recording error:', err);
      setError(err.message || 'Failed to start recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Record Sound</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {audioData ? (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl mb-2">🎤</div>
            <p className="text-gray-600">Recording complete ({formatDuration(duration)})</p>
          </div>
          {onIdentification && (
            <SoundIdentifier audioData={audioData} onResults={onIdentification} />
          )}
          <button
            onClick={() => {
              setAudioData(null);
              setDuration(0);
            }}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
          >
            Record Again
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            {isRecording ? (
              <>
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-white"></div>
                </div>
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {formatDuration(duration)}
                </div>
                <p className="text-gray-600">Recording in progress...</p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">🎤</div>
                <p className="text-gray-600">Ready to record</p>
              </>
            )}
          </div>

          <div className="flex gap-3">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Stop Recording
              </button>
            )}
          </div>

          {isRecording && (
            <p className="text-center text-sm text-gray-500">
              Max duration: {formatDuration(maxDuration)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

