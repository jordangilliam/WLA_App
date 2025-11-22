'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface PointsContextType {
  points: number;
  total: number; // Alias for points
  currentStreak: number;
  level: number;
  badges: number;
  addPoints: (amount: number, activity: string) => void;
  award: (amount: number, activity: string) => void; // Alias for addPoints
  resetPoints: () => void;
}

const PointsContext = createContext<PointsContextType>({
  points: 0,
  total: 0,
  currentStreak: 0,
  level: 1,
  badges: 0,
  addPoints: () => {},
  award: () => {},
  resetPoints: () => {},
});

export function usePoints() {
  return useContext(PointsContext);
}

export function PointsProvider({ children }: { children: React.ReactNode }) {
  const [points, setPoints] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    // Load points from localStorage
    const saved = localStorage.getItem('user-points');
    if (saved) {
      setPoints(parseInt(saved, 10));
    }

    // Load streak from localStorage
    const savedStreak = localStorage.getItem('user-streak');
    if (savedStreak) {
      setCurrentStreak(parseInt(savedStreak, 10));
    }
  }, []);

  const addPoints = (amount: number, activity: string) => {
    setPoints(prev => {
      const newTotal = prev + amount;
      localStorage.setItem('user-points', newTotal.toString());
      console.log(`Earned ${amount} points for: ${activity}`);
      return newTotal;
    });
  };

  const resetPoints = () => {
    setPoints(0);
    localStorage.setItem('user-points', '0');
  };

  return (
    <PointsContext.Provider value={{ 
      points, 
      total: points, // Provide alias
      currentStreak,
      level: Math.max(1, Math.floor(points / 500) + 1),
      badges: Math.floor(points / 1000),
      addPoints, 
      award: addPoints, // Provide alias
      resetPoints 
    }}>
      {children}
    </PointsContext.Provider>
  );
}
