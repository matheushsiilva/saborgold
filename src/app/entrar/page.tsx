'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Phone, Mail } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<'whatsapp' | 'email'>('whatsapp');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({
        name,
        email: mode === 'email' ? email : undefined,
        phone: mode === 'whatsapp' ? phone : undefined,
      });
      router.push('/catalogo');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao entrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white flex flex-col items-center justify-center px-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08),transparent_70%)]" />
      <Link
        href="/catalogo"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs text-white/50 hover:text-gold uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>

      <div className="relative z-10 w-full max-w-md glassmorphism-gold rounded-2xl border border-gold/15 p-8 space-y-6">
        <div className="flex flex-col items-center text-center">
          <Logo size="lg" />
          <h1 className="font-display text-xl font-bold tracking-[0.2em] uppercase mt-6">Entrar</h1>
          <p className="text-xs text-white/50 mt-2">WhatsApp ou e-mail para identificar seu pedido</p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode('whatsapp')}
            className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border transition-all ${
              mode === 'whatsapp'
                ? 'bg-gold/15 border-gold text-gold'
                : 'border-white/10 text-white/50'
            }`}
          >
            <Phone className="w-3.5 h-3.5" /> WhatsApp
          </button>
          <button
            type="button"
            onClick={() => setMode('email')}
            className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border transition-all ${
              mode === 'email' ? 'bg-gold/15 border-gold text-gold' : 'border-white/10 text-white/50'
            }`}
          >
            <Mail className="w-3.5 h-3.5" /> E-mail
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">Nome *</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 bg-black border border-white/10 focus:border-gold rounded-lg p-3 outline-none"
            />
          </div>
          {mode === 'whatsapp' ? (
            <div>
              <label className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">
                WhatsApp *
              </label>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="11999999999"
                className="w-full mt-1 bg-black border border-white/10 focus:border-gold rounded-lg p-3 outline-none"
              />
            </div>
          ) : (
            <div>
              <label className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">E-mail *</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 bg-black border border-white/10 focus:border-gold rounded-lg p-3 outline-none"
              />
            </div>
          )}
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gold-gradient text-black font-display font-bold text-xs tracking-widest rounded-lg uppercase disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Continuar'}
          </button>
        </form>
      </div>
    </div>
  );
}
