"use client";

import { ArrowLeftRight, X } from "lucide-react";
import { useState } from "react";
import { formatScore, formatTimingValue, MAX_VALID_REGULAR_RESULTS } from "@/lib/legendsScoring";
import { isSuperFinalHeatType, type P1ClassificationCell, type P1ClassificationHeat, type P1ClassificationRow } from "@/lib/p1Types";
import { ReportMatrixKey } from "@/components/LegendsReport";

type ClassificationTableProps = {
  heats: P1ClassificationHeat[];
  rows: P1ClassificationRow[];
  limit?: number;
  labelledBy?: string;
  completedCount?: number;
};

type SelectedScore = {
  row: P1ClassificationRow;
  heat: P1ClassificationHeat;
  cell?: P1ClassificationCell;
  isSuperFinal: boolean;
};

type FilterMode = "all" | "top10" | "winners" | "discards";

export function ClassificationTable({ heats, rows, limit, labelledBy, completedCount }: ClassificationTableProps) {
  const [query, setQuery] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [selectedScore, setSelectedScore] = useState<SelectedScore | null>(null);
  const publishedRegularHeatCount = heats.filter((heat) => !isSuperFinalHeatType(heat.type)).length;
  const superFinal = heats.find((heat) => isSuperFinalHeatType(heat.type));
  const heatById = new Map(heats.map((heat) => [heat.id, heat]));
  const scoreSlots = Array.from({ length: MAX_VALID_REGULAR_RESULTS }, (_, index) => index);
  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");

  let filteredRows = rows;
  if (filterMode === "top10") {
    filteredRows = rows.slice(0, 10);
  } else if (filterMode === "winners") {
    filteredRows = rows.filter((r) => r.wins > 0);
  } else if (filterMode === "discards") {
    filteredRows = rows.filter((r) => (r.discarded || 0) > 0);
  }

  const matchingRows = normalizedQuery
    ? filteredRows.filter((row) => row.driver.toLocaleLowerCase("pt-BR").includes(normalizedQuery))
    : filteredRows;
  const visibleRows = normalizedQuery || filterMode !== "all" || !limit ? matchingRows : matchingRows.slice(0, limit);
  const hintId = labelledBy ? `${labelledBy}-scroll-hint` : "classification-table-scroll-hint";
  const searchId = `classification-search-${labelledBy ?? "default"}`;
  if (!heats.length || !rows.length) {
    return <p className="report-empty-state">Nenhuma classificação publicada no momento.</p>;
  }

  const winnersCount = rows.filter((r) => r.wins > 0).length;
  const withDiscardsCount = rows.filter((r) => (r.discarded || 0) > 0).length;

  const searchSummary = normalizedQuery
    ? `${matchingRows.length} ${matchingRows.length === 1 ? "piloto encontrado" : "pilotos encontrados"}`
    : filterMode !== "all"
      ? `${visibleRows.length} pilotos filtrados`
      : limit && rows.length > limit
        ? `${visibleRows.length} primeiros de ${rows.length} pilotos`
        : `${visibleRows.length} pilotos exibidos`;
  const mobileRows = normalizedQuery || filterMode !== "all" ? matchingRows : visibleRows.slice(0, 10);

  return (
    <div className="report-table-frame">
      <div className="report-table-heading">
        <span>{MAX_VALID_REGULAR_RESULTS} melhores pontuações · {publishedRegularHeatCount} baterias publicadas</span>
        <strong>{searchSummary}</strong>
      </div>
      <div className="report-table-tools">
        <label htmlFor={searchId}>Encontrar piloto</label>
        <div className="report-search-control">
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nome do piloto..."
            autoComplete="off"
          />
          {query ? <button type="button" onClick={() => setQuery("")} aria-label="Limpar busca"><X size={14} aria-hidden="true" /></button> : null}
        </div>
        <div className="report-filter-chips" role="group" aria-label="Filtros rápidos de classificação">
          <button
            type="button"
            className={`report-chip ${filterMode === "all" ? "is-active" : ""}`}
            aria-pressed={filterMode === "all"}
            onClick={() => setFilterMode("all")}
          >
            Todos ({rows.length})
          </button>
          <button
            type="button"
            className={`report-chip ${filterMode === "top10" ? "is-active" : ""}`}
            aria-pressed={filterMode === "top10"}
            onClick={() => setFilterMode("top10")}
          >
            Top 10
          </button>
          <button
            type="button"
            className={`report-chip ${filterMode === "winners" ? "is-active" : ""}`}
            aria-pressed={filterMode === "winners"}
            onClick={() => setFilterMode("winners")}
          >
            Vencedores ({winnersCount})
          </button>
          <button
            type="button"
            className={`report-chip ${filterMode === "discards" ? "is-active" : ""}`}
            aria-pressed={filterMode === "discards"}
            onClick={() => setFilterMode("discards")}
          >
            Com Descartes ({withDiscardsCount})
          </button>
        </div>
        <span className="report-search-status" aria-live="polite">
          {normalizedQuery ? `Busca: ${matchingRows.length} ${matchingRows.length === 1 ? "piloto encontrado" : "pilotos encontrados"}` : "Consulta rápida por nome ou filtro"}
        </span>
      </div>
      <ReportMatrixKey />
      <div className="report-mobile-ranking" aria-labelledby={`${searchId}-mobile-title`}>
        <div className="report-mobile-ranking-heading">
          <h3 id={`${searchId}-mobile-title`}>Leitura rápida</h3>
          <span>{normalizedQuery || filterMode !== "all" ? "Resultado filtrado" : `${mobileRows.length} primeiros · busque pelo nome`}</span>
        </div>
        <ol>
          {mobileRows.map((row) => (
            <li key={`${row.position}-${row.driver}`}>
              <span className="report-mobile-ranking-position">{row.position}</span>
              <span className="report-mobile-ranking-driver">
                <strong>{row.driver}</strong>
                <small>{row.wins} vitórias · {row.valid} válidas · {row.discarded || 0} retidas</small>
              </span>
              <strong className="report-mobile-ranking-total">{row.points}</strong>
            </li>
          ))}
        </ol>
        {!mobileRows.length ? <p className="report-empty-state">Nenhum piloto corresponde aos critérios.</p> : null}
      </div>
      <ReportScoreDetail selectedScore={selectedScore} onClose={() => setSelectedScore(null)} />
      {visibleRows.length ? (
        <>
          <p className="report-table-hint" id={hintId}>
            <span className="report-hint-icon"><ArrowLeftRight size={15} aria-hidden="true" /></span> As dez colunas mostram as melhores pontuações regulares de cada piloto, da maior para a menor. Uma nota melhor em uma bateria posterior substitui a menor nota considerada; Ret. registra os descartes. Toque ou clique em uma pontuação para auditar a bateria original.
          </p>
          <div className="report-table-scroll" role="region" aria-label="Matriz de pontuação" aria-describedby={hintId} tabIndex={0}>
            <table className="report-classification-table" aria-labelledby={labelledBy}>
              <caption className="report-visually-hidden">Classificação geral da Legends Kart Series pelas dez melhores pontuações regulares de cada piloto.</caption>
              <thead>
                <tr className="report-table-band">
                  <th className="report-sticky-rank" rowSpan={2} scope="col">Pos.</th>
                  <th className="report-sticky-driver" rowSpan={2} scope="col">Piloto</th>
                  <th className="report-level-head" rowSpan={2} scope="col">Nível</th>
                  <th className="report-meta-head" rowSpan={2} scope="col" aria-label="Participações">Part.</th>
                  <th className="report-meta-head" rowSpan={2} scope="col" aria-label="Resultados retidos">Ret.</th>
                  <th colSpan={MAX_VALID_REGULAR_RESULTS} scope="colgroup">10 melhores pontuações · maior para menor</th>
                  {superFinal ? <th className="report-super-final-head" rowSpan={2} scope="col" aria-label="Super Final">SF</th> : null}
                  <th className="report-total-head" rowSpan={2} scope="col">Total</th>
                  <th className="report-last-position" rowSpan={2} scope="col">Pos.</th>
                </tr>
                <tr className="report-table-columns">
                  {scoreSlots.map((slot) => (
                    <th key={`score-slot-${slot}`} scope="col" aria-label={`Pontuação ${slot + 1}`} title={`${slot + 1}ª melhor pontuação regular`}>
                      <span>Pontuação {slot + 1}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => (
                  <tr key={`${row.position}-${row.driver}`}>
                    <td className="report-sticky-rank report-rank-value">
                      <strong>{row.position}</strong>
                    </td>
                    <td className="report-sticky-driver report-driver-value" title={row.driver}>
                      <strong>{row.driver}</strong>
                    </td>
                    <td className="report-level-cell">{row.level}</td>
                    <td className="report-number-cell">{row.participationCount || "-"}</td>
                    <td className="report-number-cell">{row.discarded || "-"}</td>
                    {scoreSlots.map((slot) => {
                      const heatId = row.bestScoreHeatIds[slot];
                      const heat = heatId ? heatById.get(heatId) : undefined;
                      return (
                        <ClassificationScoreCell
                          cell={heatId ? row.cells[heatId] : undefined}
                          heat={heat}
                          row={row}
                          selectedScore={selectedScore}
                          onSelect={setSelectedScore}
                          key={`${row.position}-score-${slot}`}
                        />
                      );
                    })}
                    {superFinal ? (
                      <ClassificationScoreCell
                        cell={row.cells[superFinal.id]}
                        heat={superFinal}
                        row={row}
                        selectedScore={selectedScore}
                        onSelect={setSelectedScore}
                        isSuperFinal
                      />
                    ) : null}
                    <td className="report-total-cell" title={`Total ${row.points}: ${row.regularPoints} regulares + ${row.superFinalPoints} Super Final`}>
                      <strong>{row.points}</strong>
                      <small>{row.wins} vit. · {row.valid} vál.</small>
                    </td>
                    <td className="report-last-position report-rank-value"><strong>{row.position}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {limit && rows.length > limit && !normalizedQuery && filterMode === "all" ? <p className="report-table-footnote">Mostrando os {limit} primeiros pilotos. Use a busca ou filtros para localizar qualquer piloto; a matriz completa está na página de pontuação.</p> : null}
          {completedCount !== undefined ? <p className="report-table-source">Fonte publicada: {completedCount} de {heats.length} baterias completas. Selecione uma pontuação para ver bateria, data, estado, tempo e documento de origem.</p> : null}
        </>
      ) : <p className="report-table-no-results">Nenhum piloto corresponde aos filtros aplicados. Limpe a busca para restaurar a classificação.</p>}
    </div>
  );
}

function ClassificationScoreCell({
  cell,
  heat,
  row,
  selectedScore,
  onSelect,
  isSuperFinal = false,
}: {
  cell?: P1ClassificationCell;
  heat?: P1ClassificationHeat;
  row: P1ClassificationRow;
  selectedScore: SelectedScore | null;
  onSelect: (score: SelectedScore) => void;
  isSuperFinal?: boolean;
}) {
  const status = cell?.status ?? "missing";
  const label = getScoreLabel(cell, status);
  const ariaLabel = getScoreAriaLabel(cell, status, heat);
  const isSelected = Boolean(heat && selectedScore?.row.driver === row.driver && selectedScore.heat.id === heat.id);

  if (!heat) {
    return (
      <td className="report-score-cell is-missing" aria-label="Sem pontuação considerada">
        <span aria-hidden="true">-</span>
      </td>
    );
  }

  const score = { row, heat, cell, isSuperFinal };

  return (
    <td className={`report-score-cell is-${status}${cell?.position === 1 ? " is-win" : ""}${isSuperFinal ? " is-super-final" : ""}${isSelected ? " is-selected" : ""}`}>
      <button
        type="button"
        className="report-score-trigger"
        aria-label={ariaLabel}
        aria-pressed={isSelected}
        title={ariaLabel}
        onClick={() => onSelect(score)}
      >
        <span>{label}</span>
        {cell?.position === 1 && status === "ok" ? <small>V</small> : null}
        {status === "discarded" ? <small>D</small> : null}
      </button>
    </td>
  );
}

function ReportScoreDetail({
  selectedScore,
  onClose,
}: {
  selectedScore: SelectedScore | null;
  onClose: () => void;
}) {
  if (!selectedScore) {
    return <p className="report-audit-detail" aria-live="polite">Selecione uma pontuação para conferir a bateria, a data, o estado e o documento de origem.</p>;
  }

  const { row, heat, cell, isSuperFinal } = selectedScore;
  const status = cell?.status ?? "missing";
  const timing = cell?.officialMs === null || cell?.officialMs === undefined ? null : formatTimingValue(cell.officialMs);

  return (
    <div className="report-audit-detail is-active" aria-live="polite">
      <div>
        <span className="report-audit-label">Piloto</span>
        <strong>{row.driver}</strong>
      </div>
      <div>
        <span className="report-audit-label">Bateria</span>
        <strong>{heat.title}</strong>
        <small>{heat.date || "Sem data publicada"}</small>
      </div>
      <div>
        <span className="report-audit-label">Registro</span>
        <strong>{getScoreAriaLabel(cell, status, heat)}</strong>
        {timing ? <small>Tempo oficial: {timing}</small> : null}
      </div>
      <div className="report-audit-actions">
        {!isSuperFinal ? <a className="report-text-link" href={`/api/campeonatos/legends/pdf/${heat.id}`} target="_blank" rel="noreferrer">PDF da bateria</a> : null}
        <button type="button" className="report-audit-close" onClick={onClose} aria-label="Fechar detalhe da pontuação"><X size={14} aria-hidden="true" /> Fechar</button>
      </div>
    </div>
  );
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
