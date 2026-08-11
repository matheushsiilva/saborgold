'use client';

import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import {
  LayoutDashboard,
  ShoppingBag,
  FolderOpen,
  Settings,
  LogOut,
  ImageIcon,
  MapPin,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleLogout: () => void;
}

export default function AdminSidebar({ activeTab, setActiveTab, handleLogout }: SidebarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'produtos', name: 'Produtos', icon: ShoppingBag },
    { id: 'categorias', name: 'Categorias', icon: FolderOpen },
    { id: 'regioes', name: 'Regiões', icon: MapPin },
    { id: 'marcas', name: 'Marcas', icon: Sparkles },
    { id: 'banners', name: 'Banners', icon: ImageIcon },
    { id: 'configuracoes', name: 'WhatsApp & Site', icon: Settings },
  ];

  const activeItem = menuItems.find((item) => item.id === activeTab);

  const selectTab = (id: string) => {
    setActiveTab(id);
    setDrawerOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const NavButton = ({
    item,
    compact = false,
  }: {
    item: (typeof menuItems)[0];
    compact?: boolean;
  }) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    return (
      <button
        type="button"
        onClick={() => selectTab(item.id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wider font-sans uppercase transition-all touch-manipulation ${
          isActive
            ? 'bg-gold/10 text-gold border-l-2 border-gold'
            : 'text-white/60 hover:text-white hover:bg-white/[0.02]'
        } ${compact ? 'py-2.5' : ''}`}
      >
        <Icon className="w-4 h-4 shrink-0" />
        <span className="truncate">{item.name}</span>
      </button>
    );
  };

  return (
    <>
      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-50 bg-[#0A0A0A] border-b border-white/5 safe-top">
        <div className="flex items-center justify-between px-4 py-3 gap-3">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="p-2 -ml-2 rounded-lg text-white/70 hover:text-gold hover:bg-white/5 touch-manipulation"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0 text-center">
            <p className="font-display font-bold text-[10px] tracking-[0.2em] text-gold uppercase truncate">
              {activeItem?.name || 'Admin'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="p-2 -mr-2 rounded-lg text-red-400/80 hover:text-red-300 hover:bg-red-950/20 touch-manipulation"
            aria-label="Sair"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[100] bg-black/70"
          onClick={() => setDrawerOpen(false)}
          aria-hidden
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-[110] h-full w-[min(280px,85vw)] bg-[#0A0A0A] border-r border-white/5 flex flex-col transform transition-transform duration-300 ease-out safe-top safe-bottom ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <Logo size="sm" />
            <span className="font-display font-bold text-[10px] tracking-[0.2em] text-gold mt-2">
              PAINEL ADMIN
            </span>
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavButton key={item.id} item={item} />
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold tracking-wider uppercase text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-lg transition-all touch-manipulation"
          >
            <LogOut className="w-4 h-4" />
            Sair do Painel
          </button>
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#0A0A0A] border-r border-white/5 flex-col justify-between h-screen sticky top-0 shrink-0 text-white select-none">
        <div className="p-6 border-b border-white/5 flex flex-col items-center">
          <Logo size="sm" />
          <span className="font-display font-bold text-xs tracking-[0.2em] text-gold mt-3">
            PAINEL ADMIN
          </span>
          <span className="font-sans text-[8px] tracking-widest text-white/40 uppercase mt-1">
            Sabor Gold Premium
          </span>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => (
            <NavButton key={item.id} item={item} />
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3 text-xs font-semibold tracking-wider font-sans uppercase text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sair do Painel
          </button>
        </div>
      </aside>
    </>
  );
}
