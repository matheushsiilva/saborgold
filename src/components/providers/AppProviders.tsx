'use client';

import { RegionProvider } from '@/context/RegionContext';
import { AuthProvider } from '@/context/AuthContext';
import { WhatsappProvider } from '@/context/WhatsappContext';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <RegionProvider>
      <AuthProvider>
        <WhatsappProvider>{children}</WhatsappProvider>
      </AuthProvider>
    </RegionProvider>
  );
}
