'use client';

import React, { useEffect, useState } from 'react';
import Logo from './Logo';

export default function PremiumLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] bg-dark-bg flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)]" />
        <Logo size="lg" />
        <div className="mt-8 relative w-16 h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="absolute inset-y-0 left-0 bg-gold-gradient rounded-full premium-loader-bar" />
        </div>
        <span className="mt-4 font-sans text-[9px] tracking-[0.4em] text-white/30 uppercase">
          Carregando experiência premium
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
