import Image from "next/image";
import Link from "next/link";
import type { P1ClassificationRow, P1RankingRow, P1ResultRow } from "@/lib/p1Types";
import { formatTimingValue } from "@/lib/legendsScoring";

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

export function ReportLeaderStrip({ rows }: { rows: P1ClassificationRow[] }) {
  if (!rows.length) {
    return null;
  }

  return (
    <section className="report-leader-strip" aria-labelledby="report-leader-title">
      <div className="report-leader-intro">
        <h2 id="report-leader-title">Líderes atuais</h2>
        <p>Os primeiros colocados aparecem antes da matriz para uma consulta rápida.</p>
      </div>
      <ol className="report-leader-list">
        {rows.slice(0, 3).map((row) => (
          <li key={`${row.position}-${row.driver}`}>
            <span className="report-leader-position">{row.position}</span>
            <span className="report-leader-driver">
              <strong>{row.driver}</strong>
              <small>{row.wins} vitórias · {row.valid} válidas</small>
            </span>
            <strong className="report-leader-total">{row.points}</strong>
          </li>
        ))}
      </ol>
    </section>
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
                  {result.pdfHref ? <a className="report-text-link" href={result.pdfHref} target="_blank" rel="noreferrer" aria-label={`Abrir PDF de ${result.heat}, ${result.date}`} title={`Abrir PDF de ${result.heat}, ${result.date}`}>Abrir PDF</a> : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="report-register-hint">Em telas menores, deslize horizontalmente para consultar todas as colunas.</p>
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
