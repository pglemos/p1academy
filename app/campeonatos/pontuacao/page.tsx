import Link from "next/link";
import { ClassificationTable } from "@/components/LegendsClassificationTable";
import {
  LegendsReportMasthead,
  ReportFormula,
  ReportLeaderStrip,
  ReportRankingSummary,
  ReportResultRegister,
  ReportTitleBand,
} from "@/components/LegendsReport";
import { getLegendsPublicData } from "@/lib/p1Data";
import { isSuperFinalHeatType } from "@/lib/p1Types";

export const metadata = {
  title: "Classificação geral",
};

export const dynamic = "force-dynamic";

export default async function LegendsPontuacaoPage() {
  const publicData = await getLegendsPublicData();
  const classification = publicData.classification;
  const publishedResults = publicData.results.filter((result) => result.winner !== "A definir");
  const completeResultCount = publishedResults.filter((result) => result.complete).length;
  const pilotCount = classification.rows.length || publicData.ranking.filter((row) => row.points !== "-").length;
  const resultCount = classification.heats.length || publishedResults.length;
  const lastHeatDate = classification.heats.at(-1)?.date ?? publishedResults.at(-1)?.date ?? "Sem publicação";
  const regularHeatCount = classification.heats.filter((heat) => !isSuperFinalHeatType(heat.type)).length || resultCount;
  const superFinalHeat = classification.heats.find((heat) => isSuperFinalHeatType(heat.type));
  const hasPublishedSuperFinal = Boolean(superFinalHeat && publishedResults.some((result) => result.heat === superFinalHeat.title && result.complete));

  return (
    <div className="legends-report-page legends-report-score">
      {/* Official-report contract: the matrix is the first-class artifact; explanation follows the rows. */}
      <div className="container report-document">
        <LegendsReportMasthead publishedAt={publicData.lastPublishedAt} fallbackDate={lastHeatDate} source={publicData.source} />
        <ReportTitleBand
          eyebrow={`${publicData.championship.edition} · categoria única · temporada ${publicData.championship.season}`}
          title="Classificação geral"
          description="Tabela oficial por bateria, com pontuação, vitórias, resultados retidos e total de cada piloto."
          resultCount={resultCount}
          resultNote={`${completeResultCount} completas`}
          pilotCount={pilotCount}
        />
        <ReportLeaderStrip rows={classification.rows} />

        <nav className="report-subnav" aria-label="Atalhos da classificação">
          <Link href="/campeonatos">Campeonato</Link>
          <a href="#matriz">Matriz completa</a>
          <a href="#metodo">Como ler</a>
          <a href="#resultados">Resultados publicados</a>
          <a className="report-subnav-accent" href="/api/campeonatos/legends/pdf/geral" target="_blank" rel="noreferrer">Baixar PDF geral</a>
        </nav>

        <section className="report-section report-matrix-section" id="matriz">
          <div className="report-section-bar">
            <div>
              <h2 id="score-matrix-title">Matriz de pontuação</h2>
              <p>Cada coluna representa uma bateria publicada, em ordem cronológica. No celular, use a leitura rápida ou deslize horizontalmente para conferir a matriz.</p>
            </div>
            <div className="report-section-count">
              <strong>{regularHeatCount} baterias regulares</strong>
              <span>{hasPublishedSuperFinal ? "Super Final publicada" : "Super Final não publicada"} · {pilotCount} pilotos · {resultCount} lançamentos</span>
            </div>
          </div>
          {classification.heats.length && classification.rows.length ? (
            <ClassificationTable heats={classification.heats} rows={classification.rows} completedCount={completeResultCount} labelledBy="score-matrix-title" />
          ) : (
            <ReportRankingSummary rows={publicData.ranking} labelledBy="score-matrix-title" />
          )}
        </section>

        <section className="report-section report-method-section" id="metodo">
          <div className="report-section-bar">
            <div>
              <h2>Como ler a folha</h2>
              <p>O total é a soma dos melhores resultados regulares dentro do limite do regulamento, mais a Super Final quando publicada.</p>
            </div>
          </div>
          <ReportFormula validResults={publicData.championship.validResults} rulesPdf={publicData.championship.rulesPdf} />
        </section>

        <section className="report-section report-results-section" id="resultados">
          <div className="report-section-bar">
            <div>
              <h2>Resultados publicados</h2>
              <p>O PDF individual preserva a ordem e os tempos do lançamento original.</p>
            </div>
            <div className="report-section-count">
              <strong>{publishedResults.length}</strong>
              <span>documentos disponíveis</span>
            </div>
          </div>
          <ReportResultRegister results={publishedResults} />
        </section>

        <footer className="report-footer-note">
          <span>Fonte: P1 Academy · Legends Kart Series {publicData.championship.season}</span>
          <strong>{publicData.source === "supabase" ? "Dados publicados" : "Prévia local"}</strong>
        </footer>
      </div>
    </div>
  );
}
