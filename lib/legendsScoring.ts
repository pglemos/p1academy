export type HeatType = "regular" | "super-final";
export type DriverStatus = "ok" | "dsq" | "no-time";

export type HeatDriverInput = {
  id: string;
  name: string;
  kart?: string;
  lapTime: string;
  status?: DriverStatus;
  order: number;
  sourcePosition?: number | null;
  bestLapNumber?: string;
  totalLaps?: string;
  averageSpeedKmh?: string;
  secondBestLapNumber?: string;
  secondBestLapTime?: string;
  federation?: string;
  gapToLeader?: string;
  gapToPrevious?: string;
};

export type HeatResult = {
  id: string;
  position: number | null;
  name: string;
  kart?: string;
  rawMs: number | null;
  officialMs: number | null;
  gapMs: number | null;
  score: number;
  status: DriverStatus;
  note: string;
  sourcePosition?: number | null;
  bestLapNumber?: string;
  totalLaps?: string;
  averageSpeedKmh?: string;
  secondBestLapNumber?: string;
  secondBestLapTime?: string;
  federation?: string;
  gapToLeader?: string;
  gapToPrevious?: string;
};

export type HeatInput = {
  id: string;
  title: string;
  date: string;
  type: HeatType;
  generatedAt?: string;
  source?: "manual" | "laptime-live" | "snapshot";
  trackLayout?: string;
  category?: string;
  drivers: HeatDriverInput[];
};

export type StandingRow = {
  driverId: string;
  name: string;
  total: number;
  regularTotal: number;
  superFinalTotal: number;
  wins: number;
  validRegularResults: number;
  discardedRegularResults: number;
  bestScores: number[];
};

const REGULAR_BASE_SCORE = 10;
const SUPER_FINAL_BASE_SCORE = 5;
const MIN_SCORE_AFTER_NINE_SECONDS = 1;
const MAX_VALID_REGULAR_RESULTS = 10;

export function parseLapTimeToMs(value: string): number | null {
  const input = value.trim().replace(",", ".");

  if (!input) {
    return null;
  }

  const minuteMatch = input.match(/^(\d+):([0-5]?\d)(?:\.(\d{1,3}))?$/);
  if (minuteMatch) {
    const minutes = Number(minuteMatch[1]);
    const seconds = Number(minuteMatch[2]);
    const milliseconds = normalizeMilliseconds(minuteMatch[3]);
    return minutes * 60_000 + seconds * 1000 + milliseconds;
  }

  const secondsMatch = input.match(/^(\d+)(?:\.(\d{1,3}))?$/);
  if (secondsMatch) {
    const seconds = Number(secondsMatch[1]);
    const milliseconds = normalizeMilliseconds(secondsMatch[2]);
    return seconds * 1000 + milliseconds;
  }

  return null;
}

