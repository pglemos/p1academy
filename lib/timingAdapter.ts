import { type DriverStatus, type HeatDriverInput, type HeatInput, parseTimingValueToMs } from "./legendsScoring";

type UnknownRecord = Record<string, unknown>;

const rowCollections = ["results", "rows", "classification", "classificacao", "drivers", "pilots", "participantes"];

export function normalizeTimingResponse(source: unknown): HeatInput | null {
  if (typeof source === "string") {
    const trimmed = source.trim();
    if (!trimmed) {
      return null;
    }

    try {
      return normalizeTimingResponse(JSON.parse(trimmed));
    } catch {
      return parseTimingReportText(trimmed);
    }
  }

  if (!isRecord(source)) {
    return null;
  }

  const rows = findRows(source);
  if (!rows.length) {
    return null;
  }

  const session = getRecord(source, "session") ?? getRecord(source, "heat") ?? source;
  const title = pickString(session, ["title", "name", "eventName", "evento", "prova", "battery", "bateria"]) || "Tomada de tempo Legends";
  const date = pickString(session, ["date", "data", "eventDate", "dataEvento"]) || "";

  return {
    id: pickString(session, ["id", "heatId", "sessionId"]) || `legends-live-${date || "tempo-real"}`,
    title,
    date,
    type: pickString(session, ["type", "tipo"])?.toLowerCase().includes("super") ? "super-final" : "regular",
    generatedAt: pickString(session, ["generatedAt", "updatedAt", "dataHora", "dateTime", "timestamp"]),
    source: "timing-live",
    trackLayout: pickString(session, ["trackLayout", "tracado", "layout"]),
    category: pickString(session, ["category", "categoria", "className"]),
    drivers: rows.map(normalizeRow).filter((row) => row.name || row.bestTime),
  };
}

export function parseTimingReportText(text: string): HeatInput | null {
  if (/<table[\s>]/i.test(text)) {
    const htmlHeat = parseLiveTimeHtml(text);
    if (htmlHeat) {
      return htmlHeat;
    }
  }

  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const firstPositionIndex = lines.findIndex((line, index) => (
    line === "1" && Boolean(lines[index + 1]) && Boolean(lines[index + 2])
  ));

  if (firstPositionIndex === -1) {
    return null;
  }

  const drivers: HeatDriverInput[] = [];
  let index = firstPositionIndex;

  while (index < lines.length && /^\d+$/.test(lines[index])) {
    const position = Number(lines[index]);
    const competitorNumber = lines[index + 1] ?? "";
    let name = lines[index + 2] ?? "";
    let cursor = index + 3;

    while (cursor < lines.length && !/^\d+$/.test(lines[cursor])) {
      name = `${name} ${lines[cursor]}`.trim();
      cursor += 1;
    }

    const bestLapNumber = lines[cursor] ?? "";
    const bestTime = lines[cursor + 1] ?? "";
    const gapToLeader = lines[cursor + 2] ?? "";
    const gapToPrevious = lines[cursor + 3] ?? "";
    const totalLaps = lines[cursor + 4] ?? "";
    const averageSpeedKmh = lines[cursor + 5] ?? "";
    const secondBestLapNumber = lines[cursor + 6] ?? "";
    const secondBestTime = lines[cursor + 7] ?? "";
    let federation = "";
    const nextIndex = cursor + 8;
    index = nextIndex;

    if (/^[A-Z]{2}$/.test(lines[nextIndex] ?? "")) {
      federation = lines[nextIndex];
      index = nextIndex + 1;
    }

    drivers.push({
      id: competitorNumber || `pos-${position}`,
      sourcePosition: position,
      name,
      kart: competitorNumber,
      bestTime,
      status: parseTimingValueToMs(bestTime) === null ? "no-time" : "ok",
      order: position,
      bestLapNumber,
      totalLaps,
      averageSpeedKmh,
      secondBestLapNumber,
      secondBestTime,
      federation,
      gapToLeader,
      gapToPrevious,
    });
  }

  if (!drivers.length) {
    return null;
  }

  return {
    id: "legends-timing-text",
    title: findAfter(lines, "Tomada de Tempo") || "Tomada de Tempo",
    date: extractDate(lines) || "",
    type: "regular",
    generatedAt: extractGeneratedAt(lines),
    source: "timing-live",
    trackLayout: lines.find((line) => /^Traçado/i.test(line)),
    category: "Super Kart",
    drivers,
  };
}

