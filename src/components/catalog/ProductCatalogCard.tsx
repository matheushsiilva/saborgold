'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
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
      className="group flex flex-col rounded-2xl overflow-hidden border border-[#E5E5E5] bg-white shadow-sm hover:border-gold hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)] transition-all duration-500"
    >
      <div className="relative aspect-square overflow-hidden bg-[#FAFAFA]">
        <ProductImage
          imageUrl={product.imageUrl}
          name={product.name}
          className="group-hover:scale-105 transition-transform duration-700 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.12),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity" />

        {product.badge && (
          <span
            className={`absolute top-3 left-3 px-2.5 py-1 text-[8px] font-bold uppercase tracking-widest rounded ${
              product.badge === 'LANÇAMENTO'
                ? 'bg-gold-gradient text-black'
                : 'bg-red-600/90 text-white border border-red-400/30'
            }`}
          >
            {product.badge}
          </span>
        )}
        {product.brand && (
          <span className="absolute top-3 right-3 px-2 py-0.5 bg-black/70 border border-gold/20 text-[8px] text-gold font-bold uppercase tracking-wider rounded">
            {product.brand.name}
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1 gap-4">
        <div>
          <h3 className="font-display text-base font-bold tracking-wide text-[#111] group-hover:text-gold-dark transition-colors">
            {product.name}
          </h3>
          <p className="font-sans text-[11px] text-[#666] mt-1 line-clamp-2">{product.description}</p>
        </div>

        <p className="font-display text-2xl font-bold text-gold-dark">R$ {product.price.toFixed(2)}</p>

        {hasFlavors && (
          <div className="relative">
            <label className="text-[9px] uppercase tracking-widest text-[#888] font-semibold mb-1.5 block">
              Escolha o sabor
            </label>
            <div className="relative">
              <select
                value={selectedFlavorId}
                onChange={(e) => setSelectedFlavorId(e.target.value)}
                className="w-full appearance-none bg-[#FAFAFA] border border-[#E5E5E5] hover:border-gold/50 focus:border-gold rounded-lg py-3 pl-3 pr-10 text-xs text-[#111] outline-none transition-colors"
              >
                <option value="">Selecione um sabor...</option>
                {flavors.map((f) => (
                  <option key={f.id} value={f.id} disabled={!f.inStock}>
                    {f.name}
                    {!f.inStock ? ' (Esgotado)' : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-dark pointer-events-none" />
            </div>
            {selectedFlavor?.description && (
              <p className="mt-2 text-[10px] text-[#666] leading-relaxed italic border-l-2 border-gold/50 pl-2">
                {selectedFlavor.description}
              </p>
            )}
          </div>
        )}

        <button
          type="button"
          disabled={!canOrder}
          onClick={handleOrder}
          className={`w-full py-3.5 rounded-xl font-display font-bold text-[10px] tracking-[0.18em] uppercase flex items-center justify-center gap-2 transition-all ${
            canOrder
              ? 'bg-gold-gradient text-black shadow-[0_4px_24px_rgba(212,175,55,0.35)] hover:opacity-95 active:scale-[0.98]'
              : 'bg-[#F5F5F5] text-[#999] border border-[#E5E5E5] cursor-not-allowed'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          {!product.inStock
            ? 'Indisponível'
            : hasFlavors && !selectedFlavorId
              ? 'Selecione um sabor para pedir'
              : 'Pedir no WhatsApp'}
        </button>
      </div>
    </motion.article>
  );
}
