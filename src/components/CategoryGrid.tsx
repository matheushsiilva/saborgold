'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CategoryGrid() {
  const categories = [
    {
      name: 'Pods',
      slug: 'pods',
      desc: 'Descartáveis premium. Sabores intensos e máxima praticidade.',
    },
    {
      name: 'Vape',
      slug: 'vape',
      desc: 'Vapes, essências e equipamentos selecionados para exigência total.',
    },
  ];

  return (
    <section className="py-20 bg-[#080808] border-y border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                href={`/?cat=${cat.slug}#produtos`}
                className="group block p-8 glassmorphism-gold rounded-2xl border border-white/5 hover:border-gold/35 transition-all duration-500 text-center"
              >
                <h3 className="font-display text-2xl font-bold tracking-[0.2em] text-gold uppercase group-hover:text-white transition-colors">
                  {cat.name}
                </h3>
                <p className="mt-3 font-sans text-xs text-white/50 leading-relaxed">{cat.desc}</p>
                <span className="inline-block mt-6 font-display text-[9px] tracking-[0.25em] text-gold/80 uppercase group-hover:text-gold">
                  Ver produtos →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
