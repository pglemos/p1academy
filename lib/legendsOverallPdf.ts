import { existsSync, readFileSync } from "fs";
import path from "path";
import { formatScore } from "./legendsScoring";

const pageWidth = 595;
const pageHeight = 842;
const margin = 28;
const tableWidth = pageWidth - margin * 2;
const rowHeight = 13.4;
const firstPageRows = 34;
const nextPageRows = 39;
const logoPath = path.join(process.cwd(), "public", "brand", "legends-kart-series-logo.jpg");

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
  validRegularResults: number;
  wins: number;
};

export type LegendsOverallResult = {
  heatId: string;
  driverName: string;
  score: number;
  position: number | null;
};

type PdfImage = {
  name: string;
  width: number;
  height: number;
  data: Buffer;
};

type OverallRow = LegendsOverallStanding & {
  heatScores: Map<string, LegendsOverallResult>;
};

type ScoreColumn = {
  labelTop: string;
  labelBottom: string;
  heatId: string | null;
};

export function buildLegendsOverallPdf(input: {
  championshipName: string;
  season: string;
  generatedAt: string;
  heats: LegendsOverallHeat[];
  standings: LegendsOverallStanding[];
  results: LegendsOverallResult[];
}): Uint8Array {
  const logo = loadLogo();
  const resultMap = new Map<string, Map<string, LegendsOverallResult>>();

  input.results.forEach((result) => {
    const driverKey = normalizeKey(result.driverName);
    const byHeat = resultMap.get(driverKey) ?? new Map<string, LegendsOverallResult>();
    byHeat.set(result.heatId, result);
    resultMap.set(driverKey, byHeat);
  });

  const rows = input.standings.map((standing) => ({
    ...standing,
    heatScores: resultMap.get(normalizeKey(standing.driverName)) ?? new Map<string, LegendsOverallResult>(),
  }));
  const pages = paginate(rows);
  const streams = pages.map((pageRows, pageIndex) =>
    buildPageContent({
      ...input,
      rows: pageRows,
      page: pageIndex + 1,
      totalPages: pages.length,
      hasLogo: Boolean(logo),
    }),
  );

  return makePdf(streams, logo);
}

function paginate(rows: OverallRow[]): OverallRow[][] {
  const pages: OverallRow[][] = [];
  const remaining = [...rows];
  pages.push(remaining.splice(0, firstPageRows));

  while (remaining.length) {
    pages.push(remaining.splice(0, nextPageRows));
  }

  return pages;
}

function buildPageContent(input: {
  championshipName: string;
  season: string;
  generatedAt: string;
  heats: LegendsOverallHeat[];
  standings: LegendsOverallStanding[];
  rows: OverallRow[];
  page: number;
  totalPages: number;
  hasLogo: boolean;
}): string {
  const commands: string[] = [];
  const tableTop = input.page === 1 ? 590 : 724;

  rect(commands, 0, 0, pageWidth, pageHeight, "#f4f3ef");
  drawTopBrand(commands, input, input.hasLogo);
  drawTable(commands, input.rows, input.heats, tableTop);
  drawFooter(commands, input.page, input.totalPages);

  return commands.join("\n");
}

