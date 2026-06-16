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
    <header className="sticky top-0 z-50 glassmorphism border-b border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 gap-4">
          <Link href="/catalogo" className="shrink-0">
            <Logo size="md" />
          </Link>

          {region && (
            <button
              type="button"
              onClick={changeRegion}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border border-gold/25 bg-gold/5 text-[9px] sm:text-[10px] uppercase tracking-wider text-gold hover:bg-gold/10 transition-colors max-w-[140px] sm:max-w-none"
            >
              <MapPin className="w-3.5 h-3.5" />
              {region.name}
              <span className="text-white/40">· trocar</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden md:block text-[10px] text-white/60 uppercase tracking-wider">
                  {user.name}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="p-2 rounded-lg border border-white/10 hover:border-gold/30 text-white/60 hover:text-gold"
                  title="Sair"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/entrar"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gold/30 text-[10px] font-display font-bold uppercase tracking-widest text-gold hover:bg-gold/10 transition-colors"
              >
                <User className="w-4 h-4" />
                Entrar
              </Link>
            )}
          </div>
        </div>

        <div className="pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            type="button"
            onClick={() => onBrandChange('todos')}
            className={`shrink-0 px-4 py-2 rounded-full text-[10px] font-display font-bold uppercase tracking-widest transition-all ${
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
              className={`shrink-0 px-4 py-2 rounded-full text-[10px] font-display font-bold uppercase tracking-widest transition-all ${
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
