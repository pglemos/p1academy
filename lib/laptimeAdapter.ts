import { type DriverStatus, type HeatDriverInput, type HeatInput, parseLapTimeToMs } from "./legendsScoring";

type UnknownRecord = Record<string, unknown>;

const rowCollections = ["results", "rows", "classification", "classificacao", "drivers", "pilots", "participantes"];

export function normalizeLapTimeResponse(source: unknown): HeatInput | null {
  if (typeof source === "string") {
    const trimmed = source.trim();
    if (!trimmed) {
      return null;
    }

    try {
      return normalizeLapTimeResponse(JSON.parse(trimmed));
    } catch {
      return parseLapTimeReportText(trimmed);
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
    source: "laptime-live",
    trackLayout: pickString(session, ["trackLayout", "tracado", "layout"]),
    category: pickString(session, ["category", "categoria", "className"]),
    drivers: rows.map(normalizeRow).filter((row) => row.name || row.lapTime),
  };
}

export function parseLapTimeReportText(text: string): HeatInput | null {
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
    const lapTime = lines[cursor + 1] ?? "";
    const gapToLeader = lines[cursor + 2] ?? "";
    const gapToPrevious = lines[cursor + 3] ?? "";
    const totalLaps = lines[cursor + 4] ?? "";
    const averageSpeedKmh = lines[cursor + 5] ?? "";
    const secondBestLapNumber = lines[cursor + 6] ?? "";
    const secondBestLapTime = lines[cursor + 7] ?? "";
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
      lapTime,
      status: parseLapTimeToMs(lapTime) === null ? "no-time" : "ok",
      order: position,
      bestLapNumber,
      totalLaps,
      averageSpeedKmh,
      secondBestLapNumber,
      secondBestLapTime,
      federation,
      gapToLeader,
      gapToPrevious,
    });
  }

  if (!drivers.length) {
    return null;
  }

  return {
    id: "legends-laptime-text",
    title: findAfter(lines, "Tomada de Tempo") || "Tomada de Tempo",
    date: extractDate(lines) || "",
    type: "regular",
    generatedAt: extractGeneratedAt(lines),
    source: "laptime-live",
    trackLayout: lines.find((line) => /^Traçado/i.test(line)),
    category: "Super Kart",
    drivers,
  };
}

function normalizeRow(row: UnknownRecord, index: number): HeatDriverInput {
  const sourcePosition = pickNumber(row, ["pos", "POS", "position", "posicao"]);
  const lapTime = pickString(row, ["tmv", "TMV", "bestLapTime", "tempoMelhorVolta", "melhorVolta", "lapTime"]) || "";
  const status = pickStatus(row, lapTime);
  const competitorNumber = pickString(row, ["#", "numero", "number", "competitorNumber", "kart", "car"]);
  const id = pickString(row, ["id", "pilotId", "driverId", "competitorId"]) || competitorNumber || `driver-${index + 1}`;

  return {
    id,
    sourcePosition,
    name: pickString(row, ["nome", "name", "piloto", "driver", "driverName"]) || "",
    kart: competitorNumber,
    lapTime,
    status,
    order: sourcePosition ?? index + 1,
    bestLapNumber: pickString(row, ["mv", "MV", "bestLapNumber", "voltaMelhor"]),
    totalLaps: pickString(row, ["tv", "TV", "totalLaps", "voltas"]),
    averageSpeedKmh: pickString(row, ["vm", "VM", "averageSpeedKmh", "velocidadeMedia"]),
    secondBestLapNumber: pickString(row, ["mv2", "MV2", "MV 2", "secondBestLapNumber"]),
    secondBestLapTime: pickString(row, ["tmv2", "TMV2", "TMV 2", "secondBestLapTime"]),
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

function pickStatus(row: UnknownRecord, lapTime: string): DriverStatus {
  const raw = pickString(row, ["status", "situacao", "classificationStatus"])?.toLowerCase() ?? "";
  if (raw.includes("dsq") || raw.includes("desclass")) {
    return "dsq";
  }

  return parseLapTimeToMs(lapTime) === null ? "no-time" : "ok";
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
