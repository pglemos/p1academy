/*
 * Impeccable v4 direction contract - seed 466a50a4.
 * THESIS: a score report read like a film cutting bench, where every heat is a frame and every retained discard remains auditable.
 * OWN-WORLD: true black, work-print white, Legends gold and tape orange; punched rails, flat frames, tabular numbers and precise separators.
 * STORY: the reader sees who leads, follows the published chronology, understands the formula, then audits each pilot's counted and retained scores.
 * FIRST VIEWPORT: overview header, leaders, two-row heat rail, formula, states and tie-break rules before the full matrix begins.
 * FORM: Read mode, delegated build of the assigned grounded direction, seed 466a50a4.
 * FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
 */

import { existsSync, readFileSync } from "fs";
import path from "path";
import { formatScore, MAX_VALID_REGULAR_RESULTS } from "./legendsScoring";

const pageWidth = 1491;
const pageHeight = 1055;
const logoPath = path.join(process.cwd(), "public", "brand", "legends-kart-series-logo.jpg");
const rowsPerPage = 21;
const columnsPerMatrixPage = 16;

const colors = {
  background: "#090B0B",
  header: "#101414",
  surface: "#151A19",
  surfaceAlt: "#1A201E",
  ink: "#F2F0E7",
  muted: "#B7B8AE",
  faint: "#858A80",
  line: "#4B5147",
  gold: "#F2B51B",
  orange: "#ED6430",
  discard: "#442C22",
  discardText: "#F0A45D",
  darkInk: "#171A16",
};

export type LegendsOverallHeat = {
  id: string;
  title: string;
  date: string;
  type: string;
};

export type LegendsOverallStanding = {
  position: number;
  driverName: string;
  total: number;
  regularTotal?: number;
  superFinalTotal?: number;
  validRegularResults: number;
  discardedRegularResults?: number;
  wins: number;
};

export type LegendsOverallResult = {
  heatId: string;
  driverName: string;
  score: number;
  position: number | null;
  officialMs: number | null;
};

type PdfImage = {
  width: number;
  height: number;
  data: Buffer;
};

type OverallRow = LegendsOverallStanding & {
  heatScores: Map<string, LegendsOverallResult>;
  bestRegularResults: LegendsOverallResult[];
  discardedHeatIds: Set<string>;
  discardedCount: number;
};

type ScoreColumn = {
  label: string;
  slot?: number;
  heatId?: string;
  type: "regular" | "super_final";
};

type TableColumn = { x: number; w: number };

export function buildLegendsOverallPdf(input: {
  championshipName: string;
  season: string;
  generatedAt: string;
  heats: LegendsOverallHeat[];
  standings: LegendsOverallStanding[];
  results: LegendsOverallResult[];
}): Uint8Array {
  const rows = buildRows(input);
  const columns = buildScoreColumns(input.heats);
  const rowGroups = chunk(rows, rowsPerPage);
  const columnGroups = chunk(columns, columnsPerMatrixPage);
  const rankingPageCount = Math.max(1, rowGroups.length) * Math.max(1, columnGroups.length);
  const pageCount = 1 + rankingPageCount;
  const logo = loadLogo();
  const pages: string[] = [];

  const overviewCommands: string[] = [];
  drawOverviewPage(overviewCommands, input, rows, columns, 1, pageCount, Boolean(logo));
  pages.push(overviewCommands.join("\n"));

  let pageNumber = 2;
  for (const rowGroup of rowGroups.length ? rowGroups : [[]]) {
    for (const columnGroup of columnGroups.length ? columnGroups : [[]]) {
      const commands: string[] = [];
      drawRankingPage(commands, input, rowGroup, columnGroup, rows.length, pageNumber, pageCount, Boolean(logo));
      pages.push(commands.join("\n"));
      pageNumber += 1;
    }
  }

  return makePdf(pages, logo);
}