function drawTopBrand(
  commands: string[],
  input: {
    championshipName: string;
    season: string;
    generatedAt: string;
    heats: LegendsOverallHeat[];
    standings: LegendsOverallStanding[];
    hasLogo: boolean;
  },
  hasLogo: boolean,
) {
  strokeLine(commands, margin, 812, 288, 812, "#141414", 4.2);
  strokeLine(commands, 307, 812, pageWidth - margin, 812, "#141414", 4.2);
  strokeLine(commands, margin, 676, 140, 676, "#141414", 4.2);
  strokeLine(commands, 156, 676, pageWidth - margin, 676, "#141414", 4.2);

  if (hasLogo) {
    image(commands, "Logo", 52, 695, 94, 94);
  } else {
    rect(commands, 52, 695, 94, 94, "#0c0c0b");
    text(commands, "LEGENDS", 67, 737, 12, "F1", "#f5b21a");
  }

  text(commands, "LEGENDS", 181, 763, 30, "F1", "#d8a513");
  text(commands, "KART SERIES", 181, 739, 15, "F1", "#141414");
  text(commands, "P1 ACADEMY", 405, 753, 18, "F1", "#6f6f6f");
  text(commands, "DRIVE TO PERFECTION", 407, 736, 7, "F2", "#8f8f8f");
  text(commands, "RESULTADO GERAL", 390, 708, 15, "F1", "#d8a513");

  text(commands, `TABELA ATUALIZADA EM: ${input.generatedAt}`, 213, 664, 5.8, "F1", "#777777");
  rect(commands, margin, 642, tableWidth, 22, "#202020");
  text(commands, `- ${input.season} - CLASSIFICACAO - LEGENDS KART SERIES`, 118, 648.5, 13, "F1", "#ffffff");
  rect(commands, margin, 628, tableWidth, 12, "#262626");
  text(commands, `RESULTADOS LANCADOS: ${input.heats.length}`, 250, 632, 5.7, "F1", "#ffffff");
  text(commands, `QTD TOTAL DE PILOTOS: ${input.standings.length}`, pageWidth - 132, 632, 5.7, "F1", "#bdbdbd");
}

function drawTable(commands: string[], rows: OverallRow[], heats: LegendsOverallHeat[], top: number) {
  const scoreColumns = buildScoreColumns(heats);
  const layout = tableLayout(scoreColumns.length);
  const headerHeight = 36;

  rect(commands, margin, top, tableWidth, headerHeight, "#242424");
  verticalRule(commands, margin + layout.pos, top, headerHeight + rowHeight * rows.length);
  verticalRule(commands, margin + layout.pos + layout.driver, top, headerHeight + rowHeight * rows.length);
  verticalRule(commands, margin + layout.pos + layout.driver + layout.bat, top, headerHeight + rowHeight * rows.length);
  verticalRule(commands, layout.totalX, top, headerHeight + rowHeight * rows.length);
  verticalRule(commands, layout.totalX + layout.total, top, headerHeight + rowHeight * rows.length);
  verticalRule(commands, layout.finalPosX, top, headerHeight + rowHeight * rows.length);

  text(commands, "POSICAO", margin + 7, top + 14, 5.8, "F1", "#ffffff");
  text(commands, "PILOTO", margin + layout.pos + 58, top + 14, 5.8, "F1", "#ffffff");
  text(commands, "BAT", margin + layout.pos + layout.driver + 5, top + 19, 5.2, "F1", "#ffffff");
  text(commands, "VIT", margin + layout.pos + layout.driver + 5, top + 9, 5.2, "F1", "#ffffff");
  text(commands, "RESULTADOS LANCADOS", layout.heatStart + Math.max(2, layout.heatWidth * scoreColumns.length * 0.22), top + 27, 5.4, "F1", "#ffffff");

  scoreColumns.forEach((column, index) => {
    const x = layout.heatStart + index * layout.heatWidth;
      text(commands, column.labelTop, x + 1.8, top + 13.5, 3.8, "F1", "#ffffff");
      text(commands, column.labelBottom, x + 6.2, top + 5.8, 4.5, "F1", "#ffffff");
  });
  text(commands, "TOTAL", layout.totalX + 10, top + 14, 5.8, "F1", "#ffffff");
  text(commands, "POS", layout.finalPosX + 7, top + 14, 5.8, "F1", "#ffffff");

  rows.forEach((row, index) => {
    const y = top - (index + 1) * rowHeight;
    rect(commands, margin, y, tableWidth, rowHeight, index % 2 === 0 ? "#e9e9e7" : "#d7d7d5");
    strokeLine(commands, margin, y, pageWidth - margin, y, "#ffffff", 0.45);

    text(commands, `${row.position}o`, margin + 8, y + 4.2, 6.4, "F1", "#111111");
    text(commands, trim(row.driverName, layout.nameChars), margin + layout.pos + 8, y + 4.2, 6.1, "F1", "#111111");
    text(commands, `${row.validRegularResults}/10`, margin + layout.pos + layout.driver + 5, y + 4.2, 5.6, "F1", "#2b2b2b");
    text(commands, String(row.wins), margin + layout.pos + layout.driver + layout.bat - 10, y + 4.2, 5.6, "F1", "#2b2b2b");

    scoreColumns.forEach((column, heatIndex) => {
      const x = layout.heatStart + heatIndex * layout.heatWidth;
      const result = column.heatId ? row.heatScores.get(column.heatId) : undefined;
      if (result && result.score >= 9.99) {
        rect(commands, x, y, layout.heatWidth, rowHeight, "#f6c21a");
      } else if (result?.position === 1) {
        rect(commands, x, y, layout.heatWidth, rowHeight, "#f3d45a");
      }
      text(commands, result ? formatScore(result.score) : "X", x + 1.4, y + 4.2, 4.5, "F1", "#111111");
    });

    text(commands, formatScore(row.total), layout.totalX + 7, y + 4.2, 6.4, "F1", "#00a965");
    text(commands, `${row.position}o`, layout.finalPosX + 7, y + 4.2, 6.2, "F1", "#111111");
  });

  strokeRect(commands, margin, top - rows.length * rowHeight, tableWidth, headerHeight + rows.length * rowHeight, "#ffffff", 0.8);
}

