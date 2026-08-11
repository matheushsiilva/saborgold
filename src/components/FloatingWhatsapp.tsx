'use client';

import { MessageCircle } from 'lucide-react';
import { useWhatsapp } from '@/context/WhatsappContext';

export default function FloatingWhatsapp() {
  const { openWhatsApp } = useWhatsapp();

  return (
    <button
      type="button"
      onClick={() => openWhatsApp()}
      className="fixed z-40 group bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-[0_8px_30px_rgba(37,211,102,0.45)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center touch-manipulation
        bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))]
        right-[calc(1.25rem+env(safe-area-inset-right,0px))]
        w-14 h-14 sm:w-auto sm:h-auto sm:p-4 sm:gap-2"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle className="w-6 h-6 shrink-0" />
      <span className="hidden sm:block max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap text-xs font-bold tracking-wider uppercase">
        WhatsApp
      </span>
      <span className="absolute inset-0 rounded-full border-2 border-[#25D366] opacity-60 animate-ping -z-10 pointer-events-none" />
    </button>
  );
}
