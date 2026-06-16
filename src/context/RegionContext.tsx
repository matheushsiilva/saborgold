'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface RegionData {
  id: string;
  name: string;
  slug: string;
  state?: string | null;
}

interface RegionContextType {
  region: RegionData | null;
  setRegion: (region: RegionData | null) => void;
  isReady: boolean;
}

const STORAGE_KEY = 'sabor_gold_region';

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegionState] = useState<RegionData | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setRegionState(JSON.parse(saved));
    } catch {
      /* ignore */
    }
    setIsReady(true);
  }, []);

  const setRegion = (r: RegionData | null) => {
    setRegionState(r);
    if (r) localStorage.setItem(STORAGE_KEY, JSON.stringify(r));
    else localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <RegionContext.Provider value={{ region, setRegion, isReady }}>
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const ctx = useContext(RegionContext);
  if (!ctx) throw new Error('useRegion requires RegionProvider');
  return ctx;
}
