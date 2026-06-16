'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface UserData {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
}

interface AuthContextType {
  user: UserData | null;
  login: (data: { name: string; email?: string; phone?: string }) => Promise<void>;
  logout: () => void;
  isReady: boolean;
}

const STORAGE_KEY = 'sabor_gold_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setUser(JSON.parse(saved));
    } catch {
      /* ignore */
    }
    setIsReady(true);
  }, []);

  const login = async (data: { name: string; email?: string; phone?: string }) => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Erro ao entrar');
    setUser(json);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(json));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isReady }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth requires AuthProvider');
  return ctx;
}
