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

  let src = '/brand/logo-horizontal-gold.svg';
  let widthMultiplier = 4.0; // 320x80

  if (variant === 'vertical') {
    src = '/brand/logo-vertical-gold.svg';
    widthMultiplier = 0.8; // 160x200
  } else if (variant === 'icon') {
    src = '/brand/logo-icon-gold.svg';
    widthMultiplier = 1.0; // 100x100
  }

  return (
    <div className={`relative shrink-0 ${className}`}>
      <Image
        src={src}
        alt="Sabor Gold"
        width={Math.round(h * widthMultiplier)}
        height={h}
        className="object-contain drop-shadow-[0_0_12px_rgba(212,175,55,0.25)]"
        style={{ width: 'auto', height: h }}
        priority
      />
    </div>
  );
}
