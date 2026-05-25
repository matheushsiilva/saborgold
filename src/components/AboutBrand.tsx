'use client';

import React, { useEffect, useState } from 'react';
import Logo from './Logo';
import { motion } from 'framer-motion';

export default function AboutBrand() {
  const [aboutText, setAboutText] = useState(
    'Nascida do desejo de elevar o lifestyle vape ao patamar do puro luxo, a Sabor Gold combina sofisticação estética, curadoria implacável e o compromisso de entregar sabores extraordinários. Cada detalhe, desde nossas embalagens até nossa seleção de marcas importadas, reflete o bom gosto e a exclusividade que definem nossos clientes.'
  );

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.aboutText) {
          setAboutText(data.aboutText);
        }
      })
      .catch((e) => console.error('Error fetching settings for about brand:', e));
  }, []);

  return (
    <section className="py-24 bg-[#080808] relative z-10 border-t border-white/5 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute left-1/4 top-1/2 w-[350px] h-[350px] bg-gold/5 rounded-full filter blur-[100px] pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* SVG Mockup / Vector Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 h-[320px] sm:h-[400px] glassmorphism-gold rounded-2xl flex items-center justify-center p-8 relative group overflow-hidden shadow-2xl"
          >
            {/* Box package mockup vector */}
            <div className="relative w-48 h-64 flex flex-col justify-between p-6 bg-black rounded-lg border border-gold/45 shadow-[0_10px_35px_rgba(212,175,55,0.15)] group-hover:scale-105 transition-transform duration-500 z-10">
              <div className="flex justify-between items-start">
                <Logo variant="icon" size="sm" color="gold" />
                <span className="font-sans text-[7px] tracking-[0.2em] text-gold-light/60 uppercase">Edition 2026</span>
              </div>
              
              {/* Product render skeleton */}
              <div className="my-6 flex flex-col items-center">
                <div className="w-1.5 h-16 bg-gradient-to-b from-gold/70 via-gold/40 to-transparent rounded-full mb-3" />
                <span className="font-display text-[9px] tracking-[0.25em] text-gold">SABOR GOLD</span>
                <span className="font-sans text-[6px] tracking-[0.3em] text-white/40 uppercase mt-0.5">Vape & Lifestyle</span>
              </div>

              <div className="border-t border-gold/25 pt-2 flex justify-between items-center">
                <span className="font-sans text-[5px] text-white/50 tracking-wider">NET WT 20g</span>
                <span className="font-sans text-[6px] text-gold font-bold tracking-widest">PREMIUM CO.</span>
              </div>
            </div>

            {/* Glowing lines background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06)_0%,transparent_70%)]" />
            <div className="absolute top-10 right-10 w-24 h-24 border border-gold/10 rounded-full animate-pulse pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-36 h-36 border border-gold/5 rounded-full pointer-events-none" />
          </motion.div>

          {/* Text and story */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="space-y-3">
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold text-gold">
                Legado & Filosofia
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[0.1em] text-white uppercase leading-tight">
                A Arte da Vaporização <br />
                <span className="text-gold-gradient">Elevada ao Extremo</span>
              </h2>
              <div className="w-16 h-[1.5px] bg-gold mt-4" />
            </div>

            <p className="font-sans text-sm sm:text-base text-white/60 font-light leading-relaxed tracking-wide">
              {aboutText}
            </p>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
              <div>
                <h4 className="font-display font-bold text-lg text-gold leading-none">100%</h4>
                <p className="font-sans text-xs text-white/50 mt-1 uppercase tracking-wider">Curadoria Original</p>
              </div>
              <div>
                <h4 className="font-display font-bold text-lg text-gold leading-none">VIP</h4>
                <p className="font-sans text-xs text-white/50 mt-1 uppercase tracking-wider">Suporte Exclusivo</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
