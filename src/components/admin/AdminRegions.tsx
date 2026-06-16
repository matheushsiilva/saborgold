'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Region {
  id: string;
  name: string;
  slug: string;
  state?: string | null;
}

export default function AdminRegions({
  regions,
  onRefresh,
}: {
  regions: Region[];
  onRefresh: () => void;
}) {
  const [name, setName] = useState('');
  const [state, setState] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/regions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, state }),
    });
    if (res.ok) {
      setName('');
      setState('');
      onRefresh();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remover região?')) return;
    await fetch(`/api/regions/${id}`, { method: 'DELETE' });
    onRefresh();
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display font-bold text-2xl tracking-widest text-white">REGIÕES</h1>
        <p className="text-xs text-white/50 mt-1">Cidades exibidas na tela inicial do site.</p>
      </div>
      <form onSubmit={handleCreate} className="glassmorphism p-5 rounded-xl border border-white/5 space-y-3 text-xs">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome da cidade"
          className="w-full bg-black border border-white/10 focus:border-gold rounded p-2.5 outline-none text-white"
        />
        <input
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="UF (ex: SP)"
          className="w-full bg-black border border-white/10 focus:border-gold rounded p-2.5 outline-none text-white"
        />
        <button type="submit" className="w-full py-2.5 bg-gold-gradient text-black font-bold uppercase tracking-wider rounded">
          <Plus className="w-4 h-4 inline mr-1" /> Adicionar Região
        </button>
      </form>
      <div className="space-y-2">
        {regions.map((r) => (
          <div
            key={r.id}
            className="flex justify-between items-center p-4 glassmorphism rounded-lg border border-white/5"
          >
            <div>
              <p className="font-bold text-white">{r.name}</p>
              <p className="text-[10px] text-white/40 font-mono">{r.slug}</p>
            </div>
            <button type="button" onClick={() => handleDelete(r.id)} className="text-white/40 hover:text-red-400">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
