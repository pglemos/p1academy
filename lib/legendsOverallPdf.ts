import { existsSync, readFileSync } from "fs";
import path from "path";
import { formatScore } from "./legendsScoring";

const pageWidth = 1491;
const pageHeight = 1055;
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
  width: number;
  height: number;
  data: Buffer;
};

type OverallRow = LegendsOverallStanding & {
  heatScores: Map<string, LegendsOverallResult>;
};

type ScoreColumn = {
  label: string;
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
  const rows = buildRows(input);
  const logo = loadLogo();
  const commands: string[] = [];

  drawBackground(commands);
  drawHeader(commands, input, Boolean(logo));
  drawPodium(commands, rows);
  drawTable(commands, input, rows, buildScoreColumns(input.heats));
  drawFooter(commands, Boolean(logo));

  return makePdf(commands.join("\n"), logo);
}

function buildRows(input: {
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

  return input.standings.map((standing) => ({
    ...standing,
    heatScores: resultMap.get(normalizeKey(standing.driverName)) ?? new Map<string, LegendsOverallResult>(),
  }));
}

function drawBackground(commands: string[]) {
  rect(commands, 0, 0, pageWidth, pageHeight, "#080909");
  rect(commands, 0, 0, pageWidth, 68, "#10120f");
  rect(commands, 0, 147, pageWidth, 2.2, "#c99215");
  rect(commands, 0, 257, pageWidth, 2.2, "#c99215");
  rect(commands, 0, 0, 304, 163, "#0f100e");

  for (let x = -100; x < pageWidth; x += 44) {
    line(commands, x, 0, x + 250, 260, "#151914", 0.8);
  }

  line(commands, 972, 20, 948, 104, "#f5c41d", 8);
  line(commands, 993, 20, 970, 92, "#b98515", 3);
  line(commands, 1028, 23, 1468, 23, "#72520f", 1);
}

function drawHeader(
  commands: string[],
  input: {
    season: string;
    generatedAt: string;
    heats: LegendsOverallHeat[];
    standings: LegendsOverallStanding[];
  },
  hasLogo: boolean,
) {
  if (hasLogo) {
    image(commands, "Logo", 62, 13, 210, 132);
  } else {
    text(commands, "LEGENDS", 78, 72, 38, "F1", "#f4be16");
  }

  text(commands, "LEGENDS KART SERIES", 344, 50, 20, "F1", "#f4be16", 6);
  text(commands, "RESULTADO GERAL", 337, 121, 62, "F1", "#44443f", -1);
  text(commands, "RESULTADO GERAL", 337, 116, 62, "F1", "#f0eee9", -1);
  text(commands, "CLASSIFICACAO OFICIAL POR PONTUACAO ACUMULADA", 336, 158, 12, "F1", "#c5c0b5", 5);

  text(commands, "TEMPORADA", 1030, 50, 11, "F1", "#9e9a8f", 1.3);
  text(commands, input.season, 1030, 83, 27, "F1", "#f5c21d");
  line(commands, 1178, 42, 1206, 94, "#aa7d16", 1.2);
  text(commands, "ATUALIZADO EM", 1217, 50, 11, "F1", "#9e9a8f", 1.3);
  text(commands, input.generatedAt, 1217, 80, 20, "F1", "#f0eee9");

  drawSummary(commands, 952, 96, "2", String(input.heats.length), "RESULTADOS", "LANCADOS");
  drawSummary(commands, 1124, 96, "3", String(input.standings.length), "PILOTOS", "NO CAMPEONATO");
  drawSummary(commands, 1296, 96, "4", "10 + SF", "BATERIAS", "VALIDAS");
}

function drawSummary(
  commands: string[],
  x: number,
  y: number,
  iconText: string,
  value: string,
  label1: string,
  label2: string,
) {
  rect(commands, x, y, 172, 72, "#171914");
  strokeRect(commands, x, y, 172, 72, "#b68413", 1);
  circleApprox(commands, x + 35, y + 36, 20, "#272922");
  text(commands, iconText, x + 29, y + 44, 16, "F1", "#f5c21d");
  text(commands, value, x + 68, y + 35, value.length > 3 ? 25 : 29, "F1", "#f5c21d");
  text(commands, label1, x + 68, y + 50, 8.5, "F1", "#d2cfc7");
  text(commands, label2, x + 68, y + 61, 8.5, "F1", "#d2cfc7");
}

function drawPodium(commands: string[], rows: OverallRow[]) {
  const configs = [
    { x: 20, w: 505, rank: "1", title: "LIDER GERAL", fill: "#f4c21d" },
    { x: 541, w: 440, rank: "2", title: "2o COLOCADO", fill: "#d8d8d4" },
    { x: 997, w: 430, rank: "3", title: "3o COLOCADO", fill: "#c46f2e" },
  ];

  rows.slice(0, 3).forEach((row, index) => {
    const card = configs[index];
    rect(commands, card.x, 182, card.w, 74, "#151714");
    strokeRect(commands, card.x, 182, card.w, 74, "#c99315", 1.2);
    rect(commands, card.x + 42, 193, 54, 48, card.fill);
    text(commands, card.rank, card.x + 61, 230, 34, "F1", "#111111");
    text(commands, card.title, card.x + 113, 209, 9, "F1", "#9f9b90");
    text(commands, trim(row.driverName, index === 0 ? 30 : 22), card.x + 113, 232, 17, "F1", "#f7f5ee");
    text(commands, formatScore(row.total), card.x + card.w - 106, 235, 28, "F1", "#f6c21d");
  });
}

function drawTable(
  commands: string[],
  input: {
    season: string;
    heats: LegendsOverallHeat[];
    standings: LegendsOverallStanding[];
  },
  rows: OverallRow[],
  scoreColumns: ScoreColumn[],
) {
  const x = 13;
  const y = 270;
  const width = 1466;
  const height = 704;
  const headerY = y + 38;
  const bodyY = headerY + 40;
  const availableBodyHeight = y + height - 18 - bodyY;
  const rowHeight = Math.min(18.45, availableBodyHeight / Math.max(1, rows.length));
  const baseline = Math.min(13.2, rowHeight * 0.74);
  const bodyFont = Math.min(8.7, rowHeight * 0.53);
  const smallFont = Math.min(8.2, rowHeight * 0.5);
  const totalFont = Math.min(15, rowHeight * 0.76);
  const cols = tableColumns(x + 10);

  rect(commands, x, y, width, height, "#0f100f");
  strokeRect(commands, x, y, width, height, "#c69216", 1.8);
  text(commands, input.season, x + 25, y + 28, 21, "F1", "#f0eee7");
  text(commands, "-", x + 89, y + 28, 18, "F1", "#dd4c2b");
  text(commands, "CLASSIFICACAO GERAL", x + 112, y + 28, 21, "F1", "#f0eee7");
  text(commands, "-", x + 377, y + 28, 18, "F1", "#dd4c2b");
  text(commands, "LEGENDS KART SERIES", x + 401, y + 28, 21, "F1", "#f0eee7");
  text(commands, `${input.standings.length} PILOTOS`, x + width - 260, y + 24, 10, "F1", "#d6d3cb");
  text(commands, "-", x + width - 180, y + 24, 10, "F1", "#dd4c2b");
  text(commands, `${input.heats.length} RESULTADOS LANCADOS`, x + width - 164, y + 24, 10, "F1", "#d6d3cb");

  rect(commands, x + 10, headerY, width - 20, 40, "#171914");
  text(commands, "PONTUACOES PUBLICADAS", 820, headerY + 12, 8, "F1", "#bdb8ad");
  drawHeaders(commands, cols, scoreColumns, headerY);

  rows.forEach((row, index) => {
    const top = bodyY + index * rowHeight;
    const fill = index % 2 === 0 ? "#20231d" : "#151815";
    rect(commands, x + 10, top, width - 20, rowHeight, fill);

    const posFill = row.position <= 10 ? "#f0c11f" : "#e8e6de";
    rect(commands, cols.pos.x, top, cols.pos.w, rowHeight, posFill);
    text(commands, String(row.position), cols.pos.x + 26, top + baseline, bodyFont, "F1", "#111111");
    text(commands, trim(row.driverName, 34), cols.driver.x + 10, top + baseline, bodyFont, "F1", row.position <= 3 ? "#f2c021" : "#f3f0e8");
    text(commands, `${row.validRegularResults}/10`, cols.bat.x + 24, top + baseline, smallFont, "F1", "#f3f0e8");
    text(commands, String(row.wins), cols.vit.x + 26, top + baseline, smallFont, "F1", "#f3f0e8");

    scoreColumns.forEach((column, columnIndex) => {
      const col = cols.scores[columnIndex];
      const result = column.heatId ? row.heatScores.get(column.heatId) : undefined;
      if (!result) {
        text(commands, "X", col.x + col.w / 2 - 3, top + baseline, smallFont, "F2", "#a7a7a0");
        return;
      }
      const hot = result.position === 1 || result.score >= 9.99;
      if (hot) rect(commands, col.x, top, col.w, rowHeight, "#f2bf1d");
      text(commands, formatScore(result.score), col.x + 20, top + baseline, smallFont, "F1", hot ? "#111111" : "#f3f0e8");
    });

    text(commands, formatScore(row.total), cols.total.x + 21, top + Math.min(14.8, rowHeight * 0.83), totalFont, "F1", "#f4bd18");
    text(commands, `${row.position}o`, cols.final.x + 23, top + baseline, smallFont, "F1", "#f3f0e8");
    line(commands, x + 10, top + rowHeight, x + width - 10, top + rowHeight, "#52421b", 0.45);
  });

  const bottom = bodyY + rows.length * rowHeight;
  [...Object.values(cols.fixed), ...cols.scores, cols.total, cols.final].forEach((col) => {
    line(commands, col.x, headerY, col.x, bottom, "#7a5a16", 0.45);
  });
}

function drawHeaders(commands: string[], cols: ReturnType<typeof tableColumns>, scoreColumns: ScoreColumn[], y: number) {
  const header = (label: string, x: number, w: number) => {
    text(commands, label, x + Math.max(8, w / 2 - label.length * 2.3), y + 25, label.length > 5 ? 7.4 : 8.5, "F1", "#f1eee6");
  };
  header("POS", cols.pos.x, cols.pos.w);
  header("PILOTO", cols.driver.x, cols.driver.w);
  header("BAT", cols.bat.x, cols.bat.w);
  header("VIT", cols.vit.x, cols.vit.w);
  scoreColumns.forEach((column, index) => {
    const col = cols.scores[index];
    const [top, bottom] = column.label.split(" ");
    text(commands, top, col.x + col.w / 2 - 4, y + 19, 7.4, "F1", "#f1eee6");
    text(commands, bottom ?? "", col.x + col.w / 2 - 8, y + 30, 7.4, "F1", "#f1eee6");
  });
  header("TOTAL", cols.total.x, cols.total.w);
  header("POS", cols.final.x, cols.final.w);
}

function tableColumns(startX: number) {
  const pos = { x: startX, w: 59 };
  const driver = { x: pos.x + pos.w, w: 293 };
  const bat = { x: driver.x + driver.w, w: 72 };
  const vit = { x: bat.x + bat.w, w: 58 };
  const scores = Array.from({ length: 11 }, (_, index) => ({
    x: vit.x + vit.w + index * (index === 10 ? 86 : 73),
    w: index === 10 ? 86 : 73,
  }));
  for (let index = 1; index < scores.length; index += 1) {
    scores[index].x = scores[index - 1].x + scores[index - 1].w;
  }
  const total = { x: scores[10].x + scores[10].w, w: 93 };
  const final = { x: total.x + total.w, w: 56 };
  return { pos, driver, bat, vit, scores, total, final, fixed: { pos, driver, bat, vit } };
}

function drawFooter(commands: string[], hasLogo: boolean) {
  text(commands, "RESULTADO GERAL OFICIAL - PONTOS POR BATERIA PUBLICADA, TOTAL ACUMULADO E POSICAO FINAL.", 31, 1026, 8, "F2", "#b8b5ab");
  line(commands, 488, 1020, 699, 1020, "#bc8315", 1);
  if (hasLogo) image(commands, "Logo", 718, 997, 55, 48);
  line(commands, 797, 1020, 1127, 1020, "#bc8315", 1);
  text(commands, "LEGENDS KART SERIES", 1162, 1026, 11, "F1", "#f3bd18", 2);
  text(commands, "/  PAGINA 1 DE 1", 1356, 1026, 11, "F2", "#bdb9ad", 1);
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
    const number = heatNumber(heat.title) ?? fallbackRegularIndex;
    regularByNumber.set(number, heat);
    fallbackRegularIndex += 1;
  });

  const columns: ScoreColumn[] = [];
  for (let index = 1; index <= 10; index += 1) {
    columns.push({ label: `P ${String(index).padStart(2, "0")}`, heatId: regularByNumber.get(index)?.id ?? null });
  }
  columns.push({ label: "SUPER FINAL", heatId: superFinal?.id ?? null });
  return columns;
}

