'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import FloatingWhatsapp from '@/components/FloatingWhatsapp';
import ProductImage from '@/components/ProductImage';
import { useCart, Product, CartProvider } from '@/context/CartContext';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

// Category interface with count
interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  _count?: {
    products: number;
  };
}

function CatalogContent() {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  
  // States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<string>('recentes');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<number>(1000);

  // Sync initial URL parameters
  useEffect(() => {
    const categoryParam = searchParams.get('categoria');
    const searchParam = searchParams.get('busca');

    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  // Fetch products and categories
  useEffect(() => {
    setLoading(true);
    // Fetch products
    let url = '/api/products';
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'todos') {
      params.append('categoria', selectedCategory);
    }
    if (searchQuery) {
      params.append('busca', searchQuery);
    }
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    Promise.all([
      fetch(url).then((res) => res.json()),
      fetch('/api/categories').then((res) => res.json())
    ])
      .then(([productsData, categoriesData]) => {
        if (Array.isArray(productsData)) {
          setProducts(productsData);
        }
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        }
        setLoading(false);
      })
      .catch((e) => {
        console.error('Error fetching catalog data:', e);
        setLoading(false);
      });
  }, [selectedCategory, searchQuery]);

  // Local filtering (price) & sorting
  const processedProducts = products
    .filter((p) => p.price <= priceRange)
    .sort((a, b) => {
      if (sortBy === 'preco-crescente') {
        return a.price - b.price;
      }
      if (sortBy === 'preco-decrescente') {
        return b.price - a.price;
      }
      if (sortBy === 'nome-az') {
        return a.name.localeCompare(b.name);
      }
      // default: recentes (or by ID/date if applicable)
      return b.id.localeCompare(a.id);
    });

  const maxPriceInSet = products.length > 0 ? Math.max(...products.map(p => p.price)) : 1000;

  return (
    <div className="min-h-screen bg-dark-bg text-white flex flex-col justify-between">
      {/* Shared Layout Components */}
      <Header />
      <CartDrawer />
      <FloatingWhatsapp />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 w-full">
        
        {/* Banner Title */}
        <div className="text-center mb-12 space-y-4">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold text-gold">
            Explorar Coleção
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-[0.1em] text-white uppercase">
            Catálogo Sabor Gold
          </h1>
          <div className="w-16 h-[1.5px] bg-gold mx-auto" />
        </div>

        {/* Search Bar & Stats */}
        <div className="mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search form */}
          <div className="relative w-full md:max-w-md group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar pod, essência ou kit..."
              className="w-full bg-[#121212] border border-white/5 focus:border-gold/50 rounded-lg py-3 pl-11 pr-4 text-sm outline-none transition-colors"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4.5 h-4.5 text-white/40 group-focus-within:text-gold transition-colors" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-white/45 hover:text-white"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Sorter & Counter */}
          <div className="flex items-center justify-between w-full md:w-auto gap-6">
            <span className="font-sans text-xs text-white/50">
              Exibindo <span className="text-gold font-bold">{processedProducts.length}</span> produtos
            </span>

            {/* Sorter Selector */}
            <div className="flex items-center gap-2 bg-[#121212] border border-white/5 rounded-lg px-3 py-2.5">
              <ArrowUpDown className="w-4 h-4 text-gold" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-sans font-semibold outline-none border-none cursor-pointer focus:ring-0"
              >
                <option value="recentes" className="bg-[#121212]">Mais Recentes</option>
                <option value="preco-crescente" className="bg-[#121212]">Preço: Menor ao Maior</option>
                <option value="preco-decrescente" className="bg-[#121212]">Preço: Maior ao Menor</option>
                <option value="nome-az" className="bg-[#121212]">Nome: A a Z</option>
              </select>
            </div>

            {/* Mobile Filter toggle button */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden p-2.5 bg-[#121212] border border-white/5 hover:border-gold/30 rounded-lg flex items-center gap-1.5 text-xs font-semibold"
            >
              <Filter className="w-4.5 h-4.5 text-gold" />
              Filtros
            </button>
          </div>

        </div>

        {/* Layout Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-[260px] shrink-0 space-y-8 glassmorphism p-6 rounded-xl border border-white/5">
            {/* Category Filter */}
            <div className="space-y-4">
              <h3 className="font-display font-bold text-xs uppercase tracking-widest text-gold border-b border-white/5 pb-2">
                Categorias
              </h3>
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => setSelectedCategory('todos')}
                  className={`text-left font-sans text-xs py-2 px-3 rounded transition-all ${
                    selectedCategory === 'todos'
                      ? 'bg-gold/10 text-gold font-bold border-l-2 border-gold'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  Todas as Categorias
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`text-left font-sans text-xs py-2 px-3 rounded transition-all flex items-center justify-between ${
                      selectedCategory === cat.slug
                        ? 'bg-gold/10 text-gold font-bold border-l-2 border-gold'
                        : 'text-white/60 hover:text-white hover:bg-white/[0.02]'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {cat._count && (
                      <span className="text-[10px] opacity-40">({cat._count.products})</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-4">
              <h3 className="font-display font-bold text-xs uppercase tracking-widest text-gold border-b border-white/5 pb-2">
                Preço Máximo
              </h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max={maxPriceInSet > 0 ? maxPriceInSet : 1000}
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold"
                />
                <div className="flex items-center justify-between font-sans text-[11px] text-white/50">
                  <span>R$ 0,00</span>
                  <span className="text-gold font-bold text-xs">R$ {priceRange.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filters overlay (collapsible drawer-like) */}
          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/80 flex justify-end">
              <div className="w-[300px] h-full bg-[#0A0A0A] p-6 border-l border-gold/10 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-gold" />
                      <h3 className="font-display font-bold text-sm tracking-wider text-gold-light">FILTROS</h3>
                    </div>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="text-xs text-white/50 hover:text-white uppercase font-bold"
                    >
                      Fechar
                    </button>
                  </div>

                  {/* Mobile Categories list */}
                  <div className="space-y-3">
                    <h4 className="font-display font-bold text-xs uppercase tracking-widest text-white border-b border-white/5 pb-2">
                      Categorias
                    </h4>
                    <div className="flex flex-col space-y-1.5">
                      <button
                        onClick={() => {
                          setSelectedCategory('todos');
                          setShowMobileFilters(false);
                        }}
                        className={`text-left font-sans text-xs py-2 px-3 rounded ${
                          selectedCategory === 'todos' ? 'bg-gold/10 text-gold font-bold' : 'text-white/60'
                        }`}
                      >
                        Todas as Categorias
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(cat.slug);
                            setShowMobileFilters(false);
                          }}
                          className={`text-left font-sans text-xs py-2 px-3 rounded ${
                            selectedCategory === cat.slug ? 'bg-gold/10 text-gold font-bold' : 'text-white/60'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Price Slider */}
                  <div className="space-y-3">
                    <h4 className="font-display font-bold text-xs uppercase tracking-widest text-white border-b border-white/5 pb-2">
                      Preço Máximo
                    </h4>
                    <input
                      type="range"
                      min="0"
                      max={maxPriceInSet > 0 ? maxPriceInSet : 1000}
                      value={priceRange}
                      onChange={(e) => setPriceRange(parseFloat(e.target.value))}
                      className="w-full accent-gold bg-white/10 rounded h-1 appearance-none cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-xs text-white/50 mt-1">
                      <span>R$ 0,00</span>
                      <span className="text-gold font-bold">R$ {priceRange.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full py-3 bg-gold-gradient text-black font-display font-bold text-xs tracking-wider rounded uppercase mt-8"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          )}

          {/* Product Grid Content */}
          <div className="flex-1 w-full">
            {loading ? (
              <div className="py-32 flex justify-center items-center">
                {/* Gold Loading Spinner */}
                <div className="relative w-12 h-12">
                  <span className="absolute inset-0 rounded-full border-2 border-gold/20" />
                  <span className="absolute inset-0 rounded-full border-2 border-t-gold border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                </div>
              </div>
            ) : processedProducts.length === 0 ? (
              <div className="py-24 text-center glassmorphism rounded-xl border border-white/5 flex flex-col items-center justify-center space-y-4">
                <Search className="w-16 h-16 text-white/10" />
                <h3 className="font-display font-bold text-sm tracking-wider text-white uppercase">Nenhum produto encontrado</h3>
                <p className="font-sans font-light text-xs text-white/50 max-w-sm">Tente ajustar seus termos de busca ou mudar a categoria selecionada.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('todos');
                    setPriceRange(1000);
                  }}
                  className="font-display text-[9px] tracking-widest text-gold hover:text-white border border-gold/30 hover:border-white px-4 py-2 rounded uppercase transition-all"
                >
                  Redefinir Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {processedProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="group relative flex flex-col justify-between bg-[#121212]/50 hover:bg-[#121212] rounded-xl border border-white/5 hover:border-gold/20 transition-all duration-300 glow-gold-hover overflow-hidden"
                  >
                    {/* Image cover */}
                    <div className="relative aspect-square overflow-hidden bg-black/30">
                      <ProductImage
                        imageUrl={product.imageUrl}
                        name={product.name}
                        className="group-hover:scale-105 transition-transform duration-500"
                      />
                      {!product.inStock && (
                        <span className="absolute top-4 left-4 bg-red-600/90 text-white font-sans font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded shadow">
                          Esgotado
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <h3 className="font-sans font-bold text-sm text-white group-hover:text-gold transition-colors truncate">
                          {product.name}
                        </h3>
                        <p className="font-sans font-light text-xs text-white/50 line-clamp-2 h-8 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Price & Cart Add */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <span className="font-sans font-bold text-base text-gold">
                          R$ {product.price.toFixed(2)}
                        </span>
                        
                        <button
                          onClick={() => addToCart(product, 1)}
                          disabled={!product.inStock}
                          className="font-display text-[9px] font-bold tracking-widest text-white/80 group-hover:text-gold transition-colors flex items-center gap-1.5 uppercase disabled:opacity-30 disabled:text-white/40"
                        >
                          {product.inStock ? (
                            <>
                              ADICIONAR <ShoppingCart className="w-3.5 h-3.5" />
                            </>
                          ) : (
                            'INDISPONÍVEL'
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}

// Suspense wrapper to handle useSearchParams safely during Next.js build compilation
export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-dark-bg text-white flex flex-col justify-center items-center">
          <div className="relative w-12 h-12">
            <span className="absolute inset-0 rounded-full border-2 border-gold/20" />
            <span className="absolute inset-0 rounded-full border-2 border-t-gold border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          </div>
        </div>
      }
    >
      <CartProvider>
        <CatalogContent />
      </CartProvider>
    </Suspense>
  );
}
