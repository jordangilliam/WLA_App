'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface PointsContextType {
  points: number;
  addPoints: (amount: number, activity: string) => void;
  resetPoints: () => void;
}

const PointsContext = createContext<PointsContextType>({
  points: 0,
  addPoints: () => {},
  resetPoints: () => {},
});

export function usePoints() {
  return useContext(PointsContext);
}

export function PointsProvider({ children }: { children: React.ReactNode }) {
  const [points, setPoints] = useState(0);

  useEffect(() => {
    // Load points from localStorage
    const saved = localStorage.getItem('user-points');
    if (saved) {
      setPoints(parseInt(saved, 10));
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
    <PointsContext.Provider value={{ points, addPoints, resetPoints }}>
      {children}
    </PointsContext.Provider>
  );
}
