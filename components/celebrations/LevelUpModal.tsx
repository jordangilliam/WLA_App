'use client';

import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  pointsEarned: number;
  levelTitle?: string;
  rewards?: {
    points?: number;
    badge?: string;
    unlockFeature?: string;
  };
}

export default function LevelUpModal({
  isOpen,
  onClose,
  newLevel,
  pointsEarned,
  levelTitle,
  rewards,
}: LevelUpModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [animationStage, setAnimationStage] = useState<'enter' | 'main' | 'exit'>('enter');

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      setAnimationStage('enter');

      // Enter animation
      setTimeout(() => setAnimationStage('main'), 300);

      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        setAnimationStage('exit');
        setTimeout(() => {
          setShowConfetti(false);
          onClose();
        }, 300);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex items-center justify-center">
        {/* Confetti */}
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={500}
            gravity={0.3}
          />
        )}

        {/* Modal Content */}
        <div
          className={`relative bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl transform transition-all duration-300 ${
            animationStage === 'enter'
              ? 'scale-0 opacity-0'
              : animationStage === 'main'
              ? 'scale-100 opacity-100'
              : 'scale-90 opacity-0'
          }`}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-white opacity-20 rounded-3xl blur-xl"></div>

          {/* Content */}
          <div className="relative z-10">
            {/* Level Badge */}
            <div className="mb-6">
              <div className="inline-block relative">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <div className="text-6xl font-black text-purple-600">{newLevel}</div>
                </div>
                <div className="absolute -top-2 -right-2 text-4xl animate-bounce">⭐</div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-black text-white mb-2">
              LEVEL UP!
            </h1>

            {/* Level Title */}
            {levelTitle && (
              <div className="mb-6">
                <div className="inline-block bg-white bg-opacity-20 px-6 py-2 rounded-full backdrop-blur-sm">
                  <p className="text-xl font-bold text-white">{levelTitle}</p>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="bg-white bg-opacity-20 rounded-2xl p-6 mb-6 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-3xl">🪙</span>
                <span className="text-3xl font-bold text-white">+{pointsEarned}</span>
              </div>
              <p className="text-white text-sm">Points Earned</p>
            </div>

            {/* Rewards */}
            {rewards && (
              <div className="mb-6 space-y-3">
                {rewards.badge && (
                  <div className="bg-white bg-opacity-20 rounded-xl p-3 backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-2xl">🏅</span>
                      <span className="text-white font-semibold">New Badge: {rewards.badge}</span>
                    </div>
                  </div>
                )}
                {rewards.unlockFeature && (
                  <div className="bg-white bg-opacity-20 rounded-xl p-3 backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-2xl">🔓</span>
                      <span className="text-white font-semibold">Unlocked: {rewards.unlockFeature}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Continue Button */}
            <button
              onClick={() => {
                setAnimationStage('exit');
                setTimeout(() => {
                  setShowConfetti(false);
                  onClose();
                }, 300);
              }}
              className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Keep Going! 🚀
            </button>

            {/* Auto-close indicator */}
            <p className="text-white text-xs mt-4 opacity-70">Auto-closes in 5 seconds</p>
          </div>
        </div>
      </div>
    </>
  );
}

