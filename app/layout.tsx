import type { Metadata } from "next";
import { Anybody, Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const anybody = Anybody({
  subsets: ["latin"],
  variable: "--font-headline",
  weight: ["700", "800", "900"],
  style: ["normal", "italic"],
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-body",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://p1academy.vercel.app"),
  title: {
    default: "P1 Academy | Kart Performance & Legends Kart Series",
    template: "%s | P1 Academy",
  },
  description:
    "Drive to Perfection: aulas de kart de alta performance com o Campeão Brasileiro André Felisberto e plataforma oficial da Legends Kart Series no Kartódromo de Betim.",
  keywords: [
    "kart",
    "aulas de kart",
    "Legends Kart Series",
    "André Felisberto",
    "kartódromo de betim",
    "telemetria de kart",
    "campeonato de kart",
  ],
  authors: [{ name: "P1 Academy" }, { name: "André Felisberto" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://p1academy.vercel.app",
    siteName: "P1 Academy",
    title: "P1 Academy | Kart Performance & Legends Kart Series",
    description:
      "Aulas de kart de alta performance e auditoria oficial de resultados da Legends Kart Series no Kartódromo Internacional de Betim.",
    images: [
      {
        url: "/images/academy-coaching.png",
        width: 1200,
        height: 630,
        alt: "P1 Academy Kart Performance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "P1 Academy | Kart Performance",
    description: "Aulas de kart e plataforma oficial da Legends Kart Series.",
    images: ["/images/academy-coaching.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body className={`${anybody.variable} ${geist.variable} ${jetbrains.variable}`}>
        <a href="#main-content" className="skip-link">
          Pular para o conteúdo principal
        </a>
        <div className="site-shell">
          <SiteHeader />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
