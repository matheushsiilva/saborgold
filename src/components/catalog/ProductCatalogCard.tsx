'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Cloud, Sparkles } from 'lucide-react';
import ProductImage from '@/components/ProductImage';
import { useWhatsapp } from '@/context/WhatsappContext';

export interface CatalogProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  inStock: boolean;
  badge?: string | null;
  puffs?: number | null;
  brand?: { name: string; slug: string } | null;
  flavors?: {
    id: string;
    name: string;
    description: string | null;
    inStock: boolean;
  }[];
}

export default function ProductCatalogCard({
  product,
  index = 0,
}: {
  product: CatalogProduct;
  index?: number;
}) {
  const { openProductOrder } = useWhatsapp();
  const [selectedFlavorId, setSelectedFlavorId] = useState('');
  const flavors = product.flavors || [];
  const hasFlavors = flavors.length > 0;
  const selectedFlavor = flavors.find((f) => f.id === selectedFlavorId);
  const canOrder = product.inStock && (!hasFlavors || (selectedFlavor && selectedFlavor.inStock));

  const handleOrder = () => {
    if (!canOrder) return;
    openProductOrder({
      productName: product.name,
      price: product.price,
      flavorName: selectedFlavor?.name,
      flavorDescription: selectedFlavor?.description || undefined,
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group flex flex-col rounded-xl sm:rounded-2xl overflow-hidden border border-[#E5E5E5] bg-white shadow-sm hover:border-gold hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)] transition-all duration-500"
    >
      <div className="relative aspect-square overflow-hidden bg-[#FAFAFA] p-2 sm:p-4 flex items-center justify-center">
        <ProductImage
          imageUrl={product.imageUrl}
          name={product.name}
          className="group-hover:scale-105 transition-transform duration-700 mix-blend-multiply"
        />

        {product.badge && (
          <span
            className={`absolute top-1.5 left-1.5 sm:top-3 sm:left-3 px-1.5 py-0.5 text-[7px] sm:text-[8px] font-bold uppercase tracking-widest rounded ${
              product.badge === 'LANÇAMENTO'
                ? 'bg-gold-gradient text-black'
                : 'bg-red-600/90 text-white border border-red-400/30'
            }`}
          >
            {product.badge}
          </span>
        )}
        {product.brand && (
          <span className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 px-1.5 py-0.5 bg-black/70 border border-gold/20 text-[7px] sm:text-[8px] text-gold font-bold uppercase tracking-wider rounded max-w-[50%] truncate">
            {product.brand.name}
          </span>
        )}
      </div>

      <div className="p-2.5 sm:p-5 flex flex-col flex-1 gap-2 sm:gap-4">
        <div>
          <h3 className="font-display text-[11px] sm:text-base font-bold tracking-wide text-[#111] group-hover:text-gold-dark transition-colors line-clamp-2 leading-tight">
            {product.name}
          </h3>
          {product.puffs != null && product.puffs > 0 && (
            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-black/60 text-[9px] sm:text-[10px] text-white/90 font-medium">
              <Cloud className="w-3 h-3 text-sky-300 shrink-0" />
              {product.puffs.toLocaleString('pt-BR')} puffs
            </span>
          )}
          {product.description && (
            <p className="font-sans text-[10px] sm:text-xs text-[#666] line-clamp-1 sm:line-clamp-2 mt-0.5 leading-snug hidden sm:block">
              {product.description}
            </p>
          )}
        </div>

        <p className="font-display text-base sm:text-2xl font-bold text-gold-dark">
          R$ {product.price.toFixed(2)}
        </p>

        {hasFlavors && (
          <div className="relative">
            <div className="relative">
              <select
                value={selectedFlavorId}
                onChange={(e) => setSelectedFlavorId(e.target.value)}
                aria-label="Escolha o sabor"
                className="w-full appearance-none bg-[#FAFAFA] border border-[#E5E5E5] hover:border-gold/50 focus:border-gold rounded-lg py-2 pl-2 pr-7 text-[11px] sm:text-xs text-[#111] outline-none transition-colors"
              >
                <option value="">Sabor...</option>
                {flavors.map((f) => (
                  <option key={f.id} value={f.id} disabled={!f.inStock}>
                    {f.name}
                    {!f.inStock ? ' (Esgotado)' : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gold-dark pointer-events-none" />
            </div>
          </div>
        )}

        <button
          type="button"
          disabled={!canOrder}
          onClick={handleOrder}
          className={`w-full mt-auto py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl font-display font-bold text-[9px] sm:text-xs tracking-[0.12em] sm:tracking-[0.18em] uppercase flex items-center justify-center gap-1 sm:gap-2 transition-all touch-manipulation ${
            canOrder
              ? 'bg-gold-gradient text-black shadow-[0_4px_24px_rgba(212,175,55,0.25)] hover:opacity-95 active:scale-[0.98]'
              : 'bg-[#F5F5F5] text-[#999] border border-[#E5E5E5] cursor-not-allowed'
          }`}
        >
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
          {!product.inStock
            ? 'Esgotado'
            : hasFlavors && !selectedFlavorId
              ? 'Sabor'
              : 'WhatsApp'}
        </button>
      </div>
    </motion.article>
  );
}
