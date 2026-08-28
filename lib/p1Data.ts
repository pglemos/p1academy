import {
  legendsCalendarSummary,
  legendsCompetition,
  legendsOfficialCalendar,
  legendsRankingPreview,
  legendsResultsPreview,
} from "@/data/legends";
import { compareLegendsHeatOrder, formatLegendsHeatTitle, formatScore, formatTimingValue, MAX_VALID_REGULAR_RESULTS, slugifyDriverKey } from "@/lib/legendsScoring";
import { getPublicSupabaseClient, hasPublicSupabaseEnv } from "@/lib/p1Supabase";
import type {
  P1CalendarMonth,
  P1Classification,
  P1ClassificationCell,
  P1ClassificationHeat,
  P1ClassificationRow,
  P1PublicData,
} from "@/lib/p1Types";
import { isSuperFinalHeatType } from "@/lib/p1Types";

const championshipSlug = "legends-2026";

type ChampionshipRow = {
  id: string;
  slug: string;
  name: string;
  edition: string;
  season: string;
  status: string;
  venue: string | null;
  address: string | null;
  organizer: string | null;
  whatsapp: string | null;
  whatsapp_number: string | null;
  format: string | null;
  ballast: string | null;
  heat_duration: string | null;
  super_final_duration: string | null;
  seats: string | null;
  valid_results: string | null;
  expected_stages: string | null;
  rules_pdf: string | null;
  calendar_pdf: string | null;
  version: string | null;
  version_date: string | null;
  settings: Record<string, unknown> | null;
};

type StageRow = {
  id: string;
  stage_code: string;
  race_number: number;
  scheduled_date: string;
  scheduled_time: string;
  weekday: string;
  month_name: string;
  status: string;
};

type StandingRow = {
  position: number;
  driver_name: string;
  total: number | string;
  regular_total: number | string;
  super_final_total: number | string;
  valid_regular_results: number;
  discarded_regular_results: number;
  wins: number;
};

type DriverLevelRow = {
  display_name: string;
  current_level: string | null;
};

type HeatRow = {
  id: string;
  title: string;
  heat_date: string;
  type: string;
  created_at: string;
  updated_at: string;
};

type HeatResultRow = {
  heat_id: string;
  driver_name: string;
  position: number | null;
  official_ms: number | null;
  score: number | string;
  status: string;
  created_at: string;
};

