import { calculateHeatResults, formatLapTime, formatScore, type HeatInput } from "./legendsScoring";

const pageWidth = 842;
const pageHeight = 595;
const margin = 34;
const lineHeight = 14;

export function buildLegendsResultPdf(heat: HeatInput): Uint8Array {
  const results = calculateHeatResults(heat);
  const pages: string[][] = [];
  const lines = buildHeaderLines(heat);

  lines.push("");
  lines.push("POS  #     PILOTO                              TMV        DL        PONTOS   VOLTAS  VM     2A MELHOR  UF");
  lines.push("-----------------------------------------------------------------------------------------------------------");

  results.forEach((result) => {
    const row = [
      pad(result.position ? String(result.position) : "-", 4),
      pad(result.kart || "-", 5),
      pad(trim(result.name, 34), 34),
      pad(formatLapTime(result.officialMs), 10),
      pad(result.gapMs === null ? "-" : `+${(result.gapMs / 1000).toFixed(3)}s`, 9),
      pad(formatScore(result.score), 8),
      pad(result.totalLaps || "-", 7),
      pad(result.averageSpeedKmh || "-", 6),
      pad(result.secondBestLapTime || "-", 10),
      result.federation || "-",
    ].join(" ");
    lines.push(row);
  });

  lines.push("");
  lines.push("Regra Legends: bateria regular usa base 10,000; Super Final usa base 5,000.");
  lines.push("Pontuacao = base - diferenca em segundos para o melhor tempo. Acima de 9s = 1,000 ponto.");
  lines.push("Empates seguem a ordem oficial da cronometragem, com ajuste de milesimo quando necessario.");

  while (lines.length) {
    pages.push(lines.splice(0, 35));
  }

  return makePdf(pages);
}

function buildHeaderLines(heat: HeatInput): string[] {
  return [
    "P1 ACADEMY - LEGENDS KART SERIES",
    heat.title || "Resultado de tomada de tempo",
    `Tipo: ${heat.type === "super-final" ? "Super Final" : "Bateria regular"}${heat.date ? ` | Data: ${heat.date}` : ""}`,
    heat.trackLayout ? `Tracado: ${heat.trackLayout}` : "",
    heat.category ? `Categoria: ${heat.category}` : "",
    heat.generatedAt ? `Cronometragem atualizada em: ${heat.generatedAt}` : `PDF gerado em: ${new Date().toLocaleString("pt-BR")}`,
  ].filter(Boolean);
}

function makePdf(pages: string[][]): Uint8Array {
  const objects: string[] = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "PAGES_PLACEHOLDER",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>",
  ];
  const pageObjectIds: number[] = [];

  pages.forEach((pageLines, index) => {
    const pageId = objects.length + 1;
    const contentId = pageId + 1;
    pageObjectIds.push(pageId);
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`);
    objects.push(makeContentStream(pageLines, index + 1, pages.length));
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

function makeContentStream(lines: string[], page: number, totalPages: number): string {
  const commands = [
    "BT",
    "/F1 16 Tf",
    `${margin} ${pageHeight - margin} Td`,
    `(RESULTADO OFICIAL) Tj`,
    "ET",
    ...lines.map((line, index) => [
      "BT",
      `/F2 ${index < 2 ? 11 : 9} Tf`,
      `${margin} ${pageHeight - margin - 28 - index * lineHeight} Td`,
      `(${escapePdf(line)}) Tj`,
      "ET",
    ].join("\n")),
    "BT",
    "/F2 8 Tf",
    `${margin} 22 Td`,
    `(Pagina ${page} de ${totalPages} - p1academy.vercel.app) Tj`,
    "ET",
  ].join("\n");

  return `<< /Length ${Buffer.byteLength(commands, "binary")} >>\nstream\n${commands}\nendstream`;
}

function escapePdf(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function pad(value: string, length: number): string {
  return trim(value, length).padEnd(length, " ");
}

function trim(value: string, length: number): string {
  return value.length > length ? `${value.slice(0, Math.max(0, length - 3))}...` : value;
}