function buildRows(input: {
  heats: LegendsOverallHeat[];
  standings: LegendsOverallStanding[];
  results: LegendsOverallResult[];
}): OverallRow[] {
  const resultMap = new Map<string, Map<string, LegendsOverallResult>>();
  input.results.forEach((result) => {
    const key = normalizeKey(result.driverName);
    const byHeat = resultMap.get(key) ?? new Map<string, LegendsOverallResult>();
    byHeat.set(result.heatId, result);
    resultMap.set(key, byHeat);
  });

  const regularHeatIds = new Set(input.heats.filter((heat) => normalizeHeatType(heat.type) === "regular").map((heat) => heat.id));
  const bestRegularByDriver = new Map<string, LegendsOverallResult[]>();
  const discardedByDriver = new Map<string, Set<string>>();

  resultMap.forEach((byHeat, driverKey) => {
    const regularResults = [...byHeat.values()]
      .filter((result) => regularHeatIds.has(result.heatId) && result.score > 0)
      .sort(compareResults);
    bestRegularByDriver.set(driverKey, regularResults.slice(0, MAX_VALID_REGULAR_RESULTS));
    discardedByDriver.set(driverKey, new Set(regularResults.slice(MAX_VALID_REGULAR_RESULTS).map((result) => result.heatId)));
  });

  return input.standings.map((standing) => {
    const driverKey = normalizeKey(standing.driverName);
    const discardedHeatIds = discardedByDriver.get(driverKey) ?? new Set<string>();
    return {
      ...standing,
      heatScores: resultMap.get(driverKey) ?? new Map<string, LegendsOverallResult>(),
      bestRegularResults: bestRegularByDriver.get(driverKey) ?? [],
      discardedHeatIds,
      discardedCount: standing.discardedRegularResults ?? discardedHeatIds.size,
    };
  });
}

function compareResults(a: LegendsOverallResult, b: LegendsOverallResult) {
  return b.score - a.score
    || (a.officialMs ?? Number.MAX_SAFE_INTEGER) - (b.officialMs ?? Number.MAX_SAFE_INTEGER)
    || (a.position ?? Number.MAX_SAFE_INTEGER) - (b.position ?? Number.MAX_SAFE_INTEGER)
    || a.heatId.localeCompare(b.heatId);
}

function drawOverviewPage(
  commands: string[],
  input: {
    championshipName: string;
    season: string;
    generatedAt: string;
    heats: LegendsOverallHeat[];
    standings: LegendsOverallStanding[];
  },
  rows: OverallRow[],
  columns: ScoreColumn[],
  pageNumber: number,
  pageCount: number,
  hasLogo: boolean,
) {
  drawPageShell(commands, hasLogo);
  drawDocumentHeader(commands, input, "CLASSIFICAÇÃO GERAL", "VISÃO OFICIAL / LEITURA RÁPIDA");
  drawMetricRail(commands, input, rows.length);
  drawPodium(commands, rows);
  drawTimeline(commands, columns);
  drawOverviewRules(commands);
  drawFooter(commands, pageNumber, pageCount, "REGULAMENTO 8.1-8.7 / DADOS PUBLICADOS");
}

function drawRankingPage(
  commands: string[],
  input: {
    season: string;
    generatedAt: string;
    heats: LegendsOverallHeat[];
  },
  rows: OverallRow[],
  columns: ScoreColumn[],
  totalRows: number,
  pageNumber: number,
  pageCount: number,
  hasLogo: boolean,
) {
  drawPageShell(commands, hasLogo);
  const firstPosition = rows[0]?.position ?? 0;
  const lastPosition = rows[rows.length - 1]?.position ?? 0;
  const matrixLabel = columns.length ? `${columns[0].label}-${columns[columns.length - 1].label}` : "SEM BATERIAS";
  drawDocumentHeader(commands, input, "MATRIZ DE PONTUAÇÃO", `PILOTOS ${firstPosition}-${lastPosition} / ${matrixLabel}`);
  drawMatrixLegend(
    commands,
    totalRows,
    input.heats.filter((heat) => normalizeHeatType(heat.type) === "regular").length > MAX_VALID_REGULAR_RESULTS,
  );
  drawRankingTable(commands, rows, columns);
  drawFooter(commands, pageNumber, pageCount, "P = MELHORES NOTAS / SF = SUP. FINAL");
}

