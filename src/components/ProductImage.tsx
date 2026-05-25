import React from 'react';

interface ProductImageProps {
  imageUrl: string;
  name: string;
  className?: string;
}

export default function ProductImage({ imageUrl, name, className = '' }: ProductImageProps) {
  // Real image: URL, path, or base64 upload
  if (
    imageUrl.startsWith('http') ||
    imageUrl.startsWith('data:image') ||
    (imageUrl.startsWith('/') && /\.(png|jpg|jpeg|webp|gif)$/i.test(imageUrl))
  ) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`w-full h-full object-cover ${className}`}
        loading="lazy"
      />
    );
  }

  // Fallback to high-end Vector SVGs matching product categories
  const lowercaseUrl = imageUrl.toLowerCase();
  const lowercaseName = name.toLowerCase();

  let svgContent = null;

  if (lowercaseUrl.includes('pods') || lowercaseName.includes('pod')) {
    // Elegant Cylindrical Disposable Pod design
    svgContent = (
      <svg viewBox="0 0 100 100" fill="none" className="w-full h-full p-2">
        <defs>
          <linearGradient id="pod-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1A1A1A" />
            <stop offset="30%" stopColor="#333333" />
            <stop offset="70%" stopColor="#1A1A1A" />
            <stop offset="100%" stopColor="#0B0B0B" />
          </linearGradient>
          <linearGradient id="gold-metal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#AA7C11" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#F3E5AB" />
          </linearGradient>
        </defs>
        {/* Background glow */}
        <circle cx="50" cy="50" r="30" fill="url(#gold-metal)" opacity="0.05" filter="blur(8px)" />
        
        {/* Pod Body */}
        <rect x="42" y="30" width="16" height="50" rx="4" fill="url(#pod-grad)" stroke="url(#gold-metal)" strokeWidth="0.75" />
        
        {/* Mouthpiece */}
        <path d="M44 20C44 20 44 30 44 30H56C56 30 56 20 54 20C52 20 48 20 44 20Z" fill="#111" stroke="url(#gold-metal)" strokeWidth="0.5" />
        
        {/* Metallic Gold bands */}
        <rect x="42" y="38" width="16" height="2" fill="url(#gold-metal)" />
        <rect x="42" y="72" width="16" height="4" fill="url(#gold-metal)" />
        
        {/* SG Monogram subtly written */}
        <text x="50" y="58" fill="url(#gold-metal)" fontSize="6" fontFamily="Cinzel" textAnchor="middle" letterSpacing="1" opacity="0.8">SG</text>
        
        {/* LED Indicator dot */}
        <circle cx="50" cy="74" r="1.5" fill="#D4AF37" className="animate-pulse" />
        
        {/* Subtle vapor smoke */}
        <path d="M50 15 C52 10, 48 8, 50 4" stroke="url(#gold-metal)" strokeWidth="0.75" opacity="0.3" strokeLinecap="round" />
      </svg>
    );
  } else if (lowercaseUrl.includes('essencia') || lowercaseName.includes('essência') || lowercaseName.includes('zomo') || lowercaseName.includes('tangiers') || lowercaseName.includes('nay')) {
    // Luxury perfume-like Essence jar
    svgContent = (
      <svg viewBox="0 0 100 100" fill="none" className="w-full h-full p-2">
        <defs>
          <linearGradient id="jar-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(212, 175, 55, 0.2)" />
            <stop offset="100%" stopColor="rgba(5, 5, 5, 0.9)" />
          </linearGradient>
          <linearGradient id="gold-metal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#AA7C11" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#F3E5AB" />
          </linearGradient>
        </defs>
        {/* Glow */}
        <circle cx="50" cy="50" r="28" fill="url(#gold-metal)" opacity="0.08" filter="blur(6px)" />
        
        {/* Cap */}
        <rect x="42" y="24" width="16" height="8" rx="1" fill="url(#gold-metal)" />
        <rect x="45" y="21" width="10" height="3" fill="#111" />
        
        {/* Body of jar */}
        <path d="M30 38C30 34 34 32 38 32H62C66 32 70 34 70 38V74C70 78 66 82 62 82H38C34 82 30 78 30 74V38Z" fill="url(#jar-grad)" stroke="url(#gold-metal)" strokeWidth="1" />
        
        {/* Luxury Gold Label */}
        <rect x="36" y="44" width="28" height="24" rx="2" fill="#0A0A0A" stroke="url(#gold-metal)" strokeWidth="0.75" />
        <text x="50" y="55" fill="url(#gold-metal)" fontSize="5" fontFamily="Cinzel" textAnchor="middle" letterSpacing="0.5">SABOR GOLD</text>
        <line x1="40" y1="58" x2="60" y2="58" stroke="url(#gold-metal)" strokeWidth="0.5" opacity="0.5" />
        <text x="50" y="64" fill="#FFFFFF" fontSize="4.5" fontFamily="Montserrat" textAnchor="middle" opacity="0.8">PREMIUM</text>

        {/* Liquid level */}
        <path d="M31 66C35 64, 45 68, 50 66C55 64, 65 68, 69 66V74C69 77 66 80 62 80H38C34 80 31 77 31 74V66Z" fill="url(#gold-metal)" opacity="0.15" />
      </svg>
    );
  } else if (lowercaseUrl.includes('kit') || lowercaseName.includes('kit') || lowercaseName.includes('vaporesso') || lowercaseName.includes('caliburn')) {
    // High-tech Box Mod Kit
    svgContent = (
      <svg viewBox="0 0 100 100" fill="none" className="w-full h-full p-2">
        <defs>
          <linearGradient id="mod-body" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1A1A1A" />
            <stop offset="50%" stopColor="#2A2A2A" />
            <stop offset="100%" stopColor="#121212" />
          </linearGradient>
          <linearGradient id="gold-metal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#AA7C11" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#F3E5AB" />
          </linearGradient>
        </defs>
        {/* Glow */}
        <circle cx="50" cy="50" r="32" fill="url(#gold-metal)" opacity="0.06" filter="blur(10px)" />
        
        {/* Mod Box Body */}
        <rect x="34" y="36" width="32" height="46" rx="3" fill="url(#mod-body)" stroke="url(#gold-metal)" strokeWidth="1" />
        
        {/* Screen */}
        <rect x="40" y="44" width="20" height="18" rx="1" fill="#050505" stroke="#333" strokeWidth="0.5" />
        <text x="50" y="52" fill="url(#gold-metal)" fontSize="4" fontFamily="monospace" textAnchor="middle">80.0 W</text>
        <text x="50" y="58" fill="#555" fontSize="3.5" fontFamily="monospace" textAnchor="middle">0.25Ω  99%</text>
        
        {/* Buttons */}
        <circle cx="44" cy="69" r="2" fill="url(#gold-metal)" />
        <circle cx="56" cy="69" r="2" fill="url(#gold-metal)" />
        <rect x="40" y="74" width="20" height="2" fill="#555" rx="0.5" />

        {/* Atomizer Tank */}
        <rect x="45" y="24" width="10" height="12" fill="rgba(255,255,255,0.15)" stroke="url(#gold-metal)" strokeWidth="0.75" />
        <rect x="48" y="16" width="4" height="8" fill="#111" stroke="url(#gold-metal)" strokeWidth="0.5" />
        <rect x="44" y="34" width="12" height="2" fill="url(#gold-metal)" />
        <line x1="50" y1="24" x2="50" y2="34" stroke="url(#gold-metal)" strokeWidth="0.75" />
      </svg>
    );
  } else {
    // Accessories or general premium icon (crown / shield)
    svgContent = (
      <svg viewBox="0 0 100 100" fill="none" className="w-full h-full p-2">
        <defs>
          <linearGradient id="gold-metal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#AA7C11" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#F3E5AB" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="30" fill="url(#gold-metal)" opacity="0.05" filter="blur(8px)" />
        {/* Crown & Shield emblem */}
        <path d="M50 18 L70 32 V58 C70 70, 50 82, 50 82 C50 82, 30 70, 30 58 V32 L50 18 Z" stroke="url(#gold-metal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M40 40 L45 45 L50 38 L55 45 L60 40 L57 50 H43 L40 40 Z" fill="url(#gold-metal)" />
        <circle cx="50" cy="62" r="3" fill="url(#gold-metal)" className="animate-pulse" />
      </svg>
    );
  }

  return (
    <div className={`w-full h-full bg-[#0A0A0A] rounded-lg overflow-hidden flex items-center justify-center border border-white/5 relative ${className}`}>
      {svgContent}
    </div>
  );
}
