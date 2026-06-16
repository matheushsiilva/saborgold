'use client';

import { MessageCircle } from 'lucide-react';
import { useWhatsapp } from '@/context/WhatsappContext';

export default function FloatingWhatsapp() {
  const { openWhatsApp } = useWhatsapp();

  return (
    <button
      type="button"
      onClick={() => openWhatsApp()}
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba5a] text-white p-4 rounded-full shadow-[0_8px_30px_rgba(37,211,102,0.45)] transition-all duration-300 hover:scale-110 active:scale-95 group flex items-center gap-2"
      aria-label="Falar no WhatsApp"
    >
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap text-xs font-bold tracking-wider uppercase">
        WhatsApp
      </span>
      <MessageCircle className="w-6 h-6" />
      <span className="absolute inset-0 rounded-full border-2 border-[#25D366] opacity-60 animate-ping -z-10" />
    </button>
  );
}
