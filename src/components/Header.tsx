'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { useWhatsapp } from '@/context/WhatsappContext';
import { Menu, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { whatsappNumber, openWhatsApp } = useWhatsapp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [instagramUrl, setInstagramUrl] = useState('https://instagram.com/sabor.gold');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.instagramUrl) setInstagramUrl(data.instagramUrl);
      })
      .catch(console.error);
  }, []);

  const navLinks = [
    { name: 'Início', href: '/' },
    { name: 'Produtos', href: '/#produtos' },
    { name: 'Pods', href: '/?cat=pods#produtos' },
    { name: 'Vape', href: '/?cat=vape#produtos' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'glassmorphism py-2 shadow-[0_4px_40px_rgba(0,0,0,0.5)] border-b border-gold/10'
            : 'bg-gradient-to-b from-black/80 to-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <Logo size="md" />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-white/75 hover:text-gold transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 hover:bg-white/5 rounded-full text-white/70 hover:text-gold transition-all hidden sm:block"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <rect width="20" height="20" x="2" y="2" rx="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              </svg>
            </a>

            <button
              type="button"
              onClick={() => openWhatsApp()}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gold-gradient text-black font-display font-bold text-[9px] tracking-[0.15em] rounded-lg uppercase hover:opacity-90 transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              WhatsApp
            </button>

            <a
              href={`https://api.whatsapp.com/send?phone=${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden p-2.5 text-gold"
              aria-label="WhatsApp"
            >
              <Phone className="w-5 h-5" />
            </a>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-white/80"
              aria-label="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-[min(300px,85vw)] bg-[#0A0A0A] border-l border-gold/20 z-50 p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                <Logo size="sm" />
                <button type="button" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6 text-white/70" />
                </button>
              </div>
              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-display text-sm tracking-[0.2em] text-white hover:text-gold uppercase"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openWhatsApp();
                }}
                className="mt-auto w-full py-4 bg-gold-gradient text-black font-display font-bold text-xs tracking-widest rounded-lg uppercase"
              >
                Falar no WhatsApp
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
