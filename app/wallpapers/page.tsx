"use client";

import { useState } from "react";
import { Download, Eye, Image as ImageIcon, Monitor, Smartphone, Sparkles } from "lucide-react";
import { MediaFrame } from "@/components/MediaFrame";
import { PageHero } from "@/components/PageHero";
import { Lift, Reveal } from "@/components/Motion";

type WallpaperFormat = "all" | "mobile" | "desktop" | "ultrawide";

const wallpaperItems = [
  {
    id: "w1",
    name: "Carbon Grid",
    category: "desktop" as const,
    formatLabel: "Desktop 16:9",
    resolution: "3840 × 2160 (4K UHD)",
    fileSize: "2.4 MB",
    src: "/images/wallpaper-kart-dawn.png",
    description: "Grid de largada com amanhecer e iluminação técnica de pista.",
  },
  {
    id: "w2",
    name: "Apex Night",
    category: "mobile" as const,
    formatLabel: "Mobile 9:16",
    resolution: "1080 × 1920 (FHD+)",
    fileSize: "1.8 MB",
    src: "/images/hero-kart-night.png",
    description: "Kart em velocidade noturna sob os refletores do kartódromo.",
  },
  {
    id: "w3",
    name: "Telemetry Dark",
    category: "desktop" as const,
    formatLabel: "Desktop 16:9",
    resolution: "3840 × 2160 (4K UHD)",
    fileSize: "2.1 MB",
    src: "/images/timing-telemetry.png",
    description: "Painel de telemetria e cronometragem digital de alta precisão.",
  },
  {
    id: "w4",
    name: "Red Heat Apex",
    category: "ultrawide" as const,
    formatLabel: "Ultrawide 21:9",
    resolution: "3440 × 1440 (UW-QHD)",
    fileSize: "3.2 MB",
    src: "/images/competition-corner.png",
    description: "Disputa roda a roda no ápice da curva com traçado emborrachado.",
  },
  {
    id: "w5",
    name: "Podium Metal",
    category: "mobile" as const,
    formatLabel: "Mobile 9:16",
    resolution: "1080 × 1920 (FHD+)",
    fileSize: "1.9 MB",
    src: "/images/academy-coaching.png",
    description: "Briefing de box com o campeão brasileiro André Felisberto.",
  },
  {
    id: "w6",
    name: "Track Map Blueprint",
    category: "desktop" as const,
    formatLabel: "Desktop 16:9",
    resolution: "3840 × 2160 (4K UHD)",
    fileSize: "2.6 MB",
    src: "/images/tracados/tracado-01-normal.jpg",
    description: "Mapa oficial esquemático dos setores do Kartódromo de Betim.",
  },
];

export default function WallpapersPage() {
  const [activeFormat, setActiveFormat] = useState<WallpaperFormat>("all");

  const filteredWallpapers =
    activeFormat === "all"
      ? wallpaperItems
      : wallpaperItems.filter((w) => w.category === activeFormat);

  return (
    <>
      <PageHero
        title="Wallpapers & Artes de Pista"
        text="Galeria oficial de wallpapers e artes de alta resolução para desktop, smartphones, telas ultrawide e stories com a identidade P1 Academy."
        image="/images/wallpaper-kart-dawn.png"
      />

      <section className="section tight">
        <div className="container">
          <Reveal className="section-head center">
            <h2>Galeria Oficial de Alta Resolução</h2>
            <div className="accent-line" />
            <p>
              Artes originais de alto contraste e estética motorsport de alta voltagem. Escolha a sua resolução e faça o download gratuito.
            </p>
          </Reveal>

          <div className="report-filter-chips justify-center mb-32" role="group" aria-label="Filtro de formato de wallpaper">
            <button
              type="button"
              className={`report-chip ${activeFormat === "all" ? "is-active" : ""}`}
              onClick={() => setActiveFormat("all")}
            >
              Todos ({wallpaperItems.length})
            </button>
            <button
              type="button"
              className={`report-chip ${activeFormat === "desktop" ? "is-active" : ""}`}
              onClick={() => setActiveFormat("desktop")}
            >
              Desktop 4K (16:9)
            </button>
            <button
              type="button"
              className={`report-chip ${activeFormat === "mobile" ? "is-active" : ""}`}
              onClick={() => setActiveFormat("mobile")}
            >
              Celular (9:16)
            </button>
            <button
              type="button"
              className={`report-chip ${activeFormat === "ultrawide" ? "is-active" : ""}`}
              onClick={() => setActiveFormat("ultrawide")}
            >
              Ultrawide (21:9)
            </button>
          </div>

          <div className="grid-3">
            {filteredWallpapers.map((item) => (
              <Lift className="feature-card wallpaper-card" key={item.id}>
                <div className="wallpaper-media-wrapper">
                  <MediaFrame label={item.formatLabel} src={item.src} alt={item.name} tall />
                  <span className="wallpaper-resolution-badge">{item.resolution}</span>
                </div>
                <div className="feature-body">
                  <div className="wallpaper-meta-row">
                    <span className="wallpaper-tag">{item.formatLabel}</span>
                    <span className="wallpaper-size">{item.fileSize}</span>
                  </div>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <a
                    className="btn ghost wallpaper-download-btn"
                    href={item.src}
                    download={`${item.name.toLowerCase().replace(/\s+/g, "-")}-p1academy.png`}
                    aria-label={`Baixar wallpaper ${item.name} em ${item.resolution}`}
                  >
                    <Download size={18} /> Baixar Arte ({item.fileSize})
                  </a>
                </div>
              </Lift>
            ))}
          </div>
        </div>
      </section>

      <section className="section carbon-section">
        <div className="container grid-2 align-center">
          <Reveal className="section-head">
            <h2>Uso de Marca & Peças de Comunidade</h2>
            <div className="accent-line" />
            <p>
              Pilotos e equipes oficiais da Legends Kart Series podem utilizar essas peças em suas redes sociais, stories de dia de corrida e transmissões de simulador.
            </p>
            <div className="button-row">
              <a className="btn primary" href="/contato">
                Solicitar Peça Customizada
              </a>
              <a className="btn secondary" href="/andre-felisberto">
                Conhecer a História da P1
              </a>
            </div>
          </Reveal>
          <Reveal className="legends-panel">
            <h3>Licença de Uso</h3>
            <p>
              As imagens são de uso livre e gratuito para pilotos, parceiros e torcedores da P1 Academy e da Legends Kart Series. Marque <strong>@p1__academy</strong> nos seus stories para ser repostado!
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
