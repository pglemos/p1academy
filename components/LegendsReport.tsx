import Image from "next/image";
import Link from "next/link";
import { isSuperFinalHeatType, type P1ClassificationCell, type P1ClassificationHeat, type P1ClassificationRow, type P1ResultRow } from "@/lib/p1Types";
import type { P1RankingRow } from "@/lib/p1Types";
import { formatScore, formatTimingValue } from "@/lib/legendsScoring";

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
          <Image src="/brand/legends-kart-series-logo.jpg" alt="" width={68} height={68} priority />
        </span>
        <span>
          <strong>Legends Kart Series</strong>
          <small>P1 Academy / temporada 2026</small>
        </span>
      </Link>
      <div className="report-masthead-note">
        <span>{isPublished ? "Documento público" : "Dados indisponíveis"}</span>
        <strong>{isPublished ? "Classificação oficial" : "Prévia local"}</strong>
      </div>
      <div className="report-masthead-meta">
        <span>{publishedAt ? "Dados publicados em" : "Última bateria"}</span>
        <strong>{formatReportPublicationDate(publishedAt, fallbackDate)}</strong>
        <small>{isPublished ? "Fonte publicada" : "Não usar para conferência"}</small>
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
    <div className="report-title-band">
      <div>
        <h1>{title}</h1>
        <span>{eyebrow}</span>
        <p>{description}</p>
      </div>
      {(resultCount !== undefined || pilotCount !== undefined) && (
        <dl className="report-title-facts">
          {resultCount !== undefined && (
            <div>
              <dt>Resultados lançados</dt>
              <dd>{resultCount}</dd>
              {resultNote ? <small>{resultNote}</small> : null}
            </div>
          )}
          {pilotCount !== undefined && (
            <div>
              <dt>Pilotos no ranking</dt>
              <dd>{pilotCount}</dd>
            </div>
          )}
        </dl>
      )}
    </div>
  );
}

export function ReportMetricStrip({
  items,
}: {
  items: Array<{ label: string; value: string; note: string }>;
}) {
  return (
    <dl className="report-metric-strip">
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
          <small>{item.note}</small>
        </div>
      ))}
    </dl>
  );
}

