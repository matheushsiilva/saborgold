'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AdminModal from './AdminModal';

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
  isActive: boolean;
  order: number;
}

interface AdminBannersProps {
  banners: Banner[];
  onRefresh: () => void;
}

export default function AdminBanners({ banners, onRefresh }: AdminBannersProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    imageUrl: 'gradient:gold',
    linkUrl: '/catalogo',
    isActive: true,
    order: 0,
  });

  const openCreate = () => {
    setEditing(null);
    setForm({
      title: '',
      subtitle: '',
      imageUrl: 'gradient:gold',
      linkUrl: '/catalogo',
      isActive: true,
      order: banners.length,
    });
    setIsModalOpen(true);
  };

  const openEdit = (b: Banner) => {
    setEditing(b);
    setForm({
      title: b.title,
      subtitle: b.subtitle || '',
      imageUrl: b.imageUrl,
      linkUrl: b.linkUrl || '',
      isActive: b.isActive,
      order: b.order,
    });
    setIsModalOpen(true);
  };

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setForm((p) => ({ ...p, imageUrl: data.url }));
      } else {
        alert('Erro ao enviar a imagem.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao enviar a imagem.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editing ? `/api/banners/${editing.id}` : '/api/banners';
    const method = editing ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setIsModalOpen(false);
      onRefresh();
    } else {
      alert('Erro ao salvar banner.');
    }
  };

  const deleteBanner = async (id: string) => {
    if (!confirm('Remover este banner?')) return;
    const res = await fetch(`/api/banners/${id}`, { method: 'DELETE' });
    if (res.ok) onRefresh();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-display font-bold text-2xl tracking-widest text-white">BANNERS</h1>
          <p className="font-sans text-xs text-white/50">Gerencie os banners promocionais do carrossel hero.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="bg-gold-gradient text-black font-display font-bold text-xs tracking-wider px-4 py-3 rounded-lg flex items-center gap-1.5 hover:opacity-90 uppercase"
        >
          <Plus className="w-4.5 h-4.5" /> Novo Banner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b) => (
          <div
            key={b.id}
            className="glassmorphism rounded-xl border border-white/5 p-5 space-y-3 hover:border-gold/15 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-white text-sm">{b.title}</h4>
                <p className="text-xs text-white/50 mt-1 line-clamp-2">{b.subtitle}</p>
              </div>
              <span
                className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                  b.isActive
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                    : 'bg-white/5 text-white/40'
                }`}
              >
                {b.isActive ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <p className="text-[10px] text-white/30 font-mono truncate">img: {b.imageUrl.slice(0, 40)}...</p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => openEdit(b)}
                className="p-2 hover:bg-white/5 rounded text-white/60 hover:text-gold"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => deleteBanner(b.id)}
                className="p-2 hover:bg-white/5 rounded text-white/60 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <AdminModal
          title={editing ? 'Editar Banner' : 'Novo Banner'}
          onClose={() => setIsModalOpen(false)}
          maxWidth="max-w-lg"
        >
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/50 mb-1 uppercase font-semibold">Título *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full bg-black border border-white/10 focus:border-gold rounded p-2.5 outline-none text-white"
                />
              </div>
              <div>
                <label className="block text-white/50 mb-1 uppercase font-semibold">Subtítulo</label>
                <textarea
                  rows={2}
                  value={form.subtitle}
                  onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
                  className="w-full bg-black border border-white/10 focus:border-gold rounded p-2.5 outline-none text-white resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/50 mb-1 uppercase font-semibold">Link</label>
                  <input
                    type="text"
                    value={form.linkUrl}
                    onChange={(e) => setForm((p) => ({ ...p, linkUrl: e.target.value }))}
                    placeholder="/catalogo"
                    className="w-full bg-black border border-white/10 focus:border-gold rounded p-2.5 outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/50 mb-1 uppercase font-semibold">Ordem</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm((p) => ({ ...p, order: parseInt(e.target.value, 10) }))}
                    className="w-full bg-black border border-white/10 focus:border-gold rounded p-2.5 outline-none text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/50 mb-1.5 uppercase font-semibold text-[10px] tracking-wider">Imagem do Banner</label>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-20 h-12 rounded-lg bg-[#080808] border border-white/10 flex items-center justify-center overflow-hidden shrink-0 relative">
                    {form.imageUrl && !form.imageUrl.startsWith('gradient:') ? (
                      <img
                        src={form.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/brand/logo-icon-gold.svg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gold-gradient flex items-center justify-center">
                        <span className="text-[8px] text-black font-bold uppercase tracking-wider">Gradiente</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFile}
                      className="hidden"
                      id="banner-file-upload"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="banner-file-upload"
                      className={`inline-flex items-center justify-center px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white cursor-pointer active:scale-95 transition-all text-center uppercase tracking-wider ${
                        uploading ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    >
                      {uploading ? 'Enviando...' : 'Escolher Foto'}
                    </label>
                    <p className="text-[8px] text-white/30 uppercase tracking-widest leading-relaxed">Formatos: JPG, PNG, WEBP. Recomendado tamanho de banner horizontal.</p>
                  </div>
                </div>
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
                  placeholder="gradient:gold ou URL"
                  className="w-full bg-black border border-white/10 focus:border-gold rounded p-2.5 outline-none text-white font-mono text-[11px]"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                  className="accent-gold"
                />
                <span className="uppercase font-semibold text-white/70">Banner ativo</span>
              </label>
              <button type="submit" className="w-full py-3 bg-gold-gradient text-black font-display font-bold tracking-wider rounded uppercase">
                Salvar Banner
              </button>
            </form>
        </AdminModal>
      )}
    </div>
  );
}
