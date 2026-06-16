import React from 'react';
import { Truck, Sparkles, Headset, ShieldCheck } from 'lucide-react';

export default function Benefits() {
  const benefits = [
    {
      icon: <Truck className="w-6 h-6 text-gold" />,
      title: 'Entrega Rápida',
      desc: 'Entrega expressa via motoboy para regiões metropolitanas e envio prioritário para todo o Brasil.',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-gold" />,
      title: 'Produtos Selecionados',
      desc: 'Trabalhamos exclusivamente com as marcas mais conceituadas e produtos importados 100% autênticos.',
    },
    {
      icon: <Headset className="w-6 h-6 text-gold" />,
      title: 'WhatsApp Direto',
      desc: 'Clique no produto e fale instantaneamente no WhatsApp. Sem formulários, sem espera.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-gold" />,
      title: 'Compra Segura',
      desc: 'Seu pedido é enviado com embalagem discreta e rastreado do nosso estoque até suas mãos.',
    },
  ];

  return (
    <section className="py-20 bg-dark-bg border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="p-6 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 rounded-xl transition-all duration-300 flex flex-col items-center text-center space-y-4 group"
            >
              {/* Icon Ring */}
              <div className="p-3 bg-black/60 rounded-full border border-white/10 group-hover:border-gold/30 transition-all duration-300">
                {benefit.icon}
              </div>
              <h3 className="font-display font-bold text-sm tracking-wider text-white uppercase group-hover:text-gold transition-colors">
                {benefit.title}
              </h3>
              <p className="font-sans font-light text-xs text-white/50 leading-relaxed max-w-xs">
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
