import Link from "next/link";
import Image from "next/image";
import {
  AtSign,
  Award,
  CheckCircle2,
  ExternalLink,
  Flame,
  Handshake,
  HeartHandshake,
  Megaphone,
  Radio,
  Sparkles,
  Trophy,
  Users,
  Video,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Lift, Reveal } from "@/components/Motion";
import { sponsors } from "@/data/sponsors";

export const metadata = {
  title: "Patrocinadores & Parceiros Oficiais | P1 Academy",
  description:
    "Marcas parceiras da P1 Academy e Legends Kart Series 2026: visibilidade de paddock, ativações de pista, experiências corporativas e branding digital.",
};

const activationBenefits = [
  {
    icon: Trophy,
    title: "Branding em Relatórios Oficiais",
    text: "Inserção da sua marca em todos os PDFs homologados da Legends Kart Series, baixados por pilotos, chefes de equipe e organizadores.",
  },
  {
    icon: Video,
    title: "Presença em Conteúdo Onboard",
    text: "Exposição em vídeos técnicos, voltas rápidas comentadas no Instagram e transmissões de simulador da P1 Academy.",
  },
  {
    icon: Users,
    title: "Experiências Corporativas",
    text: "Baterias exclusivas para colaboradores e clientes VIP com instrução do campeão André Felisberto no Kartódromo de Betim.",
  },
  {
    icon: Megaphone,
    title: "Ativação no Box & Paddock",
    text: "Exposição física de banners, sampling de produtos, adesivação de karts e presença nos pódios de premiação da temporada.",
  },
];

export default function PatrocinadoresPage() {
  return (
    <>
      <PageHero
        title="Patrocinadores & Parceiros"
        text="Marcas líderes associadas a alta performance, automobilismo, comunidade e experiências memoráveis no kartismo brasileiro."
        image="/images/hero-kart-night.png"
      />

      <section className="section tight">
        <div className="container">
          <Reveal className="section-head center">
            <h2>Marcas no Grid da Temporada 2026</h2>
            <div className="accent-line" />
            <p>Conheça os parceiros oficiais que apoiam e aceleram o ecossistema da P1 Academy e da Legends Kart Series.</p>
          </Reveal>

          <div className="sponsors-grid">
            {sponsors.map((sponsor) => (
              <Lift className="sponsor-card" key={sponsor.instagram}>
                <a href={sponsor.instagram} target="_blank" rel="noreferrer" aria-label={`Abrir Instagram ${sponsor.name}`}>
                  <span className="sponsor-logo">
                    <Image src={sponsor.logo} alt={`Logo ${sponsor.name}`} fill sizes="(max-width: 760px) 100vw, 33vw" />
                  </span>
                  <span className="sponsor-meta">
                    <span>{sponsor.segment}</span>
                    <strong>{sponsor.name}</strong>
                    <span className="sponsor-handle">
                      <AtSign size={16} /> {sponsor.handle} <ExternalLink size={14} />
                    </span>
                  </span>
                </a>
              </Lift>
            ))}
          </div>
        </div>
      </section>

      <section className="section carbon-section">
        <div className="container">
          <Reveal className="section-head center">
            <h2>Formatos de Parceria & Ativação</h2>
            <div className="accent-line" />
            <p>Conecte sua empresa a um público apaixonado por velocidade, tecnologia e automobilismo.</p>
          </Reveal>
          <div className="grid-4 gap-20 mb-48">
            {activationBenefits.map((item) => {
              const Icon = item.icon;
              return (
                <Lift className="card" key={item.title}>
                  <Icon size={28} color="var(--acid)" className="mb-12" />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </Lift>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="container grid-2 align-center">
          <Reveal className="section-head">
            <h2>Sua Marca no Alto do Pódio</h2>
            <div className="accent-line" />
            <p>
              Desenvolvemos planos customizados de exposição física e digital para a temporada 2026. Receba nosso media kit com alcance de público, cotas e calendário de etapas.
            </p>
            <div className="button-row">
              <Link className="btn primary" href="/contato">
                <Handshake size={18} /> Solicitar Proposta de Parceria
              </Link>
              <Link className="btn secondary" href="/campeonatos">
                Ver Temporada da Legends
              </Link>
            </div>
          </Reveal>
          <Reveal className="legends-panel">
            <h3>Por Que Investir no Kartismo?</h3>
            <p>
              O kart rental e profissional é a porta de entrada do automobilismo, reunindo empresários, entusiastas e pilotos em eventos de alto impacto social, engajamento genuíno e visibilidade semanal.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
