import Link from "next/link";
import { Handshake } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Motion";
import { sponsors } from "@/data/site";

export const metadata = {
  title: "Patrocinadores | P1 Academy",
};

export default function PatrocinadoresPage() {
  return (
    <>
      <PageHero
        title="Patrocinadores"
        text="Marcas associadas a velocidade, performance, comunidade, conteúdo e experiências memoráveis dentro e fora da pista."
        image="/images/hero-kart-night.png"
      />
      <section className="section">
        <div className="container grid-3">
          {sponsors.map((sponsor) => (
            <Reveal className="card" key={sponsor}>
              <h3>{sponsor}</h3>
              <p>Bloco de marca temporário para logo, descrição curta e presença na temporada.</p>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="section tight">
        <div className="container split">
          <Reveal className="section-head">
            <h2>Entre no grid da marca</h2>
            <div className="accent-line" />
            <p>Ativação em eventos, conteúdo social, ranking, fotos, vídeos, premiação e experiências corporativas.</p>
          </Reveal>
          <Reveal className="card">
            <Handshake size={28} color="var(--gold)" />
            <h3>Plano de patrocínio</h3>
            <p>Solicite uma conversa para receber formatos, cotas e calendário de exposição.</p>
            <Link className="btn primary" href="/contato">
              Quero patrocinar
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
