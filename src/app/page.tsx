'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { useRegion, RegionData } from '@/context/RegionContext';
import { MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegionLandingPage() {
  const router = useRouter();
  const { region, setRegion, isReady } = useRegion();
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isReady && region) {
      router.replace('/catalogo');
    }
  }, [isReady, region, router]);

  useEffect(() => {
    fetch('/api/regions')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setRegions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const selectRegion = (r: RegionData) => {
    setRegion(r);
    router.push('/catalogo');
  };

  if (!isReady || region) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111] relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.08)_0%,transparent_55%)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23D4AF37\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-16 max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center mb-12"
        >
          <Logo size="xl" className="mb-8" />
          <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-gold font-bold mb-4">
            Vapes Premium
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-[0.15em] uppercase text-[#111]">
            Selecione sua região
          </h1>
          <p className="mt-4 font-sans text-sm text-[#666] font-medium max-w-md leading-relaxed">
            Exibimos os produtos disponíveis para entrega na sua cidade. Escolha abaixo para acessar o catálogo Sabor Gold.
          </p>
        </motion.div>

        {loading ? (
          <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {regions.map((r, i) => (
              <button
                key={r.id}
                type="button"
                onClick={() => selectRegion(r)}
                className="group flex items-center justify-between p-5 rounded-xl bg-white border border-[#E5E5E5] hover:border-gold hover:shadow-[0_4px_20px_rgba(212,175,55,0.12)] transition-all text-left shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-gold/10 border border-gold/20">
                    <MapPin className="w-5 h-5 text-gold-dark" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-sm tracking-wider text-[#111] group-hover:text-gold-dark transition-colors">
                      {r.name}
                    </p>
                    {r.state && (
                      <p className="text-[10px] text-[#888] font-medium uppercase tracking-wider mt-0.5">{r.state}</p>
                    )}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[#ccc] group-hover:text-gold-dark group-hover:translate-x-1 transition-all" />
              </button>
            ))}
            {regions.length === 0 && (
              <p className="col-span-2 text-center text-[#888] text-sm py-8">
                Nenhuma região cadastrada. Configure no painel admin.
              </p>
            )}
          </motion.div>
        )}

        <p className="mt-12 text-[9px] text-[#999] font-medium uppercase tracking-[0.3em]">
          Proibido para menores de 18 anos
        </p>
      </main>
    </div>
  );
}