function tableLayout(scoreColumnCount: number) {
  const pos = 45;
  const driver = scoreColumnCount > 8 ? 162 : 174;
  const bat = 32;
  const total = 49;
  const finalPos = 28;
  const heatStart = margin + pos + driver + bat;
  const totalX = pageWidth - margin - finalPos - total;
  const finalPosX = pageWidth - margin - finalPos;
  const heatWidth = Math.max(18, Math.min(42, (totalX - heatStart) / Math.max(1, scoreColumnCount)));

  return {
    pos,
    driver,
    bat,
    heatStart,
    heatWidth,
    total,
    totalX,
    finalPosX,
    nameChars: scoreColumnCount > 8 ? 30 : 30,
  };
}

function buildScoreColumns(heats: LegendsOverallHeat[]): ScoreColumn[] {
  const regularByNumber = new Map<number, LegendsOverallHeat>();
  let fallbackRegularIndex = 1;
  let superFinal: LegendsOverallHeat | undefined;

  heats.forEach((heat) => {
    if (heat.type === "super_final") {
      superFinal = heat;
      return;
    }

    const explicitNumber = heatNumber(heat.title);
    const number = explicitNumber ?? fallbackRegularIndex;
    regularByNumber.set(number, heat);
    fallbackRegularIndex += 1;
  });

  const columns: ScoreColumn[] = [];
  for (let index = 1; index <= 10; index += 1) {
    columns.push({
      labelTop: "PONTUA",
      labelBottom: String(index).padStart(2, "0"),
      heatId: regularByNumber.get(index)?.id ?? null,
    });
  }

  columns.push({
    labelTop: "SUPER",
    labelBottom: "FINAL",
    heatId: superFinal?.id ?? null,
  });

  return columns;
}

function drawFooter(commands: string[], page: number, totalPages: number) {
  strokeLine(commands, margin, 36, pageWidth - margin, 36, "#1f1f1f", 0.8);
  text(commands, "Resultado geral oficial - pontos por bateria publicada, total acumulado e posicao final.", margin, 21, 6.4, "F2", "#444444");
  text(commands, `Pagina ${page} de ${totalPages}`, pageWidth - 92, 21, 6.4, "F1", "#444444");
}