export function formatLapTime(milliseconds: number | null): string {
  if (milliseconds === null || !Number.isFinite(milliseconds)) {
    return "-";
  }

  const minutes = Math.floor(milliseconds / 60_000);
  const seconds = Math.floor((milliseconds % 60_000) / 1000);
  const ms = milliseconds % 1000;

  return `${minutes}:${String(seconds).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
}

export function formatScore(score: number): string {
  return score.toLocaleString("pt-BR", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

export function calculateHeatResults(heat: HeatInput): HeatResult[] {
  const baseScore = heat.type === "super-final" ? SUPER_FINAL_BASE_SCORE : REGULAR_BASE_SCORE;

  const parsed = heat.drivers
    .map((driver) => {
      const status = driver.status ?? "ok";
      const rawMs = status === "ok" ? parseLapTimeToMs(driver.lapTime) : null;
      return { ...driver, status, rawMs };
    })
    .filter((driver) => driver.name.trim() || driver.rawMs !== null);

  const validDrivers = parsed
    .filter((driver) => driver.status === "ok" && driver.rawMs !== null)
    .sort((a, b) => {
      if (a.rawMs !== b.rawMs) {
        return (a.rawMs ?? 0) - (b.rawMs ?? 0);
      }

      return a.order - b.order;
    });

  const tieCounts = new Map<number, number>();
  const withOfficialTimes = validDrivers.map((driver) => {
    const rawMs = driver.rawMs ?? 0;
    const tieIndex = tieCounts.get(rawMs) ?? 0;
    tieCounts.set(rawMs, tieIndex + 1);

    return {
      ...driver,
      officialMs: rawMs + tieIndex,
      tieIndex,
    };
  });

  const sorted = withOfficialTimes.sort((a, b) => {
    if (a.officialMs !== b.officialMs) {
      return a.officialMs - b.officialMs;
    }

    return a.order - b.order;
  });

  const bestMs = sorted[0]?.officialMs ?? null;
  const resultMap = new Map<string, HeatResult>();

  sorted.forEach((driver, index) => {
    const gapMs = bestMs === null ? null : driver.officialMs - bestMs;
    const gapSeconds = (gapMs ?? 0) / 1000;
    const score = gapSeconds > 9
      ? MIN_SCORE_AFTER_NINE_SECONDS
      : roundScore(Math.max(MIN_SCORE_AFTER_NINE_SECONDS, baseScore - gapSeconds));
    const note = [
      driver.tieIndex > 0 ? `Empate ajustado em +${driver.tieIndex} milésimo${driver.tieIndex > 1 ? "s" : ""}` : "",
      gapSeconds > 9 ? "Diferença acima de 9s: pontuação mínima" : "",
    ].filter(Boolean).join(" | ");

    resultMap.set(driver.id, {
      id: driver.id,
      position: index + 1,
      name: driver.name.trim(),
      kart: driver.kart?.trim(),
      rawMs: driver.rawMs,
      officialMs: driver.officialMs,
      gapMs,
      score,
      status: driver.status,
      note,
      sourcePosition: driver.sourcePosition ?? null,
      bestLapNumber: driver.bestLapNumber,
      totalLaps: driver.totalLaps,
      averageSpeedKmh: driver.averageSpeedKmh,
      secondBestLapNumber: driver.secondBestLapNumber,
      secondBestLapTime: driver.secondBestLapTime,
      federation: driver.federation,
      gapToLeader: driver.gapToLeader,
      gapToPrevious: driver.gapToPrevious,
    });
  });

  const invalidResults = parsed
    .filter((driver) => driver.status !== "ok" || driver.rawMs === null)
    .map<HeatResult>((driver) => ({
      id: driver.id,
      position: null,
      name: driver.name.trim() || "Piloto sem nome",
      kart: driver.kart?.trim(),
      rawMs: driver.rawMs,
      officialMs: null,
      gapMs: null,
      score: 0,
      status: driver.status === "ok" ? "no-time" : driver.status,
      note: driver.status === "dsq" ? "Desclassificação descartável" : "Sem tempo válido",
      sourcePosition: driver.sourcePosition ?? null,
      bestLapNumber: driver.bestLapNumber,
      totalLaps: driver.totalLaps,
      averageSpeedKmh: driver.averageSpeedKmh,
      secondBestLapNumber: driver.secondBestLapNumber,
      secondBestLapTime: driver.secondBestLapTime,
      federation: driver.federation,
      gapToLeader: driver.gapToLeader,
      gapToPrevious: driver.gapToPrevious,
    }));

  return [
    ...sorted.map((driver) => resultMap.get(driver.id)).filter(Boolean) as HeatResult[],
    ...invalidResults,
  ];
}

export function calculateStandings(heats: HeatInput[]): StandingRow[] {
  const rows = new Map<string, StandingRow>();

  heats.forEach((heat) => {
    const results = calculateHeatResults(heat);

    results.forEach((result) => {
      if (result.status !== "ok" || result.score <= 0) {
        return;
      }

      const driverId = result.id;
      const existing = rows.get(driverId) ?? {
        driverId,
        name: result.name,
        total: 0,
        regularTotal: 0,
        superFinalTotal: 0,
        wins: 0,
        validRegularResults: 0,
        discardedRegularResults: 0,
        bestScores: [],
      };

      if (heat.type === "super-final") {
        existing.superFinalTotal = roundScore(existing.superFinalTotal + result.score);
      } else {
        existing.bestScores.push(result.score);
        if (result.position === 1) {
          existing.wins += 1;
        }
      }

      rows.set(driverId, existing);
    });
  });

  return Array.from(rows.values())
    .map((row) => {
      const sortedScores = row.bestScores.sort((a, b) => b - a);
      const validScores = sortedScores.slice(0, MAX_VALID_REGULAR_RESULTS);
      const regularTotal = roundScore(validScores.reduce((total, score) => total + score, 0));

      return {
        ...row,
        regularTotal,
        total: roundScore(regularTotal + row.superFinalTotal),
        validRegularResults: validScores.length,
        discardedRegularResults: Math.max(0, sortedScores.length - MAX_VALID_REGULAR_RESULTS),
        bestScores: sortedScores,
      };
    })
    .sort((a, b) => {
      if (b.total !== a.total) {
        return b.total - a.total;
      }

      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }

      const longest = Math.max(a.bestScores.length, b.bestScores.length);
      for (let index = 0; index < longest; index += 1) {
        const aScore = a.bestScores[index] ?? 0;
        const bScore = b.bestScores[index] ?? 0;
        if (bScore !== aScore) {
          return bScore - aScore;
        }
      }

      return a.name.localeCompare(b.name, "pt-BR");
    });
}

function normalizeMilliseconds(value?: string): number {
  if (!value) {
    return 0;
  }

  return Number(value.padEnd(3, "0").slice(0, 3));
}

function roundScore(score: number): number {
  return Math.round(score * 1000) / 1000;
}