export async function getLegendsPublicData(): Promise<P1PublicData> {
  if (!hasPublicSupabaseEnv()) {
    return getStaticLegendsData();
  }

  try {
    const supabase = getPublicSupabaseClient();
    const { data: championship, error: championshipError } = await supabase
      .from("p1_championships")
      .select("*")
      .eq("slug", championshipSlug)
      .single<ChampionshipRow>();

    if (championshipError || !championship) {
      return getStaticLegendsData();
    }

    const [stagesResponse, standingsResponse, heatsResponse, driverLevelsResponse] = await Promise.all([
      supabase
        .from("p1_stages")
        .select("id, stage_code, race_number, scheduled_date, scheduled_time, weekday, month_name, status")
        .eq("championship_id", championship.id)
        .order("sort_order", { ascending: true })
        .returns<StageRow[]>(),
        supabase
          .from("p1_public_standings")
          .select("position, driver_name, total, regular_total, super_final_total, valid_regular_results, discarded_regular_results, wins")
          .eq("championship_slug", championshipSlug)
          .order("position", { ascending: true })
          .returns<StandingRow[]>(),
      supabase
        .from("p1_heats")
        .select("id, title, heat_date, type, created_at, updated_at")
        .eq("championship_id", championship.id)
        .eq("is_published", true)
        .order("heat_date", { ascending: false })
        .order("title", { ascending: false })
        .order("created_at", { ascending: false })
        .returns<HeatRow[]>(),
      supabase
        .from("p1_drivers")
        .select("display_name, current_level")
        .eq("championship_id", championship.id)
        .eq("status", "active")
        .returns<DriverLevelRow[]>(),
    ]);

    if (stagesResponse.error || standingsResponse.error || heatsResponse.error) {
      return getStaticLegendsData();
    }

    const stages = stagesResponse.data ?? [];
    const standings = standingsResponse.data ?? [];
    const heats = heatsResponse.data ?? [];
    const levelByDriver = new Map(
      (driverLevelsResponse.error ? [] : driverLevelsResponse.data ?? [])
        .map((row) => [slugifyDriverKey(row.display_name), row.current_level?.trim() || "A definir"] as const),
    );

    const orderedHeats = normalizePublishedHeatTitles([...heats].sort((a, b) => compareLegendsHeatOrder({
      id: a.id,
      title: a.title,
      date: a.heat_date,
      createdAt: a.created_at,
    }, {
      id: b.id,
      title: b.title,
      date: b.heat_date,
      createdAt: b.created_at,
    })));
    const detailResults = await loadPublishedResults(orderedHeats);
    const results = buildResultRows(orderedHeats, detailResults);
    const lastPublishedAt = [...heats.map((heat) => heat.updated_at), ...detailResults.map((result) => result.created_at)]
      .filter(Boolean)
      .sort()
      .at(-1) ?? null;

    return {
      source: "supabase",
      lastPublishedAt,
      championship: {
        id: championship.id,
        slug: championship.slug,
        name: championship.name,
        edition: championship.edition,
        season: championship.season,
        status: championship.status,
        venue: championship.venue ?? legendsCompetition.venue,
        address: championship.address ?? legendsCompetition.address,
        organizer: championship.organizer ?? legendsCompetition.organizer,
        whatsapp: championship.whatsapp ?? legendsCompetition.whatsapp,
        whatsappNumber: championship.whatsapp_number ?? legendsCompetition.whatsappNumber,
        format: championship.format ?? legendsCompetition.format,
        ballast: championship.ballast ?? legendsCompetition.ballast,
        heatDuration: championship.heat_duration ?? legendsCompetition.heatDuration,
        superFinalDuration: championship.super_final_duration ?? legendsCompetition.superFinalDuration,
        seats: championship.seats ?? legendsCompetition.seats,
        validResults: championship.valid_results ?? legendsCompetition.validResults,
        expectedStages: championship.expected_stages ?? legendsCompetition.expectedStages,
        rulesPdf: championship.rules_pdf ?? "/regulamentos/regulamento-legends-kart-series-2026.pdf",
        calendarPdf: championship.calendar_pdf ?? "/regulamentos/calendario-legends-kart-series-2026.pdf",
        version: championship.version ?? legendsCompetition.version,
        versionDate: formatDateBr(championship.version_date) || legendsCompetition.versionDate,
        settings: championship.settings ?? {},
      },
      calendarSummary: {
        totalRaces: Number(championship.settings?.totalRaces ?? stages.length ?? legendsCalendarSummary.totalRaces),
        months: String(championship.settings?.months ?? legendsCalendarSummary.months),
        firstRace: String(championship.settings?.firstRace ?? legendsCalendarSummary.firstRace),
        finalRace: String(championship.settings?.finalRace ?? legendsCalendarSummary.finalRace),
        weekdayWindows: String(championship.settings?.weekdayWindows ?? legendsCalendarSummary.weekdayWindows),
        saturdayWindow: String(championship.settings?.saturdayWindow ?? legendsCalendarSummary.saturdayWindow),
      },
      calendarMonths: groupStagesByMonth(stages),
      ranking: standings.map((row) => ({
        position: String(row.position).padStart(2, "0"),
        driver: row.driver_name,
        level: levelByDriver.get(slugifyDriverKey(row.driver_name)) ?? "A definir",
        points: formatScore(Number(row.total)),
        valid: `${row.valid_regular_results}/10`,
        wins: row.wins,
      })),
      results,
      classification: buildClassification(orderedHeats, standings, detailResults, levelByDriver),
    };
  } catch {
    return getStaticLegendsData();
  }
}

function normalizePublishedHeatTitles(heats: HeatRow[]): HeatRow[] {
  let regularNumber = 0;

  return heats.map((heat) => {
    if (isSuperFinalHeatType(heat.type)) {
      return heat;
    }

    regularNumber += 1;
    return {
      ...heat,
      title: formatLegendsHeatTitle(regularNumber),
    };
  });
}

