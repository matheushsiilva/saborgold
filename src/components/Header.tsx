'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Menu, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { cartCount, setIsCartOpen, whatsappNumber } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll detection for glassmorphism background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '/' },
    { name: 'Catálogo', href: '/catalogo' },
    { name: 'Pods', href: '/catalogo?categoria=pods-descartaveis' },
    { name: 'Essências', href: '/catalogo?categoria=essencias' },
    { name: 'Acessórios', href: '/catalogo?categoria=acessorios' },
    { name: 'Contato', href: '#contato' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glassmorphism py-3 shadow-[0_4px_30px_rgba(0,0,0,0.4)] border-b border-white/5'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <Logo variant="horizontal" size="md" color="gold" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`font-sans text-xs uppercase tracking-widest font-semibold transition-colors hover:text-gold ${
                  pathname === link.href ? 'text-gold' : 'text-white/80'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Icons/Actions */}
          <div className="flex items-center gap-3">
            {/* Instagram */}
            <a
              href="https://instagram.com/sabor.gold"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-white/5 rounded-full text-white/80 hover:text-gold transition-all"
              title="Instagram"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>

            {/* WhatsApp Contact */}
            <a
              href={`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=Ol%C3%A1%21+Gostaria+de+saber+mais+sobre+os+produtos.`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-white/5 rounded-full text-white/80 hover:text-gold transition-all"
              title="WhatsApp"
            >
              <Phone className="w-4.5 h-4.5" />
            </a>

            {/* Shopping Bag Cart Toggle */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 hover:bg-white/5 rounded-full text-white/80 hover:text-gold transition-all relative"
              title="Carrinho"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gold-gradient text-black font-sans font-bold text-[9px] w-4.5 h-4.5 flex items-center justify-center rounded-full border border-black shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-white/5 rounded-full text-white/80 hover:text-white transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sliding Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />

            {/* Mobile Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-dark-bg/95 backdrop-blur-xl border-r border-white/5 z-50 p-6 flex flex-col justify-between md:hidden text-white"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-white/5">
                  <Logo variant="icon" size="sm" color="gold" />
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 hover:bg-white/5 rounded-full text-white/70 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex flex-col space-y-5 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="font-sans text-sm uppercase tracking-widest font-semibold hover:text-gold transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Social and Info bottom */}
              <div className="space-y-4 pb-4">
                <p className="font-sans text-[10px] tracking-widest text-white/40 uppercase">
                  Sabor Gold Co.
                </p>
                <div className="flex gap-4">
                  <a
                    href="https://instagram.com/sabor.gold"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-gold transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                  <a
                    href={`https://api.whatsapp.com/send?phone=${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-gold transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