function drawPageShell(commands: string[], hasLogo: boolean) {
  rect(commands, 0, 0, pageWidth, pageHeight, colors.background);
  rect(commands, 0, 0, pageWidth, 104, colors.header);
  line(commands, 0, 104, pageWidth, 104, colors.orange, 2);
  line(commands, 0, 1014, pageWidth, 1014, colors.line, 0.8);

  if (hasLogo) {
    image(commands, "Logo", 38, 16, 96, 80);
  } else {
    text(commands, "LEGENDS", 42, 55, 25, "F1", colors.gold, 1.5);
  }

  drawPerforationRail(commands, 148, 19, pageWidth - 148, colors.line);
}

function drawDocumentHeader(
  commands: string[],
  input: { season: string; generatedAt: string },
  title: string,
  context: string,
) {
  text(commands, "LEGENDS KART SERIES", 166, 31, 13, "F1", colors.gold, 2.5);
  text(commands, title, 166, 74, 34, "F1", colors.ink, -0.45);
  text(commands, context, 168, 94, 9.5, "F2", colors.muted, 1.5);

  text(commands, "TEMPORADA", 1110, 29, 8.5, "F1", colors.faint, 1.6);
  text(commands, input.season, 1110, 63, 23, "F1", colors.gold);
  line(commands, 1211, 23, 1231, 75, colors.orange, 1.2);
  text(commands, "ATUALIZADO", 1250, 29, 8.5, "F1", colors.faint, 1.6);
  text(commands, input.generatedAt, 1250, 61, 16, "F1", colors.ink);
}

function drawMetricRail(
  commands: string[],
  input: { heats: LegendsOverallHeat[] },
  driverCount: number,
) {
  const x = 42;
  const y = 128;
  const width = pageWidth - 84;
  const height = 64;
  const metrics = [
    { label: "PILOTOS", value: String(driverCount), note: "na classificação" },
    { label: "PUBLICADAS", value: String(input.heats.length), note: "baterias lançadas" },
    { label: "REGULARES", value: String(input.heats.filter((heat) => normalizeHeatType(heat.type) === "regular").length), note: "baterias lançadas" },
    { label: "LIMITE", value: "10 + SF", note: "melhores notas" },
  ];
  rect(commands, x, y, width, height, colors.surface);
  strokeRect(commands, x, y, width, height, colors.line, 0.8);
  const metricWidth = width / metrics.length;
  metrics.forEach((metric, index) => {
    const metricX = x + index * metricWidth;
    if (index > 0) line(commands, metricX, y + 11, metricX, y + height - 11, colors.line, 0.8);
    text(commands, metric.label, metricX + 20, y + 19, 8.5, "F1", colors.orange, 1.4);
    text(commands, metric.value, metricX + 20, y + 48, 23, "F1", colors.ink);
    text(commands, metric.note, metricX + metricWidth - 142, y + 47, 8.3, "F2", colors.muted);
  });
}

function drawPodium(commands: string[], rows: OverallRow[]) {
  text(commands, "QUEM LIDERA AGORA", 42, 232, 10, "F1", colors.orange, 1.8);
  const cards = [
    { x: 42, width: 443, rank: "1", label: "LIDER GERAL", accent: colors.gold },
    { x: 524, width: 443, rank: "2", label: "SEGUNDO", accent: "#D2D5CB" },
    { x: 1006, width: 443, rank: "3", label: "TERCEIRO", accent: colors.orange },
  ];

  cards.forEach((card, index) => {
    const row = rows[index];
    rect(commands, card.x, 250, card.width, 104, colors.surface);
    strokeRect(commands, card.x, 250, card.width, 104, colors.line, 0.8);
    rect(commands, card.x, 250, 7, 104, card.accent);
    rect(commands, card.x + 23, 269, 61, 61, card.accent);
    text(commands, card.rank, card.x + 44, 311, 32, "F1", colors.darkInk);
    text(commands, card.label, card.x + 109, 275, 8.5, "F1", colors.faint, 1.3);
    text(commands, fitText(row?.driverName ?? "A definir", 184, 16, 38), card.x + 109, 304, 16, "F1", colors.ink);
    text(commands, row ? formatScore(row.total) : "-", card.x + card.width - 128, 307, 25, "F1", colors.gold);
    text(commands, row ? `${row.wins} vitória${row.wins === 1 ? "" : "s"}` : "", card.x + 109, 326, 8.5, "F2", colors.muted);
  });
}

