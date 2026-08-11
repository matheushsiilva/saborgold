'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface AdminModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function AdminModal({
  title,
  onClose,
  children,
  maxWidth = 'max-w-2xl',
}: AdminModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/85 p-0 sm:p-4 md:p-8 safe-top safe-bottom"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidth} bg-[#0F0F0F] border border-gold/25 sm:rounded-xl shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[90dvh] overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 p-4 sm:p-5 border-b border-white/10 flex justify-between items-center bg-[#0A0A0A] sm:rounded-t-xl gap-3">
          <h3 className="font-display font-bold text-sm tracking-wider text-gold uppercase truncate">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 text-xs uppercase tracking-widest text-white/50 hover:text-white font-bold px-3 py-2 rounded-lg hover:bg-white/5 touch-manipulation"
          >
            Fechar
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
}
