'use client';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Entry = { id: string; delta: number; reason: string; at: number };

type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  earned: boolean;
  earnedAt?: number;
  requirement: number;
  category: 'points' | 'streak' | 'activities' | 'special';
};

type PointsCtx = {
  total: number;
  history: Entry[];
  badges: Badge[];
  currentStreak: number;
  longestStreak: number;
  level: number;
  levelProgress: number;
  award: (delta: number, reason: string) => void;
  reset: () => void;
  getRecentBadges: () => Badge[];
}

const Ctx = createContext<PointsCtx | null>(null);

// Achievement definitions
const BADGE_DEFINITIONS: Omit<Badge, 'earned' | 'earnedAt'>[] = [
  // Points Milestones
  { id: 'points-10', name: 'Getting Started', description: 'Earn your first 10 points', icon: '🌱', tier: 'bronze', requirement: 10, category: 'points' },
  { id: 'points-50', name: 'Conservation Rookie', description: 'Reach 50 points', icon: '🌿', tier: 'bronze', requirement: 50, category: 'points' },
  { id: 'points-100', name: 'Nature Explorer', description: 'Reach 100 points', icon: '🌲', tier: 'silver', requirement: 100, category: 'points' },
  { id: 'points-250', name: 'Wildlife Defender', description: 'Reach 250 points', icon: '🦌', tier: 'silver', requirement: 250, category: 'points' },
  { id: 'points-500', name: 'Conservation Champion', description: 'Reach 500 points', icon: '🏆', tier: 'gold', requirement: 500, category: 'points' },
  { id: 'points-1000', name: 'PA Nature Legend', description: 'Reach 1000 points!', icon: '⭐', tier: 'gold', requirement: 1000, category: 'points' },
  
  // Activity Badges
  { id: 'water-warrior', name: 'Water Warrior', description: 'Complete 5 water readings', icon: '💧', tier: 'bronze', requirement: 5, category: 'activities' },
  { id: 'macro-master', name: 'Macro Master', description: 'Identify 10 macro-invertebrates', icon: '🔬', tier: 'silver', requirement: 10, category: 'activities' },
  { id: 'photo-phenom', name: 'Photo Phenomenon', description: 'Upload 20 journal photos', icon: '📸', tier: 'gold', requirement: 20, category: 'activities' },
  { id: 'habitat-hero', name: 'Habitat Hero', description: 'Complete 15 habitat simulations', icon: '🏕️', tier: 'silver', requirement: 15, category: 'activities' },
  
  // Streak Badges
  { id: 'streak-3', name: 'On a Roll', description: '3-day streak', icon: '🔥', tier: 'bronze', requirement: 3, category: 'streak' },
  { id: 'streak-7', name: 'Dedicated Conservationist', description: '7-day streak', icon: '🔥', tier: 'silver', requirement: 7, category: 'streak' },
  { id: 'streak-14', name: 'Unstoppable Force', description: '14-day streak', icon: '⚡', tier: 'gold', requirement: 14, category: 'streak' },
  { id: 'streak-30', name: 'Month Master', description: '30-day streak', icon: '💪', tier: 'platinum', requirement: 30, category: 'streak' },
];

function calculateLevel(points: number): { level: number; progress: number } {
  // Level formula: Level increases every 100 points
  const level = Math.floor(points / 100) + 1;
  const progress = (points % 100) / 100 * 100;
  return { level, progress };
}

