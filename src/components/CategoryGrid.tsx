'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface CategoryCard {
  name: string;
  slug: string;
  desc: string;
  icon: React.ReactNode;
}

export default function CategoryGrid() {
  const categories: CategoryCard[] = [
    {
      name: 'Pods Descartáveis',
      slug: 'pods-descartaveis',
      desc: 'Praticidade, sabores marcantes e alta contagem de puffs.',
      icon: (
        <svg viewBox="0 0 100 100" fill="none" className="w-16 h-16 text-gold group-hover:scale-110 transition-transform duration-300">
          <rect x="44" y="35" width="12" height="40" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M46 25C46 25 46 35 46 35H54C54 35 54 25 52 25Z" fill="currentColor" />
          <rect x="44" y="42" width="12" height="2" fill="currentColor" />
          <circle cx="50" cy="70" r="1" fill="currentColor" />
        </svg>
      )
    },
    {
      name: 'Essências',
      slug: 'essencias',
      desc: 'As essências de narguilé e vape mais cobiçadas do mundo.',
      icon: (
        <svg viewBox="0 0 100 100" fill="none" className="w-16 h-16 text-gold group-hover:scale-110 transition-transform duration-300">
          <rect x="42" y="24" width="16" height="8" rx="1" fill="currentColor" />
          <path d="M34 38C34 34 38 32 42 32H58C62 32 66 34 66 38V72C66 76 62 80 58 80H42C38 80 34 76 34 72V38Z" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="40" y="44" width="20" height="15" rx="1" fill="currentColor" opacity="0.15" />
          <circle cx="50" cy="51" r="2.5" fill="currentColor" />
        </svg>
      )
    },
    {
      name: 'Acessórios',
      slug: 'acessorios',
      desc: 'Carregadores de ponta, ponteiras de luxo e baterias certificadas.',
      icon: (
        <svg viewBox="0 0 100 100" fill="none" className="w-16 h-16 text-gold group-hover:scale-110 transition-transform duration-300">
          <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M50 30L62 45H38L50 30Z" fill="currentColor" />
          <rect x="45" y="52" width="10" height="18" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      )
    },
    {
      name: 'Kits Completos',
      slug: 'kits',
      desc: 'Mod systems potentes e combos exclusivos prontos para uso.',
      icon: (
        <svg viewBox="0 0 100 100" fill="none" className="w-16 h-16 text-gold group-hover:scale-110 transition-transform duration-300">
          <rect x="34" y="38" width="32" height="42" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="40" y="44" width="20" height="14" rx="1" fill="currentColor" opacity="0.1" />
          <rect x="45" y="24" width="10" height="14" stroke="currentColor" strokeWidth="2" />
          <line x1="50" y1="16" x2="50" y2="24" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    },
    {
      name: 'Lançamentos',
      slug: 'lancamentos',
      desc: 'Novidades exclusivas e importações recém-chegadas.',
      icon: (
        <svg viewBox="0 0 100 100" fill="none" className="w-16 h-16 text-gold group-hover:scale-110 transition-transform duration-300">
          <path d="M50 15L61 38L86 41L67 58L72 83L50 70L28 83L33 58L14 41L39 38L50 15Z" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="50" cy="50" r="4" fill="currentColor" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-24 bg-dark-bg relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center mb-16 space-y-3">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold text-gold">
            Curadoria
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[0.1em] text-white uppercase">
            Categorias Premium
          </h2>
          <div className="w-16 h-[1.5px] bg-gold mx-auto mt-4" />
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link
                href={`/catalogo?categoria=${cat.slug}`}
                className="group block h-full p-6 glassmorphism hover:glassmorphism-gold rounded-xl border border-white/5 hover:border-gold/30 hover:scale-[1.02] transition-all duration-300 glow-gold-hover flex flex-col justify-between items-center text-center cursor-pointer"
              >
                {/* Icon Container */}
                <div className="mb-6 p-4 rounded-full bg-white/[0.02] border border-white/5 group-hover:border-gold/15 transition-all">
                  {cat.icon}
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-sm tracking-wider text-white group-hover:text-gold transition-colors uppercase">
                      {cat.name}
                    </h3>
                    <p className="mt-3 font-sans font-light text-xs text-white/50 leading-relaxed group-hover:text-white/70 transition-colors">
                      {cat.desc}
                    </p>
                  </div>

                  {/* Call to action inside card */}
                  <span className="mt-6 inline-flex items-center gap-1.5 font-display text-[9px] font-bold tracking-[0.2em] text-gold group-hover:text-white transition-colors uppercase">
                    Explorar
                    <span className="group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
