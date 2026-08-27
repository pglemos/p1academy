/*
 * Impeccable v4 direction contract - seed a63cbc40.
 * THESIS: the championship hub is the cover and index of an official report, so facts lead and promotion follows.
 * OWN-WORLD: pale report paper, black bands, squared frames, fine rules, gold marks and restrained green totals.
 * STORY: a visitor understands the edition, finds the live classification, then follows calendar, rules and race records.
 * FIRST VIEWPORT: report masthead, edition band, status, quick facts, actions and the first classification excerpt.
 * FORM: Read mode, user-pinned official-report adaptation; assigned grounded direction is the cutting-bench report sheet.
 * FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
 */

import Image from "next/image";
import Link from "next/link";
import { ChampionshipRegistrationModal } from "@/components/ChampionshipRegistrationForm";
import {
  ClassificationTable,
  LegendsReportMasthead,
  ReportFormula,
  ReportMetricStrip,
  ReportPodium,
  ReportRankingSummary,
  ReportResultRegister,
  ReportTitleBand,
  formatReportPublicationDate,
} from "@/components/LegendsReport";
import { Reveal } from "@/components/Motion";
import {
  legendsAchievements,
  legendsCompetition,
  legendsLevels,
  legendsPhotoSets,
  legendsSections,
  legendsSponsors,
  legendsStageInfo,
  legendsStory,
  legendsSummary,
} from "@/data/legends";
import { getLegendsPublicData } from "@/lib/p1Data";
import { isSuperFinalHeatType } from "@/lib/p1Types";

export const metadata = {
  title: "Legends Kart Series | P1 Academy",
};

export const dynamic = "force-dynamic";

