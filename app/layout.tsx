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
  title: "P1 Academy | Kart Performance",
  description:
    "Drive to Perfection: aulas de kart, baterias, campeonatos, rankings e experiências premium para pilotos iniciantes e competitivos.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${anybody.variable} ${geist.variable} ${jetbrains.variable}`}>
        <div className="site-shell">
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
