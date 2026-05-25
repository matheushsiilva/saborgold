'use client';

import React, { useEffect, useState } from 'react';
import { useCart, Product } from '@/context/CartContext';
import ProductImage from './ProductImage';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CarouselProducts() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Filter featured or best sellers
          const featured = data.filter((p: any) => p.isBestSeller || p.isFeatured);
          setProducts(featured.slice(0, 4)); // Show top 4 in home
        }
        setLoading(false);
      })
      .catch((e) => {
        console.error('Error fetching best sellers:', e);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        {/* Elegant Gold Loading Spinner */}
        <div className="relative w-12 h-12">
          <span className="absolute inset-0 rounded-full border-2 border-gold/20" />
          <span className="absolute inset-0 rounded-full border-2 border-t-gold border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-dark-bg to-[#080808] relative z-10">
      {/* Decorative side glow */}
      <div className="absolute right-0 top-1/3 w-[300px] h-[300px] bg-gold/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="space-y-3">
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold text-gold">
              Exclusividade
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[0.1em] text-white uppercase">
              Mais Vendidos
            </h2>
            <div className="w-16 h-[1.5px] bg-gold" />
          </div>
          <Link
            href="/catalogo"
            className="font-display text-xs tracking-widest text-gold hover:text-white transition-colors uppercase border-b border-gold/30 hover:border-white pb-1 w-fit"
          >
            Ver catálogo completo &rarr;
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="group relative flex flex-col justify-between glassmorphism rounded-xl border border-white/5 overflow-hidden transition-all duration-300 hover:border-gold/20 hover:scale-[1.02] glow-gold-hover"
            >
              {/* Product Image Cover */}
              <div className="relative aspect-square overflow-hidden bg-black/40">
                <ProductImage
                  imageUrl={product.imageUrl}
                  name={product.name}
                  className="group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Destaque Tag */}
                <span className="absolute top-4 left-4 bg-gold-gradient text-black font-sans font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded shadow">
                  Best Seller
                </span>

                {/* Overlays / Hover Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <Link
                    href={`/catalogo?busca=${encodeURIComponent(product.name)}`}
                    className="p-3 bg-white/5 hover:bg-gold/10 border border-white/10 hover:border-gold/30 rounded-full text-white hover:text-gold transition-all"
                    title="Visualizar produto"
                  >
                    <Eye className="w-4.5 h-4.5" />
                  </Link>
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="p-3 bg-gold-gradient text-black hover:scale-105 active:scale-95 rounded-full transition-all"
                    title="Adicionar ao carrinho"
                  >
                    <ShoppingCart className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-sans font-bold text-sm text-white group-hover:text-gold transition-colors truncate">
                    {product.name}
                  </h3>
                  <p className="font-sans font-light text-xs text-white/50 line-clamp-2 h-8 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <span className="font-sans font-bold text-base text-gold">
                    R$ {product.price.toFixed(2)}
                  </span>
                  
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="font-display text-[9px] font-bold tracking-widest text-white/80 group-hover:text-gold transition-colors flex items-center gap-1 uppercase"
                  >
                    ADICIONAR <ShoppingCart className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