function makePdf(stream: string, logo: PdfImage | null): Uint8Array {
  const objects: string[] = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [6 0 R] /Count 1 >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];

  if (logo) {
    objects.push(`<< /Type /XObject /Subtype /Image /Width ${logo.width} /Height ${logo.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${logo.data.length} >>\nstream\n${logo.data.toString("binary")}\nendstream`);
  } else {
    objects.push("<< >>");
  }

  const xObject = logo ? "/XObject << /Logo 5 0 R >>" : "";
  objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> ${xObject} >> /Contents 7 0 R >>`);
  objects.push(`<< /Length ${Buffer.byteLength(stream, "binary")} >>\nstream\n${stream}\nendstream`);

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

function circleApprox(commands: string[], x: number, y: number, radius: number, color: string) {
  rect(commands, x - radius, y - radius, radius * 2, radius * 2, color);
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
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[º°]/g, "o").replace(/[^\x20-\x7e]/g, "");
}

function normalizeKey(value: string): string {
  return value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function heatNumber(title: string): number | null {
  const match = title.match(/(\d+)/);
  return match ? Number(match[1]) : null;
}

function trim(value: string, maxLength: number): string {
  return value.length <= maxLength ? value : `${value.slice(0, Math.max(0, maxLength - 3))}...`;
}
