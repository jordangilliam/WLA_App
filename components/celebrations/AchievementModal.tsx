'use client';

import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  icon: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  pointsEarned: number;
}

export default function AchievementModal({
  isOpen,
  onClose,
  title,
  description,
  icon,
  rarity = 'common',
  pointsEarned,
}: AchievementModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [animationStage, setAnimationStage] = useState<'enter' | 'main' | 'exit'>('enter');

  const rarityColors = {
    common: 'from-gray-600 to-gray-500',
    uncommon: 'from-green-600 to-green-500',
    rare: 'from-blue-600 to-blue-500',
    epic: 'from-purple-600 to-purple-500',
    legendary: 'from-amber-600 to-amber-500',
  };

  const rarityText = {
    common: 'text-gray-600',
    uncommon: 'text-green-600',
    rare: 'text-blue-600',
    epic: 'text-purple-600',
    legendary: 'text-amber-600',
  };

  const rarityGlow = {
    common: 'shadow-gray-500',
    uncommon: 'shadow-green-500',
    rare: 'shadow-blue-500',
    epic: 'shadow-purple-500',
    legendary: 'shadow-amber-500',
  };

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      setAnimationStage('enter');

      // Enter animation
      setTimeout(() => setAnimationStage('main'), 300);

      // Auto-close after 6 seconds
      const timer = setTimeout(() => {
        setAnimationStage('exit');
        setTimeout(() => {
          setShowConfetti(false);
          onClose();
        }, 300);
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-80 z-[100] flex items-center justify-center">
        {/* Confetti */}
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={rarity === 'legendary' ? 600 : rarity === 'epic' ? 400 : 200}
            gravity={0.25}
          />
        )}

        {/* Modal Content */}
        <div
          className={`relative bg-gradient-to-br ${rarityColors[rarity]} rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl ${rarityGlow[rarity]} shadow-lg transform transition-all duration-500 ${
            animationStage === 'enter'
              ? 'scale-0 opacity-0 rotate-180'
              : animationStage === 'main'
              ? 'scale-100 opacity-100 rotate-0'
              : 'scale-90 opacity-0 rotate-90'
          }`}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-white opacity-20 rounded-3xl blur-2xl animate-pulse"></div>

          {/* Content */}
          <div className="relative z-10">
            {/* Rarity Badge */}
            <div className="mb-4">
              <span className="inline-block bg-white bg-opacity-30 px-4 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider backdrop-blur-sm">
                {rarity}
              </span>
            </div>

            {/* Achievement Icon */}
            <div className="mb-6">
              <div className="inline-block relative">
                <div className={`w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl ${rarityGlow[rarity]} ${
                  rarity === 'legendary' ? 'animate-spin-slow' : rarity === 'epic' ? 'animate-pulse' : ''
                }`}>
                  <div className="text-7xl">{icon}</div>
                </div>
                {rarity === 'legendary' && (
                  <div className="absolute inset-0 bg-amber-400 rounded-full opacity-50 blur-xl animate-ping"></div>
                )}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-black text-white mb-3">
              ACHIEVEMENT UNLOCKED!
            </h1>

            {/* Achievement Name */}
            <div className="mb-4">
              <div className="bg-white bg-opacity-20 px-6 py-3 rounded-2xl backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-white">{title}</h2>
              </div>
            </div>

            {/* Description */}
            <p className="text-white text-base mb-6 opacity-90">
              {description}
            </p>

            {/* Points */}
            <div className="bg-white bg-opacity-20 rounded-xl p-4 mb-6 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl">🪙</span>
                <span className="text-3xl font-bold text-white">+{pointsEarned}</span>
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={() => {
                setAnimationStage('exit');
                setTimeout(() => {
                  setShowConfetti(false);
                  onClose();
                }, 300);
              }}
              className={`px-8 py-4 bg-white ${rarityText[rarity]} rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg`}
            >
              Claim Reward! 🎁
            </button>

            {/* Auto-close indicator */}
            <p className="text-white text-xs mt-4 opacity-70">Auto-closes in 6 seconds</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </>
  );
}

