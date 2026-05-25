'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { useCart } from '@/context/CartContext';
import { Phone, Mail, MapPin } from 'lucide-react';

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
import ContactForm from './ContactForm';

export default function Footer() {
  const { whatsappNumber } = useCart();
  const [settings, setSettings] = useState({
    instagramUrl: 'https://instagram.com/sabor.gold',
    address: 'Av. Europa, 1200 - Jardins, São Paulo - SP',
    contactEmail: 'contato@saborgold.com',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setSettings({
            instagramUrl: data.instagramUrl || settings.instagramUrl,
            address: data.address || settings.address,
            contactEmail: data.contactEmail || settings.contactEmail,
          });
        }
      })
      .catch((e) => console.error('Error fetching footer settings:', e));
  }, []);

  return (
    <footer id="contato" className="bg-[#050505] text-white border-t border-white/5 relative z-10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/5">
          
          {/* Logo & About Column */}
          <div className="md:col-span-5 space-y-6">
            <Logo variant="horizontal" size="md" color="gold" />
            <p className="font-sans font-light text-xs text-white/50 leading-relaxed max-w-sm">
              Sabor Gold é uma marca de lifestyle premium dedicada à curadoria seleta de pods de luxo, essências raras e kits de alta performance. Experiência singular, qualidade inigualável.
            </p>
            <div className="flex gap-3">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white/[0.02] hover:bg-gold/10 border border-white/5 hover:border-gold/30 rounded-full text-white/70 hover:text-gold transition-all"
                title="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={`https://api.whatsapp.com/send?phone=${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white/[0.02] hover:bg-gold/10 border border-white/5 hover:border-gold/30 rounded-full text-white/70 hover:text-gold transition-all"
                title="WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-gold">
              Navegação
            </h4>
            <div className="flex flex-col space-y-2.5">
              <Link href="/catalogo" className="font-sans text-xs text-white/60 hover:text-white transition-colors">
                Catálogo Completo
              </Link>
              <Link href="/catalogo?categoria=pods-descartaveis" className="font-sans text-xs text-white/60 hover:text-white transition-colors">
                Pods Descartáveis
              </Link>
              <Link href="/catalogo?categoria=essencias" className="font-sans text-xs text-white/60 hover:text-white transition-colors">
                Essências de Narguilé
              </Link>
              <Link href="/catalogo?categoria=kits" className="font-sans text-xs text-white/60 hover:text-white transition-colors">
                Kits Completos
              </Link>
              <Link href="/catalogo?categoria=acessorios" className="font-sans text-xs text-white/60 hover:text-white transition-colors">
                Acessórios
              </Link>
            </div>
          </div>

          {/* Contact Details Column */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-gold">
              Contatos VIP
            </h4>
            <div className="space-y-3 font-sans text-xs text-white/60 font-light">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-white transition-colors">
                  {settings.contactEmail}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <a
                  href={`https://api.whatsapp.com/send?phone=${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  +{whatsappNumber} (WhatsApp)
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Contact Form Section */}
        <div className="py-16 border-t border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4 space-y-3">
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold text-gold">
                Fale Conosco
              </span>
              <h3 className="font-display text-2xl font-bold tracking-wider text-white uppercase">
                Atendimento VIP
              </h3>
              <p className="font-sans text-xs text-white/50 leading-relaxed">
                Dúvidas sobre produtos, pedidos em atacado ou parcerias? Envie sua mensagem e nossa equipe premium responderá em breve.
              </p>
            </div>
            <div className="lg:col-span-8">
              <ContactForm />
            </div>
          </div>
        </div>

        {/* Bottom copyright details */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-[10px] text-white/30 tracking-widest uppercase">
          <p>&copy; {new Date().getFullYear()} Sabor Gold Co. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <span>PROIBIDO PARA MENORES DE 18 ANOS</span>
            <span className="text-gold/60">CONTEÚDO LIFESTYLE ADULTO</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
