import { MediaFrame } from "@/components/MediaFrame";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Motion";
import { iconHighlights } from "@/data/site";
import Link from "next/link";

export const metadata = {
  title: "Sobre | P1 Academy",
};

export default function SobrePage() {
  return (
    <>
      <PageHero
        title="Sobre a P1"
        text="Uma academia de kart pensada para transformar curiosidade em repertório de pista, e repertório em performance competitiva."
        image="/images/academy-coaching.png"
      />
      <section className="section">
        <div className="container split">
          <Reveal>
            <MediaFrame label="Equipe e pista" src="/images/academy-coaching.png" alt="Instrutor orientando piloto em kart" tall />
          </Reveal>
          <Reveal className="section-head">
            <h2>Método antes da pressa</h2>
            <div className="accent-line" />
            <p>
              A P1 Academy combina linguagem de competição com acolhimento para iniciantes. Cada piloto recebe orientação clara, contexto de segurança e metas possíveis para evoluir sem improviso.
            </p>
            <div className="button-row section-actions">
              <Link className="btn primary" href="/andre-felisberto">
                Conhecer André Felisberto
              </Link>
              <Link className="btn secondary" href="/aulas">
                Ver aulas
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="section tight">
        <div className="container grid-3">
          {iconHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <Reveal className="card" key={item.title}>
                <Icon size={26} color="var(--cyan)" />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </Reveal>
            );
          })}
        </div>
      </section>
      <section className="section tight">
        <div className="container stat-strip">
          <div className="stat">
            <strong>04</strong>
            <span>Níveis de treino</span>
          </div>
          <div className="stat">
            <strong>360</strong>
            <span>Visão da experiência</span>
          </div>
          <div className="stat">
            <strong>100%</strong>
            <span>Foco em segurança</span>
          </div>
          <div className="stat">
            <strong>P1</strong>
            <span>Branding de pista</span>
          </div>
        </div>
      </section>
    </>
  );
}