function getStaticLegendsData(): P1PublicData {
  return {
    source: "static",
    lastPublishedAt: null,
    championship: {
      id: championshipSlug,
      slug: championshipSlug,
      name: legendsCompetition.name,
      edition: legendsCompetition.edition,
      season: legendsCompetition.season,
      status: legendsCompetition.status,
      venue: legendsCompetition.venue,
      address: legendsCompetition.address,
      organizer: legendsCompetition.organizer,
      whatsapp: legendsCompetition.whatsapp,
      whatsappNumber: legendsCompetition.whatsappNumber,
      format: legendsCompetition.format,
      ballast: legendsCompetition.ballast,
      heatDuration: legendsCompetition.heatDuration,
      superFinalDuration: legendsCompetition.superFinalDuration,
      seats: legendsCompetition.seats,
      validResults: legendsCompetition.validResults,
      expectedStages: legendsCompetition.expectedStages,
      rulesPdf: "/regulamentos/regulamento-legends-kart-series-2026.pdf",
      calendarPdf: "/regulamentos/calendario-legends-kart-series-2026.pdf",
      version: legendsCompetition.version,
      versionDate: legendsCompetition.versionDate,
      settings: {},
    },
    calendarSummary: legendsCalendarSummary,
    calendarMonths: legendsOfficialCalendar,
    ranking: legendsRankingPreview,
    results: legendsResultsPreview.map((result) => ({ ...result, complete: true })),
    classification: {
      heats: [],
      rows: legendsRankingPreview.map((row) => ({
        position: row.position,
        driver: row.driver,
        level: row.level,
        points: row.points,
        regularPoints: row.points,
        superFinalPoints: "0,000",
        valid: row.valid,
        participationCount: Number.parseInt(row.valid, 10) || 0,
        discarded: 0,
        wins: 0,
        bestScoreHeatIds: [],
        cells: {},
      })),
    },
  };
}

function groupStagesByMonth(stages: StageRow[]): P1CalendarMonth[] {
  const byMonth = new Map<string, P1CalendarMonth>();

  stages.forEach((stage) => {
    const month = byMonth.get(stage.month_name) ?? { month: stage.month_name, races: [] };
    month.races.push({
      id: stage.id,
      code: stage.stage_code,
      race: stage.race_number,
      date: formatDateBr(stage.scheduled_date),
      day: stage.weekday,
      time: stage.scheduled_time.slice(0, 5),
      status: stage.status,
    });
    byMonth.set(stage.month_name, month);
  });

  return Array.from(byMonth.values());
}

async function loadPublishedResults(heats: HeatRow[]): Promise<HeatResultRow[]> {
  if (heats.length === 0) {
    return [];
  }

  const supabase = getPublicSupabaseClient();
  const { data: rows, error } = await supabase
    .from("p1_heat_results")
    .select("heat_id, driver_name, position, official_ms, score, status, created_at")
    .in("heat_id", heats.map((heat) => heat.id))
    .order("created_at", { ascending: false })
    .returns<HeatResultRow[]>();

  if (error) {
    throw error;
  }

  return rows ?? [];
}

function buildResultRows(heats: HeatRow[], rows: HeatResultRow[]) {
  const winners = new Map(
    rows
      .filter((row) => row.status === "ok" && row.position === 1 && Number(row.score) > 0)
      .map((row) => [row.heat_id, row]),
  );

  return heats.map((heat) => {
    const winner = winners.get(heat.id);
    return {
      heat: heat.title,
      date: formatDateBr(heat.heat_date),
      winner: winner?.driver_name ?? "Resultado incompleto",
      bestLap: winner ? formatTimingValue(winner.official_ms) : "-",
      points: winner ? formatScore(Number(winner.score)) : "-",
      complete: Boolean(winner),
      pdfHref: `/api/campeonatos/legends/pdf/${heat.id}`,
    };
  });
}

