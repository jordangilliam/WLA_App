'use client';

import { useState, useEffect } from 'react';
import { soundManager } from '@/lib/audio/soundManager';

export default function SoundSettings() {
  const [enabled, setEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    setEnabled(soundManager.isEnabled());
    setVolume(soundManager.getVolume());
  }, []);

  const handleToggle = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    soundManager.setEnabled(newEnabled);
    
    if (newEnabled) {
      soundManager.play('success');
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    soundManager.setVolume(newVolume);
    soundManager.play('button-click');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">🔊 Sound Settings</h3>
      
      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="font-medium text-gray-900">Sound Effects</div>
          <div className="text-sm text-gray-600">Play sounds for actions and rewards</div>
        </div>
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
            enabled ? 'bg-green-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Volume Slider */}
      {enabled && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Volume</span>
            <span className="text-sm text-gray-600">{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>🔇 Quiet</span>
            <span>🔊 Loud</span>
          </div>
        </div>
      )}

      {/* Test Sounds */}
      {enabled && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-3">Test Sounds</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => soundManager.play('check-in')}
              className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
            >
              📍 Check-In
            </button>
            <button
              onClick={() => soundManager.play('points')}
              className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
            >
              🪙 Points
            </button>
            <button
              onClick={() => soundManager.play('level-up')}
              className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
            >
              ⭐ Level Up
            </button>
            <button
              onClick={() => soundManager.play('achievement')}
              className="px-3 py-2 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-200 transition-colors"
            >
              🏆 Achievement
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

