'use client';

import React from 'react';
import Logo from './Logo';
import {
  LayoutDashboard,
  ShoppingBag,
  FolderOpen,
  MessageSquare,
  ClipboardList,
  Settings,
  LogOut,
  ImageIcon,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleLogout: () => void;
}

export default function AdminSidebar({ activeTab, setActiveTab, handleLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
    { id: 'produtos', name: 'Produtos', icon: <ShoppingBag className="w-4.5 h-4.5" /> },
    { id: 'categorias', name: 'Categorias', icon: <FolderOpen className="w-4.5 h-4.5" /> },
    { id: 'regioes', name: 'Regiões', icon: <MapPin className="w-4.5 h-4.5" /> },
    { id: 'marcas', name: 'Marcas', icon: <Sparkles className="w-4.5 h-4.5" /> },
    { id: 'banners', name: 'Banners', icon: <ImageIcon className="w-4.5 h-4.5" /> },
    { id: 'configuracoes', name: 'WhatsApp & Site', icon: <Settings className="w-4.5 h-4.5" /> },
  ];

  return (
    <aside className="w-full lg:w-64 bg-[#0A0A0A] border-r border-white/5 flex flex-col justify-between lg:h-screen lg:sticky lg:top-0 shrink-0 text-white select-none">
      
      {/* Top Brand */}
      <div className="p-6 border-b border-white/5 flex flex-col items-center">
        <Logo size="sm" />
        <span className="font-display font-bold text-xs tracking-[0.2em] text-gold mt-3">
          PAINEL ADMIN
        </span>
        <span className="font-sans text-[8px] tracking-widest text-white/40 uppercase mt-1">
          Sabor Gold Premium
        </span>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 py-6 px-4 space-y-1.5">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-xs font-semibold tracking-wider font-sans uppercase transition-all ${
              activeTab === item.id
                ? 'bg-gold/10 text-gold border-l-2 border-gold'
                : 'text-white/60 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            {item.icon}
            {item.name}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-4 py-3 text-xs font-semibold tracking-wider font-sans uppercase text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-lg transition-all"
        >
          <LogOut className="w-4.5 h-4.5" />
          Sair do Painel
        </button>
      </div>

    </aside>
  );
}
