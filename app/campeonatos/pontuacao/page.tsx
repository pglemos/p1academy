/*
 * Impeccable v4 direction contract - seed a63cbc40.
 * THESIS: a public classification should read like the official sheet, not a marketing hero with a table below.
 * OWN-WORLD: pale report paper, black title bands, fine rules, dense sans type, gold victory marks and green totals.
 * STORY: the reader identifies the current edition, sees the leaders, learns the formula, then audits every heat cell.
 * FIRST VIEWPORT: report masthead, classification band, metric rail, podium and the beginning of the full matrix.
 * FORM: Read mode, user-pinned official-report adaptation; assigned grounded direction is the cutting-bench report sheet.
 * FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
 */

import Link from "next/link";
import {
  ClassificationTable,
  LegendsReportMasthead,
  ReportFormula,
  ReportMetricStrip,
  ReportPodium,
  ReportRankingSummary,
  ReportResultRegister,
  ReportTitleBand,
} from "@/components/LegendsReport";
import { getLegendsPublicData } from "@/lib/p1Data";
import { isSuperFinalHeatType } from "@/lib/p1Types";

export const metadata = {
  title: "Classificação Legends Kart Series | P1 Academy",
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

  return (
    <div className="legends-report-page legends-report-score">
      <div className="container report-document">
        <LegendsReportMasthead publishedAt={publicData.lastPublishedAt} fallbackDate={lastHeatDate} source={publicData.source} />
        <ReportTitleBand
          eyebrow="1ª edição / categoria única"
          title="Classificação geral"
          description="A folha pública da Legends Kart Series: pontuação por diferença de tempo, resultados publicados e classificação auditável por bateria."
          resultCount={resultCount}
          resultNote={`${completeResultCount} completos`}
          pilotCount={pilotCount}
        />

        <nav className="report-nav" aria-label="Navegação do relatório de classificação">
          <Link href="/campeonatos">Hub da competição</Link>
          <a href="#matriz">Matriz completa</a>
          <a href="#leitura-rapida">Leitura rápida</a>
          <a href="#metodo">Método</a>
          <a href="#resultados">Resultados publicados</a>
          <a href={publicData.championship.rulesPdf} target="_blank" rel="noreferrer">Regulamento oficial</a>
          <a className="report-nav-download" href="/api/campeonatos/legends/pdf/geral" target="_blank" rel="noreferrer">Baixar PDF geral</a>
        </nav>

        <section className="report-section report-matrix-section" id="matriz">
          <div className="report-section-heading">
            <h2 id="score-matrix-title">Classificação completa</h2>
            <span>Participações / resultados lançados: {resultCount}</span>
            <p>Deslize horizontalmente no celular para consultar todas as baterias. Os nomes e totais permanecem fixos para a leitura da linha.</p>
          </div>
          {classification.heats.length && classification.rows.length ? (
            <ClassificationTable heats={classification.heats} rows={classification.rows} completedCount={completeResultCount} labelledBy="score-matrix-title" />
          ) : (
            <ReportRankingSummary rows={publicData.ranking} labelledBy="score-matrix-title" />
          )}
          <div className="report-matrix-leaders">
            <div className="report-section-heading">
              <h2 id="score-leaders-title">Pódio atual</h2>
              <span>Leitura de liderança</span>
              <p>O pódio é uma síntese; a matriz acima é a fonte para auditoria.</p>
            </div>
            <ReportPodium rows={classification.rows} />
          </div>
        </section>

        <section className="report-section report-quick-section" id="leitura-rapida">
          <div className="report-section-heading">
            <h2 id="score-quick-title">Leitura rápida</h2>
            <span>Resumo da edição</span>
            <p>Os totais abaixo vêm das baterias publicadas e respeitam o limite de {publicData.championship.validResults.toLowerCase()}.</p>
          </div>

          <ReportMetricStrip
            items={[
              { label: "Pilotos", value: String(pilotCount), note: "no ranking atual" },
              { label: "Publicadas", value: String(resultCount), note: `${completeResultCount} com resultado completo` },
              { label: "Regulares", value: String(classification.heats.filter((heat) => !isSuperFinalHeatType(heat.type)).length || resultCount), note: "em ordem cronológica" },
              { label: "Limite", value: "10 + SF", note: "resultados válidos" },
            ]}
          />
        </section>

        <section className="report-section report-method-section" id="metodo">
          <div className="report-section-heading">
            <h2 id="score-method-title">Como o total é formado</h2>
            <span>Método oficial</span>
            <p>As colunas seguem a ordem das baterias publicadas. Cada célula conserva a pontuação e identifica vitória, resultado retido, ausência, desclassificação ou falta de tempo.</p>
          </div>
          <div className="report-explanation-grid">
            <div>
              <h3>Uma tabela feita para conferência</h3>
              <p>O ranking considera os melhores resultados regulares dentro do limite oficial. Resultados retidos continuam visíveis para que a soma possa ser reconstituída.</p>
              <div className="report-action-row">
                <a className="report-button report-button-primary" href={publicData.championship.rulesPdf} target="_blank" rel="noreferrer">Ler regulamento</a>
                <Link className="report-button" href="/campeonatos">Voltar ao campeonato</Link>
              </div>
            </div>
            <ReportFormula validResults={publicData.championship.validResults} rulesPdf={publicData.championship.rulesPdf} />
          </div>
        </section>

        <section className="report-section report-results-section" id="resultados">
          <div className="report-section-heading">
            <h2 id="score-results-title">Resultados publicados</h2>
            <span>Registro oficial</span>
            <p>Abra o PDF individual de cada bateria para conferir o lançamento original e a melhor volta registrada.</p>
          </div>
          <ReportResultRegister results={publishedResults} />
        </section>

        <footer className="report-footer-note">
          <span>Fonte: P1 Academy / dados publicados da Legends Kart Series 2026</span>
          <strong>Documento de consulta pública</strong>
        </footer>
      </div>
    </div>
  );
}
