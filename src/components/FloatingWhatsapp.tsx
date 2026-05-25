'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { MessageSquare } from 'lucide-react';

export default function FloatingWhatsapp() {
  const { whatsappNumber } = useCart();

  return (
    <a
      href={`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=Ol%C3%A1%21+Estou+navegando+no+site+e+gostaria+de+atendimento.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba5a] text-white p-4 rounded-full shadow-[0_8px_30px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-110 active:scale-95 group flex items-center gap-2 group"
      title="Falar no WhatsApp"
    >
      {/* Tooltip message */}
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-out whitespace-nowrap text-xs font-semibold tracking-wider font-sans uppercase">
        Fale Conosco
      </span>
      <MessageSquare className="w-6 h-6 animate-pulse" />
      
      {/* Pulsing ring */}
      <span className="absolute inset-0 rounded-full border-2 border-[#25D366] opacity-75 animate-ping -z-10" />
    </a>
  );
}