function drawTimeline(commands: string[], columns: ScoreColumn[]) {
  text(commands, "RÉGUA DAS NOTAS", 42, 386, 10, "F1", colors.orange, 1.8);
  text(commands, "P = melhores pontuações regulares em ordem decrescente; a Super Final entra separadamente.", 229, 386, 9, "F2", colors.muted);

  const visibleColumns = columns.slice(0, 14);
  const perRow = 7;
  const gap = 9;
  const x = 42;
  const width = (pageWidth - 84 - gap * (perRow - 1)) / perRow;
  visibleColumns.forEach((column, index) => {
    const row = Math.floor(index / perRow);
    const columnIndex = index % perRow;
    const cellX = x + columnIndex * (width + gap);
    const cellY = 404 + row * 64;
    rect(commands, cellX, cellY, width, 52, colors.surface);
    strokeRect(commands, cellX, cellY, width, 52, colors.line, 0.8);
    rect(commands, cellX, cellY, width, 5, column.type === "super_final" ? colors.gold : colors.orange);
    drawPerforations(commands, cellX + 12, cellY + 12, width - 24, colors.line);
    text(commands, column.label, cellX + 13, cellY + 30, 12, "F1", colors.ink);
    text(commands, column.type === "super_final" ? "resultado extra" : "nota válida considerada", cellX + 13, cellY + 44, 8.5, "F2", colors.muted);
  });

  if (columns.length > visibleColumns.length) {
    text(commands, `+ ${columns.length - visibleColumns.length} resultados na matriz`, 42, 548, 8.5, "F2", colors.orange);
  }
}

function drawOverviewRules(commands: string[]) {
  const y = 570;
  const leftX = 42;
  const gap = 18;
  const leftWidth = 706;
  const rightX = leftX + leftWidth + gap;
  const rightWidth = pageWidth - rightX - 42;
  const height = 386;

  rect(commands, leftX, y, leftWidth, height, colors.surface);
  rect(commands, rightX, y, rightWidth, height, colors.surface);
  strokeRect(commands, leftX, y, leftWidth, height, colors.line, 0.8);
  strokeRect(commands, rightX, y, rightWidth, height, colors.line, 0.8);

  text(commands, "COMO NASCE A PONTUAÇÃO", leftX + 22, y + 32, 10, "F1", colors.orange, 1.6);
  text(commands, "BATERIA REGULAR", leftX + 22, y + 70, 9, "F1", colors.gold, 1.2);
  text(commands, "10,000 - diferença em segundos para o melhor tempo", leftX + 22, y + 94, 14, "F1", colors.ink);
  text(commands, "Ex.: 0,500 s mais lento = 9,500 pontos.", leftX + 22, y + 116, 10, "F2", colors.muted);

  drawRuleLine(commands, leftX + 22, y + 157, "8.1", "Cada resultado parte da melhor volta da bateria.");
  drawRuleLine(commands, leftX + 22, y + 191, "8.2", "Empate: primeiro registro mantém o tempo; os seguintes somam 0,001 s.");
  drawRuleLine(commands, leftX + 22, y + 225, "8.3", "Diferença superior a 9 s: pontuação mínima de 1,000.");
  drawRuleLine(commands, leftX + 22, y + 259, "8.4", "Até 10 melhores corridas; ausências e DSQ podem ser descartados.");
  drawRuleLine(commands, leftX + 22, y + 293, "8.5", "A Super Final soma uma corrida extra com base de 5,000.");
  drawRuleLine(commands, leftX + 22, y + 327, "8.6", "Nota posterior melhor substitui a menor; ela vira descarte.");

  text(commands, "COMO LER A MATRIZ", rightX + 22, y + 32, 10, "F1", colors.orange, 1.6);
  drawStateKey(commands, rightX + 22, y + 69, colors.gold, "V", "vitória / resultado de 10,000");
  drawStateKey(commands, rightX + 22, y + 105, colors.discard, "D", "retido / pior resultado, não soma");
  drawStateKey(commands, rightX + 22, y + 141, colors.surfaceAlt, "-", "sem resultado publicado / ausência");
  drawStateKey(commands, rightX + 22, y + 177, colors.orange, "SF", "Super Final, quando existir");

  text(commands, "DESEMPATE 8.7", rightX + 22, y + 232, 9, "F1", colors.gold, 1.2);
  text(commands, "1. maior número de vitórias", rightX + 22, y + 258, 11, "F1", colors.ink);
  text(commands, "2. melhor pontuação abaixo das vitórias", rightX + 22, y + 281, 11, "F1", colors.ink);
  text(commands, "3. melhor 2ª pontuação abaixo das vitórias", rightX + 22, y + 304, 11, "F1", colors.ink);
  text(commands, "4. assim sucessivamente até a última válida", rightX + 22, y + 327, 11, "F1", colors.ink);
  text(commands, "5. sorteio", rightX + 22, y + 350, 11, "F1", colors.orange);
}