export function ReportPodium({ rows }: { rows: P1ClassificationRow[] }) {
  const podium = [
    { label: "Líder geral", rank: "01", className: "is-gold" },
    { label: "Segundo", rank: "02", className: "is-silver" },
    { label: "Terceiro", rank: "03", className: "is-orange" },
  ];

  return (
    <div className="report-podium-grid">
      {podium.map((place, index) => {
        const row = rows[index];
        return (
          <article className={`report-podium-card ${place.className}`} key={place.rank}>
            <div className="report-podium-rank">
              <span>{place.label}</span>
              <strong>{place.rank}</strong>
            </div>
            <h3>{row?.driver ?? "Aguardando classificação"}</h3>
            <div className="report-podium-total">
              <strong>{row?.points ?? "-"}</strong>
              <span>pontos totais</span>
            </div>
            <small>{row ? `${row.wins} vitórias / ${row.valid} válidas` : "Sem resultado publicado"}</small>
          </article>
        );
      })}
    </div>
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
  const regularHeatColumnSpan = Math.max(regularHeats.length, 1);

  if (!heats.length || !rows.length) {
    return <p className="report-empty-state">Nenhuma classificação publicada no momento.</p>;
  }

  return (
    <div className="report-table-frame">
      <div className="report-table-heading">
        <span>Participações</span>
        <strong>{heats.length} lançadas{completedCount !== undefined ? ` · ${completedCount} completas` : ""}</strong>
      </div>
      <p className="report-table-hint" id={hintId}>Deslize horizontalmente para ver todas as baterias; posição, piloto e total ficam fixos.</p>
      <ReportMatrixKey />
      <div className="report-table-scroll" role="region" aria-label="Matriz de pontuação" aria-describedby={hintId} tabIndex={0}>
        <table className="report-classification-table" aria-labelledby={labelledBy}>
          <caption className="report-visually-hidden">Classificação geral da Legends Kart Series por bateria publicada.</caption>
          <thead>
            <tr className="report-table-band">
              <th className="report-sticky-rank" rowSpan={2} scope="col">Posição</th>
              <th className="report-sticky-driver" rowSpan={2} scope="col">Piloto</th>
              <th className="report-level-head" rowSpan={2} scope="col">Nível</th>
              <th className="report-meta-head" rowSpan={2} scope="col">Part.</th>
              <th className="report-meta-head" rowSpan={2} scope="col">Válidas</th>
              <th className="report-meta-head" rowSpan={2} scope="col">Ret.</th>
              <th colSpan={regularHeatColumnSpan} scope="colgroup">Pontuações por bateria</th>
              <th rowSpan={2} scope="col">SF</th>
              <th className="report-total-head" rowSpan={2} scope="col">Total</th>
            </tr>
            <tr className="report-table-columns">
              {regularHeats.length ? regularHeats.map((heat) => (
                  <th key={heat.id} scope="col" aria-label={`${heat.title}, ${heat.date}`} title={`${heat.title} / ${heat.date}`}>
                    <span>{getHeatShortLabel(heat.title)}</span>
                    <small>{heat.label} · {heat.date.slice(0, 5)}</small>
                </th>
              )) : <th scope="col"><span>Regulares</span><small>—</small></th>}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr className={row.position === "01" ? "is-leader" : undefined} key={`${row.position}-${row.driver}`}>
                <td className="report-sticky-rank report-rank-value">
                  <strong>{row.position}</strong>
                </td>
                <td className="report-sticky-driver report-driver-value">
                  <strong>{row.driver}</strong>
                  <small>{row.discarded ? `${row.discarded} retida${row.discarded > 1 ? "s" : ""}` : "Sem descarte"}</small>
                </td>
                <td className="report-level-cell">{row.level}</td>
                <td className="report-number-cell">{row.participationCount || "-"}</td>
                <td className="report-number-cell">{row.valid}</td>
                <td className="report-number-cell">{row.discarded || "-"}</td>
                {regularHeats.length ? regularHeats.map((heat) => (
                    <ClassificationScoreCell cell={row.cells[heat.id]} heat={heat} key={heat.id} />
                  )) : <ClassificationScoreCell />}
                <ClassificationScoreCell cell={superFinal ? row.cells[superFinal.id] : undefined} heat={superFinal} isSuperFinal />
                <td className="report-total-cell" title={`Total ${row.points}: ${row.regularPoints} regulares + ${row.superFinalPoints} Super Final`}>
                  <strong>{row.points}</strong>
                  <small>{row.wins} vit. · {row.valid} vál.</small>
                  <small>{row.regularPoints} reg. · {row.superFinalPoints} SF</small>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {limit && rows.length > limit ? <p className="report-table-footnote">Mostrando os {limit} primeiros pilotos. A matriz completa está na página de pontuação.</p> : null}
    </div>
  );
}

export function ReportMatrixKey() {
  return (
    <div className="report-matrix-key" aria-label="Legenda rápida da matriz">
      {[
        ["V", "vitória"],
        ["D", "retida / não soma"],
        ["-", "sem resultado"],
        ["DSQ", "desclassificado"],
        ["S/T", "sem tempo válido"],
        ["SF", "Super Final"],
        ["PART.", "participações"],
        ["RET.", "retidas"],
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
              <th scope="col">Posição</th>
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
  const label = getScoreLabel(cell, status, heat);
  const ariaLabel = getScoreAriaLabel(cell, status, heat);

  return (
    <td className={`report-score-cell is-${status}${cell?.position === 1 ? " is-win" : ""}${isSuperFinal ? " is-super-final" : ""}`} aria-label={ariaLabel} title={ariaLabel}>
      <span>{label}</span>
      {cell?.position === 1 && status === "ok" ? <small>V</small> : null}
      {status === "discarded" ? <small>D</small> : null}
    </td>
  );
}

function getScoreLabel(cell: P1ClassificationCell | undefined, status: P1ClassificationCell["status"], heat?: P1ClassificationHeat) {
  if (status === "missing") {
    return "-";
  }
  if (status === "dsq") {
    return "DSQ";
  }
  if (status === "no-time") {
    return "S/T";
  }
  if (!cell || cell.score === null) {
    return isSuperFinalHeatType(heat?.type) ? "-" : "-";
  }
  return formatScore(cell.score);
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
        <span>Resultados publicados</span>
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
      <div>
        <h2 id="report-formula-title">Pontuação por diferença de tempo</h2>
        <span>Como ler</span>
      </div>
      <p>O piloto mais rápido recebe 10,000 pontos. Os demais partem da mesma base e perdem um ponto por segundo de diferença para a melhor volta da bateria. Diferenças superiores a 9 segundos recebem 1,000 ponto.</p>
      <p className="report-formula-note"><strong>Descarte:</strong> contam até 10 resultados regulares; piores resultados, ausências e DSQ podem ficar retidos. A Super Final soma à parte quando existir.</p>
      <p className="report-formula-note"><strong>Desempate:</strong> vitórias; depois a melhor pontuação abaixo das vitórias, a segunda melhor e assim sucessivamente; sorteio por último.</p>
      <dl>
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

function getHeatShortLabel(title: string) {
  const match = title.match(/Bateria\s+(\d+)\s*-\s*Legends\s+(.+)/i);
  if (!match) {
    return title;
  }

  return `B${match[1].padStart(2, "0")} / ${match[2].trim()}`;
}
