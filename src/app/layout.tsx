import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sabor Gold | Vape & Lifestyle de Luxo",
  description: "Descubra a seleção mais refinada de pods descartáveis, essências exclusivas e acessórios de luxo da Sabor Gold. Mais que sabor, uma experiência única e sofisticada.",
  keywords: ["vape de luxo", "pod descartavel", "essencias premium", "narguilé", "lifestyle luxo", "sabor gold"],
  authors: [{ name: "Sabor Gold Co." }],
  icons: {
    icon: "/favicon.svg",
    apple: "/brand/logo-icon-gold.svg",
  },
  openGraph: {
    title: "Sabor Gold | Vape & Lifestyle de Luxo",
    description: "Mais que sabor, uma experiência única e sofisticada.",
    type: "website",
    locale: "pt_BR",
    siteName: "Sabor Gold",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-dark-bg text-white">
        {children}
      </body>
    </html>
  );
}
