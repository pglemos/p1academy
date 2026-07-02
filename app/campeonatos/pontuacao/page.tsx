import Link from "next/link";
import { Calculator, Download, Trophy } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Motion";
import { legendsCompetition, legendsPdf } from "@/data/legends";
import { getLegendsPublicData } from "@/lib/p1Data";

export const metadata = {
  title: "Sistema de Pontuação Legends Kart Series | P1 Academy",
};

export const dynamic = "force-dynamic";

export default async function LegendsPontuacaoPage() {
  const publicData = await getLegendsPublicData();
  const publishedResults = publicData.results.filter((result) => result.winner !== "A definir");
  const publishedRanking = publicData.ranking.filter((row) => row.points !== "-");

  return (
    <>
      <PageHero
        compact
        title="Sistema de pontuação Legends"
        text="Consulta pública dos resultados oficiais, classificação atual e regra de pontuação da Legends Kart Series."
        image="/images/timing-telemetry.png"
      />

      <section className="section tight">
        <div className="container legends-shell">
          <Reveal className="legends-status">
            <div>
              <span className="eyebrow">Regra oficial</span>
              <h2>Tomada direta, pontuação por tempo</h2>
              <p>
                Em bateria regular, o melhor tempo soma 10,000 pontos. Os demais pilotos pontuam pela diferença em
                segundos para a melhor volta da bateria. Na Super Final, a base é 5,000 pontos.
              </p>
            </div>
            <div className="button-row">
              <a className="btn secondary" href={legendsPdf} target="_blank" rel="noreferrer">
                <Download size={18} /> Regulamento
              </a>
              <Link className="btn ghost" href="/admin">
                <Trophy size={18} /> Admin
              </Link>
            </div>
          </Reveal>

          <div className="scoring-rules-grid">
            <Reveal className="metric-card">
              <Calculator size={22} />
              <strong>10,000</strong>
              <span>base da bateria regular</span>
            </Reveal>
            <Reveal className="metric-card">
              <Calculator size={22} />
              <strong>5,000</strong>
              <span>base da Super Final</span>
            </Reveal>
            <Reveal className="metric-card">
              <Calculator size={22} />
              <strong>1,000</strong>
              <span>mínimo acima de 9s</span>
            </Reveal>
            <Reveal className="metric-card">
              <Calculator size={22} />
              <strong>{publishedRanking.length || "0"}</strong>
              <span>pilotos classificados</span>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section tight carbon-section">
        <div className="container legends-public-layout">
          <Reveal className="section-head">
            <Trophy size={30} color="var(--acid)" />
            <h2>Resultados publicados</h2>
            <div className="accent-line" />
            <p>Resultados oficiais publicados no admin para a Legends Kart Series 2026.</p>
          </Reveal>

          <div className="table-like legends-public-table">
            <div className="row results-row results-row-head" aria-hidden="true">
              <strong>Bateria</strong>
              <span>Data</span>
              <span>Vencedor</span>
              <span>Melhor volta</span>
              <span>PDF</span>
            </div>
            {publishedResults.map((item) => (
              <Reveal className="row results-row" key={item.heat}>
                <strong>{item.heat}</strong>
                <span>{item.date}</span>
                <span>{item.winner}</span>
                <span>{item.bestLap}</span>
                {item.pdfHref ? (
                  <a className="btn ghost compact-action" href={item.pdfHref} target="_blank" rel="noreferrer">
                    <Download size={18} /> Baixar PDF
                  </a>
                ) : (
                  <span>-</span>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="container legends-public-layout">
          <Reveal className="section-head">
            <Calculator size={30} color="var(--acid)" />
            <h2>Classificação completa</h2>
            <div className="accent-line" />
            <p>Todos os pilotos com pontuação válida nas baterias publicadas.</p>
            <a className="btn secondary compact-download" href="/api/campeonatos/legends/pdf/geral" target="_blank" rel="noreferrer">
              <Download size={18} /> Baixar resultado geral
            </a>
          </Reveal>

          <div className="table-like legends-public-table legends-ranking-table">
            <div className="row ranking-row ranking-row-head" aria-hidden="true">
              <strong>Piloto</strong>
              <span>Status</span>
              <span>Pontos</span>
              <span>Baterias</span>
            </div>
            {publishedRanking.map((item) => (
              <Reveal className="row ranking-row" key={`${item.position}-${item.driver}`}>
                <strong>{item.position} {item.driver}</strong>
                <span>{item.level}</span>
                <span>{item.points} pontos</span>
                <span>{item.valid}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section tight carbon-section">
        <div className="container grid-2 align-start">
          <Reveal className="section-head">
            <h2>Lançamento somente no admin</h2>
            <div className="accent-line" />
            <p>
              Esta página pública é apenas para consulta. O lançamento, correção e publicação de baterias ficam
              restritos ao painel administrativo.
            </p>
            <Link className="btn primary" href="/admin">
              <Trophy size={18} /> Abrir admin
            </Link>
          </Reveal>

          <Reveal className="legends-panel">
            <h3>{legendsCompetition.name}</h3>
            <p>Os dados exibidos são carregados das baterias publicadas oficialmente.</p>
            <p>Campos de edição foram removidos desta rota pública.</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