function calculateStreak(history: Entry[]): { current: number; longest: number } {
  if (history.length === 0) return { current: 0, longest: 0 };
  
  const today = new Date().setHours(0, 0, 0, 0);
  const oneDayMs = 24 * 60 * 60 * 1000;
  
  // Group by day
  const daySet = new Set<number>();
  history.forEach(entry => {
    const day = new Date(entry.at).setHours(0, 0, 0, 0);
    daySet.add(day);
  });
  
  const sortedDays = Array.from(daySet).sort((a, b) => b - a);
  
  let current = 0;
  let longest = 0;
  let tempStreak = 0;
  
  // Calculate current streak from today
  for (let i = 0; i < sortedDays.length; i++) {
    const expectedDay = today - (i * oneDayMs);
    if (sortedDays[i] === expectedDay) {
      current++;
    } else {
      break;
    }
  }
  
  // Calculate longest streak
  for (let i = 0; i < sortedDays.length; i++) {
    if (i === 0 || sortedDays[i] === sortedDays[i - 1] - oneDayMs) {
      tempStreak++;
      longest = Math.max(longest, tempStreak);
    } else {
      tempStreak = 1;
    }
  }
  
  return { current, longest };
}

export function PointsProvider({ children }: { children: React.ReactNode }){
  const [history, setHistory] = useState<Entry[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);

  // Persist locally so refresh doesn't lose points
  useEffect(()=>{
    try{
      const raw = localStorage.getItem('wla-points');
      if(raw) setHistory(JSON.parse(raw));
      
      const badgesRaw = localStorage.getItem('wla-badges');
      if(badgesRaw) {
        setBadges(JSON.parse(badgesRaw));
      } else {
        // Initialize badges
        setBadges(BADGE_DEFINITIONS.map(b => ({ ...b, earned: false })));
      }
    }catch{}
  },[]);

  useEffect(()=>{
    try{
      localStorage.setItem('wla-points', JSON.stringify(history));
    }catch{}
  },[history]);

  useEffect(()=>{
    try{
      localStorage.setItem('wla-badges', JSON.stringify(badges));
    }catch{}
  },[badges]);

  const total = useMemo(()=> history.reduce((a,b)=>a+b.delta,0), [history]);
  const { level, progress: levelProgress } = useMemo(() => calculateLevel(total), [total]);
  const { current: currentStreak, longest: longestStreak } = useMemo(() => calculateStreak(history), [history]);

  // Check and award badges
  useEffect(() => {
    const updatedBadges = badges.map(badge => {
      if (badge.earned) return badge;
      
      let shouldEarn = false;
      
      if (badge.category === 'points' && total >= badge.requirement) {
        shouldEarn = true;
      } else if (badge.category === 'streak' && currentStreak >= badge.requirement) {
        shouldEarn = true;
      } else if (badge.category === 'activities') {
        // Count specific activity types
        const activityCount = history.filter(e => 
          e.reason.includes(badge.id.split('-')[0])
        ).length;
        if (activityCount >= badge.requirement) {
          shouldEarn = true;
        }
      }
      
      if (shouldEarn) {
        return { ...badge, earned: true, earnedAt: Date.now() };
      }
      return badge;
    });
    
    const hasNewBadges = updatedBadges.some((b, i) => b.earned && !badges[i].earned);
    if (hasNewBadges) {
      setBadges(updatedBadges);
      // Show celebration animation (could trigger toast/confetti in the UI)
    }
  }, [total, currentStreak, history, badges]);

  const award = (delta: number, reason: string) => {
    setHistory(h => [...h, { id: crypto.randomUUID(), delta, reason, at: Date.now() }]);
  };
  
  const reset = () => {
    setHistory([]);
    setBadges(BADGE_DEFINITIONS.map(b => ({ ...b, earned: false })));
  };

  const getRecentBadges = () => {
    const recent = badges
      .filter(b => b.earned && b.earnedAt)
      .sort((a, b) => (b.earnedAt || 0) - (a.earnedAt || 0))
      .slice(0, 3);
    return recent;
  };

  return (
    <Ctx.Provider value={{ 
      total, 
      history, 
      badges, 
      currentStreak, 
      longestStreak, 
      level, 
      levelProgress,
      award, 
      reset,
      getRecentBadges
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function usePoints(){
  const ctx = useContext(Ctx);
  if(!ctx) throw new Error('usePoints must be used within PointsProvider');
  return ctx;
}
