import Link from "next/link";
import { Calculator, Trophy } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Motion";
import { legendsCompetition, legendsRankingPreview } from "@/data/legends";

export const metadata = {
  title: "Classificação Legends Kart Series | P1 Academy",
};

export default function RankingPage() {
  return (
    <>
      <PageHero
        title="Classificação"
        text="Ranking oficial da Legends Kart Series com base nas melhores pontuações válidas de cada piloto ao longo da temporada."
        image="/images/timing-telemetry.png"
      />
      <section className="section">
        <div className="container split">
          <Reveal className="section-head">
            <Trophy size={30} color="var(--acid)" />
            <h2>{legendsCompetition.name}</h2>
            <div className="accent-line" />
            <p>
              A classificação geral considerará os melhores resultados do piloto, com limite de 10 corridas válidas para pontuação regular. Os classificados para a Super Final podem somar uma corrida extra.
            </p>
            <div className="button-row">
              <Link className="btn secondary" href="/competicoes#classificacao">
                Ver hub da competição
              </Link>
              <Link className="btn primary" href="/competicoes/pontuacao">
                <Calculator size={18} /> Sistema de pontuação
              </Link>
            </div>
          </Reveal>
          <div className="table-like">
            {legendsRankingPreview.map((item) => (
              <Reveal className="row" key={`${item.position}-${item.driver}`}>
                <strong>
                  {item.position} {item.driver}
                </strong>
                <span>{item.level}</span>
                <span>{item.points} pontos</span>
                <span>{item.valid}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