export default async function CampeonatosPage() {
  const publicData = await getLegendsPublicData();
  const { championship, calendarSummary, calendarMonths, ranking, results, classification } = publicData;
  const publishedResults = results.filter((result) => result.winner !== "A definir");
  const completeResultCount = publishedResults.filter((result) => result.complete).length;
  const pilotCount = classification.rows.length || ranking.filter((row) => row.points !== "-").length;
  const resultCount = classification.heats.length || publishedResults.length;
  const lastHeatDate = classification.heats.at(-1)?.date ?? publishedResults.at(-1)?.date ?? "Sem publicação";
  const publicationDate = formatReportPublicationDate(publicData.lastPublishedAt, lastHeatDate);
  const publicationLabel = publicData.lastPublishedAt ? `Dados publicados em ${publicationDate}` : `Última bateria ${lastHeatDate}`;
  const regularHeatCount = classification.heats.filter((heat) => !isSuperFinalHeatType(heat.type)).length || resultCount;
  const reportMetrics = [
    { label: "Pilotos", value: String(pilotCount), note: "no ranking atual" },
    { label: "Publicadas", value: String(resultCount), note: "baterias lançadas" },
    { label: "Regulares", value: String(regularHeatCount), note: "em ordem cronológica" },
    { label: "Limite", value: "10 + SF", note: "resultados válidos" },
  ];

  return (
    <>
      <ChampionshipRegistrationModal />
      <div className="legends-report-page legends-report-hub">
        <div className="container report-document">
          <LegendsReportMasthead publishedAt={publicData.lastPublishedAt} fallbackDate={lastHeatDate} source={publicData.source} />
          <ReportTitleBand
            eyebrow="1ª edição oficial / temporada 2026"
            title={championship.name}
            description="O caderno público da Legends Kart Series: calendário, regras, resultados publicados e classificação por desempenho real na pista."
            resultCount={resultCount}
            resultNote={`${completeResultCount} completos`}
            pilotCount={pilotCount}
          />

          <div className="report-cover-actions">
            <Link className="report-button report-button-primary" href="/campeonatos/pontuacao">Abrir classificação completa</Link>
            <button className="report-button" type="button" data-registration-trigger>Quero participar</button>
            <a className="report-button" href={championship.rulesPdf} target="_blank" rel="noreferrer">Baixar regulamento</a>
          </div>

          <nav className="report-nav" aria-label="Navegação da Legends Kart Series">
            <button type="button" data-registration-trigger>Inscrição</button>
            {legendsSections.map((section) => (
              <a href={section.href} key={section.href}>{section.label}</a>
            ))}
          </nav>

          <section className="report-section report-classification-section report-classification-preview-section" id="classificacao">
            <div className="report-section-heading">
              <h2 id="hub-classification-preview-title">Quem está na frente</h2>
              <span>Classificação geral / {publicationLabel}</span>
              <p>Os líderes e as métricas abaixo vêm do mesmo conjunto publicado que alimenta a matriz completa.</p>
            </div>
            <ReportMetricStrip items={reportMetrics} />
            {classification.heats.length && classification.rows.length ? (
              <ClassificationTable heats={classification.heats} rows={classification.rows} limit={5} completedCount={completeResultCount} labelledBy="hub-classification-preview-title" />
            ) : (
              <ReportRankingSummary rows={ranking.slice(0, 5)} labelledBy="hub-classification-preview-title" />
            )}
            <div className="report-action-row report-action-row-end">
              <Link className="report-button report-button-primary" href="#classificacao-completa">Abrir matriz completa</Link>
              <Link className="report-button" href="/campeonatos/pontuacao">Ver sistema de pontuação</Link>
            </div>
          </section>

          <section className="report-section report-cover-section">
            <div className="report-cover-grid">
              <div className="report-cover-copy">
                <h2>Uma temporada para medir no detalhe.</h2>
                <span className="report-section-kicker">Calendário oficial publicado</span>
                <p>{legendsStory[0]}</p>
                <p>{legendsStory[1]}</p>
                <div className="report-action-row">
                  <Link className="report-button report-button-primary" href="#classificacao">Ver classificação</Link>
                  <Link className="report-button" href="#calendario-oficial">Ver calendário</Link>
                </div>
              </div>
              <aside className="report-venue-block">
                <span>Sede oficial</span>
                <strong>{championship.venue}</strong>
                <p>{championship.address}</p>
                <p>Organização: {championship.organizer}</p>
                <p>{championship.format} / {championship.ballast}</p>
              </aside>
            </div>
          </section>

          <section className="report-section report-story-section">
            <div className="report-section-heading">
              <h2>Contra o relógio, com método</h2>
              <span>Sobre a competição</span>
              <p>{legendsStory[2]}</p>
              <p>{legendsStory[3]}</p>
            </div>
            <div className="report-plain-grid">
              {legendsSummary.map((item) => (
                <article className="report-plain-block" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="report-section report-calendar-section" id="calendario-oficial">
            <div className="report-section-heading">
              <h2>Calendário 2026</h2>
              <span>Agenda oficial</span>
              <p>{calendarSummary.totalRaces} corridas oficiais entre {calendarSummary.firstRace} e {calendarSummary.finalRace}. Quartas: {calendarSummary.weekdayWindows.replace(/^Quartas\s+/i, "")}; sábados: {calendarSummary.saturdayWindow.replace(/^Sábados\s+/i, "")}.</p>
            </div>
            <div className="report-data-grid report-calendar-facts">
              <div><span>Período</span><strong>{calendarSummary.months}</strong></div>
              <div><span>Quarta</span><strong>{calendarSummary.weekdayWindows}</strong></div>
              <div><span>Sábado</span><strong>{calendarSummary.saturdayWindow}</strong></div>
              <a className="report-button report-button-primary" href={championship.calendarPdf} target="_blank" rel="noreferrer">Baixar calendário PDF</a>
            </div>
            <div className="report-calendar-grid">
              {calendarMonths.map((month) => (
                <article className="report-calendar-block" key={month.month}>
                  <h3>{month.month}</h3>
                  <table>
                    <thead><tr><th scope="col">Corrida</th><th scope="col">Data</th><th scope="col">Dia</th><th scope="col">Hora</th></tr></thead>
                    <tbody>
                      {month.races.map((race) => (
                        <tr key={`${month.month}-${race.race}-${race.date}-${race.time}`}>
                          <th scope="row">{race.race}</th><td>{race.date.slice(0, 5)}</td><td>{race.day}</td><td>{race.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </article>
              ))}
            </div>
          </section>

          <section className="report-section report-classification-section" id="classificacao-completa">
            <div className="report-section-heading">
              <h2 id="hub-classification-title">Prévia da classificação</h2>
              <span>Top 10 / {publicationLabel}</span>
              <p>Os 10 primeiros aparecem abaixo como índice do relatório. A matriz completa, com cada piloto e bateria, está disponível na página de pontuação.</p>
            </div>
            <ReportPodium rows={classification.rows} />
            {classification.heats.length && classification.rows.length ? (
              <ClassificationTable heats={classification.heats} rows={classification.rows} limit={10} completedCount={completeResultCount} labelledBy="hub-classification-title" />
            ) : (
              <ReportRankingSummary rows={ranking.slice(0, 10)} labelledBy="hub-classification-title" />
            )}
            <div className="report-action-row report-action-row-end">
              <Link className="report-button report-button-primary" href="/campeonatos/pontuacao">Abrir matriz completa</Link>
              <a className="report-button" href="/api/campeonatos/legends/pdf/geral" target="_blank" rel="noreferrer">Baixar resultado geral</a>
            </div>
          </section>

          <section className="report-section report-results-section" id="resultados">
            <div className="report-section-heading">
              <h2>Resultados das baterias</h2>
              <span>Registro oficial</span>
              <p>Os lançamentos ficam disponíveis em PDF para conferência de tempos e pontuação.</p>
            </div>
            <ReportResultRegister results={publishedResults} />
          </section>

          <section className="report-section report-info-section" id="etapas">
            <div className="report-section-heading">
              <h2>Informações das etapas</h2>
              <span>Operação de pista</span>
              <p>O mesmo padrão de briefing e organização acompanha todas as baterias publicadas.</p>
            </div>
            <div className="report-plain-grid report-plain-grid-wide">
              {legendsStageInfo.map((item) => <article className="report-plain-block" key={item.label}><h3>{item.label}</h3><p>{item.value}</p></article>)}
            </div>
          </section>

          <section className="report-section report-rules-section" id="regulamento">
            <div className="report-section-heading">
              <h2>Regulamento e critérios</h2>
              <span>Documento oficial</span>
              <p>{championship.version}, publicado em {championship.versionDate}. A regra completa prevalece sobre qualquer resumo desta página.</p>
            </div>
            <div className="report-rules-grid">
              <ReportFormula validResults={championship.validResults} rulesPdf={championship.rulesPdf} />
              <div className="report-rule-copy">
                <h3>Regras-chave</h3>
                <p>{legendsCompetition.kartFleet}</p>
                <p>Troca de kart permitida a critério do piloto, limitada a uma troca por corrida, conforme as condições do regulamento.</p>
                <p>Premiação com troféus para os 10 melhores pilotos do campeonato e troféu especial para o vencedor da Super Final.</p>
              </div>
            </div>
          </section>

          <section className="report-section report-levels-section" id="niveis">
            <div className="report-section-heading">
              <h2>Níveis dos pilotos</h2>
              <span>Leitura de desempenho</span>
              <p>A divisão orienta corridas para perfis específicos; a disputa geral permanece em categoria única.</p>
            </div>
            <div className="report-level-grid">
              {legendsLevels.map((item) => <div key={item.level}><strong>{item.level}</strong><span>{item.criteria}</span></div>)}
            </div>
          </section>

          <section className="report-section report-achievements-section" id="conquistas">
            <div className="report-section-heading">
              <h2>Conquistas</h2>
              <span>Além da tabela</span>
              <p>Reconhecimentos para evolução, consistência, superação e momentos marcantes.</p>
            </div>
            <ul className="report-achievement-list">
              {legendsAchievements.map((item) => <li key={item.title}><strong>{item.title}</strong><span>{item.text}</span></li>)}
            </ul>
          </section>

          <section className="report-section report-gallery-section" id="fotos">
            <div className="report-section-heading">
              <h2>Fotos</h2>
              <span>Arquivo visual</span>
              <p>Etapas, bastidores, preparação e pódios da temporada.</p>
            </div>
            <div className="report-photo-grid">
              {legendsPhotoSets.map((item) => (
                <Reveal className="report-photo-card" key={item.title}>
                  <div className="report-photo-media"><Image src={item.image} alt={item.title} fill sizes="(max-width: 800px) 100vw, 33vw" /></div>
                  <span>{item.title}</span><strong>{item.text}</strong>
                </Reveal>
              ))}
            </div>
          </section>

          <section className="report-section report-sponsors-section" id="patrocinadores">
            <div className="report-section-heading">
              <h2>Patrocinadores</h2>
              <span>Parceiros da edição</span>
              <p>Marcas parceiras, apoiadores e empresas que acompanham a Legends Kart Series.</p>
            </div>
            <div className="report-sponsor-grid">
              {legendsSponsors.map((sponsor) => (
                <a href={sponsor.instagram} target="_blank" rel="noreferrer" key={sponsor.instagram}>
                  <span className="report-sponsor-logo"><Image src={sponsor.logo} alt={`Logo ${sponsor.name}`} fill sizes="(max-width: 760px) 100vw, 25vw" /></span>
                  <span><small>{sponsor.segment}</small><strong>{sponsor.name}</strong><small>{sponsor.handle}</small></span>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
