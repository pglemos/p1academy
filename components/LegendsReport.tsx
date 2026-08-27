import Image from "next/image";
import Link from "next/link";
import { isSuperFinalHeatType, type P1ClassificationCell, type P1ClassificationHeat, type P1ClassificationRow, type P1RankingRow, type P1ResultRow } from "@/lib/p1Types";
import { formatScore, formatTimingValue, getLegendsHeatNumber } from "@/lib/legendsScoring";

type ReportMastheadProps = {
  publishedAt: string | null;
  fallbackDate: string;
  source: "supabase" | "static";
};

export function LegendsReportMasthead({ publishedAt, fallbackDate, source }: ReportMastheadProps) {
  const isPublished = source === "supabase";

  return (
    <header className="report-masthead">
      <Link className="report-brand-lockup" href="/" aria-label="P1 Academy, página inicial">
        <span className="report-brand-mark">
          <Image src="/brand/legends-kart-series-logo.jpg" alt="" width={56} height={56} priority />
        </span>
        <span>
          <strong>Legends Kart Series</strong>
          <small>P1 Academy · temporada 2026</small>
        </span>
      </Link>
      <div className="report-masthead-context">
        <span>Documento público</span>
        <strong>{isPublished ? "Classificação oficial" : "Prévia local"}</strong>
      </div>
      <div className="report-masthead-meta">
        <span>{publishedAt ? "Atualizado em" : "Última bateria"}</span>
        <strong>{formatReportPublicationDate(publishedAt, fallbackDate)}</strong>
        <small>{isPublished ? "Dados publicados" : "Fonte indisponível"}</small>
      </div>
    </header>
  );
}

export function ReportTitleBand({
  eyebrow,
  title,
  description,
  resultCount,
  resultNote,
  pilotCount,
}: {
  eyebrow: string;
  title: string;
  description: string;
  resultCount?: number;
  resultNote?: string;
  pilotCount?: number;
}) {
  return (
    <section className="report-title-band" aria-labelledby="report-title">
      <div className="report-title-copy">
        <h1 id="report-title">{title}</h1>
        <p className="report-title-meta">{eyebrow}</p>
        <p className="report-title-description">{description}</p>
      </div>
      {(resultCount !== undefined || pilotCount !== undefined) && (
        <dl className="report-title-facts">
          {resultCount !== undefined && (
            <div>
              <dt>Baterias lançadas</dt>
              <dd>{resultCount}</dd>
              {resultNote ? <small>{resultNote}</small> : null}
            </div>
          )}
          {pilotCount !== undefined && (
            <div>
              <dt>Pilotos classificados</dt>
              <dd>{pilotCount}</dd>
            </div>
          )}
        </dl>
      )}
    </section>
  );
}

