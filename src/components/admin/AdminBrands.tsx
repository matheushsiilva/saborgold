'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

interface Brand {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
}

export default function AdminBrands({ brands, onRefresh }: { brands: Brand[]; onRefresh: () => void }) {
  const [name, setName] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      setName('');
      onRefresh();
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display font-bold text-2xl tracking-widest text-white">MARCAS</h1>
        <p className="text-xs text-white/50 mt-1">Filtros do catálogo (ELFBAR, IGNITE, etc.)</p>
      </div>
      <form onSubmit={handleCreate} className="glassmorphism p-5 rounded-xl border border-white/5 flex gap-2 text-xs">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: ELFBAR"
          className="flex-1 bg-black border border-white/10 focus:border-gold rounded p-2.5 outline-none text-white uppercase"
        />
        <button type="submit" className="px-4 py-2.5 bg-gold-gradient text-black font-bold uppercase rounded shrink-0">
          <Plus className="w-4 h-4" />
        </button>
      </form>
      <div className="space-y-2">
        {brands.map((b) => (
          <div key={b.id} className="p-4 glassmorphism rounded-lg border border-white/5 flex justify-between">
            <span className="font-bold text-gold uppercase tracking-wider">{b.name}</span>
            <span className="text-white/40 text-[10px]">{b._count?.products ?? 0} produtos</span>
          </div>
        ))}
      </div>
    </div>
  );
}
