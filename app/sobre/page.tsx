import Link from "next/link";
import {
  Award,
  CalendarCheck,
  CheckCircle2,
  Compass,
  Flag,
  Gauge,
  HeartHandshake,
  MapPin,
  Newspaper,
  ShieldCheck,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import { MediaFrame } from "@/components/MediaFrame";
import { PageHero } from "@/components/PageHero";
import { Lift, Reveal } from "@/components/Motion";

export const metadata = {
  title: "Sobre a P1 Academy | Drive to Perfection",
  description:
    "A história, metodologia e autoridade da P1 Academy: formando pilotos de alta performance e gerindo a auditoria oficial da Legends Kart Series no Kartódromo Internacional de Betim.",
};

const pillars = [
  {
    icon: Award,
    title: "Autoridade de Pista",
    text: "Treinamentos estruturados sob a liderança do Campeão Brasileiro André Felisberto, combinando técnica de chassi, freada e consistência mental.",
  },
  {
    icon: Gauge,
    title: "Rigor de Telemetria",
    text: "Dados reais em 3 casas decimais. Do delta de setor na aula de kart ao cálculo milimétrico de descarte na Legends Kart Series.",
  },
  {
    icon: ShieldCheck,
    title: "Segurança & Convivência",
    text: "Disputa limpa e técnica. Formamos pilotos que sabem ultrapassar com inteligência e respeitar os limites de pista e os adversários.",
  },
  {
    icon: Sparkles,
    title: "Experiência de Paddock",
    text: "Briefing profissional, cronometragem em tempo real, certificados, relatórios oficiais em PDF e comunidade ativa de automobilismo.",
  },
];

export default function SobrePage() {
  return (
    <>
      <PageHero
        title="Sobre a P1 Academy"
        text="A academia de alta performance que une a metodologia prática de um Campeão Brasileiro à precisão documental da Legends Kart Series no Kartódromo Internacional de Betim."
        image="/images/academy-coaching.png"
      />

      <section className="section tight">
        <div className="container grid-2 align-center">
          <Reveal>
            <MediaFrame label="Paddock & Pista" src="/images/academy-coaching.png" alt="Instrutor orientando piloto em kart" tall />
          </Reveal>
          <Reveal className="section-head">
            <span className="tip-tag mb-12 inline-block">Manifesto de Performance</span>
            <h2>Método Antes da Pressa</h2>
            <div className="accent-line" />
            <p>
              A P1 Academy nasceu para preencher a lacuna entre o kart de lazer e o automobilismo competitivo. Acreditamos que a evolução na pista não é fruto de sorte ou improviso, mas de técnica repetível, leitura de traçado e controle biomecânico.
            </p>
            <p>
              Seja na formação de um rookie que nunca sentou em um kart ou na homologação de uma bateria com 30 karts na Legends Kart Series, nossa missão é entregar excelência esportiva e transparência total.
            </p>
            <div className="button-row section-actions">
              <Link className="btn primary" href="/andre-felisberto">
                <Trophy size={18} /> Conhecer André Felisberto
              </Link>
              <Link className="btn secondary" href="/aulas">
                <CalendarCheck size={18} /> Ver Nossos Treinos
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section carbon-section">
        <div className="container">
          <Reveal className="section-head center">
            <h2>Nossos Pilares Fundamentais</h2>
            <div className="accent-line" />
            <p>Os princípios que guiam cada volta rápida, aula ministrada e relatório homologado.</p>
          </Reveal>
          <div className="grid-4 gap-20">
            {pillars.map((item) => {
              const Icon = item.icon;
              return (
                <Lift className="card" key={item.title}>
                  <Icon size={28} color="var(--gold)" className="mb-12" />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </Lift>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="container stat-strip">
          <div className="stat">
            <strong>90+</strong>
            <span>Pilotos na Temporada</span>
          </div>
          <div className="stat">
            <strong>18+</strong>
            <span>Baterias Homologadas</span>
          </div>
          <div className="stat">
            <strong>100%</strong>
            <span>Auditabilidade Oficial</span>
          </div>
          <div className="stat">
            <strong>Betim</strong>
            <span>Pista Sede Oficial</span>
          </div>
        </div>
      </section>
    </>
  );
}
