export type P1Championship = {
  id: string;
  slug: string;
  name: string;
  edition: string;
  season: string;
  status: string;
  venue: string;
  address: string;
  organizer: string;
  whatsapp: string;
  whatsappNumber: string;
  format: string;
  ballast: string;
  heatDuration: string;
  superFinalDuration: string;
  seats: string;
  validResults: string;
  rulesPdf: string;
};

export type P1RankingRow = {
  position: string;
  driver: string;
  level: string;
  points: string;
  valid: string;
  wins?: number;
};

export type P1ResultRow = {
  heat: string;
  date: string;
  winner: string;
  bestLap: string;
  points: string;
  complete: boolean;
  pdfHref?: string;
};

export type P1ClassificationHeat = {
  id: string;
  label: string;
  title: string;
  date: string;
  type: string;
};

export type P1ClassificationCell = {
  score: number | null;
  position: number | null;
  officialMs: number | null;
  status: "ok" | "missing" | "discarded" | "dsq" | "no-time";
};

export type P1ClassificationRow = {
  position: string;
  driver: string;
  level: string;
  points: string;
  regularPoints: string;
  superFinalPoints: string;
  valid: string;
  participationCount: number;
  discarded: number;
  wins: number;
  bestScoreHeatIds: string[];
  cells: Record<string, P1ClassificationCell>;
};

export type P1Classification = {
  heats: P1ClassificationHeat[];
  rows: P1ClassificationRow[];
};

export type P1PublicData = {
  source: "supabase" | "static";
  lastPublishedAt: string | null;
  championship: P1Championship;
  ranking: P1RankingRow[];
  results: P1ResultRow[];
  classification: P1Classification;
};

export function isSuperFinalHeatType(type?: string) {
  return type === "super-final" || type === "super_final";
}
