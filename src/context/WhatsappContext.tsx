'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { buildWhatsAppUrl, generalContactMessage, productOrderMessage } from '@/lib/whatsapp';
import { useRegion } from './RegionContext';
import { useAuth } from './AuthContext';

interface WhatsappContextType {
  whatsappNumber: string;
  openWhatsApp: (message?: string) => void;
  openProductOrder: (params: {
    productName: string;
    price: number;
    flavorName?: string;
    flavorDescription?: string;
  }) => void;
}

const WhatsappContext = createContext<WhatsappContextType | undefined>(undefined);

export function WhatsappProvider({ children }: { children: React.ReactNode }) {
  const [whatsappNumber, setWhatsappNumber] = useState('5511999999999');
  const { region } = useRegion();
  const { user } = useAuth();

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.whatsappNumber) {
          setWhatsappNumber(data.whatsappNumber.replace(/\D/g, ''));
        }
      })
      .catch(console.error);
  }, []);

  const openWhatsApp = (message?: string) => {
    const text = message || generalContactMessage(region?.name);
    window.open(buildWhatsAppUrl(whatsappNumber, text), '_blank');
  };

  const openProductOrder = (params: {
    productName: string;
    price: number;
    flavorName?: string;
    flavorDescription?: string;
  }) => {
    const text = productOrderMessage({
      ...params,
      regionName: region?.name,
      userName: user?.name,
    });
    window.open(buildWhatsAppUrl(whatsappNumber, text), '_blank');
  };

  return (
    <WhatsappContext.Provider value={{ whatsappNumber, openWhatsApp, openProductOrder }}>
      {children}
    </WhatsappContext.Provider>
  );
}

export function useWhatsapp() {
  const ctx = useContext(WhatsappContext);
  if (!ctx) throw new Error('useWhatsapp must be used within WhatsappProvider');
  return ctx;
}
