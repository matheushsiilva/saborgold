import React from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'vertical' | 'icon';
  color?: 'gold' | 'white' | 'black';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function Logo({
  variant = 'horizontal',
  color = 'gold',
  size = 'md',
  className = '',
}: LogoProps) {
  // Size mapping
  const sizeMap = {
    sm: { icon: 32, text: 'text-sm', sub: 'text-[8px]', gap: 'gap-2' },
    md: { icon: 48, text: 'text-lg', sub: 'text-[10px]', gap: 'gap-3' },
    lg: { icon: 64, text: 'text-2xl', sub: 'text-[12px]', gap: 'gap-4' },
    xl: { icon: 96, text: 'text-4xl', sub: 'text-[16px]', gap: 'gap-6' },
  };

  const currentSize = sizeMap[size];

  // Colors
  const fillGradient = color === 'gold' ? 'url(#gold-grad)' : color === 'white' ? '#FFFFFF' : '#050505';
  const textClass = color === 'gold' ? 'text-gold' : color === 'white' ? 'text-white' : 'text-black';
  const subTextClass = color === 'gold' ? 'text-gold-light/60' : color === 'white' ? 'text-white/60' : 'text-black/60';

  const svgIcon = (
    <svg
      width={currentSize.icon}
      height={currentSize.icon}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-[0_0_8px_rgba(212,175,55,0.2)]"
    >
      <defs>
        <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F3E5AB" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#AA7C11" />
        </linearGradient>
      </defs>
      
      {/* Crown at top */}
      <path
        d="M35 28L42 35L50 25L58 35L65 28L61 40H39L35 28Z"
        fill={fillGradient}
      />
      <circle cx="35" cy="26" r="1.5" fill={fillGradient} />
      <circle cx="50" cy="23" r="1.5" fill={fillGradient} />
      <circle cx="65" cy="26" r="1.5" fill={fillGradient} />

      {/* Elegant Shield Border */}
      <path
        d="M20 38C20 38 20 65 50 82C80 65 80 38 80 38C80 38 50 35 50 35C50 35 20 38 20 38Z"
        stroke={fillGradient}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Outer Glow ring */}
      <path
        d="M23 41C23 41 23 63 50 78C77 63 77 41 77 41"
        stroke={fillGradient}
        strokeWidth="0.75"
        strokeDasharray="4 4"
        opacity="0.6"
      />

      {/* Interlocking Monogram SG */}
      {/* The S shape */}
      <path
        d="M42 47C44 45.5 48 44 51 44C56.5 44 58.5 47 58.5 49.5C58.5 54 51.5 55 45.5 56.5C40.5 57.7 39.5 61.5 39.5 64.5C39.5 68.5 43.5 71 49.5 71C54 71 58 69 58 69"
        stroke={fillGradient}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* The G shape */}
      <path
        d="M59 52C59 52 54.5 50 51 50M46.5 63C47 64 48.5 65.5 51.5 65.5C56.5 65.5 58 61.5 58 58.5V55.5H50"
        stroke={fillGradient}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Elegant Smoke Vapor Wave */}
      <path
        d="M28 58C33 53 38 58 45 54C52 50 56 55 63 50C70 45 74 52 78 48"
        stroke={fillGradient}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );

  if (variant === 'icon') {
    return svgIcon;
  }

  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center text-center ${currentSize.gap} ${className}`}>
        {svgIcon}
        <div className="flex flex-col items-center">
          <span className={`font-display font-bold tracking-[0.25em] leading-none ${textClass} ${currentSize.text}`}>
            SABOR GOLD
          </span>
          <span className={`font-sans font-medium tracking-[0.4em] mt-1 leading-none ${subTextClass} ${currentSize.sub}`}>
            LIFESTYLE & VAPE
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${currentSize.gap} ${className}`}>
      {svgIcon}
      <div className="flex flex-col">
        <span className={`font-display font-bold tracking-[0.2em] leading-none ${textClass} ${currentSize.text}`}>
          SABOR GOLD
        </span>
        <span className={`font-sans font-medium tracking-[0.35em] mt-0.5 leading-none ${subTextClass} ${currentSize.sub}`}>
          LIFESTYLE & VAPE
        </span>
      </div>
    </div>
  );
}
