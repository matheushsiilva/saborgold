'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';

export default function Hero() {
  const { whatsappNumber } = useCart();
  const [settings, setSettings] = useState({
    heroTitle: 'MAIS QUE SABOR, UMA EXPERIÊNCIA.',
    heroSubtitle: 'Descubra a seleção mais refinada de pods premium, essências exclusivas e acessórios de luxo criados para quem busca o extraordinário.',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setSettings({
            heroTitle: data.heroTitle || settings.heroTitle,
            heroSubtitle: data.heroSubtitle || settings.heroSubtitle,
          });
        }
      })
      .catch((e) => console.error('Error loading settings for hero:', e));
  }, []);

  // Generate vapor particles for background
  const vaporParticles = Array.from({ length: 8 });

  return (
    <section className="relative min-h-[90vh] md:min-h-screen bg-dark-bg flex items-center justify-center overflow-hidden pt-20">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(18,18,18,1)_30%,rgba(5,5,5,1)_100%)]" />

      {/* Floating Smoke Vapor Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {vaporParticles.map((_, i) => (
          <div
            key={i}
            className="vapor-particle absolute bg-gradient-to-t from-gold/5 to-transparent rounded-full filter blur-[20px]"
            style={{
              left: `${15 + Math.random() * 70}%`,
              bottom: '10%',
              width: `${100 + Math.random() * 200}px`,
              height: `${100 + Math.random() * 200}px`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Elegant SVG Monogram watermark in the center background */}
      <div className="absolute opacity-[0.02] transform -translate-y-10 scale-150 pointer-events-none z-0">
        <svg width="400" height="400" viewBox="0 0 100 100" fill="none">
          <path
            d="M35 28L42 35L50 25L58 35L65 28L61 40H39L35 28Z"
            fill="#D4AF37"
          />
          <path
            d="M20 38C20 38 20 65 50 82C80 65 80 38 80 38C80 38 50 35 50 35C50 35 20 38 20 38Z"
            stroke="#D4AF37"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* VIP Welcome Tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 px-4 py-1 border border-gold/30 rounded-full bg-gold/5 flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.05)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold text-gold-light">
            Experiência Exclusiva Lifestyle
          </span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-4xl sm:text-5xl md:text-7xl font-bold tracking-[0.1em] text-white leading-tight"
        >
          {settings.heroTitle.split(', ').map((word, idx) => (
            <span key={idx} className={idx === 1 ? 'block text-gold-gradient mt-2' : ''}>
              {word}{idx === 0 ? ',' : ''}
            </span>
          ))}
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 text-sm sm:text-base md:text-lg text-white/60 font-sans font-light max-w-3xl leading-relaxed tracking-wide"
        >
          {settings.heroSubtitle}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          {/* Main CTA */}
          <Link
            href="/catalogo"
            className="group px-8 py-4 bg-gold-gradient hover:opacity-90 active:scale-[0.98] text-black font-display font-bold text-xs tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_4px_25px_rgba(212,175,55,0.3)] uppercase"
          >
            VER CATÁLOGO
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Secondary CTA */}
          <a
            href={`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=Ol%C3%A1%21+Estou+no+site+da+Sabor+Gold+e+gostaria+de+fazer+um+pedido.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 border border-gold/40 hover:border-gold hover:bg-gold/5 active:scale-[0.98] text-gold font-display font-bold text-xs tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all uppercase"
          >
            PEDIR NO WHATSAPP
            <MessageSquare className="w-4.5 h-4.5" />
          </a>
        </motion.div>
      </div>

      {/* Bottom glowing line divider */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </section>
  );
}
