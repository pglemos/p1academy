import { existsSync, readFileSync } from "fs";
import path from "path";
import { calculateHeatResults, formatScore, formatTimingValue, type HeatInput, type HeatResult } from "./legendsScoring";

const pageWidth = 842;
const pageHeight = 595;
const margin = 30;
const rowHeight = 16;
const firstPageRows = 19;
const nextPageRows = 23;
const logoPath = path.join(process.cwd(), "public", "brand", "legends-kart-series-logo.jpg");

type PdfImage = {
  name: string;
  width: number;
  height: number;
  data: Buffer;
};

export function buildLegendsResultPdf(heat: HeatInput): Uint8Array {
  const results = calculateHeatResults(heat);
  const pages = paginate(results);
  const logo = loadLogo();
  const streams = pages.map((rows, index) => buildPageContent(heat, results, rows, index + 1, pages.length, Boolean(logo)));

  return makePdf(streams, logo);
}

function paginate(results: HeatResult[]): HeatResult[][] {
  const pages: HeatResult[][] = [];
  const remaining = [...results];
  pages.push(remaining.splice(0, firstPageRows));

  while (remaining.length) {
    pages.push(remaining.splice(0, nextPageRows));
  }

  return pages;
}

function buildPageContent(
  heat: HeatInput,
  allResults: HeatResult[],
  rows: HeatResult[],
  page: number,
  totalPages: number,
  hasLogo: boolean,
): string {
  const commands: string[] = [];
  const winner = allResults.find((result) => result.position === 1);
  const bestLap = winner ? formatTimingValue(winner.officialMs) : "-";
  const baseScore = heat.type === "super-final" ? "5,000" : "10,000";

  rect(commands, 0, 0, pageWidth, pageHeight, "#070707");
  rect(commands, 0, pageHeight - 154, pageWidth, 154, "#10100d");
  rect(commands, 0, pageHeight - 158, pageWidth, 4, "#f5b21a");
  rect(commands, 0, 0, pageWidth, 38, "#10100d");

  if (hasLogo) {
    image(commands, "Logo", margin, pageHeight - 130, 96, 96);
  } else {
    rect(commands, margin, pageHeight - 130, 96, 96, "#1a1710");
    strokeRect(commands, margin, pageHeight - 130, 96, 96, "#f5b21a", 1.2);
    text(commands, "LEGENDS", margin + 16, pageHeight - 84, 15, "F1", "#f5b21a");
  }

  text(commands, "LEGENDS KART SERIES", margin + 118, pageHeight - 60, 25, "F1", "#f7c948");
  text(commands, safeText(heat.title || "Resultado oficial"), margin + 118, pageHeight - 88, 15, "F1", "#fff7d0");
  text(commands, `Data: ${formatDate(heat.date)}   |   ${heat.type === "super-final" ? "Super Final" : "Bateria regular"}   |   ${heat.trackLayout || "Tracado"}`, margin + 118, pageHeight - 110, 9.5, "F2", "#d8d2c1");
  text(commands, "RESULTADO OFICIAL", pageWidth - 196, pageHeight - 58, 13, "F1", "#070707", "#f5b21a", 8, 136, 23);
  text(commands, "P1 ACADEMY", pageWidth - 155, pageHeight - 90, 9, "F1", "#f5b21a");

  if (page === 1) {
    card(commands, margin, pageHeight - 202, 180, 48, "VENCEDOR", winner?.name || "-", "#f7c948");
    card(commands, margin + 194, pageHeight - 202, 128, 48, "MELHOR VOLTA", bestLap, "#ffffff");
    card(commands, margin + 336, pageHeight - 202, 128, 48, "BASE", `${baseScore} pts`, "#ffffff");
    card(commands, margin + 478, pageHeight - 202, 128, 48, "PILOTOS", String(allResults.length), "#ffffff");
    card(commands, margin + 620, pageHeight - 202, 162, 48, "CATEGORIA", heat.category || "Super Kart", "#ffffff");
  }

  const tableTop = page === 1 ? pageHeight - 232 : pageHeight - 180;
  drawTable(commands, rows, tableTop);

  const ruleY = 24;
  strokeLine(commands, margin, ruleY + 20, pageWidth - margin, ruleY + 20, "#2d2a22", 0.8);
  text(commands, "Pontuacao: base - diferenca em segundos para a melhor volta. Acima de 9s = 1,000 ponto.", margin, ruleY + 4, 8, "F2", "#c9c0a8");
  text(commands, `Pagina ${page} de ${totalPages}   |   p1academy.vercel.app`, pageWidth - 238, 16, 8, "F2", "#c9c0a8");

  return commands.join("\n");
}

