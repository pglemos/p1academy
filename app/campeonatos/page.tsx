import Link from "next/link";
import { ChampionshipRegistrationModal } from "@/components/ChampionshipRegistrationForm";
import {
  ClassificationTable,
  LegendsReportMasthead,
  ReportRankingSummary,
  ReportResultRegister,
  ReportTitleBand,
  formatReportPublicationDate,
} from "@/components/LegendsReport";
import { getLegendsPublicData } from "@/lib/p1Data";
import { isSuperFinalHeatType } from "@/lib/p1Types";

export const metadata = {
  title: "Legends Kart Series | P1 Academy",
};

export const dynamic = "force-dynamic";

export default async function CampeonatosPage() {
  const publicData = await getLegendsPublicData();
  const { championship, ranking, results, classification } = publicData;
  const publishedResults = results.filter((result) => result.winner !== "A definir");
  const completeResultCount = publishedResults.filter((result) => result.complete).length;
  const pilotCount = classification.rows.length || ranking.filter((row) => row.points !== "-").length;
  const resultCount = classification.heats.length || publishedResults.length;
  const lastHeatDate = classification.heats.at(-1)?.date ?? publishedResults.at(-1)?.date ?? "Sem publicação";
  const publicationDate = formatReportPublicationDate(publicData.lastPublishedAt, lastHeatDate);
  const regularHeatCount = classification.heats.filter((heat) => !isSuperFinalHeatType(heat.type)).length || resultCount;

  return (
    <>
      <ChampionshipRegistrationModal />
      <div className="legends-report-page legends-report-hub">
        {/* Official-report contract: facts and the current classification lead; supporting links stay secondary. */}
        <div className="container report-document">
          <LegendsReportMasthead publishedAt={publicData.lastPublishedAt} fallbackDate={lastHeatDate} source={publicData.source} />
          <ReportTitleBand
            eyebrow={`${championship.edition} · categoria única · temporada ${championship.season}`}
            title={championship.name}
            description="Acompanhe a classificação oficial, os resultados publicados e os documentos da Legends Kart Series em uma única folha de consulta."
            resultCount={resultCount}
            resultNote={`${completeResultCount} completas`}
            pilotCount={pilotCount}
          />

          <div className="report-action-row report-action-row-top" aria-label="Ações oficiais">
            <Link className="report-button report-button-primary" href="/campeonatos/pontuacao">Abrir classificação completa</Link>
            <button className="report-button" type="button" data-registration-trigger>Quero participar</button>
            <a className="report-button" href={championship.rulesPdf} target="_blank" rel="noreferrer">Regulamento PDF</a>
          </div>

          <nav className="report-subnav" aria-label="Atalhos do campeonato">
            <a href="#classificacao">Classificação</a>
            <a href="#documentos">Documentos</a>
            <a href="#resultados">Resultados publicados</a>
            <a href="/tracados#galeria-tracados">Traçados</a>
            <button type="button" data-registration-trigger>Inscrição</button>
          </nav>

          <section className="report-section report-classification-section" id="classificacao">
            <div className="report-section-bar">
              <div>
                <h2 id="hub-classification-title">Classificação atual</h2>
                <p>Os 10 primeiros pilotos aparecem abaixo. A matriz organiza os melhores resultados; o registro oficial conserva cada bateria publicada.</p>
              </div>
              <div className="report-section-count">
                <strong>{publicationDate}</strong>
                <span>{regularHeatCount} baterias regulares · {pilotCount} pilotos</span>
              </div>
            </div>
            {classification.heats.length && classification.rows.length ? (
              <ClassificationTable heats={classification.heats} rows={classification.rows} limit={10} completedCount={completeResultCount} labelledBy="hub-classification-title" />
            ) : (
              <ReportRankingSummary rows={ranking.slice(0, 10)} labelledBy="hub-classification-title" />
            )}
            <div className="report-action-row report-action-row-end">
              <Link className="report-button report-button-primary" href="/campeonatos/pontuacao">Ver matriz completa</Link>
              <a className="report-button" href="/api/campeonatos/legends/pdf/geral" target="_blank" rel="noreferrer">Baixar resultado geral</a>
            </div>
          </section>

          <section className="report-section report-documents-section" id="documentos">
            <div className="report-section-bar">
              <div>
                <h2>Documentos oficiais</h2>
                <p>Fontes públicas para conferir regras, agenda e classificação sem perder o contexto da edição.</p>
              </div>
            </div>
            <div className="report-document-links">
              <a className="report-document-link" href="/campeonatos/pontuacao">
                <span>01</span>
                <strong>Classificação geral</strong>
                <small>{pilotCount} pilotos · {resultCount} baterias lançadas</small>
              </a>
              <a className="report-document-link" href={championship.calendarPdf} target="_blank" rel="noreferrer">
                <span>02</span>
                <strong>Calendário oficial</strong>
                <small>{publicData.calendarSummary.totalRaces} corridas entre {publicData.calendarSummary.firstRace} e {publicData.calendarSummary.finalRace}</small>
              </a>
              <a className="report-document-link" href={championship.rulesPdf} target="_blank" rel="noreferrer">
                <span>03</span>
                <strong>Regulamento</strong>
                <small>{championship.version} · publicado em {championship.versionDate}</small>
              </a>
            </div>
          </section>

          <section className="report-section report-results-section" id="resultados">
            <div className="report-section-bar">
              <div>
                <h2>Resultados publicados</h2>
                <p>Abra o documento de cada bateria para conferir o tempo vencedor e o lançamento original.</p>
              </div>
              <div className="report-section-count">
                <strong>{publishedResults.length}</strong>
                <span>documentos disponíveis</span>
              </div>
            </div>
            <ReportResultRegister results={publishedResults} />
          </section>

          <footer className="report-footer-note">
            <span>Fonte: P1 Academy · Legends Kart Series {championship.season}</span>
            <strong>{publicData.source === "supabase" ? "Dados publicados" : "Prévia local"}</strong>
          </footer>
        </div>
      </div>
    </>
  );
}
