import Link from "next/link";
import Image from "next/image";
import { AtSign, ExternalLink, Handshake } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Motion";
import { sponsors } from "@/data/sponsors";

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
        <div className="container sponsors-grid">
          {sponsors.map((sponsor) => (
            <Reveal className="sponsor-card" key={sponsor.instagram}>
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
