'use client';

import { useEffect, useState } from 'react';
import ConfettiCelebration from './ConfettiCelebration';
import { playCelebrationSound, triggerCelebrationHaptics, getMilestoneMessage } from '@/lib/utils/celebrations';

interface AchievementRevealProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  icon: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  pointsEarned: number;
  isMilestone?: boolean;
  milestoneValue?: number;
  milestoneType?: 'streak' | 'level' | 'points';
}

export default function AchievementReveal({
  isOpen,
  onClose,
  title,
  description,
  icon,
  rarity = 'common',
  pointsEarned,
  isMilestone = false,
  milestoneValue,
  milestoneType = 'streak',
}: AchievementRevealProps) {
  const [animationStage, setAnimationStage] = useState<'enter' | 'reveal' | 'main' | 'exit'>('enter');
  const [showConfetti, setShowConfetti] = useState(false);

  const rarityConfig = {
    common: {
      gradient: 'from-gray-600 to-gray-500',
      glow: 'shadow-gray-500',
      confettiIntensity: 'low' as const,
    },
    uncommon: {
      gradient: 'from-green-600 to-green-500',
      glow: 'shadow-green-500',
      confettiIntensity: 'low' as const,
    },
    rare: {
      gradient: 'from-blue-600 to-blue-500',
      glow: 'shadow-blue-500',
      confettiIntensity: 'medium' as const,
    },
    epic: {
      gradient: 'from-purple-600 to-purple-500',
      glow: 'shadow-purple-500',
      confettiIntensity: 'high' as const,
    },
    legendary: {
      gradient: 'from-amber-600 to-amber-500',
      glow: 'shadow-amber-500',
      confettiIntensity: 'high' as const,
    },
  };

  const config = rarityConfig[rarity];

  useEffect(() => {
    if (!isOpen) {
      setAnimationStage('enter');
      setShowConfetti(false);
      return;
    }

    // Play sound and haptics
    playCelebrationSound('achievement', config.confettiIntensity);
    triggerCelebrationHaptics(config.confettiIntensity);

    // Enter animation
    setAnimationStage('enter');
    setTimeout(() => setAnimationStage('reveal'), 300);

    // Reveal animation
    setTimeout(() => {
      setAnimationStage('main');
      setShowConfetti(true);
    }, 600);

    // Auto-close after 6 seconds
    const timer = setTimeout(() => {
      setAnimationStage('exit');
      setTimeout(() => {
        setShowConfetti(false);
        onClose();
      }, 300);
    }, 6000);

    return () => clearTimeout(timer);
  }, [isOpen, onClose, config.confettiIntensity]);

  if (!isOpen) return null;

  const milestoneMessage = isMilestone && milestoneValue
    ? getMilestoneMessage(milestoneValue, milestoneType)
    : null;

  return (
    <>
      <ConfettiCelebration
        isActive={showConfetti}
        type="achievement"
        intensity={config.confettiIntensity}
        duration={5000}
      />

      <div className="fixed inset-0 bg-black bg-opacity-80 z-[100] flex items-center justify-center">
        <div
          className={`relative bg-gradient-to-br ${config.gradient} rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl ${config.glow} shadow-lg transform transition-all duration-500 ${
            animationStage === 'enter'
              ? 'scale-0 opacity-0 rotate-180'
              : animationStage === 'reveal'
              ? 'scale-110 opacity-90 rotate-0'
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

            {/* Milestone Badge */}
            {milestoneMessage && (
              <div className="mb-4">
                <div className="inline-block bg-white bg-opacity-30 px-4 py-2 rounded-full backdrop-blur-sm">
                  <p className="text-lg font-bold text-white">{milestoneMessage}</p>
                </div>
              </div>
            )}

            {/* Achievement Icon */}
            <div className="mb-6">
              <div className="inline-block relative">
                <div
                  className={`w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl ${config.glow} ${
                    rarity === 'legendary' ? 'animate-spin-slow' : rarity === 'epic' ? 'animate-pulse' : ''
                  }`}
                >
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
              className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
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

