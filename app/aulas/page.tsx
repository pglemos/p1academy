import Link from "next/link";
import { BookingForm } from "@/components/BookingForm";
import { MediaFrame } from "@/components/MediaFrame";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Motion";
import { programs } from "@/data/site";

export const metadata = {
  title: "Aulas de Kart | P1 Academy",
};

export default function AulasPage() {
  return (
    <>
      <PageHero
        title="Aulas de kart"
        text="Treinos para primeira bateria, evolução técnica e preparação para campeonatos com briefing, condução e análise."
        image="/images/academy-coaching.png"
      />
      <section className="section">
        <div className="container grid-3">
          {programs.map((program, index) => (
            <Reveal className="feature-card" key={program.title}>
              <MediaFrame
                label={program.label}
                src={["/images/academy-coaching.png", "/images/hero-kart-night.png", "/images/competition-corner.png"][index]}
                alt={program.title}
              />
              <div className="feature-body">
                <h3>{program.title}</h3>
                <p>{program.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="section tight">
        <div className="container grid-2">
          <Reveal className="section-head">
            <h2>Do briefing ao grid</h2>
            <div className="accent-line" />
            <p>
              O aluno entende postura, aceleração, freada, tangência, bandeiras, convivência de pista e como ler uma corrida sem depender apenas de instinto.
            </p>
            <Link className="btn secondary" href="/dicas">
              Ver dicas técnicas
            </Link>
          </Reveal>
          <BookingForm />
        </div>
      </section>
    </>
  );
}
