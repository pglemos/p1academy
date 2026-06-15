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
  expectedStages: string;
  rulesPdf: string;
  calendarPdf: string;
  version: string;
  versionDate: string;
  settings: Record<string, unknown>;
};

export type P1CalendarRace = {
  id?: string;
  code?: string;
  race: number;
  date: string;
  day: string;
  time: string;
  status?: string;
};

export type P1CalendarMonth = {
  month: string;
  races: P1CalendarRace[];
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
};

export type P1PublicData = {
  source: "supabase" | "static";
  championship: P1Championship;
  calendarSummary: {
    totalRaces: number;
    months: string;
    firstRace: string;
    finalRace: string;
    weekdayWindows: string;
    saturdayWindow: string;
  };
  calendarMonths: P1CalendarMonth[];
  ranking: P1RankingRow[];
  results: P1ResultRow[];
};
