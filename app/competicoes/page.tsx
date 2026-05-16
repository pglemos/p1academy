import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Motion";
import { competitions } from "@/data/site";

export const metadata = {
  title: "Competições | P1 Academy",
};

export default function CompeticoesPage() {
  return (
    <>
      <PageHero
        title="Competições"
        text="Campeonatos e formatos de corrida para alunos, pilotos iniciantes, graduados, equipes e experiências especiais."
        image="/images/competition-corner.png"
      />
      <section className="section">
        <div className="container table-like">
          {competitions.map((item) => (
            <Reveal className="row" key={item.title}>
              <strong>{item.title}</strong>
              <span>{item.category}</span>
              <span>{item.date}</span>
              <Link className="btn primary" href="/contato">
                Participar
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="section tight">
        <div className="container grid-3">
          {["Classificação", "Resultados", "Deliberações"].map((title) => (
            <Reveal className="card" key={title}>
              <h3>{title}</h3>
              <p>Área placeholder para tabelas, documentos e atualizações da organização.</p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
