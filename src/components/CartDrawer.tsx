'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import ProductImage from './ProductImage';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    checkout,
  } = useCart();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('motoboy');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Por favor, preencha seu nome e telefone.');
      return;
    }
    if (deliveryMethod === 'motoboy' && !address) {
      alert('Por favor, preencha seu endereço para entrega via motoboy.');
      return;
    }

    setIsSubmitting(true);
    await checkout({
      name,
      phone,
      deliveryMethod,
      address: deliveryMethod === 'motoboy' ? address : `Retirada / Envio por Correios: ${address || 'Não especificado'}`,
    });
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Cart Sidebar Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[450px] glassmorphism-gold z-50 flex flex-col shadow-2xl text-white overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-gold/15 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-gold" />
                <h2 className="font-display font-bold text-lg tracking-wider text-gold-light">
                  SEU CARRINHO
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 hover:bg-white/5 rounded-full text-white/70 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                  <ShoppingBag className="w-16 h-16 text-white/10" />
                  <p className="font-sans font-medium text-white/50">
                    Seu carrinho está vazio.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="font-display text-xs tracking-wider text-gold hover:text-gold-light transition-colors border border-gold/30 hover:border-gold px-4 py-2 rounded"
                  >
                    CONTINUAR COMPRANDO
                  </button>
                </div>
              ) : (
                <>
                  {/* Items List */}
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center gap-4 p-3 bg-white/5 rounded-lg border border-white/5"
                      >
                        <div className="w-16 h-16 shrink-0">
                          <ProductImage
                            imageUrl={item.product.imageUrl}
                            name={item.product.name}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-sans font-semibold text-sm truncate text-white">
                            {item.product.name}
                          </h4>
                          <p className="text-gold font-medium text-xs mt-0.5">
                            R$ {item.product.price.toFixed(2)}
                          </p>

                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity buttons */}
                            <div className="flex items-center border border-white/10 rounded overflow-hidden bg-black/40">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(item.product.id, item.quantity - 1)
                                }
                                className="p-1 hover:bg-white/5 text-white/60 hover:text-white transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-2 text-xs font-semibold select-none">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(item.product.id, item.quantity + 1)
                                }
                                className="p-1 hover:bg-white/5 text-white/60 hover:text-white transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Remove button */}
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="p-1 text-white/40 hover:text-red-400 transition-colors"
                              title="Remover produto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/10 my-4" />

                  {/* Checkout Form */}
                  <form onSubmit={handleSubmitOrder} className="space-y-4">
                    <h3 className="font-display font-semibold text-xs tracking-wider text-gold">
                      DADOS DE ENTREGA
                    </h3>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1 font-medium">
                        Seu Nome *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: João da Silva"
                        className="w-full bg-black/60 border border-white/15 focus:border-gold rounded p-2.5 text-sm outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1 font-medium">
                        Seu WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ex: (11) 99999-9999"
                        className="w-full bg-black/60 border border-white/15 focus:border-gold rounded p-2.5 text-sm outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1 font-medium">
                        Forma de Entrega
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setDeliveryMethod('motoboy')}
                          className={`p-2.5 rounded text-xs font-semibold border transition-all ${
                            deliveryMethod === 'motoboy'
                              ? 'border-gold bg-gold/10 text-gold'
                              : 'border-white/10 bg-black/20 text-white/60 hover:border-white/20'
                          }`}
                        >
                          MOTOBOY (Rápida)
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeliveryMethod('correios')}
                          className={`p-2.5 rounded text-xs font-semibold border transition-all ${
                            deliveryMethod === 'correios'
                              ? 'border-gold bg-gold/10 text-gold'
                              : 'border-white/10 bg-black/20 text-white/60 hover:border-white/20'
                          }`}
                        >
                          CORREIOS / OUTRO
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1 font-medium">
                        {deliveryMethod === 'motoboy'
                          ? 'Endereço Completo com CEP *'
                          : 'Endereço ou Informações de Envio'}
                      </label>
                      <textarea
                        rows={3}
                        required={deliveryMethod === 'motoboy'}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder={
                          deliveryMethod === 'motoboy'
                            ? 'Ex: Rua das Flores, 123 - Ap 42 - Jardins - São Paulo - CEP 01234-567'
                            : 'Ex: Enviar via Sedex para CEP 80000-000 ou especificar detalhes'
                        }
                        className="w-full bg-black/60 border border-white/15 focus:border-gold rounded p-2.5 text-sm outline-none transition-colors resize-none"
                      />
                    </div>

                    {/* Total & Checkout button */}
                    <div className="pt-4 border-t border-white/10 space-y-4">
                      <div className="flex items-center justify-between font-display">
                        <span className="text-white/60 tracking-wider text-sm">TOTAL:</span>
                        <span className="text-xl font-bold text-gold">
                          R$ {cartTotal.toFixed(2)}
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gold-gradient hover:opacity-90 active:scale-[0.98] text-black font-display font-bold text-xs tracking-widest py-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(212,175,55,0.25)] uppercase disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          'PROCESSANDO...'
                        ) : (
                          <>
                            PEDIR NO WHATSAPP <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
