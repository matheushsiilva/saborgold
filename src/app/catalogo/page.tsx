'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CatalogHeader from '@/components/catalog/CatalogHeader';
import ProductCatalogCard, { CatalogProduct } from '@/components/catalog/ProductCatalogCard';
import CatalogFooter from '@/components/catalog/CatalogFooter';
import FloatingWhatsapp from '@/components/FloatingWhatsapp';
import { useRegion } from '@/context/RegionContext';
import { Search } from 'lucide-react';

export default function CatalogPage() {
  const router = useRouter();
  const { region, isReady } = useRegion();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [brands, setBrands] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [activeBrand, setActiveBrand] = useState('todos');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isReady && !region) router.replace('/');
  }, [isReady, region, router]);

  useEffect(() => {
    fetch('/api/brands')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setBrands(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!region) return;
    setLoading(true);
    const params = new URLSearchParams();
    params.set('regiao', region.slug);
    if (activeBrand !== 'todos') params.set('marca', activeBrand);
    if (search) params.set('busca', search);

    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [region, activeBrand, search]);

  if (!isReady || !region) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#FAFAFA]">
        <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <CatalogHeader brands={brands} activeBrand={activeBrand} onBrandChange={setActiveBrand} />
      <FloatingWhatsapp />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 pb-20 bg-[#FAFAFA]">
        <div className="relative mb-6 sm:mb-8 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999] pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar modelo, marca ou sabor..."
            className="w-full bg-white border border-[#E5E5E5] focus:border-gold/50 rounded-xl py-3.5 pl-11 pr-4 text-base sm:text-sm outline-none transition-colors shadow-sm text-[#111] placeholder:text-[#999] min-h-[48px]"
          />
        </div>

        {loading ? (
          <div className="py-24 sm:py-32 flex justify-center">
            <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 sm:py-24 bg-white rounded-2xl border border-[#E5E5E5] shadow-sm px-4">
            <p className="font-display text-base sm:text-lg text-[#333] uppercase tracking-wider font-bold">
              Nenhum produto nesta região
            </p>
            <p className="text-sm text-[#666] mt-2 font-medium">Cadastre produtos no painel admin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {products.map((p, i) => (
              <ProductCatalogCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </main>

      <CatalogFooter />
    </>
  );
}
