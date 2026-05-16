import { Download, FileText, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Motion";
import { legendsCompetition, legendsPdf } from "@/data/legends";

export const metadata = {
  title: "Regulamento Legends Kart Series | P1 Academy",
};

export default function RegulamentosPage() {
  return (
    <>
      <PageHero
        title="Regulamento"
        text="Documento oficial da Legends Kart Series com regras esportivas, critérios de pontuação, conduta, penalidades, premiação e controle de versões."
        image="/images/timing-telemetry.png"
      />
      <section className="section">
        <div className="container split">
          <Reveal className="section-head">
            <FileText size={30} color="var(--acid)" />
            <h2>{legendsCompetition.name}</h2>
            <div className="accent-line" />
            <p>
              {legendsCompetition.version} - {legendsCompetition.edition} - temporada {legendsCompetition.season}.
            </p>
            <a className="btn primary" href={legendsPdf} target="_blank" rel="noreferrer">
              <Download size={18} /> Baixar PDF oficial
            </a>
          </Reveal>
          <Reveal className="legends-panel">
            <ShieldCheck size={28} color="var(--acid)" />
            <h3>Itens cobertos</h3>
            <p>Organização, inscrições, calendário, karts, indumentária, lastro, formato de disputa, níveis, trocas de kart, pontuação, descartes, desempates, penalidades, direção de provas, premiações e divulgação de imagem.</p>
            <p>Decisões tomadas em briefing e comunicados publicados pela organização prevalecem sempre que houver necessidade operacional ou atualização extraordinária.</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