function drawRuleLine(commands: string[], x: number, y: number, rule: string, value: string) {
  text(commands, rule, x, y, 8.5, "F1", colors.orange, 0.8);
  text(commands, fitText(value, 600, 9.5, 85), x + 43, y, 9.5, "F2", colors.ink);
}

function drawStateKey(commands: string[], x: number, y: number, fill: string, marker: string, label: string) {
  rect(commands, x, y - 13, 37, 24, fill);
  strokeRect(commands, x, y - 13, 37, 24, colors.line, 0.6);
  centeredText(commands, marker, x + 18.5, y + 4, marker.length > 1 ? 8 : 11, "F1", fill === colors.gold ? colors.darkInk : colors.ink);
  text(commands, label, x + 50, y + 4, 9.5, "F2", colors.ink);
}

function drawMatrixLegend(commands: string[], totalRows: number, hasMoreColumns: boolean) {
  const y = 128;
  text(commands, `${totalRows} pilotos / cada linha mostra as 10 melhores notas regulares em ordem decrescente.`, 42, y + 15, 9, "F2", colors.muted);
  text(commands, "V vitória", 700, y + 15, 8.5, "F1", colors.gold);
  text(commands, "D retido", 794, y + 15, 8.5, "F1", colors.discardText);
  text(commands, "- sem resultado", 892, y + 15, 8.5, "F1", colors.muted);
  if (hasMoreColumns) {
    text(commands, "descarte após a 10ª nota", 1080, y + 15, 8.5, "F1", colors.orange);
  }
}

function drawRankingTable(commands: string[], rows: OverallRow[], scoreColumns: ScoreColumn[]) {
  const x = 22;
  const y = 168;
  const width = pageWidth - 44;
  const headerHeight = 60;
  const bottom = 976;
  const bodyY = y + headerHeight;
  const rowHeight = Math.min(42, (bottom - bodyY) / Math.max(rows.length, 1));
  const baseline = rowHeight * 0.64;
  const fontSize = Math.min(11, Math.max(9.2, rowHeight * 0.31));
  const scoreFontSize = Math.min(9.7, Math.max(8.3, rowHeight * 0.27));
  const columns = tableColumns(x + 8, scoreColumns.length, x + width - 8);

  rect(commands, x, y, width, bottom - y, colors.surface);
  strokeRect(commands, x, y, width, bottom - y, colors.line, 0.9);
  rect(commands, x + 8, y + 8, width - 16, headerHeight - 8, colors.header);
  drawTableHeaders(commands, columns, scoreColumns, y + 8);

  rows.forEach((row, index) => {
    const top = bodyY + index * rowHeight;
    const fill = index % 2 === 0 ? colors.surface : colors.surfaceAlt;
    rect(commands, x + 8, top, width - 16, rowHeight, fill);

    const rankFill = row.position <= 3 ? colors.gold : colors.header;
    rect(commands, columns.pos.x, top, columns.pos.w, rowHeight, rankFill);
    centeredText(commands, String(row.position), columns.pos.x + columns.pos.w / 2, top + baseline, fontSize, "F1", row.position <= 3 ? colors.darkInk : colors.ink);
    text(commands, fitText(row.driverName, columns.driver.w - 18, fontSize, 44), columns.driver.x + 10, top + baseline, fontSize, "F1", row.position <= 3 ? colors.gold : colors.ink);
    centeredText(commands, `${row.validRegularResults}/10`, columns.valid.x + columns.valid.w / 2, top + baseline, fontSize - 0.5, "F1", colors.ink);
    centeredText(commands, String(row.discardedCount), columns.discarded.x + columns.discarded.w / 2, top + baseline, fontSize - 0.5, "F1", row.discardedCount ? colors.discardText : colors.faint);
    centeredText(commands, String(row.wins), columns.wins.x + columns.wins.w / 2, top + baseline, fontSize - 0.5, "F1", row.wins ? colors.gold : colors.faint);

    scoreColumns.forEach((column, columnIndex) => {
      const scoreColumn = columns.scores[columnIndex];
      const result = column.type === "super_final"
        ? column.heatId ? row.heatScores.get(column.heatId) : undefined
        : row.bestRegularResults[column.slot ?? 0];
      drawScoreCell(commands, column, result, false, scoreColumn.x, top, scoreColumn.w, rowHeight, scoreFontSize);
    });

    rect(commands, columns.total.x, top, columns.total.w, rowHeight, colors.header);
    text(commands, formatScore(row.total), columns.total.x + 10, top + baseline, Math.min(14, fontSize + 2.5), "F1", colors.gold);
    line(commands, x + 8, top + rowHeight, x + width - 8, top + rowHeight, colors.line, 0.5);
  });

  const tableBottom = bodyY + rows.length * rowHeight;
  const verticals: TableColumn[] = [columns.pos, columns.driver, columns.valid, columns.discarded, columns.wins, ...columns.scores, columns.total];
  verticals.forEach((column) => line(commands, column.x, y + 8, column.x, tableBottom, colors.line, 0.45));
  line(commands, columns.total.x + columns.total.w, y + 8, columns.total.x + columns.total.w, tableBottom, colors.line, 0.45);

}

