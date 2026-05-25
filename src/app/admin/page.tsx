'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminBanners from '@/components/admin/AdminBanners';
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
  const [orders, setOrders] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
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

  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    categoryId: '',
    isFeatured: false,
    isBestSeller: false,
    inStock: true
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
      const [prodRes, catRes, banRes, ordRes, msgRes, setRes] = await Promise.all([
        fetch('/api/products').then(res => res.json()),
        fetch('/api/categories').then(res => res.json()),
        fetch('/api/banners').then(res => res.json()),
        fetch('/api/orders').then(res => res.json()),
        fetch('/api/messages').then(res => res.json()),
        fetch('/api/settings').then(res => res.json())
      ]);

      if (Array.isArray(prodRes)) setProducts(prodRes);
      if (Array.isArray(banRes)) setBanners(banRes);
      if (Array.isArray(catRes)) {
        setCategories(catRes);
        if (catRes.length > 0) {
          setProductForm(prev => ({ ...prev, categoryId: catRes[0].id }));
        }
      }
      if (Array.isArray(ordRes)) setOrders(ordRes);
      if (Array.isArray(msgRes)) setMessages(msgRes);
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

  // Handle Base64 Image Upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Product CRUD
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm)
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
          isFeatured: false,
          isBestSeller: false,
          inStock: true
        });
        fetchData();
      } else {
        alert('Erro ao salvar produto.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const startEditProduct = (prod: any) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      description: prod.description,
      price: prod.price.toString(),
      imageUrl: prod.imageUrl,
      categoryId: prod.categoryId,
      isFeatured: prod.isFeatured,
      isBestSeller: prod.isBestSeller,
      inStock: prod.inStock
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

  // Order update status
  const updateOrderStatus = async (id: string, currentStatus: string) => {
    const nextMap: Record<string, string> = {
      'Pendente': 'Contatado',
      'Contatado': 'Concluído',
      'Concluído': 'Pendente'
    };
    const nextStatus = nextMap[currentStatus] || 'Pendente';

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Message Inbox Actions
  const markMessageAsRead = async (id: string, isRead: boolean) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Excluir esta mensagem permanentemente?')) return;
    try {
      const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
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
    <div className="min-h-screen bg-dark-bg text-white flex font-sans">
      
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen p-8 bg-[#050505]">
        
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

              {/* Card 2 */}
              <div className="p-6 glassmorphism rounded-xl border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-white/50">Categorias</span>
                  <Sparkles className="w-5 h-5 text-gold" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-display">{categories.length}</span>
                  <span className="text-[10px] text-white/40">divisões</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-6 glassmorphism rounded-xl border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-white/50">Pedidos Pendentes</span>
                  <Coins className="w-5 h-5 text-gold" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-display">
                    {orders.filter(o => o.status === 'Pendente').length}
                  </span>
                  <span className="text-[10px] text-amber-400 font-semibold">aguardando contato</span>
                </div>
              </div>

              {/* Card 4 */}
              <div className="p-6 glassmorphism rounded-xl border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-white/50">Mensagens Inbox</span>
                  <Inbox className="w-5 h-5 text-gold" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-display">
                    {messages.filter(m => !m.isRead).length}
                  </span>
                  <span className="text-[10px] text-gold font-semibold">não lidas</span>
                </div>
              </div>

            </div>

            {/* Custom SVG line chart representing mock analytics (Vendas/Conversões) */}
            <div className="p-6 glassmorphism rounded-xl border border-white/5">
              <h3 className="font-display font-bold text-xs uppercase tracking-widest text-gold mb-6 border-b border-white/5 pb-2">
                Cliques de Pedidos no WhatsApp (Mock Semanal)
              </h3>
              <div className="h-48 w-full flex items-end gap-2 relative">
                {/* Visual Chart Grid */}
                <div className="absolute inset-0 flex flex-col justify-between opacity-5">
                  <line x1="0" y1="0" x2="100%" y2="0" stroke="white" strokeWidth="1" />
                  <line x1="0" y1="25%" x2="100%" y2="25%" stroke="white" strokeWidth="1" />
                  <line x1="0" y1="50%" x2="100%" y2="50%" stroke="white" strokeWidth="1" />
                  <line x1="0" y1="75%" x2="100%" y2="75%" stroke="white" strokeWidth="1" />
                </div>

                {/* SVG path chart */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  <path
                    d="M 50 150 Q 200 80 400 120 T 800 30"
                    fill="none"
                    stroke="url(#chartGrad)"
                    strokeWidth="3"
                    className="drop-shadow-[0_4px_10px_rgba(212,175,55,0.4)]"
                  />
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#AA7C11" />
                      <stop offset="50%" stopColor="#D4AF37" />
                      <stop offset="100%" stopColor="#F3E5AB" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute bottom-2 left-6 text-[10px] text-white/40">Seg</div>
                <div className="absolute bottom-2 left-1/4 text-[10px] text-white/40">Qua</div>
                <div className="absolute bottom-2 left-1/2 text-[10px] text-white/40">Sex</div>
                <div className="absolute bottom-2 right-6 text-[10px] text-white/40">Dom</div>
              </div>
            </div>

            {/* Split layout: Recent orders / Recent Messages */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Orders */}
              <div className="lg:col-span-8 glassmorphism p-6 rounded-xl border border-white/5 space-y-4">
                <h3 className="font-display font-bold text-xs uppercase tracking-widest text-gold border-b border-white/5 pb-2">
                  Pedidos Recentes do WhatsApp
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="text-white/40 border-b border-white/5">
                        <th className="pb-3 uppercase tracking-wider font-semibold">Cliente</th>
                        <th className="pb-3 uppercase tracking-wider font-semibold">Status</th>
                        <th className="pb-3 uppercase tracking-wider font-semibold text-right">Total</th>
                        <th className="pb-3 uppercase tracking-wider font-semibold text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.01]">
                          <td className="py-3">
                            <p className="font-semibold text-white">{order.customerName}</p>
                            <p className="text-[10px] text-white/40">{order.customerPhone}</p>
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-[3px] text-[9px] font-bold uppercase tracking-wider ${
                              order.status === 'Pendente' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                              order.status === 'Contatado' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                              'bg-green-500/10 text-green-500 border border-green-500/20'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 text-right font-bold text-gold">R$ {order.totalPrice.toFixed(2)}</td>
                          <td className="py-3 text-center">
                            <button
                              onClick={() => updateOrderStatus(order.id, order.status)}
                              className="text-[10px] border border-white/10 hover:border-gold hover:text-gold px-2 py-1 rounded tracking-wider uppercase font-semibold"
                            >
                              Mudar Status
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Messages Inbox */}
              <div className="lg:col-span-4 glassmorphism p-6 rounded-xl border border-white/5 space-y-4">
                <h3 className="font-display font-bold text-xs uppercase tracking-widest text-gold border-b border-white/5 pb-2">
                  Mensagens Não Lidas
                </h3>
                <div className="space-y-3">
                  {messages.filter(m => !m.isRead).slice(0, 3).map((msg) => (
                    <div key={msg.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-lg text-xs space-y-2">
                      <div className="flex justify-between items-start">
                        <p className="font-bold text-white truncate max-w-[120px]">{msg.name}</p>
                        <span className="text-[8px] text-white/40">{new Date(msg.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-white/60 line-clamp-2 leading-relaxed">{msg.message}</p>
                      <button
                        onClick={() => markMessageAsRead(msg.id, true)}
                        className="text-[9px] text-gold uppercase font-bold tracking-wider hover:text-white"
                      >
                        Marcar como lida
                      </button>
                    </div>
                  ))}
                  {messages.filter(m => !m.isRead).length === 0 && (
                    <p className="text-xs text-white/40 text-center py-6">Nenhuma nova mensagem.</p>
                  )}
                </div>
              </div>
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
                    isFeatured: false,
                    isBestSeller: false,
                    inStock: true
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

            {/* Product Modal */}
            {isProductModalOpen && (
              <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-[#0F0F0F] border border-gold/20 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                  
                  {/* Modal Header */}
                  <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#050505]">
                    <h3 className="font-display font-bold text-sm tracking-wider text-gold-light uppercase">
                      {editingProduct ? 'EDITAR PRODUTO' : 'ADICIONAR PRODUTO'}
                    </h3>
                    <button
                      onClick={() => setIsProductModalOpen(false)}
                      className="text-xs uppercase tracking-widest text-white/50 hover:text-white font-bold"
                    >
                      Fechar
                    </button>
                  </div>

                  {/* Modal Form */}
                  <form onSubmit={handleProductSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/50 mb-1 uppercase font-semibold">Nome do Produto *</label>
                        <input
                          type="text"
                          required
                          value={productForm.name}
                          onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Ex: Ignite V50 Strawberry Kiwi"
                          className="w-full bg-black border border-white/10 focus:border-gold rounded p-2.5 outline-none transition-colors text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-white/50 mb-1 uppercase font-semibold">Preço (R$) *</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={productForm.price}
                          onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="Ex: 130.00"
                          className="w-full bg-black border border-white/10 focus:border-gold rounded p-2.5 outline-none transition-colors text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/50 mb-1 uppercase font-semibold">Descrição Curta *</label>
                      <textarea
                        rows={3}
                        required
                        value={productForm.description}
                        onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Ex: Sabor refrescante e doce. Até 5000 puffs."
                        className="w-full bg-black border border-white/10 focus:border-gold rounded p-2.5 outline-none transition-colors text-white resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/50 mb-1 uppercase font-semibold">Categoria *</label>
                        <select
                          value={productForm.categoryId}
                          onChange={(e) => setProductForm(prev => ({ ...prev, categoryId: e.target.value }))}
                          className="w-full bg-black border border-white/10 focus:border-gold rounded p-2.5 outline-none transition-colors text-white"
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Image Upload Simulator / Base64 */}
                      <div>
                        <label className="block text-white/50 mb-1 uppercase font-semibold">Imagem do Produto</label>
                        <div className="space-y-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileChange}
                            className="w-full text-xs text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gold/10 file:text-gold file:cursor-pointer"
                          />
                          <p className="text-[9px] text-white/30 uppercase">Ou digite uma chave de placeholder (Ex: pods-ignite-v50):</p>
                          <input
                            type="text"
                            value={productForm.imageUrl}
                            onChange={(e) => setProductForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                            placeholder="Chave do ícone SVG de fallback"
                            className="w-full bg-black border border-white/10 focus:border-gold rounded p-2.5 outline-none transition-colors text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productForm.isFeatured}
                          onChange={(e) => setProductForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                          className="w-4 h-4 rounded border-white/10 text-gold focus:ring-0 accent-gold"
                        />
                        <span className="uppercase font-semibold text-white/70">Produto em Destaque</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productForm.isBestSeller}
                          onChange={(e) => setProductForm(prev => ({ ...prev, isBestSeller: e.target.checked }))}
                          className="w-4 h-4 rounded border-white/10 text-gold focus:ring-0 accent-gold"
                        />
                        <span className="uppercase font-semibold text-white/70">Mais Vendido</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productForm.inStock}
                          onChange={(e) => setProductForm(prev => ({ ...prev, inStock: e.target.checked }))}
                          className="w-4 h-4 rounded border-white/10 text-gold focus:ring-0 accent-gold"
                        />
                        <span className="uppercase font-semibold text-white/70">Produto em Estoque</span>
                      </label>
                    </div>

                    {/* Save Button */}
                    <div className="pt-4 border-t border-white/5">
                      <button
                        type="submit"
                        className="w-full py-3.5 bg-gold-gradient text-black font-display font-bold tracking-wider rounded-lg uppercase"
                      >
                        SALVAR PRODUTO
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Tab 3: Categories Manager */}
        {activeTab === 'categorias' && (
          <div className="space-y-8 animate-fade-in max-w-4xl">
            {/* Header */}
            <div>
              <h1 className="font-display font-bold text-2xl tracking-widest text-white">CATEGORIAS</h1>
              <p className="font-sans text-xs text-white/50">Crie e remova as divisões do catálogo.</p>
            </div>

            {/* Split layout: Form / List */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Form Create */}
              <div className="md:col-span-5 glassmorphism p-6 rounded-xl border border-white/5 space-y-4 text-xs">
                <h3 className="font-display font-bold text-xs uppercase tracking-widest text-gold border-b border-white/5 pb-2">
                  Nova Categoria
                </h3>
                <form onSubmit={handleCreateCategory} className="space-y-4">
                  <div>
                    <label className="block text-white/50 mb-1.5 uppercase font-semibold">Nome da Categoria</label>
                    <input
                      type="text"
                      required
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      placeholder="Ex: Lançamentos Especiais"
                      className="w-full bg-black border border-white/10 focus:border-gold rounded p-2.5 outline-none text-white font-sans text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-gold-gradient text-black font-display font-bold tracking-wider rounded uppercase"
                  >
                    Adicionar Categoria
                  </button>
                </form>
              </div>

              {/* List */}
              <div className="md:col-span-7 glassmorphism p-6 rounded-xl border border-white/5 space-y-4 text-xs">
                <h3 className="font-display font-bold text-xs uppercase tracking-widest text-gold border-b border-white/5 pb-2">
                  Categorias Cadastradas
                </h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between p-3.5 bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 rounded-lg"
                    >
                      <div>
                        <h4 className="font-bold text-white uppercase tracking-wider text-xs">{cat.name}</h4>
                        <p className="text-[10px] text-white/40 font-mono mt-0.5">slug: {cat.slug}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-gold/60 font-semibold uppercase">{cat._count?.products || 0} PRODS</span>
                        <button
                          onClick={() => deleteCategory(cat.id)}
                          className="p-1.5 hover:bg-white/5 rounded text-white/40 hover:text-red-400 transition-colors"
                          title="Excluir Categoria"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 4: Banners */}
        {activeTab === 'banners' && (
          <AdminBanners banners={banners} onRefresh={fetchData} />
        )}

        {/* Tab 5: Orders WhatsApp list */}
        {activeTab === 'pedidos' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
              <h1 className="font-display font-bold text-2xl tracking-widest text-white">PEDIDOS WHATSAPP</h1>
              <p className="font-sans text-xs text-white/50">Histórico de intenções de compra finalizadas direcionadas ao WhatsApp.</p>
            </div>

            {/* List */}
            <div className="space-y-4">
              {orders.map((ord) => {
                let items: any[] = [];
                try {
                  items = JSON.parse(ord.itemsJson);
                } catch(e) {}

                return (
                  <div
                    key={ord.id}
                    className="p-6 glassmorphism rounded-xl border border-white/5 space-y-4 hover:border-gold/15 transition-colors text-xs"
                  >
                    {/* Top Row header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-3">
                      <div className="flex items-baseline gap-3">
                        <h4 className="font-bold text-white text-sm uppercase tracking-wide">{ord.customerName}</h4>
                        <span className="text-[10px] text-white/40 font-mono">{ord.customerPhone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-white/40">{new Date(ord.createdAt).toLocaleString()}</span>
                        <button
                          onClick={() => updateOrderStatus(ord.id, ord.status)}
                          className={`px-2 py-0.5 rounded-[3px] text-[9px] font-bold uppercase tracking-wider ${
                            ord.status === 'Pendente' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                            ord.status === 'Contatado' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                            'bg-green-500/10 text-green-500 border border-green-500/20'
                          }`}
                        >
                          {ord.status} (Mudar)
                        </button>
                      </div>
                    </div>

                    {/* Middle: Items & Address */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      
                      {/* Products List */}
                      <div className="space-y-2">
                        <h5 className="font-bold uppercase tracking-widest text-[10px] text-gold">Produtos do Pedido</h5>
                        <div className="space-y-1 bg-black/40 p-3 rounded-lg border border-white/5">
                          {items.map((it: any, index: number) => (
                            <div key={index} className="flex justify-between py-1 text-white/70">
                              <span>{it.quantity}x {it.name}</span>
                              <span className="font-mono">R$ {(it.price * it.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping details */}
                      <div className="space-y-2">
                        <h5 className="font-bold uppercase tracking-widest text-[10px] text-gold">Detalhes da Entrega</h5>
                        <div className="space-y-1.5 text-white/70">
                          <p><span className="text-white/40 font-semibold uppercase text-[9px] tracking-wider block">Método:</span> {ord.deliveryMethod === 'motoboy' ? 'Motoboy' : 'Correios'}</p>
                          <p><span className="text-white/40 font-semibold uppercase text-[9px] tracking-wider block">Endereço:</span> {ord.address || 'Não informado'}</p>
                        </div>
                      </div>

                    </div>

                    {/* Footer: Order total */}
                    <div className="flex justify-between items-center pt-3 border-t border-white/5">
                      <span className="text-white/40 uppercase text-[10px] font-bold">Total do Pedido:</span>
                      <span className="text-base font-bold text-gold">R$ {ord.totalPrice.toFixed(2)}</span>
                    </div>

                  </div>
                );
              })}

              {orders.length === 0 && (
                <div className="text-center py-20 text-white/30">Nenhum pedido registrado ainda.</div>
              )}
            </div>
          </div>
        )}

        {/* Tab 5: Message Inbox */}
        {activeTab === 'mensagens' && (
          <div className="space-y-8 animate-fade-in max-w-5xl">
            {/* Header */}
            <div>
              <h1 className="font-display font-bold text-2xl tracking-widest text-white">CAIXA DE ENTRADA</h1>
              <p className="font-sans text-xs text-white/50">Mensagens enviadas via formulário de contato do site.</p>
            </div>

            {/* Messages list */}
            <div className="space-y-4 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-5 glassmorphism rounded-xl border transition-all ${
                    msg.isRead ? 'border-white/5 opacity-70' : 'border-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.05)]'
                  }`}
                >
                  <div className="flex justify-between items-start border-b border-white/5 pb-2.5 mb-3">
                    <div>
                      <h4 className="font-bold text-white text-sm uppercase tracking-wide">{msg.name}</h4>
                      <p className="text-[10px] text-white/40 mt-0.5">{msg.email} | {msg.phone || 'Sem Telefone'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] text-white/40">{new Date(msg.createdAt).toLocaleString()}</span>
                      <button
                        onClick={() => markMessageAsRead(msg.id, !msg.isRead)}
                        className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider border ${
                          msg.isRead ? 'border-white/10 hover:border-gold hover:text-gold text-white/60' : 'border-gold bg-gold/10 text-gold hover:bg-transparent'
                        }`}
                      >
                        {msg.isRead ? 'Não lida' : 'Lida'}
                      </button>
                      <button
                        onClick={() => deleteMessage(msg.id)}
                        className="p-1 hover:bg-white/5 rounded text-white/40 hover:text-red-400 transition-colors"
                        title="Remover mensagem"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gold mb-1.5 uppercase text-[9px] tracking-widest">Assunto: {msg.subject}</h5>
                    <p className="text-white/70 leading-relaxed font-sans">{msg.message}</p>
                  </div>
                </div>
              ))}

              {messages.length === 0 && (
                <div className="text-center py-20 text-white/30">Nenhuma mensagem na caixa de entrada.</div>
              )}
            </div>
          </div>
        )}

        {/* Tab 6: Site Settings Panel */}
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

    </div>
  );
}