function verticalRule(commands: string[], x: number, top: number, height: number) {
  strokeLine(commands, x, top + 36, x, top - height + 36, "#ffffff", 0.45);
}

function makePdf(pageStreams: string[], logo: PdfImage | null): Uint8Array {
  const objects: string[] = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [] /Count 0 >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];

  let logoObjectId: number | null = null;
  if (logo) {
    logoObjectId = objects.length + 1;
    objects.push(`<< /Type /XObject /Subtype /Image /Width ${logo.width} /Height ${logo.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${logo.data.length} >>\nstream\n${logo.data.toString("binary")}\nendstream`);
  }

  const pageObjectIds: number[] = [];
  pageStreams.forEach((stream) => {
    const pageId = objects.length + 1;
    const contentId = objects.length + 2;
    pageObjectIds.push(pageId);
    const xObject = logoObjectId ? `/XObject << /Logo ${logoObjectId} 0 R >>` : "";
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> ${xObject} >> /Contents ${contentId} 0 R >>`);
    objects.push(`<< /Length ${Buffer.byteLength(stream, "binary")} >>\nstream\n${stream}\nendstream`);
  });

  objects[1] = `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageObjectIds.length} >>`;

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
  if (!existsSync(logoPath)) {
    return null;
  }

  return {
    name: "Logo",
    width: 520,
    height: 520,
    data: readFileSync(logoPath),
  };
}

function rect(commands: string[], x: number, y: number, width: number, height: number, color: string) {
  const [r, g, b] = rgb(color);
  commands.push(`${r} ${g} ${b} rg`);
  commands.push(`${fixed(x)} ${fixed(y)} ${fixed(width)} ${fixed(height)} re f`);
}

function strokeRect(commands: string[], x: number, y: number, width: number, height: number, color: string, lineWidth: number) {
  const [r, g, b] = rgb(color);
  commands.push(`${r} ${g} ${b} RG`);
  commands.push(`${fixed(lineWidth)} w`);
  commands.push(`${fixed(x)} ${fixed(y)} ${fixed(width)} ${fixed(height)} re S`);
}

function strokeLine(commands: string[], x1: number, y1: number, x2: number, y2: number, color: string, lineWidth: number) {
  const [r, g, b] = rgb(color);
  commands.push(`${r} ${g} ${b} RG`);
  commands.push(`${fixed(lineWidth)} w`);
  commands.push(`${fixed(x1)} ${fixed(y1)} m ${fixed(x2)} ${fixed(y2)} l S`);
}

function image(commands: string[], name: string, x: number, y: number, width: number, height: number) {
  commands.push("q");
  commands.push(`${fixed(width)} 0 0 ${fixed(height)} ${fixed(x)} ${fixed(y)} cm`);
  commands.push(`/${name} Do`);
  commands.push("Q");
}

function text(commands: string[], value: string, x: number, y: number, size: number, font: "F1" | "F2", color: string) {
  const [r, g, b] = rgb(color);
  commands.push(`${r} ${g} ${b} rg`);
  commands.push("BT");
  commands.push(`/${font} ${fixed(size)} Tf`);
  commands.push(`${fixed(x)} ${fixed(y)} Td`);
  commands.push(`(${escapePdf(value)}) Tj`);
  commands.push("ET");
}

function rgb(hex: string): [string, string, string] {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;
  return [fixed(r), fixed(g), fixed(b)];
}

function fixed(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}

function trim(value: string, max: number): string {
  const safe = safeText(value);
  return safe.length > max ? `${safe.slice(0, max - 3)}...` : safe;
}

function safeText(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function escapePdf(value: string): string {
  return safeText(value)
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function normalizeKey(value: string): string {
  return safeText(value).trim().replace(/\s+/g, " ").toUpperCase();
}

function heatNumber(title: string): number | null {
  const titleMatch = title.match(/bateria\s*(\d+)/i);
  return titleMatch ? Number(titleMatch[1]) : null;
}
