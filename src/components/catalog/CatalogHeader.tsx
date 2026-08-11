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
        {/* Linha principal: logo · região · login */}
        <div className="flex items-center gap-2 sm:gap-3 py-2.5 sm:py-3 min-w-0">
          <Link href="/catalogo" className="shrink-0">
            <Logo size="sm" />
          </Link>

          {region && (
            <button
              type="button"
              onClick={changeRegion}
              title="Trocar região"
              className="flex-1 min-w-0 flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-full border border-gold/25 bg-gold/5 text-[10px] uppercase tracking-wider text-gold hover:bg-gold/10 transition-colors touch-manipulation"
            >
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate font-semibold">{region.name}</span>
              <span className="text-white/35 shrink-0 hidden sm:inline">· trocar</span>
            </button>
          )}

          <div className="flex items-center shrink-0">
            {user ? (
              <button
                type="button"
                onClick={logout}
                className="p-2 rounded-lg border border-white/10 hover:border-gold/30 text-white/60 hover:text-gold touch-manipulation"
                title="Sair"
                aria-label="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <Link
                href="/entrar"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gold/30 text-[10px] font-display font-bold uppercase tracking-widest text-gold hover:bg-gold/10 transition-colors touch-manipulation"
              >
                <User className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Entrar</span>
              </Link>
            )}
          </div>
        </div>

        {/* Filtros de marca */}
        <div className="pb-2.5 sm:pb-3 flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
          <button
            type="button"
            onClick={() => onBrandChange('todos')}
            className={`shrink-0 snap-start px-3.5 py-2 rounded-full text-[10px] font-display font-bold uppercase tracking-widest transition-all touch-manipulation ${
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
              className={`shrink-0 snap-start px-3.5 py-2 rounded-full text-[10px] font-display font-bold uppercase tracking-widest transition-all touch-manipulation ${
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
