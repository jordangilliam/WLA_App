'use client';

import { useCelebration } from '@/lib/hooks/useCelebration';
import LevelUpModal from './LevelUpModal';
import FirstCheckInModal from './FirstCheckInModal';
import AchievementModal from './AchievementModal';

/**
 * Global celebration manager component
 * Place this in your layout to handle all celebrations
 */
export default function CelebrationManager() {
  const { activeCelebration, closeCelebration } = useCelebration();

  if (!activeCelebration) return null;

  switch (activeCelebration.type) {
    case 'level-up':
      return (
        <LevelUpModal
          isOpen={true}
          onClose={closeCelebration}
          {...activeCelebration.data}
        />
      );

    case 'first-checkin':
      return (
        <FirstCheckInModal
          isOpen={true}
          onClose={closeCelebration}
          {...activeCelebration.data}
        />
      );

    case 'achievement':
      return (
        <AchievementModal
          isOpen={true}
          onClose={closeCelebration}
          {...activeCelebration.data}
        />
      );

    default:
      return null;
  }
}