function drawScoreCell(
  commands: string[],
  column: ScoreColumn,
  result: LegendsOverallResult | undefined,
  discarded: boolean,
  x: number,
  y: number,
  width: number,
  height: number,
  fontSize: number,
) {
  if (!result) {
    centeredText(commands, "-", x + width / 2, y + height * 0.64, fontSize + 0.5, "F1", colors.faint);
    return;
  }

  if (discarded) {
    rect(commands, x, y, width, height, colors.discard);
    rect(commands, x, y, width, 3, colors.orange);
    text(commands, "D", x + width - 12, y + 10, 6.5, "F1", colors.discardText);
  } else if (result.position === 1) {
    rect(commands, x, y, width, height, colors.gold);
    text(commands, "V", x + width - 12, y + 10, 6.5, "F1", colors.darkInk);
  }

  const color = discarded ? colors.discardText : result.position === 1 ? colors.darkInk : colors.ink;
  centeredText(commands, formatScore(result.score), x + width / 2, y + height * 0.64, fontSize, "F1", color);
  if (column.type === "super_final" && !discarded) {
    line(commands, x + 8, y + height - 4, x + width - 8, y + height - 4, colors.gold, 1);
  }
}

function drawTableHeaders(commands: string[], columns: ReturnType<typeof tableColumns>, scoreColumns: ScoreColumn[], y: number) {
  centeredText(commands, "POS", columns.pos.x + columns.pos.w / 2, y + 38, 8.2, "F1", colors.ink);
  text(commands, "PILOTO", columns.driver.x + 10, y + 38, 8.2, "F1", colors.ink, 1.1);
  centeredText(commands, "VÁLIDAS", columns.valid.x + columns.valid.w / 2, y + 30, 7.4, "F1", colors.ink);
  centeredText(commands, "/10", columns.valid.x + columns.valid.w / 2, y + 45, 7.4, "F2", colors.muted);
  centeredText(commands, "RET.", columns.discarded.x + columns.discarded.w / 2, y + 38, 7.4, "F1", colors.ink);
  centeredText(commands, "VIT.", columns.wins.x + columns.wins.w / 2, y + 38, 7.4, "F1", colors.ink);
  scoreColumns.forEach((column, index) => {
    const scoreColumn = columns.scores[index];
    if (column.type === "super_final") {
      centeredText(commands, "SUPER", scoreColumn.x + scoreColumn.w / 2, y + 25, 6.8, "F1", colors.gold);
      centeredText(commands, "FINAL", scoreColumn.x + scoreColumn.w / 2, y + 42, 6.8, "F1", colors.gold);
    } else {
      centeredText(commands, "PONTUAÇÃO", scoreColumn.x + scoreColumn.w / 2, y + 25, 6.4, "F1", colors.ink);
      centeredText(commands, String((column.slot ?? index) + 1), scoreColumn.x + scoreColumn.w / 2, y + 43, 8, "F1", colors.ink);
    }
  });
  centeredText(commands, "TOTAL", columns.total.x + columns.total.w / 2, y + 38, 8, "F1", colors.gold);
}

