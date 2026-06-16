'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { useWhatsapp } from '@/context/WhatsappContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
}

interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
}

export default function HeroBanner() {
  const { openWhatsApp } = useWhatsapp();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    heroTitle: 'MAIS QUE SABOR, UMA EXPERIÊNCIA.',
    heroSubtitle:
      'Descubra a seleção mais refinada de pods premium, essências exclusivas e acessórios de luxo criados para quem busca o extraordinário.',
  });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch('/api/banners?active=true').then((r) => r.json()),
      fetch('/api/settings').then((r) => r.json()),
    ])
      .then(([bannerData, settingsData]) => {
        if (Array.isArray(bannerData) && bannerData.length > 0) {
          setBanners(bannerData);
        }
        if (settingsData) {
          setSettings({
            heroTitle: settingsData.heroTitle || settings.heroTitle,
            heroSubtitle: settingsData.heroSubtitle || settings.heroSubtitle,
          });
        }
      })
      .catch((e) => console.error('Error loading hero data:', e));
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const activeBanner = banners[current];
  const displayTitle = activeBanner?.title || settings.heroTitle;
  const displaySubtitle = activeBanner?.subtitle || settings.heroSubtitle;
  const vaporParticles = Array.from({ length: 8 });

  return (
    <section className="relative min-h-[90vh] md:min-h-screen bg-dark-bg flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(18,18,18,1)_30%,rgba(5,5,5,1)_100%)]" />

      <AnimatePresence mode="wait">
        {activeBanner?.imageUrl && !activeBanner.imageUrl.startsWith('gradient:') && (
          <motion.div
            key={activeBanner.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${activeBanner.imageUrl})` }}
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {vaporParticles.map((_, i) => (
          <div
            key={i}
            className="vapor-particle absolute bg-gradient-to-t from-gold/5 to-transparent rounded-full filter blur-[20px]"
            style={{
              left: `${15 + (i * 9) % 70}%`,
              bottom: '10%',
              width: `${120 + (i * 15) % 100}px`,
              height: `${120 + (i * 15) % 100}px`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${5 + (i % 4)}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
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

        <AnimatePresence mode="wait">
          <motion.h1
            key={displayTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl sm:text-5xl md:text-7xl font-bold tracking-[0.1em] text-white leading-tight"
          >
            {displayTitle.split(', ').map((word, idx) => (
              <span key={idx} className={idx === 1 ? 'block text-gold-gradient mt-2' : ''}>
                {word}
                {idx === 0 && displayTitle.includes(', ') ? ',' : ''}
              </span>
            ))}
          </motion.h1>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.p
            key={displaySubtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6 text-sm sm:text-base md:text-lg text-white/60 font-sans font-light max-w-3xl leading-relaxed tracking-wide"
          >
            {displaySubtitle}
          </motion.p>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link
            href={activeBanner?.linkUrl || '/#produtos'}
            className="group px-8 py-4 bg-gold-gradient hover:opacity-90 active:scale-[0.98] text-black font-display font-bold text-xs tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_4px_25px_rgba(212,175,55,0.3)] uppercase"
          >
            VER PRODUTOS
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button
            type="button"
            onClick={() => openWhatsApp()}
            className="px-8 py-4 border border-gold/40 hover:border-gold hover:bg-gold/5 active:scale-[0.98] text-gold font-display font-bold text-xs tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all uppercase"
          >
            PEDIR NO WHATSAPP
            <MessageSquare className="w-4.5 h-4.5" />
          </button>
        </motion.div>

        {banners.length > 1 && (
          <div className="mt-12 flex items-center gap-4">
            <button
              type="button"
              onClick={() => setCurrent((p) => (p - 1 + banners.length) % banners.length)}
              className="p-2 rounded-full border border-white/10 hover:border-gold/40 text-white/60 hover:text-gold transition-colors"
              aria-label="Banner anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {banners.map((b, i) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setCurrent(i)}
                  className={`h-1 rounded-full transition-all ${
                    i === current ? 'w-8 bg-gold' : 'w-3 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Ir para banner ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setCurrent((p) => (p + 1) % banners.length)}
              className="p-2 rounded-full border border-white/10 hover:border-gold/40 text-white/60 hover:text-gold transition-colors"
              aria-label="Próximo banner"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </section>
  );
}
