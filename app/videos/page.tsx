"use client";

import { useState } from "react";
import { ExternalLink, Film, Flame, Play, Sparkles, Video } from "lucide-react";
import { MediaFrame } from "@/components/MediaFrame";
import { PageHero } from "@/components/PageHero";
import { Lift, Reveal } from "@/components/Motion";
import { instagramUrl } from "@/data/site";

type VideoCategory = "all" | "onboard" | "analysis" | "technique" | "highlights";

const videoItems = [
  {
    id: "v1",
    title: "Volta Rápida Onboard — Traçado 01 Betim",
    category: "onboard" as const,
    categoryLabel: "Onboard & Telemetria",
    duration: "1:04.103",
    description: "Câmera no capacete acompanhando a tomada de tempo ideal no sentido horário com motor equalizado.",
    image: "/images/hero-kart-night.png",
    featured: true,
  },
  {
    id: "v2",
    title: "Análise de Telemetria: Onde Ganhar 4 Décimos",
    category: "analysis" as const,
    categoryLabel: "Análise de Traçado",
    duration: "4:20",
    description: "Comparativo setor a setor entre volta de pole position e volta média no Kartódromo Internacional de Betim.",
    image: "/images/timing-telemetry.png",
    featured: false,
  },
  {
    id: "v3",
    title: "Técnica de Freada: Trail Braking no Kart Rental",
    category: "technique" as const,
    categoryLabel: "Instrução Técnica",
    duration: "3:15",
    description: "André Felisberto demonstra visualmente como modular o freio sem travar a traseira na aproximação do grampo.",
    image: "/images/academy-coaching.png",
    featured: false,
  },
  {
    id: "v4",
    title: "Highlights Legends Kart Series — Etapa Noturna",
    category: "highlights" as const,
    categoryLabel: "Highlights",
    duration: "2:50",
    description: "Melhores momentos, disputas roda a roda e chegadas milimétricas da rodada dupla oficial da Legends.",
    image: "/images/competition-corner.png",
    featured: true,
  },
  {
    id: "v5",
    title: "Como Defender Posição Sem Perder Ritmo",
    category: "technique" as const,
    categoryLabel: "Instrução Técnica",
    duration: "3:40",
    description: "Posicionamento correto do kart para proteger a linha interna sem comprometer a aceleração na saída.",
    image: "/images/wallpaper-kart-dawn.png",
    featured: false,
  },
  {
    id: "v6",
    title: "Onboard na Chuva: Linhas Molhadas & Aderência",
    category: "onboard" as const,
    categoryLabel: "Onboard & Telemetria",
    duration: "1:18.450",
    description: "Pilotagem em pista molhada fugindo da linha emborrachada para encontrar máxima tração nas zebras externas.",
    image: "/images/tracados/tracado-01-normal.jpg",
    featured: false,
  },
];

export default function VideosPage() {
  const [activeCategory, setActiveCategory] = useState<VideoCategory>("all");

  const filteredVideos =
    activeCategory === "all"
      ? videoItems
      : videoItems.filter((v) => v.category === activeCategory);

  return (
    <>
      <PageHero
        title="Vídeos & Onboard"
        text="Galeria de vídeos técnicos, voltas onboard comentadas, estudos de telemetria e coberturas oficiais da Legends Kart Series."
        image="/images/hero-kart-night.png"
      />

      <section className="section tight">
        <div className="container">
          <Reveal className="section-head center">
            <h2>Acervo Audiovisual de Pista</h2>
            <div className="accent-line" />
            <p>
              Estudo de referências visuais, freada, pontos de tangência e disputas reais publicadas para elevar o nível técnico dos pilotos da P1 Academy.
            </p>
          </Reveal>

          <div className="report-filter-chips justify-center mb-32" role="group" aria-label="Filtro de vídeos">
            <button
              type="button"
              className={`report-chip ${activeCategory === "all" ? "is-active" : ""}`}
              onClick={() => setActiveCategory("all")}
            >
              Todos ({videoItems.length})
            </button>
            <button
              type="button"
              className={`report-chip ${activeCategory === "onboard" ? "is-active" : ""}`}
              onClick={() => setActiveCategory("onboard")}
            >
              Onboard & Voltas Rápidas
            </button>
            <button
              type="button"
              className={`report-chip ${activeCategory === "analysis" ? "is-active" : ""}`}
              onClick={() => setActiveCategory("analysis")}
            >
              Análises de Traçado
            </button>
            <button
              type="button"
              className={`report-chip ${activeCategory === "technique" ? "is-active" : ""}`}
              onClick={() => setActiveCategory("technique")}
            >
              Instrução Técnica
            </button>
            <button
              type="button"
              className={`report-chip ${activeCategory === "highlights" ? "is-active" : ""}`}
              onClick={() => setActiveCategory("highlights")}
            >
              Highlights
            </button>
          </div>

          <div className="grid-3">
            {filteredVideos.map((video) => (
              <Lift className="feature-card video-card" key={video.id}>
                <div className="video-media-wrapper">
                  <MediaFrame label={video.categoryLabel} src={video.image} alt={video.title} />
                  <span className="video-duration-badge">{video.duration}</span>
                </div>
                <div className="feature-body">
                  <span className="video-category-tag">{video.categoryLabel}</span>
                  <h3>{video.title}</h3>
                  <p>{video.description}</p>
                  <a
                    className="btn ghost video-action-btn"
                    href={instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Assistir ${video.title} no Instagram`}
                  >
                    <Play size={16} /> Assistir no Instagram <ExternalLink size={14} />
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
            <h2>Quer Gravar Sua Telemetria Onboard?</h2>
            <div className="accent-line" />
            <p>
              Nas aulas da P1 Academy com André Felisberto, disponibilizamos suporte para gravação de onboard e análise pós-sessão de volta rápida no box.
            </p>
            <div className="button-row">
              <a className="btn primary" href="/aulas">
                Conhecer Pacotes de Aula
              </a>
              <a className="btn secondary" href={instagramUrl} target="_blank" rel="noreferrer">
                Seguir @p1__academy
              </a>
            </div>
          </Reveal>
          <Reveal className="legends-panel">
            <h3>Canais de Publicação</h3>
            <p>
              Vídeos completos de tomadas de tempo, coberturas de baterias da Legends Kart Series e cortes rápidos de técnica são publicados semanalmente nas redes sociais oficiais da academia.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