function tableColumns(startX: number, scoreColumnCount: number, rightEdge: number) {
  const pos = { x: startX, w: 52 };
  const driver = { x: pos.x + pos.w, w: 270 };
  const valid = { x: driver.x + driver.w, w: 72 };
  const discarded = { x: valid.x + valid.w, w: 54 };
  const wins = { x: discarded.x + discarded.w, w: 50 };
  const total = { x: 0, w: 101 };
  const scoreAvailable = rightEdge - (wins.x + wins.w) - total.w;
  const scoreWidth = scoreColumnCount > 0 ? scoreAvailable / scoreColumnCount : 0;
  const scores = Array.from({ length: scoreColumnCount }, (_, index) => ({
    x: wins.x + wins.w + index * scoreWidth,
    w: scoreWidth,
  }));
  total.x = wins.x + wins.w + scoreWidth * scoreColumnCount;
  return { pos, driver, valid, discarded, wins, scores, total };
}

function drawFooter(commands: string[], pageNumber: number, pageCount: number, leftText: string) {
  text(commands, leftText, 42, 1035, 8.2, "F2", colors.faint, 0.5);
  line(commands, 450, 1030, 650, 1030, colors.orange, 1);
  text(commands, "LEGENDS KART SERIES", 1130, 1035, 9.5, "F1", colors.gold, 1.8);
  text(commands, `PÁGINA ${pageNumber} DE ${pageCount}`, 1341, 1035, 8.2, "F2", colors.muted, 0.6);
}

function drawPerforationRail(commands: string[], x: number, y: number, width: number, color: string) {
  line(commands, x, y, x + width, y, color, 0.7);
  for (let current = x + 12; current < x + width - 8; current += 27) {
    rect(commands, current, y - 3, 10, 6, color);
  }
}

function drawPerforations(commands: string[], x: number, y: number, width: number, color: string) {
  for (let current = x; current < x + width; current += 22) {
    rect(commands, current, y, 8, 3, color);
  }
}

