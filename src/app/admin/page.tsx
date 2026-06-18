'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminBanners from '@/components/admin/AdminBanners';
import AdminRegions from '@/components/admin/AdminRegions';
import AdminBrands from '@/components/admin/AdminBrands';
import AdminModal from '@/components/admin/AdminModal';
import ProductImage from '@/components/ProductImage';
import {
  Lock,
  ArrowRight,
  Plus,
  Edit,
  Trash2,
  Check,
  AlertCircle,
  Eye,
  Settings as SettingsIcon,
  ShoppingBag,
  Inbox,
  User,
  Phone,
  Coins,
  Sparkles
} from 'lucide-react';

export default function AdminPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Tab state
  const [activeTab, setActiveTab] = useState('dashboard');

  // Database states
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    whatsappNumber: '',
    instagramUrl: '',
    address: '',
    contactEmail: '',
    heroTitle: '',
    heroSubtitle: '',
    aboutText: '',
  });

  // Loading & Action states
  const [loading, setLoading] = useState(true);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    categoryId: '',
    brandId: '',
    badge: '',
    flavorsText: '',
    regionIds: [] as string[],
    isFeatured: false,
    isBestSeller: false,
    inStock: true,
  });
  
  const [categoryName, setCategoryName] = useState('');
  const [settingsForm, setSettingsForm] = useState<any>({});
  const [settingsStatus, setSettingsStatus] = useState({ type: '', msg: '' });

  // Check Session
  useEffect(() => {
    const session = sessionStorage.getItem('sabor_gold_admin_session');
    if (session === 'active') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch all data when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const [prodRes, catRes, banRes, regRes, brandRes, setRes] = await Promise.all([
        fetch('/api/products').then(res => res.json()),
        fetch('/api/categories').then(res => res.json()),
        fetch('/api/banners').then(res => res.json()),
        fetch('/api/regions').then(res => res.json()),
        fetch('/api/brands').then(res => res.json()),
        fetch('/api/settings').then(res => res.json()),
      ]);

      if (Array.isArray(prodRes)) setProducts(prodRes);
      if (Array.isArray(banRes)) setBanners(banRes);
      if (Array.isArray(regRes)) setRegions(regRes);
      if (Array.isArray(brandRes)) setBrands(brandRes);
      if (Array.isArray(catRes)) {
        setCategories(catRes);
        if (catRes.length > 0) {
          setProductForm((prev) => ({ ...prev, categoryId: catRes[0].id }));
        }
      }
      if (setRes) {
        setSettings(setRes);
        setSettingsForm(setRes);
      }
      setLoading(false);
    } catch (e) {
      console.error('Error fetching admin data:', e);
      setLoading(false);
    }
  };

  // Auth Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin' || password === 'saborgold2026') {
      sessionStorage.setItem('sabor_gold_admin_session', 'active');
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Chave de acesso inválida.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('sabor_gold_admin_session');
    setIsAuthenticated(false);
    setPassword('');
  };

  // Handle Image Upload to server
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setProductForm((prev) => ({ ...prev, imageUrl: data.url }));
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

  const parseFlavors = (text: string) =>
    text
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, ...rest] = line.split('|');
        return { name: name.trim(), description: rest.join('|').trim() || undefined };
      });

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...productForm,
      flavors: parseFlavors(productForm.flavorsText),
      regionIds: productForm.regionIds.length ? productForm.regionIds : regions.map((r: { id: string }) => r.id),
      badge: productForm.badge || null,
      brandId: productForm.brandId || null,
    };

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsProductModalOpen(false);
        setEditingProduct(null);
        setProductForm({
          name: '',
          description: '',
          price: '',
          imageUrl: '',
          categoryId: categories[0]?.id || '',
          brandId: '',
          badge: '',
          flavorsText: '',
          regionIds: regions.map((r: { id: string }) => r.id),
          isFeatured: false,
          isBestSeller: false,
          inStock: true,
        });
        fetchData();
      } else {
        alert('Erro ao salvar produto.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao salvar produto.');
    }
  };

  const startEditProduct = (prod: any) => {
    setEditingProduct(prod);
    const flavorsText =
      prod.flavors?.map((f: { name: string; description?: string }) =>
        f.description ? `${f.name}|${f.description}` : f.name
      ).join('\n') || '';
    setProductForm({
      name: prod.name,
      description: prod.description,
      price: prod.price.toString(),
      imageUrl: prod.imageUrl,
      categoryId: prod.categoryId,
      brandId: prod.brandId || '',
      badge: prod.badge || '',
      flavorsText,
      regionIds: prod.regions?.map((r: { regionId: string }) => r.regionId) || [],
      isFeatured: prod.isFeatured,
      isBestSeller: prod.isBestSeller,
      inStock: prod.inStock,
    });
    setIsProductModalOpen(true);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Deseja realmente remover este produto?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Category CRUD
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName) return;

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryName })
      });

      if (res.ok) {
        setCategoryName('');
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Deseja realmente remover esta categoria? Atenção: isso removerá todos os produtos nela.')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsStatus({ type: '', msg: '' });

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm)
      });

      if (res.ok) {
        setSettingsStatus({ type: 'success', msg: 'Configurações atualizadas com sucesso!' });
        fetchData();
      } else {
        setSettingsStatus({ type: 'error', msg: 'Erro ao atualizar configurações.' });
      }
    } catch (e) {
      console.error(e);
      setSettingsStatus({ type: 'error', msg: 'Erro de conexão com o servidor.' });
    }
  };

  // Lock Screen rendering
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center relative p-4 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-gold/5 rounded-full filter blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-gold/5 rounded-full filter blur-[80px]" />

        <div className="w-full max-w-md glassmorphism-gold rounded-2xl p-8 z-10 space-y-8 flex flex-col items-center">
          {/* Lock header */}
          <div className="flex flex-col items-center text-center">
            <div className="p-4 bg-white/[0.02] border border-gold/25 rounded-full mb-4">
              <Lock className="w-8 h-8 text-gold animate-pulse" />
            </div>
            <h1 className="font-display font-bold text-lg tracking-[0.2em] text-white uppercase">
              Sabor Gold
            </h1>
            <p className="font-sans text-[9px] tracking-widest text-white/45 uppercase mt-1">
              PAINEL PRIVADO DE ADMINISTRAÇÃO
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="w-full space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1.5 font-semibold">
                Chave de Acesso Admin
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Insira a chave admin"
                className="w-full bg-black border border-white/10 focus:border-gold rounded-lg p-3 text-sm outline-none transition-colors text-center text-gold font-mono tracking-widest"
              />
            </div>

            {authError && (
              <div className="flex items-center gap-2 text-red-400 bg-red-950/20 border border-red-500/20 p-3 rounded-lg text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gold-gradient text-black font-display font-bold text-xs tracking-widest rounded-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all uppercase shadow-[0_4px_15px_rgba(212,175,55,0.15)]"
            >
              ACESSAR PAINEL <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Small note */}
          <span className="font-sans text-[8px] tracking-widest text-white/20 uppercase">
            Acesso Restrito - Sabor Gold Co.
          </span>
        </div>
      </div>
    );
  }

  // Dashboard content if loading
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg text-white flex flex-col justify-center items-center">
        <div className="relative w-12 h-12">
          <span className="absolute inset-0 rounded-full border-2 border-gold/20" />
          <span className="absolute inset-0 rounded-full border-2 border-t-gold border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white flex flex-col lg:flex-row font-sans">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
      />

      <main className="flex-1 min-w-0 min-h-screen overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 bg-[#050505] pb-24">
        
        {/* Tab 1: Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
              <h1 className="font-display font-bold text-2xl tracking-widest text-white">DASHBOARD</h1>
              <p className="font-sans text-xs text-white/50">Visão geral do desempenho e atividades do site Sabor Gold.</p>
            </div>

            {/* Metrics cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1 */}
              <div className="p-6 glassmorphism rounded-xl border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-white/50">Total Produtos</span>
                  <ShoppingBag className="w-5 h-5 text-gold" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-display">{products.length}</span>
                  <span className="text-[10px] text-green-400 font-semibold">ativos</span>
                </div>
              </div>

              <div className="p-6 glassmorphism rounded-xl border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-white/50">Regiões</span>
                  <Sparkles className="w-5 h-5 text-gold" />
                </div>
                <span className="text-2xl font-bold font-display">{regions.length}</span>
              </div>

              <div className="p-6 glassmorphism rounded-xl border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-white/50">Marcas</span>
                  <Coins className="w-5 h-5 text-gold" />
                </div>
                <span className="text-2xl font-bold font-display">{brands.length}</span>
              </div>

            </div>

            <div className="p-6 glassmorphism rounded-xl border border-gold/15 text-sm text-white/50">
              Pedidos são feitos direto no <strong className="text-gold">WhatsApp</strong> com produto, sabor e região na mensagem.
              Configure o número em WhatsApp &amp; Site.
            </div>

          </div>
        )}

        {/* Tab 2: Products Manager */}
        {activeTab === 'produtos' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-end">
              <div>
                <h1 className="font-display font-bold text-2xl tracking-widest text-white">PRODUTOS</h1>
                <p className="font-sans text-xs text-white/50">Gerencie e edite os itens do catálogo Sabor Gold.</p>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({
                    name: '',
                    description: '',
                    price: '',
                    imageUrl: '',
                    categoryId: categories[0]?.id || '',
                    brandId: brands[0]?.id || '',
                    badge: '',
                    flavorsText: '',
                    regionIds: regions.map((r: { id: string }) => r.id),
                    isFeatured: false,
                    isBestSeller: false,
                    inStock: true,
                  });
                  setIsProductModalOpen(true);
                }}
                className="bg-gold-gradient text-black font-display font-bold text-xs tracking-wider px-4 py-3 rounded-lg flex items-center gap-1.5 hover:opacity-90 transition-all uppercase"
              >
                <Plus className="w-4.5 h-4.5" /> Adicionar Produto
              </button>
            </div>

            {/* Products Table */}
            <div className="glassmorphism rounded-xl border border-white/5 overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-white/40 border-b border-white/5 bg-white/[0.01]">
                    <th className="p-4 uppercase tracking-wider font-semibold">Foto</th>
                    <th className="p-4 uppercase tracking-wider font-semibold">Nome</th>
                    <th className="p-4 uppercase tracking-wider font-semibold">Categoria</th>
                    <th className="p-4 uppercase tracking-wider font-semibold">Preço</th>
                    <th className="p-4 uppercase tracking-wider font-semibold">Status</th>
                    <th className="p-4 uppercase tracking-wider font-semibold text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod.id} className="border-b border-white/5 hover:bg-white/[0.005]">
                      <td className="p-4">
                        <div className="w-10 h-10">
                          <ProductImage imageUrl={prod.imageUrl} name={prod.name} />
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-white">{prod.name}</p>
                        <div className="flex gap-2 mt-1">
                          {prod.isFeatured && <span className="text-[8px] bg-gold/10 text-gold border border-gold/25 px-1 rounded uppercase font-semibold">Destaque</span>}
                          {prod.isBestSeller && <span className="text-[8px] bg-green-500/10 text-green-400 border border-green-500/25 px-1 rounded uppercase font-semibold">Mais Vendido</span>}
                        </div>
                      </td>
                      <td className="p-4 text-white/70">{prod.category?.name || 'Sem Categoria'}</td>
                      <td className="p-4 font-bold text-gold">R$ {prod.price.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-[3px] text-[9px] font-bold uppercase tracking-wider ${
                          prod.inStock ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}>
                          {prod.inStock ? 'Disponível' : 'Esgotado'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => startEditProduct(prod)}
                            className="p-2 hover:bg-white/5 rounded text-white/60 hover:text-gold transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(prod.id)}
                            className="p-2 hover:bg-white/5 rounded text-white/60 hover:text-red-400 transition-colors"
                            title="Remover"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Categories Manager */}
        {activeTab === 'categorias' && (
          <div className="space-y-6 animate-fade-in max-w-2xl">
            <div>
              <h1 className="font-display font-bold text-2xl tracking-widest text-white">CATEGORIAS</h1>
              <p className="font-sans text-xs text-white/50 mt-1">
                O site usa apenas duas categorias fixas: <strong className="text-gold">Pods</strong> e{' '}
                <strong className="text-gold">Vape</strong> (essências entram em Vape).
              </p>
            </div>
            <div className="glassmorphism p-6 rounded-xl border border-white/5 space-y-3 text-xs">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex justify-between items-center p-4 border border-white/5 rounded-lg"
                >
                  <div>
                    <p className="font-bold text-white uppercase tracking-wider">{cat.name}</p>
                    <p className="text-[10px] text-white/40 font-mono">slug: {cat.slug}</p>
                  </div>
                  <span className="text-gold font-semibold">{cat._count?.products ?? 0} produtos</span>
                </div>
              ))}
              {categories.length === 0 && (
                <p className="text-white/40">Execute no terminal: npm run db:seed</p>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Banners */}
        {activeTab === 'regioes' && <AdminRegions regions={regions} onRefresh={fetchData} />}

        {activeTab === 'marcas' && <AdminBrands brands={brands} onRefresh={fetchData} />}

        {activeTab === 'banners' && (
          <AdminBanners banners={banners} onRefresh={fetchData} />
        )}

        {/* Tab: Site Settings Panel */}
        {activeTab === 'configuracoes' && (
          <div className="space-y-8 animate-fade-in max-w-3xl">
            {/* Header */}
            <div>
              <h1 className="font-display font-bold text-2xl tracking-widest text-white">CONFIGURAÇÕES</h1>
              <p className="font-sans text-xs text-white/50">Edite as informações gerais e os textos principais do site.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveSettings} className="glassmorphism p-6 rounded-xl border border-white/5 space-y-6 text-xs">
              
              {/* Alert Status */}
              {settingsStatus.msg && (
                <div className={`p-4 rounded-lg flex items-center gap-2 border font-semibold ${
                  settingsStatus.type === 'success' ? 'bg-green-950/20 border-green-500/20 text-green-400' : 'bg-red-950/20 border-red-500/20 text-red-400'
                }`}>
                  {settingsStatus.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{settingsStatus.msg}</span>
                </div>
              )}

              {/* Section: Contacts */}
              <div className="space-y-4">
                <h3 className="font-display font-bold text-xs uppercase tracking-widest text-gold border-b border-white/5 pb-2">
                  Informações de Contato
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/50 mb-1 uppercase font-semibold">Número do WhatsApp *</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.whatsappNumber || ''}
                      onChange={(e) => setSettingsForm((prev: any) => ({ ...prev, whatsappNumber: e.target.value }))}
                      placeholder="Ex: 5511999999999"
                      className="w-full bg-black border border-white/10 focus:border-gold rounded p-2.5 outline-none text-white text-xs"
                    />
                    <span className="text-[9px] text-white/30 block mt-1 uppercase">Apenas números, incluindo código de país (55) e DDI.</span>
                  </div>

                  <div>
                    <label className="block text-white/50 mb-1 uppercase font-semibold">Link do Instagram</label>
                    <input
                      type="url"
                      value={settingsForm.instagramUrl || ''}
                      onChange={(e) => setSettingsForm((prev: any) => ({ ...prev, instagramUrl: e.target.value }))}
                      placeholder="Ex: https://instagram.com/sabor.gold"
                      className="w-full bg-black border border-white/10 focus:border-gold rounded p-2.5 outline-none text-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/50 mb-1 uppercase font-semibold">Endereço Físico</label>
                    <input
                      type="text"
                      value={settingsForm.address || ''}
                      onChange={(e) => setSettingsForm((prev: any) => ({ ...prev, address: e.target.value }))}
                      placeholder="Ex: Av. Europa, 1200 - Jardins, São Paulo"
                      className="w-full bg-black border border-white/10 focus:border-gold rounded p-2.5 outline-none text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-white/50 mb-1 uppercase font-semibold">E-mail de Contato</label>
                    <input
                      type="email"
                      value={settingsForm.contactEmail || ''}
                      onChange={(e) => setSettingsForm((prev: any) => ({ ...prev, contactEmail: e.target.value }))}
                      placeholder="Ex: contato@saborgold.com"
                      className="w-full bg-black border border-white/10 focus:border-gold rounded p-2.5 outline-none text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Textos Hero */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="font-display font-bold text-xs uppercase tracking-widest text-gold border-b border-white/5 pb-2">
                  Textos da Página Inicial
                </h3>
                <div>
                  <label className="block text-white/50 mb-1 uppercase font-semibold">Título Hero *</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.heroTitle || ''}
                    onChange={(e) => setSettingsForm((prev: any) => ({ ...prev, heroTitle: e.target.value }))}
                    className="w-full bg-black border border-white/10 focus:border-gold rounded p-2.5 outline-none text-white text-xs font-display tracking-widest"
                  />
                  <span className="text-[9px] text-white/30 block mt-1 uppercase">Separe com vírgula para forçar quebra de linha com cor dourada.</span>
                </div>

                <div>
                  <label className="block text-white/50 mb-1 uppercase font-semibold">Subtítulo Hero *</label>
                  <textarea
                    rows={2}
                    required
                    value={settingsForm.heroSubtitle || ''}
                    onChange={(e) => setSettingsForm((prev: any) => ({ ...prev, heroSubtitle: e.target.value }))}
                    className="w-full bg-black border border-white/10 focus:border-gold rounded p-2.5 outline-none text-white text-xs resize-none"
                  />
                </div>

                <div>
                  <label className="block text-white/50 mb-1 uppercase font-semibold">Texto "Sobre a Marca" *</label>
                  <textarea
                    rows={4}
                    required
                    value={settingsForm.aboutText || ''}
                    onChange={(e) => setSettingsForm((prev: any) => ({ ...prev, aboutText: e.target.value }))}
                    className="w-full bg-black border border-white/10 focus:border-gold rounded p-2.5 outline-none text-white text-xs resize-none"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-white/5">
                <button
                  type="submit"
                  className="w-full py-4 bg-gold-gradient text-black font-display font-bold tracking-widest rounded-lg uppercase shadow-[0_4px_15px_rgba(212,175,55,0.15)]"
                >
                  Salvar Alterações
                </button>
              </div>

            </form>
          </div>
        )}

      </main>

      {isProductModalOpen && (
        <AdminModal
          title={editingProduct ? 'Editar Produto' : 'Adicionar Produto'}
          onClose={() => setIsProductModalOpen(false)}
        >
          <form onSubmit={handleProductSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/50 mb-1 uppercase font-semibold">Nome *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full bg-black border border-white/10 focus:border-gold rounded p-2.5 outline-none text-white"
                />
              </div>
              <div>
                <label className="block text-white/50 mb-1 uppercase font-semibold">Preço (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={productForm.price}
                  onChange={(e) => setProductForm((p) => ({ ...p, price: e.target.value }))}
                  className="w-full bg-black border border-white/10 focus:border-gold rounded p-2.5 outline-none text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-white/50 mb-1 uppercase font-semibold">Descrição *</label>
              <textarea
                rows={3}
                required
                value={productForm.description}
                onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))}
                className="w-full bg-black border border-white/10 focus:border-gold rounded p-2.5 outline-none text-white resize-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/50 mb-1 uppercase font-semibold">Categoria *</label>
                <select
                  value={productForm.categoryId}
                  onChange={(e) => setProductForm((p) => ({ ...p, categoryId: e.target.value }))}
                  className="w-full bg-black border border-white/10 focus:border-gold rounded p-2.5 outline-none text-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <p className="text-[9px] text-white/35 mt-1">Pods ou Vape</p>
              </div>
              <div>
                <label className="block text-white/50 mb-1 uppercase font-semibold">Marca</label>
                <select
                  value={productForm.brandId}
                  onChange={(e) => setProductForm((p) => ({ ...p, brandId: e.target.value }))}
                  className="w-full bg-black border border-white/10 focus:border-gold rounded p-2.5 outline-none text-white"
                >
                  <option value="">Sem marca</option>
                  {brands.map((b: { id: string; name: string }) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white/50 mb-1 uppercase font-semibold">Badge</label>
                <select
                  value={productForm.badge}
                  onChange={(e) => setProductForm((p) => ({ ...p, badge: e.target.value }))}
                  className="w-full bg-black border border-white/10 focus:border-gold rounded p-2.5 outline-none text-white"
                >
                  <option value="">Nenhum</option>
                  <option value="LANÇAMENTO">LANÇAMENTO</option>
                  <option value="PROMOÇÃO">PROMOÇÃO</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-white/50 mb-1 uppercase font-semibold">Sabores (um por linha)</label>
                <textarea
                  rows={4}
                  value={productForm.flavorsText}
                  onChange={(e) => setProductForm((p) => ({ ...p, flavorsText: e.target.value }))}
                  placeholder={'KIWI PASSION FRUIT GUAVA|Kiwi, Maracujá e Goiaba\nWATERMELON ICE|Melancia gelada'}
                  className="w-full bg-black border border-white/10 focus:border-gold rounded p-2.5 outline-none text-white font-mono text-[11px] resize-none"
                />
              </div>
              <div>
                <label className="block text-white/50 mb-1.5 uppercase font-semibold text-[10px] tracking-wider">Imagem do Produto</label>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-16 h-16 rounded-xl bg-[#080808] border border-white/10 flex items-center justify-center overflow-hidden shrink-0 relative group">
                    {productForm.imageUrl ? (
                      <img
                        src={
                          productForm.imageUrl.startsWith('data:') ||
                          productForm.imageUrl.startsWith('/') ||
                          productForm.imageUrl.startsWith('http')
                            ? productForm.imageUrl
                            : `/brand/logo-icon-gold.svg`
                        }
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/brand/logo-icon-gold.svg';
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-1">
                        <span className="text-[8px] text-white/30 uppercase tracking-wider font-semibold">Sem foto</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                      id="product-file-upload"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="product-file-upload"
                      className={`inline-flex items-center justify-center px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white cursor-pointer active:scale-95 transition-all text-center uppercase tracking-wider ${
                        uploading ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    >
                      {uploading ? 'Enviando...' : 'Escolher Foto'}
                    </label>
                    <p className="text-[8px] text-white/30 uppercase tracking-widest leading-relaxed">Formatos: JPG, PNG, WEBP. Recomendado tamanho quadrado.</p>
                  </div>
                </div>
                <input
                  type="text"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm((p) => ({ ...p, imageUrl: e.target.value }))}
                  placeholder="Ou cole a URL da imagem aqui"
                  className="w-full bg-black border border-white/10 focus:border-gold rounded p-2.5 outline-none text-white font-mono text-[11px]"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={productForm.isFeatured}
                  onChange={(e) => setProductForm((p) => ({ ...p, isFeatured: e.target.checked }))}
                  className="accent-gold"
                />
                <span className="text-white/70 uppercase text-[10px] font-semibold">Destaque</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={productForm.inStock}
                  onChange={(e) => setProductForm((p) => ({ ...p, inStock: e.target.checked }))}
                  className="accent-gold"
                />
                <span className="text-white/70 uppercase text-[10px] font-semibold">Em estoque</span>
              </label>
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-gold-gradient text-black font-display font-bold tracking-wider rounded-lg uppercase"
            >
              Salvar Produto
            </button>
          </form>
        </AdminModal>
      )}
    </div>
  );
}
