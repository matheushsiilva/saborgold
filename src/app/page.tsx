'use client';

import React from 'react';
import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import PremiumLoader from '@/components/PremiumLoader';
import CategoryGrid from '@/components/CategoryGrid';
import CarouselProducts from '@/components/CarouselProducts';
import AboutBrand from '@/components/AboutBrand';
import Benefits from '@/components/Benefits';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import FloatingWhatsapp from '@/components/FloatingWhatsapp';
import { CartProvider } from '@/context/CartContext';

export default function Home() {
  return (
    <CartProvider>
      <PremiumLoader>
      <div className="min-h-screen bg-dark-bg text-white flex flex-col justify-between overflow-x-hidden">
        {/* Navigation & Cart drawers */}
        <Header />
        <CartDrawer />
        
        {/* Floating WhatsApp chat */}
        <FloatingWhatsapp />

        {/* Content sections */}
        <main className="flex-1">
          <HeroBanner />
          <CategoryGrid />
          <CarouselProducts />
          <AboutBrand />
          <Benefits />
        </main>

        {/* Footer */}
        <Footer />
      </div>
      </PremiumLoader>
    </CartProvider>
  );
}