export function parseLiveTimeHtml(html: string): HeatInput | null {
  const tableMatches = html.match(/<table[\s\S]*?<\/table>/gi) ?? [];
  const drivers: HeatDriverInput[] = [];

  tableMatches.forEach((table) => {
    const rowMatches = table.match(/<tr[\s\S]*?<\/tr>/gi) ?? [];
    let headers: string[] = [];

    rowMatches.forEach((row) => {
      const cellMatches = row.match(/<(?:th|td)[^>]*>[\s\S]*?<\/(?:th|td)>/gi) ?? [];
      if (!cellMatches.length) {
        return;
      }

      const cells = cellMatches.map(extractCellText);
      const isHeader = /<th[\s>]/i.test(row) || cells.some((cell) => /pos|posição|nome|piloto|tempo|volta|kart|#/i.test(cell));

      if (isHeader && cells.length > 1) {
        headers = cells.map(normalizeHeader);
        return;
      }

      const driver = normalizeLiveTimeCells(headers, cellMatches, drivers.length);
      if (driver && (driver.name || driver.bestTime)) {
        drivers.push(driver);
      }
    });
  });

  if (!drivers.length) {
    return null;
  }

  return {
    id: "legends-livetime",
    title: extractHtmlTitle(html) || "LiveTime Legends",
    date: extractDate([stripHtml(html)]) || "",
    type: "regular",
    generatedAt: new Date().toISOString(),
    source: "timing-live",
    category: "LiveTime",
    drivers,
  };
}

function normalizeLiveTimeCells(headers: string[], rawCells: string[], index: number): HeatDriverInput | null {
  const cells = rawCells.map(extractCellText);
  const getByHeader = (...keys: string[]) => {
    for (const key of keys) {
      const headerIndex = headers.findIndex((header) => header.includes(key));
      if (headerIndex >= 0 && cells[headerIndex]) {
        return cells[headerIndex];
      }
    }

    return "";
  };
  const fallback = (position: number) => cells[position] ?? "";
  const sourcePosition = parseInteger(getByHeader("pos", "posição", "p") || fallback(0));
  const competitorNumber = getByHeader("#", "num", "numero", "número", "kart", "carro") || fallback(1);
  const name = getNameFromCell(rawCells, headers) || getByHeader("nome", "piloto", "driver") || fallback(2);
  const bestTime = getByHeader("tmv", "melhor", "best", "tempo") || findFirstTime(cells);
  const totalLaps = getByHeader("tv", "volta", "laps");
  const gapToLeader = getByHeader("dl", "lider", "líder", "gap");
  const gapToPrevious = getByHeader("da", "anterior");
  const averageSpeedKmh = getByHeader("vm", "media", "média", "speed");

  if (!name && !bestTime) {
    return null;
  }

  return {
    id: competitorNumber || `driver-${index + 1}`,
    sourcePosition,
    name,
    kart: competitorNumber,
    bestTime,
    status: parseTimingValueToMs(bestTime) === null ? "no-time" : "ok",
    order: sourcePosition ?? index + 1,
    totalLaps,
    averageSpeedKmh,
    gapToLeader,
    gapToPrevious,
  };
}

function normalizeRow(row: UnknownRecord, index: number): HeatDriverInput {
  const sourcePosition = pickNumber(row, ["pos", "POS", "position", "posicao"]);
  const bestTime = pickString(row, ["tmv", "TMV", joinKey("best", "Lap", "Time"), "tempoMelhorVolta", "melhorVolta", joinKey("lap", "Time")]) || "";
  const status = pickStatus(row, bestTime);
  const competitorNumber = pickString(row, ["#", "numero", "number", "competitorNumber", "kart", "car"]);
  const id = pickString(row, ["id", "pilotId", "driverId", "competitorId"]) || competitorNumber || `driver-${index + 1}`;

  return {
    id,
    sourcePosition,
    name: pickString(row, ["nome", "name", "piloto", "driver", "driverName"]) || "",
    kart: competitorNumber,
    bestTime,
    status,
    order: sourcePosition ?? index + 1,
    bestLapNumber: pickString(row, ["mv", "MV", "bestLapNumber", "voltaMelhor"]),
    totalLaps: pickString(row, ["tv", "TV", "totalLaps", "voltas"]),
    averageSpeedKmh: pickString(row, ["vm", "VM", "averageSpeedKmh", "velocidadeMedia"]),
    secondBestLapNumber: pickString(row, ["mv2", "MV2", "MV 2", "secondBestLapNumber"]),
    secondBestTime: pickString(row, ["tmv2", "TMV2", "TMV 2", joinKey("secondBest", "Lap", "Time")]),
    federation: pickString(row, ["uf", "UF", "federation", "estado"]),
    gapToLeader: pickString(row, ["dl", "DL", "gapToLeader", "diferencaLider"]),
    gapToPrevious: pickString(row, ["da", "DA", "gapToPrevious", "diferencaAnterior"]),
  };
}

function findRows(source: UnknownRecord): UnknownRecord[] {
  for (const key of rowCollections) {
    const value = source[key];
    if (Array.isArray(value)) {
      return value.filter(isRecord);
    }
  }

  for (const value of Object.values(source)) {
    if (isRecord(value)) {
      const nested = findRows(value);
      if (nested.length) {
        return nested;
      }
    }
  }

  return [];
}

function pickStatus(row: UnknownRecord, bestTime: string): DriverStatus {
  const raw = pickString(row, ["status", "situacao", "classificationStatus"])?.toLowerCase() ?? "";
  if (raw.includes("dsq") || raw.includes("desclass")) {
    return "dsq";
  }

  return parseTimingValueToMs(bestTime) === null ? "no-time" : "ok";
}

function getNameFromCell(rawCells: string[], headers: string[]): string {
  const nameIndex = headers.findIndex((header) => header.includes("nome") || header.includes("piloto") || header.includes("driver"));
  const rawCell = rawCells[nameIndex >= 0 ? nameIndex : 2] ?? "";
  const fullNameMatch = rawCell.match(/<span[^>]*class=["'][^"']*full-name[^"']*["'][^>]*>([\s\S]*?)<\/span>/i);

  if (fullNameMatch) {
    return decodeHtmlEntities(stripHtml(fullNameMatch[1])).trim();
  }

  return extractCellText(rawCell);
}

function findFirstTime(cells: string[]): string {
  return cells.find((cell) => /^\d{1,2}:\d{2}[.,]\d{1,3}$/.test(cell) || /^\d{1,3}[.,]\d{1,3}$/.test(cell)) ?? "";
}

function normalizeHeader(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function extractCellText(cell: string): string {
  return decodeHtmlEntities(stripHtml(cell))
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function parseInteger(value: string): number | null {
  const parsed = Number(value.replace(/\D/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function extractHtmlTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? decodeHtmlEntities(stripHtml(match[1])).trim() : null;
}

function joinKey(...parts: string[]): string {
  return parts.join("");
}

function pickString(source: UnknownRecord, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }

  return undefined;
}

function pickNumber(source: UnknownRecord, keys: string[]): number | null {
  const value = pickString(source, keys);
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getRecord(source: UnknownRecord, key: string): UnknownRecord | null {
  const value = source[key];
  return isRecord(value) ? value : null;
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function findAfter(lines: string[], marker: string): string | null {
  const index = lines.findIndex((line) => line.includes(marker));
  return index === -1 ? null : lines[index];
}

function extractDate(lines: string[]): string | null {
  const eventLine = lines.find((line) => /\d{2}\/\d{2}\/\d{4}/.test(line));
  return eventLine?.match(/\d{2}\/\d{2}\/\d{4}/)?.[0] ?? null;
}

function extractGeneratedAt(lines: string[]): string | undefined {
  const line = lines.find((item) => item.includes("DATA/HORA"));
  return line?.replace("DATA/HORA:", "").trim();
}
