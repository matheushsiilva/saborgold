'use client';

import { useEffect } from 'react';

/**
 * Sincroniza a cor de fundo do html/body com a página atual,
 * evitando faixa branca no overscroll do mobile (iOS Safari).
 */
export default function PageBackground({ color }: { color: string }) {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.backgroundColor;
    const prevBody = body.style.backgroundColor;

    html.style.backgroundColor = color;
    body.style.backgroundColor = color;

    return () => {
      html.style.backgroundColor = prevHtml;
      body.style.backgroundColor = prevBody;
    };
  }, [color]);

  return null;
}
