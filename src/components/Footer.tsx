'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { useWhatsapp } from '@/context/WhatsappContext';
import { Phone, MapPin, MessageCircle } from 'lucide-react';

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
  </svg>
);

export default function Footer() {
  const { openWhatsApp } = useWhatsapp();
  const [settings, setSettings] = useState({
    instagramUrl: 'https://instagram.com/sabor.gold',
    address: 'São Paulo - SP',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setSettings({
            instagramUrl: data.instagramUrl || settings.instagramUrl,
            address: data.address || settings.address,
          });
        }
      })
      .catch(console.error);
  }, []);

  return (
    <footer id="contato" className="bg-[#030303] border-t border-gold/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-8 pb-12">
          <Logo size="lg" />
          <p className="font-sans text-sm text-white/45 max-w-md font-light leading-relaxed">
            Sabor Gold — pods e vapes premium. Todo pedido e dúvida direto no WhatsApp.
          </p>

          <button
            type="button"
            onClick={() => openWhatsApp()}
            className="px-10 py-4 bg-gold-gradient text-black font-display font-bold text-xs tracking-[0.2em] rounded-xl uppercase flex items-center gap-2 shadow-[0_4px_30px_rgba(212,175,55,0.3)] hover:opacity-95 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            Chamar no WhatsApp
          </button>

          <div className="flex gap-4">
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full border border-white/10 hover:border-gold/40 text-white/60 hover:text-gold transition-all"
            >
              <InstagramIcon className="w-5 h-5" />
            </a>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/40">
            <MapPin className="w-4 h-4 text-gold" />
            <span>{settings.address}</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-[10px] uppercase tracking-widest text-white/30 border-t border-white/5 pt-8">
          <Link href="/#produtos" className="hover:text-gold transition-colors">Produtos</Link>
          <Link href="/?cat=pods#produtos" className="hover:text-gold transition-colors">Pods</Link>
          <Link href="/?cat=vape#produtos" className="hover:text-gold transition-colors">Vape</Link>
          <Link href="/admin" className="hover:text-gold/60 transition-colors">Admin</Link>
        </div>

        <p className="text-center mt-6 text-[10px] text-white/25 tracking-widest uppercase">
          © {new Date().getFullYear()} Sabor Gold — +18 anos
        </p>
      </div>
    </footer>
  );
}
