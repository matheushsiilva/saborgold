'use client';

import React, { useState } from 'react';
import { Send, Check, AlertCircle } from 'lucide-react';

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="glassmorphism-gold rounded-xl border border-white/5 p-6 sm:p-8">
      <h3 className="font-display font-bold text-sm uppercase tracking-widest text-gold mb-1">
        Envie sua Mensagem
      </h3>
      <p className="font-sans text-xs text-white/50 mb-6">
        Atendimento VIP — responderemos o mais breve possível.
      </p>

      {status === 'success' && (
        <div className="mb-4 p-4 rounded-lg bg-green-950/20 border border-green-500/20 text-green-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          Mensagem enviada com sucesso! Em breve entraremos em contato.
        </div>
      )}

      {status === 'error' && (
        <div className="mb-4 p-4 rounded-lg bg-red-950/20 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Erro ao enviar. Tente novamente ou contate via WhatsApp.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/50 mb-1 uppercase font-semibold tracking-wider">Nome *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full bg-black border border-white/10 focus:border-gold rounded-lg p-3 outline-none text-white text-sm"
              placeholder="Seu nome"
            />
          </div>
          <div>
            <label className="block text-white/50 mb-1 uppercase font-semibold tracking-wider">E-mail *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="w-full bg-black border border-white/10 focus:border-gold rounded-lg p-3 outline-none text-white text-sm"
              placeholder="seu@email.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/50 mb-1 uppercase font-semibold tracking-wider">WhatsApp</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              className="w-full bg-black border border-white/10 focus:border-gold rounded-lg p-3 outline-none text-white text-sm"
              placeholder="(11) 99999-9999"
            />
          </div>
          <div>
            <label className="block text-white/50 mb-1 uppercase font-semibold tracking-wider">Assunto</label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
              className="w-full bg-black border border-white/10 focus:border-gold rounded-lg p-3 outline-none text-white text-sm"
              placeholder="Dúvida sobre produto"
            />
          </div>
        </div>

        <div>
          <label className="block text-white/50 mb-1 uppercase font-semibold tracking-wider">Mensagem *</label>
          <textarea
            rows={4}
            required
            value={form.message}
            onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
            className="w-full bg-black border border-white/10 focus:border-gold rounded-lg p-3 outline-none text-white text-sm resize-none"
            placeholder="Como podemos ajudar?"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-3.5 bg-gold-gradient text-black font-display font-bold text-xs tracking-widest rounded-lg flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all uppercase"
        >
          {status === 'loading' ? 'Enviando...' : 'Enviar Mensagem'}
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
