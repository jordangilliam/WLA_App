'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface NavigationContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notificationCounts: {
    achievements: number;
    journal: number;
    total: number;
  };
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  refreshNotifications: () => Promise<void>;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('explore');
  const [showSearch, setShowSearch] = useState(false);
  const [notificationCounts, setNotificationCounts] = useState({
    achievements: 0,
    journal: 0,
    total: 0,
  });

  // Fetch notification counts
  const refreshNotifications = async () => {
    if (status !== 'authenticated' || !session?.user?.id) {
      return;
    }

    try {
      // Fetch new achievements count
      const achievementsRes = await fetch('/api/achievements/new-count');
      const achievementsData = await achievementsRes.ok ? await achievementsRes.json() : { count: 0 };

      // Fetch unread journal feedback count (if implemented)
      const journalRes = await fetch('/api/observations/unread-feedback');
      const journalData = await journalRes.ok ? await journalRes.json() : { count: 0 };

      const newCounts = {
        achievements: achievementsData.count || 0,
        journal: journalData.count || 0,
        total: (achievementsData.count || 0) + (journalData.count || 0),
      };

      setNotificationCounts(newCounts);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Initial load and periodic refresh
  useEffect(() => {
    if (status === 'authenticated') {
      refreshNotifications();

      // Refresh every 5 minutes
      const interval = setInterval(refreshNotifications, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [status, session?.user?.id]);

  // Listen for custom events to refresh notifications
  useEffect(() => {
    const handleRefresh = () => refreshNotifications();
    
    window.addEventListener('achievement-unlocked', handleRefresh);
    window.addEventListener('observation-feedback', handleRefresh);
    
    return () => {
      window.removeEventListener('achievement-unlocked', handleRefresh);
      window.removeEventListener('observation-feedback', handleRefresh);
    };
  }, []);

  return (
    <NavigationContext.Provider
      value={{
        activeTab,
        setActiveTab,
        notificationCounts,
        showSearch,
        setShowSearch,
        refreshNotifications,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