export function ClassificationTable({
  heats,
  rows,
  limit,
  labelledBy,
  completedCount,
}: {
  heats: P1ClassificationHeat[];
  rows: P1ClassificationRow[];
  limit?: number;
  labelledBy?: string;
  completedCount?: number;
}) {
  const regularHeats = heats.filter((heat) => !isSuperFinalHeatType(heat.type));
  const superFinal = heats.find((heat) => isSuperFinalHeatType(heat.type));
  const visibleRows = limit ? rows.slice(0, limit) : rows;
  const hintId = labelledBy ? `${labelledBy}-scroll-hint` : "classification-table-scroll-hint";

  if (!heats.length || !rows.length) {
    return <p className="report-empty-state">Nenhuma classificação publicada no momento.</p>;
  }

  const regularColumnCount = Math.max(regularHeats.length, 1);

  return (
    <div className="report-table-frame">
      <div className="report-table-heading">
        <span>Resultados por bateria: {regularHeats.length}</span>
        <strong>Ordem cronológica · {visibleRows.length} pilotos exibidos</strong>
      </div>
      <ReportMatrixKey />
      <p className="report-table-hint" id={hintId}>Cada coluna representa uma bateria publicada. A numeração segue a relação oficial e os resultados retidos continuam visíveis para conferência.</p>
      <div className="report-table-scroll" role="region" aria-label="Matriz de pontuação" aria-describedby={hintId} tabIndex={0}>
        <table className="report-classification-table" aria-labelledby={labelledBy}>
          <caption className="report-visually-hidden">Classificação geral da Legends Kart Series por bateria publicada.</caption>
          <thead>
            <tr className="report-table-band">
              <th className="report-sticky-rank" rowSpan={2} scope="col">Pos.</th>
              <th className="report-sticky-driver" rowSpan={2} scope="col">Piloto</th>
              <th className="report-level-head" rowSpan={2} scope="col">Nível</th>
              <th className="report-meta-head" rowSpan={2} scope="col">Part.</th>
              <th className="report-meta-head" rowSpan={2} scope="col">Ret.</th>
              <th colSpan={regularColumnCount} scope="colgroup">Pontuações por bateria · ordem cronológica</th>
              {superFinal ? <th className="report-super-final-head" rowSpan={2} scope="col">SF</th> : null}
              <th className="report-total-head" rowSpan={2} scope="col">Total</th>
              <th className="report-last-position" rowSpan={2} scope="col">Pos.</th>
            </tr>
            <tr className="report-table-columns">
              {regularHeats.length ? regularHeats.map((heat) => (
                <th key={heat.id} scope="col" aria-label={`${heat.title}, ${heat.date}`} title={`${heat.title} / ${heat.date}`}>
                  <span>{getHeatShortLabel(heat.title)}</span>
                  <small>{getHeatColumnMeta(heat)}</small>
                </th>
              )) : <th scope="col"><span>Regulares</span><small>sem lançamento</small></th>}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => {
              return (
                <tr key={`${row.position}-${row.driver}`}>
                  <td className="report-sticky-rank report-rank-value">
                    <strong>{row.position}</strong>
                  </td>
                  <td className="report-sticky-driver report-driver-value">
                    <strong>{row.driver}</strong>
                  </td>
                  <td className="report-level-cell">{row.level}</td>
                  <td className="report-number-cell">{row.participationCount || "-"}</td>
                  <td className="report-number-cell">{row.discarded || "-"}</td>
                  {regularHeats.length ? regularHeats.map((heat) => (
                    <ClassificationScoreCell cell={row.cells[heat.id]} heat={heat} key={`${row.position}-${heat.id}`} />
                  )) : <ClassificationScoreCell />}
                  {superFinal ? <ClassificationScoreCell cell={row.cells[superFinal.id]} heat={superFinal} isSuperFinal /> : null}
                  <td className="report-total-cell" title={`Total ${row.points}: ${row.regularPoints} regulares + ${row.superFinalPoints} Super Final`}>
                    <strong>{row.points}</strong>
                    <small>{row.wins} vit. · {row.valid} vál.</small>
                  </td>
                  <td className="report-last-position report-rank-value"><strong>{row.position}</strong></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {limit && rows.length > limit ? <p className="report-table-footnote">Mostrando os {limit} primeiros pilotos. A matriz completa está na página de pontuação.</p> : null}
      {completedCount !== undefined ? <p className="report-table-source">Fonte publicada: {completedCount} de {heats.length} baterias completas. Passe o cursor sobre uma pontuação para ver sua bateria de origem.</p> : null}
    </div>
  );
}

export function ReportMatrixKey() {
  return (
    <div className="report-matrix-key" aria-label="Legenda da matriz">
      {[
        ["V", "vitória"],
        ["D", "retida / não soma"],
        ["-", "sem resultado"],
        ["DSQ", "desclassificado"],
        ["S/T", "sem tempo válido"],
        ["SF", "Super Final"],
      ].map(([mark, label]) => (
        <span key={mark}><strong>{mark}</strong><small>{label}</small></span>
      ))}
    </div>
  );
}

export function ReportRankingSummary({ rows, labelledBy }: { rows: P1RankingRow[]; labelledBy?: string }) {
  if (!rows.length) {
    return <p className="report-empty-state">Nenhuma classificação publicada no momento.</p>;
  }

  return (
    <div className="report-table-frame">
      <div className="report-table-heading">
        <span>Classificação resumida</span>
        <strong>{rows.length} pilotos disponíveis</strong>
      </div>
      <div className="report-register-scroll" role="region" aria-label="Classificação resumida" tabIndex={0}>
        <table className="report-ranking-summary-table" aria-labelledby={labelledBy}>
          <caption className="report-visually-hidden">Classificação resumida da Legends Kart Series.</caption>
          <thead>
            <tr>
              <th scope="col">Pos.</th>
              <th scope="col">Piloto</th>
              <th scope="col">Nível</th>
              <th scope="col">Total</th>
              <th scope="col">Válidas</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.position}-${row.driver}`}>
                <th scope="row">{row.position}</th>
                <td>{row.driver}</td>
                <td>{row.level}</td>
                <td className="report-time-cell">{row.points}</td>
                <td>{row.valid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ClassificationScoreCell({
  cell,
  heat,
  isSuperFinal = false,
}: {
  cell?: P1ClassificationCell;
  heat?: P1ClassificationHeat;
  isSuperFinal?: boolean;
}) {
  const status = cell?.status ?? "missing";
  const label = getScoreLabel(cell, status);
  const ariaLabel = getScoreAriaLabel(cell, status, heat);

  return (
    <td className={`report-score-cell is-${status}${cell?.position === 1 ? " is-win" : ""}${isSuperFinal ? " is-super-final" : ""}`} aria-label={ariaLabel} title={ariaLabel}>
      <span>{label}</span>
      {cell?.position === 1 && status === "ok" ? <small>V</small> : null}
      {status === "discarded" ? <small>D</small> : null}
    </td>
  );
}

function getHeatShortLabel(title: string) {
  const number = getLegendsHeatNumber(title);
  return number === null ? title : `Bateria ${String(number).padStart(2, "0")}`;
}

function getHeatColumnMeta(heat: P1ClassificationHeat) {
  const category = heat.title.match(/Legends\s+(I{1,3}V?|IV)/i)?.[0] ?? "Legends";
  return `${category} · ${heat.date.slice(0, 5)}`;
}

function getScoreLabel(cell: P1ClassificationCell | undefined, status: P1ClassificationCell["status"]) {
  if (status === "missing") {
    return "-";
  }
  if (status === "dsq") {
    return "DSQ";
  }
  if (status === "no-time") {
    return "S/T";
  }
  return cell?.score === null || cell?.score === undefined ? "-" : formatScore(cell.score);
}

function getScoreAriaLabel(cell: P1ClassificationCell | undefined, status: P1ClassificationCell["status"], heat?: P1ClassificationHeat) {
  const heatLabel = heat ? `${heat.title}, ${heat.date}` : "Super Final";
  if (status === "missing") {
    return `Sem resultado em ${heatLabel}`;
  }
  if (status === "dsq") {
    return `Desclassificado em ${heatLabel}`;
  }
  if (status === "no-time") {
    return `Sem tempo válido em ${heatLabel}`;
  }
  const score = cell?.score === null || cell?.score === undefined ? "sem pontuação" : `${formatScore(cell.score)} pontos`;
  const state = status === "discarded" ? "resultado retido fora do total" : cell?.position === 1 ? "vitória" : "resultado válido";
  return `${score}, ${state}, ${heatLabel}`;
}

export function ReportResultRegister({ results }: { results: P1ResultRow[] }) {
  return (
    <div className="report-register-frame">
      <div className="report-table-heading">
        <span>Registro oficial</span>
        <strong>{results.length} baterias</strong>
      </div>
      <div className="report-register-scroll" role="region" aria-label="Resultados publicados por bateria" tabIndex={0}>
        <table className="report-register-table">
          <caption className="report-visually-hidden">Registro das baterias publicadas da Legends Kart Series.</caption>
          <thead>
            <tr>
              <th scope="col">Bateria</th>
              <th scope="col">Data</th>
              <th scope="col">Vencedor</th>
              <th scope="col">Melhor volta</th>
              <th scope="col">Documento</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={`${result.heat}-${result.date}`}>
                <th scope="row">{result.heat}</th>
                <td>{result.date}</td>
                <td>{result.complete ? result.winner : "Resultado incompleto"}</td>
                <td className="report-time-cell">{result.bestLap}</td>
                <td>
                  {result.pdfHref ? <a className="report-text-link" href={result.pdfHref} target="_blank" rel="noreferrer">Abrir PDF</a> : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ReportFormula({ validResults, rulesPdf }: { validResults: string; rulesPdf: string }) {
  return (
    <aside className="report-formula" aria-labelledby="report-formula-title">
      <div className="report-formula-copy">
        <span className="report-formula-label">Método oficial</span>
        <h3 id="report-formula-title">Pontuação por diferença de tempo</h3>
        <p>O piloto mais rápido recebe 10,000 pontos. Os demais partem da mesma base e perdem um ponto por segundo de diferença para a melhor volta da bateria. Diferenças superiores a 9 segundos recebem 1,000 ponto.</p>
        <p><strong>Descarte:</strong> contam até 10 resultados regulares; piores resultados, ausências e DSQ podem ficar retidos. A Super Final soma à parte quando existir.</p>
      </div>
      <dl className="report-formula-facts">
        <div><dt>Base regular</dt><dd>10,000</dd></div>
        <div><dt>Base Super Final</dt><dd>5,000</dd></div>
        <div><dt>Resultado mínimo</dt><dd>1,000</dd></div>
        <div><dt>Limite válido</dt><dd>{validResults}</dd></div>
      </dl>
      <div className="report-state-key" aria-label="Legenda dos estados da matriz">
        {[
          ["V", "vitória"],
          ["D", "retida / não soma"],
          ["-", "sem resultado"],
          ["DSQ", "desclassificado"],
          ["S/T", "sem tempo válido"],
          ["SF", "Super Final"],
        ].map(([mark, label]) => (
          <span key={mark}><strong>{mark}</strong><small>{label}</small></span>
        ))}
      </div>
      <a className="report-text-link" href={rulesPdf} target="_blank" rel="noreferrer">Consultar regulamento oficial</a>
    </aside>
  );
}

export function formatReportPublicationDate(timestamp: string | null, fallback: string) {
  if (!timestamp) {
    return fallback;
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(date);
}

export function formatReportTime(milliseconds: number | null) {
  return formatTimingValue(milliseconds);
}
