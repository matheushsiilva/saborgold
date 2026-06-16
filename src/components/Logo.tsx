import React from 'react';
import Image from 'next/image';

interface LogoProps {
  variant?: 'horizontal' | 'vertical' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const heights = {
  sm: 40,
  md: 52,
  lg: 72,
  xl: 110,
};

export default function Logo({
  variant = 'horizontal',
  size = 'md',
  className = '',
}: LogoProps) {
  const h = heights[size];
  const isIcon = variant === 'icon';

  return (
    <div className={`relative shrink-0 ${className}`}>
      <Image
        src="/brand/logo-sabor-gold-v2.png"
        alt="Sabor Gold"
        width={isIcon ? h : Math.round(h * 2.2)}
        height={h}
        className="object-contain drop-shadow-[0_0_12px_rgba(212,175,55,0.25)]"
        style={{ width: 'auto', height: h }}
        priority
      />
    </div>
  );
}
