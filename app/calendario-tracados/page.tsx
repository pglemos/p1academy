import Image from "next/image";
import Link from "next/link";
import { ClipboardList, Flag, Gauge, MapPin, Route, RotateCcw, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Motion";
import { legendsCompetition, legendsStageInfo } from "@/data/legends";
import { mapUrl, trackAddress } from "@/data/site";
import { trackGuide, trackLayouts, trackLayoutStats } from "@/data/tracados";

export const metadata = {
  title: "Calendário e Traçados | P1 Academy",
};

export default function CalendarioTracadosPage() {
  const featuredLayout = trackLayouts[0];

  return (
    <>
      <PageHero
        title="Calendário e traçados"
        text="Agenda oficial da Legends Kart Series e biblioteca dos traçados do Kartódromo Internacional de Betim. Consulte sentido, metragem, chicanes e referências para briefing antes das baterias."
        image="/images/wallpaper-kart-dawn.png"
      />

      <section className="section tight">
        <div className="container track-overview">
          <Reveal className="section-head">
            <MapPin size={30} color="var(--acid)" />
            <h2>Kartódromo Internacional de Betim</h2>
            <div className="accent-line" />
            <p>
              Sede oficial da Legends Kart Series, a pista em Betim permite alternar bases, sentidos e chicanes. A leitura do mapa antes da bateria ajuda o piloto a chegar com referências claras de freada, ápice e saída.
            </p>
            <p>
              Endereço: {trackAddress}. A confirmação de traçado, clima, briefing e janela de pista deve seguir sempre a comunicação da organização no dia da etapa.
            </p>
            <div className="button-row">
              <a className="btn primary" href={mapUrl} target="_blank" rel="noreferrer">
                <MapPin size={18} /> Abrir mapa
              </a>
              <Link className="btn secondary" href="/contato">
                Falar com a organização
              </Link>
            </div>
          </Reveal>

          <Reveal className="track-feature-map">
            <div className="track-feature-media">
              <Image src={featuredLayout.image} alt={`Mapa do ${featuredLayout.title} no Kartódromo Internacional de Betim`} fill priority sizes="(max-width: 1120px) 100vw, 48vw" />
            </div>
            <div className="track-feature-caption">
              <span>Destaque da pista</span>
              <strong>{featuredLayout.title}</strong>
              <small>{featuredLayout.distance.toLocaleString("pt-BR")} m</small>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section carbon-section">
        <div className="container">
          <Reveal className="section-head center">
            <Route size={30} color="var(--acid)" />
            <h2>Leitura rápida dos traçados</h2>
            <div className="accent-line" />
            <p>Use a galeria para comparar sentido, distância e presença de chicane antes de definir estratégia de volta lançada, ultrapassagem e gestão de tráfego.</p>
          </Reveal>

          <div className="track-stats">
            {trackLayoutStats.map((stat) => (
              <Reveal className="track-stat" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </Reveal>
            ))}
          </div>

          <div className="track-guide-grid">
            {trackGuide.map((item, index) => {
              const icons = [Flag, RotateCcw, ShieldCheck, Gauge];
              const Icon = icons[index];
              return (
                <Reveal className="track-guide-card" key={item.title}>
                  <Icon size={24} color="var(--acid)" />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" id="galeria-tracados">
        <div className="container">
          <Reveal className="section-head">
            <Flag size={30} color="var(--acid)" />
            <h2>Galeria completa</h2>
            <div className="accent-line" />
            <p>Todos os mapas recebidos foram adicionados ao site com nome, variação e metragem. Toque em qualquer card para abrir a imagem em tamanho maior.</p>
          </Reveal>

          <div className="track-layout-grid">
            {trackLayouts.map((layout) => (
              <Reveal className="track-card" key={layout.id}>
                <a href={layout.image} target="_blank" rel="noreferrer" aria-label={`Abrir mapa do ${layout.title}`}>
                  <span className="track-card-media">
                    <Image src={layout.image} alt={`Mapa do ${layout.title} no Kartódromo Internacional de Betim`} fill sizes="(max-width: 720px) 100vw, (max-width: 1120px) 50vw, 33vw" />
                  </span>
                  <span className="track-card-meta">
                    <span>Traçado {layout.number}</span>
                    <strong>{layout.variant}</strong>
                    <small>{layout.distance.toLocaleString("pt-BR")} m</small>
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section tight carbon-section">
        <div className="container split">
          <Reveal className="section-head">
            <ClipboardList size={30} color="var(--acid)" />
            <h2>Agenda e briefing</h2>
            <div className="accent-line" />
            <p>
              O calendário oficial da Legends Kart Series será publicado pelos canais da P1 Academy. Antes de cada bateria, a organização confirma o traçado do dia, sentido, condição de pista e regras operacionais.
            </p>
          </Reveal>
          <div className="table-like">
            <Reveal className="row">
              <strong>Temporada 2026</strong>
              <span>{legendsCompetition.venue}</span>
              <span>{legendsCompetition.expectedStages}</span>
              <span>Em breve</span>
            </Reveal>
            {legendsStageInfo.map((item) => (
              <Reveal className="row" key={item.label}>
                <strong>{item.label}</strong>
                <span>{item.value}</span>
                <span>Legends</span>
                <span>Oficial</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