function makePdf(streams: string[], logo: PdfImage | null): Uint8Array {
  const pageCount = streams.length;
  const pageStartId = 6;
  const contentStartId = pageStartId + pageCount;
  const objects: string[] = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    `<< /Type /Pages /Kids [${Array.from({ length: pageCount }, (_, index) => `${pageStartId + index} 0 R`).join(" ")}] /Count ${pageCount} >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
  ];

  if (logo) {
    objects.push(`<< /Type /XObject /Subtype /Image /Width ${logo.width} /Height ${logo.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${logo.data.length} >>\nstream\n${logo.data.toString("binary")}\nendstream`);
  } else {
    objects.push("<< >>");
  }

  const xObject = logo ? "/XObject << /Logo 5 0 R >>" : "";
  streams.forEach((stream, index) => {
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> ${xObject} >> /Contents ${contentStartId + index} 0 R >>`);
  });
  streams.forEach((stream) => {
    objects.push(`<< /Length ${Buffer.byteLength(stream, "binary")} >>\nstream\n${stream}\nendstream`);
  });

  const adjustedObjects = objects.map((object, index) => `${index + 1} 0 obj\n${object}\nendobj\n`);
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  adjustedObjects.forEach((object) => {
    offsets.push(Buffer.byteLength(pdf, "binary"));
    pdf += object;
  });
  const xrefOffset = Buffer.byteLength(pdf, "binary");
  pdf += `xref\n0 ${adjustedObjects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${adjustedObjects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return new Uint8Array(Buffer.from(pdf, "binary"));
}

function loadLogo(): PdfImage | null {
  if (!existsSync(logoPath)) return null;
  return { width: 520, height: 520, data: readFileSync(logoPath) };
}

function rect(commands: string[], x: number, y: number, width: number, height: number, color: string) {
  const [r, g, b] = rgb(color);
  commands.push(`${r} ${g} ${b} rg`);
  commands.push(`${fixed(x)} ${fixed(pageHeight - y - height)} ${fixed(width)} ${fixed(height)} re f`);
}

function strokeRect(commands: string[], x: number, y: number, width: number, height: number, color: string, lineWidth: number) {
  const [r, g, b] = rgb(color);
  commands.push(`${r} ${g} ${b} RG`);
  commands.push(`${fixed(lineWidth)} w`);
  commands.push(`${fixed(x)} ${fixed(pageHeight - y - height)} ${fixed(width)} ${fixed(height)} re S`);
}

function line(commands: string[], x1: number, y1: number, x2: number, y2: number, color: string, lineWidth: number) {
  const [r, g, b] = rgb(color);
  commands.push(`${r} ${g} ${b} RG`);
  commands.push(`${fixed(lineWidth)} w`);
  commands.push(`${fixed(x1)} ${fixed(pageHeight - y1)} m ${fixed(x2)} ${fixed(pageHeight - y2)} l S`);
}

function image(commands: string[], name: string, x: number, y: number, width: number, height: number) {
  commands.push("q");
  commands.push(`${fixed(width)} 0 0 ${fixed(height)} ${fixed(x)} ${fixed(pageHeight - y - height)} cm`);
  commands.push(`/${name} Do`);
  commands.push("Q");
}

function text(
  commands: string[],
  value: string,
  x: number,
  y: number,
  size: number,
  font: "F1" | "F2",
  color: string,
  letterSpacing = 0,
) {
  const [r, g, b] = rgb(color);
  const safeValue = sanitizePdfText(value);
  commands.push(`${r} ${g} ${b} rg`);
  commands.push("BT");
  commands.push(`/${font} ${fixed(size)} Tf`);
  commands.push(`${fixed(letterSpacing)} Tc`);
  commands.push(`${fixed(x)} ${fixed(pageHeight - y)} Td`);
  commands.push(`(${escapePdf(safeValue)}) Tj`);
  commands.push("ET");
}

function centeredText(
  commands: string[],
  value: string,
  centerX: number,
  y: number,
  size: number,
  font: "F1" | "F2",
  color: string,
) {
  const estimatedWidth = textWidth(value, size);
  text(commands, value, centerX - estimatedWidth / 2, y, size, font, color);
}

function rgb(hex: string): [string, string, string] {
  const value = hex.replace("#", "");
  return [fixed(parseInt(value.slice(0, 2), 16) / 255), fixed(parseInt(value.slice(2, 4), 16) / 255), fixed(parseInt(value.slice(4, 6), 16) / 255)];
}

function fixed(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}

function escapePdf(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function sanitizePdfText(value: string): string {
  return value
    .replace(/[º°]/g, "o")
    .replace(/[–—]/g, "-")
    .replace(/[“”]/g, '"')
    .replace(/[’]/g, "'")
    .replace(/[^\x20-\xff]/g, "");
}

function normalizeKey(value: string): string {
  return value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizeHeatType(value: string): "regular" | "super_final" {
  return value === "super_final" || value === "super-final" ? "super_final" : "regular";
}

function buildScoreColumns(heats: LegendsOverallHeat[]): ScoreColumn[] {
  const regularColumns = Array.from({ length: MAX_VALID_REGULAR_RESULTS }, (_, index) => ({
    label: `Pontuação ${index + 1}`,
    slot: index,
    type: "regular" as const,
  }));
  const superFinal = heats.find((heat) => normalizeHeatType(heat.type) === "super_final");
  return superFinal
    ? [...regularColumns, { label: "SF", heatId: superFinal.id, type: "super_final" as const }]
    : regularColumns;
}

function chunk<T>(values: T[], size: number): T[][] {
  const groups: T[][] = [];
  for (let index = 0; index < values.length; index += size) {
    groups.push(values.slice(index, index + size));
  }
  return groups;
}

function textWidth(value: string, size: number): number {
  return value.length * size * 0.48;
}

function fitText(value: string, maxWidth: number, size: number, maxLength: number): string {
  let candidate = value.length <= maxLength ? value : `${value.slice(0, Math.max(0, maxLength - 3))}...`;
  while (candidate.length > 4 && textWidth(candidate, size) > maxWidth) {
    candidate = `${candidate.slice(0, -4)}...`;
  }
  return candidate;
}