function drawTable(commands: string[], rows: HeatResult[], top: number) {
  const columns = [
    { label: "POS", x: margin + 8, width: 32 },
    { label: "KART", x: margin + 45, width: 42 },
    { label: "PILOTO", x: margin + 92, width: 248 },
    { label: "TMV", x: margin + 346, width: 64 },
    { label: "DIF", x: margin + 416, width: 62 },
    { label: "PTS", x: margin + 482, width: 62 },
    { label: "VOLTAS", x: margin + 548, width: 54 },
    { label: "VM", x: margin + 606, width: 46 },
    { label: "2A MELHOR", x: margin + 656, width: 76 },
    { label: "UF", x: margin + 738, width: 30 },
  ];

  rect(commands, margin, top, pageWidth - margin * 2, 24, "#f5b21a");
  columns.forEach((column) => text(commands, column.label, column.x, top + 8, 7.6, "F1", "#11100b"));

  rows.forEach((row, index) => {
    const y = top - (index + 1) * rowHeight;
    rect(commands, margin, y, pageWidth - margin * 2, rowHeight, index % 2 === 0 ? "#151515" : "#1c1b18");

    const values = [
      row.position ? String(row.position) : "-",
      row.kart || "-",
      trim(row.name, 30),
      formatTimingValue(row.officialMs),
      row.gapMs === null ? "-" : `+${(row.gapMs / 1000).toFixed(3)}s`,
      formatScore(row.score),
      row.totalLaps || "-",
      row.averageSpeedKmh || "-",
      row.secondBestTime || "-",
      row.federation || "-",
    ];

    values.forEach((value, valueIndex) => {
      const color = valueIndex === 0 || valueIndex === 5 ? "#f7c948" : "#f4f0e6";
      const font = valueIndex === 0 || valueIndex === 5 ? "F1" : "F2";
      text(commands, safeText(value), columns[valueIndex].x, y + 4.5, 7.8, font, color);
    });
  });
}

function card(commands: string[], x: number, y: number, width: number, height: number, label: string, value: string, valueColor: string) {
  rect(commands, x, y, width, height, "#181712");
  strokeRect(commands, x, y, width, height, "#4a3512", 0.8);
  text(commands, label, x + 12, y + height - 16, 6.8, "F1", "#f5b21a");
  text(commands, trim(value, 28), x + 12, y + 12, 10.2, "F1", valueColor);
}

function makePdf(pageStreams: string[], logo: PdfImage | null): Uint8Array {
  const objects: string[] = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "PAGES_PLACEHOLDER",
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
    const contentId = pageId + 1;
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

function text(
  commands: string[],
  value: string,
  x: number,
  y: number,
  size: number,
  font: "F1" | "F2",
  color: string,
  background?: string,
  radiusPadding = 0,
  backgroundWidth = 0,
  backgroundHeight = 0,
) {
  if (background) {
    rect(commands, x - radiusPadding, y - radiusPadding, backgroundWidth, backgroundHeight, background);
  }

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
  return Number(value.toFixed(3)).toString();
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

function formatDate(value: string): string {
  if (!value) {
    return "-";
  }

  const [year, month, day] = value.slice(0, 10).split("-");
  return day && month && year ? `${day}/${month}/${year}` : value;
}
