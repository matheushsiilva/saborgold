'use client';

import React from 'react';

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
  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-black/85 p-4 sm:p-6 md:p-8"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full ${maxWidth} my-auto bg-[#0F0F0F] border border-gold/25 rounded-xl shadow-2xl flex flex-col max-h-none`}
      >
        <div className="sticky top-0 z-10 p-5 border-b border-white/10 flex justify-between items-center bg-[#0A0A0A] rounded-t-xl">
          <h3 className="font-display font-bold text-sm tracking-wider text-gold uppercase">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-xs uppercase tracking-widest text-white/50 hover:text-white font-bold px-2 py-1"
          >
            Fechar
          </button>
        </div>
        <div className="p-6 overflow-visible">{children}</div>
      </div>
    </div>
  );
}
