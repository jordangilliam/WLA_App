'use client';

import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

interface FirstCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteName: string;
  pointsEarned: number;
  bonusPoints?: number;
}

export default function FirstCheckInModal({
  isOpen,
  onClose,
  siteName,
  pointsEarned,
  bonusPoints = 0,
}: FirstCheckInModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [animationStage, setAnimationStage] = useState<'enter' | 'main' | 'exit'>('enter');

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      setAnimationStage('enter');

      // Enter animation
      setTimeout(() => setAnimationStage('main'), 300);

      // Auto-close after 4 seconds
      const timer = setTimeout(() => {
        setAnimationStage('exit');
        setTimeout(() => {
          setShowConfetti(false);
          onClose();
        }, 300);
      }, 4000);

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
            numberOfPieces={300}
            colors={['#10B981', '#34D399', '#6EE7B7', '#A7F3D0']}
            gravity={0.2}
          />
        )}

        {/* Modal Content */}
        <div
          className={`relative bg-gradient-to-br from-green-600 via-green-500 to-emerald-500 rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl transform transition-all duration-300 ${
            animationStage === 'enter'
              ? 'scale-0 opacity-0 rotate-12'
              : animationStage === 'main'
              ? 'scale-100 opacity-100 rotate-0'
              : 'scale-90 opacity-0 -rotate-12'
          }`}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-white opacity-20 rounded-3xl blur-xl"></div>

          {/* Content */}
          <div className="relative z-10">
            {/* Icon */}
            <div className="mb-6">
              <div className="inline-block relative">
                <div className="text-8xl animate-bounce">🎉</div>
                <div className="absolute -top-2 -right-2 text-4xl">📍</div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-black text-white mb-2">
              FIRST VISIT!
            </h1>

            {/* Site Name */}
            <div className="mb-6">
              <div className="bg-white bg-opacity-20 px-6 py-3 rounded-full backdrop-blur-sm inline-block">
                <p className="text-2xl font-bold text-white">{siteName}</p>
              </div>
            </div>

            {/* Points Display */}
            <div className="bg-white bg-opacity-20 rounded-2xl p-6 mb-6 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-4xl">🪙</span>
                <div className="text-left">
                  <div className="text-4xl font-bold text-white">+{pointsEarned}</div>
                  {bonusPoints > 0 && (
                    <div className="text-lg text-white">
                      +{bonusPoints} <span className="text-sm opacity-90">First Visit Bonus!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Encouragement */}
            <div className="mb-6">
              <p className="text-white text-lg font-semibold">
                Keep exploring to discover more sites! 🗺️
              </p>
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
              className="px-8 py-4 bg-white text-green-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Awesome! ✨
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

