import type { Metadata } from "next";
import "./globals.css";
import AppProviders from "@/components/providers/AppProviders";

export const metadata: Metadata = {
  title: "Sabor Gold | Vapes Premium",
  description: "Catálogo premium de vapes e pods descartáveis. Selecione sua região, escolha o sabor e peça pelo WhatsApp com a exclusividade Sabor Gold.",
  keywords: ["vapes premium", "elfbar", "ignite", "pod descartavel", "sabor gold", "vape luxo"],
  authors: [{ name: "Sabor Gold Co." }],
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Sabor Gold | Vapes Premium",
    description: "Vapes premium com entrega por região. Pedidos via WhatsApp.",
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
      <body className="min-h-full flex flex-col bg-[#FAFAFA] text-[#111111]">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
