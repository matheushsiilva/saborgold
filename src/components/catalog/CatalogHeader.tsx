'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { useRegion } from '@/context/RegionContext';
import { useAuth } from '@/context/AuthContext';
import { MapPin, User, LogOut } from 'lucide-react';

interface CatalogHeaderProps {
  brands: { id: string; name: string; slug: string }[];
  activeBrand: string;
  onBrandChange: (slug: string) => void;
}

export default function CatalogHeader({
  brands,
  activeBrand,
  onBrandChange,
}: CatalogHeaderProps) {
  const { region, setRegion } = useRegion();
  const { user, logout } = useAuth();
  const router = useRouter();

  const changeRegion = () => {
    setRegion(null);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 glassmorphism border-b border-gold/10 safe-top">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top row: logo + auth */}
        <div className="flex items-center justify-between py-3 gap-3 min-w-0">
          <Link href="/catalogo" className="shrink-0">
            <Logo size="sm" className="sm:hidden" />
            <Logo size="md" className="hidden sm:block" />
          </Link>

          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden md:block text-[10px] text-white/60 uppercase tracking-wider max-w-[120px] truncate">
                  {user.name}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="p-2.5 rounded-lg border border-white/10 hover:border-gold/30 text-white/60 hover:text-gold min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
                  title="Sair"
                  aria-label="Sair"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/entrar"
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-lg border border-gold/30 text-[10px] font-display font-bold uppercase tracking-widest text-gold hover:bg-gold/10 transition-colors min-h-[44px] touch-manipulation"
              >
                <User className="w-4 h-4 shrink-0" />
                <span className="hidden min-[360px]:inline">Entrar</span>
              </Link>
            )}
          </div>
        </div>

        {/* Region selector — full width on mobile */}
        {region && (
          <button
            type="button"
            onClick={changeRegion}
            className="w-full sm:w-auto flex items-center gap-2 px-3 py-2.5 mb-2 sm:mb-0 rounded-xl border border-gold/25 bg-gold/5 text-[10px] sm:text-[11px] uppercase tracking-wider text-gold hover:bg-gold/10 transition-colors min-h-[44px] touch-manipulation"
          >
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate font-semibold">{region.name}</span>
            <span className="text-white/40 shrink-0 ml-auto sm:ml-0">· trocar região</span>
          </button>
        )}

        {/* Brand filter pills — horizontal scroll with snap */}
        <div className="pb-3 flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-1 px-1">
          <button
            type="button"
            onClick={() => onBrandChange('todos')}
            className={`shrink-0 snap-start px-4 py-2.5 rounded-full text-[10px] font-display font-bold uppercase tracking-widest transition-all min-h-[44px] touch-manipulation ${
              activeBrand === 'todos'
                ? 'bg-gold-gradient text-black'
                : 'bg-white/5 text-white/60 border border-white/10 hover:border-gold/30'
            }`}
          >
            Todos
          </button>
          {brands.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => onBrandChange(b.slug)}
              className={`shrink-0 snap-start px-4 py-2.5 rounded-full text-[10px] font-display font-bold uppercase tracking-widest transition-all min-h-[44px] touch-manipulation ${
                activeBrand === b.slug
                  ? 'bg-gold-gradient text-black'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:border-gold/30'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
