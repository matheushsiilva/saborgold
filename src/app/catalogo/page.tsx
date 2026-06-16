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
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111] flex flex-col">
      <CatalogHeader brands={brands} activeBrand={activeBrand} onBrandChange={setActiveBrand} />
      <FloatingWhatsapp />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar modelo, marca ou sabor..."
            className="w-full bg-white border border-[#E5E5E5] focus:border-gold/50 rounded-xl py-3.5 pl-11 pr-4 text-sm outline-none transition-colors shadow-sm text-[#111] placeholder:text-[#999]"
          />
        </div>

        {loading ? (
          <div className="py-32 flex justify-center">
            <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-[#E5E5E5] shadow-sm">
            <p className="font-display text-lg text-[#333] uppercase tracking-wider font-bold">
              Nenhum produto nesta região
            </p>
            <p className="text-sm text-[#666] mt-2 font-medium">Cadastre produtos no painel admin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-16">
            {products.map((p, i) => (
              <ProductCatalogCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </main>

      <CatalogFooter />
    </div>
  );
}