function buildClassification(
  heats: HeatRow[],
  standings: StandingRow[],
  results: HeatResultRow[],
  levelByDriver: Map<string, string>,
): P1Classification {
  const orderedHeats = heats.map<P1ClassificationHeat>((heat, index) => ({
    id: heat.id,
    label: `P${String(index + 1).padStart(2, "0")}`,
    title: heat.title,
    date: formatDateBr(heat.heat_date),
    type: isSuperFinalHeatType(heat.type) ? "super-final" : "regular",
  }));
  const heatById = new Map(heats.map((heat) => [heat.id, heat]));
  const resultsByDriver = new Map<string, Map<string, HeatResultRow>>();

  results.forEach((result) => {
    const driverKey = slugifyDriverKey(result.driver_name);
    if (!driverKey) {
      return;
    }

    const byHeat = resultsByDriver.get(driverKey) ?? new Map<string, HeatResultRow>();
    if (!byHeat.has(result.heat_id)) {
      byHeat.set(result.heat_id, result);
    }
    resultsByDriver.set(driverKey, byHeat);
  });

  const rows = standings.map<P1ClassificationRow>((standing) => {
    const driverKey = slugifyDriverKey(standing.driver_name);
    const byHeat = resultsByDriver.get(driverKey) ?? new Map<string, HeatResultRow>();
    const regularResults = [...byHeat.values()]
      .filter((result) => !isSuperFinalHeatType(heatById.get(result.heat_id)?.type) && result.status === "ok" && Number(result.score) > 0)
      .sort((a, b) => comparePublishedResults(a, b, heatById));
    const bestRegularResults = regularResults.slice(0, MAX_VALID_REGULAR_RESULTS);
    const discardedHeatIds = new Set(regularResults.slice(MAX_VALID_REGULAR_RESULTS).map((result) => result.heat_id));
    const cells = Object.fromEntries(orderedHeats.map((heat) => [heat.id, toClassificationCell(byHeat.get(heat.id), discardedHeatIds)]));
    const participationCount = [...byHeat.keys()].filter((heatId) => !isSuperFinalHeatType(heatById.get(heatId)?.type)).length;

    return {
      position: String(standing.position).padStart(2, "0"),
      driver: standing.driver_name,
      level: levelByDriver.get(driverKey) ?? "A definir",
      points: formatScore(Number(standing.total)),
      regularPoints: formatScore(Number(standing.regular_total)),
      superFinalPoints: formatScore(Number(standing.super_final_total)),
      valid: `${standing.valid_regular_results}/10`,
      participationCount,
      discarded: Number(standing.discarded_regular_results),
      wins: Number(standing.wins),
      bestScoreHeatIds: bestRegularResults.map((result) => result.heat_id),
      cells,
    };
  });

  return { heats: orderedHeats, rows };
}

function toClassificationCell(result: HeatResultRow | undefined, discardedHeatIds: Set<string>): P1ClassificationCell {
  if (!result) {
    return { score: null, position: null, officialMs: null, status: "missing" };
  }

  if (result.status !== "ok" || Number(result.score) <= 0) {
    return {
      score: null,
      position: result.position,
      officialMs: result.official_ms,
      status: result.status === "dsq" ? "dsq" : "no-time",
    };
  }

  return {
    score: Number(result.score),
    position: result.position,
    officialMs: result.official_ms,
    status: discardedHeatIds.has(result.heat_id) ? "discarded" : "ok",
  };
}

function comparePublishedResults(a: HeatResultRow, b: HeatResultRow, heatById: Map<string, HeatRow>) {
  return Number(b.score) - Number(a.score)
    || (a.official_ms ?? Number.MAX_SAFE_INTEGER) - (b.official_ms ?? Number.MAX_SAFE_INTEGER)
    || (heatById.get(a.heat_id)?.heat_date ?? "").localeCompare(heatById.get(b.heat_id)?.heat_date ?? "")
    || a.created_at.localeCompare(b.created_at);
}

function formatDateBr(value?: string | null) {
  if (!value) {
    return "";
  }

  const [year, month, day] = value.slice(0, 10).split("-");
  return day && month && year ? `${day}/${month}/${year}` : value;
}
